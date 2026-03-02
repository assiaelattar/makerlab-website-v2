import React from 'react';
import { BlogPost } from '../types';
import { ScrollReveal } from '../components/ScrollReveal';

const posts: BlogPost[] = [
  {
    id: '1',
    title: 'Pourquoi apprendre en 3 heures change tout ?',
    author: 'Equipe MakerLab',
    date: '10 Nov, 2024',
    preview: 'Fini les cours théoriques interminables. Le format "Sprint" permet de rester concentré et de voir un résultat immédiat. Voici la science derrière l\'apprentissage rapide.',
    tags: ['Education', 'Méthode'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Top 5 des choses à imprimer en 3D',
    author: 'Sarah Maker',
    date: '28 Oct, 2024',
    preview: 'Tu as accès à une imprimante 3D mais pas d\'idée ? Voici 5 objets utiles, funs et faciles à designer pour ta première session Make & Go.',
    tags: ['3D Print', 'DIY'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Lancer sa marque de T-shirts sans argent',
    author: 'Alex Biz',
    date: '15 Oct, 2024',
    preview: 'Le Print on Demand permet de vendre tes designs sans gérer de stock. On t\'explique comment passer de l\'idée à la première vente.',
    tags: ['Business', 'Design'],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
  }
];

export const Blog: React.FC = () => {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="font-display font-bold text-5xl mb-4">Le Blog</h1>
            <div className="w-20 h-2 bg-brand-yellow mx-auto"></div>
          </div>
        </ScrollReveal>
        
        <div className="space-y-12">
          {posts.map((post, index) => (
            <ScrollReveal key={post.id} delay={index * 100}>
              <article className="bg-white rounded-3xl border-4 border-black shadow-neo overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="h-64 md:h-auto border-b-4 md:border-b-0 md:border-r-4 border-black relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span key={tag} className="bg-brand-purple text-white text-xs font-bold px-3 py-1 rounded-full border border-black uppercase tracking-wide">{tag}</span>
                      ))}
                    </div>
                    <h2 className="font-display font-bold text-2xl mb-4 hover:text-brand-purple cursor-pointer transition-colors leading-tight">{post.title}</h2>
                    <p className="text-gray-600 mb-6 font-medium text-sm leading-relaxed">{post.preview}</p>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-400 mt-auto pt-4 border-t-2 border-dashed border-gray-200">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};