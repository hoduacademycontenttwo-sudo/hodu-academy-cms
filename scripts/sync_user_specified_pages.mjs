import fs from 'fs';
import https from 'https';
import { createClient } from '@supabase/supabase-js';

// Read .env.local for Supabase credentials
const envLocal = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envLocal.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) envVars[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL || 'https://bgaidfuzvcrjbxmpfvym.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required!');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
const HODU_SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002';

const TARGET_PAGES = [
  // International Boards
  { id: 677, category: 'International Boards', label: 'International Boards' },
  { id: 707, category: 'International Boards', label: 'IGCSE' },
  { id: 712, category: 'International Boards', label: 'IBDP' },
  { id: 710, category: 'International Boards', label: 'A levels' },
  { id: 711, category: 'International Boards', label: 'O Level' },
  { id: 716, category: 'International Boards', label: 'AP Exams' },

  // Competitive Exams
  { id: 678, category: 'Competitive Exams', label: 'Competitive Exams' },
  { id: 709, category: 'Competitive Exams', label: 'JEE' },
  { id: 713, category: 'Competitive Exams', label: 'NEET' },
  { id: 714, category: 'Competitive Exams', label: 'CUET' },

  // Board Exams
  { id: 733, category: 'Board Exams', label: 'Board Exams' },
  { id: 708, category: 'Board Exams', label: 'CBSE' },
  { id: 717, category: 'Board Exams', label: 'ICSE' },
  { id: 718, category: 'Board Exams', label: 'State Boards' },

  // Olympiads
  { id: 715, category: 'Olympiads', label: 'Olympiads' },
  { id: 802, category: 'Olympiads', label: 'Science Olympiad (NSO)' },
  { id: 803, category: 'Olympiads', label: 'Maths Olympiad (IMO)' },
  { id: 799, category: 'Olympiads', label: 'G.K. Olympiad (IGKO)' },
  { id: 798, category: 'Olympiads', label: 'English Olympiad' },

  // Important Formulas
  { id: 721, category: 'Important Formulas', label: 'Important Formulas' },
  { id: 727, category: 'Important Formulas', label: 'CBSE Formulas' },
  { id: 691, category: 'Important Formulas', label: 'Science (6-10) Formulas' },
  { id: 692, category: 'Important Formulas', label: 'Maths (6-10) Formulas' },
  { id: 696, category: 'Important Formulas', label: 'Physics (11-12) Formulas' },
  { id: 693, category: 'Important Formulas', label: 'Chemistry (11-12) Formulas' },
  { id: 695, category: 'Important Formulas', label: 'Maths (11-12) Formulas' },
  { id: 697, category: 'Important Formulas', label: 'Biology (11-12) Formulas' },
  { id: 728, category: 'Important Formulas', label: 'IGCSE Formulas' },
  { id: 698, category: 'Important Formulas', label: 'IGCSE Physics Formulas' },
  { id: 699, category: 'Important Formulas', label: 'IGCSE Chemistry Formulas' },
  { id: 700, category: 'Important Formulas', label: 'IGCSE Add Maths Formulas' },
  { id: 701, category: 'Important Formulas', label: 'IGCSE Maths Formulas' },

  // Important Concepts
  { id: 719, category: 'Important Concepts', label: 'Important Concepts' },
  { id: 723, category: 'Important Concepts', label: 'Physics Concepts' },
  { id: 724, category: 'Important Concepts', label: 'Maths Concepts' },
  { id: 725, category: 'Important Concepts', label: 'Chemistry Concepts' },
  { id: 726, category: 'Important Concepts', label: 'Biology Concepts' },

  // NCERT Solutions
  { id: 720, category: 'NCERT Solutions', label: 'NCERT Solutions' },
  { id: 690, category: 'NCERT Solutions', label: 'NCERT Class 6' },
  { id: 689, category: 'NCERT Solutions', label: 'NCERT Class 7' },
  { id: 688, category: 'NCERT Solutions', label: 'NCERT Class 8' },
  { id: 685, category: 'NCERT Solutions', label: 'NCERT Class 9' },
  { id: 687, category: 'NCERT Solutions', label: 'NCERT Class 10' },
  { id: 882, category: 'NCERT Solutions', label: 'NCERT Class 11' },
  { id: 883, category: 'NCERT Solutions', label: 'NCERT Class 12' },

  // Book Solutions
  { id: 722, category: 'Book Solutions', label: 'Book Solutions' },
  { id: 729, category: 'Book Solutions', label: 'RD Sharma Solutions' },
  { id: 730, category: 'Book Solutions', label: 'HC Verma Solutions' },
  { id: 731, category: 'Book Solutions', label: 'RS Aggarwal Solutions' },
  { id: 732, category: 'Book Solutions', label: 'Lakhmir Singh Solutions' },

  // Date Sheets
  { id: 801, category: 'Datesheets', label: '12th Science Datesheet' },
  { id: 800, category: 'Datesheets', label: '10th Board Datesheet' },
  { id: 797, category: 'Datesheets', label: 'Olympiad Datesheet' },

  // Sample Papers
  { id: 795, category: 'Sample Papers', label: 'Half Yearly Sample Papers' },
  { id: 864, category: 'Sample Papers', label: 'Class 10th Board Full Syllabus Sample Papers' },
  { id: 865, category: 'Sample Papers', label: 'Class 12th Board Full Syllabus Sample Papers' },
  { id: 884, category: 'Sample Papers', label: 'Class 9th Full Syllabus Sample Papers' },
  { id: 885, category: 'Sample Papers', label: 'Class 11th Full Syllabus Sample Papers' },

  // Other
  { id: 804, category: 'PYQs & Courses', label: 'Most Repeated PYQs' },
  { id: 805, category: 'PYQs & Courses', label: 'Revision Course Landing Page' },
  { id: 57,  category: 'Enquiry', label: 'Faculty Enquiry' },
  { id: 846, category: 'Test Series', label: 'Test Series Schedule' },

  // JEE Mains PYQs
  { id: 806, category: 'JEE Main', label: 'JEE Mains Previous Year Papers' },
  { id: 807, category: 'JEE Main', label: 'JEE Main 2025' },
  { id: 808, category: 'JEE Main', label: 'JEE Main 2024' },
  { id: 809, category: 'JEE Main', label: 'JEE Main 2023' },
  { id: 810, category: 'JEE Main', label: 'JEE Main 2022' },
  { id: 811, category: 'JEE Main', label: 'JEE Main 2021' },
  { id: 812, category: 'JEE Main', label: 'JEE Main 2020' },
  { id: 813, category: 'JEE Main', label: 'JEE Main 2019' },
  { id: 814, category: 'JEE Main', label: 'JEE Main 2018' },
  { id: 815, category: 'JEE Main', label: 'JEE Main 2017' },
  { id: 816, category: 'JEE Main', label: 'JEE Main 2016' },
  { id: 817, category: 'JEE Main', label: 'JEE Main 2015' },
  { id: 818, category: 'JEE Main', label: 'JEE Main 2014' },
  { id: 819, category: 'JEE Main', label: 'JEE Main 2013' },
  { id: 845, category: 'JEE Main', label: 'JEE Mains Unsolved Only Paper' },

  // JEE Advance PYQs
  { id: 820, category: 'JEE Advanced', label: 'JEE Advanced Previous Year Papers' },
  { id: 821, category: 'JEE Advanced', label: 'JEE Advanced 2025' },
  { id: 822, category: 'JEE Advanced', label: 'JEE Advanced 2024' },
  { id: 823, category: 'JEE Advanced', label: 'JEE Advanced 2023' },
  { id: 824, category: 'JEE Advanced', label: 'JEE Advanced 2022' },
  { id: 825, category: 'JEE Advanced', label: 'JEE Advanced 2021' },
  { id: 826, category: 'JEE Advanced', label: 'JEE Advanced 2020' },
  { id: 827, category: 'JEE Advanced', label: 'JEE Advanced 2019' },
  { id: 828, category: 'JEE Advanced', label: 'JEE Advanced 2018' },
  { id: 829, category: 'JEE Advanced', label: 'JEE Advanced 2017' },
  { id: 830, category: 'JEE Advanced', label: 'JEE Advanced 2016' },
  { id: 831, category: 'JEE Advanced', label: 'JEE Advanced 2015' },
  { id: 832, category: 'JEE Advanced', label: 'JEE Advanced 2014' },
  { id: 833, category: 'JEE Advanced', label: 'JEE Advanced 2013' },
  { id: 881, category: 'JEE Advanced', label: 'JEE Advanced Unsolved Papers' },

  // NEET PYQs
  { id: 834, category: 'NEET', label: 'NEET Previous Year Question Papers' },
  { id: 835, category: 'NEET', label: 'NEET 2025' },
  { id: 836, category: 'NEET', label: 'NEET 2024' },
  { id: 837, category: 'NEET', label: 'NEET 2023' },
  { id: 838, category: 'NEET', label: 'NEET 2022' },
  { id: 839, category: 'NEET', label: 'NEET 2021' },
  { id: 840, category: 'NEET', label: 'NEET 2020' },
  { id: 841, category: 'NEET', label: 'NEET 2019' },
  { id: 842, category: 'NEET', label: 'NEET 2018' },
  { id: 843, category: 'NEET', label: 'NEET 2017' },
  { id: 844, category: 'NEET', label: 'NEET 2016' },
  { id: 880, category: 'NEET', label: 'NEET Unsolved Papers' },
  { id: 886, category: 'NEET', label: 'NEET NTA Abhyas 70 Papers' },

  // CBSE Class 12 Previous Year Papers
  { id: 847, category: 'CBSE 12', label: 'CBSE Class 12 Previous Year Papers Main' },
  { id: 848, category: 'CBSE 12', label: 'CBSE 12 Physics' },
  { id: 849, category: 'CBSE 12', label: 'CBSE 12 Chemistry' },
  { id: 850, category: 'CBSE 12', label: 'CBSE 12 Mathematics' },
  { id: 851, category: 'CBSE 12', label: 'CBSE 12 Biology' },
  { id: 852, category: 'CBSE 12', label: 'CBSE 12 Computer Science' },
  { id: 853, category: 'CBSE 12', label: 'CBSE 12 English Core' },
  { id: 854, category: 'CBSE 12', label: 'CBSE 12 Physical Education' },
  { id: 855, category: 'CBSE 12', label: 'CBSE 12 Accountancy' },
  { id: 856, category: 'CBSE 12', label: 'CBSE 12 Business Studies' },
  { id: 857, category: 'CBSE 12', label: 'CBSE 12 Economics' },
  { id: 858, category: 'CBSE 12', label: 'CBSE 12 Applied Mathematics' },
  { id: 859, category: 'CBSE 12', label: 'CBSE 12 History' },
  { id: 860, category: 'CBSE 12', label: 'CBSE 12 Political Science' },
  { id: 861, category: 'CBSE 12', label: 'CBSE 12 Geography' },
  { id: 862, category: 'CBSE 12', label: 'CBSE 12 Sociology' },
  { id: 863, category: 'CBSE 12', label: 'CBSE 12 Psychology' },

  // CBSE Class 10 Previous Year Papers
  { id: 866, category: 'CBSE 10', label: 'CBSE Class 10 Previous Year Papers Main' },
  { id: 867, category: 'CBSE 10', label: 'CBSE 10 English' },
  { id: 868, category: 'CBSE 10', label: 'CBSE 10 Hindi' },
  { id: 869, category: 'CBSE 10', label: 'CBSE 10 Mathematics' },
  { id: 870, category: 'CBSE 10', label: 'CBSE 10 Science' },
  { id: 871, category: 'CBSE 10', label: 'CBSE 10 Social Science' },
  { id: 872, category: 'CBSE 10', label: 'CBSE 10 Computer Technology' },
  { id: 873, category: 'CBSE 10', label: 'CBSE 10 Information Technology' },
  { id: 874, category: 'CBSE 10', label: 'CBSE 10 Sanskrit' },

  // CBSE Class 10 Chapterwise PYQ
  { id: 875, category: 'CBSE 10', label: 'CBSE Class 10 Chapterwise PYQ Main' },
  { id: 876, category: 'CBSE 10', label: 'CBSE 10 Chapterwise Maths' },
  { id: 877, category: 'CBSE 10', label: 'CBSE 10 Chapterwise Science' },
  { id: 878, category: 'CBSE 10', label: 'CBSE 10 Chapterwise Social Science' },
  { id: 879, category: 'CBSE 10', label: 'CBSE 10 Chapterwise English' },

  // CUET Practice Papers & Past Year Papers
  { id: 887, category: 'CUET', label: 'CUET Practice Papers Main' },
  { id: 888, category: 'CUET', label: 'CUET Practice Physics' },
  { id: 889, category: 'CUET', label: 'CUET Practice Chemistry' },
  { id: 890, category: 'CUET', label: 'CUET Practice Maths' },
  { id: 891, category: 'CUET', label: 'CUET Practice Biology' },
  { id: 892, category: 'CUET', label: 'CUET Past Year Papers Main' },
  { id: 893, category: 'CUET', label: 'CUET Past Physics' },
  { id: 894, category: 'CUET', label: 'CUET Past Chemistry' },
  { id: 895, category: 'CUET', label: 'CUET Past Maths' },
  { id: 896, category: 'CUET', label: 'CUET Past English' },
  { id: 897, category: 'CUET', label: 'CUET Past General Test' },
];

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', (err) => resolve({ status: 500, error: err.message, data: '' }));
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractCleanContent(rawHtml) {
  const mainMatch = rawHtml.match(/<div role="main">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i) ||
                    rawHtml.match(/<div class="box py-3 generalbox">([\s\S]*?)<\/div>/i) ||
                    rawHtml.match(/<div id="region-main"[\s\S]*?>([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i);

  if (mainMatch) {
    return mainMatch[1].trim();
  }
  return '';
}

async function run() {
  console.log(`Starting prioritized sync of all ${TARGET_PAGES.length} specified pages...`);

  let count = 0;
  for (let i = 0; i < TARGET_PAGES.length; i++) {
    const item = TARGET_PAGES[i];
    const url = `https://hoduacademy.com/mod/page/view.php?id=${item.id}`;

    console.log(`[${i + 1}/${TARGET_PAGES.length}] Syncing ID: ${item.id} (${item.label})...`);
    const res = await fetchUrl(url);

    if (res.status !== 200 || !res.data) {
      console.log(`  Failed (status ${res.status}) for ID: ${item.id}`);
      continue;
    }

    const titleMatch = res.data.match(/<title>(.*?)<\/title>/i);
    let pageTitle = titleMatch ? titleMatch[1].replace('Hodu Academy: ', '').replace(' | Hodu Academy', '').trim() : item.label;
    pageTitle = pageTitle.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#039;', "'").replaceAll('&ndash;', '–').replaceAll('&mdash;', '—');

    let content = extractCleanContent(res.data);
    if (!content || content.length < 50) {
      console.log(`  Skipping ID ${item.id}: content too short (${content.length} chars)`);
      continue;
    }

    let slug = slugify(pageTitle);
    if (!slug) slug = `page-${item.id}`;

    const stripped = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const excerpt = stripped.substring(0, 200) + '...';

    const pageRecord = {
      site_id: HODU_SITE_ID,
      title: pageTitle,
      slug: slug,
      category: item.category,
      secondary_link: `/mod/page/view.php?id=${item.id}`,
      content: content,
      excerpt: excerpt,
      meta_title: `${pageTitle} | Hodu Academy`,
      meta_description: excerpt,
      published: true,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from('cms_pages')
      .select('id')
      .eq('site_id', HODU_SITE_ID)
      .eq('secondary_link', `/mod/page/view.php?id=${item.id}`)
      .maybeSingle();

    if (existing) {
      await supabase.from('cms_pages').update(pageRecord).eq('id', existing.id);
      console.log(`  ✓ Updated: "${pageTitle}" [${item.category}]`);
    } else {
      await supabase.from('cms_pages').insert(pageRecord);
      console.log(`  + Inserted: "${pageTitle}" [${item.category}]`);
    }

    count++;
    await new Promise(r => setTimeout(r, 60));
  }

  console.log(`\n🎉 Successfully synchronized all ${count} specified pages with complete content & categories!`);
}

run().catch(console.error);
