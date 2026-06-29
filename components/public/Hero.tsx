import Link from 'next/link'
import { ArrowRight, Users, Award, BookOpen } from 'lucide-react'

interface HeroProps {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  heroImageUrl?: string | null
  stats?: Record<string, string> | null
  siteSlug: string
}

export default function Hero({ title, subtitle, ctaText, ctaLink, heroImageUrl, stats, siteSlug }: HeroProps) {
  const normalizedStats: { label: string; value: string }[] = (() => {
    const src: any = stats ?? { 'Students Enrolled': '50,000+', 'Top Rankers': '1,200+', 'Years of Excellence': '15+' }
    if (Array.isArray(src)) {
      return src.map((s: any) =>
        s && typeof s === 'object'
          ? { label: String(s.label ?? ''), value: String(s.value ?? '') }
          : { label: '', value: String(s) }
      )
    }
    return Object.entries(src as Record<string, any>).map(([key, val]) =>
      val && typeof val === 'object' && !Array.isArray(val)
        ? { label: String((val as any).label ?? key), value: String((val as any).value ?? '') }
        : { label: key, value: String(val ?? '') }
    )
  })()

  return (
    <section className="bg-[#FDF5F5] pt-10 pb-12 lg:pt-20 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text */}
          <div>
            <span className="inline-block bg-[#F3DCDC] text-[#7E0D0D] text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wider uppercase">
              India's Leading Coaching Institute
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#111111] leading-tight mb-4">
              {title}
            </h1>
            <p className="text-base sm:text-lg text-[#1B2A44] opacity-80 mb-6 leading-relaxed line-clamp-3 lg:line-clamp-none">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={ctaLink}
                className="bg-[#7E0D0D] hover:bg-[#922222] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md flex items-center gap-2 text-sm sm:text-base"
              >
                {ctaText} <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${siteSlug}/courses`}
                className="border-2 border-[#1B2A44] text-[#1B2A44] hover:bg-[#1B2A44] hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm sm:text-base"
              >
                Explore Courses
              </Link>
            </div>

            {/* Stats - horizontal scroll on small screens */}
            <div className="flex gap-6 mt-8 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
              {normalizedStats.map(({ label, value }) => (
                <div key={label} className="shrink-0">
                  <p className="text-xl sm:text-2xl font-bold text-[#7E0D0D]">{value}</p>
                  <p className="text-xs sm:text-sm text-[#1B2A44] opacity-70 whitespace-nowrap">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            {heroImageUrl ? (
              <img
                src={heroImageUrl}
                alt="Students"
                className="w-full h-52 sm:h-80 lg:h-[420px] object-cover rounded-2xl shadow-xl"
              />
            ) : (
              <div className="w-full h-52 sm:h-72 lg:h-[420px] bg-gradient-to-br from-[#F3DCDC] to-[#FDF5F5] rounded-2xl shadow-xl flex flex-col items-center justify-center gap-4 sm:gap-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { icon: Users, label: 'Expert Faculty', color: '#7E0D0D' },
                    { icon: Award, label: 'Top Results', color: '#922222' },
                    { icon: BookOpen, label: 'Study Material', color: '#1B2A44' },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-3 sm:p-5 shadow-sm text-center">
                      <Icon size={22} color={color} className="mx-auto mb-1.5 sm:mb-2" />
                      <p className="text-[10px] sm:text-xs font-semibold text-[#1B2A44]">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[#C9C8CB] text-xs sm:text-sm">Upload hero image from admin panel</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
