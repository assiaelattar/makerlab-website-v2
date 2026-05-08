import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Link as LinkIcon, Copy, CheckCircle2, Clock, X,
  Users, FileText, ExternalLink, RefreshCw, Filter,
  ChevronDown, MessageCircle, Camera, UserCheck, Search
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
  fullName: string;   // kid's first name (prénom_de_l'enfant_)
  kidAge?: string;    // e.g. "7-9", "10-12", "13-14"
  phone: string;
  email?: string;
  kidName?: string;
  theme?: string;
  slot?: string;      // e.g. "samedi_15h-18h"
  source: string;
  status: LeadStatus;
  metaLeadId?: string;
  lpUrl?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

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

function generateLPUrl(lead: MakeAndGoLead) {
  const params = new URLSearchParams({
    kid: lead.kidName || lead.fullName.split(' ')[0],
    theme: lead.theme || 'Robotique',
    slot: lead.slot || 'ce weekend',
    from: 'form',
  });
  return `${BASE_URL}/reservation?${params.toString()}`;
}

// ─── Meta CSV/TSV Parser ──────────────────────────────────────────────────────
// Real Meta export: tab-separated, UTF-16LE with BOM.
// Columns seen: id, created_time, ad_id, ad_name, adset_id, adset_name,
//   campaign_id, campaign_name, form_id, form_name, is_organic, platform,
//   âge_de_l'enfant, créneau_samedi/dimanche, prénom_de_l'enfant_, phone, lead_status
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
    for (const pat of patterns) {
      const i = rawHeaders.findIndex(h => h.includes(pat));
      if (i !== -1) return i;
    }
    return -1;
  };

  // Map to real Meta column names (normalised)
  const iId      = idx('id');
  const iCreated = idx('created_time', 'created');
  const iKidName = idx('pr_nom_de_l', 'prenom_de_l', 'kid_name', 'full_name', 'name', 'first_name');
  const iAge     = idx('ge_de_l', 'age_de_l', 'age');
  const iSlot    = idx('neau', 'creneau', 'cr_neau', 'slot', 'session');
  const iPhone   = idx('phone', 'telephone', 't_l_phone', 'mobile', 'num_ro');
  const iEmail   = idx('email', 'mail');

  const now = new Date().toISOString();

  return lines.slice(1).map(line => {
    const cols = line.split(sep).map(c => c.replace(/^"|"$/g, '').trim());
    const get = (i: number) => (i !== -1 && cols[i]) ? cols[i] : '';

    const kidName  = get(iKidName) || '';
    const phone    = get(iPhone).replace(/^p:/, ''); // Meta prefixes with "p:"
    const metaId   = get(iId).replace(/^l:/, '');
    const slot     = get(iSlot);
    const kidAge   = get(iAge);
    const email    = get(iEmail);
    const rawDate  = get(iCreated);
    let created = now;
    if (rawDate) { try { created = new Date(rawDate).toISOString(); } catch { /**/ } }

    return {
      fullName: kidName || phone || 'Inconnu',
      kidName: kidName || undefined,
      kidAge:  kidAge  || undefined,
      phone,
      email:   email   || undefined,
      slot:    slot    || undefined,
      theme:   'Robotique',
      source:  sourceName,
      metaLeadId: metaId || undefined,
      status:  'new' as LeadStatus,
      createdAt: created,
      updatedAt: now,
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
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
        const full: MakeAndGoLead = {
          ...lead,
          id,
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
    const kidFirst = lead.kidName || lead.fullName.split(' ')[0];
    const msg = encodeURIComponent(
`Salam chers parents,

Merci pour votre interet pour MakerLab Academy !

Voici le lien pour finaliser la reservation de ${kidFirst} :
${url}

La place est reservee jusqu'a ce soir uniquement.`
    );
    window.open(`https://wa.me/${intl}?text=${msg}`, '_blank');
    if (lead.status === 'new') updateStatus(lead.id, 'link_sent');
  };

  const saveNotes = async () => {
    if (!editingNotes) return;
    await updateDoc(doc(db, COLLECTION, editingNotes.id), { notes: editingNotes.value, updatedAt: new Date().toISOString() });
    setEditingNotes(null);
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm('Supprimer ce lead ?')) return;
    await deleteDoc(doc(db, COLLECTION, id));
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
                      </div>
                      <span className="text-[10px] bg-green-200 text-green-800 px-2 py-1 rounded-full font-black uppercase">Nouveau</span>
                    </div>
                    <div className="flex gap-2 mt-1.5 flex-wrap">
                      {l.kidAge && <span className="text-[10px] bg-blue-100 text-blue-700 font-black px-2 py-0.5 rounded-full">👶 {l.kidAge} ans</span>}
                      {l.slot && <span className="text-[10px] bg-orange-100 text-orange-700 font-black px-2 py-0.5 rounded-full">🕐 {l.slot}</span>}
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm">{lead.fullName}</span>
                      {lead.kidAge && <span className="text-[10px] bg-blue-100 text-blue-700 font-black px-2 py-0.5 rounded-full">👶 {lead.kidAge}</span>}
                      {lead.slot && <span className="text-[10px] bg-orange-100 text-orange-700 font-black px-2 py-0.5 rounded-full">🕐 {lead.slot.replace(/_/g,' ')}</span>}
                      {lead.theme && <span className="text-[10px] bg-gray-100 text-gray-600 font-black px-2 py-0.5 rounded-full">{lead.theme}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-gray-500 font-bold">{lead.phone}</span>
                      <span className="text-[10px] text-gray-400">{new Date(lead.createdAt).toLocaleDateString('fr-FR')}</span>
                      <span className="text-[10px] text-gray-400 italic">{lead.source}</span>
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
    </div>
  );
};
