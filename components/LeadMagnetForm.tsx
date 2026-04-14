import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  ChevronRight,
  ChevronLeft,
  Cpu,
  Shirt,
  Gamepad2,
  Wrench,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';

/* ─── Types ───────────────────────────────────────────────────────────────── */
type Track = 'ROBOT' | 'FOUNDER' | 'GAME' | 'MAKER';
type Tier  = 'HOT'   | 'WARM'   | 'COLD';
type Step  = 1 | 2 | 3 | 4 | 5 | 'result';

interface FormData {
  childAge:     string;
  track:        Track | '';
  experience:   string;
  availability: string;
  childName:    string;
  parentName:   string;
  whatsapp:     string;
}

/** All data needed for the result screen — captured at submit time */
interface ResultData {
  score:        number;
  tier:         Tier;
  track:        Track;
  childName:    string;
  parentName:   string;
  whatsapp:     string;
  childAge:     string;
  availability: string;
}

/* ─── Track meta ──────────────────────────────────────────────────────────── */
const TRACKS: {
  id: Track;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  missionTitle: string;
  missionDesc: string;
}[] = [
  {
    id: 'ROBOT', label: 'Les robots et l\'électronique', emoji: '🤖',
    color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-400',
    icon: <Cpu size={28} strokeWidth={2} />,
    missionTitle: 'Mission : Robot Autonome',
    missionDesc: 'En 3h, ton enfant assemble un vrai châssis en bois, câble les moteurs et code le robot pour qu\'il évite les murs tout seul. Il repart avec son robot. Son nom dessus.',
  },
  {
    id: 'FOUNDER', label: 'Créer sa propre marque ou ses vêtements', emoji: '👕',
    color: 'text-pink-600', bgColor: 'bg-pink-50 border-pink-400',
    icon: <Shirt size={28} strokeWidth={2} />,
    missionTitle: 'Mission : T-Shirt Design & Print',
    missionDesc: 'En 3h, ton enfant dessine son logo sur tablette, découpe son design sur vinyle industriel, puis le presse sur son t-shirt. Il repart en le portant.',
  },
  {
    id: 'GAME', label: 'Coder ses propres jeux vidéo', emoji: '🎮',
    color: 'text-purple-600', bgColor: 'bg-purple-50 border-purple-400',
    icon: <Gamepad2 size={28} strokeWidth={2} />,
    missionTitle: 'Mission : Retro Arcade Hacker',
    missionDesc: 'En 3h, ton enfant code son propre jeu vidéo de A à Z. Il repart avec le lien jouable de son jeu qu\'il peut envoyer à ses amis.',
  },
  {
    id: 'MAKER', label: 'Construire et fabriquer des objets réels', emoji: '🔧',
    color: 'text-orange-600', bgColor: 'bg-orange-50 border-orange-400',
    icon: <Wrench size={28} strokeWidth={2} />,
    missionTitle: 'Mission : Coffre-Fort Laser',
    missionDesc: 'En 3h, ton enfant modifie un fichier CAO, découpe les pièces au laser et assemble un vrai coffre-fort mécanique gravé à son nom.',
  },
];

const NOUFISSA_NUMBER = '212621877106';

/* ─── Score helpers ───────────────────────────────────────────────────────── */
function calcScore(data: FormData): number {
  let score = 0;
  if (data.childAge === '10-12' || data.childAge === '13-14') score += 2;
  else if (data.childAge === '7-9') score += 1;
  if (data.experience === 'none') score += 1;
  if (data.availability === 'this-week') score += 2;
  else if (data.availability === '2-weeks') score += 1;
  else if (data.availability === 'unsure') score -= 1;
  return Math.max(0, score);
}

function getTier(score: number): Tier {
  if (score >= 4) return 'HOT';
  if (score >= 2) return 'WARM';
  return 'COLD';
}

