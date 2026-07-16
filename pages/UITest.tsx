import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  Brain,
  CalendarDays,
  CheckCircle2,
  Code2,
  Cpu,
  GraduationCap,
  Printer,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { SEO } from '../components/SEO';

const programs = [
  {
    title: 'Robotique',
    description: 'Assembler, programmer et tester un robot fonctionnel.',
    age: '8-14 ans',
    duration: '3h',
    price: '400 DHS',
    outcome: 'Robot programme',
    icon: Bot,
    accent: 'bg-red-50 text-brand-red border-red-100',
  },
  {
    title: 'Coding & IA',
    description: 'Creer un mini-jeu ou une experience IA avec une logique simple.',
    age: '10-17 ans',
    duration: '3h',
    price: '400 DHS',
    outcome: 'Projet code',
    icon: Code2,
    accent: 'bg-blue-50 text-brand-blue border-blue-100',
  },
  {
    title: 'Design 3D',
    description: 'Modeliser un objet, le preparer et comprendre l impression 3D.',
    age: '8-16 ans',
    duration: '3h',
    price: '400 DHS',
    outcome: 'Objet 3D',
    icon: Printer,
    accent: 'bg-orange-50 text-brand-orange border-orange-100',
  },
];

const stats = [
  { label: 'Makers formes', value: '500+' },
  { label: 'Par groupe', value: '10 max' },
  { label: 'Format atelier', value: '3h' },
  { label: 'Satisfaction parents', value: '4.9/5' },
];

const steps = [
  {
    title: 'Choisir la bonne mission',
    text: 'Un quiz rapide aide les parents a trouver l atelier adapte a l age et aux interets de leur enfant.',
  },
  {
    title: 'Construire en petit groupe',
    text: 'Chaque session privilegie la pratique, avec un coach, du materiel fourni et un rythme clair.',
  },
  {
    title: 'Repartir avec un projet',
    text: 'L enfant repart avec une creation concrete, des photos, et une meilleure confiance technique.',
  },
];

export const UITest: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fbfbf8] text-slate-950">
      <SEO
        title="MakerLab Academy - UI Test"
        description="Prototype d une direction UI plus premium, claire et conversion-focused pour MakerLab Academy."
      />

      <section className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                <Sparkles size={16} className="text-brand-red" />
                MakerLab Academy - Casablanca
              </div>

              <h1 className="font-display text-4xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
                Des ateliers tech clairs, pratiques et rassurants pour les enfants.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                En 3 heures, votre enfant decouvre une technologie, construit un vrai projet
                et repart avec une creation concrete. Le parcours est simple pour les parents,
                motivant pour les enfants.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/quiz"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 py-4 text-base font-bold text-white transition hover:bg-brand-red"
                >
                  Trouver la bonne mission
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/programs"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-4 text-base font-bold text-slate-800 transition hover:border-slate-950"
                >
                  Voir les ateliers
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-slate-200 pt-8 sm:grid-cols-4">
                {stats.map(stat => (
                  <div key={stat.label}>
                    <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                    <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-200/80">
              <div className="rounded-xl bg-white p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">Prochaine session</p>
                    <h2 className="mt-1 text-2xl font-black text-slate-950">Make & Go</h2>
                  </div>
                  <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">Ouvert</div>
                </div>

                <div className="mt-5 grid gap-3">
                  {[
                    { icon: CalendarDays, label: 'Ce week-end', value: 'Samedi ou dimanche' },
                    { icon: Users, label: 'Petit groupe', value: '10 enfants maximum' },
                    { icon: ShieldCheck, label: 'Materiel fourni', value: 'Aucun achat necessaire' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand-red shadow-sm">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-950">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold leading-6 text-brand-red">
                  Objectif: aider l enfant a vivre une premiere victoire technique, pas seulement regarder une demo.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-red">Ateliers</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-black tracking-tight md:text-5xl">
              Une grille simple pour comparer et decider vite.
            </h2>
          </div>
          <Link to="/programs" className="inline-flex items-center gap-2 font-bold text-slate-950">
            Tous les programmes <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {programs.map(program => (
            <article key={program.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-lg border ${program.accent}`}>
                <program.icon size={22} />
              </div>
              <h3 className="text-2xl font-black text-slate-950">{program.title}</h3>
              <p className="mt-3 min-h-[72px] text-base leading-6 text-slate-600">{program.description}</p>

              <div className="mt-5 grid grid-cols-3 gap-2 border-y border-slate-100 py-4 text-sm">
                <div>
                  <p className="font-bold text-slate-950">{program.age}</p>
                  <p className="text-slate-400">Age</p>
                </div>
                <div>
                  <p className="font-bold text-slate-950">{program.duration}</p>
                  <p className="text-slate-400">Duree</p>
                </div>
                <div>
                  <p className="font-bold text-slate-950">{program.price}</p>
                  <p className="text-slate-400">Prix</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-700">
                <CheckCircle2 size={17} className="text-green-600" />
                Tu repars avec: {program.outcome}
              </div>

              <Link
                to="/quiz"
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-brand-red"
              >
                Choisir cette mission
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto grid gap-10 px-6 py-16 md:grid-cols-[0.85fr_1.15fr] md:py-20">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-red">Experience</p>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight md:text-5xl">
              Le site doit guider, pas impressionner.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Cette direction garde l energie MakerLab, mais elle donne plus de calme,
              de lisibilite et de confiance aux parents.
            </p>
          </div>

          <div className="grid gap-4">
            {steps.map((step, index) => (
              <div key={step.title} className="flex gap-4 rounded-xl border border-slate-200 bg-[#fbfbf8] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">{step.title}</h3>
                  <p className="mt-1 leading-7 text-slate-600">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="rounded-2xl bg-slate-950 px-6 py-10 text-center text-white md:px-12 md:py-14">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Brain size={26} />
          </div>
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-black tracking-tight md:text-5xl">
            Calme pour les parents. Excitant pour les enfants.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-300">
            Une interface plus mature peut mieux vendre l expertise MakerLab sans perdre le cote mission et creation.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/quiz" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 font-bold text-slate-950">
              Tester le quiz <ArrowRight size={18} />
            </Link>
            <Link to="/" className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-4 font-bold text-white">
              Retour accueil
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
