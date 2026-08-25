'use client'

import React, { useState, useMemo } from 'react'
import { Search, ChevronDown, HelpCircle, BookOpen, School, GraduationCap, FileCheck, DollarSign, MessageCircle, Phone, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import ScrollReveal from './ScrollReveal'

export interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
  icon?: any
}

export const allFaqsData: FaqItem[] = [
  // 1. Curriculum & Boards
  {
    id: 'cb-1',
    category: 'Curriculum & Boards',
    question: 'What boards and curricula does Hodu Academy teach?',
    answer: 'Hodu Academy provides specialized, syllabus-aligned coaching for Cambridge International (IGCSE & A-Levels), International Baccalaureate (IB MYP & DP), CBSE Board (Classes 9 to 12 Science, Commerce & Humanities), ICSE/ISC, IIT-JEE (Main & Advanced), NEET-UG, and National/International Junior Olympiads (IMO, NSO, IEO, PRMO).',
  },
  {
    id: 'cb-2',
    category: 'Curriculum & Boards',
    question: 'How do you prepare students for Cambridge IGCSE and IB Diploma (DP)?',
    answer: 'Our international curriculum wing focuses on command words, past 15-year marking scheme breakdowns, criterion-based rubric assessment, Internal Assessment (IA) guidance, Theory of Knowledge (TOK) conceptual framing, and Extended Essay support under educators with international board accreditation.',
  },
  {
    id: 'cb-3',
    category: 'Curriculum & Boards',
    question: 'Is CBSE board coaching integrated with competitive exams (JEE/NEET)?',
    answer: 'Yes. For Class 11 and 12, we offer an Integrated Dual-Track System where fundamental NCERT board concepts and competitive advanced problem sets are taught concurrently, eliminating the need for students to attend separate tuitions.',
  },

  // 2. Jaipur Offline Campus
  {
    id: 'jc-1',
    category: 'Jaipur Offline Campus',
    question: 'Where is the Jaipur physical learning center located?',
    answer: 'Our flagship offline campus is located at Vaishali Extension, Jaipur, Rajasthan. It features acoustic-treated smart classrooms, an interactive digital library, and dedicated 1-on-1 faculty doubt cells.',
  },
  {
    id: 'jc-2',
    category: 'Jaipur Offline Campus',
    question: 'Is transportation facility available for Jaipur students?',
    answer: 'Yes! We provide safe, air-conditioned doorstep van transport equipped with real-time GPS tracking and dedicated support staff covering key residential zones across Jaipur.',
  },
  {
    id: 'jc-3',
    category: 'Jaipur Offline Campus',
    question: 'What are the library and silent study zone timings?',
    answer: 'The physical reference library and silent self-study rooms are open 6 days a week from 8:00 AM to 9:00 PM, with faculty mentors available throughout the evening for live doubt clearance.',
  },

  // 3. Admissions & Batch Sizes
  {
    id: 'ab-1',
    category: 'Admissions & Batches',
    question: 'What is the maximum student batch size at Hodu Academy?',
    answer: 'We strictly maintain an intimate 1:12 to 1:15 student-to-teacher ratio in every batch. This guarantees personalized conceptual monitoring, individual pace adjustments, and continuous mentor feedback.',
  },
  {
    id: 'ab-2',
    category: 'Admissions & Batches',
    question: 'How can a new student enroll or take a diagnostic assessment?',
    answer: 'You can book a free diagnostic test and campus tour online via our website or by calling +91-9257879555. Our academic counselors conduct a 45-minute diagnostic baseline assessment to recommend the ideal curriculum batch.',
  },
  {
    id: 'ab-3',
    category: 'Admissions & Batches',
    question: 'Are online interactive live batches available for outstation students?',
    answer: 'Yes! Students outside Jaipur can join our live interactive digital micro-batches via our high-speed LMS portal with real-time audio-video participation, digital whiteboard sharing, and recorded lecture archives.',
  },

  // 4. JEE, NEET & Olympiads
  {
    id: 'jn-1',
    category: 'JEE, NEET & Olympiads',
    question: 'How is the test series structured for IIT-JEE and NEET-UG?',
    answer: 'Our test series simulates the exact NTA computer-based testing interface. Students take bi-weekly part-syllabus tests and monthly full-length mock exams with in-depth analytics covering speed, accuracy, negative marking patterns, and All-India percentile benchmark ranking.',
  },
  {
    id: 'jn-2',
    category: 'JEE, NEET & Olympiads',
    question: 'Do you offer foundation coaching for Junior Olympiads (Classes 6 to 8)?',
    answer: 'Yes, our Junior Foundation & Talent Hunt track builds non-routine problem solving, speed mental arithmetic, logic matrices, and STEM curiosity for IMO, NSO, IGKO, and NTSE competitions.',
  },

  // 5. Study Materials & DPPs
  {
    id: 'sm-1',
    category: 'Study Materials & DPPs',
    question: 'What printed and digital study materials are provided?',
    answer: 'Every enrolled student receives comprehensive theory booklets, Daily Practice Problems (DPPs), past 15-year chapter-wise solved question banks, formula flashcards, and full LMS digital library access with 10,000+ interactive practice questions.',
  },
  {
    id: 'sm-2',
    category: 'Study Materials & DPPs',
    question: 'How do students get their daily doubts solved outside lecture hours?',
    answer: 'Students can attend daily 1-on-1 Faculty Doubt Desks between 4:00 PM and 7:30 PM at the Jaipur center or submit photo doubts 24/7 on the Hodu Academy LMS mobile portal for verified video/written faculty solutions within 2 hours.',
  },

  // 6. Fees & Scholarships
  {
    id: 'fs-1',
    category: 'Fees & Scholarships',
    question: 'Does Hodu Academy offer merit-based scholarships?',
    answer: 'Yes! We conduct the Hodu Academy Scholarship Assessment Test (HASAT). Students scoring top ranks can receive up to 90% tuition fee waivers based on academic merit and previous school board scores.',
  },
  {
    id: 'fs-2',
    category: 'Fees & Scholarships',
    question: 'What are the available fee payment options?',
    answer: 'We offer flexible semester-wise installments, annual upfront plans with early-bird discounts, and 0% interest EMI options through major banking partners.',
  },
]

