import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, ChevronDown, Trophy, Phone, CheckCircle2, Award, BookOpen, Users, Compass, ShieldCheck, Sparkles, GraduationCap, Building2, MapPin } from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import HomeHeroCarousel from '@/components/hodu/HomeHeroCarousel'
import { parseCarouselRows } from '@/lib/homeCarousel'

export const metadata = {
  title: 'Hodu Academy — Premier Coaching for Cambridge IGCSE, IB, CBSE, JEE & NEET | Jaipur',
  description: 'Jaipur’s premier academic institute for Cambridge IGCSE, IB Diploma, CBSE Class 9-12, IIT-JEE, and NEET. Small 1:12 interactive batches, weekly mock tests, and top faculty.',
}

const curriculumTracks = [
  {
    tag: 'CAMBRIDGE INTERNATIONAL',
    title: 'Cambridge IGCSE & A-Levels',
    grades: 'Grades 8, 9, 10, 11 & 12',
    subjects: 'Extended Math (0580/0607), Physics (0625), Chemistry (0620), Biology & Economics',
    features: ['Past 15 Years Question Bank Mastery', 'Command Word Marking Guidance', 'Individual IA & Coursework Review'],
    href: '/courses?category=IGCSE',
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=350&fit=crop&auto=format'
  },
  {
    tag: 'INTERNATIONAL BACCALAUREATE',
    title: 'IB Diploma Programme (MYP & DP)',
    grades: 'MYP 4-5 & DP 1-2',
    subjects: 'Math AA/AI (HL & SL), Physics, Chemistry, Biology, Business Management & Economics',
    features: ['Criterion-Referenced Rubrics', 'Internal Assessment (IA) Mentorship', 'Extended Essay (EE) & TOK Support'],
    href: '/courses?category=IB',
    img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=350&fit=crop&auto=format'
  },
  {
    tag: 'NATIONAL CURRICULUM',
    title: 'CBSE Board (Science & Commerce)',
    grades: 'Classes 9, 10, 11 & 12',
    subjects: 'Physics, Chemistry, Mathematics, Biology, Accountancy & Applied Math',
    features: ['NCERT Line-by-Line Mastery', 'Competency-Based Test Series', 'Board Exemplar & Answer Presentation'],
    href: '/courses?category=CBSE',
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=350&fit=crop&auto=format'
  },
  {
    tag: 'PRE-ENGINEERING & MEDICAL',
    title: 'IIT-JEE & NEET-UG Integrated',
    grades: 'Classes 11, 12 & Dropper Batches',
    subjects: 'Advanced Physics, Physical/Organic/Inorganic Chem, Higher Math, Botany & Zoology',
    features: ['CBT Exam Simulation Testing', 'Daily 30-Problem DPP Practice', 'All-India Level Percentile Benchmarking'],
    href: '/courses?category=Competitive+Exams',
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=350&fit=crop&auto=format'
  },
  {
    tag: 'TALENT & APTITUDE',
    title: 'Junior Olympiads & Foundation',
    grades: 'Classes 6, 7 & 8',
    subjects: 'IMO, NSO, PRMO, Mental Ability & Logical Reasoning',
    features: ['Non-Routine Problem Solving', 'Speed & Agility Techniques', 'Early National Competitive Mindset'],
    href: '/courses?category=Olympiads',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=350&fit=crop&auto=format'
  },
  {
    tag: 'GLOBAL DIGITAL SESSIONS',
    title: 'Live Online 1-on-1 & Micro-Batches',
    grades: 'Worldwide Students',
    subjects: 'Global Cambridge & IB Customised 1-on-1 Academic Mentorship',
    features: ['Interactive Pen Tablet Boards', 'Cloud Recorded Sessions with 24/7 Access', 'Customized Timezone Scheduling'],
    href: '/courses',
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=350&fit=crop&auto=format'
  }
]

const pedagogicalPillars = [
  {
    num: '01',
    title: 'Diagnostic Baseline Analysis',
    desc: 'Before batch allocation, every student undergoes a rigorous diagnostic evaluation to pinpoint specific conceptual gaps and learning speed.',
    tag: 'Baseline Mapping'
  },
  {
    num: '02',
    title: 'Small Interactive Batches (1:12)',
    desc: 'Strictly capped class sizes ensure active discussions, constant eye contact, and zero hesitation during classroom lectures.',
    tag: 'Intimate Cohorts'
  },
  {
    num: '03',
    title: 'Daily Practice Engine (DPPs)',
    desc: 'Handpicked daily problem sheets reinforcing that day’s exact syllabus modules with step-by-step model answers.',
    tag: 'Continuous Practice'
  },
  {
    num: '04',
    title: 'Exam Simulation & Analytics Labs',
    desc: 'Bi-weekly full-length timed tests under real exam conditions with comprehensive performance metrics delivered directly to parents.',
    tag: 'Real-Time Benchmarking'
  }
]

