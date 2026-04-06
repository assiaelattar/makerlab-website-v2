import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePrograms } from '../../contexts/ProgramContext';
import { LandingPageData, MissionBox } from '../../types';
import { useMissions } from '../../contexts/MissionContext';
import { Button } from '../../components/Button';
import {
  ArrowLeft, Save, Eye, Copy, Rocket, Plus, Trash2,
  ToggleLeft, ToggleRight, Upload, Image as ImageIcon, GripVertical, FolderArchive,
  FileDown, FileUp, Code2, CheckCircle2, ChevronDown, ChevronRight
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import imageCompression from 'browser-image-compression';
import { MediaPickerModal } from '../../components/MediaPickerModal';

const DEFAULT_LP: LandingPageData = {
  enabled: false,
  heroSubHeadline: "Pas de jouets en plastique. Pas de Lego. Vos enfants utiliseront de vrais outils, du vrai code et ramèneront chez eux un projet technologique qu'ils ont construit de leurs propres mains.",
  heroCtaText: 'RÉSERVER UNE MISSION POUR CE WEEK-END',
  heroScarcityText: '⏳ Places limitées à 20 Makers par session.',
  layoutVariant: 'classic',
  ctaMode: 'booking',
  missionIds: [],
  stationsHeadline: 'Une Immersion en 5 Stations d\'Innovation',
  agitatorHeadline: "La plupart des enfants consomment la technologie. Les nôtres la construisent.",
  agitatorBody: "Le système classique donne à votre enfant une boîte de pièces préfabriquées et un manuel d'instructions. Ce n'est pas de l'ingénierie. C'est du simple assemblage.\n\nChez Makerlab, notre philosophie est stricte : BUILT NOT BOUGHT (Construit, pas acheté). Nous mettons de vrais logiciels de CAO, des imprimantes 3D et des fers à souder entre les mains de vos enfants. Nous ne les traitons pas comme des enfants, nous les traitons comme des innovateurs.",
  galleryImages: [],
  offerHeadline: 'Le Programme "Make & Go"',
  missionsHeadline: 'Choisissez La Mission de Votre Enfant',
  missionsSubHeadline: "Chaque week-end est un nouveau défi. Sélectionnez une date ci-dessous. Attention : les portes se ferment dès que les 20 places sont réservées.",
  missionBoxes: [
    { id: '1', date: 'Ce Samedi (14h30 - 17h30)', theme: 'MISSION : IRON MAKER (Robotique & Capteurs)', price: '400 DHS', spotsTotal: 20, spotsLeft: 4, status: 'limited' },
    { id: '2', date: 'Samedi Prochain (14h30 - 17h30)', theme: 'MISSION : ESCADRON LASER (Découpe Laser & Ingénierie MDF)', price: '400 DHS', spotsTotal: 20, spotsLeft: 18, status: 'open' },
  ],
  faqEnabled: true,
  finalCtaHeadline: "Le Moment Où Tout S'allume.",
  finalCtaBody: "Ne laissez pas passer un autre week-end devant les écrans. Donnez-leur les compétences de demain, aujourd'hui.",
  perksHeadline: 'Vos Avantages Exclusifs',
  stations: [
    { id: '1', title: 'Station CAO & Design', description: 'Apprentissage de la modélisation 3D sur logiciels professionnels.', icon: '💻' },
    { id: '2', title: 'Station Électronique', description: 'Soudure et montage de circuits réels par les enfants.', icon: '🔌' },
    { id: '3', title: 'Station Fabrication', description: 'Découpe Laser et Impression 3D pour donner vie au projet.', icon: '⚙️' },
  ],
  perks: [
    { id: '1', text: 'Matériel 100% fourni par le Lab' },
    { id: '2', text: 'Encadrement par des ingénieurs mentors' },
    { id: '3', text: 'Projet réel construit par l\'enfant' },
  ],
  thankYou: {
    showMarquee: true,
    showTrustPillars: true,
    showPacks: true,
    benefits: [
      "Accès prioritaire aux futures sessions",
      "Certificat d'Innovation Makerlab",
      "Équipements professionnels sécurisés"
    ]
  }
};

/* ─── Section Card wrapper (Collapsible) ──────────────────────────────────── */
const Section: React.FC<{ 
  title: string; 
  badge?: string; 
  children: React.ReactNode; 
  accent?: string;
  defaultOpen?: boolean;
}> = ({
  title, badge, children, accent = 'bg-orange-500', defaultOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0_0_black] overflow-hidden transition-all duration-300">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 px-6 py-4 border-b-4 border-black text-left hover:brightness-105 active:brightness-95 transition-all group ${accent}`}
      >
        <div className="flex-1 flex items-center gap-3">
          <h2 className="font-black text-xl text-black uppercase tracking-tight">{title}</h2>
          {badge && <span className="text-[10px] font-black bg-black/20 text-black px-2 py-0.5 rounded-full uppercase">{badge}</span>}
        </div>
        <div className={`p-1 border-2 border-black rounded-lg bg-white/30 group-hover:bg-white/50 transition-all ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} className="text-black" />
        </div>
      </button>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 space-y-6 bg-gray-50/30 border-t-2 border-black/5">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ─── Field helper ─────────────────────────────────────────────────────────── */
const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div>
    <label className="block font-black text-sm uppercase tracking-wider mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 font-medium mb-2">{hint}</p>}
    {children}
  </div>
);

const inputCls = "w-full p-3 border-2 border-black rounded-xl font-medium text-sm focus:border-orange-500 outline-none transition-colors";
const textareaCls = "w-full p-3 border-2 border-black rounded-xl font-medium text-sm focus:border-orange-500 outline-none transition-colors resize-none";

/* ─── Ratio presets ────────────────────────────────────────────────────────── */
const RATIOS = [
  { label: '1:1', value: 1, hint: 'Carré · Instagram' },
  { label: '4:3', value: 4 / 3, hint: 'Paysage · Standard' },
  { label: '3:2', value: 3 / 2, hint: 'Paysage · Photo' },
  { label: '16:9', value: 16 / 9, hint: 'Cinéma · Wide' },
];

/* ─── CropModal ─────────────────────────────────────────────────────────────
   Pure canvas-based cropper — no external dependency.
   Lets the admin pick a ratio, drag the crop box,
   then outputs a compressed Blob ready for Firebase.
──────────────────────────────────────────────────────────────────────────── */
const CONTAINER_W = 540;

interface CropBox { x: number; y: number; w: number; h: number; }

const CropModal: React.FC<{
  file: File;
  onConfirm: (blob: Blob, filename: string) => void;
  onCancel: () => void;
}> = ({ file, onConfirm, onCancel }) => {
  const [ratioIdx, setRatioIdx] = useState(1);               // default 4:3
  const [imgEl, setImgEl] = useState<HTMLImageElement | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [displayH, setDisplayH] = useState(0);
  const [crop, setCrop] = useState<CropBox>({ x: 0, y: 0, w: 100, h: 100 });
  const [dragging, setDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState({ mx: 0, my: 0, bx: 0, by: 0 });
  const [compressing, setCompressing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasPreviewRef = useRef<HTMLCanvasElement>(null);

  // Create object URL + load image — both in one effect so cleanup always revokes the right URL
  useEffect(() => {
    const src = URL.createObjectURL(file);
    setImgSrc(src);
    const img = new Image();
    img.onload = () => {
      const scale = CONTAINER_W / img.naturalWidth;
      const h = Math.round(img.naturalHeight * scale);
      setDisplayH(h);
      setImgEl(img);
    };
    img.onerror = () => console.error('Image failed to load from object URL');
    img.src = src;
    return () => {
      URL.revokeObjectURL(src);
    };
  }, [file]);

  // Recompute crop box on ratio or image change
  useEffect(() => {
    if (!imgEl || !displayH) return;
    const ratio = RATIOS[ratioIdx].value;
    const maxW = CONTAINER_W;
    const maxH = displayH;
    let w = maxW * 0.9;
    let h = w / ratio;
    if (h > maxH * 0.9) { h = maxH * 0.9; w = h * ratio; }
    const x = (maxW - w) / 2;
    const y = (maxH - h) / 2;
    setCrop({ x, y, w, h });
  }, [ratioIdx, imgEl, displayH]);

  // Draw canvas preview whenever crop changes
  useEffect(() => {
    if (!imgEl || !canvasPreviewRef.current) return;
    const scaleX = imgEl.naturalWidth / CONTAINER_W;
    const scaleY = imgEl.naturalHeight / displayH;
    const sx = crop.x * scaleX;
    const sy = crop.y * scaleY;
    const sw = crop.w * scaleX;
    const sh = crop.h * scaleY;
    const out = canvasPreviewRef.current;
    out.width = Math.round(sw);
    out.height = Math.round(sh);
    const ctx = out.getContext('2d')!;
    ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, out.width, out.height);
  }, [crop, imgEl, displayH]);

  const clampBox = useCallback((box: CropBox): CropBox => ({
    ...box,
    x: Math.max(0, Math.min(CONTAINER_W - box.w, box.x)),
    y: Math.max(0, Math.min(displayH - box.h, box.y)),
  }), [displayH]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    setDragOrigin({ mx: e.clientX, my: e.clientY, bx: crop.x, by: crop.y });
  };
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragOrigin.mx;
    const dy = e.clientY - dragOrigin.my;
    setCrop(prev => clampBox({ ...prev, x: dragOrigin.bx + dx, y: dragOrigin.by + dy }));
  }, [dragging, dragOrigin, clampBox]);
  const onMouseUp = () => setDragging(false);

  const handleConfirm = async () => {
    if (!canvasPreviewRef.current || !imgEl) return;
    setCompressing(true);
    try {
      // 1. Extract the cropped region via canvas
      const scaleX = imgEl.naturalWidth / CONTAINER_W;
      const scaleY = imgEl.naturalHeight / displayH;
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(crop.w * scaleX);
      canvas.height = Math.round(crop.h * scaleY);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(imgEl, crop.x * scaleX, crop.y * scaleY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);

      // 2. Convert canvas to Blob (JPEG quality 0.92)
      const rawBlob: Blob = await new Promise((res, rej) =>
        canvas.toBlob(b => b ? res(b) : rej(new Error('toBlob failed')), 'image/jpeg', 0.92)
      );

      // 3. Compress with main-thread mode (no web worker — avoids Vite CSP/worker issues)
      const asFile = new File([rawBlob], file.name, { type: 'image/jpeg' });
      const compressed = await imageCompression(asFile, {
        maxSizeMB: 0.6,
        maxWidthOrHeight: 1400,
        useWebWorker: false,
        fileType: 'image/jpeg',
        initialQuality: 0.82,
      });

      onConfirm(compressed, `${Date.now()}_cropped_${file.name.replace(/\.[^.]+$/, '')}.jpg`);
    } catch (err: any) {
      console.error('Crop/compress error:', err);
      alert('Erreur lors du traitement : ' + (err?.message || err));
      setCompressing(false);
    }
  };

  if (!imgEl) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)' }}>
        <div className="text-white font-black text-xl animate-pulse">Chargement de l'image...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }} onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="bg-white rounded-3xl border-4 border-black shadow-[10px_10px_0_0_black] overflow-hidden w-full" style={{ maxWidth: CONTAINER_W + 48 }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-blue-400">
          <div>
            <h3 className="font-black text-xl uppercase">✂️ Rogner l'image</h3>
            <p className="text-xs font-bold text-blue-900">Faites glisser le cadre · Choisissez un ratio · Rognez & Compressez</p>
          </div>
          <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-black hover:bg-red-500 hover:text-white transition-colors"><span className="font-black text-lg">✕</span></button>
        </div>

        {/* Ratio selector */}
        <div className="flex gap-2 px-6 pt-4 pb-2 flex-wrap">
          <span className="text-xs font-black uppercase tracking-wider text-gray-500 self-center mr-1">Ratio :</span>
          {RATIOS.map((r, i) => (
            <button
              key={r.label}
              onClick={() => setRatioIdx(i)}
              className={`px-3 py-1.5 rounded-xl border-2 border-black text-xs font-black transition-all ${
                ratioIdx === i ? 'bg-black text-white shadow-[2px_2px_0_0_black] translate-x-0.5 translate-y-0.5' : 'bg-white hover:bg-gray-100'
              }`}
              title={r.hint}
            >
              {r.label} <span className="hidden sm:inline text-gray-400 font-normal">· {r.hint}</span>
            </button>
          ))}
        </div>

        {/* Crop area */}
        <div className="px-6 pb-4">
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl border-2 border-black bg-gray-100 select-none"
            style={{ width: CONTAINER_W, height: displayH, cursor: dragging ? 'grabbing' : 'default' }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {/* Full image behind (dimmed overlay) */}
            <img src={imgSrc} alt="" draggable={false} className="absolute top-0 left-0 w-full h-full object-cover opacity-30 pointer-events-none" />

            {/* Darken outside crop */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `linear-gradient(to bottom,rgba(0,0,0,.55) ${crop.y}px,transparent ${crop.y}px,transparent ${crop.y + crop.h}px,rgba(0,0,0,.55) ${crop.y + crop.h}px),linear-gradient(to right,rgba(0,0,0,.55) ${crop.x}px,transparent ${crop.x}px,transparent ${crop.x + crop.w}px,rgba(0,0,0,.55) ${crop.x + crop.w}px)` }}
            />

            {/* Crop window — the actual bright region */}
            <div
              className="absolute overflow-hidden border-2 border-white shadow-[0_0_0_1px_black]"
              style={{ left: crop.x, top: crop.y, width: crop.w, height: crop.h, cursor: 'grab' }}
              onMouseDown={onMouseDown}
            >
              <img src={imgSrc} alt="" draggable={false}
                className="absolute object-cover pointer-events-none"
                style={{ width: CONTAINER_W, height: displayH, left: -crop.x, top: -crop.y }}
              />
              {/* Rule-of-thirds grid */}
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.25) 1px,transparent 1px)', backgroundSize: `${crop.w / 3}px ${crop.h / 3}px` }} />
              {/* Corner handles — simplified to avoid TS type-cast errors */}
              <div className="absolute w-4 h-4 bg-white border-2 border-black rounded-sm" style={{ left: 0, top: 0 }} />
              <div className="absolute w-4 h-4 bg-white border-2 border-black rounded-sm" style={{ right: 0, top: 0 }} />
              <div className="absolute w-4 h-4 bg-white border-2 border-black rounded-sm" style={{ left: 0, bottom: 0 }} />
              <div className="absolute w-4 h-4 bg-white border-2 border-black rounded-sm" style={{ right: 0, bottom: 0 }} />
              {/* Size badge */}
              <div className="absolute bottom-1.5 right-2 text-[10px] font-black text-white bg-black/60 px-1.5 py-0.5 rounded">
                {Math.round(crop.w * (imgEl.naturalWidth / CONTAINER_W))} × {Math.round(crop.h * (imgEl.naturalHeight / displayH))}px
              </div>
            </div>
          </div>

          {/* Canvas preview (hidden, used for crop output) */}
          <canvas ref={canvasPreviewRef} className="hidden" />

          {/* Footer info */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium">💡 Glissez le cadre blanc pour le repositionner · Compression auto ≤ 600 KB</p>
            <span className="text-xs font-black text-blue-600">Ratio actuel : {RATIOS[ratioIdx].label}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onCancel} className="flex-1 py-3 border-2 border-black rounded-xl font-black text-sm hover:bg-gray-100 transition-colors">Annuler</button>
          <button
            onClick={handleConfirm}
            disabled={compressing}
            className="flex-1 py-3 bg-orange-500 text-black font-black text-sm border-2 border-black rounded-xl shadow-[3px_3px_0_0_black] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-60"
          >
            {compressing ? '⏳ Compression...' : '✂️ Rogner & Compresser'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Mission Box Editor ───────────────────────────────────────────────────── */
const MissionBoxEditor: React.FC<{
  box: MissionBox;
  onChange: (updated: MissionBox) => void;
  onDelete: () => void;
  index: number;
}> = ({ box, onChange, onDelete, index }) => {
  const set = (key: keyof MissionBox, value: any) => onChange({ ...box, [key]: value });

  return (
    <div className="p-4 border-2 border-black rounded-xl bg-gray-50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-gray-400" />
          <span className="font-black text-sm uppercase tracking-wider text-gray-600">Mission {index + 1}</span>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-red-300 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-black uppercase mb-1 text-gray-500">Date / Créneau</label>
          <input value={box.date} onChange={e => set('date', e.target.value)} className={inputCls} placeholder="Ce Samedi (14h30 - 17h30)" />
        </div>
        <div>
          <label className="block text-xs font-black uppercase mb-1 text-gray-500">Thème / Nom Mission</label>
          <input value={box.theme} onChange={e => set('theme', e.target.value)} className={inputCls} placeholder="MISSION : IRON MAKER" />
        </div>
        <div>
          <label className="block text-xs font-black uppercase mb-1 text-gray-500">Prix</label>
          <input value={box.price} onChange={e => set('price', e.target.value)} className={inputCls} placeholder="400 DHS" />
        </div>
        <div>
          <label className="block text-xs font-black uppercase mb-1 text-gray-500">Statut</label>
          <select value={box.status} onChange={e => set('status', e.target.value)} className={inputCls}>
            <option value="open">🟢 Inscriptions Ouvertes</option>
            <option value="limited">🔴 Places Limitées (urgence)</option>
            <option value="full">⛔ Complet</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-black uppercase mb-1 text-gray-500">Total Places</label>
          <input type="number" value={box.spotsTotal} onChange={e => set('spotsTotal', Number(e.target.value))} className={inputCls} min={1} />
        </div>
        <div>
          <label className="block text-xs font-black uppercase mb-1 text-gray-500">Places Restantes</label>
          <input type="number" value={box.spotsLeft} onChange={e => set('spotsLeft', Number(e.target.value))} className={inputCls} min={0} />
        </div>
      </div>
    </div>
  );
};

/* ─── Mission Selection (Catalog-based) ────────────────────────────────────── */
const MissionCatalogPicker: React.FC<{
  selectedIds: string[];
  allMissions: any[];
  onChange: (ids: string[]) => void;
}> = ({ selectedIds, allMissions, onChange }) => {
  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(x => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
      {allMissions.length === 0 && <p className="text-gray-400 text-xs font-medium italic">Aucune mission disponible dans le catalogue.</p>}
      {allMissions.map(m => (
        <label key={m.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${selectedIds.includes(m.id) ? 'bg-orange-50 border-orange-500 shadow-sm' : 'bg-white border-transparent hover:border-gray-200'}`}>
          <input type="checkbox" checked={selectedIds.includes(m.id)} onChange={() => toggle(m.id)} className="sr-only" />
          <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${selectedIds.includes(m.id) ? 'bg-orange-500 border-orange-500' : 'bg-white border-gray-300'}`}>
            {selectedIds.includes(m.id) && <span className="text-white text-[10px] font-black">✓</span>}
          </div>
          <div className="flex-grow">
            <p className="font-black text-sm uppercase tracking-tight">{m.title}</p>
            <p className="text-[10px] text-gray-500 font-bold">{m.date} — {m.price} DHS</p>
          </div>
          <div className="text-right shrink-0">
             <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${m.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
               {m.status === 'open' ? 'Ouvert' : 'Limité'}
             </span>
          </div>
        </label>
      ))}
    </div>
  );
};

/* ─── Main Component ───────────────────────────────────────────────────────── */
export const AdminLandingEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProgram, updateProgram } = usePrograms();
  const [lp, setLp] = useState<LandingPageData>(DEFAULT_LP);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isUploadingOgImage, setIsUploadingOgImage] = useState(false);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isMediaPickerForOgImage, setIsMediaPickerForOgImage] = useState(false);

  const program = id ? getProgram(id) : undefined;

  useEffect(() => {
    if (program?.landingPage) {
      setLp({ ...DEFAULT_LP, ...program.landingPage });
    } else if (program) {
      // Pre-fill hero headline from program title
      setLp(prev => ({
        ...prev,
        heroHeadline: `Transformez Son Temps d'Écran avec ${program.title} en Seulement ${program.duration || '3 Heures'}.`,
      }));
    }
  }, [program?.id]);

  if (!program) {
    return (
      <div className="text-center py-20">
        <p className="font-bold text-gray-500">Programme introuvable.</p>
        <button onClick={() => navigate('/admin/landing-pages')} className="mt-4 font-black text-orange-500 underline">Retour aux Landing Pages</button>
      </div>
    );
  }

  const setField = <K extends keyof LandingPageData>(key: K, value: LandingPageData[K]) => {
    setLp(prev => ({ ...prev, [key]: value }));
  };

  const { missions } = useMissions();
  const syncMissions = () => {
    const formatted: MissionBox[] = missions
      .filter(m => m.status !== 'full')
      .slice(0, 3)
      .map(m => ({
        id: m.id,
        date: m.date,
        theme: m.title,
        price: m.price,
        spotsTotal: m.spotsTotal,
        spotsLeft: m.spotsLeft,
        status: m.status as any
      }));
    setField('missionBoxes', formatted);
  };

  const handleAddMission = () => {
    const newBox: MissionBox = {
      id: Date.now().toString(),
      date: 'Samedi XX (14h30 - 17h30)',
      theme: 'MISSION : [THÈME]',
      price: '400 DHS',
      spotsTotal: 20,
      spotsLeft: 20,
      status: 'open',
    };
    setField('missionBoxes', [...(lp.missionBoxes || []), newBox]);
  };

  const updateMission = (index: number, updated: MissionBox) => {
    const boxes = [...(lp.missionBoxes || [])];
    boxes[index] = updated;
    setField('missionBoxes', boxes);
  };

  const deleteMission = (index: number) => {
    setField('missionBoxes', (lp.missionBoxes || []).filter((_, i) => i !== index));
  };

  // Opens the crop modal for the selected file (one at a time)
  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';           // reset so same file can be re-selected
    if (file) setPendingCropFile(file);
  };

  // Called after crop + compress — uploads the blob to Firebase
  const handleCropConfirm = async (blob: Blob, filename: string) => {
    setPendingCropFile(null);
    setIsUploadingGallery(true);
    try {
      const storageRef = ref(storage, `website-programs-images/gallery_${filename}`);
      const snapshot = await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(snapshot.ref);
      setField('galleryImages', [...(lp.galleryImages || []), url]);
    } catch (err: any) {
      alert('Erreur upload galerie : ' + err.message);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleMediaPick = (url: string) => {
    if (isMediaPickerForOgImage) {
      setField('ogImage', url);
    } else {
      setField('galleryImages', [...(lp.galleryImages || []), url]);
    }
    setIsMediaPickerOpen(false);
    setIsMediaPickerForOgImage(false);
  };

  const handleOgImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsUploadingOgImage(true);
    try {
      const imageCompression = (await import('browser-image-compression')).default;
      const options = { maxSizeMB: 0.35, maxWidthOrHeight: 1200, useWebWorker: false };
      const compressed = await imageCompression(file, options);
      const storageRef = ref(storage, `website-programs-images/lp-social_${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, compressed);
      const url = await getDownloadURL(snapshot.ref);
      setField('ogImage', url);
    } catch (err: any) {
      alert('Erreur upload image sociale : ' + err.message);
    } finally {
      setIsUploadingOgImage(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    setField('galleryImages', (lp.galleryImages || []).filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProgram(program.id, { landingPage: lp });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  const publicUrl = `${window.location.origin}/lp/${program.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl);
  };

  /* ═══ CSV IMPORT / EXPORT ═══════════════════════════════════════════════ */
  const CSV_FIELDS: { key: keyof LandingPageData; label: string }[] = [
    { key: 'themeColor', label: 'Theme (orange/blue/green/red)' },
    { key: 'heroPreHeadline', label: 'Hero Pre-Headline' },
    { key: 'heroHeadline', label: 'Hero Headline' },
    { key: 'heroSubHeadline', label: 'Hero Sub-Headline' },
    { key: 'heroCtaText', label: 'Hero CTA Text' },
    { key: 'heroScarcityText', label: 'Hero Scarcity' },
    { key: 'agitatorHeadline', label: 'Agitator Headline' },
    { key: 'agitatorBody', label: 'Agitator Body' },
    { key: 'missionsHeadline', label: 'Missions Headline' },
    { key: 'missionsSubHeadline', label: 'Missions Sub-Headline' },
    { key: 'finalCtaHeadline', label: 'Final CTA Headline' },
    { key: 'finalCtaBody', label: 'Final CTA Body' },
    { key: 'ogImage', label: 'Social Image URL' },
    { key: 'layoutVariant', label: 'Layout Variant' },
    { key: 'ctaMode', label: 'CTA Mode' },
    { key: 'stationsHeadline', label: 'Stations Headline' },
    { key: 'perksHeadline', label: 'Perks Headline' },
  ];

  const handleExportCSV = () => {
    const headers = CSV_FIELDS.map(f => f.label).join(';');
    const values = CSV_FIELDS.map(f => {
      const val = lp[f.key] || '';
      // Escape quotes and wrap in quotes
      return `"${val.toString().replace(/"/g, '""')}"`;
    }).join(';');

    const csvContent = `${headers}\n${values}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `LP_${program.title.replace(/\s+/g, '_')}_Template.csv`;
    link.click();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      if (lines.length < 2) return;

      // Simple CSV parser that handles quoted semicolons (rough)
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      const row = lines[1];

      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char === '"') inQuotes = !inQuotes;
        else if (char === ';' && !inQuotes) {
          values.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));

      const newLp = { ...lp };
      CSV_FIELDS.forEach((field, i) => {
        if (values[i] !== undefined) {
          (newLp as any)[field.key] = values[i];
        }
      });

      // Special handling for boolean/number if needed (themeColor is validated by LP logic)
      setLp(newLp);
      alert('Contenu importé avec succès ! N\'oubliez pas de sauvegarder.');
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset
  };

  return (
    <>
    <div className="max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/landing-pages')}
            className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-xl font-black text-sm hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={16} /> Retour
          </button>
          <div>
            <h1 className="font-display font-black text-2xl flex items-center gap-2">
              <Rocket size={20} className="text-orange-500" />
              Landing Page
            </h1>
            <p className="text-sm font-bold text-gray-500">{program.title}</p>
          </div>
        </div>
        <div className="flex gap-3">
          {lp.enabled && (
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <button type="button" className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-xl font-black text-sm bg-white hover:bg-gray-50 transition-colors">
                <Eye size={16} /> Aperçu
              </button>
            </a>
          )}
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-xl font-black text-sm bg-white hover:bg-gray-50 transition-colors"
          >
            <Copy size={16} /> Lien
          </button>

          <div className="h-8 w-px bg-gray-300 mx-1 hidden md:block" />

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-xl font-black text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Exporter comme template CSV"
          >
            <FileDown size={16} /> Export
          </button>

          <label className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-xl font-black text-sm bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors cursor-pointer" title="Importer depuis un CSV">
            <FileUp size={16} /> Import
            <input type="file" accept=".csv" onChange={handleImportCSV} className="hidden" />
          </label>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 shadow-neo-sm transition-all ${saved ? 'bg-green-500 border-green-700' : ''}`}
          >
            <Save size={16} />
            {isSaving ? 'Sauvegarde...' : saved ? '✓ Sauvegardé !' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Public URL Display */}
      <div className="mb-6 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-xs font-black uppercase text-gray-400 tracking-wider shrink-0">URL Publique :</span>
        <code className="text-sm font-mono text-gray-700 flex-grow break-all">{publicUrl}</code>
        <button onClick={copyLink} className="shrink-0 text-xs font-black text-orange-500 hover:text-orange-600 underline">Copier</button>
      </div>

      <div className="space-y-6">

        {/* ── Configuration de Base ────────────────────────────────────────── */}
        <Section title="Configuration de Base" badge="Status & Mode" accent="bg-green-400" defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Type de Structure" hint="Le design s'adapte au contenu du programme.">
              <div className="flex gap-2">
                {[
                  { id: 'classic', label: 'Classic (Make & Go)', hint: 'Focus sur les missions' },
                  { id: 'modular', label: 'Modular (StemQuest)', hint: 'Focus sur les pôles' },
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setField('layoutVariant', v.id as any)}
                    className={`flex-1 p-3 border-4 rounded-xl text-left transition-all ${lp.layoutVariant === v.id ? 'border-black bg-blue-50 shadow-[4px_4px_0_0_black]' : 'border-transparent bg-white hover:bg-gray-50'}`}
                  >
                    <p className="font-black text-xs uppercase">{v.label}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{v.hint}</p>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Mode d'Appel à l'Action (CTA)" hint="Vendez-vous une place ou un entretien ?">
              <div className="flex gap-2">
                {[
                  { id: 'booking', label: 'Booking Direct', hint: 'Paiement / Réservation' },
                  { id: 'lead', label: 'Lead Discovery', hint: 'Visite du Lab' },
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setField('ctaMode', v.id as any)}
                    className={`flex-1 p-3 border-4 rounded-xl text-left transition-all ${lp.ctaMode === v.id ? 'border-black bg-green-50 shadow-[4px_4px_0_0_black]' : 'border-transparent bg-white hover:bg-gray-50'}`}
                  >
                    <p className="font-black text-xs uppercase">{v.label}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{v.hint}</p>
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </Section>

        {/* ── Thank You Page Configuration ───────────────────────────────────── */}
        <Section title="Configuration Page Merci" badge="Post-Conversion" accent="bg-purple-600">
          <div className="space-y-6">
            <p className="text-sm font-medium text-gray-500">
              Personnalisez l'expérience du parent immédiatement après son inscription. Un tunnel bien optimisé continue de vendre même après le clic.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Titre de la Page" hint="Par défaut : 'Encore une étape : Confirmez sa place'">
                <input 
                  value={lp.thankYou?.headline || ''} 
                  onChange={e => setField('thankYou', { ...lp.thankYou, headline: e.target.value })} 
                  className={inputCls} 
                  placeholder="Félicitations pour l'inscription !"
                />
              </Field>
              <Field label="Sous-titre" hint="Par défaut : 'Pour garantir l'accès de [Nom] au lab...'">
                <input 
                  value={lp.thankYou?.subHeadline || ''} 
                  onChange={e => setField('thankYou', { ...lp.thankYou, subHeadline: e.target.value })} 
                  className={inputCls} 
                  placeholder="On a hâte de voir votre maker au lab."
                />
              </Field>
            </div>

            <Field label="Vidéo de Remerciement (Lien)" hint="YouTube ou Vimeo. Une vidéo de 30s du lab multiplie la confiance par 3.">
              <div className="flex gap-2">
                <div className="flex-grow relative">
                  <input 
                    value={lp.thankYou?.videoUrl || ''} 
                    onChange={e => setField('thankYou', { ...lp.thankYou, videoUrl: e.target.value })} 
                    className={inputCls} 
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <Code2 size={18} className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>
            </Field>

            <Field label="Bénéfices de la Session (Checklist)" hint="Qu'est-ce que l'enfant ramène chez lui ?">
              <div className="space-y-2">
                {(lp.thankYou?.benefits || []).map((b, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex-grow relative">
                      <input 
                        value={b} 
                        onChange={e => {
                          const newBenefits = [...(lp.thankYou?.benefits || [])];
                          newBenefits[i] = e.target.value;
                          setField('thankYou', { ...lp.thankYou, benefits: newBenefits });
                        }} 
                        className={inputCls} 
                      />
                      <CheckCircle2 size={14} className="absolute right-3 top-3.5 text-green-500" />
                    </div>
                    <button 
                      onClick={() => {
                        const newBenefits = (lp.thankYou?.benefits || []).filter((_, idx) => idx !== i);
                        setField('thankYou', { ...lp.thankYou, benefits: newBenefits });
                      }}
                      className="p-3 border-2 border-black rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => setField('thankYou', { ...lp.thankYou, benefits: [...(lp.thankYou?.benefits || []), ''] })}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-xs font-black uppercase text-gray-400 hover:border-black hover:text-black transition-all"
                >
                  + Ajouter un bénéfice
                </button>
              </div>
            </Field>

            <div className="pt-4 border-t-2 border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                 { id: 'showMarquee', label: 'Bandeau Marquee' },
                 { id: 'showTrustPillars', label: 'Piliers de Confiance' },
                 { id: 'showPacks', label: 'Options de Packs' }
               ].map(toggle => (
                 <button
                    key={toggle.id}
                    onClick={() => setField('thankYou', { ...lp.thankYou, [toggle.id]: !((lp.thankYou as any)?.[toggle.id] ?? true) })}
                    className="flex items-center justify-between p-4 border-2 border-black rounded-2xl bg-gray-50 hover:bg-white transition-all group"
                 >
                    <span className="font-black text-xs uppercase tracking-tight">{toggle.label}</span>
                    {((lp.thankYou as any)?.[toggle.id] ?? true) ? (
                      <ToggleRight size={28} className="text-green-500" />
                    ) : (
                      <ToggleLeft size={28} className="text-gray-300" />
                    )}
                 </button>
               ))}
            </div>
          </div>
        </Section>

        {/* ── Design & Colors ────────────────────────────────────────────────── */}
        <Section title="Design & Couleurs" badge="Identité Visuelle" accent="bg-white">
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-500">
              Choisissez l'ambiance visuelle de votre landing page. Les couleurs (nuances, ombres, lueurs) s'adapteront automatiquement.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'orange', label: 'Classic Orange', color: '#f97316', hint: 'Original Makerlab' },
                { id: 'blue', label: 'Tech Blue', color: '#3b82f6', hint: 'Coding & Robotique' },
                { id: 'green', label: 'Eco Green', color: '#16a34a', hint: 'Nature & Science' },
                { id: 'red', label: 'Action Red', color: '#dc2626', hint: 'Intensif & Fun' },
              ].map(color => (
                <button
                  key={color.id}
                  onClick={() => setField('themeColor', color.id as any)}
                  className={`relative p-4 border-4 rounded-2xl text-left transition-all hover:-translate-y-1 ${
                    lp.themeColor === color.id 
                      ? 'border-black bg-gray-50 shadow-[4px_4px_0_0_black]' 
                      : 'border-transparent bg-white hover:border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg border-2 border-black mb-2 shadow-[2px_2px_0_0_black]`} style={{ backgroundColor: color.color }} />
                  <p className="font-black text-sm text-black uppercase">{color.label}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{color.hint}</p>
                  {lp.themeColor === color.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-black">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Structure & Funnel Strategy ───────────────────────────────────── */}
        <Section title="Stratégie & Structure" badge="Conversion" accent="bg-blue-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Type de Structure" hint="Le design s'adapte au contenu du programme.">
              <div className="flex gap-2">
                {[
                  { id: 'classic', label: 'Classic (Make & Go)', hint: 'Focus sur les missions' },
                  { id: 'modular', label: 'Modular (StemQuest)', hint: 'Focus sur les pôles' },
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setField('layoutVariant', v.id as any)}
                    className={`flex-1 p-3 border-4 rounded-xl text-left transition-all ${lp.layoutVariant === v.id ? 'border-black bg-blue-50 shadow-[4px_4px_0_0_black]' : 'border-transparent bg-white hover:bg-gray-50'}`}
                  >
                    <p className="font-black text-xs uppercase">{v.label}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{v.hint}</p>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Mode d'Appel à l'Action (CTA)" hint="Vendez-vous une place ou un entretien ?">
              <div className="flex gap-2">
                {[
                  { id: 'booking', label: 'Booking Direct', hint: 'Paiement / Réservation' },
                  { id: 'lead', label: 'Lead Discovery', hint: 'Visite du Lab' },
                ].map(v => (
                  <button
                    key={v.id}
                    onClick={() => setField('ctaMode', v.id as any)}
                    className={`flex-1 p-3 border-4 rounded-xl text-left transition-all ${lp.ctaMode === v.id ? 'border-black bg-green-50 shadow-[4px_4px_0_0_black]' : 'border-transparent bg-white hover:bg-gray-50'}`}
                  >
                    <p className="font-black text-xs uppercase">{v.label}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{v.hint}</p>
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </Section>

        {/* ── Enable / Disable Toggle ───────────────────────────────────────── */}
        <Section title="Activation" badge={lp.enabled ? '🟢 ACTIVE' : '⚫ DÉSACTIVÉE'} accent={lp.enabled ? 'bg-green-400' : 'bg-gray-200'}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-lg">Rendre la landing page publique</p>
              <p className="text-sm text-gray-500 font-medium">
                {lp.enabled
                  ? `La page est accessible à : ${publicUrl}`
                  : 'La page est masquée. Activez pour la rendre accessible.'}
              </p>
            </div>
            <button
              onClick={() => setField('enabled', !lp.enabled)}
              className={`flex items-center gap-2 px-5 py-3 font-black text-sm border-4 border-black rounded-xl transition-all shadow-[4px_4px_0_0_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 ${lp.enabled ? 'bg-green-400 text-black' : 'bg-gray-200 text-gray-600'}`}
            >
              {lp.enabled ? <ToggleRight size={20} strokeWidth={3} /> : <ToggleLeft size={20} strokeWidth={3} />}
              {lp.enabled ? 'DÉSACTIVER' : 'ACTIVER'}
            </button>
          </div>
        </Section>

        {/* ── Block 1: Hero ─────────────────────────────────────────────────── */}
        <Section title="Block 1 — Hero" badge="Au-dessus de la ligne" accent="bg-orange-500">
          <Field label="Pré-titre (rouge, petite taille)">
            <input value={lp.heroPreHeadline || ''} onChange={e => setField('heroPreHeadline', e.target.value)} className={inputCls} placeholder="ATTENTION PARENTS DE CASABLANCA..." />
          </Field>
          <Field label="Titre Principal (massif, gras)" hint="Le hook principal visible en 3 secondes.">
            <textarea value={lp.heroHeadline || ''} onChange={e => setField('heroHeadline', e.target.value)} className={textareaCls} rows={3} />
          </Field>
          <Field label="Sous-titre" hint="Développe la promesse principale.">
            <textarea value={lp.heroSubHeadline || ''} onChange={e => setField('heroSubHeadline', e.target.value)} className={textareaCls} rows={3} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Texte du bouton CTA">
              <input value={lp.heroCtaText || ''} onChange={e => setField('heroCtaText', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Texte de rareté sous le bouton">
              <input value={lp.heroScarcityText || ''} onChange={e => setField('heroScarcityText', e.target.value)} className={inputCls} />
            </Field>
          </div>
        </Section>

        {/* ── Block 2: Agitator ─────────────────────────────────────────────── */}
        <Section title="Block 2 — Agitateur" badge="Consumer vs Creator" accent="bg-gray-900">
          <Field label="Titre de l'agitateur">
            <input value={lp.agitatorHeadline || ''} onChange={e => setField('agitatorHeadline', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Corps (2 paragraphes séparés par une ligne vide)" hint='Utilisez "BUILT NOT BOUGHT" pour le mettre en gras automatiquement.'>
            <textarea value={lp.agitatorBody || ''} onChange={e => setField('agitatorBody', e.target.value)} className={textareaCls} rows={6} />
          </Field>
        </Section>

        {/* ── Gallery ──────────────────────────────────────────────────────── */}
        <Section title="Galerie Photos" badge="Preuve visuelle" accent="bg-blue-400">
          {/* Info bar */}
          <div className="flex flex-wrap gap-2 items-start">
            <p className="text-sm font-medium text-gray-500 flex-grow">
              Photos de votre lab (robots, code, makers au travail). Chaque photo passe par un <strong>recadrage</strong> et une <strong>compression automatique</strong> ≤ 600 KB. Recommandé : 3–6 photos.
            </p>
            <div className="flex gap-1.5 shrink-0 flex-wrap">
              {['1:1 Carré','4:3 Paysage','3:2 Photo','16:9 Ciné'].map(r => (
                <span key={r} className="text-[10px] font-black px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">{r}</span>
              ))}
            </div>
          </div>

          {/* Upload trigger — single file, opens CropModal OR Library */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <label className={`flex items-center justify-center gap-3 p-5 border-4 border-black rounded-2xl bg-white hover:-translate-y-1 cursor-pointer transition-transform group shadow-[4px_4px_0_0_black] ${isUploadingGallery ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className="w-10 h-10 bg-blue-400 rounded-xl flex items-center justify-center border-2 border-black shrink-0 group-hover:scale-110 transition-transform">
                <Upload size={20} className="text-black" />
              </div>
              <div className="text-left flex-grow">
                <p className="font-black text-sm text-black">
                  {isUploadingGallery ? '⏳ Upload en cours...' : 'Nouvelle Photo'}
                </p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Depuis votre ordinateur</p>
              </div>
              <input type="file" accept="image/*" onChange={handleGallerySelect} disabled={isUploadingGallery || !!pendingCropFile} className="hidden" />
            </label>

            <button
              onClick={() => setIsMediaPickerOpen(true)}
              className="flex items-center justify-center gap-3 p-5 border-4 border-black rounded-2xl bg-yellow-400 hover:-translate-y-1 cursor-pointer transition-transform group shadow-[4px_4px_0_0_black]"
            >
              <div className="w-10 h-10 bg-yellow-300 rounded-xl flex items-center justify-center border-2 border-black shrink-0 group-hover:scale-110 transition-transform">
                <FolderArchive size={20} className="text-black" />
              </div>
              <div className="text-left flex-grow">
                <p className="font-black text-sm text-black">Bibliothèque</p>
                <p className="text-[10px] text-yellow-900 font-bold uppercase tracking-wider">Réutiliser une image existante</p>
              </div>
            </button>
          </div>

          {/* Gallery grid — shows ratio badge */}
          {(lp.galleryImages || []).length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {(lp.galleryImages || []).map((url, i) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-black shadow-[2px_2px_0_0_black]">
                  <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {/* Index badge */}
                  <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-[10px] font-black text-white">{i + 1}</div>
                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-2 border-white shadow-md"
                  >
                    <Trash2 size={12} />
                  </button>
                  {/* Compressed badge */}
                  <div className="absolute bottom-1 left-1 text-[9px] font-black px-1 py-0.5 bg-green-500/80 text-white rounded">✓ compressé</div>
                </div>
              ))}
              {/* Add more shortcut */}
              <label className="aspect-square rounded-xl border-2 border-dashed border-blue-300 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors">
                <span className="text-2xl text-blue-300">+</span>
                <span className="text-[10px] font-black text-blue-300 uppercase mt-1">Photo</span>
                <input type="file" accept="image/*" onChange={handleGallerySelect} disabled={isUploadingGallery || !!pendingCropFile} className="hidden" />
              </label>
            </div>
          )}
          {(lp.galleryImages || []).length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-300 border-2 border-dashed border-gray-200 rounded-xl">
              <ImageIcon size={40} />
              <p className="font-bold text-sm mt-2">Aucune photo — ajoutez votre première image</p>
            </div>
          )}
        </Section>

        {/* ── Block 3: Offer ──────────────────────────────────────────────── */}
        <Section title="Block 3 — L'Offre Make & Go" accent="bg-yellow-400">
          <Field label="Titre de la section offre">
            <input value={lp.offerHeadline || ''} onChange={e => setField('offerHeadline', e.target.value)} className={inputCls} />
          </Field>
          <p className="text-xs text-gray-400 font-medium italic">
            Le découpage en 3 étapes (Heure 1, 2, 3) est fixe et reflète la structure du programme. Modifiez la durée et description dans l'éditeur du programme.
          </p>
        </Section>
        {/* ── Block 4: Missions (Manual & Live) ─────────────────────────────── */}
        <Section title="Missions & Disponibilités" badge="Conversion" accent="bg-red-500">
           {/* Manual overriding fallback (old) */}
           <div className="border-t-2 border-dashed border-gray-100 pt-6 mt-6">
             <p className="text-[10px] font-black uppercase text-gray-300 mb-4">Override Manuel (Legacy)</p>
             <p className="text-xs text-gray-400 font-medium mb-4 italic">Note : Utilisez le catalogue live ci-dessous pour une synchronisation automatique.</p>
           </div>
        </Section>

        {/* ── Block 4b: Missions (Live Selection) ────────────────────────────── */}
        <Section title="Missions (Catalogue Live)" badge="Auto-Sync" accent="bg-black text-white">
          <Field label="Sélectionner les missions du catalogue" hint="Les changements dans le catalogue seront appliqués ici en temps réel.">
            <MissionCatalogPicker
              selectedIds={lp.missionIds || []}
              allMissions={missions}
              onChange={(ids) => setField('missionIds', ids)}
            />
          </Field>
        </Section>

        {/* ── Block 4c: Innovation Poles (Modular Only) ─────────────────────── */}
        {lp.layoutVariant === 'modular' && (
          <Section title="Pôles d'Innovation (Stations)" badge="Structure S.T.E.M" accent="bg-purple-600">
             <Field label="Titre de la section">
               <input value={lp.stationsHeadline || ''} onChange={e => setField('stationsHeadline', e.target.value)} className={inputCls} />
             </Field>
             <div className="space-y-4 mt-6">
                {(lp.stations || []).map((s, i) => (
                  <div key={s.id} className="p-4 border-2 border-black rounded-xl bg-gray-50 space-y-3 relative">
                    <button onClick={() => setField('stations', (lp.stations || []).filter((_,idx) => idx !== i))} className="absolute top-2 right-2 w-7 h-7 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white border border-red-100 flex items-center justify-center transition-all"><Trash2 size={12} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Field label={`Station ${i+1} : Titre`}>
                        <input value={s.title} onChange={e => {
                          const next = [...(lp.stations || [])];
                          next[i].title = e.target.value;
                          setField('stations', next);
                        }} className={inputCls} />
                      </Field>
                      <Field label="Icône (Emoji ou Symbole)">
                         <input value={s.icon || ''} onChange={e => {
                          const next = [...(lp.stations || [])];
                          next[i].icon = e.target.value;
                          setField('stations', next);
                        }} className={inputCls} placeholder="🤖, 💻, ⚙️..." />
                      </Field>
                    </div>
                    <Field label="Description">
                      <textarea value={s.description} onChange={e => {
                        const next = [...(lp.stations || [])];
                        next[i].description = e.target.value;
                        setField('stations', next);
                      }} className={textareaCls} rows={2} />
                    </Field>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setField('stations', [...(lp.stations || []), { id: Date.now().toString(), title: '', description: '', icon: '' }])}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold text-xs uppercase hover:bg-gray-50 transition-colors"
                >
                  + Ajouter une station
                </button>
             </div>
          </Section>
        )}

        {/* ── Block 4d: Registration Perks (Modular Only) ──────────────────── */}
        {lp.layoutVariant === 'modular' && (
          <Section title="Avantages & Logistique (Perks)" badge="Zéro Friction" accent="bg-blue-500">
             <Field label="Titre de la section">
               <input value={lp.perksHeadline || ''} onChange={e => setField('perksHeadline', e.target.value)} className={inputCls} />
             </Field>
             <div className="space-y-3 mt-6">
                {(lp.perks || []).map((p, i) => (
                  <div key={p.id} className="flex gap-2">
                    <input value={p.text} onChange={e => {
                      const next = [...(lp.perks || [])];
                      next[i].text = e.target.value;
                      setField('perks', next);
                    }} className={inputCls} placeholder="Ex: Matériel 100% fourni..." />
                    <button onClick={() => setField('perks', (lp.perks || []).filter((_,idx) => idx !== i))} className="w-12 h-12 bg-red-50 text-red-500 rounded-xl border border-red-100 flex items-center justify-center transition-all hover:bg-red-500 hover:text-white"><Trash2 size={16} /></button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setField('perks', [...(lp.perks || []), { id: Date.now().toString(), text: '' }])}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold text-xs uppercase hover:bg-gray-50 transition-colors"
                >
                  + Ajouter un avantage
                </button>
             </div>
          </Section>
        )}

        {/* ── Block 5: FAQ Toggle ──────────────────────────────────────────── */}
        <Section title="Block 5 — FAQ & Garantie" accent="bg-green-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black">Afficher la section FAQ</p>
              <p className="text-sm text-gray-500 font-medium">3 objections-clés pré-configurées (débutant, parent absent, sans Lego)</p>
            </div>
            <button
              onClick={() => setField('faqEnabled', !lp.faqEnabled)}
              className={`flex items-center gap-2 px-4 py-2 font-black text-sm border-2 border-black rounded-xl transition-all ${lp.faqEnabled !== false ? 'bg-green-400' : 'bg-gray-200 text-gray-500'}`}
            >
              {lp.faqEnabled !== false ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
              {lp.faqEnabled !== false ? 'Activée' : 'Désactivée'}
            </button>
          </div>
        </Section>

        {/* ── Block 6: Final CTA ──────────────────────────────────────────── */}
        <Section title="Block 6 — CTA Final (bas de page)" accent="bg-orange-500">
          <Field label="Titre final">
            <input value={lp.finalCtaHeadline || ''} onChange={e => setField('finalCtaHeadline', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Corps du texte final">
            <textarea value={lp.finalCtaBody || ''} onChange={e => setField('finalCtaBody', e.target.value)} className={textareaCls} rows={2} />
          </Field>
        </Section>
        {/* ── Block 7: Tracking & Analytics ────────────────────────────────── */}
        <Section title="🎯 Tracking & Analytics" badge="Meta Pixel" accent="bg-gray-900">
          <Field
            label="Script Meta Pixel (Facebook / Instagram)"
            hint="Collez ici le code complet fourni par le Business Manager Meta. Il sera injecté uniquement sur cette landing page publique."
          >
            <textarea
              value={lp.metaPixel || ''}
              onChange={e => setField('metaPixel', e.target.value)}
              className={textareaCls}
              rows={6}
              placeholder={`<!-- Meta Pixel Code -->\n<script>\n  !function(f,b,e,v,n,t,s){...}\n</script>\n<!-- End Meta Pixel Code -->`}
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
            />
          </Field>
          {lp.metaPixel && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl">
              <CheckCircle2 size={14} className="text-green-600 shrink-0" />
              <p className="text-xs text-green-700 font-black">Pixel actif — sera injecté sur <code className="bg-green-100 px-1 rounded">/lp/{program.id}</code></p>
            </div>
          )}
          <p className="text-[11px] text-gray-400 font-medium">⚠️ Le script ne s'affiche pas sur l'aperçu admin — uniquement sur la page publique.</p>
        </Section>

        {/* ── Block 8: SEO & Social ────────────────────────────────────────── */}
        <Section title="SEO & Partage Social" badge="Visibilité" accent="bg-blue-600">
          <p className="text-sm font-medium text-gray-500 mb-4">
            Image affichée quand ce lien est partagé sur <strong>WhatsApp, Facebook</strong>, etc. Format idéal : <strong>1200 × 630 px</strong>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* ── Upload & Library ── */}
            <div className="space-y-3">
              {/* Upload from disk */}
              <label className={`flex items-center gap-3 p-4 border-4 border-black rounded-2xl bg-white hover:-translate-y-0.5 cursor-pointer transition-transform shadow-[4px_4px_0_0_black] group ${isUploadingOgImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center border-2 border-black shrink-0 group-hover:scale-110 transition-transform">
                  <Upload size={18} className="text-white" />
                </div>
                <div className="flex-grow">
                  <p className="font-black text-sm">{isUploadingOgImage ? '⏳ Upload en cours...' : 'Télécharger une image'}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Depuis votre ordinateur · JPG / PNG</p>
                </div>
                <input type="file" accept="image/*" onChange={handleOgImageUpload} disabled={isUploadingOgImage} className="hidden" />
              </label>

              {/* Choose from library */}
              <button
                type="button"
                onClick={() => { setIsMediaPickerForOgImage(true); setIsMediaPickerOpen(true); }}
                className="flex items-center gap-3 p-4 w-full border-4 border-black rounded-2xl bg-yellow-400 hover:-translate-y-0.5 cursor-pointer transition-transform shadow-[4px_4px_0_0_black] group"
              >
                <div className="w-10 h-10 bg-yellow-300 rounded-xl flex items-center justify-center border-2 border-black shrink-0 group-hover:scale-110 transition-transform">
                  <FolderArchive size={18} className="text-black" />
                </div>
                <div className="text-left flex-grow">
                  <p className="font-black text-sm">Choisir dans la bibliothèque</p>
                  <p className="text-[10px] text-yellow-900 font-bold uppercase tracking-wider">Réutiliser une image existante</p>
                </div>
              </button>

              {/* Manual URL input */}
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider block mb-1">Ou coller une URL directement</label>
                <input
                  value={lp.ogImage || ''}
                  onChange={e => setField('ogImage', e.target.value)}
                  className={inputCls}
                  placeholder="https://..."
                />
              </div>

              {/* Remove button */}
              {lp.ogImage && (
                <button
                  type="button"
                  onClick={() => setField('ogImage', '')}
                  className="w-full text-xs font-bold text-red-500 hover:text-red-700 border border-red-200 rounded-lg py-2 transition-colors"
                >
                  🗑️ Supprimer l'image sociale (utiliser l'image par défaut)
                </button>
              )}
            </div>

            {/* ── WhatsApp-style preview ── */}
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-wider">Aperçu WhatsApp ↓</p>
              <div className="border-2 border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  {lp.ogImage ? (
                    <img src={lp.ogImage} className="w-full h-full object-cover" alt="Social Preview" />
                  ) : (
                    <div className="flex flex-col items-center text-gray-300 gap-2 p-4">
                      <ImageIcon size={36} />
                      <span className="text-xs font-bold text-center">Aucune image — utilise l'image globale par défaut</span>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black uppercase">makerlab.ma</p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5 line-clamp-2">{lp.heroHeadline || program.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{lp.heroSubHeadline || program.shortDescription || program.description}</p>
                </div>
              </div>
              {lp.ogImage ? (
                <p className="text-[10px] text-blue-600 font-black mt-2">✅ Image personnalisée active</p>
              ) : (
                <p className="text-[10px] text-gray-400 font-bold mt-2">ℹ️ Image par défaut des paramètres utilisée</p>
              )}
            </div>
          </div>
        </Section>

        {/* Save button (bottom) */}
        <div className="flex justify-end pt-4 pb-10">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-10 py-4 text-lg shadow-neo-lg transition-all ${saved ? 'bg-green-500' : ''}`}
          >
            <Save size={20} className="mr-2" />
            {isSaving ? 'Sauvegarde en cours...' : saved ? '✓ Sauvegardé avec succès !' : 'Sauvegarder la Landing Page'}
          </Button>
        </div>
      </div>
    </div>

    {/* ── Crop Modal (portal-style, outside the scroll container) ── */}
    {pendingCropFile && (
      <CropModal
        file={pendingCropFile}
        onConfirm={handleCropConfirm}
        onCancel={() => setPendingCropFile(null)}
      />
    )}

    {/* ── Media Picker Modal ── */}
    {isMediaPickerOpen && (
      <MediaPickerModal
        onSelect={handleMediaPick}
        onCancel={() => setIsMediaPickerOpen(false)}
      />
    )}
    </>
  );
};
