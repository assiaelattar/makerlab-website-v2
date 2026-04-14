import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrograms } from '../../contexts/ProgramContext';
import { 
  Rocket, Eye, Edit2, Copy, CheckCircle2, XCircle, 
  Plus, Layers, Layout, Target, Trash2, ExternalLink
} from 'lucide-react';
import { Funnel, LandingPageData } from '../../types';

export const AdminLandingPages: React.FC = () => {
  const { programs, funnels, addFunnel, deleteFunnel, updateFunnel } = usePrograms();
  const [showNewModal, setShowNewModal] = useState(false);
  const [newFunnel, setNewFunnel] = useState<{ 
    name: string; 
    slug: string; 
    programId: string; 
    framework: Funnel['framework'] 
  }>({
    name: '',
    slug: '',
    programId: '',
    framework: 'classic'
  });

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/lp/${slug}`;
    navigator.clipboard.writeText(url);
    const btn = document.getElementById(`copy-lp-${slug}`);
    if (btn) {
      btn.textContent = '✓ Copié !';
      setTimeout(() => { if (btn) btn.textContent = 'Copier'; }, 1500);
    }
  };

  const handleCreateFunnel = async () => {
    if (!newFunnel.name || !newFunnel.slug || !newFunnel.programId) return;
    
    const program = programs.find(p => p.id === newFunnel.programId);
    
    // Default data structure
    const defaultData: LandingPageData = {
      enabled: true,
      framework: newFunnel.framework,
      layoutVariant: newFunnel.framework === 'classic' ? 'classic' : 'modular',
      ctaMode: 'booking',
      heroHeadline: program?.landingPage?.heroHeadline || `Solution pour ${program?.title || 'Nouvelle Landing Page'}`,
      heroSubHeadline: program?.landingPage?.heroSubHeadline || '',
      heroCtaText: program?.landingPage?.heroCtaText || 'RÉSERVER MAINTENANT',
      
      ...(newFunnel.framework === 'pas' && {
        problemHeadline: program?.landingPage?.problemHeadline || "Le problème que vos enfants rencontrent...",
        problemBody: program?.landingPage?.problemBody || "",
        agitationHeadline: program?.landingPage?.agitationHeadline || "Pourquoi c'est urgent de changer...",
        agitationBody: program?.landingPage?.agitationBody || "",
        solutionHeadline: program?.landingPage?.solutionHeadline || "La solution ultime...",
        solutionBody: program?.landingPage?.solutionBody || ""
      }),
      ...(newFunnel.framework === 'bab' && {
        beforeHeadline: program?.landingPage?.beforeHeadline || "Avant de nous rejoindre...",
        afterHeadline: program?.landingPage?.afterHeadline || "Ce qu'ils deviennent avec nous...",
        bridgeHeadline: program?.landingPage?.bridgeHeadline || "Comment nous faisons le pont..."
      }),
      ...(newFunnel.framework === 'contrast' && {
        comparisonRows: program?.landingPage?.comparisonRows || [
          { id: Date.now().toString(), feature: "La méthode", us: "Pratique", them: "Théorique", usBetter: true }
        ]
      })
    };

    await addFunnel({
      programId: newFunnel.programId,
      name: newFunnel.name,
      slug: newFunnel.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      framework: newFunnel.framework,
      active: true,
      data: defaultData,
      createdAt: new Date().toISOString()
    });

    setShowNewModal(false);
    setNewFunnel({ name: '', slug: '', programId: '', framework: 'classic' });
  };

  const handleDeleteFunnel = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce funnel ? Cette action est irréversible.')) {
      await deleteFunnel(id);
    }
  };

  const handleDuplicateFunnel = async (funnel: Funnel) => {
    const newSlug = `${funnel.slug}-copy-${Math.floor(Math.random() * 1000)}`;
    const newName = `${funnel.name} (Copy)`;
    
    await addFunnel({
      ...funnel,
      id: undefined as any,
      name: newName,
      slug: newSlug,
      createdAt: new Date().toISOString(),
      stats: { visits: 0, leads: 0 }
    });
  };

  const handleMigrateProgram = async (program: any) => {
    if (!program.landingPage) return;
    const slug = program.id.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    await addFunnel({
      programId: program.id,
      name: `${program.title} (Migrated)`,
      slug,
      framework: program.landingPage.framework || 'classic',
      active: true,
      data: program.landingPage,
      createdAt: new Date().toISOString()
    });
    
    alert('Funnel créé à partir des données existantes !');
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 border-4 border-black rounded-xl flex items-center justify-center shadow-[4px_4px_0_0_black]">
            <Layers size={24} strokeWidth={3} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tight">Funnel Factory</h1>
            <p className="text-gray-500 font-medium text-sm italic">Créez, testez et déployez vos variantes marketing</p>
          </div>
        </div>
        <button 
          onClick={() => setShowNewModal(true)}
          className="px-6 py-3 bg-brand-orange text-black font-black uppercase text-sm border-4 border-black rounded-xl shadow-[4px_4px_0_0_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
        >
          <Plus size={20} strokeWidth={3} /> Nouveau Funnel
        </button>
      </div>

      {/* Funnels Grouped by Program */}
      <div className="space-y-12">
        {programs.map(program => {
          const programFunnels = funnels.filter(f => f.programId === program.id);
          
          return (
            <div key={program.id} className="bg-white border-4 border-black rounded-[2rem] overflow-hidden shadow-[8px_8px_0_0_black]">
              {/* Program Header Block */}
              <div className="bg-gray-50 border-b-4 border-black p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl border-2 border-black overflow-hidden bg-white shrink-0">
                      {program.image && <img src={program.image} className="w-full h-full object-cover" alt="" />}
                   </div>
                    <div>
                      <h2 className="font-black text-xl uppercase tracking-tighter">{program.title}</h2>
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white rounded-full">{program.format}</span>
                         {program.landingPage?.enabled && programFunnels.length === 0 && (
                            <button 
                              onClick={() => handleMigrateProgram(program)}
                              className="text-[10px] font-black uppercase px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full border border-orange-200 hover:bg-orange-200"
                            >
                               ⚠️ Migrer Ancienne LP
                            </button>
                         )}
                      </div>
                    </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status global</p>
                   {program.active ? (
                     <span className="text-green-600 font-black text-xs uppercase flex items-center justify-end gap-1"><CheckCircle2 size={12}/> Actif</span>
                   ) : (
                     <span className="text-red-600 font-black text-xs uppercase flex items-center justify-end gap-1"><XCircle size={12}/> Inactif</span>
                   )}
                </div>
              </div>

              {/* Funnels Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-black text-white text-[10px] uppercase font-black tracking-widest border-b-4 border-black">
                    <tr>
                      <th className="p-4 border-r-2 border-gray-800">Variante / Slug</th>
                      <th className="p-4 border-r-2 border-gray-800 text-center">Framework</th>
                      <th className="p-4 border-r-2 border-gray-800 text-center">Statut</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-gray-100">
                    {programFunnels.length > 0 ? (
                      programFunnels.map(funnel => (
                        <tr key={funnel.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="p-4 border-r-2 border-gray-100">
                            <div>
                              <p className="font-black text-base leading-none mb-1">{funnel.name}</p>
                              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold">
                                <ExternalLink size={12} />
                                <span>/lp/{funnel.slug}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 border-r-2 border-gray-100 text-center">
                             <span className={`inline-block px-2 py-1 rounded-lg border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0_0_black] ${
                               funnel.framework === 'pas' ? 'bg-red-50 text-red-600' :
                               funnel.framework === 'bab' ? 'bg-blue-50 text-blue-600' :
                               funnel.framework === 'contrast' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50'
                             }`}>
                               {funnel.framework}
                             </span>
                          </td>
                          <td className="p-4 border-r-2 border-gray-100 text-center">
                            <button 
                              onClick={() => updateFunnel(funnel.id, { active: !funnel.active })}
                              className={`p-1.5 rounded-xl border-2 border-black transition-all ${funnel.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                            >
                              {funnel.active ? <CheckCircle2 size={18} strokeWidth={3} /> : <XCircle size={18} strokeWidth={3} />}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                               <Link to={`/lp/${funnel.slug}`} target="_blank" className="p-3 border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all bg-white shadow-[3px_3px_0_0_black] hover:shadow-none translate-y-[-2px] hover:translate-y-0">
                                  <Eye size={16} />
                               </Link>
                               <Link to={`/admin/landing/${funnel.id}`} className="p-3 border-2 border-black rounded-xl hover:bg-brand-orange transition-all bg-white shadow-[3px_3px_0_0_black] hover:shadow-none translate-y-[-2px] hover:translate-y-0">
                                  <Edit2 size={16} />
                               </Link>
                               <button 
                                 onClick={() => handleCopyLink(funnel.slug)}
                                 id={`copy-lp-${funnel.slug}`}
                                 className="p-3 border-2 border-black rounded-xl hover:bg-indigo-50 transition-all bg-white shadow-[3px_3px_0_0_black] hover:shadow-none translate-y-[-2px] hover:translate-y-0"
                               >
                                  <Copy size={16} />
                               </button>
                               <button 
                                 onClick={() => handleDuplicateFunnel(funnel)}
                                 className="p-3 border-2 border-black rounded-xl hover:bg-green-50 transition-all bg-white shadow-[3px_3px_0_0_black] hover:shadow-none translate-y-[-2px] hover:translate-y-0"
                               >
                                  <Plus size={16} />
                               </button>
                               <button 
                                 onClick={() => handleDeleteFunnel(funnel.id)}
                                 className="p-3 border-2 border-black rounded-xl hover:bg-red-500 hover:text-white transition-all bg-white shadow-[3px_3px_0_0_black] hover:shadow-none translate-y-[-2px] hover:translate-y-0"
                               >
                                  <Trash2 size={16} />
                               </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-400 italic text-sm">
                          Aucun funnel pour ce programme. Créez-en un pour lancer vos tests A/B !
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Funnel Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowNewModal(false)} />
          <div className="relative w-full max-w-lg bg-white border-8 border-black rounded-[2.5rem] shadow-[20px_20px_0_0_rgba(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
            <div className="bg-black p-6 text-white flex justify-between items-center">
               <h3 className="font-black text-2xl uppercase italic">🚀 Nouveau Funnel</h3>
               <button onClick={() => setShowNewModal(false)}><XCircle /></button>
            </div>
            
            <div className="p-8 space-y-6">
               {/* Step 1: Program */}
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-gray-400">1. Programme Parent</label>
                  <select 
                    value={newFunnel.programId}
                    onChange={e => setNewFunnel(p => ({ ...p, programId: e.target.value }))}
                    className="w-full p-4 border-4 border-black rounded-2xl font-black text-sm outline-none focus:bg-gray-50"
                  >
                    <option value="">-- Choisir un programme --</option>
                    {programs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
               </div>

               {/* Step 2: Framework */}
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-gray-400">2. Framework Marketing</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'classic', label: 'Classic', hint: 'Default' },
                      { id: 'pas', label: 'PAS', hint: 'Problem/Agitation' },
                      { id: 'bab', label: 'BAB', hint: 'Before/After' },
                      { id: 'contrast', label: 'Contrast', hint: 'Us vs Them' },
                    ].map(f => (
                      <button 
                        key={f.id}
                        onClick={() => setNewFunnel(p => ({ ...p, framework: f.id as any }))}
                        className={`p-3 border-4 rounded-xl text-left transition-all ${newFunnel.framework === f.id ? 'border-black bg-indigo-50 shadow-[4px_4px_0_0_black]' : 'border-gray-200 hover:border-gray-400 bg-white'}`}
                      >
                        <p className="font-black text-xs uppercase">{f.label}</p>
                        <p className="text-[9px] font-bold text-gray-400">{f.hint}</p>
                      </button>
                    ))}
                  </div>
               </div>

               {/* Step 3: Identity */}
               <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-100">
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1.5">Nom de la Campagne</label>
                    <input 
                      placeholder="Ex: StemQuest - Campagne Facebook Mars"
                      value={newFunnel.name}
                      onChange={e => setNewFunnel(p => ({ ...p, name: e.target.value }))}
                      className="w-full p-3 border-4 border-black rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-1.5">Slug URL (makerlab.ma/lp/...)</label>
                    <input 
                      placeholder="ex-slug-unique"
                      value={newFunnel.slug}
                      onChange={e => setNewFunnel(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                      className="w-full p-3 border-4 border-black rounded-xl font-bold text-sm bg-gray-50 text-indigo-600"
                    />
                  </div>
               </div>

               <button 
                 onClick={handleCreateFunnel}
                 disabled={!newFunnel.name || !newFunnel.slug || !newFunnel.programId}
                 className="w-full py-5 bg-black text-white font-black text-xl uppercase tracking-widest rounded-2xl hover:bg-brand-orange hover:text-black transition-all disabled:opacity-20"
               >
                 C'est parti ! 🚀
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
