import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import ResultsSection from '@/components/public/ResultsSection'
import CallbackForm from '@/components/public/CallbackForm'
import Footer from '@/components/public/Footer'

export default async function ResultsPage({ params }: { params: Promise<{ siteSlug: string }> }) {
  const { siteSlug } = await params
  const supabase = await createClient()

  const { data: site } = await supabase.from('cms_sites').select('*').eq('slug', siteSlug).single()
  if (!site) return notFound()

  const { data: results } = await supabase.from('cms_results').select('*').eq('site_id', site.id).order('year', { ascending: false })

  return (
    <>
      <Navbar siteSlug={siteSlug} siteName={site.name} logoUrl={site.logo_url} phone={site.phone} />

      <section className="bg-[#FDF5F5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Achievements</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1B2A44] mt-2 mb-3">Our Top Rankers</h1>
          <p className="text-[#1B2A44] opacity-70">Students who trusted us and achieved their dream rank.</p>
        </div>
      </section>

      <ResultsSection results={results ?? []} />
      <CallbackForm siteSlug={siteSlug} siteId={site.id} />
      <Footer site={site} siteSlug={siteSlug} />
    </>
  )
}
