'use client'

import { useState, useEffect } from 'react'
import PencilLoader from './PencilLoader'

export default function InitialPageLoader({ minDuration = 400, maxTimeout = 900 }: { minDuration?: number; maxTimeout?: number }) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(30)
  const [statusText, setStatusText] = useState('INITIALIZING CLASSROOM...')

  useEffect(() => {
    let isCancelled = false

    // Quick smooth progress ticker (non-blocking for slow networks)
    const t1 = setTimeout(() => {
      if (!isCancelled) {
        setProgress(75)
        setStatusText('READY')
      }
    }, 200)

    const t2 = setTimeout(() => {
      if (!isCancelled) {
        setProgress(100)
        setStatusText('WELCOME TO HODU ACADEMY')
      }
    }, 380)

    const t3 = setTimeout(() => {
      if (!isCancelled) {
        setLoading(false)
      }
    }, Math.max(minDuration, 550))

    return () => {
      isCancelled = true
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [minDuration, maxTimeout])

  if (!loading) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-400 ease-out ${
        progress === 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-xs w-full px-6 space-y-6">
        {/* Animated Pencil Logo Loader */}
        <div className="relative">
          <PencilLoader />
        </div>

        {/* Loading Progress & Editorial Status */}
        <div className="w-full space-y-2 text-center">
          <div className="flex justify-between items-center text-[11px] font-bold tracking-widest text-brand-maroon uppercase">
            <span>{statusText}</span>
            <span>{progress}%</span>
          </div>

          {/* Precision Red Accent Line Progress Bar */}
          <div className="w-full h-1 bg-brand-bg rounded-full overflow-hidden border border-brand-border/60">
            <div
              className="h-full bg-gradient-to-r from-brand-maroon via-brand-crimson to-brand-wine transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-[10px] text-brand-muted tracking-wider uppercase font-medium pt-1">
            Hodu Academy • Jaipur&apos;s Premier Coaching
          </p>
        </div>
      </div>
    </div>
  )
}
