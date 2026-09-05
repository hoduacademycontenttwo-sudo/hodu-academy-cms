import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import { Phone, ArrowRight, Target, Eye, Compass, GraduationCap, Award, Sparkles, CheckCircle2, Users, Trophy, ShieldCheck, BookOpen } from 'lucide-react'
import Link from 'next/link'
import ElasticMesh from '@/components/ui/ElasticMesh'
import BannerElasticMesh from '@/components/ui/BannerElasticMesh'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'About Us, Our Founders & Expert Faculty — Hodu Academy',
  description: 'Meet our visionary founders from MNIT Jaipur & IIIT Hyderabad and our top master faculty at Hodu Academy.',
}

// Fallback data matching https://hoduacademy.com/mod/page/view.php?id=10
const fallbackFounders = [
  {
    name: 'Mr. VP singh',
    college: 'MNIT, JAIPUR',
    experience: '25+ Years Experience',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/VPSir.jpeg',
    is_founder: true,
    bio: 'With over 25 years of experience, Mr. V.P. Singh has mentored 10,000+ students for JEE, NEET, and Boards. A Civil Engineering graduate from MNIT Jaipur, he is renowned for simplifying physics.',
  },
  {
    name: 'Mr. Rohit Jain',
    college: 'MNIT, JAIPUR',
    experience: '15+ Years Experience',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/rohit%20sir%20photo.png',
    is_founder: true,
    bio: 'Mentored 6,000+ students for top ranks in JEE, NEET, IGCSE & IB. A B.Tech from MNIT Jaipur, his innovative teaching inspires analytical excellence and holistic problem-solving.',
  },
  {
    name: 'Mr. Abhishek Agarwal',
    college: 'IIIT - HYDERABAD',
    experience: 'Palantir, Ex-Qualcomm',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/photos%20%282%29.png',
    is_founder: true,
    bio: 'An alumnus of IIIT Hyderabad with industry leadership at Palantir & Qualcomm, Abhishek drives technological innovation, digital learning ecosystems, and scalable pedagogy at Hodu.',
  },
]

