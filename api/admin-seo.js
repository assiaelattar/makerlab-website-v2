import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const injectMeta = (html, property, content, isName = false) => {
  const attr = isName ? 'name' : 'property';
  // Match the entire <meta ...> tag that has this property, regardless of attribute order or quote type
  const stripRegex = new RegExp(`\\s*<meta\\s[^>]*${attr}=['"]${property}['"][^>]*>`, 'gi');
  // Remove all existing tags for this property
  html = html.replace(stripRegex, '');
  // Inject a fresh, clean tag right before </head>
  const newTag = `  <meta ${attr}="${property}" content="${content}" />\n`;
  return html.replace('</head>', `${newTag}</head>`);
};

export default async function handler(req, res) {
  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  
  // Try to load the real index.html first to keep the React app structure
  let html = fs.existsSync(distHtml) 
    ? fs.readFileSync(distHtml, 'utf8') 
    : `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8" /><title>Admin - MakerLab Academy</title></head><body><div id="root"></div></body></html>`;

  // Standard Title for Admin
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>Admin - MakerLab Academy</title>`);

  // Force No-Index — Crucial for private/gated content protection
  html = injectMeta(html, 'robots', 'noindex, nofollow', true);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // No caching for admin SEO to ensure changes are immediate
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  return res.status(200).send(html);
}
