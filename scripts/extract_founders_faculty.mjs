import fs from 'fs';

const html = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/raw_id_10.html', 'utf8');

// Find where "Founders" or "Faculty" occurs
const founderIdx = html.indexOf('Founders');
console.log('Founders section snippet:');
console.log(html.substring(founderIdx - 200, founderIdx + 6000));

const facultyIdx = html.indexOf('Faculty', founderIdx + 100);
console.log('\n===============================\nFaculty section snippet:');
console.log(html.substring(facultyIdx - 200, facultyIdx + 12000));
