import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import SyllabusExplorer from './SyllabusExplorer'
import { TRACKS, type ClassLevel, type TrackId } from './syllabus'
import type { CbtBrand } from './brand'

type Search = { class?: string | string[]; exam?: string | string[] }

/** Reads ?class=xi|xii and ?exam=jee|neet|cuet-sci|cuet-ch so links can open a specific schedule. */
export function initialSelection(search: Search): { level: ClassLevel; track: TrackId } {
  const one = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v)
  const level = one(search.class) === 'xi' ? 'xi' : 'xii'
  const exam = one(search.exam)
  const track = (TRACKS.find((t) => t.id === exam)?.id ?? 'jee') as TrackId
  return { level, track }
}

export default function SyllabusPage({ brand, search }: { brand: CbtBrand; search: Search }) {
  const { level, track } = initialSelection(search)
  return (
    <div className="bg-brand-bg text-brand-text antialiased">
      <section className="bg-brand-text text-white">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
          <Link href={brand.path} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white">
            <ArrowLeft size={16} aria-hidden /> {brand.name}
          </Link>
          <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-white/60">
            {brand.name} <span className="text-white/30">·</span> 2026–27
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Test-by-test syllabus</h1>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/75">
            Thirteen Saturday tests from 24 October 2026 to 16 January 2027. Pick your class and exam to see exactly which
            chapters are in each paper, so you can plan your week around it.
          </p>
        </div>
      </section>

      <section className="mx-auto -mt-6 max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <SyllabusExplorer
          initialLevel={level}
          initialTrack={track}
          today={new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())}
        />

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-3xl bg-brand-text p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-2xl font-bold">Not registered yet?</h2>
            <p className="mt-1 text-[15px] text-white/70">It’s free. Your roll number and login come on WhatsApp.</p>
          </div>
          <Link
            href={`${brand.path}#register`}
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-brand-maroon px-6 text-[15px] font-bold transition-colors hover:bg-brand-crimson"
          >
            Register free <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  )
}
