import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import Link from 'next/link'
import {
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  Calendar,
  Bus,
  BookOpen,
  Building2,
  ArrowRight,
  Laptop,
  Smartphone,
  Target,
  School,
  Sparkles,
  Award,
  Users,
  Shield,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import ScrollReveal from '@/components/hodu/ScrollReveal'
import HomeHeroCarousel from '@/components/hodu/HomeHeroCarousel'
import { parseMediaUrl } from '@/lib/homeCarousel'
import { normalizeImageUrl } from '@/lib/imageUtils'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Offline Coaching Jaipur — Hodu Academy Classroom Programs | IGCSE, IB, CBSE, JEE, NEET',
  description: 'Join Hodu Academy’s state-of-the-art offline coaching centre in Jaipur. Smart digital classrooms, 1:12 batch sizes, 1-on-1 daily doubt cells, and GPS AC transport.',
}

const ICON_MAP: Record<string, any> = {
  School,
  Target,
  BookOpen,
  Laptop,
  Smartphone,
  Bus,
  Sparkles,
  Building2,
  Users,
  Award,
  Clock,
  Shield,
  MapPin,
  CheckCircle2,
}

const defaultCampusFacilities = [
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

  const [facultyRes, carouselRes, facilitiesRes, videoRes] = await Promise.allSettled([
    supabase.from('cms_faculty').select('*').eq('site_id', HODU_SITE_ID).order('sort_order'),
    supabase.from('cms_gallery').select('*').eq('site_id', HODU_SITE_ID).eq('category', 'Jaipur Campus Carousel').order('sort_order'),
    supabase.from('cms_gallery').select('*').eq('site_id', HODU_SITE_ID).eq('category', 'Jaipur Campus Facilities').order('sort_order'),
    supabase.from('cms_gallery').select('*').eq('site_id', HODU_SITE_ID).eq('category', 'Jaipur Campus Video').limit(1).maybeSingle(),
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

  // Dynamic Video Tour URL
  let videoEmbedUrl = 'https://www.youtube-nocookie.com/embed/Z3Gm-LVcB-E?rel=0&modestbranding=1&playsinline=1'
  if (videoRes.status === 'fulfilled' && videoRes.value?.data) {
    try {
      const vData = videoRes.value.data
      const parsed = typeof vData.caption === 'string' ? JSON.parse(vData.caption) : (vData.caption || {})
      const rawUrl = parsed.videoUrl || vData.image_url || ''
      const mediaInfo = parseMediaUrl(rawUrl)
      if (mediaInfo.type === 'youtube' && mediaInfo.embedUrl) {
        videoEmbedUrl = mediaInfo.embedUrl
      } else if (mediaInfo.type === 'google_drive' && mediaInfo.embedUrl) {
        videoEmbedUrl = mediaInfo.embedUrl
      }
    } catch {}
  }

  // Dynamic Facilities Cards
  let activeFacilities = defaultCampusFacilities
  if (facilitiesRes.status === 'fulfilled' && facilitiesRes.value?.data && facilitiesRes.value.data.length > 0) {
    activeFacilities = facilitiesRes.value.data.map(row => {
      let parsed: any = {}
      try { parsed = JSON.parse(row.caption ?? '{}') } catch {}
      const IconComponent = ICON_MAP[parsed.iconName] || School
      return {
        icon: IconComponent,
        title: parsed.title || row.title || 'Campus Facility',
        tag: parsed.tag || 'FACILITIES',
        desc: parsed.desc || '',
        image: row.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=450&fit=crop&auto=format',
      }
    })
  }

  return (
    <div className="space-y-0 animate-fade-in bg-brand-bg text-brand-text">
      
      {/* ─── Top Jaipur Campus Banner Carousel (Identical to Homepage) ─── */}
      <HomeHeroCarousel initialSlides={campusSlides} />

      {/* ─── Video Section: Jaipur Campus Experience / Virtual Tour ─── */}
      <section className="relative py-12 sm:py-16 bg-white border-b border-brand-border/60 overflow-hidden">
        {/* Subtle ambient backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-brand-maroon/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 space-y-2">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-maroon tracking-tight">
                Experience Hodu Academy Jaipur Campus
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                Take an inside look at our smart interactive classrooms, 1-on-1 daily doubt cells, silent library, and vibrant learning atmosphere.
              </p>
            </div>

            {/* Video Player Frame with Cinema Border & Glow */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-brand-maroon/20 bg-black aspect-video max-w-5xl mx-auto group">
              <iframe
                src={videoEmbedUrl}
                title="Hodu Academy Jaipur Campus Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Choose Hodu Academy */}
      <section className="py-16 sm:py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3">
                WHY HODU
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon tracking-tight">
                Why Choose Hodu Academy
              </h2>
              <p className="text-sm text-brand-muted mt-2 max-w-xl mx-auto leading-relaxed">
                Designed for concentration, collaboration, and individual faculty access.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeFacilities.map((item, idx) => {
              const IconComp = item.icon
              return (
                <ScrollReveal key={idx} animation="fade-up" delay={idx * 80} className="h-full">
                  <div className="rounded-2xl border border-brand-border bg-white shadow-xs hover:border-brand-maroon hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
                    
                    {/* Photo Top */}
                    <div className="relative h-44 overflow-hidden border-b border-brand-border">
                      <img
                        src={normalizeImageUrl(item.image)}
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
                PROGRAMS
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon tracking-tight">
                Offline Classroom Batches
              </h2>
              <p className="text-sm text-brand-muted mt-2 max-w-xl mx-auto leading-relaxed">
                Small batch sizes of maximum 12 students with personal faculty attention.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {offlinePrograms.map((prog, idx) => (
              <ScrollReveal key={prog.title} animation="fade-up" delay={idx * 100} className="h-full">
                <div className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-xs hover:shadow-xl hover:border-brand-maroon/50 transition-all duration-300 flex flex-col justify-between h-full group">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={prog.img}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute top-4 left-4 bg-brand-maroon text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                      {prog.badge}
                    </span>
                    <span className="absolute bottom-4 left-4 text-white text-xs font-medium bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded">
                      {prog.schedule}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif-editorial text-xl font-bold text-brand-text group-hover:text-brand-maroon transition-colors">
                        {prog.title}
                      </h3>
                      <p className="text-xs font-bold text-brand-crimson mt-0.5">{prog.target}</p>
                      <p className="text-xs text-brand-muted leading-relaxed mt-2">{prog.desc}</p>
                      
                      <div className="mt-4 space-y-1.5 border-t border-brand-border/60 pt-3">
                        {prog.features.map(f => (
                          <div key={f} className="flex items-center gap-2 text-xs text-brand-text">
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand-maroon shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
                      <Link
                        href={prog.link}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-maroon hover:text-brand-crimson group-hover:translate-x-1 transition-all"
                      >
                        <span>View Batch Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                      <Link
                        href={`/enroll?program=${encodeURIComponent(prog.title)}`}
                        className="bg-brand-maroon text-white hover:bg-brand-crimson text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Classroom Faculty Mentors */}
      {dbFaculty.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-12 sm:mb-16">
                <span className="inline-block bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3">
                  MENTORS
                </span>
                <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon tracking-tight">
                  Meet Your Classroom Faculty
                </h2>
                <p className="text-sm text-brand-muted mt-2 max-w-xl mx-auto leading-relaxed">
                  Learn directly from master educators with over 15+ years of proven teaching pedigree.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dbFaculty.map((f: any, idx: number) => (
                <ScrollReveal key={f.id} animation="fade-up" delay={idx * 60}>
                  <div className="bg-brand-blush/40 border border-brand-border rounded-2xl p-5 text-center flex flex-col items-center hover:border-brand-maroon/40 transition-all duration-300">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-2 border-brand-border bg-white shadow-xs">
                      {f.photo_url ? (
                        <img
                          src={normalizeImageUrl(f.photo_url)}
                          alt={f.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-brand-maroon bg-brand-blush">
                          {f.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-brand-text text-sm">{f.name}</h3>
                    <p className="text-xs text-brand-maroon font-semibold mt-0.5">{f.subject}</p>
                    <p className="text-[11px] text-brand-muted mt-1">{f.experience} Experience</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Daily Schedule & Timetable Slots */}
      <section className="py-16 sm:py-20 bg-brand-bg border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-block bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3">
                TIMETABLE
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon tracking-tight">
                Daily Batch Schedules
              </h2>
              <p className="text-sm text-brand-muted mt-2 max-w-xl mx-auto leading-relaxed">
                Structured timetable designed to balance deep concept lectures with supervised problem solving.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {timetableSlots.map((slot, idx) => (
              <ScrollReveal key={slot.batch} animation="fade-up" delay={idx * 80}>
                <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-xs hover:border-brand-maroon/40 transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-center gap-2 text-brand-maroon mb-2">
                      <Clock size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">{slot.time}</span>
                    </div>
                    <h3 className="font-bold text-brand-text text-base">{slot.batch}</h3>
                    <p className="text-xs text-brand-crimson font-medium mt-1">{slot.audience}</p>
                    <p className="text-xs text-brand-muted mt-3 leading-relaxed border-t border-brand-border/60 pt-3">
                      {slot.focus}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Book a Campus Visit / Enquiry Form */}
      <section className="py-16 sm:py-24 bg-brand-maroon text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-crimson/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block bg-white/15 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                VISIT US IN PERSON
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                Book a 1-on-1 Academic Counseling & Campus Tour
              </h2>
              <p className="text-sm text-brand-blush/90 leading-relaxed max-w-lg">
                Meet our senior faculty, tour the smart classrooms and silent library, and get a personalized diagnostic roadmap for your target exams.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-blush shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Campus Address</h4>
                    <p className="text-xs text-brand-blush/80 mt-0.5 leading-relaxed">{HODU.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-brand-blush shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-white">Admissions Helpline</h4>
                    <p className="text-xs text-brand-blush/80 mt-0.5">{HODU.phone} (10 AM – 7 PM)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 text-brand-text shadow-2xl border border-brand-border">
                <div className="mb-6">
                  <h3 className="font-serif-editorial text-xl font-bold text-brand-maroon">
                    Request Campus Visit Pass
                  </h3>
                  <p className="text-xs text-brand-muted mt-1">
                    Fill in your details below and our counseling desk will schedule your slot.
                  </p>
                </div>
                <EnquiryForm />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
