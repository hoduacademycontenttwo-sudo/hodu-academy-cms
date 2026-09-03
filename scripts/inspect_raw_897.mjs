import fs from 'fs';

const html = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/raw_897.html', 'utf8');

console.log('--- Checking region-main ---');
const regionMainIdx = html.indexOf('id="region-main"');
console.log('regionMainIdx:', regionMainIdx);

const boxMatch = html.match(/<div class="box py-3 generalbox[^"]*">([\s\S]*?)<\/div>/i);
if (boxMatch) {
  console.log('boxMatch[1] length:', boxMatch[1].length);
  console.log('boxMatch snippet:', boxMatch[1].substring(0, 500));
}

// Check for all generalbox or content divs
const genBoxes = html.match(/<div class="no-overflow">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi);
console.log('genBoxes count:', genBoxes ? genBoxes.length : 0);

// Let's find where the tables or yearwise papers are located in html
const tableMatch = html.match(/<table[\s\S]*?<\/table>/gi);
console.log('Total <table> elements in 897:', tableMatch ? tableMatch.length : 0);

if (tableMatch) {
  tableMatch.forEach((t, i) => {
    console.log(`Table ${i+1} length: ${t.length}`);
    console.log(t.substring(0, 200));
  });
}
