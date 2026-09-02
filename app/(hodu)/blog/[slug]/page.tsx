import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar, ChevronRight, Home, ArrowRight, User } from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID } from '@/lib/hodu'
import { FALLBACK_BLOGS } from '@/lib/blogFallbacks'
import type { Metadata } from 'next'

const legacyIdToSlug: Record<string, string> = {
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

export async function generateStaticParams() {
  const slugs = Object.keys(FALLBACK_BLOGS)
  const legacyIds = Object.keys(legacyIdToSlug)
  return [
    ...slugs.map((slug) => ({ slug })),
    ...legacyIds.map((slug) => ({ slug })),
  ]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const targetSlug = legacyIdToSlug[slug] || slug

  try {
    const supabase = await createClient()
    const { data: dbPost } = await supabase
      .from('cms_blogs')
      .select('title, excerpt')
      .eq('site_id', HODU_SITE_ID)
      .eq('slug', targetSlug)
      .maybeSingle()

    if (dbPost) {
      return {
        title: `${dbPost.title} | Hodu Academy`,
        description: dbPost.excerpt || dbPost.title,
      }
    }
  } catch {}

  const fallback = FALLBACK_BLOGS[targetSlug]
  if (fallback) {
    return {
      title: `${fallback.title} | Hodu Academy`,
      description: fallback.excerpt || fallback.title,
    }
  }

  return { title: 'Site blog | Hodu Academy' }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  const slug = legacyIdToSlug[rawSlug] || rawSlug

  let dbPost: any = null
  let supabase: any = null

  try {
    supabase = await createClient()
    const { data } = await supabase
      .from('cms_blogs')
      .select('*')
      .eq('site_id', HODU_SITE_ID)
      .eq('slug', slug)
      .maybeSingle()

    dbPost = data

    // Fallback: If not found by slug, search by secondary_link or numeric ID
    if (!dbPost) {
      const { data: altPost } = await supabase
        .from('cms_blogs')
        .select('*')
        .eq('site_id', HODU_SITE_ID)
        .or(`secondary_link.ilike.%${rawSlug}%,secondary_link.ilike.%entryid=${rawSlug}%`)
        .maybeSingle()
      dbPost = altPost
    }
  } catch {}

  const fallback = FALLBACK_BLOGS[slug] || FALLBACK_BLOGS[legacyIdToSlug[rawSlug]]
  const activePost = dbPost || fallback

  if (!activePost) {
    return notFound()
  }

  let formattedDate = 'Recently'
  try {
    formattedDate = new Date(activePost.created_at || activePost.date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    formattedDate = activePost.date || 'Recently'
  }

  const post = {
    id: activePost.id,
    title: activePost.title,
    date: formattedDate,
    category: activePost.category || 'General',
    readTime: activePost.read_time || '5 min read',
    author: activePost.author || 'Abhishek Agarwal',
    excerpt: activePost.excerpt,
    cover_image: activePost.cover_image,
    htmlContent: (activePost.content || activePost.htmlContent) as string,
  }

  // Fetch recent/related posts for bottom section
  let recentPosts: any[] = []
  if (supabase) {
    try {
      const { data } = await supabase
        .from('cms_blogs')
        .select('slug, title, category, created_at, cover_image')
        .eq('site_id', HODU_SITE_ID)
        .eq('published', true)
        .neq('slug', slug)
        .order('created_at', { ascending: false })
        .limit(3)
      recentPosts = data || []
    } catch {}
  }

  if (recentPosts.length === 0) {
    recentPosts = Object.values(FALLBACK_BLOGS)
      .filter((b: any) => b.slug !== slug)
      .slice(0, 3)
      .map((b: any) => ({
        slug: b.slug,
        title: b.title,
        category: b.category,
        created_at: b.date,
        cover_image: b.cover_image,
      }))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header Banner */}
      <section className="bg-gradient-to-r from-[#7E0D0D] via-[#921E1F] to-[#7E0D0D] text-white py-12 sm:py-16 shadow-inner relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-semibold mb-4 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Blog entries
          </Link>
          <div className="max-w-4xl">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded bg-white text-[#7E0D0D] mb-3">
              {post.category}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-white/80 pt-2 border-t border-white/20">
              <span className="flex items-center gap-1.5">
                <User size={14} /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb Bar */}
      <div className="bg-[#FAF7F7] border-b border-[#F0E4E4] px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-2 text-xs text-neutral-600">
          <Link href="/" className="flex items-center gap-1 hover:text-[#7E0D0D] transition-colors font-medium">
            <Home size={13} className="text-neutral-500" />
            <span>Home</span>
          </Link>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="text-neutral-500">Hodu Academy</span>
          <ChevronRight size={12} className="text-neutral-400" />
          <Link href="/blog" className="hover:text-[#7E0D0D] transition-colors font-medium">
            Site blogs
          </Link>
          <ChevronRight size={12} className="text-neutral-400" />
          <span className="text-[#7E0D0D] font-semibold line-clamp-1 max-w-xs sm:max-w-md">
            {post.title}
          </span>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-12 items-start">
          
          {/* Article Main Column */}
          <article className="lg:col-span-2 space-y-8">
            {/* Featured Image if available */}
            {post.cover_image && (
              <div className="rounded-xl overflow-hidden bg-black border border-neutral-200 shadow-sm max-h-[460px] flex items-center justify-center">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-auto max-h-[460px] object-contain"
                />
              </div>
            )}

            {/* Author Meta Bar */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF7F7] border border-[#F0E4E4] text-xs text-neutral-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7E0D0D] text-white flex items-center justify-center font-bold text-sm">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-neutral-900 text-sm">{post.author}</p>
                  <p className="text-neutral-500 text-xs">Hodu Academy Senior Academic Mentor</p>
                </div>
              </div>
              <time className="text-neutral-500 font-medium">{post.date}</time>
            </div>

            {/* HTML Article Content */}
            <div
              className="prose prose-neutral prose-sm sm:prose-base max-w-none text-neutral-800 leading-relaxed 
                prose-headings:text-[#7E0D0D] prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                prose-a:text-[#7E0D0D] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#A02324]
                prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-neutral-200 prose-table:my-6
                prose-th:bg-[#FFF4EA] prose-th:text-[#7E0D0D] prose-th:p-3 prose-th:border prose-th:border-neutral-200 prose-th:text-left
                prose-td:p-3 prose-td:border prose-td:border-neutral-200
                prose-ul:list-disc prose-ul:pl-5 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: post.htmlContent || `<p>${post.excerpt}</p>` }}
            />

            {/* Bottom Return Button */}
            <div className="pt-8 border-t border-neutral-200 flex items-center justify-between">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#921E1F] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors shadow-xs"
              >
                <ArrowLeft size={14} />
                <span>View all blog entries</span>
              </Link>
              <Link
                href="/contact"
                className="text-xs font-semibold text-[#7E0D0D] hover:underline"
              >
                Have questions? Contact Academic Desk →
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Blog Menu Widget */}
            <div className="bg-white border border-[#F0E4E4] rounded-2xl p-6 shadow-2xs">
              <h3 className="text-base font-bold text-neutral-900 pb-3 border-b border-neutral-100 mb-3">
                Blog menu
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/blog" className="text-[#7E0D0D] font-bold hover:underline flex items-center gap-1.5">
                    <ChevronRight size={14} /> View all entries
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-neutral-600 hover:text-[#7E0D0D] transition-colors flex items-center gap-1.5">
                    <ChevronRight size={14} /> Explore All Courses
                  </Link>
                </li>
                <li>
                  <Link href="/offline" className="text-neutral-600 hover:text-[#7E0D0D] transition-colors flex items-center gap-1.5">
                    <ChevronRight size={14} /> Jaipur Offline Campus
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Consultation Widget */}
            <div className="bg-[#FFF8F8] border border-[#F0E4E4] rounded-2xl p-6 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E0D0D] bg-[#FDF5F5] px-2.5 py-1 rounded inline-block mb-2">
                EXAM PREPARATION
              </span>
              <h3 className="font-bold text-neutral-900 text-base mb-1">
                Book a Free Demo Class
              </h3>
              <p className="text-xs text-neutral-600 mb-5 leading-relaxed">
                Connect with our academic directors to map out a targeted scoring plan.
              </p>
              <EnquiryForm />
            </div>
          </aside>
        </div>

        {/* Recent Entries Grid */}
        {recentPosts && recentPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  Recent Blog Entries
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Catch up on latest updates and exam schedules
                </p>
              </div>
              <Link
                href="/blog"
                className="text-xs font-bold text-[#7E0D0D] hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPosts.map((r) => {
                let rDate = 'Recently'
                try {
                  rDate = new Date(r.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                } catch {}

                return (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group flex flex-col bg-white rounded-lg border border-neutral-200 hover:border-neutral-300 overflow-hidden shadow-2xs hover:shadow-sm transition-all"
                  >
                    <div className="aspect-[16/9] bg-black overflow-hidden">
                      {r.cover_image ? (
                        <img
                          src={r.cover_image}
                          alt={r.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#7E0D0D] text-white text-xs font-bold p-2 text-center">
                          {r.title}
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="text-[11px] text-neutral-500 mb-1 flex items-center justify-between">
                        <span>{rDate}</span>
                        <span className="text-[#7E0D0D] font-semibold">{r.category}</span>
                      </div>
                      <h4 className="font-bold text-sm text-neutral-900 group-hover:text-[#7E0D0D] transition-colors line-clamp-2">
                        {r.title}
                      </h4>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
