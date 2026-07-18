import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Clock3,
  GraduationCap,
  Info,
  LayoutGrid,
  Menu,
  School,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { defaultPageContent } from '../data/defaultPageContent';

const PROGRAM_LINKS = [
  {
    name: 'Comparer tous les programmes',
    description: 'Âge, durée, format et résultat attendu.',
    path: '/programs',
    icon: LayoutGrid,
    tone: 'bg-slate-950 text-white',
  },
  {
    name: 'Missions de 3 heures',
    description: 'Une première réussite, en une session.',
    path: '/programs?focus=missions',
    icon: Clock3,
    tone: 'bg-brand-orange/10 text-brand-orange',
  },
  {
    name: 'Camps de vacances',
    description: 'Plusieurs jours pour explorer et fabriquer.',
    path: '/programs?type=camp',
    icon: CalendarDays,
    tone: 'bg-brand-green/10 text-brand-green',
  },
  {
    name: 'Parcours à l’année',
    description: 'Une progression régulière par projets.',
    path: '/programs?type=annual',
    icon: GraduationCap,
    tone: 'bg-brand-blue/10 text-brand-blue',
  },
];

const DISCOVERY_LINKS = [
  { name: 'Écoles', path: '/schools', icon: School },
  { name: 'Projets', path: '/maker-wall', icon: Trophy },
  { name: 'Journal', path: '/blog', icon: BookOpen },
  { name: 'À propos', path: '/about', icon: Info },
];

