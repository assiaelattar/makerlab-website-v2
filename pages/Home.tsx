
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Rocket, Award, MessageCircle, ArrowRight, Star, Heart, Terminal, Cpu, Clock, Zap, CheckCircle, Smartphone, Gamepad, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';
import { VideoSection } from '../components/VideoSection';
import { PhotoGallery } from '../components/PhotoGallery';
import { FeaturedPrograms } from '../components/FeaturedPrograms';
import { LoopingBentoImage } from '../components/LoopingBentoImage';
import { KineticHero } from '../components/KineticHero';
import { useSettings } from '../contexts/SettingsContext';
import { SEO } from '../components/SEO';

export const Home: React.FC = () => {
  // Hero Text Slider State
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Fallback default cycles if none defined in Firebase settings
  const defaultMessages = [
    { id: '1', passive: "Ne fais pas que regarder", action: "CONSTRUIS", result: "ton propre robot", color: "brand-blue" },
    { id: '2', passive: "Ne fais pas que jouer", action: "CODE", result: "ton jeu vidéo", color: "brand-green" },
    { id: '3', passive: "N'achète pas seulement", action: "DESIGNE", result: "ton objet 3D", color: "brand-orange" },
    { id: '4', passive: "Ne fais pas que scroller", action: "CRÉE", result: "quelque chose de unique", color: "brand-red" },
  ];

  const { settings } = useSettings();
  const videoSettings = settings?.home_video || {
    videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "https://placehold.co/1920x1080/C0272D/ffffff.png?text=Classroom+Overview",
    title: "L'Académie en Action",
    description: "Découvre l'ambiance Makerlab : du code, de la 3D, des robots et beaucoup de fun !",
    theme: "red"
  };

  const dynamicMessages = settings?.hero_dynamic_messages && settings.hero_dynamic_messages.length > 0
    ? settings.hero_dynamic_messages
    : defaultMessages;

  useEffect(() => {
    const textInterval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setHeroTextIndex((prev) => (prev + 1) % dynamicMessages.length);
        setIsFading(false);
      }, 500); // wait for fade out
    }, 4500); // change every 4.5s

    return () => clearInterval(textInterval);
  }, [dynamicMessages.length]);

  const currentMessage = dynamicMessages[heroTextIndex];

  return (
    <div className="min-h-screen overflow-x-hidden pt-4 md:pt-16">
      <SEO 
        title="Cours de Robotique & Codage Enfants Casablanca"
        description="MakerLab Academy : Ateliers de robotique, codage Python, et impression 3D pour enfants et ados à Casablanca. Apprenez en construisant de vrais projets !"
        keywords="robotique enfants Casablanca, cours de codage enfants Maroc, activités enfants Casablanca, atelier robotique enfants, club de codage pour ados"
      />

      {/* HERO SECTION */}
      <section className="relative pb-20 md:pb-32 px-4 overflow-visible">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-red/40 rounded-none blur-3xl mix-blend-multiply filter opacity-70 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/40 rounded-none blur-3xl mix-blend-multiply filter opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">

          {/* Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start pt-8 lg:pr-16 z-20 relative">
            <div className="inline-flex items-center gap-2 bg-white border-4 border-black px-4 py-1.5 md:px-6 md:py-2 rounded-none font-bold mb-8 rotate-[-2deg] shadow-neo hover:rotate-0 transition-transform cursor-default">
              <span className="text-xl">👋</span>
              <span className="text-sm md:text-base tracking-wide uppercase font-display">Hey Future Tech Leader !</span>
            </div>

            <h1 className="font-display font-black text-3xl md:text-6xl lg:text-7xl text-black mb-6 leading-[1.1] tracking-tight uppercase">
              <span className={`block text-xl md:text-4xl text-gray-800 mb-1 transition-all duration-300 ${isFading ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
                {currentMessage.passive} —
              </span>
              <span className={`block my-2 md:my-4 text-5xl sm:text-6xl md:text-8xl lg:text-[140px] leading-[0.85] text-${currentMessage.color} drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] md:drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all duration-300 ${isFading ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100 blur-0'} hover:scale-105 origin-left`}>
                {currentMessage.action}
              </span>
              <span className={`block mt-2 md:mt-4 text-2xl md:text-4xl transition-all duration-300 delay-100 ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                {currentMessage.result}
              </span>
            </h1>

            <p className="text-base md:text-2xl text-gray-900 mb-8 max-w-lg mx-auto lg:mx-0 font-bold leading-relaxed">
              Transforme ton week-end. Choisis une mission de <span className="font-black bg-brand-red px-2 border-2 border-black rounded-none mx-1 text-white shadow-neo-sm transform -rotate-2 inline-block">3 heures</span> et repars avec ton propre projet tech.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/quiz" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" className="w-full text-xl py-5 uppercase tracking-wider bg-brand-orange text-black border-black hover:bg-brand-orange/90 flex items-center gap-2">
                  <Sparkles className="shrink-0 animate-pulse" strokeWidth={3} size={22} /> Trouver ma mission
                </Button>
              </Link>
              <Link to="/programs" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full text-xl py-5 bg-white hover:bg-gray-100 border-4 border-black uppercase tracking-wider">
                  Voir les Missions <ArrowRight className="ml-2" strokeWidth={3} />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visuals - Kinetic Bento Accordion */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-8 lg:mt-0 h-[280px] sm:h-[400px] md:h-[500px] md:h-[650px] w-full">
            <KineticHero 
              images1={settings?.hero_images?.home_bento_1} 
              images2={settings?.hero_images?.home_bento_2} 
              images3={settings?.hero_images?.home_bento_3} 
            />
          </div>
        </div>
      </section>

      {/* TARGET AUDIENCES SECTION (Pour qui ?) */}
      <section className="py-12 md:py-24 px-4 bg-white relative border-y-4 border-black">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
        <div className="container mx-auto relative z-10">
          <ScrollReveal>
            <div className="text-center mb-8 md:mb-16">
              <h2 className="font-display font-black text-3xl md:text-6xl mb-4 md:mb-6 uppercase tracking-tight">Pour qui ?</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">

            <Link to="/ecoles" className="group flex flex-col items-start bg-brand-blue p-5 md:p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-white border-4 border-black rounded-none mb-3 md:mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <CheckCircle size={20} strokeWidth={3} className="text-black md:w-8 md:h-8" />
              </div>
              <h3 className="font-display font-black text-base md:text-2xl mb-1 md:mb-3 text-white tracking-wide">Écoles & Institutions</h3>
              <p className="text-gray-50 font-medium text-xs md:text-base leading-relaxed hidden md:block">
                Installation de Makerspaces, visites et formations pour professeurs.
              </p>
            </Link>

            <Link to="/programs" className="group flex flex-col items-start bg-brand-green p-5 md:p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-white border-4 border-black rounded-none mb-3 md:mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <Rocket size={20} strokeWidth={3} className="text-black md:w-8 md:h-8" />
              </div>
              <h3 className="font-display font-black text-base md:text-2xl mb-1 md:mb-3 text-white tracking-wide">Enfants & Ados</h3>
              <p className="text-gray-50 font-medium text-xs md:text-base leading-relaxed hidden md:block">
                Programmes StemQuest, MakerLab Academy, et ateliers interactifs.
              </p>
            </Link>

            <Link to="/adultes" className="group flex flex-col items-start bg-brand-red text-white p-5 md:p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-white border-4 border-black rounded-none mb-3 md:mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <Cpu size={20} strokeWidth={3} className="text-black md:w-8 md:h-8" />
              </div>
              <h3 className="font-display font-black text-base md:text-2xl mb-1 md:mb-3 text-white tracking-wide">Adultes & Pros</h3>
              <p className="text-white font-medium text-xs md:text-base leading-relaxed hidden md:block">
                Formations pointues en IA, CAO, Impression 3D, et Business tech.
              </p>
            </Link>

            <Link to="/store" className="group flex flex-col items-start bg-brand-orange text-black p-5 md:p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-10 h-10 md:w-16 md:h-16 bg-white border-4 border-black rounded-none mb-3 md:mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <Terminal size={20} strokeWidth={3} className="text-black md:w-8 md:h-8" />
              </div>
              <h3 className="font-display font-black text-base md:text-2xl mb-1 md:mb-3 text-black tracking-wide">Le Store</h3>
              <p className="text-black font-medium text-xs md:text-base leading-relaxed hidden md:block">
                Achetez nos kits éducatifs ou réservez un atelier Masterclass.
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* FEATURED PROGRAMS SECTION */}
      <FeaturedPrograms />

      {/* VIDEO SHOWCASE SECTION */}
      <section className="py-20 md:py-32 px-4 bg-gray-50 border-t-4 border-black relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '100px 100px' }}></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <ScrollReveal>
            <VideoSection
              videoSrc={videoSettings.videoSrc}
              poster={videoSettings.poster}
              title={videoSettings.title}
              description={videoSettings.description}
              theme={videoSettings.theme}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* PARENTS SECTION */}
      <section className="py-12 md:py-24 px-4 bg-white relative border-t-4 border-black">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-20">
              <div className="inline-block bg-brand-green border-2 border-black px-4 py-1 rounded-full font-bold text-xs md:text-sm mb-3 md:mb-4 uppercase tracking-widest shadow-neo-sm">Pour les Parents</div>
              <h2 className="font-display font-bold text-3xl md:text-6xl mb-4 md:mb-6">Pourquoi ils adorent ?</h2>
              <p className="text-gray-500 text-base md:text-xl max-w-2xl mx-auto">
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
                bgColor: "bg-brand-blue",
                textColor: "text-white",
                rotate: "-rotate-2"
              },
              {
                title: "Confiance & Soft Skills",
                desc: "Présenter son projet, résoudre des bugs, travailler en équipe. C'est l'école de la vie, version Tech.",
                icon: Heart,
                bgColor: "bg-brand-red",
                textColor: "text-white",
                rotate: "rotate-2"
              },
              {
                title: "Communauté Fun",
                desc: "Ils rencontrent d'autres passionnés. L'ambiance est cool, bienveillante et stimulante. Zéro pression.",
                icon: Star,
                bgColor: "bg-brand-orange",
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


      {/* METHOD GRID */}
      <section className="py-12 md:py-24 px-4 bg-gray-50 relative">
        <div className="container mx-auto relative z-10">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div className="text-center md:text-left w-full">
                <span className="font-bold text-brand-red uppercase tracking-widest mb-2 block text-sm md:text-base">Comment ça marche ?</span>
                <h2 className="font-display font-bold text-3xl md:text-6xl mb-4 md:mb-6">La Méthode Sprint</h2>
                <p className="text-base md:text-xl text-gray-500 max-w-2xl mx-auto md:mx-0">
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
              { icon: Rocket, title: "2. On Pratique", desc: "80% de pratique, 20% d'explication. Zéro ennui.", color: "bg-brand-blue" },
              { icon: Zap, title: "3. On Construit", desc: "Assemblage, codage, design en temps réel.", color: "bg-brand-green" },
              { icon: Award, title: "4. On Célèbre", desc: "Présentation du projet et remise de certificat.", color: "bg-brand-red" },
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 100} className="h-full">
                <div className={`${feature.color} p-8 rounded-3xl border-4 border-black shadow-neo h-full flex flex-col hover:scale-105 transition-transform duration-300 relative overflow-hidden group`}>
                  {/* Conditional Pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '40px 40px' }}></div>

                  <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/20 rounded-full group-hover:bg-brand-orange/50 transition-colors z-10"></div>

                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="bg-black text-white p-3 rounded-xl shadow-neo-sm group-hover:rotate-12 transition-transform border-2 border-white/20">
                      <feature.icon size={24} strokeWidth={3} />
                    </div>
                    <h3 className={`font-display font-bold text-xl ${feature.color === 'bg-white' ? 'text-black' : 'text-white'}`}>{feature.title}</h3>
                  </div>
                  <p className={`font-bold text-base leading-relaxed relative z-10 ${feature.color === 'bg-white' ? 'text-gray-800' : 'text-white'}`}>{feature.desc}</p>
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

      {/* PHOTO GALLERY - Social Proof */}
      {settings?.gallery_general && settings.gallery_general.length > 0 && (
        <PhotoGallery 
          images={settings.gallery_general} 
          title="L'Expérience MakerLab"
          subtitle="Découvrez les coulisses de nos ateliers à travers les yeux de nos participants."
          large={true}
        />
      )}

      {/* CALL TO ACTION */}
      <section className="py-20 px-4 mb-10">
        <ScrollReveal>
          <div className="container mx-auto">
            <div className="bg-brand-red rounded-[2rem] md:rounded-[4rem] border-4 border-black p-6 md:p-24 text-center relative overflow-hidden shadow-neo-xl group hover:shadow-none hover:translate-y-2 transition-all duration-500">
              {/* Animated BG */}
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

              <div className="relative z-10">
                <h2 className="font-display font-bold text-3xl md:text-7xl text-white mb-6 md:mb-8 drop-shadow-md leading-tight">
                  Prêt à impressionner <br /> tes amis ?
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link to="/quiz" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-12 py-6 bg-brand-orange text-black border-4 border-black rounded-2xl font-bold text-xl md:text-2xl shadow-[8px_8px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
                      <Sparkles size={32} strokeWidth={3} className="animate-pulse" />
                      ✨ Trouver ma mission
                    </button>
                  </Link>
                  <Link to="/programs" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-10 py-5 bg-white text-black border-4 border-black/40 rounded-2xl font-bold text-xl md:text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-3">
                      <Rocket size={26} strokeWidth={3} />
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
