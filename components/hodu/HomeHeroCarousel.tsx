'use client'

import { useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CarouselSlide, parseMediaUrl } from '@/lib/homeCarousel'

interface HomeHeroCarouselProps {
  ctaText?: string
  ctaLink?: string
  stats?: { label: string; value: string }[]
  heroTitleHtml?: string
  heroSubtitleHtml?: string
  heroImage?: string
  initialSlides?: CarouselSlide[]
}

const hardcodedSlides: { image: string; mediaType?: 'image' | 'video'; videoUrl?: string }[] = [
  {
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=700&fit=crop&auto=format',
    mediaType: 'image',
  },
  {
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=700&fit=crop&auto=format',
    mediaType: 'image',
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&h=700&fit=crop&auto=format',
    mediaType: 'image',
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
        mediaType: s.mediaType ?? 'image',
        videoUrl: s.videoUrl ?? '',
      }))
    }
    if (heroImage) {
      return [{ image: heroImage, mediaType: 'image' as const }, ...hardcodedSlides.slice(1)]
    }
    return hardcodedSlides
  })()

  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const currentSlide = bannerSlides[current]
  const currentMedia = parseMediaUrl(currentSlide?.videoUrl || currentSlide?.image || '')
  const isCurrentVideo = currentSlide?.mediaType === 'video' || currentMedia.type !== 'image'

  const next = useCallback(() => setCurrent(c => (c + 1) % bannerSlides.length), [bannerSlides.length])
  const prev = useCallback(() => setCurrent(c => (c - 1 + bannerSlides.length) % bannerSlides.length), [bannerSlides.length])

  useEffect(() => {
    // If the current slide is a video or user hovered, don't auto-rotate immediately
    if (paused || isCurrentVideo || bannerSlides.length <= 1) return
    const id = setInterval(next, 5500)
    return () => clearInterval(id)
  }, [next, paused, isCurrentVideo, bannerSlides.length])

  return (
    <section className="w-full max-w-full overflow-hidden bg-brand-maroon relative animate-hero-reveal">
      <div
        className="relative w-full min-h-[180px] sm:min-h-[240px] md:min-h-[300px] lg:min-h-[360px] aspect-[16/9] sm:aspect-[21/9] md:aspect-[1920/700] overflow-hidden bg-gradient-to-r from-brand-maroon via-brand-crimson to-brand-wine"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Subtle background brand placeholder */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="text-white text-2xl sm:text-4xl font-serif font-black tracking-widest uppercase">
            Hodu Academy
          </div>
        </div>

        {/* Carousel Slides */}
        {bannerSlides.map((s, idx) => {
          const media = parseMediaUrl(s.videoUrl || s.image || '')
          const isVideo = s.mediaType === 'video' || media.type !== 'image'
          const isCurrent = idx === current

          return (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              {isVideo ? (
                media.type === 'google_drive' ? (
                  <iframe
                    src={isCurrent ? media.embedUrl : ''}
                    title={`Google Drive Video Slide ${idx + 1}`}
                    className="w-full h-full border-0 absolute inset-0 bg-black"
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  />
                ) : media.type === 'youtube' ? (
                  <iframe
                    src={isCurrent ? media.embedUrl : ''}
                    title={`YouTube Video Slide ${idx + 1}`}
                    className="w-full h-full border-0 absolute inset-0 bg-black"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={s.videoUrl || s.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                    className="w-full h-full object-cover absolute inset-0 bg-black"
                  />
                )
              ) : (
                <img
                  src={s.image}
                  alt={`Banner ${idx + 1}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  fetchPriority={idx === 0 ? 'high' : 'auto'}
                  className="w-full h-full object-cover object-center absolute inset-0"
                />
              )}
            </div>
          )
        })}

        {/* Slide dots indicators */}
        {bannerSlides.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-1.5 bg-black/50 backdrop-blur-xs px-2.5 sm:px-3.5 py-1 rounded-full shadow-md">
            {bannerSlides.map((s, idx) => {
              const media = parseMediaUrl(s.videoUrl || s.image || '')
              const isVideo = s.mediaType === 'video' || media.type !== 'image'

              return (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Go to ${isVideo ? 'video ' : ''}slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    current === idx
                      ? 'w-5 sm:w-7 bg-white shadow-xs'
                      : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  title={isVideo ? 'Video Slide' : 'Image Slide'}
                />
              )
            })}
          </div>
        )}

        {/* Navigation arrows */}
        {bannerSlides.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </>
        )}
      </div>
    </section>
  )
}
