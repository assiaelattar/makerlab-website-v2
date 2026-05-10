import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Link as LinkIcon, Copy, CheckCircle2, Clock, X,
  Users, FileText, ExternalLink, RefreshCw, Filter,
  ChevronDown, MessageCircle, Camera, UserCheck, Search, Download
} from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';

// ─── Types ────────────────────────────────────────────────────────────────────
type LeadStatus =
  | 'new'          // just imported from CSV
  | 'link_sent'    // LP link was sent to parent
  | 'screenshot'   // parent sent payment screenshot
  | 'confirmed'    // form filled + confirmed
  | 'cancelled';   // dropped

interface MakeAndGoLead {
  id: string;
  fullName: string;       // kid's first name OR phone fallback
  kidAge?: string;        // e.g. "7-9 ans", "10-12 ans"
  phone: string;
  phoneVerified?: boolean; // from phone_number_verified column
  email?: string;
  kidName?: string;
  theme?: string;
  slot?: string;          // workshop slot e.g. "samedi 15h-18h"
  callSlot?: string;      // best time to call e.g. "matin 9h-12h"
  paymentIntent?: string; // payment answer from form
  parentRole?: string;    // "parent" | "grand-parent" | etc.
  source: string;
  status: LeadStatus;
  metaLeadId?: string;
  lpUrl?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  tags?: string[];        // qualification tags
}

