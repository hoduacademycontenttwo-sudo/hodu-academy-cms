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
  const defaultStats = stats ?? {
    'Students Enrolled': '50,000+',
    'Top Rankers': '1,200+',
    'Years of Excellence': '15+',
  }

  return (
    <section className="bg-[#FDF5F5] pt-12 pb-16 lg:pt-20 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <span className="inline-block bg-[#F3DCDC] text-[#7E0D0D] text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider uppercase">
              India's Leading Coaching Institute
            </span>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#111111] leading-tight mb-5">
              {title}
            </h1>
            <p className="text-lg text-[#1B2A44] opacity-80 mb-8 leading-relaxed">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={ctaLink}
                className="bg-[#7E0D0D] hover:bg-[#922222] text-white font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-md flex items-center gap-2"
              >
                {ctaText} <ArrowRight size={18} />
              </Link>
              <Link
                href={`/${siteSlug}/courses`}
                className="border-2 border-[#1B2A44] text-[#1B2A44] hover:bg-[#1B2A44] hover:text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
              >
                Explore Courses
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-10">
              {Object.entries(defaultStats).map(([label, value]) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-[#7E0D0D]">{value}</p>
                  <p className="text-sm text-[#1B2A44] opacity-70">{label}</p>
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
                className="w-full h-[420px] object-cover rounded-2xl shadow-xl"
              />
            ) : (
              <div className="w-full h-[420px] bg-gradient-to-br from-[#F3DCDC] to-[#FDF5F5] rounded-2xl shadow-xl flex flex-col items-center justify-center gap-6">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Users, label: 'Expert Faculty', color: '#7E0D0D' },
                    { icon: Award, label: 'Top Results', color: '#922222' },
                    { icon: BookOpen, label: 'Study Material', color: '#1B2A44' },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
                      <Icon size={28} color={color} className="mx-auto mb-2" />
                      <p className="text-xs font-semibold text-[#1B2A44]">{label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[#C9C8CB] text-sm">Upload hero image from admin panel</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
