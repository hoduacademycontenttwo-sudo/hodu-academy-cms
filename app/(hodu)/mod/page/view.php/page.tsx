import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  Home,
  ChevronRight,
  ArrowLeft,
  Phone,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  Sparkles,
  Download,
  Share2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import { sanitizeContentLinks } from '@/lib/linkSanitizer'
import type { Metadata } from 'next'

// Map categories to real clickable internal portal landing links
function getCategoryHref(category?: string | null): string {
  if (!category) return '/'
  const c = category.toLowerCase()
  if (c.includes('international') || c.includes('igcse') || c.includes('ibdp') || c.includes('a level')) {
    return '/mod/page/view.php?id=677'
  }
  if (c.includes('competitive') || c.includes('jee') || c.includes('neet') || c.includes('cuet')) {
    return '/mod/page/view.php?id=678'
  }
  if (c.includes('board exam') || c.includes('cbse') || c.includes('icse')) {
    return '/mod/page/view.php?id=733'
  }
  if (c.includes('olympiad')) {
    return '/mod/page/view.php?id=715'
  }
  if (c.includes('ncert')) {
    return '/mod/page/view.php?id=720'
  }
  if (c.includes('formula')) {
    return '/mod/page/view.php?id=721'
  }
  if (c.includes('concept')) {
    return '/mod/page/view.php?id=719'
  }
  if (c.includes('book solution') || c.includes('rd sharma') || c.includes('hc verma')) {
    return '/mod/page/view.php?id=722'
  }
  if (c.includes('sample paper') || c.includes('practice paper')) {
    return '/mod/page/view.php?id=864'
  }
  if (c.includes('complete guide')) {
    return '/courses'
  }
  return '/courses'
}

