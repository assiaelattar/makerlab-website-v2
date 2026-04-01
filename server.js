import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Paths ────────────────────────────────────────────────────────────────────
const indexPath = path.join(__dirname, 'dist', 'index.html');

// ─── Firestore config ─────────────────────────────────────────────────────────
const FIRESTORE_PROJECT = 'edufy-makerlab';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'https://space.makerlab.academy';
const DEFAULT_IMAGE = `${BASE_DOMAIN}/logo-social.jpg`;

// ─── HTML singleton cache ─────────────────────────────────────────────────────
let cachedIndexHtml = null;
const readIndexHtml = () => {
  if (cachedIndexHtml) return cachedIndexHtml;
  if (!fs.existsSync(indexPath)) {
    console.error('[SEO] dist/index.html not found — run `npm run build` first.');
    return null;
  }
  cachedIndexHtml = fs.readFileSync(indexPath, 'utf8');
  return cachedIndexHtml;
};

// ─── Fetch with hard timeout (prevents hanging) ───────────────────────────────
const fetchWithTimeout = async (url, ms = 4000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
};

// ─── Firestore response cache (TTL: 5 minutes) ───────────────────────────────
const _cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

const cachedFetch = async (url) => {
  const entry = _cache.get(url);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data;
  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    // short-cache failures to avoid hammering Firestore on missing docs
    _cache.set(url, { data: {}, ts: Date.now() - CACHE_TTL + 60000 });
    throw new Error(`Firestore ${res.status}: ${url}`);
  }
  const data = await res.json();
  _cache.set(url, { data, ts: Date.now() });
  return data;
};

