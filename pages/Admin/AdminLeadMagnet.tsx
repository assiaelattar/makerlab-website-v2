import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  Flame, ThermometerSun, Snowflake, MessageCircle, Trash2,
  Cpu, Shirt, Gamepad2, Wrench, Clock, TrendingUp, Users, Zap,
  Target, Bot, CheckCircle2, XCircle,
} from 'lucide-react';

/* ─── Quiz tab types (existing /quiz form) ─────────────────────────────────── */
interface QuizLead {
  id: string;
  childName:    string;
  parentName:   string;
  whatsapp:     string;
  childAge:     string;
  track:        'ROBOT' | 'FOUNDER' | 'GAME' | 'MAKER';
  experience:   string;
  availability: string;
  score:        number;
  tier:         'HOT' | 'WARM' | 'COLD';
  createdAt:    string;
}

/* ─── Make & Go tab types (new /apply form) ────────────────────────────────── */
interface MakeAndGoLead {
  id:             string;
  child_name:     string;
  parent_name:    string;
  phone:          string;
  track:          string;
  age_tag:        string;
  motivation_tag: string;
  urgency_tag:    string;
  price_tag:      string;
  lead_score:     number;
  lead_tier:      'Tier_1_Hot' | 'Tier_2_Warm' | 'Tier_3_Cold';
  submitted_at:   string;
  wa_sent:        boolean;
  capi_sent:      boolean;
}

/* ─── Shared meta ──────────────────────────────────────────────────────────── */
const TRACK_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  ROBOT:        { icon: <Cpu size={16} />,      color: 'text-blue-600 bg-blue-50 border-blue-300',     label: 'Robot Autonome' },
  FOUNDER:      { icon: <Shirt size={16} />,    color: 'text-pink-600 bg-pink-50 border-pink-300',     label: 'T-Shirt Design' },
  GAME:         { icon: <Gamepad2 size={16} />, color: 'text-purple-600 bg-purple-50 border-purple-300', label: 'Retro Arcade' },
  MAKER:        { icon: <Wrench size={16} />,   color: 'text-orange-600 bg-orange-50 border-orange-300', label: 'Coffre-Fort Laser' },
  TRACK_ROBOT:  { icon: <Cpu size={16} />,      color: 'text-blue-600 bg-blue-50 border-blue-300',     label: 'Robot Autonome' },
  TRACK_FOUNDER:{ icon: <Shirt size={16} />,    color: 'text-pink-600 bg-pink-50 border-pink-300',     label: 'T-Shirt Design' },
  TRACK_GAME:   { icon: <Gamepad2 size={16} />, color: 'text-purple-600 bg-purple-50 border-purple-300', label: 'Retro Arcade' },
  TRACK_MAKER:  { icon: <Wrench size={16} />,   color: 'text-orange-600 bg-orange-50 border-orange-300', label: 'Coffre-Fort Laser' },
};

const AVAIL_LABEL: Record<string, string> = {
  'this-week':    'Ce week-end 🔥',
  '2-weeks':      'Dans 2 semaines',
  '1-month':      'Dans 1 mois',
  'unsure':       'Pas sûr(e)',
  URGENCY_NOW:    'Ce week-end 🔥',
  URGENCY_SOON:   'Dans 2 semaines',
  URGENCY_LATER:  'Vacances scolaires',
  URGENCY_COLD:   'Pas encore sûr',
};

/* ─── Make & Go tier helpers ───────────────────────────────────────────────── */
const MG_TIER_META = {
  Tier_1_Hot:  { label: 'HOT',  icon: <Flame size={11} />,         bg: 'bg-red-500 text-white',         border: 'border-l-red-500' },
  Tier_2_Warm: { label: 'WARM', icon: <ThermometerSun size={11} />, bg: 'bg-orange-400 text-black',      border: 'border-l-orange-400' },
  Tier_3_Cold: { label: 'COLD', icon: <Snowflake size={11} />,      bg: 'bg-blue-100 text-blue-700',     border: 'border-l-blue-300' },
};

