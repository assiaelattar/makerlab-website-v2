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

const injectMeta = (html, property, content, isName = false) => {
  const attr = isName ? 'name' : 'property';
  // BUG FIX: old regex [^']* broke on apostrophes in content (e.g. s'amusant)
  // Strip all existing tags for this property, then inject a fresh clean one
  const stripRegex = new RegExp(`\\s*<meta\\s[^>]*${attr}=['"]${property}['"][^>]*>`, 'gi');
  html = html.replace(stripRegex, '');
  const newTag = `  <meta ${attr}="${property}" content="${content}" />\n`;
  return html.replace('</head>', `${newTag}</head>`);
};

const buildHtml = (meta) => {
  const { title, description, image, url, gaId, gscCode } = meta;

  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  let html = fs.existsSync(distHtml) 
    ? fs.readFileSync(distHtml, 'utf8') 
    : `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8" /><title>MakerLab Academy</title></head><body><script>window.location.href="${url}"<\/script></body></html>`;

  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);

  html = injectMeta(html, 'og:title', esc(title));
  html = injectMeta(html, 'og:description', esc(description));
  html = injectMeta(html, 'og:image', image);
  html = injectMeta(html, 'og:url', url);
  html = injectMeta(html, 'og:type', 'website');

  html = injectMeta(html, 'twitter:card', 'summary_large_image', true);
  html = injectMeta(html, 'twitter:title', esc(title), true);
  html = injectMeta(html, 'twitter:description', esc(description), true);
  html = injectMeta(html, 'twitter:image', image, true);

  html = injectMeta(html, 'description', esc(description), true);

  if (gscCode) html = injectMeta(html, 'google-site-verification', gscCode, true);
  if (gaId) {
    const ga = `  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>\n  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');</script>`;
    html = html.replace('</head>', `${ga}\n</head>`);
  }

  return html;
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
    let globalDefaultImage = DEFAULT_IMAGE;
    let gaId = '';
    let gscCode = '';
    try {
        const [socialRes, gaRes, gscRes] = await Promise.all([
          fetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-settings/socialImage`),
          fetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-settings/googleAnalyticsId`),
          fetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-settings/gscVerification`),
        ]);
        if (socialRes.ok) { const d = await socialRes.json(); if (d.fields?.value?.stringValue) globalDefaultImage = d.fields.value.stringValue; }
        if (gaRes.ok)     { const d = await gaRes.json();     if (d.fields?.value?.stringValue) gaId = d.fields.value.stringValue; }
        if (gscRes.ok)    { const d = await gscRes.json();    if (d.fields?.value?.stringValue) gscCode = d.fields.value.stringValue; }
    } catch (e) {
        console.warn('[school-seo] Global settings fetch failed');
    }

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

    const html = buildHtml({ title, description, image, url: `${BASE_DOMAIN}${urlPath}`, gaId, gscCode });
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(200).send(html);
  } catch (err) {
    console.error('[school-seo] Error:', err.message);
    return res.status(200).send(indexHtml);
  }
}
