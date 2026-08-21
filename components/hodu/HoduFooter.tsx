import Link from 'next/link'
import { Mail, Phone, MapPin, Award, CheckCircle2, GraduationCap, ShieldCheck, ArrowRight } from 'lucide-react'
import { HODU } from '@/lib/hodu'

const fallbackOfferings = [
  { label: 'Cambridge IGCSE & A-Levels', href: '/courses?category=IGCSE' },
  { label: 'IB Diploma Programme (MYP & DP)', href: '/courses?category=IB' },
  { label: 'CBSE Board (Classes 9–12)', href: '/courses?category=CBSE' },
  { label: 'IIT-JEE & NEET-UG Integrated', href: '/courses?category=Competitive+Exams' },
  { label: 'Junior Olympiads & Foundation', href: '/courses?category=Olympiads' },
]

const fallbackDescription = "Jaipur's premier academic institute providing structured coaching, master educators, 1:12 intimate batches, and rigorous evaluation — empowering students to excel in Cambridge, IB, CBSE, JEE & NEET."

interface HoduFooterProps {
  siteName?: string
  logoUrl?: string
  site?: {
    phone?: string; whatsapp?: string; email?: string; address?: string;
    facebook?: string; instagram?: string; youtube?: string; linkedin?: string;
    footer_description?: string; footer_cta_text?: string; footer_cta_link?: string;
  } | null
  academicOfferings?: { label: string; href: string }[]
}

export default function HoduFooter({ siteName = HODU.name, logoUrl = '', site, academicOfferings }: HoduFooterProps) {
  const phone = site?.phone || HODU.phone
  const email = site?.email || HODU.email
  const address = site?.address || HODU.address
  const socials = {
    youtube: site?.youtube || HODU.socials.youtube,
    instagram: site?.instagram || HODU.socials.instagram,
    facebook: site?.facebook || HODU.socials.facebook,
    linkedin: site?.linkedin || HODU.socials.linkedin,
  }
  const description = site?.footer_description || fallbackDescription
  const ctaText = site?.footer_cta_text || 'Book Diagnostic Session'
  const ctaLink = site?.footer_cta_link || '/contact'
  const offerings = academicOfferings && academicOfferings.length > 0 ? academicOfferings : fallbackOfferings

  return (
    <footer className="bg-brand-navy text-white border-t border-brand-maroon/25">

      {/* Top Value Propositions */}
      <div className="border-b border-white/10 py-10 bg-brand-midnight/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-brand-gold shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif-editorial font-bold text-base text-white">Premier Tutoring Standard</h4>
                <p className="text-xs text-white/70 font-light mt-1 leading-relaxed">Curriculums curated by certified Cambridge, IB & board examiners.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-brand-gold shrink-0">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif-editorial font-bold text-base text-white">Guaranteed Concept Retention</h4>
                <p className="text-xs text-white/70 font-light mt-1 leading-relaxed">Continuous 1:12 batches, daily DPP sets, and bi-weekly diagnostic tests.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-brand-gold shrink-0">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-serif-editorial font-bold text-base text-white">Free Academic Counselling</h4>
                <p className="text-xs text-white/70 font-light mt-1 leading-relaxed">Direct 1-on-1 strategy sessions with our academic directors.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">

          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center space-x-3">
              {logoUrl ? (
                <img src={logoUrl} alt={siteName} className="h-10 w-10 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-maroon text-white font-black text-xl shrink-0 shadow-md">
                  {siteName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">{siteName}</span>
                <span className="text-[9px] font-black tracking-widest text-brand-gold uppercase">ESTD. 2018 · JAIPUR</span>
              </div>
            </div>
            <p className="text-xs text-white/75 leading-relaxed font-light">
              {description}
            </p>
            <div>
              <Link href={ctaLink}
                className="inline-flex items-center justify-center gap-2 text-xs bg-brand-maroon hover:bg-brand-crimson text-white px-5 py-3 rounded-xl font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg transition-all w-full sm:w-auto">
                <span>{ctaText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Academic Offerings */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-brand-gold">Curriculum Tracks</h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              {offerings.map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-brand-gold hover:underline transition-colors block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-brand-gold">Academy Portal</h4>
            <ul className="space-y-2.5 text-xs text-white/80">
              {[
                { label: 'Home Page', href: '/' },
                { label: 'Jaipur Offline Center', href: '/offline' },
                { label: 'Faculty & Directors', href: '/about' },
                { label: 'Study Materials & DPPs', href: '/study-materials' },
                { label: 'Academic Blog', href: '/blog' },
                { label: 'Contact & Diagnostic', href: '/contact' },
              ].map(l => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-brand-gold hover:underline transition-colors block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-brand-gold">Jaipur Campus</h4>
            <div className="space-y-3 text-xs text-white/80 font-light">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-brand-gold shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white font-semibold">{phone}</a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-brand-gold shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white truncate">{email}</a>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              {[
                { label: 'YouTube', href: socials.youtube },
                { label: 'Instagram', href: socials.instagram },
                { label: 'Facebook', href: socials.facebook },
                { label: 'LinkedIn', href: socials.linkedin },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-brand-maroon hover:text-white text-[10px] font-extrabold uppercase tracking-wider transition-colors border border-white/10">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/15 flex flex-col md:flex-row justify-between items-center text-xs text-white/60 space-y-4 md:space-y-0">
          <span>© {new Date().getFullYear()} {siteName}. All rights reserved. Jaipur, Rajasthan, India.</span>
          <div className="flex space-x-6">
            <Link href="/about" className="hover:text-white hover:underline">About</Link>
            <Link href="/contact" className="hover:text-white hover:underline">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white hover:underline">Admissions Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
