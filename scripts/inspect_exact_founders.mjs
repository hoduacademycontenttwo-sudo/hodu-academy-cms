import fs from 'fs';

const html = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/raw_id_10.html', 'utf8');

const founderIdx = html.indexOf('Founders');
console.log('--- FOUNDERS EXACT HTML ---');
console.log(html.substring(founderIdx, founderIdx + 3000));
