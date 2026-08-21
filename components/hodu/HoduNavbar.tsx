'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShieldAlert, ChevronDown, ArrowRight } from 'lucide-react'
import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/client'

export interface NavItem {
  label: string
  href: string
  icon?: string | null
}

const fallbackCourses: NavItem[] = [
  { label: 'IGCSE & Cambridge', href: '/courses?category=IGCSE', icon: '🌐' },
  { label: 'IB Programme',       href: '/courses?category=IB',   icon: '🎓' },
  { label: 'CBSE (Class 9–12)',  href: '/courses?category=CBSE', icon: '📚' },
  { label: 'JEE / NEET',        href: '/courses?category=Competitive+Exams', icon: '🏆' },
  { label: 'Olympiads',          href: '/courses?category=Olympiads', icon: '🥇' },
  { label: 'Online Courses',     href: '/courses', icon: '📡' },
]

const fallbackStudyMaterials: NavItem[] = [
  { label: 'JEE Main',          href: '/study-materials/jee-main', icon: '⚛️' },
  { label: 'JEE Advanced',      href: '/study-materials/jee-advanced', icon: '🔬' },
  { label: 'NEET',              href: '/study-materials/neet', icon: '🧬' },
  { label: 'NCERT Solutions',   href: '/study-materials/ncert-solutions', icon: '📚' },
  { label: 'CBSE',              href: '/study-materials/cbse', icon: '🎯' },
  { label: 'Olympiad',          href: '/study-materials/olympiad', icon: '🏅' },
]

interface DropdownProps {
  label: string
  href: string
  items: NavItem[]
  isActive: boolean
}

function Dropdown({ label, href, items, isActive }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  function handleMouseEnter() {
    if (timer.current) clearTimeout(timer.current)
    setOpen(true)
  }

  function handleMouseLeave() {
    timer.current = setTimeout(() => {
      setOpen(false)
    }, 150)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div
      ref={dropdownRef}
      className="relative group py-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center">
        <Link
          href={href}
          onClick={() => setOpen(false)}
          className={`flex items-center text-sm font-medium transition-colors ${
            isActive
              ? 'text-brand-maroon font-bold'
              : 'text-brand-navy hover:text-brand-maroon'
          }`}
        >
          {label}
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setOpen((prev) => !prev)
          }}
          className={`p-1.5 ml-0.5 rounded-md transition-colors ${
            open || isActive
              ? 'text-brand-maroon bg-brand-bg/60'
              : 'text-brand-navy hover:text-brand-maroon'
          }`}
          aria-expanded={open}
          aria-label={`Toggle ${label} menu`}
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              open ? 'rotate-180 text-brand-maroon' : ''
            }`}
          />
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 pt-2 z-50 animate-fade-in">
          <div className="bg-white border border-brand-border rounded-xl shadow-xl overflow-hidden min-w-[230px] p-1.5">
            <div className="px-3 py-1.5 mb-1 border-b border-brand-border/60 flex items-center justify-between">
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="text-[11px] font-bold uppercase tracking-wider text-brand-maroon hover:underline flex items-center gap-1"
              >
                All {label} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {items.map((item) => {
              const isItemActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isItemActive
                      ? 'bg-brand-bg text-brand-maroon font-bold'
                      : 'text-brand-navy hover:bg-brand-bg hover:text-brand-maroon'
                  }`}
                >
                  {item.icon && <span className="text-base shrink-0">{item.icon}</span>}
                  <span className="font-medium text-xs sm:text-sm">{item.label}</span>
                  <ChevronDown className="h-3 w-3 ml-auto -rotate-90 text-brand-navy/30" />
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

interface HoduNavbarProps {
  siteName?: string
  logoUrl?: string
  initialCourses?: NavItem[]
  initialStudyMaterials?: NavItem[]
}

