import React from 'react';
import {
  AlertTriangle,
  Bot,
  Check,
  ChevronRight,
  Clipboard,
  Copy,
  Factory,
  FileText,
  FolderOpen,
  Gauge,
  GitBranch,
  Image as ImageIcon,
  Link as LinkIcon,
  Pause,
  Play,
  RotateCcw,
  Save,
  Search,
  Settings2,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import {
  initialKitFactoryProducts,
  pipelinePhases,
  type PhaseFile,
  type KitFactoryProduct,
  type PipelinePhaseId,
  type PipelineStatus,
} from '../data/kitFactoryPipeline';

const STORAGE_KEY = 'makerlab-kit-factory-dashboard-v1';
const defaultProductsById = Object.fromEntries(initialKitFactoryProducts.map((item) => [item.id, item]));

const loadProducts = (): KitFactoryProduct[] => {
  if (typeof window === 'undefined') return initialKitFactoryProducts;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialKitFactoryProducts;
    const parsed = JSON.parse(raw) as KitFactoryProduct[];
    if (!parsed?.length) return initialKitFactoryProducts;
    return parsed.map((savedProduct) => {
      const defaults = defaultProductsById[savedProduct.id];
      if (!defaults) return savedProduct;
      return {
        ...defaults,
        ...savedProduct,
        assets: {
          ...defaults.assets,
          ...savedProduct.assets,
        },
        phaseFiles: {
          ...defaults.phaseFiles,
          ...savedProduct.phaseFiles,
        },
      };
    });
  } catch {
    return initialKitFactoryProducts;
  }
};

const phaseIndex = (phase: PipelinePhaseId) => pipelinePhases.findIndex((item) => item.id === phase);

const statusDot: Record<PipelineStatus, string> = {
  active: 'bg-emerald-400',
  paused: 'bg-amber-400',
  blocked: 'bg-red-500',
  ready: 'bg-sky-400',
  published: 'bg-slate-900',
};

const makeLoopPrompt = (product: KitFactoryProduct) => {
  const phase = pipelinePhases.find((item) => item.id === product.selectedPhase);
  const phaseFiles = product.phaseFiles?.[product.selectedPhase] || [];
  return `Start the MakerLab Kit Factory loop for product "${product.title}".

Selected phase: ${phase?.label || product.selectedPhase}
Current phase: ${pipelinePhases.find((item) => item.id === product.currentPhase)?.label || product.currentPhase}
Product status: ${product.status}

Use the local product folder and evidence:
- Product folder: ${product.assets.folder || 'TBC'}
- Intake page: ${product.assets.intake || 'TBC'}
- Store page: ${product.assets.store || 'TBC'}
- Evidence: ${product.assets.evidence || 'TBC'}

Selected phase files:
${phaseFiles.map((file) => `- ${file.label}: ${file.path}${file.note ? ` (${file.note})` : ''}`).join('\n') || '- No phase files mapped yet'}

Goal for this loop:
${phase?.description || 'Run the selected product phase.'}

Current next action:
${product.nextAction}

Blockers / decisions to respect:
${product.blockers.map((item) => `- ${item}`).join('\n') || '- None recorded'}

Rules:
- Do not invent missing ages, prices, safety claims, exact BOM, delivery promises or component specs.
- Keep the product physically consistent with the saved real-product truth.
- Work only on this selected phase unless I approve expanding the scope.
- End with decisions requested, evidence produced, files changed, risks, dependencies and gate readiness.`;
};

