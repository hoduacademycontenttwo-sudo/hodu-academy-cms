import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, ChevronDown, Trophy, Phone } from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import HomeHeroCarousel from '@/components/hodu/HomeHeroCarousel'
import { parseCarouselRows } from '@/lib/homeCarousel'

export const metadata = {
  title: 'Hodu Academy — IGCSE · IB · CBSE · JEE · NEET Coaching Jaipur',
  description: 'Expert coaching for IGCSE, IB, CBSE, JEE and NEET in Jaipur. Small batches, top faculty, proven results.',
}

const categories = [
  { title: 'IGCSE & Cambridge', icon: '🌐', href: '/courses?category=IGCSE',
    bg: 'from-blue-700 to-blue-900', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=220&fit=crop&auto=format' },
  { title: 'IB Programme',      icon: '🎓', href: '/courses?category=IB',
    bg: 'from-purple-700 to-purple-900', img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=220&fit=crop&auto=format' },
  { title: 'CBSE Board',        icon: '📚', href: '/courses?category=CBSE',
    bg: 'from-green-700 to-green-900', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=220&fit=crop&auto=format' },
  { title: 'JEE / NEET',       icon: '🏆', href: '/courses?category=Competitive+Exams',
    bg: 'from-orange-600 to-red-800', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=220&fit=crop&auto=format' },
  { title: 'Olympiads',         icon: '🥇', href: '/courses?category=Olympiads',
    bg: 'from-yellow-600 to-amber-800', img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=220&fit=crop&auto=format' },
  { title: 'Online Courses',    icon: '📡', href: '/courses',
    bg: 'from-teal-600 to-teal-900', img: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=400&h=220&fit=crop&auto=format' },
]

const whyHodu = [
  {
    stat: '98%',
    title: 'Pass Rate',
    label: 'Expert Faculty',
    desc: 'IIT/NIT qualified teachers with 10+ years of proven classroom experience.',
    img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=220&fit=crop&auto=format',
    accent: 'from-blue-600 to-blue-800',
  },
  {
    stat: '600+',
    title: 'Hours',
    label: 'Structured Plans',
    desc: 'Day-by-day roadmap from Day 1 to exam day — nothing left to chance.',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=220&fit=crop&auto=format',
    accent: 'from-purple-600 to-purple-900',
  },
  {
    stat: '24/7',
    title: 'Access',
    label: 'Live + Recorded',
    desc: 'Every class recorded and available instantly — watch, rewind, master.',
    img: 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?w=400&h=220&fit=crop&auto=format',
    accent: 'from-teal-600 to-teal-900',
  },
  {
    stat: '10K+',
    title: 'Questions',
    label: 'Diagnostic Mocks',
    desc: 'Weekly tests with percentile ranking and personalised analytics reports.',
    img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=220&fit=crop&auto=format',
    accent: 'from-orange-600 to-red-800',
  },
  {
    stat: '<24hr',
    title: 'Resolution',
    label: 'Doubt Support',
    desc: 'Ask any time — online or in-class. No doubt goes unanswered.',
    img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=220&fit=crop&auto=format',
    accent: 'from-green-600 to-emerald-900',
  },
  {
    stat: '100%',
    title: 'Waiver',
    label: 'Scholarships',
    desc: 'Merit-based fee waivers. Talent should never be stopped by finances.',
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=220&fit=crop&auto=format',
    accent: 'from-yellow-500 to-amber-700',
  },
]

const toppers = [
  { initials: 'AK', name: 'Aryan Kapoor',   score: 'JEE AIR 142',    stream: 'JEE 2025',    pct: '99.4%' },
  { initials: 'PS', name: 'Priya Sharma',   score: 'IGCSE 6A*',       stream: 'IGCSE 2025',  pct: 'A*' },
  { initials: 'RV', name: 'Rohit Verma',    score: 'NEET AIR 287',    stream: 'NEET 2025',   pct: '720/720' },
  { initials: 'SM', name: 'Sneha Mehta',    score: 'IB DP 44/45',     stream: 'IB DP 2025',  pct: '44/45' },
  { initials: 'KS', name: 'Karan Singh',    score: 'IMO Gold',         stream: 'Olympiad',    pct: 'Gold' },
  { initials: 'DG', name: 'Divya Gupta',    score: 'CBSE 99.8%',       stream: 'CBSE 2025',  pct: '99.8%' },
]

const testimonials = [
  { initials: 'RM', name: 'Rohan Malhotra',   score: '98.2% CBSE · Olympiad #38', text: 'Chemistry formula sheets and chapter-wise practice gave me complete clarity. Parents got progress alerts too.' },
  { initials: 'AS', name: 'Aishwarya Sharma', score: '96.8% CBSE · Math Ace',     text: 'Physics lectures are gold. The shortcut techniques meant I finished exams 30 minutes early.' },
  { initials: 'KP', name: 'Karan Patel',      score: 'IGCSE A* in 5 subjects',    text: 'Past-paper sessions and mock exams were exactly what I needed. A* in Physics, Chemistry, Math, Bio and Eco.' },
]

const faqs = [
  { q: 'What boards & exams do you cover?',  a: 'IGCSE, Cambridge O Level, IB (MYP & DP), CBSE (Class 9–12), JEE Main & Advanced, NEET, and National & International Olympiads.' },
  { q: 'Online and offline both available?',  a: 'Yes. Live classroom sessions at our Jaipur centre + interactive online classes via LMS. All sessions are recorded.' },
  { q: 'How small are the batches?',          a: 'Classroom batches are capped at 15–20 students for individual attention and personal mentoring.' },
  { q: 'Is study material provided?',         a: 'Yes — chapter notes, DPPs, past papers, and mock test series, all board/exam-aligned.' },
  { q: 'Can I join mid-session?',             a: 'Yes. We offer bridge batches and recorded content to help late joiners catch up fast.' },
  { q: 'How are doubts resolved?',            a: '5-day/week doubt sessions + online doubt submission answered by subject experts within 24 hours.' },
]

const blogs = [
  { title: 'JEE Main 2026: Dates, Pattern & How to Apply', date: '25 Oct 2025', slug: 'jee-main-registration-2026' },
  { title: 'India Wins 3 Golds at IMO 2025',               date: '19 Jul 2025', slug: 'india-imo-2025' },
  { title: 'The 10 Hardest IGCSE Subjects',                date: '19 Dec 2024', slug: 'hardest-igcse-subjects' },
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
        photo_url: r.photo_url,
      }))
    : toppers

  const stats: { label: string; value: string }[] = (() => {
    const defaults = [
      { value: '15K+', label: 'Students' },
      { value: '98%',  label: 'Pass Rate' },
      { value: '500+', label: 'Scholarships' },
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

      {/* Notice ticker */}
      {notices && notices.length > 0 && (
        <div className="bg-brand-navy text-white text-xs py-2 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
            <span className="bg-brand-maroon px-2 py-0.5 rounded text-xs font-bold shrink-0 uppercase tracking-wider">Notice</span>
            <div className="overflow-hidden whitespace-nowrap flex-1">
              <span className="inline-block animate-marquee">{notices.map(n => n.title).join('   •   ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <HomeHeroCarousel
        ctaText={home?.cta_text ?? 'Explore Courses'}
        ctaLink="/enroll"
        stats={stats}
        heroTitleHtml={home?.hero_title || undefined}
        heroSubtitleHtml={home?.hero_subtitle || undefined}
        heroImage={home?.hero_image_url || undefined}
        initialSlides={initialSlides}
      />

      {/* Course Categories — image cards */}
      <section className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full mb-2 border border-brand-maroon/20">
            Target Programs 2025–26
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">Choose Your Learning Path</h2>
          <p className="text-sm text-brand-navy/60 mt-1 max-w-lg mx-auto">
            Comprehensive curriculum, small interactive batches & expert faculty for every major board and exam.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href}
              className="group relative rounded-2xl overflow-hidden h-40 md:h-48 block card-hover border border-brand-border/60 shadow-sm">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.bg} opacity-75 group-hover:opacity-85 transition-opacity duration-300`} />
              
              {/* Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-black/30 backdrop-blur-md text-[10px] font-bold text-white/90 px-2 py-0.5 rounded-full border border-white/10">
                  Batches Open
                </span>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                <span className="text-3xl mb-1.5 drop-shadow transform transition-transform group-hover:scale-110 duration-200">{cat.icon}</span>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight drop-shadow">{cat.title}</h3>
                <span className="text-[11px] text-white/80 font-medium mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Explore Curriculum →</span>
              </div>
              
              <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-brand-maroon transition-all shadow">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Hodu */}
      <section className="reveal bg-brand-navy py-18 overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-maroon/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="inline-block bg-white/10 text-brand-border text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 border border-white/10">
                THE HODU ADVANTAGE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 leading-tight">
                Why Students<br className="sm:hidden" /> Choose Hodu Academy
              </h2>
              <p className="text-white/65 text-sm font-light mt-2 max-w-md">
                Every feature engineered for one single outcome — achieving your highest possible score.
              </p>
            </div>
            <Link href="/contact"
              className="shrink-0 inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-accent text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg">
              Book Free Demo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Cards */}
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible">
            {whyHodu.map((item) => (
              <div key={item.label}
                className="relative shrink-0 w-[78vw] sm:w-72 lg:w-auto snap-start rounded-2xl overflow-hidden group cursor-default card-hover border border-white/10 shadow-xl">

                {/* Background image */}
                <img src={item.img} alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-85 group-hover:opacity-80 transition-opacity`} />

                {/* Content */}
                <div className="relative p-6 flex flex-col h-56 justify-between">
                  {/* Big stat */}
                  <div>
                    <div className="text-5xl font-black text-white leading-none tracking-tight drop-shadow">
                      {item.stat}
                    </div>
                    <div className="text-white/75 text-xs font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      {item.title}
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="border-t border-white/20 pt-4 bg-black/10 -mx-6 -mb-6 p-6 backdrop-blur-xs">
                    <h3 className="text-white font-extrabold text-base leading-tight">{item.label}</h3>
                    <p className="text-white/80 text-xs font-light mt-1 leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom trust bar */}
          <div className="mt-12 pt-8 border-t border-white/15 grid grid-cols-3 gap-4 text-center">
            {[
              { val: '15,000+', lbl: 'Students Mentored' },
              { val: '7 Years', lbl: 'Academic Excellence' },
              { val: '4.9 ★', lbl: 'Average Rating' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-brand-border">{val}</div>
                <div className="text-white/50 text-[11px] font-semibold uppercase tracking-wider mt-1">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {courses && courses.length > 0 && (
        <section className="reveal py-16 bg-brand-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between mb-8">
            <div>
              <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-1 border border-brand-maroon/20">
                POPULAR PROGRAMS
              </span>
              <h2 className="text-3xl font-extrabold text-brand-navy">Featured Courses</h2>
            </div>
            <Link href="/courses" className="text-xs font-extrabold text-brand-maroon border border-brand-maroon/30 hover:bg-brand-maroon hover:text-white px-5 py-2.5 rounded-xl transition-all shadow-sm shrink-0">
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
                <div key={course.id} className="bg-white border border-brand-border rounded-2xl overflow-hidden card-hover flex flex-col shrink-0 w-[80vw] md:w-auto snap-start shadow-sm">
                  <div className="h-40 relative overflow-hidden">
                    {cardImg ? (
                      <>
                        <img src={cardImg} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="bg-brand-maroon text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full shadow">
                            {course.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                          <span className="font-semibold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
                            {course.class_level || 'All Classes'}
                          </span>
                          <span className="text-amber-300 font-bold flex items-center gap-1">
                            ★ 4.9
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-maroon to-brand-accent flex items-end p-4">
                        <span className="text-white font-bold text-sm">{course.category}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-extrabold text-brand-navy mb-2 text-base leading-snug">{course.title}</h3>
                    {course.description && (
                      <p className="text-xs text-brand-navy/65 font-light line-clamp-2 mb-4">{course.description}</p>
                    )}
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-brand-border">
                      <div>
                        <span className="text-xs text-brand-navy/50 block font-medium">Course Fee</span>
                        <span className="text-xl font-black text-brand-navy">
                          {course.fee ? `₹${course.fee}` : 'Enquire'}
                        </span>
                      </div>
                      <Link href="/enroll"
                        className="bg-brand-maroon hover:bg-brand-accent text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow hover:shadow-md">
                        Enroll Now <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Toppers / Hall of Fame */}
      <section className="reveal py-16 bg-brand-navy text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-400/30 px-3.5 py-1 rounded-full text-yellow-400 text-xs font-bold mb-2">
              <Trophy className="h-4 w-4 text-yellow-400" />
              HALL OF FAME 2025
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Top Achievers & Ranks</h2>
            <p className="text-sm text-white/60 mt-1">Celebrating our students who set benchmarks in national & international examinations.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {achievers.map(t => (
              <div key={t.name} className="bg-white/5 border border-yellow-400/20 rounded-2xl p-4 text-center hover:bg-white/10 transition-all hover:-translate-y-1 hover:border-yellow-400/50 shadow-lg">
                {'photo_url' in t && t.photo_url ? (
                  <img src={t.photo_url} alt={t.name} className="h-14 w-14 rounded-full object-cover mx-auto mb-3 ring-2 ring-yellow-400/70" />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand-maroon to-yellow-600 flex items-center justify-center font-black text-white text-base mx-auto mb-3 ring-2 ring-yellow-400/70 shadow">
                    {t.initials}
                  </div>
                )}
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg py-1 px-1.5 mb-1.5">
                  <p className="text-sm font-black text-yellow-400">{t.pct}</p>
                </div>
                <p className="text-xs font-bold text-white leading-tight">{t.name}</p>
                <p className="text-[10px] text-white/50 mt-0.5">{t.stream}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-accent text-white font-bold px-8 py-3.5 rounded-xl transition-all text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Join the Next Batch of Achievers <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="reveal bg-brand-bg border-y border-brand-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full mb-2 border border-brand-maroon/20">
              TRUSTED BY 15,000+ FAMILIES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy">What Our Students & Parents Say</h2>
            <p className="text-sm text-brand-navy/60 mt-1">Real reviews from students who achieved their dream scores.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {liveTestimonials.map(t => (
              <div key={t.name} className="bg-white border border-brand-border p-6 rounded-2xl shadow-sm card-hover relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-amber-500 text-sm gap-0.5 font-bold">
                      ★★★★★
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ✓ Verified Review
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-brand-navy/75 leading-relaxed font-light mb-6">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-brand-border/60">
                  {'photo_url' in t && t.photo_url ? (
                    <img src={t.photo_url} alt={t.name} className="h-11 w-11 rounded-full object-cover object-top ring-2 ring-brand-border" />
                  ) : (
                    <div className="h-11 w-11 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center font-extrabold text-brand-maroon text-sm shrink-0">
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
      <section className="reveal py-16 bg-white border-b border-brand-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 border border-brand-maroon/20">
              HAVE QUESTIONS?
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-brand-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-brand-maroon/40 shadow-xs">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none bg-brand-bg/60 hover:bg-brand-bg transition-colors">
                  <span className="font-bold text-brand-navy text-sm sm:text-base pr-4">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-brand-maroon shrink-0 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="px-5 py-4 text-sm text-brand-navy/70 font-light leading-relaxed bg-white border-t border-brand-border/40">{faq.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href={`tel:${HODU.phone}`}
              className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-accent text-white font-bold px-7 py-3 rounded-xl transition-all text-sm shadow hover:shadow-md">
              <Phone className="h-4 w-4" /> Call Admissions: {HODU.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="reveal py-16 bg-brand-bg border-b border-brand-border">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="inline-block bg-brand-maroon text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
              FREE ADMISSIONS COUNSELLING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy leading-tight">Book a Free 1-on-1 Consultation</h2>
            <p className="text-sm text-brand-navy/65 font-light leading-relaxed">
              Our academic directors will evaluate your goals, discuss batch schedules, and create a customized roadmap for your target exam.
            </p>
            <div className="space-y-3 pt-3">
              {[
                { icon: '📞', title: 'Direct Helpline', text: HODU.phone },
                { icon: '✉️', title: 'Admissions Desk', text: HODU.email },
                { icon: '📍', title: 'Main Campus', text: HODU.address },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-3 text-sm bg-white p-3.5 rounded-xl border border-brand-border/80 shadow-xs">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <span className="font-bold text-xs text-brand-navy block">{item.title}</span>
                    <span className="font-light text-brand-navy/70 text-xs">{item.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="font-extrabold text-brand-navy text-lg mb-1">Quick Enquiry</h3>
            <p className="text-xs text-brand-navy/60 mb-5 font-light">Enter your details and our team will get back to you.</p>
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="reveal py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-8">
          <div>
            <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-1 border border-brand-maroon/20">
              ACADEMIC INSIGHTS
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy">Latest From Our Blog</h2>
          </div>
          <Link href="/blog" className="text-xs font-extrabold text-brand-maroon border border-brand-maroon/30 hover:bg-brand-maroon hover:text-white px-5 py-2.5 rounded-xl transition-all shadow-sm shrink-0">
            View All Articles →
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-3 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-visible max-w-7xl mx-auto">
          {blogs.map(blog => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`}
              className="group block bg-white border border-brand-border rounded-2xl overflow-hidden card-hover shrink-0 w-[80vw] sm:w-auto snap-start shadow-sm">
              <div className="h-32 bg-gradient-to-br from-brand-navy to-brand-maroon flex items-end p-4 relative overflow-hidden">
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white">
                  Exam Tips
                </div>
                <span className="text-white/80 text-xs font-mono">{blog.date}</span>
              </div>
              <div className="p-5">
                <h3 className="font-extrabold text-brand-navy text-sm leading-snug group-hover:text-brand-maroon transition-colors line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-brand-maroon font-bold mt-4 flex items-center gap-1.5">Read Article <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" /></p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
