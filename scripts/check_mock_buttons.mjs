import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function checkMockButtons() {
  const { data: pages } = await supabase
    .from('cms_pages')
    .select('id, title, secondary_link, content')
    .eq('site_id', 'a1b2c3d4-1111-1111-1111-000000000002');

  for (const p of pages || []) {
    if (p.content && (p.content.includes('Start Free Mock Test') || p.content.includes('Mock Test') || p.content.includes('Prepare Smarter'))) {
      console.log(`Found on ${p.secondary_link} ("${p.title}")`);
      const btnMatches = [...p.content.matchAll(/<a[^>]*>(?:[\s\S]*?Start Free Mock Test[\s\S]*?|[\s\S]*?Mock Test[\s\S]*?)<\/a>/gi)];
      btnMatches.forEach(m => console.log('  Button HTML:', m[0]));
    }
  }
}

checkMockButtons();
