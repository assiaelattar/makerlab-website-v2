import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { ScrollReveal } from '../components/ScrollReveal';
import { useSettings } from '../contexts/SettingsContext';
import { SEO } from '../components/SEO';
import { getGeneratedProgramImage } from '../utils/makerlabImages';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';

export const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { settings } = useSettings();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // If we have dynamic blogs in settings, find it
    if (settings?.blogs) {
        const found = settings.blogs.find((b: BlogPost) => b.id === id || b.slug === id);
        if (found) {
            setPost(found);
            return;
        }
    }

    // Fallback to hardcoded posts for now (demo purposes)
    const mockPosts: BlogPost[] = [
        {
          id: '1',
          slug: 'pourquoi-apprendre-en-3-heures-change-tout',
          title: 'Pourquoi apprendre en 3 heures change tout ?',
          author: 'Equipe MakerLab',
          date: '10 Nov, 2024',
          preview: 'Fini les cours théoriques interminables. Le format "Sprint" permet de rester concentré et de voir un résultat immédiat. Voici la science derrière l\'apprentissage rapide.',
          content: `
            <p>Dans un monde où l'attention est devenue la ressource la plus rare, les méthodes éducatives traditionnelles peinent à engager les jeunes sur le long terme. Chez MakerLab Academy, nous avons adopté une approche radicalement différente : le format **"Sprint" de 3 heures**.</p>
            
            <h3>La Science de la Concentration</h3>
            <p>Des études en neurosciences montrent que la concentration intense a un pic naturel. En limitant la session à 3 heures avec un objectif concret (un robot qui roule, un jeu vidéo jouable, un objet 3D imprimé), nous créons un sentiment d'urgence positive.</p>
            
            <blockquote>"Le plaisir de voir son projet prendre vie en une seule après-midi booste la dopamine et renforce la mémorisation des concepts techniques."</blockquote>
            
            <h3>Du Concept à la Réalité</h3>
            <p>Pendant ces 180 minutes, l'élève passe par toutes les phases :</p>
            <ul>
              <li><strong>Design (30 min) :</strong> On pose les bases et on schématise.</li>
              <li><strong>Construction/Code (120 min) :</strong> Le cœur de l'action.</li>
              <li><strong>Test & Debug (30 min) :</strong> Essentiel pour l'esprit critique.</li>
            </ul>
            
            <p>Résultat ? L'enfant repart avec une réalisation physique ou numérique, et une confiance en soi décuplée. C'est l'essence même du mouvement Maker.</p>
          `,
          tags: ['Education', 'Méthode'],
          image: '/images/makerlab/generated/coding-ai-image-classifier-v1.webp',
        }
    ];

    const foundMock = mockPosts.find(p => p.id === id || p.slug === id);
    if (foundMock) setPost(foundMock);

  }, [id, settings]);

  if (!post) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Post non trouvé</h1>
                <Link to="/blog" className="text-brand-red font-bold hover:underline">Retour au blog</Link>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f5f7] pb-20">
      <SEO 
        title={post.title}
        description={post.preview}
        keywords={post.seoKeywords?.join(', ') || post.tags.join(', ')}
        image={getGeneratedProgramImage(post)}
      />
      {/* Header / Hero */}
      <div className="relative h-[58vh] min-h-[420px] overflow-hidden">
        <img 
          src={getGeneratedProgramImage(post)}
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent">
          <div className="container mx-auto px-4 pb-12">
            <ScrollReveal>
                <div className="ml-card max-w-4xl p-6 md:p-10">
                    <div className="flex flex-wrap gap-4 mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="ml-chip border-brand-orange/20 bg-brand-orange/10 text-brand-orange">{tag}</span>
                        ))}
                    </div>
                    <h1 className="mb-6 font-display text-3xl font-black leading-tight md:text-5xl lg:text-6xl">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm font-black uppercase text-gray-500">
                        <div className="flex items-center gap-2"><User size={18} className="text-brand-red" /> {post.author}</div>
                        <div className="flex items-center gap-2"><Calendar size={18} className="text-brand-blue" /> {post.date}</div>
                    </div>
                </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/blog" className="ml-button mb-10 border border-slate-200 bg-white text-sm text-slate-700 shadow-sm">
            <ArrowLeft size={20} /> Retour au Blog
          </Link>

          <article className="prose prose-xl prose-brand max-w-none">
            <div 
                className="font-medium text-lg md:text-xl leading-relaxed text-gray-800 space-y-6 blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>

          {/* Keywords / Tags Footer */}
          {post.seoKeywords && (
            <div className="mt-16 border-t border-slate-200 pt-8">
                <h4 className="font-display font-black text-xl mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Tag size={20} className="text-brand-green" /> Mots-clés reliés
                </h4>
                <div className="flex flex-wrap gap-2">
                    {post.seoKeywords.map(keyword => (
                        <span key={keyword} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg border-2 border-gray-200 text-sm font-bold">#{keyword}</span>
                    ))}
                </div>
            </div>
          )}

          {/* Share Section */}
          <div className="ml-card mt-12 flex flex-col items-center justify-between gap-6 bg-brand-blue/10 p-8 md:flex-row">
            <div>
                <h3 className="font-display font-black text-2xl uppercase">Tu as aimé cet article ?</h3>
                <p className="font-bold text-gray-600">Partage-le avec d'autres parents ou curieux !</p>
            </div>
            <div className="flex gap-4">
                <button className="ml-icon bg-brand-blue text-white shadow-sm" aria-label="Partager l'article">
                    <Share2 size={24} />
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