const toppers = [
  { initials: 'AK', name: 'Aryan Kapoor',   score: 'JEE AIR 142',    stream: 'JEE Advanced',  school: 'Jayshree Periwal High School', pct: '99.4%' },
  { initials: 'PS', name: 'Priya Sharma',   score: 'IGCSE 8x A*',    stream: 'Cambridge IGCSE', school: 'Neerja Modi School',  pct: '8x A*' },
  { initials: 'RV', name: 'Rohit Verma',    score: 'NEET AIR 287',   stream: 'NEET UG',       school: 'DPS Jaipur',            pct: '710/720' },
  { initials: 'SM', name: 'Sneha Mehta',    score: 'IB DP 44/45',    stream: 'IB Diploma',    school: 'Sanskar School',        pct: '44/45' },
  { initials: 'KS', name: 'Karan Singh',    score: 'IMO Gold Medal', stream: 'Olympiad',      school: 'Seedling Public',       pct: 'National Rank 4' },
  { initials: 'DG', name: 'Divya Gupta',    score: 'CBSE 99.2%',     stream: 'Class 12 Board', school: 'MGD Girls School',     pct: '99.2%' },
]

const testimonials = [
  { initials: 'RM', name: 'Rohan Malhotra',   score: '98.2% CBSE · Olympiad Rank 38', text: 'The structured approach at Hodu helped me transition smoothly from standard school exams to high-percentile competitive testing. The faculty is genuinely invested in every single student.' },
  { initials: 'AS', name: 'Aishwarya Sharma', score: '96.8% CBSE · Math 100/100',     text: 'Physics and Math lectures broke down tough multi-step problems into clean formulas. The shortcut methods saved me over 25 minutes in my final board exams.' },
  { initials: 'KP', name: 'Karan Patel',      score: 'IGCSE 8x A* Marks',    text: 'Past-paper drills and mark scheme dissection gave me complete confidence. I knew exactly how examiners award marks across Physics, Chemistry, Math, and Economics.' },
]

const faqs = [
  { q: 'What boards & curriculum does Hodu Academy teach?', a: 'Hodu Academy specializes in Cambridge International (IGCSE & A-Levels), International Baccalaureate (IB MYP & DP), CBSE Board (Classes 9 to 12 Science & Commerce), IIT-JEE (Main & Advanced), NEET-UG, and Junior Olympiads (IMO, NSO).' },
  { q: 'Are classes conducted offline in Jaipur, online, or hybrid?', a: 'We offer both options. Our fully equipped physical campus is located in Jaipur featuring air-conditioned smart classrooms, a dedicated doubt library, and testing facilities. We also run high-definition live online micro-batches for global and remote students.' },
  { q: 'How many students are there in one batch?', a: 'To ensure personalized attention, our classroom and online batches are strictly capped at 12 to 15 students. This allows mentors to actively track every student’s conceptual grasp.' },
  { q: 'What study materials and practice tests are included?', a: 'Enrolled students receive our comprehensive chapter-by-chapter theory booklets, Daily Practice Problems (DPPs), past 15-year board question banks, and bi-weekly simulated mock test papers with detailed analytical reporting.' },
  { q: 'How are personal doubts resolved outside regular class hours?', a: 'We maintain dedicated daily 1-on-1 doubt desks with senior faculty members at the campus, along with a digital doubt portal where questions are resolved by subject specialists within 24 hours.' },
]

const blogs = [
  { title: 'Cambridge IGCSE 2026: Grading Boundaries, Revision Strategy & Exam Tips', date: '25 Oct 2025', slug: 'jee-main-registration-2026' },
  { title: 'How to Score 42+ in the IB Diploma Programme: An Examiner’s Blueprint', date: '19 Jul 2025', slug: 'india-imo-2025' },
  { title: 'The Top 10 High-Yield Topics for JEE Main & NEET Physics', date: '19 Dec 2024', slug: 'hardest-igcse-subjects' },
]

