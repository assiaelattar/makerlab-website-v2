import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchool } from '../../contexts/SchoolContext';
import { Offer, SchoolPartner, Period, Workshop } from '../../types';
import { Button } from '../../components/Button';
import { ArrowLeft, Save, Plus, Trash2, Calendar, Target, Check, PackageOpen, Upload, Image as ImageIcon } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import imageCompression from 'browser-image-compression';

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
  const [isUploadingOgImage, setIsUploadingOgImage] = useState(false);
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

  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingOgImage(true);
    try {
      const options = { maxSizeMB: 0.3, maxWidthOrHeight: 1200, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      const storagePath = `website-og-images/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, ogImage: downloadURL }));
    } catch (error: any) {
      console.error("❌ Firebase Upload Error (OG Image):", {
        code: error.code,
        message: error.message,
      });
      let userMessage = "Erreur lors de l'upload de l'image sociale.";
      if (error.code === 'storage/unauthorized') {
        userMessage += "\nPermissions refusées. Veuillez vérifier vos règles Firebase Storage pour le dossier 'website-og-images'.";
      } else {
        userMessage += `\nDétail: ${error.message}`;
      }
      alert(userMessage);
    } finally {
      setIsUploadingOgImage(false);
    }
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

            <div className="pt-8 border-t-4 border-gray-100">
              {/* OG / Social Image Section */}
              <div className="p-6 bg-brand-blue/5 border-2 border-dashed border-brand-blue rounded-2xl mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">📱</span>
                  <h3 className="font-display font-bold text-xl text-brand-blue">Image Aperçu Réseaux Sociaux</h3>
                </div>
                <p className="text-xs text-gray-500 mb-5 font-medium">
                  Affichée quand le lien de cette offre scolaire est partagé sur <strong>WhatsApp</strong>, etc.
                  Format idéal : <strong>1200 × 630 px (paysage)</strong>.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div className="space-y-3">
                    <label className={`flex items-center justify-center gap-2 w-full p-4 border-2 border-brand-blue border-dotted rounded-xl bg-white hover:bg-brand-blue/5 cursor-pointer transition-colors ${isUploadingOgImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <Upload size={20} className="text-brand-blue" />
                      <span className="font-bold text-sm text-brand-blue">
                        {isUploadingOgImage ? 'Upload en cours...' : 'Choisir une image (1200×630)'}
                      </span>
                      <input type="file" accept="image/*" onChange={handleOgImageUpload} disabled={isUploadingOgImage} className="hidden" />
                    </label>
                    {formData.ogImage && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, ogImage: '' }))}
                        className="w-full text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 rounded-lg py-2 transition-colors"
                      >
                        🗑️ Supprimer l'image sociale
                      </button>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">Aperçu WhatsApp ↓</p>
                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm" style={{ maxWidth: 300 }}>
                      <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                        {formData.ogImage ? (
                          <img src={formData.ogImage} className="w-full h-full object-cover" alt="OG Preview" />
                        ) : (
                          <div className="flex flex-col items-center text-gray-300 gap-1">
                            <ImageIcon size={32} />
                            <span className="text-xs font-bold">Image atelier utilisée</span>
                          </div>
                        )}
                      </div>
                      <div className="p-3 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 uppercase font-black">makerlab.ma</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">
                          {formData.schoolId ? (schoolPartners.find(s => s.id === formData.schoolId)?.name || 'École') + ' × MakerLab' : 'École × MakerLab Academy'}
                        </p>
                      </div>
                    </div>
                    {formData.ogImage && <p className="text-[10px] text-brand-blue font-black mt-2">✅ Image personnalisée active</p>}
                    {!formData.ogImage && <p className="text-[10px] text-gray-400 font-bold mt-2">ℹ️ Image du 1er atelier utilisée</p>}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
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
