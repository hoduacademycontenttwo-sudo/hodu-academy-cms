import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU, COURSE_CATEGORIES } from '@/lib/hodu'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Phone } from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'

export const metadata = { title: 'All Courses — Hodu Academy' }

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
  const categoryTagline = category ? navCategoryEntries.find(c => c.value === category)?.tagline : null
  const subtitle = categoryTagline || defaultSubtitle

  return (
    <div className="animate-fade-in bg-white">

      {/* Hero */}
      <section className="bg-brand-maroon text-white py-14 sm:py-18 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/80 bg-white/10 px-3 py-1 rounded-md inline-block mb-3">
              Hodu Academy Courses
            </span>
            <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold mt-1 mb-3 text-white">
              {category ? `${category} Courses` : 'All Programs & Cohorts'}
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-normal leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Category filter tabs */}
      <section className="bg-white border-b border-brand-border sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2.5 overflow-x-auto py-3.5 scrollbar-hide">
          <Link href="/courses"
            className={`shrink-0 px-5 py-2 rounded-xl text-xs font-bold transition-all ${!category ? 'bg-brand-maroon text-white shadow-xs' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-brand-border'}`}>
            All Programs
          </Link>
          {categories.map(cat => (
            <Link key={cat} href={`/courses?category=${encodeURIComponent(cat)}`}
              className={`shrink-0 px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${category === cat ? 'bg-brand-maroon text-white shadow-xs' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-brand-border'}`}>
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">

          {/* Courses list */}
          <div className="lg:col-span-2 space-y-6">
            {courses && courses.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-6">
                {courses.map(c => {
                  const cardImg = c.image_url || categoryImages[c.category] || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=220&fit=crop&auto=format'
                  return (
                    <div key={c.id} className="bg-white border-2 border-brand-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-brand-maroon transition-all flex flex-col justify-between">
                      <div>
                        <div className="h-44 relative overflow-hidden border-b border-brand-border">
                          <img src={cardImg} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                          <div className="absolute top-3.5 left-3.5">
                            <span className="bg-brand-maroon text-white text-[10px] font-bold uppercase px-3 py-1 rounded-md shadow-sm">
                              {c.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="font-serif-editorial font-bold text-neutral-900 text-lg mb-1 leading-snug">{c.title}</h3>
                          {c.description && (
                            <p className="text-xs text-neutral-600 font-normal line-clamp-3 mb-4 leading-relaxed">{c.description}</p>
                          )}

                          <div className="space-y-1.5 pt-3 border-t border-brand-border">
                            {defaultFeatures.map((f, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-neutral-700">
                                <CheckCircle2 className="h-3.5 w-3.5 text-brand-maroon shrink-0" />
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-3 border-t border-brand-border flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">Course Fee</span>
                          <span className="text-lg font-black text-brand-maroon">
                            {c.fee ? `₹${c.fee}` : 'On Request'}
                          </span>
                        </div>
                        <Link href={`/courses/${c.slug}`}
                          className="bg-brand-maroon hover:bg-brand-crimson text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5">
                          View Details <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-brand-border rounded-2xl p-8">
                <h3 className="font-serif-editorial text-lg font-bold text-brand-maroon mb-2">No courses found</h3>
                <p className="text-xs text-neutral-600 mb-4 font-normal">Try selecting a different category or contact us for customized batches.</p>
                <Link href="/courses" className="text-xs font-bold text-brand-maroon underline">
                  View all courses
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white border-2 border-brand-border rounded-2xl p-6 sm:p-7 shadow-md sticky top-28">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-maroon bg-neutral-100 px-2.5 py-0.5 rounded-md inline-block mb-2 border border-brand-border">
                ACADEMIC COUNSELLING
              </span>
              <h3 className="font-serif-editorial font-bold text-neutral-900 text-lg mb-1">Unsure Which Batch Fits?</h3>
              <p className="text-xs text-neutral-600 mb-5 font-normal">Speak with an academic counselor to evaluate syllabus readiness.</p>
              <EnquiryForm />
            </div>
          </aside>

        </div>
      </div>

    </div>
  )
}
