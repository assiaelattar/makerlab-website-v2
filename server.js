import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Paths ────────────────────────────────────────────────────────────────────
// FIX: indexPath was missing — caused a ReferenceError crash on every page load!
const indexPath = path.join(__dirname, 'dist', 'index.html');

// ─── Firestore config ─────────────────────────────────────────────────────────
const FIRESTORE_PROJECT = 'edufy-makerlab';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'https://space.makerlab.academy';
// FIX: was logo-full.png (3.3 MB!) — switched to optimised logo-social.jpg (257 KB)
const DEFAULT_IMAGE = `${BASE_DOMAIN}/logo-social.jpg`;

// ─── HTML singleton cache ────────────────────────────────────────────────────
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

// ─── Firestore response cache (TTL: 5 minutes) ───────────────────────────────
// FIX: Eliminates 3-9 s of repeated Firestore calls on every direct URL load.
const _firestoreCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const cachedFetch = async (url) => {
  const entry = _firestoreCache.get(url);
  if (entry && Date.now() - entry.ts < CACHE_TTL_MS) {
    return entry.data;
  }
  const res = await fetchWithTimeout(url);
  if (!res.ok) {
    // Cache the failure briefly (1 min) to prevent hammering Firestore on 404s/403s
    _firestoreCache.set(url, { data: {}, ts: Date.now() - (CACHE_TTL_MS - 60000) });
    throw new Error(`Firestore ${res.status}: ${url}`);
  }
  const data = await res.json();
  _firestoreCache.set(url, { data, ts: Date.now() });
  return data;
};

// ─── Fetch with hard timeout (prevents hanging) ───────────────────────────────
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
};

