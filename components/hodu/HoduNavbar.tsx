'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Phone,
  Mail,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap
} from 'lucide-react'
import { HODU } from '@/lib/hodu'
import PortalLoginButton from './PortalLoginButton'

// Mega Menu Structure matching hoduacademy.com
const LEARNERS_HUB_DATA = {
  row1: [
    {
      title: 'INTERNATIONAL BOARDS',
      links: [
        { label: 'IGCSE', href: '/mod/page/view.php?id=707' },
        { label: 'IBDP', href: '/mod/page/view.php?id=712' },
        { label: 'A levels', href: '/mod/page/view.php?id=710' },
        { label: 'O Level', href: '/mod/page/view.php?id=711' },
        { label: 'AP Exams', href: '/mod/page/view.php?id=716' },
      ],
    },
    {
      title: 'COMPETITIVE EXAMS',
      links: [
        { label: 'JEE Main', href: '/mod/page/view.php?id=806', hasArrow: true },
        { label: 'JEE Advance', href: '/mod/page/view.php?id=820', hasArrow: true },
        { label: 'NEET', href: '/mod/page/view.php?id=834', hasArrow: true },
        { label: 'CUET', href: '/mod/page/view.php?id=714' },
      ],
    },
    {
      title: 'BOARD EXAMS',
      links: [
        { label: 'CBSE', href: '/mod/page/view.php?id=708', hasArrow: true },
        { label: 'ICSE', href: '/mod/page/view.php?id=717' },
        { label: 'State Boards', href: '/mod/page/view.php?id=718' },
      ],
    },
    {
      title: 'OLYMPIADS',
      links: [
        { label: 'Science olympiad (NSO) Mock papers', href: '/mod/page/view.php?id=802' },
        { label: 'Maths olympiad (IMO) Mock papers', href: '/mod/page/view.php?id=803' },
        { label: 'G.K olympiad (IGKO) Mock papers', href: '/mod/page/view.php?id=799' },
        { label: 'English olympiad (IEO) Mock papers', href: '/mod/page/view.php?id=798' },
      ],
    },
    {
      title: 'IMPORTANT FORMULAS',
      links: [
        { label: 'CBSE', href: '/mod/page/view.php?id=727', hasArrow: true },
        { label: 'IGCSE', href: '/mod/page/view.php?id=728', hasArrow: true },
      ],
    },
  ],
  row2: [
    {
      title: 'IMPORTANT CONCEPTS',
      links: [
        { label: 'Physics', href: '/mod/page/view.php?id=723' },
        { label: 'Maths', href: '/mod/page/view.php?id=724' },
        { label: 'Chemistry', href: '/mod/page/view.php?id=725' },
        { label: 'Biology', href: '/mod/page/view.php?id=726' },
      ],
    },
    {
      title: 'NCERT SOLUTIONS',
      links: [
        { label: 'Class 6', href: '/mod/page/view.php?id=690' },
        { label: 'Class 7', href: '/mod/page/view.php?id=689' },
        { label: 'Class 8', href: '/mod/page/view.php?id=688' },
        { label: 'Class 9', href: '/mod/page/view.php?id=685' },
        { label: 'Class 10', href: '/mod/page/view.php?id=687' },
      ],
    },
    {
      title: 'BOOK SOLUTIONS',
      links: [
        { label: 'RD Sharma Solutions', href: '/mod/page/view.php?id=729' },
        { label: 'HC Verma Solutions', href: '/mod/page/view.php?id=730' },
        { label: 'RS Aggarwal Solutions', href: '/mod/page/view.php?id=731' },
        { label: 'Lakhmir Singh solutions', href: '/mod/page/view.php?id=732' },
      ],
    },
    {
      title: 'PRACTICE PAPERS',
      links: [
        { label: 'Full Syllabus Sample Papers', href: '/mod/page/view.php?id=864', hasArrow: true },
        { label: 'Half Yearly Sample Papers', href: '/mod/page/view.php?id=795' },
      ],
    },
    {
      title: 'COURSES & PROGRAMS',
      links: [
        { label: 'All Courses & Batches', href: '/courses', hasArrow: true },
        { label: 'Test Series Schedule', href: '/mod/page/view.php?id=846' },
        { label: 'Live 1-on-1 Mentorship', href: '/contact' },
      ],
    },
  ],
}

interface HoduNavbarProps {
  siteName?: string
  logoUrl?: string
  initialCourses?: any[]
  initialStudyMaterials?: any[]
}

