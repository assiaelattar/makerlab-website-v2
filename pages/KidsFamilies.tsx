import React from 'react';
import { usePrograms } from '../contexts/ProgramContext';
import { useSettings } from '../contexts/SettingsContext';
import { ScrollReveal } from '../components/ScrollReveal';
import { ProgramCard } from '../components/ProgramCard';
import { StatsBanner } from '../components/StatsBanner';
import { PhotoGallery } from '../components/PhotoGallery';

export const KidsFamilies: React.FC = () => {
    const { settings } = useSettings();
    const { programs } = usePrograms();

    // Filter active programs meant for kids/families
    const kidsPrograms = programs.filter(p => p.active && p.format !== 'School Program');

    const defaultStats = [
        { value: '200+', label: 'Enfants formés', emoji: '🎓' },
        { value: '5 ans', label: "d'expertise", emoji: '🏆' },
        { value: '98%', label: 'Satisfaction parents', emoji: '❤️' },
        { value: '30+', label: 'Ateliers disponibles', emoji: '🔧' },
    ];
    const stats = settings?.key_stats?.length ? settings.key_stats : defaultStats;
    const galleryImages = settings?.gallery_kids || [];

    return (
        <div className="min-h-screen pt-8 md:pt-16">
            {/* HEADER SECTION */}
            <section className="relative pb-16 px-4">
                <div className="bg-brand-red text-white px-4 py-20 text-center relative overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    {/* Abstract Background */}
                    <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--brand-green) 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                    <div className="container mx-auto relative z-10">
                        <h1 className="font-display font-black text-5xl md:text-7xl text-white mb-6 leading-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] uppercase">
                            Enfants &amp; Familles
                        </h1>
                        <p className="text-xl md:text-2xl text-black max-w-3xl mx-auto font-medium leading-relaxed bg-white border-2 border-black inline-block px-4 py-2 transform -rotate-1 shadow-neo-sm">
                            Des programmes concrets pour apprendre la technologie en s'amusant.
                        </p>
                    </div>

                    {/* Decorative bottom border */}
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-brand-green border-t-4 border-black"></div>
                </div>
            </section>

            {/* PROGRAMS GRID */}
            <section className="container mx-auto px-4 mt-12 mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {kidsPrograms.length > 0 ? (
                        kidsPrograms.map((program, index) => (
                            <ScrollReveal key={program.id} delay={index * 100}>
                                <ProgramCard program={program} index={index} />
                            </ScrollReveal>
                        ))
                    ) : (
                        <div className="col-span-full py-10 text-center">
                            <p className="text-xl font-bold text-gray-400">Loading programs...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* STATS BANNER — Move below programs */}
            <StatsBanner stats={stats} variant="yellow" />

            {/* GALLERY — Social Proof */}
            {galleryImages.length > 0 && (
                <PhotoGallery
                    images={galleryImages}
                    title="Moments de Fierté"
                    subtitle="Des vraies créations, de vrais sourires — chaque week-end chez MakerLab."
                    bgDark={true}
                />
            )}
        </div>
    );
};

