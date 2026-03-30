
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Rocket, Award, MessageCircle, ArrowRight, Star, Heart, Terminal, Cpu, Clock, Zap, CheckCircle, Smartphone, Gamepad } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/ScrollReveal';
import { VideoSection } from '../components/VideoSection';
import { PhotoGallery } from '../components/PhotoGallery';
import { FeaturedPrograms } from '../components/FeaturedPrograms';
import { LoopingBentoImage } from '../components/LoopingBentoImage';
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
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
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
    <div className="min-h-screen overflow-x-hidden pt-8 md:pt-16">
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

            <h1 className="font-display font-black text-4xl md:text-6xl lg:text-7xl text-black mb-8 leading-[1.1] tracking-tight uppercase">
              <span className={`block text-2xl md:text-4xl text-gray-800 mb-2 transition-all duration-300 ${isFading ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
                {currentMessage.passive} —
              </span>
              <span className={`block my-4 text-7xl md:text-8xl lg:text-[140px] leading-[0.8] text-${currentMessage.color} drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] transition-all duration-300 ${isFading ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100 blur-0'} hover:scale-105 origin-left`}>
                {currentMessage.action}
              </span>
              <span className={`block mt-4 transition-all duration-300 delay-100 ${isFading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                {currentMessage.result}
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-900 mb-10 max-w-lg mx-auto lg:mx-0 font-bold leading-relaxed">
              Transforme ton week-end. Choisis une mission de <span className="font-black bg-brand-red px-2 border-2 border-black rounded-none mx-1 text-white shadow-neo-sm transform -rotate-2 inline-block">3 heures</span> et repars avec ton propre projet tech.
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

          {/* Right Visuals - Dynamic Bento Collage */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-12 lg:mt-0 h-[500px] md:h-[650px] w-full">
            <div className="relative w-full max-w-lg h-full perspective-1000">

              {/* Center Large Card: Robotics */}
              <div className="absolute top-4 right-8 bottom-12 left-4 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden group hover:shadow-none hover:-translate-y-2 hover:translate-x-2 transition-all duration-300 z-10 cursor-pointer">
                <LoopingBentoImage 
                  images={settings?.hero_images?.home_bento_1} 
                  className="group-hover:scale-110 transition-transform duration-700" 
                  alt="Robotics Program" 
                />

                {/* Gradient Overlay for Text Visibility */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent"></div>

                {/* Text Overlay (Top) */}
                <div className="absolute top-4 left-4">
                  <span className="bg-[#27A060] text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">Programme "Make & Go"</span>
                </div>

                {/* Text Overlay (Bottom) */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white border-4 border-black p-4 transform -rotate-2 shadow-neo-sm group-hover:rotate-0 transition-transform">
                    <h3 className="font-display font-black text-2xl lg:text-3xl uppercase leading-[0.9] mb-2 text-black">
                      Real Machines.<br />No Kits.
                    </h3>
                    <div className="w-16 h-1 bg-[#C0272D] mb-2"></div>
                    <p className="font-bold text-xs lg:text-sm text-gray-800 leading-snug">Design and assemble an industrial-spec rover. If it works, it's not a toy.</p>
                  </div>
                </div>
              </div>

              {/* Top Right Card: Drone App */}
              <div className="absolute -top-8 -right-4 w-44 h-48 md:w-56 md:h-56 bg-brand-blue border-4 border-black shadow-neo rounded-2xl overflow-hidden group z-20 transform rotate-6 hover:-translate-y-2 hover:rotate-3 transition-all duration-300 cursor-pointer">
                <LoopingBentoImage 
                  images={settings?.hero_images?.home_bento_2} 
                  className="grayscale mix-blend-multiply opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                  alt="Drone App Building" 
                />

                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/80 to-transparent"></div>

                <div className="absolute top-3 left-3">
                  <span className="bg-[#C0272D] text-white px-2 py-0.5 text-[10px] font-bold rounded-full uppercase">Drone App Building</span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-black p-3">
                  <h4 className="font-display font-black text-sm uppercase text-black leading-tight drop-shadow-sm">Build Your Drone App.</h4>
                </div>
              </div>

              {/* Bottom Left Card: Book Design */}
              <div className="absolute bottom-4 -left-6 md:-left-12 w-40 h-44 md:w-48 md:h-52 bg-brand-orange border-4 border-black shadow-neo rounded-2xl overflow-hidden group z-20 transform -rotate-6 hover:-translate-y-2 hover:rotate-0 transition-all duration-300 cursor-pointer flex flex-col justify-between">
                <LoopingBentoImage 
                  images={settings?.hero_images?.home_bento_3} 
                  className="filter brightness-75 group-hover:brightness-100 transition-all duration-500" 
                  alt="Book Design & Binding" 
                />

                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-brand-blue text-white px-2 py-0.5 text-[10px] font-bold rounded-full uppercase shadow-neo-sm">Book Design & Binding</span>
                </div>

                <div className="relative z-10 bg-black text-white p-3 border-t-4 border-black mt-auto backdrop-blur-sm bg-black/80">
                  <h4 className="font-display font-black text-sm uppercase leading-tight mb-1 shadow-black drop-shadow-lg">Design. Print. Bind. Your Story.</h4>
                </div>
              </div>

              {/* Floating Tag Ticket */}
              <div className="absolute top-1/2 -left-16 bg-white text-black border-4 border-black px-4 py-3 rounded-none transform -rotate-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none animate-float z-30 cursor-pointer hidden md:flex items-center gap-2">
                <div className="border-r-2 border-dashed border-gray-400 pr-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 leading-none mb-1">Duration: 3H</p>
                  <p className="font-black text-base leading-none">249 DHS <span className="text-[10px] font-normal uppercase">/ Workshop</span></p>
                </div>
                <p className="font-display font-black uppercase text-xs pt-1">Book<br />Now</p>

                {/* Decorative Ticket Holes */}
                <div className="absolute top-1/2 -left-2 w-4 h-4 rounded-full bg-gray-50 border-r-4 border-black transform -translate-y-1/2"></div>
                <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-gray-50 border-l-4 border-black transform -translate-y-1/2"></div>
              </div>

              {/* Background Decorative Blobs */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-blue rounded-full filter blur-2xl opacity-60 animate-pulse mix-blend-multiply z-0 pointer-events-none"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-brand-green rounded-full filter blur-2xl opacity-60 animate-pulse animation-delay-2000 mix-blend-multiply z-0 pointer-events-none"></div>
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

            <Link to="/ecoles" className="group flex flex-col items-start bg-brand-blue p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-16 h-16 bg-white border-4 border-black rounded-none mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <CheckCircle size={32} strokeWidth={3} className="text-black" />
              </div>
              <h3 className="font-display font-black text-2xl mb-3 text-white tracking-wide">Écoles & Institutions</h3>
              <p className="text-gray-50 font-medium text-base leading-relaxed">
                Installation de Makerspaces, visites et formations pour professeurs.
              </p>
            </Link>

            <Link to="/programs" className="group flex flex-col items-start bg-brand-green p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-16 h-16 bg-white border-4 border-black rounded-none mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <Rocket size={32} strokeWidth={3} className="text-black" />
              </div>
              <h3 className="font-display font-black text-2xl mb-3 text-white tracking-wide">Enfants & Ados</h3>
              <p className="text-gray-50 font-medium text-base leading-relaxed">
                Programmes StemQuest, Make & Go, et ateliers interactifs ("No Legos").
              </p>
            </Link>

            <Link to="/adultes" className="group flex flex-col items-start bg-brand-red text-white p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-16 h-16 bg-white border-4 border-black rounded-none mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <Cpu size={32} strokeWidth={3} className="text-black" />
              </div>
              <h3 className="font-display font-black text-2xl mb-3 text-white tracking-wide">Adultes & Pros</h3>
              <p className="text-white font-medium text-base leading-relaxed">
                Formations pointues en IA, CAO, Impression 3D, et Business tech.
              </p>
            </Link>

            <Link to="/store" className="group flex flex-col items-start bg-brand-orange text-black p-8 border-4 border-black shadow-neo hover:translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="w-16 h-16 bg-white border-4 border-black rounded-none mb-6 flex items-center justify-center shadow-neo-sm group-hover:rotate-12 transition-transform">
                <Terminal size={32} strokeWidth={3} className="text-black" />
              </div>
              <h3 className="font-display font-black text-2xl mb-3 text-black tracking-wide">Le Store (Familles)</h3>
              <p className="text-black font-medium text-base leading-relaxed">
                Achetez nos kits éducatifs ou réservez un atelier Masterclass de fabrication.
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
      <section className="py-24 px-4 bg-gray-50 relative">
        <div className="container mx-auto relative z-10">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div className="text-center md:text-left w-full">
                <span className="font-bold text-brand-red uppercase tracking-widest mb-2 block">Comment ça marche ?</span>
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
            <div className="bg-brand-red rounded-[2.5rem] md:rounded-[4rem] border-4 border-black p-8 md:p-24 text-center relative overflow-hidden shadow-neo-xl group hover:shadow-none hover:translate-y-2 transition-all duration-500">
              {/* Animated BG */}
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

              <div className="relative z-10">
                <h2 className="font-display font-bold text-4xl md:text-7xl text-white mb-8 drop-shadow-md leading-tight">
                  Prêt à impressionner <br /> tes amis ?
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link to="/programs" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-12 py-6 bg-brand-red text-white border-4 border-black rounded-2xl font-bold text-xl md:text-2xl shadow-[8px_8px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3">
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
