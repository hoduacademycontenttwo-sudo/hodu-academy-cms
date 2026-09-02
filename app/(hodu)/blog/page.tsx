import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID } from '@/lib/hodu'
import BlogListClient from '@/components/hodu/BlogListClient'

export const metadata = {
  title: 'Site blog | Hodu Academy',
  description: 'Official announcements, competitive exam updates, syllabus changes, and academic insights from Hodu Academy mentors.',
}

const fallbackBlogs = [
  {
    title: 'VITEEE 2026 Application Form Updates — Link , Exam Dates & New Pattern',
    slug: 'viteee-2026-application-form-updates',
    category: 'JEE',
    date: '29 October 2025',
    cover_image: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/14/blog%20images%20%285%29.png',
    author: 'Abhishek Agarwal',
    readTime: '5 min read',
    excerpt: 'The VITEEE 2026 application form is now available online at viteee.vit.ac.in. Authorities will accept applications until March 31, 2026.'
  },
  {
    title: 'JEE Main Registration 2026 Live: Dates, Exam Pattern & How to Apply',
    slug: 'jee-main-registration-2026-live',
    category: 'JEE',
    date: '25 October 2025',
    cover_image: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/13/JEE%20schedule%20blog%20image.png',
    author: 'Abhishek Agarwal',
    readTime: '6 min read',
    excerpt: 'JEE Main 2026 registration dates, step-by-step application instructions, eligibility criteria, exam pattern and high-yield scoring roadmap.'
  },
  {
    title: 'India Ranks 7th at IMO 2025: Wins 3 Golds at International Mathematical Olympiad | Hodu Academy',
    slug: 'india-ranks-7th-at-imo-2025',
    category: 'Olympiad',
    date: '19 July 2025',
    cover_image: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/12/INDIA%20Ranks%207th%20at%20IMO%202025.png',
    author: 'Abhishek Agarwal',
    readTime: '5 min read',
    excerpt: 'India scores a historic milestone ranking 7th globally at the 66th International Mathematical Olympiad (IMO 2025) with 3 Gold and 3 Silver medals.'
  },
  {
    title: 'IIT-Kanpur Releases JEE Advanced 2025 Scorecard at jeeadv.ac.in',
    slug: 'iit-kanpur-releases-jee-advanced-2025-scorecard',
    category: 'JEE',
    date: '17 July 2025',
    cover_image: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/11/JEE%20Advance%202025%20subject%20wise%20results%20are%20out%202025.png',
    author: 'Abhishek Agarwal',
    readTime: '4 min read',
    excerpt: 'IIT Kanpur has released the JEE Advanced 2025 scorecard and category-wise cutoffs. Check qualifying marks, rank lists and JoSAA counselling timeline.'
  },
  {
    title: 'IB students worldwide receive their results from the May 2025 examination session',
    slug: 'ib-students-worldwide-receive-their-results-may-2025',
    category: 'IB',
    date: '14 July 2025',
    cover_image: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/10/IB%20results%202025.png',
    author: 'Abhishek Agarwal',
    readTime: '4 min read',
    excerpt: 'International Baccalaureate (IB) announces May 2025 Diploma Programme results globally with outstanding pass rates and average scores across top schools.'
  },
  {
    title: 'NEET UG counselling schedule for state quota seats released, registrations open from 21 July',
    slug: 'neet-ug-counselling-schedule-state-quota-seats-released',
    category: 'NEET',
    date: '14 July 2025',
    cover_image: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/9/NEET%20counselling%202025.png',
    author: 'Abhishek Agarwal',
    readTime: '5 min read',
    excerpt: 'State quota NEET UG 2025 counselling dates announced. Seat allotment process, document verification checklist, and choice filling guidelines.'
  },
  {
    title: 'The 10 Hardest Subjects in IGCSE: What You Need to Know',
    slug: 'the-10-hardest-subjects-in-igcse',
    category: 'IGCSE',
    date: '19 December 2024',
    cover_image: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/8/10Hardest%20thumbnail.png',
    author: 'Abhishek Agarwal',
    readTime: '7 min read',
    excerpt: 'Comprehensive ranking and analysis of the 10 most challenging Cambridge IGCSE subjects, grade boundaries, examiner mark schemes, and A* scoring tips.'
  },
  {
    title: 'The Role of Parental Involvement in Academic Achievement',
    slug: 'the-role-of-parental-involvement-in-academic-achievement',
    category: 'General',
    date: '19 December 2024',
    cover_image: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/7/The%20Role%20of%20Parental%20Involvement%20in%20Academic%20Achievement.png',
    author: 'Abhishek Agarwal',
    readTime: '5 min read',
    excerpt: 'Why proactive parental guidance without excessive pressure builds sustained academic motivation, emotional resilience, and lifelong learning success.'
  },
  {
    title: 'What to Do Just Before Exams: Essential Tips for Students and Parents',
    slug: 'what-to-do-just-before-exams',
    category: 'General',
    date: '19 December 2024',
    cover_image: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/6/What%20to%20Do%20Just%20Before%20Exams.png',
    author: 'Abhishek Agarwal',
    readTime: '5 min read',
    excerpt: 'Crucial 48-hour exam countdown checklist: optimal sleep routines, active recall revision strategies, anxiety control, and exam-day packing checklist.'
  },
  {
    title: 'Is Homework a Hassle? Unpacking the Debate',
    slug: 'is-homework-a-hassle-unpacking-the-debate',
    category: 'General',
    date: '19 December 2024',
    cover_image: 'https://hoduacademy.com/pluginfile.php/1/blog/attachment/5/Is%20Homework%20a%20Hassle_.png',
    author: 'Abhishek Agarwal',
    readTime: '5 min read',
    excerpt: 'Examining both sides of the homework debate: when independent practice consolidates mastery versus when excessive assignments cause burnout.'
  }
]

