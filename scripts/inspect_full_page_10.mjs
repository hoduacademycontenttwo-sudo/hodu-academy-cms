import fs from 'fs';

const html = fs.readFileSync('scripts/page_10_dump.html', 'utf8');

// Find all occurrences of team members, headings, paragraphs, images
console.log('--- FOUNDERS / FACULTY SEARCH IN HTML ---');

// Extract all img tags
const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/gi;
let match;
const imgs = [];
while ((match = imgRegex.exec(html)) !== null) {
  if (match[1].includes('pluginfile.php') || match[1].includes('local_mb2builder') || match[1].includes('VPSir') || match[1].includes('rohit') || match[1].includes('shraddha') || match[1].includes('abhishek') || match[1].includes('mansi') || match[1].includes('deepesh') || match[1].includes('photos')) {
    imgs.push(match[1]);
  }
}
console.log('Relevant Images Found:', imgs);

// Let's find all text blocks containing VP Singh, Rohit Jain, etc.
const names = ['VP Singh', 'V.P. Singh', 'Rohit Jain', 'Abhishek Agarwal', 'Shraddha Tiwari', 'Abhishek Garg', 'Mansi Baswal', 'Deepesh Chandwani', 'Founders', 'Faculty'];
names.forEach(name => {
  let idx = 0;
  while ((idx = html.indexOf(name, idx)) !== -1) {
    const snippet = html.slice(Math.max(0, idx - 150), Math.min(html.length, idx + 350)).replace(/\s+/g, ' ');
    console.log(`\n=== MATCH FOR "${name}" at index ${idx} ===\n${snippet}\n`);
    idx += name.length + 50;
  }
});
