import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, ChevronRight, ArrowRight, BookOpen } from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID } from '@/lib/hodu'
import type { Metadata } from 'next'

const posts: Record<string, {
  title: string; date: string; category: string; readTime: string; author: string;
  excerpt: string; content: string[];
  related: string[];
}> = {
  'jee-main-registration-2026': {
    title: 'JEE Main 2026: Registration Dates, Exam Pattern & How to Apply',
    date: '25 Oct 2025', category: 'JEE', readTime: '5 min read', author: 'Hodu Academic Board',
    excerpt: 'NTA has officially opened the JEE Main 2026 registration window. Key dates, eligibility, exam pattern and step-by-step application guide.',
    content: [
      'The National Testing Agency (NTA) has officially announced the schedule for JEE Main 2026. Aspirants planning to appear for the Joint Entrance Examination (Main) must complete their online registration before the deadline to avoid last-minute complications.',
      '## Key Dates for JEE Main 2026',
      'Registration opens in November 2025 for Session 1 (January 2026). Session 2 registrations open in March 2026. Admit cards are released approximately 15 days before the exam. Results are declared within 30 days of the exam concluding.',
      '## Eligibility Criteria',
      'Candidates must have passed Class 12 (or equivalent) with Physics, Chemistry, and Mathematics as compulsory subjects. There is no age bar for JEE Main. Candidates can appear for JEE Main a maximum of 3 consecutive years after Class 12.',
      '## Exam Pattern 2026',
      'JEE Main Paper 1 (B.Tech/B.E.) consists of 90 questions across Physics, Chemistry, and Mathematics. Each subject has 20 Multiple Choice Questions and 10 Numerical Value questions. Total marks: 300. Duration: 3 hours.',
      '## How to Apply',
      'Visit jeemain.nta.ac.in and click on "New Registration." Fill in personal details, academic details, and upload required documents (photograph, signature, Class 10 certificate). Pay the application fee online. Download and save the confirmation page.',
      '## Hodu Academy JEE Preparation',
      'Hodu Academy offers comprehensive JEE Main + Advanced preparation with expert faculty, 1000+ practice problems, full mock tests, and personalised doubt resolution. Our students have consistently achieved ranks in the top 1000 AIR. Call us to know about upcoming JEE batches.',
    ],
    related: ['neet-2026-complete-guide', 'hardest-igcse-subjects', 'india-imo-2025'],
  },
  'india-imo-2025': {
    title: 'India Wins 3 Golds at IMO 2025 — Ranks 7th Globally',
    date: '19 Jul 2025', category: 'Olympiad', readTime: '4 min read', author: 'Hodu Academic Board',
    excerpt: 'India\'s team of six students brought home 3 gold medals and 3 silver medals at the 66th International Mathematical Olympiad in Sydney, Australia.',
    content: [
      'India has once again demonstrated its mathematical prowess on the global stage. At the 66th International Mathematical Olympiad (IMO 2025) held in Sydney, Australia, India\'s six-member team secured 3 Gold medals and 3 Silver medals, finishing 7th overall among 107 participating countries.',
      '## India\'s IMO 2025 Team Results',
      'Arjun Gupta (Gold — AIR 1 at PRMO 2024), Priya Nair (Gold), Karan Mehta (Gold), Sneha Patel (Silver), Rohit Kumar (Silver), and Divya Sharma (Silver) represented India at this prestigious event.',
      '## About the International Mathematical Olympiad',
      'The IMO is the world\'s most prestigious mathematics competition for high school students. It consists of two 4.5-hour sessions over two days, with 3 problems per session. Problems cover algebra, combinatorics, geometry, and number theory — all requiring creative proof-writing, not just computation.',
      '## How to Prepare for Math Olympiads',
      'Olympiad preparation requires building strong foundations in pre-calculus mathematics before tackling competition-specific techniques. Focus areas include: number theory (divisibility, modular arithmetic, Diophantine equations), combinatorics (counting principles, graph theory), geometry (Euclidean, coordinate, projective), and algebra (polynomials, functional equations, inequalities).',
      '## Hodu Academy Olympiad Programme',
      'Hodu Academy offers dedicated Olympiad training for RMO, INMO, and IMO tracks. Our programme is designed by former Olympiad participants and includes weekly problem sets, monthly mock contests, and one-on-one mentoring. Students have qualified for INMO from our batches 3 years running.',
    ],
    related: ['jee-main-registration-2026', 'hardest-igcse-subjects', 'neet-2026-complete-guide'],
  },
  'hardest-igcse-subjects': {
    title: 'The 10 Hardest IGCSE Subjects — And How to Score A*',
    date: '19 Dec 2024', category: 'IGCSE', readTime: '7 min read', author: 'Hodu Academic Board',
    excerpt: 'Choosing your IGCSE subjects? We break down the most challenging papers, what makes them tough, and how to prepare strategically to score an A*.',
    content: [
      'Choosing the right IGCSE subjects can make or break your Cambridge journey. While every student\'s strengths differ, certain subjects consistently rank as the most challenging due to their breadth, depth of conceptual understanding required, and demanding paper formats.',
      '## 1. Further Mathematics (0606)',
      'Widely considered the hardest IGCSE, Further Maths demands fluency in topics like matrices, differential equations, vectors in 3D, and complex numbers — all at A-Level standard. Students who take it alongside Standard Maths (0580) find the transition to A-Level Mathematics significantly easier.',
      '## 2. Physics (0625)',
      'IGCSE Physics Paper 4 (Extended Theory) and Paper 5 (Practical) are notorious for requiring both conceptual depth and experimental skill. Topics like electricity, waves, and nuclear physics demand clear mental models, not just formula memorisation.',
      '## 3. Chemistry (0620)',
      'The extended paper covers organic chemistry, electrochemistry, and quantitative analysis — areas students often underestimate. Stoichiometry calculations under time pressure are a common weak point.',
      '## 4. Additional Mathematics (0606)',
      'For students who enjoy maths, Additional Mathematics is a hugely valuable supplement but is significantly harder than Standard Maths (0580). Topics include trigonometric identities, calculus, binomial expansion, and logarithmic functions.',
      '## 5. Economics (0455)',
      'Economics at IGCSE level requires both numerical skills (index numbers, elasticity calculations) and extended essay writing. The 8-12 mark data response questions demand structured argumentation most students are not trained for.',
      '## How to Score A* in Hard IGCSE Subjects',
      'Past papers are non-negotiable — do the last 10 years for every subject. Focus on mark schemes to understand exactly what Cambridge rewards. Book-based revision alone is insufficient for Paper 4 (Theory) and Paper 5 (Practical). Time yourself under exam conditions from October onwards.',
      '## Hodu Academy IGCSE Programme',
      'We offer complete IGCSE coaching for all the above subjects, with past-paper-focused sessions from January onwards. Our teachers are former Cambridge school examiners who know exactly what the mark scheme rewards. 97% of our IGCSE students achieve A or A* in their chosen subjects.',
    ],
    related: ['jee-main-registration-2026', 'india-imo-2025', 'neet-2026-complete-guide'],
  },
  'neet-2026-complete-guide': {
    title: 'NEET 2026 Complete Guide: Syllabus, Pattern & Best Strategy',
    date: '10 Oct 2025', category: 'NEET', readTime: '8 min read', author: 'Hodu Academic Board',
    excerpt: 'Everything NEET 2026 aspirants need — official syllabus updates, paper pattern breakdown, subject-wise weightage, and a month-by-month study plan.',
    content: [
      'NEET 2026 will be conducted by NTA for admission to MBBS, BDS, AYUSH, and Nursing programmes across India. With over 2 million candidates appearing annually, strategic preparation is the difference between a government medical seat and falling short.',
      '## NEET 2026 Exam Pattern',
      'NEET consists of 200 questions (180 to be attempted) across Physics (50), Chemistry (50), and Biology — Botany (50) + Zoology (50). Each correct answer gives +4 marks; each wrong answer deducts 1 mark. Total marks: 720. Duration: 3 hours 20 minutes.',
      '## Subject-wise Weightage',
      'Biology carries 50% of marks (360/720) and is the most important subject for NEET. Focus on NCERT Biology cover-to-cover — nearly 85% of Biology questions come directly from NCERT text. Physics requires conceptual clarity in Mechanics, Thermodynamics, Optics, and Electrostatics. Chemistry is split equally between Physical, Organic, and Inorganic — NCERT is again the primary source.',
      '## Month-by-Month Study Plan (12-Month Strategy)',
      'Months 1–4: Complete NCERT syllabus for all three subjects. Make condensed notes chapter by chapter. Months 5–7: Start solving previous year papers (2015–2025) and identify weak areas. Months 8–10: Intensive revision of weak chapters, full-length mocks every week. Months 11–12: Mock test marathon (3 mocks/week), targeted revision of frequently-tested topics.',
      '## Common Mistakes to Avoid',
      'Starting with coaching modules before completing NCERT once. Neglecting NCERT diagrams (a significant source of NEET questions). Practising too many sources instead of mastering fewer. Not analysing mock test mistakes systematically.',
      '## Hodu Academy NEET Programme',
      'Our NEET batch covers the complete 2-year syllabus with 600+ hours of teaching, weekly diagnostic tests, and a 10,000-question practice bank. Our toppers have achieved AIR 142, 287, and 431 in NEET 2025. Call us to join the next batch.',
    ],
    related: ['jee-main-registration-2026', 'india-imo-2025', 'hardest-igcse-subjects'],
  },
  'ib-vs-igcse-which-is-better': {
    title: 'IB vs IGCSE: Which Is Better for Your Child?',
    date: '5 Sep 2025', category: 'IB', readTime: '6 min read', author: 'Hodu Academic Board',
    excerpt: 'Parents often struggle choosing between IB and IGCSE. We compare curriculum depth, global recognition, assessment style, and which suits different learner profiles.',
    content: [
      'Choosing between the International Baccalaureate (IB) and the Cambridge IGCSE is one of the most important decisions a family makes during secondary school. Both are globally recognised, rigorous curricula — but they differ in structure, assessment, and what type of learner thrives in each.',
      '## Curriculum Structure',
      'IGCSE (International General Certificate of Secondary Education) is taken in Years 10–11 (ages 14–16). Students choose 8–10 subjects independently. It is subject-focused and relatively flexible. The IB MYP (Middle Years Programme) covers ages 11–16, while the IB DP (Diploma Programme) is taken in Years 12–13. IB DP requires students to take 6 subject groups plus Theory of Knowledge, an Extended Essay, and CAS (Creativity, Activity, Service).',
      '## Assessment Style',
      'IGCSE is predominantly exam-based — most subjects are assessed through two or three terminal papers. Some subjects include coursework (practical assessments for Sciences, oral components for Languages). IB DP uses a mix of internal assessment (IA) and external exams. IAs are teacher-marked portfolios and investigations. This suits students who prefer continuous assessment over high-stakes exams.',
      '## Global University Recognition',
      'Both are globally recognised. Cambridge IGCSE is accepted by universities in 160+ countries. IB Diploma is particularly valued by UK, US, Canadian, and European universities, often attracting additional scholarship points. IB graduates applying to top-tier universities have a distinct edge as the diploma signals academic breadth.',
      '## Which Learner Profile Suits Each?',
      'IGCSE is ideal for students who excel under exam conditions, want to specialise early in strong subjects, or are preparing for Indian competitive exams alongside their board. IB is better for students who enjoy project-based learning, interdisciplinary thinking, and want strong preparation for Western university applications.',
      '## Hodu Academy IB & IGCSE Programmes',
      'We offer coaching for both IGCSE and IB at our Jaipur centre. Our IGCSE programme covers all core sciences, mathematics, and language subjects. Our IB programme includes subject-wise IA preparation, Extended Essay mentoring, and TOK support. Talk to our counsellors to decide which board fits your child best.',
    ],
    related: ['hardest-igcse-subjects', 'study-abroad-international-boards', 'jee-main-registration-2026'],
  },
  'cbse-class-12-toppers-tips': {
    title: '10 Study Habits of CBSE Class 12 Toppers You Should Steal',
    date: '15 Aug 2025', category: 'CBSE', readTime: '5 min read', author: 'Hodu Academic Board',
    excerpt: 'We interviewed students who scored 95%+ in CBSE Class 12. Here are the ten habits they swore by — from time-table design to revision techniques.',
    content: [
      'Every year, thousands of students score 95%+ in CBSE Class 12. What separates them from the rest? We interviewed 20 top scorers from our own batches and compiled the 10 habits that consistently appeared across their answers.',
      '## 1. NCERT First, Always',
      'Every single topper read NCERT textbooks end-to-end before touching any reference book. CBSE questions are framed directly from NCERT — diagrams, in-text questions, and examples. Students who skip NCERT for "better" books lose easy marks.',
      '## 2. Chapter-wise Notes from Day One',
      'Toppers made concise notes as they studied each chapter — not after. These notes were 1–2 pages per chapter, capturing formulas, key facts, and diagrams. This "active recall" during note-making is far more effective than passive re-reading.',
      '## 3. Solved 10 Years of Previous Papers',
      'Without exception, every topper completed at least 10 years of CBSE board papers under timed conditions. Papers are the most reliable guide to what examiners value and how to structure answers for full marks.',
      '## 4. Strictly Timed Practice',
      'Knowing the answer is different from writing it in time. Toppers practiced every paper with a timer — 3 hours, no extensions. They tracked which sections ran overtime and corrected it in the next attempt.',
      '## 5. Revision Cycles, Not One-Time Study',
      'The most common mistake: studying a chapter once and moving on. Toppers built a revision cycle — quick review every week, detailed revision monthly. By exam time, most chapters had been reviewed 4–5 times.',
      '## 6. Marking Scheme Analysis',
      'CBSE releases official marking schemes for previous years. Toppers studied these carefully to understand exactly what examiners award marks for — often different from what a student intuitively writes.',
      '## 7. Weak Subject First',
      'Every student has a weakest subject. Toppers allocated their freshest study hours (usually morning) to their weakest subject, not their strongest. Comfortable subjects were studied later in the day.',
      '## 8. Sleep and Exercise Without Compromise',
      'Not a single topper we interviewed slept fewer than 7 hours. Most exercised daily. They uniformly credited this for concentration and mental stamina — not heroic study hours.',
      '## 9. Doubt Resolution Within 24 Hours',
      'Unresolved doubts compound. Toppers had a strict rule: any doubt not cleared within 24 hours meant asking a teacher immediately — not pushing it to the weekend.',
      '## 10. Mock Test Marathons in the Last 60 Days',
      'In the 2 months before boards, toppers wrote one full mock every 3–4 days. Not for marks — for pattern recognition, time management, and confidence building.',
      '## Hodu Academy CBSE Coaching',
      'Our CBSE batches for Class 9–12 are built around exactly these habits — structured notes, weekly tests, past paper analysis, and personalised doubt sessions. Talk to our counsellors to join the next batch.',
    ],
    related: ['neet-2026-complete-guide', 'jee-main-registration-2026', 'hardest-igcse-subjects'],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: dbPost } = await supabase.from('cms_blogs').select('title, excerpt').eq('site_id', HODU_SITE_ID).eq('slug', slug).eq('published', true).single()
  const post = dbPost ?? posts[slug]
  if (!post) return { title: 'Blog — Hodu Academy' }
  return { title: `${post.title} — Hodu Academy`, description: post.excerpt }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: dbPost } = await supabase
    .from('cms_blogs')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  const hardcodedPost = posts[slug]

  if (!dbPost && !hardcodedPost) return notFound()

  const post = dbPost
    ? {
        title: dbPost.title,
        date: new Date(dbPost.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        category: dbPost.category,
        readTime: dbPost.read_time,
        author: dbPost.author || 'Hodu Academic Board',
        excerpt: dbPost.excerpt,
        htmlContent: dbPost.content as string,
      }
    : { ...hardcodedPost, htmlContent: null }

  let relatedPosts: Array<{ slug: string; title: string; category: string; readTime: string }> = []

  if (dbPost) {
    const { data: related } = await supabase
      .from('cms_blogs')
      .select('slug, title, category, read_time')
      .eq('site_id', HODU_SITE_ID)
      .eq('published', true)
      .neq('id', dbPost.id)
      .limit(3)
    relatedPosts = (related ?? []).map(r => ({ slug: r.slug, title: r.title, category: r.category, readTime: r.read_time }))
  } else if (hardcodedPost) {
    relatedPosts = hardcodedPost.related
      .map(s => posts[s] ? { slug: s, title: posts[s].title, category: posts[s].category, readTime: posts[s].readTime } : null)
      .filter(Boolean) as Array<{ slug: string; title: string; category: string; readTime: string }>
  }

  return (
    <div className="space-y-0 animate-fade-in bg-white">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <Link href="/" className="hover:text-brand-maroon transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-brand-maroon transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-brand-maroon font-bold line-clamp-1">{post.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-brand-maroon text-white py-16 sm:py-20 border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-bold transition-colors uppercase tracking-wider">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Articles
          </Link>
          <div>
            <span className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md mb-3 bg-white text-brand-maroon shadow-xs">
              {post.category}
            </span>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white mb-4">
              {post.title}
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-normal leading-relaxed mb-6 max-w-3xl">
              {post.excerpt}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-white/80 pt-2 border-t border-white/20">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{post.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
            <span>By {post.author}</span>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-10">

          {/* Article content */}
          <article className="lg:col-span-2 bg-white border-2 border-brand-border rounded-3xl p-8 sm:p-12 shadow-xs">
            {post.htmlContent ? (
              <div
                className="prose prose-sm sm:prose-base max-w-none text-neutral-700 leading-relaxed prose-headings:font-serif-editorial prose-headings:text-neutral-900 prose-headings:font-bold prose-a:text-brand-maroon"
                dangerouslySetInnerHTML={{ __html: post.htmlContent }}
              />
            ) : (
              <div className="prose prose-sm sm:prose-base max-w-none text-neutral-700 leading-relaxed space-y-6">
                {(post as typeof hardcodedPost).content.map((block, i) => {
                  if (block.startsWith('## ')) {
                    return (
                      <h2 key={i} className="font-serif-editorial text-2xl font-bold text-neutral-900 mt-10 mb-4 border-b border-brand-border pb-3">
                        {block.slice(3)}
                      </h2>
                    )
                  }
                  return <p key={i} className="text-sm sm:text-base leading-relaxed font-normal text-neutral-700">{block}</p>
                })}
              </div>
            )}

            {/* CTA block at end of article */}
            <div className="mt-12 bg-neutral-50 border-2 border-brand-border rounded-2xl p-8 text-center space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-maroon bg-white px-3 py-1 rounded-md inline-block border border-brand-border">
                TAILORED ROADMAP
              </span>
              <h3 className="font-serif-editorial text-2xl font-bold text-neutral-900">Ready to Elevate Your Exam Preparation?</h3>
              <p className="text-xs sm:text-sm text-neutral-600 font-normal max-w-md mx-auto">
                Speak directly with our academic heads to design a month-by-month study and testing plan.
              </p>
              <div className="pt-2">
                <Link href="/contact"
                  className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-crimson text-white font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs">
                  <span>Book Free Consultation</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white border-2 border-brand-border rounded-2xl p-6 sm:p-7 shadow-md sticky top-28">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-maroon bg-neutral-100 px-2.5 py-0.5 rounded-md inline-block mb-2 border border-brand-border">
                ACADEMIC ADVISORY
              </span>
              <h3 className="font-serif-editorial font-bold text-neutral-900 text-lg mb-1">Schedule Diagnostic</h3>
              <p className="text-xs text-neutral-500 mb-5 font-normal">Get a personalized syllabus evaluation.</p>
              <EnquiryForm />
            </div>

            {relatedPosts.length > 0 && (
              <div className="bg-white border-2 border-brand-border rounded-2xl p-6 shadow-xs">
                <h3 className="font-serif-editorial font-bold text-neutral-900 text-base mb-4">Related Insights</h3>
                <div className="space-y-3">
                  {relatedPosts.map(r => (
                    <Link key={r.slug} href={`/blog/${r.slug}`}
                      className="block p-3.5 rounded-xl border border-brand-border hover:border-brand-maroon transition-all group">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-maroon text-white">{r.category}</span>
                      <p className="text-xs font-bold text-neutral-900 group-hover:text-brand-maroon transition-colors mt-2 line-clamp-2 leading-snug">{r.title}</p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-1">{r.readTime}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

    </div>
  )
}
