/**
 * inject-seo.js
 * Runs automatically after `vite build` (postbuild hook).
 *
 * 1. Fetches global SEO settings (socialImage, GA4, GSC) from Firestore
 * 2. Injects into dist/index.html (home page + default fallback)
 * 3. Fetches ALL programs and creates:
 *    - dist/lp/[id]/index.html      → with landingPage.ogImage > program.image
 *    - dist/programs/[id]/index.html → same
 * 4. Fetches ALL blogs and creates:
 *    - dist/blog/[id]/index.html    → with blog-specific og tags
 *
 * Hostinger serves these static files directly (since server.js is bypassed).
 * Each file has the correct per-page og:image baked in.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, '..', 'dist');
const DIST_HTML = path.join(DIST, 'index.html');

const PROJECT   = 'edufy-makerlab';
const DATABASE  = 'websitev2';
const BASE_URL  = 'https://firestore.googleapis.com/v1/projects';
const SITE      = process.env.BASE_DOMAIN || 'https://space.makerlab.academy';

// ─── Firestore helpers ────────────────────────────────────────────────────────

async function fsGet(path_) {
  try {
    const res = await fetch(`${BASE_URL}/${PROJECT}/databases/${DATABASE}/documents/${path_}`);
    if (!res.ok) return null;
    return (await res.json()).fields || null;
  } catch { return null; }
}

async function fsList(collection) {
  try {
    const res = await fetch(`${BASE_URL}/${PROJECT}/databases/${DATABASE}/documents/${collection}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.documents || [];
  } catch { return []; }
}

function str(field)   { return field?.stringValue  || ''; }
function bool(field)  { return field?.booleanValue  || false; }
function mapf(field)  { return field?.mapValue?.fields || null; }

// ─── HTML helpers ─────────────────────────────────────────────────────────────

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function stripMeta(html, attr, value) {
  return html.replace(
    new RegExp(`\\s*<meta\\s[^>]*${attr}=['"]${value}['"][^>]*>`, 'gi'), ''
  );
}

function injectMeta(html, property, content, isName = false) {
  const attr = isName ? 'name' : 'property';
  html = stripMeta(html, attr, property);
  return html.replace('</head>', `  <meta ${attr}="${property}" content="${content}" />\n</head>`);
}

function buildPageHtml(baseHtml, { title, description, image, url, gaId, gscCode }) {
  let html = baseHtml;

  // Title
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${esc(title)}</title>`);

  // OG
  html = injectMeta(html, 'og:title',       esc(title));
  html = injectMeta(html, 'og:description', esc(description));
  html = injectMeta(html, 'og:url',         url);
  html = injectMeta(html, 'og:type',        'website');

  // og:image — only when we have one
  html = stripMeta(html, 'property', 'og:image');
  html = stripMeta(html, 'property', 'og:image:width');
  html = stripMeta(html, 'property', 'og:image:height');
  html = stripMeta(html, 'name',     'twitter:image');
  if (image) {
    html = injectMeta(html, 'og:image',        image);
    html = injectMeta(html, 'og:image:width',  '1200');
    html = injectMeta(html, 'og:image:height', '630');
    html = injectMeta(html, 'twitter:image',   image, true);
  }

  // Twitter / standard desc
  html = injectMeta(html, 'twitter:card',        'summary_large_image', true);
  html = injectMeta(html, 'twitter:title',        esc(title),           true);
  html = injectMeta(html, 'twitter:description',  esc(description),     true);
  html = injectMeta(html, 'description',          esc(description),     true);

  // Robots — Explicitly allow indexing for public pages
  html = injectMeta(html, 'robots', 'index, follow', true);

  // GSC & GA4
  if (gscCode) html = injectMeta(html, 'google-site-verification', gscCode, true);
  if (gaId) {
    html = stripMeta(html, 'src', `googletagmanager.com/gtag/js\\?id=${gaId}`);
    const ga = [
      `  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>`,
      `  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');</script>`,
    ].join('\n');
    html = html.replace('</head>', `${ga}\n</head>`);
  }

  return html;
}

function writeHtml(filePath, html) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, 'utf8');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  if (!fs.existsSync(DIST_HTML)) {
    console.error('❌ dist/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(DIST_HTML, 'utf8');

  // 1. Fetch global settings
  console.log('\n📡 Fetching global SEO settings from Firestore...');
  const [socialDoc, gaDoc, gscDoc] = await Promise.all([
    fsGet('website-settings/socialImage'),
    fsGet('website-settings/googleAnalyticsId'),
    fsGet('website-settings/gscVerification'),
  ]);

  const globalImage = str(socialDoc?.value);
  const gaId        = str(gaDoc?.value);
  const gscCode     = str(gscDoc?.value);

  console.log('  socialImage:', globalImage ? '✅ ' + globalImage.substring(0, 60) + '...' : '❌ not set');
  console.log('  GA4 ID:    ', gaId     || '❌ not set');
  console.log('  GSC code:  ', gscCode  || '❌ not set');

  const sharedOpts = { gaId, gscCode };

  // 2. Update dist/index.html (home page default)
  const homeHtml = buildPageHtml(baseHtml, {
    title:       'MakerLab Academy — Codage, Robotique et IA pour Enfants',
    description: 'Ateliers innovants de coding, robotique et IA pour préparer vos enfants au futur du numérique.',
    image:       globalImage,
    url:         `${SITE}/`,
    ...sharedOpts,
  });
  fs.writeFileSync(DIST_HTML, homeHtml, 'utf8');
  console.log('\n✅ dist/index.html updated (home page)');

  // 3. Programs — generate per-program HTML files
  console.log('\n📡 Fetching programs...');
  const programDocs = await fsList('website-programs');
  console.log(`  Found ${programDocs.length} programs`);

  let programCount = 0;
  for (const doc of programDocs) {
    const id     = doc.name.split('/').pop();
    const fields = doc.fields || {};
    const lp     = mapf(fields.landingPage);

    // Build title / description
    const lpHeadline    = str(lp?.heroHeadline);
    const lpSubHeadline = str(lp?.heroSubHeadline);
    const title = lpHeadline || str(fields.title) || 'MakerLab Academy';
    let   description = lpSubHeadline || str(fields.shortDescription) || str(fields.description)
                         || 'Découvrez nos ateliers innovants en Coding, Robotique et IA.';
    if (description.length > 155) description = description.substring(0, 152) + '...';

    // Image priority: landingPage.ogImage → program.ogImage → program.image → global
    const image = str(lp?.ogImage) || str(fields.ogImage) || str(fields.image) || globalImage;

    const pageOpts = { title, description, image, ...sharedOpts };

    // /lp/:id
    const lpHtml = buildPageHtml(baseHtml, { ...pageOpts, url: `${SITE}/lp/${id}` });
    writeHtml(path.join(DIST, 'lp', id, 'index.html'), lpHtml);

    // /programs/:id
    const progHtml = buildPageHtml(baseHtml, { ...pageOpts, url: `${SITE}/programs/${id}` });
    writeHtml(path.join(DIST, 'programs', id, 'index.html'), progHtml);

    programCount++;
    const imgSrc = image ? (image.includes('firebasestorage') ? '🖼️  Firebase' : image.substring(0, 40)) : '⚠️  no image';
    console.log(`  ✅ [${id}] "${title.substring(0, 40)}" — ${imgSrc}`);
  }
  console.log(`\n✅ ${programCount} programs → dist/lp/[id]/index.html + dist/programs/[id]/index.html`);

  // 4. Blog posts — generate per-blog HTML files
  console.log('\n📡 Fetching blogs...');
  const blogDocs = await fsList('website-blogs');
  let blogCount = 0;
  for (const doc of blogDocs) {
    const id     = doc.name.split('/').pop();
    const fields = doc.fields || {};
    const title  = str(fields.title) || 'Blog MakerLab Academy';
    let   description = str(fields.preview) || str(fields.content)?.substring(0, 160)
                         || 'Conseils et actualités sur le coding, robotique et IA.';
    if (description.length > 155) description = description.substring(0, 152) + '...';
    const image  = str(fields.ogImage) || str(fields.image) || globalImage;

    const blogHtml = buildPageHtml(baseHtml, {
      title, description, image,
      url: `${SITE}/blog/${id}`,
      ...sharedOpts,
    });
    writeHtml(path.join(DIST, 'blog', id, 'index.html'), blogHtml);
    blogCount++;
  }
  console.log(`✅ ${blogCount} blog posts → dist/blog/[id]/index.html`);

  // 5. School Partners — fetch for sitemap
  console.log('\n📡 Fetching school partners for sitemap...');
  const schoolDocs = await fsList('website-school-partners');
  const schoolUrls = schoolDocs.map(doc => `/s/${str(doc.fields?.slug) || doc.name.split('/').pop()}`);

  // 6. Generate robots.txt and sitemap.xml
  console.log('\n🤖 Generating robots.txt and sitemap.xml...');
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dist
Disallow: /node_modules

Sitemap: ${SITE}/sitemap.xml`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots, 'utf8');

  const allUrls = [
    '', '/programs', '/blog', '/about', '/contact', '/register', '/schools', '/kids-families', '/store',
    ...programDocs.map(doc => `/programs/${doc.name.split('/').pop()}`),
    ...programDocs.map(doc => `/lp/${doc.name.split('/').pop()}`),
    ...blogDocs.map(doc => `/blog/${doc.name.split('/').pop()}`),
    ...schoolUrls
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(url => `
  <url>
    <loc>${SITE}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');

  console.log('✅ robots.txt and sitemap.xml created in dist/');

  console.log('\n🚀 SEO injection complete!\n');
}

run().catch(err => {
  console.error('❌ inject-seo failed:', err.message);
  process.exit(1);
});
