'use client'

import React from 'react'
import { normalizeImageUrl } from '@/lib/imageUtils'
import {
  School,
  Target,
  BookOpen,
  Laptop,
  Smartphone,
  Bus,
  Sparkles,
  Award,
  Users,
  Shield,
  Clock,
  Building2,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  School,
  Target,
  BookOpen,
  Laptop,
  Smartphone,
  Bus,
  Sparkles,
  Award,
  Users,
  Shield,
  Clock,
  Building2,
  MapPin,
  CheckCircle2,
}

export interface CampusFacilityItem {
  iconName?: string
  title: string
  tag: string
  desc: string
  image: string
}

interface CampusFacilityCardProps {
  item: CampusFacilityItem
}

export default function CampusFacilityCard({ item }: CampusFacilityCardProps) {
  const IconComp = (item.iconName && ICON_MAP[item.iconName]) || School

  return (
    <div className="group relative flex flex-col justify-between w-full h-full p-4 sm:p-4.5 bg-white border border-[#F3DCDC] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer select-none">
      
      {/* ─── Expanding Left Stripe Background On Hover ─── */}
      <div className="absolute inset-y-0 left-0 w-1.5 group-hover:w-full bg-gradient-to-br from-[#7E0D0D] via-[#941515] to-[#520505] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0 pointer-events-none" />

      {/* ─── Card Content (Elevated above expanding stripe) ─── */}
      <div className="relative z-10 flex flex-col h-full justify-between transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] space-y-3">
        
        <div>
          {/* Photo Window (Compact & Clean) */}
          <div className="relative w-full h-32 sm:h-36 rounded-lg sm:rounded-xl overflow-hidden mb-3 border border-neutral-100 group-hover:border-white/20 shadow-2xs transition-all duration-500 shrink-0">
            <img
              src={normalizeImageUrl(item.image)}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />

            {/* Subtle Photo Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Badge Tag */}
            <span className="absolute top-2 left-2 bg-brand-maroon text-white group-hover:bg-white group-hover:text-brand-maroon text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded shadow-xs transition-colors duration-500 border border-white/10 group-hover:border-transparent">
              {item.tag}
            </span>
          </div>

          {/* Heading with Icon */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6.5 h-6.5 rounded-md bg-brand-blush text-brand-maroon group-hover:bg-white/20 group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-500 shadow-2xs">
              <IconComp size={14} />
            </div>
            <h3 className="font-serif-editorial text-base sm:text-lg font-bold text-[#1B2A44] group-hover:text-white transition-colors duration-500 line-clamp-1 tracking-tight">
              {item.title}
            </h3>
          </div>

          {/* Paragraph / Description */}
          <p className="text-xs text-neutral-600 group-hover:text-white/95 leading-relaxed transition-colors duration-500 line-clamp-2">
            {item.desc}
          </p>
        </div>

        {/* Bottom Bar: Action Button Linking to Login Portal */}
        <div className="pt-2 border-t border-neutral-100 group-hover:border-white/20 transition-colors duration-500 flex items-center justify-between">
          <span className="text-[10px] font-bold text-neutral-400 group-hover:text-white/75 transition-colors duration-500 tracking-wider uppercase">
            Campus Facility
          </span>
          <a
            href="https://portal.hoduacademy.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-md transition-all duration-300 bg-[#7E0D0D] text-white shadow-xs group-hover:!bg-white group-hover:!text-[#7E0D0D] group-hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer z-20"
          >
            <span>Learn more</span>
            <ArrowRight size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>

      </div>
    </div>
  )
}
