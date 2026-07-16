import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Code2,
  Cpu,
  Hammer,
  Lightbulb,
  Play,
  Printer,
  ScanSearch,
  Sparkles,
  TestTube2,
  Wrench,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { HomeMotion } from '../components/HomeMotion';
import { usePrograms } from '../contexts/ProgramContext';
import { useSettings } from '../contexts/SettingsContext';

const fallbackImages = [
  'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=88&w=1800',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=88&w=1400',
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=88&w=1400',
  'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=88&w=1400',
];

const disciplines = [
  { label: 'Robotique', icon: Bot, color: 'text-brand-orange' },
  { label: 'Code', icon: Code2, color: 'text-brand-blue' },
  { label: 'Intelligence artificielle', icon: Sparkles, color: 'text-brand-red' },
  { label: 'Design 3D', icon: Printer, color: 'text-brand-green' },
  { label: 'Électronique', icon: Cpu, color: 'text-[#b07c00]' },
  { label: 'Fabrication', icon: Hammer, color: 'text-brand-orange' },
];

const buildSteps = [
  { title: 'Imaginer', icon: Lightbulb, color: 'bg-brand-orange' },
  { title: 'Concevoir', icon: Wrench, color: 'bg-brand-blue' },
  { title: 'Fabriquer', icon: Hammer, color: 'bg-brand-green' },
  { title: 'Programmer', icon: Code2, color: 'bg-brand-red' },
  { title: 'Tester', icon: TestTube2, color: 'bg-[#7656d8]' },
  { title: 'Présenter', icon: Play, color: 'bg-[#b07c00]' },
];

const formats = [
  {
    eyebrow: 'Première découverte',
    title: 'Mission de 3 heures',
    text: 'Un projet complet, du premier essai au résultat final.',
    detail: 'Idéal pour commencer',
    to: '/programs',
    icon: Cpu,
    accent: 'text-brand-orange',
    iconBg: 'bg-brand-orange/10',
  },
  {
    eyebrow: 'Vacances',
    title: 'Camp intensif',
    text: 'Plusieurs jours pour explorer, fabriquer et progresser.',
    detail: 'Pour aller plus loin',
    to: '/programs',
    icon: Sparkles,
    accent: 'text-brand-green',
    iconBg: 'bg-brand-green/10',
  },
  {
    eyebrow: 'Toute l’année',
    title: 'Parcours annuel',
    text: 'Une progression régulière autour de projets de plus en plus ambitieux.',
    detail: 'Pour construire des bases solides',
    to: '/programs',
    icon: Bot,
    accent: 'text-brand-blue',
    iconBg: 'bg-brand-blue/10',
  },
];

