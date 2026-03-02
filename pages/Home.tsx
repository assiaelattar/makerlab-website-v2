
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Rocket, Award, MessageCircle, ArrowRight, Star, Heart, Terminal, Cpu, Clock, Zap, CheckCircle, Smartphone, Gamepad } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';
import { ChatAssistant } from '../components/ChatAssistant';

// Improved Hero Images Data with Reliable Unsplash IDs
const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop", // Girl Coding
    badge: "Mode : Coder",
    icon: <Terminal size={24} strokeWidth={3} />,
    color: "bg-brand-yellow"
  },
  {
    src: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1000&auto=format&fit=crop", // VR
    badge: "Mode : Future",
    icon: <Gamepad size={24} strokeWidth={3} />,
    color: "bg-brand-purple text-white"
  },
  {
    src: "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=1000&auto=format&fit=crop", // Drone
    badge: "Mode : Pilote",
    icon: <Rocket size={24} strokeWidth={3} />,
    color: "bg-brand-cyan"
  },
  {
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop", // Team
    badge: "Mode : Leader",
    icon: <Cpu size={24} strokeWidth={3} />,
    color: "bg-brand-pink text-white"
  }
];

export const Home: React.FC = () => {
  // Hero Text Slider State
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const heroWords = ["LE DRONE", "L'APPLICATION", "LE JEU", "LA MARQUE", "LE ROBOT"];

  // Hero Image Slider State
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % heroWords.length);
    }, 2500);

    const imgInterval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
        setIsFlipping(false);
      }, 600); // Wait for half animation to swap image
    }, 4000);

    return () => {
      clearInterval(textInterval);
      clearInterval(imgInterval);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden pt-8 md:pt-16">

      {/* HERO SECTION */}
      <section className="relative pb-20 md:pb-32 px-4 overflow-visible">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-yellow/40 rounded-none blur-3xl mix-blend-multiply filter opacity-70 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-cyan/40 rounded-none blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

          {/* Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start pt-8">
            <div className="inline-flex items-center gap-2 bg-white border-4 border-black px-4 py-1.5 md:px-6 md:py-2 rounded-none font-bold mb-8 rotate-[-2deg] shadow-neo hover:rotate-0 transition-transform cursor-default">
              <span className="text-xl">👋</span>
              <span className="text-sm md:text-base tracking-wide uppercase font-display">Hey Future Tech Leader !</span>
            </div>

            <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl text-black mb-8 leading-[0.9] tracking-tight drop-shadow-sm uppercase">
              Ne joue pas. <br />
              <span className="block mt-2">Crée </span>
              <span className="relative inline-block text-brand-purple">
                <span className="relative z-10">{heroWords[heroTextIndex]}</span>
                <span className="absolute bottom-2 left-0 w-full h-3 md:h-6 bg-brand-cyan -z-0 transform -skew-x-12 border-2 border-black"></span>
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-900 mb-10 max-w-lg mx-auto lg:mx-0 font-bold leading-relaxed">
              Transforme ton week-end. Choisis une mission de <span className="font-black bg-brand-yellow px-2 border-2 border-black rounded-none mx-1 text-black shadow-neo-sm transform -rotate-2 inline-block">3 heures</span> et repars avec ton propre projet tech.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/programs" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full text-xl py-5 uppercase tracking-wider">
                  Voir les Missions <ArrowRight className="ml-2" strokeWidth={3} />
                </Button>
              </Link>
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full text-xl py-5 bg-white hover:bg-black hover:text-white border-4 border-black uppercase tracking-wider">
                  S'inscrire (400 DHS)
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visuals - Animated Flip Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-12 lg:mt-0 h-[450px] md:h-[550px] items-center">
            <div className="relative w-full max-w-sm perspective-1000">
              {/* Decorative floating shapes */}
              <div className="absolute -top-12 -right-8 w-20 h-20 bg-brand-pink border-4 border-black rounded-none animate-bounce z-0"></div>
              <div className="absolute -bottom-12 -left-8 w-24 h-24 bg-brand-green border-4 border-black rounded-none transform rotate-12 z-0 animate-pulse"></div>

              {/* The Flipping Card Container */}
              <div
                className="relative w-full aspect-[4/5] transition-all duration-700 ease-in-out preserve-3d"
                style={{
                  transform: isFlipping ? 'rotateY(90deg) scale(0.9)' : 'rotateY(0deg) scale(1)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* Shadow Layer (Static behind) */}
                <div className="absolute inset-0 bg-black rounded-none transform translate-x-4 translate-y-4 -z-10"></div>

                {/* Card Front */}
                <div className="absolute inset-0 bg-white border-4 border-black rounded-none overflow-hidden flex flex-col backface-hidden">
                  <img
                    src={heroImages[currentImgIndex].src}
                    alt="Student Project"
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                  />

                  {/* Floating Badge */}
                  <div className={`absolute -right-2 top-8 ${heroImages[currentImgIndex].color} p-3 rounded-none border-y-4 border-l-4 border-black shadow-neo transform translate-x-1 hover:translate-x-0 transition-transform`}>
                    {heroImages[currentImgIndex].icon}
                  </div>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white border-4 border-black p-4 rounded-none shadow-neo text-center transform rotate-[-2deg]">
                      <h3 className="font-display font-black text-xl uppercase tracking-wider text-black">
                        {heroImages[currentImgIndex].badge}
                      </h3>
                      <div className="flex justify-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} className="fill-brand-yellow text-black" strokeWidth={3} />)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TARGET AUDIENCES SECTION (Pour qui ?) */}
      <section className="py-24 px-4 bg-white relative border-y-4 border-black">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
        <div className="container mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-display font-black text-5xl md:text-6xl mb-6 uppercase tracking-tight">Pour qui ?</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            <Link to="/ecoles" className="group flex flex-col items-start bg-brand-cyan p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-16 h-16 bg-white border-4 border-black rounded-none mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <CheckCircle size={32} strokeWidth={3} className="text-black" />
              </div>
              <h3 className="font-display font-black text-2xl mb-3 text-black tracking-wide">Écoles & Institutions</h3>
              <p className="text-black font-medium text-base leading-relaxed">
                Installation de Makerspaces, visites et formations pour professeurs.
              </p>
            </Link>

            <Link to="/programs" className="group flex flex-col items-start bg-brand-pink p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-16 h-16 bg-white border-4 border-black rounded-none mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <Rocket size={32} strokeWidth={3} className="text-black" />
              </div>
              <h3 className="font-display font-black text-2xl mb-3 text-black tracking-wide">Enfants & Ados</h3>
              <p className="text-black font-medium text-base leading-relaxed">
                Programmes StemQuest, Make & Go, et ateliers interactifs ("No Legos").
              </p>
            </Link>

            <Link to="/adultes" className="group flex flex-col items-start bg-brand-yellow p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-16 h-16 bg-white border-4 border-black rounded-none mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <Cpu size={32} strokeWidth={3} className="text-black" />
              </div>
              <h3 className="font-display font-black text-2xl mb-3 text-black tracking-wide">Adultes & Pros</h3>
              <p className="text-black font-medium text-base leading-relaxed">
                Formations pointues en IA, CAO, Impression 3D, et Business tech.
              </p>
            </Link>

            <Link to="/store" className="group flex flex-col items-start bg-brand-purple p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-16 h-16 bg-white border-4 border-black rounded-none mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <Terminal size={32} strokeWidth={3} className="text-black" />
              </div>
              <h3 className="font-display font-black text-2xl mb-3 text-white tracking-wide">Le Store (Familles)</h3>
              <p className="text-white font-medium text-base leading-relaxed">
                Achetez nos kits éducatifs ou réservez un atelier Masterclass de fabrication.
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* PARENTS SECTION - Enhanced with Colors */}
      <section className="py-24 px-4 bg-white relative border-t-4 border-black">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="inline-block bg-brand-green border-2 border-black px-4 py-1 rounded-full font-bold text-sm mb-4 uppercase tracking-widest shadow-neo-sm">Pour les Parents</div>
              <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">Pourquoi ils adorent ?</h2>
              <p className="text-gray-500 text-xl max-w-2xl mx-auto">
                Transformez le temps d'écran passif en temps d'apprentissage actif et créatif.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Projets Concrets",
                desc: "Pas de théorie abstraite. Ils rentrent à la maison avec un objet, un jeu ou une app qui fonctionne réellement.",
                icon: Rocket,
                bgColor: "bg-brand-cyan",
                textColor: "text-black",
                rotate: "-rotate-2"
              },
              {
                title: "Confiance & Soft Skills",
                desc: "Présenter son projet, résoudre des bugs, travailler en équipe. C'est l'école de la vie, version Tech.",
                icon: Heart,
                bgColor: "bg-brand-purple",
                textColor: "text-white",
                rotate: "rotate-2"
              },
              {
                title: "Communauté Fun",
                desc: "Ils rencontrent d'autres passionnés. L'ambiance est cool, bienveillante et stimulante. Zéro pression.",
                icon: Star,
                bgColor: "bg-brand-yellow",
                textColor: "text-black",
                rotate: "-rotate-1"
              }
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className={`group h-full flex flex-col ${item.bgColor} ${item.textColor} rounded-[2rem] border-4 border-black p-8 shadow-neo hover:-translate-y-2 hover:shadow-neo-xl transition-all duration-300 transform ${item.rotate} hover:rotate-0 relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                  <div className={`w-16 h-16 rounded-2xl border-2 border-black bg-white mb-6 flex items-center justify-center shadow-neo-sm group-hover:scale-110 transition-transform relative z-10`}>
                    <item.icon size={32} strokeWidth={3} className="text-black" />
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-4 relative z-10">{item.title}</h3>
                  <p className={`font-bold text-lg leading-relaxed relative z-10 ${item.textColor === 'text-white' ? 'opacity-90' : 'opacity-80'}`}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CHATBOT ASSISTANT SECTION */}
      <section className="py-20 md:py-32 bg-brand-yellow border-y-4 border-black relative overflow-hidden">
        {/* Abstract Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border-4 border-black shadow-neo-xl p-8 md:p-12 max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">

              <div className="flex-1 space-y-6 w-full">
                <div className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full font-bold border-2 border-brand-purple shadow-md">
                  <MessageCircle size={18} className="text-brand-yellow" strokeWidth={3} />
                  <span className="uppercase tracking-wider text-sm">Orientation Chat</span>
                </div>

                <h2 className="font-display font-bold text-4xl md:text-5xl leading-tight">
                  Tu hésites encore ? Discute avec GoBot !
                </h2>
                <p className="text-xl text-gray-600 font-medium">
                  Notre assistant IA analyse tes passions pour te suggérer la meilleure mission pour ton week-end.
                </p>

                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border-2 border-black shadow-neo-sm">
                    <Zap className="text-brand-purple fill-brand-purple shrink-0" />
                    <span className="font-bold text-sm">Conseils personnalisés en temps réel</span>
                  </div>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border-2 border-black shadow-neo-sm">
                    <Star className="text-brand-yellow fill-brand-yellow shrink-0" />
                    <span className="font-bold text-sm">Matching basé sur l'âge et les centres d'intérêt</span>
                  </div>
                </div>
              </div>

              {/* Chatbot Interface Area */}
              <div className="flex-1 w-full flex justify-center">
                <ChatAssistant />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* METHOD GRID */}
      <section className="py-24 px-4 bg-gray-50 relative">
        <div className="container mx-auto relative z-10">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div className="text-center md:text-left w-full">
                <span className="font-bold text-brand-purple uppercase tracking-widest mb-2 block">Comment ça marche ?</span>
                <h2 className="font-display font-bold text-4xl md:text-6xl mb-6">La Méthode Sprint</h2>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto md:mx-0">
                  3 heures pour passer de "Je ne sais pas faire" à "Regarde ce que j'ai fait".
                </p>
              </div>
              <Link to="/programs" className="hidden md:block shrink-0">
                <Button variant="secondary" size="lg" className="mt-6 md:mt-0 shadow-neo">Voir le planning</Button>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: "1. On Choisit", desc: "Un thème qui passionne (Drone, IA, 3D...)", color: "bg-white" },
              { icon: Rocket, title: "2. On Pratique", desc: "80% de pratique, 20% d'explication. Zéro ennui.", color: "bg-brand-cyan" },
              { icon: Zap, title: "3. On Construit", desc: "Assemblage, codage, design en temps réel.", color: "bg-brand-pink" },
              { icon: Award, title: "4. On Célèbre", desc: "Présentation du projet et remise de certificat.", color: "bg-brand-green" },
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 100} className="h-full">
                <div className={`${feature.color} p-8 rounded-3xl border-4 border-black shadow-neo h-full flex flex-col hover:scale-105 transition-transform duration-300 relative overflow-hidden group`}>
                  {/* Conditional Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '40px 40px' }}></div>

                  <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/20 rounded-full group-hover:bg-brand-yellow/50 transition-colors z-10"></div>

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="bg-black text-white p-3 rounded-xl shadow-neo-sm group-hover:rotate-12 transition-transform border-2 border-white/20">
                      <feature.icon size={24} strokeWidth={3} />
                    </div>
                    <h3 className={`font-display font-bold text-xl ${feature.color === 'bg-brand-pink' ? 'text-white' : 'text-black'}`}>{feature.title}</h3>
                  </div>
                  <p className={`font-bold text-base leading-relaxed relative z-10 ${feature.color === 'bg-brand-pink' ? 'text-white' : 'text-gray-800'}`}>{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 md:hidden text-center">
            <Link to="/programs">
              <Button variant="secondary" size="lg" className="w-full justify-center">Voir le planning</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-4 mb-10">
        <ScrollReveal>
          <div className="container mx-auto">
            <div className="bg-brand-purple rounded-[2.5rem] md:rounded-[4rem] border-4 border-black p-8 md:p-24 text-center relative overflow-hidden shadow-neo-xl group hover:shadow-none hover:translate-y-2 transition-all duration-500">
              {/* Animated BG */}
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

              <div className="relative z-10">
                <h2 className="font-display font-bold text-4xl md:text-7xl text-white mb-8 drop-shadow-md leading-tight">
                  Prêt à impressionner <br /> tes amis ?
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link to="/programs" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-12 py-6 bg-brand-yellow border-4 border-black rounded-2xl font-bold text-xl md:text-2xl shadow-[8px_8px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
                      <Rocket size={32} strokeWidth={3} />
                      Voir les ateliers
                    </button>
                  </Link>
                </div>
                <div className="mt-8">
                  <span className="text-white font-bold text-base md:text-lg inline-block transform rotate-2 bg-black px-6 py-2 rounded-full border border-brand-green">
                    ⚠️ Places limitées à 10 par session !
                  </span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
};
