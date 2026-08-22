'use client'

import React, { useState } from 'react'

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
      className={`hodu-ranker-card group relative w-full h-[270px] sm:h-[290px] rounded-2xl flex items-center justify-center cursor-pointer select-none overflow-hidden ${
        isTouched ? 'touched' : ''
      }`}
    >
      {/* ─── Animated Glowing Maroon/Gold Neon Gradient ─── */}
      <div className="hodu-ranker-glow" />

      {/* ─── Dark Inner Card Frame ─── */}
      <div className="hodu-ranker-inner absolute inset-[3px] sm:inset-[4px] bg-[#180303]/95 backdrop-blur-md rounded-[14px] z-[2] overflow-hidden flex items-center justify-center p-3">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#7E0D0D_1px,transparent_1px)] [background-size:12px_12px] opacity-25 pointer-events-none" />

        {/* ─── Student Photo (Before hover: centered; on hover: scales & shifts up) ─── */}
        <div className="hodu-ranker-img absolute z-[3] flex flex-col items-center justify-center transition-all duration-500">
          {ranker.photo_url ? (
            <img
              src={ranker.photo_url}
              alt={ranker.name}
              className="w-22 h-22 sm:w-26 sm:h-26 rounded-full object-cover border-2 border-amber-300/50 shadow-xl"
            />
          ) : (
            <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-full bg-gradient-to-br from-[#7E0D0D] via-[#9e1c1d] to-[#400505] border-2 border-amber-300/50 text-amber-200 flex items-center justify-center font-serif-editorial font-bold text-2xl sm:text-3xl shadow-xl">
              {ranker.initials}
            </div>
          )}

          {/* Score Pill displayed on rest state */}
          <div className="hodu-ranker-pill mt-3 bg-gradient-to-r from-[#7E0D0D] to-[#921E1F] border border-amber-400/40 text-amber-100 font-bold text-xs px-3 py-1 rounded-full shadow-md transition-opacity duration-300">
            {ranker.pct}
          </div>
        </div>

        {/* ─── Revealed Content (Slides up & expands on hover) ─── */}
        <div className="hodu-ranker-content absolute z-[4] w-full px-2.5 flex flex-col items-center text-center transition-all duration-500">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-300 bg-black/60 border border-amber-300/40 px-2.5 py-0.5 rounded-full mb-1">
            {ranker.pct}
          </span>
          <h4 className="font-serif-editorial font-bold text-base sm:text-lg text-white leading-tight drop-shadow">
            {ranker.name}
          </h4>
          <p className="text-[11px] font-semibold text-amber-200/90 mt-0.5">
            {ranker.stream}
          </p>
          <p className="text-[9.5px] text-neutral-300/80 mt-1 line-clamp-1 border-t border-white/15 pt-1 w-full max-w-[170px]">
            {ranker.school}
          </p>
        </div>
      </div>
    </div>
  )
}
