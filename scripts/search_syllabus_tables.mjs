import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function inspect() {
  const { data: pages } = await supabase
    .from('cms_pages')
    .select('id, title, secondary_link, content, category')
    .eq('site_id', 'a1b2c3d4-1111-1111-1111-000000000002');

  console.log(`Searching across ${pages?.length} pages for tables and syllabus structures...`);
  for (const p of pages || []) {
    if (p.content && (p.content.includes('Measurement') || p.content.includes('Mechanics & Motion') || p.content.includes('Thermodynamics'))) {
      console.log(`Match: ${p.secondary_link} | "${p.title}" | Category: ${p.category} | Length: ${p.content.length}`);
    }
  }
}

inspect();
