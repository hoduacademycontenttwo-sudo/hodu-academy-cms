import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function checkAllFaculty() {
  const { data: allFaculty, error } = await supabase
    .from('cms_faculty')
    .select('*')
    .eq('site_id', 'a1b2c3d4-1111-1111-1111-000000000002');

  console.log('Hodu faculty count:', allFaculty?.length);
  console.log(allFaculty);
}

checkAllFaculty();
