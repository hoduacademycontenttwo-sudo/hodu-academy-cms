import Link from 'next/link'
import { Mail, Phone, MapPin, Award, CheckCircle2 } from 'lucide-react'
import { HODU } from '@/lib/hodu'

interface HoduFooterProps {
  siteName?: string
  logoUrl?: string
  site?: {
    phone?: string; whatsapp?: string; email?: string; address?: string;
    facebook?: string; instagram?: string; youtube?: string; linkedin?: string;
  } | null
}

export default function HoduFooter({ siteName = HODU.name, logoUrl = '', site }: HoduFooterProps) {
  const phone = site?.phone || HODU.phone
  const email = site?.email || HODU.email
  const address = site?.address || HODU.address
  const socials = {
    youtube: site?.youtube || HODU.socials.youtube,
    instagram: site?.instagram || HODU.socials.instagram,
    facebook: site?.facebook || HODU.socials.facebook,
    linkedin: site?.linkedin || HODU.socials.linkedin,
  }

  return (
    <footer className="bg-brand-navy text-brand-white border-t border-brand-maroon/20">

      {/* Top value props */}
      <div className="border-b border-white/10 py-8 bg-brand-navy/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 justify-center md:justify-start">
              <Award className="h-8 w-8 text-brand-bg shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-brand-white">India's Premier Tutoring Standard</h4>
                <p className="text-xs text-white/60">Curriculum crafted by board planners and Olympiad mentors.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 justify-center md:justify-start">
              <CheckCircle2 className="h-8 w-8 text-brand-bg shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-brand-white">Assured Grade Improvement</h4>
                <p className="text-xs text-white/60">Comprehensive tests, detailed analytics, and continuous support.</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 justify-center md:justify-start">
              <Phone className="h-8 w-8 text-brand-bg shrink-0 animate-pulse" />
              <div>
                <h4 className="font-bold text-sm text-brand-white">Free Career Consultation</h4>
                <p className="text-xs text-white/60">Stuck in learning directions? Request mentorship callback.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-white text-brand-maroon font-bold text-xl">H</div>
              <span className="text-xl font-bold tracking-tight text-white">Hodu Academy</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Structured coaching, expert teachers, personalised support and rigorous evaluation — empowering students to excel in IGCSE, IB, CBSE, JEE, NEET and Olympiads.
            </p>
            <Link href="/contact"
              className="mt-2 text-xs bg-brand-maroon hover:bg-brand-accent text-white px-4 py-2 font-bold rounded shadow transition-all block w-full text-center">
              Request Free Callback
            </Link>
          </div>

          {/* Academic Offerings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-border">Academic Offerings</h4>
            <ul className="space-y-2 text-xs text-white/80">
              {[
                { label: 'IGCSE & O Level Coaching', href: '/courses' },
                { label: 'IB (MYP & DP) Program', href: '/courses' },
                { label: 'CBSE Class 9–12', href: '/courses' },
                { label: 'JEE / NEET Preparation', href: '/courses' },
                { label: 'Olympiad Training', href: '/courses' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-brand-border hover:underline transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-border">Information Portal</h4>
            <ul className="space-y-2 text-xs text-white/80">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us & Faculty', href: '/about' },
                { label: 'Offline Coaching', href: '/offline' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact Us', href: '/contact' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-brand-border hover:underline transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-border">Contact Centre</h4>
            <div className="space-y-2.5 text-xs text-white/80 font-light">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-brand-border shrink-0 mt-0.5" />
                <span>{HODU.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-brand-border shrink-0" />
                <a href={`tel:${HODU.phone}`} className="hover:text-white">{HODU.phone}</a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-brand-border shrink-0" />
                <a href={`mailto:${HODU.email}`} className="hover:text-white truncate">{HODU.email}</a>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              {[
                { label: 'YT', href: HODU.socials.youtube },
                { label: 'IG', href: HODU.socials.instagram },
                { label: 'FB', href: HODU.socials.facebook },
                { label: 'IN', href: HODU.socials.linkedin },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-maroon hover:-translate-y-0.5 flex items-center justify-center text-[10px] font-bold transition-all duration-200">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/60 space-y-4 md:space-y-0">
          <span>© {new Date().getFullYear()} Hodu Academy. All rights reserved.</span>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-white hover:underline">About Us</Link>
            <Link href="/contact" className="hover:text-white hover:underline">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
