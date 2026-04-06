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

export const Programs: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');
  const [selectedAge, setSelectedAge] = React.useState<string>('All');
  
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
      (selectedAge === '7-11 ans' && (p.ageRange?.includes('7') || !p.ageRange)) ||
      (selectedAge === '12-17 ans' && (p.ageRange?.includes('12') || p.ageRange?.includes('17'))) ||
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
          {/* HEADER SECTION */}
          <section className="relative pb-12">
            <div className="bg-brand-red border-4 border-black px-4 py-16 md:py-24 text-center relative overflow-hidden group shadow-neo-xl">
              {/* Abstract Background for Header */}
              <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>

              <div className="container mx-auto relative z-10">
                <h1 className="font-display font-black text-5xl md:text-8xl text-white mb-6 uppercase tracking-tight leading-[0.9] drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                  Trouve ta <br /> <span className="text-white underline decoration-brand-orange">Mission.</span>
                </h1>
                <p className="text-xl md:text-2xl text-white font-bold max-w-2xl mx-auto leading-relaxed group-hover:scale-105 transition-transform duration-500">
                  Filtre ton expérience MakerLAB par âge et technologie.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* MISSION FINDER UI */}
        <section className="mb-16 -mt-10 relative z-20 container mx-auto flex flex-col md:flex-row gap-6 items-center justify-center">
            {/* Category Filter */}
            <div className="bg-white border-4 border-black p-4 shadow-neo flex flex-wrap gap-2 justify-center">
                <span className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Thématique</span>
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 border-2 border-black font-black text-sm uppercase transition-all shadow-neo-sm hover:-translate-y-1 ${selectedCategory === cat ? 'bg-brand-blue text-white rotate-1 scale-110 active:rotate-0' : 'bg-white text-black hover:bg-gray-100'}`}
                    >
                        {cat === 'All' ? 'Tous' : cat}
                    </button>
                ))}
            </div>

            {/* Age Filter */}
            <div className="bg-white border-4 border-black p-4 shadow-neo flex flex-wrap gap-2 justify-center">
                <span className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Âge</span>
                {ages.map(age => (
                    <button 
                        key={age}
                        onClick={() => setSelectedAge(age)}
                        className={`px-4 py-2 border-2 border-black font-black text-sm uppercase transition-all shadow-neo-sm hover:-translate-y-1 ${selectedAge === age ? 'bg-brand-orange text-black -rotate-1 scale-110 active:rotate-0' : 'bg-white text-black hover:bg-gray-100'}`}
                    >
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