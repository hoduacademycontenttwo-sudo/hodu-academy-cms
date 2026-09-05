'use client';

import React from 'react';
import ElasticMesh, { ElasticMeshProps } from './ElasticMesh';

export interface BannerElasticMeshProps extends Partial<ElasticMeshProps> {
  variant?: 'maroon' | 'crimson' | 'dark' | 'gold' | 'soft' | 'custom';
  opacity?: number;
}

const VARIANT_PRESETS = {
  maroon: {
    color1: '#7E0D0D',
    color2: '#2B0506',
    highlight: '#E8B923',
    wobble: 0.35,
    tilt: 12,
    shading: 0.75,
  },
  crimson: {
    color1: '#921E1F',
    color2: '#4A080A',
    highlight: '#FFFFFF',
    wobble: 0.4,
    tilt: 14,
    shading: 0.8,
  },
  dark: {
    color1: '#2D0909',
    color2: '#120202',
    highlight: '#D4AF37',
    wobble: 0.3,
    tilt: 10,
    shading: 0.7,
  },
  gold: {
    color1: '#5A3508',
    color2: '#1A0E03',
    highlight: '#F1DDB6',
    wobble: 0.3,
    tilt: 12,
    shading: 0.85,
  },
  soft: {
    color1: '#F4DDDD',
    color2: '#FCF8F7',
    highlight: '#FFFFFF',
    wobble: 0.25,
    tilt: 8,
    shading: 0.5,
  },
  custom: {},
};

export default function BannerElasticMesh({
  variant = 'maroon',
  opacity = 1,
  className = '',
  style = {},
  interaction = 'hover',
  ...props
}: BannerElasticMeshProps) {
  const preset = VARIANT_PRESETS[variant] || VARIANT_PRESETS.maroon;

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={{ opacity, ...style }}
    >
      <ElasticMesh
        {...preset}
        {...props}
        interaction={interaction}
        className="w-full h-full"
      />
    </div>
  );
}
