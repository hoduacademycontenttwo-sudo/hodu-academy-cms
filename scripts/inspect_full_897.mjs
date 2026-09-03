import fs from 'fs';

const html = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/raw_897.html', 'utf8');

const regionMainStart = html.indexOf('<div role="main">');
const regionMainEnd = html.indexOf('</section>', regionMainStart);

console.log('regionMainStart:', regionMainStart);
console.log('regionMainEnd:', regionMainEnd);

const fullRegion = html.substring(regionMainStart, regionMainEnd);
console.log('Full region length:', fullRegion.length);
console.log('Snippet of middle/end:');
console.log(fullRegion.substring(fullRegion.length - 2000));
