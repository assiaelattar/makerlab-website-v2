import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Replace these default SEO tags globally in the string
const modifyHtmlTags = (html, meta) => {
  let modified = html;
  modified = modified.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);
  modified = modified.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${meta.title}"`);
  modified = modified.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${meta.description}"`);
  modified = modified.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${meta.description}"`);
  modified = modified.replace(/<meta property="og:image" content="[^"]*"/, `<meta property="og:image" content="${meta.image}"`);
  return modified;
};

// SEO BOT Interceptor for /s/:slug
app.get('/s/:slug', async (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = /WhatsApp|facebookexternalhit|Twitterbot|LinkedInBot|bot|spider|crawl/i.test(userAgent);
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  // If it's a normal user, we don't necessarily need the overhead of fetching on server
  // But wait, if they share it, sometimes it's nice to see right title fast. 
  // Let's do it for ALL requests to this route to be safe and consistent, 
  // or just for bots. Doing it for everyone guarantees consistency if copy-pasted.
  
  try {
    const slug = req.params.slug;
    
    // 1. Fetch all school-partners
    const spRes = await fetch('https://firestore.googleapis.com/v1/projects/edufy-makerlab/databases/(default)/documents/school-partners');
    const spData = await spRes.json();
    const schoolDoc = spData.documents?.find(d => d.fields?.slug?.stringValue === slug);
    
    if (!schoolDoc) {
      if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
      return res.status(404).send('Not Found');
    }
    
    const schoolName = schoolDoc.fields.name.stringValue;
    // Extract ID (last segment of document name)
    const schoolId = schoolDoc.name.split('/').pop();

    // 2. Fetch all offers to find the published one for this school
    const offRes = await fetch('https://firestore.googleapis.com/v1/projects/edufy-makerlab/databases/(default)/documents/offers');
    const offData = await offRes.json();
    const offerDoc = offData.documents?.find(d => d.fields.schoolId?.stringValue === schoolId && d.fields.published?.booleanValue === true);

    let imageUrl = 'https://makerlab.ma/logo-full.png'; // default
    
    // 3. Get first workshop image
    if (offerDoc) {
       const workshopIds = offerDoc.fields.workshopIds?.arrayValue?.values?.map(v => v.stringValue) || [];
       if (workshopIds.length > 0) {
           const firstWorkshopId = workshopIds[0];
           const wRes = await fetch(`https://firestore.googleapis.com/v1/projects/edufy-makerlab/databases/(default)/documents/workshops/${firstWorkshopId}`);
           if (wRes.ok) {
               const wData = await wRes.json();
               if (wData.fields?.image?.stringValue) {
                   imageUrl = wData.fields.image.stringValue;
               }
           }
       }
    }

    const title = `${schoolName} × MakerLab Academy`;
    const description = `Découvrez nos ateliers innovants en Coding, Robotique et IA chez ${schoolName}. Préparez vos enfants au futur du numérique !`;

    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, 'utf8');
      const finalHtml = modifyHtmlTags(html, { title, description, image: imageUrl });
      return res.send(finalHtml);
    }
    
    next();
  } catch (error) {
    console.error('SEO Interceptor Error:', error);
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    next();
  }
});

// SEO BOT Interceptor for /programs/:id
app.get('/programs/:id', async (req, res, next) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  try {
    const id = req.params.id;
    const pRes = await fetch(`https://firestore.googleapis.com/v1/projects/edufy-makerlab/databases/(default)/documents/programs/${id}`);
    
    if (!pRes.ok) {
       if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
       return res.status(404).send('Not Found');
    }
    
    const pData = await pRes.json();
    const title = `${pData.fields.title?.stringValue || 'Programme'} | MakerLab Academy`;
    const description = pData.fields.description?.stringValue || "Découvrez nos programmes innovants en robotique, codage et IA.";
    const image = pData.fields.image?.stringValue || 'https://makerlab.ma/logo-full.png';

    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, 'utf8');
      const finalHtml = modifyHtmlTags(html, { title, description, image });
      return res.send(finalHtml);
    }
    next();
  } catch (error) {
    console.error('Program SEO Error:', error);
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    next();
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all routes to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
