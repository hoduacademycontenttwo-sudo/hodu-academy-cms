import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import CallbackForm from '@/components/public/CallbackForm'
import Footer from '@/components/public/Footer'
import { Award, Users, BookOpen, Star } from 'lucide-react'

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

      <section className="bg-[#FDF5F5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Our Story</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1B2A44] mt-2 mb-4">About {site.name}</h1>
            <p className="text-[#1B2A44] opacity-80 leading-relaxed mb-4">
              {site.name} is a premier coaching institute dedicated to helping students achieve top ranks in competitive examinations like NEET and JEE. Founded with the mission to provide quality education accessible to every aspiring student, we have been transforming dreams into reality for over a decade.
            </p>
            <p className="text-[#1B2A44] opacity-80 leading-relaxed">
              Our expert faculty, structured study plans, and result-driven teaching methodology have produced thousands of top rankers who are now pursuing their dreams at the nation's finest institutions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(stats).map(([label, value]) => (
              <div key={label} className="bg-white border border-[#F3DCDC] rounded-2xl p-6 text-center">
                <p className="text-3xl font-bold text-[#7E0D0D]">{value as string}</p>
                <p className="text-sm text-[#1B2A44] opacity-70 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty */}
      {faculty.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Our Team</span>
              <h2 className="text-3xl font-bold text-[#1B2A44] mt-2">Expert Faculty</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {faculty.map((f: any) => (
                <div key={f.id} className="bg-[#FDF5F5] border border-[#F3DCDC] rounded-2xl p-5 text-center">
                  {f.photo_url ? (
                    <img src={f.photo_url} alt={f.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-[#F3DCDC]" />
                  ) : (
                    <div className="w-20 h-20 bg-[#F3DCDC] rounded-full flex items-center justify-center mx-auto mb-4 text-[#7E0D0D] text-2xl font-bold">{f.name[0]}</div>
                  )}
                  <h3 className="font-bold text-[#1B2A44]">{f.name}</h3>
                  <p className="text-[#7E0D0D] text-xs font-medium mt-1">{f.subject}</p>
                  <p className="text-[#C9C8CB] text-xs">{f.experience}</p>
                  {f.bio && <p className="text-xs text-[#1B2A44] opacity-70 mt-3 leading-relaxed">{f.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Mission */}
      <section className="py-16 bg-[#FDF5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-3 gap-6">
          {[
            { icon: Award, title: 'Our Mission', desc: 'To provide every student with the tools, knowledge, and confidence to achieve their highest potential.' },
            { icon: Users, title: 'Our Vision', desc: 'To be the most trusted coaching institution, shaping the medical and engineering leaders of tomorrow.' },
            { icon: Star, title: 'Our Values', desc: 'Excellence, integrity, innovation, and student-first approach in every decision we make.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white border border-[#F3DCDC] rounded-2xl p-7">
              <div className="w-12 h-12 bg-[#FDF5F5] rounded-xl flex items-center justify-center mb-4">
                <Icon size={22} className="text-[#7E0D0D]" />
              </div>
              <h3 className="font-bold text-[#1B2A44] text-lg mb-2">{title}</h3>
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
