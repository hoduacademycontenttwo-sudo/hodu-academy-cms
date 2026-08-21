import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import Link from 'next/link'
import { Phone, MapPin, CheckCircle2, Clock, Calendar, ShieldCheck, Bus, BookOpen, Users, Award, Sparkles, Building2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import EnquiryForm from '@/components/hodu/EnquiryForm'

export const metadata = {
  title: 'Offline Coaching Jaipur — Hodu Academy Classroom Programs | IGCSE, IB, CBSE, JEE, NEET',
  description: 'Join Hodu Academy’s state-of-the-art offline coaching centre in Jaipur. Smart digital classrooms, 1:12 batch sizes, 1-on-1 daily doubt cells, and GPS AC transport.',
}

const campusFacilities = [
  {
    icon: '🏫',
    title: 'Smart Digital Classrooms',
    tag: 'Acoustically Treated',
    desc: 'Equipped with 85-inch interactive touchscreens, digital visualizers, and ergonomic seating designed for 3+ hour focus without fatigue.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: '🎯',
    title: '1-on-1 Faculty Doubt Desks',
    tag: 'Daily 4:00 PM – 7:30 PM',
    desc: 'Dedicated private consultation booths where subject masters resolve student queries line-by-line, ensuring zero lingering confusion.',
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: '📚',
    title: 'Silent Reference Library',
    tag: '8:00 AM – 9:00 PM Access',
    desc: 'Individual air-conditioned study carrels stocked with 15+ years of Cambridge, IB, CBSE & JEE past exam archives and reference textbooks.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: '💻',
    title: 'Computer-Based Testing (CBT) Lab',
    tag: 'Simulated Exam Terminals',
    desc: 'High-speed desktop terminals configured to replicate real NTA JEE Main, NEET, and Cambridge digital exam environments with instant score analytics.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: '📱',
    title: 'Biometric Attendance & Parent Portal',
    tag: 'Real-Time SMS Updates',
    desc: 'Automated entry/exit timestamps sent directly to parents, coupled with weekly performance and attendance dashboards on the Hodu App.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: '🚌',
    title: 'GPS-Tracked AC Transport',
    tag: 'Doorstep Pickup & Drop',
    desc: 'Safe, air-conditioned bus and van network with live GPS parent tracking covering all major residential sectors across Jaipur.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&h=450&fit=crop&auto=format'
  },
]

const offlinePrograms = [
  {
    title: 'International Boards Cohort',
    badge: 'Cambridge & IB Hub',
    target: 'IGCSE · Cambridge O/A Levels · IB MYP & DP',
    desc: 'Curriculum-tailored classroom batches focusing on syllabus mark schemes, past-paper dissection, Extended Essays, and Internal Assessments (IA).',
    schedule: 'Mon – Fri (4:00 PM – 7:30 PM)',
    features: ['Past 15-Year Marking Schemes', '1-on-1 Oral & IA Mentorship', 'Class Cap of 12 Students'],
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&h=450&fit=crop&auto=format',
    link: '/courses?category=IGCSE'
  },
  {
    title: 'JEE & NEET Integrated 2-Year Batch',
    badge: 'Pre-Eng & Medical',
    target: 'Classes 11 & 12 + Dropper Intensive',
    desc: 'High-octane conceptual training with 30-question Daily Practice Problems (DPPs), error analysis logs, and weekly All-India rank simulation mocks.',
    schedule: 'Morning & Evening Batches Available',
    features: ['Chapter-wise Level 1–3 Problem Sets', 'Full Length OMR & CBT Testing', 'Personal Mentor Allocation'],
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=700&h=450&fit=crop&auto=format',
    link: '/courses?category=Competitive+Exams'
  },
  {
    title: 'CBSE Board Masterclass (9th – 12th)',
    badge: 'Board Rankers Hub',
    target: 'Class 9, 10, 11 & 12 (Science & Commerce)',
    desc: 'Rigorous NCERT line-by-line decoding, competency-based questions, exemplar problems, and specialized board exam presentation sessions.',
    schedule: 'Mon – Sat (3:30 PM – 6:30 PM)',
    features: ['NCERT + Exemplar Solutions Kit', 'Monthly Subject-wise Mock Boards', 'Parent-Teacher Review Sessions'],
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&h=450&fit=crop&auto=format',
    link: '/courses?category=CBSE'
  },
  {
    title: 'Junior Olympiads & Foundation Track',
    badge: 'Aptitude & Science',
    target: 'Classes 6, 7 & 8',
    desc: 'Nurturing non-routine mathematical thinking and logical aptitude for IMO, NSO, PRMO, and early NTSE foundation.',
    schedule: 'Tue, Thu, Sat & Sun Batches',
    features: ['Mental Agility & Speed Math', 'Experimental Science Demonstrations', 'Talent Search Exam Training'],
    img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=700&h=450&fit=crop&auto=format',
    link: '/courses?category=Olympiads'
  }
]

const timetableSlots = [
  { batch: 'Morning Intensive Batch', time: '8:00 AM – 1:30 PM', audience: 'Droppers / Integrated College Cohorts', focus: 'Daily 4 Lecture Hours + 1.5 Hr Supervised Problem Solving' },
  { batch: 'Evening Foundation & Board Batch', time: '3:30 PM – 7:30 PM', audience: 'Classes 8, 9, 10, 11 & 12 Regular School Students', focus: 'Daily 3 Core Lectures + 1 Hr Faculty Doubt Desk' },
  { batch: 'Weekend Masterclass Cohort', time: 'Saturday & Sunday (9:00 AM – 4:00 PM)', audience: 'Outstation & Boarding School Students', focus: 'Deep Dive Modules + Full Mock Exam with Live Review' },
]

const fallbackFaculty = [
  { initials: 'VP', name: 'Mr. VP Singh',         subject: 'Physics Lead & Senior Mentor', exp: '25+ Yrs Experience', college: 'MNIT Jaipur Alum', photo_url: null },
  { initials: 'RJ', name: 'Mr. Rohit Jain',       subject: 'Inorganic & Organic Chemistry', exp: '16+ Yrs Experience', college: 'Senior National Faculty', photo_url: null },
  { initials: 'AA', name: 'Mr. Abhishek Agarwal', subject: 'Higher Mathematics & Mechanics', exp: '10+ Yrs Experience', college: 'IIIT Hyderabad Alum', photo_url: null },
]

export default async function OfflinePage() {
  const supabase = await createClient()
  const { data: dbFaculty } = await supabase
    .from('cms_faculty')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .order('sort_order')

  const faculty = dbFaculty && dbFaculty.length > 0
    ? dbFaculty.map(f => ({
        initials: f.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase(),
        name: f.name,
        subject: f.subject,
        exp: f.experience,
        college: 'Senior Faculty',
        photo_url: f.photo_url,
      }))
    : fallbackFaculty

  return (
    <div className="space-y-0 animate-fade-in">
      
      {/* Editorial Campus Hero */}
      <section className="relative min-h-[580px] lg:min-h-[640px] overflow-hidden border-b border-brand-border bg-gradient-to-b from-brand-bg via-white to-brand-bg academic-grid-pattern flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 w-full">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border border-brand-maroon/20 px-4 py-2 rounded-full text-brand-maroon text-xs font-black shadow-xs">
                <Building2 className="h-3.5 w-3.5 text-brand-maroon" />
                <span className="uppercase tracking-widest text-[11px] text-brand-navy font-black">
                  JAIPUR OFFLINE LEARNING CAMPUS
                </span>
                <span className="text-brand-border">|</span>
                <span className="text-brand-maroon font-bold text-[11px]">ADMISSIONS 2025–26</span>
              </div>

              <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[3.3rem] font-bold text-brand-navy leading-[1.15] tracking-tight">
                An Immersive Physical Campus Built for <span className="italic font-normal text-brand-maroon underline decoration-brand-maroon/30 underline-offset-8">Deep Academic Focus</span>
              </h1>

              <p className="text-sm sm:text-base text-brand-navy/80 font-light leading-relaxed max-w-xl">
                Experience education beyond screens. Our Jaipur campus features air-conditioned smart amphitheatres, dedicated 1-on-1 faculty doubt cells, silent study carrels, and personalized mentoring cohorts capped at 12 students.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <a href="#visit-form"
                  className="bg-brand-maroon hover:bg-brand-crimson text-white font-extrabold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 text-xs uppercase tracking-wider">
                  <span>Schedule Campus Walkthrough</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href={`tel:${HODU.phone}`}
                  className="bg-white/90 hover:bg-brand-cream text-brand-navy border border-brand-border font-bold px-7 py-4 rounded-xl shadow-xs hover:shadow transition-all duration-200 flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
                  <Phone className="h-4 w-4 text-brand-maroon" />
                  <span>{HODU.phone}</span>
                </a>
              </div>

              {/* Quick Trust Pillars */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-brand-border max-w-lg">
                <div>
                  <span className="text-lg sm:text-xl font-black text-brand-maroon block">1 : 12</span>
                  <span className="text-[10px] text-brand-navy/60 font-semibold uppercase tracking-wider">Cohort Limit</span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-black text-brand-maroon block">8 AM – 9 PM</span>
                  <span className="text-[10px] text-brand-navy/60 font-semibold uppercase tracking-wider">Library & Doubt Desk</span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-black text-brand-maroon block">100% AC</span>
                  <span className="text-[10px] text-brand-navy/60 font-semibold uppercase tracking-wider">GPS Transport Hub</span>
                </div>
              </div>
            </div>

            {/* Right Campus Snapshot */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-brand-border bg-white p-3">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop&auto=format"
                  alt="Hodu Academy Jaipur Campus"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />
                <div className="absolute inset-x-7 bottom-7 bg-brand-navy/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl border border-white/20 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">Jaipur Main Hub</span>
                    <p className="text-xs sm:text-sm font-black text-white">{HODU.address}</p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping shrink-0" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* World-Class Campus Infrastructure */}
      <section className="reveal py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 border border-brand-maroon/20">
              CAMPUS INFRASTRUCTURE
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy tracking-tight">
              Designed for Concentration, Collaboration & Mastery
            </h2>
            <p className="text-sm sm:text-base text-brand-navy/70 mt-2.5 max-w-2xl mx-auto font-light leading-relaxed">
              Every square foot of our Jaipur center is purposefully engineered to eliminate distractions and provide direct access to faculty mentorship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {campusFacilities.map(item => (
              <div key={item.title}
                className="group relative rounded-3xl overflow-hidden border border-brand-border bg-brand-bg/40 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
                
                {/* Photo Top */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-brand-navy/25 to-transparent" />
                  <span className="absolute top-4 left-4 bg-brand-navy/90 text-white border border-white/20 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
                    {item.tag}
                  </span>
                  <span className="absolute bottom-3 left-4 text-3xl drop-shadow-md">{item.icon}</span>
                </div>

                {/* Text Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif-editorial font-bold text-brand-navy text-lg mb-2 group-hover:text-brand-maroon transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-navy/75 leading-relaxed font-light">{item.desc}</p>
                  </div>
                </div>

                {/* Bottom accent bar */}
                <div className="h-1 w-0 bg-brand-maroon group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline Classroom Programs */}
      <section className="reveal py-16 sm:py-20 bg-brand-bg border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 border border-brand-maroon/20">
              OFFLINE CURRICULUM COHORTS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy tracking-tight">
              Classroom Programs for Academic Excellence
            </h2>
            <p className="text-sm sm:text-base text-brand-navy/70 mt-2.5 max-w-xl mx-auto font-light">
              Structured study modules, rigorous testing cycles, and individual mentoring for every major board and exam.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {offlinePrograms.map(prog => (
              <div key={prog.title}
                className="bg-white border border-brand-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                
                <div className="h-48 relative overflow-hidden">
                  <img src={prog.img} alt={prog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />
                  <span className="absolute top-4 left-4 bg-brand-maroon text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow">
                    {prog.badge}
                  </span>
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[11px] font-semibold text-brand-gold block">{prog.target}</span>
                    <h3 className="font-bold text-lg leading-tight text-white">{prog.title}</h3>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-brand-navy/75 leading-relaxed font-light mb-4">{prog.desc}</p>
                    
                    <div className="bg-brand-bg border border-brand-border rounded-2xl p-3 text-xs mb-4">
                      <span className="font-bold text-brand-navy block">Batch Timing:</span>
                      <span className="text-brand-maroon font-semibold">{prog.schedule}</span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-brand-border/60">
                      {prog.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-brand-navy/80">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={prog.link}
                    className="w-full bg-brand-navy hover:bg-brand-maroon text-white font-extrabold py-3.5 px-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-colors duration-200 shadow-sm mt-4">
                    <span>View Syllabus & Reserve Offline Seat</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Timetable & Cohort Schedule */}
      <section className="reveal py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-maroon/10 text-brand-maroon text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 border border-brand-maroon/20">
              SESSION 2025–26 SCHEDULE
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-navy">
              Flexible Batch Timings Designed for School Balance
            </h2>
          </div>

          <div className="space-y-4">
            {timetableSlots.map((slot, i) => (
              <div key={i} className="bg-brand-bg/60 border border-brand-border rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-maroon/40 transition-colors shadow-xs">
                <div>
                  <span className="bg-brand-navy text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md inline-block mb-1.5">
                    {slot.batch}
                  </span>
                  <h4 className="font-bold text-brand-navy text-base">{slot.audience}</h4>
                  <p className="text-xs text-brand-navy/70 mt-1 font-light">{slot.focus}</p>
                </div>
                <div className="bg-white border border-brand-border rounded-xl px-4 py-2.5 text-center shrink-0 self-start sm:self-auto shadow-xs">
                  <span className="text-[10px] font-bold text-brand-navy/60 block uppercase">Timings</span>
                  <span className="text-xs font-black text-brand-maroon">{slot.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Senior Faculty In-Residence */}
      <section className="reveal py-16 sm:py-20 bg-brand-navy text-white relative dark-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-white/10 text-brand-gold text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 border border-white/15">
              FACULTY IN-RESIDENCE
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Mentored Directly by Subject Masters
            </h2>
            <p className="text-sm text-white/70 mt-2 max-w-xl mx-auto font-light">
              Educators from premier engineering, medical, and international institutions with decades of classroom teaching excellence.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {faculty.map(f => (
              <div
                key={f.name}
                className="group relative bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-7 text-center overflow-hidden hover:bg-white/10 hover:border-brand-gold/50 hover:-translate-y-1.5 transition-all duration-300 shadow-xl"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {f.photo_url ? (
                    <img
                      src={f.photo_url}
                      alt={f.name}
                      className="relative w-24 h-24 rounded-full object-cover object-top shadow-lg group-hover:scale-105 transition-transform duration-300 ring-2 ring-brand-gold/60"
                    />
                  ) : (
                    <div className="relative w-24 h-24 bg-gradient-to-br from-brand-maroon to-brand-midnight text-brand-gold rounded-full flex items-center justify-center font-black text-2xl shadow-lg ring-2 ring-brand-gold/60 group-hover:scale-105 transition-transform duration-300">
                      {f.initials}
                    </div>
                  )}
                </div>
                <h3 className="font-serif-editorial font-bold text-white text-lg group-hover:text-brand-gold transition-colors duration-200">{f.name}</h3>
                <p className="text-xs text-brand-gold font-semibold mt-1">{f.subject}</p>
                <p className="text-xs text-white/60 mt-0.5">{f.college ? `${f.college} · ` : ''}{f.exp}</p>

                <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-white/50">
                  Daily 1-on-1 Doubt Desk Leader
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-xs text-white/60">
            + 20 more certified subject specialists across Cambridge, IB, CBSE, JEE & NEET.{' '}
            <Link href="/about" className="text-brand-gold font-bold hover:underline">Meet full academic team →</Link>
          </p>
        </div>
      </section>

      {/* Book a Campus Walkthrough & Diagnostic Test */}
      <section id="visit-form" className="reveal py-16 sm:py-20 bg-brand-bg border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="space-y-5">
            <span className="inline-block bg-brand-maroon text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-xs">
              PHYSICAL CENTER TOUR & DIAGNOSTIC
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-navy leading-tight">
              Visit Our Jaipur Campus Today
            </h2>
            <p className="text-sm text-brand-navy/70 font-light leading-relaxed">
              Take a guided walkthrough of our smart classrooms, test labs, and library. Meet senior faculty in person to review syllabus materials and past student scorecards.
            </p>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3.5 text-sm bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                <MapPin className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-brand-navy block">Campus Location</span>
                  <span className="font-light text-brand-navy/70 text-xs">{HODU.address}</span>
                </div>
              </div>
              <div className="flex items-start gap-3.5 text-sm bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                <Clock className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-brand-navy block">Visiting Hours</span>
                  <span className="font-light text-brand-navy/70 text-xs">Monday – Sunday: 9:00 AM to 7:30 PM</span>
                </div>
              </div>
              <div className="flex items-start gap-3.5 text-sm bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                <Phone className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-brand-navy block">Direct Admissions Desk</span>
                  <span className="font-light text-brand-navy/70 text-xs">{HODU.phone} · {HODU.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-brand-border rounded-3xl p-6 sm:p-9 shadow-2xl">
            <h3 className="font-serif-editorial font-bold text-brand-navy text-xl mb-1">Book Campus Walkthrough</h3>
            <p className="text-xs text-brand-navy/60 mb-6 font-light">Select your preferences below to reserve your personal faculty slot.</p>
            <EnquiryForm />
          </div>
        </div>
      </section>

    </div>
  )
}
