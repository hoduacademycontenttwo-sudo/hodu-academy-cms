'use client'

import React from 'react'

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
  return (
    <div
      className="group relative w-full h-[380px] sm:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer select-none bg-white border border-brand-border/60 shadow-xs hover:shadow-2xl hover:border-brand-maroon/40 hover:-translate-y-2 transition-all duration-400 flex items-center justify-center"
    >
      <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white flex items-center justify-center">
        <img
          src={feature.image}
          alt={feature.title}
          loading="lazy"
          className="w-full h-full object-contain rounded-2xl sm:rounded-3xl transform transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
    </div>
  )
}
