import { GoogleGenAI } from '@google/genai';

const PROJECT = 'edufy-makerlab';
const DATABASE = 'websitev2';
const DEFAULT_KNOWLEDGE = 'Tu es GoBot, assistant de MakerLab Academy Casablanca. Réponds en français, brièvement et factuellement. Oriente les familles vers les programmes, la page de contact ou un essai gratuit sans inventer de prix ni de disponibilités.';
const requestBuckets = new Map();

async function getKnowledge() {
  try {
    const response = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/${DATABASE}/documents/website-settings/chatbot_knowledge`);
    if (!response.ok) return DEFAULT_KNOWLEDGE;
    const document = await response.json();
    return document.fields?.value?.stringValue || DEFAULT_KNOWLEDGE;
  } catch {
    return DEFAULT_KNOWLEDGE;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const clientId = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
  const now = Date.now();
  const recent = (requestBuckets.get(clientId) || []).filter(time => now - time < 60_000);
  if (recent.length >= 12) return res.status(429).json({ error: 'Too many requests' });
  requestBuckets.set(clientId, [...recent, now]);
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Assistant not configured' });

  const message = String(req.body?.message || '').trim().slice(0, 1200);
  if (!message) return res.status(400).json({ error: 'Message required' });
  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-8) : [];
  const transcript = history.map(item => `${item.role === 'bot' ? 'Assistant' : 'Parent'}: ${String(item.text || '').slice(0, 600)}`).join('\n');

  try {
    const ai = new GoogleGenAI({ apiKey });
    const knowledge = await getKnowledge();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `${knowledge}\n\nConversation récente:\n${transcript}\nParent: ${message}\nAssistant:`,
    });
    return res.status(200).json({ text: response.text || 'Je ne peux pas répondre pour le moment.' });
  } catch (error) {
    console.error('[chat] Gemini error', error?.message || error);
    return res.status(502).json({ error: 'Assistant unavailable' });
  }
}
