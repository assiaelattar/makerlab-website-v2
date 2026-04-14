import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';
import { usePrograms } from '../contexts/ProgramContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  CheckCircle2, 
  MessageCircle, 
  Zap, 
  Star, 
  ShieldCheck, 
  Sparkles,
  Rocket,
  Clock,
  Target,
  Trophy,
  ShieldAlert,
  Award,
  Play
} from 'lucide-react';
import { Button } from '../components/Button';

type PackType = '1-project' | '3-projects' | '10-projects';

interface Pack {
  title: string;
  subtitle: string;
  price: string;
  label: string;
  icon: React.ReactNode;
  oldPrice?: string;
  savings?: string;
  featured?: boolean;
}

export const ThankYou: React.FC = () => {
  const { settings } = useSettings();
  const { getProgram } = usePrograms();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const leadId = searchParams.get('leadId');
  const programId = searchParams.get('programId');
  const type = (searchParams.get('type') || 'mission') as string;
  const childName = searchParams.get('childName') || 'votre enfant';
  const programTitle = searchParams.get('programTitle') || searchParams.get('title') || 'votre atelier';
  
  const program = useMemo(() => programId ? getProgram(programId) : null, [programId, getProgram]);
  const config = program?.landingPage?.thankYou;

  const isOrientation = type === 'orientation' || type === 'evaluation' || type === 'trial';
  const itemPrice = searchParams.get('itemPrice') || '';
  const isSingleMission = itemPrice.includes('400') || type === 'mission';

  const [selectedPack, setSelectedPack] = useState<PackType>('3-projects');
  const [syncing, setSyncing] = useState(false);

  const packs: Record<PackType, Pack> = useMemo(() => {
    if (isSingleMission) {
      return {
        '1-project': {
          title: "Session Unique",
          subtitle: "Confirmé",
          price: "400 DHS",
          label: "Payé",
          icon: <CheckCircle2 className="text-green-500" />
        },
        '3-projects': {
          title: "Upgrade Duo (2 sessions)",
          subtitle: "Progressez plus vite",
          price: "700 DHS",
          oldPrice: "800 DHS",
          savings: "100 DHS",
          label: "Offre Flash",
          icon: <Zap className="text-white" />,
          featured: true
        },
        '10-projects': {
          title: "Pack Découverte (3 sessions)",
          subtitle: "Le meilleur départ",
          price: "990 DHS",
          oldPrice: "1200 DHS",
          savings: "210 DHS",
          label: "Plus Populaire",
          icon: <Sparkles className="text-white" />
        }
      };
    }

    return {
      '1-project': {
        title: "1 Projet",
        subtitle: "Introduction",
        price: "400 DHS",
        label: "Standard",
        icon: <Star className="text-gray-400" />
      },
      '3-projects': {
        title: "Pack 3 Projets",
        subtitle: "Maîtrise de base",
        price: "990 DHS",
        oldPrice: "1200 DHS",
        savings: "210 DHS",
        label: "Le Plus Populaire",
        icon: <Zap className="text-white" />,
        featured: true
      },
      '10-projects': {
        title: "Pack Champion (10)",
        subtitle: "Expertise Maker",
        price: "2900 DHS",
        label: "Meilleure Valeur",
        icon: <Trophy className="text-white" />
      }
    };
  }, [isSingleMission]);

  // 🛡️ Safe Collection Logic
  const getCollectionName = (t: string) => {
    if (t === 'enrollment') return 'enrollments';
    if (t === 'orientation' || t === 'evaluation' || t === 'trial') return 'website-orientation-leads';
    return 'website-landing-leads';
  };

  const syncSelectionWithAdmin = useCallback(async (pack: PackType) => {
    if (!leadId || isOrientation) return; // Don't sync packs for orientations
    setSyncing(true);
    try {
      const collectionName = getCollectionName(type);
      const docRef = doc(db, collectionName, leadId);
      await updateDoc(docRef, { 
        selectedPack: packs[pack].title,
        paymentStatus: pack === '1-project' ? 'Pending' : 'Full Bundle'
      });
    } catch (e) {
      console.warn("Soft fail on lead sync (expected if doc not yet replicated):", e);
    } finally {
      setSyncing(false);
    }
  }, [leadId, type, packs, isOrientation]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = isOrientation ? "Confirmation Orientation - MakerLab" : "Action Requise - MakerLab Academy";
    if (!isOrientation) syncSelectionWithAdmin(selectedPack);
  }, []);

  const handlePackChange = (pack: PackType) => {
    if (isOrientation) return;
    setSelectedPack(pack);
    syncSelectionWithAdmin(pack);
  };

  const phoneNumber = settings.contact_info?.phone || '+212621877106';
  const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+/, '');
  
  const whatsappMessage = encodeURIComponent(
    isOrientation 
      ? `Bonjour MakerLab ! Je suis le parent de ${childName}. Je viens de réserver une session d'Orientation/Évaluation pour ${programTitle}. 🚀 \n\nQuelles sont les prochaines étapes pour notre visite au Lab ?`
      : `Bonjour MakerLab ! Je suis le parent de ${childName}. Je viens de réserver ${programTitle}. 🚀 \n\nJe souhaite profiter de l'offre : "${packs[selectedPack].title}" au prix de ${packs[selectedPack].price}. \n\nComment puis-je confirmer et régler ?`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}/?text=${whatsappMessage}`;

  // Video embed helper
  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return `https://www.youtube.com/embed/${url.split('v=')[1]}`;
    }
    if (url.includes('youtu.be/')) {
      return `https://www.youtube.com/embed/${url.split('be/')[1]}`;
    }
    if (url.includes('vimeo.com/')) {
      return `https://player.vimeo.com/video/${url.split('com/')[1]}`;
    }
    return url;
  };

  const showMarquee = config?.showMarquee ?? true;
  const showTrustPillars = config?.showTrustPillars ?? true;
  const showPacks = config?.showPacks ?? true;

  return (
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden pt-12 md:pt-20">
      
      {/* ── Social Proof Marquee ── */}
      {showMarquee && (
        <div className="bg-black text-white py-3 border-y-4 border-black overflow-hidden relative z-[60] mb-8">
          <div className="animate-marquee whitespace-nowrap flex gap-16 font-display font-black text-xs md:text-sm uppercase tracking-widest items-center">
              <span className="flex items-center gap-2">🔥 Rejoint par 5000+ parents à Casablanca</span>
              <span className="text-brand-orange text-xl">•</span>
              <span className="flex items-center gap-2">🛡️ Garantie 100% Satisfait ou Remboursé</span>
              <span className="text-brand-orange text-xl">•</span>
              <span className="flex items-center gap-2">⚙️ Zéro Lego, 100% Vraie Technologie</span>
              <span className="text-brand-orange text-xl">•</span>
              <span className="flex items-center gap-2">⭐ Note de 4.9/5 sur Google</span>
              {/* Duplicate for seamless loop */}
              <span className="text-brand-orange text-xl">•</span>
              <span className="flex items-center gap-2">🔥 Rejoint par 5000+ parents à Casablanca</span>
              <span className="text-brand-orange text-xl">•</span>
              <span className="flex items-center gap-2">🛡️ Garantie 100% Satisfait ou Remboursé</span>
              <span className="text-brand-orange text-xl">•</span>
              <span className="flex items-center gap-2">⚙️ Zéro Lego, 100% Vraie Technologie</span>
          </div>
        </div>
      )}

      {/* ── Progress Bar ── */}
      <div className="max-w-2xl mx-auto mb-16 px-6">
        <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Inscription Reçue!</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-orange animate-pulse">Étape Finale : Confirmation</span>
        </div>
        <div className="h-5 bg-gray-100 border-4 border-black rounded-full overflow-hidden flex shadow-neo-sm">
            <div className="h-full bg-green-500 w-3/4 border-r-4 border-black"></div>
            <div className="h-full bg-brand-orange/20 w-1/4"></div>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* ── Hero Section (Simplified) ── */}
          <div className="relative text-center mb-16">
            <div className={`inline-flex items-center gap-2 px-6 py-2 border-4 rounded-full mb-8 transform -rotate-1 shadow-neo-sm ${isOrientation ? 'bg-orange-50 border-orange-600' : 'bg-green-50 border-green-600'}`}>
              <CheckCircle2 size={24} className={isOrientation ? 'text-orange-600' : 'text-green-600'} />
              <span className={`text-sm font-black uppercase tracking-widest ${isOrientation ? 'text-orange-700' : 'text-green-700'}`}>
                {isOrientation ? `Candidature de ${childName} en cours` : `Demande de ${childName} Reçue`}
              </span>
            </div>
            <h1 className="font-display font-black text-4xl md:text-7xl uppercase tracking-tighter leading-[0.9] mb-8">
              {config?.headline || (
                isOrientation ? (
                  <>Dernière étape...<br />
                  <span className="text-brand-orange text-3xl md:text-5xl">Confirmez votre orientation</span></>
                ) : (
                  <>Bienvenue au Lab !<br />
                  <span className="text-brand-orange">Prochaine étape...</span></>
                )
              )}
            </h1>
            <p className="text-lg md:text-xl font-bold text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed uppercase tracking-tight">
              {config?.subHeadline || (
                isOrientation 
                ? <>Nous avons bien reçu votre demande pour le parcours <span className="underline decoration-4 decoration-brand-orange">{programTitle}</span>.</>
                : <>Choisissez l'expérience complète de <span className="bg-brand-orange/20 px-2">{childName.split(' ')[0]}</span> ci-dessous, puis confirmez votre place.</>
              )}
            </p>
            {!isOrientation && (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-brand-orange/10 border-2 border-brand-orange p-6 rounded-2xl mb-4 w-full max-w-lg shadow-neo-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-orange mb-1">Résumé de votre réservation</p>
                  <h4 className="font-display font-black text-xl uppercase leading-none mb-1">{programTitle}</h4>
                  <p className="font-black text-brand-red text-sm uppercase italic">{itemPrice || '400 MAD'}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── 1. The Orientation / Pack Selection Section ── */}
          {isOrientation ? (
            <div className="mb-12 bg-gray-50 border-4 border-black rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-neo-lg">
               <div className="absolute top-0 right-0 p-8 font-display font-black text-9xl text-black/5 select-none pointer-events-none uppercase">ELITE</div>
               <div className="text-center mb-12 relative z-10">
                  <h2 className="font-display font-black text-3xl md:text-5xl uppercase mb-3">Votre Roadmap Lab</h2>
                  <p className="font-bold text-gray-600 uppercase tracking-tight text-sm">Le processus d'admission chez MakerLab</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  {[
                    { step: "01", title: "Evaluation", desc: "Test de curiosité et d'aptitude technologique." },
                    { step: "02", title: "Orientation", desc: "Choix de la station d'innovation prioritaire." },
                    { step: "03", title: "Incubation", desc: "Début du parcours annuel personnalisé." }
                  ].map((s, i) => (
                    <div key={i} className="bg-white border-4 border-black p-6 rounded-3xl shadow-neo-sm flex flex-col items-center text-center">
                       <span className="w-12 h-12 bg-brand-orange border-2 border-black rounded-xl flex items-center justify-center font-black mb-4 shadow-neo-sm">{s.step}</span>
                       <h4 className="font-black uppercase mb-1">{s.title}</h4>
                       <p className="text-[10px] font-bold text-gray-400 uppercase leading-tight">{s.desc}</p>
                    </div>
                  ))}
               </div>
            </div>
          ) : showPacks && (
            <div className="mb-12 bg-gray-50 border-4 border-black rounded-[40px] p-8 md:p-12 relative overflow-hidden shadow-neo-lg">
              <div className="absolute top-0 right-0 p-8 font-display font-black text-9xl text-black/5 select-none pointer-events-none uppercase">PACKS</div>
              
              <div className="text-center mb-12 relative z-10 px-4">
                <div className="inline-block bg-brand-orange text-black px-4 py-1 border-2 border-black font-black text-[10px] uppercase mb-4 animate-bounce">
                  ⏳ Offre exclusive : Valable 15 minutes
                </div>
                <h2 className="font-display font-black text-3xl md:text-5xl uppercase mb-3 leading-none">
                  {isSingleMission ? "Ne vous arrêtez pas là !" : "Choisissez Votre Formule"}
                </h2>
                <p className="font-bold text-gray-600 uppercase tracking-tight text-sm md:text-base">
                  {isSingleMission ? "Complétez l'expérience avec un pack avantageux" : "Fixez le tarif aujourd'hui et profitez de l'apprentissage continu"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {Object.entries(packs).map(([key, pack]) => {
                  const isSelected = selectedPack === key;
                  return (
                    <div 
                      key={key} 
                      onClick={() => handlePackChange(key as PackType)}
                      className={`cursor-pointer border-4 border-black p-8 rounded-3xl transition-all transform flex flex-col items-center text-center relative ${
                        isSelected 
                          ? 'bg-white shadow-neo-xl scale-105 -translate-y-4 border-brand-orange z-20' 
                          : 'bg-white/50 opacity-80 hover:opacity-100 hover:-translate-y-2'
                      }`}
                    >
                      {pack.featured && (
                          <div className="absolute -top-4 bg-brand-orange text-white px-6 py-2 border-4 border-black font-black text-xs uppercase tracking-widest shadow-neo-sm z-30">
                              Meilleure Offre
                          </div>
                      )}
                      {isSelected && (
                          <div className="absolute top-4 right-4 text-brand-orange">
                              <Sparkles size={24} className="animate-pulse" />
                          </div>
                      )}
                      <div className={`w-16 h-16 rounded-2xl border-4 border-black flex items-center justify-center mb-6 shadow-neo-sm ${pack.featured ? 'bg-brand-orange' : 'bg-gray-100'}`}>
                        {pack.icon}
                      </div>
                      <h3 className="font-black text-2xl uppercase mb-1 leading-tight">{pack.title}</h3>
                      <p className="text-xs font-black text-brand-orange uppercase mb-4 tracking-tighter">{pack.subtitle}</p>
                      
                      <div className="flex-grow flex flex-col justify-center mb-6">
                          <div className="font-black text-3xl leading-none">{pack.price}</div>
                          {pack.oldPrice && (
                              <div className="text-sm font-black text-gray-400 line-through mt-1 italic">{pack.oldPrice}</div>
                          )}
                      </div>

                      <div className={`w-full py-3 rounded-xl border-4 border-black font-black uppercase text-sm transition-all ${
                          isSelected ? 'bg-black text-white' : 'bg-brand-orange/10 text-black'
                      }`}>
                          {isSelected ? 'Sélectionné ✓' : 'Choisir'}
                      </div>
                      
                      {pack.savings && (
                          <div className="mt-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border-2 border-green-200">
                             Économisez {pack.savings}
                          </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-12 text-center relative z-10">
                  {syncing && <p className="text-[10px] font-black text-brand-orange mt-2 uppercase animate-pulse">Synchronisation...</p>}
              </div>
            </div>
          )}

          {/* ── 2. Final WhatsApp Action ── */}
          <div className="flex flex-col items-center gap-6 mb-20">
             <div className="text-center mb-4">
                <p className="font-black text-brand-orange uppercase text-sm mb-2">Dernière Étape : Validation</p>
                <h3 className="font-display font-black text-2xl md:text-3xl uppercase">Confirmez votre place via WhatsApp</h3>
             </div>
             
             <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full max-w-lg px-2 group"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-green-600 translate-x-2 translate-y-2 rounded-none border-4 border-black"></div>
                  <Button variant="accent" size="lg" className="relative w-full py-8 text-xl md:text-2xl group transform hover:-translate-y-1 transition-all border-4 border-black flex items-center justify-center gap-4 bg-brand-orange shadow-neo-sm">
                    <MessageCircle size={36} className="group-hover:rotate-12 transition-transform shrink-0" />
                    <span className="truncate">CONFIRMER POUR {childName.split(' ')[0].toUpperCase()}</span>
                  </Button>
                </div>
              </a>
              
              <div className="flex flex-col items-center gap-2">
                 <p className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-brand-green" /> Sans paiement immédiat
                 </p>
              </div>
          </div>

          {/* ── 3. Custom Video & Benefits Section ── */}
          {(config?.videoUrl || (config?.benefits && config.benefits.length > 0)) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
              {config?.videoUrl && (
                <div className="bg-white border-4 border-black rounded-[40px] overflow-hidden shadow-neo-lg aspect-video relative group">
                  <iframe
                    src={getVideoEmbedUrl(config.videoUrl)}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              
              {config?.benefits && config.benefits.length > 0 && (
                <div className="bg-blue-50 border-4 border-black p-8 rounded-[40px] shadow-neo">
                   <h3 className="font-display font-black text-2xl uppercase mb-6 flex items-center gap-3">
                     <Sparkles className="text-brand-orange" /> Ce qui l'attend au Lab
                   </h3>
                   <ul className="space-y-4">
                     {config.benefits.map((benefit, i) => (
                       <li key={i} className="flex items-start gap-3">
                         <div className="mt-1 bg-green-500 text-white rounded-full p-1 border-2 border-black">
                            <CheckCircle2 size={14} />
                         </div>
                         <span className="font-bold text-sm uppercase leading-tight">{benefit}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              )}
            </div>
          )}

          {/* ── 4. Trust Pillars Section ── */}
          {showTrustPillars && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              {[
                { icon: <ShieldCheck size={32} className="text-brand-green" />, title: "Satisfait ou Remboursé", desc: "Si votre enfant n'apprend rien, session remboursée" },
                { icon: <Award size={32} className="text-brand-blue" />, title: "Mentors Certifiés", desc: "Ingénieurs & Experts passionnés" },
                { icon: <ShieldAlert size={32} className="text-brand-red" />, title: "Sécurité Maximale", desc: "Environnement encadré et supervisé" },
              ].map((pillar, i) => (
                  <div key={i} className="bg-white border-4 border-black p-6 rounded-2xl shadow-neo-sm flex flex-col items-center text-center">
                      <div className="mb-4 bg-gray-50 p-4 rounded-full border-2 border-black/10">{pillar.icon}</div>
                      <h4 className="font-black text-sm uppercase mb-2 leading-none">{pillar.title}</h4>
                      <p className="text-[10px] font-bold text-gray-500 leading-tight uppercase">{pillar.desc}</p>
                  </div>
              ))}
            </div>
          )}

          {/* ── Partner Logo Bar ── */}
          <div className="mb-20 text-center">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Ils nous font confiance</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale contrast-125">
               {['Lycée Lyautey', 'American School', 'Technopark', 'Anatole France', 'Mermoz'].map((school, i) => (
                   <span key={i} className="font-display font-black text-xl md:text-2xl tracking-tighter uppercase italic">{school}</span>
               ))}
            </div>
          </div>

          {/* ── Retention / Roadmap ── */}
          <div className="border-t-4 border-black border-dashed pt-20">
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase text-center mb-16 leading-tight">
                Préparez {childName.split(' ')[0]} <br />
                <span className="text-brand-blue">Au futur technologique</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { icon: <Target className="text-brand-orange" />, title: "Parcours Maker", desc: "La suite" },
                    { icon: <Rocket className="text-brand-blue" />, title: "Le Lab", desc: "Visite" },
                    { icon: <Award className="text-brand-red" />, title: "Certificats", desc: "Mérite" },
                    { icon: <Star className="text-yellow-500" />, title: "Galerie", desc: "Projets" },
                ].map((item, i) => (
                    <Link key={i} to="/programs" className="group">
                        <div className="p-6 border-4 border-black bg-white hover:bg-black hover:text-white transition-all transform hover:-rotate-1 active:scale-95 h-full shadow-neo-sm hover:shadow-neo text-center flex flex-col items-center">
                            <div className="mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all bg-gray-50 p-3 rounded-xl border-2 border-black group-hover:bg-white/20 group-hover:border-white/20">{item.icon}</div>
                            <h4 className="font-black text-xs md:text-sm uppercase mb-1">{item.title}</h4>
                            <p className="text-[9px] font-bold opacity-60 uppercase">{item.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
          </div>

          {/* ── Final Footer ── */}
          <div className="mt-24 pt-12 border-t-2 border-black/5 text-center flex flex-col md:flex-row items-center justify-between gap-8">
            <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline decoration-2 underline-offset-4">
             ← Retour au site
            </Link>
            <div className="flex gap-4">
                <div className="w-10 h-10 bg-black text-white p-2 rounded-lg border-2 border-black">
                    <ShieldCheck size={20} />
                </div>
                <div className="text-left">
                    <p className="text-[10px] font-black uppercase">Paiement Sécurisé</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Au centre ou par lien CMI</p>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
