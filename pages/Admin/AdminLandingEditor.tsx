import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePrograms } from '../../contexts/ProgramContext';
import { LandingPageData, MissionBox, Funnel, ComparisonRow, MarketingFramework } from '../../types';
import { useMissions } from '../../contexts/MissionContext';
import { Button } from '../../components/Button';
import {
  ArrowLeft, Save, Eye, Copy, Rocket, Plus, Trash2,
  ToggleLeft, ToggleRight, Upload, Image as ImageIcon, GripVertical, FolderArchive,
  FileDown, FileUp, Code2, CheckCircle2, ChevronDown, ChevronRight,
  Target, Zap, MessageCircle, HelpCircle, XCircle, Sparkles, TrendingUp, Info,
  Palette, Layout as LayoutIcon, MousePointer2, Globe, ListChecks, HelpCircle as FaqIcon,
  Cpu, PenTool, Lightbulb, Shield, Briefcase
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import imageCompression from 'browser-image-compression';
import { MediaPickerModal } from '../../components/MediaPickerModal';

/* ─── UI Components ────────────────────────────────────────────────────────── */
const Section: React.FC<{ 
  title: string; 
  badge?: string; 
  children: React.ReactNode; 
  accent?: string;
  defaultOpen?: boolean;
}> = ({
  title, badge, children, accent = 'bg-orange-500', defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-[2.5rem] border-4 border-black shadow-[8px_8px_0_0_black] overflow-hidden transition-all duration-300 mb-8">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-4 px-8 py-6 border-b-4 border-black text-left hover:brightness-105 active:brightness-95 transition-all group ${accent}`}
      >
        <div className="flex-1 flex items-center gap-4">
          <h2 className="font-black text-2xl text-black uppercase tracking-tight italic">{title}</h2>
          {badge && <span className="text-[10px] font-black bg-black text-white px-3 py-1 rounded-full uppercase tracking-widest">{badge}</span>}
        </div>
        <div className={`p-2 border-3 border-black rounded-xl bg-white/30 group-hover:bg-white/50 transition-all ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} className="text-black" />
        </div>
      </button>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[8000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-8 space-y-8 bg-gray-50/20">
          {children}
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="block font-black text-xs uppercase tracking-[0.2em] text-gray-500">{label}</label>
      {hint && <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded italic">{hint}</span>}
    </div>
    {children}
  </div>
);

const inputCls = "w-full p-4 border-4 border-black rounded-[1.25rem] font-bold text-sm focus:bg-orange-50 outline-none transition-all";
const textareaCls = "w-full p-4 border-4 border-black rounded-[1.25rem] font-bold text-sm focus:bg-orange-50 outline-none transition-all resize-none min-h-[100px]";

/* ─── Main Editor Component ────────────────────────────────────────────────── */
export const AdminLandingEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { programs, funnels, updateFunnel, isLoading: isProgramsLoading } = usePrograms();
  const { missions } = useMissions();

  const [lp, setLp] = useState<LandingPageData | null>(null);
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const hasLoadedRef = useRef(false);

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Sync state with funnel
  useEffect(() => {
    const found = funnels.find(f => f.id === id);
    if (found) {
      setFunnel(found);
      // Only set initial LP if we haven't loaded it yet for this ID
      if (!hasLoadedRef.current) {
        setLp(found.data);
        hasLoadedRef.current = true;
      }
    }
  }, [id, funnels]);

  const program = programs.find(p => p.id === funnel?.programId);
  // Allow selecting from all active missions in the gallery since missions are now cross-program entity
  const programMissions = missions.filter(m => m.active);
  const programStations = program?.stations || [];

  const setField = <K extends keyof LandingPageData>(key: K, value: LandingPageData[K]) => {
    if (!lp) return;
    setLp(prev => prev ? ({ ...prev, [key]: value }) : null);
  };

  const handleSave = async () => {
    if (!id || !lp) return;
    setIsSaving(true);
    try {
      await updateFunnel(id, { data: lp });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Erreur de sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  const handleMediaPick = (url: string) => {
    setField('galleryImages', [...(lp?.galleryImages || []), url]);
    setIsMediaPickerOpen(false);
  };

  if (isProgramsLoading || !lp || !funnel || !program) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
         <div className="w-20 h-20 border-8 border-black border-t-orange-500 rounded-full animate-spin mb-6" />
         <p className="font-black uppercase tracking-widest text-black/20 italic">Initialisation de la Factory...</p>
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/lp/${funnel.slug}`;

  return (
    <div className="max-w-5xl mx-auto pb-40">
      {/* ── Top Bar ── */}
      <div className="sticky top-4 z-[100] mb-12 flex items-center justify-between bg-white/80 backdrop-blur-md border-4 border-black p-4 rounded-[2rem] shadow-[8px_8px_0_0_black]">
        <div className="flex items-center gap-4 text-black">
          <button onClick={() => navigate('/admin/landing-pages')} className="p-3 border-2 border-black rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
             <div className="flex items-center gap-2">
                <h1 className="font-black text-xl uppercase tracking-tighter italic">{funnel.name}</h1>
                <span className={`text-[9px] font-black px-2 py-1 border-2 border-black rounded-full uppercase ${
                  funnel.framework === MarketingFramework.PAS ? 'bg-red-500 text-white' : 
                  funnel.framework === MarketingFramework.BAB ? 'bg-blue-500 text-white' : 
                  funnel.framework === MarketingFramework.CONTRAST ? 'bg-purple-500 text-white' : 'bg-black text-white'
                }`}>{funnel.framework}</span>
             </div>
             <p className="text-[10px] font-bold text-gray-400">Slug: /lp/{funnel.slug} • {program.title}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <a href={publicUrl} target="_blank" rel="noreferrer" className="p-3 border-4 border-black rounded-xl hover:bg-gray-100 transition-all bg-white shadow-[4px_4px_0_0_black] hover:shadow-none translate-y-[-2px] hover:translate-y-0 text-black">
            <Eye size={20} />
          </a>
          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className={`px-8 py-3 border-4 border-black rounded-xl font-black uppercase text-sm tracking-widest flex items-center gap-3 transition-all shadow-[6px_6px_0_0_black] hover:shadow-none translate-y-[-2px] hover:translate-y-0 ${saved ? 'bg-green-500 text-white' : 'bg-orange-500 text-black'}`}
          >
            {isSaving ? <span className="animate-spin text-xl">⏳</span> : (saved ? '✨ SAUVEGARDÉ' : '💾 SAUVEGARDER')}
            {!isSaving && !saved && <Rocket size={18} />}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* ── SECTON: CONFIGURATION VISUELLE ────────────────────────────────── */}
        <Section title="Design & Configuration" accent="bg-white" badge="Styles" defaultOpen={true}>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Field label="Couleur Thème (Palette)" hint="L'ambiance du funnel">
                 <div className="flex gap-2">
                    {['orange', 'blue', 'green', 'red'].map(c => (
                      <button key={c} onClick={() => setField('themeColor', c as any)} className={`w-10 h-10 rounded-full border-4 ${lp.themeColor === c ? 'border-black' : 'border-transparent'} shadow-sm`} style={{ backgroundColor: c === 'orange' ? '#f97316' : c === 'blue' ? '#3b82f6' : c === 'green' ? '#16a34a' : '#dc2626' }} />
                    ))}
                 </div>
              </Field>
              <Field label="Layout (Architecture)" hint="Structure de page">
                 <div className="flex gap-2">
                   <button onClick={() => setField('layoutVariant', 'classic')} className={`flex-1 py-3 border-4 rounded-xl font-black text-[10px] uppercase ${lp.layoutVariant === 'classic' ? 'bg-black text-white border-black' : 'border-gray-200 text-black'}`}>CLASSIC</button>
                   <button onClick={() => setField('layoutVariant', 'modular')} className={`flex-1 py-3 border-4 rounded-xl font-black text-[10px] uppercase ${lp.layoutVariant === 'modular' ? 'bg-black text-white border-black' : 'border-gray-200 text-black'}`}>MODULAR</button>
                 </div>
              </Field>
              <Field label="Mode CTA (Conversion)" hint="Action du bouton">
                 <div className="flex gap-2">
                   <button onClick={() => setField('ctaMode', 'booking')} className={`flex-1 py-3 border-4 rounded-xl font-black text-[10px] uppercase ${lp.ctaMode === 'booking' ? 'bg-black text-white border-black' : 'border-gray-200 text-black'}`}>BOOKING</button>
                   <button onClick={() => setField('ctaMode', 'lead')} className={`flex-1 py-3 border-4 rounded-xl font-black text-[10px] uppercase ${lp.ctaMode === 'lead' ? 'bg-black text-white border-black' : 'border-gray-200 text-black'}`}>LEAD FORM</button>
                 </div>
              </Field>
           </div>
           <Field label="Tracking Code (Meta Pixel / GTM)" hint="Coller le script complet ici">
              <textarea value={lp.metaPixel || ''} onChange={e => setField('metaPixel', e.target.value)} className={textareaCls} placeholder="<script>...</script>" />
           </Field>
        </Section>

        {/* ── SECTION: HERO ────────────────────────────────────────────────── */}
        <Section title="Section 1 — Hero & Accroche" accent="bg-orange-500">
          <Field label="Sur-titre (Premium Placement)" hint="Ex: LE PREMIER INCUBATEUR TECH...">
            <input value={lp.heroSurTitre || ''} onChange={e => setField('heroSurTitre', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Pre-Headline (Attention Grabber)" hint="Ex: ATTENTION PARENTS DE CASABLANCA">
            <input value={lp.heroPreHeadline || ''} onChange={e => setField('heroPreHeadline', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Titre Principal Hook" hint="La promesse irrésistible">
            <textarea value={lp.heroHeadline || ''} onChange={e => setField('heroHeadline', e.target.value)} className={textareaCls} rows={2} />
          </Field>
          <Field label="Sous-titre / Promesse" hint="Détaillez la transformation">
            <textarea value={lp.heroSubHeadline || ''} onChange={e => setField('heroSubHeadline', e.target.value)} className={textareaCls} rows={2} />
          </Field>
          <div className="grid grid-cols-2 gap-8">
             <Field label="Texte Bouton CTA">
               <input value={lp.heroCtaText || ''} onChange={e => setField('heroCtaText', e.target.value)} className={inputCls} />
             </Field>
             <Field label="Scarcity (Preuve d'urgence)">
               <input value={lp.heroScarcityText || ''} onChange={e => setField('heroScarcityText', e.target.value)} className={inputCls} />
             </Field>
          </div>
        </Section>

        {/* ── SECTION: FRAMEWORK MARKETING ───────────────────────────────────── */}
        {funnel.framework === MarketingFramework.PAS && (
          <Section title="Framework PAS (Problem/Agitation/Solution)" accent="bg-red-500" badge="Impact Rouge">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <Field label="Le Problème (Headline)">
                      <input value={lp.problemHeadline || ''} onChange={e => setField('problemHeadline', e.target.value)} className={inputCls} />
                   </Field>
                   <Field label="Développement Problème">
                      <textarea value={lp.problemBody || ''} onChange={e => setField('problemBody', e.target.value)} className={textareaCls} />
                   </Field>
                </div>
                <div className="space-y-4">
                   <Field label="L'Agitation (La douleur)">
                      <input value={lp.agitationHeadline || ''} onChange={e => setField('agitationHeadline', e.target.value)} className={inputCls} />
                   </Field>
                   <Field label="Développement Agitation">
                      <textarea value={lp.agitationBody || ''} onChange={e => setField('agitationBody', e.target.value)} className={textareaCls} />
                   </Field>
                </div>
             </div>
             <div className="pt-8 border-t-2 border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="font-black text-sm uppercase italic">La Révélation (La Solution)</h3>
                   <button onClick={() => setField('showStationsInPAS', !lp.showStationsInPAS)} className={`px-4 py-1.5 border-2 border-black rounded-lg text-[10px] font-black uppercase ${lp.showStationsInPAS ? 'bg-green-500' : 'bg-gray-100 opacity-50'}`}>Afficher Stations Inno.</button>
                </div>
                <Field label="Titre Solution">
                   <input value={lp.solutionHeadline || ''} onChange={e => setField('solutionHeadline', e.target.value)} className={inputCls} placeholder="Entrez dans StemQuest : L'incubateur..." />
                </Field>
                <Field label="Corps Solution">
                   <textarea value={lp.solutionBody || ''} onChange={e => setField('solutionBody', e.target.value)} className={textareaCls} rows={3} />
                </Field>
             </div>
             <div className="pt-8 border-t-2 border-gray-100 space-y-4">
                <h3 className="font-black text-sm uppercase italic">Logistique & Zéro Friction</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <Field label="Headline Logistique">
                      <input value={lp.logisticsHeadline || ''} onChange={e => setField('logisticsHeadline', e.target.value)} className={inputCls} placeholder="Un écosystème sur-mesure..." />
                   </Field>
                   <Field label="Corps Logistique">
                      <textarea value={lp.logisticsBody || ''} onChange={e => setField('logisticsBody', e.target.value)} className={textareaCls} rows={2} />
                   </Field>
                </div>
             </div>
          </Section>
        )}

        {funnel.framework === MarketingFramework.BAB && (
          <Section title="Framework BAB (Before / After)" accent="bg-blue-500" badge="Transformation">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Avant (Situation actuelle)">
                   <textarea value={lp.beforeHeadline || ''} onChange={e => setField('beforeHeadline', e.target.value)} className={textareaCls} placeholder="Trois heures devant les écrans sans rien créer..." />
                </Field>
                <Field label="Après (La réussite)">
                   <textarea value={lp.afterHeadline || ''} onChange={e => setField('afterHeadline', e.target.value)} className={textareaCls} placeholder="Il code son propre robot et comprend la tech !" />
                </Field>
             </div>
             <Field label="Le Pont (Comment on y arrive)">
                <input value={lp.bridgeHeadline || ''} onChange={e => setField('bridgeHeadline', e.target.value)} className={inputCls} />
             </Field>
          </Section>
        )}

        {funnel.framework === MarketingFramework.CONTRAST && (
          <Section title="Framework Contrast (Us vs Them)" accent="bg-purple-600" badge="Supériorité">
             <div className="space-y-4">
                {(lp.comparisonRows || []).map((row, i) => (
                  <div key={row.id} className="grid grid-cols-12 gap-3 bg-white p-4 rounded-2xl border-4 border-black items-center">
                    <div className="col-span-3">
                       <input value={row.feature} onChange={e => {
                         const next = [...(lp.comparisonRows || [])];
                         next[i].feature = e.target.value;
                         setField('comparisonRows', next);
                       }} className="w-full text-[10px] font-black uppercase p-2 border-2 border-black rounded-lg" placeholder="Poin t" />
                    </div>
                    <div className="col-span-4">
                       <input value={row.us} onChange={e => {
                         const next = [...(lp.comparisonRows || [])];
                         next[i].us = e.target.value;
                         setField('comparisonRows', next);
                       }} className="w-full text-xs font-black p-2 border-2 border-black rounded-lg bg-green-50" placeholder="MakerLab" />
                    </div>
                    <div className="col-span-4">
                       <input value={row.them} onChange={e => {
                         const next = [...(lp.comparisonRows || [])];
                         next[i].them = e.target.value;
                         setField('comparisonRows', next);
                       }} className="w-full text-xs font-bold p-2 border-2 border-black rounded-lg" placeholder="Autres" />
                    </div>
                    <div className="col-span-1 flex justify-center">
                       <button onClick={() => setField('comparisonRows', (lp.comparisonRows || []).filter((_, idx) => idx !== i))} className="text-red-500 hover:scale-110"><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
                <button onClick={() => setField('comparisonRows', [...(lp.comparisonRows || []), { id: Date.now().toString(), feature: '', us: '', them: '', usBetter: true }])} className="w-full py-4 border-4 border-dashed border-gray-200 rounded-2xl font-black uppercase text-xs text-gray-400 hover:border-black hover:text-black transition-all">+ Ajouter une ligne de comparaison</button>
             </div>
          </Section>
        )}

        {/* ── SECTION: STATIONS DYNAMIQUE (NEW) ──────────────────────────────── */}
        <Section title="Innovation Stations (Pôles)" accent="bg-white" badge="Dynamic">
           <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-black text-sm uppercase italic">Quelles stations du programme afficher ?</h3>
                <Link to={`/admin/program/${program.id}`} className="text-[10px] font-black text-orange-500 underline flex items-center gap-1 hover:text-black"><Plus size={12}/> Gérer les stations dans le programme</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {programStations.map(station => {
                    const isSelected = (lp.selectedStationIds || []).includes(station.id);
                    return (
                      <button 
                        key={station.id}
                        onClick={() => {
                          const current = lp.selectedStationIds || [];
                          const next = isSelected ? current.filter(sid => sid !== station.id) : [...current, station.id];
                          setField('selectedStationIds', next);
                        }}
                        className={`flex items-center gap-4 p-4 border-4 rounded-2xl text-left transition-all ${isSelected ? 'border-black bg-orange-50 shadow-[4px_4px_0_0_#000]' : 'border-gray-100 hover:border-gray-300'}`}
                      >
                         <div className={`w-8 h-8 rounded-xl border-2 border-black flex items-center justify-center ${isSelected ? 'bg-orange-500 text-black' : 'bg-white text-gray-300'}`}>
                            {station.icon === 'Cpu' && <Cpu size={16}/>}
                            {station.icon === 'Code2' && <Code2 size={16}/>}
                            {station.icon === 'Zap' && <Zap size={16}/>}
                            {station.icon === 'PenTool' && <PenTool size={16}/>}
                            {station.icon === 'Video' && <ImageIcon size={16}/>}
                            {station.icon === 'Globe' && <Globe size={16}/>}
                            {station.icon === 'Rocket' && <Rocket size={16}/>}
                            {station.icon === 'Briefcase' && <Briefcase size={16}/>}
                         </div>
                         <div>
                            <p className="font-black text-xs uppercase text-black">{station.title}</p>
                            <p className="text-[10px] font-bold text-gray-400 line-clamp-1">{station.description}</p>
                         </div>
                      </button>
                    );
                 })}
              </div>
              {programStations.length === 0 && <p className="p-8 text-center text-gray-400 font-bold italic">Aucune station définie pour ce programme. Allez dans l'éditeur de programme pour en ajouter.</p>}
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t-2 border-gray-100">
              <Field label="Titre Section Stations">
                 <input value={lp.stationsHeadline || ''} onChange={e => setField('stationsHeadline', e.target.value)} className={inputCls} placeholder="Une progression individuelle..." />
              </Field>
              <Field label="Sous-titre Section Stations">
                 <input value={lp.stationsSubHeadline || ''} onChange={e => setField('stationsSubHeadline', e.target.value)} className={inputCls} />
              </Field>
           </div>
        </Section>

        {/* ── SECTION: MISSIONS & SESSIONS ──────────────────────────────────── */}
        <Section title="Sélection des Sessions" accent="bg-white" badge="Live Data">
           <div className="mb-6">
              <h3 className="font-black text-sm uppercase mb-4 italic">Quelles sessions afficher pour ce funnel ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {programMissions.map(m => {
                    const isSelected = (lp.missionIds || []).includes(m.id);
                    return (
                      <button 
                        key={m.id}
                        onClick={() => {
                          const current = lp.missionIds || [];
                          const next = isSelected ? current.filter(vid => vid !== m.id) : [...current, m.id];
                          setField('missionIds', next);
                        }}
                        className={`flex items-center gap-4 p-4 border-4 rounded-2xl text-left transition-all ${isSelected ? 'border-black bg-indigo-50 shadow-[4px_4px_0_0_#000]' : 'border-gray-100 hover:border-gray-300'}`}
                      >
                         <div className={`w-6 h-6 rounded border-2 border-black flex items-center justify-center ${isSelected ? 'bg-black text-white' : 'bg-white'}`}>
                            {isSelected && <CheckCircle2 size={16} />}
                         </div>
                         <div>
                            <p className="font-black text-xs uppercase text-black">{m.title}</p>
                            <p className="text-[10px] font-bold text-gray-400">{m.date} • {m.price}</p>
                         </div>
                      </button>
                    );
                 })}
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t-2 border-gray-100">
              <Field label="Titre Section Sessions">
                 <input value={lp.missionsHeadline || ''} onChange={e => setField('missionsHeadline', e.target.value)} className={inputCls} />
              </Field>
              <Field label="Sous-titre Section Sessions">
                 <input value={lp.missionsSubHeadline || ''} onChange={e => setField('missionsSubHeadline', e.target.value)} className={inputCls} />
              </Field>
           </div>
        </Section>

        {/* ── SECTION: FAQ ──────────────────────────────────────────────────── */}
        <Section title="FAQ & Réassurance" accent="bg-white">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-sm uppercase italic">Activer la Foire aux Questions</h3>
              <button onClick={() => setField('faqEnabled', !lp.faqEnabled)} className={`flex items-center gap-2 px-4 py-2 border-4 border-black rounded-xl font-black text-[10px] uppercase ${lp.faqEnabled ? 'bg-green-500' : 'bg-gray-100 opacity-50'}`}>
                 {lp.faqEnabled ? 'Activé ✓' : 'Désactivé'}
              </button>
           </div>
           {lp.faqEnabled && (
              <div className="space-y-4">
                 {(lp.faqItems || []).map((faq, i) => (
                   <div key={faq.id} className="p-6 bg-white border-4 border-black rounded-3xl space-y-4 relative group">
                      <button onClick={() => setField('faqItems', (lp.faqItems || []).filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                      <Field label={`Question ${i+1}`}>
                        <input value={faq.question} onChange={e => {
                           const next = [...(lp.faqItems || [])];
                           next[i].question = e.target.value;
                           setField('faqItems', next);
                        }} className="w-full p-2 border-b-2 border-black font-black text-sm outline-none focus:border-indigo-500 text-black" />
                      </Field>
                      <Field label="Réponse">
                        <textarea value={faq.answer} onChange={e => {
                           const next = [...(lp.faqItems || [])];
                           next[i].answer = e.target.value;
                           setField('faqItems', next);
                        }} className="w-full p-2 border-2 border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-black text-black" rows={2} />
                      </Field>
                   </div>
                 ))}
                 <button onClick={() => setField('faqItems', [...(lp.faqItems || []), { id: Date.now().toString(), question: '', answer: '' }])} className="w-full py-4 border-4 border-dashed border-gray-200 rounded-2xl font-black uppercase text-xs text-gray-400 hover:border-black transition-all">+ Ajouter une question</button>
              </div>
           )}
        </Section>

        {/* ── SECTION: GALLERY ──────────────────────────────────────────────── */}
        <Section title="Galerie & Preuve Sociale" accent="bg-white">
          <Field label="Aperçu Social Media (OG)" hint="1200x630">
            <div className="flex items-center gap-8">
               <div className="w-40 h-24 bg-gray-100 border-4 border-black rounded-xl overflow-hidden shadow-neo-sm relative group">
                  {lp.ogImage ? <img src={lp.ogImage} className="w-full h-full object-cover" alt="OG" /> : <ImageIcon className="absolute inset-0 m-auto text-gray-300" />}
               </div>
               <input type="text" value={lp.ogImage || ''} onChange={e => setField('ogImage', e.target.value)} className={inputCls} placeholder="URL de l'image..." />
            </div>
          </Field>
          <Field label="Photos Galerie">
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <button onClick={() => setIsMediaPickerOpen(true)} className="aspect-square border-4 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-black hover:text-black transition-all">
                   <Plus size={20} />
                   <span className="font-black text-[8px] uppercase">Ajouter</span>
                </button>
                {(lp.galleryImages || []).map((img, i) => (
                  <div key={i} className="aspect-square border-2 border-black rounded-xl overflow-hidden relative group">
                     <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                     <button onClick={() => setField('galleryImages', (lp.galleryImages || []).filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                  </div>
                ))}
             </div>
          </Field>
        </Section>
      </div>

      <div className="fixed bottom-10 right-10 z-[200]">
         <button 
           onClick={handleSave} 
           disabled={isSaving}
           className={`group w-16 h-16 rounded-full border-4 border-black shadow-[6px_6px_0_0_#000] flex items-center justify-center transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${saved ? 'bg-green-500 animate-bounce' : 'bg-orange-500'}`}
         >
           {isSaving ? <span className="animate-spin text-2xl text-white">◍</span> : (saved ? <CheckCircle2 className="text-white" /> : <Save className="group-hover:scale-110 transition-transform text-black" />)}
         </button>
      </div>

      {isMediaPickerOpen && (
        <MediaPickerModal onSelect={handleMediaPick} onCancel={() => setIsMediaPickerOpen(false)} />
      )}
    </div>
  );
};