const categories = [
  'All Questions',
  'Curriculum & Boards',
  'Jaipur Offline Campus',
  'Admissions & Batches',
  'JEE, NEET & Olympiads',
  'Study Materials & DPPs',
  'Fees & Scholarships',
]

export default function FaqInteractiveClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Questions')
  const [openIds, setOpenIds] = useState<string[]>(['cb-1', 'jc-1'])

  const toggleAccordion = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const filteredFaqs = useMemo(() => {
    return allFaqsData.filter(faq => {
      const matchesCategory =
        selectedCategory === 'All Questions' || faq.category === selectedCategory

      const matchesSearch =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="space-y-10">
      {/* ─── Search Bar ─── */}
      <div className="max-w-2xl mx-auto">
        <div className="relative flex items-center bg-white border-2 border-brand-border/80 focus-within:border-brand-maroon rounded-2xl shadow-md p-2 transition-all">
          <Search className="h-5 w-5 text-brand-muted ml-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. IGCSE, fees, Jaipur center, batch size, doubts)..."
            className="w-full px-3 py-2 text-sm text-brand-text bg-transparent outline-none placeholder:text-neutral-400 font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-brand-muted hover:text-brand-text font-bold px-2 py-1 mr-1 rounded-md hover:bg-neutral-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ─── Category Filter Pills ─── */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {categories.map(cat => {
          const isActive = selectedCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-brand-maroon text-white shadow-md -translate-y-0.5'
                  : 'bg-white text-brand-muted hover:text-brand-maroon hover:bg-brand-blush border border-brand-border shadow-2xs'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* ─── Results Counter ─── */}
      <div className="flex items-center justify-between border-b border-brand-border/60 pb-3 max-w-4xl mx-auto text-xs text-brand-muted">
        <span>
          Showing <strong className="text-brand-maroon">{filteredFaqs.length}</strong> questions in <strong className="text-brand-text">{selectedCategory}</strong>
        </span>
        {searchQuery && (
          <span>Search query: &quot;{searchQuery}&quot;</span>
        )}
      </div>

      {/* ─── Accordion List ─── */}
      <div className="max-w-4xl mx-auto space-y-3.5">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIds.includes(faq.id)
            return (
              <ScrollReveal key={faq.id} animation="fade-up" delay={(idx % 6) * 50}>
                <div
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-2xs ${
                    isOpen ? 'border-brand-maroon/60 shadow-md ring-1 ring-brand-maroon/10' : 'border-brand-border hover:border-brand-maroon/40'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1 pr-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-crimson block">
                        {faq.category}
                      </span>
                      <h3 className="font-serif-editorial text-base sm:text-lg font-bold text-brand-text leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? 'bg-brand-maroon text-white rotate-180' : 'bg-brand-blush text-brand-maroon'
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-brand-muted leading-relaxed border-t border-brand-border/40 animate-fade-in">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )
          })
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border border-brand-border space-y-3">
            <HelpCircle className="h-10 w-10 text-brand-muted mx-auto" />
            <h4 className="font-bold text-brand-text">No matching questions found</h4>
            <p className="text-xs text-brand-muted max-w-sm mx-auto">
              Try modifying your search keywords or reach out to our counselors directly.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All Questions'); }}
              className="text-xs font-bold text-brand-maroon hover:underline pt-2 inline-block"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* ─── Still Have Questions CTA Banner ─── */}
      <div className="max-w-4xl mx-auto pt-6">
        <div className="bg-gradient-to-br from-[#3D0607] via-[#5C0A0C] to-[#7E0D0D] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-white/10 backdrop-blur-xs text-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-white/15 uppercase tracking-wider">
              Need Personal Guidance?
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-white leading-tight">
              Still Have Unanswered Questions?
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-md">
              Speak directly with our senior curriculum mentors or visit our Jaipur center for a 1-on-1 counseling session.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="tel:+919257879555"
              className="w-full sm:w-auto bg-white hover:bg-neutral-100 text-brand-maroon font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Phone className="h-4 w-4" />
              <span>Call +91-9257879555</span>
            </a>
            <Link
              href="/contact"
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-brand-text font-bold px-5 py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>Book Diagnostic Visit</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
