'use client'

import React, { useState } from 'react'
import { CalendarDays, MonitorPlay, FileEdit, ClipboardCheck, ArrowUpRight } from 'lucide-react'

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
      className={`hodu-gold-card group relative w-full h-[410px] sm:h-[430px] p-5 sm:p-6 flex flex-col justify-between items-center cursor-pointer select-none text-white ${
        isTouched ? 'touched' : ''
      }`}
    >
      {/* ─── Animated Rotating Gold Border on Hover ─── */}
      <div className="hodu-gold-border" />

      {/* ─── Top Header / Tag ─── */}
      <div className="w-full flex items-center justify-between z-10">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#bd9f67] bg-[#bd9f67]/10 border border-[#bd9f67]/30 px-2.5 py-0.5 rounded-full">
          Feature 0{index + 1}
        </span>
        <div className="w-6 h-6 rounded-full bg-[#bd9f67]/10 flex items-center justify-center text-[#bd9f67] group-hover:bg-[#bd9f67] group-hover:text-black transition-all duration-300">
          <ArrowUpRight size={13} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>

      {/* ─── Center Animated Logo / Icon & Typography ─── */}
      <div className="flex flex-col items-center text-center my-auto z-10 space-y-3 w-full px-2">
        {/* Animated Gold Icon & Trail */}
        <div className="relative p-3.5 rounded-2xl bg-black/40 border border-[#bd9f67]/40 shadow-inner group-hover:border-[#bd9f67] group-hover:bg-black/60 transition-all duration-500">
          <div className="hodu-logo-trail" />
          <Icon className="h-9 w-9 sm:h-10 sm:w-10 text-[#bd9f67] transform group-hover:scale-110 transition-transform duration-500" />
        </div>

        {/* Feature Title */}
        <h3 className="font-serif-editorial font-bold text-xl sm:text-2xl text-white group-hover:text-[#f3e5c8] tracking-tight transition-colors duration-300">
          {feature.title}
        </h3>

        {/* Feature Subtitle */}
        <p className="text-xs sm:text-[13px] text-[#e0c9a6]/80 font-medium leading-relaxed max-w-[210px] mx-auto">
          {feature.subtitle}
        </p>

        {/* Preview Thumbnail on Hover */}
        <div className="w-full max-w-[200px] h-20 sm:h-24 rounded-xl overflow-hidden bg-white/5 border border-[#bd9f67]/20 p-1 mt-1 opacity-75 group-hover:opacity-100 group-hover:scale-105 group-hover:border-[#bd9f67]/60 transition-all duration-500">
          <img
            src={feature.image}
            alt={feature.title}
            loading="lazy"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>
      </div>

      {/* ─── Animated Tracking Gold Bottom Text ─── */}
      <span className="hodu-bottom-text font-bold">
        HODU ACADEMY
      </span>
    </div>
  )
}
