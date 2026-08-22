'use client'

import { useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CarouselSlide } from '@/lib/homeCarousel'

interface HomeHeroCarouselProps {
  ctaText?: string
  ctaLink?: string
  stats?: { label: string; value: string }[]
  heroTitleHtml?: string
  heroSubtitleHtml?: string
  heroImage?: string
  initialSlides?: CarouselSlide[]
}

const hardcodedSlides: { image: string }[] = [
  {
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=700&fit=crop&auto=format',
  },
  {
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=700&fit=crop&auto=format',
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&h=700&fit=crop&auto=format',
  },
]

export default function HomeHeroCarousel({
  heroImage,
  initialSlides,
}: HomeHeroCarouselProps) {
  const bannerSlides = (() => {
    if (initialSlides && initialSlides.length > 0) {
      return initialSlides.map((s, i) => ({
        image: s.image || hardcodedSlides[i % hardcodedSlides.length].image,
      }))
    }
    if (heroImage) {
      return [{ image: heroImage }, ...hardcodedSlides.slice(1)]
    }
    return hardcodedSlides
  })()

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent(c => (c + 1) % bannerSlides.length), [bannerSlides.length])
  const prev = useCallback(() => setCurrent(c => (c - 1 + bannerSlides.length) % bannerSlides.length), [bannerSlides.length])

  useEffect(() => {
    if (paused || bannerSlides.length <= 1) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next, paused, bannerSlides.length])

  return (
    <section className="w-full max-w-full overflow-hidden bg-brand-maroon relative animate-hero-reveal">
      <div
        className="relative w-full min-h-[160px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[340px] aspect-[16/9] sm:aspect-[21/9] md:aspect-[1920/700] overflow-hidden bg-gradient-to-r from-brand-maroon via-brand-crimson to-brand-wine"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Subtle background brand glow placeholder */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="text-white text-2xl sm:text-4xl font-serif font-black tracking-widest uppercase">
            Hodu Academy
          </div>
        </div>

        {/* Full-width 1920x700 aspect ratio banner image */}
        {bannerSlides.map((s, idx) => (
          <img
            key={idx}
            src={s.image}
            alt={`Banner ${idx + 1}`}
            loading={idx === 0 ? 'eager' : 'lazy'}
            fetchPriority={idx === 0 ? 'high' : 'auto'}
            className={`w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-500 ${
              idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        ))}

        {/* Slide dots indicators */}
        {bannerSlides.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-1.5 bg-black/40 backdrop-blur-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {bannerSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                  current === idx ? 'w-4 sm:w-6 bg-white' : 'w-1 sm:w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Navigation arrows */}
        {bannerSlides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center transition-all shadow-md"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-6 h-6 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center transition-all shadow-md"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            </button>
          </>
        )}
      </div>
    </section>
  )
}
