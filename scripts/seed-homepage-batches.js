const fs = require('fs');
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002';
const CATEGORY = 'Homepage Batches';

const defaultBatches = [
  {
    tag: 'CAMBRIDGE IGCSE & A-LEVELS',
    title: 'Cambridge International Program',
    grades: 'Grades 8 to 12 · IGCSE / AS & A Levels',
    desc: 'Targeted coaching for Extended Math, Physics, Chemistry, Biology & Economics with 15-year past paper mastery and command-word marking rubrics.',
    features: ['Past 15 Years Question Bank Decoded', 'Command Word Marking Rubrics', 'Individual Coursework & IA Review', 'Intimate 1:12 Batch Size'],
    href: '/courses?category=IGCSE',
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'INTERNATIONAL BACCALAUREATE',
    title: 'IB Diploma (MYP & DP) Batch',
    grades: 'MYP 4–5 & DP 1–2',
    desc: 'Deep conceptual training across HL & SL subjects with dedicated Internal Assessment (IA), Extended Essay (EE), and TOK guidance by examiner-mentors.',
    features: ['Criterion-Referenced Rubrics Mastery', 'Internal Assessment (IA) Mentorship', 'Extended Essay (EE) & TOK Support', 'Regular Past Exam Simulations'],
    href: '/courses?category=IB',
    img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'PRE-ENGINEERING & MEDICAL',
    title: 'IIT-JEE & NEET-UG 2-Year Batch',
    grades: 'Classes 11, 12 & Dropper Intensive',
    desc: 'Comprehensive syllabus coverage with Daily Practice Problems (DPPs), error analysis logs, and weekly All-India rank simulation mock exams.',
    features: ['Daily 30-Question DPPs with Review', 'Computer-Based Test (CBT) Labs', 'Level 1–3 Problem Solving Kits', 'Daily 1-on-1 Faculty Doubt Desk'],
    href: '/courses?category=Competitive+Exams',
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'NATIONAL CURRICULUM',
    title: 'CBSE Board Masterclass (9th–12th)',
    grades: 'Classes 9, 10, 11 & 12 (Science & Commerce)',
    desc: 'Line-by-line NCERT decoding, exemplar solutions, competency-based questions, and board exam answer presentation workshops for 95%+ targets.',
    features: ['Line-by-Line NCERT Decoding', 'Competency & Case-Based Question Kits', 'Specialized Board Answer Writing Sessions', 'Monthly Mock Board Series'],
    href: '/courses?category=CBSE',
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'FOUNDATION & TALENT',
    title: 'Junior Olympiads & Aptitude Track',
    grades: 'Classes 6, 7 & 8',
    desc: 'Early competitive aptitude building, speed math, non-routine problem solving, and science fundamentals for IMO, NSO, and PRMO exams.',
    features: ['Speed Math & Mental Agility Drills', 'Hands-on Science Demonstrations', 'Olympiad & Talent Search Preparation', 'Strong STEM Foundation'],
    href: '/courses?category=Olympiads',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'JAIPUR OFFLINE CAMPUS',
    title: 'Jaipur Physical Classroom Batches',
    grades: 'All Curriculums · Vaishali Extension',
    desc: 'Study at our modern air-conditioned learning center in Jaipur with smart digital boards, silent reference library, and daily 1-on-1 doubt desks.',
    features: ['Acoustic Smart Classrooms', 'Dedicated 1-on-1 Faculty Doubt Desks', 'Silent Library (8 AM – 9 PM)', 'Doorstep AC GPS Transport'],
    href: '/offline',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=320&fit=crop&auto=format'
  }
];

async function seed() {
  const { data: existing } = await supabase
    .from('cms_gallery')
    .select('*')
    .eq('site_id', SITE_ID)
    .eq('category', CATEGORY);

  if (!existing || existing.length === 0) {
    const rows = defaultBatches.map((b, idx) => ({
      site_id: SITE_ID,
      category: CATEGORY,
      image_url: b.img,
      caption: JSON.stringify({
        tag: b.tag,
        title: b.title,
        grades: b.grades,
        desc: b.desc,
        features: b.features,
        href: b.href,
      }),
      sort_order: idx,
    }));

    const res = await supabase.from('cms_gallery').insert(rows);
    console.log('Seeded homepage batches:', res.error || 'SUCCESS');
  } else {
    console.log('Homepage batches already exist:', existing.length);
  }
}

seed();
