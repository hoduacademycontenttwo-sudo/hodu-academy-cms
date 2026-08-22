'use client'

import { useState, useEffect } from 'react'
import PencilLoader from './PencilLoader'

export default function InitialPageLoader({ minDuration = 1800, maxTimeout = 4500 }: { minDuration?: number; maxTimeout?: number }) {
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(15)
  const [statusText, setStatusText] = useState('INITIALIZING CLASSROOM...')

  useEffect(() => {
    const startTime = Date.now()
    let isCancelled = false

    // Function to check all page images
    const waitForImages = async () => {
      // Find all <img> elements currently in the DOM
      const imgElements = Array.from(document.querySelectorAll('img'))
      const total = Math.max(imgElements.length, 1)
      let loaded = 0

      const updateProgress = () => {
        if (isCancelled) return
        loaded++
        const pct = Math.min(Math.round((loaded / total) * 100), 95)
        setProgress(prev => Math.max(prev, pct))
        if (pct > 60) {
          setStatusText('OPTIMIZING VISUAL ASSETS...')
        }
      }

      if (imgElements.length === 0) {
        setProgress(90)
      } else {
        const imagePromises = imgElements.map((img: HTMLImageElement) => {
          if (img.complete && img.naturalWidth > 0) {
            updateProgress()
            return Promise.resolve()
          }
          return new Promise<void>(resolve => {
            const onFinish = () => {
              updateProgress()
              resolve()
            }
            if (typeof img.decode === 'function') {
              img.decode().then(onFinish).catch(onFinish)
            } else {
              img.onload = onFinish
              img.onerror = onFinish
            }
          })
        })

        await Promise.allSettled(imagePromises)
      }

      if (isCancelled) return

      setProgress(100)
      setStatusText('WELCOME TO HODU ACADEMY')

      // Ensure minDuration is respected for smooth animation
      const elapsed = Date.now() - startTime
      const remainingTime = Math.max(0, minDuration - elapsed)

      setTimeout(() => {
        if (!isCancelled) {
          setLoading(false)
        }
      }, remainingTime + 200)
    }

    // Run when DOM is ready
    if (document.readyState === 'complete') {
      waitForImages()
    } else {
      window.addEventListener('load', waitForImages, { once: true })
      // Fallback timer to start checking anyway
      const fallbackCheck = setTimeout(waitForImages, 600)
      return () => {
        clearTimeout(fallbackCheck)
        window.removeEventListener('load', waitForImages)
      }
    }

    // Safety timeout: Never keep the user waiting past maxTimeout
    const safetyTimer = setTimeout(() => {
      if (!isCancelled) {
        setProgress(100)
        setLoading(false)
      }
    }, maxTimeout)

    return () => {
      isCancelled = true
      clearTimeout(safetyTimer)
    }
  }, [minDuration, maxTimeout])

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-brand-bg transition-all duration-700 ease-out ${
        loading
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none scale-105'
      }`}
      aria-hidden={!loading}
    >
      <div className="flex flex-col items-center gap-6 px-4 max-w-sm text-center">
        {/* Animated Pencil */}
        <PencilLoader
          size={160}
          label=""
        />

        {/* Status Text & Progress Bar */}
        <div className="w-64 flex flex-col items-center gap-2.5">
          <div className="flex items-center justify-between w-full text-[11px] font-bold tracking-widest text-brand-maroon uppercase">
            <span>{statusText}</span>
            <span>{progress}%</span>
          </div>

          {/* Progress track */}
          <div className="w-full h-1.5 bg-brand-border/80 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-brand-maroon to-brand-crimson rounded-full transition-all duration-300 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-[10px] text-brand-muted font-medium tracking-wide">
            Hodu Academy • Jaipur&apos;s Premier Coaching
          </p>
        </div>
      </div>
    </div>
  )
}
