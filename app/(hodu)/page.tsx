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
import { parseCarouselRows } from '@/lib/homeCarousel'

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
    grades: 'All Curriculums · C-Scheme & Vaishali',
    desc: 'Study at our modern air-conditioned learning center in Jaipur with smart digital boards, silent reference library, and daily 1-on-1 doubt desks.',
    features: ['Acoustic Smart Classrooms', 'Dedicated 1-on-1 Faculty Doubt Desks', 'Silent Library (8 AM – 9 PM)', 'Doorstep AC GPS Transport'],
    href: '/offline',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=320&fit=crop&auto=format'
  }
]

const whyChooseUs = [
  {
    num: '01',
    icon: Users,
    title: '1:12 Small Interactive Batches',
    badge: 'Personalized Focus',
    desc: 'Intimate batches ensure individual faculty attention, continuous micro-assessments, and active student participation in every single session.',
  },
  {
    num: '02',
    icon: HelpCircle,
    title: 'Daily 1-on-1 Doubt Desks',
    badge: '4:00 – 7:30 PM Daily',
    desc: 'Dedicated private doubt-clearing sessions daily with senior subject faculties. No pending questions carry over to the next lecture.',
  },
  {
    num: '03',
    icon: Laptop,
    title: 'Smart Learning & CBT Labs',
    badge: 'Exam-Ready Testing',
    desc: 'Modern digital classrooms with Computer-Based Test simulations, past paper decoders, and real-time chapter analytics sent to parents.',
  },
  {
    num: '04',
    icon: Award,
    title: 'Expert Educator Faculty',
    badge: '10–25+ Yrs Exp',
    desc: 'Seasoned subject masters specializing in Cambridge IGCSE, IB DP, CBSE, and JEE/NEET with proven track records of top percentiles.',
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
  { q: 'Are classes conducted offline in Jaipur or online?', a: 'Both! Our flagship physical campus is in Jaipur (C-Scheme) with air-conditioned smart classrooms, a dedicated doubt library, and testing facilities. We also conduct live online interactive micro-batches for global students.' },
  { q: 'What is the batch size at Hodu Academy?', a: 'To ensure genuine personal attention, all our batches are strictly capped at 12 to 15 students. This allows mentors to track every student’s conceptual progress individually.' },
  { q: 'What study materials and practice tests are provided?', a: 'Enrolled students receive comprehensive chapter booklets, Daily Practice Problems (DPPs), past 15-year board question banks, and bi-weekly simulated mock test papers with detailed analytical reports.' },
  { q: 'How are doubts resolved outside regular lectures?', a: 'We run dedicated daily 1-on-1 doubt desks with senior faculty members from 4:00 PM to 7:30 PM, along with instant WhatsApp and LMS doubt resolution.' },
]

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: home }, { data: notices }, { data: results }, { data: carouselRows }, { data: dbTestimonials }] = await Promise.all([
    supabase.from('cms_home_sections').select('*').eq('site_id', HODU_SITE_ID).single(),
    supabase.from('cms_notices').select('*').eq('site_id', HODU_SITE_ID).eq('is_active', true).limit(4),
    supabase.from('cms_results').select('*').eq('site_id', HODU_SITE_ID).order('created_at', { ascending: false }).limit(6),
    supabase.from('cms_gallery').select('image_url, caption, sort_order').eq('site_id', HODU_SITE_ID).eq('category', 'Home Carousel').order('sort_order'),
    supabase.from('cms_testimonials').select('*').eq('site_id', HODU_SITE_ID).order('created_at', { ascending: false }).limit(6),
  ])

  const initialSlides = parseCarouselRows(carouselRows ?? [])

  const liveTestimonials = dbTestimonials && dbTestimonials.length > 0
    ? dbTestimonials.map(t => ({
        initials: t.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
        name: t.name,
        score: t.role,
        text: t.message,
        photo_url: t.photo_url,
      }))
    : testimonials

  const achievers = results && results.length > 0
    ? results.map(r => ({
        initials: r.student_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
        name: r.student_name,
        pct: r.rank_or_marks,
        stream: `${r.exam} ${r.year}`,
        school: r.school_name || 'Hodu Academy Alum',
        photo_url: r.photo_url,
      }))
    : toppers

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


      {/* 3. Popular Batches / Academic Pathways (PW style clean batch cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-brand-border">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-brand-maroon text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>COHORTS 2025–26</span>
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-maroon">
              Explore Our Batches
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              Select your academic program with structured curriculums and small 1:12 batches.
            </p>
          </div>
          <Link
            href="/courses"
            className="text-xs font-bold text-brand-maroon border border-brand-maroon hover:bg-brand-maroon hover:text-white px-4 py-2 rounded-lg transition-all self-start sm:self-auto shrink-0 uppercase tracking-wider"
          >
            View All Programs →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {curriculumTracks.map((track, idx) => (
            <div
              key={idx}
              className="group bg-white border border-brand-border hover:border-brand-maroon rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                {/* Minimal Banner Image with clean floating badges */}
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  <img
                    src={track.img}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Top-Left Floating Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="bg-white/95 backdrop-blur-md text-brand-maroon text-[11px] font-extrabold px-3 py-1 rounded-full border border-brand-border shadow-xs uppercase tracking-wider">
                      {track.tag}
                    </span>
                  </div>

                  {/* Bottom-Left Grade Pill */}
                  <div className="absolute bottom-3 left-3.5">
                    <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-white/20">
                      {track.grades}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-lg text-brand-text group-hover:text-brand-maroon transition-colors line-clamp-1">
                    {track.title}
                  </h3>
                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                    {track.desc}
                  </p>

                  {/* Minimal 3-Tag Highlights */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-brand-border/60">
                    {track.features.slice(0, 3).map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-text bg-brand-bg px-2.5 py-1 rounded-lg border border-brand-border/50"
                      >
                        <CheckCircle2 className="h-3 w-3 text-brand-maroon shrink-0" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Minimal Clean Action Link */}
              <div className="p-6 pt-0">
                <Link
                  href={track.href}
                  className="w-full bg-brand-bg group-hover:bg-brand-maroon text-brand-maroon group-hover:text-white border border-brand-border group-hover:border-brand-maroon font-bold py-2.5 px-4 rounded-xl text-center flex items-center justify-between text-xs tracking-wider uppercase transition-all duration-200 shadow-2xs"
                >
                  <span>Explore Program</span>
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Why Choose Hodu Academy (The Hodu Learning Edge) */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-white via-brand-blush/20 to-white border-y border-brand-border overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-maroon/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 bg-brand-maroon text-white text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full mb-3 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>WHY CHOOSE US</span>
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-black text-brand-maroon tracking-tight">
              The Hodu Learning Edge
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-2 leading-relaxed">
              A student-first academic ecosystem engineered for deep conceptual mastery and top international ranks.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="group relative bg-white border border-brand-border/80 hover:border-brand-maroon/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col justify-between overflow-hidden"
                >
                  {/* Top hover accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-maroon via-brand-crimson to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Watermark Index Number */}
                  <span className="absolute top-4 right-4 font-serif text-3xl font-black text-brand-maroon/10 group-hover:text-brand-maroon/20 transition-colors pointer-events-none select-none">
                    {item.num}
                  </span>

                  <div>
                    {/* Icon container */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-maroon to-brand-crimson text-white flex items-center justify-center mb-5 shadow-md shadow-brand-maroon/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                      <Icon className="h-6 w-6" />
                    </div>

                    {/* Badge chip */}
                    <span className="inline-block bg-brand-bg text-brand-maroon text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-brand-border mb-2.5">
                      {item.badge}
                    </span>

                    {/* Card title */}
                    <h3 className="font-bold text-base text-brand-text group-hover:text-brand-maroon transition-colors mb-2">
                      {item.title}
                    </h3>

                    {/* Card description */}
                    <p className="text-xs text-brand-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Enhanced Stats Strip (Clean Elevated Card with Soft Dividers) */}
          <div className="mt-12 sm:mt-16 bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-brand-border/70 text-center">
              <div className="pt-4 lg:pt-0 lg:px-4 flex flex-col items-center justify-center">
                <span className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-black text-brand-maroon tracking-tight block">
                  15,000+
                </span>
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider mt-1 block">
                  Students Mentored
                </span>
                <span className="text-[11px] text-brand-muted mt-0.5">Across All Programs</span>
              </div>

              <div className="pt-4 lg:pt-0 lg:px-4 flex flex-col items-center justify-center">
                <span className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-black text-brand-maroon tracking-tight block">
                  1 : 12
                </span>
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider mt-1 block">
                  Teacher-Student Ratio
                </span>
                <span className="text-[11px] text-brand-muted mt-0.5">Strict Batch Cap</span>
              </div>

              <div className="pt-4 lg:pt-0 lg:px-4 flex flex-col items-center justify-center">
                <span className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-black text-brand-maroon tracking-tight block">
                  99.4%
                </span>
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider mt-1 block">
                  Highest Board Score
                </span>
                <span className="text-[11px] text-brand-muted mt-0.5">Top Jaipur Ranks</span>
              </div>

              <div className="pt-4 lg:pt-0 lg:px-4 flex flex-col items-center justify-center">
                <span className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-black text-brand-maroon tracking-tight block">
                  100%
                </span>
                <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider mt-1 block">
                  Past Papers Solved
                </span>
                <span className="text-[11px] text-brand-muted mt-0.5">15-Year Question Banks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Hall of Fame / Results (PW style clean ranker cards) */}
      <section className="py-12 sm:py-16 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 bg-brand-maroon text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              <Trophy className="h-3.5 w-3.5" />
              <span>PROVEN RESULTS</span>
            </div>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-maroon">
              Our Star Performers & Rankers
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-md mx-auto">
              Real results from dedicated students who prepared with Hodu Academy.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {achievers.map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-brand-border rounded-xl p-4 text-center hover:border-brand-maroon transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  {'photo_url' in t && t.photo_url ? (
                    <img
                      src={t.photo_url}
                      alt={t.name}
                      className="h-14 w-14 rounded-full object-cover mx-auto mb-2.5 ring-2 ring-brand-border"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-sm mx-auto mb-2.5">
                      {t.initials}
                    </div>
                  )}
                  <div className="bg-brand-maroon text-white rounded-md py-0.5 px-2 mb-1.5 font-bold text-xs">
                    {t.pct}
                  </div>
                  <h4 className="text-xs font-bold text-brand-text leading-tight">{t.name}</h4>
                  <p className="text-[10px] text-brand-muted mt-0.5">{t.stream}</p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-brand-border text-[9px] text-brand-muted">
                  {t.school}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Jaipur Physical Learning Center (Vidyapeeth style) */}
      <section className="py-12 sm:py-16 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-bg border border-brand-border rounded-2xl p-6 sm:p-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-brand-maroon text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                <Building2 className="h-3.5 w-3.5" />
                <span>JAIPUR OFFLINE CENTER</span>
              </div>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-brand-maroon leading-tight">
                State-of-the-Art Offline Coaching in Jaipur
              </h2>
              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                Smart classrooms, 1-on-1 daily doubt clearing desks, silent study reference library, and GPS AC conveyance across Jaipur.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs font-semibold text-brand-text">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>85" Smart Touchscreens</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>Daily Doubt Desks</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>Silent Study Library</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>AC GPS Transport</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/offline"
                  className="bg-brand-maroon hover:bg-brand-crimson text-white font-semibold px-5 py-2.5 rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Explore Center Facilities</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white hover:bg-brand-blush text-brand-maroon border border-brand-border font-semibold px-4 py-2.5 rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Book Free Campus Visit</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-brand-border bg-white shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=380&fit=crop&auto=format"
                  alt="Hodu Academy Smart Classroom"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <div className="p-3 bg-white border-t border-brand-border">
                  <span className="text-[11px] font-bold text-brand-maroon uppercase tracking-wider block">Jaipur Main Hub</span>
                  <p className="text-xs text-brand-muted">{HODU.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Student & Parent Reviews */}
      <section className="py-12 sm:py-16 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-brand-maroon text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              REVIEWS
            </span>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-maroon">
              Loved by Students & Parents
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {liveTestimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-brand-border rounded-xl p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-brand-maroon font-bold text-xs">★★★★★</span>
                    <span className="bg-brand-bg text-brand-muted text-[10px] font-semibold px-2 py-0.5 rounded border border-brand-border">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed mb-4">
                    "{t.text}"
                  </p>
                </div>
                <div className="flex items-center gap-2.5 pt-3 border-t border-brand-border">
                  {'photo_url' in t && t.photo_url ? (
                    <img
                      src={t.photo_url}
                      alt={t.name}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-brand-border"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-xs shrink-0">
                      {t.initials}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-xs text-brand-text">{t.name}</h4>
                    <p className="text-[10px] text-brand-maroon font-medium">{t.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ Accordion */}
      <section className="py-12 sm:py-16 bg-white border-y border-brand-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-brand-maroon text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              FAQ
            </span>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-brand-maroon">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group border border-brand-border rounded-xl overflow-hidden bg-brand-bg"
              >
                <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none hover:bg-white transition-colors">
                  <span className="font-bold text-brand-text text-xs sm:text-sm pr-3">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-brand-maroon shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-4 py-3.5 text-xs text-brand-muted leading-relaxed bg-white border-t border-brand-border">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Free Academic Consultation Form (Clean Box) */}
      <section className="py-12 sm:py-16 bg-brand-blush">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
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
          </div>

          <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif-editorial font-bold text-brand-maroon text-lg mb-1">
              Request Free Callback
            </h3>
            <p className="text-[11px] text-brand-muted mb-4">
              Our academic counselor will reach out to you within 2 hours.
            </p>
            <EnquiryForm />
          </div>
        </div>
      </section>

    </div>
  )
}
