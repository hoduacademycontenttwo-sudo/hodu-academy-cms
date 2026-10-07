import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bus,
  CalendarCheck,
  ChevronDown,
  ClipboardCheck,
  GraduationCap,
  Laptop,
  LineChart,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Phone,
  PlayCircle,
  School,
  Smartphone,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import { HODU } from '@/lib/hodu'
import { getHomeData, type HomeData, type ResultPerson } from '@/lib/homeData'
import { getFAQPageSchema } from '@/lib/seo'
import { formatAchievement, initials, smartCase, titleCase, usefulNote } from '@/components/hodu/home/format'

export const metadata = {
  title: 'Hodu Academy, Jaipur | IGCSE, IB, CBSE, JEE & NEET Coaching',
  description:
    'Coaching for Cambridge IGCSE, IB, CBSE (Classes 6–12), JEE, NEET and Olympiads at our Jaipur centre and online. Founded by MNIT Jaipur alumni. 2026 results include IIT Bombay, IIT Delhi and CBSE scores of 97+.',
}

/* ───────────────────────── content ───────────────────────── */

// Used only if the CMS can't be reached, so the page never renders empty.
const FALLBACK: HomeData = {
  decks: [],
  programmes: [
    {
      tag: 'Cambridge IGCSE & A Level',
      title: 'Cambridge International Program',
      grades: 'Grades 8 to 12 · IGCSE / AS & A Levels',
      desc: 'Extended Maths, Physics, Chemistry, Biology and Economics, taught against past papers and mark schemes.',
      features: ['Past-paper practice', 'Command-word marking', 'Coursework review'],
      href: '/courses?category=IGCSE',
    },
    {
      tag: 'Entrance exam preparation',
      title: 'Competitive Exam Excellence Program',
      grades: 'Classes 9 to 12 · JEE / NEET & Olympiads',
      desc: 'Advanced concepts, structured problem solving and regular mock exams for JEE, NEET and Olympiads.',
      features: ['Chapter-wise tests & mocks', 'Problem-solving practice', 'Performance analysis'],
      href: '/courses?category=Entrance',
    },
    {
      tag: 'CBSE board program',
      title: 'CBSE Academic Excellence Program',
      grades: 'Classes 6 to 12 · CBSE',
      desc: 'NCERT-aligned concept building with regular practice, revision and board-exam preparation.',
      features: ['NCERT & CBSE syllabus', 'Chapter-wise practice', 'Board exam preparation'],
      href: '/courses?category=CBSE',
    },
  ],
  facilities: [],
  banners: [],
  channels: [],
  ptmPhotos: [],
  founders: [
    { name: 'Mr. V.P. Singh', role: 'Co-Founder & Director', experience: '25+ years of teaching experience', qualification: 'MNIT Jaipur' },
    { name: 'Mr. Rohit Jain', role: 'Co-Founder & Director', experience: '15+ years of teaching experience', qualification: 'MNIT Jaipur' },
    { name: 'Mr. Abhishek Agarwal', role: 'Co-Founder & Technology Lead', experience: 'Palantir, Ex-Qualcomm', qualification: 'IIIT Hyderabad' },
  ],
  notices: [],
}

const FACILITY_ICONS: Record<string, LucideIcon> = {
  School,
  Target,
  Laptop,
  Smartphone,
  Bus,
  BookOpen,
  Users,
  GraduationCap,
}

const FAQS = [
  {
    q: 'What does Hodu Academy teach?',
    a: 'Cambridge IGCSE and A Levels, IB (MYP and DP), CBSE for Classes 6 to 12, JEE, NEET and Olympiads. Each has its own programme and teachers who specialise in that exam.',
  },
  {
    q: 'Are classes in Jaipur or online?',
    a: 'Both. Our centre is at C-28, Vaishali Estate, Gandhi Path West, Jaipur, and we also run live online classes. Every student gets access to our LMS for recorded lessons, notes and tests.',
  },
  {
    q: 'How big are the batches?',
    a: 'Small, typically 12 to 15 students, so teachers know every student’s strengths and gaps by name.',
  },
  {
    q: 'How will we know if our child is improving?',
    a: 'Through weekly tests, computer-based mock exams for JEE and NEET, monthly parent-teacher meetings and regular performance reports with teacher feedback.',
  },
  {
    q: 'Is transport available?',
    a: 'Yes. Transport support is available to and from the Jaipur centre. Ask us about routes when you book your counselling session.',
  },
  {
    q: 'How do we get started?',
    a: 'Book a free counselling session. We’ll look at your child’s current scores and goals and suggest the right programme and batch. There’s no obligation to enrol.',
  },
]

