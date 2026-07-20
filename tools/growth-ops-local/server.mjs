import express from 'express';
import { createServer as createViteServer } from 'vite';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryDirectory = path.resolve(toolDirectory, '..', '..');
const contextPath = path.join(repositoryDirectory, 'docs', 'ops', 'GROWTH_OPS_LOCAL_CONTEXT.json');
const teamContextPath = path.join(repositoryDirectory, 'docs', 'ops', 'TEAM_CONTEXT.md');
const port = Number(process.env.GROWTH_OPS_LOCAL_PORT || 5181);
const forbiddenKeyPattern = /(password|secret|api[-_ ]?key|private[-_ ]?key|credential|token)/i;
const suspiciousValuePattern = /(-----BEGIN [A-Z ]+(PRIVATE KEY|CERTIFICATE)-----|AIza[0-9A-Za-z_-]{20,}|ya29\.[A-Za-z0-9._-]+|sk-[A-Za-z0-9_-]{20,})/i;

const allowedStatuses = new Set(['not-started', 'ready-to-connect', 'connected', 'needs-review']);
const allowedConsentStatuses = new Set(['not-reviewed', 'review-needed', 'approved']);

const asString = (value, maximum = 1000) => typeof value === 'string' ? value.trim().slice(0, maximum) : '';

const hasForbiddenData = (value) => {
  if (typeof value === 'string') return suspiciousValuePattern.test(value);
  if (Array.isArray(value)) return value.some(hasForbiddenData);
  if (value && typeof value === 'object') return Object.entries(value).some(([key, child]) => forbiddenKeyPattern.test(key) || hasForbiddenData(child));
  return false;
};

const normalizeIntegration = (value = {}) => ({
  status: allowedStatuses.has(value.status) ? value.status : 'not-started',
  property: asString(value.property, 300),
  owner: asString(value.owner, 120),
  notes: asString(value.notes, 800),
});

const normalizeContext = (value = {}) => ({
  schemaVersion: 1,
  updatedAt: new Date().toISOString(),
  organization: {
    academyName: asString(value.organization?.academyName, 120),
    website: asString(value.organization?.website, 200),
    location: asString(value.organization?.location, 120),
    primaryAudience: asString(value.organization?.primaryAudience, 200),
    positioning: asString(value.organization?.positioning, 900),
  },
  offers: {
    ageRange: asString(value.offers?.ageRange, 80),
    recommendedEntry: asString(value.offers?.recommendedEntry, 240),
    keyOutcomes: asString(value.offers?.keyOutcomes, 900),
  },
  measurement: {
    primaryGoal: asString(value.measurement?.primaryGoal, 300),
    events: asString(value.measurement?.events, 900),
    owner: asString(value.measurement?.owner, 120),
    consentStatus: allowedConsentStatuses.has(value.measurement?.consentStatus) ? value.measurement.consentStatus : 'not-reviewed',
  },
  integrations: {
    ga4: normalizeIntegration(value.integrations?.ga4),
    searchConsole: normalizeIntegration(value.integrations?.searchConsole),
    firebase: normalizeIntegration(value.integrations?.firebase),
    crm: normalizeIntegration(value.integrations?.crm),
    businessProfile: normalizeIntegration(value.integrations?.businessProfile),
  },
  operatingLoop: {
    dailyBriefTime: asString(value.operatingLoop?.dailyBriefTime, 12),
    decisionOwner: asString(value.operatingLoop?.decisionOwner, 120),
    weeklyReview: asString(value.operatingLoop?.weeklyReview, 120),
    approvalBoundary: asString(value.operatingLoop?.approvalBoundary, 900),
  },
});

const markdown = (value) => value.replace(/[\\`*_{}[\]<>]/g, '\\$&');

const toTeamContext = (context) => {
  const integrations = [
    ['Google Analytics 4', context.integrations.ga4],
    ['Google Search Console', context.integrations.searchConsole],
    ['Firebase reporting', context.integrations.firebase],
    ['CRM / WhatsApp pipeline', context.integrations.crm],
    ['Google Business Profile', context.integrations.businessProfile],
  ];

  const integrationRows = integrations.map(([name, integration]) => `| ${name} | ${integration.status} | ${markdown(integration.property || 'Not set')} | ${markdown(integration.owner || 'Not assigned')} |`).join('\n');

  return `# Team context — MakerLab Growth Ops\n\nLast saved: ${context.updatedAt}\nSource: \`docs/ops/GROWTH_OPS_LOCAL_CONTEXT.json\` via the localhost-only Growth Ops application.\n\n## Organization\n\n- Academy: ${markdown(context.organization.academyName || 'Not set')}\n- Website: ${markdown(context.organization.website || 'Not set')}\n- Location: ${markdown(context.organization.location || 'Not set')}\n- Primary audience: ${markdown(context.organization.primaryAudience || 'Not set')}\n- Positioning: ${markdown(context.organization.positioning || 'Not set')}\n\n## Offers and outcomes\n\n- Learner age range: ${markdown(context.offers.ageRange || 'Not set')}\n- Recommended entry: ${markdown(context.offers.recommendedEntry || 'Not set')}\n- Intended outcomes: ${markdown(context.offers.keyOutcomes || 'Not set')}\n\n## Measurement\n\n- Primary goal: ${markdown(context.measurement.primaryGoal || 'Not set')}\n- Events / milestones: ${markdown(context.measurement.events || 'Not set')}\n- Measurement owner: ${markdown(context.measurement.owner || 'Not assigned')}\n- Consent readiness: ${markdown(context.measurement.consentStatus)}\n\n## Data-source register\n\n| Source | Status | Property / workspace | Owner |\n| --- | --- | --- | --- |\n${integrationRows}\n\n## Operating loop\n\n- Daily brief time: ${markdown(context.operatingLoop.dailyBriefTime || 'Not set')}\n- Decision owner: ${markdown(context.operatingLoop.decisionOwner || 'Not assigned')}\n- Weekly review: ${markdown(context.operatingLoop.weeklyReview || 'Not set')}\n- Approval boundary: ${markdown(context.operatingLoop.approvalBoundary || 'Not set')}\n\n## Safety boundary\n\nThis context records planning and ownership only. Do not store passwords, API keys, OAuth tokens, service-account files, or raw child/lead data here.\n`;
};

const readContext = async () => JSON.parse(await fs.readFile(contextPath, 'utf8'));

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '250kb' }));

app.get('/local-api/health', async (_request, response) => {
  response.json({ mode: 'localhost-only', storage: 'docs/ops', port, ready: true });
});

app.get('/local-api/context', async (_request, response, next) => {
  try {
    response.json(await readContext());
  } catch (error) {
    next(error);
  }
});

app.put('/local-api/context', async (request, response, next) => {
  try {
    if (!request.body || hasForbiddenData(request.body)) {
      response.status(400).json({ error: 'This local context accepts planning data only. Do not save passwords, tokens, API keys, or secrets.' });
      return;
    }

    const context = normalizeContext(request.body);
    await fs.writeFile(contextPath, `${JSON.stringify(context, null, 2)}\n`, 'utf8');
    await fs.writeFile(teamContextPath, toTeamContext(context), 'utf8');
    response.json(context);
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: 'The local context could not be saved. Check that the project folder is writable and retry.' });
});

const vite = await createViteServer({
  root: toolDirectory,
  server: { middlewareMode: true },
  appType: 'spa',
});

app.use(vite.middlewares);

app.listen(port, '127.0.0.1', () => {
  console.log(`MakerLab Local Signal Room is running at http://127.0.0.1:${port}`);
});