// ─── OG / Twitter meta injection ─────────────────────────────────────────────
const esc = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const injectMeta = (html, { title, description, image, url }) => {
  let out = html;
  // <title>
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);
  // og:title
  out = out.replace(/(property=['"]og:title['"]\s+content=['"])[^'"]*(['"])/i, `$1${esc(title)}$2`);
  out = out.replace(/(content=['"])[^'"]*(['"]\s+property=['"]og:title['"])/i, `$1${esc(title)}$2`);
  // description
  out = out.replace(/(name=['"]description['"]\s+content=['"])[^'"]*(['"])/i, `$1${esc(description)}$2`);
  out = out.replace(/(content=['"])[^'"]*(['"]\s+name=['"]description['"])/i, `$1${esc(description)}$2`);
  // og:description
  out = out.replace(/(property=['"]og:description['"]\s+content=['"])[^'"]*(['"])/i, `$1${esc(description)}$2`);
  out = out.replace(/(content=['"])[^'"]*(['"]\s+property=['"]og:description['"])/i, `$1${esc(description)}$2`);
  // og:image
  out = out.replace(/(property=['"]og:image['"]\s+content=['"])[^'"]*(['"])/i, `$1${image}$2`);
  out = out.replace(/(content=['"])[^'"]*(['"]\s+property=['"]og:image['"])/i, `$1${image}$2`);
  // og:url
  out = out.replace(/(property=['"]og:url['"]\s+content=['"])[^'"]*(['"])/i, `$1${url}$2`);
  out = out.replace(/(content=['"])[^'"]*(['"]\s+property=['"]og:url['"])/i, `$1${url}$2`);
  // twitter:title
  out = out.replace(/(name=['"]twitter:title['"]\s+content=['"])[^'"]*(['"])/i, `$1${esc(title)}$2`);
  out = out.replace(/(content=['"])[^'"]*(['"]\s+name=['"]twitter:title['"])/i, `$1${esc(title)}$2`);
  // twitter:description
  out = out.replace(/(name=['"]twitter:description['"]\s+content=['"])[^'"]*(['"])/i, `$1${esc(description)}$2`);
  out = out.replace(/(content=['"])[^'"]*(['"]\s+name=['"]twitter:description['"])/i, `$1${esc(description)}$2`);
  // twitter:image
  out = out.replace(/(name=['"]twitter:image['"]\s+content=['"])[^'"]*(['"])/i, `$1${image}$2`);
  out = out.replace(/(content=['"])[^'"]*(['"]\s+name=['"]twitter:image['"])/i, `$1${image}$2`);
  return out;
};

const sendHTML = (res, html) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.send(html);
};

// ─── SEO route: /s/:slug  (school partner landing pages) ─────────────────────
app.get('/s/:slug', async (req, res, next) => {
  const slug = req.params.slug;
  const pageUrl = `${BASE_DOMAIN}/s/${slug}`;
  try {
    const [spData, offData] = await Promise.all([
      cachedFetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/websitev2/documents/school-partners`),
      cachedFetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/websitev2/documents/offers`),
    ]);

    const schoolDoc = spData.documents?.find(d => d.fields?.slug?.stringValue === slug);
    if (!schoolDoc) {
      const html = readIndexHtml();
      if (html) return sendHTML(res, html);
      return next();
    }

    const schoolName = schoolDoc.fields?.name?.stringValue || 'École Partenaire';
    const schoolId = schoolDoc.name.split('/').pop();
    const offerDoc = offData.documents?.find(
      d => d.fields?.schoolId?.stringValue === schoolId && d.fields?.published?.booleanValue === true
    );

    let imageUrl = offerDoc?.fields?.ogImage?.stringValue || DEFAULT_IMAGE;

    if (imageUrl === DEFAULT_IMAGE && offerDoc) {
      const workshopIds = offerDoc.fields?.workshopIds?.arrayValue?.values?.map(v => v.stringValue) || [];
      if (workshopIds.length > 0) {
        try {
          const wData = await cachedFetch(
            `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/websitev2/documents/workshops/${workshopIds[0]}`
          );
          if (wData.fields?.image?.stringValue) imageUrl = wData.fields.image.stringValue;
        } catch (_) { /* keep default */ }
      }
    }

    const title = `${schoolName} × MakerLab Academy`;
    const description = `Découvrez nos ateliers innovants en Coding, Robotique et IA chez ${schoolName}. Préparez vos enfants au futur du numérique !`;
    const html = readIndexHtml();
    if (!html) return next();
    return sendHTML(res, injectMeta(html, { title, description, image: imageUrl, url: pageUrl }));
  } catch (err) {
    console.error('[SEO /s/:slug] Error:', err.message);
    const html = readIndexHtml();
    if (html) return sendHTML(res, html);
    next();
  }
});

// ─── SEO route: /programs/:id ─────────────────────────────────────────────────
app.get('/programs/:id', async (req, res, next) => {
  const id = req.params.id;
  const pageUrl = `${BASE_DOMAIN}/programs/${id}`;
  try {
    const pData = await cachedFetch(
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/websitev2/documents/website-programs/${id}`
    );
    const title = `${pData.fields?.title?.stringValue || 'Programme'} | MakerLab Academy`;
    const description = pData.fields?.description?.stringValue || 'Découvrez nos programmes innovants en robotique, codage et IA pour enfants.';
    const image = pData.fields?.ogImage?.stringValue || pData.fields?.image?.stringValue || DEFAULT_IMAGE;
    const html = readIndexHtml();
    if (!html) return next();
    return sendHTML(res, injectMeta(html, { title, description, image, url: pageUrl }));
  } catch (err) {
    console.error('[SEO /programs/:id] Error:', err.message);
    const html = readIndexHtml();
    if (html) return sendHTML(res, html);
    next();
  }
});

// ─── Static assets (JS/CSS/images — long cache, immutable) ───────────────────
app.use(express.static(path.join(__dirname, 'dist'), {
  index: false,
  maxAge: '7d',
  etag: true,
  immutable: true,
}));

// ─── SPA catch-all ────────────────────────────────────────────────────────────
app.get(/(.*)/, (req, res) => {
  const html = readIndexHtml();
  if (html) return sendHTML(res, html);
  res.status(500).send('App not built — run `npm run build` first.');
});

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   dist/index.html exists: ${fs.existsSync(indexPath)}`);
});
