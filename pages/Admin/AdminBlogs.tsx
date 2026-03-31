import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Button } from '../../components/Button';
import { Plus, Trash2, Save, Edit2, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { BlogPost } from '../../types';
import imageCompression from 'browser-image-compression';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

export const AdminBlogs: React.FC = () => {
  const { settings, updateSetting, isLoading } = useSettings();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    author: 'Equipe MakerLab',
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
    preview: '',
    content: '',
    tags: [],
    image: '',
    seoKeywords: []
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingOg, setIsUploadingOg] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isLoading && settings?.blogs) {
      setBlogs(settings.blogs);
    }
  }, [settings, isLoading]);

  const handleCompressAndUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Compression options
      const options = {
        maxSizeMB: 0.8, // Max 800KB
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };

      console.log('Original size:', file.size / 1024 / 1024, 'MB');
      const compressedFile = await imageCompression(file, options);
      console.log('Compressed size:', compressedFile.size / 1024 / 1024, 'MB');

      // Upload to Firebase
      const storagePath = `website-project-images/blogs/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(snapshot.ref);

      setCurrentBlog(prev => ({ ...prev, image: url }));
      alert('Image compressée et uploadée avec succès!');
    } catch (error: any) {
      console.error('❌ Blog Upload Error Details:', {
        code: error.code,
        message: error.message,
        serverResponse: error.serverResponse,
        fullError: error
      });
      alert(`Erreur lors de l'upload: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingOg(true);
    try {
      const options = {
        maxSizeMB: 0.28, // Keep under WhatsApp's ~300KB limit
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const storagePath = `website-project-images/blogs/og/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      const snapshot = await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(snapshot.ref);
      setCurrentBlog(prev => ({ ...prev, ogImage: url }));
    } catch (error: any) {
      console.error("❌ Firebase Upload Error (Blog OG Image):", {
        code: error.code,
        message: error.message,
      });
      let userMessage = "Erreur upload image sociale.";
      if (error.code === 'storage/unauthorized') {
        userMessage += "\nPermissions refusées. Vérifiez vos règles Firebase Storage pour 'website-project-images/blogs/og/'.";
      } else {
        userMessage += `\nDétail: ${error.message}`;
      }
      alert(userMessage);
    } finally {
      setIsUploadingOg(false);
    }
  };

  const handleSave = async () => {
    if (!currentBlog.title || !currentBlog.slug) {
      alert('Le titre et le slug sont obligatoires.');
      return;
    }

    let updatedBlogs = [...blogs];
    if (currentBlog.id) {
      updatedBlogs = blogs.map(b => b.id === currentBlog.id ? currentBlog as BlogPost : b);
    } else {
      const newBlog = { ...currentBlog, id: Date.now().toString() } as BlogPost;
      updatedBlogs = [newBlog, ...blogs];
    }

    await updateSetting('blogs', updatedBlogs);
    setBlogs(updatedBlogs);
    setIsEditing(false);
    resetForm();
    alert('Blog enregistré !');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cet article ?')) return;
    const updatedBlogs = blogs.filter(b => b.id !== id);
    await updateSetting('blogs', updatedBlogs);
    setBlogs(updatedBlogs);
    alert('Article supprimé.');
  };

  const resetForm = () => {
    setCurrentBlog({
      title: '',
      slug: '',
      author: 'Equipe MakerLab',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      preview: '',
      content: '',
      tags: [],
      image: '',
      ogImage: '',
      seoKeywords: []
    });
  };

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-20 text-center font-bold">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display font-black text-4xl uppercase tracking-tighter">Blog Management</h1>
        {!isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Plus size={20} /> Nouvel Article
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-neo mb-12">
          <h2 className="font-display font-bold text-2xl mb-6 uppercase">{currentBlog.id ? 'Modifier' : 'Nouveau'} Article</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block font-black text-sm uppercase mb-1">Titre de l'article</label>
                <input 
                  value={currentBlog.title}
                  onChange={e => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                    setCurrentBlog({...currentBlog, title, slug});
                  }}
                  className="w-full border-4 border-black p-3 font-bold focus:shadow-neo-sm outline-none transition-all"
                  placeholder="Ex: Pourquoi la robotique est importante ?"
                />
              </div>
              <div>
                <label className="block font-black text-sm uppercase mb-1">URL Slug (automatique)</label>
                <input 
                  value={currentBlog.slug}
                  onChange={e => setCurrentBlog({...currentBlog, slug: e.target.value})}
                  className="w-full border-4 border-black p-3 font-mono text-sm focus:shadow-neo-sm outline-none transition-all"
                  placeholder="pourquoi-la-robotique"
                />
              </div>
              <div>
                <label className="block font-black text-sm uppercase mb-1">Preview / Description Courte (SEO)</label>
                <textarea 
                  value={currentBlog.preview}
                  onChange={e => setCurrentBlog({...currentBlog, preview: e.target.value})}
                  className="w-full border-4 border-black p-3 font-medium h-24 focus:shadow-neo-sm outline-none transition-all"
                  placeholder="Description qui apparaît dans les résultats de recherche..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-sm uppercase mb-1">Auteur</label>
                  <input 
                    value={currentBlog.author}
                    onChange={e => setCurrentBlog({...currentBlog, author: e.target.value})}
                    className="w-full border-4 border-black p-3 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-black text-sm uppercase mb-1">Date</label>
                  <input 
                    value={currentBlog.date}
                    onChange={e => setCurrentBlog({...currentBlog, date: e.target.value})}
                    className="w-full border-4 border-black p-3 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-black text-sm uppercase mb-1">Image de Couverture</label>
                <div className="border-4 border-dashed border-black rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 min-h-[200px]">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 size={32} className="animate-spin mb-2" />
                      <span className="font-bold text-sm">Compression en cours...</span>
                    </div>
                  ) : currentBlog.image ? (
                    <div className="relative w-full h-40 group">
                      <img src={currentBlog.image} alt="Preview" className="w-full h-full object-cover rounded-lg border-2 border-black" />
                      <button 
                        onClick={() => setCurrentBlog({...currentBlog, image: ''})}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon size={48} className="mx-auto mb-2 text-gray-400" />
                      <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-red transition-colors flex items-center gap-2">
                        <span>Choisir & Compresser</span>
                        <input type="file" accept="image/*" onChange={handleCompressAndUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block font-black text-sm uppercase mb-1">Tags (séparés par virgule)</label>
                <input 
                  value={currentBlog.tags?.join(', ')}
                  onChange={e => setCurrentBlog({...currentBlog, tags: e.target.value.split(',').map(t => t.trim())})}
                  className="w-full border-4 border-black p-3 font-bold"
                  placeholder="Robotique, Kids, STEM"
                />
              </div>
              <div>
                <label className="block font-black text-sm uppercase mb-1">Mots-clés SEO (pour LLM ranking)</label>
                <input 
                  value={currentBlog.seoKeywords?.join(', ')}
                  onChange={e => setCurrentBlog({...currentBlog, seoKeywords: e.target.value.split(',').map(t => t.trim())})}
                  className="w-full border-4 border-black p-3 font-bold"
                  placeholder="ateliers enfants casablanca, ai for kids..."
                />
              </div>

              {/* OG / Social Preview Image */}
              <div>
                <label className="block font-black text-sm uppercase mb-1">Image Réseaux Sociaux (WhatsApp, etc.)</label>
                <div className="border-4 border-dashed border-brand-blue rounded-xl p-3 flex flex-col items-center justify-center bg-blue-50 min-h-[120px] relative">
                  {isUploadingOg ? (
                    <div className="flex flex-col items-center">
                      <Loader2 size={24} className="animate-spin mb-1 text-brand-blue" />
                      <span className="font-bold text-xs text-brand-blue">Compression WhatsApp...</span>
                    </div>
                  ) : currentBlog.ogImage ? (
                    <div className="relative w-full h-24 group">
                      <img src={currentBlog.ogImage} alt="OG Preview" className="w-full h-full object-cover rounded-lg border-2 border-brand-blue" />
                      <button
                        onClick={() => setCurrentBlog(prev => ({ ...prev, ogImage: '' }))}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full border-2 border-black opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer bg-brand-blue text-white px-3 py-2 rounded-lg font-bold text-xs hover:opacity-80 transition-opacity flex items-center gap-1">
                      <ImageIcon size={14} /> Choisir (1200×630px)
                      <input type="file" accept="image/*" onChange={handleOgImageUpload} className="hidden" />
                    </label>
                  )}
                  {currentBlog.ogImage && (
                    <p className="text-[10px] text-brand-blue font-black mt-2">✅ Image sociale personnalisée active</p>
                  )}
                  {!currentBlog.ogImage && (
                    <p className="text-[10px] text-gray-400 font-bold mt-2">ℹ️ Image de couverture utilisée par défaut</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block font-black text-sm uppercase mb-1">Contenu (HTML acceptable)</label>
            <textarea 
              value={currentBlog.content}
              onChange={e => setCurrentBlog({...currentBlog, content: e.target.value})}
              className="w-full border-4 border-black p-4 font-medium min-h-[400px] focus:shadow-neo-sm outline-none transition-all font-mono text-sm"
              placeholder="Écrivez votre article ici... Utilisez <p>, <h3>, <ul>, etc."
            />
          </div>

          <div className="flex gap-4">
            <Button variant="primary" onClick={handleSave} className="flex-1 flex items-center justify-center gap-2">
              <Save size={20} /> {currentBlog.id ? 'Mettre à jour' : 'Publier'}
            </Button>
            <Button variant="outline" onClick={() => { setIsEditing(false); resetForm(); }} className="flex-1">
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* SearchBar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border-4 border-black p-4 pl-12 rounded-xl font-bold shadow-neo-sm outline-none"
            />
          </div>

          {/* List */}
          <div className="grid grid-cols-1 gap-6">
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 border-4 border-black border-dashed rounded-3xl">
                <p className="font-display font-bold text-2xl text-gray-400">Aucun article trouvé.</p>
              </div>
            ) : (
              filteredBlogs.map(blog => (
                <div key={blog.id} className="bg-white border-4 border-black rounded-2xl p-6 shadow-neo-sm flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-full md:w-32 h-32 shrink-0 border-2 border-black rounded-xl overflow-hidden shadow-neo-sm">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-display font-black text-xl mb-1 uppercase leading-tight">{blog.title}</h3>
                    <div className="flex gap-4 text-xs font-bold text-gray-500 mb-2 uppercase">
                      <span>{blog.date}</span>
                      <span>/</span>
                      <span>{blog.author}</span>
                    </div>
                    <p className="text-gray-600 line-clamp-2 text-sm font-medium">{blog.preview}</p>
                  </div>
                  <div className="flex gap-3 shrink-0">
                    <button 
                      onClick={() => { setCurrentBlog(blog); setIsEditing(true); }}
                      className="p-3 bg-brand-blue border-2 border-black rounded-xl shadow-neo-sm hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="p-3 bg-brand-red border-2 border-black rounded-xl shadow-neo-sm hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
