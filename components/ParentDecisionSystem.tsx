import React from 'react';
import {
  ArrowRight,
  Award,
  BrainCircuit,
  BriefcaseBusiness,
  GraduationCap,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppContainer } from './AppStyle';
import { Reveal } from './Motion';

const schoolCommunity = [
  'Georges Bizet',
  'Massignon',
  'American Academy',
  'London Academy',
  'Montessori International School',
  'Al Jabr',
];

const whyColors = ['bg-[#dff5ff]', 'bg-[#fff0cf]', 'bg-[#e4f7ec]', 'bg-[#f8e5ee]'];
const proofColors = [
  'bg-[#e30613] text-white',
  'bg-[#f7b500] text-[#061d45]',
  'bg-[#10a858] text-white',
];
const stepColors = [
  'bg-[#dff5ff] border-[#8bd9f4]',
  'bg-[#fff0cf] border-[#f7cf64]',
  'bg-[#e4f7ec] border-[#83d5a6]',
];

interface ParentDecisionSystemProps {
  recommendedTo: string;
  recommendedLabel?: string;
  recommendedReason: string;
  professionalTools: readonly string[];
  nextSteps: readonly { title: string; text: string }[];
  compact?: boolean;
}

const DecisionLink: React.FC<{ to: string; className: string; children: React.ReactNode }> = ({ to, className, children }) =>
  /^https?:\/\//.test(to)
    ? <a href={to} target="_blank" rel="noreferrer" className={className}>{children}</a>
    : <Link to={to} className={className}>{children}</Link>;

