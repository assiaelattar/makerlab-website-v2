import React from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  FileJson,
  Gauge,
  GitBranch,
  Link as LinkIcon,
  PackagePlus,
  Plus,
  Save,
  Settings2,
  Trash2,
  Wand2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Motion';
import { SEO } from '../components/SEO';
import { componentDecisionLibrary, type ComponentCandidate } from '../data/componentDecisionLibrary';

type ProjectPreset = 'smart-door' | 'nova-quest-mini' | 'new-product';

type ComponentRow = {
  id: string;
  name: string;
  quantity: string;
  role: string;
  realLink: string;
  status: 'confirmed' | 'to-confirm' | 'optional' | 'rejected';
  notes: string;
};

type ProductIntakeDraft = {
  projectPreset: ProjectPreset;
  productName: string;
  workingPromise: string;
  currentStatus: string;
  realProductPhotos: string;
  guideFiles: string;
  cadFiles: string;
  sourceLinks: string;
  physicalTruth: string;
  learnerJourney: string;
  commercialPaths: string;
  safetyNotes: string;
  openDecisions: string;
  components: ComponentRow[];
  updatedAt: string;
};

const STORAGE_KEY = 'makerlab-kit-factory-product-intake-v2';

const newComponent = (): ComponentRow => ({
  id: crypto.randomUUID(),
  name: '',
  quantity: '',
  role: '',
  realLink: '',
  status: 'to-confirm',
  notes: '',
});

const presetDrafts: Record<ProjectPreset, Partial<ProductIntakeDraft>> = {
  'smart-door': {
    projectPreset: 'smart-door',
    productName: 'Engineering Smart Door',
    workingPromise: 'Build a smart door from idea to working prototype.',
    currentStatus: 'Existing MakerLab project - commercial product loop in progress',
    physicalTruth:
      'Real MakerLab Smart Door: laser-cut MDF sliding door, micro:bit, shield/breakout, 180-degree servo, battery/power source, ultrasonic sensor, wires and USB programming cable. Do not redesign it into a different smart home product.',
    learnerJourney:
      'Discover smart doors -> design/understand the MDF mechanism -> simulate circuit -> learn sensor/servo roles -> program behavior -> assemble -> test -> improve/customize.',
    commercialPaths: 'Course + kit at home\nBuild it at MakerLab\nDesign/customize at home, fabricate at MakerLab',
  },
  'nova-quest-mini': {
    projectPreset: 'nova-quest-mini',
    productName: 'Nova Quest Mini',
    workingPromise: 'Build your own rover robot from idea to exploration mission.',
    currentStatus: 'Existing MakerLab workshop project - needs commercial product loop',
    physicalTruth:
      'Real Nova Quest Mini: boxy laser-cut MDF rover chassis, two side MDF wheels, visible wheel horn/linkage, micro:bit, Keyestudio-style micro:bit shield/expansion board with yellow pin headers, wires, power cable/battery connection. Do not make it rounded, futuristic, or like a toy car.',
    learnerJourney:
      'Discover rover missions -> design chassis -> place components -> prepare fabrication -> simulate circuit -> program movement with MakeCode -> assemble -> test -> create exploration challenge.',
    commercialPaths: 'Course + rover kit at home\nBuild it at MakerLab\nDesign/customize chassis at home, fabricate at MakerLab',
  },
  'new-product': {
    projectPreset: 'new-product',
    productName: '',
    workingPromise: '',
    currentStatus: 'New product idea - intake required before product loop',
    physicalTruth: '',
    learnerJourney: '',
    commercialPaths: 'Course + kit at home\nBuild it at MakerLab\nDesign/customize at home, fabricate at MakerLab',
  },
};

