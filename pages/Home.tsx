import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  BrainCircuit,
  Check,
  Code2,
  Cpu,
  DraftingCompass,
  Layers3,
  PackageCheck,
  Play,
  Printer,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { HomeMotion } from '../components/HomeMotion';
import { MakerMomentsVideoGallery } from '../components/MakerMomentsVideoGallery';
import { usePrograms } from '../contexts/ProgramContext';
import { useSettings } from '../contexts/SettingsContext';
import { defaultPageContent } from '../data/defaultPageContent';
import { getGeneratedProgramImage } from '../utils/makerlabImages';
import { getPublicProgramCategory, getPublicProgramDescription, getPublicProgramTitle } from '../utils/programDisplay';

const fallbackImages = [
  '/images/makerlab/generated/home-hero-microbit-rover-v1.webp',
  '/images/makerlab/generated/vr-oculus-quest-product-design-v2.png',
  '/images/makerlab/generated/dji-tello-python-flightlab-v2.png',
  '/images/makerlab/generated/branding-product-kit-v2.png',
];

const cleanStoryImages = [
  '/images/makerlab/generated/smart-door-microbit-team-v2.png',
  '/images/makerlab/generated/cad-rover-design-to-prototype-v2.png',
  '/images/makerlab/generated/computer-vision-teachable-rover-v2.png',
  '/images/makerlab/generated/saas-vibe-coding-deploy-v2.png',
  '/images/makerlab/generated/print-on-demand-sublimation-v2.png',
  '/images/makerlab/generated/branding-product-kit-v2.png',
  '/images/makerlab/generated/junior-microbit-nightlight-v2.png',
];

const fabricationImage = '/images/makerlab/generated/cad-rover-design-to-prototype-v2.png';
const heroEditorialImage = '/images/makerlab/generated/home-hero-microbit-rover-editorial-v2.webp';
const featuredVideoId = 'TgAnL9XGu3U';

const getYouTubeVideoId = (source?: string) => {
  if (!source) return featuredVideoId;
  const match = source.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=))([\w-]{11})/i);
  return match?.[1] || featuredVideoId;
};

const disciplines = [
  { label: 'Robotique', icon: Bot },
  { label: 'Code créatif', icon: Code2 },
  { label: 'Intelligence artificielle', icon: Sparkles },
  { label: 'Design 3D', icon: Printer },
  { label: 'Électronique', icon: Cpu },
  { label: 'Vision produit', icon: PackageCheck },
];

const methodCards = [
  {
    title: 'Penser grand',
    text: 'L’IA aide à explorer plus loin, sans réfléchir à la place de l’enfant.',
    icon: BrainCircuit,
    className: 'bg-[#d9f56f] text-[#0b1726]',
  },
  {
    title: 'Construire pour de vrai',
    text: 'Il conçoit, câble, code, fabrique, teste et améliore son prototype.',
    icon: Wrench,
    className: 'bg-[#e87722] text-white',
  },
  {
    title: 'Défendre son idée',
    text: 'Il apprend à présenter, documenter et transformer son projet en produit.',
    icon: PackageCheck,
    className: 'bg-[#2563a8] text-white',
  },
];

const storyChapters = [
  {
    label: 'Robotique + électronique',
    title: 'Le rover quitte l’écran et répond au monde réel.',
    text: 'Capteurs, logique et erreurs de câblage deviennent une enquête concrète. L’enfant ne suit pas une notice : il observe, teste et décide.',
    image: '/images/makerlab/generated/computer-vision-teachable-rover-v2.png',
    tools: ['BBC micro:bit', 'MakeCode', 'Capteurs'],
    accent: '#d9f56f',
  },
  {
    label: 'Code + intelligence artificielle',
    title: 'Une intuition devient une application qui comprend.',
    text: 'L’IA accélère l’exploration, mais le maker garde la vision : choisir les données, construire l’interface et expliquer ses décisions.',
    image: '/images/makerlab/generated/saas-vibe-coding-deploy-v2.png',
    tools: ['Python', 'Google AI', 'Prototypage'],
    accent: '#e87722',
  },
  {
    label: 'Design + fabrication',
    title: 'Le fichier 3D devient un objet que l’on peut tenir.',
    text: 'Avec les outils des designers et ingénieurs, l’enfant passe du croquis au modèle, puis du prototype au packaging de son idée.',
    image: fabricationImage,
    tools: ['Autodesk Fusion', 'Impression 3D', 'Design produit'],
    accent: '#74b7ff',
  },
];

