import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import Link from 'next/link'
import { Award, ArrowRight, Play, CheckCircle2, Sparkles, Calendar, ArrowUpRight, ChevronDown, Trophy, Phone } from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'

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

  const [{ data: home }, { data: courses }, { data: notices }, { data: results }] = await Promise.all([
    supabase.from('cms_home_sections').select('*').eq('site_id', HODU_SITE_ID).single(),
    supabase.from('cms_courses').select('*').eq('site_id', HODU_SITE_ID).eq('is_featured', true).limit(3),
    supabase.from('cms_notices').select('*').eq('site_id', HODU_SITE_ID).eq('is_active', true).limit(4),
    supabase.from('cms_results').select('*').eq('site_id', HODU_SITE_ID).order('created_at', { ascending: false }).limit(6),
  ])

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
      <section className="relative overflow-hidden bg-brand-white pt-10 pb-16 md:py-20 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">

            {/* Left */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-brand-bg border border-brand-border px-3 py-1.5 rounded-full text-brand-maroon text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                {home?.hero_subtitle ?? 'Admissions open — Session 2026–27'}
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-navy leading-[1.1]">
                {home?.hero_title ?? <>Expert Coaching for<br />IGCSE · IB · CBSE<br />JEE · NEET</>}
              </h1>

              <p className="text-base text-brand-navy/70 font-light max-w-lg mx-auto lg:mx-0">
                Top faculty · Live & recorded classes · Test series · Personal mentoring — all in one place.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link href="/enroll"
                  className="w-full sm:w-auto bg-brand-maroon hover:bg-brand-accent text-white font-bold px-7 py-3.5 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-sm">
                  {home?.cta_text ?? 'Explore Courses'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact"
                  className="w-full sm:w-auto bg-brand-bg hover:bg-brand-border/40 text-brand-navy border border-brand-border font-semibold px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
                  Free Callback
                  <Calendar className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-border max-w-sm mx-auto lg:mx-0">
                {stats.slice(0, 3).map(s => (
                  <div key={s.label}>
                    <h3 className="text-2xl font-black text-brand-maroon">{s.value}</h3>
                    <p className="text-[11px] text-brand-navy/60 font-semibold uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — live class widget */}
            <div className="lg:col-span-6">
              <div className="relative border border-brand-border bg-white rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-border">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-maroon opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-maroon" />
                    </span>
                    <span className="text-xs font-bold text-brand-navy uppercase tracking-widest">Hodu Live Hub</span>
                  </div>
                  <span className="text-xs bg-brand-bg text-brand-maroon font-bold px-2.5 py-1 rounded border border-brand-border">2026 Batch</span>
                </div>

                {/* Live class card with image */}
                <div className="rounded-xl overflow-hidden border border-brand-border">
                  <div className="h-28 relative bg-gradient-to-br from-brand-maroon to-brand-accent">
                    <img src="https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&h=200&fit=crop&auto=format"
                      alt="Live class" className="w-full h-full object-cover opacity-40" />
                    <div className="absolute inset-0 p-3 flex flex-col justify-between">
                      <span className="bg-red-600 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-widest animate-pulse self-start">● Live Now</span>
                      <div>
                        <h4 className="font-bold text-sm text-white">IGCSE Physics — Waves & Optics</h4>
                        <p className="text-xs text-white/70">Mr. VP Singh · 10:00 AM</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/lms"
                    className="flex items-center justify-center gap-1.5 w-full bg-brand-maroon hover:bg-brand-accent text-white py-2 text-xs font-bold uppercase transition-all">
                    <Play className="h-3 w-3 fill-current" /> Join Class
                  </Link>
                </div>

                <div className="border border-brand-border rounded-xl p-3 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-brand-navy">Weekly Test Performance</span>
                    <span className="text-brand-accent font-bold font-mono">92/100</span>
                  </div>
                  <div className="w-full bg-brand-bg rounded-full h-2 overflow-hidden">
                    <div className="bg-brand-accent h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-brand-navy/50 font-mono">
                    <span>Rank #14 in India</span>
                    <span>CBSE Math · Class 10</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-brand-navy/70 pt-1">
                  {['900+ Videos', '100+ Live Mocks', 'Doubt Solving'].map(l => (
                    <div key={l} className="flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories — image cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-brand-navy">Choose Your Path</h2>
          <p className="text-sm text-brand-navy/60 mt-1">IGCSE · IB · CBSE · JEE · NEET · Olympiads</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <Link key={idx} href={cat.href}
              className="group relative rounded-2xl overflow-hidden h-36 md:h-44 block">
              <img src={cat.img} alt={cat.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.bg} opacity-70 group-hover:opacity-80 transition-opacity`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-3">
                <span className="text-2xl mb-1">{cat.icon}</span>
                <h3 className="font-extrabold text-sm leading-tight">{cat.title}</h3>
              </div>
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-4 w-4 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Hodu */}
      <section className="bg-brand-navy py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="text-[11px] font-bold text-brand-border/60 uppercase tracking-widest">THE HODU ADVANTAGE</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 leading-tight">
                Why Students<br className="sm:hidden" /> Choose Us
              </h2>
              <p className="text-white/50 text-sm font-light mt-2 max-w-sm">
                Every feature built around one goal — your highest possible score.
              </p>
            </div>
            <Link href="/contact"
              className="shrink-0 inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-accent text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
              Book Free Demo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Cards — horizontal scroll on mobile, grid on lg */}
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide lg:grid lg:grid-cols-3 lg:overflow-visible">
            {whyHodu.map((item) => (
              <div key={item.label}
                className="relative shrink-0 w-[78vw] sm:w-72 lg:w-auto snap-start rounded-2xl overflow-hidden group cursor-default">

                {/* Background image */}
                <img src={item.img} alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} opacity-80 group-hover:opacity-75 transition-opacity`} />

                {/* Content */}
                <div className="relative p-6 flex flex-col h-52">
                  {/* Big stat */}
                  <div className="flex-1">
                    <div className="text-5xl font-black text-white leading-none tracking-tight">
                      {item.stat}
                    </div>
                    <div className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">
                      {item.title}
                    </div>
                  </div>

                  {/* Bottom info */}
                  <div className="border-t border-white/20 pt-4 mt-4">
                    <h3 className="text-white font-extrabold text-base leading-tight">{item.label}</h3>
                    <p className="text-white/70 text-xs font-light mt-1 leading-relaxed line-clamp-2">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom trust bar */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
            {[
              { val: '15,000+', lbl: 'Students Mentored' },
              { val: '7 Years', lbl: 'Of Academic Excellence' },
              { val: '4.9 ★', lbl: 'Average Parent Rating' },
            ].map(({ val, lbl }) => (
              <div key={lbl}>
                <div className="text-2xl font-black text-brand-border">{val}</div>
                <div className="text-white/40 text-xs font-semibold uppercase tracking-wider mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {courses && courses.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between mb-6">
            <div>
              <span className="text-[11px] font-bold text-brand-accent uppercase tracking-widest">POPULAR</span>
              <h2 className="text-3xl font-extrabold text-brand-navy mt-0.5">Featured Courses</h2>
            </div>
            <Link href="/courses" className="text-xs font-bold text-brand-maroon border border-brand-maroon/20 hover:bg-brand-maroon hover:text-white px-4 py-2 rounded-lg transition-all shrink-0">
              View All
            </Link>
          </div>
          {/* Horizontal scroll on mobile, grid on md+ */}
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
                <div key={course.id} className="bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col shrink-0 w-[78vw] md:w-auto snap-start">
                  <div className="h-36 relative overflow-hidden">
                    {cardImg ? (
                      <>
                        <img src={cardImg} alt={course.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <span className="absolute bottom-3 left-3 text-white font-bold text-xs bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">{course.category}</span>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-maroon to-brand-accent flex items-end p-4">
                        <span className="text-white font-bold text-sm">{course.category}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[10px] font-bold text-brand-maroon uppercase tracking-wider">{course.category} · {course.class_level}</span>
                    <h3 className="font-bold text-brand-navy mt-1 mb-3 text-sm leading-snug">{course.title}</h3>
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-brand-border">
                      <span className="text-lg font-extrabold text-brand-navy">
                        {course.fee ? `₹${course.fee}` : 'Contact Us'}
                      </span>
                      <Link href="/enroll"
                        className="bg-brand-maroon hover:bg-brand-accent text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1">
                        Enroll <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Toppers */}
      <section className="py-14 bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">OUR STARS</span>
            </div>
            <h2 className="text-3xl font-extrabold">Top Achievers 2025</h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {achievers.map(t => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center hover:bg-white/10 transition-all">
                {'photo_url' in t && t.photo_url ? (
                  <img src={t.photo_url} alt={t.name} className="h-12 w-12 rounded-full object-cover mx-auto mb-2" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-brand-maroon flex items-center justify-center font-extrabold text-white text-sm mx-auto mb-2">
                    {t.initials}
                  </div>
                )}
                <p className="text-base font-extrabold text-yellow-400">{t.pct}</p>
                <p className="text-[11px] font-bold text-white mt-0.5 leading-tight">{t.name}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{t.stream}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/contact" className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-accent text-white font-bold px-7 py-3 rounded-xl transition-colors text-sm">
              Start Your Journey <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-brand-bg border-y border-brand-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[11px] font-bold text-brand-accent uppercase tracking-widest">STUDENT VOICES</span>
            <h2 className="text-3xl font-extrabold text-brand-navy mt-1">What Our Students Say</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white border border-brand-border p-5 rounded-xl shadow-sm relative">
                <span className="absolute -top-3 right-5 text-4xl text-brand-maroon/20 font-serif font-black">"</span>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-brand-border flex items-center justify-center font-extrabold text-brand-maroon text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-navy">{t.name}</h4>
                    <p className="text-[10px] text-brand-navy/50">{t.score}</p>
                  </div>
                </div>
                <p className="text-xs text-brand-navy/70 leading-relaxed font-light">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-white border-b border-brand-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-brand-navy">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-brand-border rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-3.5 cursor-pointer list-none bg-brand-bg hover:bg-brand-border/30 transition-colors">
                  <span className="font-semibold text-brand-navy text-sm pr-4">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-brand-maroon shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 py-3.5 text-sm text-brand-navy/70 font-light leading-relaxed bg-white">{faq.a}</div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href={`tel:${HODU.phone}`}
              className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-accent text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
              <Phone className="h-4 w-4" /> {HODU.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="py-14 bg-brand-bg border-b border-brand-border">
        <div className="max-w-5xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-brand-navy">Book a Free Consultation</h2>
            <p className="text-sm text-brand-navy/60 font-light">Our counsellors call back within 2 hours. Zero pressure.</p>
            <div className="space-y-2 pt-2">
              {[
                { icon: '📞', text: HODU.phone },
                { icon: '✉️', text: HODU.email },
                { icon: '📍', text: HODU.address },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-3 text-sm text-brand-navy/70">
                  <span>{item.icon}</span>
                  <span className="font-light">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-7">
          <h2 className="text-3xl font-extrabold text-brand-navy">Latest Blog</h2>
          <Link href="/blog" className="text-xs font-bold text-brand-maroon border border-brand-maroon/20 hover:bg-brand-maroon hover:text-white px-4 py-2 rounded-lg transition-all shrink-0">
            View All
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-3 snap-x snap-mandatory scrollbar-hide sm:grid sm:grid-cols-3 sm:overflow-visible max-w-7xl mx-auto">
          {blogs.map(blog => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`}
              className="group block bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-md transition-all shrink-0 w-[78vw] sm:w-auto snap-start">
              <div className="h-28 bg-gradient-to-br from-brand-navy to-brand-maroon flex items-end p-4">
                <span className="text-white/60 text-xs font-mono">{blog.date}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-brand-navy text-sm leading-snug group-hover:text-brand-maroon transition-colors line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-brand-maroon font-bold mt-3 flex items-center gap-1">Read more <ArrowRight className="h-3 w-3" /></p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
