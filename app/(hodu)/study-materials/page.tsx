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
    desc: 'NCERT booster notes, 30-problem DPP sets, and CBT mock exam question banks.',
    topics: ['Mechanics', 'Thermodynamics', 'Electrostatics', 'Organic Reaction Mechanisms', 'Integral Calculus'],
  },
  {
    slug: 'jee-advanced',
    dbCategory: 'jee advanced',
    label: 'JEE Advanced Master Series',
    icon: FlaskConical,
    desc: 'High-difficulty multi-concept problems, advanced subject notes, and 15-year IIT papers.',
    topics: ['Rotational Dynamics', 'Ionic Equilibrium', 'Coordinate Geometry', 'Modern Physics', 'Functional Equations'],
  },
  {
    slug: 'neet',
    dbCategory: 'neet',
    label: 'NEET-UG High Yield Notes',
    icon: Dna,
    desc: 'Line-by-line NCERT Biology maps, Chemistry reaction charts, and Physics numerical sheets.',
    topics: ['Genetics & Evolution', 'Human Physiology', 'Cell Biology', 'Organic Chemistry', 'Optics & Ray Diagrams'],
  },
  {
    slug: 'ncert-solutions',
    dbCategory: 'ncert',
    label: 'NCERT Exemplar Solutions',
    icon: BookOpen,
    desc: 'Step-by-step exemplar problem solutions for Classes 9, 10, 11 & 12 Science and Mathematics.',
    topics: ['Class 10 Science', 'Class 10 Math', 'Class 11 Physics', 'Class 12 Chemistry', 'Class 12 Math'],
  },
  {
    slug: 'cbse',
    dbCategory: 'cbse',
    label: 'CBSE Board Practice Sets',
    icon: Target,
    desc: 'Board pattern sample papers, competency questions, and step-marking presentation guides.',
    topics: ['Class 10 Board Papers', 'Class 12 Physics', 'Class 12 Chemistry', 'Class 12 Math', 'Marking Schemes'],
  },
  {
    slug: 'olympiad',
    dbCategory: 'olympiad',
    label: 'Olympiad Talent Series',
    icon: Award,
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
    <div className="space-y-0 animate-fade-in bg-white">

      {/* Hero */}
      <section className="relative py-16 sm:py-20 bg-brand-maroon text-white border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-white text-brand-maroon text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              ACADEMIC REPOSITORY & DPPS
            </span>
            <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Curated Study Materials & Past Paper Archives
            </h1>
            <p className="text-white/90 text-sm sm:text-base font-normal leading-relaxed">
              Chapter-wise problem sheets, handwritten formula summaries, and marking scheme rubrics curated by senior board examiners.
            </p>
            {totalCount > 0 && (
              <p className="text-xs font-mono text-white/80">
                {totalCount} downloadable resources available in repository
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Subject cards grid */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map(s => {
              const IconComp = s.icon
              const count = countForSubject(s.dbCategory)
              return (
                <div key={s.slug}
                  className="bg-white border-2 border-brand-border rounded-2xl p-7 shadow-xs hover:shadow-md hover:border-brand-maroon transition-all flex flex-col justify-between group">
                  
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-brand-maroon text-white flex items-center justify-center shadow-xs">
                        <IconComp className="h-6 w-6" />
                      </div>
                      {count > 0 && (
                        <span className="text-[10px] font-bold text-brand-maroon bg-neutral-100 border border-brand-border px-2.5 py-1 rounded-md">
                          {count} Files
                        </span>
                      )}
                    </div>

                    <h2 className="font-serif-editorial font-bold text-neutral-900 text-xl mb-2 group-hover:text-brand-maroon transition-colors">{s.label}</h2>
                    <p className="text-xs text-neutral-600 font-normal leading-relaxed mb-5">{s.desc}</p>

                    {/* Topics */}
                    <div className="pt-4 border-t border-brand-border space-y-1.5 mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-2">Key Modules Included:</span>
                      {s.topics.map(t => (
                        <div key={t} className="flex items-center gap-2 text-xs text-neutral-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-maroon shrink-0" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Link */}
                  <Link href={`/study-materials/${s.slug}`}
                    className="w-full bg-brand-maroon hover:bg-brand-crimson text-white font-bold py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs transition-colors shadow-xs">
                    <span>Access {s.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Request Material Console */}
          <div className="mt-16 bg-white border-2 border-brand-border rounded-3xl p-8 sm:p-12 shadow-sm text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest bg-brand-maroon text-white px-3.5 py-1.5 rounded-full inline-block shadow-xs">
              CUSTOM MATERIAL REQUEST
            </span>
            <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-brand-maroon">Need a Specific Board Paper or Question Blueprint?</h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-normal max-w-xl mx-auto leading-relaxed">
              If your required chapter or Olympiad past year series is not listed, our academic faculty will compile a targeted PDF packet and send it directly via WhatsApp.
            </p>
            <div className="pt-3">
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-crimson text-white font-bold px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs">
                <span>Request Custom PDF Pack</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
