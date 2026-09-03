import fs from 'fs';
import https from 'https';
import { createClient } from '@supabase/supabase-js';

// Read .env.local to get Supabase credentials
const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const HODU_SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002';

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', (err) => resolve({ status: 500, error: err.message, data: '' }));
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractCleanContent(rawHtml) {
  const mainMatch = rawHtml.match(/<div role="main">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i) ||
                    rawHtml.match(/<div class="box py-3 generalbox">([\s\S]*?)<\/div>/i) ||
                    rawHtml.match(/<div id="region-main"[\s\S]*?>([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i);

  if (mainMatch) {
    return mainMatch[1].trim();
  }
  return '';
}

async function run() {
  const rawList = fs.readFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/moodle_pages_list.json', 'utf8');
  const pages = JSON.parse(rawList);

  console.log(`Starting crawl of ${pages.length} Moodle pages...`);

  const results = [];
  const usedSlugs = new Set();

  for (let i = 0; i < pages.length; i++) {
    const { id } = pages[i];
    const url = `https://hoduacademy.com/mod/page/view.php?id=${id}`;

    console.log(`[${i + 1}/${pages.length}] Fetching ID: ${id}...`);
    const res = await fetchUrl(url);

    if (res.status !== 200 || !res.data) {
      console.log(`  Failed (status ${res.status}) for ID: ${id}`);
      continue;
    }

    const titleMatch = res.data.match(/<title>(.*?)<\/title>/i);
    let rawTitle = titleMatch ? titleMatch[1].replace('Hodu Academy: ', '').replace(' | Hodu Academy', '').trim() : `Page ${id}`;
    // Clean entities
    rawTitle = rawTitle.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&ndash;', '–').replaceAll('&mdash;', '—');

    let content = extractCleanContent(res.data);
    if (!content || content.length < 50) {
      console.log(`  Skipping ID ${id}: content too short (${content.length} chars)`);
      continue;
    }

    let baseSlug = slugify(rawTitle);
    if (!baseSlug) baseSlug = `page-${id}`;

    let finalSlug = baseSlug;
    let counter = 1;
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter++}`;
    }
    usedSlugs.add(finalSlug);

    // Extract simple text excerpt
    const stripped = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const excerpt = stripped.substring(0, 200) + '...';

    const pageRecord = {
      site_id: HODU_SITE_ID,
      title: rawTitle,
      slug: finalSlug,
      secondary_link: `/mod/page/view.php?id=${id}`,
      content: content,
      excerpt: excerpt,
      meta_title: `${rawTitle} | Hodu Academy`,
      meta_description: excerpt,
      published: true,
      updated_at: new Date().toISOString(),
    };

    // Upsert into Supabase
    const { data: existing } = await supabase
      .from('cms_pages')
      .select('id')
      .eq('site_id', HODU_SITE_ID)
      .eq('secondary_link', `/mod/page/view.php?id=${id}`)
      .maybeSingle();

    if (existing) {
      await supabase.from('cms_pages').update(pageRecord).eq('id', existing.id);
      console.log(`  ✓ Updated: "${rawTitle}" (/p/${finalSlug})`);
    } else {
      await supabase.from('cms_pages').insert(pageRecord);
      console.log(`  + Inserted: "${rawTitle}" (/p/${finalSlug})`);
    }

    results.push({ id, title: rawTitle, slug: finalSlug });
    // small delay to be polite to server
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`\n🎉 Successfully processed and synchronized ${results.length} pages into cms_pages!`);
  fs.writeFileSync('C:/Users/ADMIN/.gemini/antigravity/brain/c0ce67c8-e096-48a8-88f2-af85840f96cc/scratch/synced_pages.json', JSON.stringify(results, null, 2));
}

run().catch(console.error);
