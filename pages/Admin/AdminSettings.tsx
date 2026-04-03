import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Button } from '../../components/Button';
import { Save, Upload, Image as ImageIcon, BarChart3, Search } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import imageCompression from 'browser-image-compression';

export const AdminSettings: React.FC = () => {
    const { settings, updateSetting, isLoading } = useSettings();
    const [contactData, setContactData] = useState({
        email: 'hello@makerlab.ma',
        jobs_email: 'jobs@makerlab.ma',
        partners_email: 'partners@makerlab.ma',
        phone: '+212 6 00 00 00 00',
        address: 'Casablanca, Technopark',
        instagram: 'https://instagram.com/makerlab',
        linkedin: 'https://linkedin.com/company/makerlab',
        facebook: 'https://facebook.com/makerlab',
        twitter: 'https://twitter.com/makerlab'
    });
    const [chatbotData, setChatbotData] = useState({
        apiKey: '',
        knowledge: "Tu es 'MakerBot', l'assistant super cool de MakerLab Academy Casablanca. Nos ateliers durent 3h et coûtent 400 DHS. Sois enthousiaste et concis !"
    });
    const [socialImage, setSocialImage] = useState('');
    const [isUploadingSocialImage, setIsUploadingSocialImage] = useState(false);
    const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
    const [gscVerification, setGscVerification] = useState('');

    useEffect(() => {
        if (!isLoading && settings) {
            if (settings.contact_info) setContactData(settings.contact_info);
            if (settings.chatbot_config) setChatbotData(settings.chatbot_config);
            if (settings.socialImage) setSocialImage(settings.socialImage);
            if (settings.googleAnalyticsId) setGoogleAnalyticsId(settings.googleAnalyticsId);
            if (settings.gscVerification) setGscVerification(settings.gscVerification);
        }
    }, [settings, isLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContactData({ ...contactData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        await updateSetting('contact_info', contactData);
        await updateSetting('chatbot_config', chatbotData);
        if (socialImage) await updateSetting('socialImage', socialImage);
        if (googleAnalyticsId.trim()) await updateSetting('googleAnalyticsId', googleAnalyticsId.trim());
        if (gscVerification.trim()) await updateSetting('gscVerification', gscVerification.trim());
        alert('Configuration enregistrée!');
    };

    const handleSocialImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploadingSocialImage(true);
        try {
            const options = { maxSizeMB: 0.3, maxWidthOrHeight: 1200, useWebWorker: true };
            const compressedFile = await imageCompression(file, options);
            const storagePath = `website-programs-images/default-social_${Date.now()}_${file.name}`;
            const storageRef = ref(storage, storagePath);
            const snapshot = await uploadBytes(storageRef, compressedFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            setSocialImage(downloadURL);
        } catch (error: any) {
            console.error("❌ Firebase Upload Error (Default OG Image):", {
                code: error.code,
                message: error.message,
            });
            let userMessage = "Erreur lors de l'upload de l'image sociale par défaut.";
            if (error.code === 'storage/unauthorized') {
                userMessage += "\nPermissions refusées. Vos règles de sécurité bloquent le dossier.";
            } else {
                userMessage += `\nDétail: ${error.message}`;
            }
            alert(userMessage);
        } finally {
            setIsUploadingSocialImage(false);
        }
    };

    if (isLoading) return <div className="p-20 font-bold text-center">Chargement...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="font-display font-black text-4xl mb-8">Configuration Globale</h1>

            <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-8 mb-8">

                {/* ── Contact Info ── */}
                <h2 className="font-display font-bold text-2xl mb-6">Informations de Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-bold mb-2">Email de Contact</label>
                        <input name="email" value={contactData.email} onChange={handleChange} className="w-full border-4 border-black p-3 rounded-none font-bold shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Téléphone</label>
                        <input name="phone" value={contactData.phone} onChange={handleChange} className="w-full border-4 border-black p-3 rounded-none font-bold shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Email Recrutement (Jobs)</label>
                        <input name="jobs_email" value={contactData.jobs_email} onChange={handleChange} className="w-full border-4 border-black p-3 rounded-none font-bold shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Email Partenariats</label>
                        <input name="partners_email" value={contactData.partners_email} onChange={handleChange} className="w-full border-4 border-black p-3 rounded-none font-bold shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block font-bold mb-2">Adresse Physique</label>
                        <input name="address" value={contactData.address} onChange={handleChange} className="w-full border-4 border-black p-3 rounded-none font-bold shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all" />
                    </div>
                </div>

                <div className="border-t-4 border-black border-dashed my-8"></div>

                {/* ── Social Links ── */}
                <h2 className="font-display font-bold text-2xl mb-6">Réseaux Sociaux</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-bold mb-2">Instagram URL</label>
                        <input name="instagram" value={contactData.instagram} onChange={handleChange} className="w-full border-4 border-black p-3 rounded-none font-medium shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">LinkedIn URL</label>
                        <input name="linkedin" value={contactData.linkedin} onChange={handleChange} className="w-full border-4 border-black p-3 rounded-none font-medium shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Facebook URL</label>
                        <input name="facebook" value={contactData.facebook} onChange={handleChange} className="w-full border-4 border-black p-3 rounded-none font-medium shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Twitter URL</label>
                        <input name="twitter" value={contactData.twitter} onChange={handleChange} className="w-full border-4 border-black p-3 rounded-none font-medium shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all" />
                    </div>
                </div>

                <div className="border-t-4 border-black border-dashed my-8"></div>

                {/* ── Default OG Image ── */}
                <h2 className="font-display font-bold text-2xl mb-2">🌐 Image par Défaut (Réseaux Sociaux)</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Utilisée sur WhatsApp, Facebook, etc. quand aucune image spécifique n'est définie pour la page partagée (ex: page d'accueil).
                    Format idéal : <strong>1200 × 630 px (paysage)</strong>, moins de 300 KB.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                        <label className={`flex items-center justify-center gap-3 w-full p-5 border-4 border-dashed border-brand-orange rounded-2xl bg-brand-orange/5 hover:bg-brand-orange/10 cursor-pointer transition-colors ${isUploadingSocialImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <Upload size={24} className="text-brand-orange" />
                            <div>
                                <p className="font-black text-brand-orange">{isUploadingSocialImage ? 'Upload en cours...' : "Choisir une photo d'atelier"}</p>
                                <p className="text-xs text-gray-400 font-medium">Paysage · 1200×630 · JPG ou PNG</p>
                            </div>
                            <input type="file" accept="image/*" onChange={handleSocialImageUpload} disabled={isUploadingSocialImage} className="hidden" />
                        </label>
                        {socialImage && (
                            <button
                                type="button"
                                onClick={() => setSocialImage('')}
                                className="w-full text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 rounded-lg py-2 transition-colors"
                            >
                                🗑️ Supprimer l'image par défaut
                            </button>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">Aperçu WhatsApp ↓</p>
                        <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                            <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                                {socialImage ? (
                                    <img src={socialImage} className="w-full h-full object-cover" alt="Social Preview" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-300 gap-2 p-4">
                                        <ImageIcon size={40} />
                                        <span className="text-xs font-bold text-center">Aucune image — /logo-social.jpg utilisée</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 border-t border-gray-100">
                                <p className="text-[10px] text-gray-400 font-black uppercase">makerlab.ma</p>
                                <p className="text-sm font-bold text-gray-800 mt-0.5">MakerLab Academy — Coding · Robotique · IA</p>
                                <p className="text-xs text-gray-500 mt-0.5">Ateliers innovants pour préparer vos enfants au futur du numérique.</p>
                            </div>
                        </div>
                        {socialImage && <p className="text-[10px] text-brand-orange font-black mt-2">✅ Image personnalisée active</p>}
                    </div>
                </div>

                <div className="border-t-4 border-black border-dashed my-8"></div>

                {/* ── Chatbot Config ── */}
                <h2 className="font-display font-bold text-2xl mb-6">Configuration Chatbot AI</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block font-bold mb-2">Clé API Gemini</label>
                        <input
                            name="apiKey"
                            type="password"
                            value={chatbotData.apiKey}
                            onChange={(e) => setChatbotData({...chatbotData, apiKey: e.target.value})}
                            placeholder="AIzaSy..."
                            className="w-full border-4 border-black p-3 rounded-none font-mono shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-2">La clé API est stockée de manière sécurisée dans votre base de données.</p>
                    </div>
                    <div>
                        <label className="block font-bold mb-2">Base de Connaissances (Instructions Système)</label>
                        <textarea
                            name="knowledge"
                            value={chatbotData.knowledge}
                            onChange={(e) => setChatbotData({...chatbotData, knowledge: e.target.value})}
                            placeholder="Décrivez ici le rôle du bot, les services, les prix, etc."
                            className="w-full border-4 border-black p-3 rounded-none font-medium shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all min-h-[150px]"
                        />
                    </div>
                </div>

                <div className="border-t-4 border-black border-dashed my-8"></div>

                {/* ── SEO & Analytics ── */}
                <h2 className="font-display font-bold text-2xl mb-2 flex items-center gap-3">
                    <BarChart3 className="text-brand-blue" size={24} />
                    SEO &amp; Analytics
                </h2>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                    Ces outils permettent de mesurer le trafic et de vérifier la propriété de votre site auprès de Google.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Google Analytics 4 */}
                    <div className="p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <BarChart3 size={18} className="text-blue-600" />
                            <h3 className="font-black text-blue-800 text-sm uppercase tracking-wider">Google Analytics 4</h3>
                        </div>
                        <p className="text-xs text-blue-600 font-medium">
                            Trouvez votre ID dans <strong>GA4 → Admin → Flux de données → ID de mesure</strong>
                        </p>
                        <input
                            value={googleAnalyticsId}
                            onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                            className="w-full border-4 border-black p-3 rounded-none font-mono font-bold shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all bg-white"
                            placeholder="G-XXXXXXXXXX"
                        />
                        {googleAnalyticsId && (
                            <p className="text-[11px] text-green-600 font-black">✅ GA4 actif — ID enregistré</p>
                        )}
                        <p className="text-[10px] text-blue-400 font-medium">
                            Format : <code className="bg-blue-100 px-1 rounded">G-XXXXXXXXXX</code>
                        </p>
                    </div>

                    {/* Google Search Console */}
                    <div className="p-5 bg-green-50 border-2 border-green-200 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Search size={18} className="text-green-600" />
                            <h3 className="font-black text-green-800 text-sm uppercase tracking-wider">Google Search Console</h3>
                        </div>
                        <p className="text-xs text-green-600 font-medium">
                            Dans GSC → <strong>Ajouter une propriété → Balise HTML</strong>, copiez uniquement la valeur du <code>content</code>
                        </p>
                        <input
                            value={gscVerification}
                            onChange={(e) => setGscVerification(e.target.value)}
                            className="w-full border-4 border-black p-3 rounded-none font-mono font-bold shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all bg-white"
                            placeholder="abc123XYZ..."
                        />
                        {gscVerification && (
                            <p className="text-[11px] text-green-600 font-black">✅ Vérification GSC enregistrée</p>
                        )}
                        <p className="text-[10px] text-green-400 font-medium">
                            Exemple : <code className="bg-green-100 px-1 rounded">&lt;meta name="google-site-verification" content="<strong>CE CODE ICI</strong>"&gt;</code>
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button variant="primary" onClick={handleSave} className="shadow-none border-4 border-black flex items-center gap-2 uppercase tracking-widest font-black">
                        <Save size={16} /> Sauvegarder
                    </Button>
                </div>

            </div>
        </div>
    );
};
