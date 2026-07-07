'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/client'

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

const HEADING_COLOR = '#1B2A44', HIGHLIGHT_COLOR = '#7E0D0D', SUBTITLE_COLOR = '#475569'

const fallbackSlides = [
  {
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=800&fit=crop&auto=format',
    heading: 'Everything You Need To',
    highlight: 'Ace Your Exam In Place',
    subtitle: 'Top faculty · Live & recorded classes · Test series · Personal mentoring — all in one place.',
    headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light',
    headingColor: HEADING_COLOR, highlightColor: HIGHLIGHT_COLOR, subtitleColor: SUBTITLE_COLOR,
  },
  {
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&h=800&fit=crop&auto=format',
    heading: 'Expert Coaching For',
    highlight: 'IGCSE · IB · CBSE',
    subtitle: 'Specialised coaching across international and national boards with proven results year after year.',
    headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light',
    headingColor: HEADING_COLOR, highlightColor: HIGHLIGHT_COLOR, subtitleColor: SUBTITLE_COLOR,
  },
  {
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&h=800&fit=crop&auto=format',
    heading: "Crack India's Toughest",
    highlight: 'Entrance Exams',
    subtitle: 'JEE, NEET and Olympiad preparation with structured plans and daily practice problems.',
    headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light',
    headingColor: HEADING_COLOR, highlightColor: HIGHLIGHT_COLOR, subtitleColor: SUBTITLE_COLOR,
  },
]

interface HomeHeroCarouselProps {
  ctaText: string
  ctaLink: string
  stats: { label: string; value: string }[]
}

export default function HomeHeroCarousel({ ctaText, ctaLink, stats }: HomeHeroCarouselProps) {
  const [slides, setSlides] = useState(fallbackSlides)
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('cms_gallery')
      .select('image_url, caption, sort_order')
      .eq('site_id', HODU_SITE_ID)
      .eq('category', 'Home Carousel')
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSlides(data.map(d => {
            try {
              const t = JSON.parse(d.caption ?? '{}')
              return { image: d.image_url, heading: t.heading ?? '', highlight: t.highlight ?? '', subtitle: t.subtitle ?? '', headingSize: t.headingSize ?? 'large', headingWeight: t.headingWeight ?? 'black', subtitleSize: t.subtitleSize ?? 'medium', subtitleWeight: t.subtitleWeight ?? 'light', headingColor: t.headingColor ?? HEADING_COLOR, highlightColor: t.highlightColor ?? HIGHLIGHT_COLOR, subtitleColor: t.subtitleColor ?? SUBTITLE_COLOR }
            } catch {
              return { image: d.image_url, heading: d.caption ?? '', highlight: '', subtitle: '', headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light', headingColor: HEADING_COLOR, highlightColor: HIGHLIGHT_COLOR, subtitleColor: SUBTITLE_COLOR }
            }
          }))
          setCurrent(0)
        }
      })
  }, [])

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
          <img src={sl.image} alt="" className="w-full h-full object-cover object-center" />
        </div>
      ))}

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-24">
        <div key={current} className="max-w-2xl bg-white rounded-3xl p-5 sm:p-8 shadow-2xl animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-brand-bg border border-brand-border px-3 py-1.5 rounded-full text-brand-maroon text-xs font-semibold mb-4 sm:mb-5">
            <Sparkles className="h-3.5 w-3.5 animate-pulse shrink-0" />
            Learn from Syllabus-Focused content and stay fully exam ready.
          </div>

          <h1 className={`leading-[1.1] tracking-tight mb-4 sm:mb-5 ${sizeClass[s.headingSize] ?? sizeClass.large} ${weightClass[s.headingWeight] ?? weightClass.black}`} style={{ color: s.headingColor }}>
            {s.heading}{s.highlight && <> <span style={{ color: s.highlightColor }}>{s.highlight}</span></>}
          </h1>

          {s.subtitle && (
            <p className={`max-w-lg mb-6 sm:mb-8 leading-relaxed ${subSizeClass[s.subtitleSize] ?? subSizeClass.medium} ${weightClass[s.subtitleWeight] ?? weightClass.light}`} style={{ color: s.subtitleColor }}>
              {s.subtitle}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3 mb-6 sm:mb-8">
            <Link href={ctaLink}
              className="w-full sm:w-auto bg-brand-maroon hover:bg-brand-accent text-white font-bold px-7 py-3.5 rounded-xl shadow transition-all flex items-center justify-center gap-2 text-sm">
              {ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact"
              className="w-full sm:w-auto bg-brand-bg hover:bg-brand-border/40 text-brand-navy border border-brand-border font-semibold px-7 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm">
              Free Callback
              <Calendar className="h-4 w-4" />
            </Link>
          </div>

          {stats.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-5 sm:pt-6 border-t border-brand-border max-w-sm">
              {stats.slice(0, 3).map(st => (
                <div key={st.label}>
                  <h3 className="text-2xl font-black text-brand-maroon">{st.value}</h3>
                  <p className="text-[11px] text-brand-navy/60 font-semibold uppercase tracking-wider">{st.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dots — inline on mobile, sits below the card */}
        {slides.length > 1 && (
          <div className="flex sm:hidden justify-center gap-2.5 mt-5">
            {slides.map((_, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-brand-maroon' : 'w-2.5 h-2.5 bg-brand-navy/20 hover:bg-brand-navy/40'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Arrow controls — desktop/tablet only, mobile relies on dots + swipe */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} aria-label="Previous slide" className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-brand-border rounded-full items-center justify-center text-brand-navy transition-all backdrop-blur-sm z-10 shadow-sm">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} aria-label="Next slide" className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white border border-brand-border rounded-full items-center justify-center text-brand-navy transition-all backdrop-blur-sm z-10 shadow-sm">
            <ChevronRight size={18} />
          </button>

          {/* Dots — desktop/tablet absolute position */}
          <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 gap-2.5">
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
