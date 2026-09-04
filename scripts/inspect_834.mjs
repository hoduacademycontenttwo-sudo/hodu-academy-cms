import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function inspect834() {
  const { data: page } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('secondary_link', '/mod/page/view.php?id=834')
    .single();

  console.log('Page 834 Title:', page.title);
  console.log('Snippet of 834:');
  console.log(page.content.substring(0, 1500));
}

inspect834();
