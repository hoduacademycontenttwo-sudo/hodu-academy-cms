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
      <section className="relative aspect-[9/5] lg:aspect-video max-h-[900px] overflow-hidden">
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

              {/* Mobile video button */}
              <button
                onClick={() => setVideoOpen(true)}
                className="lg:hidden flex items-center gap-3 mt-2 group"
              >
                <div className="w-11 h-11 rounded-full bg-white/15 border-2 border-white/60 flex items-center justify-center group-hover:bg-brand-maroon group-hover:border-brand-maroon transition-all duration-300 shrink-0">
                  <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                </div>
                <span className="text-white/80 text-sm font-medium">Watch Our Centre</span>
              </button>
            </div>

            {/* Right — video box */}
            <div className="hidden lg:flex items-center justify-end">
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-br from-brand-maroon/50 via-white/5 to-brand-maroon/20 blur-2xl opacity-60" />

                <button
                  onClick={() => setVideoOpen(true)}
                  className="group relative w-[500px] h-[310px] rounded-[1.75rem] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-white/15 hover:border-white/35 transition-all duration-500 hover:scale-[1.025]"
                >
                  {/* Video thumbnail */}
                  <video
                    src="https://bgaidfuzvcrjbxmpfvym.supabase.co/storage/v1/object/public/cms-videos/event-video.mp4"
                    className="w-full h-full object-cover scale-[1.06] group-hover:scale-100 transition-transform duration-700"
                    muted playsInline preload="metadata"
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                  {/* Center play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute w-32 h-32 rounded-full border border-white/15 animate-ping opacity-20" />
                    <div className="absolute w-28 h-28 rounded-full border border-white/25" />
                    <div className="w-[72px] h-[72px] bg-white/15 backdrop-blur-md border-2 border-white/60 rounded-full flex items-center justify-center group-hover:bg-brand-maroon group-hover:border-brand-maroon group-hover:scale-110 transition-all duration-300 shadow-2xl">
                      <Play className="h-7 w-7 text-white fill-white ml-1 drop-shadow" />
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 py-5 flex items-end justify-between">
                    <div>
                      <p className="text-white font-black text-base tracking-tight">Watch Our Centre</p>
                      <p className="text-white/55 text-sm mt-0.5 font-medium">Hodu Academy, Jaipur</p>
                    </div>
                    <div className="flex items-center gap-2 bg-brand-maroon backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-xs font-bold uppercase tracking-widest">Play</span>
                    </div>
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
              src="https://bgaidfuzvcrjbxmpfvym.supabase.co/storage/v1/object/public/cms-videos/event-video.mp4"
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
