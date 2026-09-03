import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Home, ChevronRight, FileText, ArrowLeft, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID } from '@/lib/hodu'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import { sanitizeContentLinks } from '@/lib/linkSanitizer'
import type { Metadata } from 'next'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}): Promise<Metadata> {
  const { id } = await searchParams
  if (!id) return { title: 'Pages | Hodu Academy' }

  try {
    const supabase = await createClient()
    const { data: page } = await supabase
      .from('cms_pages')
      .select('title, meta_title, excerpt, meta_description')
      .eq('site_id', HODU_SITE_ID)
      .or(`secondary_link.ilike.%id=${id}%,secondary_link.ilike.%${id}%,slug.eq.${id}`)
      .maybeSingle()

    if (page) {
      return {
        title: page.meta_title || `${page.title} | Hodu Academy`,
        description: page.meta_description || page.excerpt || page.title,
      }
    }
  } catch {}

  return { title: 'Hodu Academy' }
}

export default async function LegacyPageViewPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams

  if (!id) {
    redirect('/')
  }

  const supabase = await createClient()

  // 1. Check cms_pages
  const { data: page } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .or(`secondary_link.ilike.%id=${id}%,secondary_link.ilike.%${id}%,slug.eq.${id}`)
    .maybeSingle()

  if (page) {
    const safeContent = sanitizeContentLinks(page.content || '')

    return (
      <div className="min-h-screen bg-white">
        {/* Header Banner */}
        <section className="bg-gradient-to-r from-[#7E0D0D] via-[#921E1F] to-[#7E0D0D] text-white py-10 sm:py-14 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-semibold mb-3 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <div className="max-w-4xl">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-white/20 text-white mb-2">
                {page.category || 'Study Resource & Article'}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                {page.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Breadcrumbs */}
        <div className="bg-[#FAF7F7] border-b border-[#F0E4E4] px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-2 text-xs text-neutral-600">
            <Link href="/" className="flex items-center gap-1 hover:text-[#7E0D0D] transition-colors font-medium">
              <Home size={13} className="text-neutral-500" />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} className="text-neutral-400" />
            <span className="text-neutral-500">{page.category || 'Learner\'s Hub'}</span>
            <ChevronRight size={12} className="text-neutral-400" />
            <span className="text-[#7E0D0D] font-semibold line-clamp-1 max-w-xs sm:max-w-md">
              {page.title}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-12 items-start">
            {/* Page Body */}
            <article className="lg:col-span-2">
              <div
                className="prose prose-neutral prose-sm sm:prose-base max-w-none text-neutral-800 leading-relaxed
                  prose-headings:text-[#7E0D0D] prose-headings:font-bold prose-headings:tracking-tight
                  prose-a:text-[#7E0D0D] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#A02324]
                  prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-neutral-200 prose-table:my-6
                  prose-th:bg-[#FFF4EA] prose-th:text-[#7E0D0D] prose-th:p-3 prose-th:border prose-th:border-neutral-200 prose-th:text-left
                  prose-td:p-3 prose-td:border prose-td:border-neutral-200
                  prose-ul:list-disc prose-ul:pl-5 prose-li:my-1 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />
            </article>

            {/* Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-24">
              <div className="bg-[#FAF7F7] border border-[#F0E4E4] rounded-2xl p-6 shadow-xs">
                <h3 className="text-base font-bold text-[#1B2A44] mb-1">
                  Need Expert Mentorship?
                </h3>
                <p className="text-xs text-neutral-500 mb-5">
                  Book a free personalized 1-on-1 counseling session with our expert academic mentors.
                </p>
                <EnquiryForm />
              </div>

              <div className="bg-[#7E0D0D] text-white rounded-2xl p-6 text-center shadow-md">
                <h4 className="font-bold text-sm mb-1">Direct Admission Helpline</h4>
                <p className="text-xs text-white/80 mb-4">Talk directly to academic advisors</p>
                <a
                  href="tel:+919257879555"
                  className="inline-flex items-center gap-2 bg-white text-[#7E0D0D] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors shadow-xs"
                >
                  <Phone size={14} /> Call +91-9257879555
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    )
  }

  // 2. Check cms_blogs in case legacy id points to a blog post
  const { data: blog } = await supabase
    .from('cms_blogs')
    .select('slug')
    .eq('site_id', HODU_SITE_ID)
    .or(`secondary_link.ilike.%id=${id}%,secondary_link.ilike.%entryid=${id}%`)
    .maybeSingle()

  if (blog?.slug) {
    redirect(`/blog/${blog.slug}`)
  }

  notFound()
}
