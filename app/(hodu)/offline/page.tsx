import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import Link from 'next/link'
import { Phone, MapPin, CheckCircle2, Clock, Calendar, ShieldCheck, Bus, BookOpen, Users, Award, Building2, ArrowRight, Laptop, Smartphone, Target, School } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import EnquiryForm from '@/components/hodu/EnquiryForm'

export const metadata = {
  title: 'Offline Coaching Jaipur — Hodu Academy Classroom Programs | IGCSE, IB, CBSE, JEE, NEET',
  description: 'Join Hodu Academy’s state-of-the-art offline coaching centre in Jaipur. Smart digital classrooms, 1:12 batch sizes, 1-on-1 daily doubt cells, and GPS AC transport.',
}

const campusFacilities = [
  {
    icon: School,
    title: 'Smart Digital Classrooms',
    tag: 'Acoustically Treated',
    desc: 'Equipped with 85-inch interactive touchscreens, digital visualizers, and ergonomic seating designed for 3+ hour focus without fatigue.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: Target,
    title: '1-on-1 Faculty Doubt Desks',
    tag: 'Daily 4:00 PM – 7:30 PM',
    desc: 'Dedicated private consultation booths where subject masters resolve student queries line-by-line, ensuring zero lingering confusion.',
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: BookOpen,
    title: 'Silent Reference Library',
    tag: '8:00 AM – 9:00 PM Access',
    desc: 'Individual air-conditioned study carrels stocked with 15+ years of Cambridge, IB, CBSE & JEE past exam archives and reference textbooks.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: Laptop,
    title: 'Computer-Based Testing (CBT) Lab',
    tag: 'Simulated Exam Terminals',
    desc: 'High-speed desktop terminals configured to replicate real NTA JEE Main, NEET, and Cambridge digital exam environments with instant score analytics.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: Smartphone,
    title: 'Biometric Attendance & Parent Portal',
    tag: 'Real-Time SMS Updates',
    desc: 'Automated entry/exit timestamps sent directly to parents, coupled with weekly performance and attendance dashboards on the Hodu App.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&h=450&fit=crop&auto=format'
  },
  {
    icon: Bus,
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
    <div className="space-y-0 animate-fade-in bg-white">
      
      {/* Editorial Campus Hero */}
      <section className="relative overflow-hidden border-b border-brand-border bg-white py-14 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-brand-maroon text-white px-4 py-1.5 rounded-full text-xs font-black shadow-xs">
                <Building2 className="h-3.5 w-3.5" />
                <span className="uppercase tracking-widest text-[11px] font-black">
                  JAIPUR OFFLINE LEARNING CAMPUS
                </span>
              </div>

              <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[3.3rem] font-bold text-brand-maroon leading-[1.15] tracking-tight">
                An Immersive Physical Campus Built for <span className="underline decoration-brand-maroon/30 underline-offset-8">Deep Academic Focus</span>
              </h1>

              <p className="text-sm sm:text-base text-neutral-700 font-normal leading-relaxed max-w-xl">
                Experience education beyond screens. Our Jaipur campus features air-conditioned smart amphitheatres, dedicated 1-on-1 faculty doubt cells, silent study carrels, and personalized mentoring cohorts capped at 12 students.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <a href="#visit-form"
                  className="bg-brand-maroon hover:bg-brand-crimson text-white font-bold px-8 py-4 rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2.5 text-xs uppercase tracking-wider">
                  <span>Schedule Campus Walkthrough</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a href={`tel:${HODU.phone}`}
                  className="bg-white hover:bg-neutral-50 text-brand-maroon border-2 border-brand-maroon font-bold px-7 py-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
                  <Phone className="h-4 w-4 text-brand-maroon" />
                  <span>{HODU.phone}</span>
                </a>
              </div>

              {/* Quick Trust Pillars */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-brand-border max-w-lg">
                <div>
                  <span className="text-lg sm:text-xl font-black text-brand-maroon block font-display-modern">1 : 12</span>
                  <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">Cohort Limit</span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-black text-brand-maroon block font-display-modern">8 AM – 9 PM</span>
                  <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">Library & Doubt Desk</span>
                </div>
                <div>
                  <span className="text-lg sm:text-xl font-black text-brand-maroon block font-display-modern">100% AC</span>
                  <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-wider">GPS Transport</span>
                </div>
              </div>
            </div>

            {/* Right Campus Snapshot */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-brand-border bg-white p-2">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop&auto=format"
                  alt="Hodu Academy Jaipur Campus"
                  className="w-full h-80 sm:h-96 object-cover rounded-xl"
                />
                <div className="p-4 bg-white border-t border-brand-border mt-2">
                  <span className="text-[11px] font-bold text-brand-maroon uppercase tracking-wider block">Jaipur Main Hub</span>
                  <p className="text-xs font-semibold text-neutral-800">{HODU.address}</p>
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
            <span className="inline-block bg-brand-maroon text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 shadow-xs">
              CAMPUS INFRASTRUCTURE
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon tracking-tight">
              Designed for Concentration, Collaboration & Mastery
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2.5 max-w-2xl mx-auto font-normal leading-relaxed">
              Every square foot of our Jaipur center is purposefully engineered to eliminate distractions and provide direct access to faculty mentorship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {campusFacilities.map(item => {
              const IconComp = item.icon
              return (
                <div key={item.title}
                  className="rounded-2xl border-2 border-brand-border bg-white shadow-xs hover:shadow-md hover:border-brand-maroon transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  
                  {/* Photo Top */}
                  <div className="relative h-48 overflow-hidden border-b border-brand-border">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3.5 left-3.5 bg-brand-maroon text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                      {item.tag}
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <IconComp className="h-5 w-5 text-brand-maroon shrink-0" />
                        <h3 className="font-serif-editorial font-bold text-neutral-900 text-lg">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed font-normal">{item.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Offline Classroom Programs */}
      <section className="reveal py-16 sm:py-20 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-brand-maroon text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 shadow-xs">
              OFFLINE CURRICULUM COHORTS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon tracking-tight">
              Classroom Programs for Academic Excellence
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2.5 max-w-xl mx-auto font-normal">
              Structured study modules, rigorous testing cycles, and individual mentoring for every major board and exam.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {offlinePrograms.map(prog => (
              <div key={prog.title}
                className="bg-white border-2 border-brand-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                
                <div className="h-48 relative overflow-hidden border-b border-brand-border">
                  <img src={prog.img} alt={prog.title} className="w-full h-full object-cover transition-transform duration-500" />
                  <span className="absolute top-3.5 left-3.5 bg-brand-maroon text-white text-[10px] font-bold uppercase px-3 py-1 rounded-md shadow-sm">
                    {prog.badge}
                  </span>
                </div>

                <div className="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-brand-maroon uppercase tracking-wider block">{prog.target}</span>
                    <h3 className="font-serif-editorial font-bold text-xl text-neutral-900 mt-1 mb-2">{prog.title}</h3>
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal mb-4">{prog.desc}</p>
                    
                    <div className="bg-neutral-50 border border-brand-border rounded-xl p-3 text-xs mb-4">
                      <span className="font-bold text-neutral-900 block">Batch Timing:</span>
                      <span className="text-brand-maroon font-semibold">{prog.schedule}</span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-brand-border">
                      {prog.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-neutral-700">
                          <CheckCircle2 className="h-3.5 w-3.5 text-brand-maroon shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-brand-border">
                    <Link href={prog.link}
                      className="w-full bg-brand-maroon hover:bg-brand-crimson text-white font-bold py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 text-xs transition-colors shadow-xs">
                      <span>Reserve Seat in Batch</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Batch Timetable Matrix */}
      <section className="reveal py-16 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-maroon text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 shadow-xs">
              BATCH SCHEDULE 2025–26
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon">
              Structured Timetables for Daily Consistency
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-normal">Choose between morning, evening, or weekend masterclass slots.</p>
          </div>

          <div className="border-2 border-brand-border rounded-2xl overflow-hidden bg-white shadow-xs">
            <div className="divide-y divide-brand-border">
              {timetableSlots.map((slot, i) => (
                <div key={i} className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-brand-maroon uppercase tracking-wider block">{slot.audience}</span>
                    <h3 className="font-serif-editorial font-bold text-lg text-neutral-900">{slot.batch}</h3>
                    <p className="text-xs text-neutral-600 font-normal">{slot.focus}</p>
                  </div>
                  <div className="shrink-0">
                    <span className="inline-flex items-center gap-1.5 bg-brand-maroon text-white text-xs font-bold px-3.5 py-2 rounded-xl">
                      <Clock className="h-3.5 w-3.5" />
                      {slot.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Walkthrough Booking & Consultation */}
      <section id="visit-form" className="reveal py-16 sm:py-20 bg-white border-t border-brand-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block bg-brand-maroon text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-xs">
              EXPERIENCE THE CAMPUS
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon leading-tight">
              Book a Guided Campus Walkthrough & Demo Class
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed font-normal">
              Visit our Jaipur centre to inspect our smart classrooms, interact directly with senior subject heads, and take a free 45-minute baseline diagnostic evaluation.
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-brand-border bg-neutral-50">
                <MapPin className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-neutral-900 block">Jaipur Main Center</span>
                  <span className="text-xs text-neutral-600">{HODU.address}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-brand-border bg-neutral-50">
                <Phone className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-neutral-900 block">Admissions Desk Direct</span>
                  <span className="text-xs text-neutral-600">{HODU.phone}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-brand-border bg-neutral-50">
                <Calendar className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs text-neutral-900 block">Campus Visiting Hours</span>
                  <span className="text-xs text-neutral-600">Monday to Sunday · 8:00 AM to 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white border-2 border-brand-border rounded-3xl p-6 sm:p-9 shadow-lg">
              <h3 className="font-serif-editorial font-bold text-brand-maroon text-xl mb-1">Request Campus Tour Date</h3>
              <p className="text-xs text-neutral-500 mb-6 font-normal">Enter your details below to schedule your visit with our academic team.</p>
              <EnquiryForm />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
