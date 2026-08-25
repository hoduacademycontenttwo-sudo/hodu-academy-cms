import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import Link from 'next/link'
import { Phone, MapPin, CheckCircle2, Clock, Calendar, Bus, BookOpen, Building2, ArrowRight, Laptop, Smartphone, Target, School } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import ScrollReveal from '@/components/hodu/ScrollReveal'
import HomeHeroCarousel from '@/components/hodu/HomeHeroCarousel'
import { parseMediaUrl } from '@/lib/homeCarousel'
import { normalizeImageUrl } from '@/lib/imageUtils'

export const metadata = {
  title: 'Offline Coaching Jaipur — Hodu Academy Classroom Programs | IGCSE, IB, CBSE, JEE, NEET',
  description: 'Join Hodu Academy’s state-of-the-art offline coaching centre in Jaipur. Smart digital classrooms, 1:12 batch sizes, 1-on-1 daily doubt cells, and GPS AC transport.',
}

const campusFacilities = [
  {
    icon: School,
    title: 'Smart Classrooms',
    tag: 'Acoustic Treated',
    desc: '85-inch interactive touchscreens, digital visualizers, and ergonomic seating.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: Target,
    title: '1-on-1 Doubt Desks',
    tag: 'Daily 4:00 – 7:30 PM',
    desc: 'Private consultation booths for subject masters to resolve queries line-by-line.',
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: BookOpen,
    title: 'Silent Library',
    tag: '8 AM – 9 PM',
    desc: 'Air-conditioned study carrels with 15+ years of Cambridge, IB, CBSE & JEE archives.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: Laptop,
    title: 'CBT Testing Lab',
    tag: 'Simulated Exams',
    desc: 'High-speed desktop terminals replicating real NTA JEE Main, NEET & Cambridge exams.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: Smartphone,
    title: 'Biometric Attendance',
    tag: 'Instant Alerts',
    desc: 'Automated entry/exit timestamps sent to parents with weekly progress dashboards.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: Bus,
    title: 'GPS AC Transport',
    tag: 'Doorstep Pickup',
    desc: 'Safe, air-conditioned bus network with live GPS parent tracking across Jaipur.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&h=450&fit=crop&auto=format'
  },
]

const offlinePrograms = [
  {
    title: 'International Boards',
    badge: 'Cambridge & IB',
    target: 'IGCSE · A Levels · IB MYP & DP',
    desc: 'Targeted batches focusing on mark schemes, past-paper dissection, and IA mentorship.',
    schedule: 'Mon – Fri (4:00 PM – 7:30 PM)',
    features: ['15-Year Past Marking Schemes', '1-on-1 IA Mentorship', 'Class Cap of 12 Students'],
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&h=450&fit=crop&auto=format',
    link: '/courses?category=IGCSE'
  },
  {
    title: 'JEE & NEET Integrated',
    badge: 'Competitive Hub',
    target: 'Classes 11, 12 & Droppers',
    desc: 'Conceptual clarity with daily practice problems, error analysis, and weekly mock exams.',
    schedule: 'Morning & Evening Batches',
    features: ['Level 1–3 Problem Sets', 'Full-Length CBT Testing', 'Personal Mentor Allocation'],
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=700&h=450&fit=crop&auto=format',
    link: '/courses?category=Competitive+Exams'
  },
  {
    title: 'CBSE Masterclass',
    badge: 'Board Excellence',
    target: 'Classes 9 to 12 (Science & Commerce)',
    desc: 'Rigorous NCERT line-by-line decoding, exemplar problems, and presentation mastery.',
    schedule: 'Mon – Sat (3:30 PM – 6:30 PM)',
    features: ['NCERT Solutions Kit', 'Monthly Mock Boards', 'Parent-Teacher Reviews'],
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&h=450&fit=crop&auto=format',
    link: '/courses?category=CBSE'
  },
  {
    title: 'Junior Foundation',
    badge: 'Olympiads',
    target: 'Classes 6, 7 & 8',
    desc: 'Nurturing non-routine mathematical thinking and logical aptitude for Olympiads & NTSE.',
    schedule: 'Weekend & Weekday Batches',
    features: ['Mental Agility & Speed Math', 'Science Demonstrations', 'Talent Search Training'],
    img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=700&h=450&fit=crop&auto=format',
    link: '/courses?category=Olympiads'
  }
]

