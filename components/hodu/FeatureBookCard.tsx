'use client'

import React, { useState } from 'react'
import { CalendarDays, MonitorPlay, FileEdit, ClipboardCheck, ArrowUpRight, Sparkles } from 'lucide-react'

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
      className={`hodu-gold-card group relative w-full h-[400px] sm:h-[420px] rounded-3xl overflow-hidden cursor-pointer select-none text-white transition-all duration-500 ${
        isTouched ? 'touched' : ''
      }`}
    >
      {/* ─── Animated Rotating Gold Border on Hover ─── */}
      <div className="hodu-gold-border z-30" />

      {/* ─── 1. DEFAULT STATE (BEFORE HOVER): Large Icon in Center ─── */}
      <div className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between items-center transition-all duration-500 group-hover:opacity-0 group-hover:scale-95 z-10">
        {/* Top Tag & Arrow */}
        <div className="w-full flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#bd9f67] bg-[#bd9f67]/10 border border-[#bd9f67]/30 px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={10} className="text-[#bd9f67]" />
            <span>Feature 0{index + 1}</span>
          </span>
          <div className="w-7 h-7 rounded-full bg-[#bd9f67]/10 flex items-center justify-center text-[#bd9f67]">
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Center Large Glowing Icon */}
        <div className="flex flex-col items-center justify-center my-auto space-y-4">
          <div className="relative p-6 sm:p-7 rounded-3xl bg-black/40 border border-[#bd9f67]/40 shadow-2xl">
            <div className="hodu-logo-trail" />
            <Icon className="h-16 w-16 sm:h-20 sm:w-20 text-[#bd9f67] drop-shadow-[0_0_15px_rgba(189,159,103,0.4)]" />
          </div>

          <span className="text-xs font-semibold text-[#bd9f67]/80 uppercase tracking-widest">
            Hover to view
          </span>
        </div>

        {/* Bottom Logo Tag */}
        <span className="text-[10px] uppercase font-bold text-[#bd9f67]/70 tracking-[4px]">
          HODU ACADEMY
        </span>
      </div>

      {/* ─── 2. HOVERED STATE (AFTER HOVER): Complete Full Image on Card ─── */}
      <div className="absolute inset-0 w-full h-full p-2.5 rounded-3xl bg-[#FFF9F9] flex items-center justify-center opacity-0 scale-95 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100 group-[.touched]:opacity-100 group-[.touched]:scale-100 z-20 overflow-hidden">
        <img
          src={feature.image}
          alt={feature.title}
          loading="lazy"
          className="w-full h-full object-contain rounded-2xl transform transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </div>
    </div>
  )
}
