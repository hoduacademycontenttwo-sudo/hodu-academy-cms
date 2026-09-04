import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function analyzeAllPages() {
  const { data: pages } = await supabase
    .from('cms_pages')
    .select('id, title, secondary_link, category, content')
    .eq('site_id', 'a1b2c3d4-1111-1111-1111-000000000002');

  console.log(`Analyzing ${pages?.length} pages for internal headers and structure...`);

  let withH1 = 0;
  let withoutH1 = 0;
  const noH1List = [];

  for (const p of pages || []) {
    const hasH1 = /<h1/i.test(p.content || '');
    if (hasH1) {
      withH1++;
    } else {
      withoutH1++;
      noH1List.push({ id: p.secondary_link, title: p.title });
    }
  }

  console.log(`Pages WITH internal <h1>: ${withH1}`);
  console.log(`Pages WITHOUT internal <h1>: ${withoutH1}`);
  if (noH1List.length > 0) {
    console.log('Pages without H1:', noH1List.slice(0, 10));
  }
}

analyzeAllPages();
