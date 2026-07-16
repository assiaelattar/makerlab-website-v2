import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { BlogPost } from '../types';
import { useSettings } from '../contexts/SettingsContext';
import { SEO } from '../components/SEO';
import { AppContainer, AppSectionHeader, AppShell, appAccentClasses } from '../components/AppStyle';
import { PremiumHero } from '../components/PremiumHero';
import { Reveal } from '../components/Motion';

const posts: BlogPost[] = [
  {
    id: '1',
    slug: 'pourquoi-apprendre-en-3-heures-change-tout',
    title: 'Pourquoi apprendre en 3 heures change tout ?',
    author: 'Equipe MakerLab',
    date: '10 Nov, 2024',
    preview: 'Le format sprint garde les enfants concentres et donne un resultat visible tout de suite.',
    content: '<p>Contenu de test pour le blog...</p>',
    tags: ['Education', 'Methode'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    slug: 'top-5-choses-imprimer-en-3d',
    title: 'Top 5 des choses a imprimer en 3D',
    author: 'Sarah Maker',
    date: '28 Oct, 2024',
    preview: 'Des objets utiles, funs et faciles a designer pour une premiere session MakerLab.',
    content: '<p>Contenu de test pour le blog...</p>',
    tags: ['3D Print', 'DIY'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '3',
    slug: 'lancer-sa-marque-de-t-shirts-sans-argent',
    title: 'Lancer sa marque de T-shirts sans argent',
    author: 'Alex Biz',
    date: '15 Oct, 2024',
    preview: "Le print on demand montre aux enfants comment une idee peut devenir une premiere vente.",
    content: '<p>Contenu de test pour le blog...</p>',
    tags: ['Business', 'Design'],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
  },
];

export const Blog: React.FC = () => {
  const { settings } = useSettings();
  const dynamicPosts = settings?.blogs || posts;

  return (
    <AppShell className="pb-24 pt-5">
      <SEO
        title="Le Blog - MakerLab Academy"
        description="Actualites, conseils et projets tech pour enfants et parents."
        keywords="blog robotique Maroc, actualites STEM enfants, conseils parents tech, MakerLab Academy blog"
      />
      <AppContainer>
        <PremiumHero
          eyebrow="MakerLab Journal"
          title={<>Des idées utiles pour élever des <span className="text-[#74b5ff]">créateurs.</span></>}
          description="Des articles courts et concrets pour aider les familles à comprendre les compétences, les projets et le futur derrière chaque mission."
          image={dynamicPosts[0]?.image || posts[0].image}
          imageAlt="Jeune créateur travaillant sur un projet numérique"
          accent="blue"
          stats={[
            [`${dynamicPosts.length}`, 'articles'],
            ['5 min', 'de lecture'],
            ['100%', 'pratique'],
            ['Parents', 'et jeunes makers'],
          ]}
        />

        <section className="py-10">
          <AppSectionHeader
            eyebrow="À la une"
            title="Des ressources courtes pour mieux accompagner les jeunes makers."
            text="Méthode, technologies et idées de projets expliquées simplement aux familles."
            accent="text-brand-blue"
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {dynamicPosts.map((post: BlogPost, index: number) => (
              <Reveal key={post.id} delay={(index % 3) * 90}>
              <Link to={`/blog/${post.slug || post.id}`} className="ml-card ml-card-interactive group block overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={post.image} alt={post.title} className="ml-image-zoom h-full w-full object-cover" />
                  <span className={`absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl ${appAccentClasses[index % appAccentClasses.length]} text-white`}>
                    <Sparkles size={21} />
                  </span>
                </div>
                <div className="p-5">
                  <div className="mb-4 flex flex-wrap gap-2">
                    {post.tags?.map(tag => (
                      <span key={tag} className="rounded-full bg-[#f7f7f4] px-3 py-1 text-[10px] font-black uppercase text-slate-500">{tag}</span>
                    ))}
                  </div>
                  <h2 className="text-2xl font-black leading-tight group-hover:text-brand-orange">{post.title}</h2>
                  <p className="mt-3 line-clamp-3 min-h-[78px] text-sm font-semibold leading-6 text-slate-500">{post.preview}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-black text-slate-400">
                    <span>{post.author}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={13} /> {post.date}</span>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-black">
                    Lire l’article <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </AppContainer>
    </AppShell>
  );
};
