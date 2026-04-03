/**
 * inject-seo.js
 * Run after `vite build` to fetch social image from Firestore and
 * inject it into dist/index.html so crawlers always get the right og:image.
 * 
 * Usage: node scripts/inject-seo.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_HTML = path.join(__dirname, '..', 'dist', 'index.html');

const FIRESTORE_PROJECT = 'edufy-makerlab';
const DATABASE = 'websitev2';
const BASE = 'https://firestore.googleapis.com/v1/projects';

async function fetchSetting(key) {
  try {
    const res = await fetch(`${BASE}/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-settings/${key}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.fields?.value?.stringValue || null;
  } catch {
    return null;
  }
}

function injectMeta(html, property, content, isName = false) {
  const attr = isName ? 'name' : 'property';
  const stripRegex = new RegExp(`\\s*<meta\\s[^>]*${attr}=['"]${property}['"][^>]*>`, 'gi');
  html = html.replace(stripRegex, '');
  const newTag = `  <meta ${attr}="${property}" content="${content}" />\n`;
  return html.replace('</head>', `${newTag}</head>`);
}

async function run() {
  if (!fs.existsSync(DIST_HTML)) {
    console.error('❌ dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  console.log('📡 Fetching SEO settings from Firestore...');
  const [socialImage, gaId, gscCode] = await Promise.all([
    fetchSetting('socialImage'),
    fetchSetting('googleAnalyticsId'),
    fetchSetting('gscVerification'),
  ]);

  console.log('  socialImage:', socialImage ? '✅ found' : '❌ not set');
  console.log('  GA4 ID:    ', gaId     ? '✅ ' + gaId : '❌ not set');
  console.log('  GSC code:  ', gscCode  ? '✅ found' : '❌ not set');

  let html = fs.readFileSync(DIST_HTML, 'utf8');

  // Remove any leftover og:image / twitter:image from the static build
  html = html.replace(/\s*<meta\s[^>]*property=['"]og:image['"][^>]*>/gi, '');
  html = html.replace(/\s*<meta\s[^>]*name=['"]twitter:image['"][^>]*>/gi, '');

  if (socialImage) {
    html = injectMeta(html, 'og:image', socialImage);
    html = injectMeta(html, 'og:image:width', '1200');
    html = injectMeta(html, 'og:image:height', '630');
    html = injectMeta(html, 'twitter:image', socialImage, true);
    console.log('  ✅ og:image injected into dist/index.html');
  } else {
    console.log('  ⚠️  No socialImage — og:image will not appear on home page');
  }

  if (gscCode) {
    html = injectMeta(html, 'google-site-verification', gscCode, true);
    console.log('  ✅ GSC verification tag injected');
  }

  if (gaId) {
    // Remove any existing GA scripts first
    html = html.replace(/\s*<script[^>]*googletagmanager[^>]*>[\s\S]*?<\/script>/gi, '');
    const gaScript = [
      `  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>`,
      `  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');</script>`,
    ].join('\n');
    html = html.replace('</head>', `${gaScript}\n</head>`);
    console.log('  ✅ GA4 scripts injected');
  }

  fs.writeFileSync(DIST_HTML, html, 'utf8');
  console.log('\n✅ dist/index.html updated with live SEO settings.');
}

run().catch(err => {
  console.error('❌ inject-seo failed:', err.message);
  process.exit(1);
});
