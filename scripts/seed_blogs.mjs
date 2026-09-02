import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const categoryMap = {
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

const dateMap = {
  14: '2025-10-29T17:34:00Z',
  13: '2025-10-25T11:45:00Z',
  12: '2025-07-19T14:20:00Z',
  11: '2025-07-17T16:10:00Z',
  10: '2025-07-14T15:30:00Z',
  9: '2025-07-14T11:00:00Z',
  8: '2024-12-19T18:00:00Z',
  7: '2024-12-19T16:00:00Z',
  6: '2024-12-19T14:00:00Z',
  5: '2024-12-19T12:00:00Z'
};

async function run() {
  const rawData = JSON.parse(fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/blogs_data.json', 'utf8'));

  console.log(`Found ${rawData.length} scraped entries to seed.`);

  for (const item of rawData) {
    const entryId = item.entryId;
    const slug = slugMap[entryId] || `blog-entry-${entryId}`;
    const category = categoryMap[entryId] || 'General';
    const createdAt = dateMap[entryId] || new Date().toISOString();

    const cleanTitle = item.title
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .trim();

    const textOnly = item.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const excerpt = textOnly.slice(0, 160) + '...';

    const row = {
      site_id: SITE_ID,
      title: cleanTitle,
      slug: slug,
      excerpt: excerpt,
      content: item.content,
      category: category,
      cover_image: item.imageUrl,
      read_time: '5 min read',
      author: item.author || 'Abhishek Agarwal',
      published: true,
      created_at: createdAt
    };

    const { data: existing } = await supabase
      .from('cms_blogs')
      .select('id')
      .eq('site_id', SITE_ID)
      .eq('slug', slug)
      .maybeSingle();

    if (existing) {
      console.log(`Updating existing blog [${slug}]...`);
      const { error } = await supabase
        .from('cms_blogs')
        .update(row)
        .eq('id', existing.id);
      if (error) console.error(`Error updating ${slug}:`, error);
      else console.log(`✓ Updated [${slug}]`);
    } else {
      console.log(`Inserting new blog [${slug}]...`);
      const { error } = await supabase
        .from('cms_blogs')
        .insert(row);
      if (error) console.error(`Error inserting ${slug}:`, error);
      else console.log(`✓ Inserted [${slug}]`);
    }
  }

  console.log('Finished seeding blogs!');
}

run();
