import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { ArrowRight, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar: React.FC = () => {
    const { settings, isLoading } = useSettings();
    const config = settings?.announcement_bar;

    if (isLoading || !config || !config.enabled) return null;

    let animationClass = '';
    if (config.animationStyle === 'flash') animationClass = 'animate-pulse';
    else if (config.animationStyle === 'slide') animationClass = 'animate-marquee';
    else if (config.animationStyle === 'pulse') animationClass = 'animate-bounce';

    const renderContent = () => (
        <div className={`flex items-center justify-center gap-2 md:gap-4 whitespace-nowrap px-4 ${animationClass !== 'animate-marquee' ? animationClass : ''}`}>
            {config.animationStyle !== 'slide' && <Info size={16} className="hidden md:block" />}
            <span className="font-bold uppercase tracking-wider text-xs md:text-sm">{config.message}</span>
            {config.ctaText && config.ctaLink && (
                <Link
                    to={config.ctaLink}
                    className="flex items-center gap-1 rounded-full border border-current/15 bg-white/20 px-3 py-1 text-[10px] transition-colors hover:bg-white/30 md:text-xs"
                >
                    {config.ctaText} <ArrowRight size={12} />
                </Link>
            )}
        </div>
    );

    return (
        <div
            className="relative z-[200] flex w-full items-center overflow-hidden border-b border-black/10"
            style={{ 
                backgroundColor: config.bgColor || '#00E5FF', 
                color: config.textColor || '#000000',
                minHeight: '32px'
            }}
        >
            {config.animationStyle === 'slide' ? (
                <div className="animate-marquee flex gap-12 items-center min-w-max py-1.5">
                    {renderContent()}
                    {renderContent()}
                    {renderContent()}
                    {renderContent()}
                </div>
            ) : (
                <div className="w-full flex justify-center py-1.5 md:py-2">
                    {renderContent()}
                </div>
            )}
        </div>
    );
};
