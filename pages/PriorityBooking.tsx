import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { MessageCircle, Flame, Clock, Shield, Star, Zap, ArrowRight } from 'lucide-react';

const NOUFISSA_NUMBER = '212621877106';

export const PriorityBooking: React.FC = () => {
  const location = useLocation();
  const [childName, setChildName] = useState('');

  // Read child_name from sessionStorage if the form stored it
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('mg_child_name');
      if (stored) setChildName(stored);
    } catch { /* ignore */ }
  }, []);

  const waMessage = encodeURIComponent(
    `Bonjour MakerLab ! Je viens de remplir le formulaire Make & Go${childName ? ` pour ${childName}` : ''} et je voudrais confirmer ma place. 🚀`
  );

  return (
    <>
      <SEO
        title="Place quasi-confirmée — Make & Go MakerLab"
        description="Votre place est quasi-confirmée. Noufissa vous contacte dans les prochaines minutes."
        keywords={[]}
      />

      <div className="min-h-screen bg-white flex flex-col font-sans">

        {/* Top urgency bar */}
        <div className="bg-[#CC0000] text-white py-2.5 text-center border-b-4 border-black">
          <span className="font-display font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
            <Flame size={12} /> Places limitées — Noufissa vous contacte dans les prochaines minutes <Flame size={12} />
          </span>
        </div>

        {/* Logo bar */}
        <div className="border-b-4 border-black px-6 py-4 flex items-center justify-between bg-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#CC0000] border-4 border-black flex items-center justify-center font-display font-black text-sm text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">ML</div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-sm uppercase tracking-widest">MakerLab</span>
              <span className="font-display font-black text-[9px] uppercase tracking-[0.22em] text-[#CC0000]">Academy</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Noufissa est disponible</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-xl space-y-8">

            {/* HOT badge */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-[#CC0000] text-white px-5 py-2 border-4 border-black font-display font-black text-xs uppercase tracking-widest shadow-[5px_5px_0_0_rgba(0,0,0,1)] mb-5 animate-pulse">
                <Flame size={16} /> PRIORITÉ HAUTE — LEAD CONFIRMÉ
              </div>
              <h1 className="font-display font-black text-4xl md:text-5xl uppercase leading-tight mb-4">
                {childName ? `${childName}, votre` : 'Votre'} place est quasi-confirmée !
              </h1>
              <p className="font-sans font-semibold text-gray-600 text-lg leading-relaxed">
                Noufissa de MakerLab vous contacte sur WhatsApp
                <span className="text-[#CC0000] font-black"> dans les prochaines minutes</span>.
              </p>
            </div>

            {/* Next steps card */}
            <div className="bg-black text-white border-4 border-black rounded-3xl p-6 md:p-8 shadow-[8px_8px_0_0_rgba(0,0,0,0.3)]">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-4">Ce qui se passe maintenant</p>
              <div className="space-y-4">
                {[
                  { step: '1', text: 'Noufissa reçoit votre profil et confirme la disponibilité', done: true },
                  { step: '2', text: 'Elle vous envoie la Mission recommandée pour votre enfant', done: false },
                  { step: '3', text: 'Vous confirmez la place — votre enfant rejoint les Makers !', done: false },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 font-display font-black text-sm ${
                      s.done ? 'bg-[#E8580A] border-[#E8580A] text-black' : 'border-white/30 text-white/50'
                    }`}>{s.step}</div>
                    <p className={`font-sans text-sm pt-0.5 ${s.done ? 'text-white font-semibold' : 'text-white/60'}`}>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="space-y-4">
              <a
                href={`https://wa.me/${NOUFISSA_NUMBER}?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-5 bg-[#25D366] text-white font-display font-black text-base uppercase rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all"
              >
                <MessageCircle size={24} fill="currentColor" />
                Écrire à Noufissa sur WhatsApp
              </a>
              <p className="text-[10px] font-black uppercase tracking-widest text-center text-gray-400">
                Ou attendez — elle vous contacte dans les 15 minutes
              </p>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Star size={16} />, label: '4.9/5 sur Google' },
                { icon: <Shield size={16} />, label: 'Satisfait ou remboursé' },
                { icon: <Clock size={16} />, label: '3h de Mission' },
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-center">
                  <span className="text-[#CC0000]">{t.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-wide text-gray-600">{t.label}</span>
                </div>
              ))}
            </div>

            {/* Scarcity */}
            <div className="flex items-center gap-3 bg-[#CC0000]/5 border-2 border-[#CC0000]/20 rounded-2xl p-4">
              <Zap size={18} className="text-[#CC0000] shrink-0" />
              <p className="text-xs font-sans font-semibold text-gray-700">
                <span className="text-[#CC0000] font-black">Places limitées à 10 par session.</span>{' '}
                Votre profil est passé en priorité — ne tardez pas à confirmer.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black bg-white px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            ← Retour au site
          </Link>
          <span className="text-[10px] font-sans text-gray-400">MakerLab Academy · Casablanca</span>
        </div>
      </div>
    </>
  );
};
