import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { usePrograms } from '../contexts/ProgramContext';
import { useMissions } from '../contexts/MissionContext';
import { LandingLead, Mission, Track, MissionBox, Funnel, MarketingFramework, StationPole } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Zap, Clock, Cpu, Code2, ChevronDown, CheckCircle2,
  X, Rocket, Shield, Star, ArrowRight, AlertTriangle, Phone, Sparkles,
  Quote, ChevronLeft, ChevronRight, MessageCircle, Target, Calendar, Users,
  ArrowDownCircle, HelpCircle, Gamepad2, PenTool, Lightbulb, TrendingUp,
  Globe, Briefcase, Video
} from 'lucide-react';
import { MakeAndGoForm } from '../components/MakeAndGoForm';

/* ─── Icons Helper ────────────────────────────────────────────────────────── */
const StationIcon: React.FC<{ name?: string; size?: number; className?: string }> = ({ name, size = 24, className }) => {
  switch (name) {
    case 'Cpu': return <Cpu size={size} className={className} />;
    case 'Code2': return <Code2 size={size} className={className} />;
    case 'Zap': return <Zap size={size} className={className} />;
    case 'PenTool': return <PenTool size={size} className={className} />;
    case 'Video': return <Video size={size} className={className} />;
    case 'Globe': return <Globe size={size} className={className} />;
    case 'Rocket': return <Rocket size={size} className={className} />;
    case 'Briefcase': return <Briefcase size={size} className={className} />;
    default: return <Zap size={size} className={className} />;
  }
};

/* ─── CSS -------------------------------------------------------------------- */
const STYLES = `
  @keyframes modalSlideUp {
    from { opacity:0; transform:translateY(40px) scale(.95); }
    to   { opacity:1; transform:translateY(0)   scale(1); }
  }
  @keyframes pulse-cta {
    0%,100%{ box-shadow:0 0 0 0 var(--theme-pulse),8px 8px 0 0 #000; }
    50%    { box-shadow:0 0 0 20px rgba(0,0,0,0),8px 8px 0 0 #000; }
  }
  .cta-pulse{ animation:pulse-cta 2s infinite; }
  @keyframes float-y{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
  .float-y{ animation:float-y 3s ease-in-out infinite; }
  @keyframes count-in{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}
  .count-in{ animation:count-in .5s ease forwards; }
  @keyframes reveal-up{from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:none;}}
  .reveal{ opacity:0; }
  .revealed{ animation:reveal-up .8s cubic-bezier(.22,1,.36,1) forwards; }
  @keyframes shimmer {0%{background-position:-200% 0;}100%{background-position:200% 0;}}
  .shimmer-text{
    background: var(--theme-shimmer);
    background-size:200% auto;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:shimmer 5s linear infinite;
  }
  .wa-btn{ animation:wa-bounce 2.5s ease-in-out infinite; }
  .noise-bg::before{
    content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
    opacity:.1;
  }
  .timeline-line {
    position: absolute;
    left: 20px;
    top: 40px;
    bottom: 40px;
    width: 6px;
    background: linear-gradient(to bottom, var(--theme-primary), transparent);
  }
  @media (min-width: 768px) {
    .timeline-line { left: 50%; transform: translateX(-50%); }
  }
  @keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
  .ticker-inner{ display:flex; animation:ticker 25s linear infinite; white-space:nowrap; }
  .card-neobrutal {
    border: 4px solid black;
    box-shadow: 8px 8px 0 0 black;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .card-neobrutal:hover { transform: translate(-2px, -2px); box-shadow: 12px 12px 0 0 black; }
  .card-neobrutal:active { transform: translate(4px, 4px); box-shadow: 2px 2px 0 0 black; }
`;

