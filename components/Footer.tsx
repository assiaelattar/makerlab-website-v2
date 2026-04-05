import React from 'react';
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone, Lock, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const contactInfo = settings?.contact_info || {
    email: 'hello@makerlab.ma',
    phone: '+212 6 00 00 00 00',
    address: 'Casablanca, Maroc',
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#'
  };

  return (
    <footer className="mt-20 bg-black text-white pt-16 pb-8 border-t-8 border-brand-red">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left">

          {/* Left Section: Logo + Description */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <img src="/logo-icon.png" alt="MakerLab Academy" className="w-16 h-16 object-contain bg-white rounded-full p-1" />
                <h3 className="font-display font-black text-2xl text-white tracking-wide">
                  MakerLab <br /><span className="text-brand-red uppercase">Academy</span>
                </h3>
              </div>
            </Link>
            <p className="text-gray-400 max-w-xs mx-auto md:mx-0 font-medium text-base">
              Révolutionner l'éducation par la pratique, le design et la technologie au Maroc.
            </p>
          </div>

          {/* Middle Section 1: Ateliers SEO */}
          <div>
            <h4 className="font-display font-black text-xl mb-6 text-brand-blue uppercase tracking-widest">Nos Ateliers</h4>
            <ul className="space-y-3 text-gray-400 flex flex-col font-bold text-sm lg:text-base">
              <Link to="/programs" className="hover:text-brand-red transition-colors flex items-center gap-2 max-w-max mx-auto md:mx-0">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-red"></div> Robotique pour Enfants
              </Link>
              <Link to="/programs" className="hover:text-brand-red transition-colors flex items-center gap-2 max-w-max mx-auto md:mx-0">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue"></div> Cours de Codage & IA
              </Link>
              <Link to="/programs" className="hover:text-brand-red transition-colors flex items-center gap-2 max-w-max mx-auto md:mx-0">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-orange"></div> Design & Impression 3D
              </Link>
              <Link to="/kids-families" className="hover:text-brand-red transition-colors flex items-center gap-2 max-w-max mx-auto md:mx-0">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div> Stages & Camps Vacances
              </Link>
               <Link to="/store" className="hover:text-brand-red transition-colors flex items-center gap-2 max-w-max mx-auto md:mx-0">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div> Boutique de Kits STEM
              </Link>
            </ul>
          </div>

          {/* Middle Section 2: Quick Links */}
          <div>
            <h4 className="font-display font-black text-xl mb-6 text-brand-green uppercase tracking-widest">L'Académie</h4>
            <ul className="space-y-3 text-gray-400 flex flex-col font-bold text-sm lg:text-base">
              <Link to="/about" className="hover:text-white transition-colors max-w-max mx-auto md:mx-0">Notre Vision</Link>
              <Link to="/schools" className="hover:text-white transition-colors max-w-max mx-auto md:mx-0">Partenariats Écoles</Link>
              <Link to="/blog" className="hover:text-white transition-colors max-w-max mx-auto md:mx-0">Blog & Ressources</Link>
              <Link to="/contact" className="hover:text-white transition-colors max-w-max mx-auto md:mx-0">Contactez-nous</Link>
              <Link to="/register" className="hover:text-brand-orange transition-colors max-w-max mx-auto md:mx-0 underline underline-offset-4">S'inscrire à une session</Link>
            </ul>
          </div>

          {/* Right Section: Contact + Social */}
          <div>
            <h4 className="font-display font-black text-xl mb-6 text-brand-orange uppercase tracking-widest">Nous Trouver</h4>
            <div className="flex flex-col gap-4 items-center md:items-start text-gray-400 font-bold text-sm lg:text-base mb-8">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-brand-red shrink-0" /> {contactInfo.address}
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-brand-blue shrink-0" /> {contactInfo.phone}
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-brand-green shrink-0" /> {contactInfo.email}
              </div>
            </div>
            
            <div className="flex justify-center md:justify-start gap-3">
              {contactInfo.facebook && contactInfo.facebook !== '#' && (
                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2.5 rounded-xl hover:bg-brand-red hover:text-white transition-all shadow-neo-sm border border-white/10"><Facebook size={18} /></a>
              )}
              {contactInfo.instagram && contactInfo.instagram !== '#' && (
                <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2.5 rounded-xl hover:bg-brand-orange hover:text-white transition-all shadow-neo-sm border border-white/10"><Instagram size={18} /></a>
              )}
              {contactInfo.linkedin && contactInfo.linkedin !== '#' && (
                <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-2.5 rounded-xl hover:bg-brand-blue hover:text-white transition-all shadow-neo-sm border border-white/10"><Linkedin size={18} /></a>
              )}
            </div>
          </div>

        </div>

        <div className="mt-16 flex justify-between items-center text-gray-500 text-sm font-display border-t border-gray-800 pt-8">
          <span>© 2026 MakerLab Academy. Tous droits réservés.</span>
          <Link to="/admin" className="hover:text-white flex items-center gap-1 transition-colors"><Lock size={12} /> Staff</Link>
        </div>
      </div>
    </footer>
  );
};
