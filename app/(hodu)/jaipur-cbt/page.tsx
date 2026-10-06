import { Metadata } from 'next'
import JaipurCbtPage from '@/components/hodu/jaipur-cbt/JaipurCbtPage'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Jaipur CBT Challenge 2026–27 | Free JEE, NEET, BITSAT, CUET Test Series',
  description:
    'A free Saturday computer-based test series by Hodu Academy for JEE Main, NEET, BITSAT and CUET aspirants. Real on-screen papers, a Jaipur rank and detailed analysis. 15 Oct – 15 Jan, at our Vaishali Estate lab or from home.',
  alternates: {
    canonical: '/jaipur-cbt',
  },
  openGraph: {
    title: 'Jaipur CBT Challenge 2026–27 | Hodu Academy',
    description:
      'Don’t let exam day be your first CBT. Free Saturday test series with a Jaipur rank and detailed analysis.',
    url: `${SITE_URL}/jaipur-cbt`,
    images: [{ url: '/images/jaipur_cbt_poster_1.jpg', width: 1200, height: 630, alt: 'Jaipur CBT Challenge' }],
  },
}

export default function Page() {
  return <JaipurCbtPage />
}
