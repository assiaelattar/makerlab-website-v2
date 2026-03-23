import React, { useState, useRef } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { AiImage } from './AiImage';

export interface ProjectData {
    id: string;
    title: string;
    author: string;
    age: number;
    image: string;
    category: string;
    description: string;
}

interface TiltCardProps {
    project: ProjectData;
    colorTheme: { bg: string, text: string, border: string };
}

const TiltCard: React.FC<TiltCardProps> = ({ project, colorTheme }) => {
    const [transform, setTransform] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation based on cursor position relative to center
        const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg
        const rotateY = ((x - centerX) / centerX) * 15;

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    };

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{
                transform,
                transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out'
            }}
            className={`min-w-[300px] md:min-w-[400px] shrink-0 h-full snap-center cursor-pointer`}
        >
            <div className={`${colorTheme.bg} ${colorTheme.text} rounded-2xl border-4 ${colorTheme.border} shadow-neo h-full flex flex-col relative overflow-hidden group`}>
                {/* Parallax Image Header */}
                <div className="h-48 md:h-64 overflow-hidden border-b-4 border-black relative bg-black">
                    <div
                        className="w-full h-full transition-transform duration-300"
                        style={{
                            transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                            transformOrigin: 'center center'
                        }}
                    >
                        <AiImage
                            src={project.image}
                            prompt={project.title}
                            alt={project.title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                    </div>

                    <div className="absolute top-4 right-4 bg-white px-3 py-1 border-2 border-black rounded-none shadow-neo-sm font-bold text-xs uppercase tracking-wider text-black transform rotate-2">
                        {project.category}
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex flex-col flex-grow relative bg-white transition-colors duration-300">
                    {/* Author Badge overlapping image and content */}
                    <div className="absolute -top-6 left-6 flex items-center gap-3 bg-black text-white px-4 py-2 border-2 border-white shadow-neo z-10 transform -rotate-2">
                        <span className="font-display font-bold text-sm tracking-wide">{project.author}, {project.age} ans</span>
                    </div>

                    <h3 className="font-display font-black text-2xl mt-4 mb-2 text-black leading-tight uppercase line-clamp-2">
                        {project.title}
                    </h3>
                    <p className="text-gray-700 font-bold text-sm mb-6 line-clamp-3">
                        {project.description}
                    </p>

                    <div className="mt-auto flex justify-between items-center text-black">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-brand-orange text-black" strokeWidth={3} />)}
                        </div>
                        <div className="bg-brand-orange w-10 h-10 border-2 border-black rounded-full flex items-center justify-center transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform shadow-neo-sm">
                            <ArrowRight size={20} strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface GalleryProps {
    title?: string;
    subtitle?: string;
    projects?: ProjectData[];
}

// Sample fallback projects
const defaultProjects: ProjectData[] = [
    {
        id: '1',
        title: 'Bras Robotique Code en Python',
        author: 'Ayoub',
        age: 14,
        category: 'Robotique',
        description: 'Ayoub a construit un bras robotique piloté par intelligence artificielle pour trier des objets par couleur.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'Jeu VR: Mission Mars',
        author: 'Lina',
        age: 12,
        category: 'Jeu Vidéo',
        description: 'Une expérience en réalité virtuelle où le joueur doit réparer une station spatiale sur Mars. Créé avec Unity.',
        image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'Drone de Surveillance',
        author: 'Sami',
        age: 15,
        category: 'Drone',
        description: 'Assemblage de A à Z d\'un drone FPV avec caméra embarquée et programmation des contrôleurs de vol.',
        image: 'https://images.unsplash.com/photo-1524143986875-3b098d78b363?q=80&w=800&auto=format&fit=crop'
    },
    {
        id: '4',
        title: 'App Anti-Gaspillage',
        author: 'Kenza',
        age: 16,
        category: 'Application',
        description: 'Une application mobile connectant les boulangeries locales aux habitants pour réduire le gaspillage alimentaire.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
    }
];

export const ParallaxGallery: React.FC<GalleryProps> = ({
    title = "Les Projets de nos Makers",
    subtitle = "Regarde ce qu'ils ont accompli en un seul week-end",
    projects = defaultProjects
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const colors = [
        { bg: 'bg-brand-green', text: 'text-black', border: 'border-black' },
        { bg: 'bg-brand-blue', text: 'text-black', border: 'border-black' },
        { bg: 'bg-brand-red', text: 'text-white', border: 'border-black' },
        { bg: 'bg-brand-red', text: 'text-black', border: 'border-black' },
    ];

    return (
        <div className="w-full py-12 overflow-hidden relative">
            <div className="container mx-auto px-4 mb-10 text-center md:text-left">
                <h2 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight mb-4">{title}</h2>
                <p className="text-xl md:text-2xl font-bold text-gray-600">{subtitle}</p>
            </div>

            {/* Fade Edges for slicker scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div
                ref={scrollRef}
                className="flex gap-8 overflow-x-auto pb-12 pt-4 px-4 md:px-32 snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {projects.map((project, index) => (
                    <TiltCard
                        key={project.id}
                        project={project}
                        colorTheme={colors[index % colors.length]}
                    />
                ))}
            </div>

            <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
};
