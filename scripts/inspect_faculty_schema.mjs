import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function inspectSchema() {
  const { data: facultyData, error: fErr } = await supabase.from('cms_faculty').select('*').limit(5);
  console.log('cms_faculty exists?', !fErr, 'Sample count:', facultyData?.length);
  if (facultyData && facultyData.length > 0) {
    console.log('Sample faculty columns:', Object.keys(facultyData[0]));
    console.log(facultyData[0]);
  } else if (fErr) {
    console.log('cms_faculty error:', fErr.message);
  }

  const { data: teamData, error: tErr } = await supabase.from('cms_team').select('*').limit(5);
  console.log('cms_team exists?', !tErr, 'Sample count:', teamData?.length);
  if (teamData && teamData.length > 0) {
    console.log('Sample team columns:', Object.keys(teamData[0]));
    console.log(teamData[0]);
  }
}

inspectSchema();
