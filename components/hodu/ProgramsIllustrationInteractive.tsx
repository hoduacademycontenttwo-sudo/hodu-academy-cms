'use client'

import React, { useState, useRef } from 'react'

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

    // Max 14deg tilt
    setRotate({
      x: -centerY * 12,
      y: centerX * 14,
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
      className="relative mx-auto w-full max-w-md lg:max-w-lg cursor-grab active:cursor-grabbing select-none py-2"
      style={{ perspective: '1200px' }}
    >
      {/* 3D Transform Wrapper */}
      <div
        className="relative transition-transform duration-200 ease-out flex items-center justify-center"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${isHovered ? 'scale(1.04)' : 'scale(1)'}`,
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
      </div>
    </div>
  )
}
