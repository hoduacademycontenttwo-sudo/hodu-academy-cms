'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, Loader, ArrowRight, Phone, Mail, BookOpen, Users, Clock, Award } from 'lucide-react'

const categories = [
  'IGCSE / Cambridge O Level',
  'IB (MYP / DP)',
  'CBSE Board (Class 9–12)',
  'JEE Main & Advanced',
  'NEET Preparation',
  'Olympiad Training',
  'Online Live Courses',
]

const modes = ['Classroom (Jaipur)', 'Online Live', 'Hybrid (Both)', 'Distance Learning']

const benefits = [
  { icon: Users, title: 'Small Batch Size', desc: 'Max 15–20 students per batch for personal attention' },
  { icon: Clock, title: 'Flexible Timings', desc: 'Morning, afternoon & evening batches available' },
  { icon: BookOpen, title: 'Study Material', desc: 'Chapter notes, DPPs, mock tests — all included' },
  { icon: Award, title: 'Proven Results', desc: '98% board pass rate, 600+ toppers produced' },
]

export default function EnrollPage() {
  const [form, setForm] = useState({
    name: '', phone: '', city: '',
    target_exam: categories[0], class_level: '', mode: modes[0], message: '',
  })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || form.phone.trim().length < 10) {
      setErr('Please enter a valid name and 10-digit mobile number.')
      return
    }
    setErr('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('cms_leads').insert({
      site_id: HODU_SITE_ID,
      name: form.name.trim(),
      phone: form.phone.trim(),
      city: form.city.trim() || null,
      target_exam: form.target_exam,
      class_level: form.class_level.trim() || null,
      message: `Mode: ${form.mode}${form.message ? ` | ${form.message}` : ''}`,
      status: 'new',
    })
    setLoading(false)
    if (error) { setErr('Something went wrong. Please try again.'); return }
    setDone(true)
  }

  return (
    <div className="animate-fade-in">

      {/* Hero */}
      <section className="reveal bg-brand-navy text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block bg-brand-maroon text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Admissions Open 2025–26
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Enroll at Hodu Academy</h1>
          <p className="text-white/70 max-w-xl mx-auto font-light">
            Fill the form below and our counsellor will contact you within 24 hours to confirm your seat and batch details.
          </p>
        </div>
      </section>

      {/* Benefits bar */}
      <section className="reveal bg-white border-b border-brand-border py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl card-hover bg-brand-bg/40 border border-brand-border/40">
              <div className="w-12 h-12 bg-brand-bg rounded-2xl flex items-center justify-center shadow-xs border border-brand-border/80">
                <Icon className="h-6 w-6 text-brand-maroon" />
              </div>
              <p className="font-extrabold text-brand-navy text-sm">{title}</p>
              <p className="text-xs text-brand-navy/60 font-light leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + contact */}
      <section className="reveal bg-brand-bg py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-10">

          {/* Form */}
          <div className="md:col-span-2">
            {done ? (
              <div className="bg-white border border-brand-border rounded-3xl p-10 text-center shadow-lg animate-fade-in">
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
                <h2 className="text-2xl font-extrabold text-brand-navy mb-2">Enrollment Request Received!</h2>
                <p className="text-brand-navy/70 text-sm mb-7 max-w-md mx-auto">
                  Our admissions counsellor will call you within 24 hours to confirm your batch timings, syllabus details, and reserved seat.
                </p>
                <Link href="/courses"
                  className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-accent text-white font-extrabold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Browse More Programs <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} className="bg-white border border-brand-border rounded-3xl p-6 sm:p-9 shadow-xl space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold text-brand-maroon uppercase tracking-widest bg-brand-maroon/10 px-2.5 py-0.5 rounded-full">
                    ADMISSIONS 2025–26
                  </span>
                  <h2 className="text-2xl font-black text-brand-navy mt-1">Direct Admission & Enquiry</h2>
                  <p className="text-xs text-brand-navy/60 mt-0.5">Complete this form to reserve your seat in the upcoming batch.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-brand-navy">Full Name *</label>
                    <input
                      required value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Student / Parent name"
                      className="w-full bg-brand-bg/60 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-brand-navy">Mobile Number *</label>
                    <input
                      required value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+91 98765 43210" type="tel"
                      className="w-full bg-brand-bg/60 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-brand-navy">City / Location</label>
                    <input
                      value={form.city} onChange={e => set('city', e.target.value)}
                      placeholder="e.g. Jaipur"
                      className="w-full bg-brand-bg/60 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-brand-navy">Class / Grade</label>
                    <input
                      value={form.class_level} onChange={e => set('class_level', e.target.value)}
                      placeholder="e.g. Class 10 / Class 11"
                      className="w-full bg-brand-bg/60 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-brand-navy">Target Course / Exam *</label>
                    <select
                      value={form.target_exam} onChange={e => set('target_exam', e.target.value)}
                      className="w-full bg-brand-bg/60 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 transition-all"
                    >
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-brand-navy">Preferred Mode *</label>
                    <select
                      value={form.mode} onChange={e => set('mode', e.target.value)}
                      className="w-full bg-brand-bg/60 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 transition-all"
                    >
                      {modes.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-brand-navy">Anything else we should know? (Optional)</label>
                  <textarea
                    value={form.message} onChange={e => set('message', e.target.value)}
                    placeholder="e.g. preferred batch timing, target score, student background..."
                    rows={3}
                    className="w-full bg-brand-bg/60 border border-brand-border rounded-xl px-4 py-2.5 text-sm text-brand-navy focus:outline-none focus:border-brand-maroon focus:ring-2 focus:ring-brand-maroon/10 resize-none transition-all"
                  />
                </div>

                {err && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 font-medium">{err}</p>}

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-brand-maroon hover:bg-brand-accent text-white font-extrabold py-4 rounded-xl transition-all duration-200 hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg hover:shadow-xl uppercase tracking-wider"
                >
                  {loading ? <><Loader className="h-4 w-4 animate-spin" /> Submitting…</> : <>Submit Enrollment Request <ArrowRight className="h-4 w-4" /></>}
                </button>

                <p className="text-[11px] text-brand-navy/50 text-center font-light">
                  🔒 We protect your data. No spam, only genuine academic guidance.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm">
              <h3 className="font-black text-brand-navy text-xs uppercase tracking-widest mb-4">Admissions Desk</h3>
              <div className="space-y-3.5">
                <a href={`tel:${HODU.phone}`} className="flex items-center gap-3 text-sm text-brand-navy hover:text-brand-maroon transition-colors bg-brand-bg/60 p-3 rounded-xl border border-brand-border/60">
                  <Phone className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span className="font-bold">{HODU.phone}</span>
                </a>
                <a href={`mailto:${HODU.email}`} className="flex items-center gap-3 text-sm text-brand-navy hover:text-brand-maroon transition-colors bg-brand-bg/60 p-3 rounded-xl border border-brand-border/60">
                  <Mail className="h-4 w-4 text-brand-maroon shrink-0" />
                  <span className="font-medium truncate">{HODU.email}</span>
                </a>
              </div>
            </div>

            <div className="bg-brand-navy text-white rounded-3xl p-6 shadow-md">
              <h3 className="font-extrabold text-xs uppercase tracking-widest mb-4 text-brand-border">Next Steps</h3>
              <ol className="space-y-3.5">
                {[
                  'Submit your enrollment enquiry',
                  'Senior academic counsellor calls within 24h',
                  'Free batch placement evaluation',
                  'Confirm seat reservation & fee payment',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-white/85">
                    <span className="w-5 h-5 bg-brand-maroon rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span className="font-light">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white border border-brand-border rounded-3xl p-6 shadow-sm text-center">
              <p className="text-xs text-brand-navy/60 mb-3 font-medium">Already an enrolled student?</p>
              <Link href="/lms"
                className="block w-full bg-brand-bg hover:bg-brand-border/50 border border-brand-border text-brand-navy font-bold py-3 rounded-xl text-center text-xs uppercase tracking-wider transition-all">
                Student LMS Portal →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
