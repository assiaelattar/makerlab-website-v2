import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Trophy, Star, Calendar } from 'lucide-react';
import { Program, Mission } from '../types';
import { AiImage } from './AiImage';

interface Props {
  program: Program | Mission;
  index?: number;
}

const DEFAULT_MISSION_IMG = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800';

export const ProgramCard: React.FC<Props> = ({ program, index = 0 }) => {
  // Brand colors cycle
  const colors = [
    { bg: 'bg-brand-red', text: 'text-white', subtext: 'text-gray-200', border: 'border-black', badge: 'bg-black text-white' },
    { bg: 'bg-brand-blue', text: 'text-white', subtext: 'text-gray-200', border: 'border-black', badge: 'bg-white text-black' },
    { bg: 'bg-brand-orange', text: 'text-black', subtext: 'text-gray-800', border: 'border-black', badge: 'bg-black text-white' },
    { bg: 'bg-brand-green', text: 'text-white', subtext: 'text-gray-200', border: 'border-black', badge: 'bg-white text-black' },
    { bg: 'bg-brand-red', text: 'text-white', subtext: 'text-gray-200', border: 'border-black', badge: 'bg-white text-black' },
  ];

  const theme = colors[index % colors.length];

  const navigate = useNavigate();
  const [transform, setTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('');
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transform: isHovered ? transform : '',
        transition: isHovered ? 'transform 0.1s ease-out, box-shadow 0.3s' : 'transform 0.5s ease-out, box-shadow 0.3s'
      }}
      className={`${theme.bg} ${theme.text} rounded-2xl border-4 border-black shadow-neo overflow-hidden flex flex-col h-full group hover:shadow-neo-xl relative z-10 hover:z-20`}
    >

      {/* 🧩 Context Badge — "Make & Go" Theme Indicator */}
      {('date' in program) && (
        <div className="absolute top-4 left-4 z-30 bg-black text-white border-2 border-white px-3 py-1 font-black text-[10px] uppercase tracking-widest shadow-neo-sm rotate-3">
          🚀 Session Unique
        </div>
      )}

      {/* 🚀 Trending Badge (Based on GSC Search Intent) */}
      {!('date' in program) && (program.title.toLowerCase().includes('camp') || 
        program.title.toLowerCase().includes('drone') || 
        program.category?.toLowerCase().includes('vacances')) && (
        <div className="absolute top-4 left-4 z-30 bg-brand-orange text-black border-2 border-black px-3 py-1 font-black text-[10px] uppercase tracking-widest shadow-neo-sm -rotate-6 animate-bounce">
          🔥 Populaire
        </div>
      )}

      {/* Image Header */}
      <div className="h-64 overflow-hidden border-b-4 border-black relative bg-gray-100">
        <AiImage
          src={('coverImage' in program && program.coverImage) ? program.coverImage : (('image' in program && program.image) ? (program as any).image : DEFAULT_MISSION_IMG)}
          prompt={'imagePrompt' in program ? program.imagePrompt || '' : ''}
          alt={('title' in program) ? program.title : (program as any).name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Floating Category Badge (Audience) */}
        <div className="absolute top-4 right-4 bg-white px-4 py-1.5 border-2 border-black rounded-lg font-bold text-xs md:text-sm shadow-neo-sm z-10 uppercase tracking-wider transform group-hover:rotate-3 transition-transform text-black flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
            {program.category}
        </div>

        {/* Tags / Themes - Individual mini badges */}
        {!('date' in program) && program.tags && program.tags.length > 0 && (
          <div className="absolute top-16 right-4 flex flex-col items-end gap-2 z-10 pointer-events-none">
            {program.tags.map((tag, i) => (
              <span key={i} className="bg-black text-white px-2 py-1 border border-white text-[10px] font-black uppercase tracking-tighter shadow-neo-sm transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Level/XP Badge */}
        <div className="absolute bottom-0 left-0 bg-black text-white px-4 py-2 rounded-tr-xl font-bold text-xs md:text-sm flex items-center gap-2 border-t-2 border-r-2 border-white/20">
          <Star size={14} strokeWidth={3} className="text-brand-orange fill-brand-orange" />
          <span>XP: +{('stats' in program && program.stats?.[0]?.value) || 300}</span>
        </div>

        {/* Overlay on hover — shows arrow to detail page */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
          <span className="bg-white text-black border-2 border-black px-5 py-2.5 rounded-xl font-bold transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 shadow-neo flex items-center gap-2 text-sm uppercase tracking-widest">
            <ArrowRight size={16} strokeWidth={3} /> Voir détails
          </span>
        </div>
      </div>

      {/* Body Area */}
      <div className="p-5 md:p-6 flex flex-col flex-grow relative">
        <h3 className={`font-display font-black text-2xl md:text-3xl mb-3 leading-tight transition-colors line-clamp-2 uppercase tracking-wide`}>
          {('title' in program) ? program.title : (program as any).name}
        </h3>
        <p className={`${theme.subtext} mb-6 flex-grow text-base font-bold leading-relaxed border-l-4 ${theme.text === 'text-white' ? 'border-white' : 'border-black'} pl-4 line-clamp-3 opacity-90`}>
          {program.description}
        </p>

        {/* Schedule Preview */}
        {('schedule' in program && program.schedule && program.schedule.length > 0) && (
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
          <div className="flex flex-col overflow-hidden text-black">
            <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest opacity-80`}>
              {('date' in program) ? 'Thématique :' : 'Tu repars avec :'}
            </span>
            <span className="text-xs md:text-sm font-black truncate uppercase">
              {('date' in program) ? (program as any).title : (program.benefits || 'Compétences + Certif')}
            </span>
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

        {/* Footer Buttons */}
        <div className="mt-auto space-y-3">
          <div className="flex gap-2">
            <Link to={('date' in program) ? `/programs/kids-2?missionId=${program.id}` : `/programs/${program.id}`} className="flex-1">
              <button className={`w-full bg-white text-black p-3 rounded-none border-4 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-1 hover:bg-gray-100 transition-all`}>
                Détails
              </button>
            </Link>
            
            {('trialAvailable' in program && program.trialAvailable) && (
              <Link to={`/booking/${program.id}?type=trial`} className="flex-1">
                <button className={`w-full bg-brand-blue text-black p-3 rounded-none border-4 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-1 hover:translate-x-0.5 hover:translate-y-0.5 transition-all shadow-neo-sm`}>
                   Essai Offert
                </button>
              </Link>
            )}
          </div>

          <button 
            onClick={() => {
              let path = '';
              if (!('date' in program) && (program as Program).bookingType === 'external' && (program as Program).externalBookingUrl) {
                window.open((program as Program).externalBookingUrl, '_blank');
                return;
              } else if ('date' in program) {
                path = `/booking/kids-2?missionId=${program.id}`;
              } else {
                path = `/booking/${program.id}`;
              }
              navigate(path);
            }}
            className={`w-full ${theme.badge} p-4 rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 font-black uppercase tracking-widest`}
          >
            Réserver <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};