const fallbackFaculty = [
  {
    name: 'Mr. V.P. Singh',
    role: 'Senior Physics Educator',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/VPSir.jpeg',
    bio: 'With 25+ years of experience, mentored 10,000+ students for JEE, NEET, and Boards. MNIT Jaipur Civil Engineering alumnus renowned for setting the gold standard in physics coaching.',
  },
  {
    name: 'Mr. Rohit Jain',
    role: 'Expert Physics Educator',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/rohit%20sir%20photo.png',
    bio: 'With over a decade of mentorship, guided 6,000+ aspirants to top ranks in JEE, NEET, IGCSE and IB curricula. MNIT Jaipur graduate focused on deep conceptual clarity.',
  },
  {
    name: 'Ms. Shraddha Tiwari',
    role: 'Passionate English Educator',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/shraddha%20mam%20photo.png',
    bio: 'Postgraduate in English Literature with extensive experience across IGCSE, IB, and CBSE boards, nurturing exceptional linguistic proficiency and analytical literary appreciation.',
  },
  {
    name: 'Mr. Abhishek Garg',
    role: 'Skilled Math Educator',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/abhishek%20sir%20photo.png',
    bio: 'Mechanical Engineering graduate from Jamia Millia Islamia with 6+ years specializing in CBSE, IGCSE, IB, A Levels & AP exams, turning complex mathematics into an intuitive discipline.',
  },
  {
    name: 'Ms. Mansi Baswal',
    role: 'Passionate Chemistry Expert',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/mansi%20mam%20photo.png',
    bio: 'Master’s in Organic Chemistry, GATE & CSIR NET qualified. Mentors students across CBSE, IGCSE & IB using real-life examples to build rock-solid foundational concepts.',
  },
  {
    name: 'Mr. Deepesh Chandwani',
    role: 'Dynamic Math Mentor',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/deepesh%20sir%20photo.png',
    bio: 'Alumnus of RTU & Manipal University with 10+ years coaching IGCSE, IB, A Levels & CBSE. Known for student-centric problem-solving strategies and academic excellence.',
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

      {/* ─── 1. IMMERSIVE HERO BANNER ─── */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-[#2D0909] via-[#1F0404] to-[#120202] text-white overflow-hidden border-b border-brand-maroon/30">
        <BannerElasticMesh variant="dark" opacity={0.8} interaction="hover" />
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#bd9f67]/20 border border-[#bd9f67]/40 text-[#f1ddb6] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles size={14} className="text-[#bd9f67]" />
            <span>ABOUT HODU ACADEMY · LIGHTING MINDS WITH KNOWLEDGE</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Nurturing Academic Excellence & Holistic Growth
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-neutral-300 max-w-3xl mx-auto font-light leading-relaxed text-center">
            At Hodu Academy, we unlock every child’s highest potential by fusing deep conceptual rigor with personalized mentorship. Founded by alumni of MNIT Jaipur and IIIT Hyderabad, we prepare students to excel across Cambridge IGCSE, IB DP, CBSE, IIT-JEE, and NEET.
          </p>

          {/* Key Stats Glass Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl mx-auto pt-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-center shadow-lg transition-transform hover:-translate-y-1">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-2">
                <Users size={18} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">10,000+</div>
              <div className="text-xs text-amber-200/90 font-medium mt-0.5">Students Mentored</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-center shadow-lg transition-transform hover:-translate-y-1">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-2">
                <GraduationCap size={18} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">25+ Yrs</div>
              <div className="text-xs text-amber-200/90 font-medium mt-0.5">Teaching Legacy</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-center shadow-lg transition-transform hover:-translate-y-1">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-2">
                <Trophy size={18} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">Top 1%</div>
              <div className="text-xs text-amber-200/90 font-medium mt-0.5">JEE · NEET Ranks</div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-center shadow-lg transition-transform hover:-translate-y-1">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto mb-2">
                <Award size={18} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">1:12 Ratio</div>
              <div className="text-xs text-amber-200/90 font-medium mt-0.5">Intimate Batch Size</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. PEDAGOGY STORY & IMMERSIVE BANNER SHOWCASE ─── */}
      <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FAF4F4] via-[#FCF8F7] to-white border-b border-brand-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column Narrative */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#921e1f]/10 text-[#921e1f] text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>Our Teaching Methodology</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-editorial font-bold text-neutral-900 tracking-tight leading-tight">
                Empowering Thinkers, Leaders & Lifelong Achievers
              </h2>
              
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed text-justify">
                Education at Hodu Academy transcends standard textbook memorization. We foster deep analytical thinking, step-by-step problem dissection, and intellectual resilience. Our proven academic framework integrates structured daily lectures with personalized faculty attention.
              </p>

              {/* Feature Highlights with Clean Checkmarks */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-neutral-200/70 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-[#921e1f] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">Concept-First Pedagogy & Daily DPPs</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">Building foundational clarity from first principles before advancing to multi-step problem sets.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-neutral-200/70 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-[#921e1f] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">Daily 1-on-1 Faculty Doubt Desks</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">Private consultation booths where subject masters resolve every student question line-by-line.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-neutral-200/70 shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-[#921e1f] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">Cambridge & IB Marking Rubric Mastery</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">Decoded past 15-year question banks with examiner-standard command word scoring rubrics.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Immersive Visual Showcase Banner */}
            <div className="lg:col-span-6 flex justify-center items-center">
              <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-200/80 bg-neutral-900 group">
                {/* Real High-Resolution Academic Backdrop */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&h=750&fit=crop&auto=format"
                    alt="Students Collaborating at Hodu Academy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                  {/* Interactive ElasticMesh Shimmer */}
                  <div className="absolute inset-0 pointer-events-auto opacity-35 hover:opacity-60 transition-opacity duration-300 mix-blend-overlay">
                    <ElasticMesh
                      color1="#7D0A0A"
                      color2="#D4AF37"
                      highlight="#FFFFFF"
                      interaction="hover"
                      tilt={14}
                      shading={0.8}
                      wobble={0.4}
                      pull={0.35}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Floating Glassmorphic Badge Top Right */}
                  <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/60 shadow-lg text-xs font-bold text-[#921e1f] flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    <span>1:12 Small Batches</span>
                  </div>

                  {/* Floating Glassmorphic Badge Bottom Left */}
                  <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/60 shadow-lg flex items-center gap-3 max-w-[260px]">
                    <div className="w-9 h-9 rounded-xl bg-[#921e1f] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-neutral-900 leading-tight">MNIT & IIIT Founded</div>
                      <div className="text-[10px] text-neutral-600 font-medium">Top Faculty Mentorship</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── 3. DUAL ELEVATED CARDS: MISSION & VISION ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-14">
            {/* Our Mission */}
            <div className="bg-white border-2 border-[#921e1f]/20 hover:border-[#921e1f] rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#921e1f]/5 rounded-full blur-2xl pointer-events-none group-hover:bg-[#921e1f]/10 transition-colors" />
              
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#921e1f] to-[#651416] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#921e1f]">Core Purpose</span>
                    <h3 className="text-2xl font-serif-editorial font-bold text-neutral-900">
                      Our Mission
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 text-justify leading-relaxed">
                  To unlock each student’s potential by providing top-tier academic instruction, fostering holistic growth, and offering enriching extracurricular opportunities. We create a nurturing and innovative environment where critical thinking, creativity, and resilience empower learners to thrive.
                </p>

                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-neutral-100 text-center">
                  <div className="bg-[#FAF4F4] rounded-lg p-2 text-[11px] font-bold text-[#921e1f]">Rigor & Depth</div>
                  <div className="bg-[#FAF4F4] rounded-lg p-2 text-[11px] font-bold text-[#921e1f]">Critical Thinking</div>
                  <div className="bg-[#FAF4F4] rounded-lg p-2 text-[11px] font-bold text-[#921e1f]">Holistic Growth</div>
                </div>
              </div>
            </div>

            {/* Our Vision */}
            <div className="bg-white border-2 border-[#bd9f67]/30 hover:border-[#bd9f67] rounded-3xl p-7 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
              
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8a6828] to-[#5a3e0c] text-amber-200 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">Future Horizon</span>
                    <h3 className="text-2xl font-serif-editorial font-bold text-neutral-900">
                      Our Vision
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 text-justify leading-relaxed">
                  To be the gold standard in education by delivering transformative learning experiences that empower students across Cambridge, IB, CBSE, and competitive exams (JEE/NEET). We envision creating independent thinkers and compassionate leaders equipped to excel globally.
                </p>

                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-neutral-100 text-center">
                  <div className="bg-[#FFFDF0] rounded-lg p-2 text-[11px] font-bold text-[#8a6828]">Gold Standard</div>
                  <div className="bg-[#FFFDF0] rounded-lg p-2 text-[11px] font-bold text-[#8a6828]">Global Benchmark</div>
                  <div className="bg-[#FFFDF0] rounded-lg p-2 text-[11px] font-bold text-[#8a6828]">Future Leaders</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 1: OUR FOUNDERS ─── */}
      <section className="py-12 sm:py-16 bg-white border-b border-brand-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#921e1f]/10 text-[#921e1f] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Leadership</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-neutral-900 tracking-tight">
              Our Founders
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md mx-auto font-normal">
              Visionary educators and technologists shaping academic excellence
            </p>
            <div className="w-12 h-1 bg-[#921e1f] mx-auto mt-3 rounded-full" />
          </div>

          {/* Compact, short width & length cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">
            {founders.map((founder, idx) => (
              <div
                key={founder.id || founder.name + idx}
                className="bg-white rounded-2xl border border-neutral-200 hover:border-[#921e1f]/60 p-5 sm:p-6 text-center shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-between group hover:-translate-y-1"
              >
                <div className="flex flex-col items-center w-full">
                  {/* Proportional, compact circular avatar */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto bg-neutral-100 ring-4 ring-[#921e1f]/15 group-hover:ring-[#921e1f]/35 p-0.5 shadow-xs shrink-0 flex items-center justify-center transition-all">
                    {founder.photo_url ? (
                      <img
                        src={founder.photo_url}
                        alt={founder.name}
                        className="w-full h-full object-cover object-top rounded-full"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-[#921e1f]">
                        {founder.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-[#921e1f] transition-colors mt-3.5">
                    {founder.name}
                  </h3>
                  
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#921e1f]/10 text-[#921e1f] text-[11px] font-bold uppercase tracking-wider mt-1.5">
                    {founder.qualification || founder.college || 'MNIT, JAIPUR'}
                  </span>

                  <span className="text-[11px] font-medium text-neutral-500 mt-1">
                    {founder.experience || 'Educator & Director'}
                  </span>
                </div>

                {founder.bio && (
                  <p className="text-xs text-neutral-600 text-justify leading-relaxed mt-3.5 pt-3 border-t border-neutral-100 w-full">
                    {founder.bio}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 2: OUR TOP FACULTY ─── */}
      <section id="faculty" className="py-12 sm:py-16 bg-[#fcf8f7] border-b border-brand-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#921e1f]/10 text-[#921e1f] text-[11px] font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Academic Masters</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-neutral-900 tracking-tight">
              Our Top Faculty
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md mx-auto font-normal">
              Experienced mentors dedicated to personal growth & top exam ranks
            </p>
            <div className="w-12 h-1 bg-[#921e1f] mx-auto mt-3 rounded-full" />
          </div>

          {/* Compact 3-column grid with refined height & width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {faculty.map((member, idx) => (
              <div
                key={member.id || member.name + idx}
                className="bg-white rounded-2xl border border-neutral-200 hover:border-[#921e1f]/60 p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="text-center flex flex-col items-center">
                  {/* Proportional circular avatar */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mx-auto bg-neutral-100 ring-4 ring-[#921e1f]/15 group-hover:ring-[#921e1f]/35 p-0.5 shadow-xs shrink-0 flex items-center justify-center transition-all">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover object-top rounded-full"
                      />
                    ) : (
                      <span className="text-xl font-bold text-[#921e1f]">
                        {member.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-[#921e1f] transition-colors mt-3">
                    {member.name}
                  </h4>

                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#921e1f]/10 text-[#921e1f] text-[11px] font-semibold mt-1.5">
                    {member.role || member.subject || 'Expert Faculty'}
                  </span>
                </div>

                <div className="mt-3.5 pt-3 border-t border-neutral-100">
                  <p className="text-xs text-neutral-600 text-justify leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 3: FOR ANY ENQUIRY CALL BANNER ─── */}
      <section className="relative overflow-hidden py-14 text-white">
        <BannerElasticMesh variant="crimson" opacity={1} interaction="hover" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-serif-editorial font-bold text-white">
            For Any Enquiry Call{' '}
            <a href={`tel:${HODU.phone}`} className="underline decoration-white/40 hover:decoration-white transition-all">
              {HODU.phone}
            </a>
          </h3>
          <p className="text-xs sm:text-sm text-white/90 max-w-lg mx-auto font-normal">
            Speak directly with our academic coordinators to discuss course admissions, batch schedules, and personalized mentorship.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-[#7D0A0A] hover:bg-neutral-100 font-bold px-7 py-3 rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
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
