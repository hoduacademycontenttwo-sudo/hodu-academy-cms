'use client'

import React, { useState, useMemo } from 'react'
import { X, ChevronLeft, ChevronRight, Sparkles, Users, Calendar, Eye, Image as ImageIcon, Camera, Building2 } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import { normalizeImageUrl } from '@/lib/imageUtils'

export interface GalleryItem {
  id?: string
  image_url: string
  caption?: string
  category: string
  date?: string
  location?: string
}

// Backward compatibility alias
export type PtmImage = GalleryItem

interface PtmGalleryGridProps {
  images: GalleryItem[]
}

const CATEGORY_TABS = [
  { id: 'All', label: 'All Photos', icon: ImageIcon },
  { id: 'PTM Gallery', label: 'PTM Moments', icon: Sparkles },
  { id: 'Life at Hodu Academy', label: 'Life at Hodu', icon: Camera },
  { id: 'Campus & Facilities', label: 'Campus & Facilities', icon: Building2 },
]

export default function PtmGalleryGrid({ images }: PtmGalleryGridProps) {
  const [activeTab, setActiveTab] = useState<string>('All')
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  // Normalize and group items into filterable categories
  const normalizedImages = useMemo(() => {
    return images.map(img => {
      let normalizedCat = img.category || 'Other'
      if (['Life at Hodu', 'Life at Hodu Academy'].includes(normalizedCat)) {
        normalizedCat = 'Life at Hodu Academy'
      } else if (['Campus', 'Classroom', 'Jaipur Campus Carousel', 'Jaipur Campus Facilities'].includes(normalizedCat)) {
        normalizedCat = 'Campus & Facilities'
      }
      return {
        ...img,
        category: normalizedCat,
      }
    })
  }, [images])

  // Count items per category
  const counts = useMemo(() => {
    const countsMap: Record<string, number> = {
      All: normalizedImages.length,
      'PTM Gallery': 0,
      'Life at Hodu Academy': 0,
      'Campus & Facilities': 0,
    }
    normalizedImages.forEach(img => {
      if (countsMap[img.category] !== undefined) {
        countsMap[img.category]++
      } else {
        countsMap['Campus & Facilities'] = (countsMap['Campus & Facilities'] || 0) + 1
      }
    })
    return countsMap
  }, [normalizedImages])

  // Filtered list based on active tab
  const filteredImages = useMemo(() => {
    if (activeTab === 'All') return normalizedImages
    return normalizedImages.filter(img => img.category === activeTab)
  }, [activeTab, normalizedImages])

  const openLightbox = (idx: number) => setSelectedIdx(idx)
  const closeLightbox = () => setSelectedIdx(null)

  const prevImage = () => {
    if (selectedIdx === null) return
    setSelectedIdx((selectedIdx - 1 + filteredImages.length) % filteredImages.length)
  }

  const nextImage = () => {
    if (selectedIdx === null) return
    setSelectedIdx((selectedIdx + 1) % filteredImages.length)
  }

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIdx, filteredImages])

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Life at Hodu Academy':
        return 'bg-rose-900/90 text-rose-100 border-rose-700/60'
      case 'PTM Gallery':
        return 'bg-amber-900/90 text-amber-100 border-amber-700/60'
      case 'Campus & Facilities':
        return 'bg-indigo-900/90 text-indigo-100 border-indigo-700/60'
      default:
        return 'bg-neutral-900/90 text-neutral-100 border-neutral-700/60'
    }
  }

  return (
    <div className="space-y-8">
      {/* ─── Interactive Category Filter Pills ─── */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {CATEGORY_TABS.map((tab) => {
          const Icon = tab.icon
          const count = counts[tab.id] || 0
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setSelectedIdx(null)
              }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 shadow-xs cursor-pointer ${
                isActive
                  ? 'bg-brand-maroon text-white shadow-md scale-105 ring-2 ring-brand-maroon/30'
                  : 'bg-white text-brand-text hover:bg-brand-blush border border-brand-border hover:border-brand-maroon/40'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-amber-300' : 'text-brand-maroon'} />
              <span>{tab.label}</span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ─── Gallery Stats Bar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-brand-border/60">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-maroon animate-pulse" />
          <p className="text-xs sm:text-sm font-semibold text-brand-muted">
            Displaying <span className="text-brand-maroon font-bold">{filteredImages.length}</span> verified photos {activeTab !== 'All' ? `in ${activeTab}` : ''}
          </p>
        </div>
        <div className="text-[11px] font-semibold text-brand-muted bg-white border border-brand-border px-3 py-1 rounded-full shadow-2xs">
          Jaipur Main Center & Classroom Batches
        </div>
      </div>

      {/* ─── Image Grid ─── */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {filteredImages.map((item, idx) => (
            <ScrollReveal key={item.id || idx} animation="zoom-in" delay={(idx % 8) * 60} className="h-full">
              <div
                onClick={() => openLightbox(idx)}
                className="group relative bg-white border border-brand-border/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 cursor-pointer flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <img
                    src={normalizeImageUrl(item.image_url)}
                    alt={item.caption || `${item.category} photo`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600 ease-out"
                    loading="lazy"
                  />
                  
                  {/* Category Pill on Image */}
                  <span
                    className={`absolute top-2.5 left-2.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md shadow-xs ${getCategoryBadgeClass(
                      item.category
                    )}`}
                  >
                    {item.category === 'Life at Hodu Academy' ? 'Life at Hodu' : item.category}
                  </span>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3 text-white">
                    <span className="text-[10px] sm:text-xs font-semibold flex items-center gap-1.5 bg-brand-maroon/90 backdrop-blur-xs px-2.5 py-1 rounded-lg">
                      <Eye size={13} /> View Photo
                    </span>
                  </div>
                </div>

                {/* Caption footer */}
                <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-1.5 bg-white">
                  <p className="text-[11px] sm:text-xs font-bold text-brand-text line-clamp-1 leading-snug">
                    {item.caption || (item.category === 'PTM Gallery' ? '1-on-1 Parent-Teacher Academic Review' : item.category === 'Life at Hodu Academy' ? 'Interactive Classroom & Student Learning' : 'Campus Infrastructure & Facility')}
                  </p>
                  <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-brand-muted pt-1 border-t border-brand-border/40">
                    <span className="flex items-center gap-1 truncate font-medium">
                      <Users size={11} className="text-brand-maroon shrink-0" />
                      <span className="truncate">Hodu Academy</span>
                    </span>
                    <span className="font-bold text-brand-maroon shrink-0 ml-1">Jaipur</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-brand-border rounded-3xl p-8 space-y-3">
          <p className="text-sm font-bold text-brand-text">No photos found in {activeTab}</p>
          <p className="text-xs text-brand-muted max-w-sm mx-auto">
            Try switching to "All Photos" to see all moments from Parent-Teacher meetings and Campus life.
          </p>
          <button
            onClick={() => setActiveTab('All')}
            className="mt-2 text-xs font-bold text-white bg-brand-maroon px-4 py-2 rounded-xl hover:bg-brand-crimson transition-colors cursor-pointer"
          >
            View All Photos
          </button>
        </div>
      )}

      {/* ─── Lightbox Modal ─── */}
      {selectedIdx !== null && filteredImages[selectedIdx] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-50 cursor-pointer"
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 sm:p-3.5 rounded-full transition-colors z-50 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 sm:p-3.5 rounded-full transition-colors z-50 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Active Image Modal Card */}
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center bg-[#180304] border border-white/15 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[72vh] flex items-center justify-center bg-black/50 overflow-hidden">
              <img
                src={normalizeImageUrl(filteredImages[selectedIdx].image_url)}
                alt={filteredImages[selectedIdx].caption || 'Gallery Photo'}
                className="max-h-[72vh] w-auto object-contain select-none"
              />
            </div>

            <div className="w-full p-4 sm:p-5 bg-[#250607] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                      filteredImages[selectedIdx].category
                    )}`}
                  >
                    {filteredImages[selectedIdx].category}
                  </span>
                  <span className="text-[11px] text-white/60 font-medium">
                    Photo {selectedIdx + 1} of {filteredImages.length}
                  </span>
                </div>
                <p className="text-sm font-bold text-white">
                  {filteredImages[selectedIdx].caption ||
                    (filteredImages[selectedIdx].category === 'PTM Gallery'
                      ? 'Parent-Teacher Academic Growth Review Session'
                      : 'Interactive Classroom & Student Learning')}
                </p>
              </div>

              <div className="text-[11px] text-neutral-300 font-light shrink-0">
                Hodu Academy · Jaipur Campus
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
