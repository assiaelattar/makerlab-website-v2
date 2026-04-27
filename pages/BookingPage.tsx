import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { usePrograms } from '../contexts/ProgramContext';
import { useMissions } from '../contexts/MissionContext';
import { Button } from '../components/Button';
import { ArrowLeft, ArrowRight, CheckCircle2, Calendar as CalendarIcon, User, Phone, Mail, Baby, Info, Zap } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { generateUpcomingInstances } from '../utils/slotUtils';
import { BookingCalendar } from '../components/BookingCalendar';

export const BookingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { getProgram } = usePrograms();
    const { missions, tracks, demoSlots, recurrentSlots, leads, updateDemoSlot } = useMissions();
    
    // 🧠 Dynamic Slot Generation
    const availableSlots = useMemo(() => {
        if (!recurrentSlots || !demoSlots || !leads) return [];
        return generateUpcomingInstances(recurrentSlots, demoSlots, leads, 4);
    }, [recurrentSlots, demoSlots, leads]);

    const type = searchParams.get('type') || 'workshop'; // 'workshop', 'trial', or 'annual'
    const missionId = searchParams.get('missionId');
    const trackId = searchParams.get('trackId');

    const program = getProgram(id || '');
    
    // 🛡️ Fallback for General Trial Link (/booking/trial?type=trial)
    const isGeneralTrial = !program && id === 'trial';
    const activeProgram = program || (isGeneralTrial ? {
        id: 'trial',
        title: 'Atelier d\'Essai MakerLab',
        description: 'Découvrez l\'univers MakerLab lors d\'une session de démonstration gratuite. Robotique, Codage et Impression 3D !',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
        ageGroup: '7-14 ans',
        format: 'Présentiel',
        price: 'GRATUIT',
        category: 'DÉCOUVRE'
    } : null);

    // Find specific mission or track if applicable
    const selectedMission = missionId ? missions.find(m => m.id === missionId) : null;
    const selectedTrack = trackId ? tracks.find(t => t.id === trackId) : null;

    // Determine booking details (override program values if specific mission/track)
    const bookingTitle = selectedMission?.title || selectedTrack?.title || activeProgram?.title || 'Réservation';
    const bookingPrice = selectedMission?.price || selectedTrack?.price || activeProgram?.price || '';
    const bookingDesc = selectedMission?.description || selectedTrack?.description || activeProgram?.description || '';

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        childName: '',
        childAge: '',
        preferredDate: '',
        demoSlotId: '',
        notes: ''
    });

    useEffect(() => {
        if (activeProgram?.schedule && activeProgram.schedule.length > 0 && !formData.preferredDate) {
            setFormData(prev => ({ ...prev, preferredDate: activeProgram.schedule[0] }));
        }
    }, [activeProgram]);

    if (!activeProgram) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center bg-white border-4 border-black p-10 shadow-neo">
                    <h2 className="font-display font-black text-3xl mb-4">Programme non trouvé</h2>
                    <Button onClick={() => navigate('/programs')}>Retour aux programmes</Button>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, 'website-bookings'), {
                ...formData,
                programId: activeProgram.id,
                programTitle: activeProgram.title,
                missionId: missionId || null,
                trackId: trackId || null,
                itemTitle: bookingTitle,
                itemPrice: bookingPrice,
                bookingType: type,
                demoSlotId: formData.demoSlotId || null,
                createdAt: new Date().toISOString(),
                status: 'pending'
            });

            // Decrement spots if it was a specific demo slot
            if (type === 'trial' && formData.demoSlotId) {
                const slot = demoSlots.find(s => s.id === formData.demoSlotId);
                if (slot) {
                    await updateDemoSlot(slot.id, { spotsLeft: Math.max(0, slot.spotsLeft - 1) });
                }
            }
            setIsSuccess(true);
        } catch (error) {
            console.error("Booking error:", error);
            alert("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 bg-brand-red/10">
                <div className="max-w-2xl mx-auto bg-white border-4 border-black rounded-[2.5rem] shadow-neo-xl p-8 md:p-16 text-center">
                    <div className="w-24 h-24 bg-brand-green border-4 border-black rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <CheckCircle2 size={48} strokeWidth={3} className="text-white" />
                    </div>
                    <h2 className="font-display font-black text-4xl mb-6 uppercase">C'est validé !</h2>
                    <p className="text-xl font-bold mb-8 leading-relaxed">
                        {type === 'trial' 
                            ? `Votre demande d'atelier d'essai pour "${bookingTitle}" a bien été reçue. Notre équipe vous recontactera très vite pour confirmer la date.`
                            : type === 'annual'
                            ? `Votre demande d'inscription au Programme Annuel "${bookingTitle}" a bien été enregistrée. Un conseiller pédagogique vous appellera pour finaliser le dossier.`
                            : `Votre réservation pour "${bookingTitle}" est en cours. Un conseiller MakerLab vous appellera pour finaliser l'inscription.`
                        }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="primary" onClick={() => navigate('/')} className="shadow-none border-4 border-black font-black uppercase tracking-widest">Retour à l'accueil</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 md:pt-32 pb-16 px-3 md:px-4 bg-[#fcfaf7] relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}></div>
            
            <div className="max-w-6xl mx-auto relative z-10">
                <button onClick={() => navigate(-1)} className="group flex items-center gap-3 font-black uppercase tracking-[0.2em] text-[10px] mb-4 md:mb-12 text-black/40 hover:text-black transition-colors">
                    <div className="bg-white border-2 border-black/10 p-2 rounded-xl group-hover:scale-110 transition-transform"><ArrowLeft size={14} strokeWidth={4} /></div> 
                    Retour
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-12 items-start">

                    {/* Mobile-only: Compact info banner shown ABOVE form */}
                    <div className={`lg:hidden flex items-center gap-3 p-4 rounded-2xl border-2 border-white/10 ${type === 'trial' ? 'bg-brand-blue' : 'bg-brand-red'} text-white`}>
                        <div className="shrink-0 bg-white/20 p-2.5 rounded-xl">
                            {type === 'trial' ? <span className="text-xl">🎁</span> : <span className="text-xl">📅</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-[10px] uppercase tracking-widest opacity-70">{type === 'trial' ? 'Session Offerte' : type === 'annual' ? 'Parcours Annuel' : 'Workshop'}</p>
                            <p className="font-black text-sm uppercase truncate">{bookingTitle}</p>
                        </div>
                        <div className="shrink-0 bg-white/20 px-3 py-1.5 rounded-full">
                            <p className="font-black text-xs italic">{type === 'trial' ? 'GRATUIT' : bookingPrice}</p>
                        </div>
                    </div>

                    {/* Left: Full Info Card — desktop only */}
                    <div className="hidden lg:block lg:col-span-4 space-y-8 sticky top-32">
                        <div className={`p-10 border-2 border-black/5 rounded-[3rem] shadow-2xl relative overflow-hidden transition-all ${type === 'trial' ? 'bg-brand-blue text-white' : 'bg-brand-red text-white'}`}>
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="mb-6 inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em]">
                                    {type === 'trial' ? '🎁 Session Offerte' : type === 'annual' ? '🏆 Parcours Annuel' : (selectedTrack ? '📦 Pack Maker' : '📅 Workshop')}
                                </div>
                                <h2 className="font-display font-black text-5xl mb-6 leading-[0.9] uppercase italic tracking-tighter">{bookingTitle}</h2>
                                <p className="font-bold opacity-80 mb-10 text-lg leading-relaxed italic">{bookingDesc.substring(0, 160)}...</p>
                                <div className="space-y-4 pt-8 border-t border-white/10 text-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Baby size={20} strokeWidth={3} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest opacity-60">Âge requis</p>
                                            <p className="font-black text-base">{selectedMission ? '7-12 ans' : (selectedTrack ? '7-17 ans' : activeProgram.ageGroup)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Zap size={20} strokeWidth={3} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest opacity-60">Format</p>
                                            <p className="font-black text-base">{selectedMission || selectedTrack ? 'Session Maker' : activeProgram.format}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><Info size={20} strokeWidth={3} /></div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest opacity-60">Tarif</p>
                                            <p className="font-black text-2xl italic">{type === 'trial' ? 'GRATUIT' : bookingPrice}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-8 border-2 border-black/5 rounded-[2.5rem] shadow-xl italic font-bold text-base text-black/50 leading-relaxed text-center">
                             "La technologie ne doit pas être juste consommée, elle doit être créée. Rejoins l'aventure MakerLab !"
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className="bg-white border-2 border-black/5 rounded-2xl md:rounded-[4rem] shadow-xl md:shadow-2xl p-4 md:p-16 space-y-5 md:space-y-12">
                            <div className="text-center md:text-left">
                                <h3 className="font-display font-black text-xl md:text-6xl uppercase tracking-tighter mb-1 md:mb-4 text-black italic leading-none">
                                    {type === 'trial' ? "L'AVENTURE COMMENCE." : type === 'annual' ? "PRÊT POUR L'ANNÉE ?" : "REJOINDRE LA MISSION"}
                                </h3>
                                <p className="text-black/40 font-black text-[9px] md:text-xs uppercase tracking-[0.3em]">Complétez les informations ci-dessous</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-8">
                                <div className="space-y-1.5 md:space-y-3">
                                    <label className="block pl-1 font-black text-[10px] md:text-xs uppercase tracking-widest text-black/40">Nom du Parent</label>
                                    <input required type="text" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} placeholder="Fatima Zahra" className="w-full bg-gray-50 border-2 border-black/10 p-3 md:p-5 font-bold focus:bg-white focus:border-brand-blue outline-none transition-all rounded-xl md:rounded-2xl text-sm md:text-base" />
                                </div>
                                <div className="space-y-1.5 md:space-y-3">
                                    <label className="block pl-1 font-black text-[10px] md:text-xs uppercase tracking-widest text-black/40">Prénom de l'enfant</label>
                                    <input required type="text" value={formData.childName} onChange={e => setFormData({...formData, childName: e.target.value})} placeholder="Youssef" className="w-full bg-gray-50 border-2 border-black/10 p-3 md:p-5 font-bold focus:bg-white focus:border-brand-blue outline-none transition-all rounded-xl md:rounded-2xl text-sm md:text-base" />
                                </div>
                                <div className="space-y-1.5 md:space-y-3">
                                    <label className="block pl-1 font-black text-[10px] md:text-xs uppercase tracking-widest text-black/40">Email de contact</label>
                                    <input required type="email" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} placeholder="parent@email.com" className="w-full bg-gray-50 border-2 border-black/10 p-3 md:p-5 font-bold focus:bg-white focus:border-brand-blue outline-none transition-all rounded-xl md:rounded-2xl text-sm md:text-base" />
                                </div>
                                <div className="space-y-1.5 md:space-y-3">
                                    <label className="block pl-1 font-black text-[10px] md:text-xs uppercase tracking-widest text-black/40">WhatsApp</label>
                                    <input required type="tel" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} placeholder="06..." className="w-full bg-gray-50 border-2 border-black/10 p-3 md:p-5 font-bold focus:bg-white focus:border-brand-blue outline-none transition-all rounded-xl md:rounded-2xl text-sm md:text-base" />
                                </div>

                                {type === 'trial' ? (
                                    <div className="md:col-span-2 space-y-6 pt-8 border-t border-black/5">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h4 className="font-black text-xl uppercase italic tracking-tighter">Choisissez votre session</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-black/30">Places limitées par atelier</p>
                                            </div>
                                            <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-brand-green/20">
                                                <Zap size={14} fill="currentColor"/> Session Gratuite
                                            </div>
                                        </div>
                                        
                                        <BookingCalendar 
                                          availableSlots={availableSlots}
                                          selectedSlotId={formData.demoSlotId}
                                          onSelect={(slot) => setFormData({
                                            ...formData, 
                                            demoSlotId: slot.id, 
                                            preferredDate: slot.isoDate, 
                                            notes: `${formData.notes}\nSlot Time: ${slot.startTime}`
                                          })}
                                        />

                                        {availableSlots.length === 0 && (
                                            <div className="p-16 border-4 border-dashed border-gray-100 rounded-[3rem] text-center text-gray-300 font-display font-black text-2xl uppercase italic">
                                                Aucun créneau <br/> disponible
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="block pl-2 font-black text-xs uppercase tracking-widest text-black/40">Date souhaitée</label>
                                        <select required value={formData.preferredDate} onChange={e => setFormData({...formData, preferredDate: e.target.value})} className="w-full bg-gray-50/50 border-2 border-black/5 p-5 font-bold focus:bg-white focus:border-brand-blue outline-none transition-all rounded-2xl bg-white">
                                            {activeProgram.schedule?.map(date => (
                                                <option key={date} value={date}>{date}</option>
                                            ))}
                                            {(!activeProgram.schedule || activeProgram.schedule.length === 0) && <option value="a-convenir">À convenir avec l'équipe</option>}
                                        </select>
                                    </div>
                                )}
                                
                                <div className="space-y-1.5 md:space-y-3 md:col-span-2 lg:col-span-1">
                                    <label className="block pl-1 font-black text-[10px] md:text-xs uppercase tracking-widest text-black/40">Âge de l'enfant</label>
                                    <input required type="text" value={formData.childAge} onChange={e => setFormData({...formData, childAge: e.target.value})} placeholder="ex: 11 ans" className="w-full bg-gray-50 border-2 border-black/10 p-3 md:p-5 font-bold focus:bg-white focus:border-brand-blue outline-none transition-all rounded-xl md:rounded-2xl text-sm md:text-base" />
                                </div>
                            </div>

                            <div className="space-y-2 pt-4 md:pt-8 border-t border-black/5">
                                <label className="block pl-1 font-black text-[10px] uppercase tracking-widest text-black/40">Message / Questions (optionnel)</label>
                                <textarea placeholder="Un besoin spécifique ? Une passion particulière ?" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-gray-50 border-2 border-black/10 p-3 md:p-8 font-bold focus:bg-white focus:border-brand-blue outline-none transition-all rounded-2xl md:rounded-[2.5rem] min-h-[100px] md:min-h-[150px] text-sm md:text-base" />
                            </div>

                            <div className="pt-4 md:pt-8">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-brand-orange text-black py-5 md:py-8 rounded-2xl md:rounded-[2.5rem] border-2 md:border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:shadow-[12px_12px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 md:hover:translate-x-2 md:hover:translate-y-2 transition-all font-black uppercase text-lg md:text-2xl italic tracking-widest flex items-center justify-center gap-3 md:gap-4 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'TRAITEMENT...' : (type === 'trial' ? "REJOINDRE L'AVENTURE" : "CONFIRMER L'INSCRIPTION")}
                                    <ArrowRight size={24} className="md:w-8 md:h-8" strokeWidth={3} />
                                </button>
                                
                                {/* Trust Strip */}
                                <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8 border-t border-black/5 pt-8">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><CheckCircle2 size={12} strokeWidth={3} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">100% Gratuit</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Zap size={12} strokeWidth={3} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Sans engagement</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Info size={12} strokeWidth={3} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Réponse {"<"} 24h</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
