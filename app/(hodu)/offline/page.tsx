import { HODU } from '@/lib/hodu'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import HeroCarousel from '@/components/hodu/HeroCarousel'

export const metadata = {
  title: 'Offline Coaching — Hodu Academy',
  description: 'Join Hodu Academy\'s offline coaching centre in Jaipur for IGCSE, IB, CBSE, JEE, NEET and more.',
}

const whyChoose = [
  { icon: '👨‍🏫', title: 'Expert Faculty',         desc: 'Seasoned educators from premier institutions with 15+ years of teaching experience.', image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=450&fit=crop&auto=format' },
  { icon: '🏫',  title: 'World-Class Classrooms',  desc: 'Smart, tech-enabled classrooms with projectors, digital boards and air-conditioning.', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=450&fit=crop&auto=format' },
  { icon: '📝',  title: 'Structured Study Plans',  desc: 'Week-by-week plans aligned to board/entrance exam calendars so nothing is missed.', image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&h=450&fit=crop&auto=format' },
  { icon: '📊',  title: 'Regular Assessments',     desc: 'Weekly tests, chapter-wise quizzes, and full-length mock exams with detailed feedback.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=450&fit=crop&auto=format' },
  { icon: '👨‍👩‍👦', title: 'PTM & Parent Reports',   desc: 'Monthly parent-teacher meetings and online performance dashboards for full transparency.', image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&h=450&fit=crop&auto=format' },
  { icon: '🚌',  title: 'Conveyance Facility',     desc: 'Door-to-door pick-up and drop facility available across key localities in Jaipur.', image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=600&h=450&fit=crop&auto=format' },
]

const offlineCourses = [
  {
    icon: '🌐',
    title: 'International Boards',
    color: 'from-blue-50 to-blue-100 border-blue-200',
    badge: 'bg-blue-600',
    items: ['IGCSE (Cambridge)', 'Cambridge O Level', 'IB (MYP & DP)'],
    desc: 'Expert coaches for Cambridge & IB syllabi with past-paper practice, internal assessments and oral preparation.',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&h=450&fit=crop&auto=format',
  },
  {
    icon: '🏆',
    title: 'Competitive Exams',
    color: 'from-red-50 to-red-100 border-red-200',
    badge: 'bg-[#7E0D0D]',
    items: ['JEE Main & Advanced', 'NEET UG', 'CUET', 'BITSAT'],
    desc: 'Conceptual clarity + problem-solving techniques to crack India\'s toughest entrance exams.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=700&h=450&fit=crop&auto=format',
  },
  {
    icon: '📚',
    title: 'CBSE Board',
    color: 'from-green-50 to-green-100 border-green-200',
    badge: 'bg-green-600',
    items: ['Class 9 & 10', 'Class 11 & 12', 'Science & Commerce'],
    desc: 'NCERT-focused coaching with chapter-wise notes, DPPs, and board-pattern test series.',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&h=450&fit=crop&auto=format',
  },
  {
    icon: '🥇',
    title: 'Olympiads',
    color: 'from-yellow-50 to-yellow-100 border-yellow-200',
    badge: 'bg-yellow-600',
    items: ['NSO', 'IMO', 'IGKO', 'IEO'],
    desc: 'Olympiad-specific curriculum with higher-order thinking problems and previous year papers.',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=700&h=450&fit=crop&auto=format',
  },
]

const academics = [
  { title: 'Daily Practice Problems (DPPs)', desc: 'Curated problem sets assigned every day to reinforce concepts taught in class.', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop&auto=format' },
  { title: 'Chapter-wise Notes', desc: 'Concise, well-structured notes prepared by subject experts — covering every topic in the syllabus.', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600&h=400&fit=crop&auto=format' },
  { title: 'Weekly Tests', desc: 'Short chapter tests every week to ensure consistent revision and identify weak areas early.', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop&auto=format' },
  { title: 'Monthly Mock Exams', desc: 'Full-length mock exams simulating actual board/entrance conditions with percentile ranking.', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop&auto=format' },
  { title: 'Doubt Clearing Sessions', desc: 'Dedicated doubt-clearing slots every week so no question goes unanswered.', image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=600&h=400&fit=crop&auto=format' },
  { title: 'LMS Access', desc: 'All study materials, test results and performance reports available 24/7 on the Hodu LMS portal.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&auto=format' },
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
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="text-3xl font-black text-[#1B2A44] mb-2 transition-transform duration-300 hover:scale-[1.02] inline-block">
              Why Choose Hodu for Offline Coaching?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">Six pillars that make Hodu Academy the preferred offline coaching institute in Jaipur.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map(item => (
              <div
                key={item.title}
                className="group relative rounded-2xl overflow-hidden border border-[#F3DCDC] bg-[#FDF5F5] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-3xl drop-shadow-lg">{item.icon}</span>
                </div>

                {/* Text */}
                <div className="p-5">
                  <h3 className="font-bold text-[#1B2A44] mb-1 group-hover:text-[#7E0D0D] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#7E0D0D] group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses We Offer */}
      <section className="py-16 bg-[#FDF5F5]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10 animate-fade-in">
            <h2 className="text-3xl font-black text-[#1B2A44] mb-2 transition-transform duration-300 hover:scale-[1.02] inline-block">
              Courses We Offer
            </h2>
            <p className="text-gray-500">Comprehensive coaching across international boards, national boards, and competitive exams.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {offlineCourses.map(cat => (
              <div
                key={cat.title}
                className="group relative rounded-2xl overflow-hidden border border-[#F3DCDC] bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent`} />
                  <span className="absolute bottom-3 left-4 text-4xl drop-shadow-lg">{cat.icon}</span>
                </div>

                {/* Text */}
                <div className={`bg-gradient-to-br ${cat.color} border-t p-6`}>
                  <h3 className="font-bold text-[#1B2A44] text-base mb-1 group-hover:text-[#7E0D0D] transition-colors duration-300">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{cat.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(item => (
                      <span key={item} className={`${cat.badge} text-white text-xs font-medium px-2.5 py-0.5 rounded-full`}>{item}</span>
                    ))}
                  </div>
                </div>

                {/* Bottom accent bar */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#7E0D0D] group-hover:w-full transition-all duration-500" />
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
