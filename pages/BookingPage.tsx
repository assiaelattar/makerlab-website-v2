import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Cpu,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { usePrograms } from '../contexts/ProgramContext';
import { useMissions } from '../contexts/MissionContext';
import { BookingCalendar } from '../components/BookingCalendar';
import { generateUpcomingInstances } from '../utils/slotUtils';
import { db } from '../firebase';

const fallbackImage = 'https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?auto=format&fit=crop&q=84&w=1200';

export const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getProgram } = usePrograms();
  const { missions, tracks, demoSlots, recurrentSlots, leads, updateDemoSlot } = useMissions();

  const availableSlots = useMemo(() => {
    if (!recurrentSlots || !demoSlots || !leads) return [];
    return generateUpcomingInstances(recurrentSlots, demoSlots, leads, 4);
  }, [recurrentSlots, demoSlots, leads]);

  const type = searchParams.get('type') || 'workshop';
  const missionId = searchParams.get('missionId');
  const trackId = searchParams.get('trackId');
  const program = getProgram(id || '');
  const isGeneralTrial = !program && id === 'trial';
  const activeProgram: any = program || (isGeneralTrial ? {
    id: 'trial',
    title: "Atelier d'essai MakerLab",
    description: "Découvrez MakerLab pendant une session de démonstration: robotique, code et fabrication.",
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
    ageGroup: '7-14 ans',
    format: 'Présentiel',
    price: 'Gratuit',
    category: 'Découverte',
    schedule: [],
  } : null);

  const selectedMission = missionId ? missions.find(mission => mission.id === missionId) : null;
  const selectedTrack = trackId ? tracks.find(track => track.id === trackId) : null;
  const bookingTitle = selectedMission?.title || selectedTrack?.title || activeProgram?.title || 'Réservation';
  const bookingPrice = selectedMission?.price || selectedTrack?.price || activeProgram?.price || 'Sur demande';
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
    notes: '',
  });

  useEffect(() => {
    if (activeProgram?.schedule?.length && !formData.preferredDate) {
      setFormData(previous => ({ ...previous, preferredDate: activeProgram.schedule[0] }));
    }
  }, [activeProgram?.id]);

  if (!activeProgram) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fa] p-4">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="font-display text-3xl font-bold">Programme non trouvé</h1>
          <button type="button" onClick={() => navigate('/programs')} className="ml-button mt-6 bg-slate-900 px-6 text-white">
            Retour aux programmes
          </button>
        </div>
      </main>
    );
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
        status: 'pending',
      });

      if (type === 'trial' && formData.demoSlotId) {
        const slot = demoSlots.find(item => item.id === formData.demoSlotId);
        if (slot) await updateDemoSlot(slot.id, { spotsLeft: Math.max(0, slot.spotsLeft - 1) });
      }
      setIsSuccess(true);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Une erreur est survenue. Veuillez réessayer ou nous contacter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fa] px-4 py-16">
        <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-7 text-center shadow-lg md:p-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-lg bg-brand-green text-white">
            <CheckCircle2 size={30} />
          </div>
          <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-brand-green">Demande reçue</p>
          <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">Nous confirmons la suite avec vous.</h1>
          <p className="mt-4 font-semibold leading-7 text-slate-600">
            Votre demande pour « {bookingTitle} » est enregistrée. L’équipe MakerLab vous contactera pour confirmer la date et les derniers détails.
          </p>
          <button type="button" onClick={() => navigate('/')} className="ml-button mt-7 bg-slate-900 px-6 text-white">
            Retour à l’accueil
          </button>
        </div>
      </main>
    );
  }

  const pageTitle = type === 'trial'
    ? "Réserver l'atelier d'essai"
    : type === 'annual'
      ? "Finaliser la demande d'inscription"
      : 'Réserver cette mission';

  const requestLabel = type === 'trial' ? 'Session découverte' : type === 'annual' ? 'Parcours annuel' : 'Atelier MakerLab';
  const trustItems = type === 'trial'
    ? ['Session gratuite', 'Sans engagement', 'Réponse sous 24h']
    : ['Aucun paiement en ligne', 'Confirmation par notre équipe', 'Réponse sous 24h'];

  const fieldClass = 'ml-field min-h-12 bg-[#f6f8fa] text-sm';
  const labelClass = 'mb-2 block text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500';

  return (
    <main className="min-h-screen bg-[#f6f8fa] px-4 pb-16 pt-6 md:px-8 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={() => navigate(-1)} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-slate-300">
          <ArrowLeft size={16} /> Retour au programme
        </button>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <aside className="hidden lg:block lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                <img src={activeProgram.image || fallbackImage} alt={bookingTitle} className="size-full object-cover" />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-[10px] font-extrabold uppercase text-slate-800 shadow-sm">{requestLabel}</span>
              </div>
              <div className="p-6">
                <h2 className="text-3xl font-extrabold leading-tight">{bookingTitle}</h2>
                <p className="mt-3 line-clamp-3 text-sm font-semibold leading-6 text-slate-500">{bookingDesc}</p>

                <dl className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
                  {[
                    { icon: Baby, label: 'Âge', value: selectedMission ? '7-12 ans' : selectedTrack ? '7-17 ans' : activeProgram.ageGroup },
                    { icon: Clock3, label: 'Format', value: selectedMission || selectedTrack ? 'Session Maker' : activeProgram.format || activeProgram.duration },
                    { icon: Cpu, label: 'Tarif', value: type === 'trial' ? 'Gratuit' : bookingPrice },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3 py-4">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue"><item.icon size={17} /></span>
                      <div>
                        <dt className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">{item.label}</dt>
                        <dd className="mt-1 text-sm font-extrabold text-slate-800">{item.value || 'À confirmer'}</dd>
                      </div>
                    </div>
                  ))}
                </dl>

                <p className="mt-5 flex items-start gap-2 text-xs font-semibold leading-5 text-slate-500">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-green" />
                  Cette demande ne déclenche aucun paiement. Notre équipe confirme chaque inscription avec le parent.
                </p>
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 lg:hidden">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange"><CalendarDays size={20} /></span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">{requestLabel}</p>
                <p className="truncate text-sm font-extrabold">{bookingTitle}</p>
              </div>
              <p className="shrink-0 text-sm font-extrabold text-brand-orange">{type === 'trial' ? 'Gratuit' : bookingPrice}</p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-8 lg:p-10">
              <div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-7 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-brand-orange">{requestLabel}</p>
                  <h1 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-[1.04] md:text-5xl">{pageTitle}</h1>
                  <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-500">Quelques informations suffisent. Nous vous contactons ensuite pour confirmer.</p>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-[11px] font-extrabold">
                  <span className="flex size-7 items-center justify-center rounded-full bg-slate-900 text-white">1</span>
                  <span className="text-slate-700">Informations</span>
                  <span className="h-px w-6 bg-slate-200" />
                  <span className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-slate-400">2</span>
                  <span className="text-slate-400">Confirmation</span>
                </div>
              </div>

              <div className="mt-7 grid gap-x-5 gap-y-5 md:grid-cols-2">
                <label>
                  <span className={labelClass}>Nom du parent</span>
                  <input required type="text" autoComplete="name" value={formData.parentName} onChange={event => setFormData({ ...formData, parentName: event.target.value })} placeholder="Fatima Zahra" className={fieldClass} />
                </label>
                <label>
                  <span className={labelClass}>Prénom de l’enfant</span>
                  <input required type="text" value={formData.childName} onChange={event => setFormData({ ...formData, childName: event.target.value })} placeholder="Youssef" className={fieldClass} />
                </label>
                <label>
                  <span className={labelClass}>Email de contact</span>
                  <input required type="email" autoComplete="email" value={formData.parentEmail} onChange={event => setFormData({ ...formData, parentEmail: event.target.value })} placeholder="parent@email.com" className={fieldClass} />
                </label>
                <label>
                  <span className={labelClass}>WhatsApp</span>
                  <input required type="tel" autoComplete="tel" value={formData.parentPhone} onChange={event => setFormData({ ...formData, parentPhone: event.target.value })} placeholder="06 00 00 00 00" className={fieldClass} />
                </label>

                {type === 'trial' ? (
                  <div className="md:col-span-2 border-t border-slate-100 pt-6">
                    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <h2 className="text-xl font-extrabold">Choisissez une session</h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">Les places disponibles sont mises à jour automatiquement.</p>
                      </div>
                      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-green/10 px-3 py-2 text-[10px] font-extrabold uppercase text-brand-green"><Zap size={14} /> Session gratuite</span>
                    </div>
                    <BookingCalendar
                      availableSlots={availableSlots}
                      selectedSlotId={formData.demoSlotId}
                      onSelect={slot => setFormData({
                        ...formData,
                        demoSlotId: slot.id,
                        preferredDate: slot.isoDate,
                        notes: `${formData.notes}\nSlot Time: ${slot.startTime}`,
                      })}
                    />
                    {availableSlots.length === 0 && (
                      <div className="rounded-lg border border-dashed border-slate-200 bg-[#f6f8fa] p-8 text-center text-sm font-extrabold text-slate-400">Aucun créneau disponible actuellement.</div>
                    )}
                  </div>
                ) : (
                  <label>
                    <span className={labelClass}>Date souhaitée</span>
                    <select required value={formData.preferredDate} onChange={event => setFormData({ ...formData, preferredDate: event.target.value })} className={fieldClass}>
                      {activeProgram.schedule?.map((date: string) => <option key={date} value={date}>{date}</option>)}
                      {!activeProgram.schedule?.length && <option value="a-convenir">À convenir avec l’équipe</option>}
                    </select>
                  </label>
                )}

                <label className={type === 'trial' ? 'md:col-span-2' : ''}>
                  <span className={labelClass}>Âge de l’enfant</span>
                  <input required type="text" inputMode="numeric" value={formData.childAge} onChange={event => setFormData({ ...formData, childAge: event.target.value })} placeholder="Ex. 11 ans" className={fieldClass} />
                </label>

                <label className="md:col-span-2 border-t border-slate-100 pt-6">
                  <span className={labelClass}>Message ou besoin particulier <span className="normal-case tracking-normal text-slate-400">(facultatif)</span></span>
                  <textarea value={formData.notes} onChange={event => setFormData({ ...formData, notes: event.target.value })} placeholder="Une passion particulière, une question ou une information utile pour le mentor..." className="ml-field min-h-[120px] resize-y bg-[#f6f8fa] text-sm" />
                </label>
              </div>

              <div className="mt-7 border-t border-slate-100 pt-7">
                <button type="submit" disabled={isSubmitting} className="ml-button w-full min-h-14 bg-brand-orange px-6 text-base text-white shadow-[0_12px_26px_rgba(232,119,34,.22)] disabled:opacity-50">
                  {isSubmitting ? 'Envoi en cours…' : type === 'trial' ? "Demander l'atelier d'essai" : "Envoyer la demande d'inscription"}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
                <div className="mt-5 grid gap-2 text-center sm:grid-cols-3">
                  {trustItems.map((item, index) => (
                    <p key={item} className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-500">
                      <span className={`flex size-5 items-center justify-center rounded-full ${index === 0 ? 'bg-brand-green/10 text-brand-green' : index === 1 ? 'bg-brand-blue/10 text-brand-blue' : 'bg-brand-orange/10 text-brand-orange'}`}>
                        {index === 0 ? <Check size={12} /> : index === 1 ? <ShieldCheck size={12} /> : <Sparkles size={12} />}
                      </span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};
