import React from 'react';
import { MakeAndGoForm } from '../components/MakeAndGoForm';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { Shield, Cpu, Shirt, Gamepad2, Wrench, Star, Lock, Zap } from 'lucide-react';

/* ─── Trust signals & mission preview data (sidebar) ─────────────────────── */
const MISSIONS = [
  { icon: <Cpu size={15} />, label: 'Robot Autonome', tag: 'ROBOT', color: 'bg-blue-900/40 border-blue-500/30' },
  { icon: <Shirt size={15} />, label: 'T-Shirt Design & Print', tag: 'FOUNDER', color: 'bg-pink-900/40 border-pink-500/30' },
  { icon: <Gamepad2 size={15} />, label: 'Retro Arcade Hacker', tag: 'GAME', color: 'bg-purple-900/40 border-purple-500/30' },
  { icon: <Wrench size={15} />, label: 'Coffre-Fort Laser', tag: 'MAKER', color: 'bg-orange-900/40 border-orange-500/30' },
];

const TRUST = [
  { icon: <Star size={13} />, text: '4.9/5 · 200+ familles satisfaites' },
  { icon: <Shield size={13} />, text: 'Satisfait ou remboursé' },
  { icon: <Zap size={13} />, text: 'Matériel fourni — rien à acheter' },
  { icon: <Lock size={13} />, text: 'Données confidentielles' },
];

export const MakeAndGo: React.FC = () => {
  return (
    <>
      <SEO
        title="Réservez votre Make & Go — MakerLab Academy"
        description="Quiz 6 questions : découvrez la Mission parfaite pour votre enfant (8–14 ans) et réservez votre samedi Make & Go à Casablanca."
        keywords={['atelier enfants Casablanca', 'Make and Go MakerLab', 'STEM Maroc', 'robotique enfants', 'coding enfants']}
      />

      <div className="min-h-screen bg-white flex flex-col">

        {/* ── Urgency ticker ─────────────────────────────────────────── */}
        <div className="bg-[#CC0000] text-white py-2.5 overflow-hidden border-b-4 border-black">
          <div className="animate-marquee whitespace-nowrap flex gap-16 font-display font-black text-[10px] uppercase tracking-widest items-center">
            <span>🔥 Places limitées à 10 par session</span>
            <span className="text-[#E8580A]">•</span>
            <span>⚡ Ateliers le samedi 14h30 – 17h30</span>
            <span className="text-[#E8580A]">•</span>
            <span>🏆 Votre enfant repart avec son Trophée</span>
            <span className="text-[#E8580A]">•</span>
            <span>🛡️ Satisfait ou remboursé</span>
            <span className="text-[#E8580A]">•</span>
            <span>🔥 Places limitées à 10 par session</span>
            <span className="text-[#E8580A]">•</span>
            <span>⚡ Ateliers le samedi 14h30 – 17h30</span>
          </div>
        </div>

        {/* ── Logo bar ───────────────────────────────────────────────── */}
        <div className="border-b-4 border-black px-6 py-4 flex items-center justify-between bg-white">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#CC0000] border-4 border-black flex items-center justify-center font-display font-black text-sm text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
              ML
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-sm uppercase tracking-widest">MakerLab</span>
              <span className="font-display font-black text-[9px] uppercase tracking-[0.22em] text-[#CC0000]">Academy</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-full px-3 py-1.5">
            <Shield size={12} className="text-green-600" />
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Données sécurisées</span>
          </div>
        </div>

        {/* ── Main layout ────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col md:flex-row">

          {/* Left sidebar — desktop only */}
          <div className="hidden md:flex md:w-2/5 bg-black text-white flex-col justify-between p-10 border-r-4 border-black">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-[#E8580A] border-2 border-black px-3 py-1 font-display font-black text-[9px] uppercase tracking-widest mb-6 shadow-[3px_3px_0_0_rgba(0,0,0,0.6)]">
                <Zap size={11} /> Make & Go · Quiz 6 questions
              </div>

              <h1 className="font-display font-black text-4xl uppercase leading-tight mb-5">
                Trouvez la Mission parfaite pour votre enfant
              </h1>
              <p className="font-sans font-semibold text-white/70 text-sm leading-relaxed mb-8">
                En 3 heures, votre enfant assemble, code ou fabrique quelque chose de réel.
                Il repart avec son Trophée. Son nom dessus.
              </p>

              {/* Divider */}
              <div className="border-t border-white/10 mb-6" />

              {/* Mission pills */}
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-3">
                Les 4 Missions disponibles
              </p>
              <div className="space-y-2">
                {MISSIONS.map(m => (
                  <div key={m.tag} className={`flex items-center gap-3 p-3 rounded-xl border ${m.color}`}>
                    <span className="text-white/70">{m.icon}</span>
                    <span className="font-display font-black text-xs uppercase text-white/90">{m.label}</span>
                    <span className="ml-auto text-[8px] font-black uppercase text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                      {m.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust signals */}
            <div className="space-y-3 mt-6 border-t border-white/10 pt-6">
              {TRUST.map((t, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60">
                  <span className="text-[#E8580A]">{t.icon}</span>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wide">{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="flex-1 flex flex-col items-center justify-start p-6 md:p-12 bg-gray-50">
            <div className="w-full max-w-lg">

              {/* Mobile header */}
              <div className="md:hidden mb-8 text-center">
                <div className="inline-flex items-center gap-2 bg-[#CC0000] text-white border-2 border-black px-3 py-1 font-display font-black text-[9px] uppercase tracking-widest mb-3">
                  <Zap size={10} /> Make & Go
                </div>
                <h1 className="font-display font-black text-2xl uppercase leading-tight">
                  Trouvez la Mission parfaite
                </h1>
              </div>

              <MakeAndGoForm />
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="border-t-4 border-black bg-white px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            ← Retour au site
          </Link>
          <span className="text-[10px] font-sans font-semibold text-gray-400">
            MakerLab Academy · Casablanca · Make & Go 400 DHS
          </span>
        </div>
      </div>
    </>
  );
};
