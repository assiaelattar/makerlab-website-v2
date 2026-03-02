
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, RefreshCcw, Loader2, Sparkles, Zap } from 'lucide-react';
import { startAssistantChat } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Salut ! Je suis l'assistant Make & Go. Dis-moi quel âge tu as et ce qui te passionne (Roblox, Drones, Dessin...) pour que je t'aide à choisir ta mission ! 🚀" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    chatSessionRef.current = startAssistantChat(`
      Tu es "GoBot", l'assistant super cool et dynamique de Make & Go (MakerLab Academy Casablanca).
      Ton but : Aider les jeunes (8-18 ans) et les parents à choisir le meilleur atelier tech de 3h.
      Tes ateliers : 
      - Drones (Pilotage/Tech)
      - Design 3D (Stade Hassan II)
      - Streetwear (Créer sa marque)
      - Coding (FIFA Marocain)
      - Apps Mobiles (Quartier intelligent)
      - CEO (Lancer sa startup)
      - IA (Commentateur de match)
      - IoT (Lampe connectée)
      
      Règles : 
      - Sois enthousiaste, utilise des emojis 🚀🔥✨.
      - Réponse courte et percutante.
      - Pose des questions sur leurs goûts si tu n'es pas sûr.
      - Mentionne que les ateliers durent 3h et coûtent 400 DHS.
      - Langue : Français (avec un petit mot de darija occasionnel si ça fit : 'Daba', 'Zwin', etc).
    `);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const stream = await chatSessionRef.current.sendMessageStream({ message: userMessage });
      let fullText = '';
      
      setMessages(prev => [...prev, { role: 'bot', text: '' }]);

      for await (const chunk of stream) {
        const chunkText = (chunk as GenerateContentResponse).text;
        fullText += chunkText;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullText;
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Oups, mon processeur a eu un petit bug ! Tu peux réessayer ? 🤖" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([{ role: 'bot', text: "C'est reparti ! Dis-moi tout, qu'est-ce qui te branche aujourd'hui ? 🛠️" }]);
    chatSessionRef.current = startAssistantChat("Tu es l'assistant de Make & Go...");
  };

  return (
    <div className="flex flex-col h-[500px] w-full bg-white border-4 border-black rounded-[2rem] shadow-neo-xl overflow-hidden relative">
      {/* Header */}
      <div className="bg-brand-purple p-4 border-b-4 border-black flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-brand-yellow p-1.5 rounded-lg border-2 border-black rotate-[-3deg]">
            <Bot size={20} className="text-black" />
          </div>
          <span className="text-white font-display font-bold tracking-wider uppercase text-sm">Assistant GoBot</span>
        </div>
        <button onClick={handleReset} className="text-white hover:text-brand-yellow transition-colors" title="Reset chat">
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
            <div className={`max-w-[85%] p-4 rounded-2xl border-2 border-black font-bold text-sm shadow-neo-sm ${
              msg.role === 'user' ? 'bg-brand-cyan text-black' : 'bg-white text-black'
            }`}>
              {msg.text || (isTyping && i === messages.length - 1 ? <Loader2 size={16} className="animate-spin" /> : '')}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl border-2 border-black shadow-neo-sm flex gap-1">
               <span className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-bounce delay-100"></span>
               <span className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-bounce delay-200"></span>
             </div>
           </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t-4 border-black flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Pose ta question..."
          className="flex-grow p-3 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 ring-brand-purple/20 shadow-inner text-sm"
        />
        <button 
          onClick={handleSend}
          disabled={isTyping}
          className="bg-brand-yellow p-3 border-2 border-black rounded-xl shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
        >
          <Send size={20} className="text-black" />
        </button>
      </div>

      {/* Bottom Label */}
      <div className="bg-brand-dark py-1 text-center">
        <span className="text-[10px] text-white font-bold tracking-widest uppercase flex items-center justify-center gap-1">
          <Sparkles size={10} className="text-brand-yellow" /> Powered by Gemini AI <Sparkles size={10} className="text-brand-yellow" />
        </span>
      </div>
    </div>
  );
};
