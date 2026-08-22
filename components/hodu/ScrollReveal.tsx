'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'flip-up'

interface ScrollRevealProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number // ms
  duration?: number // ms
  className?: string
  threshold?: number
  once?: boolean
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 950,
  className = '',
  threshold = 0.08,
  once = false,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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
          // Reverse animation when scrolled out of view
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -20px 0px',
      }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [threshold, once])

  const getAnimationStyles = () => {
    // Entrance is slightly slower & cinematic, exit is smooth & responsive
    const transitionTiming = isVisible
      ? `${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`
      : `550ms cubic-bezier(0.25, 1, 0.5, 1)`
    
    const transitionDelay = isVisible ? `${delay}ms` : '0ms'
    const baseTransition = `opacity ${transitionTiming}, transform ${transitionTiming}`

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return {
            opacity: 0,
            transform: 'translate3d(0, 46px, 0)',
            transition: baseTransition,
            transitionDelay,
          }
        case 'fade-down':
          return {
            opacity: 0,
            transform: 'translate3d(0, -46px, 0)',
            transition: baseTransition,
            transitionDelay,
          }
        case 'fade-left':
          return {
            opacity: 0,
            transform: 'translate3d(-60px, 0, 0)',
            transition: baseTransition,
            transitionDelay,
          }
        case 'fade-right':
          return {
            opacity: 0,
            transform: 'translate3d(60px, 0, 0)',
            transition: baseTransition,
            transitionDelay,
          }
        case 'zoom-in':
          return {
            opacity: 0,
            transform: 'scale3d(0.88, 0.88, 1) translate3d(0, 30px, 0)',
            transition: baseTransition,
            transitionDelay,
          }
        case 'flip-up':
          return {
            opacity: 0,
            transform: 'perspective(1000px) rotateX(18deg) translate3d(0, 40px, 0)',
            transition: baseTransition,
            transitionDelay,
          }
        default:
          return {
            opacity: 0,
            transform: 'translate3d(0, 46px, 0)',
            transition: baseTransition,
            transitionDelay,
          }
      }
    }

    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1) perspective(1000px) rotateX(0deg)',
      transition: baseTransition,
      transitionDelay,
      willChange: 'transform, opacity',
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
