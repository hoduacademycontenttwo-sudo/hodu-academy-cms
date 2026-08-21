'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('hodu-theme') as 'light' | 'dark' | null
    if (stored) {
      setTheme(stored)
      if (stored === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('hodu-theme', nextTheme)
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-full border border-brand-border flex items-center justify-center text-brand-muted opacity-60 ${className}`}
        aria-hidden="true"
      >
        <Sun className="h-4 w-4" />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'Maroon Theme' : 'White Theme'}`}
      title={`Switch to ${theme === 'light' ? 'Maroon-White Theme' : 'White-Maroon Theme'}`}
      className={`relative group inline-flex items-center justify-center p-2 rounded-full border border-brand-border bg-white dark:bg-[#501113] dark:border-[#7B1B1E] text-brand-maroon dark:text-[#F8EEEE] hover:border-brand-maroon dark:hover:border-white transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer ${className}`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-brand-maroon transition-transform duration-300 group-hover:rotate-12" />
      ) : (
        <Sun className="h-4 w-4 text-amber-300 transition-transform duration-300 group-hover:rotate-45" />
      )}
    </button>
  )
}
