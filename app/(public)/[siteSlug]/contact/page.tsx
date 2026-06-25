import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import CallbackForm from '@/components/public/CallbackForm'
import Footer from '@/components/public/Footer'
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react'

export default async function ContactPage({ params }: { params: Promise<{ siteSlug: string }> }) {
  const { siteSlug } = await params
  const supabase = await createClient()

  const { data: site } = await supabase.from('cms_sites').select('*').eq('slug', siteSlug).single()
  if (!site) return notFound()

  const { data: faqs } = await supabase.from('cms_faqs').select('*').eq('site_id', site.id).eq('page_key', 'home').order('sort_order')

  return (
    <>
      <Navbar siteSlug={siteSlug} siteName={site.name} logoUrl={site.logo_url} phone={site.phone} />

      <section className="bg-[#FDF5F5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Reach Us</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1B2A44] mt-2 mb-3">Contact Us</h1>
          <p className="text-[#1B2A44] opacity-70">Our counsellors are available Mon–Sat, 9 AM to 7 PM</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: Phone, label: 'Call Us', value: site.phone, href: `tel:${site.phone}` },
              { icon: MessageCircle, label: 'WhatsApp', value: site.whatsapp ? `+${site.whatsapp}` : null, href: `https://wa.me/${site.whatsapp}` },
              { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}` },
              { icon: MapPin, label: 'Address', value: site.address, href: null },
              { icon: Clock, label: 'Office Hours', value: 'Mon–Sat: 9 AM – 7 PM', href: null },
            ].filter((i) => i.value).map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="bg-[#FDF5F5] border border-[#F3DCDC] rounded-2xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#7E0D0D]" />
                </div>
                <div>
                  <p className="text-xs text-[#C9C8CB] font-medium">{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-sm text-[#1B2A44] hover:text-[#7E0D0D] font-medium">{value}</a>
                  ) : (
                    <p className="text-sm text-[#1B2A44]">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Inline form */}
          <div className="lg:col-span-2">
            <div className="bg-[#FDF5F5] rounded-2xl p-6">
              <h2 className="font-bold text-[#1B2A44] text-xl mb-6">Request a Callback</h2>
              <CallbackForm siteSlug={siteSlug} siteId={site.id} />
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="py-12 bg-[#FDF5F5]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[#1B2A44] mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq: any) => (
                <div key={faq.id} className="bg-white border border-[#F3DCDC] rounded-2xl p-5">
                  <p className="font-semibold text-[#1B2A44] mb-2">{faq.question}</p>
                  <p className="text-sm text-[#1B2A44] opacity-70">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer site={site} siteSlug={siteSlug} />
    </>
  )
}
