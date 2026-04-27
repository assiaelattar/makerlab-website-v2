import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { MakerQuest } from '../types';
import { Sparkles, ArrowLeft, CheckCircle2, Flag, Lightbulb, Pickaxe, Send, Box } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const MakerQuestDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [quest, setQuest] = useState<MakerQuest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const q = query(collection(db, 'maker_quests'), where('slug', '==', slug), where('active', '==', true));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const questData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as MakerQuest;
          setQuest(questData);
        }
      } catch (error) {
        console.error("Error fetching quest:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuest();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-40 pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="min-h-screen pt-40 pb-20 container text-center">
        <h1 className="font-display font-black text-4xl mb-4">Défi Introuvable</h1>
        <p className="mb-8">Ce défi n'existe plus ou a été désactivé.</p>
        <Link to="/maker-wall" className="text-brand-orange underline font-bold">Retour au Maker Wall</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container max-w-5xl">
        
        <Link to="/maker-wall" className="inline-flex items-center gap-2 font-black uppercase text-sm mb-8 hover:translate-x-2 transition-transform bg-white px-4 py-2 rounded-xl border-2 border-black shadow-neo-sm">
          <ArrowLeft size={16} strokeWidth={3} /> Retour aux Projets
        </Link>

        {/* ── HEADER HERO ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-[2rem] border-4 border-black overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative flex flex-col md:flex-row">
           <div className="md:w-2/5 md:order-last border-b-4 md:border-b-0 md:border-l-4 border-black relative">
              <img src={quest.coverImage} alt={quest.title} className="w-full h-64 md:h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 md:hidden">
                  <div className="bg-[#00E5FF] px-3 py-1 font-black text-sm uppercase border-2 border-black rounded-lg">{quest.category}</div>
              </div>
           </div>

           <div className="md:w-3/5 p-8 md:p-12 pb-16 relative">
             <div className="hidden md:inline-block bg-[#00E5FF] px-3 py-1 font-black text-sm uppercase border-2 border-black rounded border-b-[3px] mb-6">
                 {quest.category}
             </div>
             
             <div className="inline-flex items-center gap-2 bg-[#E8580A] text-black px-3 py-1 font-black text-[10px] uppercase border-2 border-black rounded-full mb-4 md:ml-4 shadow-neo-sm">
                <Flag size={12} strokeWidth={3} /> Maker Quest
             </div>

             <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter leading-[0.9] mb-6">
               {quest.title}
             </h1>

             <p className="text-lg md:text-xl font-medium text-gray-700 leading-relaxed max-w-lg">
               {quest.description}
             </p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          
          {/* ── LEFT COLUMN: MATERIAL & ACTION ─────────────────────────────── */}
          <div className="lg:col-span-1 space-y-8">
             
             {/* CTA CARD */}
             <div className="bg-[#CC0000] text-white p-6 rounded-2xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] flex flex-col items-center text-center">
                <Sparkles size={40} className="mb-4 text-brand-orange animate-pulse" />
                <h3 className="font-display font-black text-2xl uppercase mb-2">Prêt à relever le défi ?</h3>
                <p className="text-white/80 font-medium text-sm mb-6">Construis ton projet et soumets-le pour l'afficher sur le Maker Wall et gagner des points d'expérience !</p>
                <button 
                  onClick={() => navigate(`/submit?questId=${quest.id}&questTitle=${encodeURIComponent(quest.title)}`)}
                  className="w-full py-4 bg-white text-black font-black uppercase tracking-widest border-4 border-black rounded-xl hover:-translate-y-1 hover:shadow-[0_4px_0_0_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                >
                  J'accepte le défi <Send size={20} />
                </button>
             </div>

             {/* MATERIALS CARD */}
             {quest.materials && quest.materials.length > 0 && (
               <div className="bg-white p-6 rounded-2xl border-4 border-black shadow-neo">
                  <div className="flex items-center gap-3 mb-6 border-b-4 border-black pb-4">
                     <Box size={24} className="text-brand-blue" strokeWidth={3} />
                     <h3 className="font-display font-black text-xl uppercase">Boîte à Outils</h3>
                  </div>
                  <ul className="space-y-3">
                     {quest.materials.map((mat, i) => (
                        <li key={i} className="flex gap-3 text-sm font-bold items-start leading-tight">
                           <CheckCircle2 size={16} className="text-brand-green shrink-0 mt-0.5" strokeWidth={3} />
                           <span>{mat}</span>
                        </li>
                     ))}
                  </ul>
               </div>
             )}

          </div>

          {/* ── RIGHT COLUMN: QUEST GUIDE ─────────────────────────────────── */}
          <div className="lg:col-span-2">
             <div className="bg-white rounded-2xl border-4 border-black shadow-neo overflow-hidden">
                <div className="bg-brand-orange p-6 border-b-4 border-black flex items-center gap-3">
                   <Pickaxe size={28} className="text-black" strokeWidth={3} />
                   <h2 className="font-display font-black text-2xl uppercase">Guide du Projet</h2>
                </div>
                
                <div className="p-6 md:p-10 prose prose-lg md:prose-xl max-w-none prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-a:text-brand-orange prose-a:font-bold prose-img:rounded-xl prose-img:border-4 prose-img:border-black prose-img:shadow-neo marker:text-brand-orange">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {quest.guide}
                   </ReactMarkdown>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};
