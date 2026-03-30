
import React from 'react';
import { usePrograms } from '../contexts/ProgramContext';
import { ProgramCard } from './ProgramCard';
import { ScrollReveal } from './ScrollReveal';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturedPrograms: React.FC = () => {
  const { programs } = usePrograms();
  const featured = programs.filter(p => p.isFeatured && p.active).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-orange border-4 border-black font-black text-sm uppercase tracking-widest mb-4 shadow-neo-sm rotate-[-1deg]">
                    <Sparkles size={18} /> Sélection MakerLab
                </div>
                <h2 className="font-display font-black text-4xl md:text-6xl uppercase leading-tight">
                    Programmes <span className="text-brand-red underline decoration-8 decoration-black underline-offset-4">En Vedette</span>
                </h2>
                <p className="text-xl font-bold mt-4 text-gray-700">
                    Nos parcours les plus plébiscités pour transformer vos enfants en créateurs de technologie.
                </p>
            </ScrollReveal>
          </div>
          
          <ScrollReveal delay={200}>
            <Link to="/programs">
                <button className="group flex items-center gap-2 bg-black text-white px-8 py-4 border-4 border-black font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                    Voir tout <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featured.map((program, index) => (
            <ScrollReveal key={program.id} delay={index * 150}>
              <ProgramCard program={program} index={index + 2} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
