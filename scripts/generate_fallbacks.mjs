import fs from 'fs';

const data = JSON.parse(fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/blogs_data.json', 'utf8'));

const slugMap = {
  14: 'viteee-2026-application-form-updates',
  13: 'jee-main-registration-2026-live',
  12: 'india-ranks-7th-at-imo-2025',
  11: 'iit-kanpur-releases-jee-advanced-2025-scorecard',
  10: 'ib-students-worldwide-receive-their-results-may-2025',
  9: 'neet-ug-counselling-schedule-state-quota-seats-released',
  8: 'the-10-hardest-subjects-in-igcse',
  7: 'the-role-of-parental-involvement-in-academic-achievement',
  6: 'what-to-do-just-before-exams',
  5: 'is-homework-a-hassle-unpacking-the-debate'
};

const catMap = {
  14: 'JEE',
  13: 'JEE',
  12: 'Olympiad',
  11: 'JEE',
  10: 'IB',
  9: 'NEET',
  8: 'IGCSE',
  7: 'General',
  6: 'General',
  5: 'General'
};

const res = {};
data.forEach(d => {
  const slug = slugMap[d.entryId];
  const cleanTitle = d.title.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#039;', "'").trim();
  res[slug] = {
    id: String(d.entryId),
    title: cleanTitle,
    slug: slug,
    date: d.dateStr,
    category: catMap[d.entryId],
    author: d.author || 'Abhishek Agarwal',
    cover_image: d.imageUrl,
    secondary_link: `/blog/index.php?entryid=${d.entryId}`,
    htmlContent: d.content
  };
});

fs.writeFileSync('lib/blogFallbacks.ts', 'export const FALLBACK_BLOGS: Record<string, any> = ' + JSON.stringify(res, null, 2) + ';\n');
console.log('Successfully generated lib/blogFallbacks.ts!');
