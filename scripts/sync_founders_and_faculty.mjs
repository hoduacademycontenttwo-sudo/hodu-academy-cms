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

const TEAM_MEMBERS = [
  // --- FOUNDERS ---
  {
    name: 'Mr. V.P. Singh',
    role: 'Co-Founder & Director',
    subject: 'Physics & Academic Direction',
    qualification: 'MNIT, Jaipur',
    experience: '25+ Years Experience',
    bio: 'With over 25 years of experience, Mr. V.P. Singh has mentored more than 10,000 students, guiding them to success in JEE, NEET, and board exams. A Civil Engineering graduate from MNIT Jaipur, he is renowned for his ability to simplify physics and inspire a genuine love for the subject. His outstanding leadership and unwavering dedication set the gold standard for teaching excellence.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/VPSir.jpeg',
    is_founder: true,
    featured_offline: true,
    sort_order: 1
  },
  {
    name: 'Mr. Rohit Jain',
    role: 'Co-Founder & Director',
    subject: 'Physics & Curriculum Innovation',
    qualification: 'MNIT, Jaipur',
    experience: '15+ Years Experience',
    bio: 'With over a decade of experience, Mr. Rohit Jain has mentored 6,000+ students, guiding them to top ranks in JEE, NEET, and international curriculums like IGCSE and IB. A B.Tech. graduate from MNIT Jaipur, his innovative teaching and leadership in education inspire excellence and holistic growth. He consistently nurtures problem-solving skills, setting a benchmark for young learners.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/rohit%20sir%20photo.png',
    is_founder: true,
    featured_offline: true,
    sort_order: 2
  },
  {
    name: 'Mr. Abhishek Agarwal',
    role: 'Co-Founder & Technology Lead',
    subject: 'Digital Learning & EdTech Innovation',
    qualification: 'IIIT - Hyderabad',
    experience: 'Palantir, Ex-Qualcomm',
    bio: 'An alumnus of IIIT Hyderabad with industry leadership at Palantir and Qualcomm, Abhishek leads technology innovation, digital classroom architectures, and global student learning ecosystems at Hodu Academy, empowering learners across India and abroad.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/photos%20%282%29.png',
    is_founder: true,
    featured_offline: true,
    sort_order: 3
  },

  // --- FACULTY MEMBERS ---
  {
    name: 'Mr. V.P. Singh',
    role: 'Senior Physics Educator',
    subject: 'Physics',
    qualification: 'MNIT, Jaipur',
    experience: '25+ Years Experience (10,000+ Students Mentored)',
    bio: 'With over 25 years of experience, Mr. V.P. Singh has mentored more than 10,000 students, guiding them to success in JEE, NEET, and board exams. A Civil Engineering graduate from MNIT Jaipur, he is renowned for his ability to simplify physics and inspire a genuine love for the subject.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/VPSir.jpeg',
    is_founder: false,
    featured_offline: true,
    sort_order: 4
  },
  {
    name: 'Mr. Rohit Jain',
    role: 'Expert Physics Educator',
    subject: 'Physics',
    qualification: 'MNIT, Jaipur',
    experience: '15+ Years Experience (6,000+ Students Mentored)',
    bio: 'With over a decade of experience, Mr. Rohit Jain has mentored 6,000+ students, guiding them to top ranks in JEE, NEET, and international curriculums like IGCSE and IB. A B.Tech. graduate from MNIT Jaipur, his innovative teaching and leadership in education inspire excellence and holistic growth.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/rohit%20sir%20photo.png',
    is_founder: false,
    featured_offline: true,
    sort_order: 5
  },
  {
    name: 'Ms. Shraddha Tiwari',
    role: 'Passionate English Educator',
    subject: 'English & International Boards',
    qualification: 'Postgraduate in English Literature',
    experience: '8+ Years Experience (IGCSE, IB & CBSE Specialist)',
    bio: 'With extensive experience mentoring IGCSE, IB, and CBSE students, Miss Shraddha is a passionate English educator renowned for nurturing language proficiency and literary appreciation. Holding a postgraduate degree in English Literature, she employs innovative strategies to deliver engaging lessons.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/shraddha%20mam%20photo.png',
    is_founder: false,
    featured_offline: true,
    sort_order: 6
  },
  {
    name: 'Mr. Abhishek Garg',
    role: 'Skilled Math Educator',
    subject: 'Mathematics',
    qualification: 'B.Tech Mechanical (Jamia Millia Islamia)',
    experience: '6+ Years Experience (CBSE, IGCSE, IB, AP)',
    bio: 'Abhishek Garg is a skilled math educator with over six years of experience making math exciting and accessible. A Mechanical Engineering graduate from Jamia Millia Islamia University, he excels in teaching CBSE, IGCSE, IB, A Levels, AP exams, and more.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/abhishek%20sir%20photo.png',
    is_founder: false,
    featured_offline: false,
    sort_order: 7
  },
  {
    name: 'Ms. Mansi Baswal',
    role: 'Passionate Chemistry Expert',
    subject: 'Chemistry',
    qualification: "Master's Organic Chemistry | GATE & CSIR NET",
    experience: '5+ Years Experience (CBSE, IGCSE, GCSE & IB)',
    bio: 'With a Master’s degree in Organic Chemistry, Miss Mansi is a passionate educator experienced in CBSE, IGCSE, GCSE, and IB curricula. Known for simplifying complex topics through real-life examples, she inspires students to excel in chemistry.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/mansi%20mam%20photo.png',
    is_founder: false,
    featured_offline: false,
    sort_order: 8
  },
  {
    name: 'Mr. Deepesh Chandwani',
    role: 'Dynamic Math Mentor',
    subject: 'Mathematics',
    qualification: 'RTU & Manipal University Graduate',
    experience: '10+ Years Experience (IGCSE, IB, A Levels, CBSE)',
    bio: 'With over a decade of experience, Mr. Deepesh Chandwani is a dynamic math mentor renowned for simplifying complex concepts and inspiring confidence. A graduate of Rajasthan Technical University and Manipal University, he excels in IGCSE, IB, A Levels, and CBSE.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/deepesh%20sir%20photo.png',
    is_founder: false,
    featured_offline: false,
    sort_order: 9
  }
];

async function sync() {
  console.log('Syncing founders and faculty into cms_faculty table for Hodu Academy...');

  // Delete existing records for Hodu site to ensure clean sync
  await supabase
    .from('cms_faculty')
    .delete()
    .eq('site_id', HODU_SITE_ID);

  for (const member of TEAM_MEMBERS) {
    const { error } = await supabase
      .from('cms_faculty')
      .insert({
        site_id: HODU_SITE_ID,
        name: member.name,
        role: member.role,
        subject: member.subject,
        qualification: member.qualification,
        experience: member.experience,
        bio: member.bio,
        photo_url: member.photo_url,
        is_founder: member.is_founder,
        featured_offline: member.featured_offline,
        sort_order: member.sort_order
      });

    if (error) {
      console.error(`Error inserting ${member.name}:`, error.message);
    } else {
      console.log(`✓ Inserted: ${member.name} (${member.is_founder ? 'Founder' : 'Faculty'} - ${member.role})`);
    }
  }

  console.log('\n🎉 ALL Founders & Faculty successfully synced into cms_faculty!');
}

sync().catch(console.error);
