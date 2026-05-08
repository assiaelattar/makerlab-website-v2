import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Save, LayoutTemplate, Link as LinkIcon, Gift, Smartphone, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminReservationLP: React.FC = () => {
    const { settings, updateSetting } = useSettings();
    const [isSaving, setIsSaving] = useState(false);
    
    // Default values if nothing is in DB
    const [formData, setFormData] = useState({
        headline: "Réservez la place de {kidName}",
        subheadline: "Atelier {theme} – {slot} à Maarif",
        urgencyText: "⚠️ Il reste 4 places sur 10",
        priceBadge: "350 MAD",
        youtubeVideoId: "",
        cashPlusPhone: "06.21.87.71.06",
        whatsappPhone: "06.21.87.71.06",
        bonusTitle: "Bonus Inclus",
        bonusText: "Confirmez votre place et recevez le guide des 3 projets tech à faire à la maison avec vos enfants !",
        finalCtaHeader: "Dernières places ce weekend",
        finalCtaBody: "Une fois 10/10, nous fermons les inscriptions. Le prochain atelier \"{theme}\" ne sera programmé que dans 3 semaines."
    });

    useEffect(() => {
        if (settings.reservationLPSettings) {
            setFormData(prev => ({ ...prev, ...settings.reservationLPSettings }));
        }
    }, [settings.reservationLPSettings]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSetting('reservationLPSettings', formData);
            alert('Paramètres de la Landing Page sauvegardés !');
        } catch (error) {
            console.error(error);
            alert('Erreur lors de la sauvegarde.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display font-black text-4xl uppercase tracking-tight flex items-center gap-3">
                        <Smartphone className="text-brand-orange" size={36} /> Meta LP Editor
                    </h1>
                    <p className="text-gray-500 font-bold mt-2">Éditeur de la page de confirmation des leads Meta</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/reservation" target="_blank" className="p-3 bg-white border-4 border-black rounded-xl font-black uppercase text-sm shadow-[4px_4px_0_0_black] hover:translate-y-1 hover:translate-x-1 hover:shadow-none flex items-center gap-2 transition-all">
                        <LayoutTemplate size={18} /> Voir la page
                    </Link>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-3 bg-brand-green text-white font-black uppercase text-sm border-4 border-black rounded-xl shadow-[4px_4px_0_0_black] hover:translate-y-1 hover:translate-x-1 hover:shadow-none disabled:opacity-50 flex items-center gap-2 transition-all"
                    >
                        <Save size={18} /> {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
                    </button>
                </div>
            </div>

            <div className="bg-white border-4 border-black rounded-[2rem] p-8 shadow-[8px_8px_0_0_black] space-y-8">
                
                {/* Information Box */}
                <div className="bg-indigo-50 border-4 border-indigo-600 rounded-xl p-4 flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg border-2 border-indigo-600 shrink-0"><LinkIcon size={20} className="text-indigo-600" /></div>
                    <div>
                        <h3 className="font-black uppercase text-sm mb-1 text-indigo-900">Lien pour le formulaire Meta (Lead Form)</h3>
                        <p className="text-sm font-medium text-indigo-800 mb-2">Configurez la redirection de votre "Instant Form" vers cette URL :</p>
                        <code className="bg-white px-3 py-2 border-2 border-indigo-200 rounded block text-xs font-bold w-full overflow-x-auto text-indigo-700">
                            https://makerlab.ma/reservation?kid={`{`}{`{`}kid_name{`}`}{`}`}&slot={`{`}{`{`}slot{`}`}{`}`}&theme={`{`}{`{`}theme{`}`}{`}`}&from=form
                        </code>
                        <p className="text-xs font-bold text-indigo-600 mt-2 italic">Note: Vous pouvez utiliser les tags {'{kidName}'}, {'{theme}'}, et {'{slot}'} dans les champs ci-dessous.</p>
                    </div>
                </div>

                {/* Section Hero */}
                <div className="space-y-4">
                    <h2 className="font-black text-xl uppercase border-b-4 border-black pb-2">1. Section Hero (Haut de page)</h2>
                    
                    {/* YouTube Video */}
                    <div className="bg-red-50 border-4 border-red-500 rounded-xl p-4">
                        <label className="flex items-center gap-2 text-xs font-black uppercase mb-3 text-red-700">
                            <Youtube size={16} /> Vidéo YouTube (Hero — ID ou URL complète)
                        </label>
                        <input 
                            type="text"
                            value={formData.youtubeVideoId}
                            onChange={e => {
                                // Accept full YouTube URL or just the ID
                                const raw = e.target.value.trim();
                                const match = raw.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
                                setFormData({...formData, youtubeVideoId: match ? match[1] : raw});
                            }}
                            placeholder="Ex: dQw4w9WgXcQ  ou  https://www.youtube.com/watch?v=..."
                            className="w-full p-4 bg-white border-4 border-red-400 rounded-xl font-bold font-mono text-sm"
                        />
                        {formData.youtubeVideoId && (
                            <div className="mt-3 rounded-xl overflow-hidden border-2 border-red-300" style={{paddingBottom:'40%',position:'relative',height:0}}>
                                <iframe
                                    src={`https://www.youtube.com/embed/${formData.youtubeVideoId}?autoplay=0&controls=1`}
                                    title="Aperçu vidéo"
                                    style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}}
                                    allowFullScreen
                                />
                            </div>
                        )}
                        <p className="text-[10px] font-bold text-red-500 mt-2 italic">La vidéo sera affichée en autoplay sans contrôles sur la landing page publique.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase mb-2">Titre Principal</label>
                        <input 
                            type="text" 
                            value={formData.headline} 
                            onChange={e => setFormData({...formData, headline: e.target.value})}
                            className="w-full p-4 bg-gray-50 border-4 border-black rounded-xl font-bold"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-black uppercase mb-2">Sous-titre (Lieu et créneau)</label>
                        <input 
                            type="text" 
                            value={formData.subheadline} 
                            onChange={e => setFormData({...formData, subheadline: e.target.value})}
                            className="w-full p-4 bg-gray-50 border-4 border-black rounded-xl font-bold"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase mb-2">Texte d'Urgence</label>
                            <input 
                                type="text" 
                                value={formData.urgencyText} 
                                onChange={e => setFormData({...formData, urgencyText: e.target.value})}
                                className="w-full p-4 bg-gray-50 border-4 border-black rounded-xl font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase mb-2">Badge Prix</label>
                            <input 
                                type="text" 
                                value={formData.priceBadge} 
                                onChange={e => setFormData({...formData, priceBadge: e.target.value})}
                                className="w-full p-4 bg-gray-50 border-4 border-black rounded-xl font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Section Bonus */}
                <div className="space-y-4">
                    <h2 className="font-black text-xl uppercase border-b-4 border-brand-orange pb-2 text-brand-orange flex items-center gap-2">
                        <Gift size={24} strokeWidth={3} /> 2. Section Bonus Exclusif
                    </h2>
                    
                    <div>
                        <label className="block text-xs font-black uppercase mb-2">Titre du Bonus</label>
                        <input 
                            type="text" 
                            value={formData.bonusTitle} 
                            onChange={e => setFormData({...formData, bonusTitle: e.target.value})}
                            className="w-full p-4 bg-gray-50 border-4 border-brand-orange rounded-xl font-bold"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-black uppercase mb-2">Description du Bonus</label>
                        <textarea 
                            value={formData.bonusText} 
                            onChange={e => setFormData({...formData, bonusText: e.target.value})}
                            className="w-full p-4 bg-gray-50 border-4 border-brand-orange rounded-xl font-bold min-h-[100px]"
                        />
                    </div>
                </div>

                {/* Section Contact / WhatsApp */}
                <div className="space-y-4">
                    <h2 className="font-black text-xl uppercase border-b-4 border-black pb-2">3. Numéros de contact</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase mb-2">Numéro Cash Plus (Affiché)</label>
                            <input 
                                type="text" 
                                value={formData.cashPlusPhone} 
                                onChange={e => setFormData({...formData, cashPlusPhone: e.target.value})}
                                className="w-full p-4 bg-gray-50 border-4 border-black rounded-xl font-bold"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase mb-2">Numéro WhatsApp (Clic)</label>
                            <input 
                                type="text" 
                                value={formData.whatsappPhone} 
                                onChange={e => setFormData({...formData, whatsappPhone: e.target.value})}
                                className="w-full p-4 bg-gray-50 border-4 border-black rounded-xl font-bold"
                            />
                        </div>
                    </div>
                </div>

                {/* Section Footer / Urgence finale */}
                <div className="space-y-4">
                    <h2 className="font-black text-xl uppercase border-b-4 border-brand-red pb-2 text-brand-red">4. Call to Action Final (Bas de page)</h2>
                    
                    <div>
                        <label className="block text-xs font-black uppercase mb-2">Titre d'Urgence Final</label>
                        <input 
                            type="text" 
                            value={formData.finalCtaHeader} 
                            onChange={e => setFormData({...formData, finalCtaHeader: e.target.value})}
                            className="w-full p-4 bg-gray-50 border-4 border-brand-red rounded-xl font-bold"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-black uppercase mb-2">Texte Explicatif Final</label>
                        <textarea 
                            value={formData.finalCtaBody} 
                            onChange={e => setFormData({...formData, finalCtaBody: e.target.value})}
                            className="w-full p-4 bg-gray-50 border-4 border-brand-red rounded-xl font-bold min-h-[100px]"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};
