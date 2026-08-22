'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  ShieldAlert,
  ChevronDown,
  ArrowRight,
  Phone,
  MapPin,
  Globe,
  Award,
  BookOpen,
  Atom,
  Trophy,
  Video,
  FlaskConical,
  Dna,
  BookCheck,
  Target,
  FileText,
  GraduationCap
} from 'lucide-react'
import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/client'
import PortalLoginButton from './PortalLoginButton'

export interface NavItem {
  label: string
  href: string
  icon?: string | null
}

const fallbackCourses: NavItem[] = [
  { label: 'Cambridge IGCSE & A-Levels', href: '/courses?category=IGCSE' },
  { label: 'IB Diploma Programme (MYP & DP)', href: '/courses?category=IB' },
  { label: 'CBSE Board (Class 9–12)', href: '/courses?category=CBSE' },
  { label: 'IIT-JEE & NEET-UG Integrated', href: '/courses?category=Competitive+Exams' },
  { label: 'Junior Olympiads & Foundation', href: '/courses?category=Olympiads' },
  { label: 'Live Online 1-on-1 Micro Batches', href: '/courses' },
]

const fallbackStudyMaterials: NavItem[] = [
  { label: 'JEE Main Archive & DPPs', href: '/study-materials/jee-main' },
  { label: 'JEE Advanced Master Problems', href: '/study-materials/jee-advanced' },
  { label: 'NEET Diagnostic Tests & Keys', href: '/study-materials/neet' },
  { label: 'NCERT Line-by-Line Solutions', href: '/study-materials/ncert-solutions' },
  { label: 'CBSE Exemplar Question Banks', href: '/study-materials/cbse' },
  { label: 'IMO / NSO Olympiad Workbooks', href: '/study-materials/olympiad' },
]

