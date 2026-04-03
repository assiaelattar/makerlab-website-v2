import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIRESTORE_PROJECT = 'edufy-makerlab';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'https://space.makerlab.academy';
const DEFAULT_IMAGE = `${BASE_DOMAIN}/logo-social.jpg`;

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * BUG FIX: old regex [^']* broke on apostrophes in content (e.g. s'amusant)
 * causing silent replacement failures and leaving the old og:image and og:title in place.
 *
 * New strategy: strip ALL existing <meta> tags for a given property/name,
 * then prepend a fresh clean one right before </head>. Apostrophe-safe.
 */
const injectMeta = (html, property, content, isName = false) => {
  const attr = isName ? 'name' : 'property';
  const stripRegex = new RegExp(`\\s*<meta\\s[^>]*${attr}=['"]${property}['"][^>]*>`, 'gi');
  html = html.replace(stripRegex, '');
  const newTag = `  <meta ${attr}="${property}" content="${content}" />\n`;
  return html.replace('</head>', `${newTag}</head>`);
};

const buildHtml = (meta) => {
  const { title, description, image, url } = meta;

  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  let html = fs.existsSync(distHtml)
    ? fs.readFileSync(distHtml, 'utf8')
    : `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8" /><title>MakerLab Academy</title></head><body><script>window.location.href="${url}"</script></body></html>`;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);

  // Open Graph
  html = injectMeta(html, 'og:title', esc(title));
  html = injectMeta(html, 'og:description', esc(description));
  html = injectMeta(html, 'og:image', image);
  html = injectMeta(html, 'og:url', url);
  html = injectMeta(html, 'og:type', 'website');

  // Twitter
  html = injectMeta(html, 'twitter:card', 'summary_large_image', true);
  html = injectMeta(html, 'twitter:title', esc(title), true);
  html = injectMeta(html, 'twitter:description', esc(description), true);
  html = injectMeta(html, 'twitter:image', image, true);

  // Standard description
  html = injectMeta(html, 'description', esc(description), true);

  return html;
};

export default async function handler(req, res) {
  const urlPath = req.url || '/';
  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  const indexHtml = fs.existsSync(distHtml) ? fs.readFileSync(distHtml, 'utf8') : '';

  const DATABASE = 'websitev2';

  // Default values
  let title = 'MakerLab Academy — Codage, Robotique et IA pour Enfants';
  let description = 'Ateliers innovants de coding, robotique et IA pour préparer vos enfants au futur du numérique.';
  let image = DEFAULT_IMAGE;

  try {
    // Fetch global default social image AND title from admin settings
    const settingsRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-settings/socialImage`
    );
    if (settingsRes.ok) {
      const settingsData = await settingsRes.json();
      if (settingsData.fields?.value?.stringValue) {
        image = settingsData.fields.value.stringValue;
      }
    }

    // Also try to fetch a custom home title/description from settings
    const homeSeoRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-settings/homeSeo`
    );
    if (homeSeoRes.ok) {
      const homeSeoData = await homeSeoRes.json();
      if (homeSeoData.fields?.title?.stringValue) {
        title = homeSeoData.fields.title.stringValue;
      }
      if (homeSeoData.fields?.description?.stringValue) {
        description = homeSeoData.fields.description.stringValue;
      }
    }
  } catch (e) {
    console.warn('[home-seo] Settings fetch failed, using defaults');
  }

  try {
    const html = buildHtml({ title, description, image, url: `${BASE_DOMAIN}/` });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // No CDN/edge caching — social crawlers must always get fresh meta tags
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(200).send(html);
  } catch (err) {
    console.error('[home-seo] Error:', err.message);
    return res.status(200).send(indexHtml);
  }
}
