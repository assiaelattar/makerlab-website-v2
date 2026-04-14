import React from 'react';
import { LeadMagnetForm } from '../components/LeadMagnetForm';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { Rocket, Star, Shield, Cpu, Gamepad2, Shirt, Wrench } from 'lucide-react';

export const LeadMagnet: React.FC = () => {
  return (
    <>
      <SEO
        title="Trouvez la mission parfaite pour votre enfant — MakerLab Academy"
        description="Quiz 5 questions : on identifie la mission STEM faite sur mesure pour votre enfant (7-14 ans) et on réserve votre samedi en 2 minutes."
        keywords={['STEM Maroc', 'atelier enfants Casablanca', 'robotique enfants', 'coding enfants', 'MakerLab']}
      />

      {/* ── Full-page layout ──────────────────────────────────────────────── */}
      <div className="min-h-screen bg-white flex flex-col">

        {/* Top bar */}
        <div className="bg-black text-white py-3 border-b-4 border-black overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-16 font-display font-black text-[10px] uppercase tracking-widest items-center">
            <span>🔥 5000+ enfants formés à Casablanca</span>
            <span className="text-brand-orange">•</span>
            <span>⚡ Ateliers le samedi 14h30-17h30</span>
            <span className="text-brand-orange">•</span>
            <span>🛡️ Satisfait ou remboursé</span>
            <span className="text-brand-orange">•</span>
            <span>🎓 Mentors ingénieurs certifiés</span>
            <span className="text-brand-orange">•</span>
            <span>🔥 5000+ enfants formés à Casablanca</span>
            <span className="text-brand-orange">•</span>
            <span>⚡ Ateliers le samedi 14h30-17h30</span>
          </div>
        </div>

        {/* Logo bar */}
        <div className="border-b-4 border-black px-6 py-4 flex items-center justify-between bg-white">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-brand-orange border-4 border-black flex items-center justify-center font-display font-black text-sm shadow-[3px_3px_0_0_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-all">
              ML
            </div>
            <span className="font-display font-black uppercase text-sm tracking-widest hidden md:block">MakerLab Academy</span>
          </Link>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-green-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Données confidentielles</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col md:flex-row">

          {/* Left: Hero sidebar (hidden on mobile, shown on md+) */}
          <div className="hidden md:flex md:w-2/5 bg-black text-white flex-col justify-between p-10 border-r-4 border-black">
            <div>
              <div className="inline-block bg-brand-orange text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black mb-6">
                Quiz de matching — 2 minutes
              </div>
              <h1 className="font-display font-black text-4xl uppercase leading-tight mb-6">
                Trouvez la mission parfaite pour votre enfant
              </h1>
              <p className="font-bold text-white/70 text-sm uppercase leading-relaxed mb-8">
                5 questions. On identifie son profil. On vous présente sa mission idéale. Noufissa confirme la place.
              </p>

              {/* Track preview pills */}
              <div className="space-y-3">
                {[
                  { icon: <Cpu size={16} />, label: 'Robot Autonome', tag: 'ROBOT', color: 'bg-blue-900/50 border-blue-500/30' },
                  { icon: <Shirt size={16} />, label: 'T-Shirt Design & Print', tag: 'FOUNDER', color: 'bg-pink-900/50 border-pink-500/30' },
                  { icon: <Gamepad2 size={16} />, label: 'Retro Arcade Hacker', tag: 'GAME', color: 'bg-purple-900/50 border-purple-500/30' },
                  { icon: <Wrench size={16} />, label: 'Coffre-Fort Laser', tag: 'MAKER', color: 'bg-orange-900/50 border-orange-500/30' },
                ].map(m => (
                  <div key={m.tag} className={`flex items-center gap-3 p-3 rounded-xl border ${m.color}`}>
                    <span className="text-white/80">{m.icon}</span>
                    <span className="font-black text-xs uppercase text-white/90">{m.label}</span>
                    <span className="ml-auto text-[8px] font-black uppercase text-white/50 bg-white/10 px-2 py-0.5 rounded-full">{m.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust signals */}
            <div className="space-y-3 mt-8">
              {[
                { icon: <Star size={14} />, text: '4.9/5 sur Google (200+ avis)' },
                { icon: <Shield size={14} />, text: 'Satisfait ou remboursé' },
                { icon: <Rocket size={14} />, text: 'Matériel fourni — rien à acheter' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-white/70">
                  <span className="text-brand-orange">{item.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wide">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="flex-1 flex flex-col items-center justify-start p-6 md:p-12 bg-gray-50">
            <div className="w-full max-w-lg">
              {/* Mobile header */}
              <div className="md:hidden mb-8 text-center">
                <div className="inline-block bg-brand-orange text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black mb-3">
                  Quiz 5 questions
                </div>
                <h1 className="font-display font-black text-2xl uppercase leading-tight">
                  Trouvez la mission parfaite
                </h1>
              </div>

              <LeadMagnetForm />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black bg-white px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            ← Retour au site
          </Link>
          <span className="text-[10px] font-bold text-gray-400 uppercase">MakerLab Academy · Casablanca</span>
        </div>
      </div>
    </>
  );
};
