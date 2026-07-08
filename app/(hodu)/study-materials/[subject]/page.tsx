import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, CheckCircle2, BookOpen, FileText, ExternalLink } from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

const subjectData: Record<string, {
  label: string; icon: string; color: string; gradient: string;
  dbCategory: string;
  tagline: string; overview: string;
  syllabus: string[];
  tips: string[];
  relatedCourse: string;
}> = {
  'jee-main': {
    label: 'JEE Main', icon: '⚛️', color: 'text-orange-600',
    gradient: 'from-orange-500 to-red-600',
    dbCategory: 'jee main',
    tagline: 'Crack JEE Main with structured notes and daily practice',
    overview: 'JEE Main is the gateway to NITs, IIITs, and CFTIs. It tests Physics, Chemistry, and Mathematics at the Class 11–12 level with a focus on speed, accuracy, and conceptual depth.',
    syllabus: ['Physics: Mechanics, Thermodynamics, Electrostatics, Optics, Modern Physics', 'Chemistry: Physical (Thermodynamics, Equilibrium, Electrochemistry), Organic (GOC, Hydrocarbons, Reactions), Inorganic (Periodic Table, p-block, d-block)', 'Mathematics: Calculus, Algebra, Coordinate Geometry, Trigonometry, Vectors & 3D'],
    tips: ['Complete NCERT for Chemistry before switching to any reference book', 'Solve at least 3 PYQ papers from 2020–2024 before Session 1', 'Allocate 1.5 hours per subject per day — no subject should be left more than 3 days without revision'],
    relatedCourse: 'Competitive Exams',
  },
  'jee-advanced': {
    label: 'JEE Advanced', icon: '🔬', color: 'text-red-700',
    gradient: 'from-red-600 to-rose-800',
    dbCategory: 'jee advanced',
    tagline: 'IIT-level preparation — deep conceptual problems and IIT PYQs',
    overview: 'JEE Advanced is conducted by the IITs for admission to B.Tech/Dual Degree programmes. It is significantly harder than JEE Main, testing higher-order thinking, multi-concept problems, and mathematical rigour.',
    syllabus: ['Physics: Advanced Mechanics (rotation, SHM, waves), Electrodynamics, Optics, Nuclear Physics', 'Chemistry: Advanced Organic (named reactions, mechanisms), Coordination Chemistry, Quantum Chemistry', 'Mathematics: Complex Analysis, Probability, Integral Calculus, Conic Sections'],
    tips: ['Never skip the "Why" behind any formula — JEE Advanced will change the setup so rote application fails', 'Spend at least 2 hours weekly on IIT PYQs from the last 10 years', 'Physics requires graph reading — practice interpreting P-V, V-T, and I-V diagrams'],
    relatedCourse: 'Competitive Exams',
  },
  'neet': {
    label: 'NEET', icon: '🧬', color: 'text-green-700',
    gradient: 'from-green-600 to-emerald-800',
    dbCategory: 'neet',
    tagline: 'NCERT-focused notes, Biology diagrams, and full mock tests',
    overview: 'NEET is India\'s single entrance test for MBBS, BDS, and AYUSH. Biology is the highest-weightage subject (360/720 marks). NCERT mastery is non-negotiable — 85%+ of NEET questions are directly traceable to NCERT text and diagrams.',
    syllabus: ['Biology: Cell Biology, Genetics & Evolution, Plant Physiology, Human Physiology, Ecology, Biotechnology', 'Physics: Mechanics, Thermodynamics, Optics, Modern Physics (Class 11 + 12)', 'Chemistry: Physical, Organic (Biomolecules, Polymers), Inorganic (p-block, d-f block)'],
    tips: ['Read NCERT Biology at least 3 times before moving to supplementary material', 'Draw and label every diagram from memory — they appear directly in NEET papers', 'For Physics and Chemistry, NCERT Exemplar is the best second source after NCERT'],
    relatedCourse: 'Competitive Exams',
  },
  'ncert-solutions': {
    label: 'NCERT Solutions', icon: '📚', color: 'text-blue-700',
    gradient: 'from-blue-600 to-indigo-800',
    dbCategory: 'ncert',
    tagline: 'Step-by-step solutions for every NCERT chapter, Class 6–12',
    overview: 'NCERT textbooks are the foundation for all major Indian board exams and competitive tests. Our solutions are written by subject experts with full working, alternate methods where applicable, and exam-relevant notes.',
    syllabus: ['Class 9: Maths (Number Systems → Statistics), Science (Motion → Natural Resources)', 'Class 10: Maths (Polynomials → Probability), Science (Chemical Reactions → Sustainable Management)', 'Class 11: Physics, Chemistry, Maths, Biology', 'Class 12: Physics, Chemistry, Maths, Biology'],
    tips: ['Solve every NCERT exercise before looking at the solutions', 'Pay attention to the "examples" in NCERT — they are frequently directly quoted in board exams', 'For Class 12 Maths, NCERT Miscellaneous Exercises are often exam-level'],
    relatedCourse: 'CBSE',
  },
  'cbse': {
    label: 'CBSE Board', icon: '🎯', color: 'text-teal-700',
    gradient: 'from-teal-600 to-cyan-800',
    dbCategory: 'cbse',
    tagline: 'Board-pattern notes, sample papers and marking scheme analysis',
    overview: 'CBSE board exams for Class 10 and 12 follow a structured pattern with marks distributed across MCQs, short answers, and long answers. Understanding the marking scheme is as important as subject knowledge.',
    syllabus: ['Class 10: Maths, Science, Social Science, English, Hindi', 'Class 12: Physics, Chemistry, Biology, Maths, Computer Science, Economics, Accountancy'],
    tips: ['Always study the official CBSE Sample Papers released in October — they reflect the actual exam pattern', 'For long-answer questions, use the CBSE marking scheme structure: definition → explanation → example/diagram', 'For Class 12 Maths, practice 3-mark and 5-mark problems daily from January onwards'],
    relatedCourse: 'CBSE',
  },
  'olympiad': {
    label: 'Olympiad', icon: '🏅', color: 'text-yellow-700',
    gradient: 'from-yellow-500 to-amber-700',
    dbCategory: 'olympiad',
    tagline: 'RMO, INMO, IOQM and international Olympiad preparation',
    overview: 'Mathematical and Science Olympiads require creative problem-solving far beyond the standard curriculum. Success requires building a deep toolkit of techniques and then applying them flexibly to unseen problems.',
    syllabus: ['Math Olympiad: Number Theory, Combinatorics, Euclidean Geometry, Algebra (Polynomials, Inequalities, Functional Equations)', 'Science Olympiad: Physics (IPhO-style mechanics and electrodynamics), Chemistry (IChO level), Biology (IBO level)'],
    tips: ['Do not solve Olympiad problems in a rush — spend 1–2 hours on each problem before reading solutions', 'Keep a "technique notebook" — every new method deserves a summary and 3 example problems', 'Geometry requires dedicated daily practice of constructions and proof writing from Class 9 onwards'],
    relatedCourse: 'Olympiads',
  },
}

