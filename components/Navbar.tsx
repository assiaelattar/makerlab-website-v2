import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Home, BookOpen, PenTool, UserPlus, Presentation } from 'lucide-react';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Écoles / B2B', path: '/ecoles', icon: Presentation },
    { name: 'Enfants', path: '/programs', icon: Zap },
    { name: 'Adultes', path: '/adultes', icon: UserPlus },
    { name: 'Store', path: '/store', icon: BookOpen },
    { name: 'Contact', path: '/contact', icon: PenTool },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Don't show navbar on Admin pages
  if (location.pathname.startsWith('/admin')) {
    return (
      <nav className="sticky top-0 z-50 bg-black text-white p-4 flex justify-between items-center">
        <Link to="/" className="font-bold font-display flex items-center gap-2 text-xl"><Zap className="text-brand-yellow" /> Make & Go <span className="text-xs bg-brand-pink px-2 rounded">ADMIN</span></Link>
        <Link to="/" className="text-sm underline">Retour au site</Link>
      </nav>
    );
  }

  return (
    <>
      {/* Sticky Navbar with offset for Marquee (h-10 = 40px) */}
      <nav className="sticky top-0 md:top-4 z-50 mx-0 md:mx-8 py-2 md:py-0 transition-all duration-300">
        <div className="bg-white border-b-4 md:border-4 border-black md:rounded-none shadow-neo p-3 md:p-4 flex justify-between items-center relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
            <div className="bg-brand-purple p-1.5 md:p-2 rounded-none border-2 border-black group-hover:rotate-12 transition-transform">
              <Zap className="text-brand-yellow w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="font-display font-black text-lg md:text-2xl tracking-tight text-black uppercase">
              Make & Go
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-black font-display text-lg uppercase tracking-wide hover:text-brand-purple transition-colors ${isActive(link.path) ? 'text-brand-pink underline decoration-4 underline-offset-4' : 'text-black'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/register">
              <Button variant="primary" size="sm" className="uppercase tracking-widest">S'inscrire</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-black p-2 bg-gray-100 rounded-none border-4 border-black hover:bg-gray-200 transition-colors shadow-neo-sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={24} strokeWidth={3} /> : <Menu size={24} strokeWidth={3} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-brand-yellow/95 backdrop-blur-md flex flex-col justify-center items-center p-6 md:hidden animate-fade-in-up">
          {/* Close Button absolute positioning */}
          <button
            className="absolute top-6 right-6 text-black p-3 bg-white rounded-none border-4 border-black hover:bg-gray-100 shadow-neo transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
            onClick={() => setIsOpen(false)}
          >
            <X size={32} strokeWidth={3} />
          </button>

          <div className="w-full max-w-sm flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="bg-white border-4 border-black p-4 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 text-xl font-display font-black uppercase tracking-wide hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="bg-brand-purple text-white p-2 rounded-none border-4 border-black">
                  <link.icon size={24} strokeWidth={3} />
                </div>
                {link.name}
              </Link>
            ))}

            <div className="h-4"></div>

            <Link to="/register" onClick={() => setIsOpen(false)}>
              <Button variant="accent" className="w-full justify-center py-4 text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                <UserPlus size={24} className="mr-2" strokeWidth={3} />
                S'inscrire
              </Button>
            </Link>

            <div className="mt-8 text-center">
              <p className="font-bold text-sm text-black/60">MakerLab Academy © 2024</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};