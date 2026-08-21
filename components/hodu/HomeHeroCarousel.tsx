'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
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

export default function HomeHeroCarousel({ ctaText, ctaLink, stats, heroTitleHtml, heroSubtitleHtml, heroImage, initialSlides }: HomeHeroCarouselProps) {
  const dbFallbackSlide: CarouselSlide = {
    image: heroImage || defaultFallbackSlide.image,
    headingHtml: heroTitleHtml || defaultFallbackSlide.headingHtml,
    subtitleHtml: heroSubtitleHtml || defaultFallbackSlide.subtitleHtml,
    headingSize: 'large', headingWeight: 'bold', subtitleSize: 'medium', subtitleWeight: 'light',
    imageOpacity: 100,
  }

  const [slides] = useState<CarouselSlide[]>(initialSlides && initialSlides.length > 0 ? initialSlides : [dbFallbackSlide])
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [next, slides.length])

  const s = slides[current]

  return (
    <section className="relative bg-white border-b border-brand-border py-14 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">

            {/* Editorial Headline */}
            <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-brand-maroon leading-[1.15] tracking-tight">
              Where Academic Rigor Shapes <span className="underline decoration-brand-maroon/30 underline-offset-8">India's Top Ranks</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed max-w-xl">
              Syllabus-focused coaching for International (Cambridge IGCSE & IB) and National Boards (CBSE, JEE, NEET). Small 1:12 batches, continuous diagnostic mock testing, and daily 1-on-1 doubt clearing.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href={ctaLink || '/courses'}
                className="bg-brand-maroon hover:bg-brand-crimson text-white font-bold px-8 py-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 text-sm tracking-wide"
              >
                <span>{ctaText || 'Explore Programs 2025–26'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="bg-white hover:bg-neutral-50 text-brand-maroon border-2 border-brand-maroon font-bold px-7 py-4 rounded-xl shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Book Diagnostic Test</span>
                <Calendar className="h-4 w-4 text-brand-maroon" />
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-brand-border max-w-lg">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-brand-maroon block font-display-modern">15,000+</span>
                <span className="text-xs text-neutral-600 font-semibold uppercase tracking-wider mt-1 block">Students Mentored</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-brand-maroon block font-display-modern">99.4%</span>
                <span className="text-xs text-neutral-600 font-semibold uppercase tracking-wider mt-1 block">Top Board Score</span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-brand-maroon block font-display-modern">1 : 12</span>
                <span className="text-xs text-neutral-600 font-semibold uppercase tracking-wider mt-1 block">Batch Ratio</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Campus & Classroom Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border-2 border-brand-border bg-white shadow-md p-2">
              <img
                src={s.image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop&auto=format"}
                alt="Hodu Academy Classroom"
                className="w-full h-80 sm:h-96 object-cover rounded-xl"
              />
              <div className="p-4 bg-white flex items-center justify-between border-t border-brand-border mt-2">
                <div>
                  <span className="text-[11px] font-bold text-brand-maroon uppercase tracking-wider block">Jaipur Main Campus</span>
                  <p className="text-xs text-neutral-600">Smart Air-Conditioned Digital Amphitheatres</p>
                </div>
                <Link href="/offline" className="text-xs font-bold text-brand-maroon hover:underline flex items-center gap-1">
                  Tour Campus →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
