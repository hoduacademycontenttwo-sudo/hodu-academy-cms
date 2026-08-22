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
  { icon: Users, title: 'Small Batch Size', desc: 'Max 12–15 students per batch for personal attention' },
  { icon: Clock, title: 'Flexible Timings', desc: 'Morning, afternoon & evening batches available' },
  { icon: BookOpen, title: 'Study Material', desc: 'Chapter notes, DPPs, mock tests — all included' },
  { icon: Award, title: 'Proven Results', desc: '99.4% top board score, 600+ toppers produced' },
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
    <div className="animate-fade-in bg-white">

      {/* Hero */}
      <section className="reveal bg-brand-maroon text-white py-16 sm:py-20 border-b border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <span className="inline-block bg-white text-brand-maroon text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xs">
            Admissions Open 2026–27
          </span>
          <h1 className="font-serif-editorial text-4xl sm:text-5xl font-bold text-white">Enroll at Hodu Academy</h1>
          <p className="text-white/90 max-w-xl mx-auto font-normal leading-relaxed text-sm sm:text-base">
            Fill the form below and our counsellor will contact you within 24 hours to confirm your seat and batch details.
          </p>
        </div>
      </section>

      {/* Benefits bar */}
      <section className="reveal bg-white border-b border-brand-border py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl border-2 border-brand-border bg-white shadow-xs">
              <div className="w-12 h-12 bg-brand-maroon text-white rounded-xl flex items-center justify-center shadow-xs">
                <Icon className="h-6 w-6" />
              </div>
              <p className="font-serif-editorial font-bold text-neutral-900 text-base">{title}</p>
              <p className="text-xs text-neutral-600 font-normal leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + contact */}
      <section className="reveal bg-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-10">

          {/* Form */}
          <div className="md:col-span-2">
            {done ? (
              <div className="bg-white border-2 border-brand-maroon rounded-3xl p-10 text-center space-y-4 shadow-sm">
                <CheckCircle className="h-16 w-16 text-brand-maroon mx-auto animate-bounce" />
                <h3 className="font-serif-editorial text-2xl font-bold text-neutral-900">Application Submitted!</h3>
                <p className="text-neutral-600 text-xs sm:text-sm max-w-md mx-auto font-normal leading-relaxed">
                  Thank you for applying to Hodu Academy. An admissions counsellor will contact you within 2 business hours.
                </p>
                <div className="pt-4">
                  <Link href="/" className="inline-block bg-brand-maroon text-white font-bold px-8 py-3 rounded-xl text-xs uppercase tracking-wider">
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="bg-white border-2 border-brand-border rounded-3xl p-7 sm:p-9 space-y-5 shadow-xs">
                <h2 className="font-serif-editorial text-xl font-bold text-neutral-900">Student Admission Details</h2>

                {err && (
                  <div className="bg-red-50 text-brand-maroon border border-red-200 text-xs px-4 py-3 rounded-xl font-semibold">
                    ⚠️ {err}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">Student's Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Aryan Sharma"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">Phone / WhatsApp Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={form.phone}
                      onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                      maxLength={10}
                      className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">City / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Jaipur"
                      value={form.city}
                      onChange={e => set('city', e.target.value)}
                      className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">Current Class / Grade</label>
                    <input
                      type="text"
                      placeholder="e.g. Class 10 / Grade 11"
                      value={form.class_level}
                      onChange={e => set('class_level', e.target.value)}
                      className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">Target Curriculum / Board</label>
                    <select
                      value={form.target_exam}
                      onChange={e => set('target_exam', e.target.value)}
                      className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors"
                    >
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">Learning Preference</label>
                    <select
                      value={form.mode}
                      onChange={e => set('mode', e.target.value)}
                      className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors"
                    >
                      {modes.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-800 block">Any specific goals or doubts? (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about target exams, weak subjects, or scheduling preferences..."
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon resize-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-maroon hover:bg-brand-crimson text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader className="h-4 w-4 animate-spin" /> Submitting Application…</>
                  ) : (
                    <>Submit Admission Request <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white border-2 border-brand-border rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif-editorial font-bold text-base text-neutral-900">Direct Helpline</h3>
              <div className="space-y-3 text-xs">
                <a href={`tel:${HODU.phone}`} className="flex items-center gap-2 text-neutral-700 hover:text-brand-maroon font-semibold">
                  <Phone className="h-4 w-4 text-brand-maroon" /> {HODU.phone}
                </a>
                <a href={`mailto:${HODU.email}`} className="flex items-center gap-2 text-neutral-700 hover:text-brand-maroon">
                  <Mail className="h-4 w-4 text-brand-maroon" /> {HODU.email}
                </a>
              </div>
            </div>

            <div className="bg-neutral-50 border-2 border-brand-border rounded-2xl p-6 space-y-2">
              <p className="font-serif-editorial font-bold text-neutral-900 text-sm">Need a Scholarship?</p>
              <p className="text-xs text-neutral-600 font-normal leading-relaxed">
                High-achieving students can apply for up to 50% merit scholarship based on our entrance diagnostic score.
              </p>
            </div>
          </aside>

        </div>
      </section>

    </div>
  )
}
