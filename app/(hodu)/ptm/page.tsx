import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, Sparkles, HeartHandshake, CheckCircle2, ArrowRight, ShieldCheck, MapPin } from 'lucide-react'
import PtmGalleryGrid, { PtmImage } from '@/components/hodu/PtmGalleryGrid'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import ScrollReveal from '@/components/hodu/ScrollReveal'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Parent Teacher Meeting (PTM) Gallery — Hodu Academy',
  description: 'Explore photos and insights from Hodu Academy’s Parent-Teacher Meetings. We believe in continuous collaboration for every student’s academic success.',
}

const defaultPtmMoments: PtmImage[] = [
  {
    image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop&auto=format',
    caption: '1-on-1 Academic Mentorship & Syllabus Roadmap Discussion',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&h=600&fit=crop&auto=format',
    caption: 'Comprehensive Test Performance & Error Analysis Review',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop&auto=format',
    caption: 'Cambridge & IB Board IA Strategy Consultation with Parents',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop&auto=format',
    caption: 'Personalized Subject Improvement & Daily Doubt Desk Insights',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&h=600&fit=crop&auto=format',
    caption: 'JEE & NEET Integrated Batch Parent Progress Conference',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop&auto=format',
    caption: 'Quarterly Milestone Celebration & Goal Setting Session',
  },
]

export default async function PtmPage() {
  let dbImages: any[] = []

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cms_gallery')
      .select('*')
      .eq('site_id', HODU_SITE_ID)
      .eq('category', 'PTM Gallery')
      .order('sort_order', { ascending: true })

    if (data && data.length > 0) {
      dbImages = data
    }
  } catch (err) {
    console.error('Error fetching PTM gallery images:', err)
  }

  const ptmImages: PtmImage[] = dbImages.length > 0
    ? dbImages.map((img) => ({
        id: img.id,
        image_url: img.image_url,
        caption: img.caption || 'Hodu Academy PTM Session',
      }))
    : defaultPtmMoments

  return (
    <div className="space-y-0 animate-fade-in bg-brand-bg text-brand-text">
      {/* ─── Hero Banner ─── */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-b from-[#2D0909] via-[#1F0404] to-[#120202] text-white overflow-hidden border-b border-brand-maroon/30">
        <div className="absolute inset-0 bg-[radial-gradient(#bd9f67_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#bd9f67]/20 border border-[#bd9f67]/40 text-[#f1ddb6] text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full">
            <HeartHandshake size={14} className="text-[#bd9f67]" />
            <span>PARENT-TEACHER COLLABORATION</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Parent-Teacher Meetings (PTM) Gallery
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            At Hodu Academy, we believe student success is built on active partnership between parents and mentors. Explore moments from our regular feedback and milestone reviews.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-amber-200/90">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <CheckCircle2 size={14} className="text-amber-400" />
              Monthly Diagnostic Reviews
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <CheckCircle2 size={14} className="text-amber-400" />
              Real-time Performance Reports
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <CheckCircle2 size={14} className="text-amber-400" />
              1-on-1 Faculty Insights
            </span>
          </div>
        </div>
      </section>

      {/* ─── PTM Gallery Showcase ─── */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PtmGalleryGrid images={ptmImages} />
      </section>

      {/* ─── Bottom CTA / Consultation Form ─── */}
      <section className="py-14 sm:py-20 bg-white border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-brand-maroon text-xs font-bold uppercase tracking-widest bg-brand-blush px-3 py-1 rounded-full border border-brand-border">
              STAY CONNECTED
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon leading-tight">
              Have Questions Regarding Your Child’s Preparation?
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Book a personal consultation with our academic counselor or center director. We’ll walk you through subject diagnostic reports, batch schedules, and personalized milestone maps.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-brand-text">
              <div className="flex items-center gap-2 bg-brand-bg px-3.5 py-2 rounded-xl border border-brand-border">
                <MapPin className="h-4 w-4 text-brand-maroon" />
                <span>C-28, Vaishali Estate, Jaipur Campus</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </div>
  )
}
