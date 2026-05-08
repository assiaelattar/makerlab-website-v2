import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIRESTORE_PROJECT = 'edufy-makerlab';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'https://space.makerlab.academy';

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Strip ALL existing <meta> tags for a given property/name,
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
    : `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8" /><title>MakerLab Academy</title></head><body><script>window.location.href="${url}"<\/script></body></html>`;

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);

  html = injectMeta(html, 'og:title', esc(title));
  html = injectMeta(html, 'og:description', esc(description));
  html = injectMeta(html, 'og:url', url);
  html = injectMeta(html, 'og:type', 'website');

  if (image) {
    html = injectMeta(html, 'og:image', image);
    html = injectMeta(html, 'og:image:width', '1200');
    html = injectMeta(html, 'og:image:height', '630');
    html = injectMeta(html, 'twitter:image', image, true);
  } else {
    html = html.replace(/\s*<meta\s[^>]*property=['"]og:image['"]/gi, '');
    html = html.replace(/\s*<meta\s[^>]*name=['"]twitter:image['"]/gi, '');
  }

  html = injectMeta(html, 'twitter:card', 'summary_large_image', true);
  html = injectMeta(html, 'twitter:title', esc(title), true);
  html = injectMeta(html, 'twitter:description', esc(description), true);
  html = injectMeta(html, 'description', esc(description), true);

  // Reservation pages should NOT be indexed by Google
  html = injectMeta(html, 'robots', 'noindex, nofollow', true);

  return html;
};

export default async function handler(req, res) {
  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  const indexHtml = fs.existsSync(distHtml) ? fs.readFileSync(distHtml, 'utf8') : '';

  // Parse query params — works for both Vercel (req.query) and Express (parsed from URL)
  let kid = '', theme = '', slot = '';
  const rawUrl = req.url || '';
  const queryString = rawUrl.includes('?') ? rawUrl.split('?')[1] : '';
  const params = new URLSearchParams(queryString);

  // Merge Vercel req.query if available
  kid   = (req.query?.kid   || params.get('kid')   || '').trim();
  theme = (req.query?.theme || params.get('theme') || '').trim();
  slot  = (req.query?.slot  || params.get('slot')  || '').replace(/_/g, ' ').trim();

  // Build personalized title & description
  const title = kid
    ? `Place réservée pour ${kid} — MakerLab Academy`
    : 'Réservez votre place — MakerLab Academy';

  let descParts = [];
  if (theme) descParts.push(`Atelier : ${theme}`);
  if (slot)  descParts.push(`Créneau : ${slot}`);
  descParts.push('Finalisez votre inscription en quelques clics.');
  const description = descParts.join(' • ');

  // Reconstruct the canonical URL (query params included)
  const canonicalUrl = `${BASE_DOMAIN}/reservation${queryString ? '?' + queryString : ''}`;

  // Fetch the global social image from Firestore
  const DATABASE = 'websitev2';
  // Static fallback — always shows an image even if Firestore is unreachable
  let image = `${BASE_DOMAIN}/logo-social.jpg`;
  try {
    const socialRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-settings/socialImage`
    );
    if (socialRes.ok) {
      const d = await socialRes.json();
      if (d.fields?.value?.stringValue) image = d.fields.value.stringValue;
    }
  } catch (e) {
    console.warn('[reservation-seo] Could not fetch social image from Firestore');
  }

  try {
    const html = buildHtml({ title, description, image, url: canonicalUrl });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(200).send(html);
  } catch (err) {
    console.error('[reservation-seo] Error:', err.message);
    return res.status(200).send(indexHtml);
  }
}
