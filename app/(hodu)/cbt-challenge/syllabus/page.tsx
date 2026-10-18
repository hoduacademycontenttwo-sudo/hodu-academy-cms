import { Metadata } from 'next'
import SyllabusPage from '@/components/hodu/jaipur-cbt/SyllabusPage'
import { HODU_CBT } from '@/components/hodu/jaipur-cbt/brand'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Hodu CBT Challenge Syllabus 2026–27 | Test-by-test, Class XI & XII',
  description:
    'Chapter-wise syllabus for all 13 Saturday tests of the Hodu CBT Challenge (24 Oct 2026 – 16 Jan 2027), for Class XI and Class XII / droppers: JEE Main, BITSAT, NEET and CUET.',
  alternates: { canonical: '/cbt-challenge/syllabus' },
  openGraph: { title: 'Hodu CBT Challenge Syllabus 2026–27 | Hodu Academy', url: `${SITE_URL}/cbt-challenge/syllabus` },
}

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <SyllabusPage brand={HODU_CBT} search={await searchParams} />
}
