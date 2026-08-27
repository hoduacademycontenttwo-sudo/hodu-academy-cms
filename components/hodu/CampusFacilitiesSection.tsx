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
    const speed = 0.6 // pixels per frame

    const autoScroll = () => {
      if (!isHovered && el) {
        el.scrollLeft += speed
        // Wrap around seamlessly
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
    const scrollAmount = clientWidth * 0.7
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <div className="w-full">
      {/* ─── Mobile View: All Cards In Grid (Constrained Container) ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
          {facilities.map((item, idx) => (
            <div key={idx} className="w-full">
              <CampusFacilityCard item={item} />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Desktop View: Full-Bleed Edge-to-Edge Moving Horizontal Showcase ─── */}
      <div
        className="hidden md:block relative group/carousel w-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Gradient Edge Fade */}
        <div className="absolute left-0 inset-y-0 w-16 lg:w-24 bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent z-20 pointer-events-none" />

        {/* Right Gradient Edge Fade */}
        <div className="absolute right-0 inset-y-0 w-16 lg:w-24 bg-gradient-to-l from-brand-bg via-brand-bg/80 to-transparent z-20 pointer-events-none" />

        {/* Previous `<` Floating Circular Button */}
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Previous facility cards"
          className={`absolute left-3 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/95 backdrop-blur-md shadow-2xl border border-neutral-200 text-brand-maroon flex items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-108 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ChevronLeft className="h-6 w-6 transform -translate-x-0.5" />
        </button>

        {/* Next `>` Floating Circular Button */}
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Next facility cards"
          className={`absolute right-3 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-white/95 backdrop-blur-md shadow-2xl border border-neutral-200 text-brand-maroon flex items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-108 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ChevronRight className="h-6 w-6 transform translate-x-0.5" />
        </button>

        {/* Horizontal Moving Scroll Track */}
        <div
          ref={containerRef}
          className="flex items-stretch gap-6 overflow-x-auto scrollbar-none no-scrollbar py-4 px-6 lg:px-16"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Double or triple list for infinite seamless loop */}
          {(facilities.length >= 3 ? [...facilities, ...facilities, ...facilities] : facilities).map((item, idx) => (
            <div key={idx} className="w-[330px] sm:w-[350px] shrink-0 h-full">
              <CampusFacilityCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
