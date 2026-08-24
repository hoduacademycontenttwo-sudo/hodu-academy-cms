import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Trophy,
  Phone,
  CheckCircle2,
  Award,
  BookOpen,
  Users,
  GraduationCap,
  Building2,
  MapPin,
  Atom,
  Dna,
  Compass,
  Sparkles,
  HelpCircle,
  Clock,
  Laptop,
} from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import HomeHeroCarousel from '@/components/hodu/HomeHeroCarousel'
import ScrollReveal from '@/components/hodu/ScrollReveal'
import BatchHoverCard, { CurriculumTrack } from '@/components/hodu/BatchHoverCard'
import BatchCardsCarousel from '@/components/hodu/BatchCardsCarousel'
import FeatureCardsCarousel from '@/components/hodu/FeatureCardsCarousel'
import ResultRankerCard from '@/components/hodu/ResultRankerCard'
import ResultsMarqueeCarousel from '@/components/hodu/ResultsMarqueeCarousel'
import { parseCarouselRows } from '@/lib/homeCarousel'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Hodu Academy — Premier Coaching for Cambridge IGCSE, IB, CBSE, JEE & NEET | Jaipur',
  description: 'Jaipur’s premier coaching institute for Cambridge IGCSE, IB Diploma, CBSE Class 9-12, IIT-JEE, and NEET. Small 1:12 interactive batches, daily doubt desks, and top faculty.',
}

const curriculumTracks = [
  {
    tag: 'CAMBRIDGE IGCSE & A-LEVELS',
    title: 'Cambridge International Program',
    grades: 'Grades 8 to 12 · IGCSE / AS & A Levels',
    desc: 'Targeted coaching for Extended Math, Physics, Chemistry, Biology & Economics with 15-year past paper mastery and command-word marking rubrics.',
    features: ['Past 15 Years Question Bank Decoded', 'Command Word Marking Rubrics', 'Individual Coursework & IA Review', 'Intimate 1:12 Batch Size'],
    href: '/courses?category=IGCSE',
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'INTERNATIONAL BACCALAUREATE',
    title: 'IB Diploma (MYP & DP) Batch',
    grades: 'MYP 4–5 & DP 1–2',
    desc: 'Deep conceptual training across HL & SL subjects with dedicated Internal Assessment (IA), Extended Essay (EE), and TOK guidance by examiner-mentors.',
    features: ['Criterion-Referenced Rubrics Mastery', 'Internal Assessment (IA) Mentorship', 'Extended Essay (EE) & TOK Support', 'Regular Past Exam Simulations'],
    href: '/courses?category=IB',
    img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'PRE-ENGINEERING & MEDICAL',
    title: 'IIT-JEE & NEET-UG 2-Year Batch',
    grades: 'Classes 11, 12 & Dropper Intensive',
    desc: 'Comprehensive syllabus coverage with Daily Practice Problems (DPPs), error analysis logs, and weekly All-India rank simulation mock exams.',
    features: ['Daily 30-Question DPPs with Review', 'Computer-Based Test (CBT) Labs', 'Level 1–3 Problem Solving Kits', 'Daily 1-on-1 Faculty Doubt Desk'],
    href: '/courses?category=Competitive+Exams',
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'NATIONAL CURRICULUM',
    title: 'CBSE Board Masterclass (9th–12th)',
    grades: 'Classes 9, 10, 11 & 12 (Science & Commerce)',
    desc: 'Line-by-line NCERT decoding, exemplar solutions, competency-based questions, and board exam answer presentation workshops for 95%+ targets.',
    features: ['Line-by-Line NCERT Decoding', 'Competency & Case-Based Question Kits', 'Specialized Board Answer Writing Sessions', 'Monthly Mock Board Series'],
    href: '/courses?category=CBSE',
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'FOUNDATION & TALENT',
    title: 'Junior Olympiads & Aptitude Track',
    grades: 'Classes 6, 7 & 8',
    desc: 'Early competitive aptitude building, speed math, non-routine problem solving, and science fundamentals for IMO, NSO, and PRMO exams.',
    features: ['Speed Math & Mental Agility Drills', 'Hands-on Science Demonstrations', 'Olympiad & Talent Search Preparation', 'Strong STEM Foundation'],
    href: '/courses?category=Olympiads',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'JAIPUR OFFLINE CAMPUS',
    title: 'Jaipur Physical Classroom Batches',
    grades: 'All Curriculums · Vaishali Extension',
    desc: 'Study at our modern air-conditioned learning center in Jaipur with smart digital boards, silent reference library, and daily 1-on-1 doubt desks.',
    features: ['Acoustic Smart Classrooms', 'Dedicated 1-on-1 Faculty Doubt Desks', 'Silent Library (8 AM – 9 PM)', 'Doorstep AC GPS Transport'],
    href: '/offline',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=320&fit=crop&auto=format'
  }
]

