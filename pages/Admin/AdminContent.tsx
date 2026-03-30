import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Button } from '../../components/Button';
import { Save, Plus, Trash2, Upload, Sparkles, Image as ImageIcon, BarChart2 } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import imageCompression from 'browser-image-compression';

const colorOptions = [
    { label: 'Bleu (brand-blue)', value: 'brand-blue' },
    { label: 'Vert (brand-green)', value: 'brand-green' },
    { label: 'Orange (brand-orange)', value: 'brand-orange' },
    { label: 'Rouge (brand-red)', value: 'brand-red' },
];

export const AdminContent: React.FC = () => {
    const { settings, updateSetting, isLoading: contextIsLoading } = useSettings();
    const [isUploading, setIsUploading] = useState(false);

    // Initial States
    const [heroData, setHeroData] = useState({
        home_bento_1: '', home_bento_2: '', home_bento_3: '',
        hero_bg_adultes: '', hero_bg_ecoles: '', hero_bg_programs: ''
    });

    const [videoData, setVideoData] = useState({
        videoSrc: '', poster: '', title: '', description: '', theme: 'cyan'
    });

    const [announcementData, setAnnouncementData] = useState({
        enabled: false, message: '', animationStyle: 'none', ctaText: '', ctaLink: '', bgColor: '#00E5FF', textColor: '#000000'
    });

    const [projectsData, setProjectsData] = useState<any[]>([]);

    // Dynamic Hero Messages State
    const defaultDynamicMessages = [
        { id: '1', passive: "Ne fais pas que regarder", action: "CONSTRUIS", result: "ton propre robot", color: "brand-blue" },
        { id: '2', passive: "Ne fais pas que jouer", action: "CODE", result: "ton jeu vidéo", color: "brand-green" },
        { id: '3', passive: "N'achète pas seulement", action: "DESIGNE", result: "ton objet 3D", color: "brand-orange" },
        { id: '4', passive: "Ne fais pas que scroller", action: "CRÉE", result: "quelque chose de unique", color: "brand-red" },
    ];
    const [dynamicMessages, setDynamicMessages] = useState<any[]>(defaultDynamicMessages);
    const [newMsg, setNewMsg] = useState({ passive: '', action: '', result: '', color: 'brand-blue' });

    // Gallery state
    const [activeGallery, setActiveGallery] = useState<'gallery_kids' | 'gallery_schools' | 'gallery_programs' | 'gallery_general'>('gallery_general');
    const [galleryImages, setGalleryImages] = useState<Record<string, { url: string; caption: string }[]>>({
        gallery_general: [], gallery_kids: [], gallery_schools: [], gallery_programs: []
    });
    const [galleryCaption, setGalleryCaption] = useState('');

    // Key stats state
    const defaultStats = [
        { value: '200+', label: 'Enfants formés', emoji: '🎓' },
        { value: '5 ans', label: "d'expertise", emoji: '🏆' },
        { value: '98%', label: 'Satisfaction parents', emoji: '❤️' },
        { value: '30+', label: 'Ateliers disponibles', emoji: '🔧' },
    ];
    const [keyStats, setKeyStats] = useState<{ value: string; label: string; emoji: string }[]>(defaultStats);

    useEffect(() => {
        if (!contextIsLoading && settings) {
            if (settings.home_video) setVideoData(settings.home_video);
            if (settings.home_projects) setProjectsData(settings.home_projects);
            if (settings.hero_images) setHeroData(settings.hero_images);
            if (settings.announcement_bar) setAnnouncementData(settings.announcement_bar);
            if (settings.hero_dynamic_messages && settings.hero_dynamic_messages.length > 0) {
                setDynamicMessages(settings.hero_dynamic_messages);
            }
            if (settings.gallery_general) setGalleryImages(prev => ({ ...prev, gallery_general: settings.gallery_general }));
            if (settings.gallery_kids) setGalleryImages(prev => ({ ...prev, gallery_kids: settings.gallery_kids }));
            if (settings.gallery_schools) setGalleryImages(prev => ({ ...prev, gallery_schools: settings.gallery_schools }));
            if (settings.gallery_programs) setGalleryImages(prev => ({ ...prev, gallery_programs: settings.gallery_programs }));
            if (settings.key_stats && settings.key_stats.length > 0) setKeyStats(settings.key_stats);
        }
    }, [settings, contextIsLoading]);

    // Handle Uploads
    const handleImageUpload = async (folder: string, file: File) => {
        setIsUploading(true);
        try {
            const options = {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1600,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            
            const storagePath = `${folder}/${Date.now()}_${file.name}`;
            console.log(`Attempting upload to: ${storagePath} (Compressed)`);
            const storageRef = ref(storage, storagePath);
            const snapshot = await uploadBytes(storageRef, compressedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            console.log("Upload successful:", downloadURL);
            return downloadURL;
        } catch (error: any) {
            console.error("❌ Firebase Upload Error Details:", {
                code: error.code,
                message: error.message,
                serverResponse: error.serverResponse,
                fullError: error
            });
            
            let userMessage = "Erreur lors de l'upload de l'image";
            if (error.code === 'storage/unauthorized') {
                userMessage += " : Permissions insuffisantes (Vérifiez les règles Firebase Storage).";
            } else if (error.code === 'storage/retry-limit-exceeded') {
                userMessage += " : Délai d'attente dépassé.";
            } else if (error.code === 'storage/canceled') {
                userMessage += " : Upload annulé.";
            }
            
            alert(userMessage);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    // --- ANNOUNCEMENT BAR ---
    const handleAnnouncementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        setAnnouncementData({ ...announcementData, [name]: type === 'checkbox' ? e.target.checked : value });
    };
    const handleSaveAnnouncement = async () => {
        await updateSetting('announcement_bar', announcementData);
        alert('Barre d\'annonce enregistrée!');
    };

    // --- HERO IMAGES ---
    const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => setHeroData({ ...heroData, [e.target.name]: e.target.value });
    const handleHeroImageUpload = async (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const url = await handleImageUpload('website-hero-images', e.target.files[0]);
            if (url) setHeroData(prev => ({ ...prev, [field]: url }));
        }
    };
    const handleSaveHeroImages = async () => {
        await updateSetting('hero_images', heroData);
        alert('Images d\'en-tête enregistrées!');
    };

    // --- VIDEO ---
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setVideoData({ ...videoData, [e.target.name]: e.target.value });
    const handleSaveVideo = async () => {
        await updateSetting('home_video', videoData);
        alert('Video settings saved!');
    };

    // --- GALLERY ---
    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const files = Array.from(e.target.files);
        for (const file of files) {
            // Updated folder to match AdminMedia gallery folder
            const url = await handleImageUpload(`website-project-images/${activeGallery}`, file as File);
            if (url) {
                setGalleryImages(prev => ({
                    ...prev,
                    [activeGallery]: [...(prev[activeGallery] || []), { url, caption: galleryCaption }]
                }));
            }
        }
        setGalleryCaption('');
    };
    const handleDeleteGalleryImage = (idx: number) => {
        setGalleryImages(prev => ({ ...prev, [activeGallery]: prev[activeGallery].filter((_, i) => i !== idx) }));
    };
    const handleUpdateCaption = (idx: number, caption: string) => {
        setGalleryImages(prev => ({
            ...prev,
            [activeGallery]: prev[activeGallery].map((img, i) => i === idx ? { ...img, caption } : img)
        }));
    };
    const handleSaveGallery = async () => {
        await updateSetting(activeGallery, galleryImages[activeGallery]);
        alert(`Galerie "${activeGallery}" enregistrée!`);
    };

    // --- KEY STATS ---
    const handleStatChange = (idx: number, field: string, value: string) => {
        setKeyStats(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
    };
    const handleAddStat = () => setKeyStats(prev => [...prev, { value: '', label: '', emoji: '⭐' }]);
    const handleDeleteStat = (idx: number) => setKeyStats(prev => prev.filter((_, i) => i !== idx));
    const handleSaveStats = async () => {
        await updateSetting('key_stats', keyStats);
        alert('Chiffres clés enregistrés!');
    };

    // --- DYNAMIC HERO MESSAGES ---
    const handleAddMessage = () => {
        if (!newMsg.passive.trim() || !newMsg.action.trim() || !newMsg.result.trim()) return;
        const updated = [...dynamicMessages, { ...newMsg, id: Date.now().toString() }];
        setDynamicMessages(updated);
        setNewMsg({ passive: '', action: '', result: '', color: 'brand-blue' });
    };
    const handleDeleteMessage = (id: string) => {
        setDynamicMessages(prev => prev.filter(m => m.id !== id));
    };
    const handleSaveDynamicMessages = async () => {
        await updateSetting('hero_dynamic_messages', dynamicMessages);
        alert('Phrases dynamiques enregistrées!');
    };

    if (contextIsLoading) return <div className="p-20 text-center font-bold">Chargement des données...</div>;
    if (isUploading) return <div className="p-20 text-center font-bold animate-pulse text-brand-red">Upload en cours... Patientez svp.</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="font-display font-black text-4xl mb-8">Contenu du Site</h1>

            {/* DYNAMIC HERO MESSAGES */}
            <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-8 mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles size={24} className="text-brand-orange" />
                    <h2 className="font-display font-bold text-2xl">Phrases d'Accroche Dynamiques (Hero)</h2>
                </div>
                <p className="text-sm text-gray-500 font-medium mb-6 border-l-4 border-brand-orange pl-4">
                    Ces phrases s'affichent en rotation sur la page d'accueil. Structure : <em>[Phrase Passive] — [VERBE D'ACTION] [Résultat]</em>.
                </p>

                {/* Preview of first message */}
                {dynamicMessages.length > 0 && (
                    <div className={`mb-6 p-6 border-4 border-black rounded-2xl bg-gray-50 text-center`}>
                        <p className="text-gray-700 font-bold text-lg">{dynamicMessages[0].passive} —</p>
                        <p className={`font-black text-6xl text-${dynamicMessages[0].color} drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] uppercase`}>{dynamicMessages[0].action}</p>
                        <p className="font-bold text-2xl text-black">{dynamicMessages[0].result}</p>
                    </div>
                )}

                {/* Messages List */}
                <div className="space-y-3 mb-6">
                    {dynamicMessages.map((msg) => (
                        <div key={msg.id} className="flex items-center gap-4 p-4 border-2 border-black rounded-xl bg-gray-50">
                            <div className={`w-4 h-4 rounded-full bg-${msg.color} border-2 border-black shrink-0`}></div>
                            <div className="flex-grow min-w-0">
                                <span className="text-gray-600 text-sm font-medium">{msg.passive} — </span>
                                <span className={`font-black text-${msg.color} uppercase`}>{msg.action} </span>
                                <span className="font-bold">{msg.result}</span>
                            </div>
                            <button onClick={() => handleDeleteMessage(msg.id)} className="text-red-500 hover:text-red-700 shrink-0 p-1 border-2 border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add New Message */}
                <div className="border-4 border-dashed border-black rounded-2xl p-6 bg-gray-50">
                    <h3 className="font-bold text-lg mb-4 uppercase tracking-wider">+ Ajouter une nouvelle phrase</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block font-bold text-sm mb-1">Phrase Passive</label>
                            <input value={newMsg.passive} onChange={e => setNewMsg({ ...newMsg, passive: e.target.value })}
                                placeholder="Ne fais pas que jouer"
                                className="w-full border-2 border-black p-2.5 rounded-lg bg-white font-medium text-sm" />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-1">Verbe d'Action (uppercase)</label>
                            <input value={newMsg.action} onChange={e => setNewMsg({ ...newMsg, action: e.target.value.toUpperCase() })}
                                placeholder="CODE"
                                className="w-full border-2 border-black p-2.5 rounded-lg bg-white font-black text-sm uppercase tracking-widest" />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-1">Résultat / Création</label>
                            <input value={newMsg.result} onChange={e => setNewMsg({ ...newMsg, result: e.target.value })}
                                placeholder="ton propre jeu vidéo"
                                className="w-full border-2 border-black p-2.5 rounded-lg bg-white font-medium text-sm" />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-1">Couleur du Verbe</label>
                            <select value={newMsg.color} onChange={e => setNewMsg({ ...newMsg, color: e.target.value })}
                                className="w-full border-2 border-black p-2.5 rounded-lg bg-white font-bold text-sm">
                                {colorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={handleAddMessage}
                        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl font-bold border-2 border-black hover:bg-gray-800 transition-colors">
                        <Plus size={16} /> Ajouter
                    </button>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button variant="primary" onClick={handleSaveDynamicMessages} className="shadow-none flex items-center gap-2"><Save size={16} /> Enregistrer les phrases</Button>
                </div>
            </div>

            {/* GALLERY MANAGER */}
            <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-8 mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <ImageIcon size={24} className="text-brand-blue" />
                    <h2 className="font-display font-bold text-2xl">Gestionnaire de Galerie</h2>
                </div>
                <p className="text-sm text-gray-500 font-medium mb-6 border-l-4 border-brand-blue pl-4">
                    Uploadez les photos de moments forts — elles apparaissent au bas de chaque page comme preuve sociale.
                </p>

                {/* Gallery Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {([
                        { key: 'gallery_general', label: '🌟 Général (Accueil)' },
                        { key: 'gallery_kids', label: '👧 Enfants & Familles' },
                        { key: 'gallery_schools', label: '🏫 Écoles' },
                        { key: 'gallery_programs', label: '📚 Programmes' }
                    ] as const).map(tab => (
                        <button key={tab.key} onClick={() => setActiveGallery(tab.key)}
                            className={`px-4 py-2 border-2 border-black font-bold text-sm rounded-xl transition-all ${activeGallery === tab.key ? 'bg-black text-white shadow-neo-sm' : 'bg-gray-50 hover:bg-gray-100'}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Caption + Upload */}
                <div className="flex gap-4 mb-6 p-4 bg-gray-50 border-2 border-black rounded-xl">
                    <input value={galleryCaption} onChange={e => setGalleryCaption(e.target.value)}
                        placeholder="Légende (optionnelle, ex: Workshop Robotique Apr 2025)"
                        className="flex-1 border-2 border-black p-2.5 rounded-lg bg-white font-medium text-sm" />
                    <label className="flex items-center gap-2 bg-brand-blue text-black border-2 border-black px-4 py-2.5 rounded-xl font-bold text-sm cursor-pointer hover:bg-cyan-300 transition-colors">
                        <Upload size={16} /> Uploader (multi)
                        <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                    </label>
                </div>

                {/* Current Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 min-h-[80px]">
                    {(galleryImages[activeGallery] || []).length === 0 ? (
                        <div className="col-span-full p-8 text-center text-gray-400 font-bold border-2 border-dashed border-gray-300 rounded-xl">
                            Aucune photo pour cette galerie. Uploadez des images ci-dessus.
                        </div>
                    ) : (
                        (galleryImages[activeGallery] || []).map((img, idx) => (
                            <div key={idx} className="relative group border-2 border-black rounded-xl overflow-hidden">
                                <img src={img.url} alt="" className="w-full h-28 object-cover" />
                                <input value={img.caption} onChange={e => handleUpdateCaption(idx, e.target.value)}
                                    placeholder="Légende..."
                                    className="w-full bg-black/70 text-white text-xs px-2 py-1 font-medium outline-none" />
                                <button onClick={() => handleDeleteGalleryImage(idx)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity border border-white">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-500">{(galleryImages[activeGallery] || []).length} photo(s)</span>
                    <Button variant="primary" onClick={handleSaveGallery} className="shadow-none flex items-center gap-2"><Save size={16} /> Enregistrer la galerie</Button>
                </div>
            </div>

            {/* KEY STATS */}
            <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-8 mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <BarChart2 size={24} className="text-brand-red" />
                    <h2 className="font-display font-bold text-2xl">Chiffres Clés (Stats)</h2>
                </div>
                <p className="text-sm text-gray-500 font-medium mb-6 border-l-4 border-brand-red pl-4">
                    Ces chiffres apparaissent en bannière sur les pages des parents, écoles et programmes.
                </p>
                <div className="space-y-3 mb-4">
                    {keyStats.map((stat, idx) => (
                        <div key={idx} className="grid grid-cols-10 gap-3 items-center p-3 border-2 border-black rounded-xl bg-gray-50">
                            <input value={stat.emoji} onChange={e => handleStatChange(idx, 'emoji', e.target.value)}
                                className="col-span-1 text-center border-2 border-black p-2 rounded-lg bg-white text-xl" maxLength={2} />
                            <input value={stat.value} onChange={e => handleStatChange(idx, 'value', e.target.value)}
                                placeholder="200+"
                                className="col-span-3 border-2 border-black p-2.5 rounded-lg bg-white font-black text-lg" />
                            <input value={stat.label} onChange={e => handleStatChange(idx, 'label', e.target.value)}
                                placeholder="Enfants formés"
                                className="col-span-5 border-2 border-black p-2.5 rounded-lg bg-white font-medium" />
                            <button onClick={() => handleDeleteStat(idx)}
                                className="col-span-1 flex items-center justify-center text-red-500 hover:text-red-700 border-2 border-red-300 rounded-lg p-2 hover:bg-red-50 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4">
                    <button onClick={handleAddStat}
                        className="flex items-center gap-2 border-2 border-black px-4 py-2 rounded-xl font-bold text-sm bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Plus size={16} /> Ajouter un chiffre
                    </button>
                    <Button variant="primary" onClick={handleSaveStats} className="shadow-none flex items-center gap-2"><Save size={16} /> Enregistrer les stats</Button>
                </div>
            </div>

            {/* ANNOUNCEMENT BAR */}
            <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-8 mb-8">
                <h2 className="font-display font-bold text-2xl mb-6">Barre d'Annonce Flash</h2>
                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl border-4 bg-gray-50 border-black">
                    <input type="checkbox" name="enabled" checked={announcementData.enabled} onChange={handleAnnouncementChange} className="w-6 h-6 border-4 border-black accent-brand-blue" />
                    <label className="font-black text-xl">Activer la barre flash sur le site</label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block font-bold mb-2">Message principal</label>
                        <input name="message" value={announcementData.message} onChange={handleAnnouncementChange} className="w-full border-4 border-black p-3 rounded-lg bg-gray-50 font-bold" />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Style d'animation</label>
                        <select name="animationStyle" value={announcementData.animationStyle} onChange={handleAnnouncementChange} className="w-full border-4 border-black p-3 rounded-lg bg-gray-50 font-bold">
                            <option value="none">Statique</option>
                            <option value="flash">Flash (Clignotant)</option>
                            <option value="slide">Slide (Défilement continu)</option>
                            <option value="pulse">Pulse (Rebondissant)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Texte du bouton (CTA)</label>
                        <input name="ctaText" value={announcementData.ctaText} onChange={handleAnnouncementChange} className="w-full border-4 border-black p-3 rounded-lg bg-gray-50 font-medium" />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Lien du bouton (ex: /programs/1)</label>
                        <input name="ctaLink" value={announcementData.ctaLink} onChange={handleAnnouncementChange} className="w-full border-4 border-black p-3 rounded-lg bg-gray-50 font-medium" />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block font-bold mb-2">Couleur Fond</label>
                            <input type="color" name="bgColor" value={announcementData.bgColor} onChange={handleAnnouncementChange} className="w-full h-12 border-4 border-black rounded-lg cursor-pointer" />
                        </div>
                        <div className="flex-1">
                            <label className="block font-bold mb-2">Couleur Texte</label>
                            <input type="color" name="textColor" value={announcementData.textColor} onChange={handleAnnouncementChange} className="w-full h-12 border-4 border-black rounded-lg cursor-pointer" />
                        </div>
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <Button variant="primary" onClick={handleSaveAnnouncement} className="shadow-none flex items-center gap-2"><Save size={16} /> Enregistrer la barre</Button>
                </div>
            </div>

            {/* HERO IMAGES */}
            <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-8 mb-8">
                <h2 className="font-display font-bold text-2xl mb-6">Images d'en-tête (Hero Sections)</h2>

                <h3 className="font-black text-lg mb-4 text-brand-blue">Page Accueil - Grille "Bento"</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {['home_bento_1', 'home_bento_2', 'home_bento_3'].map((field, idx) => (
                        <div key={field}>
                            <div className="font-bold mb-2 flex flex-col gap-2">Image Bento {idx + 1}
                                <input name={field} value={(heroData as any)[field] || ''} onChange={handleHeroChange} className="w-full border-4 border-black p-2 rounded-lg bg-gray-50 text-sm font-medium" placeholder="URL" />
                                <label className="text-xs bg-gray-200 px-3 py-2 rounded border-2 border-black cursor-pointer hover:bg-gray-300 flex items-center justify-center gap-2 font-bold uppercase transition-colors"><Upload size={14} /> Uploader</label>
                                <input type="file" accept="image/*" onChange={(e) => handleHeroImageUpload(field, e)} className="hidden" />
                                {(heroData as any)[field] && <img src={(heroData as any)[field]} alt="" className="w-full h-24 object-cover mt-2 border-2 border-black rounded" />}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t-4 border-black border-dashed my-8"></div>

                <h3 className="font-black text-lg mb-4 text-brand-green">Images de Fond (Hero Backgrounds)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { key: 'hero_bg_adultes', label: 'Page Enfants & Familles' },
                        { key: 'hero_bg_ecoles', label: 'Page Ecoles' },
                        { key: 'hero_bg_programs', label: 'Page Programmes' }
                    ].map((item) => (
                        <div key={item.key}>
                            <div className="font-bold mb-2 flex flex-col gap-2">{item.label}
                                <input name={item.key} value={(heroData as any)[item.key] || ''} onChange={handleHeroChange} className="w-full border-4 border-black p-2 rounded-lg bg-gray-50 text-sm font-medium" placeholder="URL" />
                                <label className="text-xs bg-gray-200 px-3 py-2 border-2 border-black rounded cursor-pointer hover:bg-gray-300 flex items-center justify-center gap-2 font-bold uppercase transition-colors"><Upload size={14} /> Uploader</label>
                                <input type="file" accept="image/*" onChange={(e) => handleHeroImageUpload(item.key, e)} className="hidden" />
                                {(heroData as any)[item.key] && <img src={(heroData as any)[item.key]} alt="" className="w-full h-16 object-cover mt-2 border-2 border-black rounded" />}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 flex justify-end">
                    <Button variant="primary" onClick={handleSaveHeroImages} className="shadow-none flex items-center gap-2"><Save size={16} /> Enregistrer images</Button>
                </div>
            </div>

            {/* VIDEO SECTION */}
            <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-8 mb-8">
                <h2 className="font-display font-bold text-2xl mb-6">Vidéo Principal (Accueil)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-bold mb-2">URL de la vidéo (MP4, Youtube embed...)</label>
                        <input name="videoSrc" value={videoData.videoSrc} onChange={handleVideoChange} className="w-full border-4 border-black p-3 rounded-lg bg-gray-50 font-medium" placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Titre</label>
                        <input name="title" value={videoData.title} onChange={handleVideoChange} className="w-full border-4 border-black p-3 rounded-lg bg-gray-50 font-bold" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block font-bold mb-2">Description courte</label>
                        <input name="description" value={videoData.description} onChange={handleVideoChange} className="w-full border-4 border-black p-3 rounded-lg bg-gray-50 font-medium" />
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <Button variant="primary" onClick={handleSaveVideo} className="shadow-none flex items-center gap-2"><Save size={16} /> Enregistrer vidéo</Button>
                </div>
            </div>

        </div>
    );
};