const emptyDraft = (): ProductIntakeDraft => ({
  projectPreset: 'smart-door',
  productName: '',
  workingPromise: '',
  currentStatus: 'Existing MakerLab project - needs commercial product loop',
  realProductPhotos: '',
  guideFiles: '',
  cadFiles: '',
  sourceLinks: '',
  physicalTruth: '',
  learnerJourney: '',
  commercialPaths: 'Course + kit at home\nBuild it at MakerLab\nDesign/customize at home, fabricate at MakerLab',
  safetyNotes: '',
  openDecisions: '',
  components: [],
  updatedAt: '',
});

const loadDraft = (): ProductIntakeDraft => {
  if (typeof window === 'undefined') return emptyDraft();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDraft();
    const parsed = JSON.parse(raw) as ProductIntakeDraft;
    return { ...emptyDraft(), ...parsed, components: parsed.components || [] };
  } catch {
    return emptyDraft();
  }
};

const safeSlug = (value: string) =>
  (value || 'new-product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const downloadFile = (filename: string, content: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const toMarkdown = (draft: ProductIntakeDraft) => `# Product Intake - ${draft.productName || 'Untitled product'}

## Working promise

${draft.workingPromise || 'TBC'}

## Current status

${draft.currentStatus || 'TBC'}

## Source evidence

### Real product photos

${draft.realProductPhotos || 'TBC'}

### Guide files

${draft.guideFiles || 'TBC'}

### CAD / fabrication files

${draft.cadFiles || 'TBC'}

### Source links

${draft.sourceLinks || 'TBC'}

## Physical truth

${draft.physicalTruth || 'TBC'}

## Components

| Component | Qty | Role | Link | Status | Notes |
| --- | --- | --- | --- | --- | --- |
${draft.components
  .map((item) => `| ${item.name || 'TBC'} | ${item.quantity || 'TBC'} | ${item.role || 'TBC'} | ${item.realLink || 'TBC'} | ${item.status} | ${(item.notes || 'TBC').replace(/\n/g, '<br>')} |`)
  .join('\n')}

## Learner journey

${draft.learnerJourney || 'TBC'}

## Commercial paths

${draft.commercialPaths || 'TBC'}

## Safety notes and unknowns

${draft.safetyNotes || 'TBC'}

## Open decisions before product loop

${draft.openDecisions || 'TBC'}

## Intake status

Saved locally from MakerLab Product Intake Wizard on ${draft.updatedAt || new Date().toISOString()}.
`;

const steps = [
  { title: 'Choose product', helper: 'Start from a known MakerLab project or a blank intake.' },
  { title: 'Add sources', helper: 'Give me the real evidence: photos, guide, CAD, links.' },
  { title: 'Decide parts', helper: 'Approve, reject, or mark component options to confirm.' },
  { title: 'Shape offer', helper: 'Define the learning journey and commercial paths.' },
  { title: 'Review & save', helper: 'Export the product truth before the loop starts.' },
];

export const ProductIntake: React.FC = () => {
  const [draft, setDraft] = React.useState<ProductIntakeDraft>(() => loadDraft());
  const [step, setStep] = React.useState(0);
  const [savedAt, setSavedAt] = React.useState<string>(draft.updatedAt);

  const candidates = componentDecisionLibrary.filter((item) => {
    if (draft.projectPreset === 'new-product') return item.project === 'shared';
    return item.project === 'shared' || item.project === draft.projectPreset;
  });

  const selectedCandidateIds = new Set(draft.components.map((item) => item.name));
  const confirmedCount = draft.components.filter((item) => item.status === 'confirmed').length;
  const toConfirmCount = draft.components.filter((item) => item.status === 'to-confirm').length;

  const update = <K extends keyof ProductIntakeDraft>(key: K, value: ProductIntakeDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const choosePreset = (preset: ProjectPreset) => {
    setDraft((current) => ({
      ...current,
      ...presetDrafts[preset],
      projectPreset: preset,
    }));
  };

  const addCandidate = (candidate: ComponentCandidate, status: ComponentRow['status'] = 'to-confirm') => {
    const row: ComponentRow = {
      id: crypto.randomUUID(),
      name: candidate.recommendedName,
      quantity: candidate.quantity,
      role: candidate.role,
      realLink: candidate.sourceUrl,
      status,
      notes: `${candidate.whySuggested}\nDecision: ${candidate.decisionQuestion}\nNotes: ${candidate.notes}`,
    };
    setDraft((current) => ({ ...current, components: [...current.components, row] }));
  };

  const updateComponent = (id: string, patch: Partial<ComponentRow>) => {
    setDraft((current) => ({
      ...current,
      components: current.components.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  };

  const saveLocal = () => {
    const next = { ...draft, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next, null, 2));
    setDraft(next);
    setSavedAt(next.updatedAt);
  };

  const exportJson = () => {
    const next = { ...draft, updatedAt: new Date().toISOString() };
    downloadFile(`${safeSlug(next.productName)}-product-intake.json`, JSON.stringify(next, null, 2), 'application/json');
  };

  const exportMarkdown = () => {
    const next = { ...draft, updatedAt: new Date().toISOString() };
    downloadFile(`${safeSlug(next.productName)}-product-intake.md`, toMarkdown(next), 'text/markdown');
  };

  const clearDraft = () => {
    if (!window.confirm('Clear this local wizard draft? Exported files will not be deleted.')) return;
    window.localStorage.removeItem(STORAGE_KEY);
    const next = emptyDraft();
    setDraft(next);
    setSavedAt('');
    setStep(0);
  };

  return (
    <div className="h-screen overflow-hidden bg-[#eef3f8] text-[#0f172a]">
      <SEO
        title="MakerLab Product Intake Wizard - Kit Factory"
        description="A guided onboarding wizard for capturing MakerLab product truth, component decisions, links and open questions before starting a kit loop."
        keywords="MakerLab product intake wizard, kit factory, product truth, STEM kit components"
      />

      <div className="grid h-full grid-cols-[64px_1fr]">
        <aside className="flex h-screen flex-col items-center border-r border-slate-200 bg-[#0b1220] py-4 text-white">
          <Link to="/kit-factory/dashboard" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#003c9e]" aria-label="Kit Factory dashboard">
            <Factory size={21} />
          </Link>
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
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${index === 2 ? 'bg-[#0057ff] text-white' : 'text-white/45 hover:bg-white/10 hover:text-white'}`}
                aria-label={label}
              >
                <Icon size={19} />
              </Link>
            ))}
          </div>
        </aside>

        <main className="h-screen overflow-auto">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#0042a5]" />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c8d8f2] bg-[#f4f8ff] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#0042a5]">
                <Bot size={15} />
                Autopilot product intake
              </div>
              <h1 className="mt-5 max-w-3xl text-[2.2rem] font-black leading-[0.94] text-[#003c9e] md:text-[3.4rem]">
                Answer questions. Choose parts. Save the truth.
              </h1>
              <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600">
                This wizard guides you before we start a product loop. It asks for the real photos, guide, CAD, components and open decisions, then exports a clean intake file for Codex to use.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="rounded-[1.4rem] border border-[#d8e4f6] bg-[#f8fbff] p-5 shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e30613]">Autopilot rule</p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-[#17242d]">No visuals, packaging or store copy before the intake is saved.</h2>
              <div className="mt-6 grid gap-3">
                {[
                  'I suggest likely components and links.',
                  'You approve, reject or mark them to confirm.',
                  'Unknown facts stay visible.',
                  'The final intake exports to JSON or Markdown.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-lg bg-white p-3">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[#10a858]" size={18} />
                    <span className="text-sm font-bold leading-6 text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="mb-6 rounded-[1.2rem] border border-[#d8e4f6] bg-white p-4 shadow-xl">
          <div className="grid gap-3 lg:grid-cols-5">
            {steps.map((item, index) => (
              <button
                key={item.title}
                onClick={() => setStep(index)}
                className={`rounded-[1rem] p-4 text-left transition ${
                  step === index ? 'bg-[#003c9e] text-white shadow-lg' : 'bg-[#f8fbff] text-slate-500 hover:bg-white'
                }`}
              >
                <p className={`text-xs font-black uppercase tracking-[0.14em] ${step === index ? 'text-white/70' : 'text-slate-400'}`}>Step {index + 1}</p>
                <p className="mt-1 text-lg font-black">{item.title}</p>
                <p className={`mt-2 text-xs font-semibold leading-5 ${step === index ? 'text-white/75' : 'text-slate-400'}`}>{item.helper}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.76fr_1.24fr]">
          <aside className="space-y-4">
            <div className="rounded-[1.2rem] border border-[#d8e4f6] bg-white p-5 shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e30613]">Current intake</p>
              <h2 className="mt-2 text-2xl font-black text-[#17242d]">{draft.productName || 'Untitled product'}</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{draft.workingPromise || 'Choose a product to start.'}</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Metric label="Components" value={String(draft.components.length)} />
                <Metric label="Confirmed" value={String(confirmedCount)} />
                <Metric label="To confirm" value={String(toConfirmCount)} />
                <Metric label="Saved" value={savedAt ? 'Yes' : 'No'} />
              </div>
            </div>

            <div className="rounded-[1.2rem] border border-[#d8e4f6] bg-white p-4 shadow-xl">
              <div className="flex flex-col gap-2">
                <button onClick={saveLocal} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003c9e] px-4 py-3 text-sm font-black text-white">
                  <Save size={17} /> Save locally
                </button>
                <button onClick={exportJson} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8e4f6] bg-white px-4 py-3 text-sm font-black text-[#003c9e]">
                  <FileJson size={17} /> Export JSON
                </button>
                <button onClick={exportMarkdown} className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8e4f6] bg-white px-4 py-3 text-sm font-black text-[#003c9e]">
                  <ArrowDownToLine size={17} /> Export Markdown
                </button>
                <button onClick={clearDraft} className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-[#e30613]">
                  <Trash2 size={17} /> Clear draft
                </button>
              </div>
              <p className="mt-3 text-xs font-bold leading-5 text-slate-400">
                {savedAt ? `Last saved: ${new Date(savedAt).toLocaleString()}` : 'Save before using this as source for a product loop.'}
              </p>
            </div>
          </aside>

          <main className="rounded-[1.4rem] border border-[#d8e4f6] bg-white p-5 shadow-xl md:p-7">
            {step === 0 && (
              <WizardPanel
                eyebrow="Question 1"
                title="Which product are we preparing?"
                intro="Choose a known MakerLab product to preload its truth, or start blank for a new idea."
              >
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ['smart-door', 'Engineering Smart Door', 'Smart door with micro:bit, ultrasonic sensor, servo and MDF mechanism.'],
                    ['nova-quest-mini', 'Nova Quest Mini', 'Boxy MDF rover robot with micro:bit shield, wheels, wiring and MakeCode.'],
                    ['new-product', 'New product', 'Start with a blank product intake and add your own sources.'],
                  ].map(([id, title, text]) => (
                    <button
                      key={id}
                      onClick={() => choosePreset(id as ProjectPreset)}
                      className={`rounded-[1.1rem] border p-5 text-left transition ${
                        draft.projectPreset === id ? 'border-[#003c9e] bg-[#f4f8ff] shadow-lg' : 'border-[#d8e4f6] bg-white hover:bg-[#f8fbff]'
                      }`}
                    >
                      <PackagePlus className={draft.projectPreset === id ? 'text-[#003c9e]' : 'text-slate-400'} size={28} />
                      <h3 className="mt-4 text-2xl font-black leading-tight text-[#17242d]">{title}</h3>
                      <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{text}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Input label="Product name" value={draft.productName} onChange={(value) => update('productName', value)} />
                  <Input label="Working promise" value={draft.workingPromise} onChange={(value) => update('workingPromise', value)} />
                </div>
                <WizardNav step={step} setStep={setStep} />
              </WizardPanel>
            )}

            {step === 1 && (
              <WizardPanel
                eyebrow="Question 2"
                title="What real evidence should I trust?"
                intro="Paste local paths, product links, guide links, CAD files, or notes. The more real evidence here, the less the product loop will invent."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Textarea label="Real product photos or local paths" value={draft.realProductPhotos} onChange={(value) => update('realProductPhotos', value)} rows={5} />
                  <Textarea label="Guide files" value={draft.guideFiles} onChange={(value) => update('guideFiles', value)} rows={5} />
                  <Textarea label="CAD / fabrication files" value={draft.cadFiles} onChange={(value) => update('cadFiles', value)} rows={5} />
                  <Textarea label="Supplier / gadget / source links" value={draft.sourceLinks} onChange={(value) => update('sourceLinks', value)} rows={5} />
                </div>
                <Textarea
                  label="Physical truth - what must stay consistent?"
                  value={draft.physicalTruth}
                  onChange={(value) => update('physicalTruth', value)}
                  rows={7}
                />
                <WizardNav step={step} setStep={setStep} />
              </WizardPanel>
            )}

            {step === 2 && (
              <WizardPanel
                eyebrow="Question 3"
                title="Which components should this product use?"
                intro="I suggest likely options. You choose. Add as confirmed if you are sure, or to-confirm if we still need stock/photo/supplier verification."
              >
                <div className="grid gap-3">
                  {candidates.map((candidate) => {
                    const alreadyAdded = selectedCandidateIds.has(candidate.recommendedName);
                    return (
                      <article key={candidate.id} className="rounded-[1rem] border border-[#d8e4f6] bg-[#f8fbff] p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <div className="flex flex-wrap gap-2">
                              <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#003c9e]">
                                {candidate.category}
                              </span>
                              <span className="rounded-full bg-[#fff3f4] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#e30613]">
                                decision needed
                              </span>
                            </div>
                            <h3 className="mt-3 text-xl font-black leading-tight text-[#17242d]">{candidate.recommendedName}</h3>
                            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{candidate.role}</p>
                            <div className="mt-3 rounded-lg bg-white p-3">
                              <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">Question</p>
                              <p className="mt-1 text-sm font-bold leading-6 text-slate-700">{candidate.decisionQuestion}</p>
                            </div>
                            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{candidate.whySuggested}</p>
                            {candidate.sourceUrl ? (
                              <a href={candidate.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-black text-[#003c9e]">
                                <LinkIcon size={16} /> {candidate.sourceLabel}
                              </a>
                            ) : (
                              <p className="mt-3 text-sm font-black text-slate-400">{candidate.sourceLabel}</p>
                            )}
                          </div>
                          <div className="flex shrink-0 flex-col gap-2">
                            <button
                              disabled={alreadyAdded}
                              onClick={() => addCandidate(candidate, 'confirmed')}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#10a858] px-4 py-3 text-sm font-black text-white disabled:opacity-40"
                            >
                              <CheckCircle2 size={16} /> Use it
                            </button>
                            <button
                              disabled={alreadyAdded}
                              onClick={() => addCandidate(candidate, 'to-confirm')}
                              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#003c9e] px-4 py-3 text-sm font-black text-white disabled:opacity-40"
                            >
                              <Plus size={16} /> To confirm
                            </button>
                            <button
                              disabled={alreadyAdded}
                              onClick={() => addCandidate(candidate, 'rejected')}
                              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-white px-4 py-3 text-sm font-black text-[#e30613] disabled:opacity-40"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[1rem] border border-[#d8e4f6] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-black text-[#17242d]">Selected components</h3>
                    <button
                      onClick={() => setDraft((current) => ({ ...current, components: [...current.components, newComponent()] }))}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#d8e4f6] bg-white px-4 py-2 text-sm font-black text-[#003c9e]"
                    >
                      <Plus size={16} /> Add custom
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {draft.components.length === 0 ? (
                      <p className="rounded-lg bg-[#f8fbff] p-4 text-sm font-bold text-slate-500">No component selected yet.</p>
                    ) : (
                      draft.components.map((component) => (
                        <div key={component.id} className="rounded-lg bg-[#f8fbff] p-4">
                          <div className="grid gap-3 md:grid-cols-2">
                            <Input label="Name" value={component.name} onChange={(value) => updateComponent(component.id, { name: value })} />
                            <Input label="Quantity" value={component.quantity} onChange={(value) => updateComponent(component.id, { quantity: value })} />
                            <Input label="Role" value={component.role} onChange={(value) => updateComponent(component.id, { role: value })} />
                            <label className="block">
                              <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-400">Status</span>
                              <select
                                value={component.status}
                                onChange={(event) => updateComponent(component.id, { status: event.target.value as ComponentRow['status'] })}
                                className="w-full rounded-lg border border-[#d8e4f6] bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#003c9e]"
                              >
                                <option value="confirmed">Confirmed</option>
                                <option value="to-confirm">To confirm</option>
                                <option value="optional">Optional</option>
                                <option value="rejected">Rejected</option>
                              </select>
                            </label>
                          </div>
                          <Input label="Real gadget / supplier link" value={component.realLink} onChange={(value) => updateComponent(component.id, { realLink: value })} />
                          <Textarea label="Notes" value={component.notes} onChange={(value) => updateComponent(component.id, { notes: value })} rows={2} />
                          <button
                            onClick={() => setDraft((current) => ({ ...current, components: current.components.filter((item) => item.id !== component.id) }))}
                            className="mt-2 inline-flex items-center gap-2 text-sm font-black text-[#e30613]"
                          >
                            <Trash2 size={16} /> Remove
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <WizardNav step={step} setStep={setStep} />
              </WizardPanel>
            )}

            {step === 3 && (
              <WizardPanel
                eyebrow="Question 4"
                title="What are we really selling?"
                intro="This is where we prevent the kit from becoming just parts. Define the course/adventure and the paths parents can choose."
              >
                <Textarea label="Learner journey" value={draft.learnerJourney} onChange={(value) => update('learnerJourney', value)} rows={7} />
                <Textarea label="Commercial paths" value={draft.commercialPaths} onChange={(value) => update('commercialPaths', value)} rows={5} />
                <Textarea label="Safety notes and unknowns" value={draft.safetyNotes} onChange={(value) => update('safetyNotes', value)} rows={5} />
                <Textarea label="Open decisions before starting product loop" value={draft.openDecisions} onChange={(value) => update('openDecisions', value)} rows={5} />
                <WizardNav step={step} setStep={setStep} />
              </WizardPanel>
            )}

            {step === 4 && (
              <WizardPanel
                eyebrow="Final check"
                title="Review the intake before the product loop starts."
                intro="If this looks right, save locally and export Markdown or JSON. Then Codex can safely generate product docs, visuals, packaging and store pages from the intake."
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <Metric label="Product" value={draft.productName || 'TBC'} />
                  <Metric label="Components" value={String(draft.components.length)} />
                  <Metric label="Open decisions" value={draft.openDecisions ? 'Captured' : 'Missing'} />
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <ReviewBlock title="Physical truth" text={draft.physicalTruth} />
                  <ReviewBlock title="Learner journey" text={draft.learnerJourney} />
                  <ReviewBlock title="Commercial paths" text={draft.commercialPaths} />
                  <ReviewBlock title="Safety and unknowns" text={draft.safetyNotes} />
                </div>
                <div className="mt-6 rounded-[1rem] bg-[#f8fbff] p-4">
                  <h3 className="text-xl font-black text-[#17242d]">Components</h3>
                  <div className="mt-3 grid gap-2">
                    {draft.components.length === 0 ? (
                      <p className="text-sm font-bold text-slate-500">No components selected yet.</p>
                    ) : (
                      draft.components.map((item) => (
                        <div key={item.id} className="flex flex-col justify-between gap-2 rounded-lg bg-white p-3 md:flex-row md:items-center">
                          <div>
                            <p className="font-black text-[#17242d]">{item.name || 'Unnamed component'}</p>
                            <p className="text-sm font-semibold text-slate-500">{item.role || 'Role TBC'}</p>
                          </div>
                          <span className="rounded-full bg-[#f4f8ff] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#003c9e]">
                            {item.status.replace('-', ' ')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  <button onClick={saveLocal} className="inline-flex items-center gap-2 rounded-lg bg-[#003c9e] px-5 py-3 text-sm font-black text-white">
                    <Save size={17} /> Save locally
                  </button>
                  <button onClick={exportJson} className="inline-flex items-center gap-2 rounded-lg border border-[#d8e4f6] bg-white px-5 py-3 text-sm font-black text-[#003c9e]">
                    <FileJson size={17} /> Export JSON
                  </button>
                  <button onClick={exportMarkdown} className="inline-flex items-center gap-2 rounded-lg border border-[#d8e4f6] bg-white px-5 py-3 text-sm font-black text-[#003c9e]">
                    <ArrowDownToLine size={17} /> Export Markdown
                  </button>
                </div>
                <WizardNav step={step} setStep={setStep} />
              </WizardPanel>
            )}
          </main>
        </div>
      </div>
        </main>
      </div>
    </div>
  );
};

const WizardPanel: React.FC<{ eyebrow: string; title: string; intro: string; children: React.ReactNode }> = ({ eyebrow, title, intro, children }) => (
  <Reveal>
    <section>
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#003c9e] text-white">
          <Wand2 size={22} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#e30613]">{eyebrow}</p>
          <h2 className="mt-2 text-4xl font-black leading-tight text-[#003c9e]">{title}</h2>
          <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-slate-600">{intro}</p>
        </div>
      </div>
      {children}
    </section>
  </Reveal>
);

const WizardNav: React.FC<{ step: number; setStep: (value: number) => void }> = ({ step, setStep }) => (
  <div className="mt-8 flex flex-col justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row">
    <button
      onClick={() => setStep(Math.max(0, step - 1))}
      disabled={step === 0}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#d8e4f6] bg-white px-5 py-3 text-sm font-black text-[#003c9e] disabled:opacity-40"
    >
      <ArrowLeft size={17} /> Back
    </button>
    <button
      onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
      disabled={step === steps.length - 1}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e30613] px-5 py-3 text-sm font-black text-white disabled:opacity-40"
    >
      Next <ArrowRight size={17} />
    </button>
  </div>
);

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-lg bg-[#f8fbff] p-4">
    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</p>
    <p className="mt-1 break-words text-lg font-black leading-tight text-[#003c9e]">{value}</p>
  </div>
);

const ReviewBlock: React.FC<{ title: string; text: string }> = ({ title, text }) => (
  <div className="rounded-[1rem] border border-[#d8e4f6] bg-[#f8fbff] p-4">
    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">{title}</p>
    <p className="mt-2 whitespace-pre-line text-sm font-semibold leading-6 text-slate-600">{text || 'TBC'}</p>
  </div>
);

const Input: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-[#d8e4f6] bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#003c9e]"
    />
  </label>
);

const Textarea: React.FC<{ label: string; value: string; onChange: (value: string) => void; placeholder?: string; rows?: number }> = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}) => (
  <label className="block">
    <span className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-400">{label}</span>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y rounded-lg border border-[#d8e4f6] bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none focus:border-[#003c9e]"
    />
  </label>
);
