import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Import SEO handlers (same logic used on Vercel, adapted for Express)
import programSeoHandler from './api/program-seo.js';
import blogSeoHandler from './api/blog-seo.js';
import schoolSeoHandler from './api/school-seo.js';
import homeSeoHandler from './api/home-seo.js';
import sitemapHandler from './api/sitemap-handler.js';
import robotsHandler from './api/robots-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ─────────────────────────────────────────────────────────────
// SEO Routes — these MUST come before the static file middleware
// so that social crawlers (WhatsApp, Facebook, etc.) get the
// dynamically injected meta tags, not the bare index.html
// ─────────────────────────────────────────────────────────────

// SEO Assets — Robots.txt & Sitemap
app.get('/robots.txt', (req, res) => {
  console.log('🤖 Serving robots.txt');
  return robotsHandler(req, res);
});
app.get('/sitemap.xml', (req, res) => {
  console.log('📜 Serving sitemap.xml');
  return sitemapHandler(req, res);
});

// Home page — dynamic social image & title from admin settings
app.get('/', (req, res) => homeSeoHandler(req, res));

// Program / landing page funnel routes
app.get('/programs/:id', (req, res) => {
  req.url = `/programs/${req.params.id}`;
  return programSeoHandler(req, res);
});
app.get('/lp/:id', (req, res) => {
  req.url = `/lp/${req.params.id}`;
  return programSeoHandler(req, res);
});

// Blog posts
app.get('/blog/:id', (req, res) => {
  req.url = `/blog/${req.params.id}`;
  return blogSeoHandler(req, res);
});

// School partner pages
app.get('/s/:slug', (req, res) => {
  req.url = `/s/${req.params.slug}`;
  return schoolSeoHandler(req, res);
});

// ─────────────────────────────────────────────────────────────
// Static assets — serve built React app from /dist
// ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'dist')));

// ─────────────────────────────────────────────────────────────
// Catch-all — serve index.html for all other React Router routes
// (e.g. /admin, /about, /kids-families, etc.)
// ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ MakerLab server running on port ${PORT}`);
});
