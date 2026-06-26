'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Phone, ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/client'

const sizeClass: Record<string, string> = {
  small: 'text-2xl sm:text-3xl',
  medium: 'text-3xl sm:text-4xl',
  large: 'text-4xl sm:text-5xl lg:text-6xl',
  xlarge: 'text-5xl sm:text-6xl lg:text-7xl',
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
  medium: 'text-base sm:text-lg',
  large: 'text-lg sm:text-xl',
  xlarge: 'text-xl sm:text-2xl',
}

const fallbackSlides = [
  {
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&h=700&fit=crop&auto=format',
    heading: 'Where Excellence Meets',
    highlight: 'Personal Attention',
    subtitle: 'Experience classroom learning at its best — expert faculty, structured curriculum, and a nurturing environment designed for every student to thrive.',
    headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light',
  },
  {
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&h=700&fit=crop&auto=format',
    heading: 'International Board Experts',
    highlight: 'Right Here in Jaipur',
    subtitle: 'Specialized coaching for Cambridge IGCSE, O Level and IB curricula with seasoned educators and proven results.',
    headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light',
  },
  {
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&h=700&fit=crop&auto=format',
    heading: "Crack India's Toughest",
    highlight: 'Entrance Exams',
    subtitle: 'Conceptual clarity, daily practice problems, and full mock test series — everything you need to top the charts.',
    headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light',
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&h=700&fit=crop&auto=format',
    heading: 'Tech-Enabled Learning',
    highlight: 'In Every Classroom',
    subtitle: 'Digital boards, projectors, and LMS-integrated classrooms — delivering the best of both worlds to every student.',
    headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light',
  },
]

export default function HeroCarousel() {
  const [slides, setSlides] = useState(fallbackSlides)
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('cms_gallery')
      .select('image_url, caption, sort_order')
      .eq('site_id', HODU_SITE_ID)
      .eq('category', 'Carousel')
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSlides(data.map(d => {
            try {
              const t = JSON.parse(d.caption ?? '{}')
              return { image: d.image_url, heading: t.heading ?? '', highlight: t.highlight ?? '', subtitle: t.subtitle ?? '', headingSize: t.headingSize ?? 'large', headingWeight: t.headingWeight ?? 'black', subtitleSize: t.subtitleSize ?? 'medium', subtitleWeight: t.subtitleWeight ?? 'light' }
            } catch {
              return { image: d.image_url, heading: d.caption ?? '', highlight: '', subtitle: '', headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light' }
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
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next])

  const s = slides[current]

  return (
    <>
      <section className="relative h-[92vh] min-h-[560px] max-h-[780px] overflow-hidden">
        {/* Slides */}
        {slides.map((sl, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
            <img src={sl.image} alt="" className="w-full h-full object-cover object-center" />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

        {/* Content — two column layout */}
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full grid lg:grid-cols-2 gap-10 items-center">

            {/* Left — text */}
            <div key={current} className="animate-fade-in">
              <span className="inline-block text-xs font-bold uppercase tracking-widest bg-brand-maroon text-white px-3 py-1 rounded-full mb-5">
                Offline Coaching Centre · Jaipur
              </span>
              <h1 className={`text-white leading-tight mb-4 max-w-xl ${sizeClass[s.headingSize] ?? sizeClass.large} ${weightClass[s.headingWeight] ?? weightClass.black}`}>
                {s.heading}{s.highlight && <> <span className="text-[#F3DCDC]">{s.highlight}</span></>}
              </h1>
              {s.subtitle && (
                <p className={`text-white/75 max-w-lg mb-8 leading-relaxed ${subSizeClass[s.subtitleSize] ?? subSizeClass.medium} ${weightClass[s.subtitleWeight] ?? weightClass.light}`}>
                  {s.subtitle}
                </p>
              )}
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="bg-brand-maroon hover:bg-brand-accent text-white font-bold px-8 py-3.5 rounded-2xl transition-colors text-sm">
                  Book a Free Demo Class
                </Link>
                <a href={`tel:${HODU.phone}`} className="border-2 border-white/40 hover:border-white text-white font-bold px-8 py-3.5 rounded-2xl transition-colors flex items-center gap-2 text-sm">
                  <Phone size={16} /> {HODU.phone}
                </a>
              </div>
            </div>

            {/* Right — video box */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-brand-maroon/60 via-white/10 to-brand-maroon/30 blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />

                <button
                  onClick={() => setVideoOpen(true)}
                  className="group relative w-[420px] h-[260px] rounded-3xl overflow-hidden shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-[1.03]"
                >
                  {/* Video thumbnail */}
                  <video
                    src="/event-video.mp4"
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                    muted playsInline preload="metadata"
                  />

                  {/* Layered overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

                  {/* Animated ring behind play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-28 h-28 rounded-full border-2 border-white/20 animate-ping opacity-30" />
                    <div className="absolute w-24 h-24 rounded-full border border-white/30" />
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md border-2 border-white/70 rounded-full flex items-center justify-center group-hover:bg-brand-maroon group-hover:border-brand-maroon group-hover:scale-110 transition-all duration-300 shadow-2xl">
                      <Play className="h-8 w-8 text-white fill-white ml-1.5 drop-shadow" />
                    </div>
                  </div>

                  {/* Bottom label bar */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm">Watch Our Centre</p>
                      <p className="text-white/60 text-xs mt-0.5">Hodu Academy, Jaipur</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-brand-maroon/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-[11px] font-bold uppercase tracking-wider">Play</span>
                    </div>
                  </div>

                  {/* Top-right duration badge */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-white/10">
                    ▶ Event
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Arrow controls */}
        <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 border border-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm z-10">
          <ChevronLeft size={20} />
        </button>
        <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 border border-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm z-10">
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-8 flex gap-2.5">
          {slides.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="absolute bottom-8 right-6 text-white/50 text-xs font-medium tabular-nums">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      </section>

      {/* Video Modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/60 hover:bg-black rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X size={18} />
            </button>
            <video
              src="/event-video.mp4"
              className="w-full rounded-2xl"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}
    </>
  )
}
