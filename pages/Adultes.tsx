import React from 'react';
import { Briefcase, Cpu, Glasses, TrendingUp, Handshake, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export const Adultes: React.FC = () => {
    return (
        <div className="min-h-screen pt-8 md:pt-16 pb-20">

            {/* HEADER SECTION */}
            <section className="relative pb-16">
                <div className="bg-black px-4 py-20 text-center relative overflow-hidden">
                    {/* Abstract Background for Header */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--brand-pink) 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

                    <div className="container mx-auto relative z-10">
                        <h1 className="font-display font-bold text-5xl md:text-7xl text-white mb-6 leading-tight drop-shadow-md">
                            Upskill <span className="text-brand-pink">Intelligemment.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
                            Des formations intensives "hands-on" pour les professionnels et les étudiants du supérieur souhaitant maîtriser les technologies de demain.
                        </p>
                    </div>

                    {/* Decorative bottom border */}
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-brand-pink"></div>
                </div>
            </section>

            {/* PROGRAMS GRID */}
            <section className="px-4 mb-20">
                <div className="container mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">

                        {[
                            {
                                title: "Intelligence Artificielle & Prompt Engineering",
                                desc: "Ne soyez pas remplacé par l'IA, apprenez à la piloter. Formation pratique sur LLMs, automatisation de workflows et création d'agents génératifs.",
                                icon: Cpu,
                                color: "bg-brand-pink",
                                textColor: "text-white"
                            },
                            {
                                title: "Conception & Impression 3D Industrielle",
                                desc: "Devenez autonome en conception produit. Maîtrisez la CAO paramétrique (Fusion 360), l'optimisation topologique et la fabrication additive avancée.",
                                icon: Briefcase,
                                color: "bg-brand-cyan",
                                textColor: "text-black"
                            },
                            {
                                title: "VR & Spatial Computing",
                                desc: "Créez des environnements immersifs. Développement sous Unity/Unreal Engine pour l'industrie, l'architecture et la formation.",
                                icon: Glasses,
                                color: "bg-brand-purple",
                                textColor: "text-white"
                            },
                            {
                                title: "Tech-Business & Entrepreneuriat",
                                desc: "Comment passer du prototype au produit hardware. Supply chain, sourcing, calcul de coûts et stratégies de MVP pour produits physiques.",
                                icon: TrendingUp,
                                color: "bg-brand-yellow",
                                textColor: "text-black"
                            }
                        ].map((prog, i) => (
                            <ScrollReveal key={i} delay={i * 100}>
                                <div className={`p-8 md:p-10 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col group relative overflow-hidden bg-white`}>

                                    {/* Background Decorative */}
                                    <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-none ${prog.color} opacity-20 group-hover:scale-150 transition-transform duration-700`}></div>

                                    <div className={`w-16 h-16 rounded-none border-4 border-black ${prog.color} ${prog.textColor} mb-8 flex items-center justify-center shadow-neo-sm transform -rotate-2 group-hover:rotate-0 transition-transform relative z-10`}>
                                        <prog.icon size={32} strokeWidth={3} />
                                    </div>

                                    <h3 className="font-display font-black text-3xl mb-4 relative z-10">{prog.title}</h3>
                                    <p className="text-black font-medium text-lg mb-10 flex-grow relative z-10 leading-relaxed">{prog.desc}</p>

                                    <button className="w-full mt-auto py-4 bg-white border-4 border-black rounded-none font-black flex items-center justify-between px-6 hover:bg-black hover:text-white transition-colors relative z-10 uppercase tracking-widest">
                                        Voir le programme <ChevronRight size={20} strokeWidth={3} />
                                    </button>
                                </div>
                            </ScrollReveal>
                        ))}

                    </div>
                </div>
            </section>

            {/* INTRA-ENTERPRISE */}
            <section className="px-4">
                <ScrollReveal>
                    <div className="container mx-auto">
                        <div className="bg-white p-8 md:p-16 rounded-[2.5rem] border-4 border-black shadow-neo text-center relative overflow-hidden group">
                            {/* Patterns */}
                            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                            <div className="absolute top-1/2 left-10 transform -translate-y-1/2 hidden lg:block">
                                <div className="w-16 h-16 border-4 border-black bg-brand-cyan rounded-full shadow-neo animate-bounce"></div>
                            </div>
                            <div className="absolute top-1/2 right-10 transform -translate-y-1/2 hidden lg:block">
                                <div className="w-16 h-16 border-4 border-black bg-brand-yellow rounded-lg shadow-neo animate-pulse rotate-45"></div>
                            </div>

                            <div className="relative z-10 max-w-3xl mx-auto">
                                <Handshake size={64} className="mx-auto text-brand-purple mb-8 transform -rotate-6" strokeWidth={2} />
                                <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">Formations Intra-Entreprise</h2>
                                <p className="text-xl text-gray-700 mb-10 font-medium leading-relaxed">
                                    Nous concevons des programmes sur-mesure pour vos équipes. Transformez votre entreprise en intégrant la fabrication numérique et l'IA dans vos processus de tous les jours.
                                </p>
                                <button className="bg-brand-purple text-white px-8 py-5 rounded-xl font-bold text-xl border-4 border-black shadow-[6px_6px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_black] transition-all">
                                    Contacter notre Pôle Pro
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </section>

        </div>
    );
};