// ─── Tags Catalog ─────────────────────────────────────────────────────────────
// Deux groupes : qualité du PARENT prospect / pas du tout un lead
const TAGS_CATALOG = [
  // 👪 Qualité du parent prospect
  { id: 'par_paye',        emoji: '💰', label: 'A payé / Converti',               group: 'Parent',   color: 'bg-emerald-100 text-emerald-700 border-emerald-400' },
  { id: 'par_chaud',       emoji: '🔥', label: 'Très motivé, prêt à payer',       group: 'Parent',   color: 'bg-green-100 text-green-700 border-green-400' },
  { id: 'par_interesse',   emoji: '👍', label: 'Intéressé mais hésite encore',    group: 'Parent',   color: 'bg-blue-100 text-blue-700 border-blue-300' },
  { id: 'par_retargeting', emoji: '🔄', label: 'À relancer — retargeting',        group: 'Parent',   color: 'bg-indigo-100 text-indigo-700 border-indigo-300' },
  { id: 'par_pas_dispo',   emoji: '📅', label: 'Intéressé mais pas dispo ce WE',  group: 'Parent',   color: 'bg-amber-100 text-amber-700 border-amber-300' },
  { id: 'par_questions',   emoji: '❓', label: 'A des questions sur le programme', group: 'Parent',   color: 'bg-sky-100 text-sky-700 border-sky-300' },
  { id: 'par_budget',      emoji: '💸', label: "Dit que c'est cher",              group: 'Parent',   color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { id: 'par_attente',     emoji: '⏳', label: '"On verra" — à convaincre',       group: 'Parent',   color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  { id: 'par_rappeler',    emoji: '📞', label: 'Demande à être rappelé',           group: 'Parent',   color: 'bg-violet-100 text-violet-700 border-violet-300' },
  // 🚫 Pas du tout un lead — à bloquer immédiatement
  { id: 'fake_enfant_joue',   emoji: '🎮', label: 'Enfant qui joue avec le tél',          group: 'Pas lead', color: 'bg-red-100 text-red-700 border-red-400' },
  { id: 'fake_enfant_rempli', emoji: '✏️', label: 'Enfant a rempli à la place du parent', group: 'Pas lead', color: 'bg-red-100 text-red-700 border-red-400' },
  { id: 'fake_ado_amuse',     emoji: '😜', label: "Ado / gamin qui s'amuse",              group: 'Pas lead', color: 'bg-red-100 text-red-700 border-red-400' },
  { id: 'fake_insultes',      emoji: '🚫', label: 'Insultes / bad words',                 group: 'Pas lead', color: 'bg-red-100 text-red-700 border-red-400' },
  { id: 'fake_faux_numero',   emoji: '👻', label: 'Faux numéro / arnaque',                group: 'Pas lead', color: 'bg-red-100 text-red-700 border-red-400' },
  { id: 'fake_spam',          emoji: '🤖', label: 'Spam / bot Meta',                      group: 'Pas lead', color: 'bg-red-100 text-red-700 border-red-400' },
] as const;
type TagId = typeof TAGS_CATALOG[number]['id'];
const TAG_MAP = Object.fromEntries(TAGS_CATALOG.map(t => [t.id, t])) as Record<TagId, typeof TAGS_CATALOG[number]>;
const BLOCK_TAGS = ['fake_enfant_joue', 'fake_enfant_rempli', 'fake_ado_amuse', 'fake_insultes', 'fake_faux_numero', 'fake_spam'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  new:        { label: 'Nouveau',        color: 'text-gray-700',   bg: 'bg-gray-100',    border: 'border-gray-300',  icon: <Users size={12} /> },
  link_sent:  { label: 'Lien Envoyé',   color: 'text-blue-700',   bg: 'bg-blue-100',    border: 'border-blue-300',  icon: <LinkIcon size={12} /> },
  screenshot: { label: 'Capture Reçue', color: 'text-yellow-700', bg: 'bg-yellow-100',  border: 'border-yellow-300',icon: <Camera size={12} /> },
  confirmed:  { label: 'Confirmé ✅',   color: 'text-green-700',  bg: 'bg-green-100',   border: 'border-green-300', icon: <CheckCircle2 size={12} /> },
  cancelled:  { label: 'Annulé',        color: 'text-red-700',    bg: 'bg-red-100',     border: 'border-red-300',   icon: <X size={12} /> },
};

const COLLECTION = 'make-and-go-leads';
const BASE_URL = 'https://space.makerlab.academy'; // production domain

/** Sanitize kid name to avoid showing technical ad names or phone numbers */
function cleanKidName(name: string | undefined) {
  if (!name) return 'votre enfant';
  const n = name.trim();
  // If it contains technical markers or looks like a phone number
  if (n.includes('_') || n.includes('CIL') || n.includes('LEAD') || n.includes('+') || /^\d+$/.test(n.replace(/\s/g,''))) {
    return 'votre enfant';
  }
  return n;
}

function generateLPUrl(lead: MakeAndGoLead) {
  const kid = cleanKidName(lead.kidName || lead.fullName.split(' ')[0]);
  const params = new URLSearchParams({
    kid,
    theme: lead.theme || 'Robotique',
    slot: lead.slot || 'ce weekend',
    from: 'form',
  });
  return `${BASE_URL}/reservation?${params.toString()}`;
}

// ─── Meta CSV/TSV Parser ──────────────────────────────────────────────────────
// Real Meta export: tab-separated, UTF-16LE with BOM.
// Columns (V3 form):
//   id, created_time, ad_id, ad_name, adset_id, adset_name,
//   campaign_id, campaign_name, form_id, form_name, is_organic, platform,
//   vous_êtes_?, âge_de_votre_enfant_?, horaire_de_votre_atelier_?,
//   créneau_pour_vous_appeler_?, pour_bloquer_la_place...,
//   phone_number, phone_number_verified, lead_status
function parseMetaCSV(text: string, sourceName: string): Omit<MakeAndGoLead, 'id'>[] {
  // Strip BOM (UTF-16LE or UTF-8)
  const clean = text.replace(/^\uFEFF/, '');
  const lines = clean.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  // Detect separator: tab (Meta default) or comma
  const sep = lines[0].includes('\t') ? '\t' : ',';

  // Lowercase + normalise accented chars for flexible matching
  const norm = (s: string) => s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9_]/g, '_');

  const rawHeaders = lines[0].split(sep).map(h => norm(h.trim().replace(/^"|"$/g, '')));

  const idx = (...patterns: string[]): number => {
    // 1. Try exact matches first to avoid partial matches like 'id' matching 'ad_id'
    for (const pat of patterns) {
      const i = rawHeaders.findIndex(h => h === pat);
      if (i !== -1) return i;
    }
    // 2. Try partial matches, but exclude common Meta fields if searching for a 'name'
    for (const pat of patterns) {
      const i = rawHeaders.findIndex(h => {
        if (!h.includes(pat)) return false;
        // If searching for name/firstname, ignore ad_name, campaign_name, etc.
        if (['name', 'full_name', 'first_name', 'prenom', 'nom'].includes(pat)) {
          if (h.includes('ad_') || h.includes('campaign_') || h.includes('form_') || h.includes('adset_')) return false;
        }
        return true;
      });
      if (i !== -1) return i;
    }
    return -1;
  };

  // ── Column index mapping (V3 form) ──────────────────────────────────────────
  const iId            = idx('id');
  const iCreated       = idx('created_time', 'created');
  const iKidName       = idx('full_name', 'first_name', 'prenom_de_l', 'pr_nom_de_l', 'nom_de_l', 'kid_name', 'parent_name', 'nom');
  // V3: "âge de votre enfant ?" → normalised = "age_de_votre_enfant"
  const iAge           = idx('age_de_votre_enfant', 'ge_de_votre', 'age_de_l', 'ge_de_l', 'age');
  // V3: "horaire de votre atelier ?" → normalised = "horaire_de_votre_atelier"
  const iSlot          = idx('horaire_de_votre_atelier', 'horaire', 'neau_samedi', 'neau_dimanche', 'creneau_samedi', 'creneau_dimanche', 'neau', 'slot', 'session');
  // V3: "créneau pour vous appeler ?" → normalised = "cr_neau_pour_vous_appeler"
  const iCallSlot      = idx('cr_neau_pour_vous_appeler', 'creneau_pour_vous', 'appeler', 'call_slot');
  // V3: "pour bloquer la place..." → payment intent
  const iPaymentIntent = idx('pour_bloquer', 'bloquer_la_place', 'reglez', 'r_glez', 'payment', 'paiement');
  // V3: "vous êtes ?" → parent role
  const iParentRole    = idx('vous__tes', 'vous_etes', 'vous_es', 'you_are', 'role');
  const iPhone         = idx('phone_number', 'phone', 'telephone', 't_l_phone', 'mobile');
  const iPhoneVerified = idx('phone_number_verified', 'phone_verified', 'verified');
  const iEmail         = idx('email', 'mail');

  // Helper: humanise underscore-joined answer values from Meta
  const humanise = (s: string) => s.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

  const now = new Date().toISOString();

  return lines.slice(1).map(line => {
    const cols = line.split(sep).map(c => c.replace(/^"|"$/g, '').trim());
    const get = (i: number) => (i !== -1 && cols[i]) ? cols[i] : '';

    const kidName       = get(iKidName);
    const rawPhone      = get(iPhone).replace(/^p:/, ''); // Meta prefixes with "p:"
    const metaId        = get(iId).replace(/^l:/, '');
    const slot          = humanise(get(iSlot));
    const kidAge        = humanise(get(iAge));
    const callSlot      = humanise(get(iCallSlot));
    const paymentIntent = humanise(get(iPaymentIntent));
    const parentRole    = humanise(get(iParentRole));
    const phoneVerifiedRaw = get(iPhoneVerified);
    const phoneVerified = phoneVerifiedRaw === 'true' ? true : phoneVerifiedRaw === 'false' ? false : undefined;
    const email         = get(iEmail);
    const rawDate       = get(iCreated);
    let created = now;
    if (rawDate) { try { created = new Date(rawDate).toISOString(); } catch { /**/ } }

    return {
      fullName:       kidName || rawPhone || 'Inconnu',
      kidName:        kidName  || undefined,
      kidAge:         kidAge   || undefined,
      phone:          rawPhone,
      phoneVerified:  phoneVerified,
      email:          email    || undefined,
      slot:           slot     || undefined,
      callSlot:       callSlot || undefined,
      paymentIntent:  paymentIntent || undefined,
      parentRole:     parentRole    || undefined,
      theme:          'Robotique',
      source:         sourceName,
      metaLeadId:     metaId   || undefined,
      status:         'new' as LeadStatus,
      createdAt:      created,
      updatedAt:      now,
    };
  }).filter(l => l.phone || l.fullName !== 'Inconnu');
}

