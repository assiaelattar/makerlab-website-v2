import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
    const { pathname } = useLocation();
    const [current, setCurrent] = useState<BookingNotification | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const isQuietRoute = pathname === '/' || pathname.startsWith('/programs') || pathname.startsWith('/booking/');

    const config = settings.socialProofConfig || { enabled: true, frequency_seconds: 45, max_age_days: 2 };

    useEffect(() => {
        if (!config.enabled || isQuietRoute) {
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
    }, [isVisible, config.enabled, config.frequency_seconds, config.max_age_days, isQuietRoute]);

    if (!current || !config.enabled || isQuietRoute) return null;

    return (
        <div 
            className={`
                hidden md:block
                fixed z-[600] bottom-8 left-8 transition-all duration-500 transform
                ${isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-4 opacity-0 pointer-events-none'
                }
            `}
        >
            <div className="ml-card relative flex max-w-[320px] items-center gap-3 p-4 shadow-xl">
                <div className="ml-icon h-10 w-10 shrink-0 bg-brand-blue text-white">
                    {current.icon}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">{current.timeLabel}</p>
                    <p className="text-sm font-black leading-tight text-black">
                        <span className="text-brand-blue">{current.name}</span> vient de réserver <br />
                        <span className="rounded-md bg-brand-orange/10 px-1.5 py-0.5 text-[9px] uppercase text-brand-orange">{current.mission}</span>
                    </p>
                </div>
                <div className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full border-2 border-white bg-brand-green" />
            </div>
        </div>
    );
};
