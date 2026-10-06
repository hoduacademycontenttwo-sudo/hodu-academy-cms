'use client'

import React, { useState } from 'react'
import {
  Monitor,
  Trophy,
  BarChart3,
  FileText,
  TrendingUp,
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ArrowRight,
  Download,
  Laptop,
  Building2,
  CheckCircle2,
  ChevronDown,
  Loader,
  Check,
  BookOpen
} from 'lucide-react'
import ScrollReveal from '@/components/hodu/ScrollReveal'

const TARGET_EXAMS = ['NEET UG', 'JEE Main', 'BITSAT', 'CUET']

const PHASES = [
  {
    phase: 'Phase 01',
    title: 'Part Syllabus Tests',
    period: 'October – November',
    focus: 'Concept & Chapter Mastery',
    desc: 'Targeted chapter modules to build conceptual clarity, speed, and accuracy in core units.'
  },
  {
    phase: 'Phase 02',
    title: 'Major Syllabus Tests',
    period: 'November – December',
    focus: 'Cross-Topic Retention',
    desc: 'Multi-chapter high-weightage test combinations to master integrated problem solving.'
  },
  {
    phase: 'Phase 03',
    title: 'Full Syllabus Grand Mocks',
    period: 'December – January',
    focus: '100% NTA Simulation',
    desc: 'Comprehensive full-length simulations matching the exact exam pattern, scoring, and duration.'
  },
  {
    phase: 'Phase 04',
    title: 'Final Readiness & City Rank',
    period: 'January – February',
    focus: 'Peak Performance',
    desc: 'Strict timing and invigilation tests to build exam-day stamina and eliminate anxiety.'
  }
]

const SYLLABUS_DATA = {
  NEET: {
    name: 'NEET UG 2026–27',
    totalMarks: '720 Marks',
    duration: '3 Hours 20 Minutes',
    subjects: [
      {
        name: 'Physics',
        chapters: ['Kinematics & Laws of Motion', 'Work, Energy & Power', 'Thermodynamics & Heat Transfer', 'Electrodynamics & Optics', 'Modern Physics & Semiconductors']
      },
      {
        name: 'Chemistry',
        chapters: ['Atomic Structure & Periodic Trends', 'Chemical Bonding & Molecular Structure', 'Equilibrium & Chemical Kinetics', 'Organic Reaction Mechanisms', 'Coordination Compounds']
      },
      {
        name: 'Biology (Botany & Zoology)',
        chapters: ['Diversity in Living World', 'Cell Biology & Biomolecules', 'Human Physiology & Neural Control', 'Genetics & Evolution', 'Biotechnology & Ecology']
      }
    ]
  },
  JEE: {
    name: 'JEE Main 2026–27',
    totalMarks: '300 Marks',
    duration: '3 Hours',
    subjects: [
      {
        name: 'Physics',
        chapters: ['Mechanics & Rotational Dynamics', 'Fluids & Thermal Physics', 'Electromagnetism & AC', 'Wave Optics & Modern Physics']
      },
      {
        name: 'Chemistry',
        chapters: ['Physical Chemistry Kinetics & Solutions', 'Thermodynamics & Electrochemistry', 'Inorganic Periodic Trends & Coordination', 'Organic Functional Group Reactions']
      },
      {
        name: 'Mathematics',
        chapters: ['Calculus (Differential & Integral)', 'Vectors & 3D Geometry', 'Algebra (Matrices, Quadratic, Complex)', 'Probability & Coordinate Geometry']
      }
    ]
  },
  BITSAT: {
    name: 'BITSAT / CUET 2026–27',
    totalMarks: '390 Marks',
    duration: '3 Hours',
    subjects: [
      {
        name: 'Physics & Chemistry',
        chapters: ['Core Class 11 & 12 Curriculum', 'Rapid Problem Solving', 'Formula Retention & Speed Tests']
      },
      {
        name: 'Mathematics / Biology',
        chapters: ['Standard Competitive Syllabus', 'High-Speed Accuracy Drills']
      },
      {
        name: 'Logical Reasoning & English',
        chapters: ['Verbal & Non-Verbal Reasoning', 'Reading Comprehension & Grammar']
      }
    ]
  }
}

const FAQS = [
  {
    q: 'Is the Jaipur CBT Challenge really completely free?',
    a: 'Yes. Participation in the Jaipur CBT Challenge is 100% free of charge. There are no registration fees, hidden charges, or test-taking costs. Both offline testing at our Jaipur lab and online home testing are complimentary.'
  },
  {
    q: 'Why is practicing Computer-Based Tests (CBT) crucial for NEET aspirants this year?',
    a: 'The National Testing Agency is actively planning the transition of NEET to Computer-Based Testing (CBT). Moving from physical OMR bubble-filling to solving 200 questions on a desktop screen introduces screen fatigue, question palette navigation, and on-screen timer pressure. Rehearsing in an authentic CBT lab ensures complete composure on the official exam day.'
  },
  {
    q: 'How and when will I receive my admit card and test credentials?',
    a: 'Immediately after submitting your registration form, your slot is processed. Your unique Roll Number, Admit Card, Test Schedule, and Portal Login credentials will be dispatched directly to your registered WhatsApp number within 24 hours.'
  },
  {
    q: 'Can I choose whether to take the test offline at the Hodu Centre or from home?',
    a: 'Yes. You can select your preferred testing mode during registration. You may attempt the test at our invigilated computer lab at Hodu Academy, Vaishali Estate, Jaipur, or from your own desktop/laptop at home with our proctored interface.'
  },
  {
    q: 'When and how will the All-Jaipur Ranks and performance analysis be published?',
    a: 'Within 24 hours of each test window closing, you will receive an in-depth diagnostic scorecard on WhatsApp. It details your chapter-wise accuracy, time-spent per question, step-by-step solutions, and your percentile standing among all participating students across Jaipur.'
  }
]

