import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Cpu, Shirt, Gamepad2, Wrench,
  Loader2, CheckCircle2, Sparkles, Flame, Zap, Calendar, HelpCircle, Tag,
} from 'lucide-react';

/* ─── Internal types (never rendered to DOM) ───────────────────────────────── */
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

interface ContactData {
  childName:  string;
  parentName: string;
  phone:      string;
}

/* ─── Scoring helpers (pure functions — never touch the DOM) ─────────────── */
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

/* ─── Shared UI primitives ───────────────────────────────────────────────── */
const OptionCard: React.FC<{
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  accent?: boolean;
}> = ({ selected, onClick, children, accent }) => (
  <button
    type="button"
    onClick={onClick}
    className={`
      w-full text-left p-4 md:p-5 rounded-2xl border-[3px] transition-all duration-200 group
      ${selected
        ? 'bg-[#CC0000] text-white border-black shadow-[5px_5px_0_0_rgba(0,0,0,1)] -translate-y-0.5 translate-x-0.5'
        : accent
          ? 'bg-white text-black border-gray-300 hover:border-[#CC0000] hover:shadow-[3px_3px_0_0_rgba(204,0,0,0.3)] hover:-translate-y-0.5'
          : 'bg-white text-black border-gray-300 hover:border-black hover:shadow-[3px_3px_0_0_rgba(0,0,0,0.2)] hover:-translate-y-0.5'
      }
    `}
  >
    {children}
  </button>
);

