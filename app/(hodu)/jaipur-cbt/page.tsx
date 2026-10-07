import { Metadata } from 'next'
import JaipurCbtPage from '@/components/hodu/jaipur-cbt/JaipurCbtPage'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Jaipur CBT Challenge 2026–27 | Free NEET, JEE, BITSAT, CUET Computer-Based Test Series',
  description:
    'NEET UG 2027 is a computer-based test (CBT). Practise now with Hodu Academy’s free Saturday CBT series for NEET, JEE Main, BITSAT and CUET: real on-screen papers, a Jaipur rank and detailed analysis. 17 Oct – 16 Jan, at our Vaishali Estate lab or from home.',
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
