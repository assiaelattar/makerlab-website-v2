import React, { useState } from 'react';
import { ShoppingCart, Hammer, Info, Tag, Layers, Filter } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

// Mock Data for the Store
const KITS_DATA = [
    {
        id: 'k1',
        name: "Bras Robotique Hydraulique",
        category: "Ingénierie Mécanique",
        age: "10-15 ans",
        price: 450,
        skills: ["Mécanique des fluides", "Assemblage géométrique"],
        materials: ["Pièces découpées laser", "Seringues", "Tubes"],
        description: "Concevez et assemblez un véritable bras robotique actionné par la pression de l'eau. Pas de moteurs, juste de la physique pure.",
        color: "bg-brand-yellow",
        image: "https://images.unsplash.com/photo-1581092336203-8d69781ce7d0?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 'k2',
        name: "Lampe 3D Intelligente",
        category: "Électronique & CAO",
        age: "12-18 ans",
        price: 350,
        skills: ["Modélisation 3D", "Électronique de base (LEDs)", "Câblage"],
        materials: ["Cylindre acrylique", "Filament PLA", "Bandeau LED RGB"],
        description: "Imprimez votre base en 3D et câblez un circuit LED pour créer une lampe d'ambiance holographique.",
        color: "bg-brand-cyan",
        image: "https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 'k3',
        name: "Voiture Solaire de Course",
        category: "Énergies Renouvelables",
        age: "8-12 ans",
        price: 250,
        skills: ["Physique solaire", "Transmission mécanique"],
        materials: ["Châssis bois", "Panneau solaire 5V", "Micro-moteur DC"],
        description: "Découvrez comment l'énergie lumineuse se transforme en énergie mécanique en construisant un mini-bolide solaire.",
        color: "bg-brand-pink",
        image: "https://images.unsplash.com/photo-1590400512686-27ff15b6fb89?auto=format&fit=crop&q=80&w=800"
    }
];

export const Store: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
    const categories = ['Tous', 'Ingénierie Mécanique', 'Électronique & CAO', 'Énergies Renouvelables'];

    const filteredKits = selectedCategory === 'Tous'
        ? KITS_DATA
        : KITS_DATA.filter(kit => kit.category === selectedCategory);

    return (
        <div className="min-h-screen pt-8 md:pt-16 pb-20">

            {/* HEADER SECTION */}
            <section className="relative pb-16">
                <div className="bg-brand-dark px-4 py-20 text-center relative overflow-hidden">
                    {/* Abstract Background for Header */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                    <div className="container mx-auto relative z-10">
                        <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-6 leading-tight drop-shadow-md">
                            Skill-Builder <span className="text-brand-yellow">Store.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
                            De vrais projets d'ingénierie éducatifs. Achetez le kit pour le <span className="text-brand-cyan font-bold">construire à la maison</span>, ou réservez une <span className="text-brand-pink font-bold">Masterclass</span> pour le fabriquer avec nos experts à l'Académie.
                        </p>
                    </div>

                    {/* Decorative bottom border */}
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-brand-yellow"></div>
                </div>
            </section>

            {/* FILTER SECTION */}
            <section className="px-4 mb-12 relative -mt-6 z-20">
                <div className="container mx-auto max-w-5xl">
                    <ScrollReveal>
                        <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 md:p-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex items-center gap-2 font-display font-black text-xl whitespace-nowrap uppercase tracking-wide">
                                <Filter size={24} strokeWidth={3} /> Filtrer par:
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-5 py-2 md:py-2.5 rounded-none border-4 border-black font-black uppercase tracking-wider transition-all text-sm md:text-base ${selectedCategory === cat
                                            ? 'bg-brand-purple text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform translate-x-1 translate-y-1'
                                            : 'bg-white text-black hover:bg-black hover:text-white hover:-translate-y-1 hover:-translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* KITS GRID */}
            <section className="px-4">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredKits.map((kit, i) => (
                            <ScrollReveal key={kit.id} delay={i * 100}>
                                <div className="bg-white rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden group">

                                    {/* Image Area */}
                                    <div className="h-56 relative border-b-4 border-black overflow-hidden bg-gray-100">
                                        <img src={kit.image} alt={kit.name} className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" />
                                        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-none font-black border-4 border-black shadow-neo-sm flex items-center gap-2 uppercase tracking-widest text-lg">
                                            <Tag size={20} strokeWidth={3} /> {kit.price} DHS
                                        </div>
                                        <div className={`absolute bottom-4 left-4 ${kit.color} border-4 border-black px-3 py-1.5 rounded-none font-black uppercase tracking-wider text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3`}>
                                            {kit.category}
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                                        <h3 className="font-display font-black text-3xl mb-4 leading-tight uppercase tracking-tight">{kit.name}</h3>

                                        <p className="text-black font-medium text-lg mb-6 flex-grow leading-relaxed">{kit.description}</p>

                                        <div className="mb-6 space-y-2 bg-gray-50 border-4 border-black rounded-none p-4 shadow-neo-sm transform rotate-1 hover:rotate-0 transition-transform">
                                            <h4 className="font-black flex items-center gap-2 text-sm uppercase tracking-wide"><Layers size={20} strokeWidth={3} /> Compétences acquises</h4>
                                            <ul className="text-base font-bold text-gray-800 space-y-1 list-disc list-inside">
                                                {kit.skills.map((skill, idx) => (
                                                    <li key={idx}>{skill}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="mt-auto space-y-4">
                                            <button className="w-full py-4 bg-brand-yellow text-black rounded-none font-black flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors border-4 border-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                                                <ShoppingCart size={24} strokeWidth={3} /> Acheter le Kit
                                            </button>
                                            <button className={`w-full py-4 ${kit.color} ${kit.color === 'bg-brand-pink' ? 'text-white' : 'text-black'} rounded-none font-black flex items-center justify-center gap-2 border-4 border-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all`}>
                                                <Hammer size={24} strokeWidth={3} /> Masterclass
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
};
