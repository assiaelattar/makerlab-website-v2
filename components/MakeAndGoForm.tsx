import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Cpu, Shirt, Gamepad2, Wrench,
  Loader2, CheckCircle2, Sparkles, Flame, Zap, Calendar, HelpCircle, Tag,
} from 'lucide-react';

/* ─── Internal types ─────────────────────────────────────────────────────── */
type AgeTag        = 'AGE_YOUNG' | 'AGE_CORE';
type TrackTag      = 'TRACK_ROBOT' | 'TRACK_FOUNDER' | 'TRACK_GAME' | 'TRACK_MAKER';
type MotivationTag = 'MOTIVATION_MAKER' | 'MOTIVATION_SCREENS' | 'MOTIVATION_TECH';
type UrgencyTag    = 'URGENCY_NOW' | 'URGENCY_SOON' | 'URGENCY_LATER' | 'URGENCY_COLD';
type PriceTag      = 'PRICE_OK' | 'PRICE_MAYBE' | 'PRICE_NO';
type Tier          = 'Tier_1_Hot' | 'Tier_2_Warm' | 'Tier_3_Cold';
type Step          = 1 | 2 | 3 | 4 | 5 | 6;

interface HiddenScore {
  total: number;
  ageTag:        AgeTag        | '';
  trackTag:      TrackTag      | '';
  motivationTag: MotivationTag | '';
  urgencyTag:    UrgencyTag    | '';
  priceTag:      PriceTag      | '';
}

interface ContactData { childName: string; parentName: string; phone: string; }

function computeTier(score: number): Tier {
  if (score >= 8) return 'Tier_1_Hot';
  if (score >= 5) return 'Tier_2_Warm';
  return 'Tier_3_Cold';
}
function tierToRedirect(tier: Tier): string {
  if (tier === 'Tier_1_Hot')  return '/priority-booking';
  if (tier === 'Tier_2_Warm') return '/merci';
  return '/decouvrir';
}

/* ─────────────────────────────────────────────────────────────────
   Compact touch-friendly card — designed for mobile-first:
   min-h 52px, big touch target, instant active feedback
──────────────────────────────────────────────────────────────────── */
const Card: React.FC<{
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ selected, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      w-full text-left rounded-xl border-[2.5px] transition-all duration-150 active:scale-[0.97]
      ${selected
        ? 'bg-[#CC0000] text-white border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]'
        : 'bg-white text-black border-gray-200 hover:border-gray-400'
      }
    `}
  >
    {children}
  </button>
);

/* ─── Step header (question title + subtitle) ────────────────────────────── */
const Q: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <div className="mb-3">
    <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl uppercase leading-tight">{title}</h2>
    {sub && <p className="text-gray-400 text-xs font-semibold mt-1">{sub}</p>}
  </div>
);

/* ─── Segmented progress ─────────────────────────────────────────────────── */
const Progress: React.FC<{ step: Step; total: number }> = ({ step, total }) => (
  <div className="flex-none mb-4">
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Étape {step}/{total}</span>
      <span className="text-[10px] font-black uppercase tracking-widest text-[#E8580A]">{Math.round((step/total)*100)}%</span>
    </div>
    <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`flex-1 h-[5px] rounded-full transition-all duration-400 ${i < step ? 'bg-[#CC0000]' : 'bg-gray-100'}`} />
      ))}
    </div>
  </div>
);

/* ─── Back button ──────────────────────────────────────────────────────────*/
const Back: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors py-1">
    <ChevronLeft size={14} strokeWidth={3} /> Retour
  </button>
);

/* ─── Continue/Primary button ───────────────────────────────────────────── */
const Cta: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  variant?: 'black' | 'red' | 'gray';
  loading?: boolean;
}> = ({ onClick, disabled, label = 'Continuer', variant = 'black', loading }) => {
  const colors = {
    black: 'bg-black text-white',
    red:   'bg-[#CC0000] text-white',
    gray:  'bg-gray-400 text-white',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full py-4 rounded-xl border-[2.5px] border-black font-display font-black text-base uppercase
        flex items-center justify-center gap-2
        shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5
        active:shadow-none active:translate-x-0.5 active:translate-y-0.5
        transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
        ${colors[variant]}
      `}
    >
      {loading ? <><Loader2 size={18} className="animate-spin" /> Envoi…</> : <>{label} <ChevronRight size={18} strokeWidth={3} /></>}
    </button>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   Layout: flex-col h-full — Progress at top, options in flex-1, button at bottom
   → nothing ever needs to scroll on a standard mobile screen