export default function JaipurCbtClient() {
  // Form State
  const [form, setForm] = useState({
    name: '',
    classLevel: 'Class XII',
    schoolName: '',
    phone: '',
    email: '',
    mode: 'At Hodu Academy (Offline Jaipur)',
  })
  const [selectedExams, setSelectedExams] = useState<string[]>(['NEET UG'])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // UI Interactive States
  const [activeSyllabusTab, setActiveSyllabusTab] = useState<'NEET' | 'JEE' | 'BITSAT'>('NEET')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [showSyllabusModal, setShowSyllabusModal] = useState(false)

  function toggleExam(exam: string) {
    if (selectedExams.includes(exam)) {
      if (selectedExams.length > 1) {
        setSelectedExams(selectedExams.filter((e) => e !== exam))
      }
    } else {
      setSelectedExams([...selectedExams, exam])
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setErrorMsg('Please enter your full name.')
      return
    }
    const cleanPhone = form.phone.replace(/[^\d]/g, '')
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for WhatsApp updates.')
      return
    }
    if (selectedExams.length === 0) {
      setErrorMsg('Please select at least one target exam.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        class_level: form.classLevel,
        target_exam: `Jaipur CBT: ${selectedExams.join(', ')}`,
        city: `Jaipur (${form.mode.includes('Offline') ? 'Offline Campus' : 'Online Home'})`,
        message: `[Jaipur CBT Challenge 2026-27 Registration]
• Candidate Name: ${form.name.trim()}
• Class / Standard: ${form.classLevel}
• Target Exam(s): ${selectedExams.join(', ')}
• School / College: ${form.schoolName.trim() || 'Not specified'}
• Preferred Test Mode: ${form.mode}
• WhatsApp Contact: ${form.phone.trim()}
• Email Address: ${form.email.trim() || 'None provided'}
• Note: Send test credentials, admit card & schedule to WhatsApp.`,
        source_page: '/jaipur-cbt',
      }

      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Registration failed. Please try again.')
      }

      setSubmitted(true)
    } catch (err: any) {
      console.error('Registration error:', err)
      setErrorMsg(err.message || 'Something went wrong while submitting. Please call +91-9257879555.')
    } finally {
      setLoading(false)
    }
  }

  function scrollToForm() {
    const el = document.getElementById('registration-card')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[#FCF9F8] text-[#1E1E1E] selection:bg-[#7E0D0D] selection:text-white font-sans antialiased">
      
      {/* ─── DIGNIFIED INSTITUTIONAL ANNOUNCEMENT BAR ─── */}
      <aside aria-label="Examination Advisory" className="bg-[#7E0D0D] text-white py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C26B] shrink-0" />
            <span className="text-white/90">
              <strong>Official Examination Advisory:</strong> NEET transition to Computer-Based Testing (CBT). Free mock simulations now open across Jaipur.
            </span>
          </div>
          <button
            type="button"
            onClick={scrollToForm}
            className="text-[#F5C26B] hover:text-white font-medium text-xs underline underline-offset-4 transition-colors cursor-pointer"
          >
            Reserve your slot &rarr;
          </button>
        </div>
      </aside>

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:py-20 border-b border-[#EBE4E2]">
        
        {/* Understated ambient radial background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7E0D0D]/[0.03] rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C88A2C]/[0.03] rounded-full blur-3xl pointer-events-none -ml-24 -mb-24" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Handcrafted Editorial Typography & Value ─── */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Subtle Academic Eyebrow (No tacky sticker capsules) */}
              <ScrollReveal animation="fade-up">
                <div className="flex items-center gap-2 text-xs text-[#5A5252]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7E0D0D]" />
                  <span className="font-semibold tracking-wider uppercase text-[11px] text-[#7E0D0D]">
                    Hodu Academy
                  </span>
                  <span className="text-[#CFC7C4]">/</span>
                  <span>Jaipur CBT Challenge 2026–27</span>
                  <span className="text-[#CFC7C4]">/</span>
                  <span className="text-emerald-700 font-medium">Complimentary Entry</span>
                </div>
              </ScrollReveal>

              {/* Dignified Editorial Headline */}
              <ScrollReveal animation="fade-up" delay={50}>
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#1B2A44] tracking-tight leading-[1.12]">
                  Jaipur Computer-Based <br />
                  <span className="text-[#7E0D0D] italic font-normal">Test Challenge</span>
                </h1>
              </ScrollReveal>

              {/* Target Exam Chips */}
              <ScrollReveal animation="fade-up" delay={80}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-[#7A706E]">Target Exams:</span>
                  {TARGET_EXAMS.map((exam) => (
                    <span
                      key={exam}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-[#EBE4E2] text-[#1B2A44] shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    >
                      {exam}
                    </span>
                  ))}
                  <span className="text-xs font-medium text-[#7E0D0D] px-2 py-0.5 rounded bg-[#7E0D0D]/[0.06]">
                    Free Registration
                  </span>
                </div>
              </ScrollReveal>

              {/* Conversational Description */}
              <ScrollReveal animation="fade-up" delay={120}>
                <p className="text-[15px] sm:text-[17px] text-[#4A4242] font-normal leading-relaxed max-w-xl">
                  Subject preparation is only half the battle. Experience the authentic screen interface, timer pressure, and question palette before actual exam day — and discover where you stand among students across Jaipur.
                </p>
              </ScrollReveal>

              {/* 5 Core Pillars: Clean, Handcrafted Numbered List ─── */}
              <ScrollReveal animation="fade-up" delay={160}>
                <div className="space-y-3 pt-2">
                  {[
                    {
                      num: '01',
                      title: 'Authentic Exam Software',
                      desc: 'Exact replica of the NTA & BITSAT interface with question palette, section switches, and live countdown timer.'
                    },
                    {
                      num: '02',
                      title: 'All-Jaipur Peer Benchmark',
                      desc: 'Compete alongside serious aspirants from top schools and coaching institutes throughout Jaipur.'
                    },
                    {
                      num: '03',
                      title: 'Diagnostic Performance Analysis',
                      desc: 'Understand strong chapters, weak areas, time-spent per question, and accuracy ratios.'
                    },
                    {
                      num: '04',
                      title: 'Comprehensive Step-by-Step Solutions',
                      desc: 'Access complete worked solutions and alternative problem-solving shortcuts after each test window.'
                    },
                    {
                      num: '05',
                      title: 'Progressive Score Trajectory',
                      desc: 'Track percentile improvement, pace acceleration, and confidence gains test after test.'
                    }
                  ].map((pillar) => (
                    <div
                      key={pillar.num}
                      className="flex items-start gap-3.5 bg-white border border-[#EBE4E2] p-3.5 rounded-xl transition-colors hover:border-[#7E0D0D]/30"
                    >
                      <span className="text-xs font-mono font-semibold text-[#7E0D0D] bg-[#FCF9F8] border border-[#EBE4E2] w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                        {pillar.num}
                      </span>
                      <div>
                        <h2 className="font-semibold text-sm text-[#1B2A44] leading-snug">
                          {pillar.title}
                        </h2>
                        <p className="text-xs text-[#5E5454] mt-0.5 leading-relaxed">
                          {pillar.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* Center Helpline & Location Footer */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#5E5454]">
                  <a
                    href="tel:9257879555"
                    className="inline-flex items-center gap-2 text-[#1B2A44] hover:text-[#7E0D0D] font-semibold transition-colors"
                  >
                    <Phone size={13} className="text-[#7E0D0D]" />
                    <span>Inquiries: +91 92578 79555</span>
                  </a>
                  <span className="text-[#CFC7C4]">|</span>
                  <a
                    href="https://wa.me/919257879555?text=Hi%20Hodu%20Academy,%20I%20have%20a%20query%20about%20Jaipur%20CBT%20Challenge"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-medium transition-colors"
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp Coordination Desk</span>
                  </a>
                  <span className="text-[#CFC7C4]">|</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-[#7E0D0D]" />
                    <span>C-28, Vaishali Estate, Jaipur</span>
                  </span>
                </div>
              </ScrollReveal>

            </div>

            {/* Right Column: Handcrafted Admissions Form Card ─── */}
            <div className="lg:col-span-5" id="registration-card">
              <ScrollReveal animation="fade-left" delay={80}>
                <div className="bg-white border border-[#EBE4E2] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
                  
                  {/* Dignified Application Header (No neon gradient or lightning pills) */}
                  <div className="p-6 sm:p-7 border-b border-[#EBE4E2] bg-[#FAF6F5]">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B2A44] tracking-tight">
                        Reserve Your Test Slot
                      </h2>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                        Free Entry
                      </span>
                    </div>
                    <p className="text-xs text-[#5E5454] leading-relaxed">
                      Admit card, unique roll number, and exam slot schedule will be shared directly on WhatsApp.
                    </p>
                  </div>

                  {/* Form Body */}
                  <div className="p-6 sm:p-7">
                    {submitted ? (
                      <div className="text-center py-6 space-y-4">
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                          <CheckCircle2 size={30} />
                        </div>
                        <div>
                          <h3 className="text-xl font-serif font-bold text-[#1B2A44]">
                            Registration Confirmed
                          </h3>
                          <p className="text-xs text-[#5E5454] mt-1.5 leading-relaxed max-w-sm mx-auto">
                            Thank you, <strong>{form.name}</strong>. Your entry for the Jaipur CBT Challenge is recorded.
                          </p>
                        </div>

                        <div className="bg-[#FAF7F6] border border-[#EBE4E2] rounded-xl p-4 text-left space-y-2 text-xs">
                          <div className="flex justify-between border-b border-[#EBE4E2] pb-1.5">
                            <span className="text-[#5E5454]">Selected Exams:</span>
                            <span className="font-semibold text-[#1B2A44]">{selectedExams.join(', ')}</span>
                          </div>
                          <div className="flex justify-between border-b border-[#EBE4E2] pb-1.5">
                            <span className="text-[#5E5454]">Testing Mode:</span>
                            <span className="font-semibold text-[#1B2A44]">{form.mode}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#5E5454]">WhatsApp Delivery:</span>
                            <span className="font-semibold text-[#1B2A44]">{form.phone}</span>
                          </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-xs font-medium text-emerald-800 text-left">
                          Your Unique Roll Number and slot timing will be delivered to your WhatsApp number shortly.
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                          <a
                            href={`https://wa.me/919257879555?text=Hi%20Hodu%20Academy,%20I%20have%20registered%20for%20Jaipur%20CBT%20Challenge%20(Name:%20${encodeURIComponent(form.name)},%20Exams:%20${encodeURIComponent(selectedExams.join(', '))})`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                          >
                            <MessageSquare size={13} /> Open WhatsApp Support
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setSubmitted(false)
                              setForm({
                                name: '',
                                classLevel: 'Class XII',
                                schoolName: '',
                                phone: '',
                                email: '',
                                mode: 'At Hodu Academy (Offline Jaipur)',
                              })
                              setSelectedExams(['NEET UG'])
                            }}
                            className="text-xs text-[#7E0D0D] hover:underline font-medium py-1 cursor-pointer"
                          >
                            Register another student &rarr;
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleRegister} className="space-y-4">
                        
                        {/* Student Name */}
                        <div>
                          <label className="block text-xs font-semibold text-[#1B2A44] mb-1.5">
                            Candidate Full Name <span className="text-[#7E0D0D]">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Enter student name"
                            className="w-full border border-[#EBE4E2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1E1E] focus:outline-none focus:border-[#7E0D0D] focus:ring-1 focus:ring-[#7E0D0D]/10 bg-white placeholder:text-[#A89E9C] transition-colors"
                          />
                        </div>

                        {/* Class Radio Group */}
                        <div>
                          <label className="block text-xs font-semibold text-[#1B2A44] mb-1.5">
                            Current Class / Standard <span className="text-[#7E0D0D]">*</span>
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {['Class XI', 'Class XII', 'Dropper'].map((cls) => (
                              <button
                                key={cls}
                                type="button"
                                onClick={() => setForm({ ...form, classLevel: cls })}
                                className={`text-xs py-2 px-2 rounded-xl font-medium border transition-all text-center cursor-pointer ${
                                  form.classLevel === cls
                                    ? 'bg-[#1B2A44] text-white border-[#1B2A44]'
                                    : 'bg-white text-[#4A4242] border-[#EBE4E2] hover:border-[#7E0D0D]/40'
                                }`}
                              >
                                {cls}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Target Exam(s) Selection */}
                        <div>
                          <label className="block text-xs font-semibold text-[#1B2A44] mb-1.5">
                            Target Exam(s) <span className="text-[#7E0D0D]">*</span>
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {TARGET_EXAMS.map((exam) => {
                              const isChecked = selectedExams.includes(exam)
                              return (
                                <button
                                  key={exam}
                                  type="button"
                                  onClick={() => toggleExam(exam)}
                                  className={`flex items-center gap-2 text-xs py-2 px-3 rounded-xl font-medium border transition-all text-left cursor-pointer ${
                                    isChecked
                                      ? 'bg-[#7E0D0D]/[0.06] text-[#7E0D0D] border-[#7E0D0D]'
                                      : 'bg-white text-[#4A4242] border-[#EBE4E2] hover:border-[#7E0D0D]/30'
                                  }`}
                                >
                                  <div
                                    className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                                      isChecked
                                        ? 'bg-[#7E0D0D] border-[#7E0D0D] text-white'
                                        : 'border-[#CFC7C4] bg-white'
                                    }`}
                                  >
                                    {isChecked && <Check size={10} strokeWidth={3} />}
                                  </div>
                                  <span>{exam}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* School / College Name */}
                        <div>
                          <label className="block text-xs font-semibold text-[#1B2A44] mb-1.5">
                            School / College Name (Optional)
                          </label>
                          <input
                            type="text"
                            value={form.schoolName}
                            onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                            placeholder="e.g. Jayshree Periwal, DPS, St. Xavier's"
                            className="w-full border border-[#EBE4E2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1E1E] focus:outline-none focus:border-[#7E0D0D] focus:ring-1 focus:ring-[#7E0D0D]/10 bg-white placeholder:text-[#A89E9C] transition-colors"
                          />
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label className="block text-xs font-semibold text-[#1B2A44] mb-1.5">
                            Mobile Number (WhatsApp) <span className="text-[#7E0D0D]">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-xs font-medium text-[#7E0D0D]">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              placeholder="98765 43210"
                              className="w-full border border-[#EBE4E2] rounded-xl pl-12 pr-3.5 py-2.5 text-xs text-[#1E1E1E] focus:outline-none focus:border-[#7E0D0D] focus:ring-1 focus:ring-[#7E0D0D]/10 bg-white placeholder:text-[#A89E9C] transition-colors"
                            />
                          </div>
                          <p className="text-[11px] text-[#5E5454] mt-1">
                            Admit card, test schedule, and portal link will be sent to this number.
                          </p>
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="block text-xs font-semibold text-[#1B2A44] mb-1.5">
                            Email Address (Optional)
                          </label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="student@example.com"
                            className="w-full border border-[#EBE4E2] rounded-xl px-3.5 py-2.5 text-xs text-[#1E1E1E] focus:outline-none focus:border-[#7E0D0D] focus:ring-1 focus:ring-[#7E0D0D]/10 bg-white placeholder:text-[#A89E9C] transition-colors"
                          />
                        </div>

                        {/* Testing Mode */}
                        <div>
                          <label className="block text-xs font-semibold text-[#1B2A44] mb-1.5">
                            Preferred Examination Mode <span className="text-[#7E0D0D]">*</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, mode: 'At Hodu Academy (Offline Jaipur)' })}
                              className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                                form.mode.includes('Offline')
                                  ? 'bg-[#7E0D0D]/[0.06] border-[#7E0D0D] ring-1 ring-[#7E0D0D]'
                                  : 'bg-white border-[#EBE4E2] hover:border-[#7E0D0D]/30'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-semibold text-xs text-[#7E0D0D]">
                                <Building2 size={13} /> At Hodu Academy
                              </div>
                              <p className="text-[11px] text-[#5E5454] mt-0.5 font-normal">
                                Offline Lab (Real Exam Feel)
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => setForm({ ...form, mode: 'From Home (Online)' })}
                              className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                                !form.mode.includes('Offline')
                                  ? 'bg-[#7E0D0D]/[0.06] border-[#7E0D0D] ring-1 ring-[#7E0D0D]'
                                  : 'bg-white border-[#EBE4E2] hover:border-[#7E0D0D]/30'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-semibold text-xs text-[#1B2A44]">
                                <Laptop size={13} /> From Home
                              </div>
                              <p className="text-[11px] text-[#5E5454] mt-0.5 font-normal">
                                Timed Online Portal
                              </p>
                            </button>
                          </div>
                        </div>

                        {errorMsg && (
                          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-xl">
                            {errorMsg}
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-[#7E0D0D] hover:bg-[#651416] text-white font-medium py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
                        >
                          {loading ? (
                            <>
                              <Loader size={14} className="animate-spin" /> Processing Slot Reservation…
                            </>
                          ) : (
                            <>
                              Confirm Free Registration <ArrowRight size={14} />
                            </>
                          )}
                        </button>

                        <p className="text-[11px] text-center text-[#5E5454] font-normal">
                          100% Free · No card or payment required · Verified by Hodu Academy
                        </p>
                      </form>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 2: WHY PRACTICE CBT BEFORE THE REAL EXAM ─── */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#EBE4E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up">
            <div className="max-w-3xl mb-12 space-y-3">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7E0D0D]">
                Exam Day Readiness
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1B2A44] tracking-tight">
                Why You Need to Practice CBT Before the Real Exam
              </h2>
              <p className="text-sm sm:text-base text-[#5E5454] leading-relaxed">
                With NEET moving to Computer-Based Testing alongside JEE Main and BITSAT, paper OMR techniques no longer apply. Stepping into the hall without digital rehearsal can cost you <strong>20–40 marks</strong> purely from interface friction, screen fatigue, and on-screen timer pacing.
              </p>
            </div>
          </ScrollReveal>

          {/* 4 Clean Handcrafted Editorial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <ScrollReveal animation="fade-up" delay={50}>
              <div className="bg-[#FCF9F8] border border-[#EBE4E2] rounded-xl p-6 h-full flex flex-col justify-between hover:border-[#7E0D0D]/30 transition-all">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#7E0D0D] bg-white border border-[#EBE4E2] w-7 h-7 rounded-md flex items-center justify-center mb-4">
                    01
                  </span>
                  <h3 className="font-semibold text-base text-[#1B2A44] mb-2">
                    3-Hour Screen Fatigue
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5454] leading-relaxed">
                    Reading 200 complex Biology, Chemistry, and Physics questions on an LED screen causes ocular strain and focus drop if you have only trained on physical paper.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#EBE4E2] text-[11px] font-medium text-[#7E0D0D]">
                  Build 200-minute screen stamina
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2 */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="bg-[#FCF9F8] border border-[#EBE4E2] rounded-xl p-6 h-full flex flex-col justify-between hover:border-[#7E0D0D]/30 transition-all">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#7E0D0D] bg-white border border-[#EBE4E2] w-7 h-7 rounded-md flex items-center justify-center mb-4">
                    02
                  </span>
                  <h3 className="font-semibold text-base text-[#1B2A44] mb-2">
                    Question Palette Mastery
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5454] leading-relaxed">
                    Green (Answered), Red (Unanswered), Purple (Marked for Review) — navigating question palettes and subject tabs swiftly without accidental misclicks requires muscle memory.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#EBE4E2] text-[11px] font-medium text-[#7E0D0D]">
                  Prevent negative marking errors
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3 */}
            <ScrollReveal animation="fade-up" delay={150}>
              <div className="bg-[#FCF9F8] border border-[#EBE4E2] rounded-xl p-6 h-full flex flex-col justify-between hover:border-[#7E0D0D]/30 transition-all">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#7E0D0D] bg-white border border-[#EBE4E2] w-7 h-7 rounded-md flex items-center justify-center mb-4">
                    03
                  </span>
                  <h3 className="font-semibold text-base text-[#1B2A44] mb-2">
                    Rough Sheet Dual Focus
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5454] leading-relaxed">
                    Solving multi-step numerical calculations on physical scratch sheets while cross-checking the desktop monitor demands a split-focus rhythm built only through practice.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#EBE4E2] text-[11px] font-medium text-[#7E0D0D]">
                  Coordinated scratch-to-screen workflow
                </div>
              </div>
            </ScrollReveal>

            {/* Card 4 */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="bg-[#FCF9F8] border border-[#EBE4E2] rounded-xl p-6 h-full flex flex-col justify-between hover:border-[#7E0D0D]/30 transition-all">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#7E0D0D] bg-white border border-[#EBE4E2] w-7 h-7 rounded-md flex items-center justify-center mb-4">
                    04
                  </span>
                  <h3 className="font-semibold text-base text-[#1B2A44] mb-2">
                    Ticking Digital Clock
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5E5454] leading-relaxed">
                    A countdown clock continuously ticking in the upper corner changes your psychology. Controlled practice trains you to remain composed under live digital time monitoring.
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-[#EBE4E2] text-[11px] font-medium text-[#7E0D0D]">
                  Overcome digital timer pressure
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Understated Note & Free Mock CTA */}
          <ScrollReveal animation="fade-up" delay={250}>
            <div className="mt-10 bg-[#FAF6F5] border border-[#EBE4E2] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-[#4A4242] leading-relaxed">
                <strong>Strategic Insight:</strong> Do not make the official NTA examination hall the first time you attempt a Computer-Based Test.
              </p>
              <button
                type="button"
                onClick={scrollToForm}
                className="bg-[#7E0D0D] hover:bg-[#651416] text-white text-xs font-medium px-5 py-2.5 rounded-xl shrink-0 transition-colors cursor-pointer"
              >
                Register for Free Mock &rarr;
              </button>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ─── SECTION 3: VERTICAL STEP TRACKER ─── */}
      <section className="py-16 sm:py-20 bg-[#FCF9F8] border-b border-[#EBE4E2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-14">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7E0D0D]">
                Process Overview
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1B2A44] tracking-tight">
                How the Jaipur CBT Challenge Works
              </h2>
              <p className="text-sm text-[#5E5454]">
                From registration to All-Jaipur rank — everything is verified, paperless, and delivered to your WhatsApp.
              </p>
            </div>
          </ScrollReveal>

          {/* Clean Vertical Tracker */}
          <div className="relative">
            {/* Center Line */}
            <div className="absolute left-4 sm:left-6 top-6 bottom-6 w-px bg-[#EBE4E2]" />

            <div className="space-y-10">
              
              {/* Step 1 */}
              <ScrollReveal animation="fade-up" delay={50}>
                <div className="relative flex items-start gap-5 sm:gap-7">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-[#1B2A44] text-white flex items-center justify-center font-mono font-semibold text-xs sm:text-sm shrink-0 z-10 shadow-xs ring-4 ring-[#FCF9F8]">
                    01
                  </div>
                  <div className="bg-white border border-[#EBE4E2] rounded-xl p-5 sm:p-6 flex-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <span className="text-[11px] font-mono text-[#7E0D0D] block mb-1">
                      Step 01 · 60 Seconds
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-[#1B2A44]">
                      Online Candidate Registration
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5E5454] mt-1.5 leading-relaxed">
                      Provide student details, select target exams (JEE, NEET, BITSAT, or CUET), and choose your preferred mode (At Hodu Academy Jaipur lab or From Home).
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 2 */}
              <ScrollReveal animation="fade-up" delay={100}>
                <div className="relative flex items-start gap-5 sm:gap-7">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-[#7E0D0D] text-white flex items-center justify-center font-mono font-semibold text-xs sm:text-sm shrink-0 z-10 shadow-xs ring-4 ring-[#FCF9F8]">
                    02
                  </div>
                  <div className="bg-white border border-[#EBE4E2] rounded-xl p-5 sm:p-6 flex-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <span className="text-[11px] font-mono text-[#7E0D0D] block mb-1">
                      Step 02 · WhatsApp Delivery
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-[#1B2A44]">
                      Admit Card &amp; Credentials Shared on WhatsApp
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5E5454] mt-1.5 leading-relaxed">
                      Your unique Roll Number, Admit Card, Test Schedule, and Portal Login credentials are delivered directly to your registered WhatsApp number within 24 hours.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 3 */}
              <ScrollReveal animation="fade-up" delay={150}>
                <div className="relative flex items-start gap-5 sm:gap-7">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-[#1B2A44] text-white flex items-center justify-center font-mono font-semibold text-xs sm:text-sm shrink-0 z-10 shadow-xs ring-4 ring-[#FCF9F8]">
                    03
                  </div>
                  <div className="bg-white border border-[#EBE4E2] rounded-xl p-5 sm:p-6 flex-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <span className="text-[11px] font-mono text-[#7E0D0D] block mb-1">
                      Step 03 · Examination Window
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-[#1B2A44]">
                      Attempt at Home or at Hodu Jaipur Centre
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5E5454] mt-1.5 leading-relaxed">
                      Experience the exam under genuine testing conditions: take it in our dedicated invigilated PC testing lab in Jaipur, or log into the timed anti-cheat portal from your home computer.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Step 4 */}
              <ScrollReveal animation="fade-up" delay={200}>
                <div className="relative flex items-start gap-5 sm:gap-7">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono font-semibold text-xs sm:text-sm shrink-0 z-10 shadow-xs ring-4 ring-[#FCF9F8]">
                    04
                  </div>
                  <div className="bg-white border border-[#EBE4E2] rounded-xl p-5 sm:p-6 flex-1 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                    <span className="text-[11px] font-mono text-emerald-800 block mb-1">
                      Step 04 · Within 24 Hours
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-[#1B2A44]">
                      All-Jaipur Rank &amp; Diagnostic Analytics
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5E5454] mt-1.5 leading-relaxed">
                      Receive an in-depth scorecard with chapter-wise accuracy breakdowns, time-per-question analysis, full worked solutions, and your percentile rank across Jaipur.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={scrollToForm}
              className="bg-[#7E0D0D] hover:bg-[#651416] text-white text-xs font-medium uppercase tracking-wider px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Register for Free Now &rarr;
            </button>
          </div>

        </div>
      </section>

      {/* ─── SECTION 4: CBT ENGINE SOFTWARE PREVIEW & BENCHMARK ─── */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#EBE4E2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7E0D0D]">
                Platform Simulation
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1B2A44] tracking-tight">
                Authentic CBT Software Interface
              </h2>
              <p className="text-sm text-[#5E5454]">
                Our proprietary testing platform matches the NTA and BITSAT exam layout and navigation controls.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Mock Laptop CBT Screen */}
            <div className="lg:col-span-8">
              <ScrollReveal animation="fade-right">
                <div className="bg-neutral-900 p-3 sm:p-4 rounded-2xl shadow-xl border border-neutral-700">
                  
                  {/* Laptop Window Chrome */}
                  <div className="bg-neutral-800 px-4 py-2.5 rounded-t-xl flex items-center justify-between text-xs text-neutral-300">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 inline-block" />
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-600 inline-block" />
                      </div>
                      <span className="text-[11px] font-mono text-neutral-300">
                        Hodu CBT Engine · Roll: HA-JPR-2026-0842
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-neutral-950 px-2.5 py-1 rounded text-[11px] font-mono text-[#F5C26B]">
                      <Clock size={11} /> 02:48:15 Remaining
                    </div>
                  </div>

                  {/* CBT Application Canvas */}
                  <div className="bg-white rounded-b-xl p-4 sm:p-6 text-[#1E1E1E]">
                    
                    {/* Subject Tabs */}
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-4">
                      <div className="flex gap-2">
                        {['Physics (Section A)', 'Chemistry', 'Biology / Maths'].map((tab, idx) => (
                          <span
                            key={tab}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                              idx === 0
                                ? 'bg-[#7E0D0D] text-white'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {tab}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded border border-emerald-200">
                        Marking: +4 / -1
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Question Area */}
                      <div className="md:col-span-8 space-y-4">
                        <div className="flex justify-between items-center text-xs text-[#5E5454]">
                          <span className="font-semibold text-[#1B2A44]">Question 12 of 30</span>
                          <span>Single Choice Question</span>
                        </div>

                        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs sm:text-sm font-medium leading-relaxed">
                          A particle moves in a circle of radius <em>r</em> with constant angular speed <em>&omega;</em>. The magnitude of its radial acceleration vector is given by:
                        </div>

                        {/* Options */}
                        <div className="space-y-2">
                          {[
                            'A)  v² / r',
                            'B)  &omega;² &times; r',
                            'C)  v &times; &omega;',
                            'D)  All of the above'
                          ].map((opt, i) => (
                            <div
                              key={opt}
                              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between ${
                                i === 3
                                  ? 'bg-emerald-50 border-emerald-500 font-semibold text-emerald-900'
                                  : 'border-neutral-200'
                              }`}
                            >
                              <span dangerouslySetInnerHTML={{ __html: opt }} />
                              {i === 3 && (
                                <span className="text-[10px] bg-emerald-600 text-white font-medium px-1.5 py-0.5 rounded">
                                  Selected
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Navigation Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-200">
                          <button type="button" className="text-[11px] bg-neutral-100 hover:bg-neutral-200 font-medium px-3 py-1.5 rounded-lg transition-colors">
                            Clear Response
                          </button>
                          <div className="flex gap-2">
                            <button type="button" className="text-[11px] bg-purple-50 text-purple-800 border border-purple-200 font-medium px-3 py-1.5 rounded-lg">
                              Mark For Review
                            </button>
                            <button type="button" className="text-[11px] bg-[#7E0D0D] text-white font-medium px-4 py-1.5 rounded-lg shadow-xs">
                              Save &amp; Next &rarr;
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Question Palette Grid */}
                      <div className="md:col-span-4 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-3">
                        <p className="font-semibold text-xs text-[#1B2A44] border-b border-neutral-200 pb-2">
                          Question Palette
                        </p>

                        <div className="grid grid-cols-5 gap-1.5">
                          {Array.from({ length: 25 }, (_, i) => i + 1).map((num) => {
                            let style = 'bg-neutral-200 text-neutral-600'
                            if (num === 12) style = 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400'
                            else if ([1, 2, 4, 7, 8, 10, 11].includes(num)) style = 'bg-emerald-600 text-white font-medium'
                            else if ([3, 6, 9].includes(num)) style = 'bg-red-500 text-white font-medium'
                            else if ([5, 13].includes(num)) style = 'bg-purple-600 text-white font-medium'

                            return (
                              <div
                                key={num}
                                className={`w-7 h-7 rounded text-[10px] flex items-center justify-center ${style}`}
                              >
                                {num}
                              </div>
                            )
                          })}
                        </div>

                        {/* Legend */}
                        <div className="text-[10px] space-y-1 pt-2 border-t border-neutral-200">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-emerald-600 shrink-0" />
                            <span className="text-neutral-600">Answered (8)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-red-500 shrink-0" />
                            <span className="text-neutral-600">Not Answered (3)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-purple-600 shrink-0" />
                            <span className="text-neutral-600">Marked for Review (2)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-neutral-200 shrink-0" />
                            <span className="text-neutral-600">Not Visited (12)</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Jaipur Percentile Benchmark Card */}
            <div className="lg:col-span-4">
              <ScrollReveal animation="fade-left">
                <div className="bg-[#FCF9F8] border border-[#EBE4E2] rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="border-b border-[#EBE4E2] pb-3">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#7E0D0D] block">
                      City Leaderboard Benchmark
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#1B2A44] flex items-center gap-2 mt-0.5">
                      <Trophy size={16} className="text-[#C88A2C]" />
                      All-Jaipur Standings
                    </h3>
                  </div>

                  <p className="text-xs text-[#5E5454] leading-relaxed">
                    Compare your subject scores, question speed, and accuracy ratios against aspirants from prominent Jaipur schools.
                  </p>

                  {/* Benchmark Rows */}
                  <div className="space-y-2 text-xs">
                    {[
                      { rank: 'Rank #1', score: '286 / 300', percentile: '99.92 %ile' },
                      { rank: 'Rank #2', score: '282 / 300', percentile: '99.85 %ile' },
                      { rank: 'Rank #3', score: '278 / 300', percentile: '99.64 %ile' },
                      { rank: 'Rank #4', score: '274 / 300', percentile: '99.40 %ile' },
                      { rank: 'Rank #5', score: '270 / 300', percentile: '99.20 %ile' },
                    ].map((row) => (
                      <div
                        key={row.rank}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#EBE4E2]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-xs text-[#7E0D0D]">{row.rank}</span>
                          <span className="text-[#5E5454]">Score: {row.score}</span>
                        </div>
                        <span className="font-semibold text-[#1B2A44]">{row.percentile}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#EBE4E2] text-center space-y-2">
                    <p className="text-xs font-semibold text-[#1B2A44]">Where will you rank in Jaipur?</p>
                    <button
                      type="button"
                      onClick={scrollToForm}
                      className="w-full bg-[#7E0D0D] hover:bg-[#651416] text-white text-xs font-medium py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Take the Free Challenge &rarr;
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 5: 4-PHASE ROADMAP & SYLLABUS BREAKDOWN ─── */}
      <section className="py-16 sm:py-20 bg-[#FCF9F8] border-b border-[#EBE4E2]" id="syllabus-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#7E0D0D]">
                Curriculum Structure
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1B2A44] tracking-tight">
                Test Phases &amp; Syllabus Coverage
              </h2>
              <p className="text-sm text-[#5E5454]">
                Weekend tests scheduled Saturday and Sunday morning. Progression from chapter modules to full grand mocks.
              </p>
            </div>
          </ScrollReveal>

          {/* 4 Phases Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {PHASES.map((p, idx) => (
              <ScrollReveal key={p.title} animation="fade-up" delay={idx * 50}>
                <div className="bg-white border border-[#EBE4E2] rounded-xl p-5 h-full flex flex-col justify-between hover:border-[#7E0D0D]/30 transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-mono font-semibold text-[#7E0D0D]">
                        {p.phase}
                      </span>
                      <span className="text-[#5E5454]">
                        {p.period}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base text-[#1B2A44] mb-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#5E5454] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#EBE4E2] flex items-center justify-between text-[11px]">
                    <span className="text-[#7A706E]">Focus:</span>
                    <span className="font-medium text-[#7E0D0D]">{p.focus}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Syllabus Subject Breakdown */}
          <ScrollReveal animation="fade-up">
            <div className="bg-white border border-[#EBE4E2] rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE4E2] pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-[#7E0D0D]" />
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1B2A44]">
                      Detailed Syllabus Matrix
                    </h3>
                  </div>
                  <p className="text-xs text-[#5E5454] mt-0.5">
                    Updated in accordance with latest NTA and Board bulletins for 2026–27.
                  </p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-[#FAF6F5] border border-[#EBE4E2] rounded-xl self-start sm:self-auto">
                  {(['NEET', 'JEE', 'BITSAT'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveSyllabusTab(tab)}
                      className={`text-xs font-medium px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                        activeSyllabusTab === tab
                          ? 'bg-[#1B2A44] text-white'
                          : 'text-[#5E5454] hover:text-[#1B2A44]'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Breakdown Columns */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {SYLLABUS_DATA[activeSyllabusTab].subjects.map((sub) => (
                  <div key={sub.name} className="space-y-3">
                    <h4 className="font-semibold text-xs text-[#1B2A44] pb-2 border-b border-[#EBE4E2] uppercase tracking-wider">
                      {sub.name}
                    </h4>
                    <ul className="space-y-2 text-xs text-[#5E5454]">
                      {sub.chapters.map((chap) => (
                        <li key={chap} className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-[#7E0D0D] mt-1.5 shrink-0" />
                          <span>{chap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-5 border-t border-[#EBE4E2] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#5E5454]">
                  Unit-wise test schedule PDFs are dispatched to registered students.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSyllabusModal(true)}
                  className="inline-flex items-center gap-2 border border-[#EBE4E2] hover:border-[#1B2A44] text-[#1B2A44] text-xs font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  <Download size={13} />
                  <span>Download Syllabus PDF</span>
                </button>
              </div>

            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ─── SECTION 6: FAQS ─── */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#EBE4E2]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#7E0D0D]">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#1B2A44] tracking-tight">
              Clarifications &amp; Details
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-[#FCF9F8] border border-[#EBE4E2] rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4.5 sm:p-5 text-left font-semibold text-sm text-[#1B2A44] flex items-center justify-between gap-4 cursor-pointer hover:text-[#7E0D0D] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-[#7E0D0D] shrink-0 transition-transform duration-300 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#5E5454] leading-relaxed border-t border-[#EBE4E2] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 7: EDITORIAL CLOSING CALL TO ACTION ─── */}
      <section className="bg-[#1B2A44] text-white py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-mono text-[#F5C26B] tracking-wider uppercase">
                Complimentary Public Initiative
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                Ready to Experience the Jaipur CBT Challenge?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Join thousands of students testing under genuine computer-based exam conditions. Free entry · Credentials shared on WhatsApp.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={scrollToForm}
                className="w-full sm:w-auto bg-[#7E0D0D] hover:bg-[#921E1F] text-white font-medium text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reserve Free Slot &rarr;
              </button>
              <a
                href="tel:9257879555"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone size={13} className="text-[#F5C26B]" /> +91 92578 79555
              </a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-[#F5C26B]" />
              <span>C-28, Vaishali Estate, Gandhi Path West, Jaipur, Rajasthan</span>
            </div>
            <div>
              <span>Hodu Academy · Admissions &amp; Computer-Based Testing Lab</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SYLLABUS DOWNLOAD MODAL PLACEHOLDER ─── */}
      {showSyllabusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-[#EBE4E2] shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#7E0D0D] tracking-wider block">
                  Curriculum Document
                </span>
                <h4 className="text-base font-serif font-bold text-[#1B2A44]">
                  Jaipur CBT Syllabus PDF
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowSyllabusModal(false)}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#5E5454] leading-relaxed">
              The complete unit-wise test matrix, chapter weightage, and Saturday/Sunday schedule PDF is being finalized in accordance with the official NTA notification.
            </p>

            <div className="bg-[#FAF7F6] border border-[#EBE4E2] p-4 rounded-xl text-xs space-y-1">
              <p className="font-semibold text-[#7E0D0D]">Instant Delivery via WhatsApp:</p>
              <p className="text-[#5E5454]">
                Register your free slot, and our exam coordinator will send the PDF syllabus directly to your WhatsApp along with your hall ticket.
              </p>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowSyllabusModal(false)
                  scrollToForm()
                }}
                className="flex-1 bg-[#7E0D0D] hover:bg-[#651416] text-white text-xs font-medium py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Register To Get Syllabus &rarr;
              </button>
              <button
                type="button"
                onClick={() => setShowSyllabusModal(false)}
                className="px-4 py-2.5 border border-[#EBE4E2] text-neutral-600 text-xs font-medium rounded-xl hover:bg-neutral-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
