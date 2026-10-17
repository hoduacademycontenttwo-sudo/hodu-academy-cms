'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, CalendarDays, X } from 'lucide-react'

/**
 * Promotional popup for the Jaipur CBT Challenge.
 *
 * - Shows once per visit (browser session), a moment after the page loads.
 * - "Not now" / ✕ / Esc / backdrop hides it for 3 days; clicking through hides it for 30.
 * - Never shows on /jaipur-cbt itself, or after the season ends.
 */

const SEASON_ENDS = new Date('2027-01-17T00:00:00+05:30')
const SEEN_THIS_VISIT = 'hodu-cbt-promo-seen'
const SNOOZED_UNTIL = 'hodu-cbt-promo-snoozed-until'
const DAY = 24 * 60 * 60 * 1000

// Storage can be unavailable (private mode, blocked cookies); the popup must still behave.
function read(store: 'local' | 'session', key: string) {
  try {
    return (store === 'local' ? localStorage : sessionStorage).getItem(key)
  } catch {
    return null
  }
}
function write(store: 'local' | 'session', key: string, value: string) {
  try {
    ;(store === 'local' ? localStorage : sessionStorage).setItem(key, value)
  } catch {}
}

export default function CbtPromoPopup() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const restoreFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (pathname?.startsWith('/jaipur-cbt')) return
    if (Date.now() >= SEASON_ENDS.getTime()) return
    if (read('session', SEEN_THIS_VISIT)) return
    if (Number(read('local', SNOOZED_UNTIL) ?? 0) > Date.now()) return

    const t = setTimeout(() => {
      write('session', SEEN_THIS_VISIT, '1')
      restoreFocus.current = document.activeElement as HTMLElement | null
      setOpen(true)
    }, 1500)
    return () => clearTimeout(t)
  }, [pathname])

  const close = useCallback((snoozeDays: number) => {
    write('local', SNOOZED_UNTIL, String(Date.now() + snoozeDays * DAY))
    setOpen(false)
    restoreFocus.current?.focus?.()
  }, [])

  useEffect(() => {
    if (!open) return
    dialogRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close(3)
      // Keep Tab inside the dialog.
      if (e.key === 'Tab' && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button')
        const first = items[0]
        const last = items[items.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, close])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 p-0 backdrop-blur-[2px] motion-safe:animate-fade-in sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close(3)
      }}
      data-lenis-prevent
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cbt-promo-title"
        aria-describedby="cbt-promo-desc"
        tabIndex={-1}
        // The dialog itself takes focus on open; the site-wide :focus-visible ring would look like a border here.
        style={{ outline: 'none' }}
        className="relative w-full overflow-hidden rounded-t-3xl bg-brand-text text-white shadow-2xl outline-none motion-safe:animate-slide-up sm:max-w-md sm:rounded-3xl"
      >
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-maroon/60 blur-[90px]" />

        <button
          type="button"
          onClick={() => close(3)}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <X size={20} aria-hidden />
        </button>

        <div className="relative p-6 pt-7 sm:p-8">
          <p className="pr-10 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Jaipur CBT Challenge <span className="text-white/30">·</span> 2026–27
          </p>
          <h2 id="cbt-promo-title" className="mt-4 text-[28px] font-bold leading-[1.1] sm:text-[32px]">
            NEET UG 2027 is a <span className="text-amber-300">computer-based test.</span>
          </h2>
          <p id="cbt-promo-desc" className="mt-3 text-[15px] leading-relaxed text-white/75">
            Don’t let exam day be your first CBT (Computer-Based Test). Practise on a real exam-style screen every Saturday,
            free, and see your rank across Jaipur.
          </p>

          <p className="mt-5 flex items-center gap-2 text-sm font-semibold">
            <CalendarDays size={16} aria-hidden className="text-amber-300" />
            Every Saturday, 17 Oct – 16 Jan
            <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[13px] font-bold text-emerald-300">Free</span>
          </p>
          <p className="mt-1 text-sm text-white/60">NEET · JEE Main · BITSAT · CUET. At Hodu Academy or from home.</p>

          <div className="mt-7 flex flex-col gap-2 sm:flex-row-reverse">
            <Link
              href="/jaipur-cbt"
              onClick={() => close(30)}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-maroon px-5 text-[15px] font-bold transition-colors hover:bg-brand-crimson"
            >
              See the challenge <ArrowRight size={16} aria-hidden />
            </Link>
            <button
              type="button"
              onClick={() => close(3)}
              className="min-h-12 rounded-xl px-5 text-[15px] font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
