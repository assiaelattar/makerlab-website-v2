import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { name: 'Ateliers', path: '/programs' },
  { name: 'Maker Wall', path: '/maker-wall' },
  { name: 'Familles', path: '/kids-families' },
  { name: 'Écoles', path: '/schools' },
  { name: 'À propos', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export const Navbar: React.FC<{ scrolled?: boolean }> = ({ scrolled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => setIsOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <>
      <nav className="w-full px-3 py-3 md:px-6">
        <div className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-lg border border-white/70 bg-white/88 px-4 backdrop-blur-2xl transition-all duration-300 ${scrolled ? 'shadow-xl shadow-slate-900/10' : 'shadow-md shadow-slate-900/5'}`}>
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
            <img src="/logo-icon.png" alt="MakerLab" className="h-9 w-9 object-contain" />
            <div className="leading-none">
              <span className="block font-display text-base font-black text-slate-950">
                MAKER<span className="text-brand-orange">LAB</span>
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.26em] text-slate-950/45">Academy</span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map(link => (
              <Link
                key={link.name}
                to={link.path}
                className={`rounded-xl px-4 py-2 text-sm font-black transition-colors ${
                  isActive(link.path)
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-500 hover:bg-white hover:text-slate-950'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/booking/trial?type=trial" className="ml-button min-h-10 rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-800">
              Essai gratuit
            </Link>
            <Link to="/quiz" className="ml-button min-h-10 rounded-xl bg-brand-orange px-5 py-2.5 text-sm text-white shadow-sm">
              Trouver ma mission <ArrowUpRight size={15} />
            </Link>
          </div>

          <button className="ml-icon bg-slate-950 text-white lg:hidden" onClick={() => setIsOpen(true)} aria-label="Ouvrir le menu">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {createPortal(
        <>
          <button
            className={`fixed inset-0 z-[110] bg-slate-950/55 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le menu"
          />
          <div className={`fixed inset-y-0 right-0 z-[120] flex h-dvh w-full max-w-sm flex-col bg-[#f3f5f7] p-4 transition-transform duration-300 ease-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                <img src="/logo-icon.png" alt="MakerLab" className="h-9 w-9 object-contain" />
                <span className="font-display text-base font-black">MAKER<span className="text-brand-orange">LAB</span></span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="ml-icon bg-white shadow-sm" aria-label="Fermer le menu">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 flex-1 space-y-2 overflow-y-auto">
              {NAV_LINKS.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center justify-between rounded-lg border px-5 py-4 text-base font-black transition ${
                    isActive(link.path)
                      ? 'border-slate-950 bg-slate-950 text-white'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`text-xs ${isActive(link.path) ? 'text-brand-orange' : 'text-slate-300'}`}>0{index + 1}</span>
                    {link.name}
                  </span>
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
              <Link to="/quiz" onClick={() => setIsOpen(false)} className="ml-button flex h-14 bg-brand-orange text-white">
                Trouver ma mission <ArrowUpRight size={17} />
              </Link>
              <Link to="/booking/trial?type=trial" onClick={() => setIsOpen(false)} className="ml-button flex h-14 border border-slate-200 bg-white text-slate-800">
                Réserver un essai
              </Link>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};
