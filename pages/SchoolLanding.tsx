import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSchool } from '../contexts/SchoolContext';
import { Offer, SchoolPartner, Period, Workshop, Enrollment } from '../types';
import { Button } from '../components/Button';
import { Calendar, Users, Clock, ArrowRight, CheckCircle, Sparkles, X, Send } from 'lucide-react';

export const SchoolLanding: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getOfferBySlug, addEnrollment } = useSchool();
  
  const [data, setData] = useState<{
    offer: Offer;
    school: SchoolPartner;
    period: Period;
    activeWorkshops: Workshop[];
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    childName: '',
    childAge: '',
    parentName: '',
    parentEmail: '',
    parentPhone: ''
  });

  useEffect(() => {
    const fetchOffer = async () => {
      if (slug) {
        const result = await getOfferBySlug(slug);
        setData(result);
        if (result) {
          document.title = `${result.school.name} × MakerLab Academy | ${result.period.name}`;
        }
        setLoading(false);
      }
    };
    fetchOffer();
    
    return () => {
      document.title = 'MakerLab Academy';
    };
  }, [slug, getOfferBySlug]);

  const handleOpenEnrollment = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !selectedWorkshop) return;
    
    setIsSubmitting(true);
    try {
      const enrollment: Omit<Enrollment, 'id'> = {
        offerId: data.offer.id,
        workshopId: selectedWorkshop.id,
        ...formData,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      await addEnrollment(enrollment);
      setSubmitted(true);
      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setFormData({ childName: '', childAge: '', parentName: '', parentEmail: '', parentPhone: '' });
      }, 3000);
    } catch (err) {
      alert("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-8 border-brand-orange border-t-black rounded-full animate-spin"></div>
          <p className="font-display font-black text-2xl uppercase italic">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4 text-center">
        <div>
          <h1 className="font-display font-black text-4xl mb-4 uppercase">Oups ! Page Introuvable</h1>
          <p className="text-gray-600 font-bold mb-8">Cette offre n'est plus active ou le lien est incorrect.</p>
          <Link to="/">
            <Button variant="primary" className="shadow-neo">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { school, period, activeWorkshops, offer } = data;

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Branding */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-40 px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white border-2 border-black rounded-lg p-1 flex items-center justify-center">
               <img src={school.logo} alt={school.name} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="hidden md:block h-8 w-px bg-gray-200"></div>
            <h2 className="font-display font-black text-xl md:text-2xl uppercase tracking-tighter">
              {school.name} <span className="text-brand-orange">× MakerLab</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-brand-orange/10 px-4 py-2 rounded-full border-2 border-brand-orange/30">
            <Sparkles size={16} className="text-brand-orange" />
            <span className="text-[10px] md:text-xs font-black uppercase text-brand-orange whitespace-nowrap">Partenaire Officiel</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-brand-blue/5">
         <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Sparkles size={400} className="absolute -top-40 -left-40 text-brand-blue" />
         </div>
         
         <div className="container mx-auto px-6 text-center relative z-10">
            <div className="inline-block bg-black text-white px-6 py-2 rounded-full border-4 border-black font-black uppercase text-sm mb-6 shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
               Inscriptions Ouvertes : {period.name}
            </div>
            <h1 className="font-display font-black text-5xl md:text-7xl mb-8 uppercase tracking-tighter leading-none">
              Préparez vos enfants <br />
              <span className="text-brand-orange text-outline-black">au futur du numérique</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl font-bold text-gray-700 mb-12">
              Des ateliers innovants en Coding, Robotique et IA, organisés directement au sein de votre établissement scolaire.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <div className="flex items-center gap-2 bg-white border-4 border-black px-6 py-3 rounded-2xl font-black shadow-neo-sm">
                  <Calendar className="text-brand-blue" /> {new Date(period.startDate).toLocaleDateString('fr-FR', { month: 'long' })} → {new Date(period.endDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
               </div>
               <div className="flex items-center gap-2 bg-white border-4 border-black px-6 py-3 rounded-2xl font-black shadow-neo-sm">
                  <span className="text-brand-orange font-display">★</span> {activeWorkshops.length} Programmes au choix
               </div>
            </div>
         </div>
      </section>

      {/* Workshop Grid */}
      <section className="py-24 px-6 container mx-auto" id="workshops">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
             <h2 className="font-display font-black text-4xl md:text-5xl uppercase mb-4">Découvrez nos ateliers</h2>
             <p className="text-lg font-bold text-gray-500">Sélectionnez l'atelier qui passionnera votre enfant et réservez sa place dès maintenant.</p>
          </div>
          <div className="hidden md:flex gap-2">
             <div className="w-12 h-4 bg-brand-blue border-2 border-black"></div>
             <div className="w-12 h-4 bg-brand-orange border-2 border-black"></div>
             <div className="w-12 h-4 bg-brand-red border-2 border-black"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {activeWorkshops.map(workshop => (
            <div key={workshop.id} className="group bg-white border-4 border-black rounded-[2.5rem] overflow-hidden shadow-neo hover:shadow-neo-lg transition-all hover:-translate-y-2 flex flex-col">
              <div className="aspect-[4/3] overflow-hidden border-b-4 border-black relative">
                <img src={workshop.image} alt={workshop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                   {workshop.tags?.map(tag => (
                     <span key={tag} className="bg-white border-2 border-black px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-neo-sm">{tag}</span>
                   ))}
                </div>
                <div className="absolute bottom-4 right-4 bg-brand-blue text-white border-4 border-black px-4 py-1 rounded-xl font-black text-lg shadow-neo-sm">
                   {offer.customPrices[workshop.id] || 'Tarif École'}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-xs font-black uppercase mb-4 opacity-70">
                   <span className="flex items-center gap-1"><Users size={14} className="text-brand-orange" /> {workshop.ageRange}</span>
                   <span className="flex items-center gap-1"><Clock size={14} className="text-brand-blue" /> {workshop.duration}</span>
                </div>
                <h3 className="font-display font-black text-2xl uppercase mb-4 group-hover:text-brand-blue transition-colors leading-tight">{workshop.name}</h3>
                <p className="text-gray-500 font-bold mb-8 line-clamp-3 text-sm leading-relaxed">
                  {workshop.description}
                </p>
                <div className="mt-auto">
                   <Button onClick={() => handleOpenEnrollment(workshop)} variant="primary" className="w-full py-4 text-lg group/btn">
                     Pré-inscription <ArrowRight className="ml-2 group-hover/btn:translate-x-2 transition-transform" />
                   </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-black text-white py-20 px-6 mt-12 overflow-hidden relative">
         <div className="absolute top-0 right-0 opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2">
            <div className="w-[800px] h-[800px] border-[60px] border-brand-orange rounded-full"></div>
         </div>
         <div className="container mx-auto max-w-4xl text-center relative z-10">
            <h2 className="font-display font-black text-4xl md:text-6xl uppercase mb-8 leading-none">
              Rejoignez <span className="text-brand-orange italic">MakerLab Academy</span>
            </h2>
            <p className="text-xl font-bold mb-12 text-gray-400">
               Plus de 5000 enfants formés à travers le Maroc. Une expérience éducative fun et concrète pour devenir les créateurs de demain.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
               <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white border-4 border-brand-orange rounded-2xl flex items-center justify-center -rotate-6">
                     <span className="text-black font-black text-2xl">ML</span>
                  </div>
                  <div className="text-left">
                     <p className="font-black text-brand-orange uppercase text-sm tracking-widest">Questions ?</p>
                     <p className="font-bold text-white uppercase tracking-tighter">Contactez MakerLab au +212 600 000 000</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Enrollment Modal */}
      {showModal && selectedWorkshop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white border-4 border-black rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] relative animate-in fade-in zoom-in duration-300">
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10">
                <X size={24} className="text-black" />
              </button>

              <div className="flex flex-col md:flex-row">
                 <div className="md:w-1/3 bg-brand-blue p-8 text-white relative h-40 md:h-auto">
                    <div className="relative z-10">
                       <h3 className="font-display font-black text-2xl uppercase mb-2">Pré-inscription</h3>
                       <p className="text-sm font-bold opacity-80 uppercase leading-tight">{selectedWorkshop.name}</p>
                    </div>
                    <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none translate-x-4 translate-y-4">
                       <Sparkles size={160} />
                    </div>
                 </div>

                 <div className="md:w-2/3 p-8 lg:p-12">
                    {submitted ? (
                      <div className="flex flex-col items-center justify-center h-full text-center py-12">
                         <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 border-4 border-green-600 scale-110">
                            <CheckCircle size={40} />
                         </div>
                         <h4 className="font-display font-black text-2xl uppercase mb-2">C'est envoyé !</h4>
                         <p className="font-bold text-gray-500 uppercase tracking-tighter text-sm">Nous vous contacterons très prochainement pour confirmer l'inscription.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-[10px] font-black uppercase mb-1 opacity-50">Nom de l'enfant</label>
                               <input name="childName" value={formData.childName} onChange={handleInputChange} className="w-full p-3 border-2 border-black rounded-xl font-bold focus:bg-brand-blue/5 outline-none transition-all" required />
                            </div>
                            <div>
                               <label className="block text-[10px] font-black uppercase mb-1 opacity-50">Âge</label>
                               <input name="childAge" value={formData.childAge} onChange={handleInputChange} className="w-full p-3 border-2 border-black rounded-xl font-bold focus:bg-brand-blue/5 outline-none transition-all" required placeholder="ex: 10" />
                            </div>
                         </div>
                         <hr className="border-gray-100" />
                         <div>
                            <label className="block text-[10px] font-black uppercase mb-1 opacity-50">Nom du parent</label>
                            <input name="parentName" value={formData.parentName} onChange={handleInputChange} className="w-full p-3 border-2 border-black rounded-xl font-bold focus:bg-brand-blue/5 outline-none transition-all" required />
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                               <label className="block text-[10px] font-black uppercase mb-1 opacity-50">Email</label>
                               <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleInputChange} className="w-full p-3 border-2 border-black rounded-xl font-bold focus:bg-brand-blue/5 outline-none transition-all" required />
                            </div>
                            <div>
                               <label className="block text-[10px] font-black uppercase mb-1 opacity-50">Téléphone</label>
                               <input name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} className="w-full p-3 border-2 border-black rounded-xl font-bold focus:bg-brand-blue/5 outline-none transition-all" required />
                            </div>
                         </div>
                         <Button type="submit" loading={isSubmitting} className="w-full py-4 bg-brand-blue text-white shadow-neo border-2 border-black mt-4 uppercase">
                            Envoyer ma demande <Send size={18} className="ml-2" />
                         </Button>
                         <p className="text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest mt-4 italic">
                            Les informations seront transmises à MakerLab Academy.
                         </p>
                      </form>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
