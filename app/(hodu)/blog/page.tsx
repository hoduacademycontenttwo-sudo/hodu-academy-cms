import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Blog — Hodu Academy',
  description: 'Latest news, tips and updates on IGCSE, IB, JEE, NEET, CBSE and Olympiad preparation from Hodu Academy.',
}

const posts = [
  {
    slug: 'jee-main-registration-2026',
    date: '25 Oct 2025',
    category: 'JEE',
    title: 'JEE Main Registration 2026 Live: Dates, Exam Pattern & How to Apply',
    excerpt: 'NTA has officially opened the JEE Main 2026 registration window. Here\'s everything you need to know — key dates, eligibility, exam pattern and step-by-step application guide.',
    readTime: '5 min read',
  },
  {
    slug: 'india-imo-2025',
    date: '19 Jul 2025',
    category: 'Olympiad',
    title: 'India Ranks 7th at IMO 2025: Wins 3 Golds at International Mathematical Olympiad',
    excerpt: 'India\'s team of six students brought home 3 gold medals and 3 silver medals at the 66th International Mathematical Olympiad held in Sydney, Australia.',
    readTime: '4 min read',
  },
  {
    slug: 'hardest-igcse-subjects',
    date: '19 Dec 2024',
    category: 'IGCSE',
    title: 'The 10 Hardest Subjects in IGCSE: What You Need to Know',
    excerpt: 'Choosing your IGCSE subjects? We break down the most challenging papers, what makes them tough, and how to prepare strategically to score an A*.',
    readTime: '7 min read',
  },
  {
    slug: 'neet-2026-complete-guide',
    date: '10 Oct 2025',
    category: 'NEET',
    title: 'NEET 2026 Complete Guide: Syllabus, Pattern & Best Preparation Strategy',
    excerpt: 'Everything NEET 2026 aspirants need — official syllabus updates, paper pattern breakdown, subject-wise weightage, and a month-by-month study plan.',
    readTime: '8 min read',
  },
  {
    slug: 'ib-vs-igcse-which-is-better',
    date: '5 Sep 2025',
    category: 'IB',
    title: 'IB vs IGCSE: Which Is Better for Your Child?',
    excerpt: 'Parents often struggle choosing between IB and IGCSE. We compare curriculum depth, global recognition, assessment style, and which suits different learner profiles.',
    readTime: '6 min read',
  },
  {
    slug: 'cbse-class-12-toppers-tips',
    date: '15 Aug 2025',
    category: 'CBSE',
    title: '10 Study Habits of CBSE Class 12 Toppers You Should Steal',
    excerpt: 'We interviewed students who scored 95%+ in CBSE Class 12. Here are the ten habits they swore by — from time-table design to revision techniques.',
    readTime: '5 min read',
  },
  {
    slug: 'olympiad-preparation-guide',
    date: '22 Jul 2025',
    category: 'Olympiad',
    title: 'How to Prepare for Science Olympiads (NSO, IMO, IEO) in Class 6–10',
    excerpt: 'A structured roadmap for students targeting National Science Olympiad, International Mathematics Olympiad, and International English Olympiad.',
    readTime: '6 min read',
  },
  {
    slug: 'jee-advanced-2025-analysis',
    date: '2 Jun 2025',
    category: 'JEE',
    title: 'JEE Advanced 2025 Paper Analysis: Difficulty Level, Surprises & Cut-offs',
    excerpt: 'Our faculty team dissects the JEE Advanced 2025 papers — topic-wise difficulty, surprise questions, expected cut-offs and what it means for 2026 aspirants.',
    readTime: '9 min read',
  },
  {
    slug: 'igcse-maths-tips',
    date: '14 Apr 2025',
    category: 'IGCSE',
    title: 'IGCSE Mathematics: 7 Proven Techniques to Score A* Every Time',
    excerpt: 'IGCSE Maths is one of the most scoring subjects if you know the tricks. Our top IGCSE tutor shares the exact techniques that have helped 100+ students hit A*.',
    readTime: '6 min read',
  },
  {
    slug: 'study-abroad-international-boards',
    date: '1 Mar 2025',
    category: 'IB',
    title: 'Study Abroad After School: How IGCSE & IB Open Global University Doors',
    excerpt: 'Universities in the UK, US, Canada, and Australia actively prefer IGCSE and IB graduates. Here\'s why — and how to leverage your international board results.',
    readTime: '7 min read',
  },
]

const categoryColors: Record<string, string> = {
  JEE:      'bg-red-100 text-red-700',
  NEET:     'bg-green-100 text-green-700',
  IGCSE:    'bg-blue-100 text-blue-700',
  IB:       'bg-purple-100 text-purple-700',
  CBSE:     'bg-yellow-100 text-yellow-700',
  Olympiad: 'bg-orange-100 text-orange-700',
}

const categories = ['All', 'JEE', 'NEET', 'IGCSE', 'IB', 'CBSE', 'Olympiad']

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const sp = await searchParams
  const selected = sp.category ?? 'All'

  const filteredPosts = selected === 'All'
    ? posts
    : posts.filter(p => p.category === selected)

  const featured = filteredPosts[0] ?? posts[0]
  const rest = filteredPosts.slice(selected === 'All' ? 1 : 0)

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FDF5F5] to-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7E0D0D] bg-[#FDF5F5] border border-[#F3DCDC] px-3 py-1 rounded-full">Hodu Blog</span>
          <h1 className="text-4xl font-black text-[#1B2A44] mt-4 mb-3">Insights, Tips & Exam Updates</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Stay ahead with expert articles on IGCSE, IB, JEE, NEET, CBSE and Olympiad preparation.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* Category filter — now working links */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-10">
            {categories.map(cat => (
              <Link
                key={cat}
                href={cat === 'All' ? '/blog' : `/blog?category=${cat}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border
                  ${cat === selected
                    ? 'bg-[#7E0D0D] text-white border-[#7E0D0D]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#7E0D0D] hover:text-[#7E0D0D]'
                  }`}
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Featured post — shown only on "All" view */}
          {selected === 'All' && (
            <div className="bg-gradient-to-br from-[#1B2A44] to-[#0f1e33] text-white rounded-3xl p-8 lg:p-10 mb-10">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#7E0D0D] text-white text-xs font-bold px-3 py-1 rounded-full">Featured</span>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryColors[featured.category]}`}>{featured.category}</span>
                  <span className="text-xs text-gray-400">{featured.date} · {featured.readTime}</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-black mb-3 leading-tight">{featured.title}</h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                <Link href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-1 bg-white text-[#1B2A44] font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-100 transition-colors">
                  Read Article <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )}

          {/* Posts grid */}
          {rest.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No posts in this category yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`}
                  className="group block bg-[#FDF5F5] border border-[#F3DCDC] rounded-2xl p-5 hover:border-[#7E0D0D]/40 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">{post.readTime}</span>
                  </div>
                  <h3 className="font-bold text-[#1B2A44] text-sm leading-snug mb-2 group-hover:text-[#7E0D0D] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className="text-xs font-bold text-[#7E0D0D]">Read more →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