export const Navbar: React.FC<{ scrolled?: boolean }> = ({ scrolled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const programMenuRef = useRef<HTMLDetailsElement>(null);
  const location = useLocation();
  const { settings } = useSettings();
  const content = { ...defaultPageContent.navigation, ...(settings?.page_content?.navigation || {}) };
  const currentPath = `${location.pathname}${location.search}`;
  const programsActive = location.pathname.startsWith('/programs') || location.pathname === '/kids-families';

  const isActive = (path: string) => {
    if (path === '/programs') return location.pathname === '/programs' && !location.search;
    if (path.includes('?')) return currentPath === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const closeMenus = () => {
    setIsOpen(false);
    programMenuRef.current?.removeAttribute('open');
  };

  useEffect(closeMenus, [location.pathname, location.search]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenus();
    };
    const closeProgramMenuOnOutsideClick = (event: MouseEvent) => {
      if (programMenuRef.current?.open && !programMenuRef.current.contains(event.target as Node)) {
        programMenuRef.current.removeAttribute('open');
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('mousedown', closeProgramMenuOnOutsideClick);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('mousedown', closeProgramMenuOnOutsideClick);
    };
  }, []);

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <>
      <nav className="w-full px-3 py-3 md:px-6" aria-label="Navigation principale">
        <div className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-lg border border-white/70 bg-white/90 px-4 backdrop-blur-2xl transition-all duration-300 ${scrolled ? 'shadow-xl shadow-slate-900/10' : 'shadow-md shadow-slate-900/5'}`}>
          <Link to="/" className="flex min-h-11 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/25" onClick={closeMenus}>
            <img src="/logo-icon.png" alt="" className="h-9 w-9 object-contain" />
            <div className="leading-none">
              <span className="block font-display text-base font-black text-slate-950">
                MAKER<span className="text-brand-orange">LAB</span>
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.26em] text-slate-950/45">Academy</span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <details ref={programMenuRef} className="group relative">
              <summary
                className={`flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-black transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/20 [&::-webkit-details-marker]:hidden ${
                  programsActive ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
                aria-label="Ouvrir le menu des programmes"
              >
                Programmes <ChevronDown size={15} className="transition-transform group-open:rotate-180" />
              </summary>

              <div className="absolute left-0 top-[calc(100%+12px)] z-50 w-[540px] rounded-xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-950/15">
                <div className="mb-2 flex items-center justify-between px-2 py-1">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-brand-orange">Choisir son rythme</p>
                    <p className="mt-1 text-sm font-bold text-slate-500">Commencez par le temps disponible.</p>
                  </div>
                  <Link to="/kids-families" onClick={closeMenus} className="text-xs font-black text-brand-blue hover:underline">
                    Espace familles
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PROGRAM_LINKS.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={closeMenus}
                      aria-current={isActive(link.path) ? 'page' : undefined}
                      className={`group/item flex min-h-[94px] gap-3 rounded-lg border p-3 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${
                        isActive(link.path) ? 'border-brand-orange/45 bg-brand-orange/[0.04]' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${link.tone}`}><link.icon size={18} /></span>
                      <span>
                        <span className="block text-sm font-black leading-snug text-slate-900">{link.name}</span>
                        <span className="mt-1 block text-xs font-semibold leading-5 text-slate-500">{link.description}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </details>

            {DISCOVERY_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                aria-current={isActive(link.path) ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-black transition-colors ${
                  isActive(link.path)
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/booking/trial?type=trial" className="ml-button min-h-11 rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-800">
              {content.trialLabel}
            </Link>
            <Link to="/quiz" className="ml-button min-h-11 rounded-lg bg-brand-orange px-5 py-2.5 text-sm text-white shadow-sm">
              {content.finderLabel} <Sparkles size={15} />
            </Link>
          </div>

          <button className="ml-icon bg-slate-950 text-white lg:hidden" onClick={() => setIsOpen(true)} aria-label="Ouvrir le menu" aria-expanded={isOpen}>
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
            tabIndex={isOpen ? 0 : -1}
          />
          <aside
            className={`fixed inset-y-0 right-0 z-[120] flex h-dvh w-full max-w-sm flex-col bg-[#f3f5f7] p-4 transition-transform duration-300 ease-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            aria-label="Menu mobile"
            aria-hidden={!isOpen}
            inert={!isOpen}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <Link to="/" className="flex min-h-11 items-center gap-2" onClick={closeMenus}>
                <img src="/logo-icon.png" alt="" className="h-9 w-9 object-contain" />
                <span className="font-display text-base font-black">MAKER<span className="text-brand-orange">LAB</span></span>
              </Link>
              <button onClick={() => setIsOpen(false)} className="ml-icon bg-white shadow-sm" aria-label="Fermer le menu">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 flex-1 overflow-y-auto overscroll-contain pr-1">
              <p className="px-1 text-[10px] font-black uppercase tracking-[0.14em] text-brand-orange">Choisir un programme</p>
              <div className="mt-2 grid gap-2">
                {PROGRAM_LINKS.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenus}
                    aria-current={isActive(link.path) ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition ${
                      isActive(link.path) ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-900'
                    }`}
                  >
                    <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${isActive(link.path) ? 'bg-white/12 text-brand-orange' : link.tone}`}><link.icon size={18} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-black">{link.name}</span>
                      <span className={`mt-0.5 block text-[11px] font-semibold ${isActive(link.path) ? 'text-white/65' : 'text-slate-500'}`}>{link.description}</span>
                    </span>
                    <ArrowRight size={16} className="shrink-0" />
                  </Link>
                ))}
              </div>

              <p className="mt-6 px-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Découvrir MakerLab</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {DISCOVERY_LINKS.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenus}
                    aria-current={isActive(link.path) ? 'page' : undefined}
                    className={`flex min-h-14 items-center gap-2 rounded-lg border px-3 text-sm font-black ${
                      isActive(link.path) ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-800'
                    }`}
                  >
                    <link.icon size={17} className={isActive(link.path) ? 'text-brand-orange' : 'text-slate-400'} /> {link.name}
                  </Link>
                ))}
              </div>

              <Link to="/contact" onClick={closeMenus} className="mt-2 flex min-h-12 items-center justify-between rounded-lg border border-slate-200 bg-white px-4 text-sm font-black text-slate-800">
                Une question ? Contactez-nous <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-200 pt-4">
              <Link to="/quiz" onClick={closeMenus} className="ml-button flex h-14 bg-brand-orange text-white">
                {content.finderLabel} <ArrowUpRight size={17} />
              </Link>
              <Link to="/booking/trial?type=trial" onClick={closeMenus} className="ml-button flex h-12 border border-slate-200 bg-white text-slate-800">
                {content.trialLabel}
              </Link>
            </div>
          </aside>
        </>,
        document.body
      )}
    </>
  );
};
