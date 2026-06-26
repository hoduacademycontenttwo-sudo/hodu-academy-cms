import { HODU } from '@/lib/hodu'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import HeroCarousel from '@/components/hodu/HeroCarousel'

export const metadata = {
  title: 'Offline Coaching — Hodu Academy',
  description: 'Join Hodu Academy\'s offline coaching centre in Jaipur for IGCSE, IB, CBSE, JEE, NEET and more.',
}

const whyChoose = [
  { icon: '👨‍🏫', title: 'Expert Faculty',         desc: 'Seasoned educators from premier institutions with 15+ years of teaching experience.' },
  { icon: '🏫',  title: 'World-Class Classrooms',  desc: 'Smart, tech-enabled classrooms with projectors, digital boards and air-conditioning.' },
  { icon: '📝',  title: 'Structured Study Plans',  desc: 'Week-by-week plans aligned to board/entrance exam calendars so nothing is missed.' },
  { icon: '📊',  title: 'Regular Assessments',     desc: 'Weekly tests, chapter-wise quizzes, and full-length mock exams with detailed feedback.' },
  { icon: '👨‍👩‍👦', title: 'PTM & Parent Reports',   desc: 'Monthly parent-teacher meetings and online performance dashboards for full transparency.' },
  { icon: '🚌',  title: 'Conveyance Facility',     desc: 'Door-to-door pick-up and drop facility available across key localities in Jaipur.' },
]

const offlineCourses = [
  {
    icon: '🌐',
    title: 'International Boards',
    color: 'from-blue-50 to-blue-100 border-blue-200',
    badge: 'bg-blue-600',
    items: ['IGCSE (Cambridge)', 'Cambridge O Level', 'IB (MYP & DP)'],
    desc: 'Expert coaches for Cambridge & IB syllabi with past-paper practice, internal assessments and oral preparation.',
  },
  {
    icon: '🏆',
    title: 'Competitive Exams',
    color: 'from-red-50 to-red-100 border-red-200',
    badge: 'bg-[#7E0D0D]',
    items: ['JEE Main & Advanced', 'NEET UG', 'CUET', 'BITSAT'],
    desc: 'Conceptual clarity + problem-solving techniques to crack India\'s toughest entrance exams.',
  },
  {
    icon: '📚',
    title: 'CBSE Board',
    color: 'from-green-50 to-green-100 border-green-200',
    badge: 'bg-green-600',
    items: ['Class 9 & 10', 'Class 11 & 12', 'Science & Commerce'],
    desc: 'NCERT-focused coaching with chapter-wise notes, DPPs, and board-pattern test series.',
  },
  {
    icon: '🥇',
    title: 'Olympiads',
    color: 'from-yellow-50 to-yellow-100 border-yellow-200',
    badge: 'bg-yellow-600',
    items: ['NSO', 'IMO', 'IGKO', 'IEO'],
    desc: 'Olympiad-specific curriculum with higher-order thinking problems and previous year papers.',
  },
]

const academics = [
  { title: 'Daily Practice Problems (DPPs)', desc: 'Curated problem sets assigned every day to reinforce concepts taught in class.' },
  { title: 'Chapter-wise Notes', desc: 'Concise, well-structured notes prepared by subject experts — covering every topic in the syllabus.' },
  { title: 'Weekly Tests', desc: 'Short chapter tests every week to ensure consistent revision and identify weak areas early.' },
  { title: 'Monthly Mock Exams', desc: 'Full-length mock exams simulating actual board/entrance conditions with percentile ranking.' },
  { title: 'Doubt Clearing Sessions', desc: 'Dedicated doubt-clearing slots every week so no question goes unanswered.' },
  { title: 'LMS Access', desc: 'All study materials, test results and performance reports available 24/7 on the Hodu LMS portal.' },
]

const holistic = [
  { icon: '🎨', title: 'Arts & Crafts',       desc: 'Painting, sketching, and craft workshops that nurture creativity and fine motor skills.' },
  { icon: '🎤', title: 'Public Speaking',      desc: 'Debate clubs, MUN, and elocution sessions to build confidence and communication.' },
  { icon: '♟️',  title: 'Chess & Strategy',    desc: 'Chess coaching sessions that sharpen analytical thinking and patience.' },
  { icon: '🧘', title: 'Yoga & Mindfulness',  desc: 'Weekly yoga and mindfulness sessions to manage exam stress and improve focus.' },
  { icon: '🤝', title: 'Community Service',   desc: 'Organised volunteering drives instilling social responsibility and empathy.' },
  { icon: '🎭', title: 'Performing Arts',      desc: 'Drama, dance, and music activities for emotional expression and team spirit.' },
]

const faculty = [
  { initials: 'VP', name: 'Mr. VP Singh',         subject: 'Physics & Maths',    exp: '25+ yrs', college: 'MNIT Jaipur' },
  { initials: 'RJ', name: 'Mr. Rohit Jain',       subject: 'Chemistry',          exp: '15+ yrs', college: 'MNIT Jaipur' },
  { initials: 'AA', name: 'Mr. Abhishek Agarwal', subject: 'Computer Science',   exp: '8+ yrs',  college: 'IIIT Hyderabad' },
]

