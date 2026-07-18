export type PipelineStatus = 'active' | 'paused' | 'blocked' | 'ready' | 'published';

export type PipelinePhaseId =
  | 'idea-factory'
  | 'intake'
  | 'concept-visual'
  | 'product-brief'
  | 'guide'
  | 'cad-bom'
  | 'packaging'
  | 'store-page'
  | 'pilot'
  | 'manufacturing'
  | 'published';

export type PipelinePhase = {
  id: PipelinePhaseId;
  label: string;
  shortLabel: string;
  description: string;
};

export type PhaseFile = {
  label: string;
  path: string;
  kind: 'brief' | 'guide' | 'visual' | 'print' | 'production' | 'store' | 'evidence' | 'folder';
  note?: string;
};

export type KitFactoryProduct = {
  id: string;
  title: string;
  subtitle: string;
  status: PipelineStatus;
  currentPhase: PipelinePhaseId;
  selectedPhase: PipelinePhaseId;
  readiness: number;
  nextAction: string;
  blockers: string[];
  assets: {
    intake?: string;
    store?: string;
    folder?: string;
    evidence?: string;
  };
  phaseFiles?: Partial<Record<PipelinePhaseId, PhaseFile[]>>;
};

export const pipelinePhases: PipelinePhase[] = [
  {
    id: 'idea-factory',
    label: 'Idea Factory',
    shortLabel: 'Idea',
    description: 'Generate product ideas aligned with learning goals, MakerLab setup and commercial potential.',
  },
  {
    id: 'intake',
    label: 'Product Intake',
    shortLabel: 'Intake',
    description: 'Capture product truth, real sources, components, links, CAD/files and decisions.',
  },
  {
    id: 'concept-visual',
    label: 'Concept Visual',
    shortLabel: 'Visual',
    description: 'Create one honest visual concept before committing to manufacturing work.',
  },
  {
    id: 'product-brief',
    label: 'Product Brief',
    shortLabel: 'Brief',
    description: 'Define promise, learner journey, product truth, paths, unknowns and evidence plan.',
  },
  {
    id: 'guide',
    label: 'Guide / Playbook',
    shortLabel: 'Guide',
    description: 'Create learner/family guide structure, checkpoints, troubleshooting and reflection.',
  },
  {
    id: 'cad-bom',
    label: 'CAD + BOM',
    shortLabel: 'CAD/BOM',
    description: 'Prepare design files, fabrication exports, parts list, quantities and sourcing notes.',
  },
  {
    id: 'packaging',
    label: 'Packaging',
    shortLabel: 'Pack',
    description: 'Create packaging mockups, print-ready files, labels and printer handoff requirements.',
  },
  {
    id: 'store-page',
    label: 'Store Page',
    shortLabel: 'Store',
    description: 'Publish controlled listing and conversion page without unapproved claims.',
  },
  {
    id: 'pilot',
    label: 'Pilot Test',
    shortLabel: 'Pilot',
    description: 'Run the product with learners/parents and capture feedback, issues and evidence.',
  },
  {
    id: 'manufacturing',
    label: 'Manufacturing Prep',
    shortLabel: 'Make',
    description: 'Prepare production jobs, QC, assembly workflow, inventory checks and packaging operations.',
  },
  {
    id: 'published',
    label: 'Published',
    shortLabel: 'Live',
    description: 'Product is approved for controlled/public sale with revision tracking.',
  },
];

