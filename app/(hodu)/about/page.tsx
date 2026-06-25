import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export const metadata = {
  title: 'About Us — Hodu Academy',
  description: 'Learn about Hodu Academy\'s mission, founders, and top faculty.',
}

const pillars = [
  { icon: '🏆', title: 'Concept First, Scores Follow',    text: 'We reject rote memorisation. Our teachers use interactive modules, analogies, and daily practice to foster intuitive conceptual clarity.' },
  { icon: '🔬', title: 'Clinical Progress Evaluation',    text: 'Every diagnostic mock test computes accurate percentile standings, allowing mentors to suggest daily learning roadmap adjustments dynamically.' },
  { icon: '🤝', title: 'Cooperative Parent Integration',  text: 'No parent is kept in the dark. We share progress reports and classroom attendance logs via WhatsApp alerts and monthly PTM sessions.' },
]

const founders = [
  { initials: 'VP', name: 'Mr. VP Singh',         title: 'Co-Founder & Academic Director', role: 'Former board examiner with 25+ years of teaching Math and Physics.', college: 'MNIT Jaipur' },
  { initials: 'RJ', name: 'Mr. Rohit Jain',       title: 'Co-Founder & Chemistry Head',    role: 'Author of bestselling NTSE and Olympiad prep workbooks.', college: 'MNIT Jaipur' },
  { initials: 'AA', name: 'Mr. Abhishek Agarwal', title: 'Co-Founder & Tech Lead',         role: 'Ex-Palantir, Ex-Qualcomm — building Hodu\'s LMS and EdTech backbone.', college: 'IIIT Hyderabad' },
]

const milestones = [
  { year: '2019', event: 'Hodu Academy founded in Jaipur with a small batch of 20 IGCSE students.' },
  { year: '2021', event: 'Launched interactive live-hybrid batches for CBSE and JEE, reaching 1,000+ students.' },
  { year: '2023', event: 'Integrated full LMS with test series, recorded lectures, and performance dashboards.' },
  { year: '2025', event: 'Over 10,000 students mentored with 98%+ board pass ratio across IGCSE, IB, and CBSE.' },
]

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: faculty } = await supabase
    .from('cms_faculty')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .order('sort_order')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-fade-in text-brand-navy">

      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs bg-brand-bg text-brand-maroon px-3 py-1 rounded font-bold uppercase tracking-wider inline-block border border-brand-border">
          Established in Jaipur, India
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight">Nurturing Every Child's Potential</h1>
        <p className="text-sm text-brand-navy/70 leading-relaxed font-light">
          At Hodu Academy we believe in nurturing every child's potential by combining strong academic growth with holistic development. Our approach balances rigorous learning with engaging extracurriculars, ensuring children thrive intellectually and emotionally.
        </p>
      </section>

      {/* Mission / Vision */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-brand-white border border-brand-border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-brand-maroon mb-3">Our Mission</h2>
          <p className="text-sm text-brand-navy/70 leading-relaxed font-light">
            Hodu Academy is dedicated to unlocking each student's potential by providing top-tier academic instruction, fostering holistic personal growth, and offering enriching extracurricular opportunities. We create a nurturing and innovative environment where critical thinking, creativity, and resilience are cultivated.
          </p>
        </div>
        <div className="bg-brand-navy text-white rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-extrabold text-brand-bg mb-3">Our Vision</h2>
          <p className="text-sm text-white/70 leading-relaxed font-light">
            To be the most trusted educational partner for students worldwide — combining world-class academics with holistic growth opportunities, and empowering every student to reach their highest potential through innovation, passion, and excellence in teaching.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map(p => (
          <div key={p.title} className="bg-brand-white border border-brand-border p-6 rounded-2xl shadow-sm text-center space-y-4">
            <div className="h-12 w-12 bg-brand-bg rounded-full flex items-center justify-center text-brand-maroon mx-auto text-xl border border-brand-border">
              {p.icon}
            </div>
            <h3 className="font-extrabold text-sm uppercase tracking-wider">{p.title}</h3>
            <p className="text-xs text-brand-navy/70 leading-relaxed font-light">{p.text}</p>
          </div>
        ))}
      </section>

      {/* Founders */}
      <section className="space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold pb-2 border-b border-brand-border inline-block">Our Founders</h2>
          <p className="text-xs text-brand-navy/60 font-light mt-2">The visionaries behind Hodu Academy's academic excellence.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {founders.map(f => (
            <div key={f.name} className="bg-brand-white border border-brand-border p-5 rounded-xl hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-24 bg-brand-bg rounded-xl flex items-center justify-center text-brand-maroon font-black text-4xl shadow-inner select-none border border-brand-border">
                  {f.initials}
                </div>
                <div>
                  <h3 className="font-extrabold text-brand-navy text-sm">{f.name}</h3>
                  <p className="text-[10px] text-brand-maroon font-bold uppercase tracking-wider mt-0.5">{f.title}</p>
                  <p className="text-[10px] text-brand-navy/50 mt-0.5">{f.college}</p>
                </div>
                <p className="text-xs text-brand-navy/70 font-light leading-relaxed">{f.role}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border text-[10px] text-brand-navy/50 flex justify-between items-center">
                <span className="flex items-center space-x-1">
                  <GraduationCap className="h-4 w-4 text-brand-maroon" />
                  <span>Co-Founder</span>
                </span>
                <span>Verified Expert</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Faculty (from DB) */}
      {faculty && faculty.length > 0 && (
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-extrabold pb-2 border-b border-brand-border inline-block">Our Elite Faculty</h2>
            <p className="text-xs text-brand-navy/60 font-light mt-2">Learn directly from qualified board coordinators and teachers with decades of classroom experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faculty.map(f => (
              <div key={f.id} className="bg-brand-white border border-brand-border p-5 rounded-xl hover:shadow-md transition-all">
                <div className="h-24 bg-brand-bg rounded-xl flex items-center justify-center font-black text-3xl text-brand-maroon mb-4 border border-brand-border">
                  {f.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                </div>
                <h3 className="font-extrabold text-brand-navy text-sm">{f.name}</h3>
                <p className="text-[10px] text-brand-maroon font-bold uppercase tracking-wider mt-0.5">{f.subject} · {f.experience}</p>
                <p className="text-xs text-brand-navy/70 font-light leading-relaxed mt-3 line-clamp-4">{f.bio}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Timeline */}
      <section className="bg-brand-bg border-y border-brand-border py-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-extrabold text-brand-navy">Milestones of Academic Trust</h2>
            <p className="text-xs text-brand-navy/60 font-light mt-1">Our journey of scaling elite academic mentorship across secondary schools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            {milestones.map(mil => (
              <div key={mil.year} className="space-y-2">
                <span className="text-lg font-black text-brand-maroon bg-white px-3 py-1 rounded inline-block border border-brand-border">
                  {mil.year}
                </span>
                <p className="text-xs text-brand-navy/80 leading-relaxed font-light">{mil.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-8">
        <h2 className="text-2xl font-extrabold text-brand-navy mb-3">For Any Enquiry Call Us</h2>
        <a href={`tel:${HODU.phone}`}
          className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-accent text-white font-bold px-8 py-3 rounded-xl text-lg transition-colors mt-2">
          📞 {HODU.phone}
        </a>
      </section>
    </div>
  )
}
