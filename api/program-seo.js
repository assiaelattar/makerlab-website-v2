import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIRESTORE_PROJECT = 'makerlab-space';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'https://space.makerlab.academy';
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
    // Force Large Preview
    html = html.replace(
      /(<meta\s[^>]*name=['"]twitter:card['"]\s[^>]*content=['"])[^'"]*['"]/i,
      `$1summary_large_image"`
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
  const urlPath = req.url || '';
  const idMatch = urlPath.match(/\/(programs|lp)\/([^/?#]+)/);
  const id = idMatch ? idMatch[2] : (req.query?.id || '');

  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  const indexHtml = fs.existsSync(distHtml) ? fs.readFileSync(distHtml, 'utf8') : '';

  if (!id) return res.status(200).send(indexHtml);

  const COLLECTION = 'website-programs';
  const DATABASE = 'websitev2';

  try {
    // 1. Fetch Global Default Settings (for socialImage fallback)
    let globalDefaultImage = DEFAULT_IMAGE;
    try {
        const settingsRes = await fetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-settings/socialImage`);
        if (settingsRes.ok) {
            const settingsData = await settingsRes.json();
            if (settingsData.fields?.value?.stringValue) {
                globalDefaultImage = settingsData.fields.value.stringValue;
            }
        }
    } catch (e) {
        console.warn('[program-seo] Global settings fetch failed');
    }

    // 2. Fetch specific Program data
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/${COLLECTION}/${id}`;
    const response = await fetch(firestoreUrl);
    
    if (!response.ok) {
        console.warn(`[program-seo] Program not found: ${id}`);
        return res.status(200).send(indexHtml);
    }

    const data = await response.json();
    const program = data.fields;
    if (!program) return res.status(200).send(indexHtml);

    // Extract fields with proper truncation (155 chars optimal for SEO)
    const title = program.title?.stringValue || 'MakerLab Academy';
    let description = program.shortDescription?.stringValue || 
                         program.description?.stringValue || 
                         'Découvrez nos ateliers innovants en Coding, Robotique et IA.';
    
    if (description.length > 155) {
        description = description.substring(0, 152) + '...';
    }

    const image = program.ogImage?.stringValue || 
                  program.image?.stringValue || 
                  globalDefaultImage;

    const html = buildHtml({ title, description, image, url: `${BASE_DOMAIN}${urlPath}` });
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(html);
  } catch (err) {
    console.error('[program-seo] Error:', err.message);
    return res.status(200).send(indexHtml);
  }
}
