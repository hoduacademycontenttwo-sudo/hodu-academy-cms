import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, CheckCircle2, BookOpen, FileText } from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import { HODU } from '@/lib/hodu'
import type { Metadata } from 'next'

type Resource = { title: string; type: 'PDF' | 'Notes' | 'Test'; chapters?: string }

const subjectData: Record<string, {
  label: string; icon: string; color: string; gradient: string;
  tagline: string; overview: string;
  syllabus: string[];
  resources: Resource[];
  tips: string[];
  relatedCourse: string;
}> = {
  'jee-main': {
    label: 'JEE Main', icon: '⚛️', color: 'text-orange-600',
    gradient: 'from-orange-500 to-red-600',
    tagline: 'Crack JEE Main with structured notes and daily practice',
    overview: 'JEE Main is the gateway to NITs, IIITs, and CFTIs. It tests Physics, Chemistry, and Mathematics at the Class 11–12 level with a focus on speed, accuracy, and conceptual depth.',
    syllabus: ['Physics: Mechanics, Thermodynamics, Electrostatics, Optics, Modern Physics', 'Chemistry: Physical (Thermodynamics, Equilibrium, Electrochemistry), Organic (GOC, Hydrocarbons, Reactions), Inorganic (Periodic Table, p-block, d-block)', 'Mathematics: Calculus, Algebra, Coordinate Geometry, Trigonometry, Vectors & 3D'],
    resources: [
      { title: 'JEE Main Physics — Mechanics Complete Notes', type: 'Notes', chapters: 'Ch 1–8' },
      { title: 'JEE Main Chemistry — Organic Reactions Handbook', type: 'PDF', chapters: 'GOC + Hydrocarbons' },
      { title: 'JEE Main Maths — Calculus DPP Set (30 sheets)', type: 'PDF' },
      { title: 'JEE Main Full Mock Test 1 (2024 Pattern)', type: 'Test' },
      { title: 'JEE Main Full Mock Test 2', type: 'Test' },
      { title: 'JEE Main PYQ — 2015 to 2024 Solved', type: 'PDF' },
    ],
    tips: ['Complete NCERT for Chemistry before switching to any reference book', 'Solve at least 3 PYQ papers from 2020–2024 before Session 1', 'Allocate 1.5 hours per subject per day — no subject should be left more than 3 days without revision'],
    relatedCourse: 'Competitive Exams',
  },
  'jee-advanced': {
    label: 'JEE Advanced', icon: '🔬', color: 'text-red-700',
    gradient: 'from-red-600 to-rose-800',
    tagline: 'IIT-level preparation — deep conceptual problems and IIT PYQs',
    overview: 'JEE Advanced is conducted by the IITs for admission to B.Tech/Dual Degree programmes. It is significantly harder than JEE Main, testing higher-order thinking, multi-concept problems, and mathematical rigour.',
    syllabus: ['Physics: Advanced Mechanics (rotation, SHM, waves), Electrodynamics, Optics, Nuclear Physics', 'Chemistry: Advanced Organic (named reactions, mechanisms), Coordination Chemistry, Quantum Chemistry', 'Mathematics: Complex Analysis, Probability, Integral Calculus, Conic Sections'],
    resources: [
      { title: 'JEE Advanced Physics — Rotational Mechanics Deep Dive', type: 'Notes' },
      { title: 'JEE Advanced Chemistry — Named Reactions Compendium', type: 'PDF' },
      { title: 'JEE Advanced Maths — Integral Calculus Problem Set', type: 'PDF', chapters: '150 problems' },
      { title: 'JEE Advanced Mock Test (IIT Pattern)', type: 'Test' },
      { title: 'IIT JEE PYQ — 2010 to 2024 Solved', type: 'PDF' },
    ],
    tips: ['Never skip the "Why" behind any formula — JEE Advanced will change the setup so rote application fails', 'Spend at least 2 hours weekly on IIT PYQs from the last 10 years', 'Physics requires graph reading — practice interpreting P-V, V-T, and I-V diagrams'],
    relatedCourse: 'Competitive Exams',
  },
  'neet': {
    label: 'NEET', icon: '🧬', color: 'text-green-700',
    gradient: 'from-green-600 to-emerald-800',
    tagline: 'NCERT-focused notes, Biology diagrams, and full mock tests',
    overview: 'NEET is India\'s single entrance test for MBBS, BDS, and AYUSH. Biology is the highest-weightage subject (360/720 marks). NCERT mastery is non-negotiable — 85%+ of NEET questions are directly traceable to NCERT text and diagrams.',
    syllabus: ['Biology: Cell Biology, Genetics & Evolution, Plant Physiology, Human Physiology, Ecology, Biotechnology', 'Physics: Mechanics, Thermodynamics, Optics, Modern Physics (Class 11 + 12)', 'Chemistry: Physical, Organic (Biomolecules, Polymers), Inorganic (p-block, d-f block)'],
    resources: [
      { title: 'NEET Biology — Cell Biology & Cell Division Notes', type: 'Notes', chapters: 'Ch 8–10' },
      { title: 'NEET Biology — Human Physiology Complete Notes', type: 'Notes', chapters: 'Ch 17–22' },
      { title: 'NEET Biology Diagram Bank (All Diagrams, Labeled)', type: 'PDF' },
      { title: 'NEET Full Mock Test 1 (720 Marks)', type: 'Test' },
      { title: 'NEET Full Mock Test 2', type: 'Test' },
      { title: 'NEET PYQ — 2016 to 2024 Solved', type: 'PDF' },
    ],
    tips: ['Read NCERT Biology at least 3 times before moving to supplementary material', 'Draw and label every diagram from memory — they appear directly in NEET papers', 'For Physics and Chemistry, NCERT Exemplar is the best second source after NCERT'],
    relatedCourse: 'Competitive Exams',
  },
  'ncert-solutions': {
    label: 'NCERT Solutions', icon: '📚', color: 'text-blue-700',
    gradient: 'from-blue-600 to-indigo-800',
    tagline: 'Step-by-step solutions for every NCERT chapter, Class 6–12',
    overview: 'NCERT textbooks are the foundation for all major Indian board exams and competitive tests. Our solutions are written by subject experts with full working, alternate methods where applicable, and exam-relevant notes.',
    syllabus: ['Class 9: Maths (Number Systems → Statistics), Science (Motion → Natural Resources)', 'Class 10: Maths (Polynomials → Probability), Science (Chemical Reactions → Sustainable Management)', 'Class 11: Physics, Chemistry, Maths, Biology', 'Class 12: Physics, Chemistry, Maths, Biology'],
    resources: [
      { title: 'Class 10 Maths NCERT Solutions — All Chapters', type: 'PDF' },
      { title: 'Class 12 Physics NCERT Solutions — All Chapters', type: 'PDF' },
      { title: 'Class 12 Chemistry NCERT Solutions — All Chapters', type: 'PDF' },
      { title: 'Class 12 Biology NCERT Solutions — All Chapters', type: 'PDF' },
      { title: 'Class 12 Maths NCERT Solutions — All Chapters', type: 'PDF' },
    ],
    tips: ['Solve every NCERT exercise before looking at the solutions', 'Pay attention to the "examples" in NCERT — they are frequently directly quoted in board exams', 'For Class 12 Maths, NCERT Miscellaneous Exercises are often exam-level'],
    relatedCourse: 'CBSE',
  },
  'cbse': {
    label: 'CBSE Board', icon: '🎯', color: 'text-teal-700',
    gradient: 'from-teal-600 to-cyan-800',
    tagline: 'Board-pattern notes, sample papers and marking scheme analysis',
    overview: 'CBSE board exams for Class 10 and 12 follow a structured pattern with marks distributed across MCQs, short answers, and long answers. Understanding the marking scheme is as important as subject knowledge.',
    syllabus: ['Class 10: Maths, Science, Social Science, English, Hindi', 'Class 12: Physics, Chemistry, Biology, Maths, Computer Science, Economics, Accountancy'],
    resources: [
      { title: 'CBSE Class 12 Physics Sample Paper 2025 (Solved)', type: 'Test' },
      { title: 'CBSE Class 12 Chemistry Sample Paper 2025 (Solved)', type: 'Test' },
      { title: 'CBSE Class 12 Maths Sample Paper 2025 (Solved)', type: 'Test' },
      { title: 'CBSE Class 10 Science Chapter Notes — All Chapters', type: 'Notes' },
      { title: 'CBSE Board PYQ — 2018 to 2024 (Class 12 Sci)', type: 'PDF' },
    ],
    tips: ['Always study the official CBSE Sample Papers released in October — they reflect the actual exam pattern', 'For long-answer questions, use the CBSE marking scheme structure: definition → explanation → example/diagram', 'For Class 12 Maths, practice 3-mark and 5-mark problems daily from January onwards'],
    relatedCourse: 'CBSE',
  },
  'olympiad': {
    label: 'Olympiad', icon: '🏅', color: 'text-yellow-700',
    gradient: 'from-yellow-500 to-amber-700',
    tagline: 'RMO, INMO, IOQM and international Olympiad preparation',
    overview: 'Mathematical and Science Olympiads require creative problem-solving far beyond the standard curriculum. Success requires building a deep toolkit of techniques and then applying them flexibly to unseen problems.',
    syllabus: ['Math Olympiad: Number Theory, Combinatorics, Euclidean Geometry, Algebra (Polynomials, Inequalities, Functional Equations)', 'Science Olympiad: Physics (IPhO-style mechanics and electrodynamics), Chemistry (IChO level), Biology (IBO level)'],
    resources: [
      { title: 'RMO/INMO Number Theory — Complete Notes', type: 'Notes' },
      { title: 'Olympiad Combinatorics — 100 Problem Set', type: 'PDF' },
      { title: 'Euclidean Geometry for RMO — Methods & Problems', type: 'Notes' },
      { title: 'IOQM 2024 Paper with Detailed Solutions', type: 'PDF' },
      { title: 'IMO Shortlisted Problems — Algebra 2020–2024', type: 'PDF' },
    ],
    tips: ['Do not solve Olympiad problems in a rush — spend 1–2 hours on each problem before reading solutions', 'Keep a "technique notebook" — every new method deserves a summary and 3 example problems', 'Geometry requires dedicated daily practice of constructions and proof writing from Class 9 onwards'],
    relatedCourse: 'Olympiads',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ subject: string }> }): Promise<Metadata> {
  const { subject } = await params
  const data = subjectData[subject]
  if (!data) return { title: 'Study Materials — Hodu Academy' }
  return { title: `${data.label} Study Materials — Hodu Academy`, description: data.tagline }
}

