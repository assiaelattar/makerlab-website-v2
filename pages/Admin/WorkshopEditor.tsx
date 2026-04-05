import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSchool } from '../../contexts/SchoolContext';
import { usePrograms } from '../../contexts/ProgramContext';
import { Workshop } from '../../types';
import { Button } from '../../components/Button';
import { generateImage } from '../../services/geminiService';
import { ArrowLeft, Save, Sparkles, Plus, Trash2, Upload, Image as ImageIcon, X } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const emptyWorkshop: Omit<Workshop, 'id'> = {
  name: '',
  description: '',
  ageRange: '7-12 ans',
  duration: '1h30',
  image: '',
  tags: [],
  active: true,
  parentProgramId: '',
  workshopType: '',
};

export const WorkshopEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workshops, addWorkshop, updateWorkshop } = useSchool();
  const { programs } = usePrograms();
  const [formData, setFormData] = useState<Omit<Workshop, 'id'>>(emptyWorkshop);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const existing = workshops.find(w => w.id === id);
      if (existing && !hasInitialized.current) {
        const { id: _, ...data } = existing;
        setFormData(data);
        hasInitialized.current = true;
      }
    } else if (id === 'new' && !hasInitialized.current) {
      hasInitialized.current = true;
    }
  }, [id, workshops]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const storagePath = `website-programs-images/workshops/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, image: downloadURL }));
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Erreur lors de l'upload");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) return alert("Entrez un prompt d'abord !");
    setIsGenerating(true);
    try {
      const url = await generateImage(imagePrompt);
      if (url) {
        setFormData(prev => ({ ...prev, image: url }));
      } else {
        alert("Erreur de génération.");
      }
    } catch (err) {
      alert("Une erreur est survenue.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = () => {
    if (!tagInput || formData.tags.includes(tagInput)) return;
    setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput] }));
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id === 'new') {
        await addWorkshop(formData);
      } else if (id) {
        await updateWorkshop(id, formData);
      }
      navigate('/admin/workshop-catalog');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 shadow-inner">
      <div className="container mx-auto max-w-4xl">
        <Button variant="outline" onClick={() => navigate('/admin/workshop-catalog')} className="mb-8 border-2 border-black shadow-neo-sm"><ArrowLeft size={16} /> Retour au catalogue</Button>

        <div className="bg-white rounded-3xl border-4 border-black shadow-neo-lg p-5 md:p-8">
          <h1 className="font-display font-black text-2xl md:text-4xl mb-6 md:mb-8 uppercase tracking-tighter">
            {id === 'new' ? 'Nouvel Atelier' : 'Modifier l\'Atelier'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Details */}
              <div className="space-y-6">
                <div>
                  <label className="block font-black text-sm uppercase mb-2">Nom de l'atelier</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full p-4 border-4 border-black rounded-xl font-bold focus:ring-4 ring-brand-blue/20 outline-none" required placeholder="ex: Drone Racing Academy" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-sm uppercase mb-2">Tranche d'âge</label>
                    <input name="ageRange" value={formData.ageRange} onChange={handleChange} className="w-full p-4 border-4 border-black rounded-xl font-bold" placeholder="ex: 7-12 ans" />
                  </div>
                  <div>
                    <label className="block font-black text-sm uppercase mb-2">Durée</label>
                    <input name="duration" value={formData.duration} onChange={handleChange} className="w-full p-4 border-4 border-black rounded-xl font-bold" placeholder="ex: 1h30" />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-sm uppercase mb-2">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-4 border-4 border-black rounded-xl font-bold h-32 focus:ring-4 ring-brand-blue/20 outline-none" required placeholder="Décrivez ce que les enfants vont apprendre et créer..." />
                </div>

                <div>
                   <label className="block font-black text-sm uppercase mb-2">Mission Parente / Type (ex: Make & Go)</label>
                   <select 
                      name="parentProgramId" 
                      value={formData.parentProgramId} 
                      onChange={handleChange} 
                      className="w-full p-4 border-4 border-black rounded-xl font-bold focus:ring-4 ring-brand-blue/20 outline-none bg-white"
                   >
                      <option value="">-- Aucune (Atelier Indépendant) --</option>
                      {programs.filter(p => p.active).map(p => (
                         <option key={p.id} value={p.id}>{p.title} (ID: {p.id})</option>
                      ))}
                   </select>
                </div>

                <div>
                  <label className="block font-black text-sm uppercase mb-2">Tags / Thématiques</label>
                  <div className="flex gap-2 mb-3">
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} placeholder="ex: Robotique" className="flex-1 p-3 border-2 border-black rounded-xl font-bold" />
                    <Button type="button" onClick={handleAddTag} className="bg-brand-blue text-white shadow-neo-sm border-2 border-black"><Plus size={20} /></Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="bg-brand-orange text-black px-4 py-1 rounded-full border-2 border-black font-black text-xs uppercase flex items-center gap-2">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:scale-125 transition-transform"><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="space-y-6">
                <div>
                  <label className="block font-black text-sm uppercase mb-2">Image de couverture</label>
                  <div className="border-4 border-black rounded-2xl aspect-video bg-gray-100 overflow-hidden shadow-neo-sm relative group">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <ImageIcon size={48} />
                        <span className="font-black text-xs uppercase mt-2">Aucun visuel</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                       <label className="bg-white p-3 rounded-full cursor-pointer hover:scale-110 transition-transform border-4 border-black">
                         <Upload size={24} className="text-black" />
                         <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                       </label>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-blue/5 p-6 border-4 border-black rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10"><Sparkles size={100} /></div>
                  <h3 className="font-display font-black text-lg mb-4 flex items-center gap-2">
                    <Sparkles className="text-brand-blue" /> GÉNÉRER AVEC IA
                  </h3>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full p-3 border-2 border-black rounded-xl mb-4 font-bold text-sm h-24"
                    placeholder="Décrivez l'image souhaitée (ex: Un atelier de robotique futuriste pour enfants...)"
                  />
                  <Button
                    type="button"
                    onClick={handleGenerateImage}
                    loading={isGenerating}
                    className="w-full bg-brand-blue text-white shadow-neo border-2 border-black font-black uppercase tracking-tighter"
                  >
                    Générer le visuel
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t-4 border-gray-100">
               <Button type="submit" size="lg" className="w-full justify-center text-xl py-6 bg-brand-green border-4 border-black shadow-neo-lg hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                 <Save className="mr-3" /> ENREGISTRER L'ATELIER
               </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
