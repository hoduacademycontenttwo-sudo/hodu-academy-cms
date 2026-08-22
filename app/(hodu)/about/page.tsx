import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import Link from 'next/link'
import { GraduationCap, Award, Target, Users, BookOpen, CheckCircle2, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react'

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
  { year: '2026', title: '15,000+ Students Mentored', event: 'Achieved 99.4% top board score and consistent All-India rankings in JEE & NEET.' },
]

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: faculty } = await supabase
    .from('cms_faculty')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .order('sort_order')

  return (
    <div className="space-y-0 animate-fade-in bg-white">

      {/* Hero */}
      <section className="relative py-16 sm:py-24 bg-white border-b border-brand-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="inline-flex items-center gap-1.5 bg-brand-maroon text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs">
            <GraduationCap className="h-3.5 w-3.5" />
            OUR HERITAGE & PEDAGOGICAL PHILOSOPHY
          </span>
          <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-maroon leading-tight">
            Nurturing Exceptional Minds Through <span className="underline decoration-brand-maroon/30 underline-offset-8">Academic Rigor</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-700 max-w-3xl mx-auto font-normal leading-relaxed">
            Founded by premier university educators, Hodu Academy bridges rigorous conceptual coaching with intimate 1:12 batches, ensuring students in Jaipur and worldwide achieve their absolute best in school boards, competitive tests, and international diplomas.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white border-2 border-brand-border rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest bg-brand-maroon text-white px-3 py-1 rounded-md inline-block">
                OUR MISSION
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-neutral-900">
                Empowering Students to Excel Without Fear
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                To replace passive rote memorization with deep conceptual clarity, structured past-paper analysis, and continuous 1-on-1 mentorship. We instill critical reasoning, exam resilience, and unwavering academic confidence.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-brand-border flex items-center gap-2 text-xs font-bold text-brand-maroon">
              <CheckCircle2 className="h-4 w-4 text-brand-maroon" />
              <span>100% Syllabus Mastery Framework</span>
            </div>
          </div>

          <div className="bg-brand-maroon text-white rounded-3xl p-8 sm:p-10 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white text-brand-maroon px-3 py-1 rounded-md inline-block shadow-xs">
                OUR VISION
              </span>
              <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-white">
                India’s Benchmark for Academic Mentorship
              </h2>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                To be recognised across Rajasthan and globally as the gold standard in student-first coaching — where intellectual curiosity meets disciplined execution and extraordinary results follow naturally.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/20 flex items-center gap-2 text-xs font-bold text-white">
              <ShieldCheck className="h-4 w-4" />
              <span>Trusted by 15,000+ Families Since 2018</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pedagogical Pillars */}
      <section className="reveal py-16 sm:py-20 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-brand-maroon bg-brand-maroon/10 px-4 py-1.5 rounded-full inline-block mb-3 border border-brand-maroon/20">
              CORE PILLARS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon">
              The Three Tenets of Hodu Mentorship
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((p, idx) => {
              const IconComp = p.icon
              return (
                <div key={idx} className="bg-white border-2 border-brand-border rounded-2xl p-8 shadow-xs hover:border-brand-maroon transition-all">
                  <div className="w-12 h-12 rounded-xl bg-brand-maroon text-white flex items-center justify-center mb-6 shadow-sm">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-maroon bg-neutral-100 px-2.5 py-0.5 rounded-md inline-block mb-3 border border-brand-border">
                    {p.tag}
                  </span>
                  <h3 className="font-serif-editorial font-bold text-xl text-neutral-900 mb-3">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">{p.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Founders & Leadership */}
      <section className="reveal py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-brand-maroon bg-brand-maroon/10 px-4 py-1.5 rounded-full inline-block mb-3 border border-brand-maroon/20">
              ACADEMIC BOARD
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon">
              Guided by Premier University Alums
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-normal">Educators and engineers from MNIT Jaipur & IIIT Hyderabad directing day-to-day pedagogy.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {founders.map((f, idx) => (
              <div key={idx} className="bg-white border-2 border-brand-border rounded-2xl p-7 shadow-xs hover:border-brand-maroon transition-all">
                <div className="w-14 h-14 rounded-full bg-brand-maroon text-white font-bold text-lg flex items-center justify-center mb-5 shadow-sm">
                  {f.initials}
                </div>
                <span className="text-[10px] font-bold text-brand-maroon uppercase tracking-wider bg-neutral-100 px-2.5 py-0.5 rounded-md inline-block mb-2 border border-brand-border">
                  {f.college}
                </span>
                <h3 className="font-serif-editorial font-bold text-lg text-neutral-900">{f.name}</h3>
                <p className="text-xs font-bold text-brand-maroon mb-3">{f.title}</p>
                <p className="text-xs text-neutral-600 leading-relaxed font-normal">{f.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestone Timeline */}
      <section className="reveal py-16 sm:py-20 bg-brand-maroon text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-brand-maroon bg-white px-4 py-1.5 rounded-full inline-block mb-3 shadow-xs">
              GROWTH & LEGACY
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-white">Milestones of Excellence</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <div key={idx} className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all">
                <span className="text-3xl font-black text-white block mb-2 font-display-modern">{m.year}</span>
                <h3 className="font-bold text-base text-white mb-2">{m.title}</h3>
                <p className="text-xs text-white/80 leading-relaxed font-light">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="reveal py-16 sm:py-20 bg-white border-t border-brand-border text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon">
            Experience the Hodu Advantage First-Hand
          </h2>
          <p className="text-sm text-neutral-600 font-normal leading-relaxed">
            Schedule a personalized academic consultation and campus tour at our Jaipur center.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/contact"
              className="w-full sm:w-auto bg-brand-maroon hover:bg-brand-crimson text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2">
              <span>Book Consultation</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={`tel:${HODU.phone}`}
              className="w-full sm:w-auto bg-white hover:bg-neutral-50 text-brand-maroon border-2 border-brand-maroon font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
              <Phone className="h-4 w-4 text-brand-maroon" />
              <span>Call: {HODU.phone}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
