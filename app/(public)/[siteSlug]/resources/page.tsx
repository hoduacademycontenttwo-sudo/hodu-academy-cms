import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import { FileText, Download, ExternalLink } from 'lucide-react'

const typeColors: Record<string, string> = {
  Blog:           'bg-blue-50 text-blue-700',
  PYQ:            'bg-purple-50 text-purple-700',
  'Sample Paper': 'bg-green-50 text-green-700',
  Notes:          'bg-yellow-50 text-yellow-700',
  Syllabus:       'bg-orange-50 text-orange-700',
  'Answer Key':   'bg-pink-50 text-pink-700',
  'Mock Test':    'bg-red-50 text-red-700',
}

export default async function ResourcesPage({ params, searchParams }: { params: Promise<{ siteSlug: string }>; searchParams: Promise<{ type?: string }> }) {
  const { siteSlug } = await params
  const sp = await searchParams
  const supabase = await createClient()

  const { data: site } = await supabase.from('cms_sites').select('*').eq('slug', siteSlug).single()
  if (!site) return notFound()

  // Fetch all types first (unfiltered), then apply filter for the grid
  const [{ data: allForTypes }, { data: resources }] = await Promise.all([
    supabase.from('cms_resources').select('type').eq('site_id', site.id),
    (() => {
      let q = supabase.from('cms_resources').select('*').eq('site_id', site.id).order('created_at', { ascending: false })
      if (sp.type) q = q.eq('type', sp.type)
      return q
    })(),
  ])

  const types = Array.from(new Set((allForTypes ?? []).map((r: any) => r.type)))

  return (
    <>
      <Navbar siteSlug={siteSlug} siteName={site.name} logoUrl={site.logo_url} phone={site.phone} />

      <section className="bg-[#FDF5F5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Content Library</span>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1B2A44] mt-2 mb-3">Resources</h1>
          <p className="text-[#1B2A44] opacity-70">PYQs, notes, blogs, sample papers and more — all in one place.</p>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['All', ...types].map((t) => (
              <a key={t} href={t === 'All' ? `/${siteSlug}/resources` : `/${siteSlug}/resources?type=${t}`}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  (sp.type === t || (!sp.type && t === 'All'))
                    ? 'bg-[#7E0D0D] text-white border-[#7E0D0D]'
                    : 'bg-[#FDF5F5] text-[#1B2A44] border-[#F3DCDC] hover:bg-[#F3DCDC]'
                }`}>{t}</a>
            ))}
          </div>

          {!resources?.length ? (
            <p className="text-center text-[#C9C8CB] py-16">No resources available yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((r: any) => (
                <div key={r.id} className="bg-white border border-[#F3DCDC] rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#FDF5F5] rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-[#7E0D0D]" />
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[r.type] ?? 'bg-gray-50 text-gray-600'}`}>{r.type}</span>
                  </div>
                  <h3 className="font-semibold text-[#1B2A44] mb-1 text-sm leading-snug">{r.title}</h3>
                  {r.category && <p className="text-xs text-[#C9C8CB] mb-3">{r.category}</p>}
                  {r.content && <p className="text-xs text-[#1B2A44] opacity-70 mb-3 line-clamp-2">{r.content}</p>}
                  {r.file_url && (
                    <a href={r.file_url} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-[#7E0D0D] font-medium hover:underline">
                      <Download size={13} /> Download / View
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer site={site} siteSlug={siteSlug} />
    </>
  )
}
