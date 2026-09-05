import fs from 'fs';
const html = fs.readFileSync('scripts/page_10_dump.html', 'utf8');
const snippet = html.slice(77500, 88000);
fs.writeFileSync('scripts/page_10_founders_faculty_block.html', snippet);
console.log('Saved snippet of length:', snippet.length);
