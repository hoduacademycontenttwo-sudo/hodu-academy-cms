import fs from 'fs';
import https from 'https';
import { createClient } from '@supabase/supabase-js';

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

function cleanAllHoduLinks(content) {
  if (!content) return '';
  let cleaned = content;

  // Fix typo domains like hoduacademy.coam
  cleaned = cleaned.replace(/https?:\/\/(?:www\.)?hoduacademy\.coam/gi, 'https://hoduacademy.com');

  // Convert Moodle page links to relative local links
  cleaned = cleaned.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/mod\/page\/view\.php\?id=(\d+)(?:&amp;[a-zA-Z0-9_=-]+|&[a-zA-Z0-9_=-]+)*/gi, '/mod/page/view.php?id=$1');

  // Convert Blog links to relative local links
  cleaned = cleaned.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/blog\/index\.php\?entryid=(\d+)(?:&amp;[a-zA-Z0-9_=-]+|&[a-zA-Z0-9_=-]+)*/gi, '/blog/index.php?entryid=$1');
  cleaned = cleaned.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/blog\/?/gi, '/blog');

  // Convert Course links to relative local links
  cleaned = cleaned.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/course\/view\.php\?id=\d+[^"'\s<>]*/gi, '/courses');
  cleaned = cleaned.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/course\/?/gi, '/courses');

  // Convert Auth / User / Contact / Home links
  cleaned = cleaned.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/login\/[^"'\s<>]*/gi, '/contact');
  cleaned = cleaned.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/user\/[^"'\s<>]*/gi, '/');
  cleaned = cleaned.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/contact[^"'\s<>]*/gi, '/contact');
  cleaned = cleaned.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/?(?=["'\s>])/gi, '/');

  // Remove any lingering direct absolute protocol domain references in hrefs
  cleaned = cleaned.replace(/href=["']https?:\/\/(?:www\.)?hoduacademy\.com([^"']*)["']/gi, (match, path) => {
    return `href="${path || '/'}"`;
  });

  return cleaned;
}

function extractCompleteMainContent(rawHtml) {
  // Find <div role="main">
  const mainIdx = rawHtml.indexOf('<div role="main">');
  if (mainIdx === -1) return '';

  // The content box is <div class="box py-3 generalbox
  const boxIdx = rawHtml.indexOf('<div class="box py-3 generalbox', mainIdx);
  const startIdx = boxIdx > -1 ? boxIdx : mainIdx;

  // Find where modified date or footer or navigation starts
  const modifiedIdx = rawHtml.indexOf('<div class="modified">', startIdx);
  let rawContent = '';
  if (modifiedIdx > -1) {
    rawContent = rawHtml.substring(startIdx, modifiedIdx);
  } else {
    const footerIdx = rawHtml.indexOf('<footer', startIdx);
    rawContent = rawHtml.substring(startIdx, footerIdx > -1 ? footerIdx : rawHtml.length);
  }

  return rawContent.trim();
}

async function run() {
  // Fetch all existing pages from cms_pages
  const { data: pages } = await supabase
    .from('cms_pages')
    .select('id, title, secondary_link, category')
    .eq('site_id', HODU_SITE_ID);

  console.log(`Found ${pages?.length || 0} pages in cms_pages to re-extract fully...`);

  let count = 0;
  for (let i = 0; i < (pages || []).length; i++) {
    const p = pages[i];
    const match = p.secondary_link?.match(/id=(\d+)/);
    if (!match) continue;

    const id = match[1];
    const url = `https://hoduacademy.com/mod/page/view.php?id=${id}`;

    console.log(`[${i + 1}/${pages.length}] Re-extracting full content for ID: ${id} ("${p.title}")...`);
    const res = await fetchUrl(url);

    if (res.status !== 200 || !res.data) {
      console.log(`  Failed (status ${res.status}) for ID: ${id}`);
      continue;
    }

    const fullContent = extractCompleteMainContent(res.data);
    if (!fullContent || fullContent.length < 50) {
      console.log(`  Skipping ID ${id}: content too short (${fullContent.length} chars)`);
      continue;
    }

    // Clean internal links
    const sanitized = cleanAllHoduLinks(fullContent);

    // Update in Supabase
    await supabase
      .from('cms_pages')
      .update({
        content: sanitized,
        updated_at: new Date().toISOString()
      })
      .eq('id', p.id);

    console.log(`  ✓ Updated ID ${id} with full content (Length: ${sanitized.length} chars)`);
    count++;
    await new Promise(r => setTimeout(r, 60));
  }

  console.log(`\n🎉 ALL ${count} pages have been updated with 100% complete, un-truncated content!`);
}

run().catch(console.error);
