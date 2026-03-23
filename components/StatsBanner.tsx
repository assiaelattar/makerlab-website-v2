
import React from 'react';
import { TrendingUp } from 'lucide-react';

export interface Stat {
    value: string;
    label: string;
    emoji?: string;
}

interface StatsBannerProps {
    stats: Stat[];
    variant?: 'dark' | 'yellow' | 'cyan';
}

const variantClasses = {
    dark: { bg: 'bg-brand-dark', text: 'text-white', subtext: 'text-gray-400', divider: 'border-white/20', badge: 'bg-brand-orange text-black' },
    yellow: { bg: 'bg-brand-red', text: 'text-white', subtext: 'text-gray-200', divider: 'border-black/20', badge: 'bg-black text-white' },
    cyan: { bg: 'bg-brand-blue', text: 'text-white', subtext: 'text-gray-100', divider: 'border-white/30', badge: 'bg-white text-black' },
};

export const StatsBanner: React.FC<StatsBannerProps> = ({ stats, variant = 'dark' }) => {
    if (!stats || stats.length === 0) return null;
    const v = variantClasses[variant];

    return (
        <section className={`${v.bg} border-y-4 border-black py-14 px-4 relative overflow-hidden`}>
            {/* Background diagonal pattern */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
            />
            <div className="container mx-auto relative z-10">
                {/* Label */}
                <div className="text-center mb-10">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 border-4 border-black font-black text-sm uppercase tracking-widest shadow-neo-sm ${v.badge}`}>
                        <TrendingUp size={16} strokeWidth={3} /> En chiffres
                    </div>
                </div>
                {/* Stats Row */}
                <div className={`flex flex-wrap justify-center divide-x-0 md:divide-x-4 ${v.divider}`}>
                    {stats.map((stat, i) => (
                        <div key={i} className="flex-1 min-w-[160px] text-center px-8 py-4">
                            {stat.emoji && (
                                <div className="text-4xl mb-2">{stat.emoji}</div>
                            )}
                            <div className={`font-display font-black text-5xl md:text-7xl leading-none drop-shadow-[3px_3px_0px_rgba(0,0,0,0.4)] ${v.text}`}>
                                {stat.value}
                            </div>
                            <div className={`mt-3 font-bold text-base md:text-lg uppercase tracking-widest ${v.subtext}`}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
