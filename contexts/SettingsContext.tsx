import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface SettingsContextType {
    settings: Record<string, any>;
    updateSetting: (key: string, value: any) => Promise<void>;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'website-settings'));
                const data: Record<string, any> = {};

                querySnapshot.forEach(document => {
                    data[document.id] = document.data().value;
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
