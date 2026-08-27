'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import CampusFacilityCard, { CampusFacilityItem } from './CampusFacilityCard'

interface CampusFacilitiesSectionProps {
  facilities: CampusFacilityItem[]
}

export default function CampusFacilitiesSection({ facilities }: CampusFacilitiesSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

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
  }, [facilities])

  // Auto-scroll loop for desktop horizontal movement (pauses on hover)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let animationFrameId: number
    const speed = 0.5 // pixels per tick

    const autoScroll = () => {
      if (!isHovered && el) {
        el.scrollLeft += speed
        // If reached end of first set, wrap around smoothly
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll)
    }

    animationFrameId = requestAnimationFrame(autoScroll)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isHovered])

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return
    const { clientWidth } = containerRef.current
    const scrollAmount = clientWidth * 0.65
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="w-full">
      {/* ─── Mobile View: All Cards In Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {facilities.map((item, idx) => (
          <div key={idx} className="w-full">
            <CampusFacilityCard item={item} />
          </div>
        ))}
      </div>

      {/* ─── Desktop View: Smooth Horizontal Moving Carousel ─── */}
      <div
        className="hidden md:block relative group/carousel w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Previous `<` Floating Circular Button */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Previous facility cards"
          className={`absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-neutral-200/90 text-brand-maroon flex items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6 transform -translate-x-0.5" />
        </button>

        {/* Next `>` Floating Circular Button */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Next facility cards"
          className={`absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-neutral-200/90 text-brand-maroon flex items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6 transform translate-x-0.5" />
        </button>

        {/* Horizontal Moving Scroll Track */}
        <div
          ref={containerRef}
          className="flex items-stretch gap-5 overflow-x-auto scrollbar-none no-scrollbar py-3 px-1"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Render doubled list for infinite loop effect if >= 3 cards */}
          {(facilities.length >= 3 ? [...facilities, ...facilities] : facilities).map((item, idx) => (
            <div key={idx} className="w-[330px] shrink-0 h-full">
              <CampusFacilityCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
