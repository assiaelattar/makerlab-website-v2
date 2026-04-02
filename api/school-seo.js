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
  const slugMatch = urlPath.match(/\/s\/([^/?#]+)/);
  const slug = slugMatch ? slugMatch[1] : (req.query?.slug || '');

  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  const indexHtml = fs.existsSync(distHtml) ? fs.readFileSync(distHtml, 'utf8') : '';

  if (!slug) return res.status(200).send(indexHtml);

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
        console.warn('[school-seo] Global settings fetch failed');
    }

    // 2. Fetch School Partner data
    let title = 'MakerLab Academy - Ateliers de Programmation et Robotique';
    let description = 'Découvrez nos ateliers innovants en Coding, Robotique et IA.';
    let image = globalDefaultImage;

    const spRes = await fetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-school-partners`);
    if (spRes.ok) {
      const spData = await spRes.json();
      const schoolDoc = spData.documents?.find(d => d.fields?.slug?.stringValue === slug);

      if (schoolDoc) {
        const schoolName = schoolDoc.fields?.name?.stringValue || 'École Partenaire';
        const schoolId = schoolDoc.name.split('/').pop();
        title = `${schoolName} × MakerLab Academy`;
        description = `Découvrez nos ateliers innovants en Coding, Robotique et IA chez ${schoolName}. Préparez vos enfants au futur du numérique !`;

        // 3. Find published Offer
        const offRes = await fetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-offers`);
        if (offRes.ok) {
          const offData = await offRes.json();
          const offerDoc = offData.documents?.find(d => 
            d.fields?.schoolId?.stringValue === schoolId && 
            d.fields?.published?.booleanValue === true
          );

          if (offerDoc) {
            image = offerDoc.fields?.ogImage?.stringValue || offerDoc.fields?.coverImage?.stringValue || image;
          }
        }
      }
    }

    if (description.length > 155) {
        description = description.substring(0, 152) + '...';
    }

    const html = buildHtml({ title, description, image, url: `${BASE_DOMAIN}${urlPath}` });
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).send(html);
  } catch (err) {
    console.error('[school-seo] Error:', err.message);
    return res.status(200).send(indexHtml);
  }
}
