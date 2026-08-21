'use client'

import React from 'react'

export interface PencilLoaderProps {
  size?: number | string
  className?: string
  label?: string
}

export default function PencilLoader({
  size = 140,
  className = '',
  label = 'Loading...',
}: PencilLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        width={size}
        viewBox="0 0 200 200"
        className="pencil text-brand-maroon dark:text-brand-rose"
      >
        <defs>
          <clipPath id="pencil-eraser">
            <rect height={30} width={30} ry={5} rx={5} />
          </clipPath>
        </defs>

        {/* Drawn circular line stroke */}
        <circle
          transform="rotate(-113,100,100)"
          strokeLinecap="round"
          strokeDashoffset="439.82"
          strokeDasharray="439.82 439.82"
          strokeWidth={2.5}
          stroke="currentColor"
          fill="none"
          r={70}
          className="pencil__stroke"
        />

        {/* Rotating Pencil Body */}
        <g transform="translate(100,100)" className="pencil__rotate">
          <g fill="none">
            {/* Primary Maroon Body */}
            <circle
              transform="rotate(-90)"
              strokeDashoffset={402}
              strokeDasharray="402.12 402.12"
              strokeWidth={30}
              stroke="#921E1F"
              r={64}
              className="pencil__body1"
            />
            {/* Upper Highlight Layer (Lighter Crimson) */}
            <circle
              transform="rotate(-90)"
              strokeDashoffset={465}
              strokeDasharray="464.96 464.96"
              strokeWidth={10}
              stroke="#B22425"
              r={74}
              className="pencil__body2"
            />
            {/* Lower Shadow Layer (Deep Wine Maroon) */}
            <circle
              transform="rotate(-90)"
              strokeDashoffset={339}
              strokeDasharray="339.29 339.29"
              strokeWidth={10}
              stroke="#651416"
              r={54}
              className="pencil__body3"
            />
          </g>

          {/* Eraser End in Soft Rose Pink & Silver Band */}
          <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
            <g className="pencil__eraser-skew">
              {/* Pink Eraser */}
              <rect height={30} width={30} ry={5} rx={5} fill="#E5A8A8" />
              <rect clipPath="url(#pencil-eraser)" height={30} width={5} fill="#D98A8A" />
              {/* Metallic Silver/Gold Collar */}
              <rect height={20} width={30} fill="#E8DADA" />
              <rect height={20} width={15} fill="#D4C2C2" />
              <rect height={20} width={5} fill="#C0ACAC" />
              <rect height={2} width={30} y={6} fill="rgba(62,13,14,0.2)" />
              <rect height={2} width={30} y={13} fill="rgba(62,13,14,0.2)" />
            </g>
          </g>

          {/* Sharpened Pencil Tip (Natural Wood + Lead Point) */}
          <g transform="rotate(-90) translate(49,-30)" className="pencil__point">
            <polygon points="15 0,30 30,0 30" fill="#F0C08A" />
            <polygon points="15 0,6 30,0 30" fill="#D49B5B" />
            <polygon points="15 0,20 10,10 10" fill="#262626" />
          </g>
        </g>
      </svg>

      {label && (
        <span className="text-xs font-bold uppercase tracking-widest text-brand-maroon dark:text-brand-rose animate-pulse">
          {label}
        </span>
      )}
    </div>
  )
}
