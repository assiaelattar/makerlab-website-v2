import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Lock } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const c = settings?.contact_info || {
    email: 'hello@makerlab.ma',
    phone: '+212 6 00 00 00 00',
    address: 'Technopark, Casablanca',
    facebook: '', instagram: '', linkedin: '',
  };

  return (
    <footer className="bg-gray-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo-icon.png" alt="MakerLab" className="w-9 h-9 object-contain bg-white rounded-full p-1" />
              <div className="leading-none">
                <span className="block font-black text-base text-white">MakerLab</span>
                <span className="block font-bold text-[10px] uppercase tracking-widest text-red-500">Academy</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
              Révolutionner l'éducation par la pratique et la technologie au Maroc.
            </p>
            <div className="flex gap-2 mt-1">
              {c.facebook && <a href={c.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><Facebook size={16} /></a>}
              {c.instagram && <a href={c.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><Instagram size={16} /></a>}
              {c.linkedin && <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"><Linkedin size={16} /></a>}
            </div>
          </div>

          {/* Ateliers */}
          <div className="flex flex-col gap-3">
            <p className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-1">Ateliers</p>
            {[
              { label: 'Robotique', path: '/programs' },
              { label: 'Coding & IA', path: '/programs' },
              { label: 'Impression 3D', path: '/programs' },
              { label: 'Drones', path: '/programs' },
              { label: 'Boutique STEM', path: '/store' },
            ].map(l => (
              <Link key={l.label} to={l.path} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>

          {/* L'académie */}
          <div className="flex flex-col gap-3">
            <p className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-1">L'Académie</p>
            {[
              { label: 'Notre vision', path: '/about' },
              { label: 'Écoles & Partenaires', path: '/schools' },
              { label: 'Blog', path: '/blog' },
              { label: 'Contact', path: '/contact' },
              { label: "S'inscrire", path: '/register' },
            ].map(l => (
              <Link key={l.label} to={l.path} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <p className="font-bold text-xs uppercase tracking-widest text-gray-500 mb-1">Nous trouver</p>
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin size={14} className="mt-0.5 shrink-0 text-red-500" />
              <span>{c.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Phone size={14} className="shrink-0 text-blue-500" />
              <span>{c.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail size={14} className="shrink-0 text-green-500" />
              <span>{c.email}</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} MakerLab Academy. Tous droits réservés.</span>
          <Link to="/admin" className="flex items-center gap-1 hover:text-gray-300 transition-colors">
            <Lock size={11} /> Staff
          </Link>
        </div>
      </div>
    </footer>
  );
};
