import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { Download, Play, Pause, Star, Shield, Users, ArrowRight, Zap } from 'lucide-react';

/* VSL video — pull from env or use a safe fallback */
const VSL_URL = (import.meta as any).env?.VITE_VSL_URL || 'https://www.youtube.com/embed/dQw4w9WgXcQ';

const TESTIMONIALS = [
  { name: 'Sarah M.', role: 'Maman de Youssef, 11 ans', text: 'En 3 heures, mon fils a assemblé un robot qui évite les murs. Il en parle encore chaque semaine !', stars: 5 },
  { name: 'Karim B.', role: 'Papa de Nour, 10 ans',    text: 'L\'ambiance est incroyable. Pas de théorie ennuyeuse — ils fabriquent dès la première minute.', stars: 5 },
  { name: 'Leila A.', role: 'Maman de Rym, 13 ans',    text: 'Rym a codé son propre jeu vidéo et l\'a envoyé à ses amis. Sa confiance en elle a explosé.', stars: 5 },
];

export const MerciPage: React.FC = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <>
      <SEO
        title="Merci — Make & Go MakerLab"
        description="Noufissa prépare votre proposition personnalisée. Découvrez nos ateliers pendant qu'elle vous contacte."
        keywords={[]}
      />

      <div className="min-h-screen bg-white flex flex-col font-sans">

        {/* Top bar */}
        <div className="bg-black text-white py-2.5 text-center border-b-4 border-black overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-16 font-display font-black text-[10px] uppercase tracking-widest items-center">
            <span>⚡ Noufissa prépare votre proposition personnalisée</span>
            <span className="text-[#E8580A]">•</span>
            <span>🏆 5000+ enfants formés à Casablanca</span>
            <span className="text-[#E8580A]">•</span>
            <span>🛡️ Satisfait ou remboursé</span>
            <span className="text-[#E8580A]">•</span>
            <span>⚡ Noufissa prépare votre proposition personnalisée</span>
          </div>
        </div>

        {/* Logo bar */}
        <div className="border-b-4 border-black px-6 py-4 flex items-center justify-between bg-white">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E8580A] border-4 border-black flex items-center justify-center font-display font-black text-sm text-white shadow-[3px_3px_0_0_rgba(0,0,0,1)]">ML</div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-black text-sm uppercase tracking-widest">MakerLab</span>
              <span className="font-display font-black text-[9px] uppercase tracking-[0.22em] text-[#E8580A]">Academy</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 animate-pulse">
            <div className="w-2 h-2 bg-[#E8580A] rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Proposition en préparation…</span>
          </div>
        </div>

        <div className="flex-1 px-4 py-12 max-w-3xl mx-auto w-full space-y-12">

          {/* Hero */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#E8580A] text-white px-4 py-1.5 border-4 border-black font-display font-black text-[9px] uppercase tracking-widest shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <Zap size={12} /> Demande bien reçue
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl uppercase leading-tight">
              Pendant que vous regardez,<br />
              <span className="text-[#E8580A]">Noufissa prépare votre proposition</span>
            </h1>
            <p className="font-sans font-semibold text-gray-600 text-lg max-w-xl mx-auto">
              Voici comment se passe une vraie session Make & Go — regardez jusqu'au bout, le résultat dépasse toujours les attentes.
            </p>
          </div>

          {/* VSL embed */}
          <div className="relative w-full aspect-video border-4 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,1)] bg-black">
            <iframe
              ref={iframeRef}
              src={VSL_URL}
              title="MakerLab Academy — Make & Go en action"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Curriculum download CTA */}
          <div className="bg-black text-white border-4 border-black rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[6px_6px_0_0_rgba(0,0,0,0.3)]">
            <div>
              <div className="inline-block bg-[#E8580A] px-3 py-0.5 font-display font-black text-[8px] uppercase tracking-widest mb-2">
                Gratuit
              </div>
              <h2 className="font-display font-black text-xl uppercase mb-1">
                Le curriculum Make & Go
              </h2>
              <p className="font-sans text-sm text-white/70">
                12 pages — 4 Missions détaillées, matériel, niveau recommandé
              </p>
            </div>
            <a
              href="/documents/curriculum-make-and-go.pdf"
              download
              className="flex items-center gap-2 bg-[#E8580A] text-white px-6 py-3 border-4 border-black font-display font-black text-sm uppercase rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all shrink-0"
            >
              <Download size={18} /> Télécharger le PDF
            </a>
          </div>

          {/* Testimonials */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-center text-gray-400 mb-6">
              Ce que disent les familles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="bg-white border-4 border-black rounded-2xl p-5 shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.stars)].map((_, si) => (
                      <Star key={si} size={14} className="text-[#E8580A] fill-[#E8580A]" />
                    ))}
                  </div>
                  <p className="font-sans text-sm text-gray-700 leading-relaxed mb-3">"{t.text}"</p>
                  <div>
                    <p className="font-display font-black text-xs uppercase">{t.name}</p>
                    <p className="text-[9px] font-sans text-gray-400 uppercase tracking-wide">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explore CTA */}
          <div className="text-center">
            <p className="font-sans text-gray-500 text-sm mb-4">Curieux de voir les Missions disponibles ?</p>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 bg-[#CC0000] text-white px-8 py-4 border-4 border-black font-display font-black text-sm uppercase rounded-xl shadow-[5px_5px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
            >
              Voir toutes les Missions <ArrowRight size={18} />
            </Link>
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