/* ─── Defaults & Themes ----------------------------------------------------- */
const THEMES = {
  orange: { primary: '#f97316', primaryRGB: '249,115,22', primaryHover: '#fb923c', text: 'text-orange-400', bg: 'bg-orange-500', glow: 'rgba(249,115,22,.15)', gradient: 'linear-gradient(135deg,#060606 0%,#1a0800 45%,#060606 100%)', shimmer: 'linear-gradient(90deg,#f97316 0%,#fff 40%,#f97316 60%,#fff 100%)', accent: '#ffedd5' },
  blue: { primary: '#3b82f6', primaryRGB: '59,130,246', primaryHover: '#60a5fa', text: 'text-blue-400', bg: 'bg-blue-500', glow: 'rgba(37,99,168,.15)', gradient: 'linear-gradient(135deg,#060606 0%,#000a1a 45%,#060606 100%)', shimmer: 'linear-gradient(90deg,#3b82f6 0%,#fff 40%,#3b82f6 60%,#fff 100%)', accent: '#dbeafe' },
  green: { primary: '#16a34a', primaryRGB: '22,163,74', primaryHover: '#22c55e', text: 'text-green-400', bg: 'bg-green-600', glow: 'rgba(39,160,96,.15)', gradient: 'linear-gradient(135deg,#060606 0%,#001a0a 45%,#060606 100%)', shimmer: 'linear-gradient(90deg,#22c55e 0%,#fff 40%,#22c55e 60%,#fff 100%)', accent: '#dcfce7' },
  red: { primary: '#dc2626', primaryRGB: '220,38,38', primaryHover: '#ef4444', text: 'text-red-400', bg: 'bg-red-600', glow: 'rgba(192,39,45,.15)', gradient: 'linear-gradient(135deg,#060606 0%,#1a0000 45%,#060606 100%)', shimmer: 'linear-gradient(90deg,#ef4444 0%,#fff 40%,#ef4444 60%,#fff 100%)', accent: '#fee2e2' }
};

const D = {
  heroPreHeadline: 'ATTENTION PARENTS DE CASABLANCA (ENFANTS 8-14 ANS)',
  heroHeadline: "Transformez Son Temps d'Écran en Compétences d'Ingénieur en Seulement 3 Heures.",
  heroSubHeadline: "Pas de jouets en plastique. Pas de Lego. Vos enfants utiliseront de vrais outils, du vrai code et ramèneront chez eux un projet technologique qu'ils ont construit de leurs propres mains.",
  heroCtaText: 'RÉSERVER UNE MISSION MAINTENANT',
  heroScarcityText: '⏳ Places limitées à 20 Makers par session.',
};

/* ─── Shared Logic Hooks ---------------------------------------------------- */
const useInView = (threshold = 0.15): [React.RefObject<HTMLDivElement>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
};

const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView();
  return <div ref={ref} className={inView ? 'revealed' : 'reveal'} style={{ animationDelay: `${delay}ms` }}>{children}</div>;
};

