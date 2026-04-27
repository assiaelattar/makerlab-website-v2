import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { SEO } from '../components/SEO';
import { 
  Check, 
  Star, 
  Rocket, 
  Clock, 
  Users, 
  Wrench, 
  ShieldCheck, 
  ArrowRight, 
  MessageCircle, 
  Zap,
  Calendar,
  ChevronRight,
  Smile,
  Heart,
  CheckCircle2,
  Upload,
  Loader2,
  Copy
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const STEMQuestEnrollment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: enrollmentId } = useParams();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [programSettings, setProgramSettings] = useState<any>(null);

  const [formData, setFormData] = useState({
    parentName: searchParams.get('parent') || '',
    parentPhone: searchParams.get('phone') || '',
    childName: searchParams.get('kid') || '',
    childAgeGroup: '' as string,
    selectedPack: '' as 'Explorer' | 'Innovator' | '',
    paymentFrequency: 'annuel' as 'annuel' | 'trimestriel',
    selectedSlots: [] as string[],
    feedback: '',
    achievementImages: [] as string[],
    paymentMethod: 'virement' as 'virement' | 'place',
    paymentProof: '',
    visitDate: '',
    status: 'pending'
  });

  // Force scroll to top on mount AND on every step change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [step]);

  // Fetch Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'stemquest');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProgramSettings(docSnap.data());
        } else {
          // Fallback to defaults if no settings found
          setProgramSettings({
            ageGroups: ['Tiny Makers (7-9 ans)', 'Mini Makers (10-12 ans)', 'Champions (13+ ans)'],
            prices: {
              Explorer: { annuel: 6000, trimestriel: 2300 },
              Innovator: { annuel: 7500, trimestriel: 2700 }
            },
            schedules: {
              'Tiny Makers (7-9 ans)': [{ day: 'Lundi', time: '17h30 - 19h00' }],
              'Mini Makers (10-12 ans)': [{ day: 'Mardi', time: '17h30 - 19h00' }],
              'Champions (13+ ans)': [{ day: 'Samedi', time: '10h00 - 11h30' }]
            }
          });
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Local Storage persistence
  useEffect(() => {
    const saved = localStorage.getItem(`enrollment_${enrollmentId || 'new'}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(prev => ({ ...prev, ...parsed.formData }));
      setStep(parsed.step);
    }
  }, [enrollmentId]);

  useEffect(() => {
    localStorage.setItem(`enrollment_${enrollmentId || 'new'}`, JSON.stringify({ formData, step }));
  }, [formData, step, enrollmentId]);

  // Fetch personalized data if ID is provided
  useEffect(() => {
    const fetchTrialData = async () => {
      if (enrollmentId) {
        const docRef = doc(db, 'trial_conversions', enrollmentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData(prev => ({
            ...prev,
            parentName: data.parentName || prev.parentName,
            parentPhone: data.parentPhone || prev.parentPhone,
            childName: data.childName || prev.childName,
            childAgeGroup: data.childAgeGroup || prev.childAgeGroup,
            achievementImages: data.achievementImages || []
          }));
          setIsPersonalized(true);
          // Only auto-advance if we're at step 1
          setStep(prev => prev === 1 ? 2 : prev);
        }
      } else if (formData.parentName && formData.childName) {
        setIsPersonalized(true);
        setStep(prev => prev === 1 ? 2 : prev);
      }
    };
    fetchTrialData();
  }, [enrollmentId]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, selectedSlots: [] }));
  }, [formData.childAgeGroup, formData.selectedPack]);

  const handlePackSelect = (pack: 'Explorer' | 'Innovator') => {
    setFormData(prev => ({ ...prev, selectedPack: pack }));
    setStep(3);
  };

  const getPrice = () => {
    if (!programSettings) return 0;
    const pack = formData.selectedPack;
    if (!pack) return 0;
    const freq = formData.paymentFrequency;
    return programSettings.prices[pack][freq];
  };

  const sendWhatsApp = (method: 'virement' | 'place') => {
    const price = getPrice();
    const frequency = formData.paymentFrequency === 'annuel' ? 'Paiement Annuel' : 'Paiement Trimestriel';
    const slotsText = formData.selectedSlots.join(' et ');
    const text = `Bonjour MakerLab ! 👋

Je souhaite confirmer l'inscription pour STEMQuest :

🚀 *Détails de l'inscription* :
- Parent : ${formData.parentName}
- Enfant : ${formData.childName}
- Pack : ${formData.selectedPack} (${frequency})
- Horaires : ${slotsText}
- Méthode : ${method === 'virement' ? 'Virement Bancaire' : 'Paiement sur Place'}
- Total : ${price} DHS

📅 *RDV Visite* : ${formData.visitDate || 'À confirmer'}

${method === 'virement' ? 'Je vous envoie la preuve de virement ci-joint.' : 'Je passerai vous voir pour finaliser.'}`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/212621877106?text=${encoded}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'website-bookings'), {
        ...formData,
        amount: getPrice(),
        programTitle: 'STEMQuest',
        bookingType: 'enrollment',
        isConversion: !!enrollmentId,
        trialId: enrollmentId || null,
        createdAt: serverTimestamp(),
      });
      
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2D1B8C', '#E87722', '#27A060', '#C0272D']
      });

      // Clear local storage on success
      localStorage.removeItem(`enrollment_${enrollmentId || 'new'}`);

      setTimeout(() => {
        navigate('/merci');
      }, 2000);
    } catch (error) {
      console.error('Error submitting enrollment:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !programSettings) return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[#2D1B8C]" size={48} />
      <p className="font-black uppercase text-sm tracking-widest text-gray-400">Initialisation de l'aventure...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <SEO 
        title={formData.childName ? `🚀 ${formData.childName}, ta place à MakerLab t'attend !` : "Inscription STEMQuest — MakerLab Academy"}
        description={formData.childName ? `Prêt pour l'aventure STEMQuest ? Confirmez l'inscription de ${formData.childName} pour rejoindre nos futurs Makers.` : "Confirmez l'inscription de votre enfant au programme STEMQuest."}
        image="/logo-full.png"
      />

      {/* Hero Header — compact on mobile */}
      <header className="bg-[#2D1B8C] text-white pt-6 pb-16 md:pt-16 md:pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-4 left-4 w-12 h-12 md:w-32 md:h-32 rounded-full border-4 md:border-8 border-white animate-pulse" />
          <div className="absolute bottom-4 right-4 w-24 h-24 md:w-64 md:h-64 rounded-full border-4 md:border-8 border-white animate-float" />
        </div>

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#2D1B8C] px-3 py-1 md:px-4 md:py-2 rounded-full font-black text-[9px] md:text-sm uppercase tracking-wider mb-2 md:mb-6 shadow-lg">
            <Star size={10} fill="currentColor" className="md:w-[18px] md:h-[18px]" />
            Merci pour votre visite !
            <Star size={10} fill="currentColor" className="md:w-[18px] md:h-[18px]" />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-6xl font-black uppercase leading-tight mb-2 md:mb-6">
            {isPersonalized ? (
              <>Bonjour {formData.parentName.split(' ')[0]} ! <br className="hidden md:block" /> <span className="text-yellow-400">{formData.childName} est un futur Maker !</span></>
            ) : (
              <>Prêt à transformer <br className="hidden md:block" /> <span className="text-yellow-400">votre enfant en Maker ?</span></>
            )}
          </h1>
          <p className="text-sm md:text-2xl text-purple-100 font-medium max-w-2xl mx-auto leading-relaxed px-2 hidden md:block">
            {isPersonalized ? (
              <>Nous avons adoré voir l'énergie et la créativité de {formData.childName} lors de son atelier d'essai ! 🚀</>
            ) : (
              <>L'énergie et la créativité de votre enfant nous ont impressionnés ! 🚀</>
            )}
          </p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto max-w-4xl -mt-8 md:-mt-12 px-4 relative z-20">
        <div className="bg-white p-2.5 md:p-4 rounded-2xl md:rounded-3xl border-2 md:border-4 border-black shadow-neo flex items-center justify-between">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="flex items-center gap-1 md:gap-2 flex-1 last:flex-none">
              <div className={`w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl border-2 flex items-center justify-center font-black transition-all text-xs md:text-base ${
                step >= s ? 'bg-[#2D1B8C] border-black text-white shadow-neo-sm scale-110' : 'bg-gray-100 border-gray-200 text-gray-400'
              }`}>
                {step > s ? <Check size={14} className="md:w-4 md:h-4" /> : s}
              </div>
              {s < 6 && <div className={`h-1 flex-1 rounded-full ${step > s ? 'bg-[#2D1B8C]' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      {isPersonalized && formData.achievementImages.length > 0 && (
        <section className="container mx-auto max-w-4xl py-12 px-4">
          <div className="bg-white border-4 border-black rounded-[40px] p-8 shadow-neo overflow-hidden relative">
            <div className="absolute top-4 right-4 -rotate-12 bg-pink-500 text-white px-4 py-1 font-black uppercase text-xs shadow-neo-sm">
              Souvenir d'Atelier
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase mb-6 flex items-center gap-3">
              <Smile className="text-yellow-500" /> Quel Talent, {formData.childName} !
            </h2>
            <p className="text-gray-600 font-bold mb-8 italic text-sm md:text-base">
              "Regardez ce que {formData.childName} a déjà commencé à explorer..."
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {formData.achievementImages.map((img, i) => (
                <div key={i} className="aspect-square border-2 md:border-4 border-black rounded-xl md:rounded-2xl overflow-hidden shadow-neo-sm transform transition-all hover:rotate-2 hover:scale-105">
                  <img src={img} className="w-full h-full object-cover" alt="Achievement" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <main className="container mx-auto max-w-4xl py-8 md:py-12 px-4">
        
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-white border-2 md:border-4 border-black rounded-[30px] md:rounded-[40px] p-6 md:p-12 shadow-neo">
              <h2 className="text-xl md:text-3xl font-black uppercase mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-neo-sm text-lg md:text-xl">1</div>
                Commençons l'aventure !
              </h2>
              <p className="text-gray-500 font-bold mb-8 italic -mt-6">
                Pour bien commencer, nous avons besoin de connaître votre futur Maker.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
                <div className="space-y-2">
                  <label className="font-black uppercase text-[10px] md:text-sm tracking-widest text-gray-400 md:text-gray-500 ml-2">Nom du Parent</label>
                  <input 
                    type="text" 
                    placeholder="Votre nom complet"
                    className="w-full p-4 md:p-5 bg-gray-50 border-4 border-black rounded-2xl font-bold text-base md:text-lg focus:ring-4 ring-purple-200 transition-all outline-none"
                    value={formData.parentName}
                    onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-black uppercase text-[10px] md:text-sm tracking-widest text-gray-400 md:text-gray-500 ml-2">Téléphone (WhatsApp)</label>
                  <input 
                    type="tel" 
                    placeholder="06 XX XX XX XX"
                    className="w-full p-4 md:p-5 bg-gray-50 border-4 border-black rounded-2xl font-bold text-base md:text-lg focus:ring-4 ring-purple-200 transition-all outline-none"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-black uppercase text-[10px] md:text-sm tracking-widest text-gray-400 md:text-gray-500 ml-2">Nom de l'enfant</label>
                  <input 
                    type="text" 
                    placeholder="Prénom de l'enfant"
                    className="w-full p-4 md:p-5 bg-gray-50 border-4 border-black rounded-2xl font-bold text-base md:text-lg focus:ring-4 ring-purple-200 transition-all outline-none"
                    value={formData.childName}
                    onChange={(e) => setFormData({...formData, childName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-black uppercase text-[10px] md:text-sm tracking-widest text-gray-400 md:text-gray-500 ml-2">Groupe d'âge</label>
                  <div className="relative">
                    <select 
                      className="w-full p-4 md:p-5 bg-gray-50 border-4 border-black rounded-2xl font-bold text-base md:text-lg focus:ring-4 ring-purple-200 transition-all outline-none appearance-none cursor-pointer"
                      value={formData.childAgeGroup}
                      onChange={(e) => setFormData({...formData, childAgeGroup: e.target.value})}
                    >
                      <option value="">Sélectionnez l'âge</option>
                      {programSettings?.ageGroups.map((group: string) => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                    <ChevronRight size={24} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-gray-400" />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => formData.parentName && formData.parentPhone && formData.childName && formData.childAgeGroup && setStep(2)}
                disabled={!formData.parentName || !formData.parentPhone || !formData.childName || !formData.childAgeGroup}
                className="w-full py-5 md:py-6 bg-[#E87722] text-white font-black text-lg md:text-xl uppercase rounded-2xl md:rounded-3xl border-2 md:border-4 border-black shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                Continuer vers les packs <ArrowRight size={20} className="md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Creative Comparison (No Price) */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-center mb-8 md:mb-12">Quelle sera sa mission ?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white border-4 border-black rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-neo group hover:-translate-y-2 transition-all">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 border-2 border-green-600">
                  <Rocket size={24} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase mb-4 text-[#2D1B8C]">Pack Standard (Explorer)</h3>
                <p className="font-bold text-gray-500 mb-6 italic leading-relaxed text-sm md:text-base">
                  "L'essentiel pour découvrir. Un rendez-vous hebdomadaire pour explorer le monde de la tech."
                </p>
                <ul className="space-y-3 mb-10 font-bold text-sm md:text-base">
                  <li className="flex items-center gap-2"><Check size={18} className="text-green-500" /> 1 atelier par semaine (1h30)</li>
                  <li className="flex items-center gap-2"><Check size={18} className="text-green-500" /> Accès à toutes les stations</li>
                  <li className="flex items-center gap-2"><Check size={18} className="text-green-500" /> Matériel inclus</li>
                </ul>
                <button 
                  onClick={() => handlePackSelect('Explorer')}
                  className="w-full py-4 md:py-5 bg-white border-4 border-black font-black uppercase rounded-2xl hover:bg-black hover:text-white transition-all shadow-neo-sm text-sm md:text-base"
                >
                  Choisir Explorer
                </button>
              </div>

              <div className="bg-[#2D1B8C] text-white border-4 border-black rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-neo group hover:-translate-y-2 transition-all relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-yellow-400 text-black px-4 py-1 font-black uppercase text-[10px] -rotate-12">Plus Populaire</div>
                <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-400 text-[#2D1B8C] rounded-2xl flex items-center justify-center mb-6 border-2 border-white">
                  <Star size={24} className="md:w-8 md:h-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase mb-4 text-yellow-400">Pack Innovator (Intensif)</h3>
                <p className="font-bold text-purple-100 mb-6 italic leading-relaxed text-sm md:text-base">
                  "Pour les vrais passionnés. Deux ateliers par semaine pour aller plus loin et créer ses propres projets."
                </p>
                <ul className="space-y-3 mb-10 font-bold text-sm md:text-base">
                  <li className="flex items-center gap-2"><Check size={18} className="text-yellow-400" /> 2 ateliers par semaine (2 x 1h30)</li>
                  <li className="flex items-center gap-2"><Check size={18} className="text-yellow-400" /> Priorité sur le matériel</li>
                  <li className="flex items-center gap-2"><Check size={18} className="text-yellow-400" /> Sessions DIY incluses</li>
                </ul>
                <button 
                  onClick={() => handlePackSelect('Innovator')}
                  className="w-full py-4 md:py-5 bg-yellow-400 text-black border-4 border-black font-black uppercase rounded-2xl hover:shadow-none transition-all shadow-neo text-sm md:text-base"
                >
                  Choisir Innovator
                </button>
              </div>
            </div>
            {!isPersonalized && (
              <button onClick={() => setStep(1)} className="mt-12 mx-auto flex items-center gap-2 font-black uppercase text-gray-400 hover:text-black transition-colors">← Retour aux infos</button>
            )}
          </div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-3xl font-black uppercase text-center mb-2">On se retrouve quand ?</h2>
            <p className="text-center text-gray-500 font-bold mb-8 italic">
              {formData.selectedPack === 'Innovator' 
                ? "Choisissez vos 2 créneaux hebdomadaires (Pack Innovator)" 
                : "Choisissez votre créneau hebdomadaire (Pack Standard)"}
            </p>
            
            {/* Age Group Selector if not already set */}
            {!isPersonalized && !formData.childAgeGroup && (
               <div className="mb-8 md:mb-12 flex flex-wrap justify-center gap-3 md:gap-6">
                  {programSettings?.ageGroups.map((group: string) => (
                    <button 
                     key={group}
                     onClick={() => setFormData({...formData, childAgeGroup: group, selectedSlots: []})}
                     className={`px-4 md:px-8 py-3 md:py-4 border-4 border-black rounded-2xl md:rounded-[2rem] font-black uppercase text-[10px] md:text-sm transition-all shadow-neo hover:-translate-y-1 ${formData.childAgeGroup === group ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                    >
                      {group}
                    </button>
                  ))}
               </div>
            )}

            {formData.childAgeGroup ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                  {programSettings.schedules[formData.childAgeGroup]?.map((slot: any, i: number) => {
                    const slotValue = `${slot.day} ${slot.time}`;
                    const isSelected = formData.selectedSlots.includes(slotValue);
                    
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (formData.selectedPack === 'Innovator') {
                            if (isSelected) {
                              setFormData({
                                ...formData, 
                                selectedSlots: formData.selectedSlots.filter(s => s !== slotValue)
                              });
                            } else if (formData.selectedSlots.length < 2) {
                              setFormData({
                                ...formData, 
                                selectedSlots: [...formData.selectedSlots, slotValue]
                              });
                            }
                          } else {
                            setFormData({...formData, selectedSlots: [slotValue]});
                            setStep(4);
                          }
                        }}
                        className={`p-6 md:p-8 border-4 border-black rounded-[24px] md:rounded-[2.5rem] text-left shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all group relative overflow-hidden ${isSelected ? 'bg-[#2D1B8C] text-white' : 'bg-white text-black'}`}
                      >
                        <div className="relative z-10">
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-4 border-2 border-black/5 transition-colors ${isSelected ? 'bg-white text-[#2D1B8C]' : 'bg-indigo-50 text-[#2D1B8C] group-hover:bg-[#2D1B8C] group-hover:text-white'}`}>
                            <Clock size={18} className="md:w-5 md:h-5" />
                          </div>
                          <div className="font-black text-xl md:text-2xl mb-1 uppercase tracking-tight">{slot.day}</div>
                          <div className={`font-bold text-base md:text-lg ${isSelected ? 'text-purple-200' : 'text-gray-500'}`}>{slot.time}</div>
                          <div className={`mt-6 md:mt-8 flex items-center justify-between transition-all ${isSelected ? 'text-yellow-400 opacity-100' : 'text-[#2D1B8C] md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0'}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {isSelected ? 'Créneau Sélectionné' : 'Choisir ce créneau'}
                            </span> 
                            {isSelected ? <Check size={16} /> : <ArrowRight size={16} className="md:w-5 md:h-5" />}
                          </div>
                        </div>
                        <div className={`absolute -right-4 -bottom-4 w-20 h-20 md:w-24 md:h-24 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 ${isSelected ? 'bg-white/10' : 'bg-gray-50'}`} />
                      </button>
                    );
                  })}
                </div>
                
                {formData.selectedPack === 'Innovator' && (
                  <div className="mt-12 flex flex-col items-center gap-6">
                    <div className="bg-white border-2 border-black/5 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-4">
                      <span className={formData.selectedSlots.length === 2 ? 'text-green-500' : 'text-orange-500'}>
                        {formData.selectedSlots.length} / 2 créneaux choisis
                      </span>
                      {formData.selectedSlots.length === 2 && <CheckCircle2 className="text-green-500" size={20} />}
                    </div>
                    
                    <button 
                      onClick={() => setStep(4)}
                      disabled={formData.selectedSlots.length < 2}
                      className="w-full max-w-md py-6 bg-[#2D1B8C] text-white font-black text-xl uppercase rounded-3xl border-4 border-black shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      Continuer <ArrowRight size={24} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 md:py-24 bg-white border-4 md:border-8 border-black border-dashed rounded-3xl md:rounded-[3rem] animate-pulse">
                 <p className="font-black uppercase text-gray-300 text-sm md:text-xl tracking-tighter px-4">Sélectionnez un groupe d'âge ci-dessus</p>
              </div>
            )}
            <button onClick={() => setStep(2)} className="mt-12 mx-auto flex items-center gap-2 font-black uppercase text-gray-400 hover:text-black transition-colors">← Retour aux packs</button>
          </div>
        )}

        {/* Step 4: Price & Review */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
             <div className="bg-white border-4 border-black rounded-[40px] p-8 md:p-12 shadow-neo">
                <h2 className="text-3xl font-black uppercase mb-12 text-center">Récapitulatif & Tarif</h2>
                
                {/* Frequency Toggle */}
                <div className="flex bg-gray-100 p-2 rounded-2xl border-2 border-black mb-12 max-w-sm mx-auto">
                   <button 
                    onClick={() => setFormData({...formData, paymentFrequency: 'annuel'})}
                    className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${formData.paymentFrequency === 'annuel' ? 'bg-[#2D1B8C] text-white shadow-neo-sm' : 'text-gray-400'}`}
                   >
                     Annuel
                   </button>
                   <button 
                    onClick={() => setFormData({...formData, paymentFrequency: 'trimestriel'})}
                    className={`flex-1 py-3 rounded-xl font-black uppercase text-xs transition-all ${formData.paymentFrequency === 'trimestriel' ? 'bg-[#2D1B8C] text-white shadow-neo-sm' : 'text-gray-400'}`}
                   >
                     Trimestriel
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    <div className="space-y-4 md:space-y-6">
                       <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-black/5">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center border-2 border-black text-[#2D1B8C] shrink-0 shadow-neo-sm"><Users size={20} className="md:w-6 md:h-6" /></div>
                          <div>
                             <p className="text-[10px] font-black uppercase text-gray-400">Maker</p>
                             <p className="font-bold text-sm md:text-base">{formData.childName}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border-2 border-black/5">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl flex items-center justify-center border-2 border-black text-[#2D1B8C] shrink-0 shadow-neo-sm"><Calendar size={20} className="md:w-6 md:h-6" /></div>
                          <div>
                             <p className="text-[10px] font-black uppercase text-gray-400">{formData.selectedSlots.length > 1 ? 'Horaires choisis' : 'Horaire choisi'}</p>
                             <p className="font-bold text-sm md:text-base">{formData.selectedSlots.join(' + ')}</p>
                          </div>
                       </div>
                       <div className="p-5 bg-[#2D1B8C] text-white border-4 border-black rounded-3xl shadow-neo-sm relative overflow-hidden group">
                          <p className="text-[10px] font-black uppercase text-purple-200 mb-1 relative z-10">Formule choisie</p>
                          <p className="font-black uppercase text-lg md:text-xl text-yellow-400 relative z-10">{formData.selectedPack} <span className="text-white text-xs opacity-50 block md:inline md:ml-2">({formData.paymentFrequency})</span></p>
                          <Rocket size={60} className="absolute -right-4 -bottom-4 text-white/5 -rotate-12 group-hover:scale-110 transition-transform" />
                       </div>
                    </div>

                   <div className="bg-[#2D1B8C] text-white p-6 md:p-10 rounded-[40px] border-4 border-black shadow-neo text-center relative overflow-hidden group">
                      <div className="relative z-10">
                        <p className="font-black uppercase text-[10px] tracking-widest mb-4 opacity-60 bg-white/10 py-1 px-3 rounded-full inline-block">
                          Investissement {formData.paymentFrequency}
                        </p>
                        
                        {/* Tiny Pricing Logic */}
                        <div className="flex flex-col items-center justify-center mb-6">
                           <div className="flex items-baseline gap-1">
                              <span className="text-sm font-black uppercase opacity-40">À partir de</span>
                              <span className="text-7xl md:text-8xl font-black text-yellow-400 leading-none tracking-tighter">
                                {formData.paymentFrequency === 'annuel' ? Math.round(getPrice() / 10) : Math.round(getPrice() / 3)}
                              </span>
                              <div className="flex flex-col items-start leading-none">
                                 <span className="text-xl font-black text-yellow-400">DHS</span>
                                 <span className="text-[10px] font-bold text-purple-200 uppercase tracking-tighter">/ mois</span>
                              </div>
                           </div>
                           
                           <div className="mt-4 flex flex-col items-center gap-1">
                              <div className="px-4 py-1.5 bg-black/30 rounded-full border border-white/10 backdrop-blur-sm">
                                <p className="text-xs font-bold text-purple-100 italic">
                                   Soit <span className="text-white font-black">~{Math.round(getPrice() / ((formData.paymentFrequency === 'annuel' ? 40 : 12) * (formData.selectedPack === 'Innovator' ? 2 : 1)))} DHS</span> par atelier
                                </p>
                              </div>
                              <p className="text-[10px] font-black uppercase text-yellow-400 mt-2 tracking-widest">
                                ✨ Moins cher qu'un cours de soutien !
                              </p>
                              <p className="text-[10px] font-black uppercase text-purple-300 mt-1">
                                Total : {getPrice()} DHS à régler {formData.paymentFrequency === 'annuel' ? 'en une fois' : 'par trimestre'}
                              </p>
                           </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 py-3 border-t border-white/10">
                           <ShieldCheck size={14} className="text-yellow-400" />
                           <p className="text-[10px] font-bold text-purple-100 uppercase tracking-widest">Inscriptions 2024 Ouvertes</p>
                        </div>
                      </div>
                      <Zap size={160} className="absolute -right-12 -bottom-12 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
                   </div>
                </div>

                {/* Policies Mention */}
                <div className="mt-12 bg-yellow-50 border-2 border-yellow-200 p-6 rounded-3xl space-y-3">
                   <p className="font-black uppercase text-[10px] text-yellow-600 mb-2">Note Importante</p>
                   <ul className="text-xs font-bold text-yellow-800 space-y-2">
                      <li className="flex gap-2"><span>🛡️</span> L'assurance de votre enfant est incluse dans l'abonnement.</li>
                      <li className="flex gap-2"><span>📅</span> L'abonnement démarre le jour du 1er atelier jusqu'à la même date l'année suivante.</li>
                      <li className="flex gap-2"><span>🏖️</span> Hors vacances d'été et jours fériés.</li>
                   </ul>
                </div>

                <div className="mt-8">
                   <label className="font-black uppercase text-sm tracking-widest text-gray-500 ml-2 mb-4 block">Feedback (Optionnel)</label>
                   <textarea 
                      placeholder="Un mot sur votre atelier d'essai ?"
                      className="w-full p-4 bg-gray-50 border-4 border-black rounded-2xl font-bold"
                      value={formData.feedback}
                      onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                   />
                </div>

                <button 
                  onClick={() => setStep(5)}
                  className="w-full mt-8 py-6 bg-brand-orange text-white font-black text-xl uppercase rounded-3xl border-4 border-black shadow-neo flex items-center justify-center gap-3 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  Procéder au paiement <ArrowRight size={24} />
                </button>
             </div>
             <button onClick={() => setStep(3)} className="mt-8 mx-auto flex items-center gap-2 font-black uppercase text-gray-400 hover:text-black transition-colors">← Retour à l'horaire</button>
          </div>
        )}

        {/* Step 5: Payment Method Choice */}
        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-2xl mx-auto">
            <div className="bg-white border-2 md:border-4 border-black rounded-[30px] md:rounded-[40px] p-6 md:p-12 shadow-neo text-center">
              <h2 className="text-xl md:text-3xl font-black uppercase mb-4">Mode de Paiement</h2>
              <p className="text-gray-500 font-bold mb-8 text-sm md:text-base px-2">
                Choisissez comment vous souhaitez régler l'inscription de {formData.childName}.
              </p>

              <div className="grid grid-cols-1 gap-4 md:gap-6 text-left">
                <button
                  onClick={() => { setFormData({ ...formData, paymentMethod: 'virement' }); setStep(6); }}
                  className="p-5 md:p-10 border-2 md:border-4 border-black rounded-[24px] md:rounded-[40px] shadow-neo-sm hover:shadow-neo hover:-translate-y-1 transition-all flex items-center gap-4 md:gap-8 group relative overflow-hidden"
                >
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-blue-50 text-[#2D1B8C] rounded-xl md:rounded-3xl flex items-center justify-center shrink-0 border-2 border-[#2D1B8C] group-hover:bg-[#2D1B8C] group-hover:text-white transition-colors">
                    <Upload size={24} className="md:w-8 md:h-8" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-black text-base md:text-2xl uppercase">Virement Bancaire</h3>
                    <p className="text-[10px] md:text-sm text-gray-500 font-bold">Sécurisé et rapide via capture d'écran.</p>
                  </div>
                  <ArrowRight size={20} className="ml-auto text-gray-300 md:group-hover:translate-x-2 transition-transform" />
                </button>

                <button
                  onClick={() => { setFormData({ ...formData, paymentMethod: 'place' }); setStep(6); }}
                  className="p-5 md:p-10 border-2 md:border-4 border-black rounded-[24px] md:rounded-[40px] shadow-neo-sm hover:shadow-neo hover:-translate-y-1 transition-all flex items-center gap-4 md:gap-8 group relative overflow-hidden"
                >
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-yellow-50 text-[#E87722] rounded-xl md:rounded-3xl flex items-center justify-center shrink-0 border-2 border-[#E87722] group-hover:bg-[#E87722] group-hover:text-white transition-colors">
                    <Calendar size={24} className="md:w-8 md:h-8" />
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-black text-base md:text-2xl uppercase">Paiement sur Place</h3>
                    <p className="text-[10px] md:text-sm text-gray-500 font-bold">Prenez rendez-vous pour nous rendre visite.</p>
                  </div>
                  <ArrowRight size={20} className="ml-auto text-gray-300 md:group-hover:translate-x-2 transition-transform" />
                </button>
              </div>

              <button onClick={() => setStep(4)} className="mt-8 md:mt-12 flex items-center justify-center gap-2 font-black uppercase text-gray-400 hover:text-black transition-colors text-xs md:text-sm mx-auto">← Retour au récapitulatif</button>
            </div>
          </div>
        )}

        {/* Step 6: Final Details (Method Execution) */}
        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 max-w-2xl mx-auto">
             {formData.paymentMethod === 'virement' ? (
               <div className="space-y-6 md:space-y-8">
                  <div className="bg-[#2D1B8C] text-white p-6 md:p-12 rounded-[30px] md:rounded-[40px] border-2 md:border-4 border-black shadow-neo relative overflow-hidden">
                    <div className="relative z-10">
                      <h2 className="text-xl md:text-3xl font-black uppercase mb-6 md:mb-8 border-b-2 border-white/20 pb-4 flex items-center gap-3 md:gap-4">
                        <Upload size={24} className="md:w-8 md:h-8" /> Virement Bancaire
                      </h2>
                      <div className="space-y-6 md:space-y-8">
                        <div className="bg-black/20 p-5 md:p-8 rounded-2xl md:rounded-3xl border-2 border-white/10 relative group">
                            <p className="text-[10px] font-black uppercase opacity-50 mb-2 tracking-widest">RIB (CIH BANK)</p>
                            <p className="font-mono font-bold text-base md:text-2xl leading-tight break-all mb-6 tracking-tight">230 780 2825423211002900 15</p>
                            <button 
                              onClick={() => { navigator.clipboard.writeText('230780282542321100290015'); alert('RIB Copié !'); }}
                              className="w-full py-4 bg-white text-[#2D1B8C] rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs flex items-center justify-center gap-3 hover:bg-yellow-400 transition-colors shadow-neo-sm"
                            >
                              <Copy size={16} /> Copier le RIB
                            </button>
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                            <div>
                                <p className="text-[9px] font-black uppercase opacity-50 mb-1">Bénéficiaire</p>
                                <p className="font-black text-sm md:text-lg uppercase">Makerlab Academy</p>
                            </div>
                            <ShieldCheck size={24} className="text-yellow-400 opacity-50" />
                        </div>
                      </div>
                    </div>
                    <ShieldCheck size={120} className="absolute -right-10 -bottom-10 text-white/5 rotate-12 md:w-48 md:h-48" />
                  </div>

                  <div className="bg-white border-2 md:border-4 border-black rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-neo">
                    <label className="font-black uppercase text-[10px] md:text-sm tracking-widest text-gray-400 md:text-gray-500 mb-4 block text-center">Preuve de virement (Capture)</label>
                    <label className="flex flex-col items-center justify-center p-8 md:p-12 border-2 md:border-4 border-black border-dashed rounded-2xl md:rounded-3xl cursor-pointer hover:bg-gray-50 transition-all relative overflow-hidden group">
                       {formData.paymentProof ? (
                         <div className="text-center">
                            <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4 md:w-16 md:h-16" />
                            <p className="font-black uppercase text-[10px] md:text-sm text-green-500 tracking-widest">Capture uploadée avec succès !</p>
                         </div>
                       ) : (
                         <>
                            {loading ? (
                              <Loader2 size={32} className="animate-spin text-[#2D1B8C] md:w-12 md:h-12" />
                            ) : (
                              <Upload size={32} className="text-gray-300 group-hover:text-[#2D1B8C] transition-colors md:w-12 md:h-12" />
                            )}
                            <span className="mt-4 text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400 text-center">Cliquez pour importer le reçu</span>
                         </>
                       )}
                       <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setLoading(true);
                          try {
                            const refProof = ref(storage, `payment_proofs/${Date.now()}_${file.name}`);
                            await uploadBytes(refProof, file);
                            const url = await getDownloadURL(refProof);
                            setFormData(prev => ({ ...prev, paymentProof: url }));
                          } catch (err) {
                            console.error(err);
                            alert("Erreur upload proof");
                          } finally {
                            setLoading(false);
                          }
                       }} />
                    </label>
                    <p className="mt-4 text-[8px] md:text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Une fois le reçu importé, cliquez sur finaliser ci-dessous.</p>
                  </div>
               </div>
             ) : (
                    <div className="bg-white border-2 md:border-4 border-black rounded-[30px] md:rounded-[40px] p-6 md:p-12 shadow-neo relative overflow-hidden">
                       <div className="relative z-10">
                         <h2 className="text-xl md:text-3xl font-black uppercase mb-6 md:mb-8 text-[#2D1B8C] flex items-center gap-3 md:gap-4">
                           <Calendar size={24} className="md:w-8 md:h-8" /> Paiement sur Place
                         </h2>
                         <p className="font-bold text-gray-600 mb-8 md:mb-10 text-sm md:text-base leading-relaxed italic">
                            "Nous avons hâte de vous rencontrer ! Choisissez une date pour passer au Lab finaliser l'inscription."
                         </p>
                         <div className="space-y-4">
                            <label className="font-black uppercase text-[10px] md:text-sm tracking-widest text-gray-400 md:text-gray-500 ml-2">Date de votre visite</label>
                            <input 
                              type="datetime-local" 
                              className="w-full p-4 md:p-5 bg-gray-50 border-2 md:border-4 border-black rounded-xl md:rounded-2xl font-bold text-sm md:text-lg focus:ring-4 ring-purple-100 outline-none"
                              value={formData.visitDate}
                              onChange={(e) => setFormData({...formData, visitDate: e.target.value})}
                            />
                            <div className="bg-blue-50 p-4 md:p-6 rounded-2xl border-2 border-blue-100 flex gap-3 md:gap-4">
                               <Info size={20} className="text-[#2D1B8C] shrink-0" />
                               <p className="text-[10px] md:text-xs font-bold text-[#2D1B8C] leading-relaxed">
                                  Le Lab est ouvert du Lundi au Samedi. Nous vous confirmerons le créneau par WhatsApp dès réception.
                               </p>
                            </div>
                         </div>
                       </div>
                    </div>
                 )}

                 <div className="mt-8 md:mt-12 space-y-4 md:space-y-6">
                    <button 
                      onClick={handleSubmit}
                      disabled={loading || (formData.paymentMethod === 'virement' && !formData.paymentProof) || (formData.paymentMethod === 'place' && !formData.visitDate)}
                      className="w-full py-5 md:py-8 bg-brand-green text-white font-black text-lg md:text-2xl uppercase rounded-2xl md:rounded-[2.5rem] border-2 md:border-4 border-black shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 md:gap-4"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} className="md:w-8 md:h-8" />}
                      Finaliser l'inscription
                    </button>
                    <button onClick={() => setStep(5)} className="w-full text-center font-black uppercase text-[10px] md:text-xs text-gray-400 hover:text-black transition-colors">Modifier le mode de paiement</button>
                 </div>
          </div>
        )}

      </main>

      {/* Trust Badges */}
      <section className="bg-white border-y-4 border-black py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck className="text-brand-green" />, title: 'Sécurisé', text: 'Paiement à la rentrée' },
              { icon: <Users className="text-brand-red" />, title: 'Limité', text: '12 élèves par groupe' },
              { icon: <Wrench className="text-brand-orange" />, title: 'Équipé', text: 'Matériel Pro inclus' },
              { icon: <Heart className="text-pink-500" />, title: 'Passion', text: 'Mentorat Bienveillant' }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="flex justify-center">{item.icon}</div>
                <div className="font-black uppercase text-sm">{item.title}</div>
                <div className="text-xs font-bold text-gray-400">{item.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Floating */}
      <a 
        href="https://wa.me/212621877106" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] text-white p-4 rounded-2xl border-4 border-black shadow-neo hover:-translate-y-2 transition-all z-50 flex items-center gap-3"
      >
        <MessageCircle size={24} fill="currentColor" />
        <span className="font-black uppercase text-sm hidden md:block">Besoin d'aide ?</span>
      </a>

      <footer className="py-12 text-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
        MakerLab Academy © 2024 · Made with love for little makers
      </footer>
    </div>
  );
};