async function resolveSubject(subject: string) {
  if (subjectData[subject]) return subjectData[subject]

  // Not a hardcoded subject — check if admin added it to the Study Materials menu
  // and build a generic page for it so new items never 404.
  const supabase = await createClient()
  const { data: navLink } = await supabase
    .from('cms_nav_links')
    .select('label, tagline, overview')
    .eq('site_id', HODU_SITE_ID)
    .eq('group_name', 'study_materials')
    .eq('href', `/study-materials/${subject}`)
    .single()

  if (!navLink) return null

  return {
    label: navLink.label, icon: '📘', color: 'text-brand-maroon',
    gradient: 'from-brand-navy to-brand-navy/80',
    dbCategory: navLink.label.toLowerCase(),
    tagline: navLink.tagline || `Study resources and preparation guidance for ${navLink.label}`,
    overview: navLink.overview || `Everything you need to prepare for ${navLink.label} — resources are added regularly, and our team can guide you on the best preparation strategy.`,
    syllabus: [] as string[],
    tips: [] as string[],
    relatedCourse: navLink.label,
  }
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params
  const data = await resolveSubject(subject)
  if (!data) return { title: 'Study Materials — Hodu Academy' }
  return { title: `${data.label} Study Materials — Hodu Academy`, description: data.tagline }
}

function typeIcon(type: string) {
  if (type === 'Mock Test' || type === 'Sample Paper') return <FileText className="h-4 w-4 text-orange-500" />
  if (type === 'Notes' || type === 'Syllabus') return <BookOpen className="h-4 w-4 text-blue-500" />
  return <Download className="h-4 w-4 text-green-600" />
}

