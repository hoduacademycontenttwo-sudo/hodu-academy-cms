import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import CallbackForm from '@/components/public/CallbackForm'
import Footer from '@/components/public/Footer'
import { Clock, Users, Calendar, CheckCircle, ArrowLeft, IndianRupee } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ siteSlug: string; courseSlug: string }> }): Promise<Metadata> {
  const { siteSlug, courseSlug } = await params
  const supabase = await createClient()
  const { data: site } = await supabase.from('cms_sites').select('name').eq('slug', siteSlug).single()
  const { data: course } = await supabase.from('cms_courses').select('title,description').eq('slug', courseSlug).single()
  return { title: course?.title ?? 'Course', description: course?.description ?? '' }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ siteSlug: string; courseSlug: string }> }) {
  const { siteSlug, courseSlug } = await params
  const supabase = await createClient()

  const { data: site } = await supabase.from('cms_sites').select('*').eq('slug', siteSlug).single()
  if (!site) return notFound()

  const { data: raw } = await supabase.from('cms_courses').select('*').eq('site_id', site.id).eq('slug', courseSlug).single()
  if (!raw) return notFound()
  const course = { ...raw, features_json: Array.isArray(raw.features_json) ? raw.features_json : [] }

  const { data: faqs } = await supabase.from('cms_faqs').select('*').eq('site_id', site.id).eq('page_key', 'course').order('sort_order')

  return (
    <>
      <Navbar siteSlug={siteSlug} siteName={site.name} logoUrl={site.logo_url} phone={site.phone} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#F3DCDC] px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-[#C9C8CB]">
          <Link href={`/${siteSlug}`} className="hover:text-[#7E0D0D]">Home</Link>
          <span>/</span>
          <Link href={`/${siteSlug}/courses`} className="hover:text-[#7E0D0D]">Courses</Link>
          <span>/</span>
          <span className="text-[#1B2A44]">{course.title}</span>
        </div>
      </div>

      <section className="bg-[#FDF5F5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-[#F3DCDC] text-[#7E0D0D] text-xs font-bold px-3 py-1 rounded-full">{course.category}</span>
              <span className="bg-white border border-[#F3DCDC] text-[#1B2A44] text-xs px-3 py-1 rounded-full">{course.mode}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1B2A44] mb-4">{course.title}</h1>
            <p className="text-[#1B2A44] opacity-80 mb-6 leading-relaxed">{course.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Clock, label: 'Duration', value: course.duration ?? '—' },
                { icon: Users, label: 'Mode', value: course.mode },
                { icon: Calendar, label: 'Starts', value: course.phase_start ?? 'Ongoing' },
                { icon: IndianRupee, label: 'Fee', value: course.fee ? `₹${course.fee}` : 'Contact us' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white border border-[#F3DCDC] rounded-xl p-4">
                  <Icon size={16} className="text-[#7E0D0D] mb-2" />
                  <p className="text-xs text-[#C9C8CB]">{label}</p>
                  <p className="font-semibold text-[#1B2A44] text-sm">{value}</p>
                </div>
              ))}
            </div>

            {course.features_json.length > 0 && (
              <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6">
                <h2 className="font-bold text-[#1B2A44] mb-4">What's Included</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {course.features_json.map((f: string) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-[#7E0D0D] shrink-0 mt-0.5" />
                      <span className="text-sm text-[#1B2A44]">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {faqs && faqs.length > 0 && (
              <div className="mt-8">
                <h2 className="font-bold text-[#1B2A44] text-xl mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {faqs.map((faq: any) => (
                    <div key={faq.id} className="bg-white border border-[#F3DCDC] rounded-2xl p-5">
                      <p className="font-semibold text-[#1B2A44] mb-2 text-sm">{faq.question}</p>
                      <p className="text-sm text-[#1B2A44] opacity-70">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky CTA */}
          <div>
            <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 shadow-sm sticky top-20">
              {course.image_url && <img src={course.image_url} alt={course.title} className="w-full h-44 object-cover rounded-xl mb-5" />}
              {course.fee && (
                <div className="mb-4">
                  <p className="text-xs text-[#C9C8CB]">Course Fee</p>
                  <p className="text-2xl font-bold text-[#7E0D0D]">₹{course.fee}</p>
                  <p className="text-xs text-[#C9C8CB]">+ GST as applicable</p>
                </div>
              )}
              <Link href={`/${siteSlug}/contact`} className="block text-center bg-[#7E0D0D] hover:bg-[#922222] text-white font-semibold py-3 rounded-xl transition-colors mb-3">
                Book Free Demo
              </Link>
              <a href={`tel:${site.phone}`} className="block text-center border border-[#1B2A44] text-[#1B2A44] hover:bg-[#1B2A44] hover:text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                Call to Enrol
              </a>
            </div>
          </div>
        </div>
      </section>

      <CallbackForm siteSlug={siteSlug} siteId={site.id} />
      <Footer site={site} siteSlug={siteSlug} />
    </>
  )
}
