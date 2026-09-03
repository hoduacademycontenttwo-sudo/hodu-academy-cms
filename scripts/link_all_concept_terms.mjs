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

// Keyword to Internal URL Mapping
const CONCEPT_MAPPINGS = [
  { text: 'Accuracy, Precision, Errors', url: '/mod/page/view.php?id=770' },
  { text: 'Accuracy, Precision and Error in Measurement', url: '/mod/page/view.php?id=770' },
  { text: 'Atomic Theory', url: '/mod/page/view.php?id=771' },
  { text: 'Avogadros Hypothesis', url: '/mod/page/view.php?id=772' },
  { text: 'Avogadro’s Hypothesis', url: '/mod/page/view.php?id=772' },
  { text: 'Boyles Law', url: '/mod/page/view.php?id=773' },
  { text: 'Boyle’s Law', url: '/mod/page/view.php?id=773' },
  { text: 'Centripetal And Centrifugal Force', url: '/mod/page/view.php?id=774' },
  { text: 'Centripetal Force', url: '/mod/page/view.php?id=774' },
  { text: 'Convection Currents', url: '/mod/page/view.php?id=775' },
  { text: 'Difference Between Electric Field and Magnetic Field', url: '/mod/page/view.php?id=776' },
  { text: 'Electric Field and Magnetic Field', url: '/mod/page/view.php?id=776' },
  { text: 'Ampere', url: '/mod/page/view.php?id=777' },
  { text: 'Audible and Inaudible Sound', url: '/mod/page/view.php?id=778' },
  { text: 'Azimuthal Quantum Number', url: '/mod/page/view.php?id=779' },
  { text: 'Buoyancy', url: '/mod/page/view.php?id=780' },
  { text: 'Difference Between Heat and Temperature', url: '/mod/page/view.php?id=781' },
  { text: 'Heat, Temperature', url: '/mod/page/view.php?id=781' },
  { text: 'Coulomb’s Law', url: '/mod/page/view.php?id=782' },
  { text: "Coulomb's Law", url: '/mod/page/view.php?id=782' },
  { text: 'Electrical Force', url: '/mod/page/view.php?id=782' },
  { text: 'Fluid Friction', url: '/mod/page/view.php?id=783' },
  { text: 'Bernoullis Equation', url: '/mod/page/view.php?id=784' },
  { text: 'Bernoulli’s Equation', url: '/mod/page/view.php?id=784' },
  { text: 'Amplitude Modulation', url: '/mod/page/view.php?id=785' },
  { text: 'Anemometer', url: '/mod/page/view.php?id=786' },
  { text: 'Angular Acceleration', url: '/mod/page/view.php?id=787' },
  { text: 'Instantaneous Speed and Velocity', url: '/mod/page/view.php?id=788' },
  { text: 'Average Speed and Average Velocity', url: '/mod/page/view.php?id=789' },
  { text: 'Average Speed and Velocity', url: '/mod/page/view.php?id=789' },
  { text: 'Average Velocity', url: '/mod/page/view.php?id=790' },
  { text: 'Avogadro’s Number', url: '/mod/page/view.php?id=791' },
  { text: "Avogadro's Number", url: '/mod/page/view.php?id=791' },
  { text: 'Balanced Force', url: '/mod/page/view.php?id=792' },
  { text: 'Bar Magnet', url: '/mod/page/view.php?id=793' },
  { text: 'Biconvex Lens', url: '/mod/page/view.php?id=794' },
  { text: 'RD Sharma Solutions', url: '/mod/page/view.php?id=729' },
  { text: 'HC Verma Solutions', url: '/mod/page/view.php?id=730' },
  { text: 'RS Aggarwal Solutions', url: '/mod/page/view.php?id=731' },
  { text: 'Lakhmir Singh solutions', url: '/mod/page/view.php?id=732' },
  { text: 'Lakhmir Singh Solutions', url: '/mod/page/view.php?id=732' },
  { text: 'Full Syllabus Sample Papers', url: '/mod/page/view.php?id=864' },
  { text: 'Half Yearly Sample Papers', url: '/mod/page/view.php?id=795' },
  { text: 'Physics Formulas For Class 11 & 12', url: '/mod/page/view.php?id=696' },
  { text: 'Chemistry Formulas For Class 11 & 12', url: '/mod/page/view.php?id=693' },
  { text: 'Maths Formulas For Class 11 & 12', url: '/mod/page/view.php?id=695' },
  { text: 'Biology Quick Revision for Class 11 & 12', url: '/mod/page/view.php?id=697' },
  { text: 'Science Formulas (6-10)', url: '/mod/page/view.php?id=691' },
  { text: 'Maths Formulas (6-10)', url: '/mod/page/view.php?id=692' },
];

function linkifyTableItems(html) {
  let updated = html;

  for (const item of CONCEPT_MAPPINGS) {
    // Replace <li>Term</li> with <li><a class="autolink" href="...">Term</a></li> if not already an <a> tag
    const liRegex = new RegExp(`(<li>)(?!<a[^>]*>)(${item.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(</li>)`, 'gi');
    updated = updated.replace(liRegex, `$1<a class="autolink text-[#7E0D0D] font-medium hover:underline" href="${item.url}">$2</a>$3`);

    // In table cells where text appears alone without link
    const tdRegex = new RegExp(`(<td[^>]*>)(?!<a[^>]*>)(${item.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(</td>)`, 'gi');
    updated = updated.replace(tdRegex, `$1<a class="autolink text-[#7E0D0D] font-medium hover:underline" href="${item.url}">$2</a>$3`);
  }

  return updated;
}

async function run() {
  const { data: pages } = await supabase
    .from('cms_pages')
    .select('id, title, secondary_link, content')
    .eq('site_id', HODU_SITE_ID);

  console.log(`Checking ${pages?.length} pages to linkify terms and concept tables...`);
  let updatedCount = 0;

  for (const p of pages || []) {
    if (!p.content) continue;

    const modified = linkifyTableItems(p.content);
    if (modified !== p.content) {
      await supabase
        .from('cms_pages')
        .update({ content: modified, updated_at: new Date().toISOString() })
        .eq('id', p.id);

      console.log(`✓ Linkified concepts in: ${p.secondary_link} ("${p.title}")`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 Updated ${updatedCount} pages with clickable concept links!`);
}

run().catch(console.error);
