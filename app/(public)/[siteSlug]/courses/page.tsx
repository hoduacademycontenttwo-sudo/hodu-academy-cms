import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import CourseCard from '@/components/public/CourseCard'
import Footer from '@/components/public/Footer'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ siteSlug: string }> }): Promise<Metadata> {
  const { siteSlug } = await params
  return { title: `Courses | ${siteSlug}` }
}

export default async function CoursesPage({ params, searchParams }: { params: Promise<{ siteSlug: string }>; searchParams: Promise<{ category?: string; mode?: string }> }) {
  const { siteSlug } = await params
  const sp = await searchParams
  const supabase = await createClient()

  const { data: site } = await supabase.from('cms_sites').select('*').eq('slug', siteSlug).single()
  if (!site) return notFound()

  let q = supabase.from('cms_courses').select('*').eq('site_id', site.id).order('sort_order')
  if (sp.category) q = q.eq('category', sp.category)
  if (sp.mode)     q = q.eq('mode', sp.mode)
  const { data: courses } = await q

  const allCourses = (courses ?? []).map((c: any) => ({ ...c, features_json: Array.isArray(c.features_json) ? c.features_json : [] }))
  const categories = Array.from(new Set((courses ?? []).map((c: any) => c.category)))

  return (
    <>
      <Navbar siteSlug={siteSlug} siteName={site.name} logoUrl={site.logo_url} phone={site.phone} />

      <section className="bg-[#FDF5F5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1B2A44] mb-2">Our Courses</h1>
          <p className="text-[#1B2A44] opacity-70">Structured programs for every stage of your preparation journey.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['All', ...categories].map((cat) => (
              <a
                key={cat}
                href={cat === 'All' ? `/${siteSlug}/courses` : `/${siteSlug}/courses?category=${cat}`}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                  (sp.category === cat || (!sp.category && cat === 'All'))
                    ? 'bg-[#7E0D0D] text-white border-[#7E0D0D]'
                    : 'bg-[#FDF5F5] text-[#1B2A44] border-[#F3DCDC] hover:bg-[#F3DCDC]'
                }`}
              >
                {cat}
              </a>
            ))}
          </div>

          {allCourses.length === 0 ? (
            <p className="text-center text-[#C9C8CB] py-16">No courses found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {allCourses.map((c: any) => <CourseCard key={c.id} course={c} siteSlug={siteSlug} />)}
            </div>
          )}
        </div>
      </section>

      <Footer site={site} siteSlug={siteSlug} />
    </>
  )
}
