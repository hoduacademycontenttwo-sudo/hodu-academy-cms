'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, Info } from 'lucide-react'
import {
  SUBJECTS,
  TESTS,
  TRACKS,
  phaseFor,
  scheduleFor,
  type Cell,
  type ClassLevel,
  type SubjectId,
  type TrackId,
} from './syllabus'

const DOT: Record<SubjectId, string> = {
  phy: 'bg-sky-500',
  chem: 'bg-emerald-500',
  maths: 'bg-violet-500',
  bio: 'bg-lime-600',
  acc: 'bg-amber-500',
  eco: 'bg-sky-500',
  amaths: 'bg-violet-500',
  his: 'bg-rose-500',
  geo: 'bg-emerald-500',
  pol: 'bg-indigo-500',
}

const LEVELS: { id: ClassLevel; label: string }[] = [
  { id: 'xi', label: 'Class XI' },
  { id: 'xii', label: 'Class XII / Dropper' },
]

function Topics({ cell, level, track }: { cell: Cell | undefined; level: ClassLevel; track: TrackId }) {
  if (!cell) return null
  if (typeof cell === 'string') return <p>{cell}</p>
  if (cell.both) return <p>{cell.both}</p>

  // Class XII CUET (science) is assessed on the Class XII chapters only.
  if (level === 'xii' && track === 'cuet-sci') return <p>{cell.xii ?? cell.xi}</p>

  return (
    <div className="space-y-1.5">
      {cell.xi && (
        <p>
          <span className="mr-1.5 rounded bg-brand-blush px-1.5 py-0.5 text-[11px] font-bold text-brand-maroon">XI</span>
          {cell.xi}
        </p>
      )}
      {cell.xii && (
        <p>
          <span className="mr-1.5 rounded bg-brand-text px-1.5 py-0.5 text-[11px] font-bold text-white">XII</span>
          {cell.xii}
        </p>
      )}
    </div>
  )
}

