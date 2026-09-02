'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Images } from 'lucide-react'
import Link from 'next/link'
import { normalizeImageUrl } from '@/lib/imageUtils'

export interface LifePhoto {
  id?: string
  image_url: string
  alt?: string
}

interface LifeAtHoduCarouselProps {
  photos: LifePhoto[]
}

export default function LifeAtHoduCarousel({ photos }: LifeAtHoduCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Grab & Drag Scroll State
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftPos, setScrollLeftPos] = useState(0)

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
  }, [photos])

  // Continuous auto-scroll (pauses on hover or mouse drag)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let animationFrameId: number
    const speed = 0.55 // smooth scroll velocity

    const autoScroll = () => {
      if (!isHovered && !isDragging && el) {
        el.scrollLeft += speed
        // Seamless loop wrap-around
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll)
    }

    animationFrameId = requestAnimationFrame(autoScroll)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isHovered, isDragging])

  // Mouse Grab & Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeftPos(containerRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 1.6
    containerRef.current.scrollLeft = scrollLeftPos - walk
  }

  const handleMouseUpOrLeave = () => {
    setIsDragging(false)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return
    const { clientWidth } = containerRef.current
    const scrollAmount = clientWidth * 0.7
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  // Duplicate photos array for infinite looping animation (avoiding excessive DOM nodes)
  const displayPhotos =
    photos.length >= 6
      ? [...photos, ...photos]
      : photos.length >= 2
      ? [...photos, ...photos, ...photos]
      : photos

  return (
    <div className="w-full relative group/carousel overflow-hidden">
      {/* Left Gradient Edge Fade (Desktop) */}
      <div className="hidden sm:block absolute left-0 inset-y-0 w-16 lg:w-28 bg-gradient-to-r from-brand-blush via-brand-blush/80 to-transparent z-20 pointer-events-none" />

      {/* Right Gradient Edge Fade (Desktop) */}
      <div className="hidden sm:block absolute right-0 inset-y-0 w-16 lg:w-28 bg-gradient-to-l from-brand-blush via-brand-blush/80 to-transparent z-20 pointer-events-none" />

      {/* Previous `<` Floating Button */}
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous photos"
        className={`absolute left-3 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-13 lg:h-13 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-neutral-200 text-brand-maroon flex items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-108 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronLeft className="h-6 w-6 transform -translate-x-0.5" />
      </button>

      {/* Next `>` Floating Button */}
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next photos"
        className={`absolute right-3 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-13 lg:h-13 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-neutral-200 text-brand-maroon flex items-center justify-center transition-all duration-300 hover:bg-brand-maroon hover:text-white hover:scale-108 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer ${
          canScrollRight ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronRight className="h-6 w-6 transform translate-x-0.5" />
      </button>

      {/* ─── Horizontal Image Ribbon (Pure Images Without Text) ─── */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          handleMouseUpOrLeave()
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        className={`flex items-center gap-4 sm:gap-6 overflow-x-auto scrollbar-none no-scrollbar py-4 px-4 sm:px-8 lg:px-16 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollBehavior: isDragging ? 'auto' : 'smooth' }}
      >
        {displayPhotos.map((photo, idx) => (
          <div
            key={idx}
            className="group/photo relative shrink-0 w-[270px] sm:w-[350px] lg:w-[380px] h-[200px] sm:h-[240px] lg:h-[260px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border-2 border-brand-maroon/10 hover:border-brand-maroon/30 transition-all duration-500 ease-out hover:scale-[1.02] bg-neutral-100"
          >
            <img
              src={normalizeImageUrl(photo.image_url)}
              alt={photo.alt || `Life at Hodu Academy ${idx + 1}`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget
                if (target.src.includes('googleusercontent.com/d/')) {
                  const id = target.src.split('/d/')[1]
                  target.src = `/api/proxy-image?id=${id}`
                }
              }}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/photo:scale-108"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
