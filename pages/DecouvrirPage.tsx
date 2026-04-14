import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Instagram, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

/* Gallery of real maker project photos (pulled from public assets or Firebase) */
const GALLERY = [
  { src: '/gallery/maker-1.webp', alt: 'Robot assemblé par un enfant Maker', caption: 'Robot Autonome — 10 ans' },
  { src: '/gallery/maker-2.webp', alt: 'T-Shirt design et impression', caption: 'T-Shirt Design — 12 ans' },
  { src: '/gallery/maker-3.webp', alt: 'Jeu vidéo codé en Python', caption: 'Retro Arcade — 11 ans' },
  { src: '/gallery/maker-4.webp', alt: 'Coffre-fort découpé au laser', caption: 'Coffre-Fort Laser — 13 ans' },
  { src: '/gallery/maker-5.webp', alt: 'Atelier robotique MakerLab Casablanca', caption: 'Atelier Make & Go' },
  { src: '/gallery/maker-6.webp', alt: 'Enfants créateurs MakerLab', caption: 'Nos Makers · Casablanca' },
];

/* Fallback colored placeholder for missing images */
const COLORS = ['#CC0000', '#E8580A', '#2563a8', '#27a060', '#7c3aed', '#db2777'];

export const DecouvrirPage: React.FC = () => {
  /* Fire Meta Pixel retargeting event on page load (client-side) */
  useEffect(() => {
    try {
      const w = window as any;
      if (typeof w.fbq === 'function') {
        w.fbq('track', 'PageView');
        w.fbq('trackCustom', 'ColdLeadLanding');
      }
    } catch { /* ignore if pixel not loaded */ }
  }, []);

  return (
    <>
      <SEO
        title="Découvrez MakerLab Academy — Ateliers Créatifs Casablanca"
        description="Découvrez les créations de nos Makers. Revenez quand vous êtes prêt — on sera là."
        keywords={['atelier enfants Casablanca', 'robotique', 'coding', 'STEM Maroc']}
      />

      <div className="min-h-screen bg-white flex flex-col font-sans">

        {/* Logo bar */}
        <div className="border-b-4 border-black px-6 py-4 flex items-center justify-between bg-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black border-4 border-black flex items-center justify-center font-display font-black text-sm text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">ML</div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-sm uppercase tracking-widest">MakerLab</span>
              <span className="font-display font-black text-[9px] uppercase tracking-[0.22em] text-gray-400">Academy</span>
            </div>
          </Link>
          <a
            href="https://www.instagram.com/makerlab.academy/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 border-2 border-black rounded-xl font-display font-black text-[9px] uppercase tracking-widest shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Instagram size={14} /> Suivre
          </a>
        </div>

        {/* Main */}
        <div className="flex-1 px-4 py-12 max-w-4xl mx-auto w-full space-y-12">

          {/* Hero */}
          <div className="text-center space-y-5">
            <div className="inline-flex items-center gap-2 bg-gray-100 border-2 border-gray-200 px-4 py-1.5 font-display font-black text-[9px] uppercase tracking-widest rounded-full">
              <Sparkles size={11} className="text-[#E8580A]" /> Ici, on construit, pas on achète
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl uppercase leading-tight">
              Découvrez nos créations.<br />
              <span className="text-gray-400">Revenez quand vous êtes prêt.</span>
            </h1>
            <p className="font-sans font-semibold text-gray-600 text-lg max-w-xl mx-auto">
              Aucune pression. Explorez les Trophées que nos Makers emportent à la maison chaque samedi.
            </p>
          </div>

          {/* Masonry gallery */}
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {GALLERY.map((img, i) => (
              <div
                key={i}
                className="break-inside-avoid border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => {
                      // Fallback to colored placeholder if image missing
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.background = COLORS[i % COLORS.length];
                        parent.style.minHeight = '140px';
                        parent.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:140px;"><span style="font-size:32px">${['🤖','👕','🎮','🔧','⚡','🏆'][i]}</span></div>`;
                      }
                    }}
                  />
                </div>
                <div className="px-3 py-2 bg-white">
                  <p className="font-display font-black text-[10px] uppercase text-gray-600">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Instagram CTA */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 border-4 border-black rounded-3xl p-8 text-center text-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <Instagram size={32} className="mx-auto mb-3" />
            <h2 className="font-display font-black text-2xl uppercase mb-2">
              Suivez nos Makers sur Instagram
            </h2>
            <p className="font-sans text-sm text-white/80 mb-5">
              Chaque samedi, de nouveaux Trophées. Des robots, des jeux, des vêtements, des coffres.
            </p>
            <a
              href="https://www.instagram.com/makerlab.academy/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 border-4 border-black font-display font-black text-sm uppercase rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              <Instagram size={18} /> Voir notre Instagram
            </a>
          </div>

          {/* Soft re-engage */}
          <div className="bg-gray-50 border-4 border-gray-200 rounded-3xl p-8 text-center">
            <RefreshCw size={24} className="mx-auto mb-3 text-gray-400" />
            <h2 className="font-display font-black text-xl uppercase mb-2 text-gray-700">
              Pas encore prêt ? Pas de problème.
            </h2>
            <p className="font-sans text-sm text-gray-500 mb-5 max-w-md mx-auto">
              Revenez à tout moment pour refaire le quiz — les disponibilités changent chaque semaine.
            </p>
            <Link
              to="/apply"
              className="inline-flex items-center gap-2 bg-[#CC0000] text-white px-6 py-3 border-4 border-black font-display font-black text-sm uppercase rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Refaire le quiz <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black bg-white px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            ← Retour au site
          </Link>
          <span className="text-[10px] font-sans text-gray-400">MakerLab Academy · Casablanca</span>
        </div>
      </div>
    </>
  );
};
