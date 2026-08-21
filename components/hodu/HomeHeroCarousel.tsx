'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { CarouselSlide, defaultFallbackSlide } from '@/lib/homeCarousel'

interface HomeHeroCarouselProps {
  ctaText: string
  ctaLink: string
  stats: { label: string; value: string }[]
  heroTitleHtml?: string
  heroSubtitleHtml?: string
  heroImage?: string
  initialSlides?: CarouselSlide[]
}

const hardcodedSlides: { image: string; headline: string; subtitle: string }[] = [
  {
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1800&h=900&fit=crop&auto=format',
    headline: 'Where Academic Rigor Shapes India\'s Top Ranks',
    subtitle: 'Cambridge IGCSE · IB Diploma · CBSE · IIT-JEE · NEET — Small 1:12 batches with daily doubt clearing.',
  },
  {
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1800&h=900&fit=crop&auto=format',
    headline: 'Smart Classrooms Built for Deep Focus',
    subtitle: 'Air-conditioned digital amphitheatres, 1-on-1 faculty doubt desks, and 8 AM–8 PM reference library.',
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1800&h=900&fit=crop&auto=format',
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
  // Build slides array: prefer admin-uploaded carousel slides, then fall back to hardcoded
  const bannerSlides = (() => {
    if (initialSlides && initialSlides.length > 0) {
      return initialSlides.map((s, i) => ({
        image: s.image || hardcodedSlides[i % hardcodedSlides.length].image,
        headline: s.headingHtml || hardcodedSlides[i % hardcodedSlides.length].headline,
        subtitle: s.subtitleHtml || hardcodedSlides[i % hardcodedSlides.length].subtitle,
        isHtml: !!(s.headingHtml && s.headingHtml.includes('<')),
      }))
    }
    // If admin set a single hero image/title, use that as slide 1
    if (heroImage || heroTitleHtml) {
      return [{
        image: heroImage || hardcodedSlides[0].image,
        headline: heroTitleHtml || hardcodedSlides[0].headline,
        subtitle: heroSubtitleHtml || hardcodedSlides[0].subtitle,
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

  return (
    <section
      className="relative w-full bg-brand-wine text-white overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Full-width background image */}
      <div className="absolute inset-0 z-0">
        <img
          key={slide.image}
          src={slide.image}
          alt=""
          className="w-full h-full object-cover object-center opacity-25 transition-opacity duration-700"
        />
        {/* Solid dark overlay — NO gradient */}
        <div className="absolute inset-0 bg-brand-wine/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="max-w-2xl space-y-5">
          {/* Headline */}
          {slide.isHtml ? (
            <h1
              className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-white"
              dangerouslySetInnerHTML={{ __html: slide.headline }}
            />
          ) : (
            <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-white">
              {slide.headline}
            </h1>
          )}

          {/* Subtitle */}
          {slide.isHtml && slide.subtitle.includes('<') ? (
            <p
              className="text-base sm:text-lg text-white/85 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: slide.subtitle }}
            />
          ) : (
            <p className="text-base sm:text-lg text-white/85 leading-relaxed">
              {slide.subtitle}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={ctaLink || '/courses'}
              className="bg-white hover:bg-brand-blush text-brand-maroon font-bold px-6 py-3 rounded-lg text-sm transition-all flex items-center gap-2"
            >
              {ctaText || 'Explore Programs'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white/70 hover:border-white text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all flex items-center gap-2"
            >
              Book Free Consultation
              <Calendar className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Slide navigation */}
        {bannerSlides.length > 1 && (
          <div className="flex items-center gap-3 mt-10">
            {bannerSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  current === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
            <span className="text-xs text-white/50 font-medium ml-2">
              {String(current + 1).padStart(2, '0')} / {String(bannerSlides.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Prev / Next arrows */}
      {bannerSlides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
    </section>
  )
}
