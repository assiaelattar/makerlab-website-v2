import React from 'react';
import { SEO } from '../components/SEO';
import { ProgramCard } from '../components/ProgramCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { usePrograms } from '../contexts/ProgramContext';
import { ParallaxGallery } from '../components/ParallaxGallery';
import { useSettings } from '../contexts/SettingsContext';
import { StatsBanner } from '../components/StatsBanner';
import { PhotoGallery } from '../components/PhotoGallery';

export const Programs: React.FC = () => {
  const { programs } = usePrograms();
  const { settings } = useSettings();
  const activePrograms = programs.filter(p => p.active);

  // Categorize programs based on format
  const kidsPrograms = activePrograms.filter(p => p.format !== 'School Program');
  const schoolPrograms = activePrograms.filter(p => p.format === 'School Program');
  const projectsGallery = settings?.home_projects;

  return (
    <div className="min-h-screen py-16 md:py-20 px-4">
      <SEO 
        title="Nos Programmes - Robotique & Codage"
        description="Explorez nos missions de 3h et nos programmes annuels : stage robotique Maroc, cours de codage Scratch et Python, impression 3D et plus encore."
        keywords="cours de robotique Maroc, stage programmation enfants, apprendre à coder Casablanca, cours Scratch Maroc, programmation Python enfants"
      />
      <div className="container mx-auto">
        <ScrollReveal>
          {/* HEADER SECTION */}
          <section className="relative pb-16">
            <div className="bg-brand-red border-4 border-black px-4 py-20 text-center relative overflow-hidden group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {settings?.hero_images?.hero_bg_programs && (
                <div className="absolute inset-0 z-0 opacity-40 mix-blend-multiply" style={{ backgroundImage: `url(${settings.hero_images.hero_bg_programs})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              )}
              {/* Abstract Background for Header */}
              <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>

              <div className="container mx-auto relative z-10">
                <h1 className="font-display font-black text-5xl md:text-7xl text-white mb-6 uppercase tracking-tight leading-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Tous Nos <span className="text-white">Programmes.</span>
                </h1>
                <p className="text-xl md:text-2xl text-white font-medium max-w-3xl mx-auto leading-relaxed">
                  Découvrez l'ensemble des offres MakerLab Academy, pour les jeunes explorateurs comme pour les établissements scolaires.
                </p>
              </div>

              {/* Decorative bottom border */}
              <div className="absolute bottom-0 left-0 w-full h-4 border-t-4 border-black bg-brand-orange"></div>
            </div>
          </section>
        </ScrollReveal>

        {/* KIDS PROGRAMS */}
        <div className="mb-24">
          <h2 className="font-display font-black text-4xl uppercase border-b-8 border-brand-orange pb-4 mb-8 inline-block">Enfants & Familles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kidsPrograms.length > 0 ? (
              kidsPrograms.map((program, index) => (
                <ScrollReveal key={program.id} delay={index * 100}>
                  <ProgramCard program={program} index={index} />
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