const learningFeatures = [
  {
    title: 'Structured Courses',
    subtitle: 'Master every subject, step by step',
    image: '/images/features/structured-courses.png',
  },
  {
    title: 'Video Lectures',
    subtitle: '1000+ videos made easy to follow',
    image: '/images/features/video-lectures.png',
  },
  {
    title: 'Smart Notes',
    subtitle: 'Exam-ready notes, explained simply',
    image: '/images/features/smart-notes.png',
  },
  {
    title: 'Tests & Quizzes',
    subtitle: 'Instant analytics after every attempt',
    image: '/images/features/tests-quizzes.png',
  },
]

const toppers = [
  { initials: 'AK', name: 'Aryan Kapoor',   score: 'JEE AIR 142',    stream: 'JEE Advanced',  school: 'Jayshree Periwal High School', pct: '99.4%' },
  { initials: 'PS', name: 'Priya Sharma',   score: 'IGCSE 8x A*',    stream: 'Cambridge IGCSE', school: 'Neerja Modi School',  pct: '8x A*' },
  { initials: 'RV', name: 'Rohit Verma',    score: 'NEET AIR 287',   stream: 'NEET UG',       school: 'DPS Jaipur',            pct: '710/720' },
  { initials: 'SM', name: 'Sneha Mehta',    score: 'IB DP 44/45',    stream: 'IB Diploma',    school: 'Sanskar School',        pct: '44/45' },
  { initials: 'KS', name: 'Karan Singh',    score: 'IMO Gold Medal', stream: 'Olympiad',      school: 'Seedling Public',       pct: 'AIR 4' },
  { initials: 'DG', name: 'Divya Gupta',    score: 'CBSE 99.2%',     stream: 'Class 12 Board', school: 'MGD Girls School',     pct: '99.2%' },
]

const testimonials = [
  { initials: 'RM', name: 'Rohan Malhotra',   score: '98.2% CBSE · Olympiad Rank 38', text: 'The structured approach at Hodu helped me transition smoothly from standard school exams to high-percentile competitive testing. The faculty is genuinely invested in every single student.' },
  { initials: 'AS', name: 'Aishwarya Sharma', score: '96.8% CBSE · Math 100/100',     text: 'Physics and Math lectures broke down tough multi-step problems into clean formulas. The shortcut methods saved me over 25 minutes in my final board exams.' },
  { initials: 'KP', name: 'Karan Patel',      score: 'IGCSE 8x A* Marks',    text: 'Past-paper drills and mark scheme dissection gave me complete confidence. I knew exactly how examiners award marks across Physics, Chemistry, Math, and Economics.' },
]

const faqs = [
  { q: 'What boards and curricula does Hodu Academy teach?', a: 'Hodu Academy specializes in Cambridge International (IGCSE & A-Levels), International Baccalaureate (IB MYP & DP), CBSE Board (Classes 9 to 12 Science & Commerce), IIT-JEE (Main & Advanced), NEET-UG, and Junior Olympiads (IMO, NSO).' },
  { q: 'Are classes conducted offline in Jaipur or online?', a: 'Both! Our flagship physical campus is in Jaipur (Vaishali Extension) with air-conditioned smart classrooms, a dedicated doubt library, and testing facilities. We also conduct live online interactive micro-batches for global students.' },
  { q: 'What is the batch size at Hodu Academy?', a: 'To ensure genuine personal attention, all our batches are strictly capped at 12 to 15 students. This allows mentors to track every student’s conceptual progress individually.' },
  { q: 'What study materials and practice tests are provided?', a: 'Enrolled students receive comprehensive chapter booklets, Daily Practice Problems (DPPs), past 15-year board question banks, and bi-weekly simulated mock test papers with detailed analytical reports.' },
  { q: 'How are doubts resolved outside regular lectures?', a: 'We run dedicated daily 1-on-1 doubt desks with senior faculty members from 4:00 PM to 7:30 PM, along with instant WhatsApp and LMS doubt resolution.' },
]

