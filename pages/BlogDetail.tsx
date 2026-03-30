import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { ScrollReveal } from '../components/ScrollReveal';
import { useSettings } from '../contexts/SettingsContext';
import { SEO } from '../components/SEO';
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
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
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
    <div className="min-h-screen bg-white pb-20">
      <SEO 
        title={post.title}
        description={post.preview}
        keywords={post.seoKeywords?.join(', ') || post.tags.join(', ')}
        image={post.image}
      />
      {/* Header / Hero */}
      <div className="relative h-[60vh] min-h-[400px] border-b-8 border-black overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <ScrollReveal>
                <div className="max-w-4xl bg-white border-4 border-black p-6 md:p-10 shadow-neo transform -rotate-1">
                    <div className="flex flex-wrap gap-4 mb-6">
                        {post.tags.map(tag => (
                            <span key={tag} className="bg-brand-orange text-black text-xs font-black px-4 py-1 border-2 border-black rounded-full uppercase tracking-widest">{tag}</span>
                        ))}
                    </div>
                    <h1 className="font-display font-black text-3xl md:text-5xl lg:text-6xl mb-6 leading-tight uppercase">
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
          <Link to="/blog" className="inline-flex items-center gap-2 font-black uppercase text-sm hover:text-brand-red transition-colors mb-12 bg-gray-100 px-4 py-2 border-2 border-black shadow-neo-sm transform hover:-translate-y-1">
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
            <div className="mt-16 pt-8 border-t-4 border-black border-dashed">
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
          <div className="mt-12 p-8 bg-brand-blue/10 border-4 border-black rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-neo-sm">
            <div>
                <h3 className="font-display font-black text-2xl uppercase">Tu as aimé cet article ?</h3>
                <p className="font-bold text-gray-600">Partage-le avec d'autres parents ou curieux !</p>
            </div>
            <div className="flex gap-4">
                <button className="bg-white border-4 border-black p-4 rounded-xl shadow-neo-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                    <Share2 size={24} />
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
