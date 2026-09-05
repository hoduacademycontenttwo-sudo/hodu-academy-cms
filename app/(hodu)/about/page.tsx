import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import { Phone, ArrowRight, Target, Eye, Compass } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'About Us, Our Mission & Top Faculty — Hodu Academy',
  description: 'Learn about Hodu Academy, our mission and vision, founders from MNIT Jaipur & IIIT Hyderabad, and our top expert faculty.',
}

// Exact fallback data matching https://hoduacademy.com/mod/page/view.php?id=10
const fallbackFounders = [
  {
    name: 'Mr. VP singh',
    college: 'MNIT, JAIPUR',
    experience: '25+ years of teaching experience',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/VPSir.jpeg',
    is_founder: true,
  },
  {
    name: 'Mr. Rohit Jain',
    college: 'MNIT, JAIPUR',
    experience: '15+ years of teaching experience',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/rohit%20sir%20photo.png',
    is_founder: true,
  },
  {
    name: 'Mr. Abhishek Agarwal',
    college: 'IIIT - Hyderabad',
    experience: 'Palantir, Ex-Qualcomm',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/photos%20%282%29.png',
    is_founder: true,
  },
]

const fallbackFaculty = [
  {
    name: 'Mr. V.P. Singh',
    role: 'Senior Physics Educator',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/VPSir.jpeg',
    bio: 'With over 25 years of experience, Mr. V.P. Singh has mentored more than 10,000 students, guiding them to success in JEE, NEET, and board exams. A Civil Engineering graduate from MNIT Jaipur, he is renowned for his ability to simplify physics and inspire a genuine love for the subject. His outstanding leadership and unwavering dedication set the gold standard for teaching excellence.',
  },
  {
    name: 'Mr. Rohit Jain',
    role: 'Expert Physics Educator',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/rohit%20sir%20photo.png',
    bio: 'With over a decade of experience, Mr. Rohit Jain has mentored 6,000+ students, guiding them to top ranks in JEE, NEET, and international curriculums like IGCSE and IB. A B.Tech. graduate from MNIT Jaipur, his innovative teaching and leadership in education inspire excellence and holistic growth. He consistently nurtures problem-solving skills, setting a benchmark for young learners.',
  },
  {
    name: 'Ms. Shraddha Tiwari',
    role: 'Passionate English Educator',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/shraddha%20mam%20photo.png',
    bio: 'With extensive experience mentoring IGCSE, IB, and CBSE students, Miss Shraddha is a passionate English educator renowned for nurturing language proficiency and literary appreciation. Holding a postgraduate degree in English Literature, she employs innovative strategies to deliver engaging lessons. Her creative approach inspires students to excel in exams and master confident communication.',
  },
  {
    name: 'Mr. Abhishek Garg',
    role: 'Skilled Math Educator',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/abhishek%20sir%20photo.png',
    bio: 'Abhishek Garg is a skilled math educator with over six years of experience making math exciting and accessible. A Mechanical Engineering graduate from Jamia Millia Islamia University, he excels in teaching CBSE, IGCSE, IB, A Levels, AP exams, and more. Renowned for simplifying complex concepts, Abhishek’s innovative methods inspire students to love math and achieve academic excellence.',
  },
  {
    name: 'Ms. Mansi Baswal',
    role: 'Passionate Chemistry Expert',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/mansi%20mam%20photo.png',
    bio: 'With a Master’s degree in Organic Chemistry, Miss Mansi is a passionate educator experienced in CBSE, IGCSE, GCSE, and IB curricula. Known for simplifying complex topics through real-life examples, she inspires students to excel in chemistry. Her proven expertise, backed by clearing GATE and CSIR NET, exemplifies unwavering dedication to academic success, ensuring growth and future achievements.',
  },
  {
    name: 'Mr. Deepesh Chandwani',
    role: 'Dynamic Math Mentor',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/deepesh%20sir%20photo.png',
    bio: 'With over a decade of experience, Mr. Deepesh Chandwani is a dynamic math mentor renowned for simplifying complex concepts and inspiring confidence. A graduate of Rajasthan Technical University and Manipal University, he excels in IGCSE, IB, A Levels, and CBSE. His student-centered approach fosters effective learning, driving academic excellence and future-ready achievements.',
  },
]

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: dbRecords } = await supabase
    .from('cms_faculty')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .order('sort_order')

  const founders = (dbRecords && dbRecords.filter(r => r.is_founder).length > 0)
    ? dbRecords.filter(r => r.is_founder)
    : fallbackFounders

  const faculty = (dbRecords && dbRecords.filter(r => !r.is_founder).length > 0)
    ? dbRecords.filter(r => !r.is_founder)
    : fallbackFaculty

  return (
    <div className="bg-white min-h-screen">

      {/* ─── SECTION 0: ABOUT HODU & OUR MISSION / VISION ─── */}
      <section className="py-12 sm:py-16 bg-[#fcf8f7] border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main About Intro with Official Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 lg:mb-16">
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#921e1f]/10 text-[#921e1f] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>About Hodu Academy</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-editorial font-bold text-neutral-900 tracking-tight leading-tight">
                Nurturing Academic Excellence & Holistic Growth
              </h1>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed text-justify">
                At Hodu Academy we believe in nurturing every child’s potential by combining strong academic growth with holistic development. Our approach balances rigorous learning with engaging extracurriculars, ensuring children thrive intellectually and emotionally. We aim to create confident, well-rounded individuals ready for every challenge and opportunity ahead.
              </p>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-md border-2 border-[#921e1f]/20 bg-white">
                <img
                  src="https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/Main%20image%201.png"
                  alt="Hodu Academy Classroom & Learning"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision Dual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Our Mission */}
            <div className="bg-white border-2 border-[#921e1f] rounded-[10px] p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#921e1f]/10 text-[#921e1f] flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-serif-editorial font-bold text-[#921e1f]">
                    Our Mission
                  </h3>
                </div>
                <div className="w-12 h-0.5 bg-[#921e1f] mb-4 rounded-full" />
                <p className="text-xs sm:text-sm text-neutral-700 text-justify leading-relaxed">
                  Hodu Academy is dedicated to unlocking each student’s potential by providing top-tier academic instruction, fostering holistic personal growth, and offering enriching extracurricular opportunities. We create a nurturing and innovative environment where critical thinking, creativity, and resilience are cultivated, ensuring every learner can thrive and succeed.
                </p>
              </div>
            </div>

            {/* Our Vision */}
            <div className="bg-white border-2 border-[#921e1f] rounded-[10px] p-6 sm:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#921e1f]/10 text-[#921e1f] flex items-center justify-center shrink-0">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-serif-editorial font-bold text-[#921e1f]">
                    Our Vision
                  </h3>
                </div>
                <div className="w-12 h-0.5 bg-[#921e1f] mb-4 rounded-full" />
                <p className="text-xs sm:text-sm text-neutral-700 text-justify leading-relaxed">
                  To be the gold standard in modern education by delivering transformative learning experiences that empower students to excel in Cambridge, IB, CBSE, and competitive exams (JEE & NEET). We envision creating independent thinkers, compassionate leaders, and lifelong achievers equipped to excel globally.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 1: OUR FOUNDERS ─── */}
      <section className="py-12 sm:py-16 bg-white border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif-editorial font-bold text-neutral-900 tracking-tight">
              Our Founders
            </h2>
            <div className="w-16 h-1 bg-[#921e1f] mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {founders.map((founder, idx) => (
              <div
                key={founder.id || founder.name + idx}
                className="bg-white border-2 border-[#921e1f] rounded-[10px] p-6 text-center shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center"
              >
                {/* 200px circular photo matching hoduacademy.com */}
                <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden mx-auto bg-neutral-100 border border-neutral-200 shadow-2xs shrink-0 flex items-center justify-center">
                  {founder.photo_url ? (
                    <img
                      src={founder.photo_url}
                      alt={founder.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-[#921e1f]">
                      {founder.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#921e1f] mt-4">
                  {founder.name}
                </h3>
                
                <h5 className="text-sm font-bold text-neutral-800 mt-1 uppercase tracking-wide">
                  {founder.qualification || founder.college || 'MNIT, JAIPUR'}
                </h5>

                <h6 className="text-xs font-semibold text-neutral-600 mt-1">
                  {founder.experience || 'Educator & Director'}
                </h6>

                {founder.bio && (
                  <p className="text-xs text-neutral-600 text-justify leading-relaxed mt-4 pt-3 border-t border-neutral-100 w-full">
                    {founder.bio}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 2: OUR TOP FACULTY ─── */}
      <section id="faculty" className="py-12 sm:py-16 bg-[#f2dede]/30 border-b border-brand-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-serif-editorial font-bold text-neutral-900 tracking-tight">
              Our Top Faculty
            </h2>
            <div className="w-16 h-1 bg-[#921e1f] mx-auto mt-3 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {faculty.map((member, idx) => (
              <div
                key={member.id || member.name + idx}
                className="bg-white border-2 border-[#921e1f] rounded-b-[10px] rounded-t-[10px] p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="text-center">
                  {/* 200px circular photo */}
                  <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-full overflow-hidden mx-auto bg-neutral-100 border border-neutral-200 shadow-2xs shrink-0 flex items-center justify-center">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-[#921e1f]">
                        {member.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold text-[#921e1f] mt-4">
                    {member.name}
                  </h4>

                  <h6 className="text-xs font-semibold text-neutral-800 mt-1">
                    {member.role || member.subject || 'Expert Faculty'}
                  </h6>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <p className="text-xs sm:text-sm text-neutral-700 text-justify leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 3: FOR ANY ENQUIRY CALL BANNER ─── */}
      <section className="py-12 bg-[#7D0A0A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif-editorial font-bold text-white">
            For Any Enquiry Call{' '}
            <a href={`tel:${HODU.phone}`} className="underline decoration-white/40 hover:decoration-white transition-all">
              {HODU.phone}
            </a>
          </h3>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl mx-auto font-normal">
            Speak directly with our academic coordinators to discuss course admissions, batch schedules, and personalized mentorship.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#7D0A0A] hover:bg-neutral-100 font-bold px-7 py-3 rounded-full text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <span>Book Academic Consultation</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
