import React from 'react';
import { SEO } from '../components/SEO';
import { ProgramCard } from '../components/ProgramCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { usePrograms } from '../contexts/ProgramContext';
import { useMissions } from '../contexts/MissionContext';
import { ParallaxGallery } from '../components/ParallaxGallery';
import { useSettings } from '../contexts/SettingsContext';
import { StatsBanner } from '../components/StatsBanner';
import { PhotoGallery } from '../components/PhotoGallery';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';

export const Programs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [selectedAge, setSelectedAge] = React.useState<string>('All');
  const [showFilters, setShowFilters] = React.useState(false);
  
  const { programs } = usePrograms();
  const { missions } = useMissions();
  const { settings } = useSettings();
  const activePrograms = programs.filter(p => p.active);
  
  // Dynamic Categorical Data from Admin Context
  const categories = React.useMemo(() => {
    const rawCategories = Array.from(new Set(activePrograms.map(p => p.category).filter(Boolean)));
    const essential = ['All', 'Stages Vacances', 'Unitaires (3h)', 'Drones'];
    return Array.from(new Set([...essential, ...rawCategories]));
  }, [activePrograms]);

  const ages = ['All', '7-11 ans', '12-17 ans', 'Adultes'];

  // Mission Finder Logic: Filter based on UI selection
  const filteredPrograms = activePrograms.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    // Simple age mapping if not explicitly in the data
    const matchesAge = selectedAge === 'All' || 
      (selectedAge === '7-11 ans' && (p.ageGroup?.includes('7') || !p.ageGroup)) ||
      (selectedAge === '12-17 ans' && (p.ageGroup?.includes('12') || p.ageGroup?.includes('17'))) ||
      (selectedAge === 'Adultes' && (p.category === 'Business' || p.category === 'Entrepreneuriat'));
    
    return matchesCategory && matchesAge;
  });

  // Combine missions for "Units" or "All"
  const relevantMissions = React.useMemo(() => {
    if (selectedCategory !== 'All' && selectedCategory !== 'Unitaires (3h)') return [];
    
    return missions.filter(m => {
      const matchesAge = selectedAge === 'All' || 
        (selectedAge === '7-11 ans' && (m.category.includes('Enfant') || m.title.includes('Kids'))) ||
        (selectedAge === '12-17 ans' && (m.category.includes('Ado') || m.title.includes('Teen')));
      return m.active && matchesAge;
    });
  }, [missions, selectedCategory, selectedAge]);

  const kidsPrograms = [
    ...filteredPrograms.filter(p => 
      p.category === 'Enfants & Familles' || 
      (['Coding', 'Robotics', 'AI', 'Design'].includes(p.category)) ||
      (p.format !== 'School Program' && p.category !== 'Écoles & Éducation')
    ),
    ...relevantMissions
  ];
  
  const schoolPrograms = filteredPrograms.filter(p => 
    p.category === 'Écoles & Éducation' || 
    p.category === 'Entrepreneuriat' ||
    p.category === 'Business' ||
    p.format === 'School Program'
  );
  const projectsGallery = settings?.home_projects;

  return (
    <div className="min-h-screen py-16 md:py-20 px-4">
      <SEO 
        title="Missions & Ateliers Robotique Casablanca" 
        description="Parcours Ateliers Drone, Stages de Vacances Coding et Camp Robotique à Casablanca. Choisissez votre mission technologique et devenez un Maker !"
        keywords="robotique casablanca, camp robotique casablanca, stage vacances enfant casablanca, atelier drone maroc, coding for kids"
      />
      <div className="container mx-auto">
        <ScrollReveal>
          {/* HEADER SECTION — compact on mobile */}
          <section className="relative pb-6 md:pb-12">
            <div className="bg-brand-red border-4 border-black px-4 py-8 md:py-24 text-center relative overflow-hidden group shadow-neo-xl">
              <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
              <div className="container mx-auto relative z-10">
                <h1 className="font-display font-black text-3xl md:text-8xl text-white mb-2 md:mb-6 uppercase tracking-tight leading-[0.9] drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] md:drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                  Trouve ta <span className="text-white underline decoration-brand-orange">Mission.</span>
                </h1>
                <p className="text-sm md:text-2xl text-white/80 font-bold max-w-2xl mx-auto">
                  Filtre ton expérience MakerLAB par âge et technologie.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── MOBILE: Filter toggle button ───────────────────────────── */}
        <div className="md:hidden flex items-center justify-between mb-3 px-0">
          <button
            onClick={() => setShowFilters(v => !v)}
            className="flex items-center gap-2 bg-black text-white font-black text-xs uppercase tracking-widest px-4 py-2.5 border-2 border-black shadow-[3px_3px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <SlidersHorizontal size={13} strokeWidth={3} />
            Filtrer
            {(selectedCategory !== 'All' || selectedAge !== 'All') && (
              <span className="bg-brand-orange text-black rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-black">
                {(selectedCategory !== 'All' ? 1 : 0) + (selectedAge !== 'All' ? 1 : 0)}
              </span>
            )}
            <ChevronDown size={13} strokeWidth={3} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          {(selectedCategory !== 'All' || selectedAge !== 'All') && (
            <button
              onClick={() => { setSelectedCategory('All'); setSelectedAge('All'); }}
              className="flex items-center gap-1 text-xs font-black text-brand-red uppercase tracking-wider"
            >
              <X size={12} strokeWidth={3} /> Effacer
            </button>
          )}
        </div>

        {/* MISSION FINDER UI — collapsible on mobile, always visible on desktop */}
        <section className={`mb-6 md:mb-16 relative z-20 container mx-auto flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center justify-center md:-mt-10 ${
          showFilters ? 'flex' : 'hidden md:flex'
        }`}>
            <div className="bg-white border-4 border-black p-3 md:p-4 shadow-neo flex flex-wrap gap-1.5 md:gap-2 justify-center w-full md:w-auto">
                <span className="w-full text-center text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Thématique</span>
                {categories.map(cat => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                        className={`px-2.5 py-1.5 md:px-4 md:py-2 border-2 border-black font-black text-[10px] md:text-sm uppercase transition-all shadow-neo-sm ${selectedCategory === cat ? 'bg-brand-blue text-white rotate-1 scale-105' : 'bg-white text-black hover:bg-gray-100'}`}>
                        {cat === 'All' ? 'Tous' : cat}
                    </button>
                ))}
            </div>
            <div className="bg-white border-4 border-black p-3 md:p-4 shadow-neo flex flex-wrap gap-1.5 md:gap-2 justify-center w-full md:w-auto">
                <span className="w-full text-center text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Âge</span>
                {ages.map(age => (
                    <button key={age} onClick={() => setSelectedAge(age)}
                        className={`px-2.5 py-1.5 md:px-4 md:py-2 border-2 border-black font-black text-[10px] md:text-sm uppercase transition-all shadow-neo-sm ${selectedAge === age ? 'bg-brand-orange text-black -rotate-1 scale-105' : 'bg-white text-black hover:bg-gray-100'}`}>
                        {age === 'All' ? 'Tous' : age}
                    </button>
                ))}
            </div>
        </section>

        {/* KIDS PROGRAMS */}
        <div className="mb-24">
          <h2 className="font-display font-black text-4xl uppercase border-b-8 border-brand-orange pb-4 mb-8 inline-block">Enfants & Familles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kidsPrograms.length > 0 ? (
              kidsPrograms.map((item, index) => (
                <ScrollReveal key={item.id} delay={index * 100}>
                  <ProgramCard program={item as any} index={index} />
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-full py-10">
                <p className="text-xl font-bold text-gray-400">Aucun programme enfant disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* SCHOOL PROGRAMS */}
        <div className="mb-20">
          <h2 className="font-display font-black text-4xl uppercase border-b-8 border-brand-red pb-4 mb-8 inline-block">Écoles & Éducation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schoolPrograms.length > 0 ? (
              schoolPrograms.map((program, index) => (
                <ScrollReveal key={program.id} delay={index * 100}>
                  <ProgramCard program={program} index={index} />
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-full py-10">
                <p className="text-xl font-bold text-gray-400">Aucun programme école disponible pour le moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* STATS BANNER — After programs */}
        <div className="mb-20">
            <StatsBanner stats={settings?.key_stats || []} variant="cyan" />
        </div>

        {/* Gallery Section at the bottom */}
        {settings?.gallery_programs?.length > 0 && (
          <div className="mb-20">
            <PhotoGallery 
              images={settings.gallery_programs} 
              title="Impact MakerLab" 
              subtitle="L'excellence technologique en action." 
              bgDark={true}
            />
          </div>
        )}

        <ScrollReveal>
          <section className="mt-12 bg-white border-4 border-black shadow-neo overflow-hidden rounded-[2.5rem] mb-12">
            <ParallaxGallery projects={projectsGallery} title="Découvre les réalisations" subtitle="Voici ce que nos Makers ont créé !" />
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
};