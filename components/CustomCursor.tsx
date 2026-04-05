import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName === 'BUTTON' || 
                target.tagName === 'A' || 
                target.closest('button') || 
                target.closest('a') ||
                target.dataset.cursor === 'hover'
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div 
            className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
            style={{ mixBlendMode: 'difference' }}
        >
            {/* Main Crosshair */}
            <div 
                className="absolute transition-transform duration-100 ease-out flex items-center justify-center"
                style={{ 
                    left: `${position.x}px`, 
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`
                }}
            >
                {/* Vertical Line */}
                <div className={`w-0.5 ${isHovering ? 'h-8' : 'h-6'} bg-white transition-all`} />
                {/* Horizontal Line */}
                <div className={`h-0.5 ${isHovering ? 'w-8' : 'w-6'} bg-white absolute transition-all`} />
                
                {/* Central Dot */}
                <div className="w-1 h-1 bg-brand-orange rounded-full absolute" />
                
                {/* Corner Accents */}
                <div className={`absolute border-2 border-white transition-all duration-300 ${isHovering ? 'w-12 h-12 opacity-100 rotate-45' : 'w-8 h-8 opacity-0 rotate-0'}`} />
            </div>
        </div>
    );
};
