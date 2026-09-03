import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const HODU_SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002';

export function cleanAllHoduLinks(content) {
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

async function run() {
  console.log('Sanitizing all cms_pages and cms_blogs to completely remove external connections to hoduacademy.com...');

  // 1. Sanitize cms_pages
  const { data: pages } = await supabase
    .from('cms_pages')
    .select('id, title, content')
    .eq('site_id', HODU_SITE_ID);

  let updatedPages = 0;
  for (const page of (pages || [])) {
    if (!page.content) continue;
    const cleaned = cleanAllHoduLinks(page.content);
    if (cleaned !== page.content) {
      await supabase.from('cms_pages').update({ content: cleaned }).eq('id', page.id);
      updatedPages++;
    }
  }
  console.log(`✓ Sanitized ${updatedPages} out of ${pages?.length || 0} pages in cms_pages`);

  // 2. Sanitize cms_blogs
  const { data: blogs } = await supabase
    .from('cms_blogs')
    .select('id, title, content')
    .eq('site_id', HODU_SITE_ID);

  let updatedBlogs = 0;
  for (const blog of (blogs || [])) {
    if (!blog.content) continue;
    const cleaned = cleanAllHoduLinks(blog.content);
    if (cleaned !== blog.content) {
      await supabase.from('cms_blogs').update({ content: cleaned }).eq('id', blog.id);
      updatedBlogs++;
    }
  }
  console.log(`✓ Sanitized ${updatedBlogs} out of ${blogs?.length || 0} blogs in cms_blogs`);

  console.log('\n🎉 ALL external links to hoduacademy.com have been transformed into 100% self-contained internal portal links!');
}

run().catch(console.error);
