import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const cursorPos = useRef({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const requestRef = useRef<number>(0);

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
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

        const animate = () => {
            // Smooth lerping (interpolation) for high performance
            const easing = 0.15;
            cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * easing;
            cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * easing;

            if (cursorRef.current) {
                cursorRef.current.style.setProperty('--mouse-x', `${cursorPos.current.x}px`);
                cursorRef.current.style.setProperty('--mouse-y', `${cursorPos.current.y}px`);
            }
            
            requestRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseover', onMouseOver);
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseover', onMouseOver);
            cancelAnimationFrame(requestRef.current);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div 
            ref={cursorRef}
            className="fixed inset-0 pointer-events-none z-[9999] hidden md:block"
            style={{ 
                mixBlendMode: 'difference',
                transform: 'translate3d(var(--mouse-x, 0), var(--mouse-y, 0), 0)'
            }}
        >
            {/* Main Crosshair */}
            <div 
                className="absolute flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ 
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