export default async function HomePage() {
  let home: any = null
  let notices: any[] = []
  let results: any[] = []
  let carouselRows: any[] = []
  let dbTestimonials: any[] = []
  let dbBatches: any[] = []

  try {
    const supabase = await createClient()
    const [hRes, nRes, rRes, cRes, tRes, bRes] = await Promise.allSettled([
      supabase.from('cms_home_sections').select('*').eq('site_id', HODU_SITE_ID).single(),
      supabase.from('cms_notices').select('*').eq('site_id', HODU_SITE_ID).eq('is_active', true).limit(4),
      supabase.from('cms_results').select('*').eq('site_id', HODU_SITE_ID).order('created_at', { ascending: false }).limit(6),
      supabase.from('cms_gallery').select('image_url, caption, sort_order').eq('site_id', HODU_SITE_ID).eq('category', 'Home Carousel').order('sort_order'),
      supabase.from('cms_testimonials').select('*').eq('site_id', HODU_SITE_ID).order('created_at', { ascending: false }).limit(6),
      supabase.from('cms_gallery').select('*').eq('site_id', HODU_SITE_ID).eq('category', 'Homepage Batches').order('sort_order'),
    ])

    if (hRes.status === 'fulfilled' && hRes.value?.data) home = hRes.value.data
    if (nRes.status === 'fulfilled' && nRes.value?.data) notices = nRes.value.data
    if (rRes.status === 'fulfilled' && rRes.value?.data) results = rRes.value.data
    if (cRes.status === 'fulfilled' && cRes.value?.data) carouselRows = cRes.value.data
    if (tRes.status === 'fulfilled' && tRes.value?.data) dbTestimonials = tRes.value.data
    if (bRes.status === 'fulfilled' && bRes.value?.data) dbBatches = bRes.value.data
  } catch (err) {
    console.error('HomePage data fetch error:', err)
  }

  const initialSlides = parseCarouselRows(carouselRows ?? [])

  const liveTestimonials = dbTestimonials && dbTestimonials.length > 0
    ? dbTestimonials.map(t => ({
        initials: (t.name || 'H').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
        name: t.name || 'Student',
        score: t.role || 'Hodu Achiever',
        text: t.message || '',
        photo_url: t.photo_url,
      }))
    : testimonials

  const achievers = results && results.length > 0
    ? results.map(r => ({
        initials: (r.student_name || 'H').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
        name: r.student_name || 'Student',
        pct: r.rank_or_marks || 'Top Marks',
        stream: `${r.exam || ''} ${r.year || ''}`.trim() || 'Hodu Academy',
        school: r.school_name || 'Hodu Academy Alum',
        photo_url: r.photo_url,
      }))
    : toppers

  const activeBatches: CurriculumTrack[] = dbBatches && dbBatches.length > 0
    ? dbBatches.map(b => {
        let parsed: any = {}
        try { parsed = JSON.parse(b.caption ?? '{}') } catch {}
        return {
          tag: parsed.tag || 'ACADEMIC PROGRAM',
          title: parsed.title || 'Curriculum Track',
          grades: parsed.grades || 'Classes & Grades',
          desc: parsed.desc || '',
          features: Array.isArray(parsed.features)
            ? parsed.features
            : (parsed.features ? String(parsed.features).split(',').map((s: string) => s.trim()) : []),
          href: parsed.href || '/courses',
          img: b.image_url || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=320&fit=crop&auto=format',
        }
      })
    : curriculumTracks

  return (
    <div className="space-y-0 animate-fade-in bg-brand-bg text-brand-text w-full max-w-full overflow-x-hidden">

      {/* Notice ticker */}
      {notices && notices.length > 0 && (
        <div className="bg-brand-crimson text-white text-xs py-2 overflow-hidden border-b border-brand-border w-full max-w-full">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 overflow-hidden">
            <span className="bg-white text-brand-maroon px-2.5 py-0.5 rounded text-[11px] font-bold shrink-0 uppercase tracking-widest">
              Notice
            </span>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <span className="inline-block animate-marquee font-medium text-white">
                {notices.map(n => n.title).join('   •   ')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 1. Hero Promo Banner Carousel (1020x300 px) */}
      <HomeHeroCarousel
        heroImage={home?.hero_image_url || undefined}
        initialSlides={initialSlides}
      />


      {/* 3. Popular Batches / Academic Pathways */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-10 sm:pb-16 overflow-hidden">
        {/* Subtle decorative background ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-48 bg-brand-maroon/5 blur-[90px] rounded-full pointer-events-none -z-10" />

        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            {/* Centered Editorial Heading */}
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-brand-maroon leading-[1.18] tracking-tight">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-maroon via-brand-crimson to-brand-wine">Programs</span>
            </h2>

            {/* Centered Subtext */}
            <p className="text-xs sm:text-sm md:text-base text-brand-muted leading-relaxed max-w-2xl mx-auto">
              Choose the right program for your goals with expert teaching and personal support.
            </p>

            {/* Centered CTA Button */}
            <div className="pt-2 flex justify-center">
              <Link
                href="/courses"
                className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-brand-maroon to-brand-crimson hover:from-brand-crimson hover:to-brand-wine text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
              >
                <span>View All Programs</span>
                <div className="w-5 h-5 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white group-hover:text-brand-maroon text-white transition-all">
                  <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100}>
          <BatchCardsCarousel tracks={activeBatches} />
        </ScrollReveal>
      </section>

      {/* 4. Everything You Need To Ace Your Exam In One Place */}
      <section className="relative py-16 sm:py-24 bg-white border-y border-brand-border/60 overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-maroon/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-[2.65rem] font-bold text-brand-text tracking-tight leading-tight">
                Everything You Need To{' '}
                <span className="relative inline-block text-brand-maroon">
                  Ace
                  <span className="absolute -bottom-1.5 left-0 right-0 h-1 bg-brand-crimson rounded-full" />
                </span>{' '}
                Your Exam In One Place
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-brand-muted leading-relaxed max-w-2xl mx-auto">
                Learn from Syllabus - Focused content and stay fully exam ready.
              </p>
            </div>
          </ScrollReveal>

          {/* 4 Feature 3D Book Cards with Horizontal Scroll on Mobile */}
          <ScrollReveal animation="fade-up" delay={100}>
            <FeatureCardsCarousel features={learningFeatures} />
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Hall of Fame / Results */}
      <section className="py-12 sm:py-16 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-8 sm:mb-10 space-y-3">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-maroon">
                Our Star Performers & Rankers
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto">
                Real results from dedicated students who prepared with Hodu Academy.
              </p>
              <div className="pt-1">
                <Link
                  href="/results"
                  className="group inline-flex items-center gap-2 bg-white border border-[#bd9f67]/40 hover:border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-white font-bold text-xs uppercase tracking-wider px-5 py-2 rounded-xl transition-all duration-300 shadow-xs hover:shadow-md hover:-translate-y-0.5"
                >
                  <span>View All Achievers</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={80}>
            <ResultsMarqueeCarousel rankers={achievers} />
          </ScrollReveal>
        </div>
      </section>

      {/* 6. Jaipur Physical Learning Center Banner */}
      <section className="py-10 sm:py-16 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-maroon">
                Jaipur’s New Destination for Learning
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={80}>
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-border shadow-md bg-brand-maroon group">
              {/* Full Banner Graphic from Google Drive */}
              <img
                src="/images/jaipur_center_bg.png"
                alt="Hodu Academy Jaipur Campus & Faculty Team"
                className="w-full h-auto aspect-[1920/700] object-cover sm:object-contain object-center block select-none"
              />

              {/* Desktop Floating Action Buttons */}
              <div className="hidden md:flex absolute bottom-5 left-5 lg:bottom-7 lg:left-7 z-10 items-center gap-3">
                <Link
                  href="/offline"
                  className="bg-brand-maroon hover:bg-brand-crimson text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 border border-white/20"
                >
                  <span>Explore Center Facilities</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white hover:bg-brand-blush text-brand-maroon border border-brand-border font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4 text-brand-maroon" />
                  <span>Book Free Campus Visit</span>
                </Link>
              </div>
            </div>

            {/* Mobile Action Buttons (Displayed neatly below the graphic on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3.5 md:hidden">
              <Link
                href="/offline"
                className="w-full bg-brand-maroon hover:bg-brand-crimson text-white font-bold py-2.5 px-4 rounded-xl text-xs text-center flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Explore Center Facilities</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact"
                className="w-full bg-white hover:bg-brand-blush text-brand-maroon border border-brand-border font-bold py-2.5 px-4 rounded-xl text-xs text-center flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-brand-maroon" />
                <span>Book Free Campus Visit</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 7. Regular Parent Updates & PTM Section */}
      <section className="py-12 sm:py-16 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-6 sm:mb-8 space-y-3">
              <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-maroon">
                Regular Parent Updates & PTM
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted max-w-xl mx-auto">
                Continuous collaboration, 1-on-1 feedback desks, and transparent performance roadmaps.
              </p>

              {/* Action Buttons below section heading */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-1">
                <Link
                  href="/ptm"
                  className="bg-brand-maroon hover:bg-brand-crimson text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 border border-white/20"
                >
                  <span>Explore PTM Gallery</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white hover:bg-brand-blush text-brand-maroon border border-brand-border font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-2xs hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Users className="h-4 w-4 text-brand-maroon" />
                  <span>Book Parent Consultation</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Banner Graphic - Compact / Sleek Height */}
          <ScrollReveal animation="fade-up" delay={80}>
            <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-border shadow-md bg-[#250607]">
              <img
                src="/images/ptm_section_bg.png"
                alt="Regular Parent Updates & PTM Sessions at Hodu Academy"
                className="w-full h-auto max-h-[420px] object-cover sm:object-contain object-center block select-none"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section className="py-12 sm:py-16 bg-white border-y border-brand-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-8">
              <span className="inline-block bg-brand-maroon text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
                FAQ
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-brand-maroon">
                Frequently Asked Questions
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <ScrollReveal
                key={i}
                animation="fade-up"
                delay={i * 50}
              >
                <details className="group border border-brand-border rounded-xl overflow-hidden bg-brand-bg">
                  <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none hover:bg-white transition-colors">
                    <span className="font-bold text-brand-text text-xs sm:text-sm pr-3">{faq.q}</span>
                    <ChevronDown className="h-4 w-4 text-brand-maroon shrink-0 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="px-4 py-3.5 text-xs text-brand-muted leading-relaxed bg-white border-t border-brand-border">
                    {faq.a}
                  </div>
                </details>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Free Academic Consultation Form */}
      <section className="py-12 sm:py-16 bg-brand-blush overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
          <ScrollReveal animation="fade-left" className="space-y-3">
            <span className="inline-block bg-brand-maroon text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              TALK TO AN ACADEMIC EXPERT
            </span>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-brand-maroon leading-tight">
              Get Free Academic Counseling & Syllabus Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Connect with our academic directors to analyze your previous scorecards and choose the right batch.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-brand-text font-semibold">
                <Phone className="h-4 w-4 text-brand-maroon" />
                <span>Helpline: {HODU.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-brand-text font-semibold">
                <MapPin className="h-4 w-4 text-brand-maroon" />
                <span>Campus: {HODU.address}</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-right">
            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif-editorial font-bold text-brand-maroon text-lg mb-1">
                Request Free Callback
              </h3>
              <p className="text-[11px] text-brand-muted mb-4">
                Our academic counselor will reach out to you within 2 hours.
              </p>
              <EnquiryForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}