export const Home: React.FC = () => {
  const { programs } = usePrograms();
  const { settings } = useSettings();
  const activePrograms = programs.filter(program => program.active);
  const featured = activePrograms.filter(program => program.isFeatured).slice(0, 3);
  const displayPrograms = featured.length ? featured : activePrograms.slice(0, 3);
  const configuredImages = ['home_bento_2', 'home_bento_3'].flatMap(key => {
    const value = settings?.hero_images?.[key];
    return Array.isArray(value) ? value : value ? [value] : [];
  });
  const realImages = activePrograms
    .map(program => program.image)
    .filter(image => image && !image.includes('placehold.co'));
  const imagePool = [...configuredImages, ...realImages];
  const images = fallbackImages.map((fallback, index) => imagePool[index] || fallback);

  return (
    <main className="makerlab-site min-h-screen overflow-x-hidden bg-white text-slate-900">
      <SEO
        title="MakerLab Academy | Construire la technologie"
        description="MakerLab aide les enfants de 6 à 16 ans à concevoir, coder et fabriquer de vrais projets."
        keywords="robotique enfants Casablanca, coding enfants Maroc, atelier IA, impression 3D"
      />
      <HomeMotion />

      <section className="px-3 md:px-6">
        <div className="relative mx-auto min-h-[570px] max-w-[1500px] overflow-hidden rounded-lg bg-[#08111f] md:h-[560px] md:min-h-0">
          <img
            src={images[0]}
            alt="Une jeune maker construit son projet au laboratoire"
            loading="eager"
            fetchPriority="high"
            className="absolute inset-0 size-full object-cover object-center md:object-[68%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,13,25,.96)_0%,rgba(6,13,25,.85)_42%,rgba(6,13,25,.28)_74%,rgba(6,13,25,.1)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08111f]/75 via-transparent to-[#08111f]/15" />

          <div className="relative z-10 flex min-h-[570px] flex-col p-5 text-white sm:p-7 md:h-full md:min-h-0 md:p-10 lg:p-12">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-xs font-extrabold backdrop-blur-xl">
                <span className="size-2 rounded-full bg-brand-green" />
                Casablanca Lab ouvert
              </div>
              <p className="hidden text-xs font-extrabold text-white/70 sm:block">6–16 ans · Petits groupes · Matériel inclus</p>
            </div>

            <div className="my-auto max-w-[680px] py-8 md:py-4">
              <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-orange">
                MakerLab Academy
              </p>
              <h1 className="font-display text-[clamp(2.55rem,4.6vw,4.4rem)] font-bold leading-[0.98]">
                Ils utilisent déjà la tech.
                <span className="mt-2 block text-brand-orange">Apprenons-leur à la construire.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-white/78 md:text-lg">
                Des projets concrets en robotique, code, IA et fabrication.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link to="/quiz" className="ml-button min-h-13 bg-brand-orange px-6 text-white shadow-[0_12px_28px_rgba(232,119,34,.24)]">
                  Trouver sa mission <ArrowRight size={18} />
                </Link>
                <Link to="/maker-wall" className="ml-button min-h-13 border border-white/25 bg-white/10 px-6 text-white backdrop-blur-xl hover:bg-white/16">
                  <Play size={17} /> Voir leurs projets
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section aria-label="Disciplines MakerLab" className="overflow-hidden border-b border-slate-200 bg-white">
        <div className="ml-discipline-track flex w-max items-center py-4">
          {[...disciplines, ...disciplines].map((discipline, index) => (
            <div key={`${discipline.label}-${index}`} className="flex min-w-[185px] items-center justify-center gap-3 border-r border-slate-200 px-6">
              <discipline.icon size={18} className={discipline.color} />
              <span className="text-sm font-extrabold text-slate-600">{discipline.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f6f8fa] py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-blue">Ils apprennent en construisant</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-[1.05] md:text-[3.25rem]">
                Une idée devient un projet qui fonctionne.
              </h2>
            </div>
            <p className="max-w-2xl text-base font-semibold leading-7 text-slate-600 lg:justify-self-end">
              Chaque mission se termine par un résultat visible que l’enfant peut expliquer, tester et améliorer.
            </p>
          </div>

          <div data-home-group className="mt-9 grid gap-4 lg:grid-cols-3">
            <ProjectScene
              image={images[1]}
              title="Rover autonome"
              label="Robotique"
              result="Il détecte les obstacles et choisit sa trajectoire."
              icon={Bot}
            />
            <ProjectScene
              image={images[2]}
              title="Application intelligente"
              label="Code + IA"
              result="Une idée transformée en interface fonctionnelle."
              icon={Code2}
            />
            <ProjectScene
              image={images[3]}
              title="Objet fabriqué"
              label="Design 3D"
              result="Un modèle numérique devient un objet réel."
              icon={Printer}
            />
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="grid border-b border-slate-200 px-5 py-4 md:grid-cols-[240px_1fr] md:items-center md:px-6">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-orange">La méthode MakerLab</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">Un parcours simple, du problème à la présentation.</p>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-y-5 md:mt-0 md:grid-cols-6">
                {buildSteps.map((step, index) => (
                  <div key={step.title} className="relative flex flex-col items-center text-center">
                    <span className={`relative z-10 flex size-10 items-center justify-center rounded-lg text-white ${step.color}`}>
                      <step.icon size={17} />
                    </span>
                    <p className="mt-2 text-xs font-extrabold text-slate-700">{step.title}</p>
                    {index < buildSteps.length - 1 && (
                      <span className="absolute left-[calc(50%+26px)] top-5 hidden h-px w-[calc(100%-52px)] bg-slate-200 md:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-200">
              {[
                ['Vrais outils', 'encadrés'],
                ['Petits groupes', '10 enfants max'],
                ['Mentors présents', 'quand ça bloque'],
              ].map(([title, detail]) => (
                <div key={title} className="px-3 py-4 text-center md:px-5">
                  <p className="text-sm font-extrabold text-slate-900">{title}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-green">Choisir son format</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-[1.05] md:text-[3.25rem]">
                Commencer au bon rythme.
              </h2>
            </div>
            <Link to="/quiz" className="ml-button border border-slate-200 bg-white text-sm shadow-sm">
              Aidez-moi à choisir <ScanSearch size={17} />
            </Link>
          </div>

          <div data-home-group className="mt-9 grid gap-4 lg:grid-cols-3">
            {formats.map(format => (
              <Link
                key={format.title}
                to={format.to}
                data-home-item
                className="group flex min-h-[230px] flex-col rounded-lg border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
              >
                <div className={`flex size-11 items-center justify-center rounded-lg ${format.iconBg} ${format.accent}`}>
                  <format.icon size={20} />
                </div>
                <p className={`mt-6 text-[11px] font-extrabold uppercase tracking-[0.13em] ${format.accent}`}>{format.eyebrow}</p>
                <h3 className="mt-2 text-2xl font-extrabold">{format.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{format.text}</p>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-xs font-bold text-slate-500">{format.detail}</span>
                  <span className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-white transition group-hover:bg-brand-orange">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link
            to="/schools"
            className="mt-4 flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-[#f6f8fa] px-5 py-5 transition hover:border-brand-blue/35 hover:bg-brand-blue/[0.04] sm:flex-row sm:items-center md:px-6"
          >
            <div>
              <p className="text-sm font-extrabold text-slate-900">Vous êtes une école ?</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">Ateliers, clubs et programmes STEM adaptés à votre établissement.</p>
            </div>
            <span className="flex items-center gap-2 text-sm font-extrabold text-brand-blue">
              Découvrir l’offre écoles <ArrowRight size={16} />
            </span>
          </Link>
        </div>
      </section>

      {displayPrograms.length > 0 && (
        <section className="border-y border-slate-200 bg-[#f6f8fa] py-14 md:py-16">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-red">Programmes à découvrir</p>
                <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-[1.05] md:text-[3.25rem]">
                  Trois façons de commencer.
                </h2>
              </div>
              <Link to="/programs" className="ml-button border border-slate-200 bg-white text-sm shadow-sm">
                Tous les programmes <ArrowRight size={17} />
              </Link>
            </div>

            <div data-home-group className="mt-9 grid gap-4 lg:grid-cols-3">
              {displayPrograms.map((program, index) => (
                <Link
                  key={program.id}
                  to={`/programs/${program.id}`}
                  data-home-item
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                    <img
                      src={index === 0 ? images[0] : program.image || images[(index % 3) + 1]}
                      alt={program.title}
                      loading="lazy"
                      onError={event => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = images[(index % 3) + 1];
                      }}
                      className="size-full object-cover transition duration-500 group-hover:scale-[1.025]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-[10px] font-extrabold uppercase text-slate-800 shadow-sm">
                      {program.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="line-clamp-2 min-h-[58px] text-xl font-extrabold leading-snug">{program.title}</h3>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex gap-2 text-xs font-bold text-slate-500">
                        <span>{program.ageGroup || '6–16 ans'}</span>
                        {program.duration && <span>· {program.duration}</span>}
                      </div>
                      <span className="flex size-9 items-center justify-center rounded-full bg-slate-900 text-white transition group-hover:bg-brand-orange">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="relative min-h-[340px] overflow-hidden rounded-lg bg-[#08111f]">
            <img src={images[1]} alt="" loading="lazy" className="absolute inset-0 size-full object-cover object-center opacity-55" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,17,31,.97)_0%,rgba(8,17,31,.85)_52%,rgba(8,17,31,.25)_100%)]" />
            <div className="relative z-10 flex min-h-[340px] max-w-2xl flex-col justify-center p-7 text-white md:p-12">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-orange">Le bon point de départ</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-[1.05] md:text-5xl">
                Pas sûr du programme qui lui correspond ?
              </h2>
              <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-white/70">
                Dites-nous son âge et ce qui l’attire. Nous vous orientons en quelques questions.
              </p>
              <Link to="/quiz" className="ml-button mt-7 w-fit bg-brand-orange px-6 text-white">
                Trouver sa mission <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

const ProjectScene: React.FC<{
  image: string;
  title: string;
  label: string;
  result: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = ({ image, title, label, result, icon: Icon }) => (
  <article data-home-item className="group relative aspect-[4/3] min-h-[300px] overflow-hidden rounded-lg bg-slate-950">
    <img src={image} alt={title} loading="lazy" className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.025]" />
    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/10 to-transparent" />
    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
      <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-white text-brand-orange">
        <Icon size={17} />
      </div>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-white/60">{label}</p>
      <h3 className="mt-1 text-2xl font-extrabold">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-white/68">{result}</p>
    </div>
  </article>
);
