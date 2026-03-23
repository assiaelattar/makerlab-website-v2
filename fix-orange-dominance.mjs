import fs from 'fs';
import path from 'path';

const dir1 = './pages';
const dir2 = './components';

function walkSync(dir, filelist = []) {
  if (!fs.existsSync(dir)) return filelist;
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const files = [...walkSync(dir1), ...walkSync(dir2), './App.tsx'];

// We want to replace bg-brand-orange with bg-brand-red in most places to make red dominant.
// Also text-brand-orange buttons could be red.
let changedFiles = 0;

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  
  let newContent = content;

  // Safe huge banner replacements
  newContent = newContent.replace(/bg-brand-orange px-4 py-20/g, 'bg-brand-red px-4 py-20');
  newContent = newContent.replace(/bg-brand-orange\/10/g, 'bg-brand-red/10');
  newContent = newContent.replace(/bg-brand-orange\/5/g, 'bg-brand-red/5');
  newContent = newContent.replace(/bg-brand-orange p-12/g, 'bg-brand-red p-12');
  newContent = newContent.replace(/bg-brand-orange text-black py-6/g, 'bg-brand-red text-white py-6'); // BookingPage button
  newContent = newContent.replace(/bg-brand-orange text-black border-4 border-black rounded-2xl/g, 'bg-brand-red text-white border-4 border-black rounded-2xl'); // Home.tsx CTA
  newContent = newContent.replace(/bg-brand-orange p-8/g, 'bg-brand-red p-8'); // Home.tsx Adultes card, Contact.tsx
  newContent = newContent.replace(/bg-brand-orange px-2/g, 'bg-brand-red px-2'); // Home.tsx highlight
  newContent = newContent.replace(/bg-brand-orange/g, 'bg-brand-red'); // To be aggressive, let's just make almost all orange RED.
  // Wait, if I replace all bg-brand-orange, no orange accents will remain! That's too aggressive.
  // Let me undo the aggressive global replace and just do selective replaces.
  
  newContent = content
    // Backgrounds for full sections and large cards -> red (and update text if needed)
    .replace(/"max-w-3xl mx-auto bg-brand-orange /g, '"max-w-3xl mx-auto bg-brand-red text-white ')
    .replace(/"bg-brand-orange px-4 py-20/g, '"bg-brand-red text-white px-4 py-20')
    .replace(/bg-brand-orange\/10/g, 'bg-brand-red/10')
    .replace(/bg-brand-orange\/20/g, 'bg-brand-red/20')
    .replace(/bg-brand-orange p-12/g, 'bg-brand-red text-white p-12')
    .replace(/bg-brand-orange border-4 border-black rounded-3xl/g, 'bg-brand-red text-white border-4 border-black rounded-3xl') // ProgramDetail.tsx
    .replace(/bg-brand-orange text-black border-4/g, 'bg-brand-red text-white border-4') // Home.tsx button
    .replace(/bg-brand-orange p-8 md:p-12/g, 'bg-brand-red p-8 md:p-12 text-white')
    .replace(/bg-brand-orange p-8/g, 'bg-brand-red text-white p-8') // Home.tsx Adultes card
    .replace(/bg-brand-orange px-2 border-2/g, 'bg-brand-red px-2 border-2') // Home.tsx
    // Store.tsx kit buttons
    .replace(/bg-brand-orange text-black rounded-none font-black/g, 'bg-brand-red text-white rounded-none font-black')
    .replace(/color === 'bg-brand-orange'/g, "color === 'bg-brand-red'")
    // StatsBanner
    .replace(/'bg-brand-orange', text: 'text-black', subtext: 'text-gray-800'/g, "'bg-brand-red', text: 'text-white', subtext: 'text-gray-200'")
    // Navbar
    .replace(/bg-brand-orange\/80/g, 'bg-brand-red/80')
    // ProgramCard
    .replace(/{ bg: 'bg-brand-orange', text: 'text-black'/g, "{ bg: 'bg-brand-red', text: 'text-white'")
    // ParallaxGallery
    .replace(/{ bg: 'bg-brand-orange', text: 'text-black', border: 'border-black' }/g, "{ bg: 'bg-brand-red', text: 'text-white', border: 'border-black' }")
    // ProgramDetail.tsx number and calendar icons
    .replace(/bg-brand-orange p-1/g, 'bg-brand-red p-1 text-white')
    .replace(/bg-brand-orange px-6 py-2/g, 'bg-brand-red text-white px-6 py-2');

  // Fix up any double text-white
  newContent = newContent.replace(/text-white text-white/g, 'text-white');
  newContent = newContent.replace(/text-black text-white/g, 'text-white');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Finished fixing orange dominance. Changed ${changedFiles} files.`);