function typeBadge(type: string) {
  if (type === 'Mock Test' || type === 'Sample Paper') return 'bg-orange-50 text-orange-600 border-orange-200'
  if (type === 'Notes' || type === 'Syllabus') return 'bg-blue-50 text-blue-600 border-blue-200'
  return 'bg-green-50 text-green-700 border-green-200'
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  const data = await resolveSubject(subject)
  if (!data) return notFound()

  const supabase = await createClient()
  const { data: navSubjects } = await supabase
    .from('cms_nav_links')
    .select('label, href')
    .eq('site_id', HODU_SITE_ID)
    .eq('group_name', 'study_materials')
    .order('sort_order')

  const otherSubjects = [
    ...Object.entries(subjectData).map(([slug, v]) => ({ slug, label: v.label, icon: v.icon })),
    ...(navSubjects ?? [])
      .filter(n => !subjectData[n.href.split('/').pop() ?? ''])
      .map(n => ({ slug: n.href.split('/').pop() ?? '', label: n.label, icon: '📘' })),
  ].filter(s => s.slug !== subject)

  const { data: dbResources } = await supabase
    .from('cms_resources')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .ilike('category', `%${data.dbCategory}%`)
    .order('created_at', { ascending: false })

  const resources = dbResources ?? []

  return (
    <div className="animate-fade-in">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-brand-navy/50">
          <Link href="/" className="hover:text-brand-maroon">Home</Link>
          <span>/</span>
          <Link href="/study-materials" className="hover:text-brand-maroon">Study Materials</Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold">{data.label}</span>
        </div>
      </div>

      {/* Hero */}
      <section className={`bg-gradient-to-br ${data.gradient} text-white py-14`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/study-materials" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-semibold mb-6 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> All Study Materials
          </Link>
          <div className="flex items-start gap-4">
            <span className="text-5xl">{data.icon}</span>
            <div>
              <h1 className="text-4xl font-extrabold leading-tight">{data.label}</h1>
              <p className="text-white/80 text-base font-light mt-2 max-w-xl">{data.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="bg-brand-bg py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Overview */}
            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-brand-navy mb-3">Overview</h2>
              <p className="text-sm text-brand-navy/70 font-light leading-relaxed">{data.overview}</p>
            </div>

            {/* Syllabus */}
            {data.syllabus.length > 0 && (
            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-brand-navy mb-4">Syllabus Covered</h2>
              <div className="space-y-3">
                {data.syllabus.map((line, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-brand-navy/80 font-light">{line}</p>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Resources — from DB */}
            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-brand-navy">Free Resources</h2>
                {resources.length > 0 && (
                  <span className="text-xs font-bold text-brand-maroon bg-[#FDF5F5] border border-[#F3DCDC] px-2.5 py-1 rounded-full">
                    {resources.length} available
                  </span>
                )}
              </div>

              {resources.length > 0 ? (
                <div className="space-y-3">
                  {resources.map((res) => (
                    <div key={res.id} className="flex items-center justify-between p-3.5 rounded-xl border border-brand-border hover:bg-brand-bg transition-colors group">
                      <div className="flex items-center gap-3">
                        {typeIcon(res.type)}
                        <div>
                          <p className="text-sm font-semibold text-brand-navy group-hover:text-brand-maroon transition-colors">{res.title}</p>
                          {res.content && <p className="text-xs text-brand-navy/40 mt-0.5">{res.content}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${typeBadge(res.type)}`}>{res.type}</span>
                        {res.file_url ? (
                          <a
                            href={res.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-xs text-brand-maroon font-bold hover:text-brand-accent transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Open</span>
                          </a>
                        ) : (
                          <Link href="/contact"
                            className="flex items-center gap-1 text-xs text-brand-maroon font-bold hover:text-brand-accent transition-colors">
                            <Download className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Get</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-brand-navy/40 mt-4 font-light text-center">
                    Fill the form on the right to get instant access to all resources via WhatsApp.
                  </p>
                </div>
              ) : (
                <div className="text-center py-10 text-brand-navy/40">
                  <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">Resources coming soon</p>
                  <p className="text-xs mt-1 font-light">Fill the form to get notified when materials are uploaded.</p>
                </div>
              )}
            </div>

            {/* Tips */}
            {data.tips.length > 0 && (
            <div className="bg-brand-navy text-white rounded-2xl p-6">
              <h2 className="text-xl font-extrabold mb-4">Expert Study Tips</h2>
              <div className="space-y-3">
                {data.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="bg-brand-maroon text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-white/80 font-light leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm sticky top-20">
              <p className="font-extrabold text-brand-navy text-sm uppercase tracking-wider mb-1">Get All Resources Free</p>
              <p className="text-xs text-brand-navy/50 font-light mb-4">Fill this form — we'll send everything to your WhatsApp</p>
              <EnquiryForm />
            </div>

            <div className="bg-brand-bg border border-brand-border rounded-2xl p-5">
              <p className="font-extrabold text-brand-navy text-sm mb-3">Want structured coaching?</p>
              <p className="text-xs text-brand-navy/60 font-light mb-4">Self-study resources + expert guidance = top ranks. Check our {data.label} courses.</p>
              <Link href={`/courses?category=${encodeURIComponent(data.relatedCourse)}`}
                className="block w-full bg-brand-maroon hover:bg-brand-accent text-white font-bold py-2.5 rounded-xl text-sm text-center transition-colors">
                View Courses
              </Link>
            </div>

            <div className="bg-white border border-brand-border rounded-2xl p-5">
              <p className="font-extrabold text-brand-navy text-xs uppercase tracking-wider mb-3">Other Subjects</p>
              <div className="space-y-1.5">
                {otherSubjects.map(s => (
                  <Link key={s.slug} href={`/study-materials/${s.slug}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-bg transition-colors text-sm text-brand-navy hover:text-brand-maroon font-medium">
                    <span>{s.icon}</span> {s.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
