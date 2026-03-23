
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, RefreshCcw, Loader2, Sparkles, X, MessageCircle, Mic } from 'lucide-react';
import { startAssistantChat } from '../services/geminiService';
import { GenerateContentResponse } from '@google/genai';
import { useSettings } from '../contexts/SettingsContext';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export const ChatAssistant: React.FC = () => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  const chatbotConfig = settings?.chatbot_config || {
    apiKey: '',
    knowledge: "Tu es 'GoBot', l'assistant super cool de Make & Go Casablanca. Tes ateliers durent 3h et coûtent 400 DHS. Sois enthousiaste et concis !"
  };

  useEffect(() => {
    if (messages.length === 0) {
        setMessages([
            { role: 'bot', text: "Salut ! Je suis GoBot. Comment puis-je t'aider à créer ton prochain projet tech aujourd'hui ?" }
        ]);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current && chatbotConfig.apiKey) {
        try {
            chatSessionRef.current = startAssistantChat(chatbotConfig.knowledge, chatbotConfig.apiKey);
        } catch (e) {
            console.error("Failed to start chat session", e);
        }
    }
  }, [isOpen, chatbotConfig]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    if (!chatbotConfig.apiKey) {
        alert("Le chatbot n'est pas encore configuré (Clé API manquante).");
        return;
    }

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      if (!chatSessionRef.current) {
         chatSessionRef.current = startAssistantChat(chatbotConfig.knowledge, chatbotConfig.apiKey);
      }

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
      setMessages(prev => [...prev, { role: 'bot', text: "Désolé, j'ai un petit souci technique. Réessaie dans un instant ! 🤖" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([{ role: 'bot', text: "C'est reparit ! Comment puis-je t'aider ?" }]);
    if (chatbotConfig.apiKey) {
        chatSessionRef.current = startAssistantChat(chatbotConfig.knowledge, chatbotConfig.apiKey);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000] flex flex-col items-end">
      
      {/* Floating Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[550px] bg-white/95 backdrop-blur-xl border-4 border-black rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          
          {/* Header */}
          <div className="bg-brand-red p-5 border-b-4 border-black flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-brand-orange p-2 rounded-xl border-2 border-black rotate-[-3deg] shadow-neo-sm">
                <Bot size={24} className="text-black" />
              </div>
              <div>
                <h3 className="text-white font-display font-black tracking-wider uppercase text-lg leading-none">GoBot</h3>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                    <span className="text-[10px] text-brand-green font-bold uppercase tracking-widest">En ligne</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={handleReset} className="text-white/70 hover:text-brand-orange transition-colors p-1" title="Reset chat">
                    <RefreshCcw size={18} />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors p-1" title="Fermer">
                    <X size={24} />
                </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-5 space-y-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50/30 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl border-2 border-black font-bold text-sm shadow-neo-sm ${
                    msg.role === 'user' 
                    ? 'bg-brand-blue text-black rounded-tr-none' 
                    : 'bg-white text-black rounded-tl-none border-l-brand-red border-l-4'
                }`}>
                  {msg.text || (isTyping && i === messages.length - 1 ? <div className="flex gap-1 py-1"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div></div> : '')}
                </div>
              </div>
            ))}
            {isTyping && !messages[messages.length-1].text && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-neo-sm">
                   <Loader2 size={20} className="animate-spin text-brand-red" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t-4 border-black">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl border-2 border-black shadow-inner">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Dis moi ce qui te passionne..."
                className="flex-grow p-3 bg-transparent font-bold focus:outline-none text-sm placeholder:text-gray-400"
                />
                <button
                onClick={handleSend}
                disabled={isTyping}
                className="bg-brand-orange p-3 border-2 border-black rounded-xl shadow-neo-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
                >
                <Send size={20} className="text-black" />
                </button>
            </div>
            
            <div className="mt-3 flex items-center justify-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                <Sparkles size={10} className="text-brand-red" />
                <span className="text-[9px] font-black uppercase tracking-widest">Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none ${
            isOpen ? 'bg-red-400' : 'bg-brand-orange'
        }`}
      >
        {isOpen ? <X size={32} strokeWidth={3} /> : <MessageCircle size={32} strokeWidth={3} />}
        
        {/* Notification Badge */}
        {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-brand-green border-2 border-black items-center justify-center text-[10px] font-black">1</span>
            </span>
        )}
      </button>
    </div>
  );
};
