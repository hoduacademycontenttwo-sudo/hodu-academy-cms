'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import BatchHoverCard, { CurriculumTrack } from './BatchHoverCard'

interface BatchCardsCarouselProps {
  tracks: CurriculumTrack[]
}

export default function BatchCardsCarousel({ tracks }: BatchCardsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

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
  }, [tracks])

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return
    const { clientWidth } = containerRef.current
    // Scroll by roughly 1 card width or clientWidth * 0.8
    const scrollAmount = clientWidth > 768 ? clientWidth * 0.65 : clientWidth * 0.85
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative group/carousel w-full">
      {/* Previous `<` Floating Circular Button */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous programs"
        className={`absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-neutral-200/90 text-brand-maroon flex items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 transform -translate-x-0.5" />
      </button>

      {/* Next `>` Floating Circular Button */}
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next programs"
        className={`absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-neutral-200/90 text-brand-maroon flex items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 transform translate-x-0.5" />
      </button>

      {/* Horizontal Scrollable Cards Container */}
      <div
        ref={containerRef}
        className="flex gap-5 sm:gap-6 lg:gap-7 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 -mx-1 no-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {tracks.map((track, idx) => (
          <div
            key={idx}
            className="w-[85vw] sm:w-[340px] md:w-[360px] lg:w-[calc((100%-48px)/3)] shrink-0 snap-start h-full"
          >
            <BatchHoverCard track={track} />
          </div>
        ))}
      </div>
    </div>
  )
}
