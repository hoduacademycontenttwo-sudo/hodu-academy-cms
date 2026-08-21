import Link from 'next/link'
import { ArrowRight, Atom, FlaskConical, Dna, BookOpen, Target, Award, Sparkles, FileText, Download } from 'lucide-react'
import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Study Materials & DPPs — Hodu Academy | Past Papers, Notes & Worksheets',
  description: 'Download chapter notes, Daily Practice Problems (DPPs), mock test papers and marking scheme analysis for Cambridge IGCSE, IB DP, CBSE, JEE & NEET.',
}

const subjects = [
  {
    slug: 'jee-main',
    dbCategory: 'jee main',
    label: 'JEE Main Archive',
    icon: Atom,
    color: 'from-brand-navy to-slate-900',
    desc: 'NCERT booster notes, 30-problem DPP sets, and CBT mock exam question banks.',
    topics: ['Mechanics', 'Thermodynamics', 'Electrostatics', 'Organic Reaction Mechanisms', 'Integral Calculus'],
  },
  {
    slug: 'jee-advanced',
    dbCategory: 'jee advanced',
    label: 'JEE Advanced Master Series',
    icon: FlaskConical,
    color: 'from-brand-maroon to-slate-900',
    desc: 'High-difficulty multi-concept problems, advanced subject notes, and 15-year IIT papers.',
    topics: ['Rotational Dynamics', 'Ionic Equilibrium', 'Coordinate Geometry', 'Modern Physics', 'Functional Equations'],
  },
  {
    slug: 'neet',
    dbCategory: 'neet',
    label: 'NEET-UG High Yield Notes',
    icon: Dna,
    color: 'from-emerald-900 to-slate-900',
    desc: 'Line-by-line NCERT Biology maps, Chemistry reaction charts, and Physics numerical sheets.',
    topics: ['Genetics & Evolution', 'Human Physiology', 'Cell Biology', 'Organic Chemistry', 'Optics & Ray Diagrams'],
  },
  {
    slug: 'ncert-solutions',
    dbCategory: 'ncert',
    label: 'NCERT Exemplar Solutions',
    icon: BookOpen,
    color: 'from-blue-950 to-slate-900',
    desc: 'Step-by-step exemplar problem solutions for Classes 9, 10, 11 & 12 Science and Mathematics.',
    topics: ['Class 10 Science', 'Class 10 Math', 'Class 11 Physics', 'Class 12 Chemistry', 'Class 12 Math'],
  },
  {
    slug: 'cbse',
    dbCategory: 'cbse',
    label: 'CBSE Board Practice Sets',
    icon: Target,
    color: 'from-teal-950 to-slate-900',
    desc: 'Board pattern sample papers, competency questions, and step-marking presentation guides.',
    topics: ['Class 10 Board Papers', 'Class 12 Physics', 'Class 12 Chemistry', 'Class 12 Math', 'Marking Schemes'],
  },
  {
    slug: 'olympiad',
    dbCategory: 'olympiad',
    label: 'Olympiad Talent Series',
    icon: Award,
    color: 'from-amber-950 to-slate-900',
    desc: 'Non-routine mathematical problem sets and experimental reasoning questions for IMO, NSO, and PRMO.',
    topics: ['Number Theory', 'Combinatorics', 'Euclidean Geometry', 'Algebraic Proofs', 'Physics Aptitude'],
  },
]

export default async function StudyMaterialsPage() {
  const supabase = await createClient()
  const { data: allResources } = await supabase
    .from('cms_resources')
    .select('category')
    .eq('site_id', HODU_SITE_ID)

  const resources = allResources ?? []
  const totalCount = resources.length

  function countForSubject(dbCategory: string) {
    return resources.filter(r =>
      (r.category ?? '').toLowerCase().includes(dbCategory)
    ).length
  }

  return (
    <div className="space-y-0 animate-fade-in text-brand-navy">

      {/* Hero */}
      <section className="relative py-16 sm:py-20 bg-brand-navy text-white dark-grid-pattern border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-brand-gold text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-white/15">
              <Sparkles className="h-3.5 w-3.5" />
              ACADEMIC REPOSITORY & DPPS
            </span>
            <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Curated Study Materials & Past Paper Archives
            </h1>
            <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed">
              Chapter-wise problem sheets, handwritten formula summaries, and marking scheme rubrics curated by senior board examiners.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-brand-maroon text-white py-5 border-b border-brand-maroon/30 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-10 text-sm font-semibold">
            {[[totalCount > 0 ? `${totalCount}+` : '100+', 'Curated Modules'], ['6', 'Exam Tracks'], ['100%', 'Free Access']].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <span className="font-black text-2xl block text-brand-gold font-display-modern">{val}</span>
                <span className="text-white/80 text-[11px] uppercase tracking-wider">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject grid */}
      <section className="bg-brand-bg py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {subjects.map(sub => {
              const Icon = sub.icon
              const count = countForSubject(sub.dbCategory)
              return (
                <Link key={sub.slug} href={`/study-materials/${sub.slug}`}
                  className="group bg-white border border-brand-border rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xs">
                  
                  <div className={`bg-gradient-to-br ${sub.color} p-7 text-white relative overflow-hidden`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-brand-gold">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="bg-white/15 text-brand-gold text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/10">
                        {count > 0 ? `${count} Modules` : 'Archived Sets'}
                      </span>
                    </div>
                    <h2 className="font-serif-editorial text-xl font-bold text-white mb-2">{sub.label}</h2>
                    <p className="text-white/70 text-xs font-light leading-relaxed">{sub.desc}</p>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-navy/50 mb-2.5">High-Yield Modules</p>
                      <div className="flex flex-wrap gap-1.5">
                        {sub.topics.map(t => (
                          <span key={t} className="text-[11px] bg-brand-bg border border-brand-border text-brand-navy/75 px-2.5 py-1 rounded-lg font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between text-brand-maroon text-xs font-black uppercase tracking-wider group-hover:text-brand-crimson">
                      <span>Access Free Problem Sets</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="bg-brand-navy text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold bg-white/10 px-3 py-1 rounded-full inline-block">
              STRUCTURED LEARNING ROADMAP
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-white">Need a Tailored Study Plan?</h2>
            <p className="text-white/70 text-xs sm:text-sm font-light leading-relaxed">
              Study materials give you practice, but guided coaching accelerates results. Request a personalized month-by-month preparation plan from our academic heads.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/courses" className="bg-brand-maroon hover:bg-brand-crimson text-white font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow">
                Explore Coaching Batches
              </Link>
              <Link href="/contact" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors">
                Request Diagnostic Test
              </Link>
            </div>
          </div>

          <div className="bg-white text-brand-navy rounded-3xl p-8 shadow-2xl border border-brand-border">
            <h3 className="font-serif-editorial font-bold text-brand-navy text-xl mb-1">Get Free Academic Blueprint</h3>
            <p className="text-xs text-brand-navy/60 mb-5 font-light">Direct phone consultation with our faculty coordinator.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3.5 bg-brand-bg rounded-2xl border border-brand-border text-xs">
                <FileText className="h-4 w-4 text-brand-maroon shrink-0" />
                <span className="font-medium">Personalized Chapter Weightage Matrix</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 bg-brand-bg rounded-2xl border border-brand-border text-xs">
                <Download className="h-4 w-4 text-brand-maroon shrink-0" />
                <span className="font-medium">Past 10 Years Solved Question PDFs</span>
              </div>
              <Link href="/contact" className="block w-full bg-brand-maroon hover:bg-brand-crimson text-white font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-wider text-center transition-all shadow mt-4">
                Schedule Faculty Call →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