export const KitFactoryDashboard: React.FC = () => {
  const [products, setProducts] = React.useState<KitFactoryProduct[]>(() => loadProducts());
  const [selectedId, setSelectedId] = React.useState(products[0]?.id || '');
  const [copied, setCopied] = React.useState(false);
  const [copiedPath, setCopiedPath] = React.useState('');
  const selected = products.find((item) => item.id === selectedId) || products[0];
  const selectedPhase = selected ? pipelinePhases.find((item) => item.id === selected.selectedPhase) : undefined;
  const selectedPhaseFiles = selected?.phaseFiles?.[selected.selectedPhase] || [];

  const saveLocal = (nextProducts = products) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts, null, 2));
  };

  const updateProduct = (id: string, patch: Partial<KitFactoryProduct>) => {
    setProducts((current) => {
      const next = current.map((item) => (item.id === id ? { ...item, ...patch } : item));
      saveLocal(next);
      return next;
    });
  };

  const resetLocal = () => {
    if (!window.confirm('Reset the local dashboard to the starter pipeline?')) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setProducts(initialKitFactoryProducts);
    setSelectedId(initialKitFactoryProducts[0].id);
  };

  const copyPrompt = async () => {
    if (!selected) return;
    await navigator.clipboard.writeText(makeLoopPrompt(selected));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const copyFilePath = async (file: PhaseFile) => {
    await navigator.clipboard.writeText(file.path);
    setCopiedPath(file.path);
    window.setTimeout(() => setCopiedPath(''), 1400);
  };

  const activeCount = products.filter((item) => item.status === 'active').length;
  const pausedCount = products.filter((item) => item.status === 'paused').length;
  const averageReady = Math.round(products.reduce((sum, item) => sum + item.readiness, 0) / Math.max(products.length, 1));

  return (
    <div className="h-screen overflow-hidden bg-[#eef3f8] text-[#0f172a]">
      <SEO
        title="Kit Factory Control Room - MakerLab"
        description="Local canvas dashboard for MakerLab product pipeline control."
        keywords="MakerLab kit factory dashboard, product pipeline, maker product OS"
      />

      <div className="grid h-full grid-cols-[64px_1fr_380px]">
        <aside className="flex h-screen flex-col items-center border-r border-slate-200 bg-[#0b1220] py-4 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#003c9e]">
            <Factory size={21} />
          </div>
          <div className="mt-8 flex flex-1 flex-col gap-3">
            {[
              { Icon: Factory, to: '/kit-factory/dashboard', label: 'Dashboard' },
              { Icon: GitBranch, to: '/kit-factory/dashboard', label: 'Pipeline' },
              { Icon: Bot, to: '/kit-factory/intake', label: 'Intake' },
              { Icon: Gauge, to: '/kit-factory/dashboard', label: 'Metrics' },
              { Icon: Settings2, to: '/kit-factory/dashboard', label: 'Settings' },
            ].map(({ Icon, to, label }, index) => (
              <Link
                key={label}
                to={to}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${index === 0 ? 'bg-[#0057ff] text-white' : 'text-white/45 hover:bg-white/10 hover:text-white'}`}
                aria-label={label}
              >
                <Icon size={19} />
              </Link>
            ))}
          </div>
          <button onClick={resetLocal} className="flex h-10 w-10 items-center justify-center rounded-xl text-white/45 hover:bg-white/10 hover:text-white" aria-label="Reset board">
            <RotateCcw size={18} />
          </button>
        </aside>

        <main className="flex h-screen flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/88 px-4 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">MakerLab OS</p>
                <h1 className="text-lg font-black leading-none text-slate-950">Kit Factory Canvas</h1>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">
                <Search size={15} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-400">Search products, phases, blockers...</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Pill label={`${products.length} products`} />
              <Pill label={`${activeCount} active`} />
              <Pill label={`${pausedCount} paused`} />
              <Pill label={`${averageReady}% avg`} />
              <Link to="/kit-factory/intake" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-[#003c9e] hover:bg-slate-50">
                Intake
              </Link>
              <button onClick={() => saveLocal()} className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#003c9e] text-white" aria-label="Save board">
                <Save size={16} />
              </button>
            </div>
          </header>

          <section className="relative flex-1 overflow-auto">
            <div className="absolute inset-0 opacity-[0.45]" style={{ backgroundImage: 'radial-gradient(#b8c7dc 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
            <div className="relative min-h-full p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Canvas</p>
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">Product chain</h2>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-1 shadow-sm backdrop-blur">
                  {['All', 'Active', 'Paused', 'Blocked'].map((item, index) => (
                    <button key={item} className={`rounded-xl px-3 py-2 text-xs font-black ${index === 0 ? 'bg-slate-950 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-2">
                {products.map((product, index) => (
                  <CanvasNode
                    key={product.id}
                    product={product}
                    index={index}
                    selected={selected?.id === product.id}
                    onSelect={() => setSelectedId(product.id)}
                    onUpdate={(patch) => updateProduct(product.id, patch)}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>

        {selected && (
          <aside className="flex h-screen flex-col border-l border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Inspector</p>
                  <h2 className="mt-1 text-2xl font-black leading-tight text-slate-950">{selected.title}</h2>
                  <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{selected.subtitle}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                  {selected.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniMetric label="Ready" value={`${selected.readiness}%`} />
                <MiniMetric label="Current" value={pipelinePhases.find((item) => item.id === selected.currentPhase)?.shortLabel || '-'} />
                <MiniMetric label="Run" value={pipelinePhases.find((item) => item.id === selected.selectedPhase)?.shortLabel || '-'} />
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-auto p-4">
              <Panel title="Files for this phase">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-slate-950">{selectedPhase?.label || 'Selected phase'}</p>
                      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{selectedPhase?.description}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                      {selectedPhaseFiles.length} files
                    </span>
                  </div>

                  <div className="space-y-2">
                    {selectedPhaseFiles.length ? (
                      selectedPhaseFiles.map((file) => (
                        <PhaseFileCard
                          key={`${file.label}-${file.path}`}
                          file={file}
                          copied={copiedPath === file.path}
                          onCopy={() => copyFilePath(file)}
                        />
                      ))
                    ) : (
                      <div className="rounded-xl bg-white p-3 text-xs font-semibold leading-5 text-slate-500">
                        No files are mapped yet for this phase. When we create them, they will appear here.
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <Panel title="Actions">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateProduct(selected.id, { status: selected.status === 'paused' ? 'active' : 'paused' })}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 py-3 text-xs font-black text-white"
                  >
                    {selected.status === 'paused' ? <Play size={15} /> : <Pause size={15} />}
                    {selected.status === 'paused' ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    onClick={() => updateProduct(selected.id, { status: selected.status === 'blocked' ? 'active' : 'blocked' })}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-xs font-black text-red-600"
                  >
                    <AlertTriangle size={15} />
                    {selected.status === 'blocked' ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </Panel>

              <Panel title="Run phase">
                <div className="grid grid-cols-2 gap-2">
                  {pipelinePhases.map((phase, index) => {
                    const isSelected = selected.selectedPhase === phase.id;
                    return (
                      <button
                        key={phase.id}
                        onClick={() => updateProduct(selected.id, { selectedPhase: phase.id })}
                        className={`rounded-xl border p-3 text-left transition ${
                          isSelected ? 'border-[#0057ff] bg-[#eff5ff]' : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{String(index + 1).padStart(2, '0')}</p>
                        <p className="mt-1 text-xs font-black leading-tight text-slate-900">{phase.label}</p>
                      </button>
                    );
                  })}
                </div>
              </Panel>

              <Panel title="Blockers">
                <div className="space-y-2">
                  {selected.blockers.map((item) => (
                    <div key={item} className="rounded-xl bg-red-50 p-3 text-xs font-bold leading-5 text-red-700">
                      {item}
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Assets">
                <div className="space-y-2">
                  {selected.assets.intake && <AssetLink label="Intake" to={selected.assets.intake} />}
                  {selected.assets.store && <AssetLink label="Store" to={selected.assets.store} />}
                  {selected.assets.folder && <AssetText label="Folder" value={selected.assets.folder} />}
                  {selected.assets.evidence && <AssetText label="Evidence" value={selected.assets.evidence} />}
                </div>
              </Panel>
            </div>

            <div className="border-t border-slate-200 p-4">
              <button onClick={copyPrompt} className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e30613] px-4 py-3 text-sm font-black text-white shadow-lg">
                <Clipboard size={16} /> {copied ? 'Copied prompt' : 'Copy Codex loop'}
              </button>
              <pre className="max-h-44 overflow-auto rounded-2xl bg-[#0b1220] p-4 text-[11px] font-semibold leading-5 text-white/75">
                {makeLoopPrompt(selected)}
              </pre>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

const CanvasNode: React.FC<{
  product: KitFactoryProduct;
  index: number;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<KitFactoryProduct>) => void;
}> = ({ product, index, selected, onSelect, onUpdate }) => {
  const currentIndex = phaseIndex(product.currentPhase);
  const selectedIndex = phaseIndex(product.selectedPhase);
  return (
    <article
      className={`group relative rounded-[24px] border bg-white/94 p-4 shadow-xl backdrop-blur transition ${
        selected ? 'border-[#0057ff] ring-4 ring-[#0057ff]/10' : 'border-slate-200 hover:border-slate-300'
      }`}
      style={{ transform: index % 2 ? 'translateY(28px)' : 'translateY(0)' }}
    >
      <button onClick={onSelect} className="block w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Zap size={21} />
              <span className={`absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white ${statusDot[product.status]}`} />
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">{product.status}</span>
                <span className="rounded-full bg-[#eff5ff] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#0057ff]">{product.readiness}%</span>
              </div>
              <h3 className="mt-2 text-xl font-black leading-tight text-slate-950">{product.title}</h3>
              <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{product.subtitle}</p>
            </div>
          </div>
          <ChevronRight className={`mt-3 text-slate-300 transition ${selected ? 'rotate-90 text-[#0057ff]' : 'group-hover:text-slate-500'}`} size={18} />
        </div>
      </button>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {pipelinePhases.map((phase, phaseIdx) => {
            const done = phaseIdx < currentIndex;
            const current = phaseIdx === currentIndex;
            const run = phaseIdx === selectedIndex;
            return (
              <button
                key={phase.id}
                title={phase.label}
                onClick={() => {
                  onSelect();
                  onUpdate({ selectedPhase: phase.id });
                }}
                className={`flex h-12 min-w-[84px] flex-col items-center justify-center rounded-xl text-[10px] font-black uppercase tracking-[0.08em] transition ${
                  run
                    ? 'bg-[#e30613] text-white shadow-lg'
                    : current
                      ? 'bg-[#0057ff] text-white'
                      : done
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-white text-slate-400 hover:text-slate-700'
                }`}
              >
                {done && !run ? <Check size={12} /> : <span>{String(phaseIdx + 1).padStart(2, '0')}</span>}
                <span>{phase.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Next action</p>
          <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-slate-600">{product.nextAction}</p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onUpdate({ status: product.status === 'paused' ? 'active' : 'paused' })}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200"
            aria-label="Pause or resume"
          >
            {product.status === 'paused' ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            onClick={() => onUpdate({ status: product.status === 'blocked' ? 'active' : 'blocked' })}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
            aria-label="Block or unblock"
          >
            <AlertTriangle size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

const kindStyle: Record<PhaseFile['kind'], string> = {
  brief: 'bg-blue-50 text-blue-700',
  guide: 'bg-violet-50 text-violet-700',
  visual: 'bg-emerald-50 text-emerald-700',
  print: 'bg-orange-50 text-orange-700',
  production: 'bg-slate-100 text-slate-700',
  store: 'bg-[#eff5ff] text-[#0057ff]',
  evidence: 'bg-red-50 text-red-700',
  folder: 'bg-slate-950 text-white',
};

const PhaseFileCard: React.FC<{
  file: PhaseFile;
  copied: boolean;
  onCopy: () => void;
}> = ({ file, copied, onCopy }) => {
  const isWebRoute = file.path.startsWith('/');
  const Icon = file.kind === 'visual' ? ImageIcon : file.kind === 'folder' ? FolderOpen : FileText;

  const cardContent = (
    <>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${kindStyle[file.kind]}`}>
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-xs font-black text-slate-950">{file.label}</p>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
            {file.kind}
          </span>
        </div>
        <p className="mt-1 truncate text-[10px] font-semibold text-slate-400">{file.path}</p>
        {file.note && <p className="mt-1 text-[10px] font-semibold leading-4 text-amber-600">{file.note}</p>}
      </div>
    </>
  );

  return (
    <div className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2">
      {isWebRoute ? (
        <Link to={file.path} className="flex min-w-0 flex-1 items-center gap-3">
          {cardContent}
        </Link>
      ) : (
        <button onClick={onCopy} className="flex min-w-0 flex-1 items-center gap-3 text-left" title="Copy local file path">
          {cardContent}
        </button>
      )}

      <button
        onClick={onCopy}
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
          copied ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700'
        }`}
        aria-label="Copy file path"
        title="Copy file path"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>
    </div>
  );
};

const Pill: React.FC<{ label: string }> = ({ label }) => (
  <span className="hidden rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-500 md:inline-flex">{label}</span>
);

const MiniMetric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl bg-slate-50 p-3">
    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
    <p className="mt-1 truncate text-sm font-black text-slate-950">{value}</p>
  </div>
);

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h3 className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">{title}</h3>
    <div>{children}</div>
  </section>
);

const AssetLink: React.FC<{ label: string; to: string }> = ({ label, to }) => (
  <Link to={to} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-xs font-black text-[#003c9e] hover:bg-slate-50">
    <span className="inline-flex items-center gap-2">
      <LinkIcon size={14} /> {label}
    </span>
    <ChevronRight size={14} />
  </Link>
);

const AssetText: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
    <p className="mt-1 break-all text-[11px] font-semibold leading-4 text-slate-600">{value}</p>
  </div>
);
