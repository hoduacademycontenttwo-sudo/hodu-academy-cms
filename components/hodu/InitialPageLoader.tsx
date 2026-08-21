'use client'

import { useState, useEffect } from 'react'
import PencilLoader from './PencilLoader'

export default function InitialPageLoader({ minDuration = 2000 }: { minDuration?: number }) {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, minDuration)

    return () => clearTimeout(timer)
  }, [minDuration])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-brand-bg dark:bg-[#120708] transition-all duration-500 ease-out ${
        loading
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none scale-105'
      }`}
      aria-hidden={!loading}
    >
      <div className="flex flex-col items-center gap-4">
        <PencilLoader
          size={160}
          label="HODU ACADEMY • PREPARING CLASSROOM..."
        />
      </div>
    </div>
  )
}
