
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePrograms } from '../../contexts/ProgramContext';
import { Program } from '../../types';
import { Button } from '../../components/Button';
import { generateImage } from '../../services/geminiService';
import { ArrowLeft, Save, Sparkles, Plus, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

const emptyProgram: Program = {
  id: '',
  title: '',
  category: 'Coding',
  ageGroup: '',
  description: '',
  image: '',
  imagePrompt: '',
  duration: '3 Heures',
  price: '400 DHS',
  stats: [
    { name: 'Fun', value: 90 },
    { name: 'Technique', value: 50 },
    { name: 'Créativité', value: 80 }
  ],
  active: true,
  schedule: []
};

export const ProgramEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProgram, addProgram, updateProgram } = usePrograms();
  const [formData, setFormData] = useState<Program>(emptyProgram);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduleInput, setScheduleInput] = useState('');

  useEffect(() => {
    if (id && id !== 'new') {
      const existing = getProgram(id);
      if (existing) setFormData(existing);
    } else {
      setFormData({ ...emptyProgram, id: Date.now().toString() });
    }
  }, [id, getProgram]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateImage = async () => {
    if (!formData.imagePrompt) return alert("Entrez un prompt d'abord !");
    setIsGenerating(true);
    try {
      const url = await generateImage(formData.imagePrompt);
      if (url) {
        setFormData(prev => ({ ...prev, image: url }));
      } else {
        alert("Erreur de génération. Vérifiez la clé API ou le quota.");
      }
    } catch (err) {
      alert("Une erreur est survenue lors de la génération.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSchedule = () => {
    if (!scheduleInput) return;
    setFormData(prev => ({ ...prev, schedule: [...(prev.schedule || []), scheduleInput] }));
    setScheduleInput('');
  };

  const handleRemoveSchedule = (idx: number) => {
    setFormData(prev => ({ ...prev, schedule: prev.schedule?.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (id === 'new') {
      addProgram(formData);
    } else {
      updateProgram(formData.id, formData);
    }
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button variant="outline" onClick={() => navigate('/admin/dashboard')} className="mb-8"><ArrowLeft size={16}/> Retour</Button>
        
        <div className="bg-white rounded-3xl border-4 border-black shadow-neo-lg p-8">
          <h1 className="font-display font-bold text-3xl mb-8">{id === 'new' ? 'Nouveau Workshop' : 'Modifier Workshop'}</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Status */}
            <div className="flex items-center gap-4 p-4 bg-gray-100 rounded-xl border border-gray-300">
               <label className="font-bold flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.active} onChange={(e) => setFormData(p => ({...p, active: e.target.checked}))} className="w-5 h-5 accent-brand-purple" />
                  <span>Workshop Actif (Visible sur le site)</span>
               </label>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold mb-2">Titre</label>
                <input name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border-2 border-black rounded-lg" required />
              </div>
              <div>
                <label className="block font-bold mb-2">Catégorie</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border-2 border-black rounded-lg">
                   <option value="Coding">Coding</option>
                   <option value="Robotics">Robotics</option>
                   <option value="AI">AI</option>
                   <option value="Design">Design</option>
                   <option value="Business">Business</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                <label className="block font-bold mb-2">Age</label>
                <input name="ageGroup" value={formData.ageGroup} onChange={handleChange} className="w-full p-3 border-2 border-black rounded-lg" placeholder="ex: 8-12 ans" />
               </div>
               <div>
                <label className="block font-bold mb-2">Durée</label>
                <input name="duration" value={formData.duration} onChange={handleChange} className="w-full p-3 border-2 border-black rounded-lg" placeholder="ex: 3 Heures" />
               </div>
               <div>
                <label className="block font-bold mb-2">Prix</label>
                <input name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border-2 border-black rounded-lg" placeholder="ex: 400 DHS" />
               </div>
            </div>

            <div>
              <label className="block font-bold mb-2">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border-2 border-black rounded-lg h-32" required />
            </div>

            {/* Image Section */}
            <div className="p-6 bg-brand-yellow/5 border-2 border-dashed border-black rounded-2xl">
               <div className="flex items-center gap-2 mb-4">
                 <ImageIcon className="text-brand-purple" />
                 <h3 className="font-display font-bold text-xl">Visuel du Workshop</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {/* Manual Upload */}
                    <div>
                      <label className="block font-bold text-sm mb-2 uppercase">Option 1 : Télécharger une image</label>
                      <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-black border-dotted rounded-xl bg-white hover:bg-gray-50 cursor-pointer transition-colors shadow-neo-sm">
                        <Upload size={20} />
                        <span className="font-bold text-sm">Choisir un fichier...</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>

                    {/* AI Generation */}
                    <div className="bg-brand-purple/5 p-4 rounded-xl border border-brand-purple/20">
                      <label className="block font-bold text-sm mb-2 uppercase">Option 2 : Générer avec l'IA</label>
                      <textarea 
                        name="imagePrompt" 
                        value={formData.imagePrompt || ''} 
                        onChange={handleChange} 
                        className="w-full p-3 border-2 border-black rounded-lg mb-2 text-sm h-20" 
                        placeholder="Description de l'image (ex: Un robot pilote de drone...)"
                      />
                      <Button type="button" onClick={handleGenerateImage} disabled={isGenerating} className="w-full bg-brand-purple text-white">
                          {isGenerating ? <Sparkles className="animate-spin" /> : <Sparkles />} 
                          Générer le visuel
                      </Button>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="flex flex-col">
                    <label className="block font-bold text-sm mb-2 uppercase text-center">Aperçu Final</label>
                    <div className="flex-grow border-4 border-black rounded-2xl bg-gray-100 overflow-hidden shadow-neo aspect-video relative">
                       {formData.image ? (
                         <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                       ) : (
                         <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                            <ImageIcon size={48} />
                            <span className="text-xs font-bold uppercase">Aucune image</span>
                         </div>
                       )}
                    </div>
                    <div className="mt-4">
                      <label className="block font-bold text-[10px] mb-1 uppercase opacity-50">URL de l'image (ou base64)</label>
                      <input name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border-2 border-black rounded-lg text-[10px] font-mono" placeholder="URL de l'image" />
                    </div>
                  </div>
               </div>
            </div>

            {/* Schedule */}
            <div>
               <label className="block font-bold mb-2">Prochaines Sessions</label>
               <div className="flex gap-2 mb-2">
                 <input value={scheduleInput} onChange={(e) => setScheduleInput(e.target.value)} placeholder="ex: Samedi 15 Nov - 10h00" className="w-full p-2 border-2 border-black rounded-lg" />
                 <Button type="button" size="sm" onClick={handleAddSchedule}><Plus /></Button>
               </div>
               <div className="flex flex-wrap gap-2">
                  {formData.schedule?.map((date, idx) => (
                    <span key={idx} className="bg-white px-3 py-1 rounded-full border border-black text-sm font-bold flex items-center gap-2">
                      {date}
                      <button type="button" onClick={() => handleRemoveSchedule(idx)} className="text-red-500 hover:text-red-700"><Trash2 size={14}/></button>
                    </span>
                  ))}
               </div>
            </div>

            <hr className="border-t-2 border-gray-200" />
            <Button type="submit" size="lg" className="w-full justify-center text-xl py-4 shadow-neo-lg"><Save className="mr-2"/> Enregistrer le Workshop</Button>
          </form>
        </div>
      </div>
    </div>
  );
};
