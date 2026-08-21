'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { CarouselSlide } from '@/lib/homeCarousel'

interface HomeHeroCarouselProps {
  ctaText: string
  ctaLink: string
  stats: { label: string; value: string }[]
  heroTitleHtml?: string
  heroSubtitleHtml?: string
  heroImage?: string
  initialSlides?: CarouselSlide[]
}

const hardcodedSlides: { image: string; headline?: string; subtitle?: string }[] = [
  {
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1800&h=800&fit=crop&auto=format',
    headline: 'Where Academic Rigor Shapes India\'s Top Ranks',
    subtitle: 'Cambridge IGCSE · IB Diploma · CBSE · IIT-JEE · NEET — Small 1:12 batches with daily doubt clearing.',
  },
  {
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1800&h=800&fit=crop&auto=format',
    headline: 'Smart Classrooms Built for Deep Focus',
    subtitle: 'Air-conditioned digital amphitheatres, 1-on-1 faculty doubt desks, and 8 AM–8 PM reference library.',
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1800&h=800&fit=crop&auto=format',
    headline: 'Celebrating 15,000+ Students Mentored',
    subtitle: '99.4% highest board score · AIR 142 JEE Advanced · 8× A* in Cambridge IGCSE · 44/45 IB DP.',
  },
]

export default function HomeHeroCarousel({
  ctaText,
  ctaLink,
  stats,
  heroTitleHtml,
  heroSubtitleHtml,
  heroImage,
  initialSlides,
}: HomeHeroCarouselProps) {
  const bannerSlides = (() => {
    if (initialSlides && initialSlides.length > 0) {
      return initialSlides.map((s, i) => ({
        image: s.image || hardcodedSlides[i % hardcodedSlides.length].image,
        headline: s.headingHtml || '',
        subtitle: s.subtitleHtml || '',
        isHtml: !!(s.headingHtml && s.headingHtml.includes('<')),
      }))
    }
    if (heroImage || heroTitleHtml) {
      return [{
        image: heroImage || hardcodedSlides[0].image,
        headline: heroTitleHtml || '',
        subtitle: heroSubtitleHtml || '',
        isHtml: !!(heroTitleHtml && heroTitleHtml.includes('<')),
      }, ...hardcodedSlides.slice(1).map(s => ({ ...s, isHtml: false }))]
    }
    return hardcodedSlides.map(s => ({ ...s, isHtml: false }))
  })()

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent(c => (c + 1) % bannerSlides.length), [bannerSlides.length])
  const prev = useCallback(() => setCurrent(c => (c - 1 + bannerSlides.length) % bannerSlides.length), [bannerSlides.length])

  useEffect(() => {
    if (paused || bannerSlides.length <= 1) return
    const id = setInterval(next, 5500)
    return () => clearInterval(id)
  }, [next, paused, bannerSlides.length])

  const slide = bannerSlides[current]
  const hasText = Boolean(slide.headline?.trim() || slide.subtitle?.trim())

  return (
    <section
      className="relative w-full overflow-hidden bg-neutral-900 min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] flex items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Pure background banner image — 100% full opacity, no maroon tint/overlay */}
      <div className="absolute inset-0 z-0">
        {bannerSlides.map((s, idx) => (
          <img
            key={idx}
            src={s.image}
            alt={s.headline || `Banner slide ${idx + 1}`}
            className={`w-full h-full object-cover object-center absolute inset-0 transition-opacity duration-700 ${
              idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        ))}
      </div>

      {/* Optional text overlay if slide has headline/subtitle */}
      {hasText && (
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="max-w-2xl bg-black/40 backdrop-blur-xs p-6 sm:p-8 rounded-2xl space-y-4">
            {slide.isHtml ? (
              <h1
                className="font-serif-editorial text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow-md"
                dangerouslySetInnerHTML={{ __html: slide.headline || '' }}
              />
            ) : (
              <h1 className="font-serif-editorial text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white drop-shadow-md">
                {slide.headline}
              </h1>
            )}

            {slide.subtitle && (
              slide.isHtml && slide.subtitle.includes('<') ? (
                <p
                  className="text-sm sm:text-base text-white/90 leading-relaxed drop-shadow"
                  dangerouslySetInnerHTML={{ __html: slide.subtitle }}
                />
              ) : (
                <p className="text-sm sm:text-base text-white/90 leading-relaxed drop-shadow">
                  {slide.subtitle}
                </p>
              )
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={ctaLink || '/courses'}
                className="bg-white hover:bg-neutral-100 text-brand-maroon font-bold px-5 py-2.5 rounded-lg text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
              >
                {ctaText || 'Explore Programs'}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact"
                className="bg-brand-maroon/90 hover:bg-brand-maroon text-white font-semibold px-4 py-2.5 rounded-lg text-xs transition-all flex items-center gap-2"
              >
                Free Consultation
                <Calendar className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Slide dots indicators */}
      {bannerSlides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-full">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                current === idx ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
          <span className="text-[10px] text-white/80 font-mono ml-1.5">
            {String(current + 1).padStart(2, '0')}/{String(bannerSlides.length).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Navigation arrows */}
      {bannerSlides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all shadow-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all shadow-md"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </section>
  )
}
