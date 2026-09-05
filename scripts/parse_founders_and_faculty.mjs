import fs from 'fs';

const html = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/raw_id_10.html', 'utf8');

// Parse Founders
// Founders are in: class="instructorDivBorderFounder" or similar
const founders = [];
const faculty = [];

// Let's find all founder blocks
const founderRegex = /<div\s+class="instructorDivBorderFounder">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
let fMatch;
while ((fMatch = founderRegex.exec(html)) !== null) {
  const block = fMatch[1];
  const imgMatch = block.match(/src="([^"]+)"/i);
  const nameMatch = block.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i);
  const desigMatch = block.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i);
  const bioMatch = block.match(/<div class="paddingRightLeft">\s*<p>([\s\S]*?)<\/p>/i);

  if (nameMatch) {
    founders.push({
      name: nameMatch[1].replace(/<[^>]+>/g, '').trim(),
      designation: desigMatch ? desigMatch[1].replace(/<[^>]+>/g, '').trim() : 'Co-Founder & Director',
      bio: bioMatch ? bioMatch[1].replace(/<[^>]+>/g, '').trim() : '',
      image_url: imgMatch ? (imgMatch[1].startsWith('http') ? imgMatch[1] : `https://hoduacademy.com${imgMatch[1]}`) : '',
      is_founder: true,
      featured_offline: true,
      sort_order: founders.length + 1
    });
  }
}

// Let's find all faculty blocks
const facultyRegex = /<div\s+class="instructorDivBorder">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi;
let facMatch;
while ((facMatch = facultyRegex.exec(html)) !== null) {
  const block = facMatch[1];
  const imgMatch = block.match(/src="([^"]+)"/i);
  const nameMatch = block.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i);
  const desigMatch = block.match(/<h6[^>]*>([\s\S]*?)<\/h6>/i);
  const bioMatch = block.match(/<div class="paddingRightLeft">\s*<p>([\s\S]*?)<\/p>/i);

  if (nameMatch) {
    const name = nameMatch[1].replace(/<[^>]+>/g, '').trim();
    const designation = desigMatch ? desigMatch[1].replace(/<[^>]+>/g, '').trim() : 'Senior Faculty';
    const bio = bioMatch ? bioMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    
    // Determine subject based on designation / bio
    let subject = 'General';
    const text = (designation + ' ' + bio).toLowerCase();
    if (text.includes('physics')) subject = 'Physics';
    else if (text.includes('chem')) subject = 'Chemistry';
    else if (text.includes('math')) subject = 'Mathematics';
    else if (text.includes('bio')) subject = 'Biology';
    else if (text.includes('igcse') || text.includes('cambridge')) subject = 'International Boards';

    faculty.push({
      name,
      designation,
      subject,
      bio,
      image_url: imgMatch ? (imgMatch[1].startsWith('http') ? imgMatch[1] : `https://hoduacademy.com${imgMatch[1]}`) : '',
      is_founder: false,
      featured_offline: faculty.length < 3, // default first few featured on offline
      sort_order: founders.length + faculty.length + 1
    });
  }
}

console.log('--- FOUNDERS (' + founders.length + ') ---');
console.log(JSON.stringify(founders, null, 2));

console.log('\n--- FACULTY (' + faculty.length + ') ---');
console.log(JSON.stringify(faculty, null, 2));

fs.writeFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/extracted_team.json', JSON.stringify({ founders, faculty }, null, 2));
