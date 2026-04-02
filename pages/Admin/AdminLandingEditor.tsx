import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePrograms } from '../../contexts/ProgramContext';
import { LandingPageData, MissionBox } from '../../types';
import { Button } from '../../components/Button';
import {
  ArrowLeft, Save, Eye, Copy, Rocket, Plus, Trash2,
  ToggleLeft, ToggleRight, Upload, Image as ImageIcon, GripVertical, FolderArchive
} from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import imageCompression from 'browser-image-compression';
import { MediaPickerModal } from '../../components/MediaPickerModal';

const DEFAULT_LP: LandingPageData = {
  enabled: false,
  heroPreHeadline: 'ATTENTION PARENTS DE CASABLANCA (ENFANTS 8-14 ANS)',
  heroHeadline: "Transformez Son Temps d'Écran en Compétences d'Ingénieur en Seulement 3 Heures.",
  heroSubHeadline: "Pas de jouets en plastique. Pas de Lego. Vos enfants utiliseront de vrais outils, du vrai code et ramèneront chez eux un projet technologique qu'ils ont construit de leurs propres mains.",
  heroCtaText: 'RÉSERVER UNE MISSION POUR CE WEEK-END',
  heroScarcityText: '⏳ Places limitées à 20 Makers par session.',
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
};

/* ─── Section Card wrapper ─────────────────────────────────────────────────── */
const Section: React.FC<{ title: string; badge?: string; children: React.ReactNode; accent?: string }> = ({
  title, badge, children, accent = 'bg-orange-500'
}) => (
  <div className="bg-white rounded-2xl border-4 border-black shadow-[4px_4px_0_0_black] overflow-hidden">
    <div className={`flex items-center gap-3 px-6 py-4 border-b-4 border-black ${accent}`}>
      <h2 className="font-black text-xl text-black uppercase tracking-tight">{title}</h2>
      {badge && <span className="ml-auto text-xs font-black bg-black/20 text-black px-2 py-0.5 rounded-full uppercase">{badge}</span>}
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </div>
);

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

/* ─── Main Component ───────────────────────────────────────────────────────── */
export const AdminLandingEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProgram, updateProgram } = usePrograms();
  const [lp, setLp] = useState<LandingPageData>(DEFAULT_LP);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

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
    setField('galleryImages', [...(lp.galleryImages || []), url]);
    setIsMediaPickerOpen(false);
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

        {/* ── Block 4: Missions ═══════════════════════════════════════════════ */}
        <Section title="Block 4 — Missions (Scarcité)" badge="Conversion" accent="bg-red-500">
          <Field label="Titre de la section missions">
            <input value={lp.missionsHeadline || ''} onChange={e => setField('missionsHeadline', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Sous-titre">
            <textarea value={lp.missionsSubHeadline || ''} onChange={e => setField('missionsSubHeadline', e.target.value)} className={textareaCls} rows={2} />
          </Field>

          {/* Mission Boxes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="font-black text-sm uppercase tracking-wider">Créneaux / Missions</label>
              <button
                type="button"
                onClick={handleAddMission}
                className="flex items-center gap-2 px-3 py-2 bg-black text-white text-xs font-black rounded-xl hover:bg-gray-800 transition-colors"
              >
                <Plus size={14} /> Ajouter une Mission
              </button>
            </div>
            <div className="space-y-3">
              {(lp.missionBoxes || []).map((box, i) => (
                <MissionBoxEditor
                  key={box.id}
                  box={box}
                  index={i}
                  onChange={(updated) => updateMission(i, updated)}
                  onDelete={() => deleteMission(i)}
                />
              ))}
              {(lp.missionBoxes || []).length === 0 && (
                <p className="text-center text-sm text-gray-400 font-medium py-6 border-2 border-dashed border-gray-200 rounded-xl">
                  Aucune mission. Cliquez sur "+ Ajouter une Mission".
                </p>
              )}
            </div>
          </div>
        </Section>

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
