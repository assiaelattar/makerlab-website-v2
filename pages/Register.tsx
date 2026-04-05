import React, { useState } from 'react';
import { Button } from '../components/Button';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { SEO } from '../components/SEO';
import { Phone, CheckCircle, Mail, MapPin, MessageCircle } from 'lucide-react';

export const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childName: '',
    childAge: '',
    mission: 'Drones & Robotique',
    preferredDate: new Date(Date.now() + (7 - new Date().getDay()) % 7 * 86400000).toISOString().split('T')[0],
    notes: ''
  });
  
  const totalSteps = 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
        setLoading(true);
        try {
            await addDoc(collection(db, 'website-bookings'), {
                ...formData,
                programTitle: formData.mission,
                bookingType: 'workshop',
                status: 'pending',
                createdAt: new Date().toISOString()
            });

            // 📩 PRO EMAIL TRIGGER (For Firebase 'Trigger Email' Extension)
            await addDoc(collection(db, 'mail'), {
                to: [formData.parentEmail, 'admin@makerlab.ma'], // Notify both
                message: {
                    subject: `🚩 Mission Confirmée : ${formData.mission}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; border: 10px solid black; padding: 20px;">
                            <h1 style="text-transform: uppercase; font-weight: 900;">MakerLab Academy</h1>
                            <p>Bonjour ${formData.parentName},</p>
                            <p>La mission <b>${formData.mission}</b> pour <b>${formData.childName}</b> a été transmise à notre centre de commande.</p>
                            <div style="background: #f0f0f0; padding: 15px; border: 2px solid black;">
                                <p><b>Détails de la Mission :</b></p>
                                <ul>
                                    <li>Date : ${formData.preferredDate}</li>
                                    <li>Lieu : Casablanca Hub</li>
                                    <li>Frais : 400 DHS (à régler sur place)</li>
                                </ul>
                            </div>
                            <p>Un agent vous contactera sous peu sur WhatsApp (${formData.parentPhone}) pour la validation finale.</p>
                            <p><i>- L'équipe MakerLab</i></p>
                        </div>
                    `
                }
            });
            setSubmitted(true);
        } catch (error) {
            console.error("Booking error:", error);
            alert("Une erreur est survenue lors de l'envoi de la mission.");
        } finally {
            setLoading(false);
        }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="bg-white border-4 border-black p-12 shadow-neo-xl text-center max-w-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-8 bg-brand-green border-b-4 border-black animate-pulse" />
          <div className="mb-6 inline-block bg-brand-red p-6 border-4 border-black -rotate-3 text-white">
            <CheckCircle size={48} strokeWidth={3} />
          </div>
          <h2 className="font-display font-black text-4xl mb-4 italic uppercase">Mission Transmise !</h2>
          <div className="bg-black text-brand-green p-6 font-mono text-left text-sm mb-8 border-4 border-brand-green">
             <p className="mb-2 uppercase underline font-bold">&gt; Recapitulatif de la Mission</p>
             <p>&gt; EXPLORATEUR: {formData.childName}</p>
             <p>&gt; AGENT PARENTAL: {formData.parentName}</p>
             <p>&gt; OBJET: {formData.mission}</p>
             <p>&gt; STATUS: EN ATTENTE DE VALIDATION</p>
          </div>
          <p className="font-bold text-gray-600 mb-8 max-w-sm mx-auto">
            Nous avons reçu ta demande. Un agent MakerLAB te contactera sur WhatsApp pour finaliser ta venue !
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1" onClick={() => window.location.href = '/'}>Retour au Hub</Button>
            <a 
                href={`https://wa.me/212600000000?text=${encodeURIComponent(`Bonjour MakerLAB! Je viens de réserver la mission [${formData.mission}] pour ${formData.childName}. Pouvez-vous confirmer?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
            >
                <Button size="lg" className="w-full bg-green-600 text-white hover:bg-green-700">
                    <MessageCircle size={18} className="mr-2" /> Confirmer via WhatsApp
                </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 md:py-24 px-4 bg-gray-50 text-black">
      <SEO 
        title="Inscription Ateliers & Camps Robotique" 
        description="Réservez votre place pour nos ateliers de robotique, coding et drones à Casablanca. Inscription rapide en 3 étapes pour les futurs Makers !"
        keywords="inscription robotique casablanca, réserver atelier coding, camp vacances inscription, makerlab academy registration"
      />
      <div className="container mx-auto max-w-3xl">
        
        {/* Mission Progress Bar */}
        <div className="mb-12 relative">
            <div className="flex justify-between items-center mb-4 relative z-10">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center">
                        <div className={`w-10 h-10 border-4 border-black font-black flex items-center justify-center transition-all ${step >= s ? 'bg-brand-red text-white -rotate-3' : 'bg-white text-black'}`}>
                            {s}
                        </div>
                        <span className="text-[10px] font-black uppercase mt-2 tracking-tighter">
                            {s === 1 ? 'Explorateur' : s === 2 ? 'Mission' : 'Briefing'}
                        </span>
                    </div>
                ))}
            </div>
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-1 bg-black z-0"></div>
            <div className="absolute top-5 left-0 h-1 bg-brand-green z-0 transition-all duration-500" style={{ width: `${((step-1)/(totalSteps-1)) * 100}%` }}></div>
        </div>

        <div className="bg-white rounded-none border-4 border-black shadow-neo-xl p-8 md:p-12 relative overflow-hidden">
          {/* Tech Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          <div className="relative z-10">
            <div className="mb-10">
                <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase tracking-widest mb-2 inline-block">Code: MKR-INTAKE-01</span>
                <h1 className="font-display font-black text-4xl md:text-5xl uppercase leading-none">Mission Briefing</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <h3 className="text-xl font-black uppercase border-b-4 border-brand-blue inline-block pb-1 italic">01. Identité de l'Explorateur</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="font-black text-[10px] uppercase tracking-widest text-gray-500">Nom du Parent</label>
                                <input required name="parentName" value={formData.parentName} onChange={handleInputChange} type="text" className="w-full p-4 border-4 border-black bg-white focus:bg-gray-50 outline-none font-bold placeholder:text-gray-300" placeholder="Jean Dupont" />
                            </div>
                            <div className="space-y-2">
                                <label className="font-black text-[10px] uppercase tracking-widest text-gray-500">Contact Email</label>
                                <input required name="parentEmail" value={formData.parentEmail} onChange={handleInputChange} type="email" className="w-full p-4 border-4 border-black bg-white focus:bg-gray-50 outline-none font-bold placeholder:text-gray-300" placeholder="jean@mail.com" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="font-black text-[10px] uppercase tracking-widest text-gray-500">Numéro WhatsApp (Mandatoire)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">+212</span>
                                    <input required name="parentPhone" value={formData.parentPhone} onChange={handleInputChange} type="tel" className="w-full p-4 pl-14 border-4 border-black bg-white focus:bg-gray-50 outline-none font-bold placeholder:text-gray-300" placeholder="6 00 00 00 00" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="font-black text-[10px] uppercase tracking-widest text-gray-500">Prénom Maker (Enfant)</label>
                                <input required name="childName" value={formData.childName} onChange={handleInputChange} type="text" className="w-full p-4 border-4 border-black bg-white focus:bg-gray-50 outline-none font-bold placeholder:text-gray-300" placeholder="Alexander" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="font-black text-[10px] uppercase tracking-widest text-gray-500">Âge du Maker</label>
                            <input required name="childAge" value={formData.childAge} onChange={handleInputChange} type="number" min="5" max="99" className="w-full p-4 border-4 border-black bg-white focus:bg-gray-50 outline-none font-bold placeholder:text-gray-300" placeholder="10" />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <h3 className="text-xl font-black uppercase border-b-4 border-brand-green inline-block pb-1 italic">02. Cible de la Mission</h3>
                        <div className="space-y-4">
                            <label className="font-black text-[10px] uppercase tracking-widest text-gray-500">Sélectionner un Secteur Technologique</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Drones & Robotique', 'Codage & IA', 'Design 3D', 'Jeux Vidéo'].map((opt) => (
                                    <label key={opt} className="cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="mission" 
                                            value={opt} 
                                            checked={formData.mission === opt}
                                            onChange={handleInputChange}
                                            className="hidden peer" 
                                            required 
                                        />
                                        <div className="p-4 border-4 border-black bg-white peer-checked:bg-brand-green peer-checked:text-white transition-all font-black uppercase text-sm group-hover:-translate-y-1 shadow-neo-sm">
                                            {opt}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4 mt-6">
                            <label className="font-black text-[10px] uppercase tracking-widest text-gray-500">Date de la Mission</label>
                            <input 
                                required 
                                name="preferredDate" 
                                type="date" 
                                value={formData.preferredDate} 
                                onChange={handleInputChange}
                                className="w-full p-4 border-4 border-black bg-white focus:bg-gray-50 outline-none font-bold" 
                            />
                        </div>
                        <div className="space-y-2 mt-6">
                            <label className="font-black text-[10px] uppercase tracking-widest text-gray-500">Notes de Mission (Allergies, Besoins...)</label>
                            <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full p-4 border-4 border-black bg-white focus:bg-gray-50 outline-none font-bold placeholder:text-gray-300 h-24" placeholder="Précisez ici..."></textarea>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <h3 className="text-xl font-black uppercase border-b-4 border-brand-orange inline-block pb-1 italic">03. Rapport Final</h3>
                        <div className="bg-black text-brand-green p-6 font-mono text-sm border-4 border-brand-green shadow-neo">
                            <p className="mb-2 uppercase underline mb-4">Verification Sequence Initialized...</p>
                            <ul className="space-y-1">
                                <li>&gt; STATUS: READY</li>
                                <li>&gt; LOCATION: CASABLANCA HUB</li>
                                <li>&gt; FEE: 400 DHS (Pay on site)</li>
                                <li>&gt; DURATION: 3 HOURS</li>
                                <li>&gt; EQUIPMENT: PROVIDED</li>
                            </ul>
                            <div className="mt-6 flex items-center gap-2">
                                <input type="checkbox" required id="confirm" className="w-5 h-5 border-2 border-brand-green bg-transparent cursor-pointer" />
                                <label htmlFor="confirm" className="cursor-pointer">I confirm the mission readiness.</label>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    {step > 1 && (
                        <button 
                            type="button" 
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-4 border-4 border-black font-black uppercase text-sm hover:bg-gray-100 transition-all shadow-neo-sm"
                        >
                            Retour
                        </button>
                    )}
                    <Button type="submit" size="lg" disabled={loading} className="flex-1 justify-center bg-brand-red text-white uppercase tracking-widest disabled:opacity-50">
                        {loading ? "Calcul de Mission..." : step === totalSteps ? "Lancer la Mission" : "Phase Suivante"}
                    </Button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};