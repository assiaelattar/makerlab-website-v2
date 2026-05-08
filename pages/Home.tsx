
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Cpu, Code, Printer, Plane, Star } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { ScrollReveal } from '../components/ScrollReveal';
import { VideoSection } from '../components/VideoSection';
import { PhotoGallery } from '../components/PhotoGallery';
import { FeaturedPrograms } from '../components/FeaturedPrograms';
import { useSettings } from '../contexts/SettingsContext';
import { SEO } from '../components/SEO';

/* ── Shared Section Label ──────────────────────────────────────────────── */
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">{children}</p>
);

/* ── Programs ───────────────────────────────────────────────────────────── */
const PROGRAMS = [
  { icon: Cpu,     label: 'Robotique',     color: '#c0272d', desc: 'Assemble et programme des robots réels.' },
  { icon: Code,    label: 'Coding & IA',   color: '#2563a8', desc: 'Python, Scratch, IA — code depuis zéro.' },
  { icon: Printer, label: 'Design 3D',     color: '#e87722', desc: 'Modélise et imprime tes propres créations.' },
  { icon: Plane,   label: 'Drones & Tech', color: '#27a060', desc: 'Pilote, programme et construis des drones.' },
];

/* ── Testimonials ───────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: "Mon fils est rentré avec un robot qu'il avait lui-même programmé. Il n'en revient toujours pas !",
    name: 'Nadia B.',
    role: 'Parent, Casablanca',
    avatar: '👩',
  },
  {
    quote: "J'ai appris Python en 3 heures. La meilleure journée de vacances de ma vie.",
    name: 'Youssef, 14 ans',
    role: 'Participant',
    avatar: '🧑',
  },
  {
    quote: "Une pédagogie extraordinaire. Les enfants construisent, échouent, recommencent — et adorent ça.",
    name: 'Prof. Rachida K.',
    role: 'Enseignante',
    avatar: '👩‍🏫',
  },
];

/* ══════════════════════════════════════════════════════════════════════════ */
export const Home: React.FC = () => {
  const { settings } = useSettings();
  const videoSettings = settings?.home_video || {
    videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://placehold.co/1920x1080/C0272D/ffffff.png?text=MakerLab',
    title: "L'Académie en Action",
    description: 'Découvre l\'ambiance MakerLab.',
    theme: 'red',
  };

  return (
    <div className="bg-white">
      <SEO
        title="Cours de Robotique & Codage Enfants Casablanca"
        description="MakerLab Academy : Ateliers de robotique, codage Python, et impression 3D pour enfants et ados à Casablanca."
        keywords="robotique enfants Casablanca, cours codage enfants Maroc"
      />

      {/* ── 1. HERO ──────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. PROGRAMS GRID ────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-xl mb-12">
              <SectionLabel>Nos ateliers</SectionLabel>
              <h2 className="font-display font-black text-3xl md:text-5xl text-black leading-tight">
                Choisis ta mission.
              </h2>
              <p className="mt-4 text-gray-500 text-lg leading-relaxed">
                4 univers, 1 format : 3 heures pour repartir avec un vrai projet.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROGRAMS.map((p, i) => (
              <ScrollReveal key={p.label} delay={i * 80}>
                <Link to="/programs" className="group block p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: `${p.color}18` }}
                  >
                    <p.icon size={22} style={{ color: p.color }} strokeWidth={2} />
                  </div>
                  <h3 className="font-display font-black text-lg text-black mb-2">{p.label}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                  <div
                    className="mt-4 flex items-center gap-1.5 text-xs font-bold transition-colors"
                    style={{ color: p.color }}
                  >
                    En savoir plus <ArrowRight size={13} />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED PROGRAMS (from Firebase) ────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-xl mb-12">
              <SectionLabel>À l'affiche</SectionLabel>
              <h2 className="font-display font-black text-3xl md:text-5xl text-black leading-tight">
                Programmes en vedette.
              </h2>
            </div>
          </ScrollReveal>
          <FeaturedPrograms />
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-black text-white">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-xl mb-16">
              <SectionLabel>Comment ça marche</SectionLabel>
              <h2 className="font-display font-black text-3xl md:text-5xl leading-tight">
                3 heures. 1 projet. <br />
                <span className="text-red-500">100% toi.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Tu choisis', desc: 'Drone, robot, IA, 3D — un thème qui te passionne vraiment.' },
              { step: '02', title: 'Tu construis', desc: '80% de pratique. Tu assembles, tu codes, tu testes en direct.' },
              { step: '03', title: 'Tu repartes', desc: 'Ton projet est à toi. Certificat, photos, fierté garantie.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="flex flex-col gap-4">
                  <span className="text-5xl font-black text-white/10">{item.step}</span>
                  <h3 className="font-display font-black text-2xl">{item.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-16 pt-16 border-t border-white/10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/quiz"
              className="px-8 py-4 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-all active:scale-[0.98] inline-flex items-center gap-2"
            >
              Trouver ma mission <ArrowRight size={16} />
            </Link>
            <Link
              to="/programs"
              className="px-8 py-4 bg-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/20 transition-all inline-flex items-center gap-2"
            >
              Voir tous les ateliers
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. VIDEO ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <ScrollReveal>
            <div className="max-w-xl mb-12">
              <SectionLabel>En coulisses</SectionLabel>
              <h2 className="font-display font-black text-3xl md:text-5xl text-black leading-tight">
                L'académie en action.
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <VideoSection
              videoSrc={videoSettings.videoSrc}
              poster={videoSettings.poster}
              title={videoSettings.title}
              description={videoSettings.description}
              theme={videoSettings.theme}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-xl mb-12">
              <SectionLabel>Ce qu'ils disent</SectionLabel>
              <h2 className="font-display font-black text-3xl md:text-5xl text-black leading-tight">
                Makers, parents, profs.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="p-6 bg-gray-50 rounded-2xl flex flex-col gap-4 h-full">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={14} fill="#e87722" color="#e87722" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                    <span className="text-2xl">{t.avatar}</span>
                    <div>
                      <p className="font-bold text-sm text-black">{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. PHOTO GALLERY ─────────────────────────────────────────────── */}
      {settings?.gallery_general?.length > 0 && (
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="max-w-xl mb-12">
                <SectionLabel>L'expérience MakerLab</SectionLabel>
                <h2 className="font-display font-black text-3xl md:text-5xl text-black leading-tight">
                  Nos makers en action.
                </h2>
              </div>
            </ScrollReveal>
            <PhotoGallery
              images={settings.gallery_general}
              title=""
              subtitle=""
              large={true}
            />
          </div>
        </section>
      )}

      {/* ── 8. FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="bg-red-600 rounded-3xl p-10 md:p-20 text-white text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/60 mb-4">
                Places limitées · 10 max par session
              </p>
              <h2 className="font-display font-black text-3xl md:text-6xl leading-tight mb-6">
                Prêt à créer quelque chose ?
              </h2>
              <p className="text-white/80 text-lg mb-10 max-w-md mx-auto">
                Rejoins des centaines de makers. Choisis ton atelier et réserve ta place ce week-end.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/quiz"
                  className="px-8 py-4 bg-white text-black text-base font-bold rounded-xl hover:bg-gray-100 transition-all active:scale-[0.98] inline-flex items-center justify-center gap-2"
                >
                  Trouver ma mission <ArrowRight size={18} />
                </Link>
                <Link
                  to="/programs"
                  className="px-8 py-4 bg-white/15 text-white text-base font-bold rounded-xl hover:bg-white/25 transition-all inline-flex items-center justify-center"
                >
                  Voir les ateliers
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};
