'use client'

import { useEffect, useState, useRef } from 'react'

export default function Academic3DCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [hoverText, setHoverText] = useState('')

  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)

  // Real mouse coordinates
  const mousePos = useRef({ x: -100, y: -100 })
  // Trailing ring coordinates for smooth physics
  const ringPos = useRef({ x: -100, y: -100 })

  useEffect(() => {
    // Check if device supports fine pointer (mouse, not touch screen)
    if (typeof window === 'undefined') return
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!hasFinePointer) return

    setEnabled(true)

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }
    }

    const onMouseDown = () => setClicked(true)
    const onMouseUp = () => setClicked(false)

    const onMouseLeave = () => setHidden(true)
    const onMouseEnter = () => setHidden(false)

    // Interactive target detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const interactiveEl = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer, .wave-slide-card')
      if (interactiveEl) {
        setHovered(true)
        const customText = interactiveEl.getAttribute('data-cursor')
        if (customText) {
          setHoverText(customText)
        } else if (interactiveEl.tagName === 'A' && interactiveEl.getAttribute('target') === '_blank') {
          setHoverText('')
        } else {
          setHoverText('')
        }
      } else {
        setHovered(false)
        setHoverText('')
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseover', handleMouseOver, { passive: true })

    // Animation frame loop for buttery-smooth trailing ring
    let animationId: number
    const render = () => {
      // Lerp smoothing factor
      const ease = 0.16
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease

      if (cursorRingRef.current) {
        cursorRingRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`
      }

      animationId = requestAnimationFrame(render)
    }

    animationId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(animationId)
    }
  }, [])

  if (!enabled) return null

  return (
    <div className={`pointer-events-none fixed inset-0 z-[999999] overflow-hidden transition-opacity duration-300 ${hidden ? 'opacity-0' : 'opacity-100'}`}>
      {/* Outer Floating 3D Aura Ring */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none transition-[width,height,background-color,border-color,box-shadow] duration-200 ease-out flex items-center justify-center"
        style={{
          width: hovered ? '52px' : clicked ? '28px' : '36px',
          height: hovered ? '52px' : clicked ? '28px' : '36px',
          borderRadius: '50%',
          backgroundColor: hovered
            ? 'rgba(146, 30, 31, 0.12)'
            : 'rgba(146, 30, 31, 0.05)',
          border: hovered
            ? '1.5px solid rgba(146, 30, 31, 0.55)'
            : '1px solid rgba(146, 30, 31, 0.25)',
          boxShadow: hovered
            ? '0 0 16px rgba(146, 30, 31, 0.22), inset 0 0 8px rgba(146, 30, 31, 0.1)'
            : '0 2px 8px rgba(146, 30, 31, 0.08)',
          backdropFilter: hovered ? 'blur(1px)' : 'none',
        }}
      >
        {hoverText && (
          <span className="text-[9px] font-bold tracking-wider text-brand-maroon uppercase select-none animate-fade-in">
            {hoverText}
          </span>
        )}
      </div>

      {/* Center Core Focus Dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none transition-[transform,width,height,opacity] duration-100 ease-out"
        style={{
          width: hovered ? '6px' : clicked ? '10px' : '7px',
          height: hovered ? '6px' : clicked ? '10px' : '7px',
          borderRadius: '50%',
          backgroundColor: '#921E1F',
          boxShadow: '0 0 6px rgba(146, 30, 31, 0.6)',
          opacity: hovered ? 0.8 : 1,
        }}
      />
    </div>
  )
}
