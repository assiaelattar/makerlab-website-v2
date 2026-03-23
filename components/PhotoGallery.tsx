
import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

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
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
    images,
    title = "Moments de Fierté",
    subtitle = "Des projets réels, des sourires vrais.",
    bgDark = false,
    speed = 30, // seconds for one full loop
}) => {
    const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!images || images.length === 0) return null;

    // Duplicate images for seamless loop
    const displayImages = [...images, ...images, ...images];

    return (
        <section className={`py-20 relative border-t-4 border-black overflow-hidden ${bgDark ? 'bg-brand-dark' : 'bg-gray-50'}`}>
            {/* Background texture */}
            <div
                className={`absolute inset-0 opacity-5 pointer-events-none`}
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            <div className="container mx-auto px-4 relative z-10 mb-12 text-center md:text-left">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className={`inline-block px-5 py-1.5 border-4 border-black font-black text-sm uppercase tracking-widest mb-4 shadow-neo-sm rotate-[-1deg] ${bgDark ? 'bg-brand-orange text-black' : 'bg-black text-white'}`}>
                            📸 Galerie
                        </div>
                        <h2 className={`font-display font-black text-4xl md:text-6xl uppercase leading-tight drop-shadow-[3px_3px_0px_rgba(0,0,0,0.3)] ${bgDark ? 'text-white' : 'text-black'}`}>
                            {title}
                        </h2>
                        <p className={`text-lg md:text-xl font-bold mt-4 ${bgDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {subtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* INFINITE SCROLL MARQUEE */}
            <div className="relative mt-8 py-4 bg-black/5">
                <div className="absolute top-0 bottom-0 left-0 w-20 md:w-40 z-20 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none hidden md:block" style={{ display: bgDark ? 'none' : 'block' }}></div>
                <div className="absolute top-0 bottom-0 right-0 w-20 md:w-40 z-20 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none hidden md:block" style={{ display: bgDark ? 'none' : 'block' }}></div>

                <div className="flex animate-marquee hover:pause whitespace-nowrap gap-6 py-4">
                    {displayImages.map((img, i) => (
                        <div
                            key={`${i}-${img.url}`}
                            onClick={() => setLightbox(img)}
                            className="inline-block w-64 md:w-80 h-48 md:h-60 flex-shrink-0 border-4 border-black shadow-neo cursor-pointer hover:shadow-neo-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group relative"
                        >
                            <img
                                src={img.url}
                                alt={img.caption || ""}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                                <ZoomIn size={32} className="text-white" strokeWidth={2.5} />
                                {img.caption && (
                                    <span className="text-white text-xs font-bold text-center px-4 whitespace-normal uppercase tracking-wider">{img.caption}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Custom Styles for Animation */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-1 * (33.33%))); }
                }
                .animate-marquee {
                    display: flex;
                    width: max-content;
                    animation: marquee ${speed}s linear infinite;
                }
                .pause:hover {
                    animation-play-state: paused;
                }
                /* Use a second animation for small screens if needed, but max-content + translateX(calc) is robust */
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

            {/* Horizontal scroll handle for touch */}
            <div className="container mx-auto px-4 mt-8 flex justify-center md:hidden">
                <div className="bg-black/10 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <ChevronLeft size={14} /> Swiper pour voir plus <ChevronRight size={14} />
                </div>
            </div>
        </section>
    );
};