══════════════════════════════════════════════════════════════════════════ */
export interface MakeAndGoContext {
  programTitle?: string;
  missionTheme?: string;
  missionDate?: string;
}

export const MakeAndGoForm: React.FC<{ context?: MakeAndGoContext }> = ({ context }) => {
  const navigate = useNavigate();

  const [step, setStep]       = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [hs, setHs] = useState<HiddenScore>({
    total: 0, ageTag: '', trackTag: '', motivationTag: '', urgencyTag: '', priceTag: '',
  });

  const [selectedAge,        setSelectedAge]        = useState('');
  const [selectedTrack,      setSelectedTrack]      = useState('');
  const [selectedMotivation, setSelectedMotivation] = useState('');
  const [selectedUrgency,    setSelectedUrgency]    = useState('');
  const [selectedPrice,      setSelectedPrice]      = useState('');
  const [contact, setContact] = useState<ContactData>({ childName: '', parentName: '', phone: '' });

  const goNext = () => setStep(prev => (prev + 1) as Step);
  const goBack = () => setStep(prev => (Math.max(1, prev - 1)) as Step);

  /* Handlers */
  const handleAge = (raw: string, tag: AgeTag | null, pts: number) => {
    if (!tag) { navigate((import.meta as any).env?.VITE_STEMQUEST_REDIRECT_URL || '/programs'); return; }
    setSelectedAge(raw);
    setHs(h => ({ ...h, total: h.total + pts, ageTag: tag }));
    setTimeout(goNext, 220);
  };
  const handleTrack = (raw: string, tag: TrackTag) => {
    setSelectedTrack(raw);
    setHs(h => ({ ...h, total: h.total + 1, trackTag: tag }));
    setTimeout(goNext, 220);
  };
  const handleMotivation = (raw: string, tag: MotivationTag, pts: number) => {
    setSelectedMotivation(raw);
    setHs(h => ({ ...h, total: h.total + pts, motivationTag: tag }));
    setTimeout(goNext, 220);
  };
  const handleUrgency = (raw: string, tag: UrgencyTag) => {
    setSelectedUrgency(raw);
    setHs(h => ({ ...h, urgencyTag: tag }));
  };
  const handlePrice = (raw: string, tag: PriceTag) => {
    setSelectedPrice(raw);
    setHs(h => ({ ...h, priceTag: tag }));
  };

  const urgencyPts: Record<UrgencyTag, number> = { URGENCY_NOW: 3, URGENCY_SOON: 2, URGENCY_LATER: 1, URGENCY_COLD: 0 };
  const pricePts:   Record<PriceTag,   number> = { PRICE_OK: 3, PRICE_MAYBE: 2, PRICE_NO: -10 };

  const handlePriceContinue = () => {
    if (hs.priceTag === 'PRICE_NO') { navigate('/decouvrir'); return; }
    goNext();
  };

  const handleSubmit = async () => {
    if (!contact.childName.trim() || !contact.parentName.trim() || !contact.phone.trim()) return;
    setLoading(true);
    setError('');
    const urgTag = hs.urgencyTag || 'URGENCY_COLD' as UrgencyTag;
    const priceTag = hs.priceTag || 'PRICE_MAYBE' as PriceTag;
    const finalScore = hs.total + urgencyPts[urgTag] + pricePts[priceTag];
    const finalTier  = computeTier(finalScore);
    const payload = {
      child_name: contact.childName.trim(), parent_name: contact.parentName.trim(),
      phone: contact.phone.trim(), track: hs.trackTag, age_tag: hs.ageTag,
      motivation_tag: hs.motivationTag, urgency_tag: urgTag, price_tag: priceTag,
      lead_score: finalScore, lead_tier: finalTier, submitted_at: new Date().toISOString(),
      // Context properties (Strategy B)
      program_title: context?.programTitle,
      mission_theme: context?.missionTheme,
      mission_date: context?.missionDate,
    };
    // Persist child name so post-conversion pages can personalise their greeting
    try { sessionStorage.setItem('mg_child_name', contact.childName.trim()); } catch { /* ignore */ }
    try {
      const res = await fetch('/api/make-and-go-lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      if (res.ok) { const d = await res.json(); navigate(d.redirect_url || tierToRedirect(finalTier)); }
      else navigate(tierToRedirect(finalTier));
    } catch { navigate(tierToRedirect(finalTier)); }
    finally { setLoading(false); }
  };

  /* ════════════════════════════════════════════════════════════════════
     RENDER — each step is a column: [progress][content-flex-1][cta]
     This guarantees the button is always visible without scrolling.
  ════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col h-full min-h-0">
      <Progress step={step} total={6} />

      {/* ── STEP 1: Age ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col flex-1 min-h-0">
          <Q title="Votre enfant a quel âge ?" sub="Chaque Mission est calibrée par tranche d'âge" />
          <div className="grid grid-cols-2 gap-2.5 flex-1 content-start">
            {[
              { label: '8 – 9 ans',   emoji: '🌱', tag: 'AGE_YOUNG' as AgeTag, pts: 1, val: '8-9'  },
              { label: '10 – 12 ans', emoji: '⚡', tag: 'AGE_CORE'  as AgeTag, pts: 2, val: '10-12' },
              { label: '13 – 14 ans', emoji: '🚀', tag: 'AGE_CORE'  as AgeTag, pts: 2, val: '13-14' },
              { label: '15 ans +',    emoji: '🎓', tag: null,                   pts: 0, val: '15+'   },
            ].map(opt => (
              <Card key={opt.val} selected={selectedAge === opt.val} onClick={() => handleAge(opt.val, opt.tag as AgeTag | null, opt.pts)}>
                <div className="flex flex-col items-center gap-1.5 py-4">
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="font-display font-black text-sm uppercase text-center leading-tight">{opt.label}</span>
                  {opt.val === '15+' && (
                    <span className={`text-[9px] font-black uppercase ${selectedAge === '15+' ? 'text-white/60' : 'text-gray-400'}`}>→ StemQuest</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <p className="text-center text-[10px] font-black uppercase text-gray-300 tracking-widest mt-3">
            Sélection automatique — pas besoin de valider
          </p>
        </div>
      )}

      {/* ── STEP 2: Track ───────────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col flex-1 min-h-0">
          <Q title="Qu'est-ce qui l'attire le plus ?" sub="On choisit la Mission parfaite" />
          <div className="space-y-2 flex-1 content-start">
            {[
              { label: "Les robots et l'électronique",  emoji: '🤖', tag: 'TRACK_ROBOT'   as TrackTag, icon: <Cpu size={18} />,      val: 'TRACK_ROBOT',   c: 'text-blue-600 bg-blue-50 border-blue-200' },
              { label: 'Créer sa propre marque',        emoji: '👕', tag: 'TRACK_FOUNDER' as TrackTag, icon: <Shirt size={18} />,    val: 'TRACK_FOUNDER', c: 'text-pink-600 bg-pink-50 border-pink-200' },
              { label: 'Coder ses jeux vidéo',          emoji: '🎮', tag: 'TRACK_GAME'    as TrackTag, icon: <Gamepad2 size={18} />, val: 'TRACK_GAME',    c: 'text-purple-600 bg-purple-50 border-purple-200' },
              { label: 'Fabriquer des objets',          emoji: '🔧', tag: 'TRACK_MAKER'   as TrackTag, icon: <Wrench size={18} />,   val: 'TRACK_MAKER',   c: 'text-orange-600 bg-orange-50 border-orange-200' },
            ].map(opt => (
              <Card key={opt.val} selected={selectedTrack === opt.val} onClick={() => handleTrack(opt.val, opt.tag)}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className={`p-1.5 rounded-lg border shrink-0 ${selectedTrack === opt.val ? 'bg-white/10 border-white/20 text-white' : opt.c}`}>
                    {opt.icon}
                  </div>
                  <span className="font-display font-black text-sm uppercase flex-1 leading-tight">{opt.label}</span>
                  <span className="text-xl shrink-0">{opt.emoji}</span>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-3"><Back onClick={goBack} /></div>
        </div>
      )}

      {/* ── STEP 3: Motivation ──────────────────────────────────────── */}
      {step === 3 && (
        <div className="flex flex-col flex-1 min-h-0">
          <Q title="Qu'est-ce qui décrit le mieux votre enfant ?" sub="Pour adapter le niveau de la Mission" />
          <div className="space-y-2 flex-1 content-start">
            {[
              { label: 'Démonte tout pour comprendre', emoji: '🔩', tag: 'MOTIVATION_MAKER'   as MotivationTag, pts: 3, note: 'Profil Maker pur' },
              { label: "Trop d'écrans, pas assez créatif", emoji: '📱', tag: 'MOTIVATION_SCREENS' as MotivationTag, pts: 2, note: "On transforme ça en vrai projet" },
              { label: 'Bases en coding ou tech',      emoji: '💻', tag: 'MOTIVATION_TECH'    as MotivationTag, pts: 3, note: 'On va aller plus loin ensemble' },
            ].map((opt, i) => (
              <Card key={i} selected={selectedMotivation === opt.label} onClick={() => handleMotivation(opt.label, opt.tag, opt.pts)}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-2xl shrink-0">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-display font-black text-sm uppercase block leading-tight">{opt.label}</span>
                    <span className={`text-[10px] font-bold uppercase ${selectedMotivation === opt.label ? 'text-white/60' : 'text-[#E8580A]'}`}>{opt.note}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-3"><Back onClick={goBack} /></div>
        </div>
      )}

      {/* ── STEP 4: Urgency ─────────────────────────────────────────── */}
      {step === 4 && (
        <div className="flex flex-col flex-1 min-h-0">
          <Q title="Quand souhaitez-vous réserver ?" sub="Samedi après-midi · 14h30 – 17h30" />
          <div className="space-y-2 flex-1 content-start">
            {[
              { label: 'Ce week-end',              emoji: '🔥', icon: <Flame size={16}/>,      tag: 'URGENCY_NOW'   as UrgencyTag },
              { label: 'Dans 2 prochaines semaines', emoji: '⚡', icon: <Zap size={16}/>,        tag: 'URGENCY_SOON'  as UrgencyTag },
              { label: 'Pour les vacances',        emoji: '📅', icon: <Calendar size={16}/>,   tag: 'URGENCY_LATER' as UrgencyTag },
              { label: 'Pas encore sûr',           emoji: '🤔', icon: <HelpCircle size={16}/>, tag: 'URGENCY_COLD'  as UrgencyTag },
            ].map(opt => (
              <Card key={opt.tag} selected={selectedUrgency === opt.label} onClick={() => handleUrgency(opt.label, opt.tag)}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className={`shrink-0 ${selectedUrgency === opt.label ? 'text-white' : 'text-[#E8580A]'}`}>{opt.icon}</span>
                  <span className="font-display font-black text-sm uppercase flex-1">{opt.label}</span>
                  <span className="text-lg shrink-0">{opt.emoji}</span>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <Cta onClick={goNext} disabled={!selectedUrgency} label="Continuer" />
            <Back onClick={goBack} />
          </div>
        </div>
      )}

      {/* ── STEP 5: Price ───────────────────────────────────────────── */}
      {step === 5 && (
        <div className="flex flex-col flex-1 min-h-0">
          <Q title="La session Make & Go est à 400 DHS" sub="Matériel inclus · Votre enfant repart avec son Trophée" />

          {/* Compact price pill */}
          <div className="flex items-center gap-3 bg-black text-white rounded-xl px-4 py-3 mb-3 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]">
            <span className="font-display font-black text-2xl">400 DHS</span>
            <div className="flex-1 space-y-0.5">
              {['3h · Matériel fourni', 'Encadrement expert', 'Repart avec son Trophée'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={11} className="text-[#E8580A] shrink-0" />
                  <span className="text-[10px] font-semibold text-white/80">{t}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-[#E8580A] px-2 py-1 rounded-lg border border-white/20 shrink-0">
              <Tag size={11} /><span className="text-[9px] font-black uppercase">Inclus</span>
            </div>
          </div>

          <div className="space-y-2 flex-1 content-start">
            {[
              { label: "C'est parfait, je réserve",          emoji: '🎯', tag: 'PRICE_OK'    as PriceTag },
              { label: "Je veux d'abord en savoir plus",     emoji: '📖', tag: 'PRICE_MAYBE' as PriceTag },
              { label: "Je cherche quelque chose de gratuit", emoji: '🔍', tag: 'PRICE_NO'    as PriceTag },
            ].map(opt => (
              <Card key={opt.tag} selected={selectedPrice === opt.label} onClick={() => handlePrice(opt.label, opt.tag)}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xl shrink-0">{opt.emoji}</span>
                  <span className="font-display font-black text-sm uppercase flex-1 leading-tight">{opt.label}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            <Cta
              onClick={handlePriceContinue}
              disabled={!selectedPrice}
              label={hs.priceTag === 'PRICE_NO' ? 'Découvrir MakerLab' : 'Presque fini'}
              variant={hs.priceTag === 'PRICE_NO' ? 'gray' : 'black'}
            />
            <Back onClick={goBack} />
          </div>
        </div>
      )}

      {/* ── STEP 6: Contact ─────────────────────────────────────────── */}
      {step === 6 && (
        <div className="flex flex-col flex-1 min-h-0">
          <Q title="Réservez votre place" sub="Noufissa vous contacte sur WhatsApp sous 2h" />

          <div className="space-y-3 flex-1 content-start">
            {[
              { key: 'childName',  label: "Prénom de l'enfant",  placeholder: 'Ex : Youssef', type: 'text',  mode: 'text' },
              { key: 'parentName', label: 'Votre prénom (parent)', placeholder: 'Ex : Sara',    type: 'text',  mode: 'text' },
              { key: 'phone',      label: 'Votre WhatsApp',       placeholder: '+212 6XX XXX XXX', type: 'tel', mode: 'tel' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{f.label} *</label>
                <input
                  type={f.type}
                  inputMode={f.mode as any}
                  value={(contact as any)[f.key]}
                  onChange={e => setContact(c => ({ ...c, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full h-13 px-4 py-3.5 border-[2.5px] border-gray-200 rounded-xl font-sans font-semibold text-base focus:outline-none focus:border-black focus:ring-2 ring-black/10 bg-white transition-all"
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="text-xs font-black uppercase text-[#CC0000] text-center border-2 border-[#CC0000]/30 rounded-xl px-3 py-2 bg-red-50 mt-2">
              {error}
            </p>
          )}

          <div className="mt-3 space-y-2">
            <Cta
              onClick={handleSubmit}
              disabled={!contact.childName.trim() || !contact.parentName.trim() || !contact.phone.trim()}
              label="Réserve ta place"
              variant="red"
              loading={loading}
            />
            <p className="text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest">
              🔒 Données confidentielles · Aucune obligation
            </p>
            <Back onClick={goBack} />
          </div>
        </div>
      )}
    </div>
  );
};
