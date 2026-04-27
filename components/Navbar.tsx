import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Home, BookOpen, PenTool, UserPlus, Presentation, Users, Info, Star, Sparkles } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

interface NavbarProps {
  scrolled?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ scrolled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Programs', path: '/programs', icon: Zap },
    { name: 'Maker Wall', path: '/maker-wall', icon: Star },
    { name: 'Kids & Families', path: '/kids-families', icon: Users },
    { name: 'Schools', path: '/schools', icon: Presentation },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Contact', path: '/contact', icon: PenTool },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.setProperty('overflow', 'hidden', 'important');
    } else {
      document.body.style.overflow = '';
      document.body.style.removeProperty('overflow');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.removeProperty('overflow');
    };
  }, [isOpen]);

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <>
      <nav className={`z-50 w-full transition-all duration-300`}>
        <div className={`mx-0 md:mx-8 transition-all duration-300 ${scrolled ? 'md:px-4' : ''}`}>
          <div className={`
            bg-white border-b-4 md:border-4 border-black md:rounded-xl flex justify-between items-center relative transition-all duration-300
            ${scrolled ? 'p-2 shadow-neo-sm border-brand-red' : 'p-3 md:p-4 shadow-neo border-black'}
          `}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
              <div className={`bg-white p-1 md:p-1.5 rounded-full border-4 border-black group-hover:rotate-12 transition-all duration-500 shadow-neo-sm ${scrolled ? 'scale-90' : 'scale-100'}`}>
                <img src="/logo-icon.png" alt="Makerlab Academy Icon" className="w-8 h-8 md:w-12 md:h-12 object-contain" />
              </div>
              <div className={`flex flex-col leading-none transition-all duration-300 origin-left ${scrolled ? 'scale-90' : 'scale-100'}`}>
                <span className="font-display font-black text-xl md:text-3xl uppercase tracking-tighter text-black select-none">Makerlab</span>
                <span className="font-display font-black text-xs md:text-sm uppercase tracking-[0.2em] text-brand-red select-none">Academy</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden xl:flex items-center gap-4 xl:gap-6">
              {navLinks.filter(link => link.name !== 'Home').map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-black font-display text-xs xl:text-sm uppercase tracking-wide hover:text-brand-red transition-colors ${isActive(link.path) ? 'text-brand-green underline decoration-4 underline-offset-4' : 'text-black'}`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/quiz" className="hidden lg:flex">
                <Button variant="primary" size="sm" className="uppercase tracking-widest text-xs flex items-center gap-1.5 bg-brand-orange text-black border-black hover:bg-brand-orange/90">
                  <Sparkles size={14} /> Trouver ma mission
                </Button>
              </Link>
              <Link to="/booking/trial?type=trial" className="hidden xl:flex">
                <Button variant="outline" size="sm" className="uppercase tracking-widest text-xs border-black bg-white hover:bg-gray-50 text-black">Essai Gratuit</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className={`uppercase tracking-widest text-xs hidden xl:flex transition-all duration-300 ${scrolled ? 'scale-90 px-4' : ''}`}>S'inscrire</Button>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className={`xl:hidden text-black p-2 bg-gray-100 rounded-none border-4 border-black hover:bg-gray-200 transition-all shadow-neo-sm ${scrolled ? 'scale-90' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              <Menu size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide Drawer */}
      {createPortal(
        <>
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-[110] bg-black/60 xl:hidden transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className={`
            fixed top-0 right-0 h-full w-[82vw] max-w-[320px] z-[120] bg-white
            border-l-4 border-black flex flex-col xl:hidden
            transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          `}>

            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 py-4 bg-brand-red border-b-4 border-black shrink-0">
              <div className="flex items-center gap-2.5">
                <img src="/logo-icon.png" alt="logo" className="w-8 h-8 border-2 border-white/50 rounded-full object-contain" />
                <div>
                  <p className="font-black text-white text-sm uppercase tracking-tight leading-none">MakerLab</p>
                  <p className="font-black text-white/60 text-[10px] uppercase tracking-widest">Academy</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
              >
                <X size={18} strokeWidth={3} className="text-black" />
              </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-3 px-3">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 py-3.5 px-3 rounded-xl mb-1
                    font-black text-sm uppercase tracking-wider
                    transition-all duration-150 active:scale-[0.98]
                    ${isActive(link.path)
                      ? 'bg-brand-orange/10 text-brand-orange border-l-4 border-brand-orange pl-4'
                      : 'text-black hover:bg-gray-50 border-l-4 border-transparent'
                    }
                  `}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <link.icon
                    size={18}
                    strokeWidth={2.5}
                    className={isActive(link.path) ? 'text-brand-orange' : 'text-gray-400'}
                  />
                  <span className="flex-1">{link.name}</span>
                  {isActive(link.path) && (
                    <div className="w-2 h-2 bg-brand-orange rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Bottom CTAs — thumb zone */}
            <div className="px-4 py-4 border-t-4 border-black bg-gray-50 shrink-0 space-y-2.5">
              <Link
                to="/quiz"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-brand-orange text-black font-black uppercase tracking-widest text-sm py-3.5 px-4 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-[0.98]"
              >
                <Sparkles size={16} strokeWidth={3} />
                Trouver ma mission
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/booking/trial?type=trial"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center bg-white text-black font-black uppercase tracking-widest text-[11px] py-3 px-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-px hover:translate-y-px transition-all text-center active:scale-[0.98]"
                >
                  <Star size={13} className="mr-1.5 shrink-0" strokeWidth={3} />
                  Essai Gratuit
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center bg-brand-red text-white font-black uppercase tracking-widest text-[11px] py-3 px-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-px hover:translate-y-px transition-all text-center active:scale-[0.98]"
                >
                  <UserPlus size={13} className="mr-1.5 shrink-0" strokeWidth={3} />
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};