export default function SyllabusExplorer({
  initialLevel,
  initialTrack,
  today,
}: {
  initialLevel: ClassLevel
  initialTrack: TrackId
  /** Today in India as YYYY-MM-DD, worked out on the server so "Next test" is in the first render. */
  today: string
}) {
  const [level, setLevel] = useState<ClassLevel>(initialLevel)
  const [trackId, setTrackId] = useState<TrackId>(initialTrack)
  const track = TRACKS.find((t) => t.id === trackId)!
  const [picked, setPicked] = useState<SubjectId[]>(track.subjects)
  // Keep the URL shareable: /…/syllabus?class=xii&exam=neet
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('class', level)
    url.searchParams.set('exam', trackId)
    window.history.replaceState(null, '', url)
  }, [level, trackId])

  function chooseTrack(id: TrackId) {
    setTrackId(id)
    setPicked(TRACKS.find((t) => t.id === id)!.subjects)
  }

  function toggleSubject(s: SubjectId) {
    setPicked((prev) => (prev.includes(s) ? (prev.length > 1 ? prev.filter((x) => x !== s) : prev) : [...prev, s]))
  }

  const subjects = track.subjects.filter((s) => picked.includes(s))
  const schedule = useMemo(() => scheduleFor(level, trackId), [level, trackId])
  const nextIndex = TESTS.findIndex((t) => t.date >= today)

  const note =
    level === 'xi'
      ? 'Every test covers the Class XI syllabus only.'
      : trackId === 'cuet-sci'
        ? 'CUET assesses Class XII chapters only, so Class XI topics are hidden here.'
        : trackId === 'cuet-ch'
          ? 'Every test covers the Class XII syllabus only. Droppers follow the same schedule.'
          : 'Each test covers a Class XI topic and a Class XII topic together. Droppers follow the same schedule.'

  const colsClass =
    subjects.length >= 5 ? 'sm:grid-cols-2 lg:grid-cols-3' : subjects.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : subjects.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'

  return (
    <div>
      {/* ── Pickers ── */}
      <div className="rounded-3xl border border-brand-border bg-white p-5 shadow-sm sm:p-7">
        <fieldset>
          <legend className="text-sm font-bold text-brand-text">1. Your class</legend>
          <div className="mt-2.5 grid grid-cols-2 gap-2 sm:inline-grid sm:grid-cols-2">
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={level === l.id}
                onClick={() => setLevel(l.id)}
                className={`min-h-11 rounded-xl border px-5 text-[15px] font-semibold transition-colors cursor-pointer ${
                  level === l.id ? 'border-brand-text bg-brand-text text-white' : 'border-brand-border bg-white hover:border-brand-text'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-bold text-brand-text">2. Your exam</legend>
          <div className="mt-2.5 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={trackId === t.id}
                onClick={() => chooseTrack(t.id)}
                className={`min-h-11 rounded-xl border px-3 py-2 text-left text-[15px] font-semibold leading-snug transition-colors cursor-pointer ${
                  trackId === t.id
                    ? 'border-brand-maroon bg-brand-blush text-brand-maroon ring-1 ring-brand-maroon'
                    : 'border-brand-border bg-white hover:border-brand-maroon/40'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        {track.pickSubjects && (
          <fieldset className="mt-6">
            <legend className="text-sm font-bold text-brand-text">
              3. Your subjects <span className="font-normal text-brand-muted">(tap to hide the ones you’re not taking)</span>
            </legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {track.subjects.map((s) => {
                const on = picked.includes(s)
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleSubject(s)}
                    className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors cursor-pointer ${
                      on ? 'border-brand-text bg-white text-brand-text' : 'border-brand-border bg-brand-bg text-brand-muted line-through'
                    }`}
                  >
                    <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${on ? DOT[s] : 'bg-brand-border'}`} />
                    {SUBJECTS[s]}
                    {on && <Check size={14} aria-hidden />}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}

        <p className="mt-6 flex items-start gap-2 rounded-xl bg-brand-bg p-3.5 text-sm text-brand-text">
          <Info size={16} aria-hidden className="mt-0.5 shrink-0 text-brand-maroon" />
          <span>
            <b>
              {LEVELS.find((l) => l.id === level)!.label} · {track.short}.
            </b>{' '}
            {note}
            {trackId === 'jee' && ' JEE and BITSAT papers use Physics, Chemistry and Mathematics.'}
            {trackId === 'neet' && ' NEET papers use Physics, Chemistry and Biology.'}
          </span>
        </p>
      </div>

      {/* ── Tests ── */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">13 tests, every Saturday morning</h2>
        {nextIndex >= 0 && (
          <a href={`#test-${TESTS[nextIndex].n}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-brand-maroon hover:underline">
            <CalendarDays size={16} aria-hidden /> Jump to the next test
          </a>
        )}
      </div>

      <ol className="mt-5 space-y-3">
        {TESTS.map((t, i) => {
          const row = schedule[i]
          const isNext = i === nextIndex
          const isPast = nextIndex === -1 || i < nextIndex
          return (
            <li key={t.n} id={`test-${t.n}`} className="scroll-mt-24">
              <article
                className={`rounded-2xl border bg-white p-5 transition-opacity sm:p-6 ${
                  isNext ? 'border-brand-maroon ring-2 ring-brand-maroon/20' : 'border-brand-border'
                } ${isPast ? 'opacity-60' : ''}`}
              >
                <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h3 className="text-xl font-bold">Test {t.n}</h3>
                  <span className="text-[15px] font-semibold text-brand-muted">{t.label}</span>
                  <span className="rounded-full bg-brand-bg px-2.5 py-0.5 text-[12px] font-semibold text-brand-text ring-1 ring-brand-border">
                    {phaseFor(trackId, t.n)}
                  </span>
                  {isNext && (
                    <span className="rounded-full bg-brand-maroon px-2.5 py-0.5 text-[12px] font-bold text-white">Next test</span>
                  )}
                  {isPast && <span className="text-[12px] font-semibold text-brand-muted">Done</span>}
                </header>
                <dl className={`mt-4 grid gap-x-6 gap-y-4 ${colsClass}`}>
                  {subjects.map((s) => (
                    <div key={s} className="min-w-0">
                      <dt className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-brand-muted">
                        <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${DOT[s]}`} />
                        {SUBJECTS[s]}
                      </dt>
                      <dd className="mt-1.5 text-[15px] leading-relaxed text-brand-text">
                        <Topics cell={row[s]} level={level} track={trackId} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
