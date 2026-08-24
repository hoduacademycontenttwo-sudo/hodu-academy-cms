'use client'

import React, { useEffect, useState } from 'react'
import { WifiOff, Wifi, X } from 'lucide-react'

export default function OfflinePwaManager() {
  const [isOffline, setIsOffline] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          reg.onupdatefound = () => {
            const installingWorker = reg.installing
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[Hodu PWA] Offline version updated.')
                }
              }
            }
          }
        })
        .catch((err) => {
          console.warn('[Hodu PWA] Service Worker registration failed:', err)
        })
    }

    // 2. Online / Offline Listeners with Auto-dismiss
    let timer: NodeJS.Timeout

    const handleOnline = () => {
      setIsOffline(false)
      setShowBanner(true)
      clearTimeout(timer)
      timer = setTimeout(() => setShowBanner(false), 3000)
    }

    const handleOffline = () => {
      setIsOffline(true)
      setShowBanner(true)
      clearTimeout(timer)
      timer = setTimeout(() => setShowBanner(false), 4500)
    }

    if (typeof window !== 'undefined') {
      const offlineNow = !navigator.onLine
      setIsOffline(offlineNow)
      if (offlineNow) {
        setShowBanner(true)
        timer = setTimeout(() => setShowBanner(false), 4500)
      }

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearTimeout(timer)
    }
  }, [])

  if (!showBanner) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in pointer-events-auto select-none">
      {isOffline ? (
        <div className="bg-neutral-950/90 text-white backdrop-blur-md border border-neutral-800 rounded-full px-4 py-2 shadow-xl flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <WifiOff className="h-3 w-3" />
          </div>
          <span className="text-xs font-semibold text-neutral-100 flex items-center gap-1.5">
            <span>Offline mode is active</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-pulse" />
          </span>
          <button
            onClick={() => setShowBanner(false)}
            className="text-neutral-400 hover:text-white ml-1 p-0.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="bg-emerald-950/90 text-white backdrop-blur-md border border-emerald-800 rounded-full px-4 py-2 shadow-xl flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Wifi className="h-3 w-3" />
          </div>
          <span className="text-xs font-semibold text-emerald-200">
            Back online
          </span>
          <button
            onClick={() => setShowBanner(false)}
            className="text-emerald-400 hover:text-white ml-1 p-0.5 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
