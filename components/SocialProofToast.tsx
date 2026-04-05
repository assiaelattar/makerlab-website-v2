import React, { useState, useEffect } from 'react';
import { Rocket, ShieldCheck, Heart } from 'lucide-react';

interface BookingNotification {
    id: number;
    name: string;
    mission: string;
    time: string;
    icon: React.ReactNode;
}

const SAMPLE_NOTIFICATIONS: BookingNotification[] = [
    { id: 1, name: "Yassine", mission: "Robotique Mission", time: "il y a 2 min", icon: <Rocket size={14} /> },
    { id: 2, name: "Sofia", mission: "Coding & IA", time: "il y a 15 min", icon: <ShieldCheck size={14} /> },
    { id: 3, name: "Omar", mission: "Design 3D", time: "il y a 1 heure", icon: <Heart size={14} /> },
];

export const SocialProofToast: React.FC = () => {
    const [current, setCurrent] = useState<BookingNotification | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showRandom = () => {
            const random = SAMPLE_NOTIFICATIONS[Math.floor(Math.random() * SAMPLE_NOTIFICATIONS.length)];
            setCurrent(random);
            setIsVisible(true);

            setTimeout(() => {
                setIsVisible(false);
            }, 5000); // Hide after 5s
        };

        const timer = setInterval(() => {
            if (!isVisible) showRandom();
        }, 12000); // Try every 12s

        // Show first one after 3s
        const initialTimer = setTimeout(showRandom, 3000);

        return () => {
            clearInterval(timer);
            clearTimeout(initialTimer);
        };
    }, [isVisible]);

    if (!current) return null;

    return (
        <div 
            className={`fixed bottom-6 left-6 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
        >
            <div className="bg-white border-4 border-black p-4 shadow-neo-sm flex items-center gap-3 max-w-[280px]">
                <div className="w-10 h-10 bg-brand-red text-white border-2 border-black flex items-center justify-center shrink-0 -rotate-3">
                    {current.icon}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">{current.time}</p>
                    <p className="text-sm font-black leading-tight">
                        <span className="text-brand-blue">{current.name}</span> vient de réserver <br />
                        <span className="uppercase text-[10px] bg-brand-green px-1">{current.mission}</span>
                    </p>
                </div>
                {/* Close dot */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-black rounded-full border-2 border-white" />
            </div>
        </div>
    );
};
