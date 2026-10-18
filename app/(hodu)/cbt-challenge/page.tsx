import { Metadata } from 'next'
import JaipurCbtPage from '@/components/hodu/jaipur-cbt/JaipurCbtPage'
import { HODU_CBT } from '@/components/hodu/jaipur-cbt/brand'
import { SITE_URL } from '@/lib/seo'

// Same page as /jaipur-cbt, branded "Hodu CBT" for sharing with students outside Jaipur.
export const metadata: Metadata = {
  title: 'Hodu CBT Challenge 2026–27 | Free NEET, JEE, BITSAT, CUET Computer-Based Test Series',
  description:
    'NEET UG 2027 is a computer-based test (CBT). Practise now with Hodu Academy’s free Saturday CBT series for NEET, JEE Main, BITSAT and CUET: real on-screen papers, a rank among every student who sits the paper and detailed analysis. 24 Oct – 16 Jan, online from home or at our Jaipur centre.',
  alternates: {
    canonical: '/cbt-challenge',
  },
  openGraph: {
    title: 'Hodu CBT Challenge 2026–27 | Hodu Academy',
    description: 'Don’t let exam day be your first CBT. Free Saturday test series with a rank and detailed analysis.',
    url: `${SITE_URL}/cbt-challenge`,
  },
}

export default function Page() {
  return <JaipurCbtPage brand={HODU_CBT} />
}
