
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { usePrograms } from '../contexts/ProgramContext';
import { Button } from '../components/Button';
import { ArrowLeft, CheckCircle2, Calendar, User, Phone, Mail, Baby, Info, Zap } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const BookingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { getProgram } = usePrograms();
    const type = searchParams.get('type') || 'workshop'; // 'workshop' or 'trial'

    const program = getProgram(id || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        childName: '',
        childAge: '',
        preferredDate: '',
        notes: ''
    });

    useEffect(() => {
        if (program?.schedule && program.schedule.length > 0 && !formData.preferredDate) {
            setFormData(prev => ({ ...prev, preferredDate: program.schedule[0] }));
        }
    }, [program]);

    if (!program) {
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
                programId: program.id,
                programTitle: program.title,
                bookingType: type,
                createdAt: new Date().toISOString(),
                status: 'pending'
            });
            setIsSuccess(true);
            window.scrollTo(0, 0);
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
                            ? `Votre demande d'atelier d'essai pour "${program.title}" a bien été reçue. Notre équipe vous recontactera très vite pour confirmer la date.`
                            : `Votre réservation pour "${program.title}" est en cours. Un conseiller MakerLab vous appellera pour finaliser l'inscription.`
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
        <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-black uppercase tracking-widest text-sm mb-8 hover:translate-x-1 transition-transform">
                    <ArrowLeft size={18} strokeWidth={3} /> Retour
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left: Info Card */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className={`p-6 border-4 border-black rounded-3xl shadow-neo ${type === 'trial' ? 'bg-brand-blue' : 'bg-brand-red text-white'}`}>
                            <div className="mb-4 inline-block bg-white text-black px-3 py-1 border-2 border-black font-black text-[10px] uppercase tracking-widest">
                                {type === 'trial' ? '🎁 Atelier Offert' : '📅 Réservation'}
                            </div>
                            <h2 className="font-display font-black text-3xl mb-4 leading-tight uppercase">{program.title}</h2>
                            <p className="font-bold opacity-90 mb-6">{program.shortDescription || program.description.substring(0, 100) + '...'}</p>
                            
                            <div className="space-y-3 pt-6 border-t-2 border-black/20 text-sm">
                                <div className="flex items-center gap-3">
                                    <Baby size={18} strokeWidth={3} />
                                    <span className="font-black">Age: {program.ageGroup}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Zap size={18} strokeWidth={3} />
                                    <span className="font-black">Format: {program.format}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Info size={18} strokeWidth={3} />
                                    <span className="font-black">Total: {type === 'trial' ? 'GRATUIT' : program.price}</span>
                                </div>
                                {program.spotsAvailable && (
                                    <div className="flex items-center gap-3 text-brand-orange font-black animate-pulse">
                                        <Zap size={18} fill="currentColor" />
                                        <span>Plus que {program.spotsAvailable} places !</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white p-6 border-4 border-black rounded-3xl shadow-neo-sm italic font-bold text-sm text-gray-500">
                             "La technologie ne doit pas être juste consommée, elle doit être créée. Rejoins l'aventure MakerLab !"
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="bg-white border-4 border-black rounded-[2.5rem] shadow-neo-xl p-8 md:p-10 space-y-6">
                            <h3 className="font-display font-black text-2xl uppercase tracking-wider mb-2">
                                {type === 'trial' ? "L'aventure commence ici" : "Réserver ma place"}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 font-black text-xs uppercase opacity-60"><User size={14} /> Nom du Parent / Tuteur</label>
                                    <input required type="text" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} className="w-full border-4 border-black p-3 font-bold focus:shadow-neo-sm outline-none transition-all rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 font-black text-xs uppercase opacity-60"><Baby size={14} /> Prénom de l'enfant</label>
                                    <input required type="text" value={formData.childName} onChange={e => setFormData({...formData, childName: e.target.value})} className="w-full border-4 border-black p-3 font-bold focus:shadow-neo-sm outline-none transition-all rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 font-black text-xs uppercase opacity-60"><Mail size={14} /> Email</label>
                                    <input required type="email" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} className="w-full border-4 border-black p-3 font-bold focus:shadow-neo-sm outline-none transition-all rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 font-black text-xs uppercase opacity-60"><Phone size={14} /> Téléphone</label>
                                    <input required type="tel" value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} className="w-full border-4 border-black p-3 font-bold focus:shadow-neo-sm outline-none transition-all rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 font-black text-xs uppercase opacity-60"><Calendar size={14} /> Date souhaitée</label>
                                    <select required value={formData.preferredDate} onChange={e => setFormData({...formData, preferredDate: e.target.value})} className="w-full border-4 border-black p-3 font-bold focus:shadow-neo-sm outline-none transition-all rounded-xl bg-white">
                                        {program.schedule?.map(date => (
                                            <option key={date} value={date}>{date}</option>
                                        ))}
                                        {(!program.schedule || program.schedule.length === 0) && <option value="a-convenir">À convenir avec l'équipe</option>}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 font-black text-xs uppercase opacity-60">Age de l'enfant</label>
                                    <input required type="text" value={formData.childAge} onChange={e => setFormData({...formData, childAge: e.target.value})} className="w-full border-4 border-black p-3 font-bold focus:shadow-neo-sm outline-none transition-all rounded-xl" placeholder="ex: 9 ans" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 font-black text-xs uppercase opacity-60">Message / Questions (optionnel)</label>
                                <textarea placeholder="Un besoin spécifique ?" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border-4 border-black p-3 font-bold focus:shadow-neo-sm outline-none transition-all rounded-xl min-h-[100px]" />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-brand-orange text-black py-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase text-xl tracking-widest flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Traitement en cours...' : (type === 'trial' ? "REJOINDRE L'ESSAI" : "RÉSERVER MA PLACE")}
                                <Zap size={24} className="fill-black" strokeWidth={3} />
                            </button>
                            
                            <p className="text-[10px] text-center font-bold opacity-40 uppercase tracking-widest mt-4">
                                En cliquant sur envoyer, vous acceptez nos conditions de réservation.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
