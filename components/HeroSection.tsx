import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

/* ── Cycling words ─────────────────────────────────────────────────────── */
const WORDS = [
  { word: 'CONSTRUIS', color: '#c0272d' },
  { word: 'CODE',      color: '#2563a8' },
  { word: 'DESSINE',   color: '#e87722' },
  { word: 'CRÉE',      color: '#27a060' },
];

/* ── Simple image mosaic ───────────────────────────────────────────────── */
const Mosaic: React.FC<{ images: string[] }> = ({ images }) => {
  const slots = images.slice(0, 4);
  const colors = ['#c0272d', '#2563a8', '#e87722', '#27a060'];
  return (
    <div className="grid grid-cols-2 gap-3 w-full h-full">
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border-2 border-black/10 aspect-square"
          style={{ backgroundColor: colors[i] }}
        >
          {slots[i] && (
            <img src={slots[i]} alt="" className="w-full h-full object-cover" />
          )}
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════ */
export const HeroSection: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const { settings } = useSettings();

  const words = WORDS;

  /* Smooth crossfade cycle */
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % words.length);
        setVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [words.length]);

  const current = words[idx];

  /* Images from Firebase or empty */
  const allImages = [
    ...(settings?.hero_images?.home_bento_1 || []),
    ...(settings?.hero_images?.home_bento_2 || []),
    ...(settings?.hero_images?.home_bento_3 || []),
  ];

  return (
    <section className="min-h-[90vh] flex items-center bg-white">
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── LEFT: Content ─────────────────────────────────────── */}
          <div className="flex flex-col gap-8">

            {/* Eyebrow */}
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
              MakerLab Academy · Casablanca
            </p>

            {/* Headline */}
            <h1 className="font-display font-black leading-[1.05] tracking-tight">
              <span className="block text-3xl md:text-5xl lg:text-6xl text-black">
                Ton week-end pour
              </span>

              {/* Animated word */}
              <span
                className="block text-5xl md:text-7xl lg:text-8xl transition-all duration-300"
                style={{
                  color: current.color,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(8px)',
                }}
              >
                {current.word}
              </span>

              <span className="block text-3xl md:text-5xl lg:text-6xl text-black">
                quelque chose de vrai.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-md font-medium">
              3 heures. Un thème. Un projet que tu repars avec toi.
              Robotique, coding, IA, impression 3D — choisis ta mission.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/quiz">
                <button
                  className="flex items-center gap-2 px-8 py-4 font-bold text-base text-white rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: current.color }}
                >
                  Trouver ma mission
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </Link>
              <Link to="/programs">
                <button className="flex items-center gap-2 px-8 py-4 font-bold text-base text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 active:scale-[0.98]">
                  Voir les ateliers
                </button>
              </Link>
            </div>

            {/* Social proof — minimal */}
            <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
              <div>
                <p className="font-black text-2xl text-black leading-none">500+</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Makers formés</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="font-black text-2xl text-black leading-none">3H</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Par session</p>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div>
                <p className="font-black text-2xl text-black leading-none">10</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Max par groupe</p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Image mosaic ───────────────────────────────── */}
          <div className="hidden lg:block">
            {allImages.length >= 4 ? (
              <div className="relative">
                {/* Main mosaic */}
                <div className="w-full aspect-square max-w-[480px] ml-auto">
                  <Mosaic images={allImages} />
                </div>
                {/* Floating label */}
                <div
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-5 py-3 shadow-lg border border-gray-100"
                >
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Prochaine session</p>
                  <p className="font-black text-base text-black">Ce week-end 🚀</p>
                </div>
              </div>
            ) : (
              /* No images yet — show clean color blocks */
              <div className="w-full aspect-square max-w-[480px] ml-auto grid grid-cols-2 gap-3">
                {['#c0272d', '#2563a8', '#e87722', '#27a060'].map((c, i) => (
                  <div key={i} className="rounded-2xl aspect-square flex items-end p-4" style={{ backgroundColor: c }}>
                    <span className="text-white font-black text-xs uppercase tracking-widest opacity-70">
                      {['Robotique', 'Coding', 'Design 3D', 'IA'][i]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
