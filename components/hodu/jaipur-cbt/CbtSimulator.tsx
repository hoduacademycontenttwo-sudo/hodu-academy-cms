'use client'

import React, { useEffect, useState } from 'react'
import { ArrowRight, Check, Clock, RotateCcw, X } from 'lucide-react'

type Q = {
  subject: string
  text: React.ReactNode
  options: React.ReactNode[]
  answer: number
  why: string
}

const QUESTIONS: Q[] = [
  {
    subject: 'Physics',
    text: (
      <>
        A particle moves on a circle of radius <i>r</i> with constant angular speed <i>ω</i>. The magnitude of its
        acceleration is
      </>
    ),
    options: [<>ω r</>, <>ω² r</>, <>ω / r</>, <>zero, since speed is constant</>],
    answer: 1,
    why: 'Speed is constant but direction keeps changing, so there is a centripetal acceleration v²/r = ω²r.',
  },
  {
    subject: 'Chemistry',
    text: <>Which of these elements has the highest first ionisation enthalpy?</>,
    options: [<>Boron</>, <>Carbon</>, <>Nitrogen</>, <>Oxygen</>],
    answer: 2,
    why: 'Nitrogen’s half-filled 2p³ shell is extra stable. Oxygen is lower because of electron pairing in 2p⁴.',
  },
  {
    subject: 'Maths',
    text: (
      <>
        <span className="font-mono">d/dx (x ln x)</span> equals
      </>
    ),
    options: [<>ln x</>, <>1 + ln x</>, <>1 / x</>, <>x + ln x</>],
    answer: 1,
    why: 'Product rule: (1)(ln x) + x(1/x) = ln x + 1.',
  },
  {
    subject: 'Biology',
    text: <>In eukaryotic cells, the Krebs cycle takes place in the</>,
    options: [<>cytoplasm</>, <>mitochondrial matrix</>, <>inner mitochondrial membrane</>, <>ribosomes</>],
    answer: 1,
    why: 'The Krebs cycle runs in the matrix. The electron transport chain sits on the inner membrane.',
  },
]

const DURATION = 180
type Status = 'notVisited' | 'notAnswered' | 'answered' | 'marked' | 'answeredMarked'

