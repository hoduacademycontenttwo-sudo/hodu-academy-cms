'use client'

import React, { useState } from 'react'
import { BookOpen, Sparkles, CalendarDays, MonitorPlay, FileEdit, ClipboardCheck } from 'lucide-react'

export interface LearningFeature {
  title: string
  subtitle: string
  image: string
}

interface FeatureBookCardProps {
  feature: LearningFeature
  index: number
}

const icons = [CalendarDays, MonitorPlay, FileEdit, ClipboardCheck]

export default function FeatureBookCard({ feature, index }: FeatureBookCardProps) {
  const [isTouched, setIsTouched] = useState(false)
  const Icon = icons[index % icons.length]

  return (
    <div
      onClick={() => setIsTouched(prev => !prev)}
      className={`hodu-book-card group relative w-full h-[400px] sm:h-[420px] rounded-3xl cursor-pointer select-none ${
        isTouched ? 'touched' : ''
      }`}
    >
      <div className="hodu-book-inner relative w-full h-full rounded-3xl bg-white border border-[#F6DFDF] shadow-lg overflow-hidden flex items-center justify-center">
        {/* ─── INSIDE THE BOOK (Revealed on hover / tap) ─── */}
        <div className="absolute inset-0 w-full h-full bg-[#FFFDFD] rounded-3xl overflow-hidden flex items-center justify-center p-2">
          {/* Subtle Left Spine Page Shadow */}
          <div className="absolute left-0 inset-y-0 w-6 bg-gradient-to-r from-black/15 via-black/5 to-transparent z-10 pointer-events-none" />

          {/* Full Illustration inside the book */}
          <img
            src={feature.image}
            alt={feature.title}
            loading="lazy"
            className="w-full h-full object-contain rounded-2xl"
          />
        </div>

        {/* ─── 3D BOOK COVER (Opens on hover) ─── */}
        <div className="hodu-book-cover absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#7E0D0D] via-[#921E1F] to-[#590A0A] p-6 sm:p-7 flex flex-col justify-between items-center text-white z-20 overflow-hidden border border-amber-400/30">
          {/* Book Spine Texture Line on Left */}
          <div className="absolute left-0 inset-y-0 w-3.5 bg-gradient-to-r from-black/40 via-black/15 to-transparent" />
          <div className="absolute left-3.5 inset-y-0 w-px bg-white/20" />

          {/* Decorative Corner Ornaments */}
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-amber-300/40 rounded-tr-md" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-amber-300/40 rounded-br-md" />

          {/* Top Tag */}
          <div className="w-full flex items-center justify-end pl-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-200/90 bg-black/25 px-2.5 py-0.5 rounded-full border border-amber-300/20">
              <Sparkles size={10} className="text-amber-300" />
              <span>Feature 0{index + 1}</span>
            </span>
          </div>

          {/* Center Cover Graphic & Icon Badge */}
          <div className="flex flex-col items-center text-center my-auto pl-3 space-y-4">
            {/* Glowing Icon Circle */}
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-amber-400/20 blur-md animate-pulse" />
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 via-brand-maroon to-brand-wine border-2 border-amber-300 text-white flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                <Icon className="h-9 w-9 sm:h-10 sm:w-10 text-amber-100 drop-shadow-md" />
              </div>
            </div>

            {/* Title on Cover */}
            <div className="space-y-1.5">
              <h3 className="font-serif-editorial font-bold text-xl sm:text-2xl text-white tracking-tight drop-shadow">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-amber-100/85 font-medium leading-relaxed max-w-[200px] mx-auto">
                {feature.subtitle}
              </p>
            </div>
          </div>

          {/* Bottom Interactive Hint */}
          <div className="w-full flex items-center justify-center pl-3 pt-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/90 bg-white/15 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/20 shadow-xs group-hover:bg-white group-hover:text-brand-maroon transition-colors">
              <BookOpen size={12} className="text-amber-300 group-hover:text-brand-maroon" />
              <span>Hover to open book</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
