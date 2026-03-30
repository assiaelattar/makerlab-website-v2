
import React, { useState, useEffect } from 'react';

interface Props {
    images: string[] | string | undefined;
    interval?: number;
    className?: string;
    alt?: string;
}

export const LoopingBentoImage: React.FC<Props> = ({ images, interval = 3000, className = "", alt = "MakerLab Activity" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Normalize images to an array
    const imageList = Array.isArray(images) 
        ? images.filter(img => typeof img === 'string' && img.trim() !== '') 
        : (typeof images === 'string' && images.trim() !== '' ? [images] : []);

    useEffect(() => {
        if (imageList.length <= 1) return;

        const timer = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % imageList.length);
                setIsTransitioning(false);
            }, 600); // Wait for fade out
        }, interval);

        return () => clearInterval(timer);
    }, [imageList.length, interval]);

    if (imageList.length === 0) {
        return (
            <div className={`w-full h-full bg-gray-200 flex items-center justify-center ${className}`}>
                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">No Image</span>
            </div>
        );
    }

    if (imageList.length === 1) {
        return <img src={imageList[0]} alt={alt} className={`w-full h-full object-cover ${className}`} />;
    }

    return (
        <div className={`relative w-full h-full overflow-hidden ${className}`}>
            {/* Current Image */}
            <img 
                src={imageList[currentIndex]} 
                alt={alt} 
                className={`w-full h-full object-cover transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'}`} 
            />
            
            {/* Next Image (Preload Background) */}
            <div className="absolute inset-0 -z-10 bg-black">
                <img 
                    src={imageList[(currentIndex + 1) % imageList.length]} 
                    alt="" 
                    className="w-full h-full object-cover opacity-30" 
                />
            </div>
        </div>
    );
};