export default function HoduNavbar({
  siteName = HODU.name,
  logoUrl = '',
  initialCourses,
  initialStudyMaterials,
}: HoduNavbarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileCourses, setMobileCourses] = useState(false)
  const [mobileMaterials, setMobileMaterials] = useState(false)
  const [courses, setCourses] = useState<NavItem[]>(
    initialCourses && initialCourses.length > 0 ? initialCourses : fallbackCourses
  )
  const [studyMaterials, setStudyMaterials] = useState<NavItem[]>(
    initialStudyMaterials && initialStudyMaterials.length > 0 ? initialStudyMaterials : fallbackStudyMaterials
  )

  // Client-side fallback sync with graceful error handling
  useEffect(() => {
    let isMounted = true
    try {
      const supabase = createClient()
      Promise.all([
        supabase
          .from('cms_nav_links')
          .select('label, href, icon')
          .eq('site_id', HODU_SITE_ID)
          .eq('group_name', 'courses')
          .order('sort_order'),
        supabase
          .from('cms_nav_links')
          .select('label, href, icon')
          .eq('site_id', HODU_SITE_ID)
          .eq('group_name', 'study_materials')
          .order('sort_order'),
      ])
        .then(([coursesRes, materialsRes]) => {
          if (!isMounted) return
          if (coursesRes.data && coursesRes.data.length > 0) {
            setCourses(coursesRes.data as NavItem[])
          }
          if (materialsRes.data && materialsRes.data.length > 0) {
            setStudyMaterials(materialsRes.data as NavItem[])
          }
        })
        .catch(() => {
          // Keep initial or fallback items silently on connection issues
        })
    } catch {
      // Ignore client supabase instantiation errors
    }
    return () => {
      isMounted = false
    }
  }, [])

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const isCoursesActive = pathname === '/courses' || pathname.startsWith('/courses/') || pathname.startsWith('/courses?')
  const isStudyMaterialsActive = pathname === '/study-materials' || pathname.startsWith('/study-materials/')

  const navLinks = [
    { label: 'Home', href: '/', isActive: pathname === '/' },
    { label: 'Offline', href: '/offline', isActive: pathname === '/offline' },
    { label: 'About', href: '/about', isActive: pathname === '/about' },
    { label: 'Blog', href: '/blog', isActive: pathname === '/blog' || pathname.startsWith('/blog/') },
    { label: 'Contact', href: '/contact', isActive: pathname === '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-white border-b border-brand-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-9 w-9 rounded-lg object-cover shadow-md shrink-0" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-maroon text-white font-extrabold text-xl shadow-md shrink-0">
                {siteName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col leading-none">
              <span className="text-lg font-extrabold tracking-tight text-brand-navy group-hover:text-brand-maroon transition-colors">
                {siteName}
              </span>
              <span className="text-[9px] font-semibold tracking-widest text-brand-accent uppercase">
                EXCELLENCE PRESCRIBED
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            <Link
              href="/"
              className={`nav-link text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-brand-maroon font-bold' : 'text-brand-navy hover:text-brand-maroon'
              }`}
            >
              Home
            </Link>
            <Dropdown label="Courses" href="/courses" items={courses} isActive={isCoursesActive} />
            <Dropdown label="Study Materials" href="/study-materials" items={studyMaterials} isActive={isStudyMaterialsActive} />
            <Link
              href="/offline"
              className={`nav-link text-sm font-medium transition-colors ${
                pathname === '/offline' ? 'text-brand-maroon font-bold' : 'text-brand-navy hover:text-brand-maroon'
              }`}
            >
              Offline
            </Link>
            <Link
              href="/about"
              className={`nav-link text-sm font-medium transition-colors ${
                pathname === '/about' ? 'text-brand-maroon font-bold' : 'text-brand-navy hover:text-brand-maroon'
              }`}
            >
              About
            </Link>
            <Link
              href="/blog"
              className={`nav-link text-sm font-medium transition-colors ${
                pathname === '/blog' || pathname.startsWith('/blog/') ? 'text-brand-maroon font-bold' : 'text-brand-navy hover:text-brand-maroon'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`nav-link text-sm font-medium transition-colors ${
                pathname === '/contact' ? 'text-brand-maroon font-bold' : 'text-brand-navy hover:text-brand-maroon'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-brand-border text-xs font-semibold text-brand-navy/70 hover:text-brand-navy hover:bg-brand-bg transition-all"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-brand-maroon" />
              Admin
            </Link>
            <Link
              href="/enroll"
              className="bg-brand-maroon hover:bg-brand-accent text-white px-5 py-2 rounded-lg text-sm font-bold transition-all inline-block text-center shadow-sm"
            >
              Enroll Now
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/admin"
              className="px-2.5 py-1 rounded border text-[11px] font-bold text-brand-navy/80 border-brand-border uppercase hover:bg-brand-bg"
            >
              Admin
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-brand-navy hover:bg-brand-bg transition-colors"
              aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-brand-border bg-white animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 pt-3 pb-6 space-y-1.5">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/' ? 'bg-brand-bg text-brand-maroon font-bold' : 'text-brand-navy hover:bg-brand-bg'
              }`}
            >
              Home
            </Link>

            {/* Courses accordion */}
            <div className="border border-brand-border/60 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-brand-bg/40">
                <Link
                  href="/courses"
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    isCoursesActive ? 'text-brand-maroon font-bold' : 'text-brand-navy hover:text-brand-maroon'
                  }`}
                >
                  Courses
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileCourses(!mobileCourses)}
                  className="p-1 text-brand-navy hover:text-brand-maroon"
                  aria-label="Toggle courses submenu"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileCourses ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {mobileCourses && (
                <div className="bg-white px-3 py-2 space-y-1 border-t border-brand-border/60">
                  <Link
                    href="/courses"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-2 px-3 text-xs font-bold text-brand-maroon bg-brand-bg/60 rounded-lg"
                  >
                    <span>View All Courses</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  {courses.map((c) => (
                    <Link
                      key={c.label}
                      href={c.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 py-2 px-3 text-sm rounded-lg transition-colors ${
                        pathname === c.href
                          ? 'bg-brand-bg text-brand-maroon font-bold'
                          : 'text-brand-navy/80 hover:bg-brand-bg hover:text-brand-maroon'
                      }`}
                    >
                      {c.icon && <span>{c.icon}</span>}
                      <span>{c.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Study Materials accordion */}
            <div className="border border-brand-border/60 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-brand-bg/40">
                <Link
                  href="/study-materials"
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    isStudyMaterialsActive ? 'text-brand-maroon font-bold' : 'text-brand-navy hover:text-brand-maroon'
                  }`}
                >
                  Study Materials
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMaterials(!mobileMaterials)}
                  className="p-1 text-brand-navy hover:text-brand-maroon"
                  aria-label="Toggle study materials submenu"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileMaterials ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {mobileMaterials && (
                <div className="bg-white px-3 py-2 space-y-1 border-t border-brand-border/60">
                  <Link
                    href="/study-materials"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-2 px-3 text-xs font-bold text-brand-maroon bg-brand-bg/60 rounded-lg"
                  >
                    <span>View All Study Materials</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  {studyMaterials.map((m) => (
                    <Link
                      key={m.label}
                      href={m.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 py-2 px-3 text-sm rounded-lg transition-colors ${
                        pathname === m.href
                          ? 'bg-brand-bg text-brand-maroon font-bold'
                          : 'text-brand-navy/80 hover:bg-brand-bg hover:text-brand-maroon'
                      }`}
                    >
                      {m.icon && <span>{m.icon}</span>}
                      <span>{m.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {[
              { label: 'Offline Coaching', href: '/offline' },
              { label: 'About Us', href: '/about' },
              { label: 'Blog', href: '/blog' },
              { label: 'Contact', href: '/contact' },
            ].map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-brand-bg text-brand-maroon font-bold' : 'text-brand-navy hover:bg-brand-bg'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}

            <div className="pt-4 border-t border-brand-border">
              <Link
                href="/enroll"
                onClick={() => setMobileOpen(false)}
                className="block w-full bg-brand-maroon hover:bg-brand-accent text-white font-bold py-3 rounded-xl text-sm text-center shadow-md transition-colors"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
