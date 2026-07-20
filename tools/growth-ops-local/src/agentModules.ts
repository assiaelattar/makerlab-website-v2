export type AgentModuleKey = 'growth-ops' | 'store-factory';
export type AgentNodeStatus = 'complete' | 'ready' | 'needs-input' | 'waiting';

export type AgentNodeIcon =
  | 'activity'
  | 'book'
  | 'brain'
  | 'factory'
  | 'image'
  | 'lightbulb'
  | 'package'
  | 'panels'
  | 'rocket'
  | 'search'
  | 'shield'
  | 'target'
  | 'workflow';

export interface AgentModuleNode {
  id: string;
  label: string;
  agent: string;
  summary: string;
  inputs: string[];
  outputs: string[];
  nextAction: string;
  prompt: string;
  icon: AgentNodeIcon;
  status: AgentNodeStatus;
  position: { x: number; y: number };
}

export interface AgentModuleEdge {
  from: string;
  to: string;
  label?: string;
}

export interface AgentModuleDefinition {
  key: AgentModuleKey;
  name: string;
  shortName: string;
  eyebrow: string;
  description: string;
  outcome: string;
  accent: 'lime' | 'orange';
  nodes: AgentModuleNode[];
  edges: AgentModuleEdge[];
}

const growthOps: AgentModuleDefinition = {
  key: 'growth-ops',
  name: 'Growth Operations',
  shortName: 'Growth Ops',
  eyebrow: 'Acquisition and conversion',
  description: 'Connect evidence, demand, journeys and one owned next action across the MakerLab website.',
  outcome: 'A source-cited daily decision that improves a real parent or school journey.',
  accent: 'lime',
  nodes: [
    {
      id: 'foundation',
      label: 'Operating context',
      agent: 'Growth orchestrator',
      summary: 'Protect the academy promise, audiences, offers and decision boundary.',
      inputs: ['Academy positioning', 'Recommended entry offer', 'Decision owner'],
      outputs: ['Shared operating brief', 'Approved scope'],
      nextAction: 'Complete identity and offer setup.',
      prompt: 'Review MakerLab operating context and identify the single missing decision that blocks trustworthy growth work.',
      icon: 'brain',
      status: 'needs-input',
      position: { x: 11, y: 18 },
    },
    {
      id: 'source-health',
      label: 'Source health',
      agent: 'Data steward',
      summary: 'Verify what is live, delayed, missing or only planned before interpreting performance.',
      inputs: ['GA4', 'Search Console', 'Firebase or CRM reporting'],
      outputs: ['Freshness report', 'Known data gaps'],
      nextAction: 'Declare owners and approved read scopes.',
      prompt: 'Audit MakerLab growth data sources. Label each source live, delayed, missing, or planned. Do not invent metrics.',
      icon: 'activity',
      status: 'waiting',
      position: { x: 37, y: 18 },
    },
    {
      id: 'demand',
      label: 'Demand reader',
      agent: 'Discoverability agent',
      summary: 'Read qualified search, referral and local intent instead of vanity traffic.',
      inputs: ['Search queries', 'Landing pages', 'Acquisition sources'],
      outputs: ['Demand themes', 'Qualified opportunity'],
      nextAction: 'Connect one approved demand source.',
      prompt: 'Use available MakerLab demand evidence to identify one qualified parent or school intent opportunity. Cite the source and comparison window.',
      icon: 'search',
      status: 'waiting',
      position: { x: 64, y: 18 },
    },
    {
      id: 'journey',
      label: 'Journey diagnosis',
      agent: 'Conversion agent',
      summary: 'Find the earliest credible friction from discovery to booking, Store enquiry or enrollment.',
      inputs: ['Journey events', 'Offer routes', 'Lead outcomes'],
      outputs: ['Friction hypothesis', 'Success signal'],
      nextAction: 'Define the primary conversion journey.',
      prompt: 'Trace one MakerLab journey from discovery to the desired action. Identify the earliest evidence-backed friction and a measurable success signal.',
      icon: 'target',
      status: 'waiting',
      position: { x: 84, y: 40 },
    },
    {
      id: 'action-brief',
      label: 'Action brief',
      agent: 'Growth orchestrator',
      summary: 'Choose one high-confidence action with an owner, expected signal and review date.',
      inputs: ['Demand opportunity', 'Journey friction', 'Effort and confidence'],
      outputs: ['Owned next action', 'Review checkpoint'],
      nextAction: 'Finish the operating setup first.',
      prompt: 'Prepare one MakerLab growth action brief with impact, effort, confidence, owner, journey, evidence, success signal and review date.',
      icon: 'workflow',
      status: 'waiting',
      position: { x: 61, y: 69 },
    },
    {
      id: 'trust',
      label: 'Trust gate',
      agent: 'Technical trust agent',
      summary: 'Check claims, consent, data exposure and whether an external action needs owner approval.',
      inputs: ['Action brief', 'Consent state', 'Approval boundary'],
      outputs: ['Approved action', 'Required correction'],
      nextAction: 'Record consent and approval rules.',
      prompt: 'Review the proposed MakerLab growth action for evidence, claims, consent, privacy, and external-write approval requirements.',
      icon: 'shield',
      status: 'waiting',
      position: { x: 34, y: 69 },
    },
    {
      id: 'review-loop',
      label: 'Review loop',
      agent: 'Growth orchestrator',
      summary: 'Compare the result with the earlier decision before opening unrelated work.',
      inputs: ['Previous action', 'Observed result', 'Source freshness'],
      outputs: ['Learning', 'Continue, change or stop decision'],
      nextAction: 'Activate after the first source-cited action.',
      prompt: 'Review the last MakerLab growth action against its success signal. State what changed, what did not, and the next decision.',
      icon: 'activity',
      status: 'waiting',
      position: { x: 10, y: 69 },
    },
  ],
  edges: [
    { from: 'foundation', to: 'source-health' },
    { from: 'source-health', to: 'demand' },
    { from: 'demand', to: 'journey' },
    { from: 'journey', to: 'action-brief' },
    { from: 'action-brief', to: 'trust' },
    { from: 'trust', to: 'review-loop' },
    { from: 'review-loop', to: 'foundation', label: 'learn' },
  ],
};