const formats = [
  {
    title: 'Mission de 3 heures',
    eyebrow: 'Le premier pas recommandé',
    text: 'Une réussite complète en une session : concevoir, construire, tester et repartir avec son projet.',
    detail: 'Idéal pour découvrir MakerLab',
    to: '/programs?focus=missions',
    icon: Cpu,
    theme: 'home-format-orange',
    recommended: true,
  },
  {
    title: 'Camp intensif',
    eyebrow: 'Pendant les vacances',
    text: 'Plusieurs jours pour explorer une grande idée et aller beaucoup plus loin dans la fabrication.',
    detail: 'Idéal pour approfondir',
    to: '/programs?type=camp',
    icon: Sparkles,
    theme: 'home-format-lime',
  },
  {
    title: 'Parcours annuel',
    eyebrow: 'Une progression continue',
    text: 'Des projets de plus en plus ambitieux pour bâtir des compétences, un portfolio et une vraie autonomie.',
    detail: 'Idéal pour construire son futur',
    to: '/programs?type=annual',
    icon: Bot,
    theme: 'home-format-blue',
  },
];

const schoolNames = [
  'Georges Bizet',
  'Massignon',
  'American Academy',
  'London Academy',
  'Montessori International School',
  'Al Jabr',
];

const getHomeProgramImage = (program: any, index: number) => getGeneratedProgramImage(program, index);
const getHomeProgramDescription = (program: any) => {
  const source = `${program?.title || ''} ${program?.shortDescription || ''} ${program?.description || ''}`.toLocaleLowerCase('fr');
  if (/experience[\s-]?it/.test(source)) {
    return 'Une immersion technologique pour découvrir, manipuler et comprendre les métiers qui construisent le futur.';
  }
  return getPublicProgramDescription(program);
};

