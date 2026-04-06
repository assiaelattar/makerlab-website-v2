import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { usePrograms } from '../contexts/ProgramContext';
import { useMissions } from '../contexts/MissionContext';
import { LandingLead, Mission, Track, MissionBox } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Zap, Clock, Cpu, Code2, ChevronDown, CheckCircle2,
  X, Rocket, Shield, Star, ArrowRight, AlertTriangle, Phone,
  Quote, ChevronLeft, ChevronRight, MessageCircle, Target
} from 'lucide-react';

/* ─── CSS -------------------------------------------------------------------- */
const STYLES = `
  @keyframes modalSlideUp {
    from { opacity:0; transform:translateY(40px) scale(.95); }
    to   { opacity:1; transform:translateY(0)   scale(1); }
  }
  @keyframes pulse-cta {
    0%,100%{ box-shadow:0 0 0 0 var(--theme-pulse),5px 5px 0 0 #000; }
    50%    { box-shadow:0 0 0 18px rgba(0,0,0,0),5px 5px 0 0 #000; }
  }
  .cta-pulse{ animation:pulse-cta 2s infinite; }
  @keyframes float-y{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
  .float-y{ animation:float-y 3s ease-in-out infinite; }
  @keyframes count-in{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:none;}}
  .count-in{ animation:count-in .5s ease forwards; }
  @keyframes reveal-up{from{opacity:0;transform:translateY(32px);}to{opacity:1;transform:none;}}
  .reveal{ opacity:0; }
  .revealed{ animation:reveal-up .6s cubic-bezier(.22,1,.36,1) forwards; }
  @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
  .shimmer-text{
    background: var(--theme-shimmer);
    background-size:200% auto;
    -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent;
    animation:shimmer 4s linear infinite;
  }
  .wa-btn{ animation:wa-bounce 2.5s ease-in-out infinite; }
  .noise-bg::before{
    content:''; position:absolute; inset:0; pointer-events:none; z-index:0;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
    opacity:.06;
  }
  @keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
  .ticker-inner{ display:flex; animation:ticker 20s linear infinite; white-space:nowrap; }
  .hover-theme:hover { background-color: var(--theme-primary-hover) !important; transform: translateY(-2px); }
  .card-theme:hover { border-color: var(--theme-primary) !important; transform: translateY(-8px); }
`;

/* ─── Defaults --------------------------------------------------------------- */
const THEMES = {
  orange: {
    primary: '#f97316',
    primaryRGB: '249,115,22',
    primaryHover: '#fb923c',
    text: 'text-orange-400',
    bg: 'bg-orange-500',
    glow: 'rgba(249,115,22,.22)',
    gradient: 'linear-gradient(135deg,#060606 0%,#1a0800 45%,#060606 100%)',
    shimmer: 'linear-gradient(90deg,#f97316 0%,#fff 40%,#f97316 60%,#fff 100%)',
    accent: '#ffedd5', 
  },
  blue: {
    primary: '#3b82f6',
    primaryRGB: '59,130,246',
    primaryHover: '#60a5fa',
    text: 'text-blue-400',
    bg: 'bg-blue-500',
    glow: 'rgba(37,99,168,.22)',
    gradient: 'linear-gradient(135deg,#060606 0%,#000a1a 45%,#060606 100%)',
    shimmer: 'linear-gradient(90deg,#3b82f6 0%,#fff 40%,#3b82f6 60%,#fff 100%)',
    accent: '#dbeafe',
  },
  green: {
    primary: '#16a34a',
    primaryRGB: '22,163,74',
    primaryHover: '#22c55e',
    text: 'text-green-400',
    bg: 'bg-green-600',
    glow: 'rgba(39,160,96,.22)',
    gradient: 'linear-gradient(135deg,#060606 0%,#001a0a 45%,#060606 100%)',
    shimmer: 'linear-gradient(90deg,#22c55e 0%,#fff 40%,#22c55e 60%,#fff 100%)',
    accent: '#dcfce7',
  },
  red: {
    primary: '#dc2626',
    primaryRGB: '220,38,38',
    primaryHover: '#ef4444',
    text: 'text-red-400',
    bg: 'bg-red-600',
    glow: 'rgba(192,39,45,.22)',
    gradient: 'linear-gradient(135deg,#060606 0%,#1a0000 45%,#060606 100%)',
    shimmer: 'linear-gradient(90deg,#ef4444 0%,#fff 40%,#ef4444 60%,#fff 100%)',
    accent: '#fee2e2',
  }
};

const D = {
  heroPreHeadline: 'ATTENTION PARENTS DE CASABLANCA (ENFANTS 8-14 ANS)',
  heroHeadline: "Transformez Son Temps d'Écran en Compétences d'Ingénieur en Seulement 3 Heures.",
  heroSubHeadline: "Pas de jouets en plastique. Pas de Lego. Vos enfants utiliseront de vrais outils, du vrai code et ramèneront chez eux un projet technologique qu'ils ont construit de leurs propres mains.",
  heroCtaText: 'RÉSERVER UNE MISSION POUR CE WEEK-END',
  heroScarcityText: '⏳ Places limitées à 20 Makers par session.',
  agitatorHeadline: "La plupart des enfants consomment la technologie. Les nôtres la construisent.",
  agitatorBody: "Le système classique donne à votre enfant une boîte de pièces préfabriquées et un manuel d'instructions. Ce n'est pas de l'ingénierie. C'est du simple assemblage.\n\nChez Makerlab, notre philosophie est stricte : BUILT NOT BOUGHT (Construit, pas acheté). Nous mettons de vrais logiciels de CAO, des imprimantes 3D et des fers à souder entre les mains de vos enfants. Nous ne les traitons pas comme des enfants, nous les traitons comme des innovateurs.",
  missionsHeadline: 'Choisissez La Mission de Votre Enfant',
  missionsSubHeadline: "Chaque week-end est un nouveau défi. Sélectionnez une date ci-dessous. Attention : les portes se ferment dès que les 20 places sont réservées.",
  finalCtaHeadline: "Le Moment Où Tout S'allume.",
  finalCtaBody: "Ne laissez pas passer un autre week-end devant les écrans. Donnez-leur les compétences de demain, aujourd'hui.",
};


