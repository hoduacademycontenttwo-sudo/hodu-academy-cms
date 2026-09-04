import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);
const HODU_SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002';
const PORTAL_LOGIN_URL = 'https://portal.hoduacademy.com/';

function updateTestButtonsAndLogins(html) {
  if (!html) return '';
  let clean = html;

  // Fix "? Prepare Smarter" or "? Master" icon encoding artifacts
  clean = clean.replace(/\?\s*Prepare Smarter with Hodu Academy/gi, '🚀 Prepare Smarter with Hodu Academy');
  clean = clean.replace(/\?\s*Master/gi, '💡 Master');

  // Replace any courses.hoduacademy.com test URLs with portal login URL
  clean = clean.replace(/https?:\/\/(?:courses\.)?hoduacademy\.com\/tests\/[^\s"'>]+/gi, PORTAL_LOGIN_URL);

  // Replace any quiz / assessment / test links
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/mod\/quiz\/[^\s"'>]+/gi, PORTAL_LOGIN_URL);

  // Specifically target any <a> containing "Start Free Mock Test", "Take Mock Test", "Attempt Test", "Start Mock Test", "Free Mock Test"
  clean = clean.replace(/(<a[^>]*?href=["'])([^"']*?)(["'][^>]*?>\s*(?:Start Free Mock Test|Take Free Mock Test|Attempt Mock Test|Start Mock Test|Take Test|Start Test|Free Mock Test|Online Mock Test)\s*<\/a>)/gi, (match, prefix, oldHref, suffix) => {
    // If it doesn't already have target="_blank", ensure clean button
    return `<a href="${PORTAL_LOGIN_URL}" target="_blank" rel="noopener noreferrer" style="background: #FFB700; color: #800000; padding: 12px 20px; border-radius: 10px; text-decoration: none; font-weight: 800; display: inline-block; box-shadow: 0 4px 12px rgba(255,183,0,0.3); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">Start Free Mock Test</a>`;
  });

  return clean;
}

async function run() {
  const { data: pages } = await supabase
    .from('cms_pages')
    .select('id, title, secondary_link, content')
    .eq('site_id', HODU_SITE_ID);

  console.log(`Scanning ${pages?.length} pages for mock test buttons & login redirection...`);
  let updatedCount = 0;

  for (const p of pages || []) {
    if (!p.content) continue;

    const modified = updateTestButtonsAndLogins(p.content);
    if (modified !== p.content) {
      await supabase
        .from('cms_pages')
        .update({
          content: modified,
          updated_at: new Date().toISOString()
        })
        .eq('id', p.id);

      console.log(`✓ Updated login/test buttons on: ${p.secondary_link} ("${p.title}")`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 Successfully updated ${updatedCount} pages to route all mock test buttons to https://portal.hoduacademy.com/!`);
}

run().catch(console.error);
