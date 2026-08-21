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
    <section className="relative min-h-[620px] lg:min-h-[680px] overflow-hidden border-b border-brand-border bg-gradient-to-b from-brand-bg via-white to-brand-bg academic-grid-pattern">
      {/* Background slide ambient image with dark overlay */}
      {slides.map((sl, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-35' : 'opacity-0'}`}>
          <img src={sl.image} alt="" className="w-full h-full object-cover object-center filter saturate-75" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/85 to-white/70" />
        </div>
      ))}

      {/* Hero Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left: Editorial Content */}
          <div key={current} className="lg:col-span-7 space-y-6 animate-fade-in">
            {/* Academic Accreditation Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-brand-maroon/20 px-4 py-2 rounded-full text-brand-maroon text-xs font-black shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-maroon animate-pulse shrink-0" />
              <span className="tracking-wider uppercase text-[11px] text-brand-navy font-black">
                ESTD. 2018 · JAIPUR MAIN CAMPUS
              </span>
              <span className="text-brand-border">|</span>
              <span className="text-brand-maroon font-bold text-[11px]">IGCSE · IB · CBSE · JEE · NEET</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-brand-navy leading-[1.14] tracking-tight">
              Where Academic Rigor Shapes <span className="italic font-normal text-brand-maroon underline decoration-brand-maroon/30 underline-offset-8">India's Top Ranks</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-brand-navy/80 font-light leading-relaxed max-w-xl">
              Syllabus-focused coaching for International (Cambridge IGCSE & IB) and National Boards (CBSE, JEE, NEET). Small 1:12 batches, continuous diagnostic mock testing, and daily 1-on-1 doubt clearing.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link href={ctaLink || '/courses'}
                className="bg-brand-maroon hover:bg-brand-crimson text-white font-extrabold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 text-sm tracking-wide">
                <span>Explore Programs 2025–26</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact"
                className="bg-white/90 hover:bg-brand-cream text-brand-navy border border-brand-border font-bold px-7 py-4 rounded-xl shadow-xs hover:shadow transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm">
                <span>Book Diagnostic Test</span>
                <Calendar className="h-4 w-4 text-brand-maroon" />
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-brand-border max-w-lg">
              <div>
                <span className="text-xl sm:text-2xl font-black text-brand-maroon block">15,000+</span>
                <span className="text-[11px] text-brand-navy/60 font-semibold uppercase tracking-wider">Students Mentored</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-brand-maroon block">99.4%</span>
                <span className="text-[11px] text-brand-navy/60 font-semibold uppercase tracking-wider">Top Board Score</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-brand-maroon block">1 : 12</span>
                <span className="text-[11px] text-brand-navy/60 font-semibold uppercase tracking-wider">Batch Student Ratio</span>
              </div>
            </div>
          </div>

          {/* Right: Live Institutional Matrix Console */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-xl border border-brand-border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Decorative subtle header tag */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-brand-border">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-black uppercase tracking-widest text-brand-navy">Admissions Console</span>
                </div>
                <span className="bg-brand-bg text-brand-maroon font-bold text-[10px] uppercase px-2.5 py-1 rounded-full border border-brand-border">
                  Session 2025–26
                </span>
              </div>

              {/* Batch availability tracker */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold text-brand-navy/60 uppercase tracking-wider">Current Cohort Availability</h4>
                
                <div className="bg-brand-bg/70 border border-brand-border/80 rounded-2xl p-3.5 flex items-center justify-between hover:border-brand-maroon/40 transition-colors">
                  <div>
                    <h5 className="font-extrabold text-xs text-brand-navy">Cambridge IGCSE (Class 9 & 10)</h5>
                    <p className="text-[11px] text-brand-navy/60">Physics, Chem, Bio, Math (0580/0607)</p>
                  </div>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0">
                    3 Seats Left
                  </span>
                </div>

                <div className="bg-brand-bg/70 border border-brand-border/80 rounded-2xl p-3.5 flex items-center justify-between hover:border-brand-maroon/40 transition-colors">
                  <div>
                    <h5 className="font-extrabold text-xs text-brand-navy">IB Diploma Programme (HL & SL)</h5>
                    <p className="text-[11px] text-brand-navy/60">Math AA/AI, Sciences, Economics, IA Prep</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0">
                    Admissions Open
                  </span>
                </div>

                <div className="bg-brand-bg/70 border border-brand-border/80 rounded-2xl p-3.5 flex items-center justify-between hover:border-brand-maroon/40 transition-colors">
                  <div>
                    <h5 className="font-extrabold text-xs text-brand-navy">JEE & NEET 2-Year Integrated</h5>
                    <p className="text-[11px] text-brand-navy/60">Class 11 & 12 + Intensive Mock Labs</p>
                  </div>
                  <span className="bg-red-100 text-red-900 border border-red-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0">
                    Fast Filling
                  </span>
                </div>
              </div>

              {/* Verified Result Spotlight */}
              <div className="bg-brand-navy text-white rounded-2xl p-4 flex items-center gap-3.5 mb-5 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-brand-maroon flex items-center justify-center font-black text-white text-base shrink-0 ring-2 ring-brand-gold/60">
                  99%
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold block">Hall of Fame Spotlight</span>
                  <p className="text-xs font-extrabold text-white">Devansh Sharma · Jayshree Periwal</p>
                  <p className="text-[10px] text-white/60">IGCSE 8x A* Marks · Full Course Alum</p>
                </div>
              </div>

              {/* Action */}
              <Link href="/enroll"
                className="w-full bg-brand-navy hover:bg-brand-maroon text-white font-extrabold py-3.5 rounded-xl text-center block text-xs uppercase tracking-wider transition-colors shadow">
                Reserve Seat in Target Batch →
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Slider dots for switching background visual */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2 bg-brand-maroon' : 'w-2 h-2 bg-brand-navy/20 hover:bg-brand-navy/40'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
