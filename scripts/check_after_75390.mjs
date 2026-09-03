import fs from 'fs';

const html = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/raw_897.html', 'utf8');

console.log('Search for "papers" or "shift" or "2024" or "2025" or "download" in raw_897:');
const matches = [...html.matchAll(/(?:2024|2025|2023|Shift|Download|PDF|Question Paper|General Test)[\s\S]{1,100}/gi)];
console.log('Total matches found:', matches.length);
matches.slice(0, 10).forEach((m, i) => console.log(`Match ${i+1}:`, m[0].replace(/\n/g, ' ')));

console.log('\n--- Checking after 75390 ---');
console.log(html.substring(75390, 78000));
