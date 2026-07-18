import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  PackageOpen,
  Palette,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppContainer, AppShell } from '../components/AppStyle';
import { Reveal } from '../components/Motion';
import { SEO } from '../components/SEO';
import { storeProducts } from '../data/storeProducts';

const productPresentation: Record<string, { eyebrow: string; summary: string; accent: string }> = {
  'smart-door': {
    eyebrow: 'Électronique + code',
    summary: "Une porte intelligente qui détecte, décide et s'ouvre.",
    accent: '#e30613',
  },
  'nova-quest-mini': {
    eyebrow: 'Robotique + exploration',
    summary: 'Un rover à concevoir, programmer et lancer en mission.',
    accent: '#f7b500',
  },
};

const makerSteps = [
  { label: 'Concevoir', icon: Palette },
  { label: 'Coder', icon: Code2 },
  { label: 'Construire', icon: Wrench },
];

export const Store: React.FC = () => {
  const featured = storeProducts[0];

  return (
    <AppShell className="bg-[#f4f7fb] pb-24">
      <SEO
        title="MakerLab Store - Missions STEM à construire"
        description="Découvrez les kits MakerLab : de vraies missions guidées pour concevoir, coder et construire."
        keywords="MakerLab store, kits STEM Maroc, robotique enfants, microbit, projets maker"
        image={featured.heroImage}
      />

      <section className="relative min-h-[660px] overflow-hidden bg-[#061d45] text-white sm:min-h-[700px] lg:min-h-[720px]">
        <img
          src={featured.heroImage}
          alt="Projet Smart Door MakerLab"
          className="absolute inset-0 h-full w-full object-cover object-[62%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,19,47,0.08)_0%,rgba(3,19,47,0.25)_30%,rgba(3,19,47,0.96)_100%)] lg:bg-[linear-gradient(90deg,rgba(3,19,47,0.96)_0%,rgba(3,19,47,0.76)_44%,rgba(3,19,47,0.08)_82%)]" />
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[#f7b500]" />

        <AppContainer className="relative flex min-h-[660px] items-end pb-8 pt-28 sm:min-h-[700px] sm:pb-10 lg:min-h-[720px] lg:items-center lg:py-28">
          <Reveal className="w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#061d45]/55 px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
              <Sparkles size={14} className="text-[#f7b500]" />
              Missions MakerLab
            </div>

            <h1 className="mt-5 max-w-xl text-[clamp(2.85rem,13vw,5.8rem)] font-black leading-[0.88] tracking-[-0.055em] text-white">
              Une idée.<br />Un vrai projet.
            </h1>
            <p className="mt-5 max-w-md text-base font-semibold leading-6 text-white/82 sm:text-lg sm:leading-7">
              Des aventures guidées pour imaginer, coder et fabriquer quelque chose qui fonctionne.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/store/${featured.slug}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f7b500] px-6 py-3.5 text-sm font-black text-[#061d45] shadow-[0_16px_40px_rgba(247,181,0,0.28)] transition hover:-translate-y-0.5 hover:bg-[#ffd04a] focus:outline-none focus:ring-4 focus:ring-[#f7b500]/30"
              >
                Découvrir Smart Door <ArrowRight size={18} />
              </Link>
              <a
                href="#missions"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/18 focus:outline-none focus:ring-4 focus:ring-white/20"
              >
                Voir les 2 missions
              </a>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-2 border-t border-white/20 pt-5 sm:max-w-md sm:gap-3">
              {makerSteps.map(({ label, icon: Icon }) => (
                <div key={label} className="flex min-h-16 flex-col justify-center rounded-xl bg-white/10 px-3 py-3 backdrop-blur-md sm:flex-row sm:items-center sm:gap-2">
                  <Icon size={18} className="text-[#f7b500]" />
                  <span className="mt-2 text-[11px] font-black uppercase tracking-[0.08em] sm:mt-0 sm:text-xs">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </AppContainer>
      </section>

      <AppContainer id="missions" className="scroll-mt-24 py-14 sm:py-20">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-5 sm:mb-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#e30613]">À construire maintenant</p>
              <h2 className="mt-3 max-w-xl text-4xl font-black leading-[0.95] tracking-[-0.04em] text-[#061d45] sm:text-5xl">
                Choisissez sa prochaine mission.
              </h2>
            </div>
            <span className="hidden rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#0042a5] shadow-sm sm:inline-flex">
              2 projets pilotes
            </span>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-2">
          {storeProducts.map((product, index) => {
            const presentation = productPresentation[product.id];

            return (
              <Reveal key={product.id} delay={index * 80}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#d7e2f1] bg-white shadow-[0_20px_55px_rgba(19,51,91,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(19,51,91,0.16)]">
                  <Link to={`/store/${product.slug}`} className="relative block overflow-hidden bg-[#dfe9f7]">
                    <img
                      src={product.heroImage}
                      alt={product.title}
                      className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.035] sm:aspect-[16/10]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#061d45]/65 to-transparent" />
                    <span
                      className="absolute left-4 top-4 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-lg"
                      style={{ backgroundColor: presentation.accent }}
                    >
                      Mission {index + 1}
                    </span>
                    <p className="absolute bottom-4 left-4 right-4 text-xs font-black uppercase tracking-[0.14em] text-white">
                      {presentation.eyebrow}
                    </p>
                  </Link>

                  <div className="flex flex-1 flex-col p-5 sm:p-7">
                    <h3 className="text-[2rem] font-black leading-none tracking-[-0.035em] text-[#061d45] sm:text-4xl">{product.title}</h3>
                    <p className="mt-3 text-base font-semibold leading-6 text-slate-600">{presentation.summary}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {product.highlights.slice(0, 3).map((item) => (
                        <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-[#f2f6fc] px-3 py-2 text-[11px] font-black text-[#24476f]">
                          <CheckCircle2 size={14} className="text-[#10a858]" />
                          {item}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/store/${product.slug}`}
                      className="mt-6 inline-flex min-h-12 w-full items-center justify-between rounded-xl bg-[#0042a5] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#00347f] focus:outline-none focus:ring-4 focus:ring-[#0042a5]/20"
                    >
                      Explorer la mission <ArrowRight size={18} />
                    </Link>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <section className="mt-8 overflow-hidden rounded-[1.75rem] bg-[#061d45] text-white shadow-xl sm:mt-12">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div className="p-6 sm:p-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f7b500] text-[#061d45]">
                  <PackageOpen size={24} />
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-[#f7b500]">Pas un simple kit</p>
                <h2 className="mt-3 text-3xl font-black leading-[1.02] tracking-[-0.03em] sm:text-4xl">
                  De la première idée au projet qui fonctionne.
                </h2>
              </div>

              <div className="grid gap-px bg-white/15 sm:grid-cols-3">
                {[
                  { icon: BookOpen, title: '1. Suivre', text: 'Une mission claire, étape par étape.' },
                  { icon: Wrench, title: '2. Construire', text: 'De vraies pièces et de vrais outils.' },
                  { icon: Sparkles, title: '3. Améliorer', text: 'Tester, personnaliser et présenter.' },
                ].map(({ icon: Icon, title, text }) => (
                  <div key={title} className="bg-[#0b2858] p-6 sm:min-h-48">
                    <Icon size={22} className="text-[#f7b500]" />
                    <h3 className="mt-4 text-lg font-black">{title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white/68">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>
      </AppContainer>
    </AppShell>
  );
};
