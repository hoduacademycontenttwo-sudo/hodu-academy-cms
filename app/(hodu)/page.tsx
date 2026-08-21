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
    accent: 'border-blue-200 bg-white hover:border-blue-400',
    badge: 'bg-blue-900 text-white',
    href: '/courses?category=IGCSE',
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=350&fit=crop&auto=format'
  },
  {
    tag: 'INTERNATIONAL BACCALAUREATE',
    title: 'IB Diploma Programme (MYP & DP)',
    grades: 'MYP 4-5 & DP 1-2',
    subjects: 'Math AA/AI (HL & SL), Physics, Chemistry, Biology, Business Management & Economics',
    features: ['Criterion-Referenced Rubrics', 'Internal Assessment (IA) Mentorship', 'Extended Essay (EE) & TOK Support'],
    accent: 'border-purple-200 bg-white hover:border-purple-400',
    badge: 'bg-purple-900 text-white',
    href: '/courses?category=IB',
    img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=350&fit=crop&auto=format'
  },
  {
    tag: 'NATIONAL CURRICULUM',
    title: 'CBSE Board (Science & Commerce)',
    grades: 'Classes 9, 10, 11 & 12',
    subjects: 'Physics, Chemistry, Mathematics, Biology, Accountancy & Applied Math',
    features: ['NCERT Line-by-Line Mastery', 'Competency-Based Test Series', 'Board Exemplar & Answer Presentation'],
    accent: 'border-emerald-200 bg-white hover:border-emerald-400',
    badge: 'bg-emerald-900 text-white',
    href: '/courses?category=CBSE',
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=350&fit=crop&auto=format'
  },
  {
    tag: 'PRE-ENGINEERING & MEDICAL',
    title: 'IIT-JEE & NEET-UG Integrated',
    grades: 'Classes 11, 12 & Dropper Batches',
    subjects: 'Advanced Physics, Physical/Organic/Inorganic Chem, Higher Math, Botany & Zoology',
    features: ['CBT Exam Simulation Testing', 'Daily 30-Problem DPP Practice', 'All-India Level Percentile Benchmarking'],
    accent: 'border-rose-200 bg-white hover:border-rose-400',
    badge: 'bg-brand-maroon text-white',
    href: '/courses?category=Competitive+Exams',
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=350&fit=crop&auto=format'
  },
  {
    tag: 'TALENT & APTITUDE',
    title: 'Junior Olympiads & Foundation',
    grades: 'Classes 6, 7 & 8',
    subjects: 'IMO, NSO, PRMO, Mental Ability & Logical Reasoning',
    features: ['Non-Routine Problem Solving', 'Speed & Agility Techniques', 'Early National Competitive Mindset'],
    accent: 'border-amber-200 bg-white hover:border-amber-400',
    badge: 'bg-amber-900 text-white',
    href: '/courses?category=Olympiads',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=350&fit=crop&auto=format'
  },
  {
    tag: 'GLOBAL DIGITAL SESSIONS',
    title: 'Live Online 1-on-1 & Micro-Batches',
    grades: 'Worldwide Students',
    subjects: 'Global Cambridge & IB Customised 1-on-1 Academic Mentorship',
    features: ['Interactive Pen Tablet Boards', 'Cloud Recorded Sessions with 24/7 Access', 'Customized Timezone Scheduling'],
    accent: 'border-teal-200 bg-white hover:border-teal-400',
    badge: 'bg-teal-900 text-white',
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
    <div className="space-y-0 animate-fade-in">

      {/* Live Notice ticker */}
      {notices && notices.length > 0 && (
        <div className="bg-brand-navy text-white text-xs py-2 overflow-hidden border-b border-brand-maroon/30">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
            <span className="bg-brand-maroon px-2.5 py-0.5 rounded text-[11px] font-black shrink-0 uppercase tracking-widest text-white shadow-xs">
              ADMISSIONS NOTICE
            </span>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <span className="inline-block animate-marquee font-medium text-white/90">
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

      {/* Curriculum Tracks / Academic Pathways */}
      <section className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 bg-brand-maroon/10 text-brand-maroon text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 border border-brand-maroon/20">
            <GraduationCap className="h-3.5 w-3.5" />
            ACADEMIC PATHWAYS 2025–26
          </span>
          <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy tracking-tight">
            Curated Programs for Every Academic Goal
          </h2>
          <p className="text-sm sm:text-base text-brand-navy/70 mt-2.5 max-w-2xl mx-auto font-light leading-relaxed">
            Targeted curriculums engineered with small interactive batches, past-paper dissection, and verified pedagogical frameworks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {curriculumTracks.map((track, idx) => (
            <div key={idx}
              className={`rounded-3xl border ${track.accent} p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden bg-white`}>
              
              {/* Image banner preview */}
              <div className="h-44 -mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-5 overflow-hidden relative">
                <img src={track.img} alt={track.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />
                <div className="absolute top-3.5 left-3.5">
                  <span className={`${track.badge} text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md`}>
                    {track.tag}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-[11px] font-semibold text-white/80 block">{track.grades}</span>
                  <h3 className="font-bold text-base leading-tight text-white">{track.title}</h3>
                </div>
              </div>

              {/* Subject list */}
              <div className="space-y-3.5 mb-6 flex-1">
                <p className="text-xs text-brand-navy/70 leading-relaxed font-medium">
                  <strong className="text-brand-navy font-bold">Key Focus:</strong> {track.subjects}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-brand-border/60">
                  {track.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-brand-navy/80">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <Link href={track.href}
                className="w-full bg-brand-bg hover:bg-brand-maroon hover:text-white text-brand-navy border border-brand-border font-bold py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs transition-colors duration-200 shadow-xs">
                <span>View Syllabus & Cohort Schedule</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* The Hodu 4-Stage Pedagogical Engine */}
      <section className="reveal bg-brand-navy py-20 text-white relative overflow-hidden dark-grid-pattern">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-maroon/25 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block bg-white/10 text-brand-gold text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full mb-3 border border-white/15">
              THE HODU METHODOLOGY
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              An Academic Engine Built for Top Percentiles
            </h2>
            <p className="text-sm sm:text-base text-white/70 mt-3 font-light leading-relaxed">
              We replaced generic lecturing with an institutional 4-stage cycle that guarantees measurable concept retention.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pedagogicalPillars.map((p, idx) => (
              <div key={idx} className="bg-white/5 border border-white/15 rounded-3xl p-6 hover:bg-white/10 hover:border-brand-gold/40 transition-all duration-300 relative group">
                <div className="w-12 h-12 rounded-2xl bg-brand-maroon text-brand-gold font-black text-xl flex items-center justify-center mb-5 ring-1 ring-white/20 shadow-lg">
                  {p.num}
                </div>
                <span className="bg-brand-gold/20 text-brand-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-3">
                  {p.tag}
                </span>
                <h3 className="font-bold text-lg text-white mb-2 group-hover:text-brand-gold transition-colors">{p.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Institutional Trust bar */}
          <div className="mt-14 pt-10 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-2xl sm:text-3xl font-black text-brand-gold block">15,000+</span>
              <span className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-1 block">Students Mentored</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-2xl sm:text-3xl font-black text-brand-gold block">1 : 12</span>
              <span className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-1 block">Teacher Student Ratio</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-2xl sm:text-3xl font-black text-brand-gold block">99.4%</span>
              <span className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-1 block">Highest Board Mark</span>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <span className="text-2xl sm:text-3xl font-black text-brand-gold block">100%</span>
              <span className="text-white/60 text-[11px] font-semibold uppercase tracking-wider mt-1 block">Past Papers Decoded</span>
            </div>
          </div>
        </div>
      </section>

      {/* Jaipur Physical Campus Spotlight */}
      <section className="reveal py-16 sm:py-20 bg-brand-bg border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-brand-border rounded-3xl p-8 sm:p-12 shadow-xl grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 bg-brand-maroon/10 text-brand-maroon text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-brand-maroon/20">
                <Building2 className="h-3.5 w-3.5" />
                JAIPUR OFFLINE LEARNING CENTER
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-navy leading-tight">
                State-of-the-Art Classroom Infrastructure in Jaipur
              </h2>
              <p className="text-sm text-brand-navy/75 leading-relaxed font-light">
                Experience high-focus, distraction-free learning with acoustically treated smart digital classrooms, dedicated 1-on-1 faculty doubt cells, silent study carrels, and GPS-tracked air-conditioned conveyance across Jaipur.
              </p>
              
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs font-bold text-brand-navy">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>Smart Interactive Boards</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-brand-navy">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>Biometric Attendance Alerts</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-brand-navy">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>Daily Doubt Clearing Desks</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-brand-navy">
                  <CheckCircle2 className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span>AC Transport Facility</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap gap-3.5">
                <Link href="/offline"
                  className="bg-brand-maroon hover:bg-brand-crimson text-white font-extrabold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-2">
                  <span>Explore Offline Center & Facilities</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact"
                  className="bg-brand-bg hover:bg-brand-cream text-brand-navy border border-brand-border font-bold px-6 py-3.5 rounded-xl text-xs transition-colors flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-maroon" />
                  <span>Book Campus Visit</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-brand-border">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=500&fit=crop&auto=format"
                  alt="Hodu Academy Smart Classroom"
                  className="w-full h-72 sm:h-80 object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-brand-navy text-white p-4 rounded-2xl border border-white/20 shadow-xl hidden sm:block">
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">Jaipur Center Hub</span>
                <p className="text-xs font-black text-white">C-Scheme & Vaishali Nagar Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {courses && courses.length > 0 && (
        <section className="reveal py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between mb-10">
            <div>
              <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full mb-2 border border-brand-maroon/20">
                POPULAR PROGRAMS
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-navy">Featured Cohorts 2025–26</h2>
            </div>
            <Link href="/courses" className="text-xs font-black text-brand-maroon border border-brand-maroon/30 hover:bg-brand-maroon hover:text-white px-5 py-2.5 rounded-xl transition-all shadow-xs shrink-0 uppercase tracking-wider">
              View All Courses →
            </Link>
          </div>
          {/* Grid */}
          <div className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-3 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible max-w-7xl mx-auto">
            {courses.map(course => {
              const categoryImg: Record<string, string> = {
                'IGCSE': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&h=200&fit=crop&auto=format',
                'Cambridge O Level': 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=500&h=200&fit=crop&auto=format',
                'IB': 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=500&h=200&fit=crop&auto=format',
                'CBSE': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=200&fit=crop&auto=format',
                'Competitive Exams': 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=200&fit=crop&auto=format',
                'Olympiads': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&h=200&fit=crop&auto=format',
              }
              const cardImg = course.image_url || categoryImg[course.category]
              return (
                <div key={course.id} className="bg-white border border-brand-border rounded-3xl overflow-hidden card-hover flex flex-col shrink-0 w-[80vw] md:w-auto snap-start shadow-sm">
                  <div className="h-44 relative overflow-hidden">
                    {cardImg ? (
                      <>
                        <img src={cardImg} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute top-3.5 left-3.5 flex gap-2">
                          <span className="bg-brand-maroon text-white font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow">
                            {course.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                          <span className="font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md">
                            {course.class_level || 'All Classes'}
                          </span>
                          <span className="text-amber-300 font-bold flex items-center gap-1">
                            ★ 4.9 Rating
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-maroon to-brand-accent flex items-end p-4">
                        <span className="text-white font-bold text-sm">{course.category}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-brand-navy mb-2 text-base leading-snug">{course.title}</h3>
                      {course.description && (
                        <p className="text-xs text-brand-navy/70 font-light line-clamp-2 mb-4 leading-relaxed">{course.description}</p>
                      )}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-brand-border mt-4">
                      <div>
                        <span className="text-[11px] text-brand-navy/50 block font-semibold uppercase tracking-wider">Fee Structure</span>
                        <span className="text-xl font-black text-brand-navy">
                          {course.fee ? `₹${course.fee}` : 'On Request'}
                        </span>
                      </div>
                      <Link href="/enroll"
                        className="bg-brand-maroon hover:bg-brand-crimson text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow hover:shadow-md">
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
      <section className="reveal py-16 sm:py-20 bg-brand-navy text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-400/30 px-4 py-1.5 rounded-full text-brand-gold text-xs font-black mb-3">
              <Trophy className="h-4 w-4 text-brand-gold" />
              PROVEN RESULTS & HALL OF FAME
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Celebrating India's Top Ranks & Scores
            </h2>
            <p className="text-sm text-white/70 mt-2 max-w-xl mx-auto font-light">
              Real scorecards from dedicated students who trusted Hodu Academy for their board and competitive preparation.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {achievers.map((t, idx) => (
              <div key={idx} className="bg-white/5 border border-brand-gold/25 rounded-2xl p-4 sm:p-5 text-center hover:bg-white/10 transition-all hover:-translate-y-1 hover:border-brand-gold shadow-lg flex flex-col justify-between">
                <div>
                  {'photo_url' in t && t.photo_url ? (
                    <img src={t.photo_url} alt={t.name} className="h-16 w-16 rounded-full object-cover mx-auto mb-3 ring-2 ring-brand-gold" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-maroon to-brand-navy flex items-center justify-center font-black text-brand-gold text-lg mx-auto mb-3 ring-2 ring-brand-gold/60 shadow">
                      {t.initials}
                    </div>
                  )}
                  <div className="bg-brand-gold/15 border border-brand-gold/30 rounded-lg py-1 px-2 mb-2">
                    <p className="text-xs font-black text-brand-gold">{t.pct}</p>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{t.name}</h4>
                  <p className="text-[10px] text-white/50 mt-1">{t.stream}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/10 text-[9px] text-white/40 leading-tight">
                  {t.school}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact" className="inline-flex items-center gap-2.5 bg-brand-maroon hover:bg-brand-crimson text-white font-extrabold px-8 py-4 rounded-xl transition-all text-xs uppercase tracking-wider shadow-xl hover:-translate-y-0.5">
              <span>Join the Next Achievers Batch</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="reveal bg-brand-bg border-y border-brand-border py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full mb-2.5 border border-brand-maroon/20">
              PARENT & STUDENT TRUST
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-navy">
              Stories of Real Transformations
            </h2>
            <p className="text-sm text-brand-navy/65 mt-1 font-light">Verified endorsements from parents and students across Jaipur and global schools.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {liveTestimonials.map((t, idx) => (
              <div key={idx} className="bg-white border border-brand-border p-7 rounded-3xl shadow-sm card-hover relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-500 text-sm gap-0.5 font-bold">
                      ★★★★★
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      ✓ Verified Review
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-navy/80 leading-relaxed font-light mb-6">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-brand-border/60">
                  {'photo_url' in t && t.photo_url ? (
                    <img src={t.photo_url} alt={t.name} className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-brand-border" />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-brand-cream border border-brand-border flex items-center justify-center font-extrabold text-brand-maroon text-sm shrink-0">
                      {t.initials}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">{t.name}</h4>
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
            <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-black uppercase tracking-widest px-4 py-1 rounded-full mb-2 border border-brand-maroon/20">
              TRANSPARENT ADMISSIONS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-navy">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3.5">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-brand-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-brand-maroon/40 shadow-xs">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-brand-bg/60 hover:bg-brand-bg transition-colors">
                  <span className="font-bold text-brand-navy text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-brand-maroon shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-5 py-4 text-sm text-brand-navy/75 font-light leading-relaxed bg-white border-t border-brand-border/40">{faq.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href={`tel:${HODU.phone}`}
              className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-crimson text-white font-extrabold px-8 py-3.5 rounded-xl transition-all text-xs uppercase tracking-wider shadow hover:shadow-md">
              <Phone className="h-4 w-4" /> Call Admissions Desk: {HODU.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Enquiry Consultation CTA */}
      <section className="reveal py-16 sm:py-20 bg-brand-bg border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-5">
            <span className="inline-block bg-brand-maroon text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-xs">
              COMPLIMENTARY COUNSELLING
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
              Book a 1-on-1 Academic Diagnostic Session
            </h2>
            <p className="text-sm text-brand-navy/70 font-light leading-relaxed">
              Meet our academic directors to analyze syllabus requirements, assess previous test papers, and get a tailored roadmap for your targeted board or entrance exam.
            </p>
            <div className="space-y-3 pt-2">
              {[
                { title: 'Direct Helpline', text: HODU.phone },
                { title: 'Admissions Desk', text: HODU.email },
                { title: 'Jaipur Main Campus', text: HODU.address },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3.5 text-sm bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-maroon mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-xs text-brand-navy block">{item.title}</span>
                    <span className="font-light text-brand-navy/70 text-xs">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-9 shadow-2xl">
            <h3 className="font-serif-editorial font-bold text-brand-navy text-xl mb-1">Request Callback & Diagnostic</h3>
            <p className="text-xs text-brand-navy/60 mb-6 font-light">Submit details below and an academic counselor will reach out within 2 hours.</p>
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* Blog & Editorial Insights */}
      <section className="reveal py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between mb-10">
          <div>
            <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-black uppercase tracking-widest px-3.5 py-1 rounded-full mb-2 border border-brand-maroon/20">
              EXAM STRATEGY & GUIDES
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-navy">Latest Academic Insights</h2>
          </div>
          <Link href="/blog" className="text-xs font-black text-brand-maroon border border-brand-maroon/30 hover:bg-brand-maroon hover:text-white px-5 py-2.5 rounded-xl transition-all shadow-xs shrink-0 uppercase tracking-wider">
            View All Articles →
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-3 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-visible max-w-7xl mx-auto">
          {blogs.map(blog => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`}
              className="group block bg-white border border-brand-border rounded-3xl overflow-hidden card-hover shrink-0 w-[80vw] sm:w-auto snap-start shadow-xs">
              <div className="h-36 bg-gradient-to-br from-brand-navy to-brand-maroon flex items-end p-5 relative overflow-hidden">
                <div className="absolute top-3.5 right-3.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                  Strategy Guide
                </div>
                <span className="text-white/80 text-xs font-mono">{blog.date}</span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-brand-navy text-base leading-snug group-hover:text-brand-maroon transition-colors line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-brand-maroon font-black mt-5 flex items-center gap-1.5 uppercase tracking-wider">Read Full Guide <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" /></p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
