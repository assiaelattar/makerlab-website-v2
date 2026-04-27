import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, Trophy, Star, Calendar, ChevronDown } from 'lucide-react';
import { Program, Mission } from '../types';
import { AiImage } from './AiImage';

interface Props {
  program: Program | Mission;
  index?: number;
}

const DEFAULT_MISSION_IMG = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800';

export const ProgramCard: React.FC<Props> = ({ program, index = 0 }) => {
  const colors = [
    { bg: 'bg-brand-red',    text: 'text-white', subtext: 'text-gray-200', badge: 'bg-black text-white',  hex: '#c0272d' },
    { bg: 'bg-brand-blue',   text: 'text-white', subtext: 'text-gray-200', badge: 'bg-white text-black',  hex: '#2563a8' },
    { bg: 'bg-brand-orange', text: 'text-black', subtext: 'text-gray-800', badge: 'bg-black text-white',  hex: '#e87722' },
    { bg: 'bg-brand-green',  text: 'text-white', subtext: 'text-gray-200', badge: 'bg-white text-black',  hex: '#27a060' },
    { bg: 'bg-brand-red',    text: 'text-white', subtext: 'text-gray-200', badge: 'bg-white text-black',  hex: '#c0272d' },
  ];

  const theme = colors[index % colors.length];
  const navigate = useNavigate();
  const [transform, setTransform]   = useState('');
  const [isHovered, setIsHovered]   = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── helpers ──────────────────────────────────────────────────────────────
  const title  = ('title' in program) ? program.title : (program as any).name;
  const imgSrc = ('coverImage' in program && program.coverImage)
    ? program.coverImage
    : (('image' in program && (program as any).image) ? (program as any).image : DEFAULT_MISSION_IMG);
  const xp       = ('stats' in program && program.stats?.[0]?.value) || 300;
  const isMission = 'date' in program;
  const detailPath = isMission ? `/programs/kids-2?missionId=${program.id}` : `/programs/${program.id}`;
  const trialAvailable = !isMission && (program as Program).trialAvailable;

  const handleReserve = () => {
    if (!isMission && (program as Program).bookingType === 'external' && (program as Program).externalBookingUrl) {
      window.open((program as Program).externalBookingUrl, '_blank');
      return;
    }
    navigate(isMission ? `/booking/kids-2?missionId=${program.id}` : `/booking/${program.id}`);
  };

  // desktop 3‑D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -8;
    const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  8;
    setTransform(`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02,1.02,1.02)`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { setTransform(''); setIsHovered(false); }}
      onMouseEnter={() => setIsHovered(true)}
      style={{ transform: isHovered ? transform : '', transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out' }}
      className="bg-white rounded-2xl border-4 border-black shadow-neo overflow-hidden flex flex-col group hover:shadow-neo-xl relative z-10 hover:z-20"
    >

      {/* ══════════════════════════════════════════════
          MOBILE — compact collapsed row
      ══════════════════════════════════════════════ */}
      <div className="md:hidden flex items-stretch min-h-[76px]">
        {/* Colored thumbnail */}
        <div className={`w-[88px] shrink-0 ${theme.bg} relative overflow-hidden border-r-2 border-black`}>
          <img src={imgSrc} alt={title} className="w-full h-full object-cover opacity-60 mix-blend-multiply" />
          {/* XP pill */}
          <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[7px] font-black px-1.5 py-0.5 flex items-center gap-0.5">
            <Star size={7} className="fill-brand-orange text-brand-orange" /> +{xp}
          </div>
        </div>

        {/* Text info */}
        <div className="flex-1 px-3 py-2 min-w-0 flex flex-col justify-center">
          <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-0.5 truncate">{program.category}</span>
          <h3 className="font-black text-sm leading-tight line-clamp-1 uppercase tracking-tight mb-1.5">{title}</h3>
          <div className="flex items-center gap-2.5">
            <span className="font-black text-sm" style={{ color: theme.hex }}>{program.price}</span>
            <span className="text-[9px] text-gray-400 flex items-center gap-0.5"><Clock size={8} strokeWidth={3} /> {program.duration}</span>
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsExpanded(v => !v); }}
          className={`shrink-0 w-11 flex items-center justify-center border-l-2 border-black ${theme.bg} ${theme.text} active:opacity-80`}
        >
          <ChevronDown size={18} strokeWidth={3} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE — expanded details (in-place)
      ══════════════════════════════════════════════ */}
      {isExpanded && (
        <div className={`md:hidden border-t-4 border-black ${theme.bg} ${theme.text}`}>
          {/* Mini image */}
          <div className="h-[120px] overflow-hidden border-b-2 border-black/30 relative">
            <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 bg-white text-black border-2 border-black text-[8px] font-black uppercase px-2 py-0.5">{program.category}</div>
          </div>

          <div className="p-3 flex flex-col gap-2.5">
            <p className={`text-xs ${theme.subtext} line-clamp-2 border-l-2 ${theme.text === 'text-white' ? 'border-white/40' : 'border-black/40'} pl-2`}>
              {program.description}
            </p>

            {/* Outcome */}
            <div className={`p-2 border-2 flex items-center gap-2 ${theme.text === 'text-white' ? 'bg-white/10 border-white/30' : 'bg-white/40 border-black'}`}>
              <div className={`${theme.badge} p-1.5 border-2 border-black shrink-0`}><Trophy size={12} strokeWidth={3} /></div>
              <div>
                <p className="text-[8px] font-black uppercase opacity-60">{isMission ? 'Thématique' : 'Tu repars avec'} :</p>
                <p className="text-[10px] font-black uppercase">{isMission ? (program as any).title : ((program as Program).benefits || 'Compétences + Certif')}</p>
              </div>
            </div>

            {/* Schedule */}
            {!isMission && (program as Program).schedule?.[0] && (
              <div className="text-[9px] font-black flex items-center gap-1.5 uppercase tracking-widest opacity-80">
                <Calendar size={10} strokeWidth={3} /> Prochain : {(program as Program).schedule![0]}
              </div>
            )}

            {/* Price + Duration row */}
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-1.5 px-3 py-1.5 border-2 font-black text-[10px] uppercase ${theme.text === 'text-white' ? 'bg-white/20 border-white/30' : 'bg-white border-black'}`}>
                <Clock size={10} strokeWidth={3} /> {program.duration}
              </span>
              <span className="font-black bg-white text-black px-3 py-1.5 border-2 border-black -rotate-1 shadow-[3px_3px_0_rgba(0,0,0,1)] text-sm">
                {program.price}
              </span>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-2">
              <Link to={detailPath} className="flex-1">
                <button className="w-full bg-white text-black p-2 border-2 border-black font-black text-[9px] uppercase tracking-wider">Détails</button>
              </Link>
              {trialAvailable && (
                <Link to={`/booking/${program.id}?type=trial`} className="flex-1">
                  <button className="w-full bg-brand-blue text-white p-2 border-2 border-black font-black text-[9px] uppercase tracking-wider">Essai Offert</button>
                </Link>
              )}
            </div>
            <button
              onClick={handleReserve}
              className={`w-full ${theme.badge} p-3 border-2 border-black font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-[3px_3px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all`}
            >
              Réserver <ArrowRight size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          DESKTOP — full card (existing layout)
      ══════════════════════════════════════════════ */}
      <div className={`hidden md:flex flex-col flex-grow ${theme.bg} ${theme.text}`}>

        {/* Trending badge */}
        {!isMission && (program.title?.toLowerCase().includes('camp') || program.title?.toLowerCase().includes('drone') || program.category?.toLowerCase().includes('vacances')) && (
          <div className="absolute top-4 left-4 z-30 bg-brand-orange text-black border-2 border-black px-3 py-1 font-black text-[10px] uppercase tracking-widest shadow-neo-sm -rotate-6 animate-bounce">🔥 Populaire</div>
        )}
        {isMission && (
          <div className="absolute top-4 left-4 z-30 bg-black text-white border-2 border-white px-3 py-1 font-black text-[10px] uppercase tracking-widest shadow-neo-sm rotate-3">🚀 Session Unique</div>
        )}

        {/* Image */}
        <div className="h-64 overflow-hidden border-b-4 border-black relative bg-gray-100">
          <AiImage
            src={imgSrc}
            prompt={'imagePrompt' in program ? program.imagePrompt || '' : ''}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-4 right-4 bg-white px-4 py-1.5 border-2 border-black rounded-lg font-bold text-sm shadow-neo-sm z-10 uppercase tracking-wider group-hover:rotate-3 transition-transform text-black flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />{program.category}
          </div>
          {!isMission && program.tags && program.tags.length > 0 && (
            <div className="absolute top-16 right-4 flex flex-col items-end gap-2 z-10 pointer-events-none">
              {program.tags.map((tag, i) => (
                <span key={i} className="bg-black text-white px-2 py-1 border border-white text-[10px] font-black uppercase tracking-tighter shadow-neo-sm transform translate-x-2 group-hover:translate-x-0 transition-transform duration-300" style={{ transitionDelay: `${i * 50}ms` }}>#{tag}</span>
              ))}
            </div>
          )}
          <div className="absolute bottom-0 left-0 bg-black text-white px-4 py-2 rounded-tr-xl font-bold text-sm flex items-center gap-2 border-t-2 border-r-2 border-white/20">
            <Star size={14} strokeWidth={3} className="text-brand-orange fill-brand-orange" /> XP: +{xp}
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-white text-black border-2 border-black px-5 py-2.5 rounded-xl font-bold translate-y-8 group-hover:translate-y-0 transition-transform duration-300 shadow-neo flex items-center gap-2 text-sm uppercase tracking-widest">
              <ArrowRight size={16} strokeWidth={3} /> Voir détails
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 flex flex-col flex-grow">
          <h3 className="font-display font-black text-2xl md:text-3xl mb-3 leading-tight line-clamp-2 uppercase tracking-wide">{title}</h3>
          <p className={`${theme.subtext} mb-6 flex-grow text-base font-bold leading-relaxed border-l-4 ${theme.text === 'text-white' ? 'border-white' : 'border-black'} pl-4 line-clamp-3 opacity-90`}>{program.description}</p>

          {!isMission && (program as Program).schedule?.[0] && (
            <div className="mb-4 text-xs font-black flex items-center gap-2 uppercase tracking-widest">
              <Calendar size={16} strokeWidth={3} /><span>Prochain: {(program as Program).schedule![0]}</span>
            </div>
          )}

          <div className={`mb-6 p-3 rounded-none border-4 flex items-center gap-3 ${theme.text === 'text-white' ? 'bg-white/10 border-white' : 'bg-white/40 border-black'}`}>
            <div className={`${theme.badge} p-2 rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0`}><Trophy size={20} strokeWidth={3} /></div>
            <div className="flex flex-col overflow-hidden text-black">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{isMission ? 'Thématique :' : 'Tu repars avec :'}</span>
              <span className="text-xs md:text-sm font-black truncate uppercase">{isMission ? (program as any).title : ((program as Program).benefits || 'Compétences + Certif')}</span>
            </div>
          </div>

          <div className={`flex items-center justify-between text-base font-black mb-6 uppercase tracking-wider`}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-none border-4 ${theme.text === 'text-white' ? 'bg-white/20 border-white' : 'bg-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
              <Clock size={16} strokeWidth={3} />{program.duration}
            </div>
            <div className="font-display font-black text-xl md:text-2xl text-black bg-white px-4 py-2 transform -rotate-2 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">{program.price}</div>
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex gap-2">
              <Link to={detailPath} className="flex-1">
                <button className="w-full bg-white text-black p-3 rounded-none border-4 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-1 hover:bg-gray-100 transition-all">Détails</button>
              </Link>
              {trialAvailable && (
                <Link to={`/booking/${program.id}?type=trial`} className="flex-1">
                  <button className="w-full bg-brand-blue text-black p-3 rounded-none border-4 border-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-1 hover:translate-x-0.5 hover:translate-y-0.5 transition-all shadow-neo-sm">Essai Offert</button>
                </Link>
              )}
            </div>
            <button onClick={handleReserve} className={`w-full ${theme.badge} p-4 rounded-none border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2 font-black uppercase tracking-widest`}>
              Réserver <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
