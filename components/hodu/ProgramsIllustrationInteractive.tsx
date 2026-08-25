'use client'

import React, { useState, useRef } from 'react'
import { Sparkles, BookOpen, GraduationCap, Award, Video, CheckCircle2 } from 'lucide-react'

export default function ProgramsIllustrationInteractive() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Center coordinates (-1 to 1)
    const centerX = (x / rect.width - 0.5) * 2
    const centerY = (y / rect.height - 0.5) * 2

    // Max 15deg tilt
    setRotate({
      x: -centerY * 12,
      y: centerX * 15,
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-lg lg:max-w-xl cursor-grab active:cursor-grabbing select-none py-2"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Transform Wrapper */}
      <div
        className="relative transition-transform duration-200 ease-out flex items-center justify-center"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${isHovered ? 'scale(1.03)' : 'scale(1)'}`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ambient Backlight Glow */}
        <div
          className="absolute -inset-4 bg-gradient-to-tr from-brand-maroon/20 via-amber-400/20 to-brand-crimson/15 rounded-full blur-2xl transition-opacity duration-300 pointer-events-none -z-10"
          style={{
            opacity: isHovered ? 0.9 : 0.45,
            transform: `translateZ(-40px) translate(${rotate.y * 1.5}px, ${-rotate.x * 1.5}px)`,
          }}
        />

        {/* Floating Illustration Main Image */}
        <div
          className="relative z-10 w-full max-w-[340px] sm:max-w-[400px] md:max-w-[440px] drop-shadow-2xl transition-all duration-300"
          style={{
            transform: 'translateZ(30px)',
          }}
        >
          <img
            src="/images/hand-drawn-online-tutor-illustration.png"
            alt="Hodu Academy Interactive Online Tutoring Illustration"
            className="w-full h-auto object-contain animate-float"
            draggable={false}
          />
        </div>

        {/* ─── Floating Interactive 3D Badges ─── */}

        {/* Badge 1: Top Left - 1:12 Interactive Batches */}
        <div
          className="absolute -top-2 -left-2 sm:-left-6 z-20 bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-xl rounded-2xl px-3.5 py-2 flex items-center gap-2 transition-transform duration-200"
          style={{
            transform: `translateZ(65px) translate(${-rotate.y * 1.2}px, ${rotate.x * 1.2}px)`,
          }}
        >
          <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles size={14} className="animate-spin-slow" />
          </div>
          <div className="text-left">
            <span className="block text-[11px] font-black text-neutral-900 leading-none">1:12 Small Batches</span>
            <span className="block text-[9px] font-bold text-neutral-500 mt-0.5">Interactive Doubt Care</span>
          </div>
        </div>

        {/* Badge 2: Bottom Right - Top Faculty & Mentors */}
        <div
          className="absolute -bottom-3 -right-2 sm:-right-6 z-20 bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-xl rounded-2xl px-3.5 py-2 flex items-center gap-2 transition-transform duration-200"
          style={{
            transform: `translateZ(75px) translate(${rotate.y * 1.4}px, ${-rotate.x * 1.4}px)`,
          }}
        >
          <div className="w-7 h-7 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center shrink-0 shadow-2xs">
            <GraduationCap size={15} />
          </div>
          <div className="text-left">
            <span className="block text-[11px] font-black text-brand-maroon leading-none">Top Faculty Mentorship</span>
            <span className="block text-[9px] font-bold text-neutral-500 mt-0.5">15-Yr Past Paper Mastery</span>
          </div>
        </div>

        {/* Badge 3: Top Right - Verified Curriculums */}
        <div
          className="hidden sm:flex absolute top-1/4 -right-8 z-20 bg-neutral-900/90 text-white backdrop-blur-md border border-neutral-700 shadow-xl rounded-full px-3 py-1 items-center gap-1.5 transition-transform duration-200"
          style={{
            transform: `translateZ(55px) translate(${rotate.y * 0.8}px, ${-rotate.x * 0.8}px)`,
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wide">Cambridge · IB · CBSE · NEET · JEE</span>
        </div>

      </div>
    </div>
  )
}
