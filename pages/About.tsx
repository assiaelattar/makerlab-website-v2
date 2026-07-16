import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Briefcase, Code2, Cpu, Gamepad2, Lightbulb, Palette, Printer, ShieldCheck, Wrench } from 'lucide-react';
import { SEO } from '../components/SEO';
import { AppCard, AppContainer, AppSectionHeader, AppShell, appAccentClasses } from '../components/AppStyle';
import { PremiumHero } from '../components/PremiumHero';
import { Reveal } from '../components/Motion';

const heroImage = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1400&auto=format&fit=crop';

export const About: React.FC = () => {
  return (
    <AppShell className="pb-24 pt-5">
      <SEO
        title="A Propos - MakerLab Academy Casablanca"
        description="MakerLab Academy, centre STEM a Casablanca pour robotique, codage, IA et impression 3D."
        keywords="STEM education Morocco, activites STEM enfants Maroc, ateliers scientifiques Casablanca"
      />
      <AppContainer>
        <PremiumHero
          eyebrow="À propos de MakerLab"
          title={<>La technologie ne se regarde pas. <span className="text-brand-orange">Elle se construit.</span></>}
          description="MakerLab est une académie STEM où les enfants imaginent, conçoivent, codent, testent et présentent de vrais projets."
          image={heroImage}
          imageAlt="Espace de fabrication MakerLab"
          accent="orange"
          primary={{ label: 'Explorer les programmes', to: '/programs' }}
          secondary={{ label: 'Visiter le lab', to: '/contact' }}
          stats={[
            ['500+', 'makers formés'],
            ['6', 'disciplines'],
            ['80%', 'de pratique'],
            ['1', 'projet par mission'],
          ]}
        />

        <section className="py-10">
          <AppSectionHeader
            eyebrow="Notre méthode"
            title="Une boucle d’ingénierie simple que les enfants vivent vraiment."
            text="Chaque mission avance par étapes claires : une idée, des choix, un prototype, des essais et une présentation."
          />
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { title: 'Imaginer', text: 'Partir d’un problème ou d’une idée créative.', icon: Lightbulb, color: 'bg-brand-orange' },
              { title: 'Concevoir', text: 'Utiliser des outils numériques et de vraies contraintes.', icon: Palette, color: 'bg-brand-blue' },
              { title: 'Construire', text: 'Prototyper avec l’électronique et la fabrication.', icon: Wrench, color: 'bg-brand-green' },
              { title: 'Améliorer', text: 'Tester, corriger et présenter le résultat.', icon: ShieldCheck, color: 'bg-brand-red' },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
              <AppCard className="ml-card-interactive min-h-[240px] p-5">
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${item.color} text-white`}>
                  <item.icon size={23} />
                </div>
                <h3 className="text-2xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{item.text}</p>
              </AppCard>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal>
        <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <AppCard className="bg-brand-blue p-6 text-white md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-white/65">Pourquoi les parents nous font confiance</p>
            <h2 className="mt-3 font-display text-4xl font-black leading-none">Des progrès visibles à chaque session.</h2>
            <p className="mt-5 text-lg font-semibold leading-8 text-white/75">
              Chaque expérience vise un résultat concret que la famille peut voir : un robot, un jeu, une maquette, un prototype ou une présentation.
            </p>
          </AppCard>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Robotique', icon: Bot },
              { title: 'Code & IA', icon: Code2 },
              { title: 'Design 3D', icon: Printer },
              { title: 'Création de jeux', icon: Gamepad2 },
              { title: 'Électronique', icon: Cpu },
              { title: 'Entrepreneuriat', icon: Briefcase },
            ].map((station, index) => (
              <AppCard key={station.title} className="p-5">
                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${appAccentClasses[index % appAccentClasses.length]} text-white`}>
                  <station.icon size={21} />
                </div>
                <h3 className="text-xl font-black">{station.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Un univers pratique intégré au parcours d’apprentissage MakerLab.</p>
              </AppCard>
            ))}
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['De vrais outils', 'Imprimantes 3D, électronique, capteurs, code et équipements de fabrication.'],
              ['Des mentors présents', 'Des adultes qui rendent le travail sûr, clair et stimulant.'],
              ['Des compétences durables', 'Confiance, créativité et résolution de problèmes au-delà de la classe.'],
            ].map(([title, text], index) => (
              <div key={title} className={`rounded-lg p-6 text-white shadow-lg ${appAccentClasses[index % appAccentClasses.length]}`}>
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="mt-3 font-semibold leading-7 text-white/82">{text}</p>
              </div>
            ))}
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section>
          <div className="rounded-lg bg-brand-green p-6 text-white shadow-2xl md:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-display text-4xl font-black leading-none md:text-5xl">Prêt à voir le laboratoire en action ?</h2>
              <p className="mx-auto mt-5 max-w-xl text-lg font-semibold leading-8 text-white/75">
                La meilleure façon de comprendre MakerLab est de voir ce que les enfants construisent.
              </p>
              <Link to="/programs" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-black text-[#111]">
                Voir les programmes <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
        </Reveal>
      </AppContainer>
    </AppShell>
  );
};