const timetableSlots = [
  { batch: 'Morning Intensive Batch', time: '8:00 AM – 1:30 PM', audience: 'Droppers / Integrated College', focus: 'Daily 4 Lecture Hours + 1.5 Hr Supervised Practice' },
  { batch: 'Evening Foundation & Board', time: '3:30 PM – 7:30 PM', audience: 'Classes 8–12 School Students', focus: 'Daily 3 Lectures + 1 Hr Doubt Desk' },
  { batch: 'Weekend Masterclass', time: 'Sat & Sun (9:00 AM – 4:00 PM)', audience: 'Outstation & Boarding Students', focus: 'Deep Dive Modules + Full Mock Exam' },
]

export default async function OfflinePage() {
  const supabase = await createClient()

  const [facultyRes, carouselRes] = await Promise.allSettled([
    supabase.from('cms_faculty').select('*').eq('site_id', HODU_SITE_ID).order('sort_order'),
    supabase.from('cms_gallery').select('*').eq('site_id', HODU_SITE_ID).eq('category', 'Jaipur Campus Carousel').order('sort_order'),
  ])

  const dbFaculty = facultyRes.status === 'fulfilled' && facultyRes.value?.data ? facultyRes.value.data : []

  let campusSlides: any[] = [
    {
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=700&fit=crop&auto=format',
      mediaType: 'image',
    },
    {
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=700&fit=crop&auto=format',
      mediaType: 'image',
    },
    {
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=700&fit=crop&auto=format',
      mediaType: 'image',
    },
    {
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&h=700&fit=crop&auto=format',
      mediaType: 'image',
    },
  ]

  if (carouselRes.status === 'fulfilled' && carouselRes.value?.data && carouselRes.value.data.length > 0) {
    campusSlides = carouselRes.value.data.map(row => {
      let parsed: any = {}
      try { parsed = JSON.parse(row.caption ?? '{}') } catch {}
      const mediaInfo = parseMediaUrl(row.image_url ?? '')
      const mediaType = parsed.mediaType ?? (mediaInfo.type !== 'image' ? 'video' : 'image')
      const videoUrl = parsed.videoUrl ?? (mediaType === 'video' ? row.image_url : '')
      return {
        image: row.image_url,
        mediaType,
        videoUrl,
      }
    })
  }

  return (
    <div className="space-y-0 animate-fade-in bg-brand-bg text-brand-text">
      
      {/* ─── Top Jaipur Campus Banner Carousel (Identical to Homepage) ─── */}
      <HomeHeroCarousel initialSlides={campusSlides} />

      {/* Campus Infrastructure */}
      <section className="py-16 sm:py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3">
                FACILITIES
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon tracking-tight">
                Campus Infrastructure
              </h2>
              <p className="text-sm text-brand-muted mt-2 max-w-xl mx-auto leading-relaxed">
                Designed for concentration, collaboration, and individual faculty access.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campusFacilities.map((item, idx) => {
              const IconComp = item.icon
              return (
                <ScrollReveal key={item.title} animation="fade-up" delay={idx * 80} className="h-full">
                  <div className="rounded-2xl border border-brand-border bg-white shadow-xs hover:border-brand-maroon hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
                    
                    {/* Photo Top */}
                    <div className="relative h-44 overflow-hidden border-b border-brand-border">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-brand-maroon text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded">
                        {item.tag}
                      </span>
                    </div>

                    {/* Text Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <IconComp className="h-4 w-4 text-brand-maroon shrink-0" />
                          <h3 className="font-bold text-brand-text text-base">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-xs text-brand-muted leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Offline Classroom Programs */}
      <section className="py-16 sm:py-20 bg-brand-blush border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3">
                COHORTS
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon tracking-tight">
                Classroom Programs
              </h2>
              <p className="text-sm text-brand-muted mt-2 max-w-lg mx-auto">
                Structured modules, regular testing, and individual mentoring.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-7">
            {offlinePrograms.map((prog, idx) => (
              <ScrollReveal key={prog.title} animation="fade-up" delay={idx * 90} className="h-full">
                <div className="bg-white border border-brand-border rounded-2xl overflow-hidden shadow-xs hover:border-brand-maroon hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
                  
                  <div className="h-44 relative overflow-hidden border-b border-brand-border">
                    <img src={prog.img} alt={prog.title} className="w-full h-full object-cover transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-brand-maroon text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded">
                      {prog.badge}
                    </span>
                  </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-maroon uppercase tracking-wider block">{prog.target}</span>
                    <h3 className="font-serif-editorial font-bold text-xl text-brand-text mt-1 mb-2">{prog.title}</h3>
                    <p className="text-xs text-brand-muted leading-relaxed mb-4">{prog.desc}</p>
                    
                    <div className="bg-brand-bg border border-brand-border rounded-lg p-3 text-xs mb-4">
                      <span className="font-semibold text-brand-text block">Batch Timing:</span>
                      <span className="text-brand-maroon font-bold">{prog.schedule}</span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-brand-border">
                      {prog.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-brand-muted">
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-maroon shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-brand-border">
                    <Link href={prog.link}
                      className="w-full bg-brand-maroon hover:bg-brand-crimson text-white font-semibold py-2.5 px-4 rounded-lg text-center flex items-center justify-center gap-2 text-xs transition-colors">
                      <span>Reserve Seat</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
          </div>
        </div>
      </section>

      {/* Batch Timetable Matrix */}
      <section className="reveal py-16 sm:py-20 bg-brand-bg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3">
              SCHEDULE
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon">
              Batch Schedules
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-2">Morning, evening, and weekend slots available.</p>
          </div>

          <div className="border border-brand-border rounded-2xl overflow-hidden bg-white shadow-xs">
            <div className="divide-y divide-brand-border">
              {timetableSlots.map((slot, i) => (
                <div key={i} className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-brand-bg/50 transition-colors">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-brand-maroon uppercase tracking-wider block">{slot.audience}</span>
                    <h3 className="font-bold text-base text-brand-text">{slot.batch}</h3>
                    <p className="text-xs text-brand-muted">{slot.focus}</p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 bg-brand-maroon text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
                      <Clock className="h-3.5 w-3.5" />
                      {slot.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Walkthrough Booking & Consultation */}
      <section id="visit-form" className="reveal py-16 sm:py-20 bg-white border-t border-brand-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-block bg-brand-maroon text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
              VISIT US
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon leading-tight">
              Book a Guided Campus Walkthrough
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Visit our Jaipur centre to inspect classrooms, meet faculty heads, and take a free diagnostic evaluation.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-brand-border bg-brand-bg">
                <MapPin className="h-4 w-4 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-brand-text block">Jaipur Main Center</span>
                  <span className="text-xs text-brand-muted">{HODU.address}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-brand-border bg-brand-bg">
                <Phone className="h-4 w-4 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-brand-text block">Admissions Desk</span>
                  <span className="text-xs text-brand-muted">{HODU.phone}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-brand-border bg-brand-bg">
                <Calendar className="h-4 w-4 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-brand-text block">Visiting Hours</span>
                  <span className="text-xs text-brand-muted">Monday to Sunday · 8:00 AM to 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-brand-bg border border-brand-border rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif-editorial font-bold text-brand-maroon text-xl mb-1">Schedule Visit</h3>
              <p className="text-xs text-brand-muted mb-6">Enter your details and we'll confirm your slot.</p>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