// ─── Component ────────────────────────────────────────────────────────────────

/** Firestore does NOT accept `undefined` fields — this strips them recursively */
function cleanDoc<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v === v /* NaN check */)
  ) as Partial<T>;
}

export const AdminMakeAndGoLeads: React.FC = () => {
  const [leads, setLeads] = useState<MakeAndGoLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<{
    newLeads: Omit<MakeAndGoLead, 'id'>[],
    duplicates: Omit<MakeAndGoLead, 'id'>[],
  } | null>(null);
  const [importSource, setImportSource] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ id: string; value: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Firestore listener ──
  useEffect(() => {
    const unsub = onSnapshot(collection(db, COLLECTION), snap => {
      const data = snap.docs.map(d => ({ ...d.data(), id: d.id } as MakeAndGoLead));
      // Sort by import time (newest first) — importedAt is when WE added it, createdAt is Meta's form date
      data.sort((a, b) => {
        const ta = new Date(a.importedAt || a.updatedAt || a.createdAt).getTime();
        const tb = new Date(b.importedAt || b.updatedAt || b.createdAt).getTime();
        return tb - ta;
      });
      setLeads(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── CSV import — try UTF-16LE (Meta default) then fall back to UTF-8 ──
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const doRead = (encoding: string) => {
      const reader = new FileReader();
      reader.onload = ev => {
        const text = (ev.target?.result as string) || '';
        const date = new Date().toLocaleDateString('fr-FR');
        const name = file.name.replace(/\.csv$/i, '');
        const source = `Meta — ${name} (${date})`;
        setImportSource(source);
        const parsed = parseMetaCSV(text, source);

        // ── Deduplication: build a set of existing keys from current Firestore state
        // Key priority: metaLeadId (Meta's own ID) > phone number
        const existingMetaIds = new Set(
          leads.map(l => l.metaLeadId).filter(Boolean)
        );
        const existingPhones = new Set(
          leads.map(l => l.phone.replace(/[^0-9]/g, '')).filter(Boolean)
        );

        const newLeads: typeof parsed = [];
        const duplicates: typeof parsed = [];

        for (const lead of parsed) {
          const normPhone = lead.phone.replace(/[^0-9]/g, '');
          const isDup =
            (lead.metaLeadId && existingMetaIds.has(lead.metaLeadId)) ||
            (normPhone && existingPhones.has(normPhone));

          if (isDup) duplicates.push(lead);
          else newLeads.push(lead);
        }

        setImportPreview({ newLeads, duplicates });
      };
      reader.readAsText(file, encoding);
    };

    // Sniff BOM: read first 2 bytes
    const sniffer = new FileReader();
    sniffer.onload = ev => {
      const buf = ev.target?.result as ArrayBuffer;
      const bytes = new Uint8Array(buf.slice(0, 2));
      // UTF-16LE BOM = 0xFF 0xFE
      const enc = (bytes[0] === 0xFF && bytes[1] === 0xFE) ? 'UTF-16LE' : 'UTF-8';
      doRead(enc);
    };
    sniffer.readAsArrayBuffer(file.slice(0, 2));
    e.target.value = '';
  };

  const confirmImport = async () => {
    if (!importPreview) return;
    const { newLeads } = importPreview;
    if (newLeads.length === 0) { setImportPreview(null); return; }
    setImporting(true);
    let saved = 0;
    try {
      for (const lead of newLeads) {
        const id = `mag-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const now = new Date().toISOString();
        const full: MakeAndGoLead = {
          ...lead,
          id,
          importedAt: now,
          lpUrl: generateLPUrl({ ...lead, id } as MakeAndGoLead),
        };
        // Firestore rejects `undefined` — strip all undefined/null fields
        const safe = cleanDoc(full) as MakeAndGoLead;
        await setDoc(doc(db, COLLECTION, id), safe);
        saved++;
        await new Promise(r => setTimeout(r, 80));
      }
      setImportPreview(null);
      alert(`✅ ${saved} nouveau(x) lead(s) importé(s) !`);
    } catch (err: any) {
      const msg = err?.message || JSON.stringify(err);
      alert(`❌ Erreur import (lead ${saved + 1}/${newLeads.length}) :\n${msg}`);
      console.error('Import error:', err);
    }
    setImporting(false);
  };

  // ── Status update ──
  const updateStatus = async (id: string, status: LeadStatus) => {
    await updateDoc(doc(db, COLLECTION, id), { status, updatedAt: new Date().toISOString() });
  };

  // ── Copy LP link ──
  const copyLink = (lead: MakeAndGoLead) => {
    const url = lead.lpUrl || generateLPUrl(lead);
    navigator.clipboard.writeText(url);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2000);
    // Auto-advance to link_sent if still "new"
    if (lead.status === 'new') updateStatus(lead.id, 'link_sent');
  };

  const openWhatsApp = (lead: MakeAndGoLead) => {
    const url = lead.lpUrl || generateLPUrl(lead);
    const phone = lead.phone.replace(/[^0-9]/g, '');
    const intl = phone.startsWith('0') ? `212${phone.slice(1)}` : phone.startsWith('212') ? phone : `212${phone}`;
    const kidFirst = cleanKidName(lead.kidName || lead.fullName.split(' ')[0]);
    
    const isGeneric = kidFirst === 'votre enfant';
    const reservationText = isGeneric ? "votre réservation" : `la réservation de ${kidFirst}`;

    const msg = encodeURIComponent(
`Salam chers parents,

Merci pour votre intérêt pour MakerLab Academy !

Voici le lien pour finaliser ${reservationText} :
${url}

La place est réservée jusqu'à ce soir uniquement.`
    );
    window.open(`https://wa.me/${intl}?text=${msg}`, '_blank');
    if (lead.status === 'new') updateStatus(lead.id, 'link_sent');
  };

  const saveNotes = async () => {
    if (!editingNotes) return;
    await updateDoc(doc(db, COLLECTION, editingNotes.id), { notes: editingNotes.value, updatedAt: new Date().toISOString() });
    setEditingNotes(null);
  };

  // ── Toggle tag on a lead ──
  const toggleTag = async (lead: MakeAndGoLead, tagId: string) => {
    const current = lead.tags || [];
    const next = current.includes(tagId)
      ? current.filter(t => t !== tagId)
      : [...current, tagId];
    const updates: Record<string, unknown> = { tags: next, updatedAt: new Date().toISOString() };
    // Auto-cancel if a block tag is activated
    if (!current.includes(tagId) && BLOCK_TAGS.includes(tagId)) {
      updates.status = 'cancelled';
    }
    await updateDoc(doc(db, COLLECTION, lead.id), updates);
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm('Supprimer ce lead ?')) return;
    await deleteDoc(doc(db, COLLECTION, id));
  };

  // ── Export Meta Custom Audience CSV ──────────────────────────────────────────
  // Format based on: https://web.facebook.com/business/help/2082575038703844
  // Columns: email, phone, fn, ln, country, value
  // Value scoring: status base + tag bonuses → Meta learns who's valuable
  // Phone: must include country code (+212 for Morocco)
  const exportMetaCSV = () => {
    const STATUS_VALUE: Record<LeadStatus, number> = {
      confirmed:  3,
      screenshot: 2,
      link_sent:  1,
      new:        0.1,
      cancelled:  0,
    };

    // Tag bonuses — signal la qualité du parent prospect à Meta
    const TAG_BONUS: Record<string, number> = {
      par_paye:        1.0,  // a payé = signal le plus fort
      par_chaud:       0.6,  // très motivé
      par_interesse:   0.3,  // intéressé mais pas encore là
      par_retargeting: 0.2,  // vrai prospect à relancer
      par_pas_dispo:   0.2,  // intéressé, juste mauvais timing
      par_questions:   0.2,  // engagé, cherche à comprendre
      par_rappeler:    0.1,
      par_budget:      0.0,  // neutre — peut devenir client
      par_attente:     0.0,  // neutre
    };

    // Build rows — skip cancelled (block-tagged leads are already cancelled)
    const rows = leads
      .filter(l => l.status !== 'cancelled')
      .map(l => {
        // Normalise phone → +212XXXXXXXXX format
        const rawPhone = l.phone.replace(/[^0-9]/g, '');
        let phone = rawPhone;
        if (rawPhone.startsWith('0') && rawPhone.length === 10) {
          phone = `+212${rawPhone.slice(1)}`;
        } else if (rawPhone.startsWith('212')) {
          phone = `+${rawPhone}`;
        } else if (!rawPhone.startsWith('+')) {
          phone = `+212${rawPhone}`;
        }

        // Split name: first word = fn, rest = ln
        const nameParts = (l.kidName || l.fullName || '').trim().split(' ');
        const fn = nameParts[0] || '';
        const ln = nameParts.slice(1).join(' ') || '';

        const email = l.email || '';

        // Base score from status + bonus from tags
        const baseValue = STATUS_VALUE[l.status] ?? 0.1;
        const tagBonus = (l.tags || []).reduce((sum, tid) => sum + (TAG_BONUS[tid] ?? 0), 0);
        const value = Math.round((baseValue + tagBonus) * 10) / 10; // round to 1 decimal

        const tagList = (l.tags || []).join('|');
        const notes = l.notes ? `"${l.notes.replace(/"/g, "'")}"` : '';

        // Meta columns: email,phone,fn,ln,country,value
        // Extra cols prefixed with _ are ignored by Meta but kept for our records
        return [email, phone, fn, ln, 'MA', value, l.status, tagList, notes].join(',');
      });

    // Header — exact column names Meta expects first, then our internal cols
    const header = 'email,phone,fn,ln,country,value,_status,_tags,_notes';
    const csv = [header, ...rows].join('\r\n');

    // Trigger download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `makerlab_meta_audience_${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Fix all LP URLs (replace localhost/subdomain with makerlab.ma) ──
  const [fixing, setFixing] = useState(false);
  const fixAllUrls = async () => {
    const broken = leads.filter(l =>
      !l.lpUrl || l.lpUrl.includes('localhost') || !l.lpUrl.startsWith('https://space.makerlab.academy')
    );
    if (broken.length === 0) { alert('\u2705 Tous les liens sont déjà corrects !'); return; }
    if (!window.confirm(`Corriger ${broken.length} lien(s) vers space.makerlab.academy ?`)) return;
    setFixing(true);
    for (const lead of broken) {
      const newUrl = generateLPUrl(lead);
      await updateDoc(doc(db, COLLECTION, lead.id), { lpUrl: newUrl, updatedAt: new Date().toISOString() });
    }
    setFixing(false);
    alert(`\u2705 ${broken.length} lien(s) corrigé(s) !`);
  };

  // ── Filter ──
  const filtered = leads.filter(l => {
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || l.fullName.toLowerCase().includes(q) || l.phone.includes(q) || (l.kidName || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display font-black text-4xl uppercase tracking-tight flex items-center gap-3">
            <Users className="text-brand-orange" size={36} /> Make &amp; Go Leads
          </h1>
          <p className="text-gray-500 font-bold mt-2">Import CSV Meta → Générer LP → Gérer les statuts</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {/* Fix broken URLs (localhost / subdomain) */}
          {leads.some(l => !l.lpUrl || l.lpUrl.includes('localhost') || !l.lpUrl.startsWith('https://space.makerlab.academy')) && (
            <button
              onClick={fixAllUrls}
              disabled={fixing}
              title="Corriger les liens localhost/subdomain vers makerlab.ma"
              className="flex items-center gap-2 px-4 py-3 bg-yellow-400 text-black font-black uppercase text-xs border-4 border-black rounded-xl shadow-[4px_4px_0_0_black] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              <RefreshCw size={15} className={fixing ? 'animate-spin' : ''} /> Fix URLs
            </button>
          )}
          {/* Export Meta Audience CSV */}
          {leads.filter(l => l.status !== 'cancelled').length > 0 && (
            <button
              onClick={exportMetaCSV}
              title="Exporter pour Meta Custom Audience (Value-based Lookalike)"
              className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white font-black uppercase text-xs border-4 border-black rounded-xl shadow-[4px_4px_0_0_black] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
            >
              <Download size={15} /> Export Meta
            </button>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-5 py-3 bg-brand-orange text-black font-black uppercase text-sm border-4 border-black rounded-xl shadow-[4px_4px_0_0_black] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
          >
            <Upload size={18} /> Importer CSV Meta
          </button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileSelect} />
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map(s => {
          const cfg = STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              className={`flex flex-col items-center p-4 rounded-2xl border-4 transition-all font-black text-center
                ${filterStatus === s ? `${cfg.bg} ${cfg.border} shadow-[4px_4px_0_0_black] -translate-y-1` : 'bg-white border-gray-200 hover:border-gray-400'}`}
            >
              <span className={`text-2xl font-black ${cfg.color}`}>{counts[s] || 0}</span>
              <span className={`text-[10px] uppercase mt-1 ${filterStatus === s ? cfg.color : 'text-gray-500'}`}>{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Import Preview Modal */}
      {importPreview && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-black shadow-[10px_10px_0_0_black] w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-xl uppercase">Aperçu Import</h2>
              <button onClick={() => setImportPreview(null)} className="w-9 h-9 border-2 border-black rounded-full flex items-center justify-center hover:bg-gray-100"><X size={18} /></button>
            </div>

            {/* Summary bar */}
            <div className="flex gap-3 mb-5">
              <div className="flex-1 bg-green-50 border-2 border-green-400 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-green-700">{importPreview.newLeads.length}</p>
                <p className="text-[10px] font-black uppercase text-green-600">Nouveaux ✅</p>
              </div>
              <div className="flex-1 bg-gray-50 border-2 border-gray-300 rounded-xl p-3 text-center">
                <p className="text-2xl font-black text-gray-400">{importPreview.duplicates.length}</p>
                <p className="text-[10px] font-black uppercase text-gray-400">Déjà importés ⏭️</p>
              </div>
            </div>

            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Source: {importSource}</p>

            {/* New leads list */}
            {importPreview.newLeads.length > 0 ? (
              <div className="space-y-2 mb-4 max-h-[35vh] overflow-y-auto">
                <p className="text-[10px] font-black uppercase text-green-600 mb-2">✅ Seront ajoutés :</p>
                {importPreview.newLeads.map((l, i) => (
                  <div key={i} className="bg-green-50 border-2 border-green-200 rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-black text-sm">{l.fullName}</span>
                        <span className="ml-3 text-xs text-gray-500 font-mono">{l.phone}</span>
                        {l.phoneVerified === true  && <span className="ml-2 text-[10px] bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full font-black">✓ Vérifié</span>}
                        {l.phoneVerified === false && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-black">✗ Non vérifié</span>}
                      </div>
                      <span className="text-[10px] bg-green-200 text-green-800 px-2 py-1 rounded-full font-black uppercase">Nouveau</span>
                    </div>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {l.parentRole    && <span className="text-[10px] bg-purple-100 text-purple-700 font-black px-2 py-0.5 rounded-full">👤 {l.parentRole}</span>}
                      {l.kidAge        && <span className="text-[10px] bg-blue-100 text-blue-700 font-black px-2 py-0.5 rounded-full">👶 {l.kidAge}</span>}
                      {l.slot          && <span className="text-[10px] bg-orange-100 text-orange-700 font-black px-2 py-0.5 rounded-full">🕐 {l.slot}</span>}
                      {l.callSlot      && <span className="text-[10px] bg-sky-100 text-sky-700 font-black px-2 py-0.5 rounded-full">📞 {l.callSlot}</span>}
                      {l.paymentIntent && <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full">💬 {l.paymentIntent}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-4 text-center">
                <p className="font-black text-yellow-700">⚠️ Aucun nouveau lead</p>
                <p className="text-xs text-yellow-600 mt-1">Tous les leads de ce fichier sont déjà dans votre table.</p>
              </div>
            )}

            {/* Duplicates (collapsed, just count) */}
            {importPreview.duplicates.length > 0 && (
              <p className="text-[10px] text-gray-400 font-bold mb-4">
                ⏭️ {importPreview.duplicates.length} lead(s) ignoré(s) — déjà présents (même ID Meta ou même numéro).
              </p>
            )}

            <div className="flex gap-3">
              <button onClick={() => setImportPreview(null)} className="flex-1 py-3 border-4 border-black rounded-xl font-black uppercase text-sm hover:bg-gray-50">Annuler</button>
              <button
                onClick={confirmImport}
                disabled={importing || importPreview.newLeads.length === 0}
                className="flex-1 py-3 bg-brand-orange border-4 border-black rounded-xl font-black uppercase text-sm shadow-[4px_4px_0_0_black] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {importing
                  ? 'Import en cours...'
                  : importPreview.newLeads.length === 0
                    ? 'Rien à importer'
                    : `✅ Importer ${importPreview.newLeads.length} nouveau(x)`
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone, enfant..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-4 border-black rounded-xl font-bold text-sm focus:outline-none focus:border-brand-orange bg-white"
          />
        </div>
        <button
          onClick={() => { setFilterStatus('all'); setSearch(''); }}
          className="px-4 py-3 border-4 border-black rounded-xl font-black uppercase text-xs hover:bg-gray-100 transition-all flex items-center gap-2"
        >
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {/* Leads Table */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-orange rounded-full animate-spin mb-4" />
          <p className="font-black uppercase text-sm">Chargement...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white border-4 border-dashed border-gray-200 rounded-3xl">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-black text-xl mb-2">Aucun lead trouvé</h3>
          <p className="text-gray-500 font-bold text-sm">Importez un fichier CSV depuis Meta Lead Forms pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(lead => {
            const cfg = STATUS_CONFIG[lead.status];
            const isExpanded = expandedId === lead.id;
            const lpUrl = lead.lpUrl || generateLPUrl(lead);

            return (
              <div key={lead.id} className="bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0_0_black] transition-all">
                {/* Main Row */}
                <div className="p-4 flex flex-wrap items-center gap-3">

                  {/* Status Badge */}
                  <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border-2 shrink-0 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                    {cfg.icon} {cfg.label}
                  </span>

                  {/* Lead Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-lg tracking-tight">{lead.fullName}</span>
                        {lead.phoneVerified === true && <CheckCircle2 size={14} className="text-green-500" />}
                      </div>
                      <span className="inline-flex items-center px-3 py-1 bg-black text-white text-sm font-mono font-black rounded-lg border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,0.2)]">
                        {lead.phone}
                      </span>

                      {/* ⚡ PRIORITY ACTION TAGS */}
                      {lead.paymentIntent && (() => {
                        const p = lead.paymentIntent.toLowerCase();
                        const needsCall = p.includes('question') || p.includes('appel') || p.includes('appelle') || p.includes('appeler');
                        const needsRib  = p.includes('virement') || p.includes('rib') || p.includes('bancaire');
                        const surPlace  = p.includes('sur place') || p.includes('sur_place');
                        const gratuit   = p.includes('gratuit');
                        
                        if (needsCall) return (
                          <span className="animate-pulse flex items-center gap-1.5 px-4 py-1.5 bg-red-600 text-white text-xs font-black uppercase rounded-xl border-2 border-black shadow-[4px_4px_0_0_black]">
                            <MessageCircle size={16} /> À APPELER 📞
                          </span>
                        );
                        if (needsRib) return (
                          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-orange text-black text-xs font-black uppercase rounded-xl border-2 border-black shadow-[4px_4px_0_0_black]">
                            <Copy size={16} /> À ENVOYER LE RIB 💰
                          </span>
                        );
                        if (surPlace) return (
                          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white text-xs font-black uppercase rounded-xl border-2 border-black shadow-[4px_4px_0_0_black]">
                            <Clock size={16} /> SUR PLACE 📍
                          </span>
                        );
                        if (gratuit) return (
                          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-400 text-white text-xs font-black uppercase rounded-xl border-2 border-black shadow-[4px_4px_0_0_black]">
                            <X size={16} /> PENSE GRATUIT 🚫
                          </span>
                        );
                        return null;
                      })()}
                    </div>

                    {/* Secondary Info Badges */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {lead.parentRole && (
                        <span className="text-[10px] bg-purple-50 text-purple-700 font-black px-2 py-0.5 rounded-md border border-purple-200 capitalize">
                          👤 {lead.parentRole}
                        </span>
                      )}
                      {lead.kidAge && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-black px-2 py-0.5 rounded-md border border-blue-200">
                          👶 {lead.kidAge}
                        </span>
                      )}
                      {lead.slot && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-md border border-emerald-200">
                          🕐 {lead.slot}
                        </span>
                      )}
                      {lead.callSlot && (
                        <span className="text-[10px] bg-sky-50 text-sky-700 font-black px-2 py-0.5 rounded-md border border-sky-200">
                          📞 Appeler : {lead.callSlot}
                        </span>
                      )}
                    </div>

                    {/* Form Answer (Full Sentence) */}
                    {lead.paymentIntent && (
                      <div className="bg-gray-50 border-l-4 border-gray-300 px-3 py-1.5 mb-2 rounded-r-md">
                        <p className="text-[11px] font-bold text-gray-600 italic line-clamp-1">
                          &quot;{lead.paymentIntent}&quot;
                        </p>
                      </div>
                    )}

                    {/* Footer Info: Tags & Date */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] text-gray-400 font-bold">{new Date(lead.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-[10px] text-gray-400 italic truncate max-w-[120px]">{lead.source}</span>
                      
                      {/* Qualification Tags */}
                      {(lead.tags || []).map(tid => {
                        const t = TAG_MAP[tid as TagId];
                        if (!t) return null;
                        return (
                          <span key={tid} className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${t.color}`}>
                            {t.emoji} {t.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* WhatsApp send */}
                    <button
                      onClick={() => openWhatsApp(lead)}
                      title="Envoyer lien via WhatsApp"
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#25D366] text-white font-black text-xs rounded-xl border-2 border-black hover:opacity-90 transition-all"
                    >
                      <MessageCircle size={14} /> WA
                    </button>

                    {/* Copy link */}
                    <button
                      onClick={() => copyLink(lead)}
                      title="Copier le lien LP"
                      className={`flex items-center gap-1.5 px-3 py-2 font-black text-xs rounded-xl border-2 border-black transition-all
                        ${copiedId === lead.id ? 'bg-green-400 text-white' : 'bg-white text-black hover:bg-gray-50'}`}
                    >
                      {copiedId === lead.id ? <><CheckCircle2 size={14} /> Copié</> : <><Copy size={14} /> Lien</>}
                    </button>

                    {/* Status dropdown */}
                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                      className="text-[10px] font-black uppercase p-2 border-2 border-black rounded-xl bg-white cursor-pointer"
                    >
                      {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map(s => (
                        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                      ))}
                    </select>

                    {/* Expand */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                      className="p-2 border-2 border-gray-200 rounded-xl hover:border-black transition-all"
                    >
                      <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded Panel */}
                {isExpanded && (
                  <div className="border-t-4 border-dashed border-gray-100 bg-gray-50 p-4 space-y-3">

                    {/* LP URL */}
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1">🔗 Lien Landing Page</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-xs bg-white border-2 border-gray-200 rounded-lg px-3 py-2 font-mono text-gray-700 truncate">{lpUrl}</code>
                        <a href={lpUrl} target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>

                    {/* 🏷️ Tags — qualité parent & blocage */}
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-2">🏷️ Tags rapides — cliquez pour activer/désactiver</p>

                      {/* Profil parent prospect */}
                      <p className="text-[9px] font-black uppercase text-gray-300 mb-1.5">👪 Qualité du parent prospect</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {TAGS_CATALOG.filter(t => t.group === 'Parent').map(tag => {
                          const active = (lead.tags || []).includes(tag.id);
                          return (
                            <button
                              key={tag.id}
                              onClick={() => toggleTag(lead, tag.id)}
                              className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full border-2 transition-all ${
                                active
                                  ? `${tag.color} shadow-[2px_2px_0_0_rgba(0,0,0,0.15)] scale-105`
                                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-600'
                              }`}
                            >
                              {tag.emoji} {tag.label}{active && <span className="ml-0.5">✓</span>}
                            </button>
                          );
                        })}
                      </div>

                      {/* Pas du tout un lead */}
                      <div className="bg-red-50 border-2 border-red-300 rounded-xl p-2">
                        <p className="text-[9px] font-black uppercase text-red-400 mb-1.5">🚫 Pas du tout un lead — sera automatiquement annulé</p>
                        <div className="flex flex-wrap gap-1.5">
                          {TAGS_CATALOG.filter(t => t.group === 'Pas lead').map(tag => {
                            const active = (lead.tags || []).includes(tag.id);
                            return (
                              <button
                                key={tag.id}
                                onClick={() => toggleTag(lead, tag.id)}
                                className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full border-2 transition-all ${
                                  active
                                    ? 'bg-red-500 text-white border-red-700 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] scale-105'
                                    : 'bg-white text-red-400 border-red-200 hover:border-red-400'
                                }`}
                              >
                                {tag.emoji} {tag.label}{active && <span className="ml-0.5">✓</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400 mb-1">📝 Notes internes</p>
                      {editingNotes?.id === lead.id ? (
                        <div className="flex gap-2">
                          <textarea
                            value={editingNotes.value}
                            onChange={e => setEditingNotes({ id: lead.id, value: e.target.value })}
                            className="flex-1 text-sm p-2 border-2 border-black rounded-xl font-medium resize-none"
                            rows={2}
                          />
                          <div className="flex flex-col gap-2">
                            <button onClick={saveNotes} className="px-3 py-1 bg-green-400 border-2 border-black rounded-lg font-black text-xs">✓ Save</button>
                            <button onClick={() => setEditingNotes(null)} className="px-3 py-1 bg-gray-200 border-2 border-black rounded-lg font-black text-xs">✗</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingNotes({ id: lead.id, value: lead.notes || '' })}
                          className="w-full text-left text-sm p-2 border-2 border-dashed border-gray-300 rounded-xl hover:border-black bg-white transition-all text-gray-500 font-medium min-h-[40px]"
                        >
                          {lead.notes || 'Cliquez pour ajouter une note...'}
                        </button>
                      )}
                    </div>

                    {/* Status History shortcuts */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-black uppercase text-gray-400 w-full">Changer statut :</span>
                      {(Object.keys(STATUS_CONFIG) as LeadStatus[]).filter(s => s !== lead.status).map(s => {
                        const c = STATUS_CONFIG[s];
                        return (
                          <button
                            key={s}
                            onClick={() => updateStatus(lead.id, s)}
                            className={`flex items-center gap-1 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border-2 transition-all hover:opacity-80 ${c.bg} ${c.color} ${c.border}`}
                          >
                            {c.icon} {c.label}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="ml-auto text-[10px] font-black uppercase px-3 py-1.5 rounded-full border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tip box */}
      <div className="mt-8 bg-indigo-50 border-4 border-indigo-500 rounded-2xl p-5">
        <h3 className="font-black text-sm uppercase mb-2 text-indigo-900">💡 Comment ça marche</h3>
        <ol className="text-sm text-indigo-800 font-medium space-y-1 list-decimal list-inside">
          <li>Téléchargez le CSV depuis Meta Business → Formulaires → Leads Center</li>
          <li>Cliquez <strong>Importer CSV Meta</strong> ici et prévisualisez les leads</li>
          <li>Cliquez <strong>WA</strong> pour envoyer le lien de la LP directement via WhatsApp → statut passe à "Lien Envoyé"</li>
          <li>Quand le parent envoie la capture, changez le statut en <strong>Capture Reçue</strong></li>
          <li>Quand le formulaire est rempli et validé, passez en <strong>Confirmé ✅</strong></li>
        </ol>
      </div>

      {/* Export guide */}
      <div className="mt-4 bg-violet-50 border-4 border-violet-400 rounded-2xl p-5">
        <h3 className="font-black text-sm uppercase mb-1 text-violet-900">📤 Export Meta — Ce que Meta reçoit par lead</h3>
        <p className="text-xs text-violet-700 font-medium mb-3">
          Meta reçoit un <strong>score (value)</strong> = statut de base + bonus du tag parent.
          Plus le score est élevé, plus Meta cible des parents similaires à vos <em>meilleurs</em> acheteurs.
        </p>

        {/* Status base */}
        <p className="text-[9px] font-black uppercase text-violet-400 mb-1.5">Score de base — statut du lead</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {[
            { label: 'Confirmé ✅', value: '3.0', color: 'bg-green-100 text-green-800 border-green-300' },
            { label: 'Capture Reçue', value: '2.0', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
            { label: 'Lien Envoyé', value: '1.0', color: 'bg-blue-100 text-blue-800 border-blue-300' },
            { label: 'Nouveau', value: '0.1', color: 'bg-gray-100 text-gray-700 border-gray-300' },
          ].map(r => (
            <div key={r.label} className={`flex flex-col items-center p-2 rounded-xl border-2 ${r.color}`}>
              <span className="font-black text-lg">{r.value}</span>
              <span className="text-[10px] font-black uppercase text-center">{r.label}</span>
            </div>
          ))}
        </div>

        {/* Tag bonuses */}
        <p className="text-[9px] font-black uppercase text-violet-400 mb-1.5">+ Bonus tags parent prospect</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {[
            { label: '💰 A payé / Converti', bonus: '+1.0' },
            { label: '🔥 Très motivé', bonus: '+0.6' },
            { label: '👍 Intéressé, hésite', bonus: '+0.3' },
            { label: '🔄 À relancer', bonus: '+0.2' },
            { label: '📅 Pas dispo ce WE', bonus: '+0.2' },
            { label: '❓ A des questions', bonus: '+0.2' },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-1 bg-violet-100 border border-violet-300 rounded-full px-2 py-0.5">
              <span className="text-[10px] font-bold text-violet-700">{r.label}</span>
              <span className="text-[10px] font-black text-violet-900">{r.bonus}</span>
            </div>
          ))}
        </div>

        {/* Example */}
        <div className="bg-white border-2 border-violet-200 rounded-xl px-3 py-2 flex items-center gap-3">
          <span className="text-lg">🏆</span>
          <div>
            <p className="text-xs font-black text-violet-900">Exemple — meilleur score possible</p>
            <p className="text-[10px] text-violet-700 font-medium">Confirmé (3.0) + A payé (1.0) + Très motivé (0.6) = <strong>4.6</strong> → Meta cible en priorité ce profil de parent</p>
          </div>
        </div>
        <p className="text-[10px] text-red-500 font-bold mt-2">🚫 Pas lead (enfant joue, faux numéro, insultes...) → Annulés, exclus de l'export. Meta ne les voit jamais.</p>
      </div>
    </div>
  );
};
