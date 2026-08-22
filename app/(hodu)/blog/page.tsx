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
  const remaining = filteredPosts.length > 1 ? filteredPosts.slice(1) : filteredPosts

  return (
    <div className="space-y-0 animate-fade-in bg-white">

      {/* Hero */}
      <section className="bg-brand-maroon text-white py-16 sm:py-20 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-white text-brand-maroon text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              ACADEMIC ESSAYS & EXAM DIRECTIVES
            </span>
            <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Academic Insights & Strategy Guides
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-normal leading-relaxed">
              Curriculum updates, examiner mark schemes, subject breakdowns, and preparation advice from the Hodu faculty.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="bg-white border-b border-brand-border sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2.5 overflow-x-auto py-3.5 scrollbar-hide">
          {categories.map(cat => {
            const isActive = selected === cat
            return (
              <Link
                key={cat}
                href={cat === 'All' ? '/blog' : `/blog?category=${cat}`}
                className={`shrink-0 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isActive
                    ? 'bg-brand-maroon text-white'
                    : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-brand-border'
                }`}
              >
                {cat === 'All' ? 'All Articles' : cat}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

        {/* Featured Article Card */}
        {featured && (
          <div className="bg-white border-2 border-brand-border rounded-3xl p-8 sm:p-12 shadow-xs hover:border-brand-maroon transition-all">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-maroon text-white text-[10px] font-black uppercase px-3 py-1 rounded-md shadow-xs">
                    {featured.category}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-brand-maroon" /> {featured.date}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-brand-maroon" /> {featured.readTime}
                  </span>
                </div>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight">
                  <Link href={`/blog/${featured.slug}`} className="hover:text-brand-maroon transition-colors">
                    {featured.title}
                  </Link>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="pt-2">
                  <Link href={`/blog/${featured.slug}`}
                    className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-crimson text-white font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs">
                    <span>Read Full Guide</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-4 bg-neutral-50 border border-brand-border rounded-2xl p-6 text-center space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-maroon bg-white px-2.5 py-1 rounded-md inline-block border border-brand-border">
                  FACULTY EDITORIAL
                </span>
                <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                  Reviewed and verified by the Hodu Academic Board for the 2026–27 examination cycle.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid of remaining posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remaining.map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`}
              className="bg-white border-2 border-brand-border rounded-2xl p-7 shadow-xs hover:shadow-md hover:border-brand-maroon transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-brand-maroon text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                    {p.category}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-mono">{p.readTime}</span>
                </div>
                <h3 className="font-serif-editorial font-bold text-neutral-900 text-lg mb-2 leading-snug group-hover:text-brand-maroon transition-colors">{p.title}</h3>
                <p className="text-xs text-neutral-600 font-normal leading-relaxed line-clamp-3 mb-4">{p.excerpt}</p>
              </div>
              <div className="pt-4 border-t border-brand-border flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-mono text-[11px]">{p.date}</span>
                <span className="text-brand-maroon font-bold flex items-center gap-1 uppercase tracking-wider text-[11px]">
                  Read Guide <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>

    </div>
  )
}
