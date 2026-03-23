import React, { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Button } from '../../components/Button';
import { Save } from 'lucide-react';

export const AdminSettings: React.FC = () => {
    const { settings, updateSetting, isLoading } = useSettings();
    const [contactData, setContactData] = useState({
        email: 'hello@makerlab.ma',
        phone: '+212 6 00 00 00 00',
        address: 'Casablanca, Technopark',
        instagram: 'https://instagram.com/makerlab',
        linkedin: 'https://linkedin.com/company/makerlab'
    });
    const [chatbotData, setChatbotData] = useState({
        apiKey: '',
        knowledge: "Tu es 'GoBot', l'assistant super cool de Make & Go Casablanca. Tes ateliers durent 3h et coûtent 400 DHS. Sois enthousiaste et concis !"
    });

    useEffect(() => {
        if (!isLoading && settings) {
            if (settings.contact_info) setContactData(settings.contact_info);
            if (settings.chatbot_config) setChatbotData(settings.chatbot_config);
        }
    }, [settings, isLoading]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContactData({ ...contactData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        await updateSetting('contact_info', contactData);
        await updateSetting('chatbot_config', chatbotData);
        alert('Configuration enregistrée!');
    };

    if (isLoading) return <div className="p-20 font-bold text-center">Chargement...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="font-display font-black text-4xl mb-8">Configuration Globale</h1>

            <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mb-8">
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
                    <div className="md:col-span-2">
                        <label className="block font-bold mb-2">Adresse Physique</label>
                        <input name="address" value={contactData.address} onChange={handleChange} className="w-full border-4 border-black p-3 rounded-none font-bold shadow-neo-sm focus:translate-x-1 focus:translate-y-1 outline-none transition-all" />
                    </div>
                </div>

                <div className="border-t-4 border-black border-dashed my-8"></div>

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
                </div>
                
                <div className="border-t-4 border-black border-dashed my-8"></div>

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

                <div className="mt-8 flex justify-end">
                    <Button variant="primary" onClick={handleSave} className="shadow-none border-4 border-black flex items-center gap-2 uppercase tracking-widest font-black">
                        <Save size={16} /> Sauvegarder
                    </Button>
                </div>
            </div>
        </div>
    );
};
