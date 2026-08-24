import React from 'react'
import { ExternalLink, Play } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import { normalizeImageUrl } from '@/lib/imageUtils'

export interface YouTubeChannelItem {
  id?: string
  title: string
  url: string
  image_url: string
  subscribers?: string
}

interface YouTubeChannelsSectionProps {
  channels?: YouTubeChannelItem[]
}

export const defaultYouTubeChannels: YouTubeChannelItem[] = [
  {
    title: 'Hodu Academy | IGCSE & IBDP',
    url: 'https://www.youtube.com/@hoduacademy',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop&auto=format',
    subscribers: 'Cambridge & IB Lectures',
  },
  {
    title: 'Hodu Academy - JEE | NEET | Boards',
    url: 'https://www.youtube.com/@hoduacademy',
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop&auto=format',
    subscribers: 'Physics, Chemistry & Math Problem Sets',
  },
  {
    title: 'Hodu Academy | Class 9 & 10',
    url: 'https://www.youtube.com/@hoduacademy',
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=450&fit=crop&auto=format',
    subscribers: 'Foundation & Board Concepts',
  },
]

export default function YouTubeChannelsSection({ channels }: YouTubeChannelsSectionProps) {
  const list = channels && channels.length > 0 ? channels : defaultYouTubeChannels

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white via-[#FDF8F8] to-white border-y border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-10 sm:mb-14 space-y-2.5">
            <h2 className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-maroon leading-tight">
              Be Part Of The <span className="underline decoration-[#FF0000] decoration-3 underline-offset-6">Hodu Family</span>, Today!
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted max-w-2xl mx-auto leading-relaxed">
              Explore our growing network of YouTube channels and subscribe for free access to world-class educators, problem-solving masterclasses, and exam strategies.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {list.map((channel, idx) => (
            <ScrollReveal
              key={channel.id || idx}
              animation="fade-up"
              delay={idx * 80}
              className="h-full"
            >
              <a
                href={channel.url || 'https://www.youtube.com/@hoduacademy'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white border border-brand-border/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer"
              >
                {/* Banner Thumbnail */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                  <img
                    src={normalizeImageUrl(channel.image_url)}
                    alt={channel.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Subtle Dark Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                  {/* Red Play badge in center on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-[#FF0000]/95 backdrop-blur-xs text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Title & Red YouTube Icon */}
                <div className="p-4 bg-white border-t border-brand-border/60 flex items-center justify-between gap-3 flex-1">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <h3 className="font-bold text-xs sm:text-sm text-brand-text truncate group-hover:text-brand-maroon transition-colors">
                      {channel.title}
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-medium truncate flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#FF0000]" />
                      <span>{channel.subscribers || 'Subscribe & Watch Free'}</span>
                    </p>
                  </div>

                  {/* YouTube Icon Button */}
                  <div className="shrink-0 bg-[#FF0000] text-white px-2.5 py-1.5 rounded-xl shadow-xs group-hover:bg-[#CC0000] group-hover:shadow-md transition-all flex items-center gap-1">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
