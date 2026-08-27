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
    <div className="group relative flex flex-col justify-between w-full h-full min-h-[380px] p-5 sm:p-6 bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer select-none">
      
      {/* ─── Expanding Left Stripe Background On Hover ─── */}
      <div className="absolute inset-y-0 left-0 w-1.5 group-hover:w-full bg-gradient-to-br from-[#7E0D0D] via-[#941515] to-[#4E0404] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0 pointer-events-none" />

      {/* ─── Card Content (Elevated above expanding stripe) ─── */}
      <div className="relative z-10 flex flex-col h-full justify-between transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] space-y-4">
        
        <div>
          {/* Photo Window */}
          <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4.5 border border-neutral-100 group-hover:border-white/20 shadow-xs transition-all duration-500 shrink-0">
            <img
              src={normalizeImageUrl(item.image)}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            />

            {/* Subtle Photo Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Badge Tag */}
            <span className="absolute top-2.5 left-2.5 bg-brand-maroon text-white group-hover:bg-white group-hover:text-brand-maroon text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-md shadow-sm transition-colors duration-500 border border-white/10 group-hover:border-transparent">
              {item.tag}
            </span>
          </div>

          {/* Heading with Icon */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-blush text-brand-maroon group-hover:bg-white/20 group-hover:text-white flex items-center justify-center shrink-0 transition-colors duration-500 shadow-2xs">
              <IconComp size={16} />
            </div>
            <h3 className="font-serif-editorial text-xl font-bold text-[#1B2A44] group-hover:text-white transition-colors duration-500 line-clamp-1 tracking-tight">
              {item.title}
            </h3>
          </div>

          {/* Paragraph / Description */}
          <p className="text-xs sm:text-sm text-neutral-600 group-hover:text-white/90 leading-relaxed transition-colors duration-500 line-clamp-3">
            {item.desc}
          </p>
        </div>

        {/* Bottom Bar: Action Button */}
        <div className="pt-3 border-t border-neutral-100 group-hover:border-white/20 transition-colors duration-500 flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-400 group-hover:text-white/70 transition-colors duration-500 tracking-wider uppercase">
            Campus Facility
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all duration-500 bg-gradient-to-r from-brand-maroon to-[#9C1B1B] text-white shadow-xs group-hover:bg-white group-hover:text-brand-maroon hover:outline hover:outline-2 hover:outline-white cursor-pointer active:scale-95"
          >
            <span>Learn more</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
        </div>

      </div>
    </div>
  )
}
