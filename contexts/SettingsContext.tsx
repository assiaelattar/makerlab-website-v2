import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface SettingsContextType {
    settings: Record<string, any>;
    updateSetting: (key: string, value: any) => Promise<void>;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const PUBLIC_SETTING_KEYS = [
    'announcement_bar',
    'blogs',
    'chatbot_knowledge',
    'contact_info',
    'gallery_general',
    'gallery_kids',
    'gallery_programs',
    'hero_dynamic_messages',
    'hero_images',
    'homeSeo',
    'home_video',
    'key_stats',
    'page_content',
    'reservationLPSettings',
    'reservationLPWeekends',
    'socialImage',
    'socialProofConfig',
    'googleAnalyticsId',
    'gscVerification',
];

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data: Record<string, any> = {};
                const documents = await Promise.all(PUBLIC_SETTING_KEYS.map(async key => ({ key, snapshot: await getDoc(doc(db, 'website-settings', key)) })));
                documents.forEach(({ key, snapshot }) => {
                    if (snapshot.exists()) data[key] = snapshot.data().value;
                });

                if (Object.keys(data).length > 0) {
                    setSettings(data);
                }
            } catch (error) {
                console.warn("⚠️ Failed to load settings from Firebase. Using defaults.", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const updateSetting = async (key: string, value: any) => {
        // Optimistic UI update
        setSettings(prev => ({ ...prev, [key]: value }));

        try {
            // Save the setting as its own document where doc.id is the key
            await setDoc(doc(db, 'website-settings', key), { value }, { merge: true });
        } catch (e) {
            console.error("Failed to update setting in DB", e);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
