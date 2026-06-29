import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import CallbackForm from '@/components/public/CallbackForm'
import Footer from '@/components/public/Footer'
import { Award, Users, Star, CheckCircle } from 'lucide-react'

const keyHighlights = [
  'IIT/AIIMS alumni faculty with 10+ years of teaching',
  '1,200+ top rankers in NEET & JEE annually',
  'Structured programs for Classes 6–12 & Droppers',
  'Flexible online & classroom modes available',
]

export default async function AboutPage({ params }: { params: Promise<{ siteSlug: string }> }) {
  const { siteSlug } = await params
  const supabase = await createClient()

  const { data: site } = await supabase.from('cms_sites').select('*').eq('slug', siteSlug).single()
  if (!site) return notFound()

  const [homeRes, facultyRes] = await Promise.all([
    supabase.from('cms_home_sections').select('stats_json').eq('site_id', site.id).single(),
    supabase.from('cms_faculty').select('*').eq('site_id', site.id).order('sort_order'),
  ])

  const stats = homeRes.data?.stats_json ?? {}
  const faculty = facultyRes.data ?? []

  return (
    <>
      <Navbar siteSlug={siteSlug} siteName={site.name} logoUrl={site.logo_url} phone={site.phone} />

      <section className="bg-[#FDF5F5] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Our Story</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1B2A44] mt-2 mb-4">About {site.name}</h1>
            <p className="text-[#1B2A44] opacity-80 leading-relaxed mb-5">
              A premier coaching institute transforming student dreams into top ranks — for over a decade.
            </p>
            <ul className="space-y-3">
              {keyHighlights.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-[#1B2A44]">
                  <CheckCircle size={16} className="text-[#7E0D0D] shrink-0 mt-0.5" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(stats).map(([label, value]) => (
              <div key={label} className="bg-white border border-[#F3DCDC] rounded-2xl p-5 sm:p-6 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-[#7E0D0D]">{value as string}</p>
                <p className="text-xs sm:text-sm text-[#1B2A44] opacity-70 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty */}
      {faculty.length > 0 && (
        <section className="py-12 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Our Team</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1B2A44] mt-2">Expert Faculty</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {faculty.map((f: any) => (
                <div key={f.id} className="bg-[#FDF5F5] border border-[#F3DCDC] rounded-2xl p-4 sm:p-5 text-center">
                  {f.photo_url ? (
                    <img src={f.photo_url} alt={f.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mx-auto mb-3 border-2 border-[#F3DCDC]" />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F3DCDC] rounded-full flex items-center justify-center mx-auto mb-3 text-[#7E0D0D] text-xl sm:text-2xl font-bold">{f.name[0]}</div>
                  )}
                  <h3 className="font-bold text-[#1B2A44] text-sm sm:text-base">{f.name}</h3>
                  <p className="text-[#7E0D0D] text-xs font-medium mt-1">{f.subject}</p>
                  <p className="text-[#C9C8CB] text-xs">{f.experience}</p>
                  {f.bio && <p className="hidden sm:block text-xs text-[#1B2A44] opacity-70 mt-3 leading-relaxed line-clamp-3">{f.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission / Vision / Values */}
      <section className="py-12 lg:py-16 bg-[#FDF5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Award, title: 'Our Mission', desc: 'Equip every student with the tools and confidence to hit their target rank.' },
            { icon: Users, title: 'Our Vision',  desc: 'Be the most trusted institute shaping tomorrow\'s doctors and engineers.' },
            { icon: Star,  title: 'Our Values',  desc: 'Excellence · Integrity · Innovation · Student-first, always.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-[#F3DCDC] rounded-2xl p-6">
              <div className="w-11 h-11 bg-[#FDF5F5] rounded-xl flex items-center justify-center mb-4">
                <Icon size={20} className="text-[#7E0D0D]" />
              </div>
              <h3 className="font-bold text-[#1B2A44] text-base mb-2">{title}</h3>
              <p className="text-sm text-[#1B2A44] opacity-70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CallbackForm siteSlug={siteSlug} siteId={site.id} />
      <Footer site={site} siteSlug={siteSlug} />
    </>
  )
}