export const ParentDecisionSystem: React.FC<ParentDecisionSystemProps> = ({
  recommendedTo,
  recommendedLabel = 'Commencer par la mission guidée',
  recommendedReason,
  professionalTools,
  nextSteps,
  compact = false,
}) => (
  <section className={compact ? 'py-8' : 'py-12 sm:py-16'} aria-label="Pourquoi cette mission compte et comment commencer">
    <AppContainer>
      <Reveal>
        <div className="overflow-hidden rounded-[1.75rem] border-2 border-[#061d45] bg-[#061d45] shadow-[0_22px_60px_rgba(19,51,91,0.16)]">
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative overflow-hidden bg-[#f7b500] p-6 text-[#061d45] sm:p-9">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[28px] border-white/25" />
              <span className="relative inline-flex items-center gap-2 rounded-full bg-[#061d45] px-3 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-white">
                <Sparkles size={14} /> Choix recommandé
              </span>
              <h2 className="relative mt-5 text-3xl font-black leading-[1.02] tracking-[-0.035em] sm:text-4xl">{recommendedLabel}</h2>
              <p className="relative mt-4 max-w-lg text-sm font-semibold leading-6 text-[#061d45]/72">{recommendedReason}</p>
              <DecisionLink
                to={recommendedTo}
                className="relative mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#061d45] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#0042a5] sm:w-auto"
              >
                Choisir cette première étape <ArrowRight size={18} />
              </DecisionLink>

              <div className="relative mt-6 grid grid-cols-3 gap-2 border-t border-[#061d45]/15 pt-5">
                {[
                  ['80%', 'pratique'],
                  ['10 max', 'par groupe'],
                  ['1 projet', 'à montrer'],
                ].map(([value, label]) => (
                  <div key={label}>
                    <p className="text-base font-black text-[#061d45]">{value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#061d45]/55">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#dff5ff] p-6 sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e30613]">Pourquoi cela compte</p>
              <h2 className="mt-3 text-3xl font-black leading-[1.03] tracking-[-0.035em] text-[#061d45] sm:text-4xl">
                Pas un jouet à recopier. Un projet qui prépare la suite.
              </h2>

              <div className="-mx-6 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0">
                {[
                  { icon: Wrench, title: 'De vrais outils', text: 'L’enfant conçoit, fabrique, câble, code et teste.' },
                  { icon: BrainCircuit, title: 'IA augmentée', text: 'L’IA aide à explorer plus grand sans remplacer la réflexion.' },
                  { icon: BriefcaseBusiness, title: 'Vision produit', text: 'Le prototype devient une histoire, un packaging et une offre.' },
                  { icon: Rocket, title: 'Grandir par projets', text: 'Chaque mission prépare un portfolio et une ambition plus forte.' },
                ].map(({ icon: Icon, title, text }, index) => (
                  <article key={title} className={`w-[76vw] max-w-[290px] shrink-0 snap-center rounded-2xl border border-[#061d45]/10 p-4 sm:w-auto sm:max-w-none ${whyColors[index]}`}>
                    <Icon size={20} className="text-[#0042a5]" />
                    <h3 className="mt-3 font-black text-[#061d45]">{title}</h3>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-600">{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t-2 border-[#061d45] bg-[#0042a5] p-5 text-white sm:p-7">
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f7b500]">Outils du monde réel</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-white/75">
                  Nous utilisons les outils adaptés à la mission — notamment ceux des écosystèmes Autodesk, Microsoft, Google, micro:bit ou Python lorsque le projet le demande.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {professionalTools.map(tool => (
                  <span key={tool} className="rounded-full border border-white/20 bg-white/12 px-3 py-2 text-xs font-black text-white shadow-sm">{tool}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex snap-x snap-mandatory gap-0.5 overflow-x-auto border-t-2 border-[#061d45] bg-[#061d45] sm:grid sm:grid-cols-3 sm:overflow-visible">
            {[
              { icon: ShieldCheck, title: 'Risque réduit', text: 'Si votre enfant n’apprend rien, la session est remboursée selon les conditions de l’offre.' },
              { icon: Award, title: 'Preuve de progression', text: 'Photos, certificat de participation et projet pour son portfolio.' },
              { icon: GraduationCap, title: 'Cap sur la suite', text: 'Une recommandation claire indique la prochaine mission à choisir.' },
            ].map(({ icon: Icon, title, text }, index) => (
              <div key={title} className={`w-[78vw] max-w-[310px] shrink-0 snap-center p-5 sm:w-auto sm:max-w-none ${proofColors[index]}`}>
                <Icon size={21} className={index === 1 ? 'text-[#061d45]' : 'text-white'} />
                <h3 className="mt-3 font-black">{title}</h3>
                <p className={`mt-1 text-xs font-semibold leading-5 ${index === 1 ? 'text-[#061d45]/70' : 'text-white/75'}`}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-8 overflow-hidden rounded-2xl bg-[#061d45] py-5 text-white shadow-[0_18px_45px_rgba(6,29,69,.18)]">
          <div className="px-5">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-[#f7b500]">Une communauté de familles ambitieuses</p>
            <p className="mt-2 text-sm font-semibold text-white/70">Des participants viennent notamment de ces établissements :</p>
          </div>
          <div className="school-proof-mask mt-5 overflow-hidden border-y border-white/15 bg-[#0042a5] py-4">
            <div className="school-proof-track flex w-max items-center gap-3 px-3">
              {[...schoolCommunity, ...schoolCommunity].map((school, index) => (
                <span key={`${school}-${index}`} className={`rounded-xl px-5 py-3 text-sm font-black text-[#061d45] shadow-sm ${index % 3 === 0 ? 'bg-[#f7b500]' : index % 3 === 1 ? 'bg-[#dff5ff]' : 'bg-[#e4f7ec]'}`}>{school}</span>
              ))}
            </div>
          </div>
          <p className="px-5 pt-3 text-[10px] font-semibold leading-4 text-white/40">
            Écoles fréquentées par certains participants ; leur mention n’implique ni partenariat, ni affiliation, ni approbation officielle.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e30613]">Et après ?</p>
          <h2 className="mt-3 text-3xl font-black leading-[1.03] tracking-[-0.035em] text-[#061d45] sm:text-4xl">Le parent voit la prochaine marche.</h2>
          <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
            {nextSteps.map((step, index) => (
              <article key={step.title} className={`relative w-[78vw] max-w-[310px] shrink-0 snap-center overflow-hidden rounded-2xl border-2 p-5 sm:w-auto sm:max-w-none ${stepColors[index] || stepColors[2]}`}>
                <span className="absolute -right-1 -top-5 text-[6rem] font-black leading-none text-[#061d45]/[0.06]">{index + 1}</span>
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#061d45] text-xs font-black text-white">{index + 1}</span>
                <h3 className="relative mt-4 text-lg font-black text-[#061d45]">{step.title}</h3>
                <p className="relative mt-2 text-sm font-semibold leading-6 text-slate-600">{step.text}</p>
                {index < nextSteps.length - 1 && <ArrowRight className="absolute -right-5 top-6 z-10 hidden text-[#e30613] sm:block" size={22} />}
              </article>
            ))}
          </div>
        </div>
      </Reveal>
    </AppContainer>
  </section>
);
