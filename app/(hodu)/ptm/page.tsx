import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, Sparkles, HeartHandshake, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Camera, Images } from 'lucide-react'
import PtmGalleryGrid, { GalleryItem } from '@/components/hodu/PtmGalleryGrid'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import ScrollReveal from '@/components/hodu/ScrollReveal'
import BannerElasticMesh from '@/components/ui/BannerElasticMesh'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Hodu Academy Photo Gallery — PTM & Campus Life Moments',
  description: 'Explore real photos of Parent-Teacher Meetings (PTM), daily classroom sessions, campus infrastructure, and vibrant student life at Hodu Academy Jaipur.',
}

const defaultMoments: GalleryItem[] = [
  // PTM Moments
  {
    image_url: 'https://lh3.googleusercontent.com/d/1rgiHyqvgevfO3g6T6-kJhYdQ5BrU6xB1',
    caption: '1-on-1 Academic Mentorship & Syllabus Roadmap Discussion',
    category: 'PTM Gallery',
  },
  {
    image_url: 'https://lh3.googleusercontent.com/d/12ZQ2kfYVjY-alMbjzWviy8iBnHgoAq-8',
    caption: 'Comprehensive Test Performance & Error Analysis Review',
    category: 'PTM Gallery',
  },
  {
    image_url: 'https://lh3.googleusercontent.com/d/1Ca0vKdYR61b0YMnjS42WBDmkpa9sgs1E',
    caption: 'Cambridge & IB Board IA Strategy Consultation with Parents',
    category: 'PTM Gallery',
  },
  {
    image_url: 'https://lh3.googleusercontent.com/d/18tdedQrdhO5BQQMWIRchERq6aiXFA3RM',
    caption: 'Personalized Subject Improvement & Daily Doubt Desk Insights',
    category: 'PTM Gallery',
  },
  {
    image_url: 'https://lh3.googleusercontent.com/d/1dn3qBCGLr4BtDZDBvwfPWroUxVhj-RmJ',
    caption: 'JEE & NEET Integrated Batch Parent Progress Conference',
    category: 'PTM Gallery',
  },
  {
    image_url: 'https://lh3.googleusercontent.com/d/1LIJ_8cC195zVM1PxRYEnLFXp4xYHuZB5',
    caption: 'Quarterly Milestone Celebration & Goal Setting Session',
    category: 'PTM Gallery',
  },

  // Life at Hodu Moments
  {
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop&auto=format',
    caption: 'Collaborative Problem-Solving in Smart Digital Classroom',
    category: 'Life at Hodu Academy',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&h=600&fit=crop&auto=format',
    caption: 'Interactive Teacher-Student Chemistry Lab Session',
    category: 'Life at Hodu Academy',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&h=600&fit=crop&auto=format',
    caption: 'Silent Self-Study & Dedicated Doubt Solving Desk',
    category: 'Life at Hodu Academy',
  },
  {
    image_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop&auto=format',
    caption: 'Classroom Group Brainstorming & Physics Module Discussion',
    category: 'Life at Hodu Academy',
  },

  // Campus & Facilities
  {
    image_url: '/api/proxy-image?id=1T76yiwQqRAkaeYXamomDKHGiPdGiYXDJ',
    caption: 'Hodu Academy Main Campus Architecture & Reception',
    category: 'Campus & Facilities',
  },
  {
    image_url: '/api/proxy-image?id=12b7XFLX6oMJ_f6sT9rnlYmkt0gx9ieAe',
    caption: 'Air Conditioned Digital Smart Classrooms with Ergonomic Seating',
    category: 'Campus & Facilities',
  },
  {
    image_url: '/api/proxy-image?id=1YtfUVVgT46kGZ3EeNM2O3U36FrhgXoRG',
    caption: 'Advanced Computer-Based Testing Lab & High Speed WiFi',
    category: 'Campus & Facilities',
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
      .in('category', [
        'PTM Gallery',
        'Life at Hodu Academy',
        'Life at Hodu',
        'Campus',
        'Classroom',
        'Events',
        'Jaipur Campus Carousel',
        'Jaipur Campus Facilities',
      ])
      .order('sort_order', { ascending: true })

    if (data && data.length > 0) {
      dbImages = data
    }
  } catch (err) {
    console.error('Error fetching gallery images:', err)
  }

  const galleryImages: GalleryItem[] = dbImages.length > 0
    ? dbImages.map((img) => ({
        id: img.id,
        image_url: img.image_url,
        caption: img.caption && !img.caption.startsWith('{') ? img.caption : '',
        category: img.category || 'PTM Gallery',
      }))
    : defaultMoments

  return (
    <div className="space-y-0 animate-fade-in bg-brand-bg text-brand-text">
      {/* ─── Hero Banner ─── */}
      <section className="relative py-14 sm:py-20 bg-[#120202] text-white overflow-hidden border-b border-brand-maroon/30">
        <BannerElasticMesh variant="dark" opacity={0.8} interaction="hover" />
        <div className="absolute inset-0 bg-[radial-gradient(#bd9f67_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#bd9f67]/20 border border-[#bd9f67]/40 text-[#f1ddb6] text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full">
            <Images size={14} className="text-[#bd9f67]" />
            <span>CAMPUS & COMMUNITY GALLERY</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Parent-Teacher Meetings & Life at Hodu
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Explore genuine moments of academic excellence, 1-on-1 parent-teacher interactions, classroom discussions, and vibrant student life across Hodu Academy.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-amber-200/90">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <CheckCircle2 size={14} className="text-amber-400" />
              1-on-1 PTM Reviews
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <CheckCircle2 size={14} className="text-amber-400" />
              Life at Hodu Academy
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <CheckCircle2 size={14} className="text-amber-400" />
              Smart Classrooms & Labs
            </span>
          </div>
        </div>
      </section>

      {/* ─── Filterable Gallery Showcase ─── */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PtmGalleryGrid images={galleryImages} />
      </section>

      {/* ─── Bottom CTA / Consultation Form ─── */}
      <section className="py-14 sm:py-20 bg-white border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-brand-maroon text-xs font-bold uppercase tracking-widest bg-brand-blush px-3 py-1 rounded-full border border-brand-border">
              VISIT OUR JAIPUR CAMPUS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon leading-tight">
              Experience the Academic Environment First-Hand
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Book a campus walk-through or personalized consultation with our center director and academic faculty. Experience our 1:12 batch classrooms, doubt desks, and computer test labs.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-brand-text">
              <div className="flex items-center gap-2 bg-brand-bg px-3.5 py-2 rounded-xl border border-brand-border">
                <MapPin className="h-4 w-4 text-brand-maroon" />
                <span>C-28, Vaishali Estate, Gandhi Path West, Jaipur</span>
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
