'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import FeatureBookCard, { LearningFeature } from './FeatureBookCard'

interface FeatureCardsCarouselProps {
  features: LearningFeature[]
}

export default function FeatureCardsCarousel({ features }: FeatureCardsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const checkScroll = () => {
    if (!containerRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)

    const cardWidth = clientWidth * 0.82 + 20
    const currentIdx = Math.round(scrollLeft / (cardWidth || 1))
    setActiveIndex(Math.min(features.length - 1, Math.max(0, currentIdx)))
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
  }, [features])

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return
    const { clientWidth } = containerRef.current
    const scrollAmount = clientWidth > 768 ? clientWidth * 0.5 : clientWidth * 0.85
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const scrollToIndex = (idx: number) => {
    if (!containerRef.current) return
    const { clientWidth } = containerRef.current
    const cardWidth = clientWidth * 0.82 + 20
    containerRef.current.scrollTo({
      left: idx * cardWidth,
      behavior: 'smooth',
    })
  }

  return (
    <div className="relative group/carousel w-full">
      {/* Previous `<` Floating Circular Button (Desktop only, no overlap on mobile) */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous features"
        className={`hidden sm:flex absolute -left-4 md:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-neutral-200/90 text-brand-maroon items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 transform -translate-x-0.5" />
      </button>

      {/* Next `>` Floating Circular Button (Desktop only, no overlap on mobile) */}
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next features"
        className={`hidden sm:flex absolute -right-4 md:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-neutral-200/90 text-brand-maroon items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 transform translate-x-0.5" />
      </button>

      {/* Horizontal Scrollable Container (snaps on mobile, 4 columns on desktop) */}
      <div
        ref={containerRef}
        className="flex lg:grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 overflow-x-auto lg:overflow-visible scroll-smooth snap-x snap-mandatory py-3 px-2 -mx-2 no-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="w-[84vw] sm:w-[320px] md:w-[340px] lg:w-full shrink-0 snap-center h-full"
          >
            <FeatureBookCard feature={feature} index={idx} />
          </div>
        ))}
      </div>

      {/* Mobile Swipe Pagination Dots (clean & elegant) */}
      <div className="flex sm:hidden justify-center items-center gap-2 mt-4">
        {features.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === i
                ? 'w-6 h-2 bg-brand-maroon'
                : 'w-2 h-2 bg-brand-border hover:bg-brand-muted/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
