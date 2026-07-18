import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  PackageOpen,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { storeProducts } from '../data/storeProducts';
import { AppContainer, AppShell } from './AppStyle';
import { Reveal } from './Motion';
import { SEO } from './SEO';
import { ParentDecisionSystem } from './ParentDecisionSystem';

type StoreProduct = (typeof storeProducts)[number];

const journeySurfaces = ['#dff5ff', '#fff0cf', '#e4f7ec', '#f8e5ee', '#e8e5ff', '#ffe8d6'];
const componentSurfaces = ['#e4f7ec', '#dff5ff', '#fff0cf', '#f8e5ee'];
const formatSurfaces = ['#dff5ff', '#fff0cf', '#e4f7ec'];

export interface StoreProductDetailCopy {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  badge: string;
  heroTitle: string;
  heroSummary: string;
  heroHighlights: readonly string[];
  professionalTools: readonly string[];
  recommendedReason: string;
  nextSteps: readonly { title: string; text: string }[];
  imageAlt: string;
  workshopLabel: string;
  journeyEyebrow: string;
  journeyTitle: string;
  journeyLabels: readonly string[];
  outcomeTitle: string;
  outcomes: readonly string[];
  componentsTitle: string;
  formatTitle: string;
  formatLabels: readonly string[];
  formatSummaries: readonly string[];
  customTitle: string;
  customText: string;
  accent: string;
}

interface StoreProductDetailProps {
  product: StoreProduct;
  copy: StoreProductDetailCopy;
}

