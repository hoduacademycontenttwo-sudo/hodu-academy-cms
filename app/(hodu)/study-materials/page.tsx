import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Study Materials — Hodu Academy',
  description: 'Free study materials, notes, DPPs and past papers for JEE, NEET, IGCSE, IB, CBSE and Olympiad preparation.',
}

const subjects = [
  {
    slug: 'jee-main',
    dbCategory: 'jee main',
    label: 'JEE Main',
    icon: '⚛️',
    color: 'from-orange-500 to-red-600',
    desc: 'Chapter notes, DPPs, mock tests and past papers for JEE Main 2026.',
    topics: ['Mechanics', 'Thermodynamics', 'Electrostatics', 'Organic Chemistry', 'Calculus'],
  },
  {
    slug: 'jee-advanced',
    dbCategory: 'jee advanced',
    label: 'JEE Advanced',
    icon: '🔬',
    color: 'from-red-600 to-rose-800',
    desc: 'High-difficulty problems, IIT-level notes and previous year papers.',
    topics: ['Complex Mechanics', 'Electrochemistry', 'Coordinate Geometry', 'Functional Equations'],
  },
  {
    slug: 'neet',
    dbCategory: 'neet',
    label: 'NEET',
    icon: '🧬',
    color: 'from-green-600 to-emerald-800',
    desc: 'NCERT-based notes, Biology diagrams, and full mock tests for NEET 2026.',
    topics: ['Cell Biology', 'Genetics', 'Human Physiology', 'Organic Chemistry', 'Optics'],
  },
  {
    slug: 'ncert-solutions',
    dbCategory: 'ncert',
    label: 'NCERT Solutions',
    icon: '📚',
    color: 'from-blue-600 to-indigo-800',
    desc: 'Step-by-step solutions for all NCERT chapters, Class 6 through 12.',
    topics: ['Class 9 Maths', 'Class 10 Science', 'Class 11 Physics', 'Class 12 Chemistry', 'Class 12 Biology'],
  },
  {
    slug: 'cbse',
    dbCategory: 'cbse',
    label: 'CBSE Board',
    icon: '🎯',
    color: 'from-teal-600 to-cyan-800',
    desc: 'Board-pattern notes, sample papers and marking scheme analysis for CBSE.',
    topics: ['Class 10 Maths', 'Class 12 Physics', 'Class 12 Chemistry', 'Class 12 Maths', 'Class 12 Biology'],
  },
  {
    slug: 'olympiad',
    dbCategory: 'olympiad',
    label: 'Olympiad',
    icon: '🏅',
    color: 'from-yellow-500 to-amber-700',
    desc: 'RMO, INMO, IOQM and international Olympiad preparation resources.',
    topics: ['Number Theory', 'Combinatorics', 'Euclidean Geometry', 'Algebra', 'Physics Olympiad'],
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
    <div className="animate-fade-in">

      {/* Hero */}
      <section className="bg-brand-navy text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/50">Free Resources</span>
            <h1 className="text-4xl font-extrabold mt-2 mb-3">Study Materials</h1>
            <p className="text-white/70 text-sm font-light leading-relaxed">
              Chapter notes, DPPs, past papers and mock tests for JEE, NEET, IGCSE, IB, CBSE and Olympiads — curated by our expert faculty.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="bg-brand-maroon text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-semibold">
            {[[totalCount > 0 ? `${totalCount}+` : '0', 'Resources'], ['6', 'Exam Tracks'], ['Free', 'Always Free']].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <span className="font-extrabold text-xl block">{val}</span>
                <span className="text-white/70 text-xs uppercase tracking-wider">{lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject grid */}
      <section className="bg-brand-bg py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(sub => {
              const count = countForSubject(sub.dbCategory)
              return (
                <Link key={sub.slug} href={`/study-materials/${sub.slug}`}
                  className="group bg-white border border-brand-border rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col">
                  <div className={`bg-gradient-to-br ${sub.color} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{sub.icon}</span>
                      <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {count > 0 ? `${count} resource${count !== 1 ? 's' : ''}` : 'Coming soon'}
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold">{sub.label}</h2>
                    <p className="text-white/80 text-xs font-light mt-1">{sub.desc}</p>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-brand-navy/50 mb-2">Key Topics</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {sub.topics.map(t => (
                        <span key={t} className="text-[11px] bg-brand-bg border border-brand-border text-brand-navy/70 px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center gap-1.5 text-brand-maroon text-xs font-bold group-hover:gap-2.5 transition-all">
                      Browse Materials <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-navy text-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold">Want guided preparation?</h2>
            <p className="text-white/60 text-sm font-light">Study materials are a starting point. Our structured courses + expert mentoring get you to the top ranks.</p>
            <div className="flex gap-3 pt-2">
              <Link href="/courses" className="bg-brand-maroon hover:bg-brand-accent text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors">
                View Courses
              </Link>
              <a href={`tel:${HODU.phone}`} className="border border-white/20 text-white hover:bg-white/10 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                Call Us
              </a>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <p className="font-extrabold text-brand-navy text-sm uppercase tracking-wider mb-1">Get a Free Study Plan</p>
            <p className="text-xs text-brand-navy/50 mb-4">Personalised month-by-month plan from our faculty</p>
            <Link href="/contact" className="block w-full bg-brand-maroon hover:bg-brand-accent text-white font-bold py-3 rounded-xl text-sm text-center transition-colors">
              Request Study Plan
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
