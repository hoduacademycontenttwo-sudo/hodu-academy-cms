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
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1020&h=300&fit=crop&auto=format',
  },
  {
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1020&h=300&fit=crop&auto=format',
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1020&h=300&fit=crop&auto=format',
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
    <section className="w-full bg-brand-bg py-3 sm:py-6">
      <div className="max-w-[1020px] mx-auto px-3 sm:px-4">
        <div
          className="relative w-full aspect-[1020/300] rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100 border border-brand-border shadow-xs"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Pure background banner images sized to 1020x300 without text overlay or black box */}
          {bannerSlides.map((s, idx) => (
            <img
              key={idx}
              src={s.image}
              alt={`Banner ${idx + 1}`}
              className={`w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-500 ${
                idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
          ))}

          {/* Slide dots indicators */}
          {bannerSlides.length > 1 && (
            <div className="absolute bottom-2.5 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {bannerSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    current === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
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
                className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center transition-all shadow"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/35 hover:bg-black/60 text-white flex items-center justify-center transition-all shadow"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