const storeFactory: AgentModuleDefinition = {
  key: 'store-factory',
  name: 'Store Factory',
  shortName: 'Store Factory',
  eyebrow: 'Idea to sellable learning product',
  description: 'Turn a credible project idea into a designed, documented and launch-ready MakerLab product.',
  outcome: 'A validated product concept with mockups, guide, visual pack, Store landing page and improvement loop.',
  accent: 'orange',
  nodes: [
    {
      id: 'idea-radar',
      label: 'Idea radar',
      agent: 'Opportunity scout',
      summary: 'Find product ideas where learner excitement, educational value and parent demand overlap.',
      inputs: ['Age range', 'MakerLab capabilities', 'Observed parent questions'],
      outputs: ['Shortlisted product ideas', 'Why-now evidence'],
      nextAction: 'Choose the learner age and problem to explore.',
      prompt: 'Find three MakerLab Store product ideas grounded in learner excitement, educational value, feasible fabrication and parent demand. Recommend one and explain why.',
      icon: 'lightbulb',
      status: 'ready',
      position: { x: 9, y: 17 },
    },
    {
      id: 'product-brief',
      label: 'Product brief',
      agent: 'Product strategist',
      summary: 'Define the learner, outcome, kit contents, constraints, price logic and proof required.',
      inputs: ['Selected idea', 'Target learner', 'Feasibility notes'],
      outputs: ['Product brief', 'Acceptance criteria'],
      nextAction: 'Complete the idea decision first.',
      prompt: 'Turn the selected MakerLab product idea into a product brief: user, problem, learning outcome, kit contents, constraints, price logic, proof and acceptance criteria.',
      icon: 'package',
      status: 'waiting',
      position: { x: 35, y: 17 },
    },
    {
      id: 'product-design',
      label: 'Product design',
      agent: 'Product architect',
      summary: 'Design the physical/digital experience, parts, assembly and manufacturability.',
      inputs: ['Approved brief', 'Component library', 'Safety constraints'],
      outputs: ['Product specification', 'Bill of materials', 'Prototype plan'],
      nextAction: 'Approve the product brief.',
      prompt: 'Design the approved MakerLab product as a manufacturable learning experience. Produce specifications, component decisions, bill of materials and prototype tests.',
      icon: 'factory',
      status: 'waiting',
      position: { x: 61, y: 17 },
    },
    {
      id: 'mockup-studio',
      label: 'Mockup studio',
      agent: 'Visual product director',
      summary: 'Generate packaging, in-use, detail and outcome visuals from the approved design.',
      inputs: ['Product specification', 'MakerLab visual system', 'Shot list'],
      outputs: ['Product mockups', 'Approved visual set'],
      nextAction: 'Complete the product specification.',
      prompt: 'Create the MakerLab product mockup plan: hero pack shot, learner-in-use scene, component detail, finished outcome and Store thumbnails. Use the MakerLab image studio workflow.',
      icon: 'image',
      status: 'waiting',
      position: { x: 84, y: 34 },
    },
    {
      id: 'guide-builder',
      label: 'Guide builder',
      agent: 'Learning experience writer',
      summary: 'Create the build guide, mentor notes, troubleshooting and extension challenge.',
      inputs: ['Prototype plan', 'Learning objectives', 'Test results'],
      outputs: ['Student guide', 'Mentor guide', 'Troubleshooting'],
      nextAction: 'Validate the prototype sequence.',
      prompt: 'Write the MakerLab product guides from the validated prototype: student build journey, mentor notes, checkpoints, troubleshooting, safety and next challenge.',
      icon: 'book',
      status: 'waiting',
      position: { x: 62, y: 70 },
    },
    {
      id: 'launch-kit',
      label: 'Launch kit',
      agent: 'Brand and content agent',
      summary: 'Package the name, promise, proof, visual assets and channel-ready launch content.',
      inputs: ['Approved visuals', 'Guides', 'Proof and risk reducer'],
      outputs: ['Name and messaging', 'Visual pack', 'Launch content'],
      nextAction: 'Finish mockups and guides.',
      prompt: 'Assemble the MakerLab Store launch kit: product name, clear promise, proof, risk reducer, visual asset checklist, parent-facing copy and social launch content.',
      icon: 'rocket',
      status: 'waiting',
      position: { x: 36, y: 70 },
    },
    {
      id: 'store-landing',
      label: 'Store landing',
      agent: 'Storefront composer',
      summary: 'Build the mobile-first product page, recommended choice, FAQs, SEO and conversion path.',
      inputs: ['Launch kit', 'Product facts', 'Approved price and CTA'],
      outputs: ['Store product page', 'Structured content', 'Conversion checklist'],
      nextAction: 'Approve the launch kit and product facts.',
      prompt: 'Build the MakerLab Store product landing brief: hero, visual proof, who it is for, what learners build, included items, recommended choice, guarantee wording, FAQs, SEO and CTA.',
      icon: 'panels',
      status: 'waiting',
      position: { x: 10, y: 70 },
    },
    {
      id: 'product-loop',
      label: 'Product loop',
      agent: 'Product growth agent',
      summary: 'Use real questions, sales, returns and workshop outcomes to improve the next version.',
      inputs: ['Store enquiries', 'Sales and returns', 'Learner outcomes'],
      outputs: ['Learning report', 'Version decision'],
      nextAction: 'Activate only after the product is in use.',
      prompt: 'Review the MakerLab product after launch using real enquiries, sales, returns and learner outcomes. Recommend continue, change or stop with evidence.',
      icon: 'activity',
      status: 'waiting',
      position: { x: 9, y: 43 },
    },
  ],
  edges: [
    { from: 'idea-radar', to: 'product-brief' },
    { from: 'product-brief', to: 'product-design' },
    { from: 'product-design', to: 'mockup-studio' },
    { from: 'product-design', to: 'guide-builder' },
    { from: 'mockup-studio', to: 'launch-kit' },
    { from: 'guide-builder', to: 'launch-kit' },
    { from: 'launch-kit', to: 'store-landing' },
    { from: 'store-landing', to: 'product-loop' },
    { from: 'product-loop', to: 'idea-radar', label: 'learn' },
  ],
};

export const agentModules: AgentModuleDefinition[] = [growthOps, storeFactory];