export const initialKitFactoryProducts: KitFactoryProduct[] = [
  {
    id: 'smart-door',
    title: 'Engineering Smart Door',
    subtitle: 'Course + smart door kit from idea to working prototype.',
    status: 'active',
    currentPhase: 'store-page',
    selectedPhase: 'pilot',
    readiness: 58,
    nextAction: 'Run controlled pilot interest, then confirm price, BOM, safety and delivery before checkout.',
    blockers: [
      'Final BOM and supplier quantities not approved',
      'Age, duration, price and delivery promise still TBC',
      'Safety/compliance review not complete',
    ],
    assets: {
      intake: '/kit-factory/intake',
      store: '/store/smart-door',
      folder: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door',
      evidence: 'C:/Users/user/Documents/Makerlab Kit Factory/program/evidence/store-screenshots/smart-door-landing-v0.2.png',
    },
    phaseFiles: {
      'idea-factory': [
        {
          label: 'Fast prototype loop',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/program/FAST-PROTOTYPE-LOOP.md',
          kind: 'brief',
          note: 'Small-start product factory rule.',
        },
        {
          label: 'Smart Door product concept',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/01-product-concept.md',
          kind: 'brief',
        },
      ],
      intake: [
        {
          label: 'Product intake wizard',
          path: '/kit-factory/intake',
          kind: 'store',
          note: 'Web intake page for founder decisions.',
        },
        {
          label: 'Product README',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/README.md',
          kind: 'brief',
        },
      ],
      'concept-visual': [
        {
          label: 'Visual direction',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/04-visual-direction.md',
          kind: 'visual',
        },
        {
          label: 'Commercial hero visual',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/assets/smart-door-commercial-hero-v2.png',
          kind: 'visual',
        },
        {
          label: 'Unboxing visual',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/assets/smart-door-unboxing-kit-v1.png',
          kind: 'visual',
        },
      ],
      'product-brief': [
        {
          label: 'Product README',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/README.md',
          kind: 'brief',
        },
        {
          label: 'Product concept',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/01-product-concept.md',
          kind: 'brief',
        },
      ],
      guide: [
        {
          label: 'Guide skeleton',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/03-first-guide-skeleton.md',
          kind: 'guide',
        },
        {
          label: 'Plain guide skeleton',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/guide/PLAIN-GUIDE-SKELETON.md',
          kind: 'guide',
        },
        {
          label: 'Print-proof quick-start guide',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/print-production/guides/smart-door-quick-start-guide-v0.1-print-proof.pdf',
          kind: 'print',
        },
      ],
      'cad-bom': [
        {
          label: 'BOM part control',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/production/BOM-PART-CONTROL.md',
          kind: 'production',
        },
        {
          label: 'BOM template',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/production/bom-template.csv',
          kind: 'production',
        },
        {
          label: 'Rough prototype plan',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/02-rough-prototype-plan.md',
          kind: 'brief',
        },
      ],
      packaging: [
        {
          label: 'Packaging mock direction',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/05-packaging-mock.md',
          kind: 'print',
        },
        {
          label: 'Printer handoff spec',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/print-production/PRINTER-HANDOFF-SPEC.md',
          kind: 'print',
        },
        {
          label: 'Box front print proof',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/print-production/packaging/smart-door-box-front-panel-v0.1-print-proof.pdf',
          kind: 'print',
        },
        {
          label: 'Print manifest',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/print-production/PRINT-MANIFEST.csv',
          kind: 'print',
        },
      ],
      'store-page': [
        {
          label: 'Store landing page',
          path: '/store/smart-door',
          kind: 'store',
        },
        {
          label: 'Store listing',
          path: '/store',
          kind: 'store',
        },
        {
          label: 'Store screenshot evidence',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/program/evidence/store-screenshots/smart-door-landing-v0.2.png',
          kind: 'evidence',
        },
      ],
      pilot: [
        {
          label: 'Manual selling test',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/06-manual-selling-test.md',
          kind: 'brief',
        },
        {
          label: 'Feedback capture',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/07-feedback-capture.md',
          kind: 'evidence',
        },
        {
          label: 'Test offer sheet',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/08-test-offer-sheet.md',
          kind: 'evidence',
        },
        {
          label: 'Fast test run sheet',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/fast-prototype/09-fast-test-run-sheet.md',
          kind: 'evidence',
        },
      ],
      manufacturing: [
        {
          label: 'Production README',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/production/README.md',
          kind: 'production',
        },
        {
          label: 'Quality plan',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/production/QUALITY-PLAN.md',
          kind: 'production',
        },
        {
          label: 'DFM packout',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/production/DFM-PACKOUT.md',
          kind: 'production',
        },
        {
          label: 'Inspection plan template',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/smart-door/production/inspection-plan-template.csv',
          kind: 'production',
        },
      ],
      published: [
        {
          label: 'Current controlled store page',
          path: '/store/smart-door',
          kind: 'store',
          note: 'Not approved for full public checkout yet.',
        },
      ],
    },
  },
  {
    id: 'nova-quest-mini',
    title: 'Nova Quest Mini',
    subtitle: 'Course + rover adventure + physical robot kit.',
    status: 'active',
    currentPhase: 'store-page',
    selectedPhase: 'concept-visual',
    readiness: 42,
    nextAction: 'Improve real-product visuals, then confirm exact shield, motor system, battery and BOM.',
    blockers: [
      'Exact motor/servo system not confirmed',
      'Battery format and power safety not approved',
      'Packaging and unboxing visuals not created yet',
    ],
    assets: {
      intake: '/kit-factory/intake',
      store: '/store/nova-quest-mini',
      folder: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini',
      evidence: 'C:/Users/user/Documents/Makerlab Kit Factory/program/evidence/store-screenshots/nova-quest-mini-landing-v0.1.png',
    },
    phaseFiles: {
      'idea-factory': [
        {
          label: 'Nova Quest product concept',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini/fast-prototype/01-product-concept.md',
          kind: 'brief',
        },
      ],
      intake: [
        {
          label: 'Product intake wizard',
          path: '/kit-factory/intake',
          kind: 'store',
        },
        {
          label: 'Product README',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini/README.md',
          kind: 'brief',
        },
      ],
      'concept-visual': [
        {
          label: 'Visual direction',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini/fast-prototype/04-visual-direction.md',
          kind: 'visual',
        },
        {
          label: 'Real product reference',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini/fast-prototype/assets/source-real-product-reference-v0.png',
          kind: 'visual',
        },
        {
          label: 'Commercial hero visual',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini/fast-prototype/assets/nova-quest-mini-commercial-hero-v1.png',
          kind: 'visual',
        },
      ],
      'product-brief': [
        {
          label: 'Product README',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini/README.md',
          kind: 'brief',
        },
        {
          label: 'Fast prototype README',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini/fast-prototype/README.md',
          kind: 'brief',
        },
      ],
      guide: [
        {
          label: 'Source child workshop guide image',
          path: 'C:/Users/user/Downloads/Make_Go Guide de l’enfant.pdf.png',
          kind: 'guide',
          note: 'Reference only; needs commercial guide rewrite.',
        },
      ],
      'cad-bom': [
        {
          label: 'Product README',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini/README.md',
          kind: 'brief',
          note: 'Exact shield, motor system and power are still decisions.',
        },
      ],
      packaging: [
        {
          label: 'Packaging files',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini/print-production',
          kind: 'folder',
          note: 'Not created yet.',
        },
      ],
      'store-page': [
        {
          label: 'Store landing page',
          path: '/store/nova-quest-mini',
          kind: 'store',
        },
        {
          label: 'Store listing',
          path: '/store',
          kind: 'store',
        },
        {
          label: 'Store screenshot evidence',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/program/evidence/store-screenshots/nova-quest-mini-landing-v0.1.png',
          kind: 'evidence',
        },
      ],
      pilot: [
        {
          label: 'Pilot files',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini/fast-prototype',
          kind: 'folder',
          note: 'Pilot sheets still need to be created.',
        },
      ],
      manufacturing: [
        {
          label: 'Production files',
          path: 'C:/Users/user/Documents/Makerlab Kit Factory/kits/nova-quest-mini/production',
          kind: 'folder',
          note: 'Manufacturing pack not created yet.',
        },
      ],
      published: [
        {
          label: 'Controlled store page',
          path: '/store/nova-quest-mini',
          kind: 'store',
          note: 'Pilot page only; not approved for full checkout.',
        },
      ],
    },
  },
];
