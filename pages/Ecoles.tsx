import React, { useState } from 'react';
import { Building2, Presentation, Map, Send, CheckCircle2, Wrench } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export const Ecoles: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'installation' | 'formation' | 'visite'>('installation');
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => setFormSubmitted(true), 500);
    };

    return (
        <div className="min-h-screen pt-8 md:pt-16 pb-20">

            {/* HEADER SECTION */}
            <section className="relative pb-16">
                <div className="bg-brand-purple px-4 py-20 text-center relative overflow-hidden">
                    {/* Abstract Background for Header */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                    <div className="container mx-auto relative z-10">
                        <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-6 leading-tight drop-shadow-md">
                            L'École du <span className="text-brand-cyan">Futur.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed">
                            Équipez votre établissement d'un véritable Makerspace "Low Cost / High Impact", formez vos professeurs à l'éducation STEM authentique, ou venez nous rendre visite.
                        </p>
                    </div>

                    {/* Decorative bottom border */}
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-brand-cyan"></div>
                </div>
            </section>

            {/* CORE CONTENT */}
            <section className="px-4 relative -mt-6 z-20">
                <div className="container mx-auto max-w-6xl">

                    {/* Navigation Tabs */}
                    <div className="flex flex-col md:flex-row gap-4 mb-12">
                        {[
                            { id: 'installation', label: '1. Makerspace Installation', icon: Building2, color: 'bg-brand-yellow', hoverColor: 'hover:bg-brand-yellow/90' },
                            { id: 'formation', label: '2. Teacher Training', icon: Presentation, color: 'bg-brand-pink', hoverColor: 'hover:bg-brand-pink/90' },
                            { id: 'visite', label: '3. Experience-it (Visites)', icon: Map, color: 'bg-brand-purple', hoverColor: 'hover:bg-brand-purple/90' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 md:py-5 px-4 md:px-6 font-display font-black uppercase tracking-wide text-base md:text-lg rounded-none border-4 border-black transition-all duration-300 ${activeTab === tab.id
                                    ? `${tab.color} ${tab.id === 'formation' || tab.id === 'visite' ? 'text-white' : 'text-black'} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform -translate-y-1`
                                    : `bg-white text-black ${tab.hoverColor} hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                                    }`}
                            >
                                <tab.icon size={24} strokeWidth={3} className={activeTab === tab.id ? '' : 'text-gray-900'} /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Contents */}
                    <div className="bg-white rounded-none border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

                        {activeTab === 'installation' && (
                            <ScrollReveal>
                                <div className="grid lg:grid-cols-2 gap-12 items-center">
                                    <div>
                                        <div className="inline-block bg-brand-cyan border-2 border-black px-3 py-1 rounded-lg font-bold text-sm mb-6 uppercase">Installation</div>
                                        <h2 className="font-display font-bold text-4xl mb-6 leading-tight">Makerspace Low Cost, High Impact.</h2>
                                        <p className="text-xl mb-8 text-gray-600 font-medium">
                                            Construire un laboratoire de technologie dans votre école ne devrait pas coûter une fortune en gadgets inutiles.
                                            Nous concevons des espaces optimisés avec l'équipement essentiel :
                                        </p>
                                        <ul className="space-y-4 mb-8 text-lg font-bold">
                                            <li className="flex items-center gap-3"><CheckCircle2 className="text-brand-purple" strokeWidth={3} /> Imprimantes 3D d'ingénierie</li>
                                            <li className="flex items-center gap-3"><CheckCircle2 className="text-brand-purple" strokeWidth={3} /> Stations de soudure et électronique</li>
                                            <li className="flex items-center gap-3"><CheckCircle2 className="text-brand-purple" strokeWidth={3} /> Découpeuse laser compacte</li>
                                            <li className="flex items-center gap-3"><CheckCircle2 className="text-brand-purple" strokeWidth={3} /> Le curriculum propriétaire Makerlab !</li>
                                        </ul>
                                        <div className="bg-brand-yellow/30 border-l-4 border-brand-yellow p-4 rounded-r-xl">
                                            <p className="text-black font-bold italic">
                                                "Plus qu'un espace physique, nous vous livrons notre philosophie pédagogique prête à l'emploi."
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 rounded-3xl h-80 border-4 border-black flex flex-col justify-center items-center text-center p-6 relative overflow-hidden group">
                                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '15px 15px' }}></div>
                                        <Wrench className="text-brand-purple mb-6 transform group-hover:rotate-12 transition-transform duration-300" size={64} strokeWidth={2.5} />
                                        <span className="font-display font-bold text-2xl text-gray-400 uppercase tracking-widest relative z-10">Aperçu Layout 3D</span>
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}

                        {activeTab === 'formation' && (
                            <ScrollReveal>
                                <div className="text-center max-w-3xl mx-auto">
                                    <div className="inline-block bg-brand-pink text-white border-2 border-black px-3 py-1 rounded-lg font-bold text-sm mb-6 uppercase">Teacher Training</div>
                                    <h2 className="font-display font-bold text-4xl leading-tight mb-6">Masterclass pour Éducateurs.</h2>
                                    <p className="text-xl mb-12 text-gray-600 font-medium">Comment enseigner la vraie technologie ? Nous formons vos professeurs à notre pédagogie "Sans Legos", afin de rendre vos équipes autonomes.</p>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {[
                                            { title: 'Impression 3D & CAO', color: 'bg-brand-cyan' },
                                            { title: 'Électronique & IoT', color: 'bg-brand-yellow' },
                                            { title: 'Intelligence Artificielle', color: 'bg-brand-purple text-white' },
                                            { title: 'Game Design VR', color: 'bg-brand-green' }
                                        ].map(subject => (
                                            <div key={subject.title} className={`${subject.color} p-6 rounded-2xl border-4 border-black shadow-neo font-display font-bold text-xl hover:-translate-y-1 transition-transform cursor-default transform even:rotate-1 odd:-rotate-1 hover:rotate-0`}>
                                                {subject.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}

                        {activeTab === 'visite' && (
                            <ScrollReveal>
                                <div className="grid lg:grid-cols-2 gap-12">
                                    <div>
                                        <div className="inline-block bg-brand-purple text-white border-2 border-black px-3 py-1 rounded-lg font-bold text-sm mb-6 uppercase transform -rotate-2">Experience-it !</div>
                                        <h2 className="font-display font-bold text-4xl mb-6 leading-tight">Emmenez vos élèves dans le futur.</h2>
                                        <p className="text-lg mb-8 text-gray-600 font-medium">
                                            Réservez une demi-journée d'immersion totale à la Makerlab Academy. Vos élèves découvriront un environnement d'ingénierie stimulant.
                                        </p>
                                        <ul className="space-y-6 text-xl font-bold">
                                            <li className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                                                <div className="bg-brand-cyan p-2 border-2 border-black rounded-lg"><Map size={24} /></div>
                                                Démonstration machines
                                            </li>
                                            <li className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                                                <div className="bg-brand-yellow p-2 border-2 border-black rounded-lg"><Building2 size={24} /></div>
                                                Résolution d'un mini-défi
                                            </li>
                                            <li className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                                                <div className="bg-brand-pink text-white p-2 border-2 border-black rounded-lg"><Presentation size={24} /></div>
                                                Rencontre avec nos ingénieurs
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Contact Form */}
                                    <div className="bg-brand-yellow p-8 rounded-3xl border-4 border-black relative">
                                        {/* Decorative element */}
                                        <div className="absolute -top-4 -right-4 bg-white border-4 border-black rounded-full p-2 animate-bounce"><Send size={24} /></div>

                                        {formSubmitted ? (
                                            <div className="text-center py-16">
                                                <CheckCircle2 size={80} strokeWidth={2} className="text-black mx-auto mb-6" />
                                                <h3 className="font-display font-bold text-3xl mb-4">Demande envoyée !</h3>
                                                <p className="text-lg font-medium">Notre équipe vous recontactera sous 24h ouvrées.</p>
                                                <button onClick={() => setFormSubmitted(false)} className="mt-8 font-bold underline hover:text-gray-600 transition-colors">Faire une autre demande</button>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                                <h3 className="font-display font-bold text-2xl mb-2">Prendre contact</h3>
                                                <input type="text" placeholder="Nom de l'école / institution" className="w-full p-4 border-4 border-black rounded-xl font-bold focus:ring-4 focus:ring-brand-cyan outline-none transition-shadow" required />
                                                <input type="email" placeholder="Email professionnel" className="w-full p-4 border-4 border-black rounded-xl font-bold focus:ring-4 focus:ring-brand-cyan outline-none transition-shadow" required />
                                                <select className="w-full p-4 border-4 border-black rounded-xl font-bold focus:ring-4 focus:ring-brand-cyan outline-none transition-shadow bg-white" required>
                                                    <option value="">Sujet de la demande</option>
                                                    <option value="makerspace">Installation Makerspace</option>
                                                    <option value="formation">Formation Professeurs</option>
                                                    <option value="visite">Organisation Visite</option>
                                                </select>
                                                <button type="submit" className="mt-4 bg-black text-white w-full py-5 rounded-xl font-bold text-lg flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors border-2 border-black">
                                                    Envoyer la demande
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </div>
                            </ScrollReveal>
                        )}

                    </div>
                </div>
            </section>
        </div>
    );
};
