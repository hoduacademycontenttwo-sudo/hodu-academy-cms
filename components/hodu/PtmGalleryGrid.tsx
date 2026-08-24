'use client'

import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Sparkles, Users, Calendar, Eye } from 'lucide-react'

export interface PtmImage {
  id?: string
  image_url: string
  caption?: string
  date?: string
  location?: string
}

interface PtmGalleryGridProps {
  images: PtmImage[]
}

export default function PtmGalleryGrid({ images }: PtmGalleryGridProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  const openLightbox = (idx: number) => setSelectedIdx(idx)
  const closeLightbox = () => setSelectedIdx(null)

  const prevImage = () => {
    if (selectedIdx === null) return
    setSelectedIdx((selectedIdx - 1 + images.length) % images.length)
  }

  const nextImage = () => {
    if (selectedIdx === null) return
    setSelectedIdx((selectedIdx + 1) % images.length)
  }

  return (
    <div className="space-y-6">
      {/* ─── Gallery Stats Bar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-brand-border/60">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-maroon animate-pulse" />
          <p className="text-xs sm:text-sm font-semibold text-brand-muted">
            Displaying <span className="text-brand-maroon font-bold">{images.length}</span> verified PTM interaction moments
          </p>
        </div>
        <div className="text-[11px] font-semibold text-brand-muted bg-white border border-brand-border px-3 py-1 rounded-full shadow-2xs">
          Jaipur Main Center & Online Batches
        </div>
      </div>

      {/* ─── Image Grid (2 columns on mobile, 3 on tablet/desktop) ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
        {images.map((item, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className="group relative bg-white border border-brand-border/80 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
              <img
                src={item.image_url}
                alt={item.caption || 'Hodu Academy PTM Session'}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-2 sm:p-4 text-white">
                <span className="text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 bg-brand-maroon/90 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg">
                  <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> View
                </span>
              </div>
            </div>

            <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-2 bg-white">
              <p className="text-[11px] sm:text-sm font-bold text-brand-text line-clamp-2 leading-snug">
                {item.caption || 'Parent-Teacher Academic Growth Review Session'}
              </p>
              <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-brand-muted pt-1 border-t border-brand-border/40">
                <span className="flex items-center gap-0.5 sm:gap-1 truncate">
                  <Users className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-brand-maroon shrink-0" />
                  <span className="truncate">1-on-1 Faculty Desk</span>
                </span>
                <span className="font-semibold text-brand-maroon shrink-0 ml-1">Hodu</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Lightbox Modal ─── */}
      {selectedIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50 cursor-pointer"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Active Image Modal Card */}
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center bg-[#180304] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-h-[70vh] flex items-center justify-center bg-black/40 overflow-hidden">
              <img
                src={images[selectedIdx].image_url}
                alt={images[selectedIdx].caption || 'PTM Session'}
                className="max-h-[70vh] w-auto object-contain select-none"
              />
            </div>

            <div className="w-full p-4 sm:p-5 bg-[#250607] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-white">
                  {images[selectedIdx].caption || 'Parent-Teacher Academic Growth Review Session'}
                </p>
                <p className="text-xs text-neutral-300 font-light">
                  Continuous transparency and personalized student roadmap reviews.
                </p>
              </div>
              <span className="text-xs font-semibold bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-auto text-amber-200">
                {selectedIdx + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