import { redirect } from 'next/navigation'

const legacyMap: Record<string, string> = {
  '14': 'viteee-2026-application-form-updates',
  '13': 'jee-main-registration-2026-live',
  '12': 'india-ranks-7th-at-imo-2025',
  '11': 'iit-kanpur-releases-jee-advanced-2025-scorecard',
  '10': 'ib-students-worldwide-receive-their-results-may-2025',
  '9': 'neet-ug-counselling-schedule-state-quota-seats-released',
  '8': 'the-10-hardest-subjects-in-igcse',
  '7': 'the-role-of-parental-involvement-in-academic-achievement',
  '6': 'what-to-do-just-before-exams',
  '5': 'is-homework-a-hassle-unpacking-the-debate',
}

export default async function BlogPage({ searchParams }: { searchParams?: Promise<{ entryid?: string }> }) {
  const sp = await searchParams
  const entryId = sp?.entryid?.trim()
  if (entryId) {
    if (legacyMap[entryId]) {
      redirect(`/blog/${legacyMap[entryId]}`)
    }
  }

  const supabase = await createClient()

  if (entryId) {
    const { data: matchedBlog } = await supabase
      .from('cms_blogs')
      .select('slug')
      .eq('site_id', HODU_SITE_ID)
      .ilike('secondary_link', `%entryid=${entryId}%`)
      .maybeSingle()

    if (matchedBlog?.slug) {
      redirect(`/blog/${matchedBlog.slug}`)
    }
  }

  const { data: dbPosts } = await supabase
    .from('cms_blogs')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .eq('published', true)
    .order('created_at', { ascending: false })

  const posts = dbPosts && dbPosts.length > 0
    ? dbPosts.map(p => {
        let formattedDate = 'Recently'
        try {
          formattedDate = new Date(p.created_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        } catch {}

        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          date: formattedDate,
          category: p.category || 'General',
          excerpt: p.excerpt || '',
          cover_image: p.cover_image || '',
          secondary_link: p.secondary_link || '',
          author: p.author || 'Abhishek Agarwal',
          readTime: p.read_time || '5 min read',
        }
      })
    : fallbackBlogs

  return <BlogListClient initialPosts={posts} />
}
