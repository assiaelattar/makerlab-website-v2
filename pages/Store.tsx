import React from 'react';
import { ArrowRight, BookOpen, Box, CheckCircle2, Filter, PackageOpen, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppContainer, AppShell } from '../components/AppStyle';
import { Reveal } from '../components/Motion';
import { SEO } from '../components/SEO';
import { storeProducts } from '../data/storeProducts';

export const Store: React.FC = () => {
  const featured = storeProducts[0];

  return (
    <AppShell className="bg-[#f4f7fb] pb-24">
      <SEO
        title="MakerLab Store - STEM maker adventures"
        description="Shop MakerLab course-guided STEM kits and maker adventures for young builders."
        keywords="MakerLab store, STEM kits Morocco, maker kits, microbit projects, kids robotics"
        image={featured.heroImage}
      />

      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-x-0 top-0 h-2 bg-[#0042a5]" />
        <AppContainer className="grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c8d8f2] bg-[#f4f8ff] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0042a5]">
                <Sparkles size={15} />
                MakerLab Store
              </div>
              <h1 className="mt-7 max-w-3xl text-[3.4rem] font-black leading-[0.94] text-[#003c9e] md:text-[5rem]">
                Buy the adventure, not just the parts.
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-600">
                MakerLab products are guided maker missions. Each one combines a learning playbook, real materials, digital design, electronics, coding, building, testing, and optional MakerLab support.
              </p>
              <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                {['Course-guided kits', 'Workshop path', 'Custom fabrication'].map((item) => (
                  <div key={item} className="rounded-lg border border-[#dce7f7] bg-white px-4 py-4 shadow-sm">
                    <CheckCircle2 className="text-[#10a858]" size={19} />
                    <p className="mt-3 text-sm font-black uppercase leading-5 text-[#003c9e]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Link to={`/store/${featured.slug}`} className="group block overflow-hidden rounded-[1.4rem] border border-[#d8e4f6] bg-white shadow-2xl">
              <div className="relative">
                <img src={featured.unboxingImage} alt={`${featured.title} unboxing`} className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                <div className="absolute left-5 top-5 rounded-full bg-[#e30613] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
                  Featured pilot
                </div>
              </div>
              <div className="grid gap-5 p-6 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e30613]">{featured.type}</p>
                  <h2 className="mt-2 text-3xl font-black leading-tight text-[#003c9e]">{featured.title}</h2>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{featured.storeCardText}</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-lg bg-[#003c9e] px-5 py-3 font-black text-white">
                  View product <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          </Reveal>
        </AppContainer>
      </section>

      <AppContainer className="py-12">
        <Reveal>
          <div className="mb-6 flex flex-col gap-4 rounded-[1.2rem] border border-[#d8e4f6] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 rounded-lg bg-[#f5f8fc] px-4 py-3 text-sm font-bold text-slate-500">
              <Search size={18} />
              First catalog: pilot products only
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#d8e4f6] px-4 py-3 text-sm font-black uppercase tracking-[0.12em] text-[#003c9e]">
              <Filter size={18} />
              Mission catalog
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {storeProducts.map((product) => (
            <Reveal key={product.id}>
              <article className="flex h-full flex-col overflow-hidden rounded-[1.2rem] border border-[#d8e4f6] bg-white shadow-xl">
                <Link to={`/store/${product.slug}`} className="group block">
                  <img src={product.heroImage} alt={product.title} className="h-64 w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#f4f8ff] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#003c9e]">{product.status}</span>
                    <span className="rounded-full bg-[#fff3f4] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#e30613]">{product.type}</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-black leading-tight text-[#17242d]">{product.title}</h2>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{product.storeCardText}</p>
                  <div className="mt-5 grid gap-2">
                    {product.highlights.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                        <CheckCircle2 size={16} className="text-[#10a858]" />
                        {item}
                      </div>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">Offer</p>
                      <p className="font-black text-[#003c9e]">{product.priceLabel}</p>
                    </div>
                    <Link to={`/store/${product.slug}`} className="inline-flex items-center gap-2 rounded-lg bg-[#e30613] px-4 py-3 text-sm font-black text-white">
                      Explore <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal>
            <article className="flex min-h-[520px] flex-col justify-between rounded-[1.2rem] border border-dashed border-[#b9cbea] bg-[#f8fbff] p-6">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[#003c9e] shadow-sm">
                  <PackageOpen size={24} />
                </div>
                <h2 className="mt-5 text-3xl font-black leading-tight text-[#003c9e]">More missions coming after the first loop.</h2>
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
                  We will duplicate only after Smart Door proves the full loop: product idea, visuals, guide, packaging, store, delivery and feedback.
                </p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <BookOpen className="text-[#e30613]" size={22} />
                <p className="mt-3 text-sm font-black uppercase leading-5 text-slate-700">Next product slots stay locked until evidence is ready.</p>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal>
          <section className="mt-12 rounded-[1.4rem] bg-[#17242d] p-7 text-white shadow-xl md:p-9">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f7b500]">Real store foundation</p>
                <h2 className="mt-3 text-4xl font-black leading-tight">Catalog now, checkout later when facts are approved.</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ['Product listing', 'Parents can discover available missions.'],
                  ['Product landing page', 'Each kit has a conversion story.'],
                  ['ERP bridge next', 'Product facts can later come from Edufy/Firebase.'],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-lg bg-white/10 p-4">
                    <Box size={22} className="text-[#f7b500]" />
                    <h3 className="mt-3 font-black">{title}</h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white/70">{text}</p>
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
