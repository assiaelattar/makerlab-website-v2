import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import { 
  Rocket, 
  User, 
  Phone, 
  Baby, 
  Image as ImageIcon, 
  Upload, 
  Loader2, 
  Copy, 
  CheckCircle2, 
  Trash2,
  Plus,
  Wrench,
  Link as LinkIcon
} from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Button } from '../../components/Button';

export const AdminEnrollmentGenerator: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    parentName: '',
    parentPhone: '',
    childName: '',
    childAgeGroup: '',
    achievementImages: [] as string[]
  });

  const [ageGroups, setAgeGroups] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const parentName = params.get('parentName');
    const parentPhone = params.get('parentPhone');
    const childName = params.get('childName');
    const ageGroup = params.get('ageGroup');

    if (parentName || parentPhone || childName || ageGroup) {
      setFormData(prev => ({
        ...prev,
        parentName: parentName || prev.parentName,
        parentPhone: parentPhone || prev.parentPhone,
        childName: childName || prev.childName,
        childAgeGroup: ageGroup || prev.childAgeGroup
      }));
    }
  }, [location]);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'stemquest');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAgeGroups(docSnap.data().ageGroups || []);
        }
      } catch (err) {
        console.error("Error fetching age groups", err);
      }
    };
    fetchSettings();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const storagePath = `trial_achievements/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, compressedFile);
        return await getDownloadURL(storageRef);
      });

      const urls = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        achievementImages: [...prev.achievementImages, ...urls]
      }));
    } catch (error) {
      console.error("Upload error", error);
      alert("Erreur lors de l'upload des images.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievementImages: prev.achievementImages.filter((_, i) => i !== index)
    }));
  };

  const generateLink = async () => {
    if (!formData.parentName || !formData.childName || !formData.parentPhone) {
      alert("Veuillez remplir les informations de base.");
      return;
    }

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'trial_conversions'), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      const link = `${window.location.origin}/stemquest-enrollment/${docRef.id}`;
      setGeneratedLink(link);
    } catch (error) {
      console.error("Error generating link", error);
      alert("Erreur lors de la génération du lien.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      alert("Lien copié dans le presse-papier !");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="bg-[#2D1B8C] text-white p-8 md:p-12 rounded-[2.5rem] border-8 border-black shadow-neo relative overflow-hidden mb-12">
        <div className="relative z-10">
          <h1 className="font-display font-black text-4xl md:text-6xl uppercase italic tracking-tighter leading-none mb-4">
            Post-Trial <span className="text-yellow-400">Generator.</span>
          </h1>
          <p className="text-purple-100 font-bold text-lg max-w-xl">
            Créez une page d'inscription ultra-personnalisée pour convertir après l'atelier d'essai.
          </p>
        </div>
        <Rocket size={180} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="space-y-6">
          <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-neo-sm">
            <h3 className="font-black text-xl uppercase mb-8 flex items-center gap-2">
              <User size={24} className="text-brand-red" /> Infos Parent & Enfant
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Nom du Parent</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-black rounded-2xl font-bold focus:bg-white transition-all outline-none focus:ring-4 ring-red-100"
                    placeholder="Ex: Meryem El Amrani"
                    value={formData.parentName}
                    onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="tel" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-black rounded-2xl font-bold focus:bg-white transition-all outline-none focus:ring-4 ring-red-100"
                    placeholder="Ex: 0621877106"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Enfant</label>
                  <div className="relative">
                    <Baby className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-black rounded-2xl font-bold focus:bg-white transition-all outline-none focus:ring-4 ring-red-100"
                      placeholder="Adam"
                      value={formData.childName}
                      onChange={(e) => setFormData({...formData, childName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-2">Âge (Groupe)</label>
                  <select 
                    className="w-full p-4 bg-gray-50 border-2 border-black rounded-2xl font-bold focus:bg-white transition-all outline-none focus:ring-4 ring-red-100 appearance-none"
                    value={formData.childAgeGroup}
                    onChange={(e) => setFormData({...formData, childAgeGroup: e.target.value})}
                  >
                    <option value="">Sélectionner</option>
                    {ageGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={generateLink}
            disabled={loading || !formData.parentName || !formData.childName}
            className="w-full py-5 bg-black text-white rounded-2xl border-4 border-black font-black uppercase text-xl shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><LinkIcon size={24} /> Générer le lien</>}
          </button>

          {generatedLink && (
            <div className="bg-green-50 border-4 border-green-500 rounded-3xl p-6 shadow-neo-sm animate-in zoom-in duration-300">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="text-green-500" />
                <p className="font-black text-green-700 uppercase">Lien prêt !</p>
              </div>
              <div className="flex gap-2">
                <input 
                  readOnly 
                  value={generatedLink}
                  className="flex-grow bg-white border-2 border-green-200 p-3 rounded-xl text-xs font-mono truncate"
                />
                <button 
                  onClick={copyToClipboard}
                  className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors shadow-neo-sm"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Uploads */}
        <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-neo-sm">
          <h3 className="font-black text-xl uppercase mb-6 flex items-center gap-2">
            <ImageIcon size={20} className="text-brand-orange" /> Photos de l'Atelier
          </h3>

          <div className="space-y-6">
            <label className="block w-full border-4 border-black border-dashed rounded-2xl p-8 text-center cursor-pointer hover:bg-orange-50 transition-all">
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              {uploading ? (
                <Loader2 size={48} className="mx-auto animate-spin text-brand-orange mb-2" />
              ) : (
                <Upload size={48} className="mx-auto text-gray-300 mb-2" />
              )}
              <p className="font-black uppercase text-xs">Uploader les accomplissements</p>
              <p className="text-[10px] text-gray-400 font-bold mt-1">Photos de l'enfant avec son projet</p>
            </label>

            <div className="grid grid-cols-2 gap-4">
              {formData.achievementImages.map((url, idx) => (
                <div key={idx} className="relative group aspect-square border-2 border-black rounded-xl overflow-hidden shadow-neo-sm">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                  <button 
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-neo-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