export const StoreProductDetail: React.FC<StoreProductDetailProps> = ({ product, copy }) => (
  <AppShell className="bg-[#f4f7fb] pb-24">
    <SEO
      title={copy.seoTitle}
      description={copy.seoDescription}
      keywords={copy.seoKeywords}
      image={product.heroImage}
    />

    <section className="relative min-h-[700px] overflow-hidden bg-[#061d45] text-white sm:min-h-[740px] lg:min-h-[760px]">
      <img
        src={product.heroImage}
        alt={copy.imageAlt}
        className="absolute inset-0 h-full w-full object-cover object-[58%_center] lg:object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,19,47,0.05)_0%,rgba(3,19,47,0.22)_26%,rgba(3,19,47,0.97)_100%)] lg:bg-[linear-gradient(90deg,rgba(3,19,47,0.97)_0%,rgba(3,19,47,0.78)_46%,rgba(3,19,47,0.06)_82%)]" />
      <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: copy.accent }} />

      <AppContainer className="relative flex min-h-[700px] items-end pb-7 pt-24 sm:min-h-[740px] sm:pb-10 lg:min-h-[760px] lg:items-center lg:py-24">
        <Reveal className="w-full max-w-2xl">
          <Link
            to="/store"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-[#061d45]/45 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white backdrop-blur-md transition hover:bg-white/15"
          >
            <ArrowLeft size={16} /> Retour au Store
          </Link>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
            <Sparkles size={14} style={{ color: copy.accent }} />
            {copy.badge}
          </div>

          <h1 className="mt-5 max-w-xl text-[clamp(2.8rem,12vw,5.6rem)] font-black leading-[0.89] tracking-[-0.055em] text-white">
            {copy.heroTitle}
          </h1>
          <p className="mt-5 max-w-md text-base font-semibold leading-6 text-white/82 sm:text-lg sm:leading-7">
            {copy.heroSummary}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to={product.formats[1].to}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-black text-[#061d45] shadow-xl transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/20"
              style={{ backgroundColor: copy.accent }}
            >
              {copy.workshopLabel} <ArrowRight size={18} />
            </Link>
            <a
              href="#mission-path"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-black text-white backdrop-blur-md transition hover:bg-white/18"
            >
              Voir le parcours
            </a>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/20 pt-5 sm:max-w-xl">
            {copy.heroHighlights.map((item) => (
              <div key={item} className="flex min-h-14 items-center justify-center rounded-xl bg-white/10 px-2 py-3 text-center backdrop-blur-md">
                <span className="text-[10px] font-black uppercase leading-4 tracking-[0.04em] text-white sm:text-xs">{item}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </AppContainer>
    </section>

    <ParentDecisionSystem
      recommendedTo={product.formats[1].to}
      recommendedLabel={copy.workshopLabel}
      recommendedReason={copy.recommendedReason}
      professionalTools={copy.professionalTools}
      nextSteps={copy.nextSteps}
    />

    <AppContainer id="mission-path" className="scroll-mt-24 space-y-10 py-14 sm:space-y-14 sm:py-20">
      <Reveal>
        <section>
          <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: copy.accent }}>
            {copy.journeyEyebrow}
          </p>
          <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.96] tracking-[-0.04em] text-[#061d45] sm:text-5xl">
            {copy.journeyTitle}
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {product.journey.map((step, index) => {
              const Icon = step.icon;
              const label = copy.journeyLabels[index] ?? step.label;

              return (
                <article key={step.label} className="relative overflow-hidden rounded-2xl border-2 border-[#061d45]/10 p-4 shadow-[0_14px_38px_rgba(19,51,91,0.08)] sm:p-5" style={{ backgroundColor: journeySurfaces[index % journeySurfaces.length] }}>
                  <span className="absolute right-3 top-2 text-4xl font-black text-[#061d45]/5">{index + 1}</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#061d45] text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-lg font-black leading-tight text-[#061d45] sm:text-xl">{label}</h3>
                  <p className="mt-2 hidden text-sm font-semibold leading-6 text-slate-500 sm:block">{step.text}</p>
                </article>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="overflow-hidden rounded-[1.75rem] bg-[#061d45] text-white shadow-xl">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <img
              src={product.unboxingImage}
              alt={`${product.title} : pièces et guide`}
              className="aspect-[4/3] h-full w-full object-cover sm:aspect-[16/10] lg:min-h-[560px]"
            />
            <div className="p-6 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: copy.accent }}>
                Ce qu'il va accomplir
              </p>
              <h2 className="mt-3 text-3xl font-black leading-[1.02] tracking-[-0.035em] sm:text-4xl">{copy.outcomeTitle}</h2>
              <div className="mt-6 grid gap-3">
                {copy.outcomes.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl bg-white/10 p-4">
                    <CheckCircle2 className="mt-0.5 shrink-0" size={18} style={{ color: copy.accent }} />
                    <span className="text-sm font-bold leading-5 text-white/88">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0042a5]">Dans la mission</p>
              <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.03em] text-[#061d45] sm:text-4xl">{copy.componentsTitle}</h2>
            </div>
            <PackageOpen className="hidden text-[#0042a5] sm:block" size={32} />
          </div>

          <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {product.components.map((item, index) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="w-[76vw] max-w-[280px] shrink-0 snap-center rounded-2xl border-2 border-[#061d45]/10 p-5 shadow-[0_12px_34px_rgba(19,51,91,0.08)] sm:w-auto sm:max-w-none" style={{ backgroundColor: componentSurfaces[index % componentSurfaces.length] }}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0042a5] text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-[#061d45]">{item.label}</h3>
                  <p className="mt-2 text-sm font-semibold leading-5 text-slate-500">{item.note}</p>
                </article>
              );
            })}
          </div>
          <p className="mt-1 text-xs font-bold text-slate-400 sm:hidden">Glissez pour voir les composants →</p>
        </section>
      </Reveal>

      <Reveal>
        <section className="rounded-[1.75rem] border-2 border-[#f7b500] bg-[#fff8df] p-5 shadow-[0_20px_55px_rgba(19,51,91,0.10)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.16em]" style={{ color: copy.accent }}>Choisir son format</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black leading-[1.02] tracking-[-0.035em] text-[#061d45] sm:text-4xl">{copy.formatTitle}</h2>

          <div className="mt-7 grid gap-3 lg:grid-cols-3">
            {product.formats.map((format, index) => {
              const Icon = format.icon;
              return (
                <article key={format.title} className="rounded-2xl border-2 border-[#061d45]/10 p-5" style={{ backgroundColor: formatSurfaces[index % formatSurfaces.length] }}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#061d45] text-white">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-xl font-black text-[#061d45]">{copy.formatLabels[index] ?? format.title}</h3>
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">{copy.formatSummaries[index] ?? format.text}</p>
                  <Link to={format.to} className="mt-5 inline-flex min-h-11 w-full items-center justify-between rounded-xl bg-[#0042a5] px-4 py-3 text-sm font-black text-white">
                    En savoir plus <ChevronRight size={17} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="relative overflow-hidden rounded-[1.75rem] bg-[#0b2858] p-6 text-white shadow-xl sm:p-9">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[28px] border-white/5" />
          <Wrench size={30} style={{ color: copy.accent }} />
          <h2 className="mt-5 max-w-xl text-3xl font-black leading-[1.02] tracking-[-0.035em] sm:text-4xl">{copy.customTitle}</h2>
          <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-white/70">{copy.customText}</p>
          <Link
            to={product.formats[2].to}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black text-[#061d45] sm:w-auto"
            style={{ backgroundColor: copy.accent }}
          >
            Demander une version personnalisée <ArrowRight size={18} />
          </Link>
        </section>
      </Reveal>
    </AppContainer>
  </AppShell>
);
