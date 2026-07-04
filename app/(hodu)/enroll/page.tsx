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
      <section className="reveal bg-white border-b border-brand-border py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 bg-brand-bg rounded-xl flex items-center justify-center">
                <Icon className="h-5 w-5 text-brand-maroon" />
              </div>
              <p className="font-bold text-brand-navy text-sm">{title}</p>
              <p className="text-xs text-brand-navy/50 font-light">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + contact */}
      <section className="reveal bg-brand-bg py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-10">

          {/* Form */}
          <div className="md:col-span-2">
            {done ? (
              <div className="bg-white border border-brand-border rounded-2xl p-10 text-center shadow-sm">
                <CheckCircle className="h-14 w-14 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-xl font-extrabold text-brand-navy mb-2">Enrollment Request Received!</h2>
                <p className="text-brand-navy/60 text-sm mb-6">
                  Our admissions team will call you within 24 hours to confirm your batch and seat.
                </p>
                <Link href="/courses"
                  className="inline-flex items-center gap-2 bg-brand-maroon hover:bg-brand-accent text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors">
                  Browse More Courses <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
                <h2 className="text-lg font-extrabold text-brand-navy">Enrollment Form</h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1">Full Name *</label>
                    <input
                      required value={form.name} onChange={e => set('name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-maroon text-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1">Mobile Number *</label>
                    <input
                      required value={form.phone} onChange={e => set('phone', e.target.value)}
                      placeholder="+91 98765 43210" type="tel"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-maroon text-brand-navy"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1">City</label>
                    <input
                      value={form.city} onChange={e => set('city', e.target.value)}
                      placeholder="e.g. Jaipur"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-maroon text-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1">Class / Grade</label>
                    <input
                      value={form.class_level} onChange={e => set('class_level', e.target.value)}
                      placeholder="e.g. Class 11"
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-maroon text-brand-navy"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1">Course / Exam *</label>
                    <select
                      value={form.target_exam} onChange={e => set('target_exam', e.target.value)}
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-maroon text-brand-navy"
                    >
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-navy mb-1">Preferred Mode *</label>
                    <select
                      value={form.mode} onChange={e => set('mode', e.target.value)}
                      className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-maroon text-brand-navy"
                    >
                      {modes.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-navy mb-1">Anything else? (optional)</label>
                  <textarea
                    value={form.message} onChange={e => set('message', e.target.value)}
                    placeholder="e.g. preferred batch timing, child's current grade..."
                    rows={3}
                    className="w-full border border-brand-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-maroon text-brand-navy resize-none"
                  />
                </div>

                {err && <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-4 py-2">{err}</p>}

                <button
                  type="submit" disabled={loading}
                  className="w-full bg-brand-maroon hover:bg-brand-accent text-white font-bold py-3.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <><Loader className="h-4 w-4 animate-spin" /> Submitting…</> : <>Submit Enrollment Request <ArrowRight className="h-4 w-4" /></>}
                </button>

                <p className="text-xs text-brand-navy/40 text-center">
                  By submitting, you agree to be contacted by our admissions team.
                </p>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
              <h3 className="font-extrabold text-brand-navy text-sm uppercase tracking-wider mb-4">Contact Admissions</h3>
              <div className="space-y-3">
                <a href={`tel:${HODU.phone}`} className="flex items-center gap-3 text-sm text-brand-navy hover:text-brand-maroon transition-colors">
                  <Phone className="h-4 w-4 text-brand-maroon shrink-0" />
                  {HODU.phone}
                </a>
                <a href={`mailto:${HODU.email}`} className="flex items-center gap-3 text-sm text-brand-navy hover:text-brand-maroon transition-colors">
                  <Mail className="h-4 w-4 text-brand-maroon shrink-0" />
                  {HODU.email}
                </a>
              </div>
            </div>

            <div className="bg-brand-navy text-white rounded-2xl p-5">
              <h3 className="font-extrabold text-sm uppercase tracking-wider mb-3">What happens next?</h3>
              <ol className="space-y-3">
                {[
                  'You submit the form',
                  'Counsellor calls within 24 hrs',
                  'Batch & fee discussion',
                  'Seat confirmed on payment',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-white/80">
                    <span className="w-5 h-5 bg-brand-maroon rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
              <p className="text-xs text-brand-navy/50 mb-3">Already a student?</p>
              <Link href="/lms"
                className="block w-full bg-brand-bg hover:bg-brand-border/40 border border-brand-border text-brand-navy font-semibold py-2.5 rounded-xl text-center text-sm transition-colors">
                Access Student Portal →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
