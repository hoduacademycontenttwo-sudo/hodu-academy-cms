import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, Calendar, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID } from '@/lib/hodu'

export const metadata = {
  title: 'Academic Insights & Strategy Guides — Hodu Academy | IGCSE, IB, CBSE, JEE & NEET',
  description: 'Expert study techniques, syllabus breakdowns, exam strategies and guidance for Cambridge IGCSE, IB DP, CBSE, IIT-JEE and NEET-UG from Hodu Academy mentors.',
}

const fallbackPosts = [
  {
    slug: 'jee-main-registration-2026',
    date: '25 Oct 2025',
    category: 'JEE',
    title: 'JEE Main 2026 Blueprint: High-Yield Topics, Syllabus Updates & Target Percentiles',
    excerpt: 'A comprehensive strategic roadmap for JEE 2026 aspirants — focusing on physics mechanics weightage, organic reaction pathways, and test simulation techniques.',
    readTime: '5 min read',
  },
  {
    slug: 'india-imo-2025',
    date: '19 Jul 2025',
    category: 'Olympiad',
    title: 'How to Master Non-Routine Mathematics for IMO, PRMO and IOQM',
    excerpt: 'Dissecting proof strategies in Number Theory and Euclidean Geometry to transition from school mathematics to high-tier competitive Olympiad problem solving.',
    readTime: '4 min read',
  },
  {
    slug: 'hardest-igcse-subjects',
    date: '19 Dec 2024',
    category: 'IGCSE',
    title: 'The Top 10 High-Yield Strategies for Cambridge IGCSE Extended Mathematics & Sciences',
    excerpt: 'Detailed analysis of examiner mark schemes, past 15-year grade thresholds, and step-by-step techniques to secure straight A* grades.',
    readTime: '7 min read',
  },
  {
    slug: 'neet-2026-complete-guide',
    date: '10 Oct 2025',
    category: 'NEET',
    title: 'NEET-UG 2026 Preparation Framework: Line-by-Line NCERT Mastery & 700+ Score Blueprint',
    excerpt: 'How top percentile medical aspirants structure their Daily Practice Problems (DPPs), biology diagram speed drills, and mock test error analysis.',
    readTime: '8 min read',
  },
  {
    slug: 'ib-vs-igcse-which-is-better',
    date: '5 Sep 2025',
    category: 'IB',
    title: 'Navigating IB Diploma (DP) vs Cambridge A-Levels: An Academic Director’s Guide',
    excerpt: 'Comparing Internal Assessments (IA), Theory of Knowledge (TOK), and curriculum depth to choose the best international pathway for global university admissions.',
    readTime: '6 min read',
  },
  {
    slug: 'cbse-class-12-toppers-tips',
    date: '15 Aug 2025',
    category: 'CBSE',
    title: 'CBSE Board Masterclass: Answer Sheet Presentation Techniques That Maximize Marks',
    excerpt: 'Examiner insights into step-marking, formula derivation layout, and time allocation across Physics, Chemistry, and Mathematics papers.',
    readTime: '5 min read',
  },
]

const categoryColors: Record<string, string> = {
  JEE:      'bg-red-900 text-white',
  NEET:     'bg-emerald-900 text-white',
  IGCSE:    'bg-blue-900 text-white',
  IB:       'bg-purple-900 text-white',
  CBSE:     'bg-teal-900 text-white',
  Olympiad: 'bg-amber-900 text-white',
}

const categories = ['All', 'JEE', 'NEET', 'IGCSE', 'IB', 'CBSE', 'Olympiad']

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const sp = await searchParams
  const selected = sp.category ?? 'All'

  const supabase = await createClient()
  const { data: dbPosts } = await supabase
    .from('cms_blogs')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .eq('published', true)
    .order('created_at', { ascending: false })

  const posts = dbPosts && dbPosts.length > 0
    ? dbPosts.map(p => ({
        slug: p.slug,
        date: new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        category: p.category,
        title: p.title,
        excerpt: p.excerpt,
        readTime: p.read_time,
      }))
    : fallbackPosts

  const filteredPosts = selected === 'All'
    ? posts
    : posts.filter(p => p.category === selected)

  const featured = filteredPosts[0] ?? posts[0]
  const rest = filteredPosts.slice(selected === 'All' ? 1 : 0)

  return (
    <div className="space-y-0 animate-fade-in text-brand-navy">

      {/* Hero */}
      <section className="relative py-16 sm:py-20 bg-gradient-to-b from-brand-bg via-white to-brand-bg academic-grid-pattern border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-brand-maroon bg-brand-maroon/10 border border-brand-maroon/20 px-4 py-1.5 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            ACADEMIC INSIGHTS & EXAM STRATEGY
          </span>
          <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold tracking-tight text-brand-navy leading-tight">
            Strategic Guides, Analysis & Board Updates
          </h1>
          <p className="text-sm sm:text-base text-brand-navy/70 max-w-xl mx-auto font-light leading-relaxed">
            Written by senior board examiners and competitive faculty to help students prepare smarter and score higher.
          </p>
        </div>
      </section>

      <section className="py-14 sm:py-18 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category filter tabs */}
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-4 mb-10">
            {categories.map(cat => (
              <Link
                key={cat}
                href={cat === 'All' ? '/blog' : `/blog?category=${cat}`}
                className={`px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap shadow-xs
                  ${cat === selected
                    ? 'bg-brand-maroon text-white shadow-md'
                    : 'bg-white text-brand-navy/80 border border-brand-border hover:border-brand-maroon hover:text-brand-maroon'
                  }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Featured post */}
          {selected === 'All' && featured && (
            <div className="bg-brand-navy text-white rounded-3xl p-8 sm:p-12 mb-12 shadow-2xl border border-brand-border relative overflow-hidden dark-grid-pattern">
              <div className="max-w-3xl relative z-10 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-brand-maroon text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                    FEATURED ESSAY
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${categoryColors[featured.category] ?? 'bg-white/20 text-white'}`}>
                    {featured.category}
                  </span>
                  <span className="text-xs text-white/60 font-mono flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {featured.readTime}
                  </span>
                </div>
                <h2 className="font-serif-editorial text-2xl sm:text-4xl font-bold leading-tight text-white">
                  {featured.title}
                </h2>
                <p className="text-white/75 text-sm sm:text-base font-light leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="pt-2">
                  <Link href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-crimson text-white font-extrabold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg hover:-translate-y-0.5">
                    <span>Read Full Guide</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Posts grid */}
          {rest.length === 0 ? (
            <div className="text-center py-16 text-brand-navy/50 bg-white rounded-3xl border border-brand-border p-10">
              <p className="font-bold text-base mb-1">No articles found in this category</p>
              <p className="text-xs font-light">Check back soon for new analysis from our faculty.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {rest.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="group block bg-white border border-brand-border rounded-3xl p-6 sm:p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-xs flex flex-col justify-between">
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${categoryColors[post.category] ?? 'bg-brand-navy text-white'}`}>
                        {post.category}
                      </span>
                      <span className="text-[11px] text-brand-navy/50 font-mono">{post.readTime}</span>
                    </div>

                    <h3 className="font-serif-editorial font-bold text-brand-navy text-base leading-snug group-hover:text-brand-maroon transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-brand-navy/70 font-light line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-brand-navy/50 font-medium">{post.date}</span>
                    <span className="text-xs font-black text-brand-maroon uppercase tracking-wider group-hover:underline flex items-center gap-1">
                      Read Article <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  )
}
