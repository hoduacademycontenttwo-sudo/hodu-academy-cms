'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

export type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'scale-up'
  | 'blur-in'
  | 'flip-up'

interface ScrollRevealProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number // ms
  duration?: number // ms
  className?: string
  threshold?: number
  once?: boolean
  distance?: number // px
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 650,
  className = '',
  threshold = 0.08,
  once = false,
  distance = 28,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [scrollDir, setScrollDir] = useState<'down' | 'up'>('down')
  const ref = useRef<HTMLDivElement>(null)
  const lastScrollY = useRef<number>(0)

  // Track global scroll direction smoothly
  useEffect(() => {
    let ticking = false

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY
      if (Math.abs(currentScrollY - lastScrollY.current) > 4) {
        setScrollDir(currentScrollY > lastScrollY.current ? 'down' : 'up')
        lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // IntersectionObserver for entering & leaving viewport
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(el)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '20px 0px -30px 0px',
      }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [threshold, once])

  const getAnimationStyles = (): React.CSSProperties => {
    const transitionTiming = `${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`
    const transitionDelay = isVisible ? `${delay}ms` : '0ms'
    const baseTransition = `opacity ${transitionTiming}, transform ${transitionTiming}, filter ${transitionTiming}`

    if (!isVisible) {
      // Dynamic bidirectional translation depending on scroll direction
      const yOffset = scrollDir === 'down' ? distance : -distance

      switch (animation) {
        case 'fade-up':
          return {
            opacity: 0,
            transform: `translate3d(0, ${yOffset}px, 0)`,
            transition: baseTransition,
            transitionDelay,
            willChange: 'opacity, transform',
          }
        case 'fade-down':
          return {
            opacity: 0,
            transform: `translate3d(0, ${-yOffset}px, 0)`,
            transition: baseTransition,
            transitionDelay,
            willChange: 'opacity, transform',
          }
        case 'fade-left':
          return {
            opacity: 0,
            transform: `translate3d(${-distance * 1.2}px, 0, 0)`,
            transition: baseTransition,
            transitionDelay,
            willChange: 'opacity, transform',
          }
        case 'fade-right':
          return {
            opacity: 0,
            transform: `translate3d(${distance * 1.2}px, 0, 0)`,
            transition: baseTransition,
            transitionDelay,
            willChange: 'opacity, transform',
          }
        case 'zoom-in':
          return {
            opacity: 0,
            transform: 'scale3d(0.92, 0.92, 1)',
            transition: baseTransition,
            transitionDelay,
            willChange: 'opacity, transform',
          }
        case 'scale-up':
          return {
            opacity: 0,
            transform: `scale3d(0.9, 0.9, 1) translate3d(0, ${yOffset * 0.7}px, 0)`,
            transition: baseTransition,
            transitionDelay,
            willChange: 'opacity, transform',
          }
        case 'blur-in':
          return {
            opacity: 0,
            filter: 'blur(10px)',
            transform: `scale3d(0.95, 0.95, 1) translate3d(0, ${yOffset * 0.5}px, 0)`,
            transition: baseTransition,
            transitionDelay,
            willChange: 'opacity, transform, filter',
          }
        case 'flip-up':
          return {
            opacity: 0,
            transform: `perspective(1000px) rotateX(${scrollDir === 'down' ? 12 : -12}deg) translate3d(0, ${yOffset}px, 0)`,
            transition: baseTransition,
            transitionDelay,
            willChange: 'opacity, transform',
          }
        default:
          return {
            opacity: 0,
            transform: `translate3d(0, ${yOffset}px, 0)`,
            transition: baseTransition,
            transitionDelay,
            willChange: 'opacity, transform',
          }
      }
    }

    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      filter: 'none',
      transition: baseTransition,
      transitionDelay,
      willChange: 'auto',
    }
  }

  return (
    <div
      ref={ref}
      style={getAnimationStyles()}
      className={className}
    >
      {children}
    </div>
  )
}
