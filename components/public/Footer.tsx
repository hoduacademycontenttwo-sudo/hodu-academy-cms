import Link from 'next/link'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import type { Site } from '@/types'

interface FooterProps {
  site: Site
  siteSlug: string
}

export default function Footer({ site, siteSlug }: FooterProps) {
  const base = `/${siteSlug}`
  return (
    <footer className="bg-[#1B2A44] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xl font-bold text-white mb-3">{site.name}</p>
            <p className="text-sm text-white/60 mb-4">Empowering students to achieve their dreams through quality education and expert guidance.</p>
            <div className="flex gap-3">
              {site.phone && (
                <a href={`tel:${site.phone}`} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#7E0D0D] transition-colors">
                  <Phone size={15} />
                </a>
              )}
              {site.whatsapp && (
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                  <MessageCircle size={15} />
                </a>
              )}
              {site.email && (
                <a href={`mailto:${site.email}`} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#7E0D0D] transition-colors">
                  <Mail size={15} />
                </a>
              )}
            </div>
          </div>

          {/* Programs */}
          <div>
            <p className="font-semibold text-sm mb-4 text-white/90">Programs</p>
            {['NEET Preparation', 'JEE Preparation', 'Foundation (6–10)', 'Test Series', 'Online Courses'].map((l) => (
              <Link key={l} href={`${base}/courses`} className="block text-sm text-white/60 hover:text-white mb-2 transition-colors">{l}</Link>
            ))}
          </div>

          {/* Resources */}
          <div>
            <p className="font-semibold text-sm mb-4 text-white/90">Resources</p>
            {['Previous Year Papers', 'Sample Papers', 'Study Notes', 'Syllabus', 'Blogs'].map((l) => (
              <Link key={l} href={`${base}/resources`} className="block text-sm text-white/60 hover:text-white mb-2 transition-colors">{l}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p className="font-semibold text-sm mb-4 text-white/90">Contact</p>
            {site.address && (
              <p className="flex items-start gap-2 text-sm text-white/60 mb-3">
                <MapPin size={14} className="shrink-0 mt-0.5" /> {site.address}
              </p>
            )}
            {site.phone && (
              <a href={`tel:${site.phone}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-white mb-2">
                <Phone size={14} /> {site.phone}
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 text-sm text-white/60 hover:text-white">
                <Mail size={14} /> {site.email}
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/40 text-xs">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Use'].map((l) => (
              <Link key={l} href="#" className="text-xs text-white/40 hover:text-white">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
