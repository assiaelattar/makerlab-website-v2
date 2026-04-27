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
                    className="bg-black/10 hover:bg-black/20 px-3 py-1 rounded-full text-[10px] md:text-xs flex items-center gap-1 transition-colors border border-black/20 backdrop-blur-sm"
                >
                    {config.ctaText} <ArrowRight size={12} />
                </Link>
            )}
        </div>
    );

    return (
        <div
            className="w-full py-1 md:py-2 border-b-4 border-black relative z-[200] flex items-center overflow-hidden h-8 md:h-12"
            style={{ backgroundColor: config.bgColor || '#00E5FF', color: config.textColor || '#000000' }}
        >
            {config.animationStyle === 'slide' ? (
                <div className="animate-marquee flex gap-12 items-center min-w-max">
                    {renderContent()}
                    {renderContent()}
                    {renderContent()}
                    {renderContent()}
                </div>
            ) : (
                <div className="w-full flex justify-center">
                    {renderContent()}
                </div>
            )}
        </div>
    );
};
