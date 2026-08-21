import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import Link from 'next/link'
import { CheckCircle2, Clock, Calendar, Users, ArrowLeft, Phone, ChevronDown, GraduationCap, TrendingUp, MessageSquareQuote, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react'
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

const categoryAccents: Record<string, string> = {
  'IGCSE': 'bg-blue-900',
  'Cambridge O Level': 'bg-indigo-900',
  'IB': 'bg-purple-900',
  'CBSE': 'bg-emerald-900',
  'Competitive Exams': 'bg-brand-maroon',
  'Olympiads': 'bg-amber-900',
}

const categoryBgImages: Record<string, string> = {
  'IGCSE': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1400&h=600&fit=crop&auto=format',
  'Cambridge O Level': 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1400&h=600&fit=crop&auto=format',
  'IB': 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=1400&h=600&fit=crop&auto=format',
  'CBSE': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400&h=600&fit=crop&auto=format',
  'Competitive Exams': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1400&h=600&fit=crop&auto=format',
  'Olympiads': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&h=600&fit=crop&auto=format',
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

  const accentClass = categoryAccents[course.category] ?? 'bg-brand-maroon'
  const heroBgImage = course.image_url || categoryBgImages[course.category] || ''

  const { data: related } = await supabase
    .from('cms_courses')
    .select('title, slug, category, class_level, fee')
    .eq('site_id', HODU_SITE_ID)
    .eq('category', course.category)
    .neq('slug', slug)
    .limit(3)

  return (
    <div className="space-y-0 animate-fade-in text-brand-navy">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-brand-navy/60 font-medium">
          <Link href="/" className="hover:text-brand-maroon transition-colors">Home</Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-brand-maroon transition-colors">Courses</Link>
          <span>/</span>
          <span className="text-brand-navy font-bold line-clamp-1">{course.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative text-white py-16 sm:py-20 overflow-hidden bg-brand-navy dark-grid-pattern">
        {heroBgImage && (
          <img
            src={heroBgImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/60" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-white/70 hover:text-brand-gold text-xs font-bold mb-6 transition-colors uppercase tracking-wider">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Programs
          </Link>
          
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            <div className="lg:col-span-2 space-y-5">
              <span className={`inline-block ${accentClass} text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-white/20 shadow`}>
                {course.category}
              </span>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">{course.title}</h1>
              {course.description && (
                <p className="text-white/80 text-sm sm:text-base font-light leading-relaxed max-w-2xl">{course.description}</p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap gap-4 pt-3">
                {[
                  { icon: Clock,    label: course.duration ?? '1 Academic Year', caption: 'Program Duration' },
                  { icon: Users,    label: course.mode ?? 'Classroom + Hybrid', caption: 'Delivery Mode' },
                  { icon: Calendar, label: course.phase_start ?? 'Active Enrolment', caption: 'Admissions' },
                ].map(({ icon: Icon, label, caption }) => (
                  <div key={caption} className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-xs">
                    <Icon className="h-5 w-5 text-brand-gold" />
                    <div>
                      <p className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">{caption}</p>
                      <p className="text-xs font-bold text-white">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Price & Action Card */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl p-7 shadow-2xl border border-brand-border text-brand-navy">
                {course.image_url && (
                  <img src={course.image_url} alt={course.title} className="w-full h-40 object-cover rounded-2xl mb-5 shadow-sm" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/50 block">Session Fee</span>
                <p className="text-3xl font-black text-brand-navy mt-1 font-display-modern">
                  {course.fee ? `₹${course.fee}` : 'On Request'}
                </p>
                {course.fee && <p className="text-[10px] text-brand-navy/50 mt-0.5">Includes study material, DPPs & test series</p>}
                
                <div className="space-y-3 mt-6">
                  <Link href="/enroll"
                    className="block w-full bg-brand-maroon hover:bg-brand-crimson text-white font-extrabold py-3.5 rounded-xl text-center text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg">
                    Reserve Seat in Cohort
                  </Link>
                  <Link href="/contact"
                    className="block w-full border border-brand-border text-brand-navy hover:bg-brand-bg font-bold py-3.5 rounded-xl text-center text-xs uppercase tracking-wider transition-colors">
                    Book Diagnostic Test
                  </Link>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-navy/60">
                  <span className="font-semibold">Direct Helpline:</span>
                  <a href={`tel:${HODU.phone}`} className="text-brand-maroon font-bold hover:underline">{HODU.phone}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-brand-bg py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-10">

          {/* Left: Course details */}
          <div className="lg:col-span-2 space-y-10">

            {/* What's included */}
            {course.features_json.length > 0 && (
              <div className="bg-white border border-brand-border rounded-3xl p-8 shadow-xs">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-maroon bg-brand-maroon/10 px-3 py-1 rounded-full inline-block mb-3 border border-brand-maroon/20">
                  CURRICULUM HIGHLIGHTS
                </span>
                <h2 className="font-serif-editorial text-2xl font-bold text-brand-navy mb-6">What's Included in This Program</h2>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {course.features_json.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 bg-brand-bg/50 p-3.5 rounded-2xl border border-brand-border/60">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-brand-navy/85 leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Why choose */}
            <div className="bg-brand-navy text-white rounded-3xl p-8 sm:p-10 shadow-xl dark-grid-pattern relative">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold bg-white/10 px-3 py-1 rounded-full inline-block mb-3 border border-white/15">
                INSTITUTIONAL ASSURANCE
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-white mb-6">Why Prepare With Hodu Academy?</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {[
                  { icon: GraduationCap, title: 'Master Mentors',    desc: 'MNIT/IIIT qualified faculty with 15+ years board experience' },
                  { icon: TrendingUp,    title: 'Weekly Diagnostic', desc: 'Percentile-benchmarked timed CBT simulation tests' },
                  { icon: MessageSquareQuote, title: '1-on-1 Doubt Desks', desc: 'Daily dedicated physical & digital doubt clearing' },
                ].map(item => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="bg-white/5 border border-white/15 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                      <Icon className="h-6 w-6 text-brand-gold mb-3" />
                      <h3 className="font-bold text-sm text-white mb-1.5">{item.title}</h3>
                      <p className="text-xs text-white/70 font-light leading-relaxed">{item.desc}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white border border-brand-border rounded-3xl p-8 shadow-xs">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-maroon bg-brand-maroon/10 px-3 py-1 rounded-full inline-block mb-3 border border-brand-maroon/20">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="font-serif-editorial text-2xl font-bold text-brand-navy mb-6">Program & Batch FAQs</h2>
              <div className="space-y-3">
                {courseFaqs.map((faq, i) => (
                  <details key={i} className="group border border-brand-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-brand-maroon/40 shadow-xs">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-brand-bg/60 hover:bg-brand-bg transition-colors">
                      <span className="font-bold text-brand-navy text-sm pr-4">{faq.q}</span>
                      <ChevronDown className="h-4 w-4 text-brand-maroon shrink-0 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <div className="px-5 py-4 text-xs sm:text-sm text-brand-navy/75 font-light leading-relaxed bg-white border-t border-brand-border/40">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            
            {/* Mobile price card */}
            <div className="lg:hidden bg-white border border-brand-border rounded-3xl p-6 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-navy/50 block">Session Fee</span>
              <p className="text-3xl font-black text-brand-navy mt-1 font-display-modern">
                {course.fee ? `₹${course.fee}` : 'On Request'}
              </p>
              <div className="flex gap-2.5 mt-4">
                <Link href="/enroll"
                  className="flex-1 bg-brand-maroon hover:bg-brand-crimson text-white font-extrabold py-3 rounded-xl text-center text-xs uppercase tracking-wider transition-colors shadow">
                  Enroll Now
                </Link>
                <Link href="/contact"
                  className="flex-1 border border-brand-border text-brand-navy hover:bg-brand-bg font-bold py-3 rounded-xl text-center text-xs uppercase tracking-wider transition-colors">
                  Diagnostic Test
                </Link>
              </div>
            </div>

            {/* Sticky Enquiry Form */}
            <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-7 shadow-xl sticky top-24">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-maroon bg-brand-maroon/10 px-2.5 py-0.5 rounded-full inline-block mb-2">
                EXPERT COUNSELLING
              </span>
              <h3 className="font-serif-editorial font-bold text-brand-navy text-lg mb-1">Request Callback</h3>
              <p className="text-xs text-brand-navy/60 mb-5 font-light">Get syllabus guidance and batch options.</p>
              <EnquiryForm />
            </div>

            {/* Related Courses */}
            {related && related.length > 0 && (
              <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm">
                <h3 className="font-serif-editorial font-bold text-brand-navy text-base mb-4">Related Programs</h3>
                <div className="space-y-3">
                  {related.map(r => (
                    <Link key={r.slug} href={`/courses/${r.slug}`}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-brand-border hover:border-brand-maroon hover:bg-brand-bg transition-all group">
                      <div>
                        <p className="text-xs font-bold text-brand-navy group-hover:text-brand-maroon transition-colors line-clamp-1">{r.title}</p>
                        <p className="text-[11px] text-brand-navy/50">{r.class_level || r.category}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-brand-maroon shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  )
}