const Countdown: React.FC<{ theme: any }> = ({ theme }) => {
  const [time, setTime] = useState({ h: 2, m: 47, s: 12 });
  useEffect(() => {
    const t = setInterval(() => setTime(prev => {
      let { h, m, s } = prev;
      if (s > 0) return { h, m, s: s - 1 };
      if (m > 0) return { h, m: m - 1, s: 59 };
      if (h > 0) return { h: h - 1, m: 59, s: 59 };
      return prev;
    }), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="inline-flex items-center gap-2 border-3 border-black rounded-xl px-4 py-2 bg-white text-black shadow-[4px_4px_0_0_#000]">
      <span className="font-black text-[10px] uppercase tracking-widest mr-2">Fermeture :</span>
      <span className="font-black tabular-nums">{pad(time.h)}:{pad(time.m)}:{pad(time.s)}</span>
    </div>
  );
};

/* ─── Dynamic Sections ────────────────────────────────────────────────────── */
const StationsGrid: React.FC<{ stations: StationPole[]; theme: any }> = ({ stations, theme }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {stations.map((s, i) => (
      <Reveal key={s.id} delay={i * 100}>
        <div className="card-neobrutal p-8 bg-black border-white/10 text-white rounded-[2.5rem] h-full flex flex-col items-center text-center group hover:bg-white hover:text-black transition-all">
          <div className="w-16 h-16 bg-white/5 group-hover:bg-black group-hover:text-white rounded-2xl flex items-center justify-center mb-6 border-2 border-white/10 transition-all">
             <StationIcon name={s.icon} size={32} />
          </div>
          <h3 className="font-black text-xl uppercase italic mb-4">{s.title}</h3>
          <p className="text-gray-400 group-hover:text-black/70 font-bold text-sm leading-relaxed">{s.description}</p>
        </div>
      </Reveal>
    ))}
  </div>
);

/* ─── Framework Blocks ────────────────────────────────────────────────────── */
const PASSection: React.FC<{ lp: any; theme: any; programStations: StationPole[] }> = ({ lp, theme, programStations }) => {
  const selectedStations = programStations.filter(s => (lp.selectedStationIds || []).includes(s.id));

  return (
    <div className="space-y-0">
      {/* P - Problem */}
      <section className="py-20 md:py-32 px-6 bg-[#0c0c0c] relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-10 md:mb-20">
              <span className="inline-block px-4 py-1 bg-red-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-full mb-6 italic rotate-[-2deg]">1. IDENTIFICATION</span>
              <h2 className="font-black text-4xl md:text-7xl mb-6 md:mb-8 uppercase text-white shimmer-text italic leading-none">{lp.problemHeadline || "Le Problème."}</h2>
              <p className="text-lg md:text-2xl text-gray-400 font-bold max-w-2xl mx-auto italic leading-relaxed">{lp.problemBody}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* A - Agitation */}
      <section className="py-20 md:py-32 px-6 bg-red-600 relative overflow-hidden border-y-[6px] md:border-y-[10px] border-black">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="p-8 md:p-20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 md:p-8 opacity-20 rotate-12"><AlertTriangle className="text-black w-32 h-32 md:w-60 md:h-60" /></div>
               <h3 className="font-black text-3xl md:text-7xl uppercase text-black mb-6 md:mb-8 italic leading-none tracking-tighter">
                 {lp.agitationHeadline || "L'Avenir est à risque."}
               </h3>
               <p className="text-black font-black text-lg md:text-2xl leading-relaxed max-w-3xl italic relative z-10">{lp.agitationBody}</p>
               <div className="mt-12 flex items-center gap-4">
                  <div className="h-4 w-full bg-black/20 rounded-full overflow-hidden border-2 border-black">
                     <div className="h-full bg-black animate-pulse" style={{ width: '85%' }} />
                  </div>
                  <span className="text-black font-black text-xs uppercase tracking-widest shrink-0">Alerte obsolescence</span>
               </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* S - Solution (The Revelation) */}
      <section className="py-20 md:py-32 px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12 md:mb-20">
              <span className="inline-block px-4 py-1 bg-green-500 text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-full mb-6 italic rotate-[2deg]">2. LA RÉVÉLATION</span>
              <h2 className="font-black text-4xl md:text-7xl mb-6 md:mb-8 uppercase text-white shimmer-text italic leading-none tracking-tighter">{lp.solutionHeadline || "Entrez dans l'Incubateur."}</h2>
              <p className="text-lg md:text-2xl text-gray-400 font-bold max-w-3xl mx-auto italic leading-relaxed">{lp.solutionBody}</p>
            </div>
          </Reveal>
          
          {lp.showStationsInPAS && (
            <div className="mt-20">
              <StationsGrid stations={selectedStations} theme={theme} />
            </div>
          )}
        </div>
      </section>

      {/* Zero Friction / Logistics */}
      {lp.logisticsHeadline && (
        <section className="py-32 px-6 bg-white text-black noise-bg border-y-[10px] border-black">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <Reveal>
                <div className="space-y-6">
                   <h2 className="font-black text-5xl uppercase italic leading-none tracking-tighter">{lp.logisticsHeadline}</h2>
                   <p className="text-xl font-bold text-gray-500 leading-relaxed italic">{lp.logisticsBody}</p>
                   <div className="flex gap-4 pt-4">
                      <div className="flex flex-col items-center">
                         <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black mb-2 shadow-neo-sm">01</div>
                         <span className="text-[10px] font-black uppercase">Individuel</span>
                      </div>
                      <div className="w-px h-12 bg-black/10 mt-2"></div>
                      <div className="flex flex-col items-center">
                         <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black mb-2 shadow-neo-sm">02</div>
                         <span className="text-[10px] font-black uppercase">Pratique</span>
                      </div>
                      <div className="w-px h-12 bg-black/10 mt-2"></div>
                      <div className="flex flex-col items-center">
                         <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black mb-2 shadow-neo-sm">03</div>
                         <span className="text-[10px] font-black uppercase">Certifié</span>
                      </div>
                   </div>
                </div>
             </Reveal>
             <Reveal delay={200}>
                <div className="bg-gray-100 p-8 border-4 border-black rounded-[3rem] shadow-[15px_15px_0_0_#000]">
                   <Shield size={40} className="mb-6 text-orange-500" />
                   <h4 className="font-black text-xl uppercase mb-4 italic">Zéro Friction Mobilière</h4>
                   <p className="font-bold text-gray-500 italic">"L'innovation n'a pas de date de rentrée. Votre enfant n'apporte que sa curiosité. Nous fournissons tout le reste."</p>
                </div>
             </Reveal>
          </div>
        </section>
      )}
    </div>
  );
};