const TESTIMONIALS = [
  { name: 'Fatima Z.', role: 'Maman de Youssef, 11 ans', text: "J'ai déposé mon fils en hésitant. 3 heures plus tard, il tenait dans ses mains un robot qu'il avait lui-même programmé. Son sourire valait tout l'or du monde.", stars: 5, initial: 'F' },
  { name: 'Karim B.', role: 'Papa de Lina, 9 ans', text: "Ma fille ne parlait que de ça pendant une semaine. Elle a appris la modélisation 3D en une après-midi. Les profs de Makerlab sont incroyables, vraiment.", stars: 5, initial: 'K' },
  { name: 'Sara M.', role: 'Maman de Adam, 13 ans', text: "Mon ado était accro aux écrans. Maintenant il code ses propres projets et m'explique comment fonctionne l'Arduino. Makerlab a tout changé pour lui.", stars: 5, initial: 'S' },
];

/* ─── useCountUp ------------------------------------------------------------- */
const useCountUp = (target: number, inView: boolean, duration = 1800) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0; const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target, duration]);
  return val;
};

/* ─── useInView -------------------------------------------------------------- */
const useInView = (threshold = 0.2): [React.RefObject<HTMLDivElement>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    // Fallback: reveal after 600ms even if observer doesn't fire
    const timer = setTimeout(() => setInView(true), 600);
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); clearTimeout(timer); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => { obs.disconnect(); clearTimeout(timer); };
  }, [threshold]);
  return [ref, inView];
};

