import fs from 'fs';

const raw = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/.system_generated/steps/6054/content.md', 'utf8');

const regex = /href=["']([^"']*mod\/page\/view\.php\?id=(\d+)[^"']*)["']/g;
const pages = new Map();
let m;
while ((m = regex.exec(raw)) !== null) {
  const fullHref = m[1].trim();
  const id = m[2].trim();
  pages.set(id, fullHref);
}

console.log(`Found ${pages.size} unique mod/page links:`);
const pageList = Array.from(pages.entries()).map(([id, href]) => ({ id, href }));
console.log(JSON.stringify(pageList, null, 2));

fs.writeFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/moodle_pages_list.json', JSON.stringify(pageList, null, 2));
