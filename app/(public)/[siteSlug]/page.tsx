import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import Hero from '@/components/public/Hero'
import CourseCard from '@/components/public/CourseCard'
import ResultsSection from '@/components/public/ResultsSection'
import CallbackForm from '@/components/public/CallbackForm'
import Footer from '@/components/public/Footer'
import { BookOpen, Users, Award, Headphones, BarChart2, Bell } from 'lucide-react'
import type { Site, HomeSection, Course, Result, Testimonial, Notice } from '@/types'

const whyChooseUs = [
  { icon: Users,       title: 'Expert Faculty',        desc: 'IIT/AIIMS alumni with 10+ years of teaching experience.' },
  { icon: BookOpen,    title: 'Structured Study Plan', desc: 'Chapter-wise schedule aligned with exam patterns.' },
  { icon: BarChart2,   title: 'Regular Tests',         desc: 'Weekly tests with detailed performance analytics.' },
  { icon: Headphones,  title: '24×7 Doubt Support',    desc: 'Resolve doubts anytime via app, chat, or in-person.' },
  { icon: Award,       title: 'Proven Results',        desc: '1200+ top rankers in NEET & JEE every year.' },
  { icon: Bell,        title: 'Parent Updates',        desc: 'Regular progress reports and parent-teacher meetings.' },
]

export default async function PublicHomePage({ params }: { params: Promise<{ siteSlug: string }> }) {
  const { siteSlug } = await params
  const supabase = await createClient()

  // Fetch site
  const { data: site } = await supabase
    .from('cms_sites')
    .select('*')
    .eq('slug', siteSlug)
    .single()

  if (!site) return notFound()

  // Fetch all page data in parallel
  const [homeRes, coursesRes, resultsRes, testimonialsRes, noticesRes] = await Promise.all([
    supabase.from('cms_home_sections').select('*').eq('site_id', site.id).single(),
    supabase.from('cms_courses').select('*').eq('site_id', site.id).order('sort_order'),
    supabase.from('cms_results').select('*').eq('site_id', site.id).order('created_at', { ascending: false }),
    supabase.from('cms_testimonials').select('*').eq('site_id', site.id).order('created_at'),
    supabase.from('cms_notices').select('*').eq('site_id', site.id).eq('is_active', true).order('publish_date', { ascending: false }).limit(3),
  ])

  const home: HomeSection = homeRes.data ?? {
    id: '', site_id: site.id,
    hero_title: `Welcome to ${site.name}`,
    hero_subtitle: 'Quality coaching for NEET, JEE and more.',
    cta_text: 'Book Free Demo', cta_link: `/${siteSlug}/contact`,
    hero_image_url: null, stats_json: null,
  }

  const courses: Course[] = (coursesRes.data ?? []).map((c: any) => ({
    ...c,
    features_json: Array.isArray(c.features_json) ? c.features_json : [],
  }))

  const results: Result[]       = resultsRes.data ?? []
  const testimonials: Testimonial[] = testimonialsRes.data ?? []
  const notices: Notice[]       = noticesRes.data ?? []
  const featuredCourses         = courses.filter((c) => c.is_featured)
  const courseTabs              = ['All', ...Array.from(new Set(courses.map((c) => c.category)))]

  return (
    <>
      <Navbar siteSlug={siteSlug} siteName={site.name} logoUrl={site.logo_url} phone={site.phone} />

      {/* Notices ticker */}
      {notices.length > 0 && (
        <section className="bg-[#1B2A44] py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-4">
            <span className="bg-[#7E0D0D] text-white text-xs font-bold px-3 py-1 rounded-full shrink-0">LATEST</span>
            {notices.map((n) => (
              <span key={n.id} className="text-white/80 text-sm flex items-center gap-2">
                <Bell size={13} className="text-[#F3DCDC]" /> {n.title}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Hero */}
      <Hero
        title={home.hero_title}
        subtitle={home.hero_subtitle ?? ''}
        ctaText={home.cta_text}
        ctaLink={home.cta_link}
        heroImageUrl={home.hero_image_url}
        stats={home.stats_json}
        siteSlug={siteSlug}
      />

      {/* Explore Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Programs</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1B2A44] mt-2">Explore Our Courses</h2>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {courseTabs.map((t) => (
              <button key={t} className="px-5 py-2 rounded-full text-sm font-medium bg-[#FDF5F5] text-[#1B2A44] hover:bg-[#7E0D0D] hover:text-white transition-colors border border-[#F3DCDC]">
                {t}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(featuredCourses.length > 0 ? featuredCourses : courses.slice(0, 4)).map((c) => (
              <CourseCard key={c.id} course={c} siteSlug={siteSlug} />
            ))}
          </div>
          <div className="text-center mt-8">
            <a href={`/${siteSlug}/courses`} className="inline-block border border-[#7E0D0D] text-[#7E0D0D] hover:bg-[#7E0D0D] hover:text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              View All Courses
            </a>
          </div>
        </div>
      </section>

      {/* Results */}
      {results.length > 0 && <ResultsSection results={results} />}

      {/* Why Choose Us */}
      <section className="py-12 lg:py-16 bg-[#FDF5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Why Us</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B2A44] mt-2">Why Choose {site.name}?</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {whyChooseUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-[#F3DCDC] rounded-2xl p-4 sm:p-6 shadow-sm">
                <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#FDF5F5] rounded-xl flex items-center justify-center mb-3">
                  <Icon size={18} className="text-[#7E0D0D]" />
                </div>
                <h3 className="font-bold text-[#1B2A44] text-sm sm:text-base mb-1">{title}</h3>
                <p className="text-xs sm:text-sm text-[#1B2A44] opacity-70 line-clamp-2">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Testimonials</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1B2A44] mt-2">What Students Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-[#FDF5F5] border border-[#F3DCDC] rounded-2xl p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-[#7E0D0D] text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-[#1B2A44] opacity-80 mb-4 leading-relaxed line-clamp-4">"{t.message}"</p>
                  <div className="flex items-center gap-3">
                    {t.photo_url ? (
                      <img src={t.photo_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-[#F3DCDC] rounded-full flex items-center justify-center text-[#7E0D0D] font-bold text-sm">
                        {t.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[#1B2A44] text-sm">{t.name}</p>
                      <p className="text-xs text-[#C9C8CB]">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Callback Form */}
      <CallbackForm siteSlug={siteSlug} siteId={site.id} />

      <Footer site={site} siteSlug={siteSlug} />
    </>
  )
}
