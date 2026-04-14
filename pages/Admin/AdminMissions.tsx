import React, { useState } from 'react';
import { useMissions } from '../../contexts/MissionContext';
import { Target, Package, Layers, Plus, Calendar, Settings, Image as ImageIcon, Users, X, Save, Compass, Clock, Rocket } from 'lucide-react';
import { Button } from '../../components/Button';
import { Mission, Track, DemoSlot, RecurrentSlot } from '../../types';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const AdminMissions: React.FC = () => {
  const { missions, tracks, leads, orientationLeads, demoSlots, recurrentSlots, loading, addMission, addTrack, deleteMission, deleteTrack, addDemoSlot, updateDemoSlot, deleteDemoSlot, addRecurrentSlot, updateRecurrentSlot, deleteRecurrentSlot } = useMissions();
  const [activeTab, setActiveTab] = useState<'missions' | 'tracks' | 'leads' | 'orientation' | 'demos'>('missions');
  const [editingMission, setEditingMission] = useState<Partial<Mission> | null>(null);
  const [editingDemoSlot, setEditingDemoSlot] = useState<Partial<DemoSlot> | null>(null);
  const [editingRecurrentSlot, setEditingRecurrentSlot] = useState<Partial<RecurrentSlot> | null>(null);
  const [editingTrack, setEditingTrack] = useState<Partial<Track> | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState<'mission' | 'track' | null>(null);

  const checkConflict = (isoDate: string, start: string, end: string, excludeId?: string) => {
    // Check missions
    const missionConflict = missions.find(m => 
      m.id !== excludeId && 
      m.isoDate === isoDate && 
      ((start >= m.startTime! && start < m.endTime!) || (end > m.startTime! && end <= m.endTime!) || (start <= m.startTime! && end >= m.endTime!))
    );
    if (missionConflict) return `Conflit avec la mission: ${missionConflict.title}`;

    // Check demo slots
    const demoConflict = demoSlots.find(d => 
      d.id !== excludeId &&
      d.isoDate === isoDate &&
      ((start >= d.startTime && start < d.endTime) || (end > d.startTime && end <= d.endTime) || (start <= d.startTime && end >= d.endTime))
    );
    if (demoConflict) return `Conflit avec l'atelier démo: ${demoConflict.title}`;

    return null;
  };

  const tabs = [
    { id: 'missions', label: 'Sessions Uniques', icon: Target },
    { id: 'tracks', label: 'Parcours (Packs)', icon: Layers },
    { id: 'demos', label: 'Ateliers Démo', icon: Calendar },
    { id: 'leads', label: 'Inscriptions', icon: Users },
    { id: 'orientation', label: 'Demandes Conseil', icon: Compass },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-4xl mb-2 text-black flex items-center gap-3">
            <Package size={36} className="text-orange-500" />
            Missions & Parcours
          </h1>
          <p className="text-gray-600 font-medium max-w-2xl">
            Gérez les sessions dynamiques du programme Make & Go. Créez des missions individuelles et regroupez-les en parcours (Packs).
          </p>
        </div>
        <div className="flex gap-3">
          {activeTab === 'missions' && (
            <Button onClick={() => setEditingMission({ status: 'open', spotsTotal: 20, spotsLeft: 20, active: true, isoDate: new Date().toISOString().split('T')[0], startTime: '14:30', endTime: '17:30' })} variant="primary" className="shadow-neo bg-orange-500 border-black text-black font-black uppercase"><Plus size={20} /> Nouvelle Mission</Button>
          )}
          {activeTab === 'demos' && (
            <div className="flex gap-2">
              <Button onClick={() => setEditingRecurrentSlot({ active: true, maxSpots: 10, dayOfWeek: 6, startTime: '10:00', endTime: '11:00' })} variant="outline" className="shadow-neo border-black text-black font-black uppercase"><Plus size={20} /> Nouveau Modèle Récurrent</Button>
              <Button onClick={() => setEditingDemoSlot({ active: true, spotsTotal: 10, spotsLeft: 10, isoDate: new Date().toISOString().split('T')[0], startTime: '10:00', endTime: '11:00' })} variant="primary" className="shadow-neo bg-purple-500 border-black text-white font-black uppercase"><Plus size={20} /> Nouvelle Date Spécifique</Button>
            </div>
          )}
          {activeTab === 'tracks' && (
            <Button onClick={() => setEditingTrack({ benefits: ['', '', ''], active: true })} variant="primary" className="shadow-neo bg-blue-500 border-black text-white font-black uppercase"><Plus size={20} /> Nouveau Parcours</Button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto mb-8 border-b-4 border-black pb-4">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-black uppercase text-sm rounded-xl border-4 transition-all ${
                isActive 
                  ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(255,165,0,1)] -translate-y-1' 
                  : 'bg-white text-gray-500 border-transparent hover:border-gray-200'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
              {tab.id === 'leads' && leads.length > 0 && (
                <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{leads.length}</span>
              )}
              {tab.id === 'orientation' && orientationLeads.length > 0 && (
                <span className="ml-2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-xs">{orientationLeads.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-500">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin mb-4" />
          <p className="font-black">Chargement des modules...</p>
        </div>
      ) : (
        <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 min-h-[500px]">
          
          {/* TAB: MISSIONS */}
          {activeTab === 'missions' && (
            <div>
              {missions.length === 0 ? (
                <div className="text-center py-20">
                  <Target size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="font-black text-xl mb-2">Aucune mission</h3>
                  <p className="text-gray-500 mb-6">Créez votre première session Make & Go.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {missions.map(mission => (
                    <div key={mission.id} className={`group border-4 border-black rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-neo transition-all bg-gray-50 flex flex-col ${!mission.active ? 'grayscale opacity-75' : ''}`}>
                      <div className="aspect-video bg-gray-200 relative overflow-hidden border-b-4 border-black flex items-center justify-center">
                        {mission.coverImage ? (
                          <img src={mission.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                        ) : (
                          <ImageIcon className="text-gray-400 opacity-50" size={32} />
                        )}
                        <div className="absolute top-2 left-2 flex gap-2">
                          <div className="bg-black text-white px-2 py-1 text-[10px] font-black uppercase rounded">
                            {mission.category}
                          </div>
                          {!mission.active && (
                            <div className="bg-red-500 text-white px-2 py-1 text-[10px] font-black uppercase rounded flex items-center gap-1">
                              <X size={10} /> Masqué
                            </div>
                          )}
                        </div>
                        
                        {/* Admin Action Menu on Card */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingMission(mission); }}
                            className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-neo-sm hover:-translate-y-1 transition-transform"
                            title="Modifier"
                          >
                            <Settings size={20} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); if(window.confirm('Supprimer cette mission ?')) deleteMission(mission.id); }}
                            className="w-12 h-12 bg-red-500 text-white border-2 border-black rounded-full flex items-center justify-center shadow-neo-sm hover:-translate-y-1 transition-transform"
                            title="Supprimer"
                          >
                            <X size={20} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-black text-lg leading-tight">{mission.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-100 w-fit px-2 py-1 rounded-md mb-3 border border-orange-200">
                            <Calendar size={14} />
                            {mission.date}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4 font-medium">{mission.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200">
                          <span className="font-black">{mission.price}</span>
                          <span className="text-xs font-bold text-gray-500">{mission.spotsTotal - mission.spotsLeft}/{mission.spotsTotal} réservées</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: TRACKS */}
          {activeTab === 'tracks' && (
            <div>
              {tracks.length === 0 ? (
                <div className="text-center py-20">
                  <Layers size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="font-black text-xl mb-2">Aucun parcours</h3>
                  <p className="text-gray-500 mb-6">Regroupez des missions pour créer des packs.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {tracks.map(track => (
                    <div key={track.id} className={`group flex flex-col sm:flex-row border-4 border-black rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-neo transition-all bg-white relative ${!track.active ? 'grayscale opacity-75' : ''}`}>
                      <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto sm:h-full bg-gray-200 border-b-4 sm:border-b-0 sm:border-r-4 border-black relative overflow-hidden">
                         {track.coverImage ? (
                            <img src={track.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full"><ImageIcon className="text-gray-400 opacity-50" size={32} /></div>
                          )}
                          <div className="absolute top-2 left-2 flex gap-2">
                            <div className="bg-black text-white px-3 py-1.5 text-[10px] font-black uppercase text-center rounded">
                              {track.price}
                            </div>
                            {!track.active && (
                              <div className="bg-red-500 text-white px-2 py-1 text-[10px] font-black uppercase rounded flex items-center gap-1">
                                <X size={10} /> Masqué
                              </div>
                            )}
                          </div>

                          {/* Admin Action Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                            <button 
                              onClick={() => setEditingTrack(track)}
                              className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-neo-sm hover:-translate-y-1 transition-transform"
                            >
                              <Settings size={20} />
                            </button>
                            <button 
                              onClick={() => { if(window.confirm('Supprimer ce parcours ?')) deleteTrack(track.id); }}
                              className="w-10 h-10 bg-red-500 text-white border-2 border-black rounded-full flex items-center justify-center shadow-neo-sm hover:-translate-y-1 transition-transform"
                            >
                              <X size={20} strokeWidth={3} />
                            </button>
                          </div>
                      </div>
                      <div className="p-5 flex-1 content-center">
                        <h3 className="font-black text-xl mb-2">{track.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{track.description}</p>
                        <ul className="space-y-1 text-left">
                          {(track.benefits || []).slice(0, 3).map((b, i) => (
                            <li key={i} className="text-xs font-bold flex gap-2"><span className="text-green-500">✓</span> {b}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: DEMOS */}
          {activeTab === 'demos' && (
            <div className="space-y-12">
               {/* 1. Recurrent Templates */}
               <section>
                 <h3 className="font-black text-xl mb-4 flex items-center gap-2 uppercase tracking-widest"><Clock className="text-purple-600" /> Modèles de Sessions Récurrentes</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recurrentSlots.map(slot => (
                      <div key={slot.id} className={`p-6 border-4 border-black rounded-2xl bg-white hover:shadow-neo transition-all relative ${!slot.active ? 'opacity-50 grayscale' : ''}`}>
                         <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-wrap gap-1">
                                {(slot.daysOfWeek || []).sort((a,b) => (a===0 ? 7 : a) - (b===0 ? 7 : b)).map(day => (
                                  <span key={day} className="bg-black text-white px-2 py-1 text-[8px] font-black uppercase rounded">
                                    {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][day]}
                                  </span>
                                ))}
                             </div>
                            <div className="flex gap-2">
                                <button 
                                  onClick={() => {
                                    const url = `${window.location.origin}/booking/trial?type=trial`;
                                    navigator.clipboard.writeText(url);
                                    alert('Lien de réservation copié !');
                                  }} 
                                  title="Copier le lien public"
                                  className="p-1 hover:bg-brand-blue hover:text-white rounded border border-transparent hover:border-black transition-all"
                                >
                                  <Rocket size={14}/>
                                </button>
                               <button onClick={() => setEditingRecurrentSlot(slot)} className="p-1 hover:bg-gray-100 rounded border border-transparent hover:border-black transition-all"><Settings size={14}/></button>
                               <button onClick={() => { if(window.confirm('Supprimer ce modèle ?')) deleteRecurrentSlot(slot.id); }} className="p-1 hover:bg-red-500 hover:text-white rounded border border-transparent hover:border-black transition-all"><X size={14}/></button>
                            </div>
                         </div>
                         <h4 className="font-black text-lg mb-1">{slot.title}</h4>
                         <div className="flex flex-wrap gap-2 mt-2">
                           {(slot.timeSlots || []).map((t, ti) => (
                             <span key={ti} className="text-[10px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 border border-purple-200 rounded uppercase">
                               {t.start} - {t.end}
                             </span>
                           ))}
                         </div>
                         <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 border-t-2 border-gray-100 pt-3 mt-4">
                            <span>Capacité: {slot.maxSpots} places</span>
                            <span className="text-purple-600">Auto-Généré</span>
                         </div>
                      </div>
                    ))}
                    {recurrentSlots.length === 0 && (
                      <div className="col-span-full py-12 border-4 border-dashed border-gray-100 rounded-2xl text-center text-gray-400 font-bold italic">
                        Aucun modèle récurrent défini.
                      </div>
                    )}
                     <button 
                       onClick={() => setEditingRecurrentSlot({ title: '', daysOfWeek: [], timeSlots: [{start: '10:00', end: '11:00'}], maxSpots: 10, active: true } as any)}
                       className="group flex flex-col items-center justify-center p-6 border-4 border-dashed border-gray-200 rounded-2xl hover:border-black hover:bg-gray-50 transition-all gap-3"
                     >
                        <div className="w-12 h-12 bg-white border-2 border-black rounded-full flex items-center justify-center shadow-neo-sm group-hover:-translate-y-1 transition-transform">
                          <Plus size={24} />
                        </div>
                        <span className="font-black text-xs uppercase tracking-widest text-gray-400 group-hover:text-black text-center">Nouveau Modèle</span>
                     </button>
                 </div>
               </section>

               {/* 2. Specific Dates */}
               <section>
                 <h3 className="font-black text-xl mb-4 flex items-center gap-2 uppercase tracking-widest"><Calendar className="text-orange-600" /> Dates Spécifiques (One-offs)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {demoSlots.map(slot => (
                      <div key={slot.id} className={`p-4 border-4 border-black rounded-2xl bg-purple-50 hover:shadow-neo transition-all group ${!slot.active ? 'opacity-60 grayscale' : ''}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="bg-purple-600 text-white px-2 py-1 text-[10px] font-black uppercase rounded">Session Démo</div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingDemoSlot(slot)} className="p-1 hover:bg-white rounded border border-transparent hover:border-black transition-all"><Settings size={14}/></button>
                            <button onClick={() => { if(window.confirm('Supprimer ?')) deleteDemoSlot(slot.id); }} className="p-1 hover:bg-red-500 hover:text-white rounded border border-transparent hover:border-black transition-all"><X size={14}/></button>
                          </div>
                        </div>
                        <h4 className="font-black text-lg mb-1">{slot.title}</h4>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-3">
                          <Calendar size={14} className="text-purple-600" />
                          {new Date(slot.isoDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 mb-4">
                          <Clock size={14} className="text-purple-600" />
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t-2 border-purple-100">
                          <span className="text-[10px] font-black uppercase tracking-widest text-purple-600">Disponibilité</span>
                          <span className="text-xs font-black">{slot.spotsTotal - slot.spotsLeft}/{slot.spotsTotal} rés.</span>
                        </div>
                      </div>
                    ))}
                 </div>
               </section>
            </div>
          )}

          {/* TAB: LEADS */}
          {activeTab === 'leads' && (
            <div>
               {leads.length === 0 ? (
                <div className="text-center py-20">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="font-black text-xl mb-2">Aucune inscription</h3>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="border-b-4 border-black bg-gray-50">
                      <tr>
                        <th className="p-4 font-black uppercase text-xs">Date</th>
                        <th className="p-4 font-black uppercase text-xs">Parent / Enfant</th>
                        <th className="p-4 font-black uppercase text-xs">Cible (Track/Mission)</th>
                        <th className="p-4 font-black uppercase text-xs">Contact</th>
                        <th className="p-4 font-black uppercase text-xs">Paiement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-100">
                      {leads.map((lead, i) => (
                        <tr key={lead.id || i} className="hover:bg-gray-50">
                          <td className="p-4 text-sm font-medium">{new Date(lead.createdAt).toLocaleDateString('fr-FR')}</td>
                          <td className="p-4">
                            <div className="font-black">{lead.parentName}</div>
                            <div className="text-xs text-gray-500 font-bold">Enfant: {lead.childName} ({lead.childAge})</div>
                          </td>
                          <td className="p-4">
                            {lead.trackTitle ? (
                              <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-1 rounded uppercase border border-blue-200">{lead.trackTitle}</span>
                            ) : (
                              <span className="bg-orange-100 text-orange-800 text-[10px] font-black px-2 py-1 rounded uppercase border border-orange-200">{lead.missionTheme} ({lead.missionDate})</span>
                            )}
                          </td>
                          <td className="p-4 text-sm font-bold">{lead.whatsapp}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-black px-2 py-1 rounded uppercase border ${
                              lead.paymentStatus === 'Full Bundle' ? 'bg-green-100 text-green-800 border-green-200' :
                              lead.paymentStatus === 'Deposit' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>{lead.paymentStatus || 'Pending'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* MISSION MODAL */}
      {editingMission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl border-4 border-black shadow-[10px_10px_0_0_black] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-2xl uppercase">{editingMission.id ? 'Éditer Mission' : 'Nouvelle Mission'}</h2>
              <button onClick={() => setEditingMission(null)} className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Titre de la Mission</label>
                <input type="text" value={editingMission.title || ''} onChange={e => setEditingMission({ ...editingMission, title: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold bg-gray-50 focus:bg-white transition-colors" placeholder="ex: Iron Maker" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Catégorie</label>
                  <input type="text" value={editingMission.category || ''} onChange={e => setEditingMission({ ...editingMission, category: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold" placeholder="Hardware, Digital..." />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Status</label>
                  <select value={editingMission.status || 'open'} onChange={e => setEditingMission({ ...editingMission, status: e.target.value as any })} className="w-full p-3 border-2 border-black rounded-xl font-bold">
                    <option value="open">Ouvert</option>
                    <option value="limited">Presque Complet</option>
                    <option value="full">Complet</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1 flex items-center gap-1 text-orange-600"><Plus size={10}/> Date Précise (Système)</label>
                  <input required type="date" value={editingMission.isoDate || ''} onChange={e => setEditingMission({ ...editingMission, isoDate: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold bg-orange-50" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1 flex items-center gap-1 text-gray-400"><ImageIcon size={10}/> Date Affichage (Public)</label>
                  <input type="text" value={editingMission.date || ''} onChange={e => setEditingMission({ ...editingMission, date: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold" placeholder="Ce Samedi 14h30..." />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Heure de Début</label>
                  <input required type="time" value={editingMission.startTime || ''} onChange={e => setEditingMission({ ...editingMission, startTime: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase mb-1">Heure de Fin</label>
                  <input required type="time" value={editingMission.endTime || ''} onChange={e => setEditingMission({ ...editingMission, endTime: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase mb-1">Description</label>
                <textarea rows={3} value={editingMission.description || ''} onChange={e => setEditingMission({ ...editingMission, description: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-medium" />
              </div>

               {/* Active Toggle */}
               <div className="p-4 bg-gray-100 border-2 border-black rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm uppercase">Mission Active</h4>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Si décoché, la mission sera masquée du site public</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={editingMission.active ?? true} 
                  onChange={e => setEditingMission({ ...editingMission, active: e.target.checked })}
                  className="w-8 h-8 rounded-lg border-4 border-black accent-green-500 transition-all cursor-pointer"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t-2 border-gray-100 pt-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Lier à un Parcours (Optionnel)</label>
                  <select value={editingMission.trackId || ''} onChange={e => setEditingMission({ ...editingMission, trackId: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold">
                    <option value="">-- Aucun Parcours --</option>
                    {tracks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Tarif</label>
                  <input type="text" value={editingMission.price || ''} onChange={e => setEditingMission({ ...editingMission, price: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-black" placeholder="400 DHS" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1">Image de Couverture</label>
                {editingMission.coverImage ? (
                  <div className="relative aspect-video rounded-xl border-2 border-black overflow-hidden group">
                    <img src={editingMission.coverImage} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Button onClick={() => setEditingMission({ ...editingMission, coverImage: '' })} variant="danger">Supprimer Image</Button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setIsMediaPickerOpen('mission')} className="w-full p-8 border-2 border-dashed border-gray-400 rounded-xl hover:border-black hover:bg-gray-50 flex flex-col items-center justify-center transition-colors">
                    <ImageIcon size={32} className="text-gray-400 mb-2" />
                    <span className="font-bold text-sm text-gray-500">Choisir dans la bibliothèque</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t-4 border-black flex justify-between">
              {editingMission.id && <button onClick={() => { if(window.confirm('Supprimer ?')) { deleteMission(editingMission.id); setEditingMission(null); } }} className="text-red-500 font-bold hover:underline">Supprimer Mission</button>}
              <Button onClick={() => {
                if(!editingMission.title || !editingMission.isoDate || !editingMission.startTime || !editingMission.endTime) return alert('Tous les champs obligatoires (Titre, Date ISO, Heures) sont requis');
                const conflict = checkConflict(editingMission.isoDate, editingMission.startTime, editingMission.endTime, editingMission.id);
                if (conflict && !window.confirm(`${conflict}\nVoulez-vous quand même enregistrer ?`)) return;
                addMission({ ...editingMission as Mission, id: editingMission.id || Date.now().toString() });
                setEditingMission(null);
              }} variant="primary" className="shadow-neo bg-green-400 border-black text-black ml-auto"><Save size={18} /> Enregistrer</Button>
            </div>
          </div>
        </div>
      )}

      {/* TRACK MODAL */}
      {editingTrack && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl border-4 border-black shadow-[10px_10px_0_0_black] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-2xl uppercase">Nouveau Parcours (Bundle)</h2>
              <button onClick={() => setEditingTrack(null)} className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Titre du Parcours (ex: Pack Hardware)</label>
                <input type="text" value={editingTrack.title || ''} onChange={e => setEditingTrack({ ...editingTrack, title: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold bg-gray-50 focus:bg-white transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-xs font-black uppercase mb-1">Prix Bundle</label>
                  <input type="text" value={editingTrack.price || ''} onChange={e => setEditingTrack({ ...editingTrack, price: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-black" placeholder="1200 DHS" />
                </div>
                 <div>
                <label className="block text-xs font-black uppercase mb-1">Image Bundle</label>
                {editingTrack.coverImage ? (
                  <div className="relative h-12 rounded-xl border-2 border-black overflow-hidden group">
                    <img src={editingTrack.coverImage} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer" onClick={() => setEditingTrack({ ...editingTrack, coverImage: '' })}>
                      <X className="text-white" size={20} />
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setIsMediaPickerOpen('track')} className="w-full h-12 border-2 border-dashed border-gray-400 rounded-xl hover:border-black font-bold text-xs text-gray-500">Choisir Image</button>
                )}
              </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Description Courte</label>
                <textarea rows={2} value={editingTrack.description || ''} onChange={e => setEditingTrack({ ...editingTrack, description: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-medium" />
              </div>

               {/* Track Active Toggle */}
               <div className="p-4 bg-gray-100 border-2 border-black rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm uppercase">Parcours Actif</h4>
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Si décoché, ce pack sera masqué du site public</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={editingTrack.active ?? true} 
                  onChange={e => setEditingTrack({ ...editingTrack, active: e.target.checked })}
                  className="w-8 h-8 rounded-lg border-4 border-black accent-blue-500 transition-all cursor-pointer"
                />
              </div>
              
              <div className="border-t-2 border-gray-100 pt-4">
                <label className="block text-xs font-black uppercase mb-2">Avantages Clés (Bullet Points sur la carte)</label>
                {(editingTrack.benefits || ['', '', '']).map((b, i) => (
                  <input key={i} type="text" value={b} onChange={e => {
                    const newB = [...(editingTrack.benefits || ['', '', ''])];
                    newB[i] = e.target.value;
                    setEditingTrack({ ...editingTrack, benefits: newB });
                  }} className="w-full p-2 border-2 border-black rounded-lg mb-2 font-medium bg-gray-50 text-sm" placeholder={`Avantage ${i+1}`} />
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t-4 border-black flex justify-between">
              {editingTrack.id && <button onClick={() => { if(window.confirm('Supprimer ?')) { deleteTrack(editingTrack.id); setEditingTrack(null); } }} className="text-red-500 font-bold hover:underline">Supprimer Parcours</button>}
              <Button onClick={() => {
                if(!editingTrack.title) return alert('Titre requis');
                addTrack({ ...editingTrack as Track, id: editingTrack.id || Date.now().toString() });
                setEditingTrack(null);
              }} variant="primary" className="shadow-neo bg-green-400 border-black text-black ml-auto"><Save size={18} /> Enregistrer</Button>
            </div>
          </div>
        </div>
      )}

      {/* DEMO SLOT MODAL */}
      {editingDemoSlot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl border-4 border-black shadow-[10px_10px_0_0_black] w-full max-w-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-2xl uppercase">{editingDemoSlot.id ? 'Éditer Démo' : 'Nouvelle Démo'}</h2>
              <button onClick={() => setEditingDemoSlot(null)} className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Titre de l'Atelier</label>
                <input type="text" value={editingDemoSlot.title || ''} onChange={e => setEditingDemoSlot({ ...editingDemoSlot, title: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold" placeholder="Atelier Démo Robotique" />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Date</label>
                  <input type="date" value={editingDemoSlot.isoDate || ''} onChange={e => setEditingDemoSlot({ ...editingDemoSlot, isoDate: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold bg-purple-50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Début</label>
                  <input type="time" value={editingDemoSlot.startTime || ''} onChange={e => setEditingDemoSlot({ ...editingDemoSlot, startTime: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Fin</label>
                  <input type="time" value={editingDemoSlot.endTime || ''} onChange={e => setEditingDemoSlot({ ...editingDemoSlot, endTime: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Places Max</label>
                  <input type="number" value={editingDemoSlot.spotsTotal || 0} onChange={e => setEditingDemoSlot({ ...editingDemoSlot, spotsTotal: parseInt(e.target.value), spotsLeft: parseInt(e.target.value) })} className="w-full p-3 border-2 border-black rounded-xl font-bold" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-black text-xs uppercase">Actif</h4>
                  </div>
                  <input type="checkbox" checked={editingDemoSlot.active ?? true} onChange={e => setEditingDemoSlot({ ...editingDemoSlot, active: e.target.checked })} className="w-8 h-8 rounded border-4 border-black accent-purple-500" />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t-4 border-black flex justify-between">
              {editingDemoSlot.id && <button onClick={() => { if(window.confirm('Supprimer ?')) { deleteDemoSlot(editingDemoSlot.id!); setEditingDemoSlot(null); } }} className="text-red-500 font-bold hover:underline">Supprimer</button>}
              <Button onClick={() => {
                if(!editingDemoSlot.title || !editingDemoSlot.isoDate || !editingDemoSlot.startTime || !editingDemoSlot.endTime) return alert('Tous les champs sont requis');
                const conflict = checkConflict(editingDemoSlot.isoDate, editingDemoSlot.startTime, editingDemoSlot.endTime, editingDemoSlot.id);
                if (conflict && !window.confirm(`${conflict}\nVoulez-vous quand même enregistrer ?`)) return;
                addDemoSlot({ ...editingDemoSlot as DemoSlot, id: editingDemoSlot.id || Date.now().toString() });
                setEditingDemoSlot(null);
              }} variant="primary" className="shadow-neo bg-purple-500 border-black text-white ml-auto"><Save size={18} /> Enregistrer</Button>
            </div>
          </div>
        </div>
      )}

      {/* RECURRENT SLOT MODAL */}
      {editingRecurrentSlot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl border-4 border-black shadow-[10px_10px_0_0_black] w-full max-w-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-2xl uppercase">{editingRecurrentSlot.id ? 'Éditer Modèle' : 'Nouveau Modèle'}</h2>
              <button onClick={() => setEditingRecurrentSlot(null)} className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100"><X size={20} /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Nom du Modèle</label>
                <input type="text" value={editingRecurrentSlot.title || ''} onChange={e => setEditingRecurrentSlot({ ...editingRecurrentSlot, title: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold" placeholder="ex: Atelier Démo Mercredi" />
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-3">Jours de la Semaine</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 0].map(day => {
                      const labels: Record<number, string> = { 1: 'L', 2: 'M', 3: 'M', 4: 'J', 5: 'V', 6: 'S', 0: 'D' };
                      const isSelected = (editingRecurrentSlot.daysOfWeek || []).includes(day);
                      return (
                        <button
                          key={day}
                          onClick={() => {
                            const current = editingRecurrentSlot.daysOfWeek || [];
                            const next = isSelected 
                              ? current.filter(d => d !== day)
                              : [...current, day];
                            setEditingRecurrentSlot({...editingRecurrentSlot, daysOfWeek: next});
                          }}
                          className={`flex-1 aspect-square border-4 border-black rounded-xl font-black transition-all flex items-center justify-center ${isSelected ? 'bg-brand-blue shadow-neo-sm -translate-y-1' : 'bg-gray-50 hover:bg-gray-100'}`}
                        >
                          {labels[day]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-2">Créneaux Horaires (Prévus pour ce jour)</label>
                  <div className="space-y-3">
                    {(editingRecurrentSlot.timeSlots || []).map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 border-2 border-black rounded-xl">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <input type="time" value={slot.start} onChange={e => {
                            const newSlots = [...(editingRecurrentSlot.timeSlots || [])];
                            newSlots[idx].start = e.target.value;
                            setEditingRecurrentSlot({...editingRecurrentSlot, timeSlots: newSlots});
                          }} className="p-2 border-2 border-black rounded-lg text-xs font-bold" />
                          <input type="time" value={slot.end} onChange={e => {
                            const newSlots = [...(editingRecurrentSlot.timeSlots || [])];
                            newSlots[idx].end = e.target.value;
                            setEditingRecurrentSlot({...editingRecurrentSlot, timeSlots: newSlots});
                          }} className="p-2 border-2 border-black rounded-lg text-xs font-bold" />
                        </div>
                        <button onClick={() => {
                          const newSlots = (editingRecurrentSlot.timeSlots || []).filter((_, i) => i !== idx);
                          setEditingRecurrentSlot({...editingRecurrentSlot, timeSlots: newSlots});
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><X size={16} /></button>
                      </div>
                    ))}
                    <button 
                      onClick={() => setEditingRecurrentSlot({...editingRecurrentSlot, timeSlots: [...(editingRecurrentSlot.timeSlots || []), {start: '10:00', end: '11:00'}]})}
                      className="w-full py-3 border-2 border-dashed border-black rounded-xl font-black text-xs uppercase hover:bg-black hover:text-white transition-all"
                    >
                      + Ajouter un créneau
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase mb-1">Places Max (par session)</label>
                  <input type="number" value={editingRecurrentSlot.maxSpots || 10} onChange={e => setEditingRecurrentSlot({ ...editingRecurrentSlot, maxSpots: parseInt(e.target.value) })} className="w-full p-3 border-2 border-black rounded-xl font-bold" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-black text-xs uppercase">Actif</h4>
                  </div>
                  <input type="checkbox" checked={editingRecurrentSlot.active ?? true} onChange={e => setEditingRecurrentSlot({ ...editingRecurrentSlot, active: e.target.checked })} className="w-8 h-8 rounded border-4 border-black accent-purple-500" />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t-4 border-black flex justify-between">
              {editingRecurrentSlot.id && <button onClick={() => { if(window.confirm('Supprimer ce modèle ?')) { deleteRecurrentSlot(editingRecurrentSlot.id!); setEditingRecurrentSlot(null); } }} className="text-red-500 font-bold hover:underline">Supprimer</button>}
              <Button onClick={() => {
                if(!editingRecurrentSlot.title || !editingRecurrentSlot.timeSlots?.length) return alert('Le titre et au moins un créneau sont requis');
                addRecurrentSlot({ ...editingRecurrentSlot as RecurrentSlot, id: editingRecurrentSlot.id || Date.now().toString() });
                setEditingRecurrentSlot(null);
              }} variant="primary" className="shadow-neo bg-purple-500 border-black text-white ml-auto"><Save size={18} /> Enregistrer le Modèle</Button>
            </div>
          </div>
        </div>
      )}

      {/* MEDIA PICKER INTEGRATION */}
      {isMediaPickerOpen && (
        <MediaPickerModal
          onSelect={url => {
            if (isMediaPickerOpen === 'mission' && editingMission) setEditingMission({ ...editingMission, coverImage: url });
            if (isMediaPickerOpen === 'track' && editingTrack) setEditingTrack({ ...editingTrack, coverImage: url });
            setIsMediaPickerOpen(null);
          }}
          onCancel={() => setIsMediaPickerOpen(null)}
        />
      )}

    </div>
  );
};
