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
 * Robustly injects or replaces meta tags in the HTML shell.
 * It handles both single and double quotes gracefully.
 */
const injectMeta = (html, property, content, isName = false) => {
  const attr = isName ? 'name' : 'property';
  const regex = new RegExp(`(<meta\\s[^>]*${attr}=['"]${property}['"]\\s[^>]*content=)(['"])[^'"]*\\2`, 'i');
  
  if (regex.test(html)) {
    // Replace existing tag content, preserving the original quote type
    return html.replace(regex, `$1$2${content}$2`);
  } else {
    // Inject new tag if not found (before </head>)
    const newTag = `  <meta ${attr}="${property}" content="${content}" />\n`;
    return html.replace('</head>', `${newTag}</head>`);
  }
};

const buildHtml = (meta) => {
  const { title, description, image, url } = meta;

  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  let html = fs.existsSync(distHtml) 
    ? fs.readFileSync(distHtml, 'utf8') 
    : `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8" /><title>MakerLab Academy</title></head><body><script>window.location.href="${url}"</script></body></html>`;

  // Standard Title
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

  // Standard Description
  html = injectMeta(html, 'description', esc(description), true);

  return html;
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
