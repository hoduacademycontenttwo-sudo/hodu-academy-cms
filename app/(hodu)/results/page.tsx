import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/server'
import { Trophy, ShieldCheck, Award, Star, GraduationCap } from 'lucide-react'
import EnquiryForm from '@/components/hodu/EnquiryForm'
import AcademicExcellenceResults from '@/components/hodu/AcademicExcellenceResults'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Results & Top Rankers — Hodu Academy | Hall of Fame',
  description: 'Discover the exceptional achievements of Hodu Academy students across Cambridge IGCSE, IB Diploma, CBSE Class 10 & 12, IIT-JEE, and NEET.',
}

export default async function ResultsPage() {
  let customDecks: any[] | undefined = undefined

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('cms_gallery')
      .select('*')
      .eq('site_id', HODU_SITE_ID)
      .eq('category', 'Academic Excellence Decks')
      .order('sort_order')

    if (data && data.length > 0) {
      customDecks = data.map(row => {
        try {
          const parsed = JSON.parse(row.caption || '{}')
          return {
            id: row.id,
            tabLabel: parsed.tabLabel || row.title || 'Result',
            cardTitle: parsed.cardTitle || row.title || 'ACADEMIC RESULTS',
            themeColor: parsed.themeColor || '#1A6ECB',
            pillBg: parsed.pillBg || 'bg-[#1A6ECB]',
            bgFrom: parsed.bgFrom || '#FFFDF0',
            bgVia: parsed.bgVia || '#FFF8E1',
            bgTo: parsed.bgTo || '#FFF3CD',
            is_featured_on_home: parsed.is_featured_on_home !== false,
            topRanker: parsed.topRanker || {
              name: 'Topper Name',
              score: '99.6%',
              photo: row.image_url,
              initials: 'TN',
              designation: 'Top Ranker',
            },
            performers: parsed.performers || [],
          }
        } catch {
          return null
        }
      }).filter(Boolean)
    }
  } catch (err) {
    console.error('Error fetching academic decks:', err)
  }

  return (
    <div className="space-y-0 animate-fade-in bg-brand-bg text-brand-text">
      {/* ─── Hero Banner ─── */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-b from-[#2D0909] via-[#1F0404] to-[#120202] text-white overflow-hidden border-b border-brand-maroon/30">
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#bd9f67]/20 border border-[#bd9f67]/40 text-[#f1ddb6] text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full">
            <Trophy size={14} className="text-[#bd9f67]" />
            <span>HALL OF FAME</span>
          </div>

          <h1 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Our Star Performers & Rankers
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
            Celebrating the hard work, consistency, and remarkable milestones achieved by Hodu Academy students across International & National boards.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-semibold text-amber-200/90">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <ShieldCheck size={14} className="text-amber-400" />
              100% Verified Marks
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <Award size={14} className="text-amber-400" />
              99+ Percentilers in JEE & NEET
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-lg border border-white/10">
              <Star size={14} className="text-amber-400" />
              Perfect Scores in Cambridge & IB
            </span>
          </div>
        </div>
      </section>

      {/* ─── Academic Excellence Results Banner Decks (Customizable, All Decks, No Self-Explore Buttons) ─── */}
      <AcademicExcellenceResults decks={customDecks} showViewAllButton={false} />

      {/* ─── Bottom CTA / Enquiry Section ─── */}
      <section className="py-14 sm:py-20 bg-white border-t border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-brand-maroon text-xs font-bold uppercase tracking-widest bg-brand-blush px-3 py-1 rounded-full border border-brand-border">
              ADMISSIONS OPEN 2026–27
            </span>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-bold text-brand-maroon leading-tight">
              Ready to be Our Next Star Ranker?
            </h2>
            <p className="text-sm text-brand-muted leading-relaxed">
              Book a 1-on-1 academic diagnostic counseling session with our senior faculty. Get personalized subject roadmap, syllabus planning, and batch details.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-brand-text">
              <div className="flex items-center gap-2 bg-brand-bg px-3.5 py-2 rounded-xl border border-brand-border">
                <GraduationCap className="h-4 w-4 text-brand-maroon" />
                <span>Small 1:12 Interactive Batches</span>
              </div>
              <div className="flex items-center gap-2 bg-brand-bg px-3.5 py-2 rounded-xl border border-brand-border">
                <ShieldCheck className="h-4 w-4 text-brand-maroon" />
                <span>1-on-1 Faculty Mentoring</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-brand-bg p-6 sm:p-8 rounded-3xl border border-brand-border shadow-xs">
            <h3 className="font-serif-editorial text-xl font-bold text-brand-maroon mb-2">
              Book Free Diagnostic & Campus Tour
            </h3>
            <p className="text-xs text-brand-muted mb-6">
              Fill out this quick form and our academic counselor will contact you within 24 hours.
            </p>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </div>
  )
}
