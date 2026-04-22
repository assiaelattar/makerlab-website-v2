import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { MakerProject } from '../types';
import { ArrowLeft, ExternalLink, Github, MonitorPlay, Rocket, Zap } from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<MakerProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const q = query(
          collection(db, 'projects'),
          where('slug', '==', slug),
          where('status', '==', 'approved'),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const fetched = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as MakerProject;
          setProject(fetched);
          // Standard DOM SEO Update
          document.title = `${fetched.projectTitle} by ${fetched.makerNames.join(', ')} | MakerLab Academy`;
          
          let metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
          }
          metaDesc.setAttribute('content', fetched.pitch.substring(0, 160));
        } else {
          setProject(null);
        }
      } catch (err) {
        console.error('Error fetching project details', err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-orange"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-4xl font-black font-display text-brand-dark mb-4">404 - Project Not Found</h2>
          <p className="text-xl text-gray-500 mb-8">This project might be under review or doesn't exist.</p>
          <Link to="/maker-wall" className="inline-flex items-center gap-2 text-brand-orange font-bold hover:underline">
            <ArrowLeft className="w-5 h-5"/> Back to Maker Wall
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-24">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <Link to="/maker-wall" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-orange font-bold mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Gallery
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-white shadow-sm border border-gray-100 rounded-full text-xs font-bold text-gray-600 uppercase tracking-wider">
              {project.category}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight text-brand-dark mb-8 leading-tight">
            {project.projectTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-12">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {project.makerNames.map((name, i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-brand-orange/20 flex items-center justify-center text-brand-orange font-bold text-sm uppercase shadow-sm">
                    {name.charAt(0)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Built By</p>
                <p className="text-lg font-bold text-brand-dark">{project.makerNames.join(' & ')}</p>
              </div>
            </div>
            
            {(project.liveLink || project.repoLink) && (
              <div className="flex items-center gap-4 ml-auto">
                {project.repoLink && (
                  <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 hover:text-brand-dark transition-colors shadow-sm">
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-brand-orange text-white rounded-full font-bold hover:bg-[#e65a12] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    <MonitorPlay className="w-5 h-5" /> Visit Live Project
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 mb-16 relative z-10 aspect-[16/9] md:aspect-[21/9]">
          <img src={project.coverImage} alt={project.projectTitle} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Pitch */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-3xl font-black font-display text-brand-dark flex items-center gap-3">
              <Zap className="w-8 h-8 text-brand-orange" /> Brand DNA & Pitch
            </h2>
            <div className="prose prose-lg prose-orange text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
              {project.pitch}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {project.techStack && project.techStack.length > 0 && (
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-6">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-brand-dark shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-gradient-to-br from-brand-dark to-gray-900 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Rocket className="w-48 h-48 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black font-display text-white mb-6">
              Empower Your Child's <span className="text-brand-orange">Creativity</span>
            </h2>
            <p className="text-xl text-gray-300 font-medium mb-10 max-w-2xl mx-auto">
              Want your child to build real projects, launch startups, and learn the skills of the future? Join our next cohort.
            </p>
            <Link to="/programs" className="inline-flex items-center gap-3 bg-brand-orange text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e65a12] active:bg-[#cc5010] transition-transform hover:-translate-y-1 shadow-xl">
              Explore Programs <ArrowLeft className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
