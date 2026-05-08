import React from 'react';
import { Mail, Briefcase, Handshake, Send, MapPin, Phone } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { useSettings } from '../contexts/SettingsContext';

export const Contact: React.FC = () => {
    const { settings } = useSettings();
    return (
        <div className="min-h-screen pt-0 pb-12 md:pb-20">

            {/* HEADER SECTION */}
            <section className="relative pb-8 md:pb-16">
                <div className="bg-brand-green px-4 py-12 md:py-20 text-center relative overflow-hidden">
                    {settings?.hero_images?.hero_bg_contact && (
                        <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: `url(${settings.hero_images.hero_bg_contact})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    )}
                    <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>

                    <div className="container mx-auto relative z-10">
                        <h1 className="font-display font-bold text-3xl md:text-7xl text-black mb-4 md:mb-6 leading-tight drop-shadow-md">
                            Rejoignez le <span className="text-white">Mouvement.</span>
                        </h1>
                        <div className="inline-block">
                            <p className="text-sm md:text-2xl text-black font-medium max-w-3xl mx-auto leading-relaxed bg-white/50 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-xl border-2 border-black">
                                Que vous vouliez enseigner à nos côtés, devenir partenaire, ou simplement nous poser une question !
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-4 bg-black"></div>
                </div>
            </section>

            {/* TWO COLUMNS SECTION */}
            <section className="px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

                        {/* Left Column - Info & Cards */}
                        <div className="space-y-5 md:space-y-8">
                            <ScrollReveal>
                                <div className="bg-brand-blue/20 p-5 md:p-8 rounded-[2rem] border-4 border-black shadow-neo flex flex-col sm:flex-row gap-4 md:gap-6 items-center sm:items-start group hover:-translate-y-1 transition-transform">
                                    <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-brand-red text-white border-4 border-black rounded-xl flex items-center justify-center shadow-neo-sm transform -rotate-3 group-hover:rotate-3 transition-transform">
                                        <Briefcase size={28} />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h2 className="font-display font-bold text-xl md:text-2xl mb-2 md:mb-3">Recrutement & Mentorat</h2>
                                        <p className="text-sm md:text-lg font-medium text-gray-700 mb-3 md:mb-4">Ingénieur ? Maker passionné ? Étudiant brillant ? Nous cherchons constamment des talents pour encadrer nos jeunes.</p>
                                        <a href={`mailto:${settings?.contact_info?.jobs_email || 'jobs@makerlab.ma'}`} className="font-bold text-brand-red text-base md:text-xl hover:underline break-all">{settings?.contact_info?.jobs_email || 'jobs@makerlab.ma'}</a>
                                    </div>
                                </div>
                            </ScrollReveal>

                            <ScrollReveal delay={100}>
                                <div className="bg-brand-red/20 p-5 md:p-8 rounded-[2rem] border-4 border-black shadow-neo flex flex-col sm:flex-row gap-4 md:gap-6 items-center sm:items-start group hover:-translate-y-1 transition-transform">
                                    <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-white border-4 border-black rounded-xl flex items-center justify-center shadow-neo-sm transform rotate-3 group-hover:-rotate-3 transition-transform">
                                        <Handshake size={28} />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h2 className="font-display font-bold text-xl md:text-2xl mb-2 md:mb-3">Devenir Partenaire</h2>
                                        <p className="text-sm md:text-lg font-medium text-gray-700 mb-4 md:mb-6">Fournisseurs de matériel, écoles, institutions publiques : bâtissons l'écosystème ensemble.</p>
                                        <a href={`mailto:${settings?.contact_info?.partners_email || 'partners@makerlab.ma'}`} className="inline-flex items-center gap-2 font-bold px-4 md:px-6 py-2.5 md:py-3 bg-white border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_black] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_black] transition-all text-sm md:text-base">
                                            <Mail size={16} /> Contact Partenariats
                                        </a>
                                    </div>
                                </div>
                            </ScrollReveal>

                            {/* Visit Us */}
                            <ScrollReveal delay={200}>
                                <div className="bg-white p-4 md:p-6 rounded-2xl border-4 border-black flex items-center gap-4">
                                    <MapPin size={22} className="text-brand-green shrink-0" strokeWidth={2.5} />
                                    <span className="font-bold text-sm md:text-lg text-gray-800">{settings?.contact_info?.address || 'Casablanca, Maroc (Rabat Bientôt !)'}</span>
                                </div>
                                <div className="bg-white p-4 md:p-6 rounded-2xl border-4 border-black flex items-center gap-4 mt-3">
                                    <Phone size={22} className="text-brand-blue shrink-0" strokeWidth={2.5} />
                                    <span className="font-bold text-sm md:text-lg text-gray-800">{settings?.contact_info?.phone || '+212 (0) 6 00 00 00 00'}</span>
                                </div>
                            </ScrollReveal>
                        </div>

                        {/* Right Column - Form */}
                        <ScrollReveal delay={200}>
                            <div className="bg-white p-5 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border-4 border-black shadow-neo-xl relative">
                                <div className="absolute top-0 right-8 transform -translate-y-1/2">
                                    <div className="bg-brand-green px-3 py-1 border-2 border-black rounded-xl font-bold text-white shadow-neo-sm transform rotate-6 text-xs md:text-sm">Dites Bonjour 👋</div>
                                </div>

                                <h2 className="font-display font-bold text-2xl md:text-3xl mb-6 md:mb-8 border-b-4 border-brand-orange inline-block pb-2">Écrivez-nous</h2>

                                <form className="flex flex-col gap-4 md:gap-6" onSubmit={(e) => e.preventDefault()}>
                                    {/* FIX: was always grid-cols-2, now responsive */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <div>
                                            <label className="block font-bold mb-2 uppercase tracking-wide text-xs md:text-sm">Prénom</label>
                                            <input type="text" className="w-full p-3 md:p-4 bg-gray-50 border-4 border-black rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue outline-none transition-all placeholder:text-gray-400" placeholder="Ali" required />
                                        </div>
                                        <div>
                                            <label className="block font-bold mb-2 uppercase tracking-wide text-xs md:text-sm">Nom</label>
                                            <input type="text" className="w-full p-3 md:p-4 bg-gray-50 border-4 border-black rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue outline-none transition-all placeholder:text-gray-400" placeholder="Amrani" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase tracking-wide text-xs md:text-sm">Email</label>
                                        <input type="email" className="w-full p-3 md:p-4 bg-gray-50 border-4 border-black rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue outline-none transition-all placeholder:text-gray-400" placeholder="ali@example.com" required />
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase tracking-wide text-xs md:text-sm">Sujet</label>
                                        <div className="relative">
                                            <select className="w-full p-3 md:p-4 bg-gray-50 border-4 border-black rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue outline-none transition-all appearance-none cursor-pointer" required>
                                                <option value="">Sélectionnez un sujet...</option>
                                                <option value="info">Demande d'informations générales</option>
                                                <option value="store">Question sur le Skill-Builder Store</option>
                                                <option value="other">Autre / Support technique</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <Send size={18} className="text-gray-400 transform rotate-90" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase tracking-wide text-xs md:text-sm">Message</label>
                                        <textarea className="w-full p-3 md:p-4 bg-gray-50 border-4 border-black rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-brand-blue outline-none transition-all placeholder:text-gray-400 min-h-[130px] md:min-h-[160px] resize-y" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
                                    </div>

                                    <button type="submit" className="mt-2 bg-black text-white py-4 md:py-5 px-6 md:px-8 rounded-xl font-bold text-base md:text-xl flex justify-center items-center gap-3 border-4 border-black hover:bg-gray-800 transition-colors shadow-[6px_6px_0px_0px_var(--brand-orange)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--brand-orange)]">
                                        <Send size={20} /> Envoyer le message
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
