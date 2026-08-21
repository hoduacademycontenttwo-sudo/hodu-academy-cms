import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

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
  return (
    <Link
      href={href}
      className="group block w-full select-none text-left no-underline focus:outline-none"
    >
      <div className="category-goal-card w-full rounded-[20px] bg-white p-[5px] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between border border-brand-border hover:border-brand-maroon">
        
        {/* Top Image Zone with the signature curved cut-out header */}
        <div className="category-top-section relative h-[120px] sm:h-[130px] rounded-[15px] overflow-hidden bg-neutral-100">
          {/* Course/Curriculum Image */}
          <img
            src={img}
            alt={label}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Curved notch tab background (White on top of photo) */}
          <div className="absolute top-0 left-0">
            <div className="category-cutout-border" />
          </div>

          {/* Notch Icon / Acronym in Brand Maroon */}
          <div className="absolute top-0 left-0 h-[28px] px-3 flex items-center gap-1.5 z-10">
            {Icon && <Icon className="h-3.5 w-3.5 text-brand-maroon" />}
            <span className="text-[11px] font-black tracking-wider text-brand-maroon uppercase font-sans">
              {code}
            </span>
          </div>

          {/* Right grade badge */}
          <div className="absolute top-2 right-2.5 z-10">
            <span className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/20">
              {badge}
            </span>
          </div>
        </div>

        {/* Bottom Title & 3-column Stats Section (Clean lines, no curved box) */}
        <div className="pt-3 pb-2.5 px-2 text-center flex-1 flex flex-col justify-between">
          <span className="block text-xs sm:text-sm font-extrabold text-brand-text tracking-tight uppercase line-clamp-1 group-hover:text-brand-maroon transition-colors">
            {label}
          </span>

          <div className="grid grid-cols-3 mt-2.5 pt-2 border-t border-brand-border/70 text-center">
            {stats.map((st, i) => (
              <div
                key={i}
                className={`px-1 ${
                  i === 1 ? 'border-x border-brand-border/70' : ''
                }`}
              >
                <span className="block text-[11px] sm:text-xs font-black text-brand-maroon leading-none">
                  {st.big}
                </span>
                <span className="block text-[8.5px] sm:text-[9px] text-brand-muted font-medium mt-1 leading-tight line-clamp-1">
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Link>
  )
}
