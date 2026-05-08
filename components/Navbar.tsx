import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { createPortal } from 'react-dom';

const NAV_LINKS = [
  { name: 'Programs',       path: '/programs' },
  { name: 'Maker Wall',     path: '/maker-wall' },
  { name: 'Kids & Families',path: '/kids-families' },
  { name: 'Schools',        path: '/schools' },
  { name: 'About',          path: '/about' },
  { name: 'Blog',           path: '/blog' },
  { name: 'Contact',        path: '/contact' },
];

export const Navbar: React.FC<{ scrolled?: boolean }> = ({ scrolled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isActive = (p: string) => location.pathname === p;

  useEffect(() => { setIsOpen(false); }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <>
      <nav
        className={`z-50 w-full transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
        } border-b border-gray-100`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setIsOpen(false)}>
              <img
                src="/logo-icon.png"
                alt="MakerLab"
                className="w-8 h-8 md:w-10 md:h-10 object-contain group-hover:rotate-6 transition-transform duration-300"
              />
              <div className="leading-none">
                <span className="block font-display font-black text-base md:text-lg text-black tracking-tight">
                  MakerLab
                </span>
                <span className="block font-bold text-[10px] uppercase tracking-[0.2em] text-red-600">
                  Academy
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                    isActive(link.path)
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-500 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/booking/trial?type=trial"
                className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
              >
                Essai gratuit
              </Link>
              <Link
                to="/quiz"
                className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all duration-150 active:scale-[0.98]"
              >
                Trouver ma mission →
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {createPortal(
        <>
          <div
            className={`fixed inset-0 z-[110] bg-black/40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsOpen(false)}
          />
          <div className={`fixed top-0 right-0 h-full w-[80vw] max-w-[300px] z-[120] bg-white flex flex-col lg:hidden transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src="/logo-icon.png" alt="logo" className="w-7 h-7 object-contain" />
                <span className="font-black text-sm">MakerLab</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-500 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                to="/quiz"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-5 py-3 bg-black text-white text-sm font-bold rounded-xl"
              >
                Trouver ma mission →
              </Link>
              <Link
                to="/booking/trial?type=trial"
                onClick={() => setIsOpen(false)}
                className="w-full text-center px-5 py-3 bg-gray-100 text-black text-sm font-semibold rounded-xl"
              >
                Essai gratuit
              </Link>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};