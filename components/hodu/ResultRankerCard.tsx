'use client'

import React, { useState } from 'react'
import { normalizeImageUrl } from '@/lib/imageUtils'

export interface Ranker {
  initials: string
  name: string
  pct: string
  stream: string
  school: string
  photo_url?: string
}

interface ResultRankerCardProps {
  ranker: Ranker
}

export default function ResultRankerCard({ ranker }: ResultRankerCardProps) {
  const [isTouched, setIsTouched] = useState(false)

  return (
    <div
      onClick={() => setIsTouched(prev => !prev)}
      className={`hodu-ranker-card group relative w-full h-[210px] sm:h-[230px] rounded-2xl flex items-center justify-center cursor-pointer select-none overflow-hidden ${
        isTouched ? 'touched' : ''
      }`}
    >
      {/* ─── Animated Glowing Maroon/Gold Neon Gradient ─── */}
      <div className="hodu-ranker-glow" />

      {/* ─── Dark Inner Card Frame ─── */}
      <div className="hodu-ranker-inner absolute inset-[3px] bg-[#180303]/95 backdrop-blur-md rounded-[13px] z-[2] overflow-hidden flex items-center justify-center p-2.5">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#7E0D0D_1px,transparent_1px)] [background-size:10px_10px] opacity-25 pointer-events-none" />

        {/* ─── Large Student Photo Frame (Centered on rest, scales & shifts up on hover) ─── */}
        <div className="hodu-ranker-img absolute z-[3] flex flex-col items-center justify-center transition-all duration-500">
          {ranker.photo_url ? (
            <img
              src={normalizeImageUrl(ranker.photo_url)}
              alt={ranker.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-amber-300/50 shadow-2xl"
            />
          ) : (
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#7E0D0D] via-[#9e1c1d] to-[#400505] border-2 border-amber-300/50 text-amber-200 flex items-center justify-center font-serif-editorial font-bold text-3xl sm:text-4xl shadow-2xl">
              {ranker.initials}
            </div>
          )}

          {/* Score Pill displayed on rest state */}
          <div className="hodu-ranker-pill mt-2 bg-gradient-to-r from-[#7E0D0D] to-[#921E1F] border border-amber-400/40 text-amber-100 font-bold text-xs px-3 py-0.5 rounded-full shadow-md transition-opacity duration-300">
            {ranker.pct}
          </div>
        </div>

        {/* ─── Revealed Content (Slides up & expands on hover) ─── */}
        <div className="hodu-ranker-content absolute z-[4] w-full px-2 flex flex-col items-center text-center transition-all duration-500">
          <span className="text-[9.5px] uppercase font-bold tracking-widest text-amber-300 bg-black/60 border border-amber-300/40 px-2 py-0.5 rounded-full mb-0.5">
            {ranker.pct}
          </span>
          <h4 className="font-serif-editorial font-bold text-sm sm:text-base text-white leading-tight drop-shadow line-clamp-1">
            {ranker.name}
          </h4>
          <p className="text-[10px] font-semibold text-amber-200/90 mt-0.5">
            {ranker.stream}
          </p>
          <p className="text-[9px] text-neutral-300/80 mt-0.5 line-clamp-1 border-t border-white/15 pt-0.5 w-full max-w-[150px]">
            {ranker.school}
          </p>
        </div>
      </div>
    </div>
  )
}
