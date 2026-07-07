'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, ShieldAlert, ChevronDown } from 'lucide-react'
import { HODU } from '@/lib/hodu'

const courses = [
  { label: 'IGCSE & Cambridge', href: '/courses?category=IGCSE', icon: '🌐' },
  { label: 'IB Programme',       href: '/courses?category=IB',   icon: '🎓' },
  { label: 'CBSE (Class 9–12)',  href: '/courses?category=CBSE', icon: '📚' },
  { label: 'JEE / NEET',        href: '/courses?category=Competitive+Exams', icon: '🏆' },
  { label: 'Olympiads',          href: '/courses?category=Olympiads', icon: '🥇' },
  { label: 'Online Courses',     href: '/courses', icon: '📡' },
]

const studyMaterials = [
  { label: 'JEE Main',          href: '/study-materials/jee-main' },
  { label: 'JEE Advanced',      href: '/study-materials/jee-advanced' },
  { label: 'NEET',              href: '/study-materials/neet' },
  { label: 'NCERT Solutions',   href: '/study-materials/ncert-solutions' },
  { label: 'CBSE',              href: '/study-materials/cbse' },
  { label: 'Olympiad',          href: '/study-materials/olympiad' },
]

const navLinks = [
  { label: 'Home',      href: '/' },
  { label: 'Offline',   href: '/offline' },
  { label: 'About Us',  href: '/about' },
  { label: 'Contact',   href: '/contact' },
]

function Dropdown({ label, items }: { label: string; items: { label: string; href: string; icon?: string }[] }) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function enter() { clearTimeout(timer.current ?? undefined); setOpen(true) }
  function leave() { timer.current = setTimeout(() => setOpen(false), 120) }

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button className="flex items-center gap-1 text-sm font-medium text-brand-navy hover:text-brand-maroon transition-colors py-2">
        {label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
          <div className="bg-white border border-brand-border rounded-xl shadow-xl overflow-hidden min-w-[200px] py-1">
            {items.map(item => (
              <Link key={item.label} href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-navy hover:bg-brand-bg hover:text-brand-maroon transition-colors">
                {item.icon && <span className="text-base">{item.icon}</span>}
                <span>{item.label}</span>
                <ChevronDown className="h-3 w-3 ml-auto -rotate-90 text-brand-navy/30" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface HoduNavbarProps {
  siteName?: string
  logoUrl?: string
}

export default function HoduNavbar({ siteName = HODU.name, logoUrl = '' }: HoduNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileCourses, setMobileCourses] = useState(false)
  const [mobileMaterials, setMobileMaterials] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full bg-brand-white border-b border-brand-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-maroon text-white font-extrabold text-xl shadow-md">
              H
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-brand-navy group-hover:text-brand-maroon transition-colors">
                Hodu Academy
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-brand-accent uppercase">
                EXCELLENCE PRESCRIBED
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-7">
            <Link href="/" className="nav-link text-sm font-medium text-brand-navy hover:text-brand-maroon transition-colors">Home</Link>
            <Dropdown label="Courses" items={courses} />
            <Dropdown label="Study Materials" items={studyMaterials} />
            <Link href="/offline" className="nav-link text-sm font-medium text-brand-navy hover:text-brand-maroon transition-colors">Offline</Link>
            <Link href="/about" className="nav-link text-sm font-medium text-brand-navy hover:text-brand-maroon transition-colors">About</Link>
            <Link href="/blog" className="nav-link text-sm font-medium text-brand-navy hover:text-brand-maroon transition-colors">Blog</Link>
            <Link href="/contact" className="nav-link text-sm font-medium text-brand-navy hover:text-brand-maroon transition-colors">Contact</Link>
          </div>

          {/* CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-brand-border text-xs font-semibold text-brand-navy/70 hover:text-brand-navy hover:bg-brand-bg transition-all">
              <ShieldAlert className="h-3.5 w-3.5" />
              Admin
            </Link>
            <a href={`${HODU.lmsUrl}/register`} target="_blank" rel="noreferrer"
              className="bg-brand-maroon hover:bg-brand-accent text-white px-5 py-2 rounded-lg text-sm font-bold transition-all">
              Enroll Now
            </a>
          </div>

          {/* Mobile toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Link href="/admin" className="px-2.5 py-1 rounded border text-[11px] font-bold text-brand-navy/80 border-brand-border uppercase">Admin</Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-brand-navy hover:bg-brand-bg">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-brand-border bg-white animate-fade-in">
          <div className="px-4 pt-2 pb-5 space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-brand-navy hover:bg-brand-bg">Home</Link>

            {/* Courses accordion */}
            <div>
              <button onClick={() => setMobileCourses(!mobileCourses)}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium text-brand-navy hover:bg-brand-bg">
                Courses <ChevronDown className={`h-4 w-4 transition-transform ${mobileCourses ? 'rotate-180' : ''}`} />
              </button>
              {mobileCourses && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-brand-border pl-3">
                  {courses.map(c => (
                    <Link key={c.label} href={c.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 py-2 px-2 text-sm text-brand-navy/80 hover:text-brand-maroon">
                      {c.icon} {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Study Materials accordion */}
            <div>
              <button onClick={() => setMobileMaterials(!mobileMaterials)}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium text-brand-navy hover:bg-brand-bg">
                Study Materials <ChevronDown className={`h-4 w-4 transition-transform ${mobileMaterials ? 'rotate-180' : ''}`} />
              </button>
              {mobileMaterials && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-brand-border pl-3">
                  {studyMaterials.map(m => (
                    <Link key={m.label} href={m.href} onClick={() => setMobileOpen(false)}
                      className="block py-2 px-2 text-sm text-brand-navy/80 hover:text-brand-maroon">
                      {m.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {[{ label: 'Offline Coaching', href: '/offline' }, { label: 'About Us', href: '/about' }, { label: 'Blog', href: '/blog' }, { label: 'Contact', href: '/contact' }].map(item => (
              <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-sm font-medium text-brand-navy hover:bg-brand-bg">
                {item.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-brand-border">
              <a href={`${HODU.lmsUrl}/register`} target="_blank" rel="noreferrer"
                className="block w-full bg-brand-maroon text-white font-bold py-3 rounded-lg text-sm text-center">
                Enroll Now
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