const STATUS_STYLE: Record<Status, string> = {
  notVisited: 'bg-white text-brand-text border border-brand-border',
  notAnswered: 'bg-red-600 text-white',
  answered: 'bg-emerald-600 text-white',
  marked: 'bg-violet-600 text-white rounded-full',
  answeredMarked: 'bg-violet-600 text-white rounded-full ring-2 ring-emerald-400 ring-offset-1',
}
const STATUS_LABEL: Record<Status, string> = {
  notVisited: 'Not visited',
  notAnswered: 'Not answered',
  answered: 'Answered',
  marked: 'Marked for review',
  answeredMarked: 'Answered & marked',
}

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function CbtSimulator() {
  const [stage, setPhase] = useState<'intro' | 'test' | 'result'>('intro')
  const [current, setCurrent] = useState(0)
  const [draft, setDraft] = useState<number | null>(null)
  const [saved, setSaved] = useState<(number | null)[]>(QUESTIONS.map(() => null))
  const [status, setStatus] = useState<Status[]>(QUESTIONS.map((_, i) => (i === 0 ? 'notAnswered' : 'notVisited')))
  const [left, setLeft] = useState(DURATION)
  const [spent, setSpent] = useState<number[]>(QUESTIONS.map(() => 0))
  // Questions where an option was picked but the student left without saving it.
  const [dropped, setDropped] = useState<boolean[]>(QUESTIONS.map(() => false))
  // When the clock runs out the paper submits itself, like the real exam.
  const phase = stage === 'test' && left <= 0 ? 'result' : stage

  // One tick drives both the countdown and the time spent on the open question.
  useEffect(() => {
    if (phase !== 'test') return
    const t = setInterval(() => {
      setLeft((s) => s - 1)
      setSpent((prev) => prev.map((v, i) => (i === current ? v + 1 : v)))
    }, 1000)
    return () => clearInterval(t)
  }, [phase, current])

  function start() {
    setCurrent(0)
    setDraft(null)
    setSaved(QUESTIONS.map(() => null))
    setStatus(QUESTIONS.map((_, i) => (i === 0 ? 'notAnswered' : 'notVisited')))
    setSpent(QUESTIONS.map(() => 0))
    setDropped(QUESTIONS.map(() => false))
    setLeft(DURATION)
    setPhase('test')
  }

  function goTo(i: number, nextStatus?: Status, nextSaved?: (number | null)[]) {
    const s = [...status]
    if (nextStatus) s[current] = nextStatus
    if (s[i] === 'notVisited') s[i] = 'notAnswered'
    setStatus(s)
    const kept = (nextSaved ?? saved)[current]
    setDropped((d) => d.map((v, k) => (k === current ? draft !== null && draft !== kept : v)))
    if (nextSaved) setSaved(nextSaved)
    setCurrent(i)
    setDraft((nextSaved ?? saved)[i])
  }

  const nextIndex = (current + 1) % QUESTIONS.length

  function saveAndNext() {
    const ns = [...saved]
    ns[current] = draft
    goTo(nextIndex, draft === null ? 'notAnswered' : 'answered', ns)
  }

  function markAndNext() {
    const ns = [...saved]
    ns[current] = draft
    goTo(nextIndex, draft === null ? 'marked' : 'answeredMarked', ns)
  }

  function clearResponse() {
    const ns = [...saved]
    ns[current] = null
    setSaved(ns)
    setDraft(null)
    setStatus((s) => s.map((v, i) => (i === current ? 'notAnswered' : v)))
  }

  function finish() {
    setDropped((d) => d.map((v, k) => (k === current ? draft !== null && draft !== saved[current] : v)))
    setPhase('result')
  }

  const q = QUESTIONS[current]
  const correct = saved.filter((a, i) => a === QUESTIONS[i].answer).length
  const wrong = saved.filter((a, i) => a !== null && a !== QUESTIONS[i].answer).length
  const score = correct * 4 - wrong
  // If the clock ran out, the open question's unsaved pick also counts as dropped.
  const timedOutUnsaved = stage === 'test' && phase === 'result' && draft !== null && draft !== saved[current] && !dropped[current]
  const lostToUnsaved = dropped.filter(Boolean).length + (timedOutUnsaved ? 1 : 0)

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F0A0A] shadow-2xl shadow-black/40">
      {/* window bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2 text-[13px] text-white/70">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </span>
          <span className="ml-1 font-semibold text-white">Hodu CBT</span>
          <span className="hidden sm:inline">· Demo paper</span>
        </div>
        {phase === 'test' && (
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[13px] tabular-nums ${
                left <= 30 ? 'bg-red-600 text-white' : 'bg-white/10 text-amber-300'
              }`}
              aria-label={`Time left ${fmt(left)}`}
            >
              <Clock size={13} aria-hidden /> {fmt(Math.max(left, 0))}
            </span>
            <button
              type="button"
              onClick={finish}
              className="min-h-9 rounded-md bg-brand-maroon px-3 text-[13px] font-bold text-white hover:bg-brand-crimson cursor-pointer"
            >
              Submit
            </button>
          </div>
        )}
      </div>

      <div className="bg-white text-brand-text">
        {phase === 'intro' && (
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-widest text-brand-maroon">Try it · 3 minutes</p>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold leading-tight">
                Four questions. One clock. The real controls.
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
                One question each from Physics, Chemistry, Maths and Biology, marked +4 / −1 like JEE Main and NEET. Use the
                palette, mark for review, submit when you’re done.
              </p>
              <button
                type="button"
                onClick={start}
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand-text px-6 text-[15px] font-bold text-white hover:bg-black cursor-pointer"
              >
                Start the demo <ArrowRight size={16} aria-hidden />
              </button>
            </div>
            <div className="rounded-xl border border-brand-border bg-brand-bg p-5 text-sm">
              <p className="font-bold">Read before you start</p>
              <ul className="mt-3 space-y-2.5 text-brand-muted">
                <li className="flex gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden />
                  Clicking an option is not saving it. Press <b className="text-brand-text">Save &amp; Next</b>.
                </li>
                <li className="flex gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden />
                  Jumping to another question from the palette drops an unsaved choice.
                </li>
                <li className="flex gap-2">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden />
                  When the timer hits zero, the paper submits itself.
                </li>
              </ul>
            </div>
          </div>
        )}

        {phase === 'test' && (
          <div className="grid md:grid-cols-[1fr_220px]">
            <div className="p-4 sm:p-6">
              <div role="tablist" aria-label="Sections" className="flex flex-wrap gap-1.5 border-b border-brand-border pb-3">
                {QUESTIONS.map((x, i) => (
                  <button
                    key={x.subject}
                    role="tab"
                    type="button"
                    aria-selected={i === current}
                    onClick={() => i !== current && goTo(i)}
                    className={`min-h-9 rounded-lg px-3 text-[13px] font-semibold cursor-pointer ${
                      i === current ? 'bg-brand-maroon text-white' : 'bg-brand-blush text-brand-text hover:bg-brand-rose'
                    }`}
                  >
                    {x.subject}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-[13px] text-brand-muted">
                <span className="font-bold text-brand-text">Question {current + 1}</span>
                <span>Single correct · +4 / −1</span>
              </div>
              <p className="mt-3 text-[15px] sm:text-base font-medium leading-relaxed">{q.text}</p>

              <div role="radiogroup" aria-label={`Options for question ${current + 1}`} className="mt-4 space-y-2">
                {q.options.map((opt, i) => {
                  const on = draft === i
                  return (
                    <label
                      key={i}
                      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-[15px] transition-colors ${
                        on ? 'border-brand-maroon bg-brand-blush' : 'border-brand-border hover:border-brand-maroon/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q${current}`}
                        checked={on}
                        onChange={() => setDraft(i)}
                        className="h-4 w-4 accent-[#921E1F]"
                      />
                      <span className="font-mono text-[13px] text-brand-muted">{'ABCD'[i]}</span>
                      <span>{opt}</span>
                    </label>
                  )
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-brand-border pt-4">
                <button
                  type="button"
                  onClick={clearResponse}
                  className="min-h-10 rounded-lg border border-brand-border px-3 text-[13px] font-semibold hover:bg-brand-bg cursor-pointer"
                >
                  Clear response
                </button>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={markAndNext}
                    className="min-h-10 rounded-lg bg-violet-100 px-3 text-[13px] font-semibold text-violet-900 hover:bg-violet-200 cursor-pointer"
                  >
                    Mark for review &amp; next
                  </button>
                  <button
                    type="button"
                    onClick={saveAndNext}
                    className="min-h-10 rounded-lg bg-emerald-700 px-4 text-[13px] font-bold text-white hover:bg-emerald-800 cursor-pointer"
                  >
                    Save &amp; next
                  </button>
                </div>
              </div>
            </div>

            <aside className="border-t border-brand-border bg-brand-bg p-4 sm:p-5 md:border-l md:border-t-0" aria-label="Question palette">
              <p className="text-[13px] font-bold">Question palette</p>
              <div className="mt-3 flex gap-2">
                {status.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => i !== current && goTo(i)}
                    aria-label={`Question ${i + 1}, ${STATUS_LABEL[s]}`}
                    aria-current={i === current}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold cursor-pointer ${STATUS_STYLE[s]} ${
                      i === current ? 'outline-2 outline-offset-2 outline-brand-text' : ''
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <ul className="mt-4 grid grid-cols-1 gap-1.5 text-[12px] text-brand-muted">
                {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
                  <li key={s} className="flex items-center gap-2">
                    <span aria-hidden className={`h-3.5 w-3.5 shrink-0 rounded ${STATUS_STYLE[s]}`} />
                    {STATUS_LABEL[s]}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        )}

        {phase === 'result' && (
          <div className="p-6 sm:p-8" aria-live="polite">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[13px] font-bold uppercase tracking-widest text-brand-maroon">Your demo scorecard</p>
                <p className="mt-1 font-display text-4xl font-bold tabular-nums">
                  {score}
                  <span className="text-xl text-brand-muted"> / 16</span>
                </p>
              </div>
              <div className="flex gap-4 text-sm">
                <span>
                  <b className="text-emerald-700">{correct}</b> right
                </span>
                <span>
                  <b className="text-red-700">{wrong}</b> wrong
                </span>
                <span>
                  <b>{QUESTIONS.length - correct - wrong}</b> left blank
                </span>
              </div>
            </div>

            {lostToUnsaved > 0 && (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                You picked an answer on {lostToUnsaved} question{lostToUnsaved > 1 ? 's' : ''} but moved on without saving, so
                it didn’t count. On a real CBT, that’s marks you already earned, gone.
              </p>
            )}

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="text-[12px] uppercase tracking-wider text-brand-muted">
                  <tr className="border-b border-brand-border">
                    <th className="py-2 pr-3 font-semibold">Q</th>
                    <th className="py-2 pr-3 font-semibold">Section</th>
                    <th className="py-2 pr-3 font-semibold">Yours</th>
                    <th className="py-2 pr-3 font-semibold">Key</th>
                    <th className="py-2 font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {QUESTIONS.map((x, i) => {
                    const a = saved[i]
                    const ok = a === x.answer
                    return (
                      <tr key={x.subject} className="border-b border-brand-border-subtle align-top">
                        <td className="py-2.5 pr-3 font-mono">{i + 1}</td>
                        <td className="py-2.5 pr-3">
                          {x.subject}
                          <p className="mt-0.5 text-[12px] leading-snug text-brand-muted">{x.why}</p>
                        </td>
                        <td className="py-2.5 pr-3">
                          {a === null ? (
                            <span className="text-brand-muted">—</span>
                          ) : (
                            <span className={`inline-flex items-center gap-1 font-semibold ${ok ? 'text-emerald-700' : 'text-red-700'}`}>
                              {ok ? <Check size={14} aria-hidden /> : <X size={14} aria-hidden />}
                              {'ABCD'[a]}
                              <span className="sr-only">{ok ? 'correct' : 'incorrect'}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 pr-3 font-mono">{'ABCD'[x.answer]}</td>
                        <td className="py-2.5 font-mono tabular-nums">{spent[i]}s</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-xl bg-brand-bg p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-brand-muted">
                Every Saturday you get this for a full paper, plus chapter-wise accuracy and your rank across Jaipur.
              </p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={start}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-brand-border bg-white px-4 text-sm font-semibold hover:border-brand-text cursor-pointer"
                >
                  <RotateCcw size={14} aria-hidden /> Retry
                </button>
                <a
                  href="#register"
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-brand-maroon px-4 text-sm font-bold text-white hover:bg-brand-crimson"
                >
                  Register free <ArrowRight size={14} aria-hidden />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
