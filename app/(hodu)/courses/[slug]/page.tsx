import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import Link from 'next/link'
import { CheckCircle2, Clock, Calendar, Users, ArrowLeft, Phone, ChevronDown, GraduationCap, TrendingUp, MessageSquareQuote, ShieldCheck, ArrowRight } from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('cms_courses').select('title,description').eq('site_id', HODU_SITE_ID).eq('slug', slug).single()
  return {
    title: data ? `${data.title} — Hodu Academy` : 'Course — Hodu Academy',
    description: data?.description ?? '',
  }
}

const courseFaqs = [
  { q: 'When does the next cohort start?', a: 'We run small interactive batches throughout the academic session. Contact our admissions team for immediate placement into the upcoming batch schedule.' },
  { q: 'What is the teacher-student ratio?', a: 'Classroom and live online batches are capped at strictly 12 to 15 students to guarantee personalized doubt-resolution and mentor attention.' },
  { q: 'Are lectures and study sessions recorded?', a: 'Yes. All live lectures are recorded in high-definition and uploaded to the Hodu LMS portal within 2 hours with lifetime access during your enrolled term.' },
  { q: 'What study materials and DPPs are provided?', a: 'Comprehensive chapter theory booklets, Daily Practice Problems (DPPs), past 15-year board question banks, and simulated CBT test access are fully included.' },
  { q: 'How are 1-on-1 doubts handled?', a: 'Students have access to daily physical faculty doubt desks at our Jaipur center (4:00 PM – 7:30 PM) and a 24/7 digital doubt resolution portal.' },
]

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: raw } = await supabase
    .from('cms_courses')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .eq('slug', slug)
    .single()

  if (!raw) return notFound()

  const course = {
    ...raw,
    features_json: Array.isArray(raw.features_json) ? raw.features_json
      : typeof raw.features_json === 'string' && raw.features_json
        ? JSON.parse(raw.features_json)
        : ['600+ Hours of Teaching', 'Chapter-wise Tests & DPPs', 'Doubt Resolution Support', 'Study Material Included'],
  }

  const { data: related } = await supabase
    .from('cms_courses')
    .select('title, slug, category, class_level, fee')
    .eq('site_id', HODU_SITE_ID)
    .eq('category', course.category)
    .neq('slug', slug)
    .limit(3)

  return (
    <div className="space-y-0 animate-fade-in bg-white">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <Link href="/" className="hover:text-brand-maroon transition-colors">Home</Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-brand-maroon transition-colors">Courses</Link>
          <span>/</span>
          <span className="text-brand-maroon font-bold line-clamp-1">{course.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative text-white py-16 sm:py-20 bg-brand-maroon border-b border-brand-border">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-bold transition-colors uppercase tracking-wider">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Programs
          </Link>
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-white text-brand-maroon text-[10px] font-black uppercase px-3 py-1 rounded-md shadow-xs">
                {course.category}
              </span>
              {course.class_level && (
                <span className="bg-white/20 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-md">
                  {course.class_level}
                </span>
              )}
            </div>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
              {course.title}
            </h1>
            {course.description && (
              <p className="text-white/90 text-sm sm:text-base font-normal leading-relaxed max-w-2xl">
                {course.description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-white/90 pt-4 border-t border-white/20">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Admissions Open 2026–27</span>
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Morning & Evening Slots</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Max 12–15 Students/Batch</span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-10">

          {/* Left / Center content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Course Curriculum & Features */}
            <div className="bg-white border-2 border-brand-border rounded-2xl p-8 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-maroon bg-neutral-100 px-3 py-1 rounded-md inline-block mb-3 border border-brand-border">
                WHAT YOU WILL MASTER
              </span>
              <h2 className="font-serif-editorial text-2xl font-bold text-neutral-900 mb-4">Core Program Features</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {course.features_json.map((feat: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-3 bg-neutral-50 p-4 rounded-xl border border-brand-border">
                    <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-neutral-800 leading-snug">{feat}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Pillars of Course Delivery */}
            <div className="bg-white border-2 border-brand-border rounded-2xl p-8 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-maroon bg-neutral-100 px-3 py-1 rounded-md inline-block mb-3 border border-brand-border">
                DELIVERY PEDAGOGY
              </span>
              <h2 className="font-serif-editorial text-2xl font-bold text-neutral-900 mb-6">How This Program Is Taught</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-brand-border">
                  <div className="w-10 h-10 rounded-xl bg-brand-maroon text-white flex items-center justify-center shrink-0">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-editorial font-bold text-base text-neutral-900">1:12 Capped Batch Lectures</h3>
                    <p className="text-xs text-neutral-600 font-normal mt-1 leading-relaxed">Interactive board sessions ensuring every student participates and conceptual doubts are resolved on the spot.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-brand-border">
                  <div className="w-10 h-10 rounded-xl bg-brand-maroon text-white flex items-center justify-center shrink-0">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-editorial font-bold text-base text-neutral-900">Bi-Weekly Diagnostic Tests & CBT Labs</h3>
                    <p className="text-xs text-neutral-600 font-normal mt-1 leading-relaxed">Timed mock papers evaluated against official board mark schemes with detailed percentile metrics delivered to parents.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-brand-border">
                  <div className="w-10 h-10 rounded-xl bg-brand-maroon text-white flex items-center justify-center shrink-0">
                    <MessageSquareQuote className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif-editorial font-bold text-base text-neutral-900">Daily 1-on-1 Faculty Doubt Desks</h3>
                    <p className="text-xs text-neutral-600 font-normal mt-1 leading-relaxed">Dedicated faculty hours (4:00 PM – 7:30 PM) for line-by-line problem analysis and personal homework review.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white border-2 border-brand-border rounded-2xl p-8 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-maroon bg-neutral-100 px-3 py-1 rounded-md inline-block mb-3 border border-brand-border">
                QUESTIONS & ANSWERS
              </span>
              <h2 className="font-serif-editorial text-2xl font-bold text-neutral-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {courseFaqs.map((f, i) => (
                  <details key={i} className="group border border-brand-border rounded-xl overflow-hidden hover:border-brand-maroon transition-all">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-neutral-50 hover:bg-neutral-100 transition-colors">
                      <span className="font-bold text-neutral-900 text-xs sm:text-sm">{f.q}</span>
                      <ChevronDown className="h-4 w-4 text-brand-maroon shrink-0 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-5 py-4 text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed bg-white border-t border-brand-border">{f.a}</div>
                  </details>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="space-y-6">

            {/* Enrollment & Fee Box */}
            <div className="bg-white border-2 border-brand-border rounded-2xl p-6 sm:p-7 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-maroon bg-neutral-100 px-2.5 py-0.5 rounded-md inline-block mb-2 border border-brand-border">
                ACADEMIC INVESTMENT
              </span>
              <div className="my-3">
                <span className="text-3xl font-black text-brand-maroon block">
                  {course.fee ? `₹${course.fee}` : 'Fee On Request'}
                </span>
                <span className="text-xs text-neutral-500 font-normal">Includes complete DPP pack & testing series</span>
              </div>
              <div className="pt-3 border-t border-brand-border space-y-3">
                <Link href="/enroll"
                  className="w-full bg-brand-maroon hover:bg-brand-crimson text-white font-bold py-3.5 rounded-xl text-center block text-xs uppercase tracking-wider transition-all shadow-sm">
                  Enroll in This Batch
                </Link>
                <a href={`tel:${HODU.phone}`}
                  className="w-full bg-white hover:bg-neutral-50 text-brand-maroon border-2 border-brand-maroon font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all">
                  <Phone className="h-4 w-4 text-brand-maroon" />
                  <span>Call: {HODU.phone}</span>
                </a>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="bg-white border-2 border-brand-border rounded-2xl p-6 sm:p-7 shadow-xs">
              <h3 className="font-serif-editorial font-bold text-neutral-900 text-lg mb-1">Book Diagnostic Class</h3>
              <p className="text-xs text-neutral-500 mb-5 font-normal">Attend a free evaluation session for this program.</p>
              <EnquiryForm />
            </div>

            {/* Related Courses */}
            {related && related.length > 0 && (
              <div className="bg-white border-2 border-brand-border rounded-2xl p-6 shadow-xs">
                <h3 className="font-serif-editorial font-bold text-neutral-900 text-base mb-4">Other {course.category} Tracks</h3>
                <div className="space-y-3">
                  {related.map(r => (
                    <Link key={r.slug} href={`/courses/${r.slug}`}
                      className="block p-3.5 rounded-xl border border-brand-border hover:border-brand-maroon transition-all group">
                      <p className="text-xs font-bold text-neutral-900 group-hover:text-brand-maroon transition-colors">{r.title}</p>
                      <p className="text-[11px] text-brand-maroon font-black mt-1">{r.fee ? `₹${r.fee}` : 'Fee on Request'}</p>
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
