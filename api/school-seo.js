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
 * Reads dist/index.html and injects page-specific OG meta tags.
 * Falls back to a minimal HTML document if the file can't be read.
 */
const buildHtml = (meta) => {
  const { title, description, image, url } = meta;

  // Try to read the actual dist/index.html for the full SPA shell
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

  // Fallback: minimal valid HTML with full OG tags + canonical redirect
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
  // Extract slug from the URL path (e.g. /s/mon-ecole → mon-ecole)
  const urlPath = req.url || '';
  const slugMatch = urlPath.match(/\/s\/([^/?#]+)/);
  const slug = slugMatch ? slugMatch[1] : (req.query?.slug || '');

  console.log(`[school-seo] slug="${slug}"`);

  const pageUrl = `${BASE_DOMAIN}/s/${slug}`;
  let title = 'MakerLab Academy - Ateliers de Programmation et Robotique';
  let description =
    'Découvrez nos ateliers innovants en Coding, Robotique et IA, organisés directement au sein de votre établissement scolaire pour préparer vos enfants au futur du numérique.';
  let image = DEFAULT_IMAGE;

  try {
    // 1. Find school partner by slug
    const spRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/school-partners`
    );
    if (spRes.ok) {
      const spData = await spRes.json();
      const schoolDoc = spData.documents?.find(
        (d) => d.fields?.slug?.stringValue === slug
      );

      if (schoolDoc) {
        const schoolName = schoolDoc.fields?.name?.stringValue || 'École Partenaire';
        const schoolId = schoolDoc.name.split('/').pop();
        title = `${schoolName} × MakerLab Academy`;
        description = `Découvrez nos ateliers innovants en Coding, Robotique et IA chez ${schoolName}. Préparez vos enfants au futur du numérique !`;

        // 2. Find the published offer for this school
        const offRes = await fetch(
          `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/offers`
        );
        if (offRes.ok) {
          const offData = await offRes.json();
          const offerDoc = offData.documents?.find(
            (d) =>
              d.fields?.schoolId?.stringValue === schoolId &&
              d.fields?.published?.booleanValue === true
          );

          if (offerDoc) {
            // 3. Try to get image from first workshop
            const workshopIds =
              offerDoc.fields?.workshopIds?.arrayValue?.values?.map((v) => v.stringValue) || [];
            if (workshopIds.length > 0) {
              const wRes = await fetch(
                `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/workshops/${workshopIds[0]}`
              );
              if (wRes.ok) {
                const wData = await wRes.json();
                if (wData.fields?.image?.stringValue) {
                  image = wData.fields.image.stringValue;
                }
              }
            }
            // Fallback: use offer's own coverImage
            if (image === DEFAULT_IMAGE && offerDoc.fields?.coverImage?.stringValue) {
              image = offerDoc.fields.coverImage.stringValue;
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('[school-seo] Error:', err.message);
  }

  const html = buildHtml({ title, description, image, url: pageUrl });
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}