const BABSection: React.FC<{ lp: any; theme: any }> = ({ lp, theme }) => (
  <section className="py-20 md:py-32 px-6 bg-[#0a0a0a] relative overflow-hidden">
     <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <Reveal>
           <div className="p-8 md:p-10 bg-white/5 border-4 border-dashed border-gray-800 rounded-3xl md:rounded-[3rem] opacity-60 md:opacity-40 grayscale translate-x-0 md:translate-x-4 rotate-0 md:rotate-2">
              <span className="text-[10px] md:text-xs font-black uppercase text-gray-500 mb-4 block tracking-widest">AVANT (SITUATION ACTUELLE)</span>
              <h3 className="font-black text-2xl md:text-3xl mb-4 md:mb-6 italic text-gray-300">"{lp.beforeHeadline}"</h3>
              <p className="text-gray-500 font-bold text-sm md:text-lg">{lp.beforeBody || "Passivité, consommation, manque de but."}</p>
           </div>
        </Reveal>
        <Reveal delay={300}>
           <div className="p-8 md:p-12 border-4 md:border-8 border-black rounded-3xl md:rounded-[4rem] bg-blue-500 shadow-[10px_10px_0_0_#000] md:shadow-[20px_20px_0_0_#000] rotate-0 md:-rotate-2 relative z-10 scale-100 md:scale-110">
              <div className="absolute -top-6 md:-top-10 -right-2 md:-right-4 w-16 h-16 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center border-4 md:border-6 border-black rotate-12 shadow-xl">
                 <Zap className="text-orange-500 w-8 h-8 md:w-12 md:h-12" fill="currentColor" />
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase text-black/60 mb-4 block tracking-widest">APRÈS (TRANSFORMATION MAKER)</span>
              <h3 className="font-black text-3xl md:text-4xl mb-4 md:mb-6 text-black italic">"{lp.afterHeadline}"</h3>
              <p className="text-black font-black text-lg md:text-xl mb-6 md:mb-8 leading-tight">{lp.bridgeHeadline}</p>
              <div className="flex gap-2">
                 {[1,2,3,4,5].map(i => <Star key={i} size={24} className="text-white" fill="currentColor" />)}
              </div>
           </div>
        </Reveal>
     </div>
  </section>
);

const ContrastSection: React.FC<{ lp: any; theme: any }> = ({ lp, theme }) => (
  <section className="py-20 md:py-32 px-6 bg-white relative overflow-hidden noise-bg">
     <div className="max-w-4xl mx-auto relative z-10">
        <Reveal>
           <div className="text-center mb-10 md:mb-20">
              <h2 className="font-black text-5xl md:text-8xl uppercase text-black italic leading-none tracking-tighter mb-4">LE CHOIX.<br/><span className="text-orange-500">EST CLAIR.</span></h2>
              <p className="text-gray-400 font-bold text-sm md:text-xl uppercase tracking-widest">Ne comparez pas l'incomparable.</p>
           </div>
        </Reveal>
        <Reveal delay={200}>
           <div className="bg-black border-[10px] border-black rounded-[3.5rem] overflow-hidden shadow-[25px_25px_0_0_rgba(0,0,0,0.1)]">
              <div className="grid grid-cols-12 bg-gray-900 border-b-6 border-black p-8">
                 <div className="col-span-4 font-black text-[10px] text-gray-500 uppercase tracking-widest">CRITÈRE MAJEUR</div>
                 <div className="col-span-4 font-black text-[12px] text-orange-500 uppercase tracking-widest text-center italic">MAKERLAB</div>
                 <div className="col-span-4 font-black text-[10px] text-gray-700 uppercase tracking-widest text-center">AUTRES</div>
              </div>
              {(lp.comparisonRows || []).map((row: any, i: number) => (
                <div key={row.id} className="grid grid-cols-12 p-8 border-b-4 border-white/5 last:border-0 hover:bg-white/5 transition-all group">
                   <div className="col-span-4 font-black text-xs md:text-sm text-gray-400 uppercase italic group-hover:text-white transition-colors">{row.feature}</div>
                   <div className="col-span-4 font-black text-sm md:text-lg text-white text-center flex items-center justify-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 border-2 border-black"><CheckCircle2 size={14} className="text-black" strokeWidth={4} /></div>
                      {row.us}
                   </div>
                   <div className="col-span-4 font-bold text-xs md:text-sm text-gray-600 text-center flex items-center justify-center gap-2 opacity-50">
                      <X size={18} className="text-red-900" />
                      {row.them}
                   </div>
                </div>
              ))}
           </div>
        </Reveal>
     </div>
  </section>
);

