'use client'

import { useState } from 'react'
import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Phone, Mail, CheckCircle, Clock, ShieldCheck, Loader } from 'lucide-react'
import ScrollReveal from '@/components/hodu/ScrollReveal'

const categories = [
  'IGCSE / Cambridge O Level',
  'IB (MYP / DP)',
  'CBSE Board (Class 9–12)',
  'JEE / NEET Preparation',
  'Olympiad Training',
  'Online Live Courses',
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', category: categories[0], message: '' })
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
    setLoading(true); setErr('')
    const supabase = createClient()
    const { error } = await supabase.from('cms_leads').insert({
      site_id: HODU_SITE_ID,
      name: form.name,
      phone: form.phone,
      message: `[${form.category}] ${form.email} — ${form.message}`,
      status: 'new',
    })
    if (error) setErr('Unable to submit inquiry. Please try again.')
    else setDone(true)
    setLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-16 animate-fade-in bg-white">

      {/* Page header */}
      <ScrollReveal animation="fade-up">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs bg-brand-maroon text-white px-3.5 py-1.5 rounded-full font-black uppercase tracking-wider inline-block shadow-xs">
            Support and Mentorship Centre
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-maroon">Get in Touch with Hodu Academy</h1>
          <p className="text-sm text-neutral-600 font-normal leading-relaxed">
            Questions about courses, admissions, or schedules? Submit your enquiry and our counsellor will call back within 2 hours.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* Form */}
        <div className="lg:col-span-7">
          <ScrollReveal animation="fade-right">
            <div className="bg-white border-2 border-brand-border p-6 sm:p-9 rounded-3xl shadow-xs space-y-6">
              <div className="border-b border-brand-border pb-3">
                <h3 className="font-serif-editorial font-bold text-lg text-neutral-900">
                  Book a Free Expert Consultation Session
                </h3>
                <p className="text-xs text-neutral-500 font-normal mt-1">Our certified coach will call back within 2 business hours.</p>
              </div>

              {done && (
                <div className="bg-neutral-50 text-neutral-900 border-2 border-brand-maroon p-6 rounded-2xl space-y-2 animate-fade-in text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-brand-maroon shrink-0" />
                    <span className="font-bold text-brand-maroon">Inquiry Registered Successfully!</span>
                  </div>
                  <p className="text-xs text-neutral-600 font-normal">A senior Hodu Academy counsellor will call you within 2 hours. Thank you!</p>
                </div>
              )}

              {!done && (
                <form onSubmit={submit} className="space-y-4">
                  {err && (
                    <div className="bg-neutral-100 border border-neutral-300 text-neutral-800 p-3 rounded-xl text-xs font-medium">
                      {err}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-800 block">Student / Parent Name *</label>
                      <input type="text" required value={form.name} onChange={e => set('name', e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-800 block">Mobile Number *</label>
                      <input type="tel" required value={form.phone} onChange={e => set('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-800 block">Email Address</label>
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                        placeholder="rahul@example.com"
                        className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-neutral-800 block">Target Curriculum / Course</label>
                      <select value={form.category} onChange={e => set('category', e.target.value)}
                        className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors">
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-800 block">Your Message or Learning Needs</label>
                    <textarea rows={4} value={form.message} onChange={e => set('message', e.target.value)}
                      placeholder="Share details about current grades, target exams, or preferred time slots..."
                      className="w-full bg-white border-2 border-brand-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-brand-maroon resize-none transition-colors" />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-brand-maroon hover:bg-brand-crimson text-white font-bold py-3.5 rounded-xl transition-all shadow-xs text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                    {loading ? <><Loader size={14} className="animate-spin" /> Submitting Request…</> : 'Submit Consultation Request'}
                  </button>
                </form>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Contact info */}
        <div className="lg:col-span-5 space-y-6">
          <ScrollReveal animation="fade-left" delay={100}>
            <div className="bg-white border-2 border-brand-border p-7 rounded-3xl shadow-xs space-y-6">
              <h3 className="font-serif-editorial font-bold text-lg text-brand-maroon">Jaipur Main Center</h3>
              <div className="space-y-4 text-xs">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-900 block">Campus Address</span>
                    <span className="text-neutral-600 font-normal">{HODU.address}</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-900 block">Admissions Helpline</span>
                    <a href={`tel:${HODU.phone}`} className="text-neutral-600 hover:text-brand-maroon">{HODU.phone}</a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-900 block">Official Email</span>
                    <a href={`mailto:${HODU.email}`} className="text-neutral-600 hover:text-brand-maroon">{HODU.email}</a>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-neutral-900 block">Operating Hours</span>
                    <span className="text-neutral-600">Monday – Sunday: 8:00 AM – 8:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>
    </div>
  )
}