// ─── OG / Twitter meta injection ─────────────────────────────────────────────
const escHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const injectMeta = (html, { title, description, image, url }) => {
  let out = html;

  // <title>
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escHtml(title)}</title>`);

  // og:title (both attribute orders)
  out = out.replace(/(<meta\s[^>]*property=['"]og:title['"]\s[^>]*content=['"])[^'"]*['"]/i, `$1${escHtml(title)}'`);
  out = out.replace(/(<meta\s[^>]*content=['"])[^'"]*(['"][^>]*property=['"]og:title['"])/i, `$1${escHtml(title)}'$2`);

  // description
  out = out.replace(/(<meta\s[^>]*name=['"]description['"]\s[^>]*content=['"])[^'"]*['"]/i, `$1${escHtml(description)}'`);
  out = out.replace(/(<meta\s[^>]*content=['"])[^'"]*(['"][^>]*name=['"]description['"])/i, `$1${escHtml(description)}'$2`);

  // og:description
  out = out.replace(/(<meta\s[^>]*property=['"]og:description['"]\s[^>]*content=['"])[^'"]*['"]/i, `$1${escHtml(description)}'`);
  out = out.replace(/(<meta\s[^>]*content=['"])[^'"]*(['"][^>]*property=['"]og:description['"])/i, `$1${escHtml(description)}'$2`);

  // og:image
  out = out.replace(/(<meta\s[^>]*property=['"]og:image['"]\s[^>]*content=['"])[^'"]*(['"])/i, `$1${image}$2`);
  out = out.replace(/(<meta\s[^>]*content=['"])[^'"]*(['"][^>]*property=['"]og:image['"])/i, `$1${image}$2`);

  // og:url
  out = out.replace(/(<meta\s[^>]*property=['"]og:url['"]\s[^>]*content=['"])[^'"]*(['"])/i, `$1${url}$2`);
  out = out.replace(/(<meta\s[^>]*content=['"])[^'"]*(['"][^>]*property=['"]og:url['"])/i, `$1${url}$2`);

  // twitter:title
  out = out.replace(/(<meta\s[^>]*name=['"]twitter:title['"]\s[^>]*content=['"])[^'"]*['"]/i, `$1${escHtml(title)}'`);

  // twitter:description
  out = out.replace(/(<meta\s[^>]*name=['"]twitter:description['"]\s[^>]*content=['"])[^'"]*['"]/i, `$1${escHtml(description)}'`);

  // twitter:image
  out = out.replace(/(<meta\s[^>]*name=['"]twitter:image['"]\s[^>]*content=['"])[^'"]*['"]/i, `$1${image}'`);

  return out;
};

// Send HTML with short browser / CDN cache to allow stale-while-revalidate
const sendSEO = (res, html) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  res.send(html);
};

// ─── Debug endpoint ───────────────────────────────────────────────────────────
app.get('/seo-debug', (req, res) => {
  const testPath = req.query.path || '/';
  res.redirect(307, `${testPath}?_seo_debug=1`);
});

// ─── SEO: /s/:slug  (School / Partner landing pages) ──────────────────────────
app.get('/s/:slug', async (req, res, next) => {
  const slug = req.params.slug;
  const pageUrl = `${BASE_DOMAIN}/s/${slug}`;
  console.log(`[SEO /s/:slug] slug="${slug}"`);

  try {
    // FIX: fetch school-partners + offers IN PARALLEL from websitev2 database
    const [spData, offData] = await Promise.all([
      cachedFetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/websitev2/documents/school-partners`),
      cachedFetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/websitev2/documents/offers`),
    ]);

    const schoolDoc = spData.documents?.find(
      (d) => d.fields?.slug?.stringValue === slug
    );

    if (!schoolDoc) {
      console.warn(`[SEO /s/:slug] No school for slug="${slug}"`);
      const html = readIndexHtml();
      if (html) return sendSEO(res, html);
      return next();
    }

    const schoolName = schoolDoc.fields?.name?.stringValue || 'École Partenaire';
    const schoolId = schoolDoc.name.split('/').pop();

    const offerDoc = offData.documents?.find(
      (d) =>
        d.fields?.schoolId?.stringValue === schoolId &&
        d.fields?.published?.booleanValue === true
    );

    // Try to get image from first workshop (cached)
    let imageUrl = DEFAULT_IMAGE;
    if (offerDoc) {
      const workshopIds =
        offerDoc.fields?.workshopIds?.arrayValue?.values?.map((v) => v.stringValue) || [];
      if (workshopIds.length > 0) {
        try {
          const wData = await cachedFetch(
            `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/websitev2/documents/workshops/${workshopIds[0]}`
          );
          if (wData.fields?.image?.stringValue) imageUrl = wData.fields.image.stringValue;
        } catch (_) { /* keep default */ }
      }
      if (imageUrl === DEFAULT_IMAGE && offerDoc.fields?.coverImage?.stringValue) {
        imageUrl = offerDoc.fields.coverImage.stringValue;
      }
    }

    const title = `${schoolName} × MakerLab Academy`;
    const description = `Découvrez nos ateliers innovants en Coding, Robotique et IA chez ${schoolName}. Préparez vos enfants au futur du numérique !`;

    const html = readIndexHtml();
    if (!html) return next();

    return sendSEO(res, injectMeta(html, { title, description, image: imageUrl, url: pageUrl }));
  } catch (err) {
    console.error('[SEO /s/:slug] Error:', err.message);
    const html = readIndexHtml();
    if (html) return sendSEO(res, html);
    next();
  }
});

// ─── SEO: /programs/:id ───────────────────────────────────────────────────────
app.get('/programs/:id', async (req, res, next) => {
  const id = req.params.id;
  const pageUrl = `${BASE_DOMAIN}/programs/${id}`;
  console.log(`[SEO /programs/:id] id="${id}"`);

  try {
    const pData = await cachedFetch(
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/websitev2/documents/website-programs/${id}`
    );

    const title = `${pData.fields?.title?.stringValue || 'Programme'} | MakerLab Academy`;
    const description =
      pData.fields?.description?.stringValue ||
      'Découvrez nos programmes innovants en robotique, codage et IA pour enfants.';
    const image = pData.fields?.image?.stringValue || DEFAULT_IMAGE;

    const html = readIndexHtml();
    if (!html) return next();

    return sendSEO(res, injectMeta(html, { title, description, image, url: pageUrl }));
  } catch (err) {
    console.error('[SEO /programs/:id] Error:', err.message);
    const html = readIndexHtml();
    if (html) return sendSEO(res, html);
    next();
  }
});

// ─── Static assets (7-day cache for JS/CSS/images) ────────────────────────────
app.use(
  express.static(path.join(__dirname, 'dist'), {
    maxAge: '7d',
    etag: true,
    immutable: true,
  })
);

// ─── SPA catch-all ────────────────────────────────────────────────────────────
app.get(/(.*)/, (req, res) => {
  const html = readIndexHtml();
  if (html) return sendSEO(res, html);
  res.status(500).send('App not built — run `npm run build` first.');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   dist/index.html exists: ${fs.existsSync(indexPath)}`);
});
