import Link from 'next/link'
import { ArrowRight, LucideIcon } from 'lucide-react'

export interface CategoryCardProps {
  code: string
  label: string
  href: string
  badge: string
  img: string
  icon?: LucideIcon
  stats: { big: string; label: string }[]
}

export default function CategoryGoalCard({
  code,
  label,
  href,
  badge,
  img,
  icon: Icon,
  stats,
}: CategoryCardProps) {
  const highlightStat = stats?.[0] ? `${stats[0].big} ${stats[0].label}` : badge
  const secondaryStat = stats?.[1] ? `${stats[1].big} ${stats[1].label}` : ''

  return (
    <div className="wave-slide-card group relative w-full h-[270px] sm:h-[290px] bg-white dark:bg-[#1E0C0D] rounded-[22px] overflow-hidden border border-brand-border dark:border-[#3D1B1D] shadow-xs hover:shadow-xl hover:border-brand-maroon dark:hover:border-brand-maroon transition-all duration-300">
      
      {/* Top Card: Course Graphic & Badges (Shrinks on hover) */}
      <div className="top-card relative w-full h-[62%] group-hover:h-[32%] transition-all duration-350 ease-out overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <img
          src={img}
          alt={label}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
          {Icon && <Icon className="h-3 w-3 text-brand-rose" />}
          <span>{code}</span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
            {badge}
          </span>
        </div>
      </div>

      {/* Bottom Card: Brand Maroon Sliding Wave Container (Expands on hover) */}
      <div className="bottom-card absolute bottom-0 left-0 w-full h-[38%] group-hover:h-[68%] transition-all duration-350 ease-out bg-brand-maroon dark:bg-[#651416] text-white flex flex-col justify-between p-4 sm:p-5 z-20">
        
        {/* Card Header & Content */}
        <div className="card-content flex flex-col items-center justify-center text-center w-full my-auto transition-transform duration-300">
          <h3 className="card-title font-extrabold text-sm sm:text-base tracking-wide uppercase text-white line-clamp-1">
            {label}
          </h3>

          <p className="card-txt text-[11px] sm:text-xs text-brand-rose/90 font-medium mt-1 line-clamp-1">
            {highlightStat} {secondaryStat ? `• ${secondaryStat}` : ''}
          </p>

          {/* Read More Button (Revealed on hover with smooth animation) */}
          <div className="opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 mt-3 sm:mt-4 w-full flex justify-center">
            <Link
              href={href}
              className="card-btn inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full text-white border-2 border-white hover:bg-white hover:text-brand-maroon transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
            >
              <span>Read More</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  )
}
