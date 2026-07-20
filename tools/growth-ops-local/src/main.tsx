import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowRight,
  Bot,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  Copy,
  Database,
  Factory,
  FilePenLine,
  FileText,
  Gauge,
  Globe2,
  ImageIcon,
  Layers3,
  Lightbulb,
  LockKeyhole,
  Network,
  Package,
  PanelTop,
  RefreshCw,
  Rocket,
  Save,
  ScanSearch,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
  Workflow,
} from 'lucide-react';
import { agentModules, type AgentModuleDefinition, type AgentModuleKey, type AgentModuleNode, type AgentNodeIcon, type AgentNodeStatus } from './agentModules';
import './styles.css';

type IntegrationStatus = 'not-started' | 'ready-to-connect' | 'connected' | 'needs-review';
type ConsentStatus = 'not-reviewed' | 'review-needed' | 'approved';
type IntegrationKey = 'ga4' | 'searchConsole' | 'firebase' | 'crm' | 'businessProfile';
type View = 'command' | 'setup' | 'layers' | 'context';

interface Integration {
  status: IntegrationStatus;
  property: string;
  owner: string;
  notes: string;
}

interface LocalContext {
  schemaVersion: number;
  updatedAt: string | null;
  organization: {
    academyName: string;
    website: string;
    location: string;
    primaryAudience: string;
    positioning: string;
  };
  offers: {
    ageRange: string;
    recommendedEntry: string;
    keyOutcomes: string;
  };
  measurement: {
    primaryGoal: string;
    events: string;
    owner: string;
    consentStatus: ConsentStatus;
  };
  integrations: Record<IntegrationKey, Integration>;
  operatingLoop: {
    dailyBriefTime: string;
    decisionOwner: string;
    weeklyReview: string;
    approvalBoundary: string;
  };
}

const integrationDefinitions: Array<{ key: IntegrationKey; name: string; role: string; icon: LucideIcon; caution?: string }> = [
  { key: 'ga4', name: 'Google Analytics 4', role: 'Viewer on the selected property', icon: Activity },
  { key: 'searchConsole', name: 'Google Search Console', role: 'Full user on the selected property', icon: ScanSearch },
  { key: 'firebase', name: 'Firebase reporting', role: 'Scoped read-only reporting access', icon: Database },
  { key: 'crm', name: 'CRM / WhatsApp pipeline', role: 'Reporting-only seat or token', icon: UsersRound },
  { key: 'businessProfile', name: 'Google Business Profile', role: 'Manager with owner approval', icon: Globe2, caution: 'Manager access can make changes; do not automate writes.' },
];

const stepDefinitions: Array<{ label: string; eyebrow: string; icon: LucideIcon }> = [
  { label: 'Identity', eyebrow: 'Foundation', icon: Sparkles },
  { label: 'Offers', eyebrow: 'Value machine', icon: Target },
  { label: 'Measurement', eyebrow: 'Signals', icon: Gauge },
  { label: 'Access', eyebrow: 'Data boundary', icon: LockKeyhole },
  { label: 'Operating loop', eyebrow: 'Team rhythm', icon: Workflow },
  { label: 'Review', eyebrow: 'Ready to save', icon: ShieldCheck },
];

const statusCopy: Record<IntegrationStatus, string> = {
  'not-started': 'Not started',
  'ready-to-connect': 'Ready to connect',
  connected: 'Connected',
  'needs-review': 'Needs review',
};

const statusTone: Record<IntegrationStatus, string> = {
  'not-started': 'muted',
  'ready-to-connect': 'amber',
  connected: 'mint',
  'needs-review': 'orange',
};

const formatDate = (value: string | null) => value
  ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
  : 'Not saved yet';

