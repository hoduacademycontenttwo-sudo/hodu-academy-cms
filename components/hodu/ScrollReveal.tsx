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
}

export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 750,
  className = '',
  threshold = 0.12,
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
          observer.unobserve(el) // Animate only once
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
    }
  }, [threshold])

  const getAnimationStyles = () => {
    const baseTransition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return {
            opacity: 0,
            transform: 'translate3d(0, 36px, 0)',
            transition: baseTransition,
            transitionDelay: `${delay}ms`,
          }
        case 'fade-down':
          return {
            opacity: 0,
            transform: 'translate3d(0, -36px, 0)',
            transition: baseTransition,
            transitionDelay: `${delay}ms`,
          }
        case 'fade-left':
          return {
            opacity: 0,
            transform: 'translate3d(-48px, 0, 0)',
            transition: baseTransition,
            transitionDelay: `${delay}ms`,
          }
        case 'fade-right':
          return {
            opacity: 0,
            transform: 'translate3d(48px, 0, 0)',
            transition: baseTransition,
            transitionDelay: `${delay}ms`,
          }
        case 'zoom-in':
          return {
            opacity: 0,
            transform: 'scale3d(0.92, 0.92, 1) translate3d(0, 20px, 0)',
            transition: baseTransition,
            transitionDelay: `${delay}ms`,
          }
        case 'flip-up':
          return {
            opacity: 0,
            transform: 'perspective(1000px) rotateX(15deg) translate3d(0, 30px, 0)',
            transition: baseTransition,
            transitionDelay: `${delay}ms`,
          }
        default:
          return {
            opacity: 0,
            transform: 'translate3d(0, 30px, 0)',
            transition: baseTransition,
            transitionDelay: `${delay}ms`,
          }
      }
    }

    return {
      opacity: 1,
      transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
      transition: baseTransition,
      transitionDelay: `${delay}ms`,
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
