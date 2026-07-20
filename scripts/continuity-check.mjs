import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const requiredFiles = [
  'AGENTS.md',
  'docs/ops/CURRENT_STATE.md',
  'docs/ops/GROWTH_MODEL.md',
  'docs/ops/DECISIONS.md',
  'docs/ops/WORK_QUEUE.md',
  'docs/ops/CHANGELOG.md',
  'docs/ops/templates/FEATURE_BRIEF.md',
];

const missing = requiredFiles.filter(file => !existsSync(resolve(file)));
if (missing.length) {
  throw new Error(`Missing continuity files:\n${missing.map(file => `- ${file}`).join('\n')}`);
}

const currentState = readFileSync(resolve('docs/ops/CURRENT_STATE.md'), 'utf8');
if (!/^Last reviewed:\s\d{4}-\d{2}-\d{2}$/m.test(currentState)) {
  throw new Error('docs/ops/CURRENT_STATE.md must include a YYYY-MM-DD Last reviewed line.');
}

const staged = process.argv.includes('--staged');
const changed = staged
  ? execFileSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' })
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
  : execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean)
    .map(line => line.slice(3).trim());
const nonOpsChanges = changed.filter(file => !file.startsWith('docs/ops/') && file !== 'AGENTS.md');
const memoryUpdated = changed.some(file => file.startsWith('docs/ops/') || file === 'AGENTS.md');

if (nonOpsChanges.length && !memoryUpdated) {
  throw new Error('Code or asset changes are present without a matching AGENTS.md or docs/ops update. Record the decision, state, queue, or changelog before handoff.');
}

console.log(`Continuity check passed (${staged ? 'staged' : 'working tree'} mode).`);
