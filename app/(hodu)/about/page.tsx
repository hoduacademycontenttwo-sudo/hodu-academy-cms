import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import Link from 'next/link'
import { GraduationCap, Award, Target, Users, BookOpen, CheckCircle2, Phone, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'About Us — Hodu Academy | Founders, Pedagogy & Faculty Mentors',
  description: 'Learn about Hodu Academy\'s heritage, pedagogical philosophy, founders from MNIT & IIIT, and certified international & national board faculty.',
}

const pillars = [
  {
    icon: Target,
    title: 'Concept-First Mastery',
    text: 'We firmly reject rote memorization. Our mentors dissect fundamental principles using real-world analogies, step-by-step mathematical proofs, and active questioning.',
    tag: 'Cognitive Rigor'
  },
  {
    icon: Award,
    title: 'Diagnostic Analytics',
    text: 'Every mock test generates granular topic-by-topic analytics, pinpointing conceptual weaknesses and time-management leaks before board & entrance exams.',
    tag: 'Data-Driven'
  },
  {
    icon: Users,
    title: 'Transparent Mentorship',
    text: 'Weekly attendance and evaluation metrics delivered directly to parents. Regular 1-on-1 parent-teacher strategy conferences to ensure synchronized progress.',
    tag: 'Parent Partnership'
  },
]

const founders = [
  { initials: 'VP', name: 'Mr. VP Singh',         title: 'Co-Founder & Academic Director', role: 'Former senior board examiner with 25+ years of classroom teaching experience across Physics and Mechanics.', college: 'MNIT Jaipur Alum' },
  { initials: 'RJ', name: 'Mr. Rohit Jain',       title: 'Co-Founder & Chemistry Head',    role: 'Author of widely referenced Olympiad and competitive chemistry prep workbooks with 16+ years of mentoring.', college: 'MNIT Jaipur Alum' },
  { initials: 'AA', name: 'Mr. Abhishek Agarwal', title: 'Co-Founder & EdTech Lead',        role: 'Ex-Palantir & Qualcomm engineer directing Hodu’s interactive learning platforms and digital assessment labs.', college: 'IIIT Hyderabad Alum' },
]

