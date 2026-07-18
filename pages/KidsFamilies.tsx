import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, CheckCircle2, Code2, Cpu, MessageCircle } from 'lucide-react';
import { usePrograms } from '../contexts/ProgramContext';
import { AppCard, AppContainer, AppSectionHeader, AppShell, appAccentClasses } from '../components/AppStyle';
import { PremiumHero } from '../components/PremiumHero';
import { Reveal } from '../components/Motion';
import { FAQSection } from '../components/PageReady';
import { SEO } from '../components/SEO';
import { getGeneratedProgramImage } from '../utils/makerlabImages';
import { getPublicProgramDescription, getPublicProgramTitle } from '../utils/programDisplay';

const fallbackHero = '/images/makerlab/generated/stemquest-mdf-engineering-v1.webp';
const fallbackGallery = [
  '/images/makerlab/generated/mentor-microbit-electronics-v1.webp',
  '/images/makerlab/generated/python-dji-tello-coding-v1.webp',
  '/images/makerlab/generated/digital-fabrication-gears-v1.webp',
];

export const KidsFamilies: React.FC = () => {
  const { programs } = usePrograms();
  const kidsPrograms = programs.filter(program => program.active && program.format !== 'School Program');
  const heroImage = fallbackHero;
  const galleryImages = fallbackGallery;

  return (
    <AppShell className="pb-24 pt-5">
      <SEO
        title="Ateliers STEM pour enfants et familles a Casablanca"
        description="Ateliers robotique, coding, IA et fabrication pour enfants a Casablanca. Petits groupes, mentors et vrais projets a presenter aux parents."
        keywords="atelier robotique enfant Casablanca, coding enfants Maroc, STEM enfants Casablanca, impression 3D enfants"
        image={heroImage}
      />
      <AppContainer>
        <PremiumHero
          eyebrow="Pour les enfants et les familles"
          title={<>Le premier déclic tech doit être <span className="text-brand-orange">inoubliable.</span></>}
          description="Des ateliers concrets, joyeux et rassurants qui transforment la curiosité en projets que votre enfant sera fier de vous montrer."
          image={heroImage}
          imageAlt="Enfant construisant un projet MakerLab"
          accent="orange"
          primary={{ label: 'Voir les programmes', to: '/programs' }}
          secondary={{ label: 'Trouver le bon parcours', to: '/quiz' }}
          stats={[
            ['7-17', 'ans'],
            ['10', 'maximum par groupe'],
            ['100%', 'matériel inclus'],
            ['80%', 'de pratique'],
          ]}
        />

        <section className="py-10">
          <AppSectionHeader
            eyebrow="Programmes"
            title="Choisissez d’abord ce que votre enfant va réussir."
            text="Projet construit, durée, âge et résultat : chaque carte donne aux parents les informations utiles avant de réserver."
            action={{ label: 'Tous les programmes', to: '/programs' }}
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {kidsPrograms.slice(0, 6).map((program, index) => {
              const Icon = index % 3 === 0 ? Bot : index % 3 === 1 ? Code2 : Cpu;
              return (
                <Reveal key={program.id} delay={(index % 3) * 90}>
                <Link key={program.id} to={`/programs/${program.id}`} className="ml-card ml-card-interactive group overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={getGeneratedProgramImage(program, index)} alt={getPublicProgramTitle(program)} className="ml-image-zoom h-full w-full object-cover" />
                    <div className={`absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl ${appAccentClasses[index % appAccentClasses.length]} text-white shadow-lg`}>
                      <Icon size={22} />
                    </div>
                    <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase">{program.price}</span>
                  </div>
                  <div className="p-5">
                    <h2 className="text-2xl font-black leading-tight">{getPublicProgramTitle(program)}</h2>
                    <p className="mt-2 line-clamp-2 min-h-[48px] text-sm font-semibold leading-6 text-slate-500">{getPublicProgramDescription(program)}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px] font-black">
                      <span className="rounded-2xl bg-[#f7f7f4] px-2 py-3">{program.ageGroup || '8-17 ans'}</span>
                      <span className="rounded-2xl bg-[#f7f7f4] px-2 py-3">{program.duration}</span>
                      <span className="rounded-xl bg-[#f7f7f4] px-2 py-3 text-brand-orange">Détails</span>
                    </div>
                  </div>
                </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        <Reveal>
        <section className="grid gap-4 py-4 lg:grid-cols-[0.95fr_1.05fr]">
          <AppCard className="p-6 md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-blue">Ce que les parents voient</p>
            <h2 className="mt-3 font-display text-4xl font-black leading-none">De vrais projets. De vrais progrès. Une confiance visible.</h2>
            <div className="mt-6 grid gap-3">
              {['Petits groupes accompagnés par des mentors', 'Manipulation dès les premières minutes', 'Photos, certificat et histoire du projet'].map((item, index) => (
                <div key={item} className="flex items-center gap-3 rounded-xl bg-[#f7f7f4] p-4">
                  <CheckCircle2 className={index % 2 ? 'text-brand-blue' : 'text-brand-green'} size={20} />
                  <p className="font-black">{item}</p>
                </div>
              ))}
            </div>
          </AppCard>
          <div className="grid gap-4 sm:grid-cols-3">
            {galleryImages.map((image: string, index: number) => (
              <div key={image} className={`min-h-[260px] overflow-hidden rounded-lg ${appAccentClasses[index % appAccentClasses.length]} p-2 shadow-lg`}>
                <img src={image} alt="Moment vécu pendant un atelier MakerLab" className="h-full w-full rounded-md object-cover" />
              </div>
            ))}
          </div>
        </section>
        </Reveal>

        <Reveal>
        <section className="pt-8">
          <div className="rounded-lg bg-brand-blue p-6 text-white shadow-2xl md:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-green">
                <MessageCircle size={27} />
              </div>
              <h2 className="font-display text-4xl font-black leading-none md:text-5xl">Besoin d’aide pour choisir la première mission ?</h2>
              <p className="mx-auto mt-5 max-w-xl text-lg font-semibold leading-8 text-white/75">
                Nous orientons chaque famille vers l’atelier qui offrira à l’enfant une première réussite claire et motivante.
              </p>
              <Link to="/contact" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-black text-[#111]">
                Parler à MakerLab <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
        </Reveal>

        <FAQSection
          items={[
            { question: 'Mon enfant n’a jamais fait de robotique ou de code. Est-ce adapté ?', answer: 'Oui. Nos premières missions sont conçues pour débuter sans prérequis et progresser en construisant.' },
            { question: 'Tout le matériel est-il inclus ?', answer: 'Oui. Les outils et composants nécessaires sont fournis pendant l’atelier. La fiche du programme précise ce que l’enfant emporte.' },
            { question: 'Comment sont organisés les groupes ?', answer: 'Nous travaillons en petits groupes pour que chaque enfant puisse manipuler, poser des questions et recevoir l’aide d’un mentor.' },
            { question: 'Puis-je réserver un essai avant un parcours annuel ?', answer: 'Oui, lorsque le programme propose un atelier d’essai. Cette option apparaît directement sur sa page de détail.' },
          ]}
        />
      </AppContainer>
    </AppShell>
  );
};
