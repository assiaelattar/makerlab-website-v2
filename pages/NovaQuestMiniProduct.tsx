import React from 'react';
import {
  ArrowRight,
  BadgeCheck,
  Box,
  CheckCircle2,
  ChevronRight,
  Download,
  PackageOpen,
  ShoppingCart,
  Sparkles,
  Upload,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppContainer, AppShell } from '../components/AppStyle';
import { Reveal } from '../components/Motion';
import { SEO } from '../components/SEO';
import { novaQuestMiniProduct as product } from '../data/storeProducts';

export const NovaQuestMiniProduct: React.FC = () => {
  return (
    <AppShell className="bg-[#f4f7fb] pb-24">
      <SEO
        title="Nova Quest Mini - MakerLab rover course + kit"
        description="A MakerLab robotics adventure where learners design, simulate, code, assemble, test and improve a micro:bit rover robot."
        keywords="Nova Quest Mini, MakerLab rover kit, microbit robot Morocco, MakeCode robotics, STEM robot kit"
        image={product.heroImage}
      />

      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-2 bg-[#0042a5]" />
        <AppContainer className="relative grid min-h-[760px] items-center gap-10 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:py-16">
          <Reveal>
            <div className="max-w-2xl">
              <Link to="/store" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-slate-400 hover:text-[#003c9e]">
                Store <ChevronRight size={16} /> {product.title}
              </Link>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#c8d8f2] bg-[#f4f8ff] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0042a5]">
                <Sparkles size={15} />
                {product.type}
              </div>
              <h1 className="mt-7 max-w-2xl text-[3.4rem] font-black leading-[0.92] text-[#003c9e] md:text-[5.4rem]">
                Build a rover from idea to mission.
              </h1>
              <p className="mt-6 max-w-xl text-2xl font-black leading-9 text-[#17242d]">
                {product.promise}
              </p>
              <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-slate-600">
                {product.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/contact?subject=nova-quest-mini-workshop" className="ml-button bg-[#e30613] px-6 text-white shadow-lg">
                  Build it at MakerLab <ArrowRight size={19} />
                </Link>
                <Link to="/contact?subject=nova-quest-mini-kit" className="ml-button border border-[#c8d8f2] bg-white px-6 text-[#003c9e] shadow-sm">
                  Join rover pilot <ShoppingCart size={19} />
                </Link>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
                {product.highlights.map((item) => (
                  <div key={item} className="rounded-lg border border-[#dce7f7] bg-white px-3 py-4 text-center shadow-sm">
                    <p className="text-xs font-black uppercase leading-4 text-[#003c9e]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <img
                src={product.heroImage}
                alt="MakerLab Nova Quest Mini rover robot with MDF chassis, micro:bit shield, wires and side wheel"
                className="relative w-full rounded-[1.3rem] border border-[#d8e4f6] bg-white object-cover shadow-2xl"
              />
              <div className="relative mx-4 -mt-10 rounded-[1rem] border border-[#d8e4f6] bg-white p-4 shadow-xl md:mx-8">
                <div className="flex items-start gap-3">
                  <PackageOpen className="mt-1 text-[#e30613]" size={22} />
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.14em] text-[#003c9e]">Real MakerLab rover project</p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-slate-600">
                      The commercial version must keep the real boxy MDF rover, visible electronics, micro:bit shield, wiring and mission-based robotics workflow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </AppContainer>
      </section>

      <AppContainer className="space-y-12 py-12">
        <Reveal>
          <section className="grid gap-5 lg:grid-cols-3">
            {product.difference.map((item) => (
              <article key={item.title} className="rounded-[1.2rem] border border-[#d8e4f6] bg-white p-6 shadow-xl">
                <BadgeCheck className="text-[#10a858]" size={28} />
                <h2 className="mt-5 text-2xl font-black leading-tight text-[#003c9e]">{item.title}</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </section>
        </Reveal>

        <Reveal>
          <section className="rounded-[1.4rem] border border-[#d8e4f6] bg-white p-6 shadow-xl md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e30613]">The rover adventure</p>
                <h2 className="mt-3 text-4xl font-black leading-tight text-[#003c9e]">From robot idea to exploration challenge.</h2>
                <p className="mt-4 text-base font-semibold leading-7 text-slate-600">
                  This page should help parents understand the real value: the child learns the engineering loop, then proves it by making the rover move.
                </p>
              </div>
              <div className="grid gap-3">
                {product.journey.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <article key={step.label} className="grid grid-cols-[56px_1fr] gap-4 rounded-[1rem] border border-[#e2eaf6] bg-[#f8fbff] p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#003c9e] text-white">
                        <Icon size={22} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-[#e30613]">Mission step {index + 1}</p>
                        <h3 className="mt-1 text-xl font-black text-[#17242d]">{step.label}</h3>
                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{step.text}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-[1.4rem] border border-[#d8e4f6] bg-white shadow-xl">
              <img src={product.heroImage} alt="Nova Quest Mini commercial rover hero" className="h-full min-h-[520px] w-full object-cover" />
            </div>
            <div className="rounded-[1.4rem] bg-[#003c9e] p-7 text-white shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">What the learner gets</p>
              <h2 className="mt-3 text-4xl font-black leading-tight">A robotics playbook plus a real rover.</h2>
              <div className="mt-7 grid gap-3">
                {product.outcomes.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-lg bg-white/10 p-4">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[#f7b500]" size={18} />
                    <span className="text-sm font-bold leading-6">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="rounded-[1.4rem] border border-[#d8e4f6] bg-white p-6 shadow-xl md:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e30613]">What is inside</p>
                <h2 className="mt-2 text-4xl font-black leading-tight text-[#003c9e]">Every part teaches one robot job.</h2>
              </div>
              <p className="max-w-lg text-sm font-semibold leading-6 text-slate-500">
                Final motor model, battery format, quantities and safety labels still need production approval.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {product.components.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.label} className="rounded-lg border border-[#dce7f7] bg-[#f7faff] p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#003c9e] text-white">
                      <Icon size={21} />
                    </div>
                    <h3 className="mt-4 text-lg font-black text-[#17242d]">{item.label}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{item.note}</p>
                  </article>
                );
              })}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="rounded-[1.4rem] bg-[#17242d] p-6 text-white shadow-xl md:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f7b500]">Choose your path</p>
                <h2 className="mt-2 text-4xl font-black leading-tight">Start with the kit, a MakerLab session, or a custom chassis.</h2>
              </div>
              <p className="max-w-md text-sm font-semibold leading-6 text-white/70">
                For now, the product converts into pilot interest while price, stock, safety, age and delivery details are confirmed.
              </p>
            </div>
            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {product.formats.map((format) => {
                const Icon = format.icon;
                return (
                  <article key={format.title} className="rounded-[1rem] border border-white/12 bg-white p-5 text-[#17242d]">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#003c9e] text-white">
                        <Icon size={22} />
                      </div>
                      <span className="rounded-full bg-[#f1f6ff] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#003c9e]">
                        {format.status}
                      </span>
                    </div>
                    <h3 className="mt-5 text-2xl font-black">{format.title}</h3>
                    <p className="mt-3 min-h-[120px] text-sm font-semibold leading-6 text-slate-500">{format.text}</p>
                    <Link to={format.to} className="mt-5 inline-flex items-center gap-2 font-black text-[#e30613]">
                      {format.action} <ChevronRight size={18} />
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="rounded-[1.4rem] border border-[#d8e4f6] bg-white p-6 shadow-xl md:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#003c9e]">Fabrication loop</p>
                <h2 className="mt-2 text-3xl font-black leading-tight">The rover can become a custom mission vehicle.</h2>
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
                  The learner can adapt the chassis idea, then MakerLab can help check, laser-cut or prepare a custom version when that service is available.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  [Upload, 'Adapt the chassis', 'Change the robot body idea.'],
                  [Users, 'Ask MakerLab support', 'Check if the design can be made.'],
                  [Box, 'Cut and test', 'Build the custom rover version.'],
                ].map(([Icon, title, text]) => {
                  const StepIcon = Icon as typeof Upload;
                  return (
                    <div key={title as string} className="rounded-lg border border-[#dce7f7] bg-[#f7faff] p-4">
                      <StepIcon className="text-[#003c9e]" size={24} />
                      <h3 className="mt-3 font-black text-[#17242d]">{title as string}</h3>
                      <p className="mt-1 text-sm font-semibold text-slate-500">{text as string}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <Link to="/contact?subject=nova-quest-mini-custom-cad" className="mt-7 inline-flex items-center gap-2 rounded-lg border border-[#d8e4f6] bg-white px-5 py-3 font-black text-[#003c9e] shadow-sm">
              Request rover fabrication support <Download size={18} />
            </Link>
          </section>
        </Reveal>
      </AppContainer>
    </AppShell>
  );
};