/* ───────────────────────── small pieces ───────────────────────── */

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`text-[12px] font-bold uppercase tracking-[0.18em] ${dark ? 'text-amber-300' : 'text-brand-maroon'}`}>{children}</p>
  )
}

function Avatar({ person, size }: { person: ResultPerson; size: number }) {
  return person.photo ? (
    <Image
      src={person.photo}
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      className="shrink-0 rounded-full bg-brand-blush object-cover object-top"
      style={{ width: size, height: size }}
    />
  ) : (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full bg-brand-blush text-sm font-bold text-brand-maroon"
      style={{ width: size, height: size }}
    >
      {initials(person.name)}
    </span>
  )
}

/**
 * The team photo is a banner with text baked into its top third. Zoom in from the bottom so only
 * the people show: a 3:1 window over roughly x 300–1620, y 260–700 of the 1920×700 source.
 */
function TeamPhoto({ priority = false }: { priority?: boolean }) {
  return (
    <div className="relative aspect-[3/1] overflow-hidden bg-brand-wine">
      <Image
        src="/images/jaipur_center_bg.png"
        alt="The Hodu Academy faculty team at the Jaipur centre"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 1000px, 150vw"
        className="origin-bottom scale-[1.45] object-cover object-bottom"
      />
    </div>
  )
}

/* ───────────────────────── page ───────────────────────── */

