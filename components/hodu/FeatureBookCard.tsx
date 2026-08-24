'use client'

import React, { useState } from 'react'

export interface LearningFeature {
  title: string
  subtitle: string
  image: string
}

interface FeatureBookCardProps {
  feature: LearningFeature
  index: number
}

export default function FeatureBookCard({ feature, index }: FeatureBookCardProps) {
  const [isTouched, setIsTouched] = useState(false)

  return (
    <div
      onClick={() => setIsTouched(prev => !prev)}
      className={`hodu-gold-card group relative w-full h-[400px] sm:h-[430px] rounded-3xl overflow-hidden cursor-pointer select-none bg-white border border-brand-border/80 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex items-center justify-center p-2.5 sm:p-3 ${
        isTouched ? 'touched' : ''
      }`}
    >
      {/* ─── Animated Rotating Gold / Maroon Border on Hover ─── */}
      <div className="hodu-gold-border z-30" />

      {/* ─── Directly Visible Feature Graphic Image (Always shown) ─── */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#FFF9F9] flex items-center justify-center z-10">
        <img
          src={feature.image}
          alt={feature.title}
          loading="lazy"
          className="w-full h-full object-contain rounded-2xl transform transition-transform duration-500 group-hover:scale-[1.03] group-[.touched]:scale-[1.03]"
        />
      </div>
    </div>
  )
}
