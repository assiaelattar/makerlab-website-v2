import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.js';

export default async function sitemapHandler(req, res) {
  const baseUrl = 'https://space.makerlab.academy'; // Corrected Domain
  
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

    // 2. Fetch Dynamic Programs
    const programsSnapshot = await getDocs(query(collection(db, 'programs'), where('active', '==', true)));
    const programUrls = programsSnapshot.docs.map(doc => `/programs/${doc.id}`);

    // 3. Fetch Dynamic Blogs
    const blogsSnapshot = await getDocs(collection(db, 'blogs'));
    const blogUrls = blogsSnapshot.docs.map(doc => `/blog/${doc.id}`);

    // 4. Fetch School Partners
    const schoolsSnapshot = await getDocs(collection(db, 'school-partners'));
    const schoolUrls = schoolsSnapshot.docs.map(doc => `/s/${doc.data().slug || doc.id}`);

    // Combine all URLs
    const allUrls = [...staticPages, ...programUrls, ...blogUrls, ...schoolUrls];

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(url => `
  <url>
    <loc>${baseUrl}${url}</loc>
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
