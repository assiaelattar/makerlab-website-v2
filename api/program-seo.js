import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIRESTORE_PROJECT = 'edufy-makerlab';
const BASE_DOMAIN = process.env.BASE_DOMAIN || 'https://space.makerlab.academy';
const DEFAULT_IMAGE = ''; // No hardcoded fallback — image comes from Firestore admin settings only

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * BUG FIX: The old regex [^']* broke on apostrophes in content values (e.g. s'amusant)
 * causing silent replacement failures and leaving the old og:image tag in place.
 *
 * New strategy: strip ALL existing <meta> tags for a given property/name using a
 * tag-level regex (matching the whole tag, not its content), then prepend a fresh one.
 * This is apostrophe-safe and handles both attribute orders.
 */
const injectMeta = (html, property, content, isName = false) => {
  const attr = isName ? 'name' : 'property';
  // Match the entire <meta ...> tag that has this property, regardless of attribute order or quote type
  // Uses [\s\S]*? to handle any content including apostrophes
  const stripRegex = new RegExp(`\\s*<meta\\s[^>]*${attr}=['"]${property}['"][^>]*>`, 'gi');
  // Remove all existing tags for this property (handles duplicates too)
  html = html.replace(stripRegex, '');
  // Inject a fresh, clean tag right before </head>
  const newTag = `  <meta ${attr}="${property}" content="${content}" />\n`;
  return html.replace('</head>', `${newTag}</head>`);
};

const buildHtml = (meta) => {
  const { title, description, image, url, gaId, gscCode } = meta;

  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  let html = fs.existsSync(distHtml) 
    ? fs.readFileSync(distHtml, 'utf8') 
    : `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8" /><title>MakerLab Academy</title></head><body><script>window.location.href="${url}"<\/script></body></html>`;

  // Standard Title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);

  // Open Graph
  html = injectMeta(html, 'og:title', esc(title));
  html = injectMeta(html, 'og:description', esc(description));
  // Only inject og:image / twitter:image when we actually have a URL
  if (image) {
    html = injectMeta(html, 'og:image', image);
    html = injectMeta(html, 'twitter:image', image, true);
  } else {
    // Strip any leftover og:image tags from the static baseline
    html = html.replace(/\s*<meta\s[^>]*property=['"]og:image['"][^>]*>/gi, '');
    html = html.replace(/\s*<meta\s[^>]*name=['"]twitter:image['"][^>]*>/gi, '');
  }
  html = injectMeta(html, 'og:url', url);
  html = injectMeta(html, 'og:type', 'website');

  // Twitter
  html = injectMeta(html, 'twitter:card', 'summary_large_image', true);
  html = injectMeta(html, 'twitter:title', esc(title), true);
  html = injectMeta(html, 'twitter:description', esc(description), true);

  // Standard Description
  html = injectMeta(html, 'description', esc(description), true);

  // Robots
  html = injectMeta(html, 'robots', 'index, follow', true);

  // Google Search Console verification
  if (gscCode) {
    html = injectMeta(html, 'google-site-verification', gscCode, true);
  }

  // Google Analytics 4 (inject before </head>)
  if (gaId) {
    const gaScript = [
      `  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>`,
      `  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');</script>`,
    ].join('\n');
    html = html.replace('</head>', `${gaScript}\n</head>`);
  }

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
    // 1. Fetch Global Default Settings (socialImage + analytics)
    let globalDefaultImage = DEFAULT_IMAGE;
    let gaId = '';
    let gscCode = '';
    try {
        const [socialRes, gaRes, gscRes] = await Promise.all([
          fetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-settings/socialImage`),
          fetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-settings/googleAnalyticsId`),
          fetch(`https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents/website-settings/gscVerification`),
        ]);
        if (socialRes.ok) {
            const d = await socialRes.json();
            if (d.fields?.value?.stringValue) globalDefaultImage = d.fields.value.stringValue;
        }
        if (gaRes.ok) {
            const d = await gaRes.json();
            if (d.fields?.value?.stringValue) gaId = d.fields.value.stringValue;
        }
        if (gscRes.ok) {
            const d = await gscRes.json();
            if (d.fields?.value?.stringValue) gscCode = d.fields.value.stringValue;
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
    // Priority: landingPage fields > program fields > defaults
    const lp = program.landingPage?.mapValue?.fields || program.landingPage || null;
    const lpFields = (lp && typeof lp === 'object' && 'enabled' in lp === false)
      ? lp  // Firestore native format
      : null;

    // Extract landing page ogImage (Firestore format or plain object)
    const lpOgImage = program.landingPage?.fields?.ogImage?.stringValue
      || program.landingPage?.ogImage
      || null;

    // Title: lp heroHeadline → program title
    const lpHeroHeadline = program.landingPage?.fields?.heroHeadline?.stringValue
      || program.landingPage?.heroHeadline
      || null;

    const title = lpHeroHeadline || program.title?.stringValue || 'MakerLab Academy';

    // Description: lp heroSubHeadline → shortDescription → description
    const lpSubHeadline = program.landingPage?.fields?.heroSubHeadline?.stringValue
      || program.landingPage?.heroSubHeadline
      || null;

    let description = lpSubHeadline
      || program.shortDescription?.stringValue
      || program.description?.stringValue
      || 'Découvrez nos ateliers innovants en Coding, Robotique et IA.';

    if (description.length > 155) {
        description = description.substring(0, 152) + '...';
    }

    // Image priority: landingPage.ogImage → program.ogImage → program.image → global default
    const image = lpOgImage
      || program.ogImage?.stringValue
      || program.image?.stringValue
      || globalDefaultImage;

    const html = buildHtml({ title, description, image, url: `${BASE_DOMAIN}${urlPath}`, gaId, gscCode });
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // No CDN/edge caching — social crawlers must always get fresh meta tags
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.status(200).send(html);
  } catch (err) {
    console.error('[program-seo] Error:', err.message);
    return res.status(200).send(indexHtml);
  }
}
