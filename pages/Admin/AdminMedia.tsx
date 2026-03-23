import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase';
import { Button } from '../../components/Button';
import { Trash2, Image as ImageIcon, Loader2, Copy } from 'lucide-react';

export const AdminMedia: React.FC = () => {
    const [images, setImages] = useState<{ url: string, name: string, path: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('website-hero-images');

    const folders = [
        { id: 'website-hero-images', label: 'Images Site Web' },
        { id: 'programs', label: 'Programmes & Ateliers' },
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

            setImages(urls);
        } catch (error) {
            console.error("Erreur chargement media", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (path: string) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette image définitivement ?')) return;
        try {
            const imageRef = ref(storage, path);
            await deleteObject(imageRef);
            setImages(images.filter(img => img.path !== path));
        } catch (error) {
            console.error("Erreur suppression", error);
            alert("Impossible de supprimer l'image.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="font-display font-black text-4xl mb-8 flex items-center gap-4">
                <ImageIcon size={36} /> Médiathèque
            </h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                {folders.map(folder => (
                    <button
                        key={folder.id}
                        onClick={() => setActiveTab(folder.id)}
                        className={`px-6 py-3 font-bold rounded-xl border-4 whitespace-nowrap transition-transform ${activeTab === folder.id
                                ? 'bg-brand-orange border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                                : 'bg-white border-transparent text-gray-500 hover:border-black hover:bg-gray-50'
                            }`}
                    >
                        {folder.label}
                    </button>
                ))}
            </div>

            {/* Gallery */}
            <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <Loader2 size={48} className="animate-spin mb-4" />
                        <p className="font-bold">Chargement des médias...</p>
                    </div>
                ) : images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <ImageIcon size={64} className="mb-4 opacity-50" />
                        <p className="font-bold text-xl">Aucune image trouvée dans ce dossier.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {images.map((img, idx) => (
                            <div key={idx} className="group relative border-4 border-black rounded-xl overflow-hidden bg-gray-100 aspect-square">
                                <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-4 backdrop-blur-sm">
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(img.url); alert('URL copiée!'); }}
                                        className="bg-white text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-blue transition-colors"
                                    >
                                        <Copy size={16} /> Copier URL
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img.path)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 size={16} /> Supprimer
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-black text-white p-2 text-xs truncate">
                                    {img.name.split('_').pop()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
