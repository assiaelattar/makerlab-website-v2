import React, { useState, useEffect } from 'react';
import { Rocket, ShieldCheck, Heart } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface BookingNotification {
    id: number;
    name: string;
    mission: string;
    timeLabel?: string;
    icon: React.ReactNode;
}

const SAMPLE_NOTIFICATIONS: Omit<BookingNotification, 'timeLabel'>[] = [
    { id: 1, name: "Yassine", mission: "Robotique Mission", icon: <Rocket size={14} /> },
    { id: 2, name: "Sofia", mission: "Coding & IA", icon: <ShieldCheck size={14} /> },
    { id: 3, name: "Omar", mission: "Design 3D", icon: <Heart size={14} /> },
    { id: 4, name: "Amine", mission: "Maker Odyssey", icon: <Rocket size={14} /> },
    { id: 5, name: "Inès", mission: "Electronics Lab", icon: <ShieldCheck size={14} /> },
];

export const SocialProofToast: React.FC = () => {
    const { settings } = useSettings();
    const [current, setCurrent] = useState<BookingNotification | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const config = settings.socialProofConfig || { enabled: true, frequency_seconds: 45, max_age_days: 2 };

    useEffect(() => {
        if (!config.enabled) {
            setIsVisible(false);
            return;
        }

        const generateTimeLabel = () => {
             const maxDays = config.max_age_days || 2;
             const rand = Math.random();
             if (rand > 0.7) return `il y a ${Math.floor(Math.random() * 23) + 1} heures`;
             if (rand > 0.4) return `il y a ${Math.floor(Math.random() * maxDays) + 1} jours`;
             return `il y a ${Math.floor(Math.random() * 45) + 5} min`;
        };

        const showRandom = () => {
            const base = SAMPLE_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_NOTIFICATIONS.length)];
            setCurrent({ ...base, timeLabel: generateTimeLabel() });
            setIsVisible(true);

            setTimeout(() => {
                setIsVisible(false);
            }, 6000); // UI duration
        };

        const intervalMs = (config.frequency_seconds || 45) * 1000;
        const timer = setInterval(() => {
            if (!isVisible && config.enabled) showRandom();
        }, intervalMs);

        const initialTimer = setTimeout(() => {
            if (config.enabled) showRandom();
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(initialTimer);
        };
    }, [isVisible, config.enabled, config.frequency_seconds, config.max_age_days]);

    if (!current || !config.enabled) return null;

    return (
        <div 
            className={`
                fixed z-[600] transition-all duration-500 transform
                /* Desktop: Bottom-Left */
                md:bottom-8 md:left-8 md:translate-x-0 md:w-auto
                /* Mobile: Above the chat button, bottom-right area */
                bottom-[88px] left-3 right-3
                ${isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-4 opacity-0 pointer-events-none'
                }
            `}
        >
        <div className="hidden md:block bg-white border-4 border-black p-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex items-center gap-3 max-w-sm md:max-w-[300px] relative">
                <div className="w-10 h-10 bg-brand-red text-white border-2 border-black flex items-center justify-center shrink-0 -rotate-3 shadow-neo-sm">
                    {current.icon}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">{current.timeLabel}</p>
                    <p className="text-sm font-black leading-tight text-black">
                        <span className="text-brand-blue">{current.name}</span> vient de réserver <br />
                        <span className="uppercase text-[9px] bg-brand-orange/20 px-1 border-b border-brand-orange">{current.mission}</span>
                    </p>
                </div>
                {/* Visual anchor dots */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-brand-green rounded-full border-2 border-black hidden md:block" />
            </div>
        </div>
    );
};
