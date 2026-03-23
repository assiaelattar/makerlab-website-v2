import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Props {
    videoSrc: string;
    poster?: string;
    title?: string;
    description?: string;
    theme?: 'yellow' | 'cyan' | 'pink' | 'purple' | 'green';
}

export const VideoSection: React.FC<Props> = ({
    videoSrc,
    poster,
    title,
    description,
    theme = 'cyan'
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const themeColors = {
        orange: 'bg-brand-orange text-black',
        blue: 'bg-brand-blue text-black',
        green: 'bg-brand-green text-white',
        red: 'bg-brand-red text-white',
    };

    const isYouTube = videoSrc && (videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be'));
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const youtubeId = isYouTube ? getYouTubeId(videoSrc) : null;

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className={`relative w-full rounded-[2rem] border-4 border-black shadow-neo overflow-hidden group ${themeColors[theme]} transition-all duration-300 hover:shadow-neo-xl`}>
            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-black/20 z-10"></div>
            <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-black/20 z-10"></div>

            <div className={`relative aspect-video bg-black ${!youtubeId ? 'cursor-pointer' : ''}`} onClick={!youtubeId ? togglePlay : undefined}>
                {youtubeId ? (
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                        title={title || "YouTube video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            src={videoSrc}
                            poster={poster}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                            loop
                            playsInline
                            muted={isMuted}
                            onClick={togglePlay}
                        />

                        {/* Play overlay if paused */}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all duration-300">
                                <div className="w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-neo transform group-hover:scale-110 transition-transform">
                                    <Play size={36} fill="black" className="text-black ml-2" />
                                </div>
                            </div>
                        )}

                        {/* Controls Overlay */}
                        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                                className="p-3 bg-white border-2 border-black rounded-full shadow-neo text-black hover:bg-gray-100 active:translate-y-1 active:shadow-none transition-all"
                            >
                                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                        </div>
                    </>
                )}
            </div>

            {(title || description) && (
                <div className="p-6 md:p-8 border-t-4 border-black relative">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>

                    <div className="relative z-10">
                        {title && <h3 className="font-display font-black text-2xl md:text-3xl mb-2 uppercase tracking-tight">{title}</h3>}
                        {description && <p className="font-bold text-lg opacity-90">{description}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};
