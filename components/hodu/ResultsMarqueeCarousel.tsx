'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ResultRankerCard, { Ranker } from './ResultRankerCard'

interface ResultsMarqueeCarouselProps {
  rankers: Ranker[]
}

export default function ResultsMarqueeCarousel({ rankers }: ResultsMarqueeCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Duplicate items to make an endless loop
  const displayItems = rankers.length > 0
    ? (rankers.length < 10 ? [...rankers, ...rankers, ...rankers, ...rankers] : [...rankers, ...rankers])
    : []

  const checkScroll = () => {
    if (!containerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = containerRef.current
    if (!el) return
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [rankers])

  // Continuous auto-scroll loop
  useEffect(() => {
    const el = containerRef.current
    if (!el || isPaused || rankers.length <= 3) return

    const interval = setInterval(() => {
      if (!el) return
      // When reached halfway (one full set), reset to start seamlessly
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0
      } else {
        el.scrollLeft += 1
      }
    }, 25)

    return () => clearInterval(interval)
  }, [isPaused, rankers.length])

  const scrollManual = (direction: 'left' | 'right') => {
    if (!containerRef.current) return
    const { clientWidth } = containerRef.current
    const scrollAmount = clientWidth > 768 ? clientWidth * 0.45 : clientWidth * 0.75
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (rankers.length === 0) return null

  // If very few rankers, center them nicely
  if (rankers.length <= 4) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 max-w-6xl mx-auto px-2">
        {rankers.map((ranker, idx) => (
          <div key={idx} className="w-[180px] sm:w-[200px] md:w-[210px] shrink-0">
            <ResultRankerCard ranker={ranker} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="relative group/results w-full overflow-hidden py-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* ─── Left & Right Fade Shadows ─── */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 md:w-28 bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 md:w-28 bg-gradient-to-l from-brand-bg via-brand-bg/80 to-transparent z-10" />

      {/* ─── Manual Navigation Previous Button ─── */}
      <button
        onClick={() => scrollManual('left')}
        aria-label="Previous rankers"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-neutral-200/90 text-brand-maroon flex items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-110 active:scale-95 opacity-0 group-hover/results:opacity-100 focus:opacity-100"
      >
        <ChevronLeft className="h-5 w-5 transform -translate-x-0.5" />
      </button>

      {/* ─── Manual Navigation Next Button ─── */}
      <button
        onClick={() => scrollManual('right')}
        aria-label="Next rankers"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-neutral-200/90 text-brand-maroon flex items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-110 active:scale-95 opacity-0 group-hover/results:opacity-100 focus:opacity-100"
      >
        <ChevronRight className="h-5 w-5 transform translate-x-0.5" />
      </button>

      {/* ─── Smooth Moving Results Track ─── */}
      <div
        ref={containerRef}
        className="flex items-center gap-4 sm:gap-5 md:gap-6 overflow-x-auto scroll-smooth no-scrollbar py-3 px-6"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {displayItems.map((ranker, idx) => (
          <div
            key={idx}
            className="w-[175px] sm:w-[195px] md:w-[210px] shrink-0"
          >
            <ResultRankerCard ranker={ranker} />
          </div>
        ))}
      </div>
    </div>
  )
}
