import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID } from '@/lib/hodu'

const DEFAULT_BLOGS = [
  {
    entryId: 14,
    title: 'VITEEE 2026 Application Form Updates — Link , Exam Dates & New Pattern',
    slug: 'viteee-2026-application-form-updates',
    category: 'JEE',
    dateStr: '2025-10-29T17:34:00Z',
    imageUrl: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/14/blog%20images%20%285%29.png',
    author: 'Abhishek Agarwal',
    read_time: '5 min read',
    excerpt: 'The VITEEE 2026 application form is now available online at viteee.vit.ac.in. Authorities will accept applications until March 31, 2026. Explore dates, new pattern and syllabus.'
  },
  {
    entryId: 13,
    title: 'JEE Main Registration 2026 Live: Dates, Exam Pattern & How to Apply',
    slug: 'jee-main-registration-2026-live',
    category: 'JEE',
    dateStr: '2025-10-25T11:45:00Z',
    imageUrl: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/13/JEE%20schedule%20blog%20image.png',
    author: 'Abhishek Agarwal',
    read_time: '6 min read',
    excerpt: 'JEE Main 2026 registration dates, step-by-step application instructions, eligibility criteria, exam pattern and high-yield scoring roadmap.'
  },
  {
    entryId: 12,
    title: 'India Ranks 7th at IMO 2025: Wins 3 Golds at International Mathematical Olympiad | Hodu Academy',
    slug: 'india-ranks-7th-at-imo-2025',
    category: 'Olympiad',
    dateStr: '2025-07-19T14:20:00Z',
    imageUrl: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/12/INDIA%20Ranks%207th%20at%20IMO%202025.png',
    author: 'Abhishek Agarwal',
    read_time: '5 min read',
    excerpt: 'India scores a historic milestone ranking 7th globally at the 66th International Mathematical Olympiad (IMO 2025) with 3 Gold and 3 Silver medals.'
  },
  {
    entryId: 11,
    title: 'IIT-Kanpur Releases JEE Advanced 2025 Scorecard at jeeadv.ac.in',
    slug: 'iit-kanpur-releases-jee-advanced-2025-scorecard',
    category: 'JEE',
    dateStr: '2025-07-17T16:10:00Z',
    imageUrl: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/11/JEE%20Advance%202025%20subject%20wise%20results%20are%20out%202025.png',
    author: 'Abhishek Agarwal',
    read_time: '4 min read',
    excerpt: 'IIT Kanpur has released the JEE Advanced 2025 scorecard and category-wise cutoffs. Check qualifying marks, rank lists and JoSAA counselling timeline.'
  },
  {
    entryId: 10,
    title: 'IB students worldwide receive their results from the May 2025 examination session',
    slug: 'ib-students-worldwide-receive-their-results-may-2025',
    category: 'IB',
    dateStr: '2025-07-14T15:30:00Z',
    imageUrl: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/10/IB%20results%202025.png',
    author: 'Abhishek Agarwal',
    read_time: '4 min read',
    excerpt: 'International Baccalaureate (IB) announces May 2025 Diploma Programme results globally with outstanding pass rates and average scores across top schools.'
  },
  {
    entryId: 9,
    title: 'NEET UG counselling schedule for state quota seats released, registrations open from 21 July',
    slug: 'neet-ug-counselling-schedule-state-quota-seats-released',
    category: 'NEET',
    dateStr: '2025-07-14T11:00:00Z',
    imageUrl: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/9/NEET%20counselling%202025.png',
    author: 'Abhishek Agarwal',
    read_time: '5 min read',
    excerpt: 'State quota NEET UG 2025 counselling dates announced. Seat allotment process, document verification checklist, and choice filling guidelines.'
  },
  {
    entryId: 8,
    title: 'The 10 Hardest Subjects in IGCSE: What You Need to Know',
    slug: 'the-10-hardest-subjects-in-igcse',
    category: 'IGCSE',
    dateStr: '2024-12-19T18:00:00Z',
    imageUrl: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/8/10Hardest%20thumbnail.png',
    author: 'Abhishek Agarwal',
    read_time: '7 min read',
    excerpt: 'Comprehensive ranking and analysis of the 10 most challenging Cambridge IGCSE subjects, grade boundaries, examiner mark schemes, and A* scoring tips.'
  },
  {
    entryId: 7,
    title: 'The Role of Parental Involvement in Academic Achievement',
    slug: 'the-role-of-parental-involvement-in-academic-achievement',
    category: 'General',
    dateStr: '2024-12-19T16:00:00Z',
    imageUrl: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/7/The%20Role%20of%20Parental%20Involvement%20in%20Academic%20Achievement.png',
    author: 'Abhishek Agarwal',
    read_time: '5 min read',
    excerpt: 'Why proactive parental guidance without excessive pressure builds sustained academic motivation, emotional resilience, and lifelong learning success.'
  },
  {
    entryId: 6,
    title: 'What to Do Just Before Exams: Essential Tips for Students and Parents',
    slug: 'what-to-do-just-before-exams',
    category: 'General',
    dateStr: '2024-12-19T14:00:00Z',
    imageUrl: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/6/What%20to%20Do%20Just%20Before%20Exams.png',
    author: 'Abhishek Agarwal',
    read_time: '5 min read',
    excerpt: 'Crucial 48-hour exam countdown checklist: optimal sleep routines, active recall revision strategies, anxiety control, and exam-day packing checklist.'
  },
  {
    entryId: 5,
    title: 'Is Homework a Hassle? Unpacking the Debate',
    slug: 'is-homework-a-hassle-unpacking-the-debate',
    category: 'General',
    dateStr: '2024-12-19T12:00:00Z',
    imageUrl: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/5/Is%20Homework%20a%20Hassle_.png',
    author: 'Abhishek Agarwal',
    read_time: '5 min read',
    excerpt: 'Examining both sides of the homework debate: when independent practice consolidates mastery versus when excessive assignments cause burnout.'
  }
]

export async function POST() {
  try {
    const supabase = await createClient()

    for (const b of DEFAULT_BLOGS) {
      const { data: existing } = await supabase
        .from('cms_blogs')
        .select('id')
        .eq('site_id', HODU_SITE_ID)
        .eq('slug', b.slug)
        .maybeSingle()

      if (!existing) {
        await supabase.from('cms_blogs').insert({
          site_id: HODU_SITE_ID,
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt,
          category: b.category,
          cover_image: b.imageUrl,
          read_time: b.read_time,
          author: b.author,
          published: true,
          created_at: b.dateStr,
        })
      }
    }

    return NextResponse.json({ success: true, message: 'All 10 blogs synchronized successfully' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