/* ─── Shared option card ──────────────────────────────────────────────────── */
const OptionCard: React.FC<{
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ selected, onClick, children }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 md:p-5 rounded-2xl border-4 transition-all duration-200 ${
      selected
        ? 'bg-black text-white border-black shadow-[6px_6px_0_0_rgba(0,0,0,0.3)] -translate-y-1'
        : 'bg-white text-black border-gray-200 hover:border-black hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5'
    }`}
  >
    {children}
  </button>
);

/* ─── Progress bar ────────────────────────────────────────────────────────── */
const ProgressBar: React.FC<{ step: Step }> = ({ step }) => {
  const pct = step === 'result' ? 100 : ((step as number) / 5) * 100;
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-brand-orange transition-all duration-500 ease-out rounded-full"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

/* ─── WhatsApp message ───────────────────────────────────────────────────── */
function buildWaMessage(rd: ResultData): string {
  const availLabel: Record<string, string> = {
    'this-week': 'ce week-end',
    '2-weeks':   'dans 2 semaines',
    '1-month':   'dans 1 mois',
    'unsure':    'pas encore sûr(e)',
  };
  return encodeURIComponent(
    `🚀 Nouveau lead ${rd.tier} · ${rd.childName}, ${rd.childAge} ans\n` +
    `Track : ${rd.track} · Dispo : ${availLabel[rd.availability] ?? rd.availability}\n` +
    `Parent : ${rd.parentName} · WA : ${rd.whatsapp} · Score : ${rd.score}/5`
  );
}

/* ─── Result Screen ──────────────────────────────────────────────────────── */
const ResultScreen: React.FC<{ rd: ResultData }> = ({ rd }) => {
  const trackMeta = TRACKS.find(t => t.id === rd.track);
  if (!trackMeta) return null;

  // Friendly confirmation messages — NO internal scoring terms visible to parent
  const confirmMsg = rd.tier === 'HOT'
    ? 'Noufissa vous contacte sur WhatsApp dans les prochaines minutes 🔔'
    : rd.tier === 'WARM'
    ? 'Notre équipe vous prépare une proposition personnalisée 📬'
    : 'Découvrez nos ateliers et revenez quand vous êtes prêt 🌱';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Confirmation headline — ZERO internal terms */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full border-4 border-black font-black text-xs uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)] mb-4">
          <CheckCircle2 size={16} className="text-green-400" /> Mission trouvée !
        </div>
        <h1 className="font-display font-black text-4xl md:text-5xl uppercase leading-tight mb-3">
          Parfait, {rd.childName} ! 🎉
        </h1>
        <p className="font-bold text-gray-600 text-sm max-w-md mx-auto leading-relaxed">
          {confirmMsg}
        </p>
      </div>

      {/* Mission Card */}
      <div className={`rounded-3xl border-4 border-black p-6 md:p-8 relative overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,1)] ${trackMeta.bgColor}`}>
        <div className="absolute -top-4 -right-4 text-8xl opacity-10 select-none pointer-events-none">
          {trackMeta.emoji}
        </div>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 border-current text-[9px] font-black uppercase tracking-widest mb-4 ${trackMeta.color}`}>
          {trackMeta.icon} Votre Mission
        </div>
        <h2 className="font-display font-black text-2xl md:text-3xl uppercase mb-3">{trackMeta.missionTitle}</h2>
        <p className="font-bold text-sm leading-relaxed text-gray-700">{trackMeta.missionDesc}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <span className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-[9px] font-black uppercase border-2 border-black">
            <Clock size={12} /> 3h de mission
          </span>
          <span className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase border-2 border-green-600">
            <CheckCircle2 size={12} /> Matériel inclus
          </span>
          <span className="flex items-center gap-1 bg-brand-orange text-black px-3 py-1 rounded-full text-[9px] font-black uppercase border-2 border-black">
            <Zap size={12} /> 400 DHS
          </span>
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="bg-gray-50 border-4 border-black rounded-3xl p-6 text-center space-y-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
          Noufissa vous envoie le programme complet de la Mission + dates disponibles
        </p>
        <a
          href={`https://wa.me/${NOUFISSA_NUMBER}?text=${buildWaMessage(rd)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 py-5 bg-[#25D366] text-white font-black text-base uppercase rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all"
        >
          <MessageCircle size={24} />
          Discuter avec Noufissa sur WhatsApp
        </a>
        <p className="text-[9px] font-bold text-gray-400 uppercase">
          En cliquant, vous acceptez d'être recontacté via WhatsApp par nos mentors.
        </p>
      </div>

    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────────── */
export const LeadMagnetForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep]           = useState<Step>(1);
  const [loading, setLoading]     = useState(false);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [formData, setFormData]   = useState<FormData>({
    childAge: '', track: '', experience: '',
    availability: '', childName: '', parentName: '', whatsapp: '',
  });

  const selectedTrackMeta = TRACKS.find(t => t.id === formData.track);

  /* ── Navigation ─────────────────────────────────────────────────────────── */
  const goNext = () => setStep(prev => (prev as number + 1) as Step);
  const goBack = () => setStep(prev => Math.max(1, (prev as number) - 1) as Step);

  /* ── Q1: Age — 15+ logic jump ───────────────────────────────────────────── */
  const handleAgeSelect = (age: string) => {
    setFormData(d => ({ ...d, childAge: age }));
    if (age === '15+') { setTimeout(() => navigate('/programs'), 400); return; }
    setTimeout(goNext, 300);
  };

  /* ── Q2: Track ───────────────────────────────────────────────────────────── */
  const handleTrackSelect = (track: Track) => {
    setFormData(d => ({ ...d, track }));
    setTimeout(goNext, 300);
  };

  /* ── Q3 ──────────────────────────────────────────────────────────────────── */
  const handleExperienceSelect = (val: string) => {
    setFormData(d => ({ ...d, experience: val }));
    setTimeout(goNext, 300);
  };

  /* ── Q4 ──────────────────────────────────────────────────────────────────── */
  const handleAvailabilitySelect = (val: string) =>
    setFormData(d => ({ ...d, availability: val }));

  /* ── Submit ──────────────────────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!formData.childName.trim() || !formData.parentName.trim() || !formData.whatsapp.trim()) return;
    setLoading(true);

    // Capture result data BEFORE any async call — guaranteed consistent
    const score = calcScore(formData);
    const tier  = getTier(score);
    const rd: ResultData = {
      score, tier,
      track:        formData.track as Track,
      childName:    formData.childName,
      parentName:   formData.parentName,
      whatsapp:     formData.whatsapp,
      childAge:     formData.childAge,
      availability: formData.availability,
    };

    try {
      await addDoc(collection(db, 'lead-magnet-leads'), {
        ...formData, score, tier,
        source: 'lead_magnet_quiz',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Lead save failed (non-blocking):', err);
    }

    setLoading(false);
    setResultData(rd);
    setStep('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ─────────────────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <div className="w-full max-w-xl mx-auto">

      {/* Progress header */}
      {step !== 'result' && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Étape {step as number}/5
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange">
              {step === 1 ? 'Démarrage' :
               step === 2 ? 'Profil' :
               step === 3 ? 'Expérience' :
               step === 4 ? 'Disponibilité' : 'Contact'}
            </span>
          </div>
          <ProgressBar step={step} />
        </div>
      )}

      {/* ── STEP 1: Age ───────────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
          <div>
            <div className="inline-block bg-brand-orange text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black mb-4">
              Question 1 — L'âge
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase leading-tight mb-2">
              Votre enfant a quel âge ?
            </h2>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              Le programme est adapté à chaque tranche d'âge
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: '7-9',   label: '7 – 9 ans',   emoji: '🌱' },
              { val: '10-12', label: '10 – 12 ans',  emoji: '⚡' },
              { val: '13-14', label: '13 – 14 ans',  emoji: '🚀' },
              { val: '15+',   label: '15 ans et +',  emoji: '🎓' },
            ].map(opt => (
              <OptionCard
                key={opt.val}
                selected={formData.childAge === opt.val}
                onClick={() => handleAgeSelect(opt.val)}
              >
                <div className="flex flex-col items-center gap-2 py-2">
                  <span className="text-3xl">{opt.emoji}</span>
                  <span className="font-black text-sm uppercase text-center leading-tight">{opt.label}</span>
                  {opt.val === '15+' && (
                    <span className="text-[9px] font-bold text-current/60 uppercase">→ StemQuest</span>
                  )}
                </div>
              </OptionCard>
            ))}
          </div>
          <p className="text-[10px] font-bold text-gray-400 text-center uppercase">
            ⚡ Sélection automatique — pas besoin de cliquer "Suivant"
          </p>
        </div>
      )}

      {/* ── STEP 2: Track ─────────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
          <div>
            <div className="inline-block bg-brand-orange text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black mb-4">
              Question 2 — L'intérêt
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase leading-tight mb-2">
              Qu'est-ce qui l'attire le plus ?
            </h2>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              On choisit la mission parfaite pour lui / elle
            </p>
          </div>
          <div className="space-y-3">
            {TRACKS.map(track => (
              <OptionCard
                key={track.id}
                selected={formData.track === track.id}
                onClick={() => handleTrackSelect(track.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl border-2 ${
                    formData.track === track.id ? 'border-white/30 bg-white/10' : `${track.bgColor} border-current`
                  } shrink-0`}>
                    <span className={formData.track === track.id ? 'text-white' : track.color}>
                      {track.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <span className="font-black text-sm uppercase leading-tight block">{track.label}</span>
                    <span className={`text-[10px] font-bold uppercase ${
                      formData.track === track.id ? 'text-white/70' : 'text-gray-400'
                    }`}>Track {track.id}</span>
                  </div>
                  <span className="text-2xl">{track.emoji}</span>
                </div>
              </OptionCard>
            ))}
          </div>
          <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors">
            <ChevronLeft size={16} /> Retour
          </button>
        </div>
      )}

      {/* ── STEP 3: Experience ────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
          <div>
            <div className="inline-block bg-brand-orange text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black mb-4">
              Question 3 — L'expérience
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase leading-tight mb-2">
              Il/Elle a déjà fait un atelier STEM ?
            </h2>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              Pour personnaliser le niveau de la session
            </p>
          </div>
          <div className="space-y-3">
            {[
              { val: 'none',     label: 'Non, c\'est la première fois',  emoji: '✨', note: 'Parfait pour commencer !' },
              { val: 'coding',   label: 'Oui, du coding / Scratch',      emoji: '💻', note: '' },
              { val: 'robotics', label: 'Oui, robotique / Arduino',      emoji: '🤖', note: '' },
              { val: 'other',    label: 'Oui, autre activité technique', emoji: '🔬', note: '' },
            ].map(opt => (
              <OptionCard
                key={opt.val}
                selected={formData.experience === opt.val}
                onClick={() => handleExperienceSelect(opt.val)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.emoji}</span>
                  <div className="flex-1">
                    <span className="font-black text-sm uppercase block">{opt.label}</span>
                    {opt.note && (
                      <span className={`text-[9px] font-bold uppercase ${
                        formData.experience === opt.val ? 'text-brand-orange' : 'text-green-500'
                      }`}>{opt.note}</span>
                    )}
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

      {/* ── STEP 4: Availability ──────────────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
          <div>
            <div className="inline-block bg-brand-orange text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black mb-4">
              Question 4 — Disponibilité
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase leading-tight mb-2">
              Vous êtes disponible quel samedi ?
            </h2>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              Les ateliers sont le samedi après-midi (14h30 – 17h30)
            </p>
          </div>
          <div className="space-y-3">
            {[
              { val: 'this-week', label: 'Dès ce week-end !',              emoji: '🔥', badge: '+2 pts', badgeColor: 'bg-red-500 text-white' },
              { val: '2-weeks',   label: 'Dans les 2 prochaines semaines', emoji: '⚡', badge: '+1 pt',  badgeColor: 'bg-orange-400 text-white' },
              { val: '1-month',   label: 'Dans un mois',                   emoji: '📅', badge: '',       badgeColor: '' },
              { val: 'unsure',    label: 'Pas encore sûr(e)',               emoji: '🤔', badge: '',       badgeColor: '' },
            ].map(opt => (
              <OptionCard
                key={opt.val}
                selected={formData.availability === opt.val}
                onClick={() => handleAvailabilitySelect(opt.val)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-black text-sm uppercase flex-1">{opt.label}</span>
                  {opt.badge && (
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      formData.availability === opt.val ? 'bg-white/20 text-white' : opt.badgeColor
                    }`}>{opt.badge}</span>
                  )}
                </div>
              </OptionCard>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-black">
              <ChevronLeft size={16} /> Retour
            </button>
            <button
              onClick={goNext}
              disabled={!formData.availability}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white font-black text-sm uppercase rounded-xl border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              Presque fini ! <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 5: Contact ───────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
          <div>
            <div className="inline-block bg-brand-orange text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black mb-4">
              Dernière étape
            </div>
            <h2 className="font-display font-black text-3xl md:text-4xl uppercase leading-tight mb-2">
              Réservez votre place
            </h2>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
              Noufissa vous contacte sur WhatsApp dans les prochaines heures
            </p>
          </div>

          {selectedTrackMeta && (
            <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${selectedTrackMeta.bgColor}`}>
              <span className={selectedTrackMeta.color}>{selectedTrackMeta.icon}</span>
              <div>
                <p className={`text-[9px] font-black uppercase tracking-widest ${selectedTrackMeta.color}`}>Track sélectionné</p>
                <p className="font-black text-sm uppercase">{selectedTrackMeta.missionTitle}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Prénom de l'enfant *</label>
              <input
                type="text"
                value={formData.childName}
                onChange={e => setFormData(d => ({ ...d, childName: e.target.value }))}
                placeholder="Ex: Doudou"
                className="w-full p-4 border-4 border-black rounded-xl font-bold text-base focus:outline-none focus:ring-4 ring-brand-orange/20 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Votre prénom (parent) *</label>
              <input
                type="text"
                value={formData.parentName}
                onChange={e => setFormData(d => ({ ...d, parentName: e.target.value }))}
                placeholder="Ex: Sarah"
                className="w-full p-4 border-4 border-black rounded-xl font-bold text-base focus:outline-none focus:ring-4 ring-brand-orange/20 bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Votre numéro WhatsApp *</label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={e => setFormData(d => ({ ...d, whatsapp: e.target.value }))}
                placeholder="+212 6..."
                className="w-full p-4 border-4 border-black rounded-xl font-bold text-base focus:outline-none focus:ring-4 ring-brand-orange/20 bg-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-black">
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.childName.trim() || !formData.parentName.trim() || !formData.whatsapp.trim()}
              className="flex-1 py-5 bg-brand-orange text-black font-black text-base uppercase rounded-xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Sparkles size={20} className="animate-pulse" />
                  Voir ma mission parfaite
                </>
              )}
            </button>
          </div>

          <p className="text-[9px] font-bold text-center text-gray-400 uppercase tracking-widest">
            🔒 Vos données sont confidentielles. Noufissa vous contacte sous 2h.
          </p>
        </div>
      )}

      {/* ── RESULT SCREEN ─────────────────────────────────────────────────── */}
      {step === 'result' && resultData && <ResultScreen rd={resultData} />}

    </div>
  );
};
