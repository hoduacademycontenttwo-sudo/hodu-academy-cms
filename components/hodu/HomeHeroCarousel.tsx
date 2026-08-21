'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { CarouselSlide, defaultFallbackSlide } from '@/lib/homeCarousel'

const sizeClass: Record<string, string> = {
  small: 'text-2xl sm:text-3xl',
  medium: 'text-3xl sm:text-4xl',
  large: 'text-4xl sm:text-5xl',
  xlarge: 'text-5xl sm:text-6xl',
}
const weightClass: Record<string, string> = {
  light: 'font-light',
  normal: 'font-normal',
  semibold: 'font-semibold',
  bold: 'font-bold',
  black: 'font-black',
}
const subSizeClass: Record<string, string> = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
  xlarge: 'text-xl',
}

interface HomeHeroCarouselProps {
  ctaText: string
  ctaLink: string
  stats: { label: string; value: string }[]
  heroTitleHtml?: string
  heroSubtitleHtml?: string
  heroImage?: string
  initialSlides?: CarouselSlide[]
}

export default function HomeHeroCarousel({ ctaText, ctaLink, stats, heroTitleHtml, heroSubtitleHtml, heroImage, initialSlides }: HomeHeroCarouselProps) {
  const dbFallbackSlide: CarouselSlide = {
    image: heroImage || defaultFallbackSlide.image,
    headingHtml: heroTitleHtml || defaultFallbackSlide.headingHtml,
    subtitleHtml: heroSubtitleHtml || defaultFallbackSlide.subtitleHtml,
    headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light',
    imageOpacity: 100,
  }

  // Slides are fetched server-side and passed in as a prop — no client fetch, no flash.
  const [slides] = useState<CarouselSlide[]>(initialSlides && initialSlides.length > 0 ? initialSlides : [dbFallbackSlide])
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const go = useCallback((index: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 700)
  }, [animating])

  const next = useCallback(() => go((current + 1) % slides.length), [current, go, slides.length])
  const prev = useCallback(() => go((current - 1 + slides.length) % slides.length), [current, go, slides.length])

  useEffect(() => {
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next])

  const s = slides[current]

  return (
    <section className="relative min-h-[560px] md:min-h-[620px] overflow-hidden border-b border-brand-border">
      {/* Slides */}
      {slides.map((sl, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
          <img src={sl.image} alt="" className="w-full h-full object-cover object-center" style={{ opacity: (sl.imageOpacity ?? 100) / 100 }} />
        </div>
      ))}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex items-center">
        <div key={current} className="max-w-2xl bg-white/85 backdrop-blur-md border border-brand-border/90 rounded-3xl p-6 sm:p-9 shadow-2xl animate-fade-in">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-brand-bg/90 border border-brand-border px-3.5 py-1.5 rounded-full text-brand-maroon text-xs font-bold mb-4 shadow-sm">
            <span className="flex items-center gap-1 text-amber-500 font-extrabold">
              ★ ★ ★ ★ ★
            </span>
            <span className="text-brand-navy/80 font-semibold">4.9/5 Rating</span>
            <span className="text-brand-border text-xs">•</span>
            <span className="text-brand-accent">15,000+ Students</span>
          </div>

          <h1
            className={`leading-[1.12] tracking-tight mb-4 text-brand-navy drop-shadow-sm ${sizeClass[s.headingSize] ?? sizeClass.large} ${weightClass[s.headingWeight] ?? weightClass.black}`}
            dangerouslySetInnerHTML={{ __html: s.headingHtml }}
          />

          {s.subtitleHtml && (
            <p
              className={`max-w-lg mb-7 text-brand-navy/75 leading-relaxed ${subSizeClass[s.subtitleSize] ?? subSizeClass.medium} ${weightClass[s.subtitleWeight] ?? weightClass.light}`}
              dangerouslySetInnerHTML={{ __html: s.subtitleHtml }}
            />
          )}

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 mb-6">
            <Link href={ctaLink}
              className="w-full sm:w-auto bg-brand-maroon hover:bg-brand-accent text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm tracking-wide">
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact"
              className="w-full sm:w-auto bg-white/90 hover:bg-brand-bg text-brand-navy border border-brand-border font-bold px-7 py-3.5 rounded-xl shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm">
              Free Callback
              <Calendar className="h-4 w-4 text-brand-maroon" />
            </Link>
          </div>

          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-5 border-t border-brand-border/80">
              {stats.slice(0, 3).map(st => (
                <div key={st.label} className="bg-brand-bg/60 rounded-xl p-2.5 text-center border border-brand-border/50">
                  <h3 className="text-xl sm:text-2xl font-black text-brand-maroon">{st.value}</h3>
                  <p className="text-[10px] sm:text-[11px] text-brand-navy/70 font-bold uppercase tracking-wider mt-0.5">{st.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Arrow controls */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="Previous slide" className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-brand-border rounded-full flex items-center justify-center text-brand-navy transition-all backdrop-blur-sm z-10 shadow-sm">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} aria-label="Next slide" className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-brand-border rounded-full flex items-center justify-center text-brand-navy transition-all backdrop-blur-sm z-10 shadow-sm">
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-brand-maroon' : 'w-2.5 h-2.5 bg-brand-navy/20 hover:bg-brand-navy/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
