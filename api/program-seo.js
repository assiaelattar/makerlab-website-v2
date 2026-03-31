import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIRESTORE_PROJECT = 'edufy-makerlab';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'https://makerlab.ma';
const DEFAULT_IMAGE = `${BASE_DOMAIN}/logo-social.jpg`;

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const buildHtml = (meta) => {
  const { title, description, image, url } = meta;

  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  if (fs.existsSync(distHtml)) {
    let html = fs.readFileSync(distHtml, 'utf8');
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);
    html = html.replace(
      /(<meta\s[^>]*property=['"]og:title['"]\s[^>]*content=['"])[^'"]*['"]/i,
      `$1${esc(title)}"`
    );
    html = html.replace(
      /(<meta\s[^>]*content=['"])[^'"]*(['"][^>]*property=['"]og:title['"])/i,
      `$1${esc(title)}"$2`
    );
    html = html.replace(
      /(<meta\s[^>]*property=['"]og:description['"]\s[^>]*content=['"])[^'"]*['"]/i,
      `$1${esc(description)}"`
    );
    html = html.replace(
      /(<meta\s[^>]*content=['"])[^'"]*(['"][^>]*property=['"]og:description['"])/i,
      `$1${esc(description)}"$2`
    );
    html = html.replace(
      /(<meta\s[^>]*name=['"]description['"]\s[^>]*content=['"])[^'"]*['"]/i,
      `$1${esc(description)}"`
    );
    html = html.replace(
      /(<meta\s[^>]*property=['"]og:image['"]\s[^>]*content=['"])[^'"]*['"]/i,
      `$1${image}"`
    );
    html = html.replace(
      /(<meta\s[^>]*content=['"])[^'"]*(['"][^>]*property=['"]og:image['"])/i,
      `$1${image}"$2`
    );
    html = html.replace(
      /(<meta\s[^>]*property=['"]og:url['"]\s[^>]*content=['"])[^'"]*['"]/i,
      `$1${url}"`
    );
    html = html.replace(
      /(<meta\s[^>]*name=['"]twitter:title['"]\s[^>]*content=['"])[^'"]*['"]/i,
      `$1${esc(title)}"`
    );
    html = html.replace(
      /(<meta\s[^>]*name=['"]twitter:description['"]\s[^>]*content=['"])[^'"]*['"]/i,
      `$1${esc(description)}"`
    );
    html = html.replace(
      /(<meta\s[^>]*name=['"]twitter:image['"]\s[^>]*content=['"])[^'"]*['"]/i,
      `$1${image}"`
    );
    return html;
  }

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="MakerLab Academy" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${image}" />
  <link rel="canonical" href="${url}" />
</head>
<body>
  <p>Chargement...</p>
  <script>window.location.href = "${url}";</script>
</body>
</html>`;
};

export default async function handler(req, res) {
  // Extract program ID from URL path (e.g. /programs/abc123 → abc123)
  const urlPath = req.url || '';
  const idMatch = urlPath.match(/\/programs\/([^/?#]+)/);
  const id = idMatch ? idMatch[1] : (req.query?.id || '');

  console.log(`[program-seo] id="${id}"`);

  const pageUrl = `${BASE_DOMAIN}/programs/${id}`;
  let title = 'MakerLab Academy - Ateliers de Programmation et Robotique';
  let description =
    'Découvrez nos programmes innovants en robotique, codage et IA pour enfants.';
  let image = DEFAULT_IMAGE;

  try {
    const pRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/programs/${id}`
    );
    if (pRes.ok) {
      const pData = await pRes.json();
      const programTitle = pData.fields?.title?.stringValue;
      if (programTitle) {
        title = `${programTitle} | MakerLab Academy`;
      }
      description =
        pData.fields?.description?.stringValue ||
        pData.fields?.shortDescription?.stringValue ||
        description;
      image = pData.fields?.image?.stringValue || image;
    }
  } catch (err) {
    console.error('[program-seo] Error:', err.message);
  }

  const html = buildHtml({ title, description, image, url: pageUrl });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}
