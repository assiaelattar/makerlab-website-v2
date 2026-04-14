import React, { useState } from 'react';
import { X, ChevronRight, Rocket, Target, Star, ShieldCheck, ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface QualificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  programTitle: string;
  programId: string;
}

type Step = 1 | 2 | 3 | 'result';

export const QualificationModal: React.FC<QualificationModalProps> = ({ isOpen, onClose, programTitle, programId }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    childName: '',
    childAge: '',
    motivation: '', // 'career' | 'hobby' | 'curiosity'
    experience: '', // 'none' | 'some' | 'expert'
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1 && (!formData.childName || !formData.childAge)) return;
    if (step === 2 && !formData.motivation) return;
    setStep((prev) => (prev as number + 1) as Step);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 🧠 Scoring Logic
      const age = parseInt(formData.childAge);
      const isEliteRange = age >= 8 && age <= 14;
      const isHighIntent = formData.motivation === 'career' || formData.motivation === 'mindset';
      
      let tier: 'elite' | 'discoverer' | 'standard' = 'discoverer';
      if (isEliteRange && isHighIntent) tier = 'elite';
      else if (age < 8) tier = 'standard';
      else tier = 'discoverer';

      const leadData = {
        ...formData,
        programId,
        programTitle,
        tier,
        createdAt: new Date(),
        source: 'qualification_funnel',
        type: tier === 'elite' ? 'evaluation' : 'discovery'
      };

      const docRef = await addDoc(collection(db, 'website-orientation-leads'), leadData);

      if (tier === 'elite') {
        navigate(`/thanks?leadId=${docRef.id}&type=evaluation&childName=${encodeURIComponent(formData.childName)}&programTitle=${encodeURIComponent(programTitle)}&programId=${programId}`);
      } else if (tier === 'discoverer') {
        // Soft redirect to Make & Go
        window.location.href = `/programs/kids-2?referral=stemquest_eval&childName=${encodeURIComponent(formData.childName)}`;
      } else {
        navigate(`/thanks?leadId=${docRef.id}&type=waitlist&childName=${encodeURIComponent(formData.childName)}`);
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const motivationOptions = [
    { id: 'mindset', label: 'Développer un état d\'esprit d\'ingénieur', icon: Target },
    { id: 'career', label: 'Préparer son futur (Industrie 4.0)', icon: Rocket },
    { id: 'curiosity', label: 'Découvrir la technologie par curiosité', icon: Sparkles },
    { id: 'hobby', label: 'Trouver un hobby passionnant', icon: Star },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Progress bar */}
        <div className="h-3 bg-gray-100 border-b-4 border-black flex">
          <div className={`h-full bg-brand-orange transition-all duration-500 border-r-4 border-black`} style={{ width: `${(step as number / 3) * 100}%` }}></div>
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full border-2 border-black transition-colors z-10">
          <X size={20} strokeWidth={3} />
        </button>

        <div className="p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <span className="inline-block bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest mb-4">Étape 01/03</span>
                <h2 className="font-display font-black text-3xl md:text-5xl uppercase leading-none mb-4">Faisons connaissance</h2>
                <p className="font-bold text-gray-500 uppercase text-sm italic">Parlez-nous du futur innovateur...</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Prénom du Maker</label>
                  <input 
                    type="text" 
                    value={formData.childName} 
                    onChange={e => setFormData({...formData, childName: e.target.value})}
                    placeholder="Ex: doudou" 
                    className="w-full p-4 border-4 border-black rounded-xl font-bold text-lg focus:outline-none focus:ring-4 ring-brand-orange/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Âge (Le lab accueille les 8-14 ans)</label>
                  <input 
                    type="number" 
                    value={formData.childAge} 
                    onChange={e => setFormData({...formData, childAge: e.target.value})}
                    placeholder="Âge" 
                    className="w-full p-4 border-4 border-black rounded-xl font-bold text-lg focus:outline-none focus:ring-4 ring-brand-orange/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Votre Numéro WhatsApp (Requis pour la confirmation)</label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  placeholder="+212 6... " 
                  className="w-full p-4 border-4 border-black rounded-xl font-bold text-lg focus:outline-none focus:ring-4 ring-brand-orange/20"
                />
              </div>

              <Button onClick={handleNext} disabled={!formData.childName || !formData.childAge || !formData.phone} className="w-full py-6 text-xl uppercase font-black bg-black text-white shadow-neo">
                Continuer <ChevronRight className="ml-2" strokeWidth={4} />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <span className="inline-block bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest mb-4">Étape 02/03</span>
                <h2 className="font-display font-black text-3xl md:text-5xl uppercase leading-none mb-4">Quelle est votre vision ?</h2>
                <p className="font-bold text-gray-500 uppercase text-sm italic">Pourquoi MakerLab Academy ?</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {motivationOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setFormData({...formData, motivation: opt.id})}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-4 text-left transition-all ${
                      formData.motivation === opt.id 
                        ? 'bg-black text-white border-black shadow-neo translate-x-1 -translate-y-1' 
                        : 'bg-white text-black border-black/10 hover:border-black'
                    }`}
                  >
                    <div className={`p-2 rounded-lg border-2 border-current ${formData.motivation === opt.id ? 'bg-white/10' : 'bg-gray-50'}`}>
                      <opt.icon size={24} strokeWidth={3} />
                    </div>
                    <span className="font-black uppercase text-xs md:text-sm tracking-tight">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 py-4 border-4 border-black">Retour</Button>
                <Button onClick={handleNext} disabled={!formData.motivation} className="flex-[2] py-4 text-lg bg-black text-white shadow-neo uppercase font-black">
                  Étape Finale <ChevronRight className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <span className="inline-block bg-brand-orange text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest mb-4 border-2 border-black animate-bounce font-display italic shadow-neo-sm">Presque fini!</span>
                <h2 className="font-display font-black text-3xl md:text-5xl uppercase leading-none mb-4">Prêt pour l'évaluation ?</h2>
                <p className="font-bold text-gray-600 uppercase text-sm px-4">
                  Pour garantir un mentorat de qualité, chaque futur Maker passe une évaluation d'orientation au Lab.
                </p>
              </div>

              <div className="bg-green-50 border-4 border-green-600 rounded-2xl p-6 flex items-start gap-4">
                 <ShieldCheck className="text-green-600 shrink-0" size={32} strokeWidth={3} />
                 <div>
                    <h4 className="font-black text-green-700 uppercase text-sm mb-1">Pas d'engagement financier immédiat</h4>
                    <p className="text-[10px] font-bold text-green-600/80 uppercase">L'objectif est de vérifier l'adéquation entre le projet de {formData.childName} et nos stations d'innovation.</p>
                 </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleSubmit} 
                  isLoading={loading}
                  className="w-full py-8 text-2xl uppercase font-black bg-brand-orange text-black border-4 border-black shadow-neo hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  <Sparkles size={28} className="animate-pulse" />
                  VOIR MON ÉLIGIBILITÉ
                </Button>
                <p className="text-[10px] font-black text-center text-gray-400 uppercase tracking-widest">
                  En cliquant, vous acceptez d'être recontacté via WhatsApp par nos mentors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
