import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Cpu,
  Hammer,
  Lightbulb,
  MessageCircle,
  PackageCheck,
  PenTool,
  Presentation,
  ShieldCheck,
  Sparkles,
  TestTube2,
  Users,
} from 'lucide-react';
import { usePrograms } from '../contexts/ProgramContext';
import { useSettings } from '../contexts/SettingsContext';
import { FAQSection } from '../components/PageReady';
import { SEO } from '../components/SEO';
import { ParentDecisionSystem } from '../components/ParentDecisionSystem';
import { getGeneratedProgramImage } from '../utils/makerlabImages';
import { getPublicProgramCategory, getPublicProgramDescription, getPublicProgramTitle } from '../utils/programDisplay';

const fallbackImage = '/images/makerlab/generated/stemquest-mdf-engineering-v1.webp';

const defaultJourney = [
  { title: 'Imaginer', description: 'Comprendre le défi et choisir une direction.', icon: Lightbulb, color: 'bg-brand-orange' },
  { title: 'Concevoir', description: 'Dessiner, organiser et préparer les composants.', icon: PenTool, color: 'bg-brand-blue' },
  { title: 'Construire', description: 'Assembler le projet avec de vrais outils.', icon: Hammer, color: 'bg-brand-green' },
  { title: 'Tester', description: 'Observer, corriger et améliorer le prototype.', icon: TestTube2, color: 'bg-brand-red' },
  { title: 'Présenter', description: 'Expliquer les choix et montrer le résultat.', icon: Presentation, color: 'bg-[#f0b323]' },
];

