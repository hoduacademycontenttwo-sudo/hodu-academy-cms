import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU, COURSE_CATEGORIES } from '@/lib/hodu'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Phone } from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'

export const metadata = { title: 'All Courses — Hodu Academy' }

const categoryColors: Record<string, string> = {
  'IGCSE': 'bg-blue-600',
  'Cambridge O Level': 'bg-indigo-600',
  'IB': 'bg-purple-600',
  'CBSE': 'bg-green-700',
  'Competitive Exams': 'bg-orange-600',
  'Olympiads': 'bg-yellow-600',
}

function getBadgeColor(category: string) {
  return categoryColors[category] ?? 'bg-brand-maroon'
}

const defaultFeatures = [
  '600+ Hours of Teaching',
  'Chapter-wise Tests & DPPs',
  'Doubt Resolution Support',
  'Study Material Included',
]

const categoryImages: Record<string, string> = {
  'IGCSE': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=220&fit=crop&auto=format',
  'Cambridge O Level': 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&h=220&fit=crop&auto=format',
  'IB': 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&h=220&fit=crop&auto=format',
  'CBSE': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=220&fit=crop&auto=format',
  'Competitive Exams': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=220&fit=crop&auto=format',
  'Olympiads': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&h=220&fit=crop&auto=format',
}

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const supabase = await createClient()
  const { category } = await searchParams

  let query = supabase.from('cms_courses').select('*').eq('site_id', HODU_SITE_ID).order('sort_order')
  if (category) query = query.eq('category', category)

  const [{ data: courses }, { data: navCourses }, { data: site }] = await Promise.all([
    query,
    supabase.from('cms_nav_links').select('href').eq('site_id', HODU_SITE_ID).eq('group_name', 'courses').order('sort_order'),
    supabase.from('cms_sites').select('courses_page_subtitle').eq('id', HODU_SITE_ID).single(),
  ])

  // Filter pills need real cms_courses category values — pull them from the "?category=" query
  // param of each Academic Offerings link so any menu item admin adds shows up here too.
  const dynamicCategories = (navCourses ?? [])
    .map(n => { try { return new URL(n.href, 'http://x').searchParams.get('category') } catch { return null } })
    .filter((c): c is string => !!c)
  const categories = dynamicCategories.length > 0 ? [...new Set(dynamicCategories)] : [...COURSE_CATEGORIES]

  const subtitle = site?.courses_page_subtitle
    || 'Expert coaching for IGCSE, IB, CBSE, JEE, NEET and Olympiads — designed for top scores and real understanding.'

  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <section className="bg-brand-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-brand-border/80">
              Hodu Academy Courses
            </span>
            <h1 className="text-4xl font-extrabold mt-2 mb-3">
              {category ? `${category} Courses` : 'All Courses'}
            </h1>
            <p className="text-white/70 text-sm font-light">
              Expert coaching for IGCSE, IB, CBSE, JEE, NEET and Olympiads — designed for top scores and real understanding.
            </p>
          </div>
        </div>
      </section>

      {/* Category filter tabs */}
      <section className="bg-white border-b border-brand-border sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 overflow-x-auto py-3 scrollbar-hide">
          <Link href="/courses"
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${!category ? 'bg-brand-maroon text-white' : 'bg-brand-bg text-brand-navy hover:bg-brand-border/40 border border-brand-border'}`}>
            All Courses
          </Link>
          {categories.map(cat => (
            <Link key={cat} href={`/courses?category=${encodeURIComponent(cat)}`}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${category === cat ? 'bg-brand-maroon text-white' : 'bg-brand-bg text-brand-navy hover:bg-brand-border/40 border border-brand-border'}`}>
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Course grid */}
      <section className="py-12 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {courses && courses.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
              {courses.map(course => {
                const features: string[] = Array.isArray(course.features_json) && course.features_json.length > 0
                  ? course.features_json
                  : defaultFeatures
                const badgeClass = getBadgeColor(course.category)
                const fee = course.fee ? `₹${course.fee}` : null
                const cardImg = course.image_url || categoryImages[course.category]

                return (
                  <div key={course.id} className="bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col shrink-0 w-[78vw] sm:w-auto snap-start">
                    {/* Card top image */}
                    {cardImg ? (
                      <div className="h-40 relative overflow-hidden">
                        <img src={cardImg} alt={course.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute bottom-3 left-3 text-white font-extrabold text-sm leading-tight drop-shadow">{course.title}</span>
                      </div>
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-brand-maroon to-brand-accent flex items-end p-4">
                        <span className="text-white font-extrabold text-xl leading-tight">{course.title}</span>
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-1">
                      {/* Category badge */}
                      <span className={`${badgeClass} text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded self-start mb-3`}>
                        {course.category}
                      </span>

                      <h3 className="font-extrabold text-brand-navy text-base leading-snug mb-1">{course.title}</h3>
                      {course.class_level && (
                        <p className="text-xs text-brand-navy/60 font-medium mb-3">{course.class_level} · {course.mode}</p>
                      )}
                      {course.description && (
                        <p className="text-xs text-brand-navy/70 font-light line-clamp-2 mb-3">{course.description}</p>
                      )}

                      {/* Feature bullets */}
                      <ul className="space-y-1.5 mb-4">
                        {features.slice(0, 4).map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-brand-navy/80">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Batch info */}
                      {(course.duration || course.phase_start) && (
                        <div className="flex gap-4 text-[11px] text-brand-navy/60 font-medium mb-4 border-t border-brand-border pt-3">
                          {course.duration && <span>⏱ {course.duration}</span>}
                          {course.phase_start && <span>📅 Starts {course.phase_start}</span>}
                        </div>
                      )}

                      <div className="mt-auto space-y-3">
                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          {fee ? (
                            <>
                              <span className="text-2xl font-extrabold text-brand-navy">{fee}</span>
                              <span className="text-xs text-brand-navy/50 font-light">/ full course</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-brand-maroon">Contact us for fee details</span>
                          )}
                        </div>

                        {/* Dual CTAs */}
                        <div className="flex gap-2">
                          <Link href={`/courses/${course.slug}`}
                            className="flex-1 border border-brand-border text-brand-navy text-xs font-semibold py-2.5 rounded-xl text-center hover:bg-brand-bg transition-colors">
                            Know More
                          </Link>
                          <Link href="/enroll"
                            className="flex-1 bg-brand-maroon hover:bg-brand-accent text-white text-xs font-bold py-2.5 rounded-xl text-center transition-colors flex items-center justify-center gap-1">
                            Enroll Now
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-brand-navy/40">
              <p className="text-lg font-bold mb-2">No courses found</p>
              <p className="text-sm">Try a different category or <Link href="/contact" className="text-brand-maroon underline">contact us</Link> for more info.</p>
            </div>
          )}
        </div>
      </section>

      {/* Callback CTA strip */}
      <section className="bg-brand-navy text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <h2 className="text-3xl font-extrabold">Not sure which course suits you?</h2>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                Talk to our academic counsellors for free. We'll help you pick the right course based on your board, class, and target exam.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Phone className="h-5 w-5 text-brand-border" />
                <a href={`tel:${HODU.phone}`} className="text-brand-border font-bold text-lg hover:text-white transition-colors">
                  {HODU.phone}
                </a>
              </div>
              <p className="text-white/50 text-xs">Available Mon–Sat, 9AM–7PM IST</p>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-extrabold text-brand-navy text-sm mb-4 uppercase tracking-wider">Request a Free Callback</h3>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
