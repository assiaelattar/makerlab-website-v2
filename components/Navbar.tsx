import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Home, BookOpen, PenTool, UserPlus, Presentation, Users, Info, Lock } from 'lucide-react';
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
    { name: 'Kids & Families', path: '/kids-families', icon: Users },
    { name: 'Schools', path: '/schools', icon: Presentation },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Blog', path: '/blog', icon: BookOpen },
    { name: 'Contact', path: '/contact', icon: PenTool },
    { name: 'Admin', path: '/admin', icon: Lock },
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
        <Link to="/" className="font-bold font-display flex items-center gap-2 text-xl"><img src="/logo-icon.png" alt="Logo Icon" className="w-8 h-8 object-contain bg-white rounded-full p-0.5" /> Makerlab Academy <span className="text-xs bg-brand-green px-2 rounded">ADMIN</span></Link>
        <Link to="/" className="text-sm underline">Retour au site</Link>
      </nav>
    );
  }

  return (
    <>
      <nav className={`z-50 w-full transition-all duration-300`}>
        <div className={`mx-0 md:mx-8 transition-all duration-300 ${scrolled ? 'md:px-4' : ''}`}>
          <div className={`
            bg-white border-b-4 md:border-4 border-black md:rounded-xl flex justify-between items-center relative transition-all duration-300
            ${scrolled ? 'p-2 shadow-neo-sm border-brand-red' : 'p-3 md:p-4 shadow-neo border-black'}
          `}>
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsOpen(false)}>
            {/* Logo Icon with Neo-brutalist border */}
            <div className={`bg-white p-1 md:p-1.5 rounded-full border-4 border-black group-hover:rotate-12 transition-all duration-500 shadow-neo-sm ${scrolled ? 'scale-90' : 'scale-100'}`}>
              <img src="/logo-icon.png" alt="Makerlab Academy Icon" className="w-8 h-8 md:w-12 md:h-12 object-contain" />
            </div>
            
            {/* Logo Text - Strong and Massive */}
            <div className={`flex flex-col leading-none transition-all duration-300 origin-left ${scrolled ? 'scale-90' : 'scale-100'}`}>
              <span className="font-display font-black text-xl md:text-3xl uppercase tracking-tighter text-black select-none">
                Makerlab
              </span>
              <span className="font-display font-black text-xs md:text-sm uppercase tracking-[0.2em] text-brand-red select-none">
                Academy
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.filter(link => link.name !== 'Home').map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-black font-display text-xs xl:text-sm uppercase tracking-wide hover:text-brand-red transition-colors ${isActive(link.path) ? 'text-brand-green underline decoration-4 underline-offset-4' : 'text-black'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Link to="/register">
              <Button variant="primary" size="sm" className={`uppercase tracking-widest text-xs hidden xl:flex transition-all duration-300 ${scrolled ? 'scale-90 px-4' : ''}`}>S'inscrire</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden text-black p-2 bg-gray-100 rounded-none border-4 border-black hover:bg-gray-200 transition-all shadow-neo-sm ${scrolled ? 'scale-90' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
          </button>
        </div>
      </div>
    </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[120] bg-white/20 backdrop-blur-xl flex flex-col justify-center items-center p-6 lg:hidden">
          <div className="absolute inset-0 bg-brand-red/80 mix-blend-multiply pointer-events-none"></div>
          
          {/* Close Button absolute positioning */}
          <button
            className="absolute top-6 right-6 text-black p-3 bg-white rounded-none border-4 border-black hover:bg-gray-100 shadow-neo transition-transform hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
            onClick={() => setIsOpen(false)}
          >
            <X size={32} strokeWidth={3} />
          </button>

          <div className="w-full max-w-sm flex flex-col gap-4 overflow-y-auto max-h-[80vh] py-4 relative z-10">
            {navLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="bg-white border-4 border-black p-4 rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 text-xl font-display font-black uppercase tracking-widest hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all animate-in slide-in-from-right-10 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="bg-brand-red text-white p-2 text-sm rounded-none border-4 border-black">
                  <link.icon size={22} strokeWidth={3} />
                </div>
                {link.name}
              </Link>
            ))}

            <div className="h-2"></div>

            <Link to="/register" onClick={() => setIsOpen(false)}>
              <Button variant="primary" className="w-full justify-center py-3 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                <UserPlus size={20} className="mr-2" strokeWidth={3} />
                S'inscrire
              </Button>
            </Link>

            <div className="mt-4 text-center">
              <p className="font-bold text-xs text-black/60">MakerLab Academy © 2026</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};