const App: React.FC = () => {
  const [context, setContext] = useState<LocalContext | null>(null);
  const [activeView, setActiveView] = useState<View>('command');
  const [activeStep, setActiveStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadContext = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch('/local-api/context');
      if (!response.ok) throw new Error('Context could not be loaded.');
      const nextContext = await response.json() as LocalContext;
      setContext(nextContext);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Context could not be loaded.');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadContext();
  }, []);

  const completeness = useMemo(() => context ? [
    Boolean(context.organization.academyName && context.organization.website && context.organization.primaryAudience && context.organization.positioning),
    Boolean(context.offers.ageRange && context.offers.recommendedEntry && context.offers.keyOutcomes),
    Boolean(context.measurement.primaryGoal && context.measurement.events && context.measurement.owner && context.measurement.consentStatus !== 'not-reviewed'),
    integrationDefinitions.every(({ key }) => context.integrations[key].status !== 'not-started' && context.integrations[key].owner),
    Boolean(context.operatingLoop.dailyBriefTime && context.operatingLoop.decisionOwner && context.operatingLoop.weeklyReview),
  ] : [false, false, false, false, false], [context]);

  const completedCount = completeness.filter(Boolean).length;
  const connectedCount = context ? integrationDefinitions.filter(({ key }) => context.integrations[key].status === 'connected').length : 0;

  const saveContext = async () => {
    if (!context) return;
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch('/local-api/context', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });
      const result = await response.json() as LocalContext & { error?: string };
      if (!response.ok) throw new Error(result.error || 'Context could not be saved.');
      setContext(result);
      setMessage('Team context saved locally and mirrored to docs/ops/TEAM_CONTEXT.md.');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Context could not be saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateOrganization = (field: keyof LocalContext['organization'], value: string) => setContext(previous => previous ? ({ ...previous, organization: { ...previous.organization, [field]: value } }) : previous);
  const updateOffers = (field: keyof LocalContext['offers'], value: string) => setContext(previous => previous ? ({ ...previous, offers: { ...previous.offers, [field]: value } }) : previous);
  const updateMeasurement = (field: keyof LocalContext['measurement'], value: string) => setContext(previous => previous ? ({ ...previous, measurement: { ...previous.measurement, [field]: value } }) : previous);
  const updateOperatingLoop = (field: keyof LocalContext['operatingLoop'], value: string) => setContext(previous => previous ? ({ ...previous, operatingLoop: { ...previous.operatingLoop, [field]: value } }) : previous);
  const updateIntegration = (key: IntegrationKey, field: keyof Integration, value: string) => setContext(previous => previous ? ({ ...previous, integrations: { ...previous.integrations, [key]: { ...previous.integrations[key], [field]: value } } }) : previous);

  const openSetupStep = (step: number) => {
    setActiveStep(step);
    setActiveView('setup');
  };

  if (!context) {
    return <LoadingState error={error} onRetry={() => void loadContext()} />;
  }

  return (
    <main className="signal-app">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <aside className="rail" aria-label="Signal Room navigation">
        <div className="brand-mark" aria-label="MakerLab Signal Room"><span>ML</span><div className="brand-copy"><strong>MakerLab</strong><small>Signal Room</small></div></div>
        <nav className="rail-nav">
          <NavButton icon={CompassIcon} label="Command" active={activeView === 'command'} onClick={() => setActiveView('command')} />
          <NavButton icon={Settings2} label="Setup" active={activeView === 'setup'} onClick={() => setActiveView('setup')} badge={completedCount < 5 ? `${completedCount}/5` : undefined} />
          <NavButton icon={Layers3} label="Layers" active={activeView === 'layers'} onClick={() => setActiveView('layers')} />
          <NavButton icon={FileText} label="Context" active={activeView === 'context'} onClick={() => setActiveView('context')} />
        </nav>
        <div className="rail-footer">
          <span className="local-dot" />
          <span>Local workspace</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow"><span className="eyebrow-line" /> MakerLab growth operations</p>
            <h1>{activeView === 'command' ? 'Signal room' : activeView === 'setup' ? 'Operating setup' : activeView === 'layers' ? 'Health layers' : 'Team context'}</h1>
          </div>
          <div className="topbar-actions">
            <span className="local-mode"><LockKeyhole size={14} /> Local only · never deployed</span>
            <button type="button" className="icon-button" onClick={() => void loadContext()} aria-label="Refresh local context" disabled={isRefreshing}><RefreshCw size={17} className={isRefreshing ? 'spin' : ''} /></button>
            <button type="button" className="save-button" onClick={() => void saveContext()} disabled={isSaving}><Save size={16} />{isSaving ? 'Saving' : 'Save context'}</button>
          </div>
        </header>

        {message && <div className="notice notice-success" role="status"><Check size={16} />{message}<button type="button" onClick={() => setMessage(null)} aria-label="Dismiss message">×</button></div>}
        {error && <div className="notice notice-error" role="alert"><CircleAlert size={16} />{error}<button type="button" onClick={() => setError(null)} aria-label="Dismiss error">×</button></div>}

        {activeView === 'command' && <CommandView context={context} completedCount={completedCount} connectedCount={connectedCount} onOpenSetup={openSetupStep} />}
        {activeView === 'setup' && <SetupView context={context} activeStep={activeStep} completed={completeness} onStepChange={setActiveStep} onOrganization={updateOrganization} onOffers={updateOffers} onMeasurement={updateMeasurement} onIntegration={updateIntegration} onOperatingLoop={updateOperatingLoop} onSave={() => void saveContext()} isSaving={isSaving} />}
        {activeView === 'layers' && <LayersView context={context} completed={completeness} connectedCount={connectedCount} onOpenSetup={openSetupStep} />}
        {activeView === 'context' && <ContextView context={context} completedCount={completedCount} connectedCount={connectedCount} onOpenSetup={openSetupStep} onSave={() => void saveContext()} isSaving={isSaving} />}
      </section>
    </main>
  );
};