// Get official exam/board external portal details
function getOfficialPortalInfo(category?: string | null, title?: string | null) {
  const text = `${category || ''} ${title || ''}`.toLowerCase()

  if (text.includes('igcse') || text.includes('a level') || text.includes('o level') || text.includes('cambridge')) {
    return {
      name: 'Cambridge Assessment International Education (CAIE)',
      url: 'https://www.cambridgeinternational.org',
      badge: 'Official Cambridge Board',
      note: 'Verified syllabus & curriculum standards',
    }
  }
  if (text.includes('ibdp') || text.includes('ib diploma') || text.includes('myp')) {
    return {
      name: 'International Baccalaureate Organization (IBO)',
      url: 'https://www.ibo.org',
      badge: 'Official IB Portal',
      note: 'Official curriculum framework & guidelines',
    }
  }
  if (text.includes('ap exam') || text.includes('college board')) {
    return {
      name: 'College Board — Advanced Placement (AP)',
      url: 'https://apstudents.collegeboard.org',
      badge: 'Official College Board',
      note: 'AP exam schedules & course updates',
    }
  }
  if (text.includes('jee main') || text.includes('jee-main')) {
    return {
      name: 'National Testing Agency — NTA JEE (Main)',
      url: 'https://jeemain.nta.nic.in',
      badge: 'Official NTA Portal',
      note: 'Official answer keys, bulletins & scorecards',
    }
  }
  if (text.includes('jee advanced')) {
    return {
      name: 'IIT JEE (Advanced) Official Portal',
      url: 'https://jeeadv.ac.in',
      badge: 'Official IIT Portal',
      note: 'IIT admission criteria & question archives',
    }
  }
  if (text.includes('neet')) {
    return {
      name: 'National Testing Agency — NTA NEET (UG)',
      url: 'https://exams.nta.ac.in/NEET',
      badge: 'Official NTA Medical Portal',
      note: 'Official NEET notices & eligibility criteria',
    }
  }
  if (text.includes('cuet')) {
    return {
      name: 'National Testing Agency — NTA CUET (UG)',
      url: 'https://exams.nta.ac.in/CUET-UG',
      badge: 'Official NTA CUET Portal',
      note: 'Central universities common admission test',
    }
  }
  if (text.includes('cbse')) {
    return {
      name: 'Central Board of Secondary Education (CBSE)',
      url: 'https://www.cbse.gov.in',
      badge: 'Official CBSE Portal',
      note: 'Academic circulars, sample papers & blueprints',
    }
  }
  if (text.includes('icse') || text.includes('cisce')) {
    return {
      name: 'Council for the Indian School Certificate (CISCE)',
      url: 'https://cisce.org',
      badge: 'Official CISCE Portal',
      note: 'ICSE & ISC official specimen papers',
    }
  }
  if (text.includes('ncert')) {
    return {
      name: 'NCERT Official Textbook & Publication Portal',
      url: 'https://ncert.nic.in',
      badge: 'Official NCERT Portal',
      note: 'Rationalized textbook editions & exemplar banks',
    }
  }
  if (text.includes('olympiad') || text.includes('nso') || text.includes('imo') || text.includes('ieo') || text.includes('igko')) {
    return {
      name: 'Science Olympiad Foundation (SOF)',
      url: 'https://sofworld.org',
      badge: 'Official SOF Olympiad',
      note: 'Official cutoff marks, schedule & ranking criteria',
    }
  }

  return {
    name: 'Hodu Academy Academic Repository',
    url: 'https://hoduacademy.com',
    badge: 'Verified Academic Resource',
    note: 'Curated by subject matter experts & top rankers',
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}): Promise<Metadata> {
  const { id } = await searchParams
  if (!id) return { title: 'Study Resources & Guides | Hodu Academy' }

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
    const categoryHref = getCategoryHref(page.category)
    const officialPortal = getOfficialPortalInfo(page.category, page.title)

    return (
      <div className="min-h-screen bg-[#FDFBFB]">
        {/* Header Hero Banner */}
        <section className="bg-gradient-to-r from-[#7A001F] via-[#921E1F] to-[#7A001F] text-white py-10 sm:py-14 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-semibold mb-4 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-4xl space-y-2">
                <div className="flex items-center flex-wrap gap-2">
                  <Link
                    href={categoryHref}
                    className="inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    {page.category || "Learner's Hub"}
                  </Link>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                    <ShieldCheck size={12} /> {officialPortal.badge}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                  {page.title}
                </h1>
              </div>

              {/* Official External Portal Link Card in Hero */}
              {officialPortal.url !== 'https://hoduacademy.com' && (
                <div className="shrink-0 bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-4 lg:p-5 max-w-sm">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block mb-1">
                    Official Exam Authority
                  </span>
                  <p className="text-xs text-white/90 font-semibold mb-2.5">
                    {officialPortal.name}
                  </p>
                  <a
                    href={officialPortal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white text-[#7A001F] hover:bg-neutral-100 font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Clickable Breadcrumbs Bar */}
        <div className="bg-[#FAF7F7] border-b border-[#F0E4E4] px-4 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-2 text-xs text-neutral-600">
            <Link href="/" className="flex items-center gap-1 hover:text-[#7A001F] transition-colors font-medium">
              <Home size={13} className="text-neutral-500" />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} className="text-neutral-400" />
            <Link
              href={categoryHref}
              className="hover:text-[#7A001F] hover:underline font-semibold text-neutral-700 transition-colors"
            >
              {page.category || "Learner's Hub"}
            </Link>
            <ChevronRight size={12} className="text-neutral-400" />
            <span className="text-[#7A001F] font-bold line-clamp-1 max-w-xs sm:max-w-md">
              {page.title}
            </span>
          </div>
        </div>

        {/* Main Content Area - Generous Full-Width Grid with Responsive Table Wrappers */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid xl:grid-cols-4 gap-8 lg:gap-10 items-start">
            
            {/* Page Body: 3 Columns on Desktop for Maximum Table & Card Width */}
            <article className="xl:col-span-3 bg-white border border-[#F0E4E4] rounded-3xl p-6 sm:p-10 shadow-xs">
              <div
                className="prose prose-neutral prose-sm sm:prose-base max-w-none text-neutral-800 leading-relaxed
                  prose-headings:text-[#7A001F] prose-headings:font-bold prose-headings:tracking-tight
                  prose-a:text-[#7A001F] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#921E1F]
                  prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-neutral-200 prose-table:my-6
                  prose-th:bg-[#FFF4EA] prose-th:text-[#7A001F] prose-th:p-3.5 prose-th:border prose-th:border-neutral-200 prose-th:text-left prose-th:font-bold
                  prose-td:p-3.5 prose-td:border prose-td:border-neutral-200
                  prose-ul:list-disc prose-ul:pl-5 prose-li:my-1.5 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: safeContent }}
              />
            </article>

            {/* Sidebar: Sticky on Desktop */}
            <aside className="space-y-6 xl:sticky xl:top-24">
              {/* Official Authority Card */}
              {officialPortal.url !== 'https://hoduacademy.com' && (
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck size={16} /> Official Source
                  </div>
                  <h4 className="font-extrabold text-sm text-[#111827] mb-1">
                    {officialPortal.name}
                  </h4>
                  <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                    {officialPortal.note}
                  </p>
                  <a
                    href={officialPortal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-[#FAF7F7] hover:bg-[#F3E8E8] text-[#7A001F] border border-[#F0E4E4] font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
                  >
                    <span>Visit Authority Website</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}

              {/* 1-on-1 Counseling Card */}
              <div className="bg-[#FAF7F7] border border-[#F0E4E4] rounded-2xl p-6 shadow-xs">
                <div className="flex items-center gap-2 text-[#7A001F] font-extrabold text-xs uppercase tracking-wider mb-2">
                  <Sparkles size={15} /> Free Academic Guidance
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-1">
                  Need Expert Mentorship?
                </h3>
                <p className="text-xs text-neutral-600 mb-5 leading-relaxed">
                  Book a 1-on-1 session with our senior faculty for syllabus planning, test strategies & study material.
                </p>
                <EnquiryForm />
              </div>

              {/* Direct Helpline */}
              <div className="bg-[#7A001F] text-white rounded-2xl p-6 text-center shadow-md">
                <h4 className="font-extrabold text-sm mb-1">Direct Admission Helpline</h4>
                <p className="text-xs text-white/80 mb-4">Talk directly to academic advisors</p>
                <a
                  href={`tel:${HODU.phone}`}
                  className="inline-flex items-center gap-2 bg-white text-[#7A001F] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-neutral-100 transition-colors shadow-xs"
                >
                  <Phone size={14} /> Call {HODU.phone}
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
