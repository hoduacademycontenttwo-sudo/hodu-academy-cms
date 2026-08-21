'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  Trophy,
  Award,
  Sparkles,
  MapPin,
  CheckCircle2
} from 'lucide-react'
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

interface BannerSlide {
  tag: string
  tagIcon: any
  title: string
  highlight: string
  subtitle: string
  primaryCtaText: string
  primaryCtaLink: string
  secondaryCtaText: string
  secondaryCtaLink: string
  image: string
  badgeText: string
}

const defaultBanners: BannerSlide[] = [
  {
    tag: 'ADMISSIONS OPEN 2025–26',
    tagIcon: GraduationCap,
    title: 'Where Academic Rigor Shapes',
    highlight: "India's Top Ranks",
    subtitle: 'Syllabus-focused coaching for Cambridge (IGCSE & A-Levels), IB Diploma, CBSE, IIT-JEE and NEET. Small 1:12 batches, daily doubt clearing, and continuous diagnostic testing.',
    primaryCtaText: 'Explore Academic Programs',
    primaryCtaLink: '/courses',
    secondaryCtaText: 'Book Diagnostic Test',
    secondaryCtaLink: '/contact',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=850&fit=crop&auto=format',
    badgeText: 'Cambridge · IB · CBSE · JEE · NEET',
  },
  {
    tag: 'JAIPUR PHYSICAL CAMPUS',
    tagIcon: Building2,
    title: 'Distraction-Free Learning Built for',
    highlight: 'Deep Focus & Mastery',
    subtitle: 'Air-conditioned digital amphitheatres, dedicated 1-on-1 faculty doubt cells, 8 AM–8 PM reference library, and GPS-tracked AC transit across Jaipur.',
    primaryCtaText: 'Tour Jaipur Campus',
    primaryCtaLink: '/offline',
    secondaryCtaText: 'Schedule Center Visit',
    secondaryCtaLink: '/contact',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&h=850&fit=crop&auto=format',
    badgeText: 'C-Scheme & Vaishali Nagar Center',
  },
  {
    tag: 'PROVEN RESULTS & ACHIEVERS',
    tagIcon: Trophy,
    title: 'Celebrating Top Percentiles &',
    highlight: 'All-India Board Scores',
    subtitle: 'Over 15,000 students mentored with a 99.4% highest board mark, AIR 142 in JEE Advanced, 8x A* in Cambridge IGCSE, and 44/45 in IB Diploma Programme.',
    primaryCtaText: 'View Success Stories',
    primaryCtaLink: '/about',
    secondaryCtaText: 'Reserve Batch Seat',
    secondaryCtaLink: '/enroll',
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&h=850&fit=crop&auto=format',
    badgeText: '15,000+ Students Mentored',
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
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const slides = defaultBanners

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(next, 6000)
    return () => clearInterval(interval)
  }, [next, isPaused])

  const currentSlide = slides[current]
  const TagIcon = currentSlide.tagIcon

  return (
    <section className="bg-white border-b border-brand-border">
      
      {/* Banner Carousel Container */}
      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative rounded-3xl overflow-hidden border-2 border-brand-border bg-brand-maroon text-white shadow-xl min-h-[460px] sm:min-h-[520px] lg:min-h-[560px] flex items-center">
          
          {/* Background Photography with High-Legibility Dark Overlay */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              key={currentSlide.image}
              className="w-full h-full object-cover object-center opacity-30 scale-105 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-maroon via-brand-maroon/90 to-brand-maroon/70 md:via-brand-maroon/85 md:to-transparent" />
            <div className="absolute inset-0 bg-black/25" />
          </div>

          {/* Banner Content Grid */}
          <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 py-12 sm:py-16 grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Category Tag */}
              <div className="inline-flex items-center gap-2 bg-white text-brand-maroon px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xs">
                <TagIcon className="h-3.5 w-3.5" />
                <span>{currentSlide.tag}</span>
              </div>

              {/* Serif Headline */}
              <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.18] text-white tracking-tight">
                {currentSlide.title}{' '}
                <span className="text-white underline decoration-white/40 underline-offset-8">
                  {currentSlide.highlight}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-white/90 font-normal leading-relaxed max-w-2xl">
                {currentSlide.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
                <Link
                  href={currentSlide.primaryCtaLink}
                  className="bg-white hover:bg-neutral-100 text-brand-maroon font-bold px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{currentSlide.primaryCtaText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={currentSlide.secondaryCtaLink}
                  className="bg-brand-maroon/80 hover:bg-brand-maroon text-white border-2 border-white/80 hover:border-white font-bold px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>{currentSlide.secondaryCtaText}</span>
                  <Calendar className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Badge info */}
              <div className="pt-2 flex items-center gap-2 text-xs text-white/80">
                <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
                <span className="font-medium tracking-wide">{currentSlide.badgeText}</span>
              </div>
            </div>

            {/* Right Interactive Thumbnail / Campus Tag */}
            <div className="hidden lg:flex lg:col-span-4 justify-end">
              <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-5 text-white max-w-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                    Hodu Benchmark
                  </span>
                  <span className="text-[10px] font-bold bg-white text-brand-maroon px-2 py-0.5 rounded">
                    0{current + 1} / 0{slides.length}
                  </span>
                </div>
                <p className="font-serif-editorial font-bold text-lg text-white leading-snug">
                  {currentSlide.badgeText}
                </p>
                <p className="text-xs text-white/80 leading-relaxed font-light">
                  Tailored curriculum delivery with master educators, past 10-year paper archives, and 1:1 doubt support.
                </p>
                <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs font-bold">
                  <Link href="/courses" className="hover:underline flex items-center gap-1">
                    Explore All <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* Left & Right Arrow Navigation */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-brand-maroon hover:bg-neutral-100 flex items-center justify-center shadow-lg transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-brand-maroon hover:bg-neutral-100 flex items-center justify-center shadow-lg transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Bottom Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  current === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Trust & Academic Excellence Statistics Ribbon */}
      <div className="border-t border-brand-border bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center md:text-left border-r last:border-r-0 border-brand-border pr-4">
              <span className="text-2xl sm:text-3xl font-bold text-brand-maroon block font-serif-editorial">
                15,000+
              </span>
              <span className="text-xs text-neutral-600 font-semibold uppercase tracking-wider mt-0.5 block">
                Students Mentored
              </span>
            </div>
            <div className="text-center md:text-left border-r last:border-r-0 border-brand-border pr-4">
              <span className="text-2xl sm:text-3xl font-bold text-brand-maroon block font-serif-editorial">
                99.4%
              </span>
              <span className="text-xs text-neutral-600 font-semibold uppercase tracking-wider mt-0.5 block">
                Highest Board Score
              </span>
            </div>
            <div className="text-center md:text-left border-r last:border-r-0 border-brand-border pr-4">
              <span className="text-2xl sm:text-3xl font-bold text-brand-maroon block font-serif-editorial">
                1 : 12
              </span>
              <span className="text-xs text-neutral-600 font-semibold uppercase tracking-wider mt-0.5 block">
                Intimate Batch Ratio
              </span>
            </div>
            <div className="text-center md:text-left">
              <span className="text-2xl sm:text-3xl font-bold text-brand-maroon block font-serif-editorial">
                100%
              </span>
              <span className="text-xs text-neutral-600 font-semibold uppercase tracking-wider mt-0.5 block">
                Concept Retention
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
