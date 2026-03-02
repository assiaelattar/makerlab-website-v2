
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { Sparkles, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';

interface AiImageProps {
  prompt: string;
  src: string;
  alt: string;
  className?: string;
  showRegenerate?: boolean;
}

export const AiImage: React.FC<AiImageProps> = ({ prompt, src, alt, className = "", showRegenerate = false }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState(false);

  const handleGenerate = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!prompt) return;
    
    setLoading(true);
    setError(false);
    
    try {
      const result = await generateImage(prompt);
      
      if (result) {
        setImgUrl(result);
        setGenerated(true);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative group ${className} overflow-hidden bg-gray-200`}>
      {/* Loading Overlay */}
      {loading && !error && (
        <div className="absolute inset-0 z-20 bg-brand-dark flex flex-col items-center justify-center">
           <div className="relative">
             <div className="absolute inset-0 bg-brand-purple blur-xl opacity-50 animate-blob"></div>
             <Loader2 className="text-brand-yellow animate-spin relative z-10" size={48} />
           </div>
           <span className="mt-4 text-brand-yellow font-display font-bold text-xl tracking-widest animate-pulse">GENERATING...</span>
        </div>
      )}
      
      <img 
        src={imgUrl || src} 
        alt={alt} 
        className={`w-full h-full object-cover transition-all duration-500 ${loading ? 'scale-105 blur-sm' : 'scale-100 blur-0'}`}
        onError={() => setError(true)}
      />

      {/* Manual Regenerate Button - Only show if explicitly requested (e.g. in Admin) */}
      {showRegenerate && !loading && (
        <button
          onClick={handleGenerate}
          className="absolute bottom-3 right-3 z-10 bg-white p-2.5 rounded-full border-2 border-black shadow-neo-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-yellow hover:scale-110 active:scale-95 flex items-center justify-center"
        >
          {error ? <RefreshCw size={20} className="text-red-500"/> : (generated ? <RefreshCw size={20} /> : <Sparkles size={20} />)}
        </button>
      )}

      {/* Status Badges */}
      {generated && (
         <div className="absolute top-2 left-2 bg-black/70 text-brand-yellow text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 backdrop-blur-sm">
           AI ART
         </div>
      )}
      
      {error && !loading && (
        <div className="absolute top-2 right-2 bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-black shadow-sm flex items-center gap-1">
          <AlertTriangle size={10} />
          PREVIEW
        </div>
      )}
    </div>
  );
};
