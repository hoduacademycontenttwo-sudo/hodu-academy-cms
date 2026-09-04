import fs from 'fs';

const html = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/raw_897.html', 'utf8');

// Let's check the container styles in raw_897.html
const styleMatches = [...html.matchAll(/style="([^"]*max-width[^"]*)"/gi)];
console.log('Max-width styles in raw_897:');
styleMatches.forEach((m, i) => console.log(`${i+1}: ${m[1]}`));
