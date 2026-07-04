import Link from 'next/link'
import { HODU } from '@/lib/hodu'
import { BookOpen, Video, FileText, BarChart2, Phone, Mail, ExternalLink } from 'lucide-react'

const features = [
  { icon: Video, title: 'Live & Recorded Classes', desc: 'Attend live sessions or watch recordings anytime, 24/7.' },
  { icon: FileText, title: 'Study Material', desc: 'Chapter notes, DPPs, past papers and full solutions.' },
  { icon: BarChart2, title: 'Test Series & Analytics', desc: 'Percentile-ranked mocks with detailed performance reports.' },
  { icon: BookOpen, title: 'Doubt Resolution', desc: 'Ask doubts in class or on the doubt forum — answered within 2 hours.' },
]

export default function LmsPage() {
  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <section className="reveal bg-brand-navy text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 bg-brand-maroon rounded-2xl flex items-center justify-center mx-auto mb-5">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Hodu Student Portal</h1>
          <p className="text-white/70 max-w-xl mx-auto font-light mb-8">
            Access your live classes, recorded lectures, study materials, and test series — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://hoduacademy.com/login"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand-maroon hover:bg-brand-accent text-white font-bold px-8 py-3.5 rounded-xl transition-colors text-sm"
            >
              Login to Portal <ExternalLink className="h-4 w-4" />
            </a>
            <Link href="/enroll"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm">
              New Admission →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="reveal bg-brand-bg py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-extrabold text-brand-navy text-center mb-10">Everything in Your Portal</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm text-center">
                <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-brand-maroon" />
                </div>
                <h3 className="font-bold text-brand-navy text-sm mb-1">{title}</h3>
                <p className="text-xs text-brand-navy/50 font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login help */}
      <section className="reveal bg-white border-t border-brand-border py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl font-extrabold text-brand-navy mb-2">Need Help Logging In?</h2>
          <p className="text-brand-navy/60 text-sm mb-6">
            Your login credentials are sent to your registered email after enrollment. If you haven't received them, contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`tel:${HODU.phone}`}
              className="inline-flex items-center justify-center gap-2 border border-brand-border text-brand-navy hover:bg-brand-bg font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
              <Phone className="h-4 w-4 text-brand-maroon" /> {HODU.phone}
            </a>
            <a href={`mailto:${HODU.email}`}
              className="inline-flex items-center justify-center gap-2 border border-brand-border text-brand-navy hover:bg-brand-bg font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
              <Mail className="h-4 w-4 text-brand-maroon" /> {HODU.email}
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