const StepLabel: React.FC<{ step: number; label: string }> = ({ step, label }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-8 h-8 bg-[#CC0000] border-2 border-black rounded-lg flex items-center justify-center shrink-0 shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
      <span className="font-display font-black text-white text-sm">{step}</span>
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#CC0000]">{label}</span>
  </div>
);

const ProgressBar: React.FC<{ step: Step; total: number }> = ({ step, total }) => {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Étape {step}/{total}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#E8580A]">
          {pct}% complété
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#CC0000] to-[#E8580A] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────────── */
export const MakeAndGoForm: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep]       = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  /* Hidden score state — never rendered */
  const [hs, setHs] = useState<HiddenScore>({
    total: 0, ageTag: '', trackTag: '', motivationTag: '', urgencyTag: '', priceTag: '',
  });

  /* Visible selection state (only what user picks, not scores) */
  const [selectedAge,        setSelectedAge]        = useState('');
  const [selectedTrack,      setSelectedTrack]      = useState('');
  const [selectedMotivation, setSelectedMotivation] = useState('');
  const [selectedUrgency,    setSelectedUrgency]    = useState('');
  const [selectedPrice,      setSelectedPrice]      = useState('');
  const [contact, setContact] = useState<ContactData>({ childName: '', parentName: '', phone: '' });

  const goNext = () => setStep(prev => (prev + 1) as Step);
  const goBack = () => setStep(prev => (Math.max(1, prev - 1)) as Step);

  /* ── Q1: Age ─────────────────────────────────────────────────────────── */
  const handleAge = (raw: string, tag: AgeTag | null, pts: number) => {
    if (!tag) {
      // 15+ → immediate redirect, no form continuation
      const redirectUrl = (import.meta as any).env?.VITE_STEMQUEST_REDIRECT_URL || '/programs';
      navigate(redirectUrl);
      return;
    }
    setSelectedAge(raw);
    setHs(h => ({ ...h, total: h.total + pts, ageTag: tag }));
    setTimeout(goNext, 280);
  };

  /* ── Q2: Track ───────────────────────────────────────────────────────── */
  const handleTrack = (raw: string, tag: TrackTag) => {
    setSelectedTrack(raw);
    setHs(h => ({ ...h, total: h.total + 1, trackTag: tag }));
    setTimeout(goNext, 280);
  };

  /* ── Q3: Motivation ──────────────────────────────────────────────────── */
  const handleMotivation = (raw: string, tag: MotivationTag, pts: number) => {
    setSelectedMotivation(raw);
    setHs(h => ({ ...h, total: h.total + pts, motivationTag: tag }));
    setTimeout(goNext, 280);
  };

  /* ── Q4: Urgency ─────────────────────────────────────────────────────── */
  const handleUrgency = (raw: string, tag: UrgencyTag) => {
    setSelectedUrgency(raw);
    // Store tag immediately in hidden state so submit can use it directly
    setHs(h => ({ ...h, urgencyTag: tag }));
  };
  const urgencyPts: Record<UrgencyTag, number> = {
    URGENCY_NOW: 3, URGENCY_SOON: 2, URGENCY_LATER: 1, URGENCY_COLD: 0,
  };

  /* ── Q5: Price ───────────────────────────────────────────────────────── */
  const handlePrice = (raw: string, tag: PriceTag) => {
    setSelectedPrice(raw);
    // Store tag immediately in hidden state
    setHs(h => ({ ...h, priceTag: tag }));
  };
  const pricePts: Record<PriceTag, number> = {
    PRICE_OK: 3, PRICE_MAYBE: 2, PRICE_NO: -10,
  };

  /* ── Price step continue handler: PRICE_NO short-circuits to /decouvrir ─ */
  const handlePriceContinue = () => {
    if (hs.priceTag === 'PRICE_NO') {
      // Lead has declared they want something free — don't collect contact,
      // redirect immediately to the inspiration/cold page.
      navigate('/decouvrir');
      return;
    }
    goNext();
  };

  /* ── Submit ──────────────────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!contact.childName.trim() || !contact.parentName.trim() || !contact.phone.trim()) return;
    setLoading(true);
    setError('');

    // Use hs state directly — tags stored at selection time, no string comparison needed
    const urgTagResolved: UrgencyTag = hs.urgencyTag || 'URGENCY_COLD';
    const priceTagResolved: PriceTag = hs.priceTag   || 'PRICE_MAYBE';

    const finalScore = hs.total + urgencyPts[urgTagResolved] + pricePts[priceTagResolved];
    const finalTier  = computeTier(finalScore);

    const payload = {
      child_name:     contact.childName.trim(),
      parent_name:    contact.parentName.trim(),
      phone:          contact.phone.trim(),
      track:          hs.trackTag,
      age_tag:        hs.ageTag,
      motivation_tag: hs.motivationTag,
      urgency_tag:    urgTagResolved,
      price_tag:      priceTagResolved,
      lead_score:     finalScore,
      lead_tier:      finalTier,
      submitted_at:   new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/make-and-go-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        navigate(data.redirect_url || tierToRedirect(finalTier));
      } else {
        // API failed — still redirect based on client-computed tier
        console.warn('[MakeAndGoForm] API error, using client redirect');
        navigate(tierToRedirect(finalTier));
      }
    } catch {
      // Network error — still redirect, never block the user
      navigate(tierToRedirect(finalTier));
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────── */
  return (
    <div className="w-full max-w-lg mx-auto">
      <ProgressBar step={step} total={6} />

      {/* ── STEP 1: Age ──────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
          <StepLabel step={1} label="Âge de l'enfant" />
          <div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase leading-tight mb-2">
              Votre enfant a quel âge ?
            </h2>
            <p className="font-sans text-gray-500 text-sm font-semibold">
              Chaque mission est calibrée par tranche d'âge
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '8 – 9 ans',   emoji: '🌱', tag: 'AGE_YOUNG' as AgeTag, pts: 1, val: '8-9'  },
              { label: '10 – 12 ans', emoji: '⚡', tag: 'AGE_CORE'  as AgeTag, pts: 2, val: '10-12' },
              { label: '13 – 14 ans', emoji: '🚀', tag: 'AGE_CORE'  as AgeTag, pts: 2, val: '13-14' },
              { label: '15 ans +',    emoji: '🎓', tag: null,                   pts: 0, val: '15+'   },
            ].map(opt => (
              <OptionCard
                key={opt.val}
                selected={selectedAge === opt.val}
                onClick={() => handleAge(opt.val, opt.tag as AgeTag | null, opt.pts)}
              >
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="font-display font-black text-sm uppercase text-center leading-tight">
                    {opt.label}
                  </span>
                  {opt.val === '15+' && (
                    <span className={`text-[9px] font-black uppercase ${selectedAge === '15+' ? 'text-white/70' : 'text-gray-400'}`}>
                      → StemQuest
                    </span>
                  )}
                </div>
              </OptionCard>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase text-gray-400 text-center tracking-widest">
            ⚡ Sélection automatique — pas besoin de valider
          </p>
        </div>
      )}

      {/* ── STEP 2: Track ────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
          <StepLabel step={2} label="Centre d'intérêt" />
          <div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase leading-tight mb-2">
              Qu'est-ce qui l'attire le plus ?
            </h2>
            <p className="font-sans text-gray-500 text-sm font-semibold">
              On choisit la Mission parfaite pour lui / elle
            </p>
          </div>
          <div className="space-y-3">
            {[
              {
                label: 'Les robots et l\'électronique', emoji: '🤖',
                tag: 'TRACK_ROBOT' as TrackTag, icon: <Cpu size={22} />, val: 'TRACK_ROBOT',
                accent: 'border-blue-300',
              },
              {
                label: 'Créer sa propre marque / vêtements', emoji: '👕',
                tag: 'TRACK_FOUNDER' as TrackTag, icon: <Shirt size={22} />, val: 'TRACK_FOUNDER',
                accent: 'border-pink-300',
              },
              {
                label: 'Coder ses propres jeux vidéo', emoji: '🎮',
                tag: 'TRACK_GAME' as TrackTag, icon: <Gamepad2 size={22} />, val: 'TRACK_GAME',
                accent: 'border-purple-300',
              },
              {
                label: 'Construire et fabriquer des objets', emoji: '🔧',
                tag: 'TRACK_MAKER' as TrackTag, icon: <Wrench size={22} />, val: 'TRACK_MAKER',
                accent: 'border-orange-300',
              },
            ].map(opt => (
              <OptionCard
                key={opt.val}
                selected={selectedTrack === opt.val}
                onClick={() => handleTrack(opt.val, opt.tag)}
                accent
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl border-2 shrink-0 ${
                    selectedTrack === opt.val
                      ? 'border-white/30 bg-white/10 text-white'
                      : `${opt.accent} bg-gray-50 text-gray-600`
                  }`}>
                    {opt.icon}
                  </div>
                  <div className="flex-1">
                    <span className="font-display font-black text-sm uppercase leading-tight block">
                      {opt.label}
                    </span>
                  </div>
                  <span className="text-2xl">{opt.emoji}</span>
                </div>
              </OptionCard>
            ))}
          </div>
          <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors">
            <ChevronLeft size={16} /> Retour
          </button>
        </div>
      )}

      {/* ── STEP 3: Motivation ───────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
          <StepLabel step={3} label="Profil de l'enfant" />
          <div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase leading-tight mb-2">
              Qu'est-ce qui décrit le mieux votre enfant ?
            </h2>
            <p className="font-sans text-gray-500 text-sm font-semibold">
              Pour adapter le niveau et l'approche de la Mission
            </p>
          </div>
          <div className="space-y-3">
            {[
              {
                label: 'Ils démontent tout pour comprendre comment ça marche',
                emoji: '🔩', tag: 'MOTIVATION_MAKER' as MotivationTag, pts: 3,
                note: 'Profil Maker pur — il sera dans son élément',
              },
              {
                label: 'Trop d\'écrans, pas assez de création',
                emoji: '📱', tag: 'MOTIVATION_SCREENS' as MotivationTag, pts: 2,
                note: 'On transforme le temps d\'écran en créations réelles',
              },
              {
                label: 'A quelques bases en coding ou tech',
                emoji: '💻', tag: 'MOTIVATION_TECH' as MotivationTag, pts: 3,
                note: 'Parfait — on va approfondir ça concrètement',
              },
            ].map((opt, i) => (
              <OptionCard
                key={i}
                selected={selectedMotivation === opt.label}
                onClick={() => handleMotivation(opt.label, opt.tag, opt.pts)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5">{opt.emoji}</span>
                  <div className="flex-1">
                    <span className="font-display font-black text-sm uppercase leading-tight block mb-1">
                      {opt.label}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-wide ${
                      selectedMotivation === opt.label ? 'text-white/70' : 'text-[#E8580A]'
                    }`}>
                      {opt.note}
                    </span>
                  </div>
                </div>
              </OptionCard>
            ))}
          </div>
          <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors">
            <ChevronLeft size={16} /> Retour
          </button>
        </div>
      )}

      {/* ── STEP 4: Availability ─────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
          <StepLabel step={4} label="Disponibilité" />
          <div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase leading-tight mb-2">
              Quand souhaitez-vous réserver ?
            </h2>
            <p className="font-sans text-gray-500 text-sm font-semibold">
              Les ateliers sont le samedi après-midi — 3h de Mission
            </p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Ce week-end',                       emoji: '🔥', icon: <Flame size={18}/>,    tag: 'URGENCY_NOW'   as UrgencyTag },
              { label: 'Dans les 2 prochaines semaines',    emoji: '⚡', icon: <Zap size={18}/>,      tag: 'URGENCY_SOON'  as UrgencyTag },
              { label: 'Je planifie pour les vacances',     emoji: '📅', icon: <Calendar size={18}/>, tag: 'URGENCY_LATER' as UrgencyTag },
              { label: 'Pas encore sûr',                    emoji: '🤔', icon: <HelpCircle size={18}/>, tag: 'URGENCY_COLD' as UrgencyTag },
            ].map(opt => (
              <OptionCard
                key={opt.tag}
                selected={selectedUrgency === opt.label}
                onClick={() => handleUrgency(opt.label, opt.tag)}
              >
                <div className="flex items-center gap-3">
                  <span className={`shrink-0 ${selectedUrgency === opt.label ? 'text-white' : 'text-[#E8580A]'}`}>
                    {opt.icon}
                  </span>
                  <span className="font-display font-black text-sm uppercase flex-1">{opt.label}</span>
                  <span className="text-xl">{opt.emoji}</span>
                </div>
              </OptionCard>
            ))}
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-black">
              <ChevronLeft size={16} /> Retour
            </button>
            <button
              onClick={goNext}
              disabled={!selectedUrgency}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white font-display font-black text-sm uppercase rounded-xl border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              Continuer <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 5: Price Acknowledgment ─────────────────────────────── */}
      {step === 5 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
          <StepLabel step={5} label="L'offre Make & Go" />
          <div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase leading-tight mb-2">
              La session Make & Go est à 400 DHS
            </h2>
            <p className="font-sans text-gray-500 text-sm font-semibold">
              Matériel inclus — votre enfant repart avec son Trophée
            </p>
          </div>

          {/* Price card */}
          <div className="bg-black text-white border-4 border-black rounded-2xl p-5 shadow-[6px_6px_0_0_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-black text-4xl">400 DHS</span>
              <div className="flex items-center gap-1 bg-[#E8580A] px-3 py-1 rounded-full border-2 border-white/20">
                <Tag size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">Tout inclus</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {['3h de Mission intense', 'Matériel fourni', 'Encadrement expert', 'Le Trophée repartant avec vous'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-[#E8580A] shrink-0" />
                  <span className="text-xs font-sans font-semibold text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {[
              { label: "C'est parfait, je réserve",          emoji: '🎯', tag: 'PRICE_OK'    as PriceTag },
              { label: "Je veux d'abord en savoir plus",     emoji: '📖', tag: 'PRICE_MAYBE' as PriceTag },
              { label: "Je cherche quelque chose de gratuit", emoji: '🔍', tag: 'PRICE_NO'    as PriceTag },
            ].map(opt => (
              <OptionCard
                key={opt.tag}
                selected={selectedPrice === opt.label}
                onClick={() => handlePrice(opt.label, opt.tag)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="font-display font-black text-sm uppercase flex-1">{opt.label}</span>
                </div>
              </OptionCard>
            ))}
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-black">
              <ChevronLeft size={16} /> Retour
            </button>
            <button
              onClick={handlePriceContinue}
              disabled={!selectedPrice}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-display font-black text-sm uppercase rounded-xl border-[3px] border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none ${
                hs.priceTag === 'PRICE_NO'
                  ? 'bg-gray-500 text-white'
                  : 'bg-black text-white'
              }`}
            >
              {hs.priceTag === 'PRICE_NO' ? (
                <>Découvrir MakerLab <ChevronRight size={18} strokeWidth={3} /></>
              ) : (
                <>Presque fini <ChevronRight size={18} strokeWidth={3} /></>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 6: Contact ──────────────────────────────────────────── */}
      {step === 6 && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-400">
          <StepLabel step={6} label="Votre place" />
          <div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase leading-tight mb-2">
              Réservez votre place
            </h2>
            <p className="font-sans text-gray-500 text-sm font-semibold">
              Noufissa vous contacte sur WhatsApp dans les prochaines heures
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Prénom de l'enfant *
              </label>
              <input
                type="text"
                value={contact.childName}
                onChange={e => setContact(c => ({ ...c, childName: e.target.value }))}
                placeholder="Ex : Youssef"
                className="w-full p-4 border-[3px] border-black rounded-xl font-sans font-semibold text-base focus:outline-none focus:ring-4 ring-[#CC0000]/20 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Votre prénom (parent) *
              </label>
              <input
                type="text"
                value={contact.parentName}
                onChange={e => setContact(c => ({ ...c, parentName: e.target.value }))}
                placeholder="Ex : Sara"
                className="w-full p-4 border-[3px] border-black rounded-xl font-sans font-semibold text-base focus:outline-none focus:ring-4 ring-[#CC0000]/20 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Votre numéro WhatsApp *
              </label>
              <input
                type="tel"
                value={contact.phone}
                onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                placeholder="+212 6XX XXX XXX"
                className="w-full p-4 border-[3px] border-black rounded-xl font-sans font-semibold text-base focus:outline-none focus:ring-4 ring-[#CC0000]/20 bg-white"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-black uppercase text-[#CC0000] text-center border-2 border-[#CC0000] rounded-xl px-4 py-2 bg-red-50">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-black">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !contact.childName.trim() || !contact.parentName.trim() || !contact.phone.trim()}
              className="flex-1 py-5 bg-[#CC0000] text-white font-display font-black text-base uppercase rounded-xl border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 size={20} className="animate-spin" /> Envoi en cours…</>
              ) : (
                <><Sparkles size={20} className="animate-pulse" /> Réserve ta place</>
              )}
            </button>
          </div>

          <p className="text-[9px] font-black uppercase tracking-widest text-center text-gray-400">
            🔒 Données confidentielles — aucune obligation. Noufissa vous contacte sous 2h.
          </p>
        </div>
      )}
    </div>
  );
};
