import React, { useState } from 'react';
import { Upload, Rocket, CheckCircle, Check, Plus, X, Loader2, Target, Box } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

export const SubmitProject: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const questId = searchParams.get('questId');
  const questTitle = searchParams.get('questTitle');

  const [formData, setFormData] = useState({
    projectTitle: '',
    category: 'Web App',
    pitch: '',
    liveLink: '',
    repoLink: '',
    assetLink: '', // New field for folder assets
  });

  const [makerNames, setMakerNames] = useState<string[]>(['']);
  const [techStack, setTechStack] = useState<string[]>(['']);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [honeyPot, setHoneyPot] = useState(''); // Anti-spam
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quest Checklist State
  const [checks, setChecks] = useState<Record<string, boolean>>({
    vercel: false,
    firebase: false,
    mockups: false,
    dpi: false,
    sublimation: false
  });

  const allChecked = !questId || Object.values(checks).every(v => v);

  const categories = ['Web App', 'Print on Demand', 'Hardware / Robotics', '3D Design', 'Game Dev', 'Other'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleMakerChange = (index: number, value: string) => {
    const newNames = [...makerNames];
    newNames[index] = value;
    setMakerNames(newNames);
  };

  const handleTechStackChange = (index: number, value: string) => {
    const newTech = [...techStack];
    newTech[index] = value;
    setTechStack(newTech);
  };

  const addMaker = () => setMakerNames([...makerNames, '']);
  const removeMaker = (index: number) => setMakerNames(makerNames.filter((_, i) => i !== index));

  const addTech = () => setTechStack([...techStack, '']);
  const removeTech = (index: number) => setTechStack(techStack.filter((_, i) => i !== index));

  const compressImage = async (file: File) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    return await imageCompression(file, options);
  };

  const createSlug = (title: string, makers: string[]) => {
    const baseStr = `${title} ${makers[0] || ''}`;
    return baseStr.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeyPot) return; // Spam intercepted
    if (!coverImage) {
      setError('Please upload a cover image mock-up or screenshot.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Clean arrays
      const finalMakers = makerNames.filter(n => n.trim() !== '');
      const finalTech = techStack.filter(t => t.trim() !== '');

      if (finalMakers.length === 0) {
        throw new Error('At least one Maker name is required.');
      }

      // 1. Upload Image
      const compressedFile = await compressImage(coverImage);
      const storageRef = ref(storage, `projects/${Date.now()}-${compressedFile.name}`);
      await uploadBytes(storageRef, compressedFile);
      const imageUrl = await getDownloadURL(storageRef);

      // 2. Prepare slug
      const slug = createSlug(formData.projectTitle, finalMakers);

      // 3. Save to Firestore
      const projectPayload: any = {
        ...formData,
        makerNames: finalMakers,
        techStack: finalTech,
        coverImage: imageUrl,
        gallery: [], // Can implement multi-upload later
        slug,
        status: 'pending',
        createdAt: serverTimestamp()
      };
      
      if (questId) {
        projectPayload.questId = questId;
      }

      await addDoc(collection(db, 'projects'), projectPayload);

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while launching your project. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-10 h-10 animate-bounce" />
          </div>
          <h2 className="text-3xl font-bold font-display text-brand-dark mb-4">Project Launched! 🚀</h2>
          <p className="text-gray-600 mb-8">
            Your project has been sent to the lab. Waiting for instructor approval to hit the live Maker Wall!
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 rounded-xl font-bold bg-brand-dark text-white hover:bg-brand-orange transition-colors"
          >
            Submit Another Mission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight text-brand-dark mb-4">
            Launch Your <span className="text-brand-orange">Project</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium mb-6">
            Submit your creation to the Maker Wall portfolio.
          </p>
          
          {questTitle && (
            <div className="inline-flex items-center gap-3 bg-brand-orange/10 border-2 border-brand-orange px-6 py-3 rounded-xl shadow-neo-sm animate-in fade-in slide-in-from-top-4">
               <Target className="text-brand-orange shrink-0" size={24} strokeWidth={3} />
               <div className="text-left leading-tight">
                  <p className="font-bold text-xs uppercase text-brand-orange tracking-widest">Sujet du Projet</p>
                  <p className="font-display font-black text-lg text-black uppercase">{questTitle}</p>
               </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 sm:p-12">
            {error && (
              <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
                <X className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-8">
              
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  Cover Mockup / Screenshot *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-2xl hover:border-brand-orange hover:bg-orange-50/50 transition-colors group relative">
                  <div className="space-y-2 text-center relative z-10 w-full h-full min-h-[200px] flex flex-col items-center justify-center">
                    {coverPreview ? (
                      <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm">
                        <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4"/> Change Image</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-brand-orange transition-colors" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <p className="pl-1 font-medium bg-white px-3 py-1 rounded-full shadow-sm text-brand-dark">Click to upload or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">PNG, JPG, WEBP up to 5MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Project Title *</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-lg placeholder-gray-400"
                    placeholder="E.g. Neon Grid Brand"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Category *</label>
                  <select
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-lg"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Makers */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Makers (Team or Solo) *</label>
                <div className="space-y-3">
                  {makerNames.map((name, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        required={idx === 0}
                        type="text"
                        placeholder="E.g. Ahmed B."
                        className="flex-1 px-5 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange font-medium"
                        value={name}
                        onChange={(e) => handleMakerChange(idx, e.target.value)}
                      />
                      {makerNames.length > 1 && (
                        <button type="button" onClick={() => removeMaker(idx)} className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addMaker} className="text-brand-orange font-bold text-sm flex items-center gap-2 hover:bg-orange-50 px-3 py-2 rounded-lg transition-colors">
                    <Plus className="w-4 h-4" /> Add Team Member
                  </button>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Tech Stack / Tools</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {techStack.map((tech, idx) => (
                    <div key={idx} className="flex gap-2 shrink-0">
                      <input
                        type="text"
                        placeholder="E.g. Vercel"
                        className="w-32 px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange font-medium text-sm"
                        value={tech}
                        onChange={(e) => handleTechStackChange(idx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addTech} className="text-gray-500 font-bold text-sm flex items-center gap-2 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" /> Add Tool
                </button>
              </div>

              {/* Pitch */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Elevator Pitch / Brand DNA *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium text-gray-700 placeholder-gray-400 resize-none"
                  placeholder="Tell us about the project in 2-3 sentences. What problem does it solve? What's the brand personality?"
                  value={formData.pitch}
                  onChange={(e) => setFormData({...formData, pitch: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Live Link */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Live Link (Optional)</label>
                  <input
                    type="url"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium placeholder-gray-400"
                    placeholder="https://"
                    value={formData.liveLink}
                    onChange={(e) => setFormData({...formData, liveLink: e.target.value})}
                  />
                </div>
                {/* Repo Link */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">GitHub / Figma (Optional)</label>
                  <input
                    type="url"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium placeholder-gray-400"
                    placeholder="https://"
                    value={formData.repoLink}
                    onChange={(e) => setFormData({...formData, repoLink: e.target.value})}
                  />
                </div>
              </div>

              {/* Asset Link (Crucial for Quests) */}
              <div className={`p-6 rounded-2xl border-2 transition-all ${questId ? 'bg-orange-50 border-brand-orange shadow-neo-sm' : 'bg-gray-50 border-gray-100'}`}>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider flex items-center justify-between">
                  <span>Lien des Assets (Drive / Dropbox) {questId && <span className="text-brand-orange">* REQUIS POUR LE DÉFI</span>}</span>
                  <Box className={questId ? 'text-brand-orange' : 'text-gray-400'} size={18} />
                </label>
                <input
                  required={!!questId}
                  type="url"
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-brand-orange/20 focus:border-brand-orange transition-all font-medium placeholder-gray-400"
                  placeholder="Lien vers votre dossier Google Drive / Dropbox contenant les fichiers sources..."
                  value={formData.assetLink}
                  onChange={(e) => setFormData({...formData, assetLink: e.target.value})}
                />
                {questId && <p className="mt-2 text-xs font-bold text-brand-orange/80">⚠️ Veuillez vous assurer que le partage du lien est configuré sur "Tous ceux disposant du lien".</p>}
              </div>

              {/* Final Checklist for Quests */}
              {questId && (
                <div className="p-6 bg-brand-dark text-white rounded-2xl border-4 border-black shadow-neo-sm">
                   <div className="flex items-center gap-2 mb-6 border-b border-white/20 pb-4">
                      <CheckCircle className="text-brand-green" size={24} strokeWidth={3} />
                      <h3 className="font-display font-black text-xl uppercase italic">Checklist de Lancement</h3>
                   </div>
                   <div className="space-y-4">
                      {[
                        { id: 'vercel', label: 'Mon lien Vercel est actif et fonctionne.' },
                        { id: 'firebase', label: 'Firebase est connecté et affiche mes produits.' },
                        { id: 'mockups', label: 'Mes Mockups commerciaux sont prêts.' },
                        { id: 'dpi', label: 'Mes fichiers print sont en 300 DPI.' },
                        { id: 'sublimation', label: 'Le design respecte les règles de sublimation (fond blanc/clair).' }
                      ].map(item => (
                        <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                           <div className="relative flex items-center justify-center mt-0.5">
                              <input 
                                type="checkbox" 
                                checked={(checks as any)[item.id]} 
                                onChange={() => setChecks(prev => ({ ...prev, [item.id]: !(prev as any)[item.id] }))}
                                className="sr-only"
                              />
                              <div className={`w-6 h-6 border-2 border-white rounded transition-colors flex items-center justify-center ${(checks as any)[item.id] ? 'bg-brand-green border-brand-green' : 'bg-transparent group-hover:border-brand-green'}`}>
                                 {(checks as any)[item.id] && <Check className="w-4 h-4 text-brand-dark stroke-[4]" />}
                              </div>
                           </div>
                           <span className={`text-sm font-bold transition-colors ${(checks as any)[item.id] ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                              {item.label}
                           </span>
                        </label>
                      ))}
                   </div>
                </div>
              )}

              {/* Honeypot (Hidden) */}
              <div className="opacity-0 absolute -z-50 h-0 w-0 overflow-hidden">
                <input type="text" tabIndex={-1} value={honeyPot} onChange={e => setHoneyPot(e.target.value)} autoComplete="off" />
              </div>

              <div className="pt-6">
                <button
                   type="submit"
                   disabled={isSubmitting || !allChecked}
                   className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:grayscale disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${allChecked ? 'bg-brand-orange hover:bg-[#e65a12]' : 'bg-gray-400'}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Uploading to System...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-6 h-6" />
                      Launch Project
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
