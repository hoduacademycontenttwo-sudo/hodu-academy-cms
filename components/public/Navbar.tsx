'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'

interface NavbarProps {
  siteSlug: string
  siteName: string
  logoUrl?: string | null
  phone?: string | null
}

const megaMenuItems = {
  Courses: [
    { label: 'NEET Preparation', href: 'courses?category=neet' },
    { label: 'JEE Preparation', href: 'courses?category=jee' },
    { label: 'Classes 6–10', href: 'courses?category=foundation' },
    { label: 'Online Courses', href: 'courses?mode=online' },
    { label: 'Classroom Courses', href: 'courses?mode=classroom' },
    { label: 'Test Series', href: 'courses?category=test-series' },
  ],
  Results: [
    { label: 'NEET Results', href: 'results?exam=neet' },
    { label: 'JEE Results', href: 'results?exam=jee' },
    { label: 'Top Rankers', href: 'results' },
  ],
  Resources: [
    { label: 'Previous Year Papers', href: 'resources?type=pyq' },
    { label: 'Sample Papers', href: 'resources?type=sample' },
    { label: 'Study Notes', href: 'resources?type=notes' },
    { label: 'Syllabus', href: 'resources?type=syllabus' },
  ],
}

export default function Navbar({ siteSlug, siteName, logoUrl, phone }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const base = `/${siteSlug}`

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#F3DCDC]">
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
          <div className="hidden lg:flex items-center gap-1">
            {Object.entries(megaMenuItems).map(([label, items]) => (
              <div
                key={label}
                className="relative group"
                onMouseEnter={() => setOpenMenu(label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="flex items-center gap-1 px-4 py-2 text-[#1B2A44] font-medium hover:text-[#7E0D0D] transition-colors text-sm">
                  {label} <ChevronDown size={14} />
                </button>
                {openMenu === label && (
                  <div className="absolute top-full left-0 bg-white border border-[#F3DCDC] rounded-xl shadow-lg p-3 min-w-[220px]">
                    {items.map((item) => (
                      <Link
                        key={item.label}
                        href={`${base}/${item.href}`}
                        className="block px-4 py-2 text-sm text-[#1B2A44] hover:bg-[#FDF5F5] hover:text-[#7E0D0D] rounded-lg transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href={`${base}/about`} className="px-4 py-2 text-[#1B2A44] font-medium hover:text-[#7E0D0D] transition-colors text-sm">About</Link>
            <Link href={`${base}/contact`} className="px-4 py-2 text-[#1B2A44] font-medium hover:text-[#7E0D0D] transition-colors text-sm">Contact</Link>
          </div>

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
            className="lg:hidden p-2 text-[#1B2A44]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#F3DCDC] px-4 py-4 space-y-2">
          {Object.entries(megaMenuItems).map(([label, items]) => (
            <div key={label}>
              <p className="text-xs font-bold text-[#C9C8CB] uppercase tracking-widest px-2 pt-2">{label}</p>
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={`${base}/${item.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 text-sm text-[#1B2A44] hover:text-[#7E0D0D]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          {phone && (
            <a
              href={`tel:${phone}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 mt-4 border border-[#F3DCDC] text-[#1B2A44] py-3 rounded-lg text-sm font-medium"
            >
              <Phone size={15} /> {phone}
            </a>
          )}
          <Link
            href={`${base}/contact`}
            onClick={() => setMobileOpen(false)}
            className="block mt-2 bg-[#7E0D0D] text-white text-center font-semibold py-3 rounded-lg"
          >
            Book Free Demo
          </Link>
        </div>
      )}
    </nav>
  )
}
