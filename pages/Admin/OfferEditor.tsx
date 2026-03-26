import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchool } from '../../contexts/SchoolContext';
import { Offer, SchoolPartner, Period, Workshop } from '../../types';
import { Button } from '../../components/Button';
import { ArrowLeft, Save, Plus, Trash2, Calendar, Target, Check, PackageOpen } from 'lucide-react';

export const OfferEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { schoolPartners, periods, workshops, offers, addOffer, updateOffer, addPeriod } = useSchool();
  
  const [formData, setFormData] = useState<Omit<Offer, 'id'>>({
    schoolId: '',
    periodId: '',
    workshopIds: [],
    customPrices: {},
    published: false,
    createdAt: new Date().toISOString()
  });

  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [newPeriod, setNewPeriod] = useState<Omit<Period, 'id'>>({
    type: 'Semester',
    name: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (id && id !== 'new') {
      const existing = offers.find(o => o.id === id);
      if (existing) {
        const { id: _, ...data } = existing;
        setFormData(data);
      }
    }
  }, [id, offers]);

  const handleToggleWorkshop = (workshopId: string) => {
    setFormData(prev => {
      const ids = [...prev.workshopIds];
      const index = ids.indexOf(workshopId);
      if (index > -1) {
        ids.splice(index, 1);
        const { [workshopId]: _, ...newPrices } = prev.customPrices;
        return { ...prev, workshopIds: ids, customPrices: newPrices };
      } else {
        return { ...prev, workshopIds: [...ids, workshopId] };
      }
    });
  };

  const handlePriceChange = (workshopId: string, price: string) => {
    setFormData(prev => ({
      ...prev,
      customPrices: { ...prev.customPrices, [workshopId]: price }
    }));
  };

  const handleCreatePeriod = async () => {
    if (!newPeriod.name) return;
    const periodId = await addPeriod(newPeriod);
    setFormData(prev => ({ ...prev, periodId }));
    setShowPeriodModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolId || !formData.periodId) return alert("Veuillez sélectionner une école et une période.");
    
    if (id === 'new') {
      await addOffer(formData);
    } else if (id) {
      await updateOffer(id, formData);
    }
    navigate('/admin/offers');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button variant="outline" onClick={() => navigate('/admin/offers')} className="mb-8 border-2 border-black shadow-neo-sm">
          <ArrowLeft size={16} /> Retour aux offres
        </Button>

        <div className="bg-white rounded-3xl border-4 border-black shadow-neo-lg p-8">
          <h1 className="font-display font-black text-4xl mb-8 uppercase tracking-tighter text-brand-blue">
            {id === 'new' ? 'Nouvelle Offre Scolaire' : 'Modifier l\'Offre'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Step 1: School & Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section>
                <label className="block font-black text-sm uppercase mb-4 flex items-center gap-2">
                  <Target size={18} className="text-brand-blue" /> 1. Sélectionner l'école
                </label>
                <select
                  value={formData.schoolId}
                  onChange={(e) => setFormData(prev => ({ ...prev, schoolId: e.target.value }))}
                  className="w-full p-4 border-4 border-black rounded-xl font-bold bg-white"
                  required
                >
                  <option value="">-- Choisir une école --</option>
                  {schoolPartners.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </section>

              <section>
                <div className="flex justify-between items-center mb-4">
                    <label className="block font-black text-sm uppercase flex items-center gap-2">
                      <Calendar size={18} className="text-brand-blue" /> 2. Période d'inscription
                    </label>
                    <button type="button" onClick={() => setShowPeriodModal(true)} className="text-xs font-black text-brand-blue hover:underline">+ Nouvelle Période</button>
                </div>
                <select
                  value={formData.periodId}
                  onChange={(e) => setFormData(prev => ({ ...prev, periodId: e.target.value }))}
                  className="w-full p-4 border-4 border-black rounded-xl font-bold bg-white"
                  required
                >
                  <option value="">-- Choisir une période --</option>
                  {periods.map(p => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
                </select>
              </section>
            </div>

            {/* Step 2: Workshop Selection */}
            <section>
              <label className="block font-black text-sm uppercase mb-6 flex items-center gap-2">
                <PackageOpen size={18} className="text-brand-blue" /> 3. Choisir les ateliers & Définir les prix
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workshops.map(workshop => {
                  const isSelected = formData.workshopIds.includes(workshop.id);
                  return (
                    <div
                      key={workshop.id}
                      className={`relative p-4 border-4 rounded-2xl transition-all cursor-pointer ${isSelected ? 'border-brand-blue bg-brand-blue/5 shadow-neo-sm' : 'border-gray-200 hover:border-black'}`}
                      onClick={() => handleToggleWorkshop(workshop.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg border-2 border-black overflow-hidden flex-shrink-0">
                          <img src={workshop.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-sm leading-tight">{workshop.name}</h4>
                          <span className="text-[10px] uppercase font-black opacity-50">{workshop.ageRange}</span>
                        </div>
                        {isSelected && <div className="bg-brand-blue text-white p-1 rounded-full"><Check size={16} /></div>}
                      </div>

                      {isSelected && (
                        <div className="mt-4 pt-4 border-t-2 border-brand-blue/20 flex items-center gap-3" onClick={e => e.stopPropagation()}>
                           <label className="text-xs font-black uppercase text-brand-blue">Prix École :</label>
                           <input
                             type="text"
                             value={formData.customPrices[workshop.id] || ''}
                             onChange={(e) => handlePriceChange(workshop.id, e.target.value)}
                             placeholder="ex: 1200 DHS"
                             className="flex-1 p-2 border-2 border-black rounded-lg text-sm font-bold"
                           />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="pt-8 border-t-4 border-gray-100 flex items-center justify-between">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-12 h-6 rounded-full border-2 border-black relative transition-colors ${formData.published ? 'bg-green-400' : 'bg-gray-200'}`}>
                    <input type="checkbox" checked={formData.published} onChange={e => setFormData(p => ({ ...p, published: e.target.checked }))} className="hidden" />
                    <div className={`absolute top-0.5 w-4 h-4 bg-white border-2 border-black rounded-full transition-all ${formData.published ? 'left-6' : 'left-1'}`} />
                  </div>
                  <span className="font-black text-sm uppercase">Publier immédiatement</span>
               </label>
               <Button type="submit" size="lg" className="px-12 bg-brand-blue text-white border-4 border-black shadow-neo-lg">
                 <Save className="mr-3" /> ENREGISTRER L'OFFRE
               </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Period Modal */}
      {showPeriodModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black rounded-3xl p-8 max-w-md w-full shadow-neo-lg">
            <h2 className="font-display font-black text-2xl mb-6 uppercase">Nouvelle Période</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Type</label>
                <select value={newPeriod.type} onChange={e => setNewPeriod(p => ({ ...p, type: e.target.value as any }))} className="w-full p-3 border-2 border-black rounded-xl">
                  <option value="Trimester">Trimestre</option>
                  <option value="Semester">Semestre</option>
                  <option value="Year">Année</option>
                  <option value="Holiday">Vacances</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black uppercase mb-1">Nom (ex: Semestre 2 2025)</label>
                <input value={newPeriod.name} onChange={e => setNewPeriod(p => ({ ...p, name: e.target.value }))} className="w-full p-3 border-2 border-black rounded-xl font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-xs font-black uppercase mb-1">Début</label>
                   <input type="date" value={newPeriod.startDate} onChange={e => setNewPeriod(p => ({ ...p, startDate: e.target.value }))} className="w-full p-3 border-2 border-black rounded-xl font-bold" />
                </div>
                <div>
                   <label className="block text-xs font-black uppercase mb-1">Fin</label>
                   <input type="date" value={newPeriod.endDate} onChange={e => setNewPeriod(p => ({ ...p, endDate: e.target.value }))} className="w-full p-3 border-2 border-black rounded-xl font-bold" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                 <Button variant="outline" onClick={() => setShowPeriodModal(false)} className="flex-1">Annuler</Button>
                 <Button onClick={handleCreatePeriod} className="flex-1 bg-brand-blue text-white">Créer</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