const CompassIcon = BrainCircuit;

const NavButton: React.FC<{ icon: LucideIcon; label: string; active: boolean; onClick: () => void; badge?: string }> = ({ icon: Icon, label, active, onClick, badge }) => (
  <button type="button" className={`rail-button ${active ? 'is-active' : ''}`} onClick={onClick}>
    <Icon size={18} /><span>{label}</span>{badge && <small>{badge}</small>}
  </button>
);

const LoadingState: React.FC<{ error: string | null; onRetry: () => void }> = ({ error, onRetry }) => (
  <main className="loading-screen">
    <div className="loading-orbit"><span /></div>
    <p className="eyebrow">MakerLab local workspace</p>
    <h1>{error ? 'The local context is not available.' : 'Opening Signal Room…'}</h1>
    <p>{error || 'Reading the team context from this project folder.'}</p>
    {error && <button type="button" className="save-button" onClick={onRetry}>Try again</button>}
  </main>
);

const moduleIconMap: Record<AgentNodeIcon, LucideIcon> = {
  activity: Activity,
  book: BookOpen,
  brain: BrainCircuit,
  factory: Factory,
  image: ImageIcon,
  lightbulb: Lightbulb,
  package: Package,
  panels: PanelTop,
  rocket: Rocket,
  search: Search,
  shield: ShieldCheck,
  target: Target,
  workflow: Workflow,
};

const statusLabels: Record<AgentNodeStatus, string> = {
  complete: 'Ready',
  ready: 'Start here',
  'needs-input': 'Needs input',
  waiting: 'Waiting',
};

const resolveGrowthNodes = (module: AgentModuleDefinition, context: LocalContext, completedCount: number, connectedCount: number): AgentModuleNode[] => module.nodes.map(node => {
  let status = node.status;
  if (node.id === 'foundation') status = completedCount >= 2 ? 'complete' : 'needs-input';
  if (node.id === 'source-health') status = connectedCount > 0 ? 'complete' : completedCount >= 2 ? 'ready' : 'waiting';
  if (node.id === 'demand') status = connectedCount > 0 ? 'ready' : 'waiting';
  if (node.id === 'journey') status = context.measurement.primaryGoal ? 'ready' : 'needs-input';
  if (node.id === 'action-brief') status = completedCount === 5 && connectedCount > 0 ? 'ready' : 'waiting';
  if (node.id === 'trust') status = context.measurement.consentStatus === 'approved' ? 'complete' : 'needs-input';
  return { ...node, status };
});

