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
      onMouseEnter={() => setIsTouched(true)}
      onMouseLeave={() => setIsTouched(false)}
      className={`group relative w-full h-[380px] sm:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none bg-white border transition-all duration-400 flex items-center justify-center ${
        isTouched
          ? 'border-brand-maroon/80 shadow-2xl -translate-y-2 ring-4 ring-brand-maroon/10 scale-[1.02]'
          : 'border-brand-border/70 shadow-xs hover:border-brand-maroon/80 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]'
      }`}
    >
      {/* Visual content container */}
      <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white flex items-center justify-center p-1">
        <img
          src={feature.image}
          alt={feature.title}
          loading="lazy"
          className={`w-full h-full object-contain rounded-2xl sm:rounded-3xl transform transition-transform duration-500 ${
            isTouched ? 'scale-[1.03]' : 'group-hover:scale-[1.03]'
          }`}
        />
      </div>
    </div>
  )
}
