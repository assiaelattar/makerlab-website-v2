import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase';
import { Loader2, X, Image as ImageIcon, FolderArchive, Plus, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface MediaPickerModalProps {
  onSelect: (url: string) => void;
  onCancel: () => void;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({ onSelect, onCancel }) => {
  const [images, setImages] = useState<{ url: string; name: string; path: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('website-programs-images');

  const folders = [
    { id: 'website-programs-images', label: 'Landing Pages / Programmes' },
    { id: 'website-hero-images', label: 'Images Héros' },
    { id: 'website-project-images', label: 'Projets Galerie' }
  ];

  useEffect(() => {
    fetchImages();
  }, [activeTab]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const listRef = ref(storage, activeTab);
      const res = await listAll(listRef);

      const urls = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { url, name: itemRef.name, path: itemRef.fullPath };
        })
      );

      // Sort by newest first visually (assuming timestamp is in name like 1729483_cropped_...)
      urls.sort((a, b) => b.name.localeCompare(a.name));
      setImages(urls);
    } catch (error) {
      console.error("Erreur chargement media", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1600, useWebWorker: true };
      const compressedFile = await imageCompression(file, options);
      
      const storagePath = `${activeTab}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, compressedFile);
      
      // Refresh list
      await fetchImages();
    } catch (error) {
      console.error("Erreur upload library", error);
      alert("Erreur lors de l'upload.");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center sm:p-4 bg-black/90 backdrop-blur-md" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-white sm:rounded-3xl border-0 sm:border-4 border-black shadow-none sm:shadow-[10px_10px_0_0_black] overflow-hidden w-full max-w-5xl flex flex-col h-full sm:h-[85vh] max-h-screen">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b-4 border-black bg-yellow-400 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 leading-tight">
            <FolderArchive size={24} className="text-black hidden md:block" />
            <div>
              <h3 className="font-black text-sm sm:text-xl uppercase tracking-tighter">Médiathèque</h3>
              <p className="text-[10px] font-bold text-yellow-900 hidden xs:block">Sélectionnez ou uploadez</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <label className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-white border-2 border-white rounded-xl font-black text-[10px] sm:text-sm cursor-pointer hover:bg-gray-800 transition-all shadow-neo-sm transform active:translate-y-1 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              <span className="hidden sm:inline">{uploading ? 'Upload...' : 'Nouveau'}</span>
              <span className="sm:hidden">{uploading ? '...' : 'Add'}</span>
              <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
            </label>
            
            <button onClick={onCancel} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 border-black hover:bg-red-500 hover:text-white transition-colors bg-white shadow-neo-sm shrink-0">
              <X size={16} sm:size={20} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b-4 border-black bg-gray-50 overflow-x-auto shrink-0 no-scrollbar">
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setActiveTab(folder.id)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 font-black text-[10px] sm:text-sm rounded-xl border-2 whitespace-nowrap transition-transform ${activeTab === folder.id
                  ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-0.5 -translate-y-0.5'
                  : 'bg-white border-gray-300 text-gray-500 hover:border-black hover:text-black'
                }`}
            >
              {folder.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Loader2 size={48} className="animate-spin mb-4" />
              <p className="font-black text-lg">Chargement des médias...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ImageIcon size={64} className="mb-4 opacity-50" />
              <p className="font-black text-xl">Aucune image trouvée.</p>
              <p className="font-medium text-sm mt-2 max-w-sm text-center">Vous pouvez uploader de nouvelles images via l'outil d'ajout photo principal.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onSelect(img.url)}
                  className="group relative border-4 border-black rounded-xl overflow-hidden bg-white aspect-square cursor-pointer hover:-translate-y-2 transition-transform shadow-[4px_4px_0_0_black]"
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Select overlay */}
                  <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center backdrop-blur-[2px]">
                    <div className="bg-white text-black font-black px-4 py-2 rounded-xl border-2 border-black shadow-neo-sm">
                      Utiliser
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-1.5 text-[10px] truncate font-medium backdrop-blur-sm">
                    {img.name.split('_').pop()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t-4 border-black bg-white shrink-0 flex justify-between items-center text-xs font-bold text-gray-400">
          <span>Toutes les images sont stockées sur Firebase.</span>
          <button onClick={onCancel} className="text-gray-500 hover:text-black underline">Fermer la bibliothèque</button>
        </div>
      </div>
    </div>
  );
};
