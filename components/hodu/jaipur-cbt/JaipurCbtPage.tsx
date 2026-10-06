import Image from 'next/image'
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  ChevronDown,
  Laptop,
  MapPin,
  MessageCircle,
  NotebookPen,
  Phone,
  Target,
  Trophy,
} from 'lucide-react'
import ScrollReveal from '@/components/hodu/ScrollReveal'
import CbtRegistrationForm from './CbtRegistrationForm'
import CbtSimulator from './CbtSimulator'

const FACTS = [
  { icon: CalendarDays, label: 'Every Saturday morning' },
  { icon: Target, label: '15 Oct – 15 Jan' },
  { icon: Building2, label: 'At Hodu or from home' },
]

const SCREEN_SHIFTS = [
  {
    trap: 'You can’t scribble on the question.',
    fix: 'We drill a rough-sheet routine: copy only the numbers, solve on paper, come back to the screen once.',
  },
  {
    trap: 'Clicking an option isn’t saving it.',
    fix: 'Save & Next, Mark for Review and the palette colours become reflex, not something you read on exam day.',
  },
  {
    trap: 'The clock never leaves your eye-line.',
    fix: 'Each paper comes with section pace targets, so the timer turns into a guide instead of a threat.',
  },
  {
    trap: 'You scroll, you don’t flip.',
    fix: 'You learn to triage on a screen: attempt, mark, move on, and return with time to spare.',
  },
]

const VERBS = [
  {
    verb: 'Practice',
    icon: Laptop,
    body: 'A full paper on the same kind of interface you’ll face at the exam centre, under a strict clock.',
  },
  {
    verb: 'Compete',
    icon: Trophy,
    body: 'One rank list for everyone who sat that Saturday’s paper, at our lab or from home, across Jaipur.',
  },
  {
    verb: 'Analyse',
    icon: BarChart3,
    body: 'Chapter-wise accuracy, time spent per question, and worked solutions for every question you missed.',
  },
  {
    verb: 'Improve',
    icon: NotebookPen,
    body: 'Your scores, rank and weak chapters tracked across the season, so you can see the trend, not just one test.',
  },
]

const PHASES = [
  { n: '01', title: 'Part syllabus', body: 'Short, chapter-level papers. Get the interface out of the way while topics are fresh.' },
  { n: '02', title: 'Major syllabus', body: 'Bigger chunks of the syllabus, mixed together. Tests recall across chapters.' },
  { n: '03', title: 'Full syllabus', body: 'Full-length papers in the real pattern, duration and marking scheme.' },
  { n: '04', title: 'Final readiness', body: 'Exam-day rehearsals. Same start time, same rules, no surprises left.' },
]

const FAQS = [
  {
    q: 'Is it really free?',
    a: 'Yes. There is no registration fee and no test fee, whether you sit the papers at Hodu Academy or from home.',
  },
  {
    q: 'Do I need to be a Hodu student?',
    a: 'No. Any Class XI, Class XII or dropper student preparing for JEE Main, NEET UG, BITSAT or CUET can take part.',
  },
  {
    q: 'When exactly are the tests?',
    a: 'Every Saturday morning from 15 October to 15 January. Your slot time, roll number and login are sent on WhatsApp after you register.',
  },
  {
    q: 'NEET is a pen-and-paper exam. Why practise on a computer?',
    a: 'JEE Main, BITSAT and CUET are already computer-based. For NEET aspirants the core skills carry over either way: pacing, triage and learning from every mistake. And if NEET moves to CBT, you’ll have done it many times before.',
  },
  {
    q: 'What do I need to take it from home?',
    a: 'A laptop or desktop and a steady internet connection. A bigger screen keeps it closest to the exam hall.',
  },
  {
    q: 'How many seats are there at the Hodu lab?',
    a: 'Offline seats at our Vaishali Estate centre are limited and allotted in order of registration. If they fill up, you can still take the same paper from home.',
  },
]

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`text-[12px] font-bold uppercase tracking-[0.18em] ${dark ? 'text-amber-300' : 'text-brand-maroon'}`}>
      {children}
    </p>
  )
}

