'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, ArrowRight, Sparkles, GraduationCap } from 'lucide-react'
import { normalizeImageUrl } from '@/lib/imageUtils'

export interface CurriculumTrack {
  tag: string
  title: string
  grades: string
  desc: string
  features: string[]
  href: string
  img: string
}

interface BatchHoverCardProps {
  track: CurriculumTrack
}

export default function BatchHoverCard({ track }: BatchHoverCardProps) {
  const [isTouched, setIsTouched] = useState(false)

  return (
    <div
      onClick={() => setIsTouched(prev => !prev)}
      className={`group batch-card-wrapper relative w-full h-[400px] sm:h-[430px] rounded-2xl overflow-hidden border border-brand-border bg-brand-wine cursor-pointer transition-all duration-500 hover:shadow-2xl hover:border-brand-maroon ${
        isTouched ? 'touched' : ''
      }`}
    >
      {/* ─── 1. BASE / BEFORE HOVER CONTENT: Image + Title ─── */}
      <div className="absolute inset-0 w-full h-full transition-opacity duration-500 group-hover:opacity-15">
        <img
          src={normalizeImageUrl(track.img)}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Rich cinematic vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30" />

        {/* Top-Left Floating Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-white/95 backdrop-blur-md text-brand-maroon text-[11px] font-extrabold px-3 py-1 rounded-full border border-brand-border/60 shadow-md uppercase tracking-wider">
            {track.tag}
          </span>
        </div>

        {/* Top-Right Decorative Corner Pill Preview */}
        <div className="absolute top-3.5 right-3.5 z-10 opacity-75 group-hover:opacity-0 transition-opacity duration-300">
          <span className="bg-black/50 backdrop-blur-xs text-white/90 text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-white/20">
            Tap / Hover for details
          </span>
        </div>

        {/* Bottom Course Name & Grades Before Hover */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 space-y-2.5 transform transition-transform duration-500 group-hover:translate-y-2 group-hover:opacity-0">
          <div className="inline-block">
            <span className="bg-brand-maroon/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
              {track.grades}
            </span>
          </div>

          <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-white leading-tight drop-shadow-md">
            {track.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium pt-1">
            <span>View curriculum & features</span>
            <ArrowRight className="h-3.5 w-3.5 text-amber-300 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* ─── 2. CORNER EXPANSION OVERLAYS (The user's requested animation) ─── */}
      {/* Top-Right Expanding Corner */}
      <div className="corner-top-right absolute top-0 right-0 w-[22%] h-[22%] bg-gradient-to-bl from-brand-maroon to-brand-crimson rounded-bl-[100%] rounded-tr-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none z-10 opacity-85 group-hover:w-full group-hover:h-full group-hover:rounded-2xl group-hover:opacity-100" />

      {/* Bottom-Left Expanding Corner */}
      <div className="corner-bottom-left absolute bottom-0 left-0 w-[22%] h-[22%] bg-gradient-to-tr from-brand-wine via-brand-crimson to-brand-maroon rounded-tr-[100%] rounded-bl-2xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] pointer-events-none z-10 opacity-85 group-hover:w-full group-hover:h-full group-hover:rounded-2xl group-hover:opacity-100" />

      {/* ─── 3. AFTER HOVER REVEALED CONTENT: Details & Actions ─── */}
      <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between z-20 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 translate-y-3 transition-all duration-500 delay-75">
        <div className="space-y-3">
          {/* Header row on hover */}
          <div className="flex items-center justify-between">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-white/20">
              {track.tag}
            </span>
            <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Small 1:12 Batch</span>
            </span>
          </div>

          <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-white leading-tight">
            {track.title}
          </h3>

          <p className="text-xs text-white/90 leading-relaxed line-clamp-3">
            {track.desc}
          </p>

          {/* Feature Bullets */}
          <div className="space-y-1.5 pt-2 border-t border-white/20">
            {track.features.slice(0, 3).map((feat, fIdx) => (
              <div key={fIdx} className="flex items-center gap-2 text-xs text-white/95">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Action Link */}
        <div className="pt-3">
          <Link
            href={track.href}
            onClick={e => e.stopPropagation()}
            className="w-full bg-white hover:bg-brand-blush text-brand-maroon font-bold py-2.5 px-4 rounded-xl text-center flex items-center justify-between text-xs tracking-wider uppercase transition-all duration-200 shadow-md group-hover:shadow-lg active:scale-98"
          >
            <span>Explore Program</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform text-brand-maroon" />
          </Link>
        </div>
      </div>
    </div>
  )
}