const galleryItems = [
  { label: 'Smart Classroom', bg: 'bg-blue-100' },
  { label: 'Science Lab',     bg: 'bg-green-100' },
  { label: 'Library',         bg: 'bg-yellow-100' },
  { label: 'Sports Area',     bg: 'bg-red-100' },
  { label: 'Art Room',        bg: 'bg-purple-100' },
  { label: 'PTM Hall',        bg: 'bg-pink-100' },
]

export default function OfflinePage() {
  return (
    <>
      <HeroCarousel />

      {/* Why Choose Hodu */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#1B2A44] mb-2">Why Choose Hodu for Offline Coaching?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Six pillars that make Hodu Academy the preferred offline coaching institute in Jaipur.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyChoose.map(item => (
              <div key={item.title} className="p-6 rounded-2xl bg-[#FDF5F5] border border-[#F3DCDC] hover:border-[#7E0D0D]/30 transition-colors">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-bold text-[#1B2A44] mt-3 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses We Offer */}
      <section className="py-16 bg-[#FDF5F5]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#1B2A44] mb-2">Courses We Offer</h2>
            <p className="text-gray-500">Comprehensive coaching across international boards, national boards, and competitive exams.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {offlineCourses.map(cat => (
              <div key={cat.title} className={`bg-gradient-to-br ${cat.color} border rounded-2xl p-6`}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{cat.icon}</span>
                  <div>
                    <h3 className="font-bold text-[#1B2A44] text-base mb-1">{cat.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{cat.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map(item => (
                        <span key={item} className={`${cat.badge} text-white text-xs font-medium px-2.5 py-0.5 rounded-full`}>{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/courses" className="inline-flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white font-bold px-8 py-3.5 rounded-2xl transition-colors">
              View All Courses →
            </Link>
          </div>
        </div>
      </section>

      {/* Academics */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#1B2A44] mb-2">Academics</h2>
            <p className="text-gray-500">A rigorous academic framework built for consistent results.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {academics.map((item, i) => (
              <div key={item.title} className="flex gap-4 p-5 bg-[#FDF5F5] border border-[#F3DCDC] rounded-2xl">
                <div className="w-9 h-9 bg-[#7E0D0D] text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-[#1B2A44] text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Holistic Development */}
      <section className="py-16 bg-gradient-to-br from-[#1B2A44] to-[#0f1e33] text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">Holistic Development</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Beyond academics — we build well-rounded individuals ready for the world.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {holistic.map(item => (
              <div key={item.title} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/15 transition-colors">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-bold mt-3 mb-1 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#1B2A44] mb-2">Meet Our Faculty</h2>
            <p className="text-gray-500">Passionate educators from India's top institutions.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {faculty.map(f => (
              <div key={f.name} className="bg-[#FDF5F5] border border-[#F3DCDC] rounded-2xl p-6 text-center">
                <div className="w-20 h-20 bg-[#7E0D0D] text-white rounded-full mx-auto mb-4 flex items-center justify-center font-black text-xl">
                  {f.initials}
                </div>
                <h3 className="font-bold text-[#1B2A44]">{f.name}</h3>
                <p className="text-xs text-[#7E0D0D] font-medium mt-1">{f.subject}</p>
                <p className="text-xs text-gray-500 mt-0.5">{f.college} · {f.exp}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm text-gray-500">
            + 20 more subject specialists across all courses.{' '}
            <Link href="/about" className="text-[#7E0D0D] font-semibold hover:underline">Meet full faculty →</Link>
          </p>
        </div>
      </section>

      {/* Gallery placeholder */}
      <section className="py-16 bg-[#FDF5F5]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#1B2A44] mb-2">Our Campus</h2>
            <p className="text-gray-500">A safe, inspiring environment where learning comes alive.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {galleryItems.map(item => (
              <div key={item.label} className={`${item.bg} rounded-2xl h-40 flex items-end p-4`}>
                <span className="text-xs font-bold text-gray-700 bg-white/70 backdrop-blur px-2 py-1 rounded-lg">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-14 bg-[#1B2A44] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-black mb-2">Join Our Team</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Are you a passionate educator? We're always looking for talented teachers who love helping students succeed.
          </p>
          <a href={`mailto:${HODU.email}?subject=Teaching%20Application`}
            className="inline-block bg-white text-[#1B2A44] font-bold px-8 py-3 rounded-2xl hover:bg-gray-100 transition-colors">
            Apply Now — {HODU.email}
          </a>
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="py-14 bg-[#7E0D0D] text-white text-center">
        <h2 className="text-2xl font-black mb-2">Admissions Open for 2025–26</h2>
        <p className="text-pink-200 mb-6">Limited seats available. Secure your child's spot today.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/contact"
            className="bg-white text-[#7E0D0D] font-bold px-8 py-3 rounded-2xl hover:bg-pink-50 transition-colors">
            Enquire Now
          </Link>
          <a href={`tel:${HODU.phone}`}
            className="border-2 border-white/60 hover:border-white text-white font-bold px-8 py-3 rounded-2xl transition-colors flex items-center gap-2">
            <Phone size={16} /> Call Us
          </a>
        </div>
      </section>
    </>
  )
}
