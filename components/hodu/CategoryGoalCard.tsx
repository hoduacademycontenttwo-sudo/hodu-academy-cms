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
      <div className="category-goal-card w-full rounded-[20px] bg-[#3E0D0E] p-[5px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] flex flex-col justify-between border border-[#651416]/50">
        
        {/* Top Image Zone with the signature curved cut-out header */}
        <div className="category-top-section relative h-[125px] sm:h-[135px] rounded-[15px] overflow-hidden bg-[#651416]">
          {/* Course/Curriculum Image */}
          <img
            src={img}
            alt={label}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Curved notch tab background */}
          <div className="absolute top-0 left-0">
            <div className="category-cutout-border" />
          </div>

          {/* Notch Icon / Acronym */}
          <div className="absolute top-0 left-0 h-[28px] px-3 flex items-center gap-1.5 z-10">
            {Icon && <Icon className="h-3.5 w-3.5 text-white" />}
            <span className="text-[11px] font-black tracking-wider text-white uppercase font-sans">
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

        {/* Bottom Title & 3-column Stats Section */}
        <div className="pt-3 pb-2.5 px-2 text-center">
          <span className="block text-xs sm:text-[13px] font-extrabold text-white tracking-wide uppercase line-clamp-1 group-hover:text-[#EED6D6] transition-colors">
            {label}
          </span>

          <div className="grid grid-cols-3 mt-3 pt-2.5 border-t border-white/15 text-center">
            {stats.map((st, i) => (
              <div
                key={i}
                className={`px-1 ${
                  i === 1 ? 'border-x border-white/15' : ''
                }`}
              >
                <span className="block text-[11px] sm:text-xs font-black text-white leading-none">
                  {st.big}
                </span>
                <span className="block text-[8px] sm:text-[9px] text-[#EED6D6]/80 font-medium mt-1 leading-tight line-clamp-1">
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
