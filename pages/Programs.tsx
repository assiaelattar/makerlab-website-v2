import React from 'react';
import { ProgramCard } from '../components/ProgramCard';
import { ScrollReveal } from '../components/ScrollReveal';
import { usePrograms } from '../contexts/ProgramContext';

export const Programs: React.FC = () => {
  const { programs } = usePrograms();
  const activePrograms = programs.filter(p => p.active);

  return (
    <div className="min-h-screen py-16 md:py-20 px-4">
      <div className="container mx-auto">
        <ScrollReveal>
          {/* HEADER SECTION */}
          <section className="relative pb-16">
            <div className="bg-brand-pink border-4 border-black px-4 py-20 text-center relative overflow-hidden group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Abstract Background for Header */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-20"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-none blur-3xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>

              <div className="container mx-auto relative z-10">
                <h1 className="font-display font-black text-5xl md:text-7xl text-white mb-6 uppercase tracking-tight leading-tight drop-shadow-md">
                  Choisis Ta <span className="text-brand-yellow">Mission.</span>
                </h1>
                <p className="text-xl md:text-2xl text-white font-medium max-w-3xl mx-auto leading-relaxed">
                  Ici, on ne joue pas à "l'école". On construit le monde de demain. <br />
                  <span className="bg-black text-brand-yellow px-4 py-2 mt-4 inline-block transform -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black rounded-none font-black uppercase tracking-widest text-lg">Chaque atelier est un projet fini.</span>
                </p>
              </div>

              {/* Decorative bottom border */}
              <div className="absolute bottom-0 left-0 w-full h-4 border-t-4 border-black bg-brand-yellow"></div>
            </div>
          </section>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {activePrograms.length > 0 ? (
            activePrograms.map((program, index) => (
              <ScrollReveal key={program.id} delay={index * 100}>
                <ProgramCard program={program} index={index} />
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-2xl font-bold text-gray-400">Aucun atelier disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};