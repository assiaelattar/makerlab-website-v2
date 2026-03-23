import fs from 'fs';
import path from 'path';

const dir1 = './pages';
const dir2 = './components';

// This function walks the directory
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

let changedFiles = 0;

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, 'utf8');
  
  // The goal: 
  // 1. brand-purple -> brand-red
  // 2. brand-yellow -> brand-white or brand-red or brand-orange (Let's make it brand-orange first, but we will manually fix huge sections to red)
  // Let's do a strict replacement first:
  // brand-purple -> brand-red
  // brand-pink -> brand-green
  // brand-cyan -> brand-blue
  // brand-yellow -> brand-orange

  let newContent = content
    .replace(/brand-purple/g, 'brand-red')
    .replace(/brand-pink/g, 'brand-green')
    .replace(/brand-cyan/g, 'brand-blue')
    .replace(/brand-yellow/g, 'brand-orange');

  // Then, to stop orange from dominating, any large usage of brand-orange should be brand-red.
  // E.g. bg-brand-orange -> bg-brand-red for main CTA buttons or huge banners
  // Actually, we'll just rename everything to the new palette first to fix the white card bug.
  // Then we can do a second pass.

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log(`Updated ${file}`);
  }
});

console.log(`Finished. Changed ${changedFiles} files.`);
