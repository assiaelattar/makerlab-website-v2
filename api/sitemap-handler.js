const FIRESTORE_PROJECT = 'edufy-makerlab';
const DATABASE = 'websitev2';
const BASE_DOMAIN = 'https://space.makerlab.academy';

/** Simple fetch helper for Firestore JSON REST API */
async function fetchFirestore(collectionId, query = null) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/${DATABASE}/documents${query ? ':runQuery' : `/${collectionId}`}`;
  
  const options = {
    method: query ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (query) {
    options.body = JSON.stringify({ structuredQuery: query });
  }

  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    console.error(`Firestore fetch error [${collectionId}]:`, text);
    return [];
  }

  const data = await res.json();
  
  // runQuery returns an array of { document: { name, fields, ... } }
  if (query) {
    return data.filter(item => item.document).map(item => ({
      id: item.document.name.split('/').pop(),
      data: () => {
        const d = {};
        for (const [k, v] of Object.entries(item.document.fields || {})) {
          d[k] = v.stringValue || v.booleanValue || v.integerValue || v.doubleValue || v.timestampValue || v.mapValue || v.arrayValue;
        }
        return d;
      }
    }));
  }

  // GET collection returns { documents: [...] }
  return (data.documents || []).map(doc => ({
    id: doc.name.split('/').pop(),
    data: () => {
      const d = {};
      for (const [k, v] of Object.entries(doc.fields || {})) {
        d[k] = v.stringValue || v.booleanValue || v.integerValue || v.doubleValue || v.timestampValue || v.mapValue || v.arrayValue;
      }
      return d;
    }
  }));
}

export default async function sitemapHandler(req, res) {
  try {
    // 1. Static Pages
    const staticPages = [
      '',
      '/programs',
      '/blog',
      '/about',
      '/contact',
      '/register',
      '/schools',
      '/kids-families',
      '/store'
    ];

    // 2. Fetch Dynamic Programs (REST Query)
    const programs = await fetchFirestore('website-programs', {
      from: [{ collectionId: 'website-programs' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'active' },
          op: 'EQUAL',
          value: { booleanValue: true }
        }
      }
    });
    const programUrls = programs.map(p => `/programs/${p.id}`);
    const lpUrls = programs.map(p => `/lp/${p.id}`);

    // 3. Fetch Dynamic Blogs (REST List)
    const blogs = await fetchFirestore('website-blogs');
    const blogUrls = blogs.map(b => `/blog/${b.id}`);

    // 4. Fetch School Partners (REST List)
    const schools = await fetchFirestore('website-school-partners');
    const schoolUrls = schools.map(s => `/s/${s.data().slug || s.id}`);

    // Combine all URLs
    const allUrls = [...staticPages, ...programUrls, ...lpUrls, ...blogUrls, ...schoolUrls];

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(url => `
  <url>
    <loc>${BASE_DOMAIN}${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
}