export default async function HomePage() {
  const supabase = await createClient()

  const [{ data: home }, { data: courses }, { data: notices }, { data: results }, { data: carouselRows }, { data: dbTestimonials }] = await Promise.all([
    supabase.from('cms_home_sections').select('*').eq('site_id', HODU_SITE_ID).single(),
    supabase.from('cms_courses').select('*').eq('site_id', HODU_SITE_ID).eq('is_featured', true).limit(3),
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

  const stats: { label: string; value: string }[] = (() => {
    const defaults = [
      { value: '15,000+', label: 'Students Mentored' },
      { value: '99.4%',   label: 'Top Board Score' },
      { value: '1 : 12',  label: 'Batch Ratio' },
    ]
    if (!home?.stats_json) return defaults
    const raw: any = typeof home.stats_json === 'string' ? JSON.parse(home.stats_json) : home.stats_json
    if (Array.isArray(raw)) {
      return raw.map((s: any) =>
        s && typeof s === 'object'
          ? { label: String(s.label ?? ''), value: String(s.value ?? '') }
          : { label: '', value: String(s) }
      )
    }
    if (raw && typeof raw === 'object') {
      return Object.entries(raw as Record<string, any>).map(([key, val]) =>
        val && typeof val === 'object' && !Array.isArray(val)
          ? { label: String((val as any).label ?? key), value: String((val as any).value ?? '') }
          : { label: key, value: String(val ?? '') }
      )
    }
    return defaults
  })()

  return (
    <div className="space-y-0 animate-fade-in bg-brand-bg">

      {/* Live Notice ticker */}
      {notices && notices.length > 0 && (
        <div className="bg-brand-crimson text-white text-xs py-2 overflow-hidden border-b border-brand-border">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
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

      {/* Hero Section */}
      <HomeHeroCarousel
        ctaText={home?.cta_text ?? 'Explore Programs'}
        ctaLink="/courses"
        stats={stats}
        heroTitleHtml={home?.hero_title || undefined}
        heroSubtitleHtml={home?.hero_subtitle || undefined}
        heroImage={home?.hero_image_url || undefined}
        initialSlides={initialSlides}
      />

      <section className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            <GraduationCap className="h-3.5 w-3.5" />
            PROGRAMS
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon tracking-tight">
            Academic Pathways
          </h2>
          <p className="text-sm text-brand-muted mt-2 max-w-lg mx-auto leading-relaxed">
            Small 1:12 batches with targeted curriculums for every academic goal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {curriculumTracks.map((track, idx) => (
            <div key={idx}
              className="rounded-2xl border-2 border-brand-border p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:border-brand-maroon relative overflow-hidden bg-white">
              
              {/* Image banner preview */}
              <div className="h-44 -mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-5 overflow-hidden relative border-b border-brand-border">
                <img src={track.img} alt={track.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-3.5 left-3.5">
                  <span className="bg-brand-maroon text-white text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-wider shadow-sm">
                    {track.tag}
                  </span>
                </div>
              </div>

              {/* Subject list */}
              <div className="space-y-3.5 mb-6 flex-1">
                <div>
                  <span className="text-xs font-bold text-brand-maroon uppercase tracking-wider block">{track.grades}</span>
                  <h3 className="font-serif-editorial font-bold text-lg text-neutral-900 mt-0.5">{track.title}</h3>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                  <strong className="text-neutral-900 font-semibold">Key Focus:</strong> {track.subjects}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-brand-border">
                  {track.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-neutral-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-maroon shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <Link href={track.href}
                className="w-full bg-brand-maroon hover:bg-brand-crimson text-white font-bold py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs transition-colors duration-200 shadow-xs">
                <span>View Syllabus & Cohort Schedule</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* The Hodu 4-Stage Pedagogical Engine */}
      <section className="reveal bg-brand-maroon py-20 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-white text-brand-maroon text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3">
              OUR APPROACH
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              The Hodu Methodology
            </h2>
            <p className="text-sm text-white/80 mt-3 leading-relaxed max-w-xl mx-auto">
              A proven 4-stage cycle built for top percentile results.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pedagogicalPillars.map((p, idx) => (
              <div key={idx} className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 relative group">
                <div className="w-12 h-12 rounded-xl bg-white text-brand-maroon font-black text-xl flex items-center justify-center mb-5 shadow-sm">
                  {p.num}
                </div>
                <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md inline-block mb-3">
                  {p.tag}
                </span>
                <h3 className="font-bold text-lg text-white mb-2">{p.title}</h3>
                <p className="text-xs text-white/80 leading-relaxed font-light">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Institutional Trust bar */}
          <div className="mt-14 pt-10 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <span className="text-2xl sm:text-3xl font-black text-white block">15,000+</span>
              <span className="text-white/80 text-[11px] font-semibold uppercase tracking-wider mt-1 block">Students Mentored</span>
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <span className="text-2xl sm:text-3xl font-black text-white block">1 : 12</span>
              <span className="text-white/80 text-[11px] font-semibold uppercase tracking-wider mt-1 block">Teacher Student Ratio</span>
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <span className="text-2xl sm:text-3xl font-black text-white block">99.4%</span>
              <span className="text-white/80 text-[11px] font-semibold uppercase tracking-wider mt-1 block">Highest Board Mark</span>
            </div>
            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <span className="text-2xl sm:text-3xl font-black text-white block">100%</span>
              <span className="text-white/80 text-[11px] font-semibold uppercase tracking-wider mt-1 block">Past Papers Decoded</span>
            </div>
          </div>
        </div>
      </section>

      {/* Jaipur Physical Campus Spotlight */}
      <section className="reveal py-16 sm:py-20 bg-brand-blush border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-brand-border rounded-2xl p-8 sm:p-12 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 bg-brand-maroon text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                <Building2 className="h-3.5 w-3.5" />
                JAIPUR CAMPUS
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon leading-tight">
                Smart Classrooms in Jaipur
              </h2>
              <p className="text-sm text-brand-muted leading-relaxed">
                Acoustically treated smart classrooms, 1-on-1 doubt desks, silent study carrels, and AC transport across Jaipur.
              </p>
              
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>Smart Interactive Boards</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>Biometric Attendance Alerts</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>Daily Doubt Clearing Desks</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-neutral-800">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>AC Transport Facility</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <Link href="/offline"
                  className="bg-brand-maroon hover:bg-brand-crimson text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors flex items-center gap-2">
                  Explore Campus
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact"
                  className="bg-white hover:bg-brand-blush text-brand-maroon border border-brand-border font-semibold px-5 py-3 rounded-lg text-sm transition-colors flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Book Visit
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-brand-border">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=500&fit=crop&auto=format"
                  alt="Hodu Academy Smart Classroom"
                  className="w-full h-72 sm:h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {courses && courses.length > 0 && (
        <section className="reveal py-16 sm:py-20 bg-brand-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between mb-10">
            <div>
              <span className="inline-block bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-2">
                FEATURED
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon">Popular Programs</h2>
            </div>
            <Link href="/courses" className="text-xs font-bold text-brand-maroon border border-brand-maroon hover:bg-brand-maroon hover:text-white px-5 py-2.5 rounded-lg transition-all shrink-0 uppercase tracking-wider">
              View All →
            </Link>
          </div>
          
          <div className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-3 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible max-w-7xl mx-auto">
            {courses.map(course => {
              const cardImg = course.image_url || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=200&fit=crop&auto=format'
              return (
                <div key={course.id} className="bg-white border-2 border-brand-border rounded-2xl overflow-hidden card-hover flex flex-col shrink-0 w-[80vw] md:w-auto snap-start shadow-xs">
                  <div className="h-44 relative overflow-hidden border-b border-brand-border">
                    <img src={cardImg} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    <div className="absolute top-3.5 left-3.5">
                      <span className="bg-brand-maroon text-white font-bold text-[10px] uppercase px-3 py-1 rounded-md shadow-sm">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-neutral-900 mb-2 text-base leading-snug">{course.title}</h3>
                      {course.description && (
                        <p className="text-xs text-neutral-600 font-normal line-clamp-2 mb-4 leading-relaxed">{course.description}</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-brand-border mt-4">
                      <div>
                        <span className="text-[11px] text-neutral-500 block font-semibold uppercase tracking-wider">Fee Structure</span>
                        <span className="text-xl font-black text-brand-maroon">
                          {course.fee ? `₹${course.fee}` : 'On Request'}
                        </span>
                      </div>
                      <Link href="/enroll"
                        className="bg-brand-maroon hover:bg-brand-crimson text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
                        Enroll <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Hall of Fame / Achievers */}
      <section className="reveal py-16 sm:py-20 bg-brand-crimson text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-white text-brand-maroon px-4 py-1.5 rounded-full text-xs font-bold mb-3">
              <Trophy className="h-4 w-4" />
              RESULTS
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Hall of Fame
            </h2>
            <p className="text-sm text-white/80 mt-2 max-w-md mx-auto">
              Real results from students who trusted Hodu Academy.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {achievers.map((t, idx) => (
              <div key={idx} className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-5 text-center hover:bg-white/20 transition-all flex flex-col justify-between">
                <div>
                  {'photo_url' in t && t.photo_url ? (
                    <img src={t.photo_url} alt={t.name} className="h-16 w-16 rounded-full object-cover mx-auto mb-3 ring-2 ring-white" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-white text-brand-maroon flex items-center justify-center font-black text-lg mx-auto mb-3 shadow">
                      {t.initials}
                    </div>
                  )}
                  <div className="bg-white text-brand-maroon rounded-lg py-1 px-2 mb-2 font-black text-xs">
                    {t.pct}
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{t.name}</h4>
                  <p className="text-[10px] text-white/70 mt-1">{t.stream}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/15 text-[9px] text-white/60 leading-tight">
                  {t.school}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact" className="inline-flex items-center gap-2.5 bg-white hover:bg-neutral-100 text-brand-maroon font-bold px-8 py-4 rounded-xl transition-all text-xs uppercase tracking-wider shadow-md">
              <span>Join the Next Achievers Batch</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="reveal bg-brand-bg border-b border-brand-border py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-2">
              TESTIMONIALS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon">
              What Parents & Students Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {liveTestimonials.map((t, idx) => (
              <div key={idx} className="bg-white border-2 border-brand-border p-7 rounded-2xl shadow-xs card-hover relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-brand-maroon font-bold text-sm">★★★★★</span>
                    <span className="bg-neutral-100 text-neutral-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-brand-border">
                      Verified Review
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed font-normal mb-6">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-brand-border">
                  {'photo_url' in t && t.photo_url ? (
                    <img src={t.photo_url} alt={t.name} className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-brand-border" />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-brand-maroon text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {t.initials}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">{t.name}</h4>
                    <p className="text-[11px] text-brand-maroon font-semibold">{t.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="reveal py-16 sm:py-20 bg-white border-b border-brand-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-2">
              FAQ
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon">Frequently Asked</h2>
          </div>
          <div className="space-y-3.5">
            {faqs.map((faq, i) => (
              <details key={i} className="group border-2 border-brand-border rounded-xl overflow-hidden transition-all duration-200 hover:border-brand-maroon shadow-xs">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-neutral-50 hover:bg-neutral-100 transition-colors">
                  <span className="font-bold text-neutral-900 text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-brand-maroon shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-5 py-4 text-sm text-neutral-700 font-normal leading-relaxed bg-white border-t border-brand-border">{faq.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href={`tel:${HODU.phone}`}
              className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-crimson text-white font-bold px-8 py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow-sm">
              <Phone className="h-4 w-4" /> Call Admissions Desk: {HODU.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Enquiry Consultation CTA */}
      <section className="reveal py-16 sm:py-20 bg-brand-blush border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-4">
            <span className="inline-block bg-brand-maroon text-white text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
              GET IN TOUCH
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon leading-tight">
              Book a Free Academic Session
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Meet our academic directors for a personalized roadmap tailored to your target exam.
            </p>
            <div className="space-y-3 pt-2">
              {[
                { title: 'Helpline', text: HODU.phone },
                { title: 'Email', text: HODU.email },
                { title: 'Campus', text: HODU.address },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3 text-sm bg-white p-4 rounded-xl border border-brand-border">
                  <div className="w-2 h-2 rounded-full bg-brand-maroon mt-1.5 shrink-0" />
                  <div>
                    <span className="font-semibold text-xs text-brand-text block">{item.title}</span>
                    <span className="text-brand-muted text-xs">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-9">
            <h3 className="font-serif-editorial font-bold text-brand-maroon text-xl mb-1">Request Callback</h3>
            <p className="text-xs text-brand-muted mb-6">We'll reach out within 2 hours.</p>
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* Blog & Editorial Insights */}
      <section className="reveal py-16 sm:py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between mb-10">
          <div>
            <span className="inline-block bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-2">
              INSIGHTS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon">Latest Articles</h2>
          </div>
          <Link href="/blog" className="text-xs font-bold text-brand-maroon border border-brand-maroon hover:bg-brand-maroon hover:text-white px-5 py-2.5 rounded-lg transition-all shrink-0 uppercase tracking-wider">
            View All →
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-3 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-visible max-w-7xl mx-auto">
          {blogs.map(blog => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`}
              className="group block bg-white border-2 border-brand-border rounded-2xl overflow-hidden card-hover shrink-0 w-[80vw] sm:w-auto snap-start shadow-xs">
              <div className="h-36 bg-brand-maroon flex items-end p-5 relative overflow-hidden">
                <div className="absolute top-3.5 right-3.5 bg-white text-brand-maroon px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                  Strategy Guide
                </div>
                <span className="text-white text-xs font-mono">{blog.date}</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-neutral-900 text-base leading-snug group-hover:text-brand-maroon transition-colors line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-brand-maroon font-bold mt-5 flex items-center gap-1.5 uppercase tracking-wider">Read Full Guide <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" /></p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
