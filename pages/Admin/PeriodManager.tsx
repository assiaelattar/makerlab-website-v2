import React, { useState } from 'react';
import { useSchool } from '../../contexts/SchoolContext';
import { Button } from '../../components/Button';
import { Plus, Trash2, Calendar, Clock, Tag } from 'lucide-react';
import { Period } from '../../types';

export const PeriodManager: React.FC = () => {
  const { periods, addPeriod } = useSchool();
  const [showModal, setShowModal] = useState(false);
  const [newPeriod, setNewPeriod] = useState<Omit<Period, 'id'>>({
    type: 'Semester',
    name: '',
    startDate: '',
    endDate: ''
  });

  const handleCreatePeriod = async () => {
    if (!newPeriod.name || !newPeriod.startDate || !newPeriod.endDate) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    await addPeriod(newPeriod);
    setNewPeriod({ type: 'Semester', name: '', startDate: '', endDate: '' });
    setShowModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display font-black text-4xl mb-2 text-brand-red">Gestion des Périodes</h1>
          <p className="text-gray-600 font-medium">Définissez les trimestres, semestres et périodes de vacances par défaut.</p>
        </div>
        <Button onClick={() => setShowModal(true)} variant="primary" className="shadow-neo bg-brand-red border-black text-white">
          <Plus size={20} /> Nouvelle Période
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {periods.length === 0 ? (
          <div className="col-span-full bg-white border-4 border-black border-dashed rounded-3xl p-12 text-center text-gray-500 font-bold">
            Aucune période configurée.
          </div>
        ) : (
          periods.map(period => (
            <div key={period.id} className="bg-white border-4 border-black rounded-3xl p-6 shadow-neo hover:shadow-neo-lg transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                   <div className="bg-brand-red/10 p-3 rounded-2xl border-2 border-brand-red/20">
                      <Calendar className="text-brand-red" />
                   </div>
                   <div>
                      <h3 className="font-black text-xl uppercase tracking-tighter">{period.name}</h3>
                      <span className="text-xs font-black uppercase text-brand-red/50 tracking-widest">{period.type}</span>
                   </div>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
              </div>
              
              <div className="flex items-center gap-4 mt-6">
                 <div className="flex-1 border-2 border-black rounded-xl p-3 bg-gray-50">
                    <p className="text-[10px] font-black uppercase opacity-50 mb-1">Du</p>
                    <p className="font-bold">{new Date(period.startDate).toLocaleDateString('fr-FR')}</p>
                 </div>
                 <ArrowRight className="text-gray-300" />
                 <div className="flex-1 border-2 border-black rounded-xl p-3 bg-gray-50">
                    <p className="text-[10px] font-black uppercase opacity-50 mb-1">Au</p>
                    <p className="font-bold">{new Date(period.endDate).toLocaleDateString('fr-FR')}</p>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 max-w-md w-full shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative animate-in zoom-in duration-200">
            <h2 className="font-display font-black text-3xl mb-8 uppercase tracking-tighter text-brand-red">DÉFINIR UNE PÉRIODE</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase mb-1 opacity-50 tracking-widest">Type de période</label>
                <select 
                  value={newPeriod.type} 
                  onChange={e => setNewPeriod(p => ({ ...p, type: e.target.value as any }))} 
                  className="w-full p-4 border-4 border-black rounded-2xl font-bold bg-white focus:bg-brand-red/5 outline-none"
                >
                  <option value="Trimester">Trimestre</option>
                  <option value="Semester">Semestre</option>
                  <option value="Year">Année scolaire</option>
                  <option value="Holiday">Vacances / Holiday Camp</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-1 opacity-50 tracking-widest">Nom (ex: Semestre 2 2025)</label>
                <input 
                  value={newPeriod.name} 
                  onChange={e => setNewPeriod(p => ({ ...p, name: e.target.value }))} 
                  className="w-full p-4 border-4 border-black rounded-2xl font-bold focus:bg-brand-red/5 outline-none"
                  placeholder="ex: Session Printemps"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[10px] font-black uppercase mb-1 opacity-50 tracking-widest">Début</label>
                   <input 
                     type="date" 
                     value={newPeriod.startDate} 
                     onChange={e => setNewPeriod(p => ({ ...p, startDate: e.target.value }))} 
                     className="w-full p-4 border-4 border-black rounded-2xl font-bold" 
                   />
                </div>
                <div>
                   <label className="block text-[10px] font-black uppercase mb-1 opacity-50 tracking-widest">Fin</label>
                   <input 
                     type="date" 
                     value={newPeriod.endDate} 
                     onChange={e => setNewPeriod(p => ({ ...p, endDate: e.target.value }))} 
                     className="w-full p-4 border-4 border-black rounded-2xl font-bold" 
                   />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                 <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-2 border-black">Annuler</Button>
                 <Button onClick={handleCreatePeriod} className="flex-1 bg-brand-red text-white border-2 border-black shadow-neo-sm">Enregistrer</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-7-7 7 7-7 7"/>
  </svg>
);