const CommandView: React.FC<{ context: LocalContext; completedCount: number; connectedCount: number; onOpenSetup: (step: number) => void }> = ({ context, completedCount, connectedCount, onOpenSetup }) => {
  const [activeModuleKey, setActiveModuleKey] = useState<AgentModuleKey>('growth-ops');
  const [selectedNodeId, setSelectedNodeId] = useState('foundation');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  const activeModule = agentModules.find(module => module.key === activeModuleKey) || agentModules[0];
  const nodes = activeModule.key === 'growth-ops'
    ? resolveGrowthNodes(activeModule, context, completedCount, connectedCount)
    : activeModule.nodes;
  const selectedNode = nodes.find(node => node.id === selectedNodeId) || nodes[0];
  const completeCount = nodes.filter(node => node.status === 'complete').length;
  const actionableCount = nodes.filter(node => node.status === 'ready' || node.status === 'needs-input').length;

  const selectModule = (key: AgentModuleKey) => {
    const module = agentModules.find(candidate => candidate.key === key);
    if (!module) return;
    setActiveModuleKey(key);
    setSelectedNodeId(module.nodes[0].id);
    setCopyState('idle');
  };

  const copyStageBrief = async () => {
    const brief = [
      `MakerLab module: ${activeModule.name}`,
      `Stage: ${selectedNode.label}`,
      `Agent role: ${selectedNode.agent}`,
      `Objective: ${selectedNode.summary}`,
      `Inputs: ${selectedNode.inputs.join('; ')}`,
      `Expected outputs: ${selectedNode.outputs.join('; ')}`,
      `Next action: ${selectedNode.nextAction}`,
      '',
      selectedNode.prompt,
      '',
      'Use the local repository and docs/ops context as the source of truth. Do not claim an external action was performed unless it was actually verified.',
    ].join('\n');
    try {
      await navigator.clipboard.writeText(brief);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };

  return <div className="view-stack command-view">
    <section className="module-intro">
      <div>
        <span className="live-label"><span className="local-dot" /> MakerLab agent operating system</span>
        <h2>See the whole system. <em>Enter at the right node.</em></h2>
        <p>Every MakerLab operation can reuse the same canvas: explicit stages, connected agents, required inputs, produced assets and a human approval boundary.</p>
      </div>
      <div className="module-switcher" role="tablist" aria-label="MakerLab operating modules">
        {agentModules.map(module => <button key={module.key} type="button" role="tab" aria-selected={activeModuleKey === module.key} className={activeModuleKey === module.key ? 'is-active' : ''} onClick={() => selectModule(module.key)}><span>{module.shortName}</span><small>{module.eyebrow}</small></button>)}
      </div>
    </section>

    <section className={`agent-module-workspace accent-${activeModule.accent}`} aria-label={`${activeModule.name} agent canvas`}>
      <header className="module-workspace-header">
        <div>
          <p className="section-kicker"><Network size={14} /> Active module</p>
          <h3>{activeModule.name}</h3>
          <p>{activeModule.description}</p>
        </div>
        <div className="module-health" aria-label="Module readiness">
          <span><strong>{completeCount}</strong> ready</span>
          <span><strong>{actionableCount}</strong> actionable</span>
          <span><strong>{nodes.length}</strong> stages</span>
        </div>
      </header>

      <div className="module-canvas-layout">
        <div className="agent-flow-canvas">
          <div className="flow-grid" aria-hidden="true" />
          <svg className="flow-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {activeModule.edges.map(edge => {
              const from = nodes.find(node => node.id === edge.from);
              const to = nodes.find(node => node.id === edge.to);
              if (!from || !to) return null;
              return <line key={`${edge.from}-${edge.to}`} x1={from.position.x} y1={from.position.y} x2={to.position.x} y2={to.position.y} />;
            })}
          </svg>
          <div className="canvas-legend"><span><span className="legend-dot is-ready" /> Ready</span><span><span className="legend-dot is-action" /> Action</span><span><span className="legend-dot" /> Waiting</span></div>
          {nodes.map(node => {
            const NodeIcon = moduleIconMap[node.icon];
            return <button key={node.id} type="button" className={`agent-flow-node status-${node.status} ${selectedNode.id === node.id ? 'is-selected' : ''}`} style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }} aria-pressed={selectedNode.id === node.id} onClick={() => { setSelectedNodeId(node.id); setCopyState('idle'); }}>
              <span className="node-icon"><NodeIcon size={17} /></span>
              <span className="node-copy"><small>{node.agent}</small><strong>{node.label}</strong></span>
              <span className="node-status">{statusLabels[node.status]}</span>
            </button>;
          })}
        </div>

        <aside className="node-inspector" aria-label={`${selectedNode.label} details`}>
          <div className="inspector-topline"><span className={`status-chip status-${selectedNode.status}`}>{statusLabels[selectedNode.status]}</span><small>{activeModule.shortName}</small></div>
          <div className="inspector-title"><span><NodeIconFor node={selectedNode} /></span><div><p>{selectedNode.agent}</p><h3>{selectedNode.label}</h3></div></div>
          <p className="inspector-summary">{selectedNode.summary}</p>
          <InspectorList title="Needs" items={selectedNode.inputs} />
          <InspectorList title="Produces" items={selectedNode.outputs} />
          <div className="inspector-next"><small>Recommended next action</small><strong>{selectedNode.nextAction}</strong></div>
          <button type="button" className="primary-action inspector-copy" onClick={() => void copyStageBrief()}><Copy size={16} />{copyState === 'copied' ? 'Brief copied' : copyState === 'error' ? 'Copy failed' : 'Copy stage brief'}</button>
          <p className="copy-disclaimer">Copies a Codex-ready brief. It does not run an agent or publish anything automatically.</p>
        </aside>
      </div>

      <footer className="module-outcome">
        <div><small>Module outcome</small><strong>{activeModule.outcome}</strong></div>
        {activeModule.key === 'growth-ops' ? <button type="button" className="ghost-action" onClick={() => onOpenSetup(Math.min(completedCount, 4))}>Configure Growth Ops <ArrowRight size={16} /></button> : <button type="button" className="ghost-action" onClick={() => void copyStageBrief()}>Start with {selectedNode.label} <ArrowRight size={16} /></button>}
      </footer>
    </section>
  </div>;
};

