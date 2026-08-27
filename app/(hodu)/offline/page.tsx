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
  Crown,
  GraduationCap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import ScrollReveal from '@/components/hodu/ScrollReveal'
import HomeHeroCarousel from '@/components/hodu/HomeHeroCarousel'
import CampusFacilitiesSection from '@/components/hodu/CampusFacilitiesSection'
import LifeAtHoduCarousel from '@/components/hodu/LifeAtHoduCarousel'
import { parseMediaUrl } from '@/lib/homeCarousel'
import { normalizeImageUrl } from '@/lib/imageUtils'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Offline Coaching Jaipur — Hodu Academy Classroom Programs | IGCSE, IB, CBSE, JEE, NEET',
  description: 'Join Hodu Academy’s state-of-the-art offline coaching centre in Jaipur. Smart digital classrooms, 1:12 batch sizes, 1-on-1 daily doubt cells, and GPS AC transport.',
}

const defaultLifePhotos = [
  { image_url: 'https://lh3.googleusercontent.com/d/1rgiHyqvgevfO3g6T6-kJhYdQ5BrU6xB1', alt: 'Classroom interaction and lectures' },
  { image_url: 'https://lh3.googleusercontent.com/d/12ZQ2kfYVjY-alMbjzWviy8iBnHgoAq-8', alt: 'Weekly testing session' },
  { image_url: 'https://lh3.googleusercontent.com/d/1Ca0vKdYR61b0YMnjS42WBDmkpa9sgs1E', alt: '1-on-1 Mentorship consultation' },
  { image_url: 'https://lh3.googleusercontent.com/d/18tdedQrdhO5BQQMWIRchERq6aiXFA3RM', alt: 'Student focus & study hour' },
  { image_url: 'https://lh3.googleusercontent.com/d/1dn3qBCGLr4BtDZDBvwfPWroUxVhj-RmJ', alt: 'Faculty doubt solving booth' },
  { image_url: 'https://lh3.googleusercontent.com/d/1LIJ_8cC195zVM1PxRYEnLFXp4xYHuZB5', alt: 'Group collaborative learning' },
  { image_url: '/api/proxy-image?id=1T76yiwQqRAkaeYXamomDKHGiPdGiYXDJ', alt: 'Campus classroom' },
  { image_url: '/api/proxy-image?id=12b7XFLX6oMJ_f6sT9rnlYmkt0gx9ieAe', alt: 'Campus learning' },
  { image_url: '/api/proxy-image?id=1YtfUVVgT46kGZ3EeNM2O3U36FrhgXoRG', alt: 'Academic hub' },
]

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
    iconName: 'School',
    title: 'Smart Classrooms',
    tag: 'Acoustic Treated',
    desc: '85-inch interactive touchscreens, digital visualizers, and ergonomic seating.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=450&fit=crop&auto=format',
  },
  {
    iconName: 'Target',
    title: '1-on-1 Doubt Desks',
    tag: 'Daily 4:00 – 7:30 PM',
    desc: 'Private consultation booths for subject masters to resolve queries line-by-line.',
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=700&h=450&fit=crop&auto=format',
  },
  {
    iconName: 'BookOpen',
    title: 'Silent Library',
    tag: '8 AM – 9 PM',
    desc: 'Air-conditioned study carrels with 15+ years of Cambridge, IB, CBSE & JEE archives.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&h=450&fit=crop&auto=format',
  },
  {
    iconName: 'Laptop',
    title: 'CBT Testing Lab',
    tag: 'Simulated Exams',
    desc: 'High-speed desktop terminals replicating real NTA JEE Main, NEET & Cambridge exams.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&h=450&fit=crop&auto=format',
  },
  {
    iconName: 'Smartphone',
    title: 'Biometric Attendance',
    tag: 'Instant Alerts',
    desc: 'Automated entry/exit timestamps sent to parents with weekly progress dashboards.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&h=450&fit=crop&auto=format',
  },
  {
    iconName: 'Bus',
    title: 'GPS AC Transport',
    tag: 'Doorstep Pickup',
    desc: 'Safe, air-conditioned bus network with live GPS parent tracking across Jaipur.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&h=450&fit=crop&auto=format',
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

  const [facultyRes, carouselRes, facilitiesRes, videoRes, lifePhotosRes] = await Promise.allSettled([
    supabase.from('cms_faculty').select('*').eq('site_id', HODU_SITE_ID).order('sort_order'),
    supabase.from('cms_gallery').select('*').eq('site_id', HODU_SITE_ID).eq('category', 'Jaipur Campus Carousel').order('sort_order'),
    supabase.from('cms_gallery').select('*').eq('site_id', HODU_SITE_ID).eq('category', 'Jaipur Campus Facilities').order('sort_order'),
    supabase.from('cms_gallery').select('*').eq('site_id', HODU_SITE_ID).eq('category', 'Jaipur Campus Video').limit(1).maybeSingle(),
    supabase.from('cms_gallery').select('*').eq('site_id', HODU_SITE_ID).in('category', ['Life at Hodu Academy', 'Life at Hodu', 'PTM Gallery']).order('sort_order'),
  ])

  const dbFaculty = facultyRes.status === 'fulfilled' && facultyRes.value?.data ? facultyRes.value.data : []

  // Split Directors vs Faculty
  const dbDirectors = dbFaculty.filter((f: any) => f.role === 'Director' || f.subject?.toLowerCase().includes('director'))
  const dbFacultyMembers = dbFaculty.filter((f: any) => f.role !== 'Director' && !f.subject?.toLowerCase().includes('director'))

  // 3 Directors Placeholders / DB Cards
  const defaultDirectors = [
    {
      id: 'dir-placeholder-1',
      name: 'Mr. VP singh',
      subject: 'MNIT, JAIPUR',
      experience: '25+ years of teaching experience',
      bio: 'With over 25 years of experience, Mr. V.P. Singh has mentored more than 10,000 students, guiding them to success in JEE, NEET, and board exams.',
      photo_url: '',
      role: 'Director',
    },
    {
      id: 'dir-placeholder-2',
      name: 'Mr. Rohit Jain',
      subject: 'MNIT, JAIPUR',
      experience: '15+ years of teaching experience',
      bio: 'Mentored 6,000+ students with top ranks in JEE, NEET, and international curriculums like IGCSE and IB. B.Tech graduate from MNIT Jaipur.',
      photo_url: '',
      role: 'Director',
    },
    {
      id: 'dir-placeholder-3',
      name: 'Mr. Abhishek Agarwal',
      subject: 'IIIT - Hyderabad',
      experience: 'Palantir, Ex-Qualcomm',
      bio: 'IIIT Hyderabad graduate, ex-Palantir & Qualcomm engineer driving pedagogical innovation, testing labs, and curriculum delivery.',
      photo_url: '',
      role: 'Director',
    },
  ]

  const activeDirectors = [
    ...dbDirectors,
    ...defaultDirectors.slice(dbDirectors.length),
  ].slice(0, 3)

  const activeFacultyMembers = dbFacultyMembers.length > 0 ? dbFacultyMembers : dbFaculty

  // Dynamic Life at Hodu Photos
  let activeLifePhotos = defaultLifePhotos
  if (lifePhotosRes.status === 'fulfilled' && lifePhotosRes.value?.data && lifePhotosRes.value.data.length > 0) {
    const lifeOnly = lifePhotosRes.value.data.filter((row: any) => 
      row.category === 'Life at Hodu Academy' || row.category === 'Life at Hodu'
    )
    const listToUse = lifeOnly.length > 0 ? lifeOnly : lifePhotosRes.value.data
    activeLifePhotos = listToUse.map((row: any) => ({
      id: row.id,
      image_url: row.image_url,
      alt: row.caption || 'Life at Hodu Academy',
    }))
  }

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
  let videoEmbedUrl = 'https://www.youtube-nocookie.com/embed/Z3Gm-LVcB-E?rel=0&modestbranding=1&playsinline=1&controls=1'
  if (videoRes.status === 'fulfilled' && videoRes.value?.data) {
    try {
      const vData = videoRes.value.data
      const parsed = typeof vData.caption === 'string' ? JSON.parse(vData.caption) : (vData.caption || {})
      const rawUrl = (parsed.videoUrl || vData.image_url || '').trim()
      const ytMatch = rawUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
      if (ytMatch?.[1]) {
        videoEmbedUrl = `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1&playsinline=1&controls=1`
      } else if (rawUrl.includes('drive.google.com')) {
        const driveMatch = rawUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) || rawUrl.match(/drive\.google\.com\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/)
        if (driveMatch?.[1]) {
          videoEmbedUrl = `https://drive.google.com/file/d/${driveMatch[1]}/preview`
        }
      }
    } catch {}
  }

  // Dynamic Facilities Cards
  let activeFacilities = defaultCampusFacilities
  if (facilitiesRes.status === 'fulfilled' && facilitiesRes.value?.data && facilitiesRes.value.data.length > 0) {
    activeFacilities = facilitiesRes.value.data.map(row => {
      let parsed: any = {}
      try { parsed = JSON.parse(row.caption ?? '{}') } catch {}
      return {
        iconName: parsed.iconName || 'School',
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
      <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 bg-white border-b border-brand-border/60 overflow-hidden">
        {/* Subtle ambient backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-brand-maroon/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 space-y-2">
              <h2 className="font-serif-editorial text-xl sm:text-3xl lg:text-4xl font-bold text-brand-maroon tracking-tight leading-snug sm:leading-tight px-1">
                Experience Hodu Academy Jaipur Campus
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed max-w-xl mx-auto">
                Take an inside look at our smart interactive classrooms, 1-on-1 daily doubt cells, silent library, and vibrant learning atmosphere.
              </p>
            </div>

            {/* Video Player Frame with Cinema Border & Glow */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl border-2 border-brand-maroon/20 bg-black aspect-video max-w-5xl mx-auto w-full group">
              <iframe
                src={videoEmbedUrl}
                title="Hodu Academy Jaipur Campus Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Choose Hodu Academy */}
      <section className="py-16 sm:py-20 bg-brand-bg overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon tracking-tight">
                Why Choose Hodu Academy
              </h2>
              <p className="text-sm text-brand-muted mt-2 max-w-xl mx-auto leading-relaxed">
                Designed for concentration, collaboration, and individual faculty access.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Full-bleed Expanded Horizontal Track */}
        <div className="w-full">
          <ScrollReveal animation="fade-up" delay={100}>
            <CampusFacilitiesSection facilities={activeFacilities} />
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Life at Hodu Academy Section ─── */}
      <section className="py-16 sm:py-24 bg-brand-blush border-y border-brand-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon tracking-tight">
                  Life at Hodu Academy
                </h2>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  Glimpses of daily classroom sessions, interactive problem-solving, celebrations, and vibrant campus moments.
                </p>
              </div>

              <Link
                href="/ptm"
                className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-crimson text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md shrink-0 group cursor-pointer"
              >
                <span>Explore gallery for more</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* Pure Image Carousel without Text */}
        <div className="w-full">
          <ScrollReveal animation="fade-up" delay={100}>
            <LifeAtHoduCarousel photos={activeLifePhotos} />
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Academic Leadership & Classroom Faculty ─── */}
      <section className="py-16 sm:py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
                Our Top Faculty & Leadership
              </h2>
              <div className="w-16 h-1 bg-brand-maroon mx-auto mt-3 rounded-full" />
              <p className="text-sm text-brand-muted mt-3 max-w-xl mx-auto leading-relaxed">
                Guided by experienced educators and taught by master subject specialists with proven pedagogical pedigree.
              </p>
            </div>
          </ScrollReveal>

          {/* ─── 1. Three Directors Spotlight (Clean & Simple Cards) ─── */}
          <div className="mb-14 sm:mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {activeDirectors.map((dir: any, idx: number) => (
                <ScrollReveal key={dir.id || idx} animation="fade-up" delay={idx * 80}>
                  <div className="bg-white border-2 border-brand-maroon rounded-2xl p-6 sm:p-7 text-center shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between items-center h-full group">
                    <div className="w-full flex flex-col items-center">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-4 bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0 shadow-xs">
                        {dir.photo_url ? (
                          <img
                            src={normalizeImageUrl(dir.photo_url)}
                            alt={dir.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center font-serif-editorial font-bold text-brand-maroon bg-brand-blush">
                            <Crown size={24} className="text-brand-maroon mb-0.5 opacity-80" />
                            <span className="text-[10px] font-sans tracking-widest font-bold">DIRECTOR</span>
                          </div>
                        )}
                      </div>

                      <h3 className="font-serif-editorial text-lg sm:text-xl font-bold text-brand-maroon">
                        {dir.name}
                      </h3>
                      <p className="text-sm sm:text-base font-bold text-[#1B2A44] mt-1">
                        {dir.subject}
                      </p>
                      {dir.experience && (
                        <p className="text-xs sm:text-sm text-[#475569] font-medium mt-1">
                          {dir.experience}
                        </p>
                      )}
                    </div>

                    {dir.bio && (
                      <p className="text-xs text-neutral-600 leading-relaxed mt-4 pt-3 border-t border-neutral-100 w-full text-left">
                        {dir.bio}
                      </p>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* ─── 2. Classroom Faculty Mentors (Clean & Simple Cards) ─── */}
          {activeFacultyMembers.length > 0 && (
            <div>
              <div className="text-center mb-8 sm:mb-10">
                <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-neutral-900">
                  Our Classroom Faculty
                </h3>
                <div className="w-12 h-1 bg-brand-maroon mx-auto mt-2 rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeFacultyMembers.map((f: any, idx: number) => (
                  <ScrollReveal key={f.id || idx} animation="fade-up" delay={(idx % 6) * 60}>
                    <div className="bg-white border-2 border-brand-maroon rounded-2xl p-6 text-center shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between items-center h-full group">
                      <div className="w-full flex flex-col items-center">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mx-auto mb-3.5 bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0 shadow-xs">
                          {f.photo_url ? (
                            <img
                              src={normalizeImageUrl(f.photo_url)}
                              alt={f.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-base text-brand-maroon bg-brand-blush">
                              {f.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <h4 className="font-serif-editorial text-base sm:text-lg font-bold text-brand-maroon">
                          {f.name}
                        </h4>
                        <p className="text-xs sm:text-sm font-bold text-[#1B2A44] mt-0.5">
                          {f.subject}
                        </p>
                        {f.experience && (
                          <p className="text-[11px] font-semibold text-brand-crimson mt-0.5">
                            {f.experience} Experience
                          </p>
                        )}
                      </div>

                      {f.bio && (
                        <p className="text-xs text-neutral-600 leading-relaxed mt-3 pt-2.5 border-t border-neutral-100 w-full text-left line-clamp-4">
                          {f.bio}
                        </p>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

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
