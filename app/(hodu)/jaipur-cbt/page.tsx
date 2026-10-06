import { Metadata } from 'next'
import JaipurCbtClient from '@/components/hodu/JaipurCbtClient'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Jaipur CBT Challenge 2026–27 | Free JEE, NEET, BITSAT, CUET Mock Test Series',
  description:
    'Experience real Computer-Based Testing (CBT) for NEET, JEE Main, BITSAT, and CUET in Jaipur. Compete for All-Jaipur rank, attempt at Hodu Academy centre or from home. Register 100% free.',
  alternates: {
    canonical: '/jaipur-cbt',
  },
  openGraph: {
    title: 'Jaipur CBT Challenge 2026–27 | Hodu Academy',
    description:
      'Practice in real exam conditions. Online NEET CBT simulation, Jaipur rank, detailed analytics, and WhatsApp schedule. Free entry.',
    url: `${SITE_URL}/jaipur-cbt`,
    images: [{ url: '/images/jaipur_cbt_poster_1.jpg', width: 1200, height: 630, alt: 'Jaipur CBT Challenge' }],
  },
}

export default function JaipurCbtPage() {
  return <JaipurCbtClient />
}