function getNavIcon(label: string) {
  const l = label.toLowerCase()
  if (l.includes('cambridge') || l.includes('igcse') || l.includes('a-level') || l.includes('o level')) {
    return <Globe className="h-4 w-4 shrink-0 text-brand-maroon" />
  }
  if (l.includes('ib') || l.includes('diploma') || l.includes('myp') || l.includes('dp')) {
    return <Award className="h-4 w-4 shrink-0 text-brand-maroon" />
  }
  if (l.includes('cbse') || l.includes('board') || l.includes('class 9') || l.includes('class 12')) {
    return <BookOpen className="h-4 w-4 shrink-0 text-brand-maroon" />
  }
  if (l.includes('advanced')) {
    return <FlaskConical className="h-4 w-4 shrink-0 text-brand-maroon" />
  }
  if (l.includes('jee') || l.includes('physics') || l.includes('main')) {
    return <Atom className="h-4 w-4 shrink-0 text-brand-maroon" />
  }
  if (l.includes('neet') || l.includes('biology') || l.includes('medical') || l.includes('dna')) {
    return <Dna className="h-4 w-4 shrink-0 text-brand-maroon" />
  }
  if (l.includes('olympiad') || l.includes('imo') || l.includes('nso') || l.includes('foundation')) {
    return <Trophy className="h-4 w-4 shrink-0 text-brand-maroon" />
  }
  if (l.includes('online') || l.includes('live') || l.includes('1-on-1')) {
    return <Video className="h-4 w-4 shrink-0 text-brand-maroon" />
  }
  if (l.includes('ncert') || l.includes('solutions')) {
    return <BookCheck className="h-4 w-4 shrink-0 text-brand-maroon" />
  }
  if (l.includes('exemplar') || l.includes('bank') || l.includes('practice') || l.includes('sets')) {
    return <Target className="h-4 w-4 shrink-0 text-brand-maroon" />
  }
  if (l.includes('archive') || l.includes('dpp') || l.includes('test') || l.includes('key')) {
    return <FileText className="h-4 w-4 shrink-0 text-brand-maroon" />
  }
  return <GraduationCap className="h-4 w-4 shrink-0 text-brand-maroon" />
}

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
      <div className="flex items-center gap-1">
        <Link
          href={href}
          onClick={() => setOpen(false)}
          className={`text-xs xl:text-sm font-bold uppercase tracking-wider transition-colors ${
            isActive
              ? 'text-brand-maroon font-black'
              : 'text-neutral-800 hover:text-brand-maroon'
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
          className={`p-1 rounded transition-colors ${
            open || isActive
              ? 'text-brand-maroon bg-neutral-100'
              : 'text-neutral-600 hover:text-brand-maroon'
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
          <div className="bg-white border-2 border-brand-border rounded-2xl shadow-xl overflow-hidden min-w-[300px] p-2">
            <div className="px-3.5 py-2 mb-1.5 border-b border-brand-border flex items-center justify-between bg-neutral-50 rounded-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                {label} Catalog
              </span>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="text-[10px] font-bold uppercase tracking-wider text-brand-maroon hover:underline flex items-center gap-1"
              >
                View All <ArrowRight className="h-2.5 w-2.5" />
              </Link>
            </div>
            <div className="space-y-1">
              {items.map((item) => {
                const isItemActive = pathname === item.href
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isItemActive
                        ? 'bg-brand-maroon text-white font-bold'
                        : 'text-neutral-800 hover:bg-neutral-50 hover:text-brand-maroon'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg flex items-center justify-center ${isItemActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-brand-maroon'}`}>
                      {getNavIcon(item.label)}
                    </div>
                    <span className="leading-snug">{item.label}</span>
                  </Link>
                )
              })}
            </div>
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
        .catch(() => {})
    } catch {}
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

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

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-brand-border animate-navbar-reveal">
      
      {/* Solid Maroon Top Bar */}
      <div className="bg-brand-crimson text-white text-[11px] py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-4 text-white/90">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <MapPin className="h-3 w-3" /> Jaipur Campus (C-Scheme & Vaishali)
            </span>
            <span className="text-white/40">•</span>
            <span>Admissions Open 2026–27</span>
          </div>
          <div className="flex items-center gap-5 text-white/90">
            <a href={`tel:${HODU.phone}`} className="flex items-center gap-1.5 hover:underline font-bold text-white">
              <Phone className="h-3 w-3" /> Helpline: {HODU.phone}
            </a>
            <span className="text-white/40">•</span>
            <Link href="/contact" className="hover:underline text-white font-medium">
              Book Campus Tour
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Logo with clear margin & 'Your Global Classroom' subtitle */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 mr-4 xl:mr-8">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-10 w-10 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-maroon text-white font-bold text-lg shrink-0">
                {siteName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-brand-maroon whitespace-nowrap">
                {siteName}
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-brand-muted uppercase whitespace-nowrap mt-0.5">
                Your Global Classroom
              </span>
            </div>
          </Link>

          {/* Desktop Nav — single-line links, no wrapping on xl+ */}
          <nav className="hidden xl:flex items-center gap-5 2xl:gap-7 flex-1 whitespace-nowrap">
            <Link
              href="/"
              className={`nav-link text-xs 2xl:text-sm font-bold uppercase tracking-wider transition-colors ${
                pathname === '/' ? 'text-brand-maroon font-black' : 'text-neutral-800 hover:text-brand-maroon'
              }`}
            >
              Home
            </Link>
            <Dropdown label="Courses" href="/courses" items={courses} isActive={isCoursesActive} />
            <Dropdown label="Study Materials" href="/study-materials" items={studyMaterials} isActive={isStudyMaterialsActive} />
            <Link
              href="/offline"
              className={`nav-link text-xs 2xl:text-sm font-bold uppercase tracking-wider transition-colors ${
                pathname === '/offline' ? 'text-brand-maroon font-black' : 'text-neutral-800 hover:text-brand-maroon'
              }`}
            >
              Jaipur Campus
            </Link>
            <Link
              href="/about"
              className={`nav-link text-xs 2xl:text-sm font-bold uppercase tracking-wider transition-colors ${
                pathname === '/about' ? 'text-brand-maroon font-black' : 'text-neutral-800 hover:text-brand-maroon'
              }`}
            >
              Faculty
            </Link>
            <Link
              href="/blog"
              className={`nav-link text-xs 2xl:text-sm font-bold uppercase tracking-wider transition-colors ${
                pathname === '/blog' || pathname.startsWith('/blog/') ? 'text-brand-maroon font-black' : 'text-neutral-800 hover:text-brand-maroon'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className={`nav-link text-xs 2xl:text-sm font-bold uppercase tracking-wider transition-colors ${
                pathname === '/contact' ? 'text-brand-maroon font-black' : 'text-neutral-800 hover:text-brand-maroon'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop CTAs (shown only on xl+ screens) */}
          <div className="hidden xl:flex items-center gap-3 shrink-0 ml-4">
            <PortalLoginButton />
            <Link
              href="/enroll"
              className="bg-brand-maroon hover:bg-brand-crimson text-white px-4 2xl:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-block text-center shadow-xs whitespace-nowrap"
            >
              Admissions 2026–27
            </Link>
          </div>

          {/* Mobile / Tablet toggle (shown on screens < xl) */}
          <div className="flex xl:hidden items-center gap-2">
            <PortalLoginButton compact />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-neutral-800 hover:bg-neutral-100 transition-colors"
              aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-brand-border bg-white animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                pathname === '/' ? 'bg-neutral-100 text-brand-maroon' : 'text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              Home
            </Link>

            {/* Courses accordion */}
            <div className="border-2 border-brand-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50">
                <Link
                  href="/courses"
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-bold transition-colors ${
                    isCoursesActive ? 'text-brand-maroon' : 'text-neutral-800 hover:text-brand-maroon'
                  }`}
                >
                  Courses & Programs
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileCourses(!mobileCourses)}
                  className="p-1 text-neutral-700 hover:text-brand-maroon"
                  aria-label="Toggle courses submenu"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileCourses ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {mobileCourses && (
                <div className="bg-white px-3 py-2 space-y-1 border-t border-brand-border">
                  <Link
                    href="/courses"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-2 px-3 text-xs font-bold text-brand-maroon bg-neutral-50 rounded-xl"
                  >
                    <span>View All Courses</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  {courses.map((c) => (
                    <Link
                      key={c.label}
                      href={c.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 py-2 px-3 text-xs font-semibold rounded-xl transition-colors ${
                        pathname === c.href
                          ? 'bg-brand-maroon text-white font-bold'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-brand-maroon'
                      }`}
                    >
                      {getNavIcon(c.label)}
                      <span>{c.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Study Materials accordion */}
            <div className="border-2 border-brand-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50">
                <Link
                  href="/study-materials"
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-bold transition-colors ${
                    isStudyMaterialsActive ? 'text-brand-maroon' : 'text-neutral-800 hover:text-brand-maroon'
                  }`}
                >
                  Study Materials
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMaterials(!mobileMaterials)}
                  className="p-1 text-neutral-700 hover:text-brand-maroon"
                  aria-label="Toggle study materials submenu"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileMaterials ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {mobileMaterials && (
                <div className="bg-white px-3 py-2 space-y-1 border-t border-brand-border">
                  <Link
                    href="/study-materials"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-2 px-3 text-xs font-bold text-brand-maroon bg-neutral-50 rounded-xl"
                  >
                    <span>View All Materials</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  {studyMaterials.map((m) => (
                    <Link
                      key={m.label}
                      href={m.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 py-2 px-3 text-xs font-semibold rounded-xl transition-colors ${
                        pathname === m.href
                          ? 'bg-brand-maroon text-white font-bold'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-brand-maroon'
                      }`}
                    >
                      {getNavIcon(m.label)}
                      <span>{m.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {[
              { label: 'Jaipur Offline Campus', href: '/offline' },
              { label: 'Faculty & Mentors', href: '/about' },
              { label: 'Academic Blog', href: '/blog' },
              { label: 'Contact Us', href: '/contact' },
            ].map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive ? 'bg-neutral-100 text-brand-maroon' : 'text-neutral-800 hover:bg-neutral-50'
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
                className="block w-full bg-brand-maroon hover:bg-brand-crimson text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider text-center transition-colors shadow-xs"
              >
                Admissions 2026–27
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
