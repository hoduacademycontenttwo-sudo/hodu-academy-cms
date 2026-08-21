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
    supabase.from('cms_nav_links').select('href, tagline').eq('site_id', HODU_SITE_ID).eq('group_name', 'courses').order('sort_order'),
    supabase.from('cms_sites').select('courses_page_subtitle').eq('id', HODU_SITE_ID).single(),
  ])

  // Filter pills need real cms_courses category values — pull them from the "?category=" query
  // param of each Academic Offerings link so any menu item admin adds shows up here too.
  const navCategoryEntries = (navCourses ?? [])
    .map(n => {
      try { return { value: new URL(n.href, 'http://x').searchParams.get('category'), tagline: n.tagline } }
      catch { return { value: null, tagline: null } }
    })
    .filter((c): c is { value: string; tagline: string | null } => !!c.value)
  const dynamicCategories = navCategoryEntries.map(c => c.value)
  const categories = dynamicCategories.length > 0 ? [...new Set(dynamicCategories)] : [...COURSE_CATEGORIES]

  const defaultSubtitle = site?.courses_page_subtitle
    || 'Expert coaching for IGCSE, IB, CBSE, JEE, NEET and Olympiads — designed for top scores and real understanding.'
  // A category-specific subheading (set per item in Academic Offerings) takes priority
  // over the global Courses Page subheading when that category is selected.
  const categoryTagline = category ? navCategoryEntries.find(c => c.value === category)?.tagline : null
  const subtitle = categoryTagline || defaultSubtitle

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
              {subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Category filter tabs */}
      <section className="bg-white/95 backdrop-blur-md border-b border-brand-border sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2.5 overflow-x-auto py-3.5 scrollbar-hide">
          <Link href="/courses"
            className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${!category ? 'bg-brand-maroon text-white shadow-md' : 'bg-brand-bg/80 text-brand-navy hover:bg-brand-border/50 border border-brand-border'}`}>
            All Programs
          </Link>
          {categories.map(cat => (
            <Link key={cat} href={`/courses?category=${encodeURIComponent(cat)}`}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-xs ${category === cat ? 'bg-brand-maroon text-white shadow-md' : 'bg-brand-bg/80 text-brand-navy hover:bg-brand-border/50 border border-brand-border'}`}>
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Course grid */}
      <section className="py-14 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {courses && courses.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible">
              {courses.map(course => {
                const features: string[] = Array.isArray(course.features_json) && course.features_json.length > 0
                  ? course.features_json
                  : defaultFeatures
                const badgeClass = getBadgeColor(course.category)
                const fee = course.fee ? `₹${course.fee}` : null
                const cardImg = course.image_url || categoryImages[course.category]

                return (
                  <div key={course.id} className="bg-white border border-brand-border rounded-3xl overflow-hidden card-hover flex flex-col shrink-0 w-[80vw] sm:w-auto snap-start shadow-sm">
                    {/* Card top image */}
                    <div className="h-44 relative overflow-hidden">
                      {cardImg ? (
                        <>
                          <img src={cardImg} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span className={`${badgeClass} text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md`}>
                              {course.category}
                            </span>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                            <span className="font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-md">
                              {course.class_level || 'Comprehensive Batch'}
                            </span>
                            <span className="text-amber-300 font-bold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1">
                              ★ 4.9
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="h-44 bg-gradient-to-br from-brand-maroon to-brand-accent flex items-end p-5">
                          <span className="text-white font-extrabold text-xl leading-tight">{course.title}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-extrabold text-brand-navy text-lg leading-snug mb-1.5">{course.title}</h3>
                        {course.class_level && (
                          <p className="text-xs text-brand-maroon font-semibold mb-3">{course.class_level} · {course.mode || 'Classroom + Live Online'}</p>
                        )}
                        {course.description && (
                          <p className="text-xs text-brand-navy/65 font-light line-clamp-2 mb-4 leading-relaxed">{course.description}</p>
                        )}

                        {/* Feature bullets */}
                        <ul className="space-y-2 mb-5">
                          {features.slice(0, 4).map((f: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-brand-navy/80">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-brand-border/70">
                        {/* Batch info */}
                        {(course.duration || course.phase_start) && (
                          <div className="flex justify-between text-[11px] text-brand-navy/60 font-medium bg-brand-bg/60 p-2 rounded-xl border border-brand-border/40">
                            {course.duration && <span>⏱ {course.duration}</span>}
                            {course.phase_start && <span>📅 Starts {course.phase_start}</span>}
                          </div>
                        )}

                        {/* Price + Dual CTAs */}
                        <div className="flex items-baseline justify-between pt-1">
                          <div>
                            <span className="text-[10px] text-brand-navy/50 font-bold uppercase tracking-wider block">Tuition Fee</span>
                            <span className="text-2xl font-black text-brand-navy">{fee ?? 'Enquire'}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <Link href={`/courses/${course.slug}`}
                            className="border border-brand-border hover:border-brand-maroon text-brand-navy hover:text-brand-maroon text-xs font-bold py-2.5 rounded-xl text-center hover:bg-brand-bg transition-all">
                            Details
                          </Link>
                          <Link href="/enroll"
                            className="bg-brand-maroon hover:bg-brand-accent text-white text-xs font-extrabold py-2.5 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 shadow hover:shadow-md">
                            Enroll Now
                            <ArrowRight className="h-3.5 w-3.5" />
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