const NodeIconFor: React.FC<{ node: AgentModuleNode }> = ({ node }) => {
  const Icon = moduleIconMap[node.icon];
  return <Icon size={19} />;
};

const InspectorList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => <section className="inspector-list"><h4>{title}</h4><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></section>;

const SetupView: React.FC<{
  context: LocalContext;
  activeStep: number;
  completed: boolean[];
  onStepChange: (step: number) => void;
  onOrganization: (field: keyof LocalContext['organization'], value: string) => void;
  onOffers: (field: keyof LocalContext['offers'], value: string) => void;
  onMeasurement: (field: keyof LocalContext['measurement'], value: string) => void;
  onIntegration: (key: IntegrationKey, field: keyof Integration, value: string) => void;
  onOperatingLoop: (field: keyof LocalContext['operatingLoop'], value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}> = ({ context, activeStep, completed, onStepChange, onOrganization, onOffers, onMeasurement, onIntegration, onOperatingLoop, onSave, isSaving }) => {
  const step = stepDefinitions[activeStep];
  const StepIcon = step.icon;
  const navigate = (direction: -1 | 1) => onStepChange(Math.max(0, Math.min(stepDefinitions.length - 1, activeStep + direction)));

  return <div className="view-stack setup-view">
    <section className="setup-header">
      <div><p className="eyebrow"><span className="eyebrow-line" /> Setup is a shared brief, not a one-time form</p><h2>Give the agent team the rules it needs before it touches the growth machine.</h2></div>
      <p>You can enter steps in any order. Every save writes a structured local context plus a readable handoff for future Codex sessions.</p>
    </section>
    <div className="setup-layout">
      <aside className="stepper" aria-label="Setup steps">
        {stepDefinitions.map((item, index) => <button key={item.label} type="button" className={`stepper-item ${index === activeStep ? 'is-active' : ''} ${completed[index] ? 'is-complete' : ''}`} onClick={() => onStepChange(index)}><span>{completed[index] ? <Check size={14} /> : index + 1}</span><div><small>{item.eyebrow}</small><strong>{item.label}</strong></div></button>)}
      </aside>
      <section className="setup-panel">
        <div className="setup-panel-heading"><span className="panel-icon"><StepIcon size={20} /></span><div><p>{step.eyebrow}</p><h3>{step.label}</h3></div><span className={`completion-label ${completed[activeStep] ? 'is-complete' : ''}`}>{completed[activeStep] ? 'Complete' : 'In progress'}</span></div>
        {activeStep === 0 && <IdentityForm context={context} onChange={onOrganization} />}
        {activeStep === 1 && <OffersForm context={context} onChange={onOffers} />}
        {activeStep === 2 && <MeasurementForm context={context} onChange={onMeasurement} />}
        {activeStep === 3 && <AccessForm context={context} onChange={onIntegration} />}
        {activeStep === 4 && <OperatingLoopForm context={context} onChange={onOperatingLoop} />}
        {activeStep === 5 && <ReviewPanel context={context} completed={completed} />}
        <div className="setup-panel-footer"><button type="button" className="ghost-action" onClick={() => navigate(-1)} disabled={activeStep === 0}><ChevronLeft size={17} />Back</button><div><button type="button" className="save-quiet" onClick={onSave} disabled={isSaving}>{isSaving ? 'Saving…' : 'Save locally'}</button>{activeStep < stepDefinitions.length - 1 && <button type="button" className="primary-action" onClick={() => navigate(1)}>Next <ChevronRight size={17} /></button>}</div></div>
      </section>
    </div>
  </div>;
};

const Field: React.FC<{ label: string; helper?: string; children: React.ReactNode }> = ({ label, helper, children }) => <label className="field"><span>{label}</span>{children}{helper && <small>{helper}</small>}</label>;

const IdentityForm: React.FC<{ context: LocalContext; onChange: (field: keyof LocalContext['organization'], value: string) => void }> = ({ context, onChange }) => <div className="form-stack"><p className="form-intro">This is the starting context every growth agent should understand before it writes a recommendation.</p><div className="form-grid"><Field label="Academy name"><input value={context.organization.academyName} onChange={event => onChange('academyName', event.target.value)} /></Field><Field label="Website"><input value={context.organization.website} onChange={event => onChange('website', event.target.value)} /></Field><Field label="Location"><input value={context.organization.location} onChange={event => onChange('location', event.target.value)} /></Field><Field label="Primary audience"><input value={context.organization.primaryAudience} onChange={event => onChange('primaryAudience', event.target.value)} /></Field></div><Field label="Positioning statement" helper="Write the promise you want every page and agent decision to protect."><textarea rows={4} value={context.organization.positioning} onChange={event => onChange('positioning', event.target.value)} /></Field></div>;

const OffersForm: React.FC<{ context: LocalContext; onChange: (field: keyof LocalContext['offers'], value: string) => void }> = ({ context, onChange }) => <div className="form-stack"><p className="form-intro">Define the value path so an agent can connect public pages to a clear next step for a parent or school.</p><div className="form-grid"><Field label="Learner age range"><input value={context.offers.ageRange} onChange={event => onChange('ageRange', event.target.value)} /></Field><Field label="Recommended first step" helper="The offer you want parents to choose first."><input value={context.offers.recommendedEntry} onChange={event => onChange('recommendedEntry', event.target.value)} /></Field></div><Field label="Outcomes you can prove" helper="Examples: build a functioning project, present it, learn real tools, create a portfolio. Add only claims you can support."><textarea rows={6} value={context.offers.keyOutcomes} onChange={event => onChange('keyOutcomes', event.target.value)} /></Field></div>;

const MeasurementForm: React.FC<{ context: LocalContext; onChange: (field: keyof LocalContext['measurement'], value: string) => void }> = ({ context, onChange }) => <div className="form-stack"><p className="form-intro">Set the decision that measurement should support. This app records your plan; it does not collect analytics or create tracking automatically.</p><Field label="Primary growth decision" helper="For example: improve qualified free-workshop bookings from program pages."><input value={context.measurement.primaryGoal} onChange={event => onChange('primaryGoal', event.target.value)} /></Field><Field label="Events and milestones to measure" helper="Use plain language, separated by commas. Example: program view, workshop start, workshop complete, qualified lead, enrollment."><textarea rows={4} value={context.measurement.events} onChange={event => onChange('events', event.target.value)} /></Field><div className="form-grid"><Field label="Measurement owner"><input value={context.measurement.owner} onChange={event => onChange('owner', event.target.value)} /></Field><Field label="Consent readiness"><select value={context.measurement.consentStatus} onChange={event => onChange('consentStatus', event.target.value)}><option value="not-reviewed">Not reviewed</option><option value="review-needed">Review needed</option><option value="approved">Approved</option></select></Field></div></div>;

const AccessForm: React.FC<{ context: LocalContext; onChange: (key: IntegrationKey, field: keyof Integration, value: string) => void }> = ({ context, onChange }) => <div className="form-stack"><div className="access-callout"><LockKeyhole size={18} /><div><strong>Plan access without secrets.</strong><p>Record the owner, reporting scope and readiness. Do not add passwords, tokens, API keys or service-account files.</p></div></div>{integrationDefinitions.map(({ key, name, role, icon: Icon, caution }) => <section className="integration-editor" key={key}><div className="integration-editor-title"><span><Icon size={18} /></span><div><h4>{name}</h4><p>Minimum access: {role}</p></div><select aria-label={`${name} status`} value={context.integrations[key].status} onChange={event => onChange(key, 'status', event.target.value)}><option value="not-started">Not started</option><option value="ready-to-connect">Ready to connect</option><option value="connected">Connected</option><option value="needs-review">Needs review</option></select></div><div className="form-grid integration-fields"><Field label="Property / workspace"><input value={context.integrations[key].property} onChange={event => onChange(key, 'property', event.target.value)} /></Field><Field label="Connection owner"><input value={context.integrations[key].owner} onChange={event => onChange(key, 'owner', event.target.value)} /></Field></div><Field label="Notes"><input value={context.integrations[key].notes} onChange={event => onChange(key, 'notes', event.target.value)} /></Field>{caution && <small className="caution">{caution}</small>}</section>)}</div>;

const OperatingLoopForm: React.FC<{ context: LocalContext; onChange: (field: keyof LocalContext['operatingLoop'], value: string) => void }> = ({ context, onChange }) => <div className="form-stack"><p className="form-intro">A daily agent loop works only when a human owns decisions and external changes remain explicitly approved.</p><div className="form-grid"><Field label="Daily brief time"><input type="time" value={context.operatingLoop.dailyBriefTime} onChange={event => onChange('dailyBriefTime', event.target.value)} /></Field><Field label="Decision owner"><input value={context.operatingLoop.decisionOwner} onChange={event => onChange('decisionOwner', event.target.value)} /></Field><Field label="Weekly review moment"><input value={context.operatingLoop.weeklyReview} onChange={event => onChange('weeklyReview', event.target.value)} /></Field></div><Field label="Approval boundary" helper="Describe the actions that always require your explicit approval."><textarea rows={5} value={context.operatingLoop.approvalBoundary} onChange={event => onChange('approvalBoundary', event.target.value)} /></Field></div>;

const ReviewPanel: React.FC<{ context: LocalContext; completed: boolean[] }> = ({ context, completed }) => <div className="review-panel"><div className="review-score"><span>{completed.filter(Boolean).length}</span><small>of 5 operating layers ready</small></div><div><h4>Your agents will inherit this context</h4><p>{context.organization.positioning || 'Add a positioning statement so the team begins with the academy promise.'}</p></div><dl><div><dt>Recommended entry</dt><dd>{context.offers.recommendedEntry || 'Not set'}</dd></div><div><dt>Primary decision</dt><dd>{context.measurement.primaryGoal || 'Not set'}</dd></div><div><dt>Daily owner</dt><dd>{context.operatingLoop.decisionOwner || 'Not assigned'}</dd></div></dl><div className="review-safety"><ShieldCheck size={18} /><p>Saving creates two local files: a structured context for the app and a readable team brief for future Codex agents. Secrets and personal lead data are rejected.</p></div></div>;

const LayersView: React.FC<{ context: LocalContext; completed: boolean[]; connectedCount: number; onOpenSetup: (step: number) => void }> = ({ context, completed, connectedCount, onOpenSetup }) => <div className="view-stack layers-view"><section className="layers-heading"><p className="eyebrow"><span className="eyebrow-line" /> Separate health by the work it controls</p><h2>Five layers prevent a beautiful dashboard from hiding an unready system.</h2><p>Each layer is a decision surface. Green does not mean “good performance”; it means the team has provided the operating information required to inspect it responsibly.</p></section><div className="layer-stack"><HealthLayer number="01" title="Foundation" detail="What MakerLab promises, who it serves and the first recommended choice." status={completed[0] && completed[1] ? 'Ready for use' : 'Needs context'} icon={Sparkles} action="Edit identity & offers" onClick={() => onOpenSetup(completed[0] ? 1 : 0)} complete={completed[0] && completed[1]} /><HealthLayer number="02" title="Discoverability" detail="Search, LLM answer quality, technical SEO and local discovery signals." status={context.integrations.searchConsole.status === 'connected' ? 'Live source declared' : 'Source not connected'} icon={ScanSearch} action="Set search access" onClick={() => onOpenSetup(3)} complete={context.integrations.searchConsole.status === 'connected'} /><HealthLayer number="03" title="Conversion" detail="Program, mission, Store, workshop and follow-up routes that create momentum." status={completed[2] ? 'Measurement plan ready' : 'Measurement not defined'} icon={Target} action="Define measurement" onClick={() => onOpenSetup(2)} complete={completed[2]} /><HealthLayer number="04" title="Operations" detail="Source ownership, daily brief rhythm and the human who decides what happens next." status={completed[3] && completed[4] ? 'Operating loop ready' : `${connectedCount}/5 data sources connected`} icon={Workflow} action="Set owners & cadence" onClick={() => onOpenSetup(completed[3] ? 4 : 3)} complete={completed[3] && completed[4]} /><HealthLayer number="05" title="Trust boundary" detail="Consent readiness, proof discipline and approved limits for automation." status={context.measurement.consentStatus === 'approved' ? 'Consent noted' : 'Review required'} icon={ShieldCheck} action="Review safeguards" onClick={() => onOpenSetup(2)} complete={context.measurement.consentStatus === 'approved'} /></div></div>;

const HealthLayer: React.FC<{ number: string; title: string; detail: string; status: string; icon: LucideIcon; action: string; onClick: () => void; complete: boolean }> = ({ number, title, detail, status, icon: Icon, action, onClick, complete }) => <article className={`health-layer ${complete ? 'is-complete' : ''}`}><span className="layer-number">{number}</span><span className="layer-symbol"><Icon size={20} /></span><div className="layer-body"><h3>{title}</h3><p>{detail}</p></div><span className="health-status"><span className={complete ? 'status-pip is-ready' : 'status-pip'} />{status}</span><button type="button" onClick={onClick}>{action}<ArrowRight size={15} /></button></article>;

const ContextView: React.FC<{ context: LocalContext; completedCount: number; connectedCount: number; onOpenSetup: (step: number) => void; onSave: () => void; isSaving: boolean }> = ({ context, completedCount, connectedCount, onOpenSetup, onSave, isSaving }) => <div className="view-stack context-view"><section className="context-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> Persistent handoff</p><h2>One editable brief for the people and agents who continue the work.</h2></div><button type="button" className="primary-action" onClick={onSave} disabled={isSaving}><Save size={16} />{isSaving ? 'Saving' : 'Save team context'}</button></section><div className="context-grid"><article className="context-document"><div className="document-topline"><span><FilePenLine size={16} /> docs/ops/TEAM_CONTEXT.md</span><small>Updated {formatDate(context.updatedAt)}</small></div><div className="document-content"><h3>{context.organization.academyName || 'MakerLab Academy'}</h3><p>{context.organization.positioning || 'No positioning has been recorded.'}</p><hr /><ContextRow label="Audience" value={context.organization.primaryAudience} edit={() => onOpenSetup(0)} /><ContextRow label="Recommended entry" value={context.offers.recommendedEntry} edit={() => onOpenSetup(1)} /><ContextRow label="Measurement focus" value={context.measurement.primaryGoal} edit={() => onOpenSetup(2)} /><ContextRow label="Decision owner" value={context.operatingLoop.decisionOwner} edit={() => onOpenSetup(4)} /></div></article><article className="context-health"><p className="section-kicker"><FileText size={14} /> Context integrity</p><h3>{completedCount}/5 layers provide useful agent context.</h3><p>The tool saves structured data to <code>GROWTH_OPS_LOCAL_CONTEXT.json</code>, then mirrors it into a readable Markdown handoff. The website build does not read either file.</p><div className="integrity-list"><span><Check size={15} /> Local filesystem only</span><span><Check size={15} /> No website deployment route</span><span><Check size={15} /> Secrets rejected before save</span><span className={connectedCount ? '' : 'is-muted'}><Check size={15} /> {connectedCount ? `${connectedCount} declared live source${connectedCount === 1 ? '' : 's'}` : 'No live data declared'}</span></div></article></div></div>;

const ContextRow: React.FC<{ label: string; value: string; edit: () => void }> = ({ label, value, edit }) => <div className="context-row"><div><small>{label}</small><strong>{value || 'Not set'}</strong></div><button type="button" onClick={edit}>Edit</button></div>;

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
