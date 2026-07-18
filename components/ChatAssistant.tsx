
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, RefreshCcw, Loader2, Sparkles, X, MessageCircle, Mic } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useLocation } from 'react-router-dom';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export const ChatAssistant: React.FC = () => {
  const { settings } = useSettings();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isQuietRoute = pathname === '/' || pathname.startsWith('/programs') || pathname.startsWith('/booking/');
  const hasMobileBookingDock = /^\/programs\/[^/]+/.test(pathname) || pathname.startsWith('/booking/');

  const chatbotKnowledge = settings?.chatbot_knowledge || "Tu es GoBot, l’assistant de MakerLab Academy Casablanca. Aide les familles à choisir un programme avec des réponses courtes, claires et factuelles.";

  useEffect(() => {
    if (messages.length === 0) {
        setMessages([
            { role: 'bot', text: "Salut ! Je suis GoBot. Comment puis-je t'aider à créer ton prochain projet tech aujourd'hui ?" }
        ]);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (isQuietRoute) return null;

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages.slice(-8), knowledgeVersion: chatbotKnowledge.length }),
      });
      if (!response.ok) throw new Error('Assistant unavailable');
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text || "Je n’ai pas pu préparer une réponse." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: "Désolé, j'ai un petit souci technique. Réessaie dans un instant ! 🤖" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReset = () => {
    setMessages([{ role: 'bot', text: "C'est reparit ! Comment puis-je t'aider ?" }]);
  };

  return (
    <div className={`fixed right-4 z-[1000] flex-col items-end md:bottom-6 md:right-6 ${hasMobileBookingDock ? 'bottom-24 hidden md:flex' : 'bottom-5 flex'}`}>
      
      {/* Floating Window */}
      {isOpen && (
        <div className="ml-card mb-4 flex max-h-[68vh] w-[calc(100vw-2rem)] flex-col overflow-hidden bg-white/95 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-6 duration-300 md:h-[550px] md:w-[400px]">
          
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-brand-blue p-4 md:p-5">
            <div className="flex items-center gap-3">
              <div className="ml-icon h-10 w-10 bg-brand-orange text-white">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-white font-display font-black tracking-wider uppercase text-base md:text-lg leading-none">GoBot</h3>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">En ligne</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={handleReset} className="p-1.5 text-white/70 transition-colors hover:text-brand-orange" aria-label="Recommencer la conversation">
                    <RefreshCcw size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 text-white/70 transition-colors hover:text-white" aria-label="Fermer la conversation">
                    <X size={20} />
                </button>
            </div>
          </div>

          {/* Messages */}
          <div className="custom-scrollbar flex-grow space-y-4 overflow-y-auto bg-[#f7f8fa] p-4 md:space-y-5 md:p-5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl border p-3 text-sm font-bold shadow-sm md:p-4 ${
                    msg.role === 'user' 
                    ? 'rounded-tr-sm border-brand-blue bg-brand-blue text-white'
                    : 'rounded-tl-sm border-slate-200 bg-white text-slate-800'
                }`}>
                  {msg.text || (isTyping && i === messages.length - 1 ? <div className="flex gap-1 py-1"><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div><div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div></div> : '')}
                </div>
              </div>
            ))}
            {isTyping && !messages[messages.length-1].text && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                   <Loader2 size={20} className="animate-spin text-brand-blue" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-slate-200 bg-white p-3 md:p-4">
            <div className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-100 p-1">
                <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Dis moi ce qui te passionne..."
                className="flex-grow p-2.5 md:p-3 bg-transparent font-bold focus:outline-none text-sm placeholder:text-gray-400"
                />
                <button
                onClick={handleSend}
                disabled={isTyping}
                aria-label="Envoyer le message"
                className="ml-icon h-11 w-11 bg-brand-orange text-white shadow-sm disabled:opacity-50"
                >
                <Send size={18} />
                </button>
            </div>
            
            <div className="mt-2 flex items-center justify-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
                <Sparkles size={10} className="text-brand-red" />
                <span className="text-[9px] font-black uppercase tracking-widest">Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Fermer l’assistant MakerLab' : 'Ouvrir l’assistant MakerLab'}
        className={`relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-white shadow-xl transition-all hover:-translate-y-1 md:h-16 md:w-16 ${
            isOpen ? 'bg-brand-red' : 'bg-brand-orange'
        }`}
      >
        {isOpen ? <X size={28} strokeWidth={3} /> : <MessageCircle size={28} strokeWidth={3} />}
        
        {/* Notification Badge */}
        {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-brand-green text-[10px] font-black text-white">1</span>
            </span>
        )}
      </button>
    </div>
  );
};
