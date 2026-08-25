'use client'

import React, { useState } from 'react'
import { normalizeImageUrl } from '@/lib/imageUtils'
import { Sparkles, LucideIcon } from 'lucide-react'

interface CampusFacilityCardProps {
  item: {
    icon: LucideIcon
    title: string
    tag: string
    desc: string
    image: string
  }
}

export default function CampusFacilityCard({ item }: CampusFacilityCardProps) {
  const [isTouched, setIsTouched] = useState(false)
  const IconComp = item.icon

  return (
    <div
      onClick={() => setIsTouched(prev => !prev)}
      className="group relative h-[310px] w-full rounded-2xl overflow-hidden cursor-pointer select-none transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-rotate-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-brand-maroon/15 border border-brand-border bg-white"
    >
      {/* ─── BEFORE HOVER: Photo with Bottom Overlay ─── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          src={normalizeImageUrl(item.image)}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Ambient Dark-to-Transparent Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* Top Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-block bg-brand-maroon/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-md border border-white/20">
            {item.tag}
          </span>
        </div>

        {/* Bottom Preview info */}
        <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1 transition-opacity duration-300 group-hover:opacity-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 border border-white/30">
              <IconComp size={15} />
            </div>
            <h3 className="font-serif-editorial text-lg font-bold text-white tracking-wide drop-shadow-sm line-clamp-1">
              {item.title}
            </h3>
          </div>
          <p className="text-[11px] text-white/80 line-clamp-1 font-medium pl-9">
            {item.desc}
          </p>
        </div>
      </div>

      {/* ─── ON HOVER: Light Maroon Theme Content Panel with Smooth Rotation ─── */}
      <div
        className={`absolute inset-0 w-full h-full p-6 flex flex-col items-center justify-center text-center bg-[#FFF8F8] border-2 border-brand-maroon/30 rounded-2xl transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-inner z-20 ${
          isTouched ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-90 group-hover:opacity-100 group-hover:rotate-0 group-hover:scale-100'
        }`}
        style={{
          background: 'linear-gradient(145deg, #FFFFFF 0%, #FDF4F4 50%, #FDECEC 100%)',
        }}
      >
        {/* Subtle Decorative Background Ring */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-brand-maroon/5 rounded-full blur-xl pointer-events-none" />

        {/* Maroon Icon Badge */}
        <div className="w-13 h-13 rounded-2xl bg-brand-maroon text-white flex items-center justify-center shadow-lg shadow-brand-maroon/20 mb-3 border border-brand-maroon/20 transition-transform duration-500 group-hover:scale-110">
          <IconComp size={24} />
        </div>

        {/* Tag Pill */}
        <span className="inline-block bg-brand-blush text-brand-maroon text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-brand-maroon/15 mb-2 shadow-2xs">
          {item.tag}
        </span>

        {/* Title */}
        <h3 className="font-serif-editorial text-xl font-bold text-brand-maroon tracking-tight mb-2">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-[240px]">
          {item.desc}
        </p>

        {/* Decorative Maroon Dot */}
        <div className="mt-3 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon/40" />
          <span className="w-4 h-1 rounded-full bg-brand-maroon" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-maroon/40" />
        </div>
      </div>
    </div>
  )
}
