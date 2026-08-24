'use client'

import React from 'react'
import { Star, Users, Award, MapPin, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

export default function HomeTrustMetrics() {
  const metrics = [
    {
      icon: Star,
      title: '4.9 / 5 Rating',
      subtitle: 'Google & Parent Verified',
      accent: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Users,
      title: '1:12 Small Batches',
      subtitle: 'Guaranteed Personal Attention',
      accent: 'text-brand-maroon',
      bg: 'bg-brand-maroon/10',
    },
    {
      icon: Award,
      title: '99.4% Top Marks',
      subtitle: 'Cambridge, IB & JEE Toppers',
      accent: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: MapPin,
      title: 'Vaishali Ext. Campus',
      subtitle: 'Daily 1-on-1 Faculty Doubt Desks',
      accent: 'text-brand-maroon',
      bg: 'bg-brand-maroon/10',
    },
  ]

  return (
    <section className="relative z-20 -mt-3 sm:-mt-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-8">
      <ScrollReveal animation="fade-up">
        <div className="bg-white/95 backdrop-blur-md border border-brand-border/90 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-lg shadow-brand-maroon/5 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {metrics.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-brand-blush/60 transition-colors border border-transparent hover:border-brand-border/50 group cursor-default"
              >
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-4.5 w-4.5 sm:h-5 sm:w-5 ${item.accent}`} />
                </div>
                <div className="min-w-0">
                  <div className="font-serif-editorial font-bold text-xs sm:text-sm text-brand-text truncate">
                    {item.title}
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-brand-muted truncate font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollReveal>
    </section>
  )
}
