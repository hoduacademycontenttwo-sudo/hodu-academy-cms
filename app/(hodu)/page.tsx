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
    icon: Users,
    title: '1:12 Small Batches',
    desc: 'Intimate batches ensure personal attention and active participation in every session.',
  },
  {
    icon: HelpCircle,
    title: 'Daily 1-on-1 Doubt Desks',
    desc: 'Private doubt sessions daily from 4:00 PM to 7:30 PM with senior subject faculties.',
  },
  {
    icon: Laptop,
    title: 'Smart Learning & CBT Labs',
    desc: 'Digital classrooms, test simulations, and chapter-wise analytics delivered to parents.',
  },
  {
    icon: Award,
    title: 'Expert Educator Faculty',
    desc: 'Seasoned subject masters with 10–25+ years of teaching Cambridge, IB, and JEE/NEET.',
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculumTracks.map((track, idx) => (
            <div
              key={idx}
              className="bg-white border border-brand-border hover:border-brand-maroon rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Banner image with tag */}
                <div className="relative h-40 overflow-hidden border-b border-brand-border bg-neutral-100">
                  <img
                    src={track.img}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-brand-maroon text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow-sm">
                    {track.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-brand-maroon block">
                      {track.grades}
                    </span>
                    <h3 className="font-bold text-base text-brand-text mt-0.5">
                      {track.title}
                    </h3>
                  </div>
                  <p className="text-xs text-brand-muted leading-relaxed line-clamp-2">
                    {track.desc}
                  </p>

                  {/* Feature checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-brand-border">
                    {track.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-[11px] text-brand-text">
                        <CheckCircle2 className="h-3.5 w-3.5 text-brand-maroon shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 pt-0">
                <Link
                  href={track.href}
                  className="w-full bg-brand-maroon hover:bg-brand-crimson text-white font-semibold py-2.5 px-4 rounded-lg text-center flex items-center justify-center gap-1.5 text-xs transition-colors shadow-xs"
                >
                  <span>Explore Batch Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Why Choose Hodu Academy (4 Clean Benefit Cards) */}
      <section className="bg-white border-y border-brand-border py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-brand-maroon text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2">
              WHY CHOOSE US
            </span>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-maroon">
              The Hodu Learning Edge
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-lg mx-auto">
              A student-first ecosystem built for measurable conceptual clarity and top board ranks.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="bg-brand-bg border border-brand-border rounded-xl p-5 hover:border-brand-maroon transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-brand-border text-brand-maroon flex items-center justify-center mb-3.5 shadow-xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-sm text-brand-text mb-1.5">{item.title}</h3>
                  <p className="text-xs text-brand-muted leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Quick numbers row */}
          <div className="mt-10 pt-8 border-t border-brand-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-brand-maroon block">15,000+</span>
              <span className="text-xs text-brand-muted font-medium mt-0.5 block">Students Mentored</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-brand-maroon block">1 : 12</span>
              <span className="text-xs text-brand-muted font-medium mt-0.5 block">Teacher-Student Ratio</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-brand-maroon block">99.4%</span>
              <span className="text-xs text-brand-muted font-medium mt-0.5 block">Highest Board Score</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-brand-maroon block">100%</span>
              <span className="text-xs text-brand-muted font-medium mt-0.5 block">Past Papers Solved</span>
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
