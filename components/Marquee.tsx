import React from 'react';

export const Marquee: React.FC = () => {
  return (
    <div className="bg-brand-red text-white py-2 border-b-4 border-black overflow-hidden relative z-[60] h-10 flex items-center">
      <div className="animate-marquee whitespace-nowrap flex gap-12 font-display font-bold text-sm md:text-base uppercase tracking-wider items-center">
        <span className="flex items-center gap-2">🚀 Make & Go : 3 Heures pour créer</span>
        <span className="text-brand-orange text-xl">•</span>
        <span className="flex items-center gap-2">🔥 Places limitées ce week-end</span>
        <span className="text-brand-orange text-xl">•</span>
        <span className="flex items-center gap-2">✨ Nouveau : Atelier Intelligence Artificielle</span>
        <span className="text-brand-orange text-xl">•</span>
        <span className="flex items-center gap-2">🏆 Prépare ton projet pour 2025</span>
        <span className="text-brand-orange text-xl">•</span>
        {/* Duplicate for seamless loop */}
        <span className="flex items-center gap-2">🚀 Make & Go : 3 Heures pour créer</span>
        <span className="text-brand-orange text-xl">•</span>
        <span className="flex items-center gap-2">🔥 Places limitées ce week-end</span>
        <span className="text-brand-orange text-xl">•</span>
        <span className="flex items-center gap-2">✨ Nouveau : Atelier Intelligence Artificielle</span>
        <span className="text-brand-orange text-xl">•</span>
        <span className="flex items-center gap-2">🏆 Prépare ton projet pour 2025</span>
      </div>
    </div>
  );
};