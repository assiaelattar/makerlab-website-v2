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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

          {/* Left Section: Logo + Description */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <div className="flex items-center justify-center md:justify-start gap-4">
                <img src="/logo-icon.png" alt="MakerLab Academy Icon" className="w-16 h-16 object-contain bg-white rounded-full p-1" />
                <h3 className="font-display font-black text-3xl text-white tracking-wide">
                  MakerLab <br /><span className="text-brand-red">Academy</span>
                </h3>
              </div>
            </Link>
            <p className="text-gray-300 max-w-xs mx-auto md:mx-0 font-medium text-lg">
              Learning by Building.
            </p>
          </div>

          {/* Middle Section: Programs */}
          <div>
            <h4 className="font-display font-black text-2xl mb-6 text-brand-blue uppercase tracking-wide">Nos Programmes</h4>
            <ul className="space-y-3 text-gray-300 flex flex-col font-bold">
              <Link to="/kids-families" className="hover:text-brand-red transition-colors flex items-center gap-2 max-w-max mx-auto md:mx-0"><div className="w-2 h-2 rounded-full bg-brand-green border border-black"></div> STEMQuest</Link>
              <Link to="/programs" className="hover:text-brand-red transition-colors flex items-center gap-2 max-w-max mx-auto md:mx-0"><div className="w-2 h-2 rounded-full bg-brand-blue border border-black"></div> Make & Go</Link>
              <Link to="/kids-families" className="hover:text-brand-red transition-colors flex items-center gap-2 max-w-max mx-auto md:mx-0"><div className="w-2 h-2 rounded-full bg-brand-orange border border-black"></div> Holiday Camps</Link>
              <Link to="/schools" className="hover:text-brand-red transition-colors flex items-center gap-2 max-w-max mx-auto md:mx-0"><div className="w-2 h-2 rounded-full bg-brand-red border border-black"></div> Experience-It</Link>
              <Link to="/schools" className="hover:text-brand-red transition-colors flex items-center gap-2 max-w-max mx-auto md:mx-0"><div className="w-2 h-2 rounded-full bg-[#00E5FF] border border-black"></div> STEMQuest At School</Link>
            </ul>
          </div>

          {/* Right Section: Contact */}
          <div>
            <h4 className="font-display font-bold text-2xl mb-6 text-brand-green uppercase tracking-wide">Contact</h4>
            <div className="flex flex-col gap-4 items-center md:items-start text-gray-300 font-medium">
              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-brand-red" /> {contactInfo.address}
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="text-brand-blue" /> {contactInfo.phone}
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-brand-green" /> {contactInfo.email}
              </div>
            </div>
            <div className="flex justify-center md:justify-start gap-4 mt-8">
              {contactInfo.facebook && contactInfo.facebook !== '#' && (
                <a href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-brand-red hover:text-white transition-all"><Facebook size={20} /></a>
              )}
              {contactInfo.twitter && contactInfo.twitter !== '#' && (
                <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-brand-blue hover:text-black transition-all"><Twitter size={20} /></a>
              )}
              {contactInfo.instagram && contactInfo.instagram !== '#' && (
                <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-brand-green hover:text-white transition-all"><Instagram size={20} /></a>
              )}
              {contactInfo.linkedin && contactInfo.linkedin !== '#' && (
                <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/10 p-3 rounded-full hover:bg-brand-blue hover:text-white transition-all"><Linkedin size={20} /></a>
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
