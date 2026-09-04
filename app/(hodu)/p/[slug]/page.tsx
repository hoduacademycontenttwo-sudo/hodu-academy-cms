import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Home,
  ChevronRight,
  ArrowLeft,
  Phone,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import { sanitizeContentLinks } from '@/lib/linkSanitizer'
import type { Metadata } from 'next'

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

function getOfficialPortalInfo(category?: string | null, title?: string | null) {
  const text = `${category || ''} ${title || ''}`.toLowerCase()

  if (text.includes('igcse') || text.includes('a level') || text.includes('o level') || text.includes('cambridge')) {
    return {
      name: 'Cambridge International (CAIE)',
      url: 'https://www.cambridgeinternational.org',
      badge: 'Official Cambridge Board',
      note: 'Verified syllabus & curriculum standards',
    }
  }
  if (text.includes('ibdp') || text.includes('ib diploma') || text.includes('myp')) {
    return {
      name: 'International Baccalaureate (IBO)',
      url: 'https://www.ibo.org',
      badge: 'Official IB Portal',
      note: 'Official curriculum framework & guidelines',
    }
  }
  if (text.includes('ap exam') || text.includes('college board')) {
    return {
      name: 'College Board — AP Students',
      url: 'https://apstudents.collegeboard.org',
      badge: 'Official College Board',
      note: 'AP exam schedules & course updates',
    }
  }
  if (text.includes('jee main') || text.includes('jee-main')) {
    return {
      name: 'NTA JEE (Main) Portal',
      url: 'https://jeemain.nta.nic.in',
      badge: 'Official NTA Portal',
      note: 'Official answer keys, bulletins & scorecards',
    }
  }
  if (text.includes('jee advanced')) {
    return {
      name: 'IIT JEE (Advanced) Portal',
      url: 'https://jeeadv.ac.in',
      badge: 'Official IIT Portal',
      note: 'IIT admission criteria & question archives',
    }
  }
  if (text.includes('neet')) {
    return {
      name: 'NTA NEET (UG) Portal',
      url: 'https://exams.nta.ac.in/NEET',
      badge: 'Official NTA Medical Portal',
      note: 'Official NEET notices & eligibility criteria',
    }
  }
  if (text.includes('cuet')) {
    return {
      name: 'NTA CUET (UG) Portal',
      url: 'https://exams.nta.ac.in/CUET-UG',
      badge: 'Official NTA CUET Portal',
      note: 'Central universities common admission test',
    }
  }
  if (text.includes('cbse')) {
    return {
      name: 'CBSE Official Portal',
      url: 'https://www.cbse.gov.in',
      badge: 'Official CBSE Portal',
      note: 'Academic circulars, sample papers & blueprints',
    }
  }
  if (text.includes('icse') || text.includes('cisce')) {
    return {
      name: 'CISCE Official Portal',
      url: 'https://cisce.org',
      badge: 'Official CISCE Portal',
      note: 'ICSE & ISC official specimen papers',
    }
  }
  if (text.includes('ncert')) {
    return {
      name: 'NCERT Official Portal',
      url: 'https://ncert.nic.in',
      badge: 'Official NCERT Portal',
      note: 'Rationalized textbook editions & exemplar banks',
    }
  }
  if (text.includes('olympiad') || text.includes('nso') || text.includes('imo') || text.includes('ieo') || text.includes('igko')) {
    return {
      name: 'SOF Olympiad Portal',
      url: 'https://sofworld.org',
      badge: 'Official SOF Olympiad',
      note: 'Official cutoff marks, schedule & ranking criteria',
    }
  }

  return null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  if (!slug) return { title: 'Pages | Hodu Academy' }

  try {
    const supabase = await createClient()
    const { data: page } = await supabase
      .from('cms_pages')
      .select('title, meta_title, excerpt, meta_description')
      .eq('site_id', HODU_SITE_ID)
      .eq('slug', slug)
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

export default async function CustomPageViewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!slug) {
    notFound()
  }

  const supabase = await createClient()
  const { data: page } = await supabase
    .from('cms_pages')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .eq('slug', slug)
    .maybeSingle()

  if (!page) {
    notFound()
  }

  const safeContent = sanitizeContentLinks(page.content || '')
  const categoryHref = getCategoryHref(page.category)
  const officialPortal = getOfficialPortalInfo(page.category, page.title)

  return (
    <div className="min-h-screen bg-[#FDFBFB]">
      {/* Sleek Breadcrumbs & Authority Link Bar */}
      <div className="bg-[#FAF7F7] border-b border-[#F0E4E4] px-4 py-3 sticky top-[108px] z-20 backdrop-blur-xs bg-white/95">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3 text-xs">
          <div className="flex items-center flex-wrap gap-2 text-neutral-600">
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

          {/* Official Authority Badge in Breadcrumb Bar */}
          {officialPortal && (
            <a
              href={officialPortal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-all shadow-2xs"
              title={officialPortal.note}
            >
              <ShieldCheck size={12} className="text-emerald-600" />
              <span>{officialPortal.badge}</span>
              <ExternalLink size={11} className="text-emerald-600" />
            </a>
          )}
        </div>
      </div>

      {/* Spacious Full-Width Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <article className="w-full">
          <div
            className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed
              prose-headings:text-[#7A001F] prose-headings:font-bold prose-headings:tracking-tight
              prose-a:text-[#7A001F] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#921E1F]
              prose-table:w-full prose-table:border-collapse prose-table:border prose-table:border-neutral-200 prose-table:my-6
              prose-th:bg-[#FFF4EA] prose-th:text-[#7A001F] prose-th:p-3.5 prose-th:border prose-th:border-neutral-200 prose-th:text-left prose-th:font-bold
              prose-td:p-3.5 prose-td:border prose-td:border-neutral-200
              prose-ul:list-disc prose-ul:pl-5 prose-li:my-1.5 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: safeContent }}
          />
        </article>

        {/* Full-Width Bottom CTA & Academic Mentorship Section */}
        <section className="mt-16 pt-10 border-t border-[#F0E4E4]">
          <div className="bg-gradient-to-br from-[#7A001F] to-[#4D0013] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 text-white">
                  <Sparkles size={13} /> Free Academic Mentorship & Guidance
                </span>
                <h3 className="text-2xl sm:text-3xl font-black leading-tight text-white">
                  Need Personalized Help With Your Exam Prep?
                </h3>
                <p className="text-sm text-white/90 leading-relaxed max-w-xl">
                  Get structured 1-on-1 guidance, full syllabus planning, customized test papers, and doubt clearing from Hodu Academy&apos;s senior faculty.
                </p>
                <div className="flex items-center flex-wrap gap-4 pt-2">
                  <a
                    href={`tel:${HODU.phone}`}
                    className="inline-flex items-center gap-2 bg-white text-[#7A001F] hover:bg-neutral-100 font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-md"
                  >
                    <Phone size={16} /> Call {HODU.phone}
                  </a>
                  <Link
                    href="/enroll"
                    className="inline-flex items-center gap-2 border-2 border-white/40 hover:border-white text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all"
                  >
                    <span>Enroll in Live Batches</span>
                    <ArrowLeft size={16} className="rotate-180" />
                  </Link>
                </div>
              </div>

              {/* Direct Enquiry Box */}
              <div className="lg:col-span-5 bg-white text-neutral-800 rounded-2xl p-6 shadow-2xl">
                <h4 className="font-extrabold text-base text-[#7A001F] mb-1">
                  Book Free Counseling Session
                </h4>
                <p className="text-xs text-neutral-500 mb-4">
                  Our academic counselor will call you back within 30 minutes.
                </p>
                <EnquiryForm />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
