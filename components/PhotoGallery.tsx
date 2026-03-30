

import React, { useState } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export interface GalleryImage {
    url: string;
    caption?: string;
}

interface PhotoGalleryProps {
    images: GalleryImage[];
    title?: string;
    subtitle?: string;
    bgDark?: boolean;
    speed?: number;
    large?: boolean; // New prop for massive images
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
    images,
    title = "Moments de Fierté",
    subtitle = "Des projets réels, des sourires vrais.",
    bgDark = false,
    speed = 40, // Slightly slower for better readability
    large = false,
}) => {
    const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

    if (!images || images.length === 0) return null;

    // Split images into two groups for double row effect
    const row1 = [...images.slice(0, Math.ceil(images.length / 2))];
    const row2 = [...images.slice(Math.ceil(images.length / 2))];

    // Triple the images for seamless loop
    const displayRow1 = [...row1, ...row1, ...row1];
    const displayRow2 = [...row2, ...row2, ...row2];

    const ImageItem = ({ img, i, isReverse = false }: { img: GalleryImage, i: number, isReverse?: boolean }) => {
        // Individual tilt for variety
        const rotation = (i % 2 === 0 ? '-1deg' : '1deg');
        
        return (
            <div
                key={`${i}-${img.url}`}
                onClick={() => setLightbox(img)}
                className={`
                    inline-block flex-shrink-0 cursor-pointer border-4 border-black shadow-neo 
                    hover:shadow-neo-xl hover:-translate-y-4 hover:rotate-0 hover:z-50 transition-all duration-300 
                    overflow-hidden group relative bg-gray-200
                    ${large ? 'w-[300px] md:w-[450px] h-[350px] md:h-[500px]' : 'w-64 md:w-80 h-48 md:h-60'}
                `}
                style={{ transform: `rotate(${rotation})` }}
            >
                <img
                    src={img.url}
                    alt={img.caption || ""}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                />
                
                {/* Hover Overlay - Enhanced */}
                <div className="absolute inset-0 bg-brand-red/90 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4 backdrop-blur-sm p-6 text-center">
                    <div className="bg-white text-black p-3 rounded-none border-4 border-black transform -translate-y-4 group-hover:translate-y-0 transition-transform">
                        <ZoomIn size={32} strokeWidth={3} />
                    </div>
                    {img.caption && (
                        <div className="bg-white text-black px-4 py-2 border-4 border-black transform translate-y-4 group-hover:translate-y-0 transition-transform font-display font-black uppercase text-sm md:text-lg tracking-widest shadow-neo-sm">
                            {img.caption}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <section className={`py-24 relative border-t-4 border-black overflow-hidden ${bgDark ? 'bg-brand-dark' : 'bg-white'}`}>
            {/* Background texture */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}
            />

            <div className="container mx-auto px-4 relative z-10 mb-16">
                {/* Header */}
                <div className="text-center">
                    <div className={`inline-flex items-center gap-2 px-5 py-1.5 border-4 border-black font-black text-sm uppercase tracking-widest mb-6 shadow-neo-sm rotate-[-1deg] ${bgDark ? 'bg-brand-orange text-black' : 'bg-black text-white'}`}>
                        <Camera size={18} strokeWidth={3} /> Galerie
                    </div>
                    <h2 className={`font-display font-black text-4xl md:text-7xl uppercase leading-tight tracking-tight mb-6 ${bgDark ? 'text-white' : 'text-black'}`}>
                        {title}
                    </h2>
                    <p className={`text-xl md:text-2xl font-bold max-w-3xl mx-auto ${bgDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* MULTI-ROW MARQUEE */}
            <div className="relative py-4 space-y-8">
                {/* Row 1: Moving Left */}
                <div className="flex animate-marquee-left hover:pause whitespace-nowrap gap-8 py-4 px-4 h-[400px] md:h-[550px]" style={{ height: large ? '550px' : '300px' }}>
                    {displayRow1.map((img, i) => ImageItem({ img, i }))}
                </div>

                {/* Row 2: Moving Right */}
                <div className="flex animate-marquee-right hover:pause whitespace-nowrap gap-8 py-4 px-4 h-[400px] md:h-[550px]" style={{ height: large ? '550px' : '300px' }}>
                    {displayRow2.map((img, i) => ImageItem({ img, i, isReverse: true }))}
                </div>

                {/* Side Fade Gradients */}
                <div className="absolute top-0 bottom-0 left-0 w-24 md:w-64 z-20 bg-gradient-to-r from-white to-transparent pointer-events-none" style={{ display: bgDark ? 'none' : 'block' }}></div>
                <div className="absolute top-0 bottom-0 right-0 w-24 md:w-64 z-20 bg-gradient-to-l from-white to-transparent pointer-events-none" style={{ display: bgDark ? 'none' : 'block' }}></div>
            </div>

            {/* Custom Styles for Animation */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marqueeLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-1 * (33.33%))); }
                }
                @keyframes marqueeRight {
                    0% { transform: translateX(calc(-1 * (33.33%))); }
                    100% { transform: translateX(0); }
                }
                .animate-marquee-left {
                    display: flex;
                    width: max-content;
                    animation: marqueeLeft ${speed}s linear infinite;
                }
                .animate-marquee-right {
                    display: flex;
                    width: max-content;
                    animation: marqueeRight ${speed}s linear infinite;
                }
                .pause:hover {
                    animation-play-state: paused;
                }
            `}} />

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
                    onClick={() => setLightbox(null)}
                >
                    <div
                        className="relative max-w-5xl w-full border-4 border-white shadow-[20px_20px_0px_0px_rgba(255,255,255,0.1)] animate-in zoom-in duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <img src={lightbox.url} alt={lightbox.caption || ''} className="w-full max-h-[85vh] object-contain bg-black" />
                        {lightbox.caption && (
                            <div className="bg-white text-black p-6 font-display font-black text-2xl uppercase tracking-widest border-t-4 border-black">
                                {lightbox.caption}
                            </div>
                        )}
                        <button
                            onClick={() => setLightbox(null)}
                            className="absolute -top-6 -right-6 bg-brand-red text-white border-4 border-black rounded-full p-3 hover:bg-red-500 hover:text-white transition-all shadow-neo hover:scale-110 active:scale-95"
                        >
                            <X size={28} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};
