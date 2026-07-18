import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type Accent = 'orange' | 'blue' | 'green' | 'red';

const accents: Record<Accent, { text: string; button: string; glow: string }> = {
  orange: { text: 'text-brand-orange', button: 'bg-brand-orange', glow: 'bg-brand-orange' },
  blue: { text: 'text-[#74b5ff]', button: 'bg-brand-blue', glow: 'bg-brand-blue' },
  green: { text: 'text-[#65e39a]', button: 'bg-brand-green', glow: 'bg-brand-green' },
  red: { text: 'text-[#ff7b82]', button: 'bg-brand-red', glow: 'bg-brand-red' },
};

export const PremiumHero: React.FC<{
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  image: string;
  imageAlt: string;
  accent?: Accent;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
  stats?: Array<[string, string]>;
  children?: React.ReactNode;
}> = ({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  accent = 'orange',
  primary,
  secondary,
  stats,
  children,
}) => {
  const theme = accents[accent];

  return (
    <section className="relative min-h-[500px] overflow-hidden rounded-lg bg-slate-950 text-white">
      <img src={image} alt={imageAlt} className="ml-hero-media absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,18,32,.96)_0%,rgba(10,18,32,.8)_50%,rgba(10,18,32,.2)_85%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20" />
      <div className={`absolute -bottom-28 right-[12%] h-64 w-64 rounded-full opacity-20 blur-[90px] ${theme.glow}`} />

      <div className="relative z-10 flex min-h-[500px] flex-col justify-between p-6 md:p-9 lg:p-10">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-extrabold backdrop-blur-xl">
          <span className={`h-2 w-2 rounded-full ${theme.glow}`} />
          {eyebrow}
        </div>

        <div className="max-w-4xl py-10 md:py-12">
          <h1 className="ml-hero-title max-w-3xl font-display text-[clamp(2.7rem,5vw,5rem)] font-black leading-[0.94]">
            <span>{title}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base font-semibold leading-7 text-white/82 md:text-lg md:leading-8">{description}</p>
          {(primary || secondary) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primary && (
                <Link to={primary.to} className={`ml-button px-6 text-white shadow-xl ${theme.button}`}>
                  {primary.label} <ArrowRight size={18} />
                </Link>
              )}
              {secondary && (
                <Link to={secondary.to} className="ml-button border border-white/25 bg-slate-950/55 px-6 text-white backdrop-blur-xl hover:bg-slate-950/70">
                  {secondary.label}
                </Link>
              )}
            </div>
          )}
        </div>

        {stats && stats.length > 0 ? (
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/15 bg-white/15 backdrop-blur-xl sm:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="bg-slate-950/55 p-4 md:p-5">
                <p className={`font-display text-2xl font-black md:text-3xl ${theme.text}`}>{value}</p>
                <p className="mt-1 text-[11px] font-bold text-white/72">{label}</p>
              </div>
            ))}
          </div>
        ) : children}
      </div>
    </section>
  );
};
