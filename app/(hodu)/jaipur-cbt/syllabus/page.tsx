import { Metadata } from 'next'
import SyllabusPage from '@/components/hodu/jaipur-cbt/SyllabusPage'
import { JAIPUR_CBT } from '@/components/hodu/jaipur-cbt/brand'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Jaipur CBT Challenge Syllabus 2026–27 | Test-by-test, Class XI & XII',
  description:
    'Chapter-wise syllabus for all 13 Saturday tests of the Jaipur CBT Challenge (24 Oct 2026 – 16 Jan 2027), for Class XI and Class XII / droppers: JEE Main, BITSAT, NEET and CUET.',
  alternates: { canonical: '/jaipur-cbt/syllabus' },
  openGraph: { title: 'Jaipur CBT Challenge Syllabus 2026–27 | Hodu Academy', url: `${SITE_URL}/jaipur-cbt/syllabus` },
}

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <SyllabusPage brand={JAIPUR_CBT} search={await searchParams} />
}
