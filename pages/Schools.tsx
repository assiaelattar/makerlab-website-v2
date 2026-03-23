import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { useSettings } from '../contexts/SettingsContext';
import { usePrograms } from '../contexts/ProgramContext';
import { ProgramCard } from '../components/ProgramCard';
import { StatsBanner } from '../components/StatsBanner';
import { PhotoGallery } from '../components/PhotoGallery';

export const Schools: React.FC = () => {
    const { settings } = useSettings();
    const { programs } = usePrograms();
    const [formSubmitted, setFormSubmitted] = useState(false);

    // Filter active programs meant for schools
    const schoolPrograms = programs.filter(p => p.active && p.format === 'School Program');

    const defaultStats = [
        { value: '50+', label: 'Écoles partenaires', emoji: '🏫' },
        { value: '5000+', label: 'Élèves touchés', emoji: '🎓' },
        { value: '100%', label: 'Programmes sur mesure', emoji: '⚙️' },
        { value: '5 ans', label: "d'expertise B2B", emoji: '🏆' },
    ];
    const stats = settings?.key_stats?.length ? settings.key_stats : defaultStats;
    const galleryImages = settings?.gallery_schools || [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => setFormSubmitted(true), 500);
    };

    return (
        <div className="min-h-screen pt-8 md:pt-16">

            {/* HEADER SECTION */}
            <section className="relative pb-16 px-4">
                <div className="bg-brand-red px-4 py-20 text-center relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
                    {settings?.hero_images?.hero_bg_ecoles && (
                        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: `url(${settings.hero_images.hero_bg_ecoles})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    )}
                    <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                    <div className="container mx-auto relative z-10">
                        <h1 className="font-display font-black text-5xl md:text-7xl text-white mb-6 leading-tight drop-shadow-md uppercase">
                            MakerLab pour <span className="text-brand-blue drop-shadow-[2px_2px_0px_black]">Écoles</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-black bg-white inline-block px-4 py-2 border-2 border-black transform rotate-1 max-w-3xl mx-auto font-bold leading-relaxed shadow-neo-sm">
                            High-tech educational experiences for your students.
                        </p>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-4 bg-brand-blue border-t-4 border-black"></div>
                </div>
            </section>

            {/* PROGRAMS GRID */}
            <section className="container mx-auto px-4 mt-12 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {schoolPrograms.length > 0 ? (
                        schoolPrograms.map((program, index) => (
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

                {/* STATS BANNER — Moved below programs */}
                <StatsBanner stats={stats} variant="dark" />

                {/* Contact Form */}
                <ScrollReveal>
                    <div className="max-w-3xl mx-auto bg-brand-red text-white p-8 md:p-12 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative mt-20">
                        <div className="absolute -top-6 -right-6 bg-white border-4 border-black rounded-full p-4 shadow-neo-sm animate-bounce">
                            <Send size={32} />
                        </div>

                        {formSubmitted ? (
                            <div className="text-center py-16">
                                <CheckCircle2 size={80} strokeWidth={2} className="text-black mx-auto mb-6" />
                                <h3 className="font-display font-black text-3xl mb-4">Demande envoyée !</h3>
                                <p className="text-xl font-medium">Notre équipe B2B vous recontactera sous 24h ouvrées.</p>
                                <button onClick={() => setFormSubmitted(false)} className="mt-8 font-bold underline hover:text-gray-600 transition-colors uppercase tracking-widest text-sm">Faire une autre demande</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <h3 className="font-display font-black text-3xl mb-2">Travaillons ensemble</h3>
                                <input type="text" placeholder="Nom de l'école / institution" className="w-full p-4 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold focus:shadow-none focus:translate-x-1 focus:translate-y-1 outline-none transition-all" required />
                                <input type="email" placeholder="Email professionnel" className="w-full p-4 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold focus:shadow-none focus:translate-x-1 focus:translate-y-1 outline-none transition-all" required />
                                <select className="w-full p-4 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold focus:shadow-none focus:translate-x-1 focus:translate-y-1 outline-none transition-all bg-white" required>
                                    <option value="">Sélectionnez un programme</option>
                                    <option value="experience-it">Experience-It (Visite)</option>
                                    <option value="stemquest-school">STEMQuest At School</option>
                                    <option value="custom-workshop">Workshop sur mesure</option>
                                    <option value="project">Accélération de Projet</option>
                                    <option value="other">Autre demande</option>
                                </select>
                                <button type="submit" className="mt-6 bg-black text-white w-full py-5 font-black text-xl uppercase tracking-widest flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                                    Envoyer la demande
                                </button>
                            </form>
                        )}
                    </div>
                </ScrollReveal>
            </section>

            {/* GALLERY — Schools social proof */}
            {galleryImages.length > 0 && (
                <PhotoGallery
                    images={galleryImages}
                    title="MakerLab & les Écoles"
                    subtitle="Des expériences high-tech qui inspirent la prochaine génération d'innovateurs."
                    bgDark={false}
                />
            )}
        </div>
    );
};
