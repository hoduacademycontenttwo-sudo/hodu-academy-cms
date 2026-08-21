'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, ChevronDown, ArrowRight } from 'lucide-react'

interface NavbarProps {
  siteSlug: string
  siteName: string
  logoUrl?: string | null
  phone?: string | null
}

const megaMenuItems = {
  Courses: {
    baseHref: 'courses',
    items: [
      { label: 'NEET Preparation', href: 'courses?category=neet' },
      { label: 'JEE Preparation', href: 'courses?category=jee' },
      { label: 'Classes 6–10', href: 'courses?category=foundation' },
      { label: 'Online Courses', href: 'courses?mode=online' },
      { label: 'Classroom Courses', href: 'courses?mode=classroom' },
      { label: 'Test Series', href: 'courses?category=test-series' },
    ],
  },
  Results: {
    baseHref: 'results',
    items: [
      { label: 'NEET Results', href: 'results?exam=neet' },
      { label: 'JEE Results', href: 'results?exam=jee' },
      { label: 'Top Rankers', href: 'results' },
    ],
  },
  Resources: {
    baseHref: 'resources',
    items: [
      { label: 'Previous Year Papers', href: 'resources?type=pyq' },
      { label: 'Sample Papers', href: 'resources?type=sample' },
      { label: 'Study Notes', href: 'resources?type=notes' },
      { label: 'Syllabus', href: 'resources?type=syllabus' },
    ],
  },
}

export default function Navbar({ siteSlug, siteName, logoUrl, phone }: NavbarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLElement>(null)

  const base = `/${siteSlug}`

  function handleMouseEnter(label: string) {
    if (timer.current) clearTimeout(timer.current)
    setOpenMenu(label)
  }

  function handleMouseLeave() {
    timer.current = setTimeout(() => {
      setOpenMenu(null)
    }, 150)
  }

  // Click outside and Esc key to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Auto-close on route change
  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
  }, [pathname])

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#F3DCDC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={base} className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-10 w-auto object-contain" />
            ) : (
              <span className="text-xl font-bold text-[#7E0D0D]">{siteName}</span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {Object.entries(megaMenuItems).map(([label, group]) => {
              const isSectionActive = pathname.startsWith(`${base}/${group.baseHref}`)
              const isOpen = openMenu === label

              return (
                <div
                  key={label}
                  className="relative group py-2"
                  onMouseEnter={() => handleMouseEnter(label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center">
                    <Link
                      href={`${base}/${group.baseHref}`}
                      onClick={() => setOpenMenu(null)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isSectionActive
                          ? 'text-[#7E0D0D] font-bold'
                          : 'text-[#1B2A44] hover:text-[#7E0D0D]'
                      }`}
                    >
                      {label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setOpenMenu(isOpen ? null : label)}
                      className="p-1 text-[#1B2A44] hover:text-[#7E0D0D] transition-colors"
                      aria-expanded={isOpen}
                      aria-label={`Toggle ${label} menu`}
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#7E0D0D]' : ''}`}
                      />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="absolute top-full left-0 pt-1.5 z-50 animate-fade-in">
                      <div className="bg-white border border-[#F3DCDC] rounded-xl shadow-xl p-2 min-w-[230px]">
                        <Link
                          href={`${base}/${group.baseHref}`}
                          onClick={() => setOpenMenu(null)}
                          className="flex items-center justify-between px-3 py-2 mb-1 text-xs font-bold text-[#7E0D0D] bg-[#FDF5F5] rounded-lg hover:bg-[#F3DCDC]/50 transition-colors"
                        >
                          <span>All {label}</span>
                          <ArrowRight size={13} />
                        </Link>
                        {group.items.map((item) => (
                          <Link
                            key={item.label}
                            href={`${base}/${item.href}`}
                            onClick={() => setOpenMenu(null)}
                            className="block px-3 py-2 text-sm text-[#1B2A44] hover:bg-[#FDF5F5] hover:text-[#7E0D0D] rounded-lg transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            <Link
              href={`${base}/about`}
              className={`px-4 py-2 font-medium transition-colors text-sm ${
                pathname === `${base}/about` ? 'text-[#7E0D0D] font-bold' : 'text-[#1B2A44] hover:text-[#7E0D0D]'
              }`}
            >
              About
            </Link>
            <Link
              href={`${base}/contact`}
              className={`px-4 py-2 font-medium transition-colors text-sm ${
                pathname === `${base}/contact` ? 'text-[#7E0D0D] font-bold' : 'text-[#1B2A44] hover:text-[#7E0D0D]'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {phone && (
              <a href={`tel:${phone}`} className="flex items-center gap-1 text-sm text-[#1B2A44] hover:text-[#7E0D0D]">
                <Phone size={14} /> {phone}
              </a>
            )}
            <Link
              href={`${base}/contact`}
              className="bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
            >
              Book Free Demo
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-[#1B2A44] rounded-lg hover:bg-[#FDF5F5] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#F3DCDC] px-4 py-4 space-y-2 animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto">
          {Object.entries(megaMenuItems).map(([label, group]) => {
            const isExpanded = expandedMobileSection === label
            return (
              <div key={label} className="border border-[#F3DCDC]/80 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 bg-[#FDF5F5]/50">
                  <Link
                    href={`${base}/${group.baseHref}`}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-semibold text-[#1B2A44] hover:text-[#7E0D0D]"
                  >
                    {label}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setExpandedMobileSection(isExpanded ? null : label)}
                    className="p-1 text-[#1B2A44]"
                    aria-label={`Toggle ${label} list`}
                  >
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {isExpanded && (
                  <div className="p-2 space-y-1 bg-white border-t border-[#F3DCDC]/60">
                    <Link
                      href={`${base}/${group.baseHref}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between px-3 py-1.5 text-xs font-bold text-[#7E0D0D] bg-[#FDF5F5] rounded-lg"
                    >
                      <span>View All {label}</span>
                      <ArrowRight size={12} />
                    </Link>
                    {group.items.map((item) => (
                      <Link
                        key={item.label}
                        href={`${base}/${item.href}`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-1.5 text-sm text-[#1B2A44] hover:text-[#7E0D0D] hover:bg-[#FDF5F5] rounded-lg"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          <Link
            href={`${base}/about`}
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1B2A44] hover:bg-[#FDF5F5] rounded-lg"
          >
            About
          </Link>
          <Link
            href={`${base}/contact`}
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#1B2A44] hover:bg-[#FDF5F5] rounded-lg"
          >
            Contact
          </Link>

          {phone && (
            <a
              href={`tel:${phone}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 mt-4 border border-[#F3DCDC] text-[#1B2A44] py-3 rounded-lg text-sm font-medium hover:bg-[#FDF5F5]"
            >
              <Phone size={15} /> {phone}
            </a>
          )}
          <Link
            href={`${base}/contact`}
            onClick={() => setMobileOpen(false)}
            className="block mt-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-center font-semibold py-3 rounded-lg shadow-sm transition-colors"
          >
            Book Free Demo
          </Link>
        </div>
      )}
    </header>
  )
}
