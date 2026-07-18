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
    const documents = [];
    let pageToken = '';
    do {
      const suffix = pageToken ? `?pageToken=${encodeURIComponent(pageToken)}` : '';
      const res = await fetch(`${BASE_URL}/${PROJECT}/databases/${DATABASE}/documents/${collection}${suffix}`);
      if (!res.ok) return documents;
      const data = await res.json();
      documents.push(...(data.documents || []));
      pageToken = data.nextPageToken || '';
    } while (pageToken);
    return documents;
  } catch { return []; }
}

function str(field)   { return field?.stringValue  || ''; }
function bool(field)  { return field?.booleanValue  || false; }
function mapf(field)  { return field?.mapValue?.fields || null; }
function value(field) {
  if (!field) return null;
  if ('stringValue' in field) return field.stringValue;
  if ('booleanValue' in field) return field.booleanValue;
  if ('integerValue' in field) return Number(field.integerValue);
  if ('doubleValue' in field) return field.doubleValue;
  if ('timestampValue' in field) return field.timestampValue;
  if (field.arrayValue) return (field.arrayValue.values || []).map(value);
  if (field.mapValue) return Object.fromEntries(Object.entries(field.mapValue.fields || {}).map(([key, item]) => [key, value(item)]));
  return null;
}

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

