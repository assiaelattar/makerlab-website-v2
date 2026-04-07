import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { SEO } from '../components/SEO';
import { 
  Phone, 
  CheckCircle, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Sparkles, 
  Target, 
  Search,
  Compass,
  Rocket,
  ArrowRight,
  ChevronRight,
  Users
} from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childName: '',
    childAge: '',
    interests: [] as string[],
    level: 'Débutant',
    notes: ''
  });
  
  const totalSteps = 3;

  const interestsOptions = [
    'Robotique & Électronique',
    'Coding & Intelligence Artificielle',
    'Design 3D & Découpe Laser',
    'Création de Jeux Vidéo',
    'Ingénierie & Mécanique',
    'Intelligence Artificielle'
  ];

  const levels = ['Débutant (Curieux)', 'Intermédiaire (A déjà pratiqué)', 'Avancé (Passionné)'];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
        setLoading(true);
        try {
            const leadData = {
                ...formData,
                status: 'Pending',
                createdAt: new Date().toISOString()
            };
            
            const docRef = await addDoc(collection(db, 'website-orientation-leads'), leadData);

            // Redirect to Thank You page with Orientation type
            const params = new URLSearchParams({
                leadId: docRef.id,
                childName: formData.childName,
                programTitle: "Orientation Maker",
                type: 'orientation'
            });
            navigate(`/thanks?${params.toString()}`);
        } catch (error) {
            console.error("Orientation error:", error);
            alert("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen py-16 md:py-24 px-4 bg-white text-black overflow-x-hidden pt-24 md:pt-32">
      <SEO 
        title="Conseil & Orientation | MakerLab Academy" 
        description="Aidez votre enfant à choisir le bon parcours technologique. Consultation gratuite avec nos experts en éducation STEM à Casablanca."
        keywords="conseil orientation robotique, choisir atelier coding, makerlab academy conseil, futur technologique enfant"
      />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-orange/5 -rotate-12 transform translate-x-20 -translate-y-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-blue/5 rotate-12 transform -translate-x-20 translate-y-20 blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10 md:mb-16 px-2">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white border-4 border-black rounded-full mb-6 md:mb-8 transform -rotate-1 shadow-neo-sm">
              <Compass size={24} className="text-brand-orange animate-spin-slow shrink-0" />
              <span className="text-xs md:text-sm font-black uppercase tracking-widest leading-none">Guide & Orientation</span>
            </div>
            <h1 className="font-display font-black text-4xl md:text-7xl uppercase leading-[0.9] mb-6 md:mb-8 tracking-tighter">
              Trouvez le <span className="text-brand-orange text-outline-black">Parcours Idéal</span><br className="hidden md:block" />
              Pour Votre Enfant
            </h1>
            <p className="text-base md:text-xl font-bold text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
              Vous hésitez entre le Coding, la Robotique ou le Design 3D ? Répondez à ces 3 questions et recevez un conseil personnalisé de nos mentors.
            </p>
        </div>

        {/* Mission Progress Bar */}
        <div className="mb-12 relative max-w-lg mx-auto">
            <div className="flex justify-between items-center mb-4 relative z-10">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center">
                        <div className={`w-12 h-12 border-4 border-black font-black flex items-center justify-center transition-all rounded-xl ${step >= s ? 'bg-black text-white -rotate-6 scale-110 shadow-neo-sm' : 'bg-white text-black'}`}>
                            {s}
                        </div>
                        <span className={`text-[10px] font-black uppercase mt-3 tracking-widest ${step >= s ? 'text-black' : 'text-gray-400'}`}>
                            {s === 1 ? 'Makers' : s === 2 ? 'Intérêts' : 'Envoi'}
                        </span>
                    </div>
                ))}
            </div>
            {/* Background Line */}
            <div className="absolute top-6 left-0 w-full h-1 bg-gray-100 z-0 rounded-full"></div>
            <div className="absolute top-6 left-0 h-1 bg-black z-0 transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)]" style={{ width: `${((step-1)/(totalSteps-1)) * 100}%` }}></div>
        </div>

        <div className="bg-white rounded-[2rem] md:rounded-[40px] border-4 md:border-8 border-black shadow-neo-xl p-6 md:p-16 relative overflow-hidden">
          
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-10">
                
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-2">
                             <div className="w-10 h-10 bg-brand-orange border-4 border-black flex items-center justify-center shadow-neo-sm">
                                <Users size={20} className="text-black" />
                             </div>
                             <h3 className="text-2xl font-black uppercase tracking-tight">L'Explorateur & Le Parent</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="font-black text-xs uppercase tracking-widest text-gray-500">Nom du Parent</label>
                                <input required name="parentName" value={formData.parentName} onChange={handleInputChange} type="text" className="w-full p-4 border-4 border-black bg-gray-50 focus:bg-white outline-none font-bold placeholder:text-gray-300 rounded-2xl transition-all focus:shadow-neo-sm" placeholder="Ex: Jean Dupont" />
                            </div>
                            <div className="space-y-3">
                                <label className="font-black text-xs uppercase tracking-widest text-gray-500">Prénom de l'Enfant</label>
                                <input required name="childName" value={formData.childName} onChange={handleInputChange} type="text" className="w-full p-4 border-4 border-black bg-gray-50 focus:bg-white outline-none font-bold placeholder:text-gray-300 rounded-2xl transition-all focus:shadow-neo-sm" placeholder="Ex: Adam" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="font-black text-xs uppercase tracking-widest text-gray-500">WhatsApp (Mandatoire)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-300">+212</span>
                                    <input required name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} type="tel" className="w-full p-4 pl-16 border-4 border-black bg-gray-50 focus:bg-white outline-none font-bold placeholder:text-gray-300 rounded-2xl transition-all focus:shadow-neo-sm" placeholder="6 00 00 00 00" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="font-black text-xs uppercase tracking-widest text-gray-500">Âge du Maker</label>
                                <input required name="childAge" value={formData.childAge} onChange={handleInputChange} type="number" min="5" max="99" className="w-full p-4 border-4 border-black bg-gray-50 focus:bg-white outline-none font-bold placeholder:text-gray-300 rounded-2xl transition-all focus:shadow-neo-sm" placeholder="Ex: 10 ans" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-2">
                             <div className="w-10 h-10 bg-brand-blue border-4 border-black flex items-center justify-center shadow-neo-sm rounded-lg">
                                <Target size={20} className="text-white" />
                             </div>
                             <h3 className="text-2xl font-black uppercase tracking-tight">Intérêts & Passion</h3>
                        </div>

                        <div className="space-y-4">
                            <label className="font-black text-xs uppercase tracking-widest text-gray-500">Qu'est-ce qui le passionne ? (Plusieurs choix possibles)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {interestsOptions.map((opt) => (
                                    <button 
                                        key={opt}
                                        type="button"
                                        onClick={() => toggleInterest(opt)}
                                        className={`p-4 border-4 border-black rounded-2xl text-left transition-all font-black uppercase text-xs flex items-center justify-between ${
                                            formData.interests.includes(opt) 
                                                ? 'bg-brand-orange text-black shadow-neo-sm' 
                                                : 'bg-white hover:bg-gray-50'
                                        }`}
                                    >
                                        {opt}
                                        {formData.interests.includes(opt) && <CheckCircle size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 mt-8">
                            <label className="font-black text-xs uppercase tracking-widest text-gray-500">Niveau actuel en technologie</label>
                            <div className="flex flex-wrap gap-4">
                                {levels.map((l) => (
                                    <label key={l} className="cursor-pointer group flex-grow">
                                        <input 
                                            type="radio" 
                                            name="level" 
                                            value={l} 
                                            checked={formData.level === l}
                                            onChange={handleInputChange}
                                            className="hidden peer" 
                                        />
                                        <div className="p-4 border-4 border-black rounded-2xl bg-white peer-checked:bg-black peer-checked:text-white transition-all font-black uppercase text-xs text-center group-hover:-translate-y-1">
                                            {l}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4 mb-2">
                             <div className="w-10 h-10 bg-brand-red border-4 border-black flex items-center justify-center shadow-neo-sm rounded-full">
                                <Sparkles size={20} className="text-white" />
                             </div>
                             <h3 className="text-2xl font-black uppercase tracking-tight">Derniers Détails</h3>
                        </div>

                        <div className="space-y-3">
                            <label className="font-black text-xs uppercase tracking-widest text-gray-500">Une question spécifique ? Une crainte ?</label>
                            <textarea 
                                name="notes" 
                                value={formData.notes} 
                                onChange={handleInputChange} 
                                className="w-full p-6 border-4 border-black bg-gray-50 focus:bg-white outline-none font-bold placeholder:text-gray-300 rounded-[30px] h-32 transition-all" 
                                placeholder="Dites-nous tout ce qui pourrait nous aider à mieux le conseiller..."
                            ></textarea>
                        </div>

                        <div className="bg-gray-50 border-4 border-black rounded-3xl p-6 flex items-start gap-4">
                            <div className="mt-1">
                                <div className="w-6 h-6 border-4 border-black rounded flex items-center justify-center">
                                    <div className="w-2 h-2 bg-black rounded-full"></div>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-gray-600 leading-tight">
                                En cliquant sur "Envoyer", un mentor MakerLab analysera le profil de <span className="text-black">{formData.childName || "votre enfant"}</span> et vous contactera sous 24h avec une recommandation de parcours.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {step > 1 && (
                        <button 
                            type="button" 
                            onClick={() => setStep(step - 1)}
                            className="w-full sm:w-auto px-8 py-4 md:py-5 border-4 border-black font-black uppercase text-sm hover:bg-gray-100 transition-all shadow-neo-sm rounded-xl md:rounded-2xl active:scale-95"
                        >
                            Retour
                        </button>
                    )}
                    <Button 
                        type="submit" 
                        size="lg" 
                        disabled={loading} 
                        className="flex-1 justify-center bg-black text-white uppercase tracking-widest disabled:opacity-50 h-[64px] md:h-[72px] text-base md:text-lg rounded-xl md:rounded-2xl group shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Analyse...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                {step === totalSteps ? "Recevoir mon Conseil" : "Étape Suivante"}
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform shrink-0" />
                            </span>
                        )}
                    </Button>
                </div>
            </form>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 border-t-4 border-black border-dashed pt-12">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-green border-4 border-black transform rotate-3 flex items-center justify-center p-3">
                    <MessageCircle size={32} />
                </div>
                <div>
                    <h4 className="font-black text-lg uppercase leading-none mb-1">Besoin d'aide immédiate ?</h4>
                    <p className="text-sm font-bold text-gray-500 uppercase">Contactez un mentor sur WhatsApp</p>
                </div>
            </div>
            <a href="https://wa.me/212621877106" target="_blank" rel="noopener noreferrer">
                <Button variant="accent" className="px-8 py-4 border-4 border-black shadow-neo hover:shadow-none transition-all font-black uppercase">
                   Ouvrir WhatsApp
                </Button>
            </a>
        </div>
      </div>
    </div>
  );
};