export default async function SubjectPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params
  const data = subjectData[subject]
  if (!data) return notFound()

  const typeIcon = (type: string) => {
    if (type === 'Test') return <FileText className="h-4 w-4 text-orange-500" />
    if (type === 'Notes') return <BookOpen className="h-4 w-4 text-blue-500" />
    return <Download className="h-4 w-4 text-green-600" />
  }
  const typeBadge = (type: string) => {
    if (type === 'Test') return 'bg-orange-50 text-orange-600 border-orange-200'
    if (type === 'Notes') return 'bg-blue-50 text-blue-600 border-blue-200'
    return 'bg-green-50 text-green-700 border-green-200'
  }

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

            {/* Resources */}
            <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-brand-navy mb-4">Free Resources</h2>
              <div className="space-y-3">
                {data.resources.map((res, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-brand-border hover:bg-brand-bg transition-colors group">
                    <div className="flex items-center gap-3">
                      {typeIcon(res.type)}
                      <div>
                        <p className="text-sm font-semibold text-brand-navy group-hover:text-brand-maroon transition-colors">{res.title}</p>
                        {res.chapters && <p className="text-xs text-brand-navy/40 mt-0.5">{res.chapters}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${typeBadge(res.type)}`}>{res.type}</span>
                      <Link href="/contact"
                        className="flex items-center gap-1 text-xs text-brand-maroon font-bold hover:text-brand-accent transition-colors"
                        title="Request access">
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Get</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-brand-navy/40 mt-4 font-light text-center">
                Fill the form on the right to get instant access to all resources via WhatsApp.
              </p>
            </div>

            {/* Tips */}
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
                {Object.entries(subjectData).filter(([k]) => k !== subject).map(([k, v]) => (
                  <Link key={k} href={`/study-materials/${k}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-brand-bg transition-colors text-sm text-brand-navy hover:text-brand-maroon font-medium">
                    <span>{v.icon}</span> {v.label}
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
