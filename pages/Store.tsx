import React, { useState } from 'react';
import { ArrowRight, Filter, Hammer, Layers, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppContainer, AppSectionHeader, AppShell, appAccentClasses } from '../components/AppStyle';
import { PremiumHero } from '../components/PremiumHero';
import { Reveal } from '../components/Motion';

const KITS_DATA = [
  {
    id: 'k1',
    name: 'Bras Robotique Hydraulique',
    category: 'Ingenierie Mecanique',
    age: '10-15 ans',
    price: 450,
    skills: ['Mecanique des fluides', 'Assemblage geometrique'],
    description: "Un vrai bras robotique actionne par la pression de l'eau.",
    image: 'https://images.unsplash.com/photo-1581092336203-8d69781ce7d0?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'k2',
    name: 'Lampe 3D Intelligente',
    category: 'Electronique & CAO',
    age: '12-18 ans',
    price: 350,
    skills: ['Modelisation 3D', 'LEDs et cablage'],
    description: "Une lampe d'ambiance fabriquee avec impression 3D et circuit LED.",
    image: 'https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'k3',
    name: 'Voiture Solaire de Course',
    category: 'Energies Renouvelables',
    age: '8-12 ans',
    price: 250,
    skills: ['Physique solaire', 'Transmission mecanique'],
    description: "Un mini-bolide solaire pour comprendre l'energie par la construction.",
    image: 'https://images.unsplash.com/photo-1590400512686-27ff15b6fb89?auto=format&fit=crop&q=80&w=900',
  },
];

export const Store: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const categories = ['Tous', ...Array.from(new Set(KITS_DATA.map(kit => kit.category)))];
  const filteredKits = selectedCategory === 'Tous' ? KITS_DATA : KITS_DATA.filter(kit => kit.category === selectedCategory);

  return (
    <AppShell className="pb-24 pt-5">
      <AppContainer>
        <PremiumHero
          eyebrow="MakerLab Store"
          title={<>Le laboratoire continue <span className="text-[#65e39a]">à la maison.</span></>}
          description="Des kits avec un objectif clair, les bonnes pièces et une expérience pensée pour apprendre en construisant."
          image={KITS_DATA[0].image}
          imageAlt="Kit de construction robotique MakerLab"
          accent="green"
          primary={{ label: 'Explorer les kits', to: '/store' }}
          secondary={{ label: 'Demander conseil', to: '/contact' }}
          stats={[
            [`${KITS_DATA.length}`, 'kits disponibles'],
            ['8-18', 'ans'],
            ['1', 'projet complet'],
            ['100%', 'prêt à construire'],
          ]}
        />

        <section className="py-8">
          <div className="ml-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.15em] text-slate-400">
              <Filter size={16} /> Filtrer par univers
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`ml-chip ${selectedCategory === category ? 'border-brand-orange bg-brand-orange text-white' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section>
          <AppSectionHeader
            eyebrow="Kits"
            title="Un projet complet, pas une boîte de pièces."
            text="Chaque kit précise l’âge, les compétences développées et le projet final avant l’achat."
            accent="text-brand-green"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredKits.map((kit, index) => (
              <Reveal key={kit.id} delay={(index % 3) * 90}>
              <article className="ml-card ml-card-interactive group overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={kit.image} alt={kit.name} className="ml-image-zoom h-full w-full object-cover" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase">{kit.age}</span>
                  <span className={`absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl ${appAccentClasses[index % appAccentClasses.length]} text-white`}>
                    <Tag size={21} />
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-brand-orange">{kit.category}</p>
                  <h2 className="mt-2 text-2xl font-black leading-tight">{kit.name}</h2>
                  <p className="mt-3 min-h-[72px] font-semibold leading-6 text-slate-500">{kit.description}</p>
                  <div className="mt-4 rounded-2xl bg-[#f7f7f4] p-4">
                    <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-slate-400">
                      <Layers size={15} /> Compétences
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {kit.skills.map(skill => (
                        <span key={skill} className="rounded-full bg-white px-3 py-1 text-[10px] font-black">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-[0.8fr_1.2fr] gap-3">
                    <Link to={`/contact?subject=kit&kit=${encodeURIComponent(kit.name)}`} className="ml-button bg-brand-orange px-4 text-white">{kit.price} DHS</Link>
                    <Link to={`/contact?subject=kit&kit=${encodeURIComponent(kit.name)}`} className="ml-button bg-brand-blue px-4 text-white">
                      Être conseillé <Hammer size={17} />
                    </Link>
                  </div>
                </div>
              </article>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
        <section className="pt-10">
          <div className="rounded-lg bg-brand-orange p-6 text-white shadow-2xl md:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-4xl font-black leading-none md:text-5xl">Vous hésitez entre deux kits ?</h2>
              <p className="mx-auto mt-5 max-w-xl text-lg font-semibold leading-8 text-white/80">Dites-nous l’âge et les passions de votre enfant. Nous vous recommandons le bon niveau.</p>
              <Link to="/contact?subject=kit" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-black text-[#111]">
                Demander conseil <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
        </Reveal>
      </AppContainer>
    </AppShell>
  );
};
