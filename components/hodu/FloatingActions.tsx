'use client'

import { Phone, MessageCircle } from 'lucide-react'
import { HODU } from '@/lib/hodu'

export default function FloatingActions() {
  const cleanPhone = HODU.whatsapp.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hi Hodu Academy, I would like to know more about your courses and admissions.')}`

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 items-end">
      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <MessageCircle className="h-6 w-6 fill-current" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-brand-navy text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
          Chat on WhatsApp
        </span>
      </a>

      {/* Call Button */}
      <a
        href={`tel:${HODU.phone}`}
        aria-label="Call Admissions"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 bg-brand-maroon hover:bg-brand-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <Phone className="h-5 w-5" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-brand-navy text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
          Call Admissions: {HODU.phone}
        </span>
      </a>
    </div>
  )
}
