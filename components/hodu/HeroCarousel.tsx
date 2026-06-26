'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { HODU } from '@/lib/hodu'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&h=700&fit=crop&auto=format',
    tag: 'Offline Coaching Centre · Jaipur',
    heading: 'Where Excellence Meets',
    highlight: 'Personal Attention',
    sub: 'Experience classroom learning at its best — expert faculty, structured curriculum, and a nurturing environment designed for every student to thrive.',
  },
  {
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&h=700&fit=crop&auto=format',
    tag: 'IGCSE · IB · Cambridge',
    heading: 'International Board Experts',
    highlight: 'Right Here in Jaipur',
    sub: 'Specialized coaching for Cambridge IGCSE, O Level and IB curricula with seasoned educators and proven results.',
  },
  {
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1600&h=700&fit=crop&auto=format',
    tag: 'JEE · NEET · Olympiads',
    heading: 'Crack India\'s Toughest',
    highlight: 'Entrance Exams',
    sub: 'Conceptual clarity, daily practice problems, and full mock test series — everything you need to top the charts.',
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1600&h=700&fit=crop&auto=format',
    tag: 'Smart Classrooms · Small Batches',
    heading: 'Tech-Enabled Learning',
    highlight: 'In Every Classroom',
    sub: 'Digital boards, projectors, and LMS-integrated classrooms — delivering the best of both worlds to every student.',
  },
]

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const go = useCallback((index: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 700)
  }, [animating])

  const next = useCallback(() => go((current + 1) % slides.length), [current, go])
  const prev = useCallback(() => go((current - 1 + slides.length) % slides.length), [current, go])

  useEffect(() => {
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next])

  const slide = slides[current]

  return (
    <section className="relative h-[92vh] min-h-[560px] max-h-[780px] overflow-hidden">
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={s.image}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 w-full">
          <div
            key={current}
            className="animate-fade-in"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-widest bg-brand-maroon text-white px-3 py-1 rounded-full mb-5">
              {slide.tag}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 max-w-3xl">
              {slide.heading}{' '}
              <span className="text-[#F3DCDC]">{slide.highlight}</span>
            </h1>
            <p className="text-white/75 text-base sm:text-lg max-w-xl mb-8 font-light leading-relaxed">
              {slide.sub}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact"
                className="bg-brand-maroon hover:bg-brand-accent text-white font-bold px-8 py-3.5 rounded-2xl transition-colors text-sm">
                Book a Free Demo Class
              </Link>
              <a href={`tel:${HODU.phone}`}
                className="border-2 border-white/40 hover:border-white text-white font-bold px-8 py-3.5 rounded-2xl transition-colors flex items-center gap-2 text-sm">
                <Phone size={16} /> {HODU.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow controls */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 border border-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 border border-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'w-8 h-2.5 bg-white'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute bottom-8 right-6 text-white/50 text-xs font-medium tabular-nums">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}