export default async function HomePage() {
  let data = FALLBACK
  try {
    data = await getHomeData()
  } catch (err) {
    console.error('Home data unavailable, using fallback content:', err)
  }
  const { decks, facilities, banners, channels, ptmPhotos, notices } = data
  const programmes = data.programmes.length ? data.programmes : FALLBACK.programmes
  const founders = data.founders.length ? data.founders : FALLBACK.founders

  // Hero: the lead student from each of the first four result decks.
  const heroPeople = decks
    .map((d) => ({ id: d.id, deck: d.label, person: d.people.find((p) => p.photo) }))
    .filter((x): x is { id: string; deck: string; person: ResultPerson } => !!x.person)
    .slice(0, 4)

  const showCbt = new Date() < new Date('2027-01-17T00:00:00+05:30')

  return (
    <div className="bg-white text-brand-text">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFAQPageSchema(FAQS)) }}
      />

      {/* ── Announcement ── */}
      {(showCbt || notices.length > 0) && (
        <div className="border-b border-brand-border bg-brand-text text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            {showCbt ? (
              <Link href="/jaipur-cbt" className="group leading-snug hover:text-amber-300">
                <span className="font-bold text-amber-300">NEET UG 2027 is computer-based.</span>{' '}
                <span className="text-white/80 group-hover:text-amber-300">
                  Practise free in the Jaipur CBT Challenge, every Saturday from 17 Oct
                </span>
                <ArrowRight size={14} aria-hidden className="ml-1 inline align-[-2px]" />
              </Link>
            ) : (
              <span />
            )}
            {notices.length > 0 && <p className="text-white/70">{notices.join(' · ')}</p>}
          </div>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-brand-bg">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-brand-rose/60 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="lg:col-span-6">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-brand-muted">
              Hodu Academy <span className="text-brand-maroon">·</span> Jaipur
            </p>
            <h1 className="mt-5 text-[40px] font-bold leading-[1.05] tracking-tight text-brand-text sm:text-6xl lg:text-[64px]">
              One classroom for IGCSE, IB, CBSE, JEE <span className="text-brand-maroon">and NEET.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-brand-muted sm:text-lg">
              Small batches, teachers who have taught these exams for decades, and weekly tests that show exactly where your
              child stands. Recent students have earned places at IIT Bombay, IIT Delhi, Imperial College London and NUS.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#counselling"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-maroon px-6 text-[15px] font-bold text-white transition-colors hover:bg-brand-crimson"
              >
                Book a free counselling session <ArrowRight size={16} aria-hidden />
              </a>
              <a
                href="#results"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-6 text-[15px] font-semibold text-brand-text transition-colors hover:border-brand-text"
              >
                See 2026 results
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-muted">
              <li className="flex items-center gap-1.5">
                <MapPin size={15} aria-hidden className="text-brand-maroon" /> Vaishali Estate, Jaipur
              </li>
              <li className="flex items-center gap-1.5">
                <GraduationCap size={15} aria-hidden className="text-brand-maroon" /> Classes 6–12
              </li>
              <li className="flex items-center gap-1.5">
                <Laptop size={15} aria-hidden className="text-brand-maroon" /> In-centre &amp; online
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6">
            {heroPeople.length >= 2 ? (
              <figure>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {heroPeople.map(({ id, deck, person }, i) => (
                    <div
                      key={id}
                      className={`relative overflow-hidden rounded-2xl bg-brand-blush shadow-sm ${i % 2 === 1 ? 'sm:translate-y-6' : ''}`}
                    >
                      <div className="relative aspect-[4/5] lg:aspect-square">
                        <Image
                          src={person.photo}
                          alt={`${titleCase(person.name)}, ${deck}`}
                          fill
                          sizes="(min-width: 1024px) 290px, 45vw"
                          priority={i === 0}
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 pt-10 text-white sm:p-4 sm:pt-12">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">{deck}</p>
                        <p className="mt-0.5 text-[15px] font-bold leading-tight sm:text-base">{titleCase(person.name)}</p>
                        <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-white/85">
                          {formatAchievement(person.achievement)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <figcaption className="mt-4 text-[13px] text-brand-muted sm:mt-10">Hodu students, 2026 results.</figcaption>
              </figure>
            ) : (
              <figure className="overflow-hidden rounded-3xl border border-brand-border bg-white">
                <TeamPhoto priority />
              </figure>
            )}
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      {decks.length > 0 && (
        <section id="results" className="scroll-mt-20 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <Eyebrow>Results 2026</Eyebrow>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">The class of 2026.</h2>
                <p className="mt-4 text-[17px] leading-relaxed text-brand-muted">
                  Board exams, entrance exams and university admissions. A few of this year’s students, by name.
                </p>
              </div>
              <Link href="/results" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand-maroon hover:underline">
                All results <ArrowRight size={16} aria-hidden />
              </Link>
            </div>

            <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:mt-12 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
              {decks.map((deck) => {
                const shown = deck.people.slice(0, 5)
                const more = deck.people.length - shown.length
                return (
                  <article
                    key={deck.id}
                    className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl border border-brand-border bg-white p-5 sm:p-6 md:w-auto"
                  >
                    <h3 className="text-xl font-bold">{deck.label}</h3>
                    <ul className="mt-4 flex-1 divide-y divide-brand-border-subtle">
                      {shown.map((p) => {
                        const note = usefulNote(p)
                        return (
                          <li key={p.name + p.achievement} className="flex items-center gap-3 py-2.5">
                            <Avatar person={p} size={44} />
                            <div className="min-w-0">
                              <p className="truncate text-[15px] font-semibold">{titleCase(p.name)}</p>
                              <p className="line-clamp-2 text-[13px] leading-snug text-brand-muted">
                                {formatAchievement(p.achievement)}
                                {note && <span className="text-brand-text"> · {note}</span>}
                              </p>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                    {more > 0 && (
                      <Link href="/results" className="mt-3 text-sm font-semibold text-brand-maroon hover:underline">
                        +{more} more
                      </Link>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Programmes ── */}
      <section className="bg-brand-bg py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Eyebrow>Programmes</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Built around the exam your child is taking.</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-brand-muted">
              A Cambridge paper, a CBSE board exam and JEE ask for different things, so each has its own programme.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {programmes.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="group flex flex-col rounded-2xl border border-brand-border bg-white p-6 transition-shadow hover:shadow-lg sm:p-7"
              >
                <p className="text-[12px] font-bold uppercase tracking-wider text-brand-maroon">{p.tag}</p>
                <h3 className="mt-3 text-2xl font-bold leading-snug">{p.title}</h3>
                <p className="mt-1 text-sm font-semibold text-brand-muted">{p.grades}</p>
                <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-brand-muted">{p.desc}</p>
                <ul className="mt-5 flex-1 space-y-2 border-t border-brand-border-subtle pt-5 text-[15px]">
                  {p.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex gap-2">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-maroon" />
                      {f}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-brand-maroon">
                  View courses <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we teach ── */}
      {facilities.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <Eyebrow>How we teach</Eyebrow>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-[44px] sm:leading-tight">
                  Taught well. Tested often. Nothing left to chance.
                </h2>
                <p className="mt-5 text-[17px] leading-relaxed text-brand-muted">
                  Good teaching is only half of it. The rest is practice, feedback and showing up every week.
                </p>
              </div>
            </div>
            <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-8">
              {facilities.map((f) => {
                const Icon = FACILITY_ICONS[f.icon] ?? ClipboardCheck
                return (
                  <li key={f.title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-blush text-brand-maroon">
                      <Icon size={20} aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">{f.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-brand-muted">{f.desc}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      )}

      {/* ── Founders & team ── */}
      <section className="bg-brand-text py-16 text-white sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <Eyebrow dark>Who teaches here</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-[44px] sm:leading-tight">
              Taught by people who’ve done this for decades.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-white/70">
              Hodu Academy was founded by two MNIT Jaipur alumni who have spent their careers teaching JEE, NEET and board
              students, together with an IIIT Hyderabad engineer who runs our technology. Our two teaching founders alone
              have mentored more than 16,000 students.
            </p>
            <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {founders.map((f) => (
                <li key={f.name} className="py-4">
                  <p className="font-bold">{smartCase(f.name)}</p>
                  <p className="mt-0.5 text-sm text-white/65">
                    {f.role}
                    {f.qualification && ` · ${smartCase(f.qualification)}`}
                    {f.experience && ` · ${f.experience}`}
                  </p>
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold text-amber-300 hover:underline">
              Meet all our teachers <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <figure className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl">
              <TeamPhoto />
            </div>
            <figcaption className="mt-3 text-[13px] text-white/55">The Hodu Academy team at our Jaipur centre.</figcaption>
          </figure>
        </div>
      </section>

      {/* ── Parents ── */}
      <section className="bg-brand-bg py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-5">
            <Eyebrow>For parents</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-[44px] sm:leading-tight">
              You’ll always know how your child is doing.
            </h2>
            <ul className="mt-8 space-y-5">
              {[
                { icon: CalendarCheck, title: 'Monthly parent-teacher meetings', body: 'Sit down with the teachers who actually teach your child.' },
                { icon: LineChart, title: 'Regular performance reports', body: 'Test scores and trends, so progress is visible, not guessed.' },
                { icon: MessagesSquare, title: 'Feedback you can act on', body: 'Specific suggestions on what to work on next, subject by subject.' },
              ].map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-maroon ring-1 ring-brand-border">
                    <Icon size={20} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="mt-0.5 text-[15px] text-brand-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/ptm" className="mt-8 inline-flex min-h-11 items-center gap-1.5 font-semibold text-brand-maroon hover:underline">
              See our PTMs <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          {ptmPhotos.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7">
              {ptmPhotos.map((src, i) => (
                <div
                  key={src}
                  className={`relative overflow-hidden rounded-2xl bg-brand-blush ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}`}
                >
                  <Image
                    src={src}
                    alt="A parent-teacher meeting at Hodu Academy"
                    fill
                    sizes={i === 0 ? '(min-width: 1024px) 700px, 100vw' : '(min-width: 1024px) 340px, 50vw'}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── What's on ── */}
      {(banners.length > 0 || channels.length > 0) && (
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {banners.length > 0 && (
              <>
                <div className="max-w-2xl">
                  <Eyebrow>Open now</Eyebrow>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Test series and courses</h2>
                </div>
                <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
                  {banners.map((b, i) => {
                    const img = (
                      <div className="relative aspect-[1600/583] overflow-hidden rounded-2xl border border-brand-border bg-brand-blush">
                        <Image
                          src={b.image}
                          alt={`Hodu Academy programme banner ${i + 1}`}
                          fill
                          sizes="(min-width: 1024px) 600px, 85vw"
                          className="object-cover"
                        />
                      </div>
                    )
                    return (
                      <li key={b.image} className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-0.5rem)]">
                        {b.href ? (
                          <a
                            href={b.href}
                            target={b.href.startsWith('http') ? '_blank' : undefined}
                            rel={b.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="block transition-opacity hover:opacity-90"
                          >
                            {img}
                          </a>
                        ) : (
                          img
                        )}
                      </li>
                    )
                  })}
                </ul>
              </>
            )}

            {channels.length > 0 && (
              <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-brand-border bg-brand-bg p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-xl font-bold">Free lessons on YouTube</h3>
                  <p className="mt-1 text-[15px] text-brand-muted">Watch our teachers before you meet them.</p>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {channels.map((c) => (
                    <li key={c.url}>
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-brand-border bg-white px-4 text-sm font-semibold transition-colors hover:border-brand-text"
                      >
                        <PlayCircle size={16} aria-hidden className="text-red-600" />
                        {c.title.replace(/^Hodu Academy\s*[-|]?\s*/i, '')}
                        <ArrowUpRight size={14} aria-hidden className="text-brand-muted" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      <section className="border-t border-brand-border py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">What parents usually ask</h2>
            <p className="mt-4 text-[15px] text-brand-muted">
              More in our{' '}
              <Link href="/faq" className="font-semibold text-brand-maroon underline underline-offset-4">
                full FAQ
              </Link>
              .
            </p>
          </div>
          <div className="divide-y divide-brand-border border-y border-brand-border lg:col-span-8">
            {FAQS.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-lg font-semibold hover:text-brand-maroon [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown size={18} aria-hidden className="shrink-0 text-brand-maroon transition-transform group-open:rotate-180" />
                </summary>
                <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-brand-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Counselling ── */}
      <section id="counselling" className="relative scroll-mt-20 overflow-hidden bg-brand-text py-16 text-white sm:py-24">
        <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-brand-maroon/50 blur-[130px]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <Eyebrow dark>Free counselling</Eyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Not sure which programme fits?</h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-white/70">
              Tell us your child’s class and goals. A senior teacher will call you back, look at recent scores with you and
              suggest a programme. No obligation to enrol.
            </p>
            <ul className="mt-8 space-y-3 text-[15px]">
              <li>
                <a href={`tel:${HODU.phone.replace(/[^+\d]/g, '')}`} className="inline-flex min-h-11 items-center gap-3 hover:text-amber-300">
                  <Phone size={18} aria-hidden className="text-amber-300" /> {HODU.phone.replace('+91-', '+91 ')}
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919257879555?text=Hi%20Hodu%20Academy%2C%20I%27d%20like%20to%20know%20more%20about%20your%20programmes."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-3 hover:text-amber-300"
                >
                  <MessageCircle size={18} aria-hidden className="text-amber-300" /> WhatsApp us
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <MapPin size={18} aria-hidden className="mt-0.5 shrink-0 text-amber-300" /> {HODU.address}
              </li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 text-brand-text shadow-2xl shadow-black/30 sm:p-8">
            <h3 className="text-2xl font-bold">Request a call back</h3>
            <p className="mb-5 mt-1 text-sm text-brand-muted">Our counsellor usually calls back within 2 hours.</p>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </div>
  )
}
