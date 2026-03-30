import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Firestore project ID ────────────────────────────────────────────────────
const FIRESTORE_PROJECT = 'edufy-makerlab';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'https://makerlab.ma';
const DEFAULT_IMAGE = `${BASE_DOMAIN}/logo-full.png`;

// ─── Helper: read dist/index.html once and cache it ─────────────────────────
const indexPath = path.join(__dirname, 'dist', 'index.html');

const readIndexHtml = () => {
  if (!fs.existsSync(indexPath)) {
    console.error('[SEO] dist/index.html not found — did you run `npm run build`?');
    return null;
  }
  return fs.readFileSync(indexPath, 'utf8');
};

// ─── Helper: inject OG meta tags ────────────────────────────────────────────
// Uses regex that is robust against minification (attribute order, whitespace).
const injectMeta = (html, { title, description, image, url }) => {
  let out = html;

  // <title>
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escHtml(title)}</title>`);

  // og:title  (handles both attribute orders)
  out = out.replace(
    /(<meta\s[^>]*property=["']og:title["'][^>]*content=["'])[^"']*["']/i,
    `$1${escHtml(title)}'`
  );
  out = out.replace(
    /(<meta\s[^>]*content=["'])[^"']*["']([^>]*property=["']og:title["'])/i,
    `$1${escHtml(title)}'$2`
  );

  // description
  out = out.replace(
    /(<meta\s[^>]*name=["']description["'][^>]*content=["'])[^"']*["']/i,
    `$1${escHtml(description)}'`
  );
  out = out.replace(
    /(<meta\s[^>]*content=["'])[^"']*["']([^>]*name=["']description["'])/i,
    `$1${escHtml(description)}'$2`
  );

  // og:description
  out = out.replace(
    /(<meta\s[^>]*property=["']og:description["'][^>]*content=["'])[^"']*["']/i,
    `$1${escHtml(description)}'`
  );
  out = out.replace(
    /(<meta\s[^>]*content=["'])[^"']*["']([^>]*property=["']og:description["'])/i,
    `$1${escHtml(description)}'$2`
  );

  // og:image
  out = out.replace(
    /(<meta\s[^>]*property=["']og:image["'][^>]*content=["'])[^"']*["']/i,
    `$1${image}'`
  );
  out = out.replace(
    /(<meta\s[^>]*content=["'])[^"']*["']([^>]*property=["']og:image["'])/i,
    `$1${image}'$2`
  );

  // og:url
  out = out.replace(
    /(<meta\s[^>]*property=["']og:url["'][^>]*content=["'])[^"']*["']/i,
    `$1${url}'`
  );
  out = out.replace(
    /(<meta\s[^>]*content=["'])[^"']*["']([^>]*property=["']og:url["'])/i,
    `$1${url}'$2`
  );

  // twitter:title (if present)
  out = out.replace(
    /(<meta\s[^>]*name=["']twitter:title["'][^>]*content=["'])[^"']*["']/i,
    `$1${escHtml(title)}'`
  );

  // twitter:description (if present)
  out = out.replace(
    /(<meta\s[^>]*name=["']twitter:description["'][^>]*content=["'])[^"']*["']/i,
    `$1${escHtml(description)}'`
  );

  // twitter:image (if present)
  out = out.replace(
    /(<meta\s[^>]*name=["']twitter:image["'][^>]*content=["'])[^"']*["']/i,
    `$1${image}'`
  );

  return out;
};

const escHtml = (str) =>
  str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const sendSEO = (res, html) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
};

// ─── /seo-debug — test endpoint to verify injection without a real crawler ──
// Usage: GET /seo-debug?path=/s/my-slug  or  /seo-debug?path=/programs/abc123
app.get('/seo-debug', async (req, res) => {
  const testPath = req.query.path || '/';
  res.redirect(307, `${testPath}?_seo_debug=1`);
});

// ─── SEO Interceptor: /s/:slug (School/Partner Landing Pages) ───────────────
app.get('/s/:slug', async (req, res, next) => {
  const slug = req.params.slug;
  const pageUrl = `${BASE_DOMAIN}/s/${slug}`;
  console.log(`[SEO /s/:slug] slug="${slug}" ua="${req.headers['user-agent']}"`);

  try {
    // 1. Find the school partner by slug
    const spRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/school-partners`
    );
    if (!spRes.ok) throw new Error(`Firestore school-partners fetch failed: ${spRes.status}`);
    const spData = await spRes.json();

    const schoolDoc = spData.documents?.find(
      (d) => d.fields?.slug?.stringValue === slug
    );

    if (!schoolDoc) {
      console.warn(`[SEO /s/:slug] No school found for slug="${slug}"`);
      const html = readIndexHtml();
      if (html) return sendSEO(res, html);
      return next();
    }

    const schoolName = schoolDoc.fields?.name?.stringValue || 'École Partenaire';
    const schoolId = schoolDoc.name.split('/').pop();
    console.log(`[SEO /s/:slug] Found school "${schoolName}" (id=${schoolId})`);

    // 2. Find the published offer for this school
    const offRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/offers`
    );
    if (!offRes.ok) throw new Error(`Firestore offers fetch failed: ${offRes.status}`);
    const offData = await offRes.json();

    const offerDoc = offData.documents?.find(
      (d) =>
        d.fields?.schoolId?.stringValue === schoolId &&
        d.fields?.published?.booleanValue === true
    );

    // 3. Get image from first workshop in offer
    let imageUrl = DEFAULT_IMAGE;
    if (offerDoc) {
      const workshopIds =
        offerDoc.fields?.workshopIds?.arrayValue?.values?.map((v) => v.stringValue) || [];
      if (workshopIds.length > 0) {
        const wRes = await fetch(
          `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/workshops/${workshopIds[0]}`
        );
        if (wRes.ok) {
          const wData = await wRes.json();
          if (wData.fields?.image?.stringValue) {
            imageUrl = wData.fields.image.stringValue;
          }
        }
      }
      // fallback: use offer's own coverImage if present
      if (imageUrl === DEFAULT_IMAGE && offerDoc.fields?.coverImage?.stringValue) {
        imageUrl = offerDoc.fields.coverImage.stringValue;
      }
    }

    const title = `${schoolName} × MakerLab Academy`;
    const description = `Découvrez nos ateliers innovants en Coding, Robotique et IA chez ${schoolName}. Préparez vos enfants au futur du numérique !`;

    const html = readIndexHtml();
    if (!html) return next();

    const finalHtml = injectMeta(html, { title, description, image: imageUrl, url: pageUrl });
    console.log(`[SEO /s/:slug] Injected meta for "${title}", image="${imageUrl}"`);
    return sendSEO(res, finalHtml);
  } catch (error) {
    console.error('[SEO /s/:slug] Error:', error.message);
    const html = readIndexHtml();
    if (html) return sendSEO(res, html);
    next();
  }
});

// ─── SEO Interceptor: /programs/:id ─────────────────────────────────────────
app.get('/programs/:id', async (req, res, next) => {
  const id = req.params.id;
  const pageUrl = `${BASE_DOMAIN}/programs/${id}`;
  console.log(`[SEO /programs/:id] id="${id}" ua="${req.headers['user-agent']}"`);

  try {
    const pRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/programs/${id}`
    );

    if (!pRes.ok) {
      console.warn(`[SEO /programs/:id] Program "${id}" not found (${pRes.status})`);
      const html = readIndexHtml();
      if (html) return sendSEO(res, html);
      return res.status(404).send('Not Found');
    }

    const pData = await pRes.json();
    const title = `${pData.fields?.title?.stringValue || 'Programme'} | MakerLab Academy`;
    const description =
      pData.fields?.description?.stringValue ||
      'Découvrez nos programmes innovants en robotique, codage et IA pour enfants.';
    const image = pData.fields?.image?.stringValue || DEFAULT_IMAGE;

    const html = readIndexHtml();
    if (!html) return next();

    const finalHtml = injectMeta(html, { title, description, image, url: pageUrl });
    console.log(`[SEO /programs/:id] Injected meta for "${title}", image="${image}"`);
    return sendSEO(res, finalHtml);
  } catch (error) {
    console.error('[SEO /programs/:id] Error:', error.message);
    const html = readIndexHtml();
    if (html) return sendSEO(res, html);
    next();
  }
});

// ─── Static files from dist ──────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist')));

// ─── SPA fallback ────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  const html = readIndexHtml();
  if (html) return sendSEO(res, html);
  res.status(500).send('App not built — run `npm run build` first.');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   dist/index.html exists: ${fs.existsSync(indexPath)}`);
});