function injectCanonical(html, href) {
  html = html.replace(/\s*<link\s[^>]*rel=['"]canonical['"][^>]*>/gi, '');
  return html.replace('</head>', `  <link rel="canonical" href="${esc(href)}" />\n</head>`);
}

function injectJsonLd(html, graph) {
  html = html.replace(/\s*<script\s+id=['"]static-json-ld['"][^>]*>[\s\S]*?<\/script>/gi, '');
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return html.replace('</head>', `  <script id="static-json-ld" type="application/ld+json">${json}</script>\n</head>`);
}

function buildPageHtml(baseHtml, { title, description, image, url, gaId, gscCode, schema = [] }) {
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
  html = injectMeta(html, 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', true);
  html = injectMeta(html, 'googlebot', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1', true);
  html = injectCanonical(html, url);

  const pageSchema = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: 'fr-FR',
    isPartOf: { '@id': `${SITE}/#website` },
    ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } } : {}),
  };
  html = injectJsonLd(html, [pageSchema, ...schema]);

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
    title:       'MakerLab Academy — Robotique, Coding et IA pour Enfants à Casablanca',
    description: 'MakerLab Academy aide les enfants de 6 à 16 ans à concevoir, coder, fabriquer et présenter de vrais projets en robotique, IA, électronique et design 3D.',
    image:       globalImage,
    url:         `${SITE}/`,
    schema: [
      {
        '@type': 'EducationalOrganization',
        '@id': `${SITE}/#organization`,
        name: 'MakerLab Academy',
        url: SITE,
        logo: { '@type': 'ImageObject', url: `${SITE}/logo-full.png` },
        description: 'Académie de technologie créative pour les enfants de 6 à 16 ans à Casablanca.',
        address: { '@type': 'PostalAddress', addressLocality: 'Casablanca', addressCountry: 'MA' },
        areaServed: { '@type': 'City', name: 'Casablanca' },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: SITE,
        name: 'MakerLab Academy',
        publisher: { '@id': `${SITE}/#organization` },
        inLanguage: 'fr-FR',
      },
    ],
    ...sharedOpts,
  });
  fs.writeFileSync(DIST_HTML, homeHtml, 'utf8');
  console.log('\n✅ dist/index.html updated (home page)');

  // Static hosts serve real directories before SPA fallbacks. Because this
  // script creates dist/programs/[id]/index.html and dist/blog/[id]/index.html,
  // the parent routes also need index files or /programs/ and /blog/ can 403.
  const programsIndexHtml = buildPageHtml(baseHtml, {
    title:       'Missions & Ateliers MakerLab Academy',
    description: 'Explorez les ateliers MakerLab Academy en robotique, coding, IA, design 3D et drones pour enfants, familles et ecoles.',
    image:       globalImage,
    url:         `${SITE}/programs`,
    ...sharedOpts,
  });
  writeHtml(path.join(DIST, 'programs', 'index.html'), programsIndexHtml);

  const blogIndexHtml = buildPageHtml(baseHtml, {
    title:       'Blog MakerLab Academy',
    description: 'Conseils, projets et actualites MakerLab autour du coding, de la robotique, de l IA et des technologies creatives.',
    image:       globalImage,
    url:         `${SITE}/blog`,
    ...sharedOpts,
  });
  writeHtml(path.join(DIST, 'blog', 'index.html'), blogIndexHtml);
  console.log('✅ dist/programs/index.html + dist/blog/index.html created for direct routes');

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

    const courseSchema = {
      '@type': 'Course',
      name: title,
      description,
      provider: { '@id': `${SITE}/#organization` },
      inLanguage: 'fr-FR',
      ...(image ? { image } : {}),
    };
    const pageOpts = { title, description, image, schema: [courseSchema], ...sharedOpts };

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
  const blogSettings = await fsGet('website-settings/blogs');
  const settingsBlogs = value(blogSettings?.value) || [];
  const legacyBlogDocs = await fsList('website-blogs');
  const blogDocs = settingsBlogs.length
    ? settingsBlogs.map((blog, index) => ({ id: blog.id || blog.slug || `article-${index + 1}`, fields: blog }))
    : legacyBlogDocs.map(doc => ({ id: doc.name.split('/').pop(), fields: Object.fromEntries(Object.entries(doc.fields || {}).map(([key, item]) => [key, value(item)])) }));
  let blogCount = 0;
  for (const doc of blogDocs) {
    const id     = doc.fields.slug || doc.id;
    const fields = doc.fields || {};
    const title  = fields.title || 'Blog MakerLab Academy';
    let   description = fields.preview || fields.excerpt || fields.content?.substring(0, 160)
                         || 'Conseils et actualités sur le coding, robotique et IA.';
    if (description.length > 155) description = description.substring(0, 152) + '...';
    const image  = fields.ogImage || fields.image || globalImage;

    const blogHtml = buildPageHtml(baseHtml, {
      title, description, image,
      url: `${SITE}/blog/${id}`,
      schema: [{
        '@type': 'Article',
        headline: title,
        description,
        ...(image ? { image } : {}),
        author: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        inLanguage: 'fr-FR',
      }],
      ...sharedOpts,
    });
    writeHtml(path.join(DIST, 'blog', id, 'index.html'), blogHtml);
    blogCount++;
  }
  console.log(`✅ ${blogCount} blog posts → dist/blog/[id]/index.html`);

  // 5. School Partners — fetch for sitemap
  console.log('\n📡 Fetching school partners for sitemap...');
  const staticPages = [
    { path: 'about', title: 'À propos de MakerLab Academy', description: 'Découvrez la méthode MakerLab Academy : apprendre la robotique, le code, l’IA et la fabrication en construisant de vrais projets.' },
    { path: 'schools', title: 'Programmes STEM pour écoles à Casablanca', description: 'Clubs, ateliers et programmes MakerLab en robotique, coding, IA, électronique et fabrication pour les établissements scolaires.' },
    { path: 'kids-families', title: 'Ateliers technologiques pour enfants et familles', description: 'Des missions pratiques pour les enfants de 6 à 16 ans : concevoir, coder, fabriquer, tester et présenter un projet.' },
    { path: 'maker-wall', title: 'Maker Wall — Projets construits par les enfants', description: 'Découvrez les projets de robotique, code, IA, design 3D et électronique imaginés et construits par les jeunes makers.' },
    { path: 'store', title: 'MakerLab Store — Kits de projets technologiques', description: 'Des kits MakerLab conçus comme de vraies missions : construire, coder, tester puis présenter un produit technologique.' },
    { path: 'store/smart-door', title: 'Smart Door — Kit de porte intelligente', description: 'Un projet MakerLab où l’enfant construit et programme une porte intelligente avec de vrais composants.', schema: [{ '@type': 'Product', name: 'Smart Door', description: 'Kit éducatif de porte intelligente MakerLab', brand: { '@type': 'Brand', name: 'MakerLab Academy' } }] },
    { path: 'store/nova-quest-mini', title: 'Nova Quest Mini — Console à construire et coder', description: 'Une console portable MakerLab que l’enfant assemble, programme et transforme en projet à présenter.', schema: [{ '@type': 'Product', name: 'Nova Quest Mini', description: 'Console éducative à construire et programmer', brand: { '@type': 'Brand', name: 'MakerLab Academy' } }] },
  ];
  for (const page of staticPages) {
    writeHtml(path.join(DIST, ...page.path.split('/'), 'index.html'), buildPageHtml(baseHtml, {
      title: page.title,
      description: page.description,
      image: globalImage,
      url: `${SITE}/${page.path}`,
      schema: page.schema || [],
      ...sharedOpts,
    }));
  }
  console.log(`✅ ${staticPages.length} public route pages created`);

  const questDocs = (await fsList('maker_quests')).filter(doc => bool(doc.fields?.active));
  for (const doc of questDocs) {
    const fields = doc.fields || {};
    const slug = str(fields.slug) || doc.name.split('/').pop();
    const title = str(fields.title) || 'Maker Quest';
    const description = str(fields.description) || 'Une mission MakerLab guidée pour concevoir, fabriquer, coder et présenter un vrai projet.';
    const image = str(fields.coverImage) || globalImage;
    const html = buildPageHtml(baseHtml, {
      title: `${title} — Maker Quest`,
      description,
      image,
      url: `${SITE}/maker-wall/quest/${slug}`,
      schema: [{
        '@type': 'LearningResource',
        name: title,
        description,
        learningResourceType: 'Projet pratique guidé',
        educationalLevel: 'Enfants de 6 à 16 ans',
        provider: { '@id': `${SITE}/#organization` },
        ...(image ? { image } : {}),
      }],
      ...sharedOpts,
    });
    writeHtml(path.join(DIST, 'maker-wall', 'quest', slug, 'index.html'), html);
  }
  console.log(`✅ ${questDocs.length} Maker Quest pages created`);

  const schoolDocs = await fsList('school-partners');
  const schoolUrls = schoolDocs.map(doc => `/s/${str(doc.fields?.slug) || doc.name.split('/').pop()}`);

  // 6. Generate robots.txt and sitemap.xml
  console.log('\n🤖 Generating robots.txt and sitemap.xml...');
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dist
Disallow: /node_modules

User-agent: OAI-SearchBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${SITE}/sitemap.xml`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), robots, 'utf8');

  const allUrls = [
    '', '/programs', '/blog', '/about', '/contact', '/register', '/schools', '/kids-families', '/store',
    ...staticPages.map(page => `/${page.path}`),
    ...programDocs.map(doc => `/programs/${doc.name.split('/').pop()}`),
    ...programDocs.map(doc => `/lp/${doc.name.split('/').pop()}`),
    ...blogDocs.map(doc => `/blog/${doc.fields?.slug || doc.id || doc.name?.split('/').pop()}`).filter(url => !url.endsWith('/undefined')),
    ...questDocs.map(doc => `/maker-wall/quest/${str(doc.fields?.slug) || doc.name.split('/').pop()}`),
    ...schoolUrls
  ];
  const uniqueUrls = [...new Set(allUrls)];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${uniqueUrls.map(url => `
  <url>
    <loc>${SITE}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');

  const llms = `# MakerLab Academy

> MakerLab Academy est une académie de technologie créative à Casablanca pour les enfants de 6 à 16 ans. Les enfants conçoivent, fabriquent, codent, testent et présentent de vrais projets en robotique, intelligence artificielle, électronique, design 3D et fabrication.

## Méthode

- Approche par projet : imaginer, concevoir, fabriquer, programmer, tester et présenter.
- Ce ne sont pas des jouets à recopier ni des instructions à copier-coller.
- Les outils sont choisis selon la mission et peuvent inclure Autodesk Fusion 360, BBC micro:bit, Microsoft MakeCode, Python et des outils d'IA générative.
- L'IA sert de copilote pour explorer et prototyper ; elle ne remplace pas la réflexion de l'enfant.
- Les projets peuvent être documentés dans un portfolio et développés vers une idée de produit, sa présentation et son packaging.
- Toute garantie de remboursement dépend des conditions affichées sur l'offre concernée.

## Pages principales

- [Accueil](${SITE}/)
- [Programmes et missions](${SITE}/programs)
- [Projets des élèves — Maker Wall](${SITE}/maker-wall)
- [Programmes pour les écoles](${SITE}/schools)
- [Ateliers enfants et familles](${SITE}/kids-families)
- [MakerLab Store](${SITE}/store)
- [À propos](${SITE}/about)
- [Blog](${SITE}/blog)

## Programmes publiés

${programDocs.map(doc => {
  const fields = doc.fields || {};
  const id = doc.name.split('/').pop();
  return `- [${str(fields.title) || 'Programme MakerLab'}](${SITE}/programs/${id}): ${str(fields.shortDescription) || str(fields.description) || 'Programme pratique MakerLab.'}`;
}).join('\n')}

## Informations de marque

- Nom : MakerLab Academy
- Zone principale : Casablanca, Maroc
- Langue principale du site : français
- Public : familles, enfants de 6 à 16 ans et établissements scolaires
- Les marques d'outils citées décrivent des technologies utilisées selon les projets et n'impliquent pas de partenariat.
- Les noms d'écoles visibles sur le site indiquent uniquement que certains participants les fréquentent ; ils n'impliquent ni affiliation ni approbation.
`;
  fs.writeFileSync(path.join(DIST, 'llms.txt'), llms, 'utf8');

  console.log('✅ robots.txt and sitemap.xml created in dist/');

  console.log('\n🚀 SEO injection complete!\n');
}

run().catch(err => {
  console.error('❌ inject-seo failed:', err.message);
  process.exit(1);
});