/* ─── Shared sub-component: tier badge ────────────────────────────────────── */
const TierBadge: React.FC<{ tier: string; variant?: 'quiz' | 'mg' }> = ({ tier, variant = 'quiz' }) => {
  if (variant === 'mg') {
    const meta = MG_TIER_META[tier as keyof typeof MG_TIER_META];
    if (!meta) return null;
    return (
      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border border-black text-[9px] font-black uppercase ${meta.bg}`}>
        {meta.icon} {meta.label}
      </span>
    );
  }
  // Quiz tier
  const cfg = {
    HOT:  { bg: 'bg-red-500 text-white',       icon: <Flame size={10} /> },
    WARM: { bg: 'bg-orange-400 text-black',     icon: <ThermometerSun size={10} /> },
    COLD: { bg: 'bg-blue-100 text-blue-700',    icon: <Snowflake size={10} /> },
  }[tier] || { bg: 'bg-gray-200 text-gray-700', icon: null };
  return (
    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border border-black text-[9px] font-black uppercase ${cfg.bg}`}>
      {cfg.icon} {tier}
    </span>
  );
};

/* ─── STATUS INDICATORS ────────────────────────────────────────────────────── */
const StatusDot: React.FC<{ sent: boolean; label: string }> = ({ sent, label }) => (
  <div className="flex items-center gap-1">
    {sent
      ? <CheckCircle2 size={13} className="text-green-500" />
      : <XCircle size={13} className="text-gray-300" />
    }
    <span className="text-[9px] font-black uppercase text-gray-400">{label}</span>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════════
   QUIZ TAB
══════════════════════════════════════════════════════════════════════════════ */
const QuizTab: React.FC = () => {
  const [leads, setLeads]     = useState<QuizLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter]   = useState<'ALL' | 'HOT' | 'WARM' | 'COLD'>('ALL');
  const [trackFilter, setTrackFilter] = useState<'ALL' | 'ROBOT' | 'FOUNDER' | 'GAME' | 'MAKER'>('ALL');

  useEffect(() => {
    const q = query(collection(db, 'lead-magnet-leads'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() } as QuizLead)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const deleteLead = async (id: string) => {
    if (!window.confirm('Supprimer ce lead ?')) return;
    await deleteDoc(doc(db, 'lead-magnet-leads', id));
  };

  const filtered = leads.filter(l => {
    if (tierFilter  !== 'ALL' && l.tier  !== tierFilter)  return false;
    if (trackFilter !== 'ALL' && l.track !== trackFilter) return false;
    return true;
  });

  const buildWaLink = (lead: QuizLead) => {
    const msg = encodeURIComponent(
      `🚀 Lead ${lead.tier} · ${lead.childName}, ${lead.childAge} ans\n` +
      `Track : ${lead.track} · Dispo : ${AVAIL_LABEL[lead.availability] ?? lead.availability}\n` +
      `Parent : ${lead.parentName} · WA : ${lead.whatsapp} · Score : ${lead.score}/5`
    );
    const clean = lead.whatsapp.replace(/\s+/g, '').replace(/^\+/, '');
    return `https://wa.me/${clean}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: leads.length,                                icon: <Users size={20} />,              color: 'bg-white border-black' },
          { label: 'HOT 🔥', value: leads.filter(l => l.tier === 'HOT').length,  icon: <Flame size={20} className="text-red-500" />,    color: 'bg-red-50 border-red-400' },
          { label: 'WARM ⚡', value: leads.filter(l => l.tier === 'WARM').length, icon: <ThermometerSun size={20} className="text-orange-500" />, color: 'bg-orange-50 border-orange-400' },
          { label: 'COLD ❄️', value: leads.filter(l => l.tier === 'COLD').length, icon: <Snowflake size={20} className="text-blue-500" />,  color: 'bg-blue-50 border-blue-400' },
        ].map((s, i) => (
          <div key={i} className={`border-4 border-black p-4 rounded-2xl shadow-neo-sm flex items-center gap-3 ${s.color}`}>
            {s.icon}
            <div>
              <div className="font-black text-2xl leading-none">{s.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-white border-2 border-black rounded-xl p-1.5 shadow-neo-sm">
          <TrendingUp size={16} className="ml-1" />
          {(['ALL', 'HOT', 'WARM', 'COLD'] as const).map(t => (
            <button key={t} onClick={() => setTierFilter(t)}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border-2 transition-all ${tierFilter === t ? 'bg-black text-white border-black' : 'bg-transparent border-transparent text-gray-500 hover:border-gray-200'}`}
            >{t}</button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white border-2 border-black rounded-xl p-1.5 shadow-neo-sm">
          <Zap size={16} className="ml-1" />
          {(['ALL', 'ROBOT', 'FOUNDER', 'GAME', 'MAKER'] as const).map(t => (
            <button key={t} onClick={() => setTrackFilter(t)}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border-2 transition-all ${trackFilter === t ? 'bg-black text-white border-black' : 'bg-transparent border-transparent text-gray-500 hover:border-gray-200'}`}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Leads */}
      {loading ? (
        <div className="flex items-center justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-red border-t-transparent" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-4 border-black p-20 rounded-3xl text-center shadow-neo">
          <p className="font-display font-black text-2xl text-gray-300 uppercase">Aucun lead trouvé</p>
          <p className="text-sm text-gray-400 mt-2">Partagez le lien /quiz pour commencer à collecter des leads !</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(lead => {
            const trackMeta = TRACK_META[lead.track];
            return (
              <div key={lead.id} className={`bg-white border-4 border-black rounded-3xl p-5 shadow-neo-sm hover:shadow-neo transition-all relative overflow-hidden border-l-8 ${
                lead.tier === 'HOT' ? 'border-l-red-500' : lead.tier === 'WARM' ? 'border-l-orange-400' : 'border-l-blue-300'
              }`}>
                <div className={`absolute top-0 right-0 flex items-center gap-1 px-3 py-1 text-[9px] font-black uppercase border-b-2 border-l-2 border-black rounded-bl-xl ${
                  lead.tier === 'HOT' ? 'bg-red-500 text-white' : lead.tier === 'WARM' ? 'bg-orange-400 text-black' : 'bg-blue-100 text-blue-700'
                }`}>
                  {lead.tier === 'HOT' && <Flame size={10} />}
                  {lead.tier === 'WARM' && <ThermometerSun size={10} />}
                  {lead.tier === 'COLD' && <Snowflake size={10} />}
                  {lead.tier}
                </div>
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  <div className="w-14 h-14 bg-black text-white rounded-xl border-4 border-black flex flex-col items-center justify-center shrink-0">
                    <span className="font-black text-xl leading-none">{lead.score}</span>
                    <span className="text-[8px] font-black uppercase opacity-60">/5</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-lg uppercase">{lead.childName}</span>
                      <span className="text-xs font-bold text-gray-400">{lead.childAge} ans</span>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase ${trackMeta?.color}`}>
                        {trackMeta?.icon} {lead.track}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-gray-500 uppercase">{trackMeta?.label}</div>
                  </div>
                  <div className="md:w-48 shrink-0">
                    <p className="font-black text-sm">{lead.parentName}</p>
                    <p className="text-xs font-bold text-gray-500">{lead.whatsapp}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{AVAIL_LABEL[lead.availability] ?? lead.availability}</p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase md:w-32 shrink-0">
                    <Clock size={12} />
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a href={buildWaLink(lead)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-[#25D366] text-white px-3 py-2 rounded-xl border-2 border-black font-black text-[10px] uppercase shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                      <MessageCircle size={14} fill="currentColor" /> WA
                    </a>
                    <button onClick={() => deleteLead(lead.id)}
                      className="p-2 bg-white text-red-500 rounded-xl border-2 border-black hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════
   MAKE & GO TAB
══════════════════════════════════════════════════════════════════════════════ */
const MakeAndGoTab: React.FC = () => {
  const [leads, setLeads]     = useState<MakeAndGoLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierFilter, setTierFilter]   = useState<'ALL' | 'Tier_1_Hot' | 'Tier_2_Warm' | 'Tier_3_Cold'>('ALL');
  const [trackFilter, setTrackFilter] = useState<'ALL' | 'TRACK_ROBOT' | 'TRACK_FOUNDER' | 'TRACK_GAME' | 'TRACK_MAKER'>('ALL');

  useEffect(() => {
    const q = query(collection(db, 'make-and-go-leads'), orderBy('lead_score', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() } as MakeAndGoLead)));
      setLoading(false);
    });
    return unsub;
  }, []);

  const deleteLead = async (id: string) => {
    if (!window.confirm('Supprimer ce lead ?')) return;
    await deleteDoc(doc(db, 'make-and-go-leads', id));
  };

  const filtered = leads.filter(l => {
    if (tierFilter  !== 'ALL' && l.lead_tier !== tierFilter)  return false;
    if (trackFilter !== 'ALL' && l.track     !== trackFilter) return false;
    return true;
  });

  const hotCount  = leads.filter(l => l.lead_tier === 'Tier_1_Hot').length;
  const warmCount = leads.filter(l => l.lead_tier === 'Tier_2_Warm').length;
  const coldCount = leads.filter(l => l.lead_tier === 'Tier_3_Cold').length;

  const buildWaLink = (lead: MakeAndGoLead) => {
    const msg = encodeURIComponent(`Bonjour ! Je vous contacte suite à ma demande Make & Go pour ${lead.child_name}.`);
    const clean = lead.phone.replace(/\s+/g, '').replace(/^\+/, '');
    return `https://wa.me/${clean}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total leads', value: leads.length,  icon: <Users size={20} />,              color: 'bg-white border-black' },
          { label: 'HOT 🔥',      value: hotCount,       icon: <Flame size={20} className="text-red-500" />,    color: 'bg-red-50 border-red-400' },
          { label: 'WARM ⚡',     value: warmCount,      icon: <ThermometerSun size={20} className="text-orange-500" />, color: 'bg-orange-50 border-orange-400' },
          { label: 'COLD ❄️',     value: coldCount,      icon: <Snowflake size={20} className="text-blue-500" />,  color: 'bg-blue-50 border-blue-400' },
        ].map((s, i) => (
          <div key={i} className={`border-4 border-black p-4 rounded-2xl shadow-neo-sm flex items-center gap-3 ${s.color}`}>
            {s.icon}
            <div>
              <div className="font-black text-2xl leading-none">{s.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-white border-2 border-black rounded-xl p-1.5 shadow-neo-sm">
          <TrendingUp size={16} className="ml-1" />
          {(['ALL', 'Tier_1_Hot', 'Tier_2_Warm', 'Tier_3_Cold'] as const).map(t => (
            <button key={t} onClick={() => setTierFilter(t)}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border-2 transition-all ${tierFilter === t ? 'bg-black text-white border-black' : 'bg-transparent border-transparent text-gray-500 hover:border-gray-200'}`}
            >{t === 'ALL' ? 'Tous' : t === 'Tier_1_Hot' ? '🔥 HOT' : t === 'Tier_2_Warm' ? '⚡ WARM' : '❄️ COLD'}</button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white border-2 border-black rounded-xl p-1.5 shadow-neo-sm">
          <Zap size={16} className="ml-1" />
          {(['ALL', 'TRACK_ROBOT', 'TRACK_FOUNDER', 'TRACK_GAME', 'TRACK_MAKER'] as const).map(t => (
            <button key={t} onClick={() => setTrackFilter(t)}
              className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg border-2 transition-all ${trackFilter === t ? 'bg-black text-white border-black' : 'bg-transparent border-transparent text-gray-500 hover:border-gray-200'}`}
            >{t === 'ALL' ? 'Tous' : t.replace('TRACK_', '')}</button>
          ))}
        </div>
      </div>

      {/* Leads list */}
      {loading ? (
        <div className="flex items-center justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-red border-t-transparent" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-4 border-black p-20 rounded-3xl text-center shadow-neo">
          <p className="font-display font-black text-2xl text-gray-300 uppercase">Aucun lead Make & Go</p>
          <p className="text-sm text-gray-400 mt-2">
            Partagez le lien <span className="font-black text-black">/apply</span> pour commencer à collecter des leads !
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(lead => {
            const tierMeta = MG_TIER_META[lead.lead_tier];
            const trackKey = lead.track;
            const trackMeta = TRACK_META[trackKey] || TRACK_META[trackKey?.replace('TRACK_', '')];
            return (
              <div key={lead.id} className={`bg-white border-4 border-black rounded-3xl p-5 shadow-neo-sm hover:shadow-neo transition-all relative overflow-hidden border-l-8 ${tierMeta?.border ?? ''}`}>
                {/* Tier badge */}
                <div className={`absolute top-0 right-0 flex items-center gap-1 px-3 py-1 text-[9px] font-black uppercase border-b-2 border-l-2 border-black rounded-bl-xl ${tierMeta?.bg ?? 'bg-gray-200 text-gray-700'}`}>
                  {tierMeta?.icon} {tierMeta?.label}
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                  {/* Score badge */}
                  <div className="w-14 h-14 bg-black text-white rounded-xl border-4 border-black flex flex-col items-center justify-center shrink-0 shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]">
                    <span className="font-black text-xl leading-none">{lead.lead_score}</span>
                    <span className="text-[8px] font-black uppercase opacity-60">/12</span>
                  </div>

                  {/* Child + Track */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-black text-lg uppercase">{lead.child_name}</span>
                      <span className="text-xs font-bold text-gray-400">{lead.age_tag?.replace('AGE_', '')}</span>
                      {trackMeta && (
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black uppercase ${trackMeta.color}`}>
                          {trackMeta.icon} {lead.track?.replace('TRACK_', '')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{AVAIL_LABEL[lead.urgency_tag] ?? lead.urgency_tag}</span>
                      <StatusDot sent={lead.capi_sent} label="CAPI" />
                      <StatusDot sent={lead.wa_sent}   label="WA" />
                    </div>
                  </div>

                  {/* Parent info */}
                  <div className="md:w-48 shrink-0">
                    <p className="font-black text-sm">{lead.parent_name}</p>
                    <p className="text-xs font-bold text-gray-500">{lead.phone}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{lead.price_tag}</p>
                  </div>

                  {/* Date */}
                  <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase md:w-32 shrink-0">
                    <Clock size={12} />
                    {lead.submitted_at ? new Date(lead.submitted_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a href={buildWaLink(lead)} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-[#25D366] text-white px-3 py-2 rounded-xl border-2 border-black font-black text-[10px] uppercase shadow-neo-sm hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                      <MessageCircle size={14} fill="currentColor" /> WA
                    </a>
                    <button onClick={() => deleteLead(lead.id)}
                      className="p-2 bg-white text-red-500 rounded-xl border-2 border-black hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
══════════════════════════════════════════════════════════════════════════════ */
type TabId = 'quiz' | 'makeandgo';

export const AdminLeadMagnet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('makeandgo');

  const tabs: Array<{ id: TabId; label: string; icon: React.ReactNode; collection: string }> = [
    { id: 'makeandgo', label: 'Make & Go',    icon: <Target size={16} />, collection: 'make-and-go-leads' },
    { id: 'quiz',      label: 'Quiz /quiz',   icon: <Bot size={16} />,    collection: 'lead-magnet-leads' },
  ];

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-black text-4xl uppercase mb-2">Leads</h1>
        <p className="text-gray-500 font-bold">Leads qualifiés — Make &amp; Go + Quiz de matching</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 mb-8 bg-white border-4 border-black rounded-2xl p-2 shadow-neo-sm w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-black text-sm uppercase transition-all border-2 ${
              activeTab === tab.id
                ? 'bg-black text-white border-black shadow-[3px_3px_0_0_rgba(0,0,0,0.3)]'
                : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'quiz'      && <QuizTab />}
      {activeTab === 'makeandgo' && <MakeAndGoTab />}
    </div>
  );
};