export default function HoduNavbar({
  siteName = HODU.name,
  logoUrl = '',
}: HoduNavbarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [hubOpen, setHubOpen] = useState(false)
  const [mobileHubExpanded, setMobileHubExpanded] = useState(false)
  const hubTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hubRef = useRef<HTMLDivElement>(null)

  function handleHubEnter() {
    if (hubTimer.current) clearTimeout(hubTimer.current)
    setHubOpen(true)
  }

  function handleHubLeave() {
    hubTimer.current = setTimeout(() => {
      setHubOpen(false)
    }, 150)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (hubRef.current && !hubRef.current.contains(e.target as Node)) {
        setHubOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setHubOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    setHubOpen(false)
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

  const isLearnersHubActive =
    pathname.startsWith('/mod/page/view.php') ||
    pathname.startsWith('/p/') ||
    pathname === '/study-materials' ||
    pathname.startsWith('/study-materials/')

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-brand-border">
      {/* Solid Maroon Top Bar */}
      <div className="bg-[#7A001F] text-white text-[11px] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-2 text-white/90">
            <Mail className="h-3.5 w-3.5 text-white/80" />
            <a href="mailto:contact@hoduacademy.com" className="hover:underline text-white/90">
              contact@hoduacademy.com
            </a>
          </div>
          <div className="flex items-center gap-6 text-white/90">
            <div className="flex items-center gap-1.5">
              <span>Contact Us</span>
              <a href="tel:+919257879555" className="hover:underline font-bold text-white flex items-center gap-1">
                <Phone className="h-3 w-3" /> +91-9257879555
              </a>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-3 text-white/80 border-l border-white/20 pl-4">
              <a href="https://www.youtube.com/@hoduacademy" target="_blank" rel="noreferrer" className="hover:text-white" title="YouTube">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://instagram.com/hoduacademy" target="_blank" rel="noreferrer" className="hover:text-white" title="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://facebook.com/hoduacademy" target="_blank" rel="noreferrer" className="hover:text-white" title="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://linkedin.com/company/hoduacademy" target="_blank" rel="noreferrer" className="hover:text-white" title="LinkedIn">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo with subtitle */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 mr-4 lg:mr-8">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-10 w-10 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7A001F] text-white font-bold text-lg shrink-0 shadow-xs">
                {siteName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight text-[#7A001F] whitespace-nowrap">
                {siteName}
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-neutral-500 uppercase whitespace-nowrap mt-0.5">
                Your Global Classroom
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 flex-1 whitespace-nowrap">
            <Link
              href="/"
              className={`text-xs 2xl:text-sm font-bold transition-colors ${
                pathname === '/' ? 'text-[#7A001F] font-black' : 'text-neutral-800 hover:text-[#7A001F]'
              }`}
            >
              Home
            </Link>

            <Link
              href="/offline"
              className={`text-xs 2xl:text-sm font-bold transition-colors ${
                pathname === '/offline' ? 'text-[#7A001F] font-black' : 'text-neutral-800 hover:text-[#7A001F]'
              }`}
            >
              Offline
            </Link>

            {/* Learner's Hub Mega Menu Dropdown */}
            <div
              ref={hubRef}
              className="relative py-2"
              onMouseEnter={handleHubEnter}
              onMouseLeave={handleHubLeave}
            >
              <button
                type="button"
                onClick={() => setHubOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 text-xs 2xl:text-sm font-bold transition-colors ${
                  isLearnersHubActive || hubOpen
                    ? 'text-[#7A001F] font-black'
                    : 'text-neutral-800 hover:text-[#7A001F]'
                }`}
                aria-expanded={hubOpen}
              >
                <span>Learner&apos;s Hub</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    hubOpen ? 'rotate-180 text-[#7A001F]' : 'text-neutral-500'
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown Container */}
              {hubOpen && (
                <div className="fixed left-1/2 -translate-x-1/2 top-[108px] w-[95vw] max-w-7xl z-50 animate-fade-in">
                  <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-2xl p-6 lg:p-8 max-h-[80vh] overflow-y-auto">
                    
                    {/* Row 1 Grid (5 Columns) */}
                    <div className="grid grid-cols-5 gap-6 lg:gap-8 pb-8 border-b border-neutral-100">
                      {LEARNERS_HUB_DATA.row1.map((col) => (
                        <div key={col.title} className="space-y-3">
                          <h3 className="text-[12px] font-extrabold text-[#111827] uppercase tracking-wider">
                            {col.title}
                          </h3>
                          <ul className="space-y-2">
                            {col.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  onClick={() => setHubOpen(false)}
                                  className="text-[13px] text-neutral-600 hover:text-[#7A001F] hover:font-medium flex items-center justify-between group transition-colors"
                                >
                                  <span>{link.label}</span>
                                  {link.hasArrow && (
                                    <ChevronRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-[#7A001F] group-hover:translate-x-0.5 transition-all" />
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Row 2 Grid (5 Columns) */}
                    <div className="grid grid-cols-5 gap-6 lg:gap-8 pt-8">
                      {LEARNERS_HUB_DATA.row2.map((col) => (
                        <div key={col.title} className="space-y-3">
                          <h3 className="text-[12px] font-extrabold text-[#111827] uppercase tracking-wider">
                            {col.title}
                          </h3>
                          <ul className="space-y-2">
                            {col.links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  href={link.href}
                                  onClick={() => setHubOpen(false)}
                                  className="text-[13px] text-neutral-600 hover:text-[#7A001F] hover:font-medium flex items-center justify-between group transition-colors"
                                >
                                  <span>{link.label}</span>
                                  {link.hasArrow && (
                                    <ChevronRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-[#7A001F] group-hover:translate-x-0.5 transition-all" />
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`text-xs 2xl:text-sm font-bold transition-colors ${
                pathname === '/about' ? 'text-[#7A001F] font-black' : 'text-neutral-800 hover:text-[#7A001F]'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/blog"
              className={`text-xs 2xl:text-sm font-bold transition-colors ${
                pathname === '/blog' || pathname.startsWith('/blog/') ? 'text-[#7A001F] font-black' : 'text-neutral-800 hover:text-[#7A001F]'
              }`}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              className={`text-xs 2xl:text-sm font-bold transition-colors ${
                pathname === '/contact' ? 'text-[#7A001F] font-black' : 'text-neutral-800 hover:text-[#7A001F]'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right Buttons (Log in & Register) */}
          <div className="hidden xl:flex items-center gap-3 shrink-0 ml-4">
            <PortalLoginButton />
            <Link
              href="/enroll"
              className="border-2 border-[#7A001F] text-[#7A001F] hover:bg-[#7A001F] hover:text-white px-4 2xl:px-5 py-2 rounded-full text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
            >
              <span>Register</span>
            </Link>
          </div>

          {/* Mobile toggle */}
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

      {/* Mobile / Tablet Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-brand-border bg-white animate-fade-in max-h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="px-4 pt-3 pb-6 space-y-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                pathname === '/' ? 'bg-neutral-100 text-[#7A001F]' : 'text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              Home
            </Link>

            <Link
              href="/offline"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                pathname === '/offline' ? 'bg-neutral-100 text-[#7A001F]' : 'text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              Offline
            </Link>

            {/* Mobile Learner's Hub Accordion */}
            <div className="border border-neutral-200 rounded-2xl overflow-hidden">
              <div
                onClick={() => setMobileHubExpanded(!mobileHubExpanded)}
                className="flex items-center justify-between px-4 py-3 bg-[#FAF7F7] cursor-pointer"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-[#7A001F]">
                  <BookOpen className="h-4 w-4" />
                  <span>Learner&apos;s Hub</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[#7A001F] transition-transform duration-200 ${
                    mobileHubExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {mobileHubExpanded && (
                <div className="bg-white px-4 py-3 space-y-4 max-h-96 overflow-y-auto">
                  {[...LEARNERS_HUB_DATA.row1, ...LEARNERS_HUB_DATA.row2].map((section) => (
                    <div key={section.title} className="space-y-1.5">
                      <h4 className="text-[11px] font-extrabold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-1">
                        {section.title}
                      </h4>
                      <div className="grid grid-cols-1 gap-1 pl-1">
                        {section.links.map((link) => (
                          <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="py-1 text-xs text-neutral-600 hover:text-[#7A001F] flex items-center justify-between"
                          >
                            <span>{link.label}</span>
                            {link.hasArrow && <ChevronRight className="h-3 w-3 text-neutral-400" />}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                pathname === '/about' ? 'bg-neutral-100 text-[#7A001F]' : 'text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              About Us
            </Link>

            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                pathname === '/blog' || pathname.startsWith('/blog/') ? 'bg-neutral-100 text-[#7A001F]' : 'text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              Blog
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                pathname === '/contact' ? 'bg-neutral-100 text-[#7A001F]' : 'text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              Contact
            </Link>

            <div className="pt-4 border-t border-neutral-200">
              <Link
                href="/enroll"
                onClick={() => setMobileOpen(false)}
                className="block w-full border-2 border-[#7A001F] bg-[#7A001F] text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider text-center transition-colors shadow-xs"
              >
                Register / Enroll Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
