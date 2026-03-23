
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { API_URL } from "../config";

// Dynamic AI instance
let ai: GoogleGenAI | null = null;
let currentApiKey = '';

// Cache for the chat session
let activeChat: Chat | null = null;

export const startAssistantChat = (systemInstruction: string, apiKey?: string): Chat => {
  const useKey = apiKey || currentApiKey;
  
  if (!ai || useKey !== currentApiKey) {
    if (useKey) {
        currentApiKey = useKey;
        ai = new GoogleGenAI({ apiKey: currentApiKey });
    }
  }

  if (!ai) {
    throw new Error("Clé API Gemini non configurée.");
  }

  activeChat = ai.chats.create({
    model: 'gemini-2.0-flash', // Updated to a more stable version
    config: {
      systemInstruction,
    },
  });
  return activeChat;
};

export const sendChatMessage = async (message: string) => {
  if (!activeChat) {
    startAssistantChat("Tu es l'assistant de Make & Go, expert en tech pour enfants.");
  }
  
  try {
    const result = await activeChat!.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};

export const getCourseRecommendation = async (childAge: string, interests: string): Promise<string> => {
  try {
      const res = await fetch(`${API_URL}/ai/recommend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ age: childAge, interests })
      });
      if (res.ok) {
          const data = await res.json();
          return data.text;
      }
  } catch (e) {
      console.log("Backend AI unavailable, trying direct...");
  }

  try {
    const prompt = `
      Tu es un conseiller pédagogique énergique pour 'Make & Go' par MakerLab Academy.
      Parent/Etudiant demande une reco. Age: ${childAge}, Intérêts: ${interests}.
      Nos ateliers: Drones, 3D, Design, Jeux Vidéo, Apps, IA, Business, Print on Demand.
      Recommande UN atelier. Réponse courte fun emoji français.
    `;

    if (!ai) return "Veuillez configurer la clé API Gemini.";

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return response.text || "Erreur de recommandation.";
  } catch (error: any) {
    console.error("Gemini Direct Error:", error);
    return "Oups ! Notre robot IA fait une sieste (Vérifiez la clé API).";
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
    try {
        const res = await fetch(`${API_URL}/ai/generate-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        if (res.ok) {
            const data = await res.json();
            return data.imageUrl;
        }
    } catch (e) {
        console.log("Backend AI unavailable, trying direct...");
    }

  if (!ai) return null;

  const styleGuide = " . Art Style: Neo-brutalist pop-art poster style. Vibrant yellow background with comic-book halftone dot pattern. 3D geometric shapes in purple and cyan. High energy, vector illustration, bold black outlines, flat shading, fun and educational tech vibe. Moroccan touch implies subtle geometric patterns if applicable.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: {
        parts: [{ text: prompt + styleGuide }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error: any) {
    console.warn("Gemini Image Gen Error:", error.message || error);
    return null;
  }
};
