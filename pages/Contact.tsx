import React from 'react';
import { Mail, Briefcase, Handshake, Send, MapPin, Phone } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

export const Contact: React.FC = () => {
    return (
        <div className="min-h-screen pt-8 md:pt-16 pb-20">

            {/* HEADER SECTION */}
            <section className="relative pb-16">
                <div className="bg-brand-green px-4 py-20 text-center relative overflow-hidden">
                    {/* Abstract Background for Header */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>

                    <div className="container mx-auto relative z-10">
                        <h1 className="font-display font-bold text-5xl md:text-7xl text-black mb-6 leading-tight drop-shadow-md">
                            Rejoignez le <span className="text-white">Mouvement.</span>
                        </h1>
                        <div className="inline-block">
                            <p className="text-xl md:text-2xl text-black font-medium max-w-3xl mx-auto leading-relaxed bg-white/50 backdrop-blur-sm px-6 py-4 rounded-xl border-2 border-black">
                                Que vous vouliez enseigner à nos côtés, devenir partenaire, ou simplement nous poser une question !
                            </p>
                        </div>
                    </div>

                    {/* Decorative bottom border */}
                    <div className="absolute bottom-0 left-0 w-full h-4 bg-black"></div>
                </div>
            </section>

            {/* TWO COLUMNS SECTION */}
            <section className="px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12">

                        {/* Left Column - Info & Cards */}
                        <div className="space-y-8">
                            <ScrollReveal>
                                <div className="bg-brand-cyan/20 p-8 rounded-[2rem] border-4 border-black shadow-neo flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:-translate-y-1 transition-transform">
                                    <div className="w-16 h-16 shrink-0 bg-brand-purple text-white border-4 border-black rounded-xl flex items-center justify-center shadow-neo-sm transform -rotate-3 group-hover:rotate-3 transition-transform">
                                        <Briefcase size={32} />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-bold text-2xl mb-3">Recrutement & Mentorat</h2>
                                        <p className="text-lg font-medium text-gray-700 mb-4">Ingénieur ? Maker passionné ? Étudiant brillant ? Nous cherchons constamment des talents pour encadrer nos jeunes.</p>
                                        <a href="mailto:jobs@makerlab.ma" className="font-bold text-brand-purple text-xl hover:underline">jobs@makerlab.ma</a>
                                    </div>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal delay={100}>
                                <div className="bg-brand-yellow/20 p-8 rounded-[2rem] border-4 border-black shadow-neo flex flex-col sm:flex-row gap-6 items-center sm:items-start group hover:-translate-y-1 transition-transform">
                                    <div className="w-16 h-16 shrink-0 bg-white border-4 border-black rounded-xl flex items-center justify-center shadow-neo-sm transform rotate-3 group-hover:-rotate-3 transition-transform">
                                        <Handshake size={32} />
                                    </div>
                                    <div>
                                        <h2 className="font-display font-bold text-2xl mb-3">Devenir Partenaire</h2>
                                        <p className="text-lg font-medium text-gray-700 mb-6">Fournisseurs de matériel, écoles, institutions publiques : bâtissons l'écosystème ensemble.</p>
                                        <a href="mailto:partners@makerlab.ma" className="inline-flex items-center gap-2 font-bold px-6 py-3 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_black] transition-all">
                                            <Mail size={20} /> Contact Partenariats
                                        </a>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Visit Us Mini Card */}
                            <ScrollReveal delay={200}>
                                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-none flex items-center gap-4">
                                    <MapPin size={24} className="text-brand-pink shrink-0" strokeWidth={2.5} />
                                    <span className="font-bold text-lg text-gray-800">Casablanca, Maroc (Rabat Bientôt !)</span>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-none flex items-center gap-4 mt-4 border-t-0 -mt-2">
                                    <Phone size={24} className="text-brand-cyan shrink-0" strokeWidth={2.5} />
                                    <span className="font-bold text-lg text-gray-800">+212 (0) 6 00 00 00 00</span>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Right Column - Form */}
                        <ScrollReveal delay={300}>
                            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border-4 border-black shadow-neo-xl relative">
                                <div className="absolute top-0 right-10 transform -translate-y-1/2">
                                    <div className="bg-brand-pink px-4 py-1 border-2 border-black rounded-xl font-bold text-white shadow-neo-sm transform rotate-6">Dites Bonjour 👋</div>
                                </div>

                                <h2 className="font-display font-bold text-3xl mb-8 border-b-4 border-brand-yellow inline-block pb-2">Écrivez-nous</h2>

                                <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block font-bold mb-2 uppercase tracking-wide text-sm">Prénom</label>
                                            <input type="text" className="w-full p-4 bg-gray-50 border-4 border-black rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-brand-cyan outline-none transition-all placeholder:text-gray-400" placeholder="Ali" required />
                                        </div>
                                        <div>
                                            <label className="block font-bold mb-2 uppercase tracking-wide text-sm">Nom</label>
                                            <input type="text" className="w-full p-4 bg-gray-50 border-4 border-black rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-brand-cyan outline-none transition-all placeholder:text-gray-400" placeholder="Amrani" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase tracking-wide text-sm">Email</label>
                                        <input type="email" className="w-full p-4 bg-gray-50 border-4 border-black rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-brand-cyan outline-none transition-all placeholder:text-gray-400" placeholder="ali@example.com" required />
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase tracking-wide text-sm">Sujet</label>
                                        <div className="relative">
                                            <select className="w-full p-4 bg-gray-50 border-4 border-black rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-brand-cyan outline-none transition-all appearance-none cursor-pointer" required>
                                                <option value="">Sélectionnez un sujet...</option>
                                                <option value="info">Demande d'informations générales</option>
                                                <option value="store">Question sur le Skill-Builder Store</option>
                                                <option value="other">Autre / Support technique</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <Send size={20} className="text-gray-400 transform rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase tracking-wide text-sm">Message</label>
                                        <textarea className="w-full p-4 bg-gray-50 border-4 border-black rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-brand-cyan outline-none transition-all placeholder:text-gray-400 min-h-[160px] resize-y" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
                                    </div>

                                    <button type="submit" className="mt-4 bg-black text-white py-5 px-8 rounded-xl font-bold text-xl flex justify-center items-center gap-3 border-4 border-black hover:bg-gray-800 transition-colors shadow-[6px_6px_0px_0px_var(--brand-yellow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--brand-yellow)]">
                                        <Send size={24} /> Envoyer le message
                                    </button>
                                </form>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

        </div>
    );
};
