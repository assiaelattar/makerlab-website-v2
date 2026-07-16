import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { MakerProject, MakerQuest } from '../types';
import { ExternalLink, Rocket, Target, ArrowRight } from 'lucide-react';

export const MakerWall: React.FC = () => {
  const [projects, setProjects] = useState<MakerProject[]>([]);
  const [quests, setQuests] = useState<MakerQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Web App', 'Print on Demand', 'Hardware / Robotics', '3D Design', 'Game Dev', 'Other'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const qProjects = query(
          collection(db, 'projects'),
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc')
        );
        const snapshotProjects = await getDocs(qProjects);
        const fetchedProjects = snapshotProjects.docs.map(doc => ({ id: doc.id, ...doc.data() } as MakerProject));
        setProjects(fetchedProjects);

        const qQuests = query(
          collection(db, 'maker_quests'),
          where('active', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snapshotQuests = await getDocs(qQuests);
        const fetchedQuests = snapshotQuests.docs.map(doc => ({ id: doc.id, ...doc.data() } as MakerQuest));
        setQuests(fetchedQuests);
      } catch (err) {
        console.error('Error fetching maker projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-[#f3f5f7] px-4 pb-16 pt-8 font-sans sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="ml-chip mb-6 border-brand-orange/20 bg-brand-orange/10 text-brand-orange">
            <Rocket className="w-4 h-4" /> Lab Portfolio
          </div>
          <h1 className="text-5xl md:text-6xl font-black font-display tracking-tight text-brand-dark mb-6">
            The <span className="text-brand-orange">Maker Wall</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium mb-8">
            Explore the cutting-edge digital products, apps, and hardware created by our young visionaries.
          </p>
          <Link to="/submit" className="ml-button bg-brand-orange px-8 text-white shadow-lg">
             <Rocket className="w-5 h-5"/> Submit Your Project
          </Link>
        </div>

        {/* ── ACTIVE QUESTS CAROUSEL ────────────────────────────────────── */}
        {quests.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-3xl font-black font-display uppercase flex items-center gap-3">
                  <Target className="text-brand-orange" size={32} strokeWidth={3} /> Défis du moment
               </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {quests.slice(0, 3).map(quest => (
                 <Link 
                   key={quest.id} 
                   to={`/maker-wall/quest/${quest.slug}`}
                   className="ml-card ml-card-interactive group block overflow-hidden"
                 >
                    <div className="relative aspect-video border-b border-slate-200">
                       <img src={quest.coverImage} alt={quest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-4 left-4">
                          <span className="ml-chip border-brand-blue/20 bg-white/95 text-brand-blue">{quest.category}</span>
                       </div>
                    </div>
                    <div className="p-6">
                       <h3 className="font-display font-black text-xl uppercase leading-tight mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">{quest.title}</h3>
                       <p className="text-sm font-bold text-gray-500 line-clamp-2 mb-4">{quest.description}</p>
                       <div className="flex items-center text-brand-orange font-black text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                          Relever ce défi <ArrowRight size={16} className="ml-1" strokeWidth={3} />
                       </div>
                    </div>
                 </Link>
               ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`ml-chip px-5 transition-all ${
                filter === f
                  ? 'border-brand-blue bg-brand-blue text-white shadow-md'
                  : 'hover:border-slate-300 hover:bg-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="ml-card py-20 text-center">
            <p className="text-xl text-gray-400 font-medium font-display">No projects found in this category yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/maker-wall/${project.slug}`}
                className="ml-card ml-card-interactive group relative block break-inside-avoid overflow-hidden"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-gray-100">
                  <img
                    src={project.coverImage}
                    alt={project.projectTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {project.category && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm shadow-sm rounded-full text-xs font-bold text-brand-dark uppercase tracking-wider">
                      {project.category}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold font-display text-brand-dark mb-2 group-hover:text-brand-orange transition-colors">
                    {project.projectTitle}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2">
                    {project.pitch}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-xs uppercase">
                        {project.makerNames[0]?.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-gray-700">
                        {project.makerNames.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