/* ─── Drawer Checkout ─────────────────────────────────────────────────────── */
const DrawerCheckout: React.FC<{ 
  selection: any; 
  funnel?: Funnel;
  programId: string; 
  programTitle: string; 
  theme: any; 
  onClose: () => void; 
  ctaMode?: 'booking' | 'lead';
}> = ({ selection, funnel, programId, programTitle, theme, onClose, ctaMode }) => {
  return (
    <>
      <div className={`fixed inset-0 bg-black/90 backdrop-blur-md z-[500] transition-opacity duration-500 ${selection ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 bottom-0 w-full md:w-[600px] bg-white border-l-[12px] border-black z-[510] transition-transform duration-700 flex flex-col ${selection ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex-1 overflow-y-auto relative scrollbar-hide bg-white">
          <button onClick={onClose} className="absolute top-4 right-4 z-[550] w-12 h-12 flex items-center justify-center rounded-full border-4 border-black bg-white hover:scale-110 active:scale-95 transition-all shadow-neo-sm"><X size={24} className="text-black" /></button>
          {selection && (
             <MakeAndGoForm 
                context={{
                   programTitle: programTitle,
                   missionTheme: selection?.title || selection?.theme,
                   missionDate: selection?.date
                }}
             />
          )}
        </div>
      </div>
    </>
  );
};

const FAQSection: React.FC<{ items: any[]; theme: any }> = ({ items, theme }) => {
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  if (!items || items.length === 0) return null;

  return (
    <section className="py-32 px-6 bg-[#0a0a0a]">
       <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="font-black text-4xl md:text-5xl uppercase italic text-white mb-4">Questions Fréquentes</h2>
             <div className="w-20 h-2 bg-orange-500 mx-auto rounded-full" />
          </div>
          <div className="space-y-4">
             {items.map((item, i) => (
                <div key={item.id || i} className="bg-black border-4 border-white/10 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-white/20">
                   <button onClick={() => setOpenedIndex(openedIndex === i ? null : i)} className="w-full text-left p-8 flex items-center justify-between gap-4">
                      <h3 className="font-black text-lg md:text-xl text-white">{item.question}</h3>
                      <div className={`p-2 rounded-xl transition-transform duration-300 ${openedIndex === i ? 'rotate-180 bg-orange-500 text-black' : 'bg-white/5 text-white/40'}`}>
                         <ChevronDown size={20} />
                      </div>
                   </button>
                   <div className={`transition-all duration-500 ease-in-out ${openedIndex === i ? 'max-h-96 opacity-100 p-8 pt-0' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                      <p className="text-gray-400 font-medium text-lg border-t border-white/5 pt-6">{item.answer}</p>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
};

/* ─── Main Landing Component ────────────────────────────────────────────── */
export const ProgramLanding: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { programs, funnels, getProgram, isLoading: isProgramsLoading } = usePrograms();
  const { missions, loading: isMissionsLoading } = useMissions();
  
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const missionsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // 🛡️ Defensive Lookup
  const funnel = Array.isArray(funnels) ? funnels.find(f => f.slug === id) : undefined;
  
  // Try to find program by funnel's programId, or by the ID/Slug itself as fallback
  let program = funnel ? programs.find(p => p.id === funnel.programId) : undefined;
  if (!program && id) {
    program = programs.find(p => p.id === id || p.title.toLowerCase().replace(/\s+/g, '-') === id);
  }
  
  // If still not found, try the context getter (which might check initialPrograms)
  if (!program && id) {
    program = getProgram(id);
  }

  const lp = funnel ? funnel.data : program?.landingPage;

  useEffect(() => {
    if (program) document.title = `${program.title} | Makerlab Academy`;
  }, [program]);

  useEffect(() => {
    const fn = () => { if (heroRef.current) setShowStickyBar(heroRef.current.getBoundingClientRect().bottom < 0); };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  if (isProgramsLoading || isMissionsLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center animate-pulse"><div className="text-white font-black text-xl italic uppercase">Génération du Funnel...</div></div>;
  }

  if (!program || !lp || (!funnel && lp && !lp.enabled)) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center p-6">
        <h1 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">404 - Funnel Perdu</h1>
        <p className="text-gray-500 font-bold mb-8 italic">Nous n'avons pas trouvé de campagne active pour "{id}".</p>
        <a href="/" className="px-10 py-4 bg-orange-500 text-black font-black rounded-3xl uppercase tracking-widest shadow-xl">Retour à la base</a>
      </div>
    );
  }

  const theme = THEMES[lp.themeColor as keyof typeof THEMES] || THEMES.orange;
  const t = (key: keyof typeof D): string => (lp as any)?.[key] || (D as any)[key] || '';

  // 🛡️ Defensive Array Logic
  let visibleMissions: any[] = [];
  const safeMissions = Array.isArray(missions) ? missions : [];
  const missionIds = Array.isArray(lp.missionIds) ? lp.missionIds : [];

  if (missionIds.length > 0) {
    visibleMissions = safeMissions.filter(m => missionIds.includes(m.id) && m.active !== false);
  } else {
    visibleMissions = safeMissions.filter(m => m.programId === program!.id && m.active !== false).slice(0, 4);
  }

  const programStations = Array.isArray(program.stations) ? program.stations : [];
  const selectedStationIds = Array.isArray(lp.selectedStationIds) ? lp.selectedStationIds : [];
  const selectedStations = programStations.filter(s => selectedStationIds.includes(s.id));

  return (
    <>
      <style>{STYLES}</style>
      <div className="font-sans text-white bg-black overflow-x-hidden" style={{ 
        '--theme-primary': theme.primary, 
        '--theme-primary-rgb': theme.primaryRGB,
        '--theme-pulse': `rgba(${theme.primaryRGB}, 0.7)`,
        '--theme-shimmer': theme.shimmer
      } as React.CSSProperties}>

        {/* ══ TICKER ══ */}
        <div className={`${theme.bg} text-black py-3 overflow-hidden relative z-50 border-b-6 border-black shadow-xl`}>
          <div className="ticker-inner">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex items-center gap-12 px-12">
                {['⚡ PROJETS 100% RÉELS', '🏆 BUILT NOT BOUGHT', `🚀 PROGRAMME : ${program.title.toUpperCase()}`, '🔥 ÉLITE INNOVATION'].map((txt, j) => (
                   <span key={j} className="font-black text-[12px] uppercase tracking-[0.2em]">{txt}</span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ══ HERO ══ */}
        <section ref={heroRef} className="relative min-h-[90vh] flex flex-col justify-center noise-bg px-6 py-24 text-center overflow-hidden" style={{ background: theme.gradient }}>
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, var(--theme-primary), transparent 70%)' }}></div>
           <Reveal>
              <div className="flex flex-col items-center gap-6 mb-12">
                 {lp.heroSurTitre && <span className="font-black text-xs md:text-sm uppercase tracking-[0.6em] text-orange-500 italic rotate-[-1deg]">{lp.heroSurTitre}</span>}
                 <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="px-6 py-2 bg-orange-500 text-black font-black text-xs uppercase tracking-widest rounded-full border-3 border-black shadow-[4px_4px_0_0_black]">MAKERLAB ACADEMY</div>
                    <Countdown theme={theme} />
                 </div>
              </div>
           </Reveal>
           <Reveal delay={100}>
              <p className="text-orange-500 font-black text-xs md:text-sm uppercase tracking-[0.4em] mb-4 md:mb-6 italic">{t('heroPreHeadline')}</p>
              <h1 className="font-black text-5xl md:text-8xl lg:text-9xl leading-[0.8] mb-6 md:mb-10 shimmer-text italic tracking-tighter uppercase">{lp.heroHeadline || t('heroHeadline')}</h1>
              <p className="text-lg md:text-3xl text-gray-400 font-black max-w-4xl mx-auto mb-10 md:mb-16 leading-tight italic uppercase">{lp.heroSubHeadline || t('heroSubHeadline')}</p>
           </Reveal>
           <Reveal delay={300}>
              <button 
                onClick={() => missionsRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                className="cta-pulse w-full md:w-auto px-6 py-6 md:px-16 md:py-8 bg-white text-black font-black text-xl md:text-3xl uppercase tracking-widest border-4 md:border-8 border-black rounded-3xl md:rounded-[3rem] shadow-[8px_8px_0_0_#000] md:shadow-[12px_12px_0_0_#000] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all active:scale-95"
              >
                 {lp.heroCtaText || "REJOINDRE LA MISSION"}
              </button>
              <p className="mt-8 text-orange-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 animate-bounce"><ArrowDownCircle size={14}/> {lp.heroScarcityText || "PLACES LIMITÉES"}</p>
           </Reveal>
        </section>

        {/* ══ FRAMEWORK SECTIONS ══ */}
        {(() => {
          const fw = funnel?.framework ?? lp.framework ?? (lp as any).layoutVariant;
          return (
            <>
              {(fw === MarketingFramework.PAS || fw === 'pas') && <PASSection lp={lp} theme={theme} programStations={programStations} />}
              {(fw === MarketingFramework.BAB || fw === 'bab') && <BABSection lp={lp} theme={theme} />}
              {(fw === MarketingFramework.CONTRAST || fw === 'contrast') && <ContrastSection lp={lp} theme={theme} />}
            </>
          );
        })()}

        {/* ══ STATIONS SECTION (MODULAR) ══ */}
        {lp.layoutVariant === 'modular' && selectedStations.length > 0 && !lp.showStationsInPAS && (
          <section className="py-32 px-6 bg-[#0a0a0a]">
             <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                   <h2 className="font-black text-5xl md:text-7xl uppercase italic shimmer-text mb-6">{lp.stationsHeadline || "Innovation Stations."}</h2>
                   <p className="text-xl text-gray-400 font-bold max-w-3xl mx-auto mb-16">{lp.stationsSubHeadline || "Une progression individuelle à travers 5 pôles d'excellence."}</p>
                </div>
                <StationsGrid stations={selectedStations} theme={theme} />
             </div>
          </section>
        )}

        {/* ══ MISSIONS ══ */}
        <section ref={missionsRef} className="py-20 md:py-32 px-6 bg-[#0c0c0c]">
           <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 md:mb-24 relative z-10">
                 <h2 className="font-black text-5xl md:text-8xl uppercase italic text-orange-500 mb-4 md:mb-6 leading-none tracking-tighter">{lp.missionsHeadline || "SESSIONS OUVERTES."}</h2>
                 <p className="text-gray-500 font-black text-sm md:text-xl uppercase tracking-widest">{lp.missionsSubHeadline || "Sélectionnez votre créneau de déploiement."}</p>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black opacity-[0.03] pointer-events-none select-none italic uppercase">CALENDAR</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {visibleMissions.length === 0 ? (
                   <div className="col-span-2 py-20 text-center border-4 border-dashed border-gray-800 rounded-[3rem]">
                     <p className="font-black text-3xl text-gray-500 uppercase italic mb-4">Sessions à venir...</p>
                     <p className="text-gray-600 font-bold max-w-md mx-auto">Les prochaines sessions seront bientôt annoncées. Inscrivez-vous pour être alerté(e) en premier.</p>
                     <button
                       onClick={() => setSelectedTarget({ title: program!.title, price: program!.price, date: 'À confirmer' })}
                       className="mt-8 px-8 py-4 bg-orange-500 text-black font-black rounded-[1.5rem] uppercase text-xs tracking-widest italic border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-none transition-all"
                     >
                       M'alerter des prochaines sessions →
                     </button>
                   </div>
                 ) : visibleMissions.map((m, i) => (
                   <Reveal key={m.id} delay={i * 100}>
                      <div className="card-neobrutal bg-white text-black rounded-3xl md:rounded-[3rem] overflow-hidden flex flex-col h-full group">
                         {m.coverImage && (
                            <div className="aspect-video bg-gray-200 border-b-4 border-black relative overflow-hidden shrink-0">
                               <img src={m.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={m.title} />
                               <div className="absolute top-4 left-4 px-4 py-1.5 bg-black text-white font-black text-[9px] uppercase tracking-widest rounded-full italic shadow-neo-sm z-10">{m.date}</div>
                            </div>
                         )}
                         <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                            <div>
                               {!m.coverImage && (
                                  <div className="flex items-center justify-between mb-8">
                                     <div className="px-4 py-1.5 bg-black text-white font-black text-[9px] uppercase tracking-widest rounded-full italic">{m.date}</div>
                                     <div className="p-3 bg-gray-50 rounded-2xl border-3 border-black group-hover:bg-orange-500 transition-colors"><TrendingUp size={24}/></div>
                                  </div>
                               )}
                               {m.coverImage && (
                                  <div className="flex items-center justify-between mb-4">
                                    <span className="font-black text-[10px] text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">{m.category || 'Mission'}</span>
                                    <div className="p-2 bg-gray-50 rounded-xl border-1 border-black group-hover:bg-orange-500 transition-colors"><TrendingUp size={16}/></div>
                                  </div>
                               )}
                               <h3 className="font-black text-2xl md:text-3xl mb-4 italic leading-tight uppercase group-hover:text-orange-500 transition-colors">{m.title || m.theme}</h3>
                               <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6 md:mb-8">{m.description || "Projet d'ingénierie avancée, modélisation 3D et programmation."}</p>
                            </div>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-6 md:pt-8 border-t-3 border-black gap-4 mt-auto">
                               <span className="font-black text-3xl md:text-4xl italic tracking-tighter">{m.price}</span>
                               <button 
                                 onClick={() => setSelectedTarget(m)}
                                 className="w-full md:w-auto text-center px-8 py-4 bg-orange-500 text-black font-black rounded-2xl md:rounded-[1.5rem] uppercase text-[10px] md:text-xs tracking-widest italic border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-none translate-y-[-2px] hover:translate-y-0 transition-all font-sans shrink-0"
                               >
                                  RÉSERVER →
                               </button>
                            </div>
                         </div>
                      </div>
                   </Reveal>
                 ))}
              </div>
           </div>
        </section>

        {/* ══ GALLERY / SOCIAL PROOF ══ */}
        {lp.galleryImages && lp.galleryImages.length > 0 && (
          <section className="py-24 px-6 bg-white border-y-4 border-black">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                 <Reveal>
                   <h2 className="font-black text-4xl md:text-6xl uppercase italic text-black mb-4">Makers en Action</h2>
                   <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Dans les coulisses de nos programmes</p>
                 </Reveal>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {lp.galleryImages.map((src, idx) => (
                  <Reveal key={idx} delay={idx * 100}>
                    <div className="aspect-[4/5] md:aspect-square bg-gray-100 rounded-3xl border-4 border-black overflow-hidden group hover:-translate-y-2 hover:shadow-[8px_8px_0_0_#000] transition-all duration-300">
                      <img src={src} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`Galerie MakerLab ${idx}`} />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {lp.faqEnabled && <FAQSection items={lp.faqItems || []} theme={theme} />}

        {/* ══ FINAL BLOCK ══ */}
        <section className="py-24 md:py-40 px-6 text-center noise-bg relative overflow-hidden" style={{ background: theme.gradient }}>
           <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"><Rocket className="w-96 h-96 md:w-[500px] md:h-[500px]" strokeWidth={0.5}/></div>
           <Reveal>
              <h2 className="font-black text-4xl md:text-8xl mb-8 md:mb-12 uppercase italic shimmer-text leading-none relative z-10">{lp.finalCtaHeadline || "DEVENIR UN MAKEMAKER."}</h2>
              <button 
                onClick={() => missionsRef.current?.scrollIntoView({ behavior: 'smooth' })} 
                className="w-full md:w-auto px-6 py-6 md:px-16 md:py-8 bg-orange-500 text-black font-black text-2xl md:text-4xl italic uppercase tracking-widest border-4 md:border-8 border-black rounded-3xl md:rounded-[3.5rem] shadow-[8px_8px_0_0_#000] md:shadow-[15px_15px_0_0_#000] hover:translate-x-1 hover:translate-y-1 md:hover:translate-x-3 md:hover:translate-y-3 hover:shadow-none transition-all scale-100 md:scale-110 active:scale-95 relative z-10"
              >
                  LANCER LA SESSION
              </button>
              <p className="mt-8 md:mt-12 text-gray-500 font-black text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.5em] italic relative z-10">{lp.finalCtaBody || "Ne laissez pas le futur s'écrire sans eux."}</p>
           </Reveal>
        </section>

        {/* ══ STICKY ══ */}
        <div className={`fixed bottom-0 left-0 right-0 z-[400] transition-transform duration-500 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
           <div className="mx-6 mb-6">
              <div className="bg-white border-6 border-black p-4 md:p-6 flex items-center justify-between max-w-5xl mx-auto rounded-[2.5rem] shadow-[10px_10px_0_0_#000]">
                 <div className="hidden md:block">
                    <p className="font-black text-xs uppercase tracking-widest text-orange-500 mb-1 italic">Dernières places disponibles</p>
                    <p className="font-black text-lg uppercase italic text-black leading-none">Programme : {program.title}</p>
                 </div>
                 <div className="md:hidden text-black">
                    <p className="font-black text-[10px] uppercase italic">{program.title}</p>
                 </div>
                 <button onClick={() => missionsRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-orange-500 text-black font-black uppercase text-xs md:text-sm rounded-[1.5rem] border-4 border-black hover:scale-105 active:scale-95 transition-all shadow-lg italic">RÉSERVER MA PLACE →</button>
              </div>
           </div>
        </div>

        <DrawerCheckout 
          selection={selectedTarget} 
          funnel={funnel}
          programId={program.id} 
          programTitle={program.title} 
          theme={theme}
          onClose={() => setSelectedTarget(null)} 
        />
      </div>
    </>
  );
};
