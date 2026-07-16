import React from 'react';
import { ArrowUpRight, Facebook, Instagram, Linkedin, Lock, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const contact = settings?.contact_info || {
    email: 'hello@makerlab.ma',
    phone: '+212 6 00 00 00 00',
    address: 'Technopark, Casablanca',
    facebook: '',
    instagram: '',
    linkedin: '',
  };

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.25fr_0.75fr_0.75fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo-icon.png" alt="MakerLab" className="h-11 w-11 object-contain" />
              <div className="leading-none">
                <span className="block font-display text-lg font-black">MAKER<span className="text-brand-orange">LAB</span></span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.26em] text-slate-400">Academy</span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm font-semibold leading-7 text-slate-500">
              Une académie d’ingénierie et d’innovation où les enfants transforment leurs idées en projets réels.
            </p>
            <div className="mt-6 flex gap-2">
              {contact.facebook && <SocialLink href={contact.facebook} label="Facebook"><Facebook size={16} /></SocialLink>}
              {contact.instagram && <SocialLink href={contact.instagram} label="Instagram"><Instagram size={16} /></SocialLink>}
              {contact.linkedin && <SocialLink href={contact.linkedin} label="LinkedIn"><Linkedin size={16} /></SocialLink>}
            </div>
          </div>

          <FooterColumn title="Programmes" links={[
            { label: 'Tous les ateliers', path: '/programs' },
            { label: 'Enfants et familles', path: '/kids-families' },
            { label: 'Écoles', path: '/schools' },
            { label: 'Orientation', path: '/register' },
          ]} />

          <FooterColumn title="Découvrir" links={[
            { label: 'Projets', path: '/maker-wall' },
            { label: 'À propos', path: '/about' },
            { label: 'Journal', path: '/blog' },
            { label: 'Contact', path: '/contact' },
          ]} />

          <div>
            <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">Nous contacter</p>
            <div className="space-y-4 text-sm font-bold text-slate-600">
              <p className="flex items-start gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-brand-red" /> {contact.address}</p>
              <p className="flex items-center gap-3"><Phone size={17} className="shrink-0 text-brand-blue" /> {contact.phone}</p>
              <p className="flex items-center gap-3 break-all"><Mail size={17} className="shrink-0 text-brand-green" /> {contact.email}</p>
            </div>
            <Link to="/quiz" className="ml-button mt-6 w-full bg-brand-orange text-sm text-white">
              Trouver un programme <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-5 text-xs font-bold text-slate-400 sm:flex-row sm:items-center md:px-8">
          <span>© {new Date().getFullYear()} MakerLab Academy. Tous droits réservés.</span>
          <Link to="/admin" className="inline-flex items-center gap-1 transition hover:text-slate-900">
            <Lock size={12} /> Espace équipe
          </Link>
        </div>
      </div>
    </footer>
  );
};

const SocialLink: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({ href, label, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="ml-icon h-10 w-10 bg-slate-100 text-slate-700 transition hover:bg-slate-950 hover:text-white">
    {children}
  </a>
);

const FooterColumn: React.FC<{ title: string; links: { label: string; path: string }[] }> = ({ title, links }) => (
  <div>
    <p className="mb-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">{title}</p>
    <div className="flex flex-col gap-3">
      {links.map(link => (
        <Link key={link.label} to={link.path} className="group inline-flex items-center gap-1 text-sm font-bold text-slate-600 transition hover:text-brand-orange">
          {link.label} <ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  </div>
);
