import React from 'react';
import { MakeAndGoForm } from '../components/MakeAndGoForm';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { Shield, Zap } from 'lucide-react';

export const MakeAndGo: React.FC = () => {
  return (
    <>
      <SEO
        title="Réservez votre Make & Go — MakerLab Academy"
        description="Quiz 6 questions : découvrez la Mission parfaite pour votre enfant (8–14 ans) et réservez votre samedi Make & Go à Casablanca."
        keywords={['atelier enfants Casablanca', 'Make and Go MakerLab', 'STEM Maroc']}
      />

      {/*
        Mobile: true full-screen experience — h-[100dvh] flex col, no scrolling.
        Desktop: standard scrollable two-column layout.
      */}
      <div className="h-[100dvh] md:h-auto md:min-h-screen overflow-hidden md:overflow-auto flex flex-col bg-white">

        {/* ── Logo bar — ultra-compact on mobile ─────────────────────────── */}
        <div className="flex-none border-b-2 border-black px-4 md:px-6 h-11 md:h-auto md:py-4 flex items-center justify-between bg-white">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 md:w-10 md:h-10 bg-[#CC0000] border-[3px] border-black flex items-center justify-center font-display font-black text-[10px] md:text-sm text-white shadow-[2px_2px_0_0_rgba(0,0,0,1)] shrink-0">
              ML
            </div>
            <span className="font-display font-black text-xs md:text-sm uppercase tracking-widest">MakerLab <span className="text-[#CC0000]">Academy</span></span>
          </Link>
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2 py-1">
            <Shield size={10} className="text-green-600 shrink-0" />
            <span className="text-[9px] font-black uppercase text-green-700">Sécurisé</span>
          </div>
        </div>

        {/* ── Main content ────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

          {/* Desktop sidebar */}
          <div className="hidden md:flex md:w-2/5 lg:w-[38%] bg-black text-white flex-col justify-between p-10 border-r-4 border-black overflow-y-auto">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E8580A] border-2 border-black px-3 py-1 font-display font-black text-[9px] uppercase tracking-widest mb-6 shadow-[3px_3px_0_0_rgba(0,0,0,0.6)]">
                <Zap size={11} /> Make & Go · Quiz 6 questions
              </div>
              <h1 className="font-display font-black text-4xl uppercase leading-tight mb-5">
                Trouvez la Mission parfaite pour votre enfant
              </h1>
              <p className="font-sans font-semibold text-white/70 text-sm leading-relaxed mb-8">
                En 3 heures, votre enfant assemble, code ou fabrique quelque chose de réel. Il repart avec son Trophée.
              </p>
              <div className="border-t border-white/10 mb-5" />
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3">Les 4 Missions disponibles</p>
              <div className="space-y-2">
                {[
                  { emoji: '🤖', label: 'Robot Autonome', color: 'bg-blue-900/40 border-blue-500/30' },
                  { emoji: '👕', label: 'T-Shirt Design & Print', color: 'bg-pink-900/40 border-pink-500/30' },
                  { emoji: '🎮', label: 'Retro Arcade Hacker', color: 'bg-purple-900/40 border-purple-500/30' },
                  { emoji: '🔧', label: 'Coffre-Fort Laser', color: 'bg-orange-900/40 border-orange-500/30' },
                ].map(m => (
                  <div key={m.label} className={`flex items-center gap-3 p-3 rounded-xl border ${m.color}`}>
                    <span>{m.emoji}</span>
                    <span className="font-display font-black text-xs uppercase text-white/90">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 mt-6 border-t border-white/10 pt-6">
              {['⭐ 4.9/5 · 200+ familles', '🛡️ Satisfait ou remboursé', '⚡ Matériel fourni', '🔒 Données confidentielles'].map((t, i) => (
                <p key={i} className="text-[10px] font-sans font-semibold uppercase tracking-wide text-white/60">{t}</p>
              ))}
            </div>
          </div>

          {/* Form panel — fills ALL remaining height on mobile, no overflow scroll */}
          <div className="flex-1 flex flex-col overflow-hidden bg-white md:bg-[#f8f7f4]">

            {/* Mobile context strip */}
            <div className="md:hidden flex-none bg-black text-white px-4 py-2.5 flex items-center justify-between">
              <div>
                <p className="font-display font-black text-sm uppercase leading-tight">Trouvez la Mission parfaite 🚀</p>
                <p className="text-white/50 text-[10px] font-semibold">6 questions · 3 min · 400 DHS tout inclus</p>
              </div>
              <div className="flex items-center gap-1 bg-[#E8580A] border border-white/20 px-2 py-1 rounded-full shrink-0">
                <Zap size={10} />
                <span className="text-[9px] font-black uppercase">Make & Go</span>
              </div>
            </div>

            {/* Actual form — fills remaining height */}
            <div className="flex-1 overflow-hidden flex flex-col px-4 pt-4 pb-3 md:p-10 md:items-center md:justify-start">
              <div className="w-full md:max-w-lg flex flex-col flex-1 md:block">
                <MakeAndGoForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
