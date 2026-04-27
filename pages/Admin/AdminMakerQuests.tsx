import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { MakerQuest } from '../../types';
import { Sparkles, Plus, X, Upload, Save, Trash2, Edit2, Check, ExternalLink } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export const AdminMakerQuests: React.FC = () => {
  const [quests, setQuests] = useState<MakerQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuest, setCurrentQuest] = useState<Partial<MakerQuest>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [newMaterial, setNewMaterial] = useState('');

  // Fetch Quests
  useEffect(() => {
    const q = query(collection(db, 'maker_quests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MakerQuest[];
      setQuests(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSeed = async () => {
    try {
      setSaving(true);
      const seedData = {
        title: "🚀 Brand Launch: Final Delivery Guide",
        slug: "brand-launch-final-delivery",
        category: "Art Digital & Design",
        description: "Package and deliver your print-on-demand brand assets like a professional founder.",
        coverImage: "https://images.unsplash.com/photo-1583336718427-4638a1682498?auto=format&fit=crop&q=80&w=1200",
        active: true,
        createdAt: new Date().toISOString(),
        materials: [
          "High Res Logo (SVG/PNG)",
          "Vercel Deployment Link",
          "Firebase DB Connection",
          "300 DPI Print Canvases (Transparent PNG)"
        ],
        guide: `# 🚀 Brand Launch: Final Delivery Guide\n\nYou have engineered a complete print-on-demand brand from the ground up—from conceptualizing the DNA to deploying a live storefront. Now, it is time to package and deliver your assets like a professional founder. \n\nPlease review all technical requirements below and ensure your submission is 100% complete.\n\n## Part 1: Brand Identity 🧬\n*This section covers the core of your brand's visual and conceptual identity.*\n\n* **Brand Name:** [Insert Brand Name]\n* **Brand DNA / Pitch:** [1-2 sentences describing the brand's vibe, target audience, and mission]\n* **Logo Assets:** Provide a folder link (Google Drive/Dropbox) containing your logo in high resolution (SVG and transparent PNG).\n\n## Part 2: Platform Engineering 💻\n*Your technical deployment details.*\n\n* **Live Store URL:** [Insert your Vercel deployment link: e.g., *yourbrand.vercel.app*]\n* **Database Status:**\n    * [ ] I confirm Firebase is properly connected.\n    * [ ] Product data is successfully loading from the Firebase database to the Vercel frontend.\n* **Source Code (Optional/If required by instructor):** [Insert GitHub Repository Link]\n\n## Part 3: Product Portfolio & Assets 👕\n*All visual assets must strictly adhere to the technical requirements listed in Part 4.*\n\nFor **each** product in your collection, you must submit:\n1.  **Product Name:** A clear, commercial name (e.g., "Neon Grid Graphic Tee").\n2.  **Commercial Mockup:** A high-resolution image of the design on a model or flat-lay to be used on your website. \n3.  **Ready-to-Print Canvas:** The raw, high-resolution design file meant directly for the printer.\n\n* **Asset Folder Link:** [Insert link to a well-organized folder containing all Mockups and Print Canvases, separated by product]\n\n## Part 4: Strict Technical Requirements (Exigences) ⚠️\n*Before submitting, verify that your files meet these exact industry standards. Files that do not meet these conditions cannot be printed.*\n\n### The Sublimation Rules\n* **Garment Color:** Sublimation works by dyeing the fabric. There is no "white" ink. Therefore, all designs must be intended for **light-colored garments** (white, light grey, pastels). Any white areas in your design will simply show the color of the t-shirt.\n* **Backgrounds:** Your ready-to-print canvas files MUST have a **transparent background**. Do not submit files with a solid white or colored background block unless you want a giant square printed on the shirt.\n\n### File Specifications\n* **Resolution:** All ready-to-print canvases must be high resolution (Minimum **300 DPI**). \n* **Sizing:** The print canvas must be scaled to the actual physical print size for the t-shirt (e.g., A3 or A4 dimensions). Do not submit tiny web-resolution images for printing.\n* **Format:** Export all print canvases as **PNG** files. \n\n---\n\n### ✅ Final Pre-Flight Checklist\n* [ ] Vercel link is active and the site does not crash.\n* [ ] Firebase is storing and serving product data correctly.\n* [ ] All product names are finalized.\n* [ ] Commercial mockups are uploaded.\n* [ ] Print canvases are 300 DPI, transparent PNGs.\n* [ ] Designs respect the light-fabric sublimation rule.`
      };

      const docRef = doc(collection(db, 'maker_quests'));
      await setDoc(docRef, seedData);
      alert('Défi Seed généré avec succès !');
    } catch (error) {
      console.error(error);
      alert('Erreur seed');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentQuest({
      title: '',
      slug: '',
      category: 'Coding & IA',
      description: '',
      guide: '',
      materials: [],
      coverImage: '',
      active: true,
    });
    setImageFile(null);
    setImagePreview('');
    setIsEditing(true);
  };

  const handleEdit = (quest: MakerQuest) => {
    setCurrentQuest(quest);
    setImagePreview(quest.coverImage);
    setImageFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (quest: MakerQuest) => {
    if (!window.confirm(`Supprimer le défi "${quest.title}" ?`)) return;
    try {
      if (quest.coverImage) {
        try {
          const imageRef = ref(storage, quest.coverImage);
          await deleteObject(imageRef);
        } catch (e) {
          console.error('Error deleting image:', e);
        }
      }
      await deleteDoc(doc(db, 'maker_quests', quest.id!));
    } catch (error) {
      console.error("Error deleting quest:", error);
      alert("Erreur lors de la suppression.");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true
      };
      
      try {
        const compressedFile = await imageCompression(file, options);
        setImageFile(compressedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing image:', error);
        alert("Erreur lors du traitement de l'image.");
      }
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const addMaterial = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newMaterial.trim()) {
      e.preventDefault();
      setCurrentQuest({
        ...currentQuest,
        materials: [...(currentQuest.materials || []), newMaterial.trim()]
      });
      setNewMaterial('');
    }
  };

  const removeMaterial = (index: number) => {
    const updated = [...(currentQuest.materials || [])];
    updated.splice(index, 1);
    setCurrentQuest({ ...currentQuest, materials: updated });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuest.title || !currentQuest.slug || !currentQuest.description || !currentQuest.guide) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (!imageFile && !currentQuest.coverImage) {
      alert('Veuillez ajouter une image de couverture.');
      return;
    }

    setSaving(true);
    try {
      let imageUrl = currentQuest.coverImage;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `quests/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const imageRef = ref(storage, fileName);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const questId = currentQuest.id || doc(collection(db, 'maker_quests')).id;
      const questData = {
        title: currentQuest.title,
        slug: currentQuest.slug,
        category: currentQuest.category || 'Coding & IA',
        description: currentQuest.description,
        guide: currentQuest.guide,
        materials: currentQuest.materials || [],
        coverImage: imageUrl,
        active: currentQuest.active ?? true,
        createdAt: currentQuest.id ? currentQuest.createdAt : new Date().toISOString()
      };

      await setDoc(doc(db, 'maker_quests', questId), questData, { merge: true });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving quest:", error);
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8">
      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tighter flex items-center gap-3">
            <Sparkles className="text-brand-orange" size={40} strokeWidth={3} />
            Quêtes & Défis
          </h1>
          <p className="font-bold text-gray-500 mt-2">
            Gérez les templates de projets (Défis) pour la communauté.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-brand-orange px-6 py-3 rounded-xl border-4 border-black font-black uppercase text-sm shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
          >
            <Plus size={20} strokeWidth={3} />
            Nouveau Défi
          </button>
        )}
      </div>

      {/* ── EDITOR VIEW ─────────────────────────────────────────────────────── */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-2xl border-4 border-black shadow-neo">
          <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
            <h2 className="font-display font-black text-2xl uppercase">
              {currentQuest.id ? 'Modifier le Défi' : 'Créer un Défi'}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-2 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Details */}
            <div className="md:col-span-2 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-black text-sm uppercase tracking-wide">Titre du Défi *</label>
                  <input
                    required
                    type="text"
                    value={currentQuest.title || ''}
                    onChange={(e) => {
                      setCurrentQuest({ 
                        ...currentQuest, 
                        title: e.target.value,
                        slug: currentQuest.id ? currentQuest.slug : generateSlug(e.target.value)
                      });
                    }}
                    className="w-full p-3 border-4 border-black rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-brand-orange/20 transition-all"
                    placeholder="ex: Crée ton premier jeu vidéo"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-black text-sm uppercase tracking-wide">URL Slug *</label>
                  <input
                    required
                    type="text"
                    value={currentQuest.slug || ''}
                    onChange={(e) => setCurrentQuest({ ...currentQuest, slug: e.target.value })}
                    className="w-full p-3 border-4 border-black rounded-xl font-bold bg-gray-50 focus:outline-none focus:ring-4 focus:ring-brand-orange/20 transition-all"
                    placeholder="cree-ton-jeu"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-black text-sm uppercase tracking-wide">Catégorie</label>
                  <select
                    value={currentQuest.category || 'Coding & IA'}
                    onChange={(e) => setCurrentQuest({ ...currentQuest, category: e.target.value })}
                    className="w-full p-3 border-4 border-black rounded-xl font-bold focus:outline-none focus:ring-4 focus:ring-brand-orange/20 transition-all"
                  >
                    <option value="Coding & IA">💻 Coding & IA</option>
                    <option value="Électronique & Robotique">🤖 Électronique & Robotique</option>
                    <option value="Art Digital & Design">🎨 Art Digital & Design</option>
                    <option value="Ingénierie & Maker">⚙️ Ingénierie & Maker</option>
                    <option value="Hardware">🧰 Hardware</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="font-black text-sm uppercase tracking-wide flex items-center justify-between">
                    Statut
                  </label>
                  <div className="flex items-center gap-3 h-12">
                     <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={currentQuest.active ?? true}
                          onChange={(e) => setCurrentQuest({ ...currentQuest, active: e.target.checked })}
                        />
                        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-green border-2 border-black"></div>
                        <span className="ml-3 font-bold">{currentQuest.active ? 'Actif (Publié)' : 'Inactif (Brouillon)'}</span>
                      </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-black text-sm uppercase tracking-wide">Pitch Courte Description *</label>
                <textarea
                  required
                  value={currentQuest.description || ''}
                  onChange={(e) => setCurrentQuest({ ...currentQuest, description: e.target.value })}
                  className="w-full p-3 border-4 border-black rounded-xl font-bold resize-none custom-scrollbar focus:outline-none focus:ring-4 focus:ring-brand-orange/20 transition-all"
                  rows={2}
                  placeholder="Accroche pour la carte du défi..."
                />
              </div>

              <div className="space-y-2">
                <label className="font-black text-sm uppercase tracking-wide">Guide (Instructions) *</label>
                <textarea
                  required
                  value={currentQuest.guide || ''}
                  onChange={(e) => setCurrentQuest({ ...currentQuest, guide: e.target.value })}
                  className="w-full p-3 font-mono text-sm border-4 border-black rounded-xl resize-none custom-scrollbar focus:outline-none focus:ring-4 focus:ring-brand-orange/20 transition-all"
                  rows={10}
                  placeholder="1. Étape 1 : Fais ceci...&#10;2. Étape 2 : Fais cela...&#10;(Syntaxe Markdown supportée ou texte simple)."
                />
              </div>

            </div>

            {/* Right Column: Matériel & Image */}
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="font-black text-sm uppercase tracking-wide block">Image de Couverture *</label>
                <div className="relative aspect-video rounded-xl border-4 border-black border-dashed overflow-hidden group cursor-pointer bg-gray-50 flex items-center justify-center">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                        <span className="text-white font-bold flex items-center gap-2">
                          <Upload size={20} /> Modifier Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 text-gray-500">
                      <Upload size={32} className="mx-auto mb-2" />
                      <span className="font-bold text-sm block">Cliquez pour ajouter une image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-black text-sm uppercase tracking-wide block">Matériel Nécessaire</label>
                <div className="border-4 border-black rounded-xl p-3 bg-gray-50 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      onKeyPress={addMaterial}
                      placeholder="ex: 1x Carte Arduino (Entrée)"
                      className="flex-1 p-2 border-2 border-black rounded-lg font-bold text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={(e) => addMaterial({ key: 'Enter', preventDefault: () => {} } as any)}
                      className="p-2 bg-brand-orange border-2 border-black rounded-lg text-black hover:translate-y-px transition-transform"
                    >
                      <Plus size={20} className="stroke-[3]" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {(currentQuest.materials || []).map((mat, i) => (
                       <div key={i} className="flex justify-between items-center bg-white p-2 border-2 border-black rounded-lg text-sm font-bold">
                         <span>{mat}</span>
                         <button type="button" onClick={() => removeMaterial(i)} className="text-red-500 hover:scale-110 transition-transform">
                           <X size={16} className="stroke-[3]" />
                         </button>
                       </div>
                    ))}
                    {(!currentQuest.materials || currentQuest.materials.length === 0) && (
                      <p className="text-xs font-bold text-gray-400 text-center py-2">Aucun matériel requis ajouté.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-8 pt-6 border-t-4 border-black flex justify-end gap-4">
             <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 font-black uppercase rounded-xl border-4 border-black hover:bg-gray-100 transition-colors"
                disabled={saving}
             >
               Annuler
             </button>
             <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-brand-green px-6 py-3 rounded-xl border-4 border-black font-black uppercase shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div> : <Save size={20} strokeWidth={3} />}
               {saving ? 'Sauvegarde...' : 'Enregistrer'}
             </button>
          </div>
        </form>
      ) : (
        /* ── LIST VIEW ──────────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {quests.map(quest => (
            <div key={quest.id} className="bg-white rounded-2xl border-4 border-black flex flex-col shadow-neo hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all overflow-hidden group">
              <div className="aspect-video relative border-b-4 border-black bg-gray-100">
                <img 
                  src={quest.coverImage} 
                  alt={quest.title} 
                  className="w-full h-full object-cover"
                />
                {!quest.active && (
                   <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-white px-3 py-1 font-black text-xs uppercase border-2 border-black rounded-lg">Brouillon</span>
                   </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#00E5FF] px-2 py-1 font-black text-[10px] uppercase border-2 border-black rounded border-b-[3px]">{quest.category}</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-display font-black text-lg uppercase leading-tight line-clamp-2">{quest.title}</h3>
                <p className="text-gray-600 font-medium text-sm mt-2 line-clamp-2">{quest.description}</p>
                
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                   {quest.materials && quest.materials.length > 0 && (
                      <span className="flex-shrink-0 text-[10px] font-black uppercase bg-gray-100 px-2 py-1 rounded border-2 border-black">
                        {quest.materials.length} Élément(s) requis
                      </span>
                   )}
                </div>

                <div className="mt-auto pt-4 flex gap-2 border-t-2 border-gray-100">
                  <button 
                    onClick={() => handleEdit(quest)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#E8580A] text-black py-2 rounded-xl border-2 border-black font-black text-xs uppercase hover:bg-black hover:text-white transition-colors"
                  >
                    <Edit2 size={14} /> Gérer
                  </button>
                  <button 
                    onClick={() => handleDelete(quest)}
                    className="aspect-square flex items-center justify-center bg-gray-100 hover:bg-red-500 hover:text-white text-black rounded-xl border-2 border-black transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {quests.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center border-4 border-black border-dashed rounded-2xl bg-white/50">
               <Sparkles className="mb-4 text-brand-orange" size={48} strokeWidth={2} />
               <h3 className="font-display font-black text-xl uppercase mb-2">Aucun Défi Configuré</h3>
               <p className="font-bold text-gray-500 mb-6">Créez votre premier template pour lancer un défi à la communauté.</p>
               <button 
                 onClick={handleSeed}
                 disabled={saving}
                 className="bg-brand-blue text-white px-6 py-3 rounded-xl border-4 border-black font-black uppercase text-sm shadow-neo hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
               >
                 {saving ? 'Génération...' : 'Générer le Défi Exemple (Seed)'}
               </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