export const ProgramDetail: React.FC = () => {
  const pageRef = useRef<HTMLElement>(null);
  const { id } = useParams<{ id: string }>();
  const { getProgram } = usePrograms();
  const { settings } = useSettings();
  const program = getProgram(id || '');

  useEffect(() => {
    if (!program) return;

    let cancelled = false;
    let context: { revert: () => void } | undefined;
    let media: { revert: () => void } | undefined;

    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, scrollModule]) => {
      if (cancelled || !pageRef.current) return;

      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        media = gsap.matchMedia();
        media.add('(prefers-reduced-motion: no-preference)', () => {
          const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
          intro
            .from('[data-dossier-image]', { scale: 1.035, duration: 0.7 })
            .from('[data-dossier-copy] > *', { y: 16, duration: 0.45, stagger: 0.055 }, '-=0.4')
            .from('[data-dossier-fact]', { y: 10, duration: 0.35, stagger: 0.045 }, '-=0.25');

          gsap.utils.toArray<HTMLElement>('[data-motion-group]').forEach(group => {
            const items = group.querySelectorAll('[data-motion-item]');
            if (!items.length) return;

            gsap.from(items, {
              y: 14,
              duration: 0.4,
              stagger: 0.055,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: group,
                start: 'top 86%',
                once: true,
              },
            });
          });
        });
      }, pageRef);
    });

    return () => {
      cancelled = true;
      media?.revert();
      context?.revert();
    };
  }, [program?.id]);

  if (!program) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f5f7] px-4">
        <div className="ml-card max-w-md p-8 text-center">
          <h1 className="font-display text-3xl font-black">Atelier introuvable</h1>
          <p className="mt-3 font-semibold leading-7 text-slate-500">Ce programme n’est plus disponible ou le lien est incorrect.</p>
          <Link to="/programs" className="ml-button mt-6 bg-slate-950 px-6 text-white">
            Retour aux ateliers
          </Link>
        </div>
      </main>
    );
  }

  const image = getGeneratedProgramImage(program) || fallbackImage;
  const publicTitle = getPublicProgramTitle(program);
  const publicDescription = getPublicProgramDescription(program);
  const phone = settings?.contact_info?.phone || '+212 6 00 00 00 00';
  const programFormat = `${program.programType || ''} ${program.format || ''} ${program.duration || ''}`.toLowerCase();
  const bookingType = /annual|annuel|year program|parcours annuel/.test(programFormat) ? 'annual' : 'workshop';
  const bookingPath = `/booking/${program.id}?type=${bookingType}`;
  const recommendedPath = program.bookingType === 'external' && program.externalBookingUrl ? program.externalBookingUrl : bookingPath;
  const toolContext = `${program.title} ${program.category} ${program.description} ${program.skills?.join(' ') || ''}`.toLowerCase();
  const professionalTools = /drone|tello|python/.test(toolContext)
    ? ['Python', 'DJI Tello', 'PyCharm', 'Logique algorithmique']
    : /ia|intelligence artificielle|classifier|machine learning/.test(toolContext)
      ? ['Google Teachable Machine', 'Python', 'IA générative', 'Design produit']
      : /3d|cad|cao|fusion|fabrication|impression/.test(toolContext)
        ? ['Autodesk Tinkercad', 'Autodesk Fusion 360', 'Impression 3D', 'Découpe laser']
        : ['BBC micro:bit', 'Microsoft MakeCode', 'Autodesk Tinkercad', 'Électronique réelle'];
  const parentNextSteps = bookingType === 'annual'
    ? [
        { title: 'Première mission', text: 'Valider son intérêt et réussir un projet concret.' },
        { title: 'Projets avancés', text: 'Ajouter de nouveaux outils, contraintes et responsabilités.' },
        { title: 'Portfolio MakerLab', text: 'Documenter, présenter et transformer ses projets en preuves de capacité.' },
      ]
    : [
        { title: 'Cette mission', text: 'Construire un premier résultat visible avec un mentor.' },
        { title: 'Mission suivante', text: 'Choisir une difficulté ou une technologie complémentaire.' },
        { title: 'Parcours et portfolio', text: 'Progresser vers des projets autonomes, présentés et packagés.' },
      ];
  const benefits = [
    { title: program.benefits || 'Un projet concret à présenter', text: 'L’enfant termine avec un résultat visible, pas seulement une notion apprise.', icon: Sparkles, color: 'bg-brand-orange' },
    { title: 'Matériel et outils inclus', text: 'Tout est préparé pour que le temps soit consacré à imaginer, fabriquer et tester.', icon: PackageCheck, color: 'bg-brand-blue' },
    { title: 'Petit groupe accompagné', text: 'Le mentor peut observer, expliquer et débloquer chaque participant.', icon: Users, color: 'bg-brand-green' },
    { title: 'Une méthode qui donne confiance', text: 'Les erreurs deviennent des essais et chaque amélioration devient une victoire.', icon: ShieldCheck, color: 'bg-brand-red' },
  ];
  const journey = program.stations?.length
    ? program.stations.slice(0, 5).map((station, index) => ({
        title: station.title,
        description: station.description,
        icon: defaultJourney[index % defaultJourney.length].icon,
        color: defaultJourney[index % defaultJourney.length].color,
      }))
    : defaultJourney;
  const sessions = program.schedule?.length ? program.schedule : ['Dates à venir'];
  const journeyGridClass = journey.length <= 3 ? 'md:grid-cols-3' : journey.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-5';

  const BookingAction: React.FC<{ className: string; trial?: boolean; children: React.ReactNode }> = ({ className, trial = false, children }) => {
    const href = trial ? `/booking/${program.id}?type=trial` : bookingPath;
    if (program.bookingType === 'external' && program.externalBookingUrl && !trial) {
      return <a href={program.externalBookingUrl} target="_blank" rel="noreferrer" className={className}>{children}</a>;
    }
    return <Link to={href} className={className}>{children}</Link>;
  };

  return (
    <main ref={pageRef} className="makerlab-site min-h-screen overflow-x-hidden pb-28 pt-4 text-slate-900">
      <SEO
        title={`${publicTitle} - Atelier MakerLab Casablanca`}
        description={publicDescription}
        keywords={[
          program.title,
          program.category,
          'atelier robotique Casablanca',
          'coding enfants Maroc',
          'MakerLab Academy',
        ].filter(Boolean).join(', ')}
        image={image}
        schemaType="Course"
        schemaData={{
          name: program.title,
          description: program.description,
          provider: {
            '@type': 'EducationalOrganization',
            name: 'MakerLab Academy',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Casablanca',
              addressCountry: 'MA',
            },
          },
          image,
        }}
      />
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <nav aria-label="Fil d’Ariane" className="mb-4 flex items-center justify-between gap-4">
          <Link to="/programs" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black shadow-sm transition hover:border-slate-300">
            <ArrowLeft size={16} /> Tous les programmes
          </Link>
          <span className="hidden text-xs font-black uppercase tracking-[0.14em] text-slate-400 sm:block">Dossier mission</span>
        </nav>

        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_55px_rgba(23,32,51,0.10)]">
          <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
            <div data-dossier-image className="relative min-h-[330px] overflow-hidden sm:min-h-[420px] lg:min-h-[610px]">
              <img src={image} alt={`Enfant réalisant le programme ${publicTitle}`} loading="eager" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-slate-950/90 p-4 text-white backdrop-blur-md sm:p-5">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-black">
                  <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-green" /> Projet réel</span>
                  <span className="inline-flex items-center gap-2"><Hammer size={16} className="text-brand-orange" /> Outils réels</span>
                  <span className="inline-flex items-center gap-2"><Users size={16} className="text-[#74b5ff]" /> Mentor présent</span>
                </div>
              </div>
            </div>

            <div data-dossier-copy className="flex flex-col p-5 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#fff0e7] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#8f350d]">
                  {getPublicProgramCategory(program)}
                </span>
                {program.trialAvailable && (
                  <span className="rounded-full bg-brand-green/10 px-3 py-2 text-xs font-black text-brand-green">Essai disponible</span>
                )}
                {typeof program.spotsAvailable === 'number' && (
                  <span className="rounded-full bg-brand-orange/10 px-3 py-2 text-xs font-black text-brand-orange">{program.spotsAvailable} places disponibles</span>
                )}
              </div>

              <p className="mt-8 text-xs font-black uppercase tracking-[0.16em] text-brand-blue">La mission</p>
              <h1 className="mt-3 max-w-xl font-display text-[clamp(2.5rem,5vw,4.8rem)] font-black leading-[0.96]">{publicTitle}</h1>
              <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8">
                {publicDescription}
              </p>

              <div className="mt-8 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-5">
                {[
                  { label: 'Âge', value: program.ageGroup || '8-17 ans' },
                  { label: 'Durée', value: program.duration || '3 heures' },
                  { label: 'Tarif', value: program.price || 'Sur demande' },
                ].map(item => (
                  <div key={item.label} data-dossier-fact className="px-3 first:pl-0 last:pr-0">
                    <p className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">{item.label}</p>
                    <p className="mt-1 text-sm font-black text-slate-900 sm:text-base">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto hidden flex-col gap-3 pt-8 lg:flex">
                <BookingAction className="ml-button min-h-14 bg-brand-orange px-6 text-white shadow-[0_10px_24px_rgba(255,90,31,0.24)]">
                  Réserver une place <ArrowRight size={18} />
                </BookingAction>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="ml-button min-h-12 border border-slate-200 bg-white px-5 text-slate-800">
                  <MessageCircle size={18} className="text-brand-blue" /> Poser une question
                </a>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Garanties du programme" data-motion-group className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: Cpu, value: '80%', label: 'de pratique', color: 'text-brand-orange' },
            { icon: Users, value: '10', label: 'enfants maximum', color: 'text-brand-blue' },
            { icon: PackageCheck, value: '100%', label: 'matériel inclus', color: 'text-brand-green' },
            { icon: ShieldCheck, value: '1:1', label: 'aide du mentor', color: 'text-brand-red' },
          ].map(item => (
            <div key={item.label} data-motion-item className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <item.icon size={20} className={item.color} />
              <p className="mt-4 text-2xl font-black tabular-nums">{item.value}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{item.label}</p>
            </div>
          ))}
        </section>

        <ParentDecisionSystem
          compact
          recommendedTo={recommendedPath}
          recommendedLabel={program.trialAvailable ? 'Commencer par l’atelier d’essai' : 'Commencer par cette mission'}
          recommendedReason="C’est le point de départ le plus simple : le matériel est prêt, le groupe est petit et le mentor aide l’enfant à terminer un projet qu’il peut expliquer."
          professionalTools={professionalTools}
          nextSteps={parentNextSteps}
        />

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-orange">Le résultat</p>
            <h2 className="mt-3 font-display text-3xl font-black leading-[1.04] sm:text-5xl">Votre enfant ne suit pas un cours. Il mène un projet.</h2>
            <p className="mt-5 text-base font-semibold leading-8 text-slate-600">{program.description}</p>
          </div>

          <div data-motion-group className="grid gap-3 sm:grid-cols-2">
            {benefits.map(benefit => (
              <article key={benefit.title} data-motion-item className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className={`flex size-11 items-center justify-center rounded-xl text-white ${benefit.color}`}>
                  <benefit.icon size={21} />
                </div>
                <h3 className="mt-5 text-xl font-black leading-tight">{benefit.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{benefit.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 border-y border-slate-200 py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-blue">La méthode MakerLab</p>
            <h2 className="mt-3 font-display text-3xl font-black leading-[1.04] sm:text-5xl">Une progression qui ressemble au travail d’un vrai créateur.</h2>
          </div>

          <div data-motion-group className={`mt-8 grid gap-3 ${journeyGridClass}`}>
            {journey.map((step, index) => (
              <article key={`${step.title}-${index}`} data-motion-item className="relative rounded-lg border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div className={`flex size-11 items-center justify-center rounded-xl text-white ${step.color}`}>
                    <step.icon size={20} />
                  </div>
                  <span className="font-mono text-xs font-black text-slate-300">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-lg font-black">{step.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-lg bg-brand-blue p-6 text-white sm:p-8">
            <div className="flex size-12 items-center justify-center rounded-xl bg-white/12">
              <CalendarDays size={23} />
            </div>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.14em] text-white/60">Prochaines sessions</p>
            <h2 className="mt-3 font-display text-3xl font-black leading-[1.05] sm:text-4xl">Choisissez le moment. Nous préparons tout le reste.</h2>
            <div className="mt-7 flex flex-col gap-2">
              {sessions.map(session => (
                <div key={session} className="flex min-h-14 items-center gap-3 rounded-xl border border-white/12 bg-slate-950/25 px-4">
                  <Clock3 size={18} className="shrink-0 text-[#74b5ff]" />
                  <span className="font-black">{session}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-green">Avant de réserver</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">Une décision simple et sans surprise.</h2>
            <div className="mt-6 flex flex-col gap-4">
              {[
                'Le niveau est adapté à l’âge annoncé.',
                'Le matériel nécessaire est fourni.',
                'Le groupe reste volontairement petit.',
                'Vous pouvez parler à l’équipe avant la session.',
              ].map(item => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green"><Check size={14} /></span>
                  <p className="font-bold leading-6 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
            <BookingAction className="ml-button mt-8 w-full min-h-14 bg-brand-orange px-6 text-white">
              Réserver ce programme <ArrowRight size={18} />
            </BookingAction>
            {program.trialAvailable && (
              <BookingAction trial className="ml-button mt-3 w-full border border-slate-200 bg-white px-6 text-slate-800">
                Commencer par un atelier d’essai
              </BookingAction>
            )}
          </div>
        </section>

        <FAQSection
          items={[
            { question: 'Faut-il avoir déjà codé ou construit un robot ?', answer: 'Non. Le mentor adapte les explications au niveau du groupe et guide chaque étape du projet.' },
            { question: 'Le matériel est-il compris dans le tarif ?', answer: 'Oui. Tout le matériel utilisé pendant la session est fourni, sauf indication contraire dans la description du programme.' },
            { question: 'Que se passe-t-il si mon enfant a besoin d’aide ?', answer: 'Les groupes restent volontairement petits pour que le mentor puisse observer, débloquer et encourager chaque participant.' },
            { question: 'Puis-je vous parler avant de réserver ?', answer: `Oui. Appelez-nous au ${phone} ou envoyez un message depuis la page contact.` },
          ]}
        />
      </div>

      <div className="fixed inset-x-2 bottom-2 z-50 grid min-h-16 max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-slate-200 bg-white/[0.96] p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-xl lg:hidden">
        <div className="min-w-0 flex-1 px-2">
          <p className="truncate text-xs font-bold text-slate-500">{publicTitle}</p>
          <p className="font-black text-slate-950">{program.price}</p>
        </div>
        <BookingAction className="ml-button min-h-12 bg-brand-orange px-4 text-sm text-white">
          Réserver <ArrowRight size={16} />
        </BookingAction>
      </div>
    </main>
  );
};