const milestones = [
  { year: '2018', title: 'Foundation in Jaipur', event: 'Hodu Academy established with an initial cohort of 20 Cambridge IGCSE & CBSE students.' },
  { year: '2020', title: 'IB & Olympiad Track', event: 'Expanded into International Baccalaureate (IB DP) and Junior Olympiad talent programs.' },
  { year: '2022', title: 'Integrated Testing Labs', event: 'Launched state-of-the-art Computer-Based Testing (CBT) lab and daily 1-on-1 doubt desks.' },
  { year: '2025', title: '15,000+ Students Mentored', event: 'Achieved 99.4% top board score and consistent All-India rankings in JEE & NEET.' },
]

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: faculty } = await supabase
    .from('cms_faculty')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .order('sort_order')

  return (
    <div className="space-y-0 animate-fade-in text-brand-navy">

      {/* Hero */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-brand-bg via-white to-brand-bg academic-grid-pattern border-b border-brand-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 bg-brand-maroon/10 text-brand-maroon text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-brand-maroon/20">
            <Sparkles className="h-3.5 w-3.5" />
            OUR HERITAGE & PEDAGOGICAL PHILOSOPHY
          </span>
          <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-navy leading-tight">
            Nurturing Exceptional Minds Through <span className="italic font-normal text-brand-maroon underline decoration-brand-maroon/30 underline-offset-8">Academic Rigor</span>
          </h1>
          <p className="text-sm sm:text-base text-brand-navy/75 max-w-3xl mx-auto font-light leading-relaxed">
            Founded by premier university educators, Hodu Academy bridges rigorous conceptual coaching with intimate 1:12 batches, ensuring students in Jaipur and worldwide achieve their absolute best in school boards, competitive tests, and international diplomas.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border border-brand-border rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest bg-brand-maroon/10 text-brand-maroon px-3 py-1 rounded-full inline-block border border-brand-maroon/20">
                OUR MISSION
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-brand-navy">
                Empowering Students to Excel Without Fear
              </h2>
              <p className="text-xs sm:text-sm text-brand-navy/75 leading-relaxed font-light">
                To replace passive rote memorization with deep conceptual clarity, structured past-paper analysis, and continuous 1-on-1 mentorship. We instill critical reasoning, exam resilience, and unwavering academic confidence.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-brand-border/60 flex items-center gap-2 text-xs font-bold text-brand-maroon">
              <CheckCircle2 className="h-4 w-4" />
              <span>100% Syllabus Mastery Framework</span>
            </div>
          </div>

          <div className="bg-brand-navy text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between dark-grid-pattern relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/15 text-brand-gold px-3 py-1 rounded-full inline-block border border-white/20">
                OUR VISION
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-white">
                India’s Benchmark for Academic Mentorship
              </h2>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-light">
                To build an institutional learning environment where small cohort sizes, master teachers, and cutting-edge testing diagnostics come together to give every child a clear pathway to top global universities and engineering/medical institutions.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/15 flex items-center gap-2 text-xs font-bold text-brand-gold relative z-10">
              <CheckCircle2 className="h-4 w-4" />
              <span>Accredited Curriculum Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="reveal bg-brand-bg border-y border-brand-border py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs bg-brand-maroon/10 text-brand-maroon px-3.5 py-1 rounded-full font-black uppercase tracking-widest inline-block border border-brand-maroon/20 mb-2.5">
              THE THREE PILLARS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-navy">
              The Foundations of Hodu’s Teaching Model
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {pillars.map(p => {
              const Icon = p.icon
              return (
                <div key={p.title} className="bg-white border border-brand-border p-8 rounded-3xl shadow-xs card-hover flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-brand-bg rounded-2xl flex items-center justify-center text-brand-maroon border border-brand-border">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-maroon bg-brand-maroon/10 px-2.5 py-0.5 rounded-full inline-block">
                      {p.tag}
                    </span>
                    <h3 className="font-serif-editorial font-bold text-lg text-brand-navy">{p.title}</h3>
                    <p className="text-xs text-brand-navy/70 leading-relaxed font-light">{p.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="reveal py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs bg-brand-maroon/10 text-brand-maroon px-3.5 py-1 rounded-full font-black uppercase tracking-widest inline-block border border-brand-maroon/20 mb-2.5">
              ACADEMIC LEADERSHIP
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-navy">
              Meet the Academic Directors
            </h2>
            <p className="text-xs sm:text-sm text-brand-navy/60 font-light mt-2">
              Seasoned educators and technologists with over 50 years of collective classroom teaching experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {founders.map(f => (
              <div key={f.name} className="bg-white border border-brand-border p-7 rounded-3xl shadow-sm card-hover flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="h-28 bg-gradient-to-br from-brand-maroon to-brand-navy rounded-2xl flex items-center justify-center text-brand-gold font-black text-4xl shadow-md border border-white/20 select-none">
                    {f.initials}
                  </div>
                  <div>
                    <h3 className="font-serif-editorial font-bold text-brand-navy text-lg">{f.name}</h3>
                    <p className="text-xs text-brand-maroon font-black uppercase tracking-wider mt-1">{f.title}</p>
                    <p className="text-[11px] text-brand-navy/50 font-semibold mt-0.5">{f.college}</p>
                  </div>
                  <p className="text-xs text-brand-navy/75 font-light leading-relaxed">{f.role}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-brand-border text-[11px] text-brand-navy/60 flex justify-between items-center font-medium">
                  <span className="flex items-center gap-1.5 text-brand-maroon font-bold">
                    <GraduationCap className="h-4 w-4" />
                    <span>Academic Board</span>
                  </span>
                  <span>Verified Mentor</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="reveal bg-brand-navy text-white py-16 sm:py-20 relative dark-grid-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs bg-white/10 text-brand-gold px-3.5 py-1 rounded-full font-black uppercase tracking-widest inline-block border border-white/20 mb-2.5">
              THE JOURNEY
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold tracking-tight">
              Milestones of Academic Distinction
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map(m => (
              <div key={m.year} className="bg-white/5 border border-white/15 rounded-3xl p-6 hover:bg-white/10 transition-all duration-300">
                <span className="text-2xl font-black text-brand-gold block mb-2 font-display-modern">
                  {m.year}
                </span>
                <h4 className="font-bold text-white text-sm mb-2">{m.title}</h4>
                <p className="text-xs text-white/70 leading-relaxed font-light">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="reveal py-16 bg-brand-bg text-center border-t border-brand-border">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="font-serif-editorial text-3xl font-bold text-brand-navy">Speak with Our Academic Directors</h2>
          <p className="text-xs sm:text-sm text-brand-navy/70 font-light">
            Book an obligation-free 30-minute diagnostic session to assess your child’s current syllabus standing and tailored learning roadmap.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3.5">
            <Link href="/contact"
              className="bg-brand-maroon hover:bg-brand-crimson text-white font-extrabold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md">
              Book Diagnostic Session
            </Link>
            <a href={`tel:${HODU.phone}`}
              className="bg-white hover:bg-brand-cream text-brand-navy border border-brand-border font-bold px-7 py-3.5 rounded-xl text-xs transition-all flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-maroon" /> {HODU.phone}
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
