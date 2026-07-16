import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from './Motion';

export const appAccentClasses = [
  'bg-brand-orange',
  'bg-brand-blue',
  'bg-brand-green',
  'bg-brand-red',
  'bg-[#ffc938]',
];

export const appAccentTextClasses = [
  'text-brand-orange',
  'text-brand-blue',
  'text-brand-green',
  'text-brand-red',
  'text-[#c08b00]',
];

export const appAccentSoftClasses = [
  'bg-brand-orange/12',
  'bg-brand-blue/12',
  'bg-brand-green/12',
  'bg-brand-red/12',
  'bg-[#ffc938]/25',
];

export const AppShell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <main className={`makerlab-site min-h-screen overflow-x-hidden ${className}`}>{children}</main>
);

export const AppContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`mx-auto max-w-7xl px-4 md:px-8 ${className}`}>{children}</div>
);

export const AppSectionHeader: React.FC<{
  eyebrow: string;
  title: string;
  text?: string;
  accent?: string;
  action?: { label: string; to: string };
}> = ({ eyebrow, title, text, accent = 'text-brand-orange', action }) => (
  <Reveal className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div className="max-w-3xl">
      <p className={`text-xs font-black uppercase tracking-[0.14em] ${accent}`}>{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-black leading-[1.05] md:text-5xl">{title}</h2>
      {text && <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-500 md:text-lg">{text}</p>}
    </div>
    {action && (
      <Link to={action.to} className="ml-button border border-slate-200 bg-white text-sm shadow-sm">
        {action.label} <ArrowRight size={16} />
      </Link>
    )}
  </Reveal>
);

export const AppCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`ml-card ${className}`}>{children}</div>
);

export const ColorDots: React.FC = () => (
  <div className="flex gap-2">
    {appAccentClasses.map(color => (
      <span key={color} className={`h-4 w-4 rounded-full ${color}`} />
    ))}
  </div>
);
