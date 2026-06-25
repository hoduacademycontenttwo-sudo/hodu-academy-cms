import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import Link from 'next/link'
import { CheckCircle2, Clock, Calendar, Users, ArrowLeft, Phone, ChevronDown } from 'lucide-react'
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
  'IGCSE': 'bg-blue-600',
  'Cambridge O Level': 'bg-indigo-600',
  'IB': 'bg-purple-600',
  'CBSE': 'bg-green-700',
  'Competitive Exams': 'bg-orange-600',
  'Olympiads': 'bg-yellow-600',
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
  { q: 'When does the batch start?', a: 'We run batches throughout the year. Contact us for the next available start date closest to your schedule.' },
  { q: 'What is the batch size?', a: 'All classroom batches are capped at 15–20 students to ensure personal attention and direct mentor access.' },
  { q: 'Are classes recorded?', a: 'Yes. Every live session is recorded and available on the LMS within 2 hours for revision.' },
  { q: 'Is study material included?', a: 'Yes — chapter notes, DPPs, past papers, and full mock test series are included in the course fee.' },
  { q: 'What if I miss a class?', a: 'Recorded sessions are available 24/7 on the LMS. You can also attend doubt sessions to cover missed topics.' },
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

  // related courses (same category, different slug)
  const { data: related } = await supabase
    .from('cms_courses')
    .select('title, slug, category, class_level, fee')
    .eq('site_id', HODU_SITE_ID)
    .eq('category', course.category)
    .neq('slug', slug)
    .limit(3)

  return (
    <div className="animate-fade-in">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-brand-navy/50">
          <Link href="/" className="hover:text-brand-maroon transition-colors">Home</Link>
          <span>/</span>
          <Link href="/courses" className="hover:text-brand-maroon transition-colors">Courses</Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold line-clamp-1">{course.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative text-white py-14 overflow-hidden">
        {/* Background image */}
        {heroBgImage && (
          <img
            src={heroBgImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}
        {/* Dark overlay for text readability — no color tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/courses" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-semibold mb-6 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> All Courses
          </Link>
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <span className={`inline-block ${accentClass} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>
                {course.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{course.title}</h1>
              {course.description && (
                <p className="text-white/80 text-base font-light leading-relaxed max-w-2xl">{course.description}</p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { icon: Clock,    label: course.duration ?? '1 Year',       caption: 'Duration' },
                  { icon: Users,    label: course.mode ?? 'Classroom',        caption: 'Mode' },
                  { icon: Calendar, label: course.phase_start ?? 'Ongoing',   caption: 'Starts' },
                ].map(({ icon: Icon, label, caption }) => (
                  <div key={caption} className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-white/70" />
                    <div>
                      <p className="text-[10px] text-white/50 uppercase tracking-wider">{caption}</p>
                      <p className="text-sm font-bold">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price card (shown in hero on desktop) */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                {course.image_url && (
                  <img src={course.image_url} alt={course.title} className="w-full h-36 object-cover rounded-xl mb-5" />
                )}
                <p className="text-xs text-brand-navy/50 uppercase tracking-wider font-semibold">Course Fee</p>
                <p className="text-3xl font-extrabold text-brand-navy mt-0.5">
                  {course.fee ? `₹${course.fee}` : 'Contact Us'}
                </p>
                {course.fee && <p className="text-xs text-brand-navy/40 mt-0.5">+ GST as applicable</p>}
                <div className="space-y-2 mt-5">
                  <Link href="/enroll"
                    className="block w-full bg-brand-maroon hover:bg-brand-accent text-white font-bold py-3 rounded-xl text-center text-sm transition-colors">
                    Enroll Now
                  </Link>
                  <Link href="/contact"
                    className="block w-full border border-brand-border text-brand-navy hover:bg-brand-bg font-semibold py-3 rounded-xl text-center text-sm transition-colors">
                    Book Free Demo
                  </Link>
                </div>
                <div className="mt-4 pt-4 border-t border-brand-border flex items-center gap-2 text-xs text-brand-navy/50">
                  <Phone className="h-3.5 w-3.5 text-brand-maroon" />
                  <a href={`tel:${HODU.phone}`} className="hover:text-brand-maroon font-medium">{HODU.phone}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}

      <section className="bg-brand-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-10">

          {/* Left — main content */}
          <div className="lg:col-span-2 space-y-10">

            {/* What's included */}
            {course.features_json.length > 0 && (
              <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-brand-navy mb-5">What's Included</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {course.features_json.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-sm text-brand-navy/80">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Why choose */}
            <div className="bg-brand-navy text-white rounded-2xl p-6">
              <h2 className="text-xl font-extrabold mb-5">Why Hodu Academy?</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { emoji: '👨‍🏫', title: 'Expert Faculty',    desc: 'IIT/NIT qualified, 10+ years experience' },
                  { emoji: '📊', title: 'Weekly Tests',        desc: 'Percentile-ranked diagnostic mocks' },
                  { emoji: '💬', title: 'Daily Doubt Clearing', desc: 'Online + in-person every weekday' },
                ].map(item => (
                  <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <span className="text-2xl block mb-2">{item.emoji}</span>
                    <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-white/60 font-light">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-brand-navy mb-5">Frequently Asked Questions</h2>
              <div className="space-y-2">
                {courseFaqs.map((faq, i) => (
                  <details key={i} className="group border border-brand-border rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none bg-brand-bg hover:bg-brand-border/30 transition-colors">
                      <span className="font-semibold text-brand-navy text-sm pr-4">{faq.q}</span>
                      <ChevronDown className="h-4 w-4 text-brand-maroon shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-4 py-3.5 text-sm text-brand-navy/70 font-light leading-relaxed bg-white">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Right — sticky CTA */}
          <div className="space-y-6">
            {/* Mobile price card */}
            <div className="lg:hidden bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
              <p className="text-xs text-brand-navy/50 uppercase tracking-wider font-semibold">Course Fee</p>
              <p className="text-3xl font-extrabold text-brand-navy mt-0.5">
                {course.fee ? `₹${course.fee}` : 'Contact Us'}
              </p>
              <div className="flex gap-2 mt-4">
                <Link href="/enroll"
                  className="flex-1 bg-brand-maroon hover:bg-brand-accent text-white font-bold py-2.5 rounded-xl text-center text-sm transition-colors">
                  Enroll Now
                </Link>
                <Link href="/contact"
                  className="flex-1 border border-brand-border text-brand-navy hover:bg-brand-bg font-semibold py-2.5 rounded-xl text-center text-sm transition-colors">
                  Free Demo
                </Link>
              </div>
            </div>

            {/* Sticky enquiry form */}
            <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm sticky top-20">
              <h3 className="font-extrabold text-brand-navy text-sm uppercase tracking-wider mb-4">Request a Callback</h3>
              <EnquiryForm />
            </div>

            {/* Related courses */}
            {related && related.length > 0 && (
              <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
                <h3 className="font-extrabold text-brand-navy text-sm uppercase tracking-wider mb-4">Related Courses</h3>
                <div className="space-y-3">
                  {related.map(r => (
                    <Link key={r.slug} href={`/courses/${r.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-brand-border hover:bg-brand-bg transition-colors group">
                      <div>
                        <p className="text-sm font-bold text-brand-navy group-hover:text-brand-maroon transition-colors line-clamp-1">{r.title}</p>
                        <p className="text-xs text-brand-navy/50">{r.class_level}</p>
                      </div>
                      {r.fee && <span className="text-sm font-extrabold text-brand-navy shrink-0 ml-2">₹{r.fee}</span>}
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
