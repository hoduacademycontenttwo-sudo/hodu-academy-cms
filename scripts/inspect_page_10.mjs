import fs from 'fs';

const html = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/raw_id_10.html', 'utf8');

console.log('--- Searching for Founders and Faculty in page 10 ---');
const matches = [...html.matchAll(/(?:Founders?|Leadership|Faculty|Teacher|Team|Director)[\s\S]{1,200}/gi)];
console.log('Found matches:', matches.length);
matches.slice(0, 15).forEach((m, i) => console.log(`[${i+1}]:`, m[0].replace(/\s+/g, ' ').substring(0, 150)));

// Extract region-main or body
const mainIdx = html.indexOf('<div role="main">');
const boxIdx = html.indexOf('<div class="box py-3 generalbox', mainIdx);
const modifiedIdx = html.indexOf('<div class="modified">', boxIdx > -1 ? boxIdx : mainIdx);
const content = html.substring(boxIdx > -1 ? boxIdx : mainIdx, modifiedIdx > -1 ? modifiedIdx : html.length);

console.log('\n--- Content Snippet (first 4000 chars) ---');
console.log(content.substring(0, 4000));

fs.writeFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/page_10_clean_content.html', content);