/* ─── Reveal wrapper --------------------------------------------------------- */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView(0.15);
  return (
    <div ref={ref} className={inView ? 'revealed' : 'reveal'} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

/* ─── Animated stat counter -------------------------------------------------- */
const StatCounter: React.FC<{ value: number; suffix?: string; label: string; inView: boolean; theme: any; delay?: number }> = ({ value, suffix = '', label, inView, theme, delay = 0 }) => {
  const count = useCountUp(value, inView);
  return (
    <div className="text-center" style={{ animationDelay: `${delay}ms` }}>
      <div className={`font-black text-5xl md:text-6xl tabular-nums leading-none`} style={{ color: theme.primary }}>
        {count}{suffix}
      </div>
      <div className="text-gray-400 font-bold text-sm mt-2 uppercase tracking-wider">{label}</div>
    </div>
  );
};

/* ─── Countdown Timer -------------------------------------------------------- */
const useCountdown = () => {
  const [time, setTime] = useState({ h: 47, m: 59, s: 59 });
  useEffect(() => {
    const t = setInterval(() => setTime(prev => {
      let { h, m, s } = prev;
      if (s > 0) return { h, m, s: s - 1 };
      if (m > 0) return { h, m: m - 1, s: 59 };
      if (h > 0) return { h: h - 1, m: 59, s: 59 };
      return { h: 47, m: 59, s: 59 };
    }), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

const Countdown: React.FC<{ theme: any }> = ({ theme }) => {
  const { h, m, s } = useCountdown();
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="inline-flex items-center gap-1 border rounded-xl px-3 py-2" style={{ backgroundColor: `rgba(${theme.primaryRGB}, 0.1)`, borderColor: `rgba(${theme.primaryRGB}, 0.5)` }}>
      <span className="font-black text-xs uppercase tracking-widest mr-1" style={{ color: theme.primary }}>Ferme dans</span>
      {[pad(h), pad(m), pad(s)].map((v, i) => (
        <React.Fragment key={i}>
          <span className="font-black text-white text-lg tabular-nums px-2 py-0.5 rounded-lg" style={{ backgroundColor: `rgba(${theme.primaryRGB}, 0.6)` }}>{v}</span>
          {i < 2 && <span className="font-black" style={{ color: theme.primary }}>:</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ─── Testimonials carousel -------------------------------------------------- */
const TestimonialsSection: React.FC<{ theme: any }> = ({ theme }) => {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = useCallback(() => setIdx(i => (i + 1) % TESTIMONIALS.length), []);
  useEffect(() => { const t = setInterval(next, 5000); return () => clearInterval(t); }, [next]);
  const t = TESTIMONIALS[idx];
  return (
    <section className="py-20 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#0d0d0d 0%,#0d0d0d 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 40% at 50% 50%,${theme.glow} 0%,transparent 70%)` }} />
      <div className="max-w-2xl mx-auto relative z-10">
        <Reveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-3" style={{ borderColor: theme.glow.replace('.22', '.3') }}>
              <Star size={14} fill="currentColor" style={{ color: theme.primary }} />
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: theme.primary }}>Ils témoignent</span>
            </div>
            <h2 className="font-black text-3xl md:text-4xl">Ce que disent les parents</h2>
          </div>
        </Reveal>
        <div className="relative">
          <div className={`p-8 md:p-10 rounded-3xl border-2 bg-white/3 backdrop-blur-sm`} style={{ borderColor: theme.glow.replace('.22', '.3'), minHeight: 220 }}>
            <Quote size={32} className="mb-4 opacity-30" style={{ color: theme.primary }} />
            <p className="text-lg md:text-xl text-gray-200 font-medium leading-relaxed italic mb-6">"{t.text}"</p>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full border-2 border-black flex items-center justify-center font-black text-black text-xl`} style={{ background: theme.primary }}>{t.initial}</div>
              <div>
                <p className="font-black text-white">{t.name}</p>
                <p className="text-sm text-gray-400 font-medium">{t.role}</p>
              </div>
              <div className="ml-auto flex gap-0.5">{Array(t.stars).fill(0).map((_,i) => <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />)}</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={prev} className={`w-10 h-10 flex items-center justify-center rounded-full border-2 border-white/20 transition-all hover:bg-white/5 active:scale-95`} style={{ borderColor: theme.glow.replace('.22', '.3') }}><ChevronLeft size={18} /></button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_,i) => <div key={i} onClick={() => setIdx(i)} className={`w-2 h-2 rounded-full cursor-pointer transition-all ${i===idx ? `w-6` : 'bg-white/20'}`} style={{ backgroundColor: i===idx ? theme.primary : undefined }} />)}
            </div>
            <button onClick={next} className={`w-10 h-10 flex items-center justify-center rounded-full border-2 border-white/20 transition-all hover:bg-white/5 active:scale-95`} style={{ borderColor: theme.glow.replace('.22', '.3') }}><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─── Drawer Checkout -------------------------------------------------------- */
const DrawerCheckout: React.FC<{ selection: Mission | Track | MissionBox | null; programId: string; programTitle: string; theme: any; onClose: () => void; ctaMode?: 'booking' | 'lead' }> = ({ selection, programId, programTitle, theme, onClose, ctaMode }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ parentName: '', childName: '', childAge: '', whatsapp: '' });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'Deposit' | 'Full Bundle' | 'Pending'>('Pending');

  const isTrack = !!(selection && 'benefits' in selection);
  const isMissionBox = !!(selection && 'theme' in selection && !('title' in selection));
  
  const targetName = selection 
    ? (isTrack ? (selection as Track).title : (isMissionBox ? (selection as MissionBox).theme : (selection as Mission).title)) 
    : '';
  const targetPrice = selection ? (selection as any).price : '';

  const isLeadMode = ctaMode === 'lead';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && isTrack) { setStep(2); return; } // Tracks have a payment choice step
    setLoading(true);
    try {
      const lead: LandingLead = {
        programId, programTitle, parentName: form.parentName, childName: form.childName,
        childAge: form.childAge, whatsapp: form.whatsapp, createdAt: new Date().toISOString(),
        paymentStatus: isLeadMode ? 'Pending' : paymentStatus // Leads are always pending
      };
      if (isTrack) { 
        lead.trackId = selection.id; 
        lead.trackTitle = targetName; 
      } else { 
        lead.missionId = selection.id; 
        lead.missionTheme = targetName; 
        lead.missionDate = (selection as any).date; 
      }
      
      const docRef = await addDoc(collection(db, 'website-landing-leads'), lead);
      
      // Marketing redirect to Thank You page
      const params = new URLSearchParams({
        leadId: docRef.id,
        programId: programId || '',
        childName: form.childName,
        programTitle: targetName || programTitle,
        type: isTrack ? 'track' : (isLeadMode ? 'lead' : 'mission')
      });
      navigate(`/thanks?${params.toString()}`);
    } catch (_) {}
    setLoading(false); setDone(true);
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] transition-opacity duration-300 ${selection ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 bottom-0 w-full md:w-[500px] bg-white border-l-8 border-black shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-[210] transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${selection ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-2 shrink-0" style={{ background: `linear-gradient(90deg, var(--theme-primary), var(--theme-accent), var(--theme-primary))` }} />
        <div className="flex-1 overflow-y-auto p-8 relative">
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border-2 border-black hover:bg-red-500 hover:text-white transition-colors bg-gray-50"><X size={20} strokeWidth={3} /></button>
          
          {!done ? (
            <>
              <div className="mb-8 pr-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border"
                  style={{ backgroundColor: `rgba(${theme.primaryRGB}, 0.1)`, color: `var(--theme-primary)`, borderColor: `rgba(${theme.primaryRGB}, 0.2)` }}>
                  <Rocket size={12} /> {isLeadMode ? 'Rencontre Découverte' : (isTrack ? 'Inscription Parcours' : 'Réservation Session')}
                </div>
                <h2 className="font-black text-2xl leading-tight mb-2">
                  {isLeadMode ? 'Réservez votre visite au Lab' : 'Sécurisez votre place'}
                </h2>
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                  <p className="font-black text-lg">{targetName}</p>
                  {!isLeadMode && <p className="font-bold mt-1 text-sm" style={{ color: `var(--theme-primary)` }}>{targetPrice}</p>}
                  {selection && !isTrack && <p className="text-xs text-gray-500 font-bold mt-1">{(selection as Mission).date}</p>}
                  {isLeadMode && <p className="text-xs text-green-600 font-black mt-1 uppercase">✨ Rencontre Gratuite</p>}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    {[
                      { label: 'Votre Prénom (Parent)', key: 'parentName', placeholder: 'Ex: Fatima', type: 'text' },
                      { label: "Prénom de l'enfant", key: 'childName', placeholder: 'Ex: Youssef', type: 'text' },
                      { label: "Âge de l'enfant", key: 'childAge', placeholder: 'Ex: 10', type: 'number' },
                      { label: 'Numéro WhatsApp', key: 'whatsapp', placeholder: '+212 6XX XXX XXX', type: 'tel' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-black uppercase tracking-widest mb-1.5 text-gray-600">{f.label}</label>
                        <input required type={f.type} min={f.key==='childAge'?5:undefined} max={f.key==='childAge'?18:undefined} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} className="w-full p-4 border-4 border-black rounded-xl font-bold focus:bg-white outline-none transition-colors shadow-[2px_2px_0_0_black]" 
                          style={{ borderColor: `var(--theme-primary)` }}
                          placeholder={f.placeholder} />
                      </div>
                    ))}
                    <button type="submit" disabled={loading} className="w-full py-5 mt-4 text-black font-black text-lg uppercase tracking-widest border-4 border-black rounded-2xl hover:-translate-y-1 transition-all disabled:opacity-60 flex justify-center items-center gap-2"
                      style={{ backgroundColor: `var(--theme-primary)`, boxShadow: '6px 6px 0 0 #000' }}>
                       {isLeadMode ? (loading ? '⏳ Envoi...' : 'PRENDRE RENDEZ-VOUS') : (isTrack ? 'Suivant : Réservation →' : (loading ? '⏳ Envoi...' : ' CONFIRMER MA RÉSERVATION'))}
                    </button>
                  </div>
                )}

                {step === 2 && isTrack && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <h3 className="font-black text-lg">Choisissez votre formule :</h3>
                    
                    <label className={`block cursor-pointer p-5 border-4 rounded-2xl transition-all ${paymentStatus === 'Deposit' ? 'shadow-neo' : 'border-gray-200 hover:border-black'}`}
                       style={{ borderColor: paymentStatus === 'Deposit' ? `var(--theme-primary)` : undefined, backgroundColor: paymentStatus === 'Deposit' ? `rgba(${theme.primaryRGB}, 0.1)` : undefined }}>
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={paymentStatus === 'Deposit'} onChange={() => setPaymentStatus('Deposit')} className="w-5 h-5" style={{ accentColor: `var(--theme-primary)` }} />
                        <div>
                          <p className="font-black">Essai 1 Jour (400 DHS)</p>
                          <p className="text-xs text-gray-500 font-bold mt-1 max-w-[250px]">Laissez votre enfant tester la 1ère session. Si ça lui plaît, on déduira ce montant du pack complet.</p>
                        </div>
                      </div>
                    </label>

                    <label className={`block cursor-pointer p-5 border-4 rounded-2xl transition-all ${paymentStatus === 'Full Bundle' ? 'border-green-500 bg-green-50 shadow-neo' : 'border-gray-200 hover:border-black'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={paymentStatus === 'Full Bundle'} onChange={() => setPaymentStatus('Full Bundle')} className="w-5 h-5 accent-green-600" />
                        <div>
                          <p className="font-black">Le Parcours Complet ({targetPrice})</p>
                          <p className="text-xs text-gray-500 font-bold mt-1">Garantissez sa place pour les 3 semaines d'affilée avec accès prioritaire.</p>
                        </div>
                      </div>
                    </label>

                    <button type="submit" disabled={loading} className="w-full py-5 mt-4 text-black font-black text-lg uppercase tracking-widest border-4 border-black rounded-2xl hover:-translate-y-1 hover:shadow-[6px_6px_0_0_black] transition-all disabled:opacity-60 cta-pulse mt-8"
                      style={{ backgroundColor: `var(--theme-primary)` }}>
                       {loading ? '⏳ Sauvegarde...' : '🚀 SÉCURISER MA PLACE'}
                    </button>
                    <button type="button" onClick={() => setStep(1)} className="w-full py-3 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-black">← Retour aux infos</button>
                  </div>
                )}
                
                <p className="text-center text-[10px] text-gray-400 font-black tracking-widest uppercase mt-6 pt-6 border-t border-gray-100">
                  <Shield size={10} className="inline mr-1 -mt-0.5" />
                  {isLeadMode ? 'Rencontre libre sans engagement. Données privées.' : 'Paiement sur place le jour j. Données 100% privées.'}
                </p>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center -mt-10">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-black shadow-[4px_4px_0_0_black]"><CheckCircle2 size={48} className="text-green-600" strokeWidth={3} /></div>
              <h2 className="font-black text-3xl mb-3">{isLeadMode ? 'Demande Envoyée ! 🚀' : 'Place Réservée ! 🎉'}</h2>
              <p className="text-gray-600 font-medium mb-8 text-lg">
                {isLeadMode 
                  ? "Notre équipe vous contactera sur WhatsApp sous peu pour fixer l'heure de votre visite." 
                  : "Notre équipe vous contactera sur WhatsApp sous peu pour finaliser."}
              </p>
              <button onClick={onClose} className="px-10 py-4 bg-black text-white font-black text-xs uppercase tracking-widest rounded-xl border-4 border-black hover:bg-gray-800 transition-colors w-full">Retour au site</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/* ─── FAQ Item --------------------------------------------------------------- */
const FaqItem: React.FC<{ question: string; answer: string; theme: any }> = ({ question, answer, theme }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'bg-white/5' : 'border-white/10 bg-white/2'}`} style={{ borderColor: open ? theme.primary : undefined }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-white/5 transition-colors">
        <span className="font-black text-base md:text-lg">{question}</span>
        <ChevronDown size={20} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} style={{ color: theme.primary }} />
      </button>
      {open && <div className="px-6 pb-6 text-gray-400 font-medium leading-relaxed border-t border-white/5 pt-4">{answer}</div>}
    </div>
  );
};

/* ─── Modular: Stations Grid ─────────────────────────────────────────────── */
const StationsGrid: React.FC<{ stations: any[]; theme: any }> = ({ stations, theme }) => {
  if (!stations || stations.length === 0) return null;
  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((s: any, i: number) => (
            <Reveal key={s.id} delay={i * 100}>
              <div className="p-8 rounded-3xl border-2 border-white/5 bg-white/2 hover:border-white/20 transition-all group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {s.icon || '🚀'}
                </div>
                <h3 className="font-black text-xl mb-4 uppercase tracking-tight text-white">{s.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed text-sm">{s.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Modular: Perks List ────────────────────────────────────────────────── */
const PerksList: React.FC<{ perks: any[]; theme: any }> = ({ perks, theme }) => {
  if (!perks || perks.length === 0) return null;
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
      {perks.map((p: any, i: number) => (
        <Reveal key={p.id} delay={i * 50}>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: theme.glow, color: theme.primary }}>
              <CheckCircle2 size={14} strokeWidth={3} />
            </div>
            <span className="font-bold text-sm text-gray-200">{p.text}</span>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

/* ─── Main Page -------------------------------------------------------------- */
export const ProgramLanding: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProgram, isLoading: isProgramLoading } = usePrograms();
  const { missions, tracks, loading: isMissionsLoading } = useMissions();
  const [selectedTarget, setSelectedTarget] = useState<Mission | Track | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const missionsRef = useRef<HTMLDivElement>(null);
  const [statsRef, statsInView] = useInView(0.3);
  const heroRef = useRef<HTMLElement>(null);

  const program = id ? getProgram(id) : undefined;
  const lp = program?.landingPage;

  const themeKey = lp?.themeColor || program?.themeColor || 'orange';
  const theme = THEMES[themeKey as keyof typeof THEMES] || THEMES.orange;

  useEffect(() => {
    document.title = program ? `${program.title} — Makerlab Academy` : 'Makerlab Academy';
  }, [program]);

  // Show sticky bar after scrolling past hero
  useEffect(() => {
    const fn = () => {
      if (!heroRef.current) return;
      const b = heroRef.current.getBoundingClientRect();
      setShowStickyBar(b.bottom < 0);
    };
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Inject Meta Pixel script if configured for this landing page
  useEffect(() => {
    if (!lp?.metaPixel) return;
    const container = document.createElement('div');
    container.innerHTML = lp.metaPixel;
    const scripts: HTMLScriptElement[] = [];
    container.querySelectorAll('script').forEach(s => {
      const script = document.createElement('script');
      if (s.src) {
        script.src = s.src;
        script.async = true;
      } else {
        script.textContent = s.textContent;
      }
      script.setAttribute('data-lp-pixel', program?.id || '');
      document.head.appendChild(script);
      scripts.push(script);
    });
    return () => {
      scripts.forEach(s => s.parentNode?.removeChild(s));
    };
  }, [lp?.metaPixel, program?.id]);

  if (isProgramLoading || isMissionsLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white font-black text-2xl animate-pulse">CHARGEMENT...</div></div>;
  
  if (!program) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center px-6">
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="font-black text-3xl mb-3">Oups ! Offre Introuvable</h1>
        <p className="text-gray-400 font-medium max-w-sm">Cette offre n'existe plus ou le lien est expiré.</p>
        <a href="/" className="mt-8 px-6 py-3 text-black font-black rounded-xl border-2 border-black transition-colors" style={{ backgroundColor: theme.primary }}>← Retour à l'accueil</a>
      </div>
    );
  }

  if (program.landingPage && !program.landingPage.enabled) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white text-center px-6">
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="font-black text-3xl mb-3">Landing Page Désactivée</h1>
        <p className="text-gray-400 font-medium max-w-sm">Activez-la depuis le panneau d'administration.</p>
        <a href="/" className="mt-8 px-6 py-3 text-black font-black rounded-xl border-2 border-black transition-colors" style={{ backgroundColor: theme.primary }}>← Retour au site</a>
      </div>
    );
  }

  const gallery = (lp?.galleryImages && Array.isArray(lp.galleryImages) && lp.galleryImages.length > 0) ? lp.galleryImages : [];
  const scrollToMissions = () => missionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  const t = (key: keyof typeof D): string => {
    const val = (lp as any)?.[key];
    if (typeof val === 'string' && val.trim() !== '') return val;
    return (D as any)[key] || '';
  };

  let visibleMissions: (Mission | MissionBox)[] = [];
  if (lp?.missionIds && lp.missionIds.length > 0) {
    visibleMissions = missions.filter(m => lp.missionIds!.includes(m.id) && m.active !== false);
  } else if (lp?.missionBoxes && lp.missionBoxes.length > 0) {
    visibleMissions = lp.missionBoxes;
  } else {
    visibleMissions = missions.filter(m => m.status !== 'full' && m.active !== false);
  }

  return (
    <>
      <style>{STYLES}</style>

      <div className="font-sans text-white bg-black overflow-x-hidden" style={{ 
        '--theme-text': theme.primary,
        '--theme-primary': theme.primary,
        '--theme-primary-rgb': theme.primaryRGB,
        '--theme-pulse': `rgba(${theme.primaryRGB}, 0.7)`,
        '--theme-shimmer': theme.shimmer,
        '--theme-primary-hover': theme.primaryHover,
        '--theme-border': theme.glow.replace('.22', '.3'),
        '--theme-glow': theme.glow,
        '--theme-accent': theme.accent,
      } as React.CSSProperties}>

        {/* ═══ ANNOUNCEMENT TICKER ══════════════════════════════════════════ */}
        <div className={`${theme.bg} text-black py-2 overflow-hidden relative`}>
          <div className="ticker-inner">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex items-center gap-8 px-8">
                {['🔥 Places limitées à 20 Makers', '⚡ Projets 100% réels — Zéro Lego', '🏆 Built Not Bought — Philosophie Makerlab', '🚀 Votre enfant repart avec SON projet', '🔥 Places limitées à 20 Makers'].map((t, j) => (
                  <span key={j} className="font-black text-sm uppercase tracking-widest whitespace-nowrap">{t}</span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ═══ BLOCK 1 — HERO ══════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center noise-bg overflow-hidden" style={{ background: theme.gradient }}>
          {/* Glow orbs */}
          <div className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle,${theme.glow} 0%,transparent 70%)` }} />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle,${theme.glow} 0%,transparent 70%)` }} />
          {/* Floating grid dots */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(${theme.glow} 1px,transparent 1px)`, backgroundSize: '40px 40px' }} />

          <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
            {/* Brand pill */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
              <Zap size={14} className={theme.text} fill="currentColor" />
              <div className="flex items-center gap-4">
                <span className={`text-xs font-black uppercase tracking-widest ${theme.text}`}>Makerlab Academy — Casablanca</span>
                <Countdown theme={theme} />
              </div>
            </div>

            {/* Pre-headline */}
            <p className="text-red-400 font-black text-sm md:text-base uppercase tracking-widest mb-5">{t('heroPreHeadline')}</p>

            {/* Headline with shimmer effect */}
            <h1 className="font-black text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 shimmer-text" style={{ background: theme.shimmer, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{t('heroHeadline')}</h1>

            {/* Sub-headline */}
            <p className="text-lg md:text-xl text-gray-300 font-medium max-w-3xl mx-auto mb-10 leading-relaxed">{t('heroSubHeadline')}</p>

            {/* CTA */}
            <button onClick={scrollToMissions} className={`cta-pulse hover-theme inline-flex items-center gap-3 px-8 py-5 text-black font-black text-lg md:text-xl uppercase tracking-widest border-4 border-black rounded-2xl transition-all relative z-10`}
              style={{ backgroundColor: theme.primary }}>
              <Rocket size={24} strokeWidth={3} />{t('heroCtaText')}<ArrowRight size={24} strokeWidth={3} />
            </button>
            <p className="mt-4 text-sm text-gray-400 font-medium">{t('heroScarcityText')}</p>

            {/* Quick stats pills */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {[
                { icon: <Clock size={14} />, label: program.duration || '3 Heures' },
                { icon: <Star size={14} />, label: `Âge ${program.ageGroup || '8-14 ans'}` },
                { icon: <Cpu size={14} />, label: program.price || '400 DHS' },
                { icon: <CheckCircle2 size={14} />, label: '100% Sans Lego' },
              ].map((s, i) => (
                <div key={i} className="float-y flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-gray-300" style={{ animationDelay: `${i * 0.3}s` }}>
                  <span style={{ color: `var(--theme-primary)` }}>{s.icon}</span>{s.label}
                </div>
              ))}
            </div>

            {/* Program hero image — if available */}
            {program.image && (
              <div className="mt-12 max-w-2xl mx-auto relative">
                <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(180deg,transparent 50%,#060606 100%)' }} />
                <img src={program.image} alt={program.title} className="w-full rounded-3xl border-2 border-white/10 object-cover max-h-72" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                  <div className="px-4 py-2 bg-black/70 backdrop-blur-sm border border-white/10 rounded-full text-xs font-black uppercase tracking-widest"
                    style={{ color: `var(--theme-primary)` }}>
                    {program.title}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <div className={`flex flex-col items-center gap-1 text-gray-600 cursor-pointer hover:${theme.text} transition-colors`} onClick={scrollToMissions}>
                <span className="text-xs font-bold uppercase tracking-widest">Découvrir</span>
                <ChevronDown size={20} className="animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ANIMATED STATS BAND ══════════════════════════════════════════ */}
        <div ref={statsRef} className="py-14 px-6 border-y-2" style={{ background: '#0d0d0d', borderColor: `rgba(${theme.primaryRGB}, 0.15)` }}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={500} suffix="+" label="Makers Formés" inView={statsInView} theme={theme} delay={0} />
            <StatCounter value={98} suffix="%" label="Parents Satisfaits" inView={statsInView} theme={theme} delay={150} />
            <StatCounter value={3} suffix="H" label="Pour Créer un Projet Réel" inView={statsInView} theme={theme} delay={300} />
            <StatCounter value={20} label="Makers Max / Session" inView={statsInView} theme={theme} delay={450} />
          </div>
        </div>

        {/* ═══ MODULAR: INNOVATION POLES (STATIONS) ══════════════════════════ */}
        {lp?.layoutVariant === 'modular' && lp.stations && lp.stations.length > 0 && (
          <div className="bg-[#0a0a0a] pt-24 -mb-24 relative z-10">
            <div className="max-w-4xl mx-auto px-6 text-center mb-12">
               <h2 className="font-black text-4xl md:text-5xl uppercase mb-4 text-white">{lp.stationsHeadline || 'Les Pôles d\'Innovation'}</h2>
            </div>
            <StationsGrid stations={lp.stations} theme={theme} />
          </div>
        )}

        {/* ═══ BLOCK 2 — AGITATOR ══════════════════════════════════════════ */}
        <section className="relative py-24 px-6" style={{ background: '#111' }}>
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="flex items-center gap-4 mb-14">
                <div className="flex-grow h-px bg-white/10" /><div className="w-3 h-3 rotate-45" style={{ backgroundColor: `var(--theme-primary)` }} /><div className="flex-grow h-px bg-white/10" />
              </div>
            </Reveal>

            {/* Big side-by-side comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14">
              <Reveal delay={0}>
                <div className="h-full p-7 border-2 border-white/10 rounded-3xl bg-white/2 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 to-transparent" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/40 border border-red-800/50 rounded-full text-xs font-black text-red-400 uppercase mb-4">❌ Les Autres</div>
                    <h3 className="font-black text-2xl text-gray-400 mb-4">CONSOMMATION</h3>
                    <ul className="space-y-3">
                      {["Kits préfabriqués Lego / Robotiko", "Manuel d'instructions rigide", "Assemblage passif et guidé", "Résultat identique pour tous", "Aucune compétence transférable"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-500 font-medium text-sm">
                          <span className="w-5 h-5 rounded-full bg-red-900/50 flex items-center justify-center text-red-500 text-xs font-black shrink-0">✕</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className={`h-full p-7 border-2 rounded-3xl relative group overflow-hidden`} style={{ borderColor: `var(--theme-border)`, background: `${theme.glow.replace('.22','.06')}` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ background: `radial-gradient(circle,${theme.glow} 0%,transparent 70%)` }} />
                  <div className="relative z-10">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-xs font-black uppercase mb-4`} style={{ background: `${theme.glow.replace('.22','.3')}`, color: `var(--theme-text)`, borderColor: `${theme.glow.replace('.22','.4')}` }}>✅ Makerlab</div>
                    <h3 className={`font-black text-2xl mb-4`} style={{ color: `var(--theme-text)` }}>CRÉATION</h3>
                    <ul className="space-y-3">
                      {["Vrais logiciels de CAO & modélisation 3D", "Fers à souder & composants Arduino réels", "Découpe laser & impression 3D", "Projet 100% unique signé à leur nom", "Compétences réelles d'ingénieur"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-gray-200 font-medium text-sm">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0`} style={{ background: `var(--theme-glow)`, color: `var(--theme-primary)` }}>✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal>
              <h2 className="font-black text-3xl md:text-5xl text-center leading-tight mb-8">
                {t('agitatorHeadline').split('. ').map((part: string, i: number, arr: string[]) => (
                  <span key={i}>{i === 1 ? <em className="not-italic" style={{ color: `var(--theme-primary)` }}>{part}</em> : part}{i < arr.length - 1 ? '. ' : ''}</span>
                ))}
              </h2>
              {t('agitatorBody').split('\n\n').map((para: string, i: number) => (
                <p key={i} className={`text-gray-300 font-medium leading-relaxed mb-4 max-w-3xl mx-auto text-center ${i === 0 ? 'text-lg' : ''}`}>
                  {para.split('BUILT NOT BOUGHT').map((part: string, j: number, arr: string[]) => (
                    <React.Fragment key={j}>{part}{j < arr.length - 1 && <strong className="font-black" style={{ color: `var(--theme-primary)` }}> BUILT NOT BOUGHT </strong>}</React.Fragment>
                  ))}
                </p>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══ MASONRY GALLERY ══════════════════════════════════════════════ */}
        {(gallery.length > 0 || program.image) && (
          <section className="py-10 px-4 overflow-hidden" style={{ background: '#0a0a0a' }}>
            <Reveal>
              <p className="text-center text-xs font-black uppercase tracking-widest text-gray-600 mb-6">📸 Nos Makers en Action — Preuve Visuelle</p>
            </Reveal>
            <div className={`mx-auto grid gap-3 ${
              gallery.length === 1 ? 'max-w-4xl grid-cols-1' :
              gallery.length === 2 ? 'max-w-5xl grid-cols-1 sm:grid-cols-2' :
              gallery.length === 4 ? 'max-w-4xl grid-cols-2' :
              'max-w-6xl grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {(gallery.length > 0 ? gallery : [program.image]).map((url, i) => (
                <div key={i} className="relative overflow-hidden rounded-3xl border-2 border-white/5 group bg-white/5 aspect-square shadow-2xl" style={{ animationDelay: `${i * 80}ms` }}>
                  <img src={url} alt={`Makerlab Action ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ═══ BLOCK 3 — THE TRACKS (BINARY CHOICE) ══════════════════════════ */}
        <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#0a0a0a 0%,#130800 50%,#0a0a0a 100%)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `radial-gradient(rgba(${theme.primaryRGB},.07) 1px,transparent 1px)`, backgroundSize: '32px 32px' }} />
          <div className="max-w-6xl mx-auto relative z-10">
            <Reveal>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4" style={{ borderColor: `var(--theme-border)` }}>
                  <Zap size={14} style={{ color: `var(--theme-primary)` }} /><span className="text-xs font-black uppercase tracking-widest" style={{ color: `var(--theme-primary)` }}>Le Parcours</span>
                </div>
                <h2 className="font-black text-4xl md:text-5xl lg:text-6xl mb-4 text-white">Choisissez Son Super-Pouvoir</h2>
                <p className="text-xl text-gray-400 font-medium">Sélectionnez le parcours complet (3 semaines) qui correspond à sa passion.</p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
              {tracks?.filter(t => t.active !== false).map((track, i) => (
                <Reveal key={track.id} delay={i * 100}>
                  <div className="relative rounded-3xl border-4 border-white/10 bg-black/50 overflow-hidden card-theme transition-all duration-300 group shadow-2xl flex flex-col h-full"
                    style={{ borderColor: `rgba(${theme.primaryRGB}, 0.1)` }}>
                    <div className="h-48 bg-gray-900 border-b-4 border-white/10 relative overflow-hidden shrink-0">
                      {track.coverImage ? (
                        <img src={track.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-gray-900"><Cpu size={48} className="text-gray-800" /></div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                         <div className="text-black text-[10px] font-black uppercase px-2 py-1 inline-block rounded border-2 border-black" style={{ backgroundColor: `var(--theme-primary)` }}>3 SESSIONS INTENSIVES</div>
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-grow text-left text-white">
                      <h3 className="font-black text-2xl mb-3 leading-tight text-white">{track.title}</h3>
                      <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6 flex-grow">{track.description}</p>
                      
                      <ul className="space-y-3 mb-8">
                        {track.benefits?.filter(Boolean).map((benefit, bi) => (
                          <li key={bi} className="flex gap-3 text-sm font-bold items-start text-gray-300">
                             <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
                             <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-auto pt-6 border-t-2 border-white/10 flex flex-col gap-4">
                        <div className="text-center">
                          <span className="text-3xl font-black text-white block mb-1">{track.price}</span>
                          <span className="text-xs text-gray-500 uppercase tracking-widest font-black">Paiement sur place</span>
                        </div>
                        <button
                          onClick={() => setSelectedTarget(track)}
                          className="w-full py-4 text-black font-black text-sm uppercase tracking-widest border-4 border-black rounded-xl shadow-[5px_5px_0_0_#fff] hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#fff] transition-all"
                          style={{ backgroundColor: `var(--theme-primary)` }}
                        >
                          SÉLECTIONNER CE PARCOURS
                        </button>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            
            <Reveal>
              <div className={`text-center p-10 border-2 rounded-3xl relative overflow-hidden`} style={{ borderColor: `var(--theme-border)`, background: `${theme.glow.replace('.22','.05')}` }}>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: `radial-gradient(circle,${theme.glow} 0%,transparent 70%)` }} />
                <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: `radial-gradient(circle,${theme.glow} 0%,transparent 70%)` }} />
                <p className="font-black text-2xl md:text-3xl mb-3 relative z-10 text-white leading-tight">
                  À la fin des 3 semaines, ils ramènent à la maison <span style={{ color: `var(--theme-primary)` }}>tous leurs projets</span>, étiquetés à leur nom.
                </p>
                <p className="font-black text-4xl md:text-5xl mt-6 shimmer-text underline decoration-4 underline-offset-8" style={{ color: `var(--theme-primary)` }}>STOP PLAYING, START MAKING.</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ════════════════════════════════════════════════ */}
        <TestimonialsSection theme={theme} />

        {/* ═══ BLOCK 4 — SINGLE MISSIONS (Make & Go) ═══════════════════════ */}
        {visibleMissions.length > 0 && (
          <section ref={missionsRef} id="missions" className="py-24 px-6" style={{ background: '#111' }}>
            <div className="max-w-4xl mx-auto">
              <Reveal>
                <div className="text-center mb-16">
                  <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-3">⬇ SESSIONS À LA CARTE</p>
                  <h2 className="font-black text-4xl md:text-5xl mb-4 text-white">Pas prêt pour le parcours<br/>complet ?</h2>
                  <p className="text-gray-400 font-medium mx-auto leading-relaxed text-lg">
                    Laissez votre enfant essayer une seule <span className={`font-bold ${theme.text}`}>Mission d'Essai (3 heures)</span>. S'il adore, on déduira le prix si vous passez au Pack.
                  </p>
                  
                  {lp?.layoutVariant === 'modular' && lp.perks && lp.perks.length > 0 && (
                    <div className="mt-12 text-left">
                       <p className="text-center text-xs font-black uppercase tracking-widest text-gray-500 mb-6">{lp.perksHeadline || 'Logistique & Avantages'}</p>
                       <PerksList perks={lp.perks} theme={theme} />
                    </div>
                  )}
                </div>
              </Reveal>

              <div className="space-y-4">
                {visibleMissions.map((mission, mi) => {
                  const isMissionBox = 'theme' in mission;
                  const m = {
                    id: mission.id,
                    title: isMissionBox ? (mission as MissionBox).theme : (mission as Mission).title,
                    description: isMissionBox ? '' : (mission as Mission).description,
                    coverImage: isMissionBox ? undefined : (mission as Mission).coverImage,
                    date: mission.date,
                    price: mission.price,
                    spotsTotal: mission.spotsTotal,
                    spotsLeft: mission.spotsLeft,
                    status: mission.status
                  };
                  
                  const isLimited = m.status === 'limited';
                  const total = m.spotsTotal || 20;
                  const left = Math.max(0, m.spotsLeft || 0);
                  const pct = Math.min(100, ((total - left) / total) * 100);
                  
                  return (
                    <Reveal key={m.id} delay={mi * 100}>
                      <div className={`p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 ${isLimited ? 'border-red-500 bg-red-500/5 hover:-translate-x-2' : 'border-white/10 bg-black hover:-translate-x-2'}`}
                        onMouseEnter={(e) => !isLimited && (e.currentTarget.style.borderColor = 'var(--theme-primary)')}
                        onMouseLeave={(e) => !isLimited && (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                      >
                        {/* Img Thumbnail */}
                        <div className="w-full md:w-48 h-32 shrink-0 bg-gray-900 rounded-2xl border-2 border-white/10 overflow-hidden relative">
                           {m.coverImage ? (
                              <img src={m.coverImage} className="w-full h-full object-cover" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><Target size={32} className="text-gray-700" /></div>
                            )}
                            {isLimited && (
                              <div className="absolute inset-0 bg-red-500/20 isolate flex items-center justify-center pointer-events-none"></div>
                            )}
                        </div>

                        <div className="flex-grow text-white w-full">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className={`text-xs font-black uppercase px-2 py-1 bg-white/5 border border-white/10 rounded-md`} style={{ color: `var(--theme-primary)` }}>
                              {m.date}
                            </span>
                            {isLimited && (
                              <span className="text-xs text-red-100 font-black uppercase px-2 py-1 bg-red-600 border border-red-700 rounded-md animate-pulse">
                                🔥 {m.spotsLeft} places !
                              </span>
                            )}
                          </div>
                          <h3 className="font-black text-2xl mb-1">{m.title}</h3>
                          <p className="text-sm text-gray-400 font-medium line-clamp-2 md:line-clamp-1 mb-4">{m.description}</p>
                          
                          <div className="flex items-center gap-4">
                            <div className="h-2 w-48 bg-white/10 rounded-full overflow-hidden shrink-0">
                                <div className={`h-full rounded-full transition-all duration-1000 ${isLimited ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] text-gray-500 font-black uppercase">{m.spotsTotal - m.spotsLeft}/{m.spotsTotal} réservées</span>
                          </div>
                        </div>

                        <div className="shrink-0 text-center md:text-right w-full md:w-auto">
                          <div className="mb-3 text-white">
                            <span className="font-black text-2xl">{m.price}</span>
                          </div>
                          <button
                            onClick={() => setSelectedTarget(mission as any)}
                            className="w-full md:w-auto px-6 py-4 font-black uppercase tracking-widest text-xs border-4 rounded-xl transition-all whitespace-nowrap border-black text-black hover-theme shadow-[3px_3px_0_0_black]"
                            style={{ backgroundColor: theme.primary, boxShadow: `5px 5px 0 0 ${theme.glow.replace('.22', '.3')}` }}
                          >
                            {lp?.ctaMode === 'lead' ? 'EN SAVOIR PLUS →' : 'RÉSERVER UNE PLACE →'}
                          </button>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══ BLOCK 5 — FAQ ═══════════════════════════════════════════════ */}
        {(lp?.faqEnabled !== false) && (
          <section className="py-24 px-6" style={{ background: '#0a0a0a' }}>
            <div className="max-w-3xl mx-auto">
              <Reveal>
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
                    <Shield size={14} className="text-green-400" /><span className="text-green-400 text-xs font-black uppercase tracking-widest">Garantie Sans Risque</span>
                  </div>
                  <h2 className="font-black text-4xl md:text-5xl">Vous Hésitez Encore ?</h2>
                </div>
              </Reveal>
              <div className="space-y-4">
                {[
                  { q: "Mon enfant n'a jamais codé. Est-ce un problème ?", a: 'Absolument pas. Nos mentors accompagnent chaque enfant pas-à-pas. Ils passeront de "débutant absolu" à "créateur fier" en une après-midi.' },
                  { q: 'Dois-je rester sur place pendant les 3 heures ?', a: "Non ! Déposez-les, profitez de votre après-midi l'esprit tranquille, et revenez à 17h30 pour découvrir ce qu'ils ont fabriqué." },
                  { q: 'Est-ce vraiment sans Lego ?', a: '100% sans Lego. Nous utilisons du vrai bois (MDF), de véritables composants électroniques (Arduino), et de vrais outils de fabrication.' },
                ].map((faq, i) => <Reveal key={i} delay={i * 80}><FaqItem question={faq.q} answer={faq.a} theme={theme} /></Reveal>)}
              </div>
              <Reveal>
                <div className="mt-10 flex flex-wrap justify-center gap-4">
                  {[
                    { icon: <Shield size={16} />, text: 'Remboursé si non satisfait' },
                    { icon: <CheckCircle2 size={16} />, text: 'Mentors certifiés' },
                    { icon: <AlertTriangle size={16} />, text: 'Max 20 enfants / session' },
                  ].map((b, i) => (
                    <div key={i} className="float-y flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-gray-400" style={{ animationDelay: `${i * .4}s` }}>
                      <span className="text-green-400">{b.icon}</span>{b.text}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* ═══ BLOCK 6 — FINAL CTA ═════════════════════════════════════════ */}
        <section className="relative py-28 px-6 text-center overflow-hidden" style={{ background: theme.gradient }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% 100%,${theme.glow} 0%,transparent 70%)` }} />
          <div className="max-w-2xl mx-auto relative z-10">
            <Reveal>
              <h2 className="font-black text-4xl md:text-6xl mb-6 leading-tight">
                {t('finalCtaHeadline')} <span className={theme.text}>💡</span>
              </h2>
              <p className="text-gray-300 text-lg font-medium mb-10 leading-relaxed">{t('finalCtaBody')}</p>
              <button 
                onClick={scrollToMissions} 
                className="cta-pulse hover-theme inline-flex items-center gap-3 px-10 py-5 text-black font-black text-xl uppercase tracking-widest border-4 border-black rounded-2xl transition-all"
                style={{ backgroundColor: theme.primary }}
              >
                <Rocket size={24} strokeWidth={3} />VOIR LES MISSIONS DISPONIBLES
              </button>
            </Reveal>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-600 font-medium">
            © {new Date().getFullYear()} Makerlab Academy — Casablanca, Maroc
          </div>
        </section>
      </div>

      {/* ═══ STICKY BOTTOM CTA BAR ═══════════════════════════════════════════ */}
      <div className={`fixed bottom-0 left-0 right-0 z-[150] transition-transform duration-500 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className={`bg-black border-t-4 px-4 py-3 flex items-center justify-between gap-4 max-w-6xl mx-auto`} style={{ borderColor: theme.primary }}>
          <div className="hidden sm:block">
            <p className="font-black text-white text-sm">Inscriptions Ouvertes Make & Go</p>
            <p className={`${theme.text} font-black text-xs`}>Packs de 3 semaines ou Sessions Uniques.</p>
          </div>
          <button className="sm:hidden text-white font-bold text-sm">🚀 Places Limitées !</button>
          <button
            onClick={scrollToMissions}
            className="shrink-0 px-6 py-3 text-black font-black text-sm uppercase tracking-widest border-2 border-black rounded-xl transition-all shadow-[3px_3px_0_0_rgba(255,255,255,.3)] hover-theme"
            style={{ backgroundColor: theme.primary }}
          >
            SÉCURISER MA PLACE →
          </button>
        </div>
      </div>

      {/* ═══ WHATSAPP FLOATING BUTTON ════════════════════════════════════════ */}
      <a
        href="https://wa.me/212600000000?text=Bonjour%20Makerlab%20!%20Je%20voudrais%20réserver%20une%20place%20pour%20mon%20enfant."
        target="_blank"
        rel="noopener noreferrer"
        className="wa-btn fixed z-[140] bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,.4)] border-4 border-black hover:bg-green-400 transition-colors"
        style={{ bottom: showStickyBar ? '80px' : '24px', right: '20px', width: 60, height: 60, transition: 'bottom .4s ease' }}
        title="Contactez-nous sur WhatsApp"
      >
        <MessageCircle size={28} strokeWidth={2.5} />
      </a>

      {/* ═══ DRAWER CHECKOUT ═════════════════════════════════════════════════ */}
      <DrawerCheckout 
        selection={selectedTarget} 
        programId={program.id} 
        programTitle={program.title} 
        theme={theme}
        ctaMode={lp?.ctaMode}
        onClose={() => setSelectedTarget(null)} 
      />
    </>
  );
};