export const Home: React.FC = () => {
  const { programs } = usePrograms();
  const { settings } = useSettings();
  const pageContent = { ...defaultPageContent.home, ...(settings?.page_content?.home || {}) };
  const activePrograms = programs.filter(program => program.active);
  const featured = activePrograms.filter(program => program.isFeatured).slice(0, 3);
  const displayPrograms = featured.length ? featured : activePrograms.slice(0, 3);
  const configuredImages = ['home_bento_1', 'home_bento_2', 'home_bento_3'].flatMap(key => {
    const value = settings?.hero_images?.[key];
    return Array.isArray(value) ? value : value ? [value] : [];
  });
  const realImages = activePrograms
    .map(program => program.image)
    .filter(image => image && !image.includes('placehold.co'));
  const galleryImages = ['gallery_general', 'gallery_programs', 'gallery_kids'].flatMap(key =>
    (settings?.[key] || []).map((entry: any) => typeof entry === 'string' ? entry : entry?.url).filter(Boolean)
  );
  const imagePool = [...configuredImages, ...galleryImages, ...fallbackImages, ...realImages];
  const images = fallbackImages.map((fallback, index) => imagePool[index] || fallback);
  const heroMessage = settings?.hero_dynamic_messages?.[0];
  const homeVideo = settings?.home_video;
  const heroTitle = heroMessage?.passive || pageContent.title || 'Ils utilisent déjà la technologie.';
  const heroAccent = heroMessage
    ? `${heroMessage.action} ${heroMessage.result}`
    : pageContent.accent || 'Apprenons-leur à la construire.';

  return (
    <main data-home-root className="makerlab-site home-journey min-h-screen text-[#0b1726]">
      <SEO
        title="MakerLab Academy | Robotique, IA et ingénierie pour enfants à Casablanca"
        description="À MakerLab Casablanca, les enfants de 6 à 16 ans conçoivent, codent et fabriquent de vrais projets en robotique, IA, électronique et design 3D."
        keywords="robotique enfants Casablanca, coding enfants Maroc, atelier IA, impression 3D, ingénierie enfants"
      />
      <HomeMotion />

      <section className="home-hero relative isolate overflow-hidden bg-[#f7f5ef] text-[#0b1726]">
        <div aria-hidden="true" className="home-hero-grid absolute inset-0 opacity-55" />
        <div className="relative mx-auto max-w-[1500px] px-5 pb-5 pt-12 sm:px-8 sm:pb-8 sm:pt-16 lg:px-12 lg:pt-20 xl:px-14">
          <div data-home-hero-copy className="relative z-20 mx-auto text-center">
            <h1 className="mx-auto max-w-4xl font-['Geist'] text-[2.15rem] font-semibold leading-[0.96] tracking-[-0.052em] sm:text-[clamp(3.1rem,4.6vw,4.4rem)]">
              <span>{heroTitle} </span>
              <span className="text-[#df661e]">{heroAccent}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm font-semibold leading-6 text-[#415064] sm:text-lg sm:leading-8">
              {pageContent.description || 'Des projets réels en robotique, code, IA et fabrication — pensés, construits et présentés par eux.'}
            </p>

            <div className="mx-auto mt-7 flex max-w-md flex-nowrap items-center justify-center gap-2 sm:mt-8 sm:gap-3">
              <Link to="/quiz" className="ml-button min-h-13 flex-1 whitespace-nowrap bg-[#df661e] px-4 text-[13px] text-white shadow-[0_16px_34px_rgba(223,102,30,.2)] hover:bg-[#c95618] sm:flex-none sm:px-6 sm:text-sm">
                Trouver sa mission <ArrowRight size={17} />
              </Link>
              <Link to="/maker-wall" className="ml-button min-h-13 flex-1 whitespace-nowrap bg-[#0b1726] px-4 text-[13px] text-white hover:bg-[#172a45] sm:flex-none sm:px-6 sm:text-sm">
                <Play size={16} /> Voir les projets
              </Link>
            </div>
          </div>

          <div data-home-hero-stage className="home-hero-photo relative mx-auto mt-10 h-[300px] max-w-6xl overflow-hidden border border-[#0b1726]/10 sm:mt-12 sm:h-[420px] lg:h-[560px]">
            <img
              data-home-hero-image
              data-home-parallax
              data-parallax-speed="3"
              src={heroEditorialImage}
              alt="Une jeune maker teste un rover en MDF équipé d’un micro:bit"
              loading="eager"
              fetchPriority="high"
              className="absolute -inset-[4%] h-[108%] w-[108%] object-cover object-[64%_58%] sm:object-[60%_58%]"
            />
            <div data-home-hero-annotation className="absolute left-5 top-5 z-10 max-w-[12rem] text-left text-[#0b1726] sm:left-9 sm:top-9 sm:max-w-xs lg:left-12 lg:top-12">
              <span aria-hidden="true" className="mb-3 block h-0.5 w-10 bg-[#df661e] sm:mb-5 sm:w-14" />
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#df661e] sm:text-xs">Design · Code · Build</p>
              <p className="mt-2 font-['Geist'] text-lg font-semibold leading-[1.02] tracking-[-0.035em] sm:mt-3 sm:text-3xl lg:text-4xl">
                Concevoir. Coder. Tester.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Disciplines MakerLab" className="overflow-hidden border-y border-white/10 bg-[#07111f] text-white">
        <div className="home-discipline-track flex w-max items-center py-5">
          {[...disciplines, ...disciplines].map((discipline, index) => (
            <div key={`${discipline.label}-${index}`} className="flex min-w-[220px] items-center justify-center gap-3 border-r border-white/10 px-7">
              <discipline.icon size={18} className="text-[#d9f56f]" />
              <span className="text-sm font-bold text-white/72">{discipline.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="methode" className="bg-[#f3efe6] py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div data-home-reveal className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <h2 className="max-w-4xl font-['Outfit'] text-[clamp(2.8rem,5vw,5.4rem)] font-semibold leading-[0.94] tracking-[-0.045em]">
              Une idée devient
              <span className="home-inline-media mx-[0.18em] inline-block h-[0.7em] w-[1.35em] translate-y-[0.05em] overflow-hidden align-baseline">
                <img src={images[2]} alt="" className="size-full object-cover" />
              </span>
              un projet qui se défend.
            </h2>
            <p className="max-w-xl text-base font-semibold leading-7 text-slate-600 lg:justify-self-end lg:text-lg lg:leading-8">
              Pas de LEGO à recopier, pas de tutoriel suivi sans comprendre. Chaque mission traverse tout le cycle d’un vrai projet.
            </p>
          </div>

          <div data-home-bento className="mt-12 grid grid-flow-dense border border-[#0b1726]/15 bg-[#0b1726]/15 lg:grid-cols-12">
            <article className="min-h-[360px] bg-white p-7 sm:p-9 lg:col-span-7 lg:min-h-[430px] lg:p-12">
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#2563a8]">La méthode MakerLab</p>
              <p data-home-words className="mt-7 max-w-3xl font-['Outfit'] text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-[#0b1726] sm:text-5xl">
                {'Imaginer. Concevoir. Fabriquer. Programmer. Tester. Présenter.'.split(' ').map((word, index) => (
                  <span key={`${word}-${index}`} data-home-word className="mr-[0.2em] inline-block">{word}</span>
                ))}
              </p>
              <div className="mt-10 flex items-center gap-4 border-t border-slate-200 pt-6">
                <span className="flex size-12 shrink-0 items-center justify-center bg-[#0b1726] text-[#d9f56f]"><Layers3 size={21} /></span>
                <p className="max-w-lg text-sm font-bold leading-6 text-slate-600">Un cycle complet, répété à chaque niveau pour rendre l’enfant plus autonome.</p>
              </div>
            </article>

            <article className="relative min-h-[360px] overflow-hidden bg-[#0b1726] text-white lg:col-span-5 lg:min-h-[430px]">
              <img data-home-media src={fabricationImage} alt="Conception et fabrication d’un prototype MakerLab" loading="lazy" className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#d9f56f]">Les outils changent l’ambition</p>
                <h3 className="mt-3 max-w-sm font-['Outfit'] text-3xl font-semibold leading-[1.02]">Autodesk, Python, micro:bit, IA — quand le projet les demande.</h3>
              </div>
            </article>

            {methodCards.map(card => (
              <article key={card.title} className={`min-h-[300px] p-7 sm:p-9 lg:col-span-4 ${card.className}`}>
                <card.icon size={28} />
                <h3 className="mt-16 font-['Outfit'] text-3xl font-semibold leading-tight">{card.title}</h3>
                <p className="mt-3 max-w-sm text-sm font-semibold leading-6 opacity-80 sm:text-base">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-home-story className="relative bg-[#07111f] py-20 text-white sm:py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div data-home-story-pin className="h-fit lg:sticky lg:top-28 lg:self-start lg:pt-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#d9f56f]">Le projet raconte la progression</p>
            <h2 className="mt-5 max-w-xl font-['Outfit'] text-[clamp(2.8rem,4.7vw,5.2rem)] font-semibold leading-[0.92] tracking-[-0.045em]">
              On ne leur montre pas le futur. Ils le construisent.
            </h2>
            <p className="mt-6 max-w-md text-base font-medium leading-7 text-white/60">
              Faites défiler : chaque étape ajoute une nouvelle façon de penser, de fabriquer et de communiquer.
            </p>
            <div aria-hidden="true" className="mt-9 hidden h-28 w-px overflow-hidden bg-white/15 lg:block">
              <span data-home-progress className="block h-full w-full origin-top bg-[#e87722]" />
            </div>
          </div>

          <div className="space-y-16 lg:space-y-28">
            {storyChapters.map((chapter, index) => (
              <article key={chapter.title} data-home-story-card className="min-h-[70vh] border-t border-white/14 pt-6 lg:min-h-[88vh]">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em]" style={{ color: chapter.accent }}>{chapter.label}</p>
                  <span className="font-['Outfit'] text-2xl font-semibold text-white/28">0{index + 1}</span>
                </div>
                <div className="relative mt-5 aspect-[4/3] overflow-hidden bg-white/5 sm:aspect-[16/10]">
                  <img data-home-story-image src={chapter.image} alt={chapter.title} loading="lazy" className="size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/65 via-transparent to-transparent" />
                </div>
                <div className="mt-7 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
                  <h3 className="max-w-xl font-['Outfit'] text-3xl font-semibold leading-[1.02] tracking-[-0.025em] sm:text-4xl">{chapter.title}</h3>
                  <div>
                    <p className="text-sm font-medium leading-7 text-white/62 sm:text-base">{chapter.text}</p>
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                      {chapter.tools.map(tool => (
                        <span key={tool} className="flex items-center gap-2 text-xs font-bold text-white/72"><Check size={13} style={{ color: chapter.accent }} />{tool}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="moments" className="bg-[#07111f] pb-20 text-white sm:pb-28">
        <div data-home-reveal className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 border-t border-white/12 pt-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-12">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#e87722]">MakerLab en mouvement</p>
              <h2 className="mt-4 max-w-xl font-['Outfit'] text-4xl font-semibold leading-[1.02] sm:text-5xl">{homeVideo?.title || 'Entrez quelques secondes. Ressentez toute l’énergie du Lab.'}</h2>
            </div>
            <p className="max-w-2xl font-medium leading-7 text-white/60 lg:justify-self-end lg:text-lg">
              {homeVideo?.description || 'Ici, on ne regarde pas la technologie de loin. On imagine, on fabrique, on rate, on recommence — ensemble.'}
            </p>
          </div>
          <MakerMomentsVideoGallery videoIds={[getYouTubeVideoId(homeVideo?.videoSrc)]} />
        </div>
      </section>

      <section className="bg-[#e8edf2] py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div data-home-reveal className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#2563a8]">Une première décision simple</p>
              <h2 className="mt-4 max-w-4xl font-['Outfit'] text-[clamp(2.8rem,5vw,5.4rem)] font-semibold leading-[0.94] tracking-[-0.045em]">Choisissez le rythme. Nous guidons le reste.</h2>
            </div>
            <Link to="/quiz" className="ml-button w-fit border border-[#0b1726]/15 bg-white px-6 text-[#0b1726] shadow-sm">
              Aidez-moi à choisir <ScanSearch size={18} />
            </Link>
          </div>

          <div className="home-format-rail mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 lg:min-h-[540px] lg:overflow-visible lg:pb-0">
            {formats.map(format => (
              <Link key={format.title} to={format.to} className={`home-format-card group relative flex min-w-[78vw] snap-center flex-col overflow-hidden p-7 sm:min-w-[420px] sm:p-9 lg:min-w-0 ${format.theme}`}>
                <div className="flex items-start justify-between gap-5">
                  <span className="flex size-12 items-center justify-center border border-current/15 bg-white/15"><format.icon size={22} /></span>
                  {format.recommended && <span className="max-w-[145px] text-right text-[10px] font-extrabold uppercase tracking-[0.14em]">Recommandé pour commencer</span>}
                </div>
                <div className="mt-auto pt-24 lg:pt-32">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] opacity-65">{format.eyebrow}</p>
                  <h3 className="mt-3 max-w-md font-['Outfit'] text-4xl font-semibold leading-[0.98] lg:text-5xl">{format.title}</h3>
                  <p className="mt-5 max-w-md text-sm font-semibold leading-7 opacity-75 sm:text-base">{format.text}</p>
                  <div className="mt-8 flex items-center justify-between gap-4 border-t border-current/15 pt-5">
                    <span className="text-xs font-extrabold">{format.detail}</span>
                    <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" size={22} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link to="/schools" className="group mt-3 grid gap-5 bg-[#0b1726] p-7 text-white transition hover:bg-[#12223a] sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#d9f56f]">Pour les écoles</p>
              <h3 className="mt-3 font-['Outfit'] text-3xl font-semibold">Clubs, journées d’ingénierie et parcours STEM adaptés à votre établissement.</h3>
            </div>
            <span className="flex items-center gap-2 text-sm font-extrabold">Découvrir l’offre écoles <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} /></span>
          </Link>
        </div>
      </section>

      {displayPrograms.length > 0 && (
        <section data-home-stack className="bg-[#f8f6f0] py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div data-home-reveal className="grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#b4232b]">Les parcours à découvrir maintenant</p>
                <h2 className="mt-4 max-w-4xl font-['Outfit'] text-[clamp(2.8rem,5vw,5.4rem)] font-semibold leading-[0.94] tracking-[-0.045em]">Chaque enfant peut entrer par une porte qui lui ressemble.</h2>
              </div>
              <p className="max-w-xl text-base font-semibold leading-7 text-slate-600 lg:justify-self-end">Robotique, design, IA ou fabrication : le thème attire son attention, la méthode construit ses compétences.</p>
            </div>

            <div className="mt-14 space-y-8 lg:mt-20 lg:space-y-16">
              {displayPrograms.map((program, index) => (
                <Link
                  key={program.id}
                  to={`/programs/${program.id}`}
                  data-home-stack-card
                  className={`home-program-stack-card group grid min-h-[460px] overflow-hidden border border-[#0b1726]/12 shadow-[0_28px_80px_rgba(11,23,38,.12)] lg:grid-cols-2 ${index % 3 === 0 ? 'bg-[#e87722] text-white' : index % 3 === 1 ? 'bg-[#d9f56f] text-[#0b1726]' : 'bg-[#2563a8] text-white'}`}
                  style={{ '--home-stack-index': index } as React.CSSProperties}
                >
                  <div className={`relative min-h-[280px] overflow-hidden lg:min-h-[520px] ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <img
                      src={getHomeProgramImage(program, index)}
                      alt={getPublicProgramTitle(program)}
                      loading="lazy"
                      onError={event => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = cleanStoryImages[index % cleanStoryImages.length];
                      }}
                      className="size-full object-cover transition duration-700 group-hover:scale-[1.025]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/45 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-col p-7 sm:p-10 lg:p-12">
                    <div className="flex items-center justify-between gap-4 text-[11px] font-extrabold uppercase tracking-[0.14em]">
                      <span>{getPublicProgramCategory(program)}</span>
                      <span className="opacity-55">0{index + 1}</span>
                    </div>
                    <h3 className="mt-12 max-w-lg font-['Outfit'] text-4xl font-semibold leading-[0.98] sm:text-5xl">{getPublicProgramTitle(program)}</h3>
                    <p className="mt-5 max-w-lg text-sm font-semibold leading-7 opacity-75 sm:text-base">{getHomeProgramDescription(program)}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-5 border-t border-current/15 pt-7">
                      <p className="text-sm font-extrabold">{program.ageGroup || '6–16 ans'}{program.duration ? ` · ${program.duration}` : ''}</p>
                      <span className="flex size-12 items-center justify-center border border-current/20 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"><ArrowUpRight size={20} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link to="/programs" className="ml-button border border-[#0b1726]/15 bg-white px-6 text-[#0b1726] shadow-sm">Comparer tous les programmes <ArrowRight size={18} /></Link>
            </div>
          </div>
        </section>
      )}

      <section className="overflow-hidden bg-[#d9f56f] py-20 text-[#0b1726] sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div data-home-reveal className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.17em]">Ce qui rassure les parents</p>
              <h2 className="mt-4 max-w-3xl font-['Outfit'] text-[clamp(2.8rem,5vw,5rem)] font-semibold leading-[0.94] tracking-[-0.045em]">Un projet visible. Une prochaine étape claire.</h2>
            </div>
            <p className="max-w-xl text-base font-semibold leading-7 text-[#0b1726]/68 lg:justify-self-end">Photos, certificat de participation, projet à présenter et recommandation pour continuer : vous voyez ce qui a été construit et pourquoi cela compte.</p>
          </div>

          <div className="mt-12 grid border border-[#0b1726]/18 bg-[#0b1726]/18 md:grid-cols-3">
            <article className="bg-[#d9f56f] p-7 sm:p-9">
              <ShieldCheck size={27} />
              <h3 className="mt-9 font-['Outfit'] text-2xl font-semibold">Risque réduit</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#0b1726]/68">Si votre enfant n’apprend rien, la session est remboursée selon les conditions de l’offre.</p>
            </article>
            <article className="bg-[#d9f56f] p-7 sm:p-9">
              <DraftingCompass size={27} />
              <h3 className="mt-9 font-['Outfit'] text-2xl font-semibold">Outils du monde réel</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#0b1726]/68">Des écosystèmes utilisés chez Autodesk, Google, Microsoft et dans les métiers de l’ingénierie.</p>
            </article>
            <article className="bg-[#d9f56f] p-7 sm:p-9">
              <PackageCheck size={27} />
              <h3 className="mt-9 font-['Outfit'] text-2xl font-semibold">Vision produit</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-[#0b1726]/68">Le prototype devient une histoire, un packaging, un portfolio — parfois même une idée à vendre.</p>
            </article>
          </div>
        </div>

        <div className="mt-16 border-y border-[#0b1726]/16 py-5">
          <p className="mb-4 px-5 text-center text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#0b1726]/55">Des participants viennent notamment de</p>
          <div className="home-school-track flex w-max items-center">
            {[...schoolNames, ...schoolNames].map((school, index) => (
              <span key={`${school}-${index}`} className="min-w-[230px] border-r border-[#0b1726]/16 px-7 text-center font-['Outfit'] text-lg font-semibold">{school}</span>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-4 max-w-3xl px-5 text-center text-[10px] font-semibold leading-5 text-[#0b1726]/48">Écoles fréquentées par certains participants ; leur mention n’implique ni partenariat, ni affiliation, ni approbation officielle.</p>
      </section>

      <section className="bg-[#07111f] px-5 py-20 text-white sm:px-8 sm:py-24 lg:py-32">
        <div data-home-reveal className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.17em] text-[#e87722]">La première étape recommandée</p>
            <h2 className="mt-5 max-w-5xl font-['Outfit'] text-[clamp(3rem,6vw,6.4rem)] font-semibold leading-[0.9] tracking-[-0.05em]">Une mission. Trois heures. Une vraie fierté.</h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-xl text-base font-medium leading-7 text-white/62">Dites-nous son âge et ce qui l’attire. Le diagnostic recommande le meilleur projet pour commencer, sans comparer vingt options.</p>
            <Link to="/quiz" className="ml-button mt-7 min-h-14 w-full bg-[#e87722] px-6 text-white shadow-[0_18px_45px_rgba(232,119,34,.25)] sm:w-fit">
              Trouver sa mission <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
