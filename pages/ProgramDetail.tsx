import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePrograms } from '../contexts/ProgramContext';
import { useMissions } from '../contexts/MissionContext';
import { Button } from '../components/Button';
import { ArrowLeft, CheckCircle, CheckCircle2, Clock, Users, Calendar, ChevronDown, ChevronUp, Heart, Shield, Star, Rocket } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ScrollReveal } from '../components/ScrollReveal';
import { useSettings } from '../contexts/SettingsContext';
import { AiImage } from '../components/AiImage';
import { QualificationModal } from '../components/QualificationModal';

export const ProgramDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProgram, getWorkshop, workshops } = usePrograms();
  const { missions, tracks } = useMissions();
  const { settings } = useSettings();
  const program = getProgram(id || '');
  const DEFAULT_MISSION_IMG = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isQualModalOpen, setIsQualModalOpen] = useState(false);
  const isStemQuest = program?.id === 'kids-1' || program?.title?.toLowerCase().includes('stemquest');

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-4xl font-bold mb-4">Atelier non trouvé !</h2>
        <Link to="/programs"><Button>Retour aux ateliers</Button></Link>
      </div>
    );
  }

  const colors = ['#FACC15', '#22D3EE', '#EC4899', '#A3E635'];

  const faqItems = [
    { q: "Est-ce que mon enfant a besoin d'expérience préalable ?", a: "Absolument pas ! Nos ateliers sont conçus pour tous les niveaux. Nos mentors s'adaptent à chaque enfant, qu'il soit débutant total ou passionné de tech." },
    { q: "Qu'est-ce que mon enfant ramène à la maison ?", a: "À la fin de chaque session, votre enfant repart avec son projet terminé (un objet, une application, un jeu...) et un certificat MakerLab signé." },
    { q: "Quelle est la taille des groupes ?", a: "Maximum 10 enfants par session pour garantir un suivi personnalisé et une atmosphère collaborative et fun." },
    { q: "Y a-t-il des ateliers pour les plus jeunes (moins de 8 ans) ?", a: "Oui ! Nous adaptons nos programmes selon l'âge. Contactez-nous pour connaitre les ateliers disponibles pour votre tranche d'âge." },
    { q: "Comment se passe l'inscription ?", a: "Cliquez sur 'Réserver ma place' ci-dessus, choisissez votre créneau et procédez au paiement en ligne sécurisé. Simple et rapide !" },
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <Link to="/programs" className="inline-block mb-8">
          <Button variant="outline" size="sm" className="bg-white hover:bg-gray-100"><ArrowLeft size={16} strokeWidth={3} /> Retour au catalogue</Button>
        </Link>

        <ScrollReveal>
          <div className="bg-white rounded-[2.5rem] border-4 border-black shadow-neo-xl overflow-hidden mb-12">
            {/* Header Image Container */}
            <div className="p-4 md:p-6 bg-gray-50 border-b-4 border-black">
              <div className="h-64 md:h-[450px] w-full relative rounded-2xl border-4 border-black overflow-hidden group">
                <img src={program.image} alt={program.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {/* Subtle vignette only at the very top for better contrast with the white navbar if needed, but not covering center */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60"></div>
              </div>
            </div>

            {/* Title Block - Moved below image for clarity */}
            <div className="p-8 md:p-12 bg-white border-b-4 border-black">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-brand-orange text-black px-6 py-2 rounded-xl border-4 border-black font-black text-lg shadow-neo-sm transform -rotate-1 uppercase tracking-wider">
                  {program.category}
                </div>
                <div className="bg-white text-black px-6 py-2 rounded-xl border-4 border-black font-black text-lg shadow-neo-sm transform rotate-1 flex items-center gap-2 uppercase tracking-wider">
                  <Clock size={20} strokeWidth={4} /> {program.duration}
                </div>
              </div>
              <h1 className="font-display font-black text-4xl md:text-7xl lg:text-8xl text-black leading-[0.9] uppercase break-words">
                {program.title}
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 p-8 md:p-12 border-b-4 lg:border-b-0 lg:border-r-4 border-black bg-white">
                <h2 className="font-display font-black text-3xl md:text-4xl mb-8 flex items-center gap-4 uppercase tracking-tight">
                  <span className="bg-brand-red text-white w-12 h-12 flex items-center justify-center rounded-xl border-4 border-black text-2xl shadow-neo-sm">1</span>
                  À propos du programme
                </h2>
                <div className="bg-brand-blue/10 p-6 rounded-2xl border-l-8 border-brand-blue mb-10">
                  <p className="text-gray-900 text-xl leading-relaxed font-bold">{program.description}</p>
                  <p className="mt-4 text-gray-700 font-medium">
                    Pas de théorie inutile. Tu viens chez MakerLab, tu prends tes outils, et tu repars 3 heures plus tard avec ton projet terminé et une fierté immense.
                  </p>
                </div>

                <h3 className="font-display font-black text-3xl md:text-4xl mb-8 flex items-center gap-4 uppercase tracking-tight">
                  <span className="bg-brand-green text-white w-12 h-12 flex items-center justify-center rounded-xl border-4 border-black text-2xl shadow-neo-sm">2</span>
                  Ce que tu vas apprendre
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                  {['Mentors Experts', 'Matériel Inclus', 'Projet à emporter', 'Certificat MakerLab'].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border-2 border-black shadow-sm hover:shadow-neo transition-all group">
                      <div className="bg-brand-green p-2 rounded-lg border-2 border-black group-hover:rotate-12 transition-transform">
                        <CheckCircle className="text-black w-6 h-6" strokeWidth={3} />
                      </div>
                      <span className="font-bold text-lg">{item}</span>
                    </div>
                  ))}
                </div>

                {/* ─── Timeline (Modular/Annual) ─── */}
                {program.landingPage?.showStationsAsTimeline && program.landingPage.stations && (
                  <div className="mb-16">
                    <h3 className="font-display font-black text-3xl md:text-4xl mb-12 flex items-center gap-4 uppercase tracking-tight">
                      <span className="bg-brand-blue text-white w-12 h-12 flex items-center justify-center rounded-xl border-4 border-black text-2xl shadow-neo-sm">3</span>
                      {program.landingPage.stationsTimelineHeadline || 'Votre Parcours Innovation'}
                    </h3>
                    <div className="relative pl-8 border-l-4 border-black space-y-12 ml-4">
                      {program.landingPage.stations.map((station, idx) => (
                        <div key={station.id} className="relative">
                          <div className="absolute -left-[2.75rem] top-0 w-10 h-10 bg-white border-4 border-black rounded-xl flex items-center justify-center font-black shadow-neo-sm">
                            {idx + 1}
                          </div>
                          <div className="bg-white p-6 rounded-3xl border-4 border-black shadow-neo-sm hover:-translate-y-1 transition-transform">
                            <h4 className="font-black text-2xl mb-2 uppercase italic">{station.title}</h4>
                            <p className="text-gray-600 font-medium leading-relaxed">{station.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ─── Projects Showcase (New) ─── */}
                {program.landingPage?.showProjectsSection && program.landingPage.projects && (
                  <div className="mb-16">
                    <h3 className="font-display font-black text-3xl md:text-4xl mb-12 flex items-center gap-4 uppercase tracking-tight">
                      <span className="bg-brand-orange text-white w-12 h-12 flex items-center justify-center rounded-xl border-4 border-black text-2xl shadow-neo-sm">4</span>
                      {program.landingPage.projectsHeadline || 'Ce qu\'ils construisent réellement'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {program.landingPage.projects.map((project) => (
                        <div key={project.id} className="group bg-white rounded-3xl border-4 border-black overflow-hidden shadow-neo-sm hover:shadow-neo transition-all">
                          {project.image && (
                            <div className="h-56 overflow-hidden border-b-4 border-black">
                              <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          )}
                          <div className="p-6">
                            <span className="inline-block px-3 py-1 bg-gray-100 border-2 border-black rounded-lg text-[10px] font-black uppercase mb-3">{project.category || 'PROJET'}</span>
                            <h4 className="font-black text-xl mb-2 uppercase">{project.title}</h4>
                            <p className="text-gray-600 text-sm font-medium leading-relaxed">{project.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Chart */}
                <div className="bg-brand-dark text-white p-8 rounded-3xl border-4 border-black shadow-neo relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-32 bg-brand-red opacity-20 blur-3xl rounded-full"></div>
                  <h3 className="font-display font-black text-2xl mb-8 relative z-10 flex items-center gap-2 uppercase tracking-widest">
                    Compétences Développées 📈
                  </h3>
                  <div className="h-64 w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={program.stats}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#fff', fontWeight: 'bold', fontSize: 14 }} dy={10} />
                        <YAxis hide />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                          contentStyle={{ borderRadius: '12px', border: '2px solid white', backgroundColor: '#000', color: '#fff', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={60}>
                          {program.stats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="black" strokeWidth={2} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 bg-brand-blue p-8 md:p-12 flex flex-col justify-between border-black">
                <div>
                  <div className="bg-white p-8 rounded-3xl border-4 border-black shadow-neo mb-8 transform rotate-1 hover:rotate-0 transition-transform">
                    {program.programType === 'annual' ? (
                      <>
                        <p className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Inscription Annuelle</p>
                        <div className="flex items-baseline gap-2 mb-6">
                          <span className="text-5xl md:text-6xl font-display font-bold text-brand-red drop-shadow-sm">{program.price}</span>
                          <span className="text-gray-400 font-bold text-sm uppercase">/ an</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-2">Prix par atelier</p>
                        <div className="flex items-baseline gap-2 mb-6">
                          <span className="text-6xl font-display font-bold text-brand-red drop-shadow-sm">{program.price}</span>
                        </div>
                      </>
                    )}

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3 text-gray-900 font-bold">
                        <div className="bg-brand-red p-1 text-white rounded border border-black"><Calendar size={18} strokeWidth={3} /></div>
                        <div>
                          <span>Prochaines Sessions :</span>
                          <ul className="mt-2 space-y-1 text-brand-red">
                            {program.schedule && program.schedule.length > 0 ? (
                              program.schedule.map((date, idx) => <li key={idx}>• {date}</li>)
                            ) : (
                              <li>Dates à venir</li>
                            )}
                          </ul>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-900 font-bold">
                        <div className="bg-brand-green text-white p-1 rounded border border-black"><Users size={18} strokeWidth={3} /></div>
                        <span>Max 10 places / session</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {isStemQuest ? (
                        <Button 
                          onClick={() => setIsQualModalOpen(true)}
                          variant="primary" 
                          className="w-full justify-center text-xl py-6 shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 bg-brand-orange text-black border-4 border-black uppercase tracking-widest font-black flex items-center gap-3 group"
                        >
                          <Rocket size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" strokeWidth={3} />
                          VÉRIFIER MON ÉLIGIBILITÉ
                        </Button>
                      ) : (
                        <Link to={`/booking/${program.id}?type=${program.programType === 'annual' ? 'annual' : 'workshop'}`} className="block">
                          <Button variant="primary" className="w-full justify-center text-xl py-4 shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 bg-brand-red text-white uppercase tracking-widest font-black">
                            {program.programType === 'annual' ? "S'inscrire à l'année" : "Réserver ma place"}
                          </Button>
                        </Link>
                      )}

                      {program.programType === 'annual' && !isStemQuest && (
                        <Link to={`/booking/${program.id}?type=trial`} className="block">
                          <Button variant="outline" className="w-full justify-center text-lg py-4 border-4 border-black bg-white hover:bg-gray-50 transition-colors uppercase tracking-widest font-black">
                            🎁 Essai Gratuit
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-sm text-black/70 mb-2">Besoin d'aide ?</p>
                    <a href={`tel:${settings?.contact_info?.phone?.replace(/\s/g, '') || '+212600000000'}`} className="text-lg font-bold underline decoration-4 decoration-black hover:text-white transition-colors">
                      {settings?.contact_info?.phone || '+212 6 00 00 00 00'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════
            SECTION 1.5: MISSION COMPONENTS (CHILD WORKSHOPS)
        ═══════════════════════════════════════════════════════ */}
        {(() => {
          // Combine workshops explicitly listed + those pointing to this parent
          const isMakeAndGo = program.id === 'kids-2' || program.title.toLowerCase().includes('make & go') || (program as any).landingPage?.layoutVariant === 'modular';
          
          let allWorkshops: any[] = [];
          
          if (isMakeAndGo) {
            // SHOW LIVE MISSIONS for Make & Go
            allWorkshops = missions.filter(m => m.active);
            // If still loading or empty, we might want to show a placeholder or nothing
            if (allWorkshops.length === 0) {
               return (
                 <div className="py-20 text-center border-4 border-dashed border-gray-100 rounded-3xl mb-16">
                   <Rocket size={48} className="mx-auto text-gray-200 mb-4 animate-pulse" />
                   <h3 className="font-black text-xl text-gray-400">Prochaines thématiques en cours de préparation...</h3>
                   <p className="text-sm font-medium text-gray-300 mt-2 uppercase tracking-widest">Revenez bientôt pour plus de missions !</p>
                 </div>
               );
            }
          } else {
            const explicitWorkshops = (program.childWorkshopIds || []).map(wid => getWorkshop(wid)).filter(Boolean);
            const implicitWorkshops = workshops.filter(w => w.parentProgramId === program.id && !program.childWorkshopIds?.includes(w.id));
            allWorkshops = [...explicitWorkshops, ...implicitWorkshops];
          }

          if (allWorkshops.length === 0) return null;

          return (
            <ScrollReveal>
              <section className="mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10">
                  <div>
                     <h2 className="font-display font-black text-4xl uppercase border-b-8 border-brand-blue pb-4 inline-block">
                       {isMakeAndGo ? 'Thématiques Disponibles' : 'Modules de la Mission'}
                     </h2>
                     <p className="mt-4 font-bold text-gray-500 uppercase tracking-widest text-sm">
                       {isMakeAndGo ? 'Choisissez votre session à la carte' : `Contenu détaillé du pack ${program.title}`}
                     </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {allWorkshops.map(item => {
                    if (!item) return null;
                    
                    const title = isMakeAndGo ? item.title : item.name;
                    const desc = item.description;
                    const meta = isMakeAndGo ? item.date : item.duration;

                    return (
                      <div key={item.id} className="bg-white border-4 border-black shadow-neo hover:shadow-neo-xl transition-all group overflow-hidden flex flex-col">
                        <div className="h-48 overflow-hidden border-b-4 border-black relative">
                           <AiImage
                              src={('coverImage' in item && item.coverImage) ? item.coverImage : ((item as any).image || DEFAULT_MISSION_IMG)}
                              prompt={'imagePrompt' in item ? item.imagePrompt || '' : ''}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                           <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                              {isMakeAndGo ? (
                                <span className={`bg-black text-white text-[10px] font-black px-2 py-1 uppercase border border-white ${item.status === 'full' ? 'bg-red-500' : 'bg-green-500'}`}>
                                  {item.status === 'full' ? 'Complet' : 'Session 3H'}
                                </span>
                              ) : (
                                item.tags?.map((tag: string) => (
                                  <span key={tag} className="bg-black text-white text-[10px] font-black px-2 py-1 uppercase border border-white">
                                    {tag}
                                  </span>
                                ))
                              )}
                           </div>
                        </div>
                        <div className="p-6 flex-grow">
                          <h4 className="font-black text-xl mb-2 uppercase text-black">{title}</h4>
                          <p className="text-gray-600 font-bold text-sm line-clamp-3">{desc}</p>
                        </div>
                        <div className="p-4 bg-gray-50 border-t-2 border-black flex justify-between items-center text-black">
                           <span className="font-black text-xs uppercase text-gray-400">{meta}</span>
                           {isMakeAndGo ? (
                             <Link to={item.status === 'full' ? '#' : `/booking/${program.id}?missionId=${item.id}`} className="font-black text-xs uppercase text-brand-blue hover:underline">
                               {item.status === 'full' ? 'Sold Out' : 'Réserver →'}
                             </Link>
                           ) : (
                             <span className="font-black text-xs uppercase text-brand-blue">Inclus</span>
                           )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </ScrollReveal>
          );
        })()}

        {/* ═══════════════════════════════════════════════════════
            SECTION 1.6: PARCOURS (ONLY FOR MAKE & GO)
        ═══════════════════════════════════════════════════════ */}
        {(program.id === 'kids-2' || program.title.toLowerCase().includes('make & go')) && tracks.length > 0 && (
          <ScrollReveal>
             <section className="mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-10">
                  <div>
                     <h2 className="font-display font-black text-4xl uppercase border-b-8 border-brand-orange pb-4 inline-block">Parcours (Packs)</h2>
                     <p className="mt-4 font-bold text-gray-500 uppercase tracking-widest text-sm">Regroupez vos missions pour progresser plus vite</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {tracks.filter(t => t.active).map(track => (
                    <div key={track.id} className="bg-white border-4 border-black rounded-[2rem] overflow-hidden flex flex-col md:flex-row shadow-neo hover:shadow-neo-xl transition-all group">
                       <div className="md:w-2/5 h-64 md:h-auto border-b-4 md:border-b-0 md:border-r-4 border-black relative bg-gray-100">
                          <AiImage 
                            src={track.coverImage || DEFAULT_MISSION_IMG} 
                            prompt="" 
                            alt={track.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute top-4 left-4 bg-brand-orange text-black border-2 border-black px-3 py-1 font-black text-[10px] uppercase shadow-neo-sm">
                             {track.price}
                          </div>
                       </div>
                       <div className="p-8 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-black text-2xl mb-3 uppercase">{track.title}</h3>
                            <p className="text-gray-600 font-bold text-sm mb-6 leading-relaxed line-clamp-3">{track.description}</p>
                            <ul className="space-y-2">
                               {(track.benefits || []).slice(0, 3).map((b, i) => (
                                 <li key={i} className="flex items-center gap-2 text-xs font-black uppercase text-gray-800">
                                    <CheckCircle2 size={14} className="text-brand-green" strokeWidth={3} /> {b}
                                 </li>
                               ))}
                            </ul>
                          </div>
                          <Link to={`/booking/${program.id}?trackId=${track.id}`} className="mt-8">
                             <Button variant="primary" className="w-full justify-center bg-black text-white hover:bg-brand-orange hover:text-black shadow-neo-sm transition-all">
                               Réserver ce parcours
                             </Button>
                          </Link>
                       </div>
                    </div>
                  ))}
                </div>
             </section>
          </ScrollReveal>
        )}

        {/* ═══════════════════════════════════════════════════════
            SECTION 2: POUR LES PARENTS — Conversion Section
        ═══════════════════════════════════════════════════════ */}
        <ScrollReveal>
          <section className="mb-12 bg-brand-red text-white border-4 border-black rounded-3xl shadow-neo p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[200px] font-black opacity-5 leading-none">👨‍👩‍👧</div>
            <div className="relative z-10">
              <div className="inline-block bg-black text-white px-4 py-1 text-sm font-black uppercase tracking-widest mb-4 border-2 border-black">Pour les Parents</div>
              <h2 className="font-display font-black text-4xl md:text-5xl mb-8 uppercase leading-tight">Ce que votre enfant va <span className="text-brand-red">vraiment</span> gagner</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Rocket, title: "Un projet concret", desc: "Il repart avec quelque chose qui fonctionne — pas un dessin, un vrai objet technologique.", bg: "bg-white" },
                  { icon: Heart, title: "Confiance en soi", desc: "Présenter son travail devant le groupe, réussir un défi difficile. C'est bon pour la fierté.", bg: "bg-brand-green" },
                  { icon: Shield, title: "Des compétences du futur", desc: "Pensée créative, résolution de problèmes, travail en équipe — des aptitudes pour toute la vie.", bg: "bg-brand-blue" },
                ].map((item, i) => (
                  <div key={i} className={`${item.bg} border-4 border-black p-6 rounded-2xl shadow-neo hover:-translate-y-1 transition-all`}>
                    <item.icon size={36} strokeWidth={2.5} className="mb-4 text-black" />
                    <h3 className="font-black text-xl mb-2">{item.title}</h3>
                    <p className="font-medium text-gray-800">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════
            SECTION 3: TESTIMONIAL
        ═══════════════════════════════════════════════════════ */}
        <ScrollReveal>
          <section className="mb-12 bg-brand-dark border-4 border-black rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-4 left-8 text-[120px] font-black text-white opacity-10 leading-none">"</div>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} className="text-brand-orange fill-brand-orange" />)}
              </div>
              <blockquote className="font-bold text-2xl md:text-3xl leading-relaxed mb-8 italic">
                "Mon fils de 10 ans est rentré avec un robot qu'il avait assemblé et codé lui-même. Il n'arrêtait pas de me montrer comment ça fonctionnait. Je ne l'avais jamais vu aussi fier."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 bg-brand-orange border-4 border-brand-orange rounded-full flex items-center justify-center text-black font-black text-xl">S</div>
                <div className="text-left">
                  <p className="font-black text-lg">Sophiane M.</p>
                  <p className="text-gray-400 font-medium text-sm">Maman d'un MakerLab fan, Casablanca</p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════
            SECTION 4: FAQ
        ═══════════════════════════════════════════════════════ */}
        <ScrollReveal>
          <section className="mb-16">
            <h2 className="font-display font-black text-4xl mb-8 uppercase border-b-8 border-brand-orange pb-4 inline-block">Questions Fréquentes</h2>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div key={i} className="border-4 border-black rounded-2xl overflow-hidden bg-white shadow-neo hover:shadow-neo-xl transition-all">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left gap-4 font-black text-lg hover:bg-gray-50 transition-colors"
                  >
                    <span>{item.q}</span>
                    {openFaq === i ? <ChevronUp size={24} strokeWidth={3} className="shrink-0 text-brand-red" /> : <ChevronDown size={24} strokeWidth={3} className="shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 border-t-2 border-black bg-gray-50">
                      <p className="pt-4 text-gray-700 font-medium text-lg leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* ═══════════════════════════════════════════════════════
            SECTION 5: BOTTOM CTA
        ═══════════════════════════════════════════════════════ */}
        <ScrollReveal>
          <section className="bg-brand-red border-4 border-black rounded-3xl p-10 text-center shadow-neo-xl mb-8">
            <h2 className="font-display font-black text-4xl md:text-6xl text-white mb-4 drop-shadow-md">Prêt à rejoindre l'aventure ?</h2>
            <p className="text-white/80 font-bold text-xl mb-8 max-w-xl mx-auto">Places limitées à 10 par session. Ne tardez pas !</p>
            <div className="flex justify-center">
              {isStemQuest ? (
                <Button 
                  onClick={() => setIsQualModalOpen(true)}
                  variant="outline" 
                  className="text-2xl py-5 px-12 border-4 border-black shadow-[6px_6px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 bg-white text-black uppercase font-black"
                >
                  <Rocket size={24} strokeWidth={3} className="mr-2" /> VÉRIFIER MON ÉLIGIBILITÉ
                </Button>
              ) : (
                <Link to="/register">
                  <Button variant="outline" className="text-2xl py-5 px-12 border-4 border-black shadow-[6px_6px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                    <Rocket size={24} strokeWidth={3} className="mr-2" /> Réserver ma place — {program.price}
                  </Button>
                </Link>
              )}
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
};