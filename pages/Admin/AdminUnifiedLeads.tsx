import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Building2, CheckCircle2, Inbox, Mail, MessageSquare, Phone, UserRound } from 'lucide-react';
import { db } from '../../firebase';

type LeadSource = 'contact' | 'school' | 'reservation';
type UnifiedLead = Record<string, any> & { id: string; sourceType: LeadSource; collectionName: string };

const sources: Array<{ id: LeadSource; collectionName: string; label: string }> = [
  { id: 'contact', collectionName: 'website-contact-leads', label: 'Contacts' },
  { id: 'school', collectionName: 'website-school-leads', label: 'Écoles' },
  { id: 'reservation', collectionName: 'reservation-submissions', label: 'Réservations LP' },
];

const timestamp = (lead: UnifiedLead) => {
  const value = lead.createdAt?.toDate?.() || lead.submittedAt;
  const date = value ? new Date(value) : new Date(0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};

export const AdminUnifiedLeads: React.FC = () => {
  const [leads, setLeads] = useState<UnifiedLead[]>([]);
  const [filter, setFilter] = useState<'all' | LeadSource>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bySource = new Map<LeadSource, UnifiedLead[]>();
    const publish = () => {
      setLeads(Array.from(bySource.values()).flat().sort((a, b) => timestamp(b) - timestamp(a)));
      setLoading(false);
    };
    const unsubscribers = sources.map(source => onSnapshot(collection(db, source.collectionName), snapshot => {
      bySource.set(source.id, snapshot.docs.map(item => ({
        ...item.data(),
        id: item.id,
        sourceType: source.id,
        collectionName: source.collectionName,
      })));
      publish();
    }, error => {
      console.error(`Unable to load ${source.collectionName}`, error);
      bySource.set(source.id, []);
      publish();
    }));
    return () => unsubscribers.forEach(unsubscribe => unsubscribe());
  }, []);

  const visibleLeads = useMemo(() => filter === 'all' ? leads : leads.filter(lead => lead.sourceType === filter), [filter, leads]);

  const markHandled = async (lead: UnifiedLead) => {
    await updateDoc(doc(db, lead.collectionName, lead.id), {
      status: 'Handled',
      handledAt: new Date().toISOString(),
    });
  };

  if (loading) return <div className="p-12 text-center font-black">Chargement des demandes…</div>;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-orange">Demandes entrantes</p>
          <h1 className="mt-2 font-display text-4xl font-black">Boîte de réception</h1>
          <p className="mt-2 font-semibold text-gray-500">Contacts, établissements et réservations provenant du site.</p>
        </div>
        <div className="rounded-xl border-2 border-black bg-white px-5 py-3 font-black shadow-neo-sm">{leads.length} demandes</div>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {[{ id: 'all', label: 'Toutes' }, ...sources].map(item => (
          <button key={item.id} onClick={() => setFilter(item.id as any)} className={`rounded-xl border-2 border-black px-4 py-2 text-sm font-black ${filter === item.id ? 'bg-black text-white' : 'bg-white'}`}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {visibleLeads.map(lead => {
          const name = lead.contactName || [lead.firstName, lead.lastName].filter(Boolean).join(' ') || lead.kidName || 'Demande sans nom';
          const handled = String(lead.status || '').toLowerCase() === 'handled';
          return (
            <article key={`${lead.collectionName}-${lead.id}`} className={`rounded-2xl border-2 border-black bg-white p-5 shadow-neo-sm ${handled ? 'opacity-65' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-[10px] font-black uppercase tracking-wide">{sources.find(source => source.id === lead.sourceType)?.label}</span>
                  <h2 className="mt-3 text-2xl font-black">{name}</h2>
                  {lead.institution && <p className="mt-1 flex items-center gap-2 text-sm font-bold text-gray-500"><Building2 size={15} /> {lead.institution}</p>}
                </div>
                {handled && <CheckCircle2 className="text-brand-green" />}
              </div>

              <div className="mt-5 grid gap-2 text-sm font-bold text-gray-600 sm:grid-cols-2">
                {lead.email && <a href={`mailto:${lead.email}`} className="flex items-center gap-2 hover:text-brand-blue"><Mail size={15} /> {lead.email}</a>}
                {lead.phone && <a href={`tel:${lead.phone}`} className="flex items-center gap-2 hover:text-brand-blue"><Phone size={15} /> {lead.phone}</a>}
                {lead.kidName && name !== lead.kidName && <p className="flex items-center gap-2"><UserRound size={15} /> Enfant : {lead.kidName}</p>}
                {lead.slot && <p>Créneau : {lead.slot}</p>}
                {lead.format && <p>Format : {lead.format}</p>}
                {lead.students && <p>Élèves : {lead.students}</p>}
                {lead.subject && <p className="sm:col-span-2">Sujet : {lead.subject}</p>}
              </div>

              {lead.message && <p className="mt-4 flex gap-2 rounded-xl bg-gray-50 p-4 text-sm font-semibold leading-6 text-gray-600"><MessageSquare size={16} className="mt-1 shrink-0" /> {lead.message}</p>}

              {!handled && (
                <button onClick={() => markHandled(lead)} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-green px-4 text-sm font-black text-white">
                  <CheckCircle2 size={16} /> Marquer comme traitée
                </button>
              )}
            </article>
          );
        })}
      </div>

      {visibleLeads.length === 0 && (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
          <Inbox className="mx-auto text-gray-300" size={42} />
          <p className="mt-4 font-black">Aucune demande dans cette catégorie.</p>
        </div>
      )}
    </div>
  );
};
