import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'
import Link from 'next/link'
import { GraduationCap, Award, Target, Users, BookOpen, CheckCircle2, Phone, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import ScrollReveal from '@/components/hodu/ScrollReveal'
import AboutFacultyDirectory from '@/components/hodu/AboutFacultyDirectory'

export const metadata = {
  title: 'About Us — Hodu Academy | Founders, Pedagogy & Faculty Mentors',
  description: 'Learn about Hodu Academy\'s heritage, pedagogical philosophy, founders from MNIT & IIIT, and certified international & national board faculty.',
}

const pillars = [
  {
    icon: Target,
    title: 'Concept-First Mastery',
    text: 'We firmly reject rote memorization. Our mentors dissect fundamental principles using real-world analogies, step-by-step mathematical proofs, and active questioning.',
    tag: 'Cognitive Rigor'
  },
  {
    icon: Award,
    title: 'Diagnostic Analytics',
    text: 'Every mock test generates granular topic-by-topic analytics, pinpointing conceptual weaknesses and time-management leaks before board & entrance exams.',
    tag: 'Data-Driven'
  },
  {
    icon: Users,
    title: 'Transparent Mentorship',
    text: 'Weekly attendance and evaluation metrics delivered directly to parents. Regular 1-on-1 parent-teacher strategy conferences to ensure synchronized progress.',
    tag: 'Parent Partnership'
  },
]

const milestones = [
  { year: '2018', title: 'Foundation in Jaipur', event: 'Hodu Academy established with an initial cohort of 20 Cambridge IGCSE & CBSE students.' },
  { year: '2020', title: 'IB & Olympiad Track', event: 'Expanded into International Baccalaureate (IB DP) and Junior Olympiad talent programs.' },
  { year: '2022', title: 'Integrated Testing Labs', event: 'Launched state-of-the-art Computer-Based Testing (CBT) lab and daily 1-on-1 doubt desks.' },
  { year: '2026', title: '15,000+ Students Mentored', event: 'Achieved 99.4% top board score and consistent All-India rankings in JEE & NEET.' },
]

// Fallback Founders if DB is loading
const fallbackFounders = [
  {
    name: 'Mr. V.P. Singh',
    role: 'Co-Founder & Director',
    subject: 'Physics & Academic Direction',
    qualification: 'MNIT, Jaipur',
    experience: '25+ Years Experience',
    bio: 'With over 25 years of experience, Mr. V.P. Singh has mentored more than 10,000 students, guiding them to success in JEE, NEET, and board exams. A Civil Engineering graduate from MNIT Jaipur, he is renowned for his ability to simplify physics and inspire a genuine love for the subject. His outstanding leadership and unwavering dedication set the gold standard for teaching excellence.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/VPSir.jpeg',
    is_founder: true,
  },
  {
    name: 'Mr. Rohit Jain',
    role: 'Co-Founder & Director',
    subject: 'Physics & Curriculum Innovation',
    qualification: 'MNIT, Jaipur',
    experience: '15+ Years Experience',
    bio: 'With over a decade of experience, Mr. Rohit Jain has mentored 6,000+ students, guiding them to top ranks in JEE, NEET, and international curriculums like IGCSE and IB. A B.Tech. graduate from MNIT Jaipur, his innovative teaching and leadership in education inspire excellence and holistic growth. He consistently nurtures problem-solving skills, setting a benchmark for young learners.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/rohit%20sir%20photo.png',
    is_founder: true,
  },
  {
    name: 'Mr. Abhishek Agarwal',
    role: 'Co-Founder & Technology Lead',
    subject: 'Digital Learning & EdTech Innovation',
    qualification: 'IIIT - Hyderabad',
    experience: 'Palantir, Ex-Qualcomm',
    bio: 'An alumnus of IIIT Hyderabad with industry leadership at Palantir and Qualcomm, Abhishek leads technology innovation, digital classroom architectures, and global student learning ecosystems at Hodu Academy, empowering learners across India and abroad.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/photos%20%282%29.png',
    is_founder: true,
  },
]

// Fallback Faculty if DB is loading
const fallbackFaculty = [
  {
    name: 'Mr. V.P. Singh',
    role: 'Senior Physics Educator',
    subject: 'Physics',
    qualification: 'MNIT, Jaipur',
    experience: '25+ Years Experience (10,000+ Students)',
    bio: 'With over 25 years of experience, Mr. V.P. Singh has mentored more than 10,000 students, guiding them to success in JEE, NEET, and board exams. A Civil Engineering graduate from MNIT Jaipur, he is renowned for his ability to simplify physics and inspire a genuine love for the subject.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/VPSir.jpeg',
  },
  {
    name: 'Mr. Rohit Jain',
    role: 'Expert Physics Educator',
    subject: 'Physics',
    qualification: 'MNIT, Jaipur',
    experience: '15+ Years Experience (6,000+ Students)',
    bio: 'With over a decade of experience, Mr. Rohit Jain has mentored 6,000+ students, guiding them to top ranks in JEE, NEET, and international curriculums like IGCSE and IB. A B.Tech. graduate from MNIT Jaipur, his innovative teaching and leadership in education inspire excellence and holistic growth.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/rohit%20sir%20photo.png',
  },
  {
    name: 'Ms. Shraddha Tiwari',
    role: 'Passionate English Educator',
    subject: 'English & International Boards',
    qualification: 'Postgraduate in English Literature',
    experience: '8+ Years Experience (IGCSE, IB & CBSE)',
    bio: 'With extensive experience mentoring IGCSE, IB, and CBSE students, Miss Shraddha is a passionate English educator renowned for nurturing language proficiency and literary appreciation. Holding a postgraduate degree in English Literature, she employs innovative strategies to deliver engaging lessons.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/shraddha%20mam%20photo.png',
  },
  {
    name: 'Mr. Abhishek Garg',
    role: 'Skilled Math Educator',
    subject: 'Mathematics',
    qualification: 'B.Tech Mechanical (Jamia Millia Islamia)',
    experience: '6+ Years Experience (CBSE, IGCSE, IB, AP)',
    bio: 'Abhishek Garg is a skilled math educator with over six years of experience making math exciting and accessible. A Mechanical Engineering graduate from Jamia Millia Islamia University, he excels in teaching CBSE, IGCSE, IB, A Levels, AP exams, and more.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/abhishek%20sir%20photo.png',
  },
  {
    name: 'Ms. Mansi Baswal',
    role: 'Passionate Chemistry Expert',
    subject: 'Chemistry',
    qualification: "Master's Organic Chem | GATE & CSIR NET",
    experience: '5+ Years Experience (CBSE, IGCSE, GCSE & IB)',
    bio: 'With a Master’s degree in Organic Chemistry, Miss Mansi is a passionate educator experienced in CBSE, IGCSE, GCSE, and IB curricula. Known for simplifying complex topics through real-life examples, she inspires students to excel in chemistry.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/mansi%20mam%20photo.png',
  },
  {
    name: 'Mr. Deepesh Chandwani',
    role: 'Dynamic Math Mentor',
    subject: 'Mathematics',
    qualification: 'RTU & Manipal University Graduate',
    experience: '10+ Years Experience (IGCSE, IB, A Levels, CBSE)',
    bio: 'With over a decade of experience, Mr. Deepesh Chandwani is a dynamic math mentor renowned for simplifying complex concepts and inspiring confidence. A graduate of Rajasthan Technical University and Manipal University, he excels in IGCSE, IB, A Levels, and CBSE.',
    photo_url: 'https://hoduacademy.com/pluginfile.php/1/local_mb2builder/images/deepesh%20sir%20photo.png',
  }
]

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: dbRecords } = await supabase
    .from('cms_faculty')
    .select('*')
    .eq('site_id', HODU_SITE_ID)
    .order('sort_order')

  const foundersList = (dbRecords && dbRecords.filter(r => r.is_founder).length > 0)
    ? dbRecords.filter(r => r.is_founder)
    : fallbackFounders

  const facultyList = (dbRecords && dbRecords.filter(r => !r.is_founder).length > 0)
    ? dbRecords.filter(r => !r.is_founder)
    : fallbackFaculty

  return (
    <div className="space-y-0 animate-fade-in bg-white">

      {/* Hero */}
      <section className="relative py-16 sm:py-24 bg-white border-b border-brand-border">
        <ScrollReveal animation="fade-up">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <span className="inline-flex items-center gap-1.5 bg-brand-maroon text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs">
              <GraduationCap className="h-3.5 w-3.5" />
              OUR HERITAGE & PEDAGOGICAL PHILOSOPHY
            </span>
            <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-maroon leading-tight">
              Nurturing Exceptional Minds Through <span className="underline decoration-brand-maroon/30 underline-offset-8">Academic Rigor</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-700 max-w-3xl mx-auto font-normal leading-relaxed">
              Founded by premier university educators, Hodu Academy bridges rigorous conceptual coaching with intimate 1:12 batches, ensuring students in Jaipur and worldwide achieve their absolute best in school boards, competitive tests, and international diplomas.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <ScrollReveal animation="fade-right" className="h-full">
            <div className="bg-white border-2 border-brand-border rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col justify-between h-full">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest bg-brand-maroon text-white px-3 py-1 rounded-md inline-block">
                  OUR MISSION
                </span>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-neutral-900">
                  Empowering Students to Excel Without Fear
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                  To replace passive rote memorization with deep conceptual clarity, structured past-paper analysis, and continuous 1-on-1 mentorship. We instill critical reasoning, exam resilience, and unwavering academic confidence.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-brand-border flex items-center gap-2 text-xs font-bold text-brand-maroon">
                <CheckCircle2 className="h-4 w-4 text-brand-maroon" />
                <span>100% Syllabus Mastery Framework</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={80} className="h-full">
            <div className="bg-brand-maroon text-white rounded-3xl p-8 sm:p-10 shadow-md flex flex-col justify-between relative overflow-hidden h-full">
              <div className="space-y-4 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest bg-white text-brand-maroon px-3 py-1 rounded-md inline-block shadow-xs">
                  OUR VISION
                </span>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-white">
                  India’s Benchmark for Academic Mentorship
                </h2>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                  To be recognised across Rajasthan and globally as the gold standard in student-first coaching — where intellectual curiosity meets disciplined execution and extraordinary results follow naturally.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-white/20 flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="h-4 w-4" />
                <span>Trusted by 15,000+ Families Since 2018</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Pedagogical Pillars */}
      <section className="py-16 sm:py-20 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-black uppercase tracking-widest text-brand-maroon bg-brand-maroon/10 px-4 py-1.5 rounded-full inline-block mb-3 border border-brand-maroon/20">
                CORE PILLARS
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon">
                The Three Tenets of Hodu Mentorship
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((p, idx) => {
              const IconComp = p.icon
              return (
                <ScrollReveal key={idx} animation="fade-up" delay={idx * 90} className="h-full">
                  <div className="bg-white border-2 border-brand-border rounded-2xl p-8 shadow-xs hover:border-brand-maroon transition-all h-full">
                    <div className="w-12 h-12 rounded-xl bg-brand-maroon text-white flex items-center justify-center mb-6 shadow-sm">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-maroon bg-neutral-100 px-2.5 py-0.5 rounded-md inline-block mb-3 border border-brand-border">
                      {p.tag}
                    </span>
                    <h3 className="font-serif-editorial font-bold text-xl text-neutral-900 mb-3">{p.title}</h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">{p.text}</p>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Founders & Leadership Section */}
      <section className="py-16 sm:py-24 bg-neutral-50/60 border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-brand-maroon bg-brand-maroon/10 px-4 py-1.5 rounded-full inline-block mb-3 border border-brand-maroon/20">
                OUR LEADERSHIP & FOUNDERS
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon">
                Meet the Visionaries Behind Hodu
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-3 font-normal max-w-2xl mx-auto">
                Distinguished educators and technologists from MNIT Jaipur & IIIT Hyderabad shaping the future of global academic mentorship.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {foundersList.map((f, idx) => (
              <ScrollReveal key={idx} animation="fade-up" delay={idx * 100} className="h-full">
                <div className="bg-white border-2 border-brand-border rounded-3xl p-8 shadow-xs hover:border-brand-maroon hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full group">
                  <div className="space-y-5">
                    {/* Founder Photo */}
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden bg-brand-blush border-2 border-brand-border/80 mx-auto group-hover:scale-105 transition-transform duration-300 shadow-xs">
                      {f.photo_url ? (
                        <img
                          src={f.photo_url}
                          alt={f.name}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-brand-maroon bg-brand-maroon/10">
                          {f.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="text-center space-y-1">
                      {f.qualification && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-maroon bg-brand-maroon/10 px-3 py-1 rounded-full inline-block border border-brand-maroon/20">
                          {f.qualification}
                        </span>
                      )}
                      <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-neutral-900 pt-1">
                        {f.name}
                      </h3>
                      <p className="text-xs font-bold text-brand-maroon">
                        {f.role}
                      </p>
                      {f.experience && (
                        <p className="text-[11px] font-semibold text-neutral-500">
                          {f.experience}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed font-normal pt-3 border-t border-brand-border/60 text-left">
                      {f.bio}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-neutral-100 flex items-center justify-center text-xs font-bold text-brand-maroon gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Executive Leadership</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Faculty & Mentors Section */}
      <section id="faculty" className="py-16 sm:py-24 bg-white border-b border-brand-border scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-black uppercase tracking-widest text-brand-maroon bg-brand-maroon/10 px-4 py-1.5 rounded-full inline-block mb-3 border border-brand-maroon/20">
                OUR EXPERT FACULTY & MENTORS
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon">
                World-Class Educators Committed to Your Mastery
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-3 font-normal max-w-2xl mx-auto">
                Subject masters with proven track records in CBSE, ICSE, Cambridge IGCSE, IB DP, JEE, NEET, and Olympiads.
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive Faculty Directory with Category Filters */}
          <AboutFacultyDirectory facultyList={facultyList} />
        </div>
      </section>

      {/* Milestone Timeline */}
      <section className="py-16 sm:py-20 bg-brand-maroon text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-14">
              <span className="text-xs font-black uppercase tracking-widest text-brand-maroon bg-white px-4 py-1.5 rounded-full inline-block mb-3 shadow-xs">
                GROWTH & LEGACY
              </span>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-white">Milestones of Excellence</h2>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m, idx) => (
              <ScrollReveal key={idx} animation="zoom-in" delay={idx * 80} className="h-full">
                <div className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all h-full">
                  <span className="text-3xl font-black text-white block mb-2 font-display-modern">{m.year}</span>
                  <h3 className="font-bold text-base text-white mb-2">{m.title}</h3>
                  <p className="text-xs text-white/80 leading-relaxed font-light">{m.event}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-white border-t border-brand-border text-center">
        <ScrollReveal animation="fade-up">
          <div className="max-w-3xl mx-auto px-4 space-y-6">
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon">
              Experience the Hodu Advantage First-Hand
            </h2>
            <p className="text-sm text-neutral-600 font-normal leading-relaxed">
              Schedule a personalized academic consultation and campus tour at our Jaipur center.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link href="/contact"
                className="w-full sm:w-auto bg-brand-maroon hover:bg-brand-crimson text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2">
                <span>Book Consultation</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={`tel:${HODU.phone}`}
                className="w-full sm:w-auto bg-white hover:bg-neutral-50 text-brand-maroon border-2 border-brand-maroon font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                <Phone className="h-4 w-4 text-brand-maroon" />
                <span>Call: {HODU.phone}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  )
}
