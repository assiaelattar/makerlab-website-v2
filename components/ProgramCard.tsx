
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Trophy, Zap, Star, Calendar } from 'lucide-react';
import { Program } from '../types';
import { AiImage } from './AiImage';

interface Props {
  program: Program;
  index?: number;
}

export const ProgramCard: React.FC<Props> = ({ program, index = 0 }) => {
  // Brand colors cycle
  const colors = [
    { bg: 'bg-brand-yellow', text: 'text-black', subtext: 'text-gray-900', border: 'border-black', badge: 'bg-black text-white' },
    { bg: 'bg-brand-cyan', text: 'text-black', subtext: 'text-gray-900', border: 'border-black', badge: 'bg-black text-white' },
    { bg: 'bg-brand-pink', text: 'text-white', subtext: 'text-white', border: 'border-black', badge: 'bg-white text-black' },
    { bg: 'bg-brand-green', text: 'text-black', subtext: 'text-gray-900', border: 'border-black', badge: 'bg-black text-white' },
    { bg: 'bg-brand-purple', text: 'text-white', subtext: 'text-white', border: 'border-black', badge: 'bg-white text-black' },
  ];

  const theme = colors[index % colors.length];

  return (
    <div className={`${theme.bg} ${theme.text} rounded-2xl border-4 border-black shadow-neo overflow-hidden flex flex-col h-full group hover:shadow-neo-xl hover:-translate-y-2 hover:rotate-1 transition-all duration-300 relative`}>

      {/* Image Header */}
      <div className="h-64 overflow-hidden border-b-4 border-black relative bg-gray-100">
        <AiImage
          src={program.image}
          prompt={program.imagePrompt || ''}
          alt={program.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Floating Category Badge */}
        <div className="absolute top-4 right-4 bg-white px-4 py-1.5 border-2 border-black rounded-lg font-bold text-xs md:text-sm shadow-neo-sm z-10 uppercase tracking-wider transform group-hover:rotate-3 transition-transform text-black">
          {program.category}
        </div>

        {/* Level/XP Badge */}
        <div className="absolute bottom-0 left-0 bg-black text-white px-4 py-2 rounded-tr-xl font-bold text-xs md:text-sm flex items-center gap-2 border-t-2 border-r-2 border-white/20">
          <Star size={14} strokeWidth={3} className="text-brand-yellow fill-brand-yellow" />
          <span>XP: +300</span>
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
          <span className="bg-brand-yellow text-black border-2 border-black px-6 py-3 rounded-xl font-bold transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 shadow-neo flex items-center gap-2">
            <Zap size={20} className="fill-black" strokeWidth={3} />
            Lancer la mission
          </span>
        </div>
      </div>

      {/* Body Area */}
      <div className="p-5 md:p-6 flex flex-col flex-grow relative">
        <h3 className={`font-display font-black text-2xl md:text-3xl mb-3 leading-tight transition-colors line-clamp-2 uppercase tracking-wide`}>
          {program.title}
        </h3>
        <p className={`${theme.subtext} mb-6 flex-grow text-base font-bold leading-relaxed border-l-4 ${theme.text === 'text-white' ? 'border-white' : 'border-black'} pl-4 line-clamp-3 opacity-90`}>
          {program.description}
        </p>

        {/* Schedule Preview */}
        {program.schedule && program.schedule.length > 0 && (
          <div className={`mb-4 text-xs font-black flex items-center gap-2 uppercase tracking-widest`}>
            <Calendar size={16} strokeWidth={3} />
            <span>Prochain: {program.schedule[0]}</span>
          </div>
        )}

        {/* Outcome Badge */}
        <div className={`mb-6 p-3 rounded-none border-4 flex items-center gap-3 ${theme.text === 'text-white' ? 'bg-white/10 border-white' : 'bg-white/40 border-black'}`}>
          <div className={`${theme.badge} p-2 rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0`}>
            <Trophy size={20} strokeWidth={3} />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest opacity-80`}>Tu repars avec :</span>
            <span className="text-xs md:text-sm font-black truncate uppercase">1 Projet Complet + Certif</span>
          </div>
        </div>

        {/* Specs Row */}
        <div className={`flex items-center justify-between text-base font-black mb-6 uppercase tracking-wider`}>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-none border-4 ${theme.text === 'text-white' ? 'bg-white/20 border-white' : 'bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
            <Clock size={16} strokeWidth={3} />
            {program.duration}
          </div>
          <div className="font-display font-black text-xl md:text-2xl text-black bg-white px-4 py-2 transform -rotate-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            {program.price}
          </div>
        </div>

        {/* Footer Button */}
        <div className="mt-auto">
          <Link to={`/programs/${program.id}`}>
            <button className={`w-full ${theme.badge} p-4 rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 font-black uppercase tracking-widest hover:shadow-none hover:translate-x-1 hover:translate-y-1`}>
              Voir les détails <ArrowRight size={20} strokeWidth={3} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