export default function JaipurCbtPage() {
  return (
    <div className="bg-white text-brand-text antialiased">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-brand-text text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-brand-maroon/40 blur-[140px]" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="lg:col-span-7 lg:pt-6">
            <ScrollReveal animation="fade-up">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[13px] text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden />
                Hodu Academy presents · Season 2026–27
              </p>
              <h1 className="mt-6 font-display text-[40px] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-[76px]">
                Don’t let exam day be your <span className="text-amber-300">first&nbsp;CBT.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/75 sm:text-lg">
                The Jaipur CBT Challenge is a free Saturday test series for JEE Main, NEET, BITSAT and CUET aspirants. Real
                on-screen papers, a real clock, and a rank against students across Jaipur.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={80}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {FACTS.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 py-2 text-sm font-semibold"
                  >
                    <Icon size={15} className="text-amber-300" aria-hidden /> {label}
                  </li>
                ))}
                <li className="inline-flex items-center rounded-xl bg-emerald-500/15 px-3.5 py-2 text-sm font-bold text-emerald-300">
                  Free
                </li>
              </ul>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={140}>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
                <a href="#demo" className="inline-flex min-h-11 items-center gap-2 font-semibold text-white hover:text-amber-300">
                  Try a 3-minute demo first <ArrowRight size={15} aria-hidden />
                </a>
                <a href="tel:+919257879555" className="inline-flex min-h-11 items-center gap-2 hover:text-white">
                  <Phone size={15} aria-hidden /> 92578 79555
                </a>
              </div>
            </ScrollReveal>
          </div>

          <div id="register" className="scroll-mt-24 lg:col-span-5">
            <ScrollReveal animation="fade-up" delay={60}>
              <div className="overflow-hidden rounded-3xl bg-white text-brand-text shadow-2xl shadow-black/40">
                <div className="border-b border-brand-border-subtle px-6 pb-4 pt-6 sm:px-7">
                  <h2 className="font-display text-2xl font-bold">Save your seat</h2>
                  <p className="mt-1 text-sm text-brand-muted">Takes under a minute. Everything else comes on WhatsApp.</p>
                </div>
                <CbtRegistrationForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── DEMO ── */}
      <section id="demo" className="scroll-mt-20 bg-brand-bg py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Don’t take our word for it</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                Feel the difference in three minutes.
              </h2>
              <p className="mt-4 text-[17px] leading-relaxed text-brand-muted">
                Most students know the syllabus. Fewer know what it’s like to answer it on a screen with a timer running.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={80}>
            <div className="mt-10">
              <CbtSimulator />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── WHAT CHANGES ON A SCREEN ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <ScrollReveal animation="fade-up">
              <div className="lg:sticky lg:top-28">
                <Eyebrow>Why CBT practice matters</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-[44px]">
                  Same syllabus.
                  <br />
                  Different exam.
                </h2>
                <p className="mt-5 max-w-md text-[17px] leading-relaxed text-brand-muted">
                  A computer-based test asks for habits that paper never trained. Marks slip away not because you didn’t know the
                  answer, but because of how the screen works. Here’s what we fix, one Saturday at a time.
                </p>
              </div>
            </ScrollReveal>
          </div>
          <ol className="lg:col-span-7 divide-y divide-brand-border border-y border-brand-border">
            {SCREEN_SHIFTS.map((s, i) => (
              <li key={s.trap}>
                <ScrollReveal animation="fade-up" delay={i * 40}>
                  <div className="grid gap-3 py-7 sm:grid-cols-[64px_1fr]">
                    <span className="font-mono text-sm font-bold text-brand-maroon">0{i + 1}</span>
                    <div>
                      <h3 className="font-display text-xl font-bold sm:text-2xl">{s.trap}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-brand-muted sm:text-base">{s.fix}</p>
                    </div>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── PRACTICE · COMPETE · ANALYSE · IMPROVE ── */}
      <section className="bg-brand-bg py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="max-w-2xl">
              <Eyebrow>Every Saturday</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                Practice. Compete. Analyse. <span className="text-brand-maroon">Improve.</span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VERBS.map(({ verb, icon: Icon, body }, i) => (
              <ScrollReveal key={verb} animation="fade-up" delay={i * 60}>
                <div className="flex h-full flex-col rounded-2xl border border-brand-border bg-white p-6 transition-shadow hover:shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blush text-brand-maroon">
                      <Icon size={20} aria-hidden />
                    </span>
                    <span className="font-mono text-sm text-brand-muted">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-bold">{verb}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-brand-muted">{body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEASON TIMELINE ── */}
      <section className="bg-brand-text py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <Eyebrow dark>The season</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
                  Thirteen weeks from chapter tests to exam day.
                </h2>
              </div>
              <p className="max-w-sm text-[15px] leading-relaxed text-white/65">
                Saturday mornings, 15 October to 15 January. Each phase is harder and longer than the one before.
              </p>
            </div>
          </ScrollReveal>

          <ol className="relative mt-14 grid gap-8 lg:grid-cols-4 lg:gap-6">
            <div aria-hidden className="absolute left-0 right-0 top-[11px] hidden h-px bg-gradient-to-r from-white/10 via-amber-300/60 to-white/10 lg:block" />
            {PHASES.map((p, i) => (
              <li key={p.n} className="relative">
                <ScrollReveal animation="fade-up" delay={i * 70}>
                  <span
                    aria-hidden
                    className={`relative z-10 block h-[23px] w-[23px] rounded-full border-4 border-brand-text ${
                      i === PHASES.length - 1 ? 'bg-amber-300' : 'bg-white/80'
                    }`}
                  />
                  <p className="mt-5 font-mono text-sm text-amber-300">Phase {p.n}</p>
                  <h3 className="mt-1 font-display text-2xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65">{p.body}</p>
                </ScrollReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── TWO WAYS ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="max-w-2xl">
              <Eyebrow>Take it your way</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">Same paper. Same clock. Same rank list.</h2>
            </div>
          </ScrollReveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <ScrollReveal animation="fade-up">
              <div className="relative h-full overflow-hidden rounded-3xl bg-brand-wine p-7 text-white sm:p-9">
                <div aria-hidden className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-maroon/60 blur-3xl" />
                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[13px] font-semibold">
                    <Building2 size={14} aria-hidden /> At Hodu Academy
                  </span>
                  <h3 className="mt-5 font-display text-3xl font-bold">The exam-hall rehearsal.</h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/75">
                    A seat in our computer lab, a fixed start time and an invigilator in the room. The closest you can get to
                    the real centre before the real centre.
                  </p>
                  <p className="mt-6 flex items-start gap-2 text-sm text-white/80">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-amber-300" aria-hidden />
                    C-28, Vaishali Estate, Gandhi Path West, Jaipur
                  </p>
                  <p className="mt-2 text-[13px] font-semibold text-amber-300">Limited seats, allotted in order of registration.</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={80}>
              <div className="h-full rounded-3xl border border-brand-border bg-brand-bg p-7 sm:p-9">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[13px] font-semibold text-brand-text ring-1 ring-brand-border">
                  <Laptop size={14} aria-hidden /> From home
                </span>
                <h3 className="mt-5 font-display text-3xl font-bold">The same test, at your desk.</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-brand-muted">
                  Log in from a laptop or desktop at the scheduled time. You get the same paper, the same timer and a place on the
                  same Jaipur rank list.
                </p>
                <p className="mt-6 text-sm text-brand-muted">Good for students across the city, or when the lab is full.</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── WHO'S BEHIND IT ── */}
      <section className="bg-brand-bg py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <ScrollReveal animation="fade-up">
              <Eyebrow>Who’s behind it</Eyebrow>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-[44px] sm:leading-tight">
                Built by teachers who’ve sat where you’re sitting.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-brand-muted">
                Hodu Academy was founded by MNIT Jaipur alumni who have taught JEE and NEET for decades, together with an IIIT
                Hyderabad engineer who leads our technology. The same team runs the Jaipur CBT Challenge.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-brand-border pt-6">
                {[
                  { k: '25+ yrs', v: 'Mr. V.P. Singh, Physics' },
                  { k: '15+ yrs', v: 'Mr. Rohit Jain, co-founder' },
                  { k: '16,000+', v: 'students mentored by our founders' },
                ].map((s) => (
                  <div key={s.k}>
                    <dt className="font-display text-2xl font-extrabold text-brand-maroon sm:text-3xl">{s.k}</dt>
                    <dd className="mt-1 text-[13px] leading-snug text-brand-muted">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </ScrollReveal>
          </div>
          <div className="lg:col-span-7">
            <ScrollReveal animation="fade-up" delay={80}>
              <figure className="overflow-hidden rounded-3xl border border-brand-border bg-white shadow-sm">
                <div className="relative aspect-[16/9] sm:aspect-[2/1]">
                  <Image
                    src="/images/jaipur_center_bg.png"
                    alt="The Hodu Academy faculty team at the Jaipur centre"
                    fill
                    sizes="(min-width: 1024px) 680px, 100vw"
                    className="object-cover object-bottom"
                  />
                </div>
                <figcaption className="px-5 py-3 text-[13px] text-brand-muted">The Hodu Academy team, Jaipur centre.</figcaption>
              </figure>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Before you register</h2>
            <p className="mt-4 text-[15px] text-brand-muted">
              Something else on your mind?{' '}
              <a
                href="https://wa.me/919257879555?text=Hi%20Hodu%20Academy%2C%20I%20have%20a%20question%20about%20the%20Jaipur%20CBT%20Challenge"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-maroon underline underline-offset-4"
              >
                Ask us on WhatsApp
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-8 divide-y divide-brand-border border-y border-brand-border">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" open={i === 0}>
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-display text-lg font-semibold hover:text-brand-maroon [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown size={18} aria-hidden className="shrink-0 text-brand-maroon transition-transform group-open:rotate-180" />
                </summary>
                <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-brand-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="relative overflow-hidden bg-brand-text py-16 text-white sm:py-20">
        <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-brand-maroon/50 blur-[120px]" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">
              Same exams. Real experience. <span className="text-amber-300">Higher results.</span>
            </h2>
            <p className="mt-4 text-[17px] text-white/70">The season starts 15 October. Let’s test your potential.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href="#register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-maroon px-6 text-[15px] font-bold hover:bg-brand-crimson"
            >
              Register free <ArrowRight size={16} aria-hidden />
            </a>
            <a
              href="https://wa.me/919257879555?text=Hi%20Hodu%20Academy%2C%20I%20have%20a%20question%20about%20the%20Jaipur%20CBT%20Challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 text-[15px] font-semibold hover:bg-white/10"
            >
              <MessageCircle size={16} aria-hidden /> WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
