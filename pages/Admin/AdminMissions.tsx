import React, { useState } from 'react';
import { useMissions } from '../../contexts/MissionContext';
import { Target, Package, Layers, Plus, Calendar, Settings, Image as ImageIcon, Users, X, Save } from 'lucide-react';
import { Button } from '../../components/Button';
import { Mission, Track } from '../../types';
import { MediaPickerModal } from '../../components/MediaPickerModal';

export const AdminMissions: React.FC = () => {
  const { missions, tracks, leads, loading, addMission, addTrack, deleteMission, deleteTrack } = useMissions();
  const [activeTab, setActiveTab] = useState<'missions' | 'tracks' | 'leads'>('missions');
  const [editingMission, setEditingMission] = useState<Partial<Mission> | null>(null);
  const [editingTrack, setEditingTrack] = useState<Partial<Track> | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState<'mission' | 'track' | null>(null);

  const tabs = [
    { id: 'missions', label: 'Sessions Uniques', icon: Target },
    { id: 'tracks', label: 'Parcours (Packs)', icon: Layers },
    { id: 'leads', label: 'Inscriptions', icon: Users },
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
            <Button onClick={() => setEditingMission({ status: 'open', spotsTotal: 20, spotsLeft: 20 })} variant="primary" className="shadow-neo bg-orange-500 border-black text-black font-black uppercase"><Plus size={20} /> Nouvelle Mission</Button>
          )}
          {activeTab === 'tracks' && (
            <Button onClick={() => setEditingTrack({ benefits: ['', '', ''] })} variant="primary" className="shadow-neo bg-blue-500 border-black text-white font-black uppercase"><Plus size={20} /> Nouveau Parcours</Button>
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
              onClick={() => setActiveTab(tab.id as 'missions' | 'tracks' | 'leads')}
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
                    <div key={mission.id} className="group border-4 border-black rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-neo transition-all bg-gray-50">
                      <div className="aspect-video bg-gray-200 relative overflow-hidden border-b-4 border-black flex items-center justify-center">
                        {mission.coverImage ? (
                          <img src={mission.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                        ) : (
                          <ImageIcon className="text-gray-400 opacity-50" size={32} />
                        )}
                        <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-[10px] font-black uppercase rounded">
                          {mission.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-black text-lg leading-tight">{mission.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-100 w-fit px-2 py-1 rounded-md mb-3 border border-orange-200">
                          <Calendar size={14} />
                          {mission.date}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4 font-medium">{mission.description}</p>
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
                    <div key={track.id} className="flex flex-col sm:flex-row border-4 border-black rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-neo transition-all bg-white">
                      <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto sm:h-full bg-gray-200 border-b-4 sm:border-b-0 sm:border-r-4 border-black relative">
                         {track.coverImage ? (
                            <img src={track.coverImage} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full"><ImageIcon className="text-gray-400 opacity-50" size={32} /></div>
                          )}
                          <div className="absolute bottom-2 left-2 right-2 bg-black text-white px-3 py-1.5 text-xs font-black uppercase text-center rounded">
                            {track.price}
                          </div>
                      </div>
                      <div className="p-5 flex-1 content-center">
                        <h3 className="font-black text-xl mb-2">{track.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{track.description}</p>
                        <ul className="space-y-1">
                          {track.benefits.slice(0, 3).map((b, i) => (
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
                  <label className="block text-xs font-black uppercase mb-1">Date & Heure</label>
                  <input type="text" value={editingMission.date || ''} onChange={e => setEditingMission({ ...editingMission, date: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-bold" placeholder="Ce Samedi 14h30 - 17h30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Description</label>
                <textarea rows={3} value={editingMission.description || ''} onChange={e => setEditingMission({ ...editingMission, description: e.target.value })} className="w-full p-3 border-2 border-black rounded-xl font-medium" />
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
                if(!editingMission.title || !editingMission.date) return alert('Titre et Date requis');
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
