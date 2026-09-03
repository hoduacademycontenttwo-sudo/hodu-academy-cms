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

async function checkLinks() {
  const { data: pages } = await supabase
    .from('cms_pages')
    .select('id, title, content')
    .eq('site_id', HODU_SITE_ID);

  let totalOldDomainMatches = 0;
  const sampleMatches = [];

  for (const page of (pages || [])) {
    if (!page.content) continue;
    const matches = page.content.match(/https?:\/\/(?:www\.)?hoduacademy\.com[^\s"'>]*/g);
    if (matches && matches.length > 0) {
      totalOldDomainMatches += matches.length;
      sampleMatches.push({ title: page.title, count: matches.length, samples: matches.slice(0, 3) });
    }
  }

  console.log(`Total occurrences of hoduacademy.com found across cms_pages: ${totalOldDomainMatches}`);
  console.log(`Pages containing old domain links: ${sampleMatches.length}`);
  console.log(JSON.stringify(sampleMatches.slice(0, 5), null, 2));
}

checkLinks();
