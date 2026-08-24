'use client'

import React, { useEffect, useState } from 'react'
import { WifiOff, Wifi, Download, X, CheckCircle2 } from 'lucide-react'

export default function OfflinePwaManager() {
  const [isOffline, setIsOffline] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // 1. Service Worker Registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Check for service worker updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[Hodu PWA] New offline version available.')
                }
              }
            }
          }
        })
        .catch((err) => {
          console.warn('[Hodu PWA] Service Worker registration failed:', err)
        })
    }

    // 2. Online / Offline Listeners
    const handleOnline = () => {
      setIsOffline(false)
      setShowBanner(true)
      setTimeout(() => setShowBanner(false), 4000)
    }

    const handleOffline = () => {
      setIsOffline(true)
      setShowBanner(true)
    }

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine)
      if (!navigator.onLine) setShowBanner(true)

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
    }

    // 3. BeforeInstallPrompt (PWA App Installation)
    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    })

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  const triggerInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
    }
  }

  return (
    <>
      {/* Offline / Reconnected Floating Notification Bar */}
      {showBanner && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-50 max-w-sm animate-fade-in">
          {isOffline ? (
            <div className="bg-neutral-900/95 text-white backdrop-blur-md border border-neutral-700/80 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <WifiOff className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-neutral-100 flex items-center gap-1.5">
                  <span>Offline Mode Active</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
                </p>
                <p className="text-[10px] text-neutral-400 leading-tight mt-0.5">
                  All cached visuals, pages & admin portals are available.
                </p>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Dismiss offline banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="bg-emerald-950/95 text-white backdrop-blur-md border border-emerald-700/80 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Wifi className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-emerald-200">Back Online</p>
                <p className="text-[10px] text-emerald-400/90 leading-tight mt-0.5">
                  Live data synced with Hodu Academy cloud.
                </p>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-emerald-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Dismiss online banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* PWA Direct Installation Prompt Banner (Optional / Minimal) */}
      {installPrompt && !isInstalled && (
        <div className="fixed top-4 right-4 z-50 max-w-xs animate-fade-in hidden md:block">
          <div className="bg-white/95 backdrop-blur-md border border-brand-border rounded-2xl p-3 shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-maroon/10 text-brand-maroon flex items-center justify-center shrink-0">
              <Download className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-brand-text truncate">Install Hodu Academy</p>
              <p className="text-[10px] text-brand-muted truncate">Use offline on your desktop/mobile</p>
            </div>
            <button
              onClick={triggerInstall}
              className="bg-brand-maroon hover:bg-brand-crimson text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xs transition-colors shrink-0"
            >
              Install
            </button>
            <button
              onClick={() => setInstallPrompt(null)}
              className="text-brand-muted hover:text-brand-text p-1"
              aria-label="Close install prompt"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
