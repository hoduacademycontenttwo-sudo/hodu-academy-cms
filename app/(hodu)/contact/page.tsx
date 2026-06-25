'use client'

import { useState } from 'react'
import { HODU, HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/client'
import { MapPin, Phone, Mail, CheckCircle, Clock, ShieldCheck, Loader } from 'lucide-react'

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-fade-in text-brand-navy">

      {/* Page header */}
      <div className="max-w-2xl space-y-2">
        <span className="text-xs bg-brand-bg text-brand-maroon px-2.5 py-1 rounded font-bold uppercase tracking-wider inline-block border border-brand-border">
          Support and Mentorship Centre
        </span>
        <h1 className="text-3xl font-extrabold">Get in Touch with Hodu Academy</h1>
        <p className="text-sm text-brand-navy/60 font-light">
          Questions about courses, admissions, or schedules? Submit your enquiry and our counsellor will call back within 2 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

        {/* Form */}
        <div className="lg:col-span-7 bg-brand-white border border-brand-border p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-brand-border pb-3">
            <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-brand-navy">
              Book a Free Expert Consultation Session
            </h3>
            <p className="text-[11px] text-brand-navy/50 font-light mt-1">Our certified coach will call back within 2 business hours.</p>
          </div>

          {done && (
            <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-xl space-y-2 animate-fade-in text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-700 shrink-0" />
                <span className="font-bold">Inquiry Registered Successfully!</span>
              </div>
              <p className="text-xs text-green-700/80 font-light">A senior Hodu Academy counsellor will call you within 2 hours. Thank you!</p>
            </div>
          )}

          {err && (
            <div className="bg-red-50 text-brand-maroon border border-brand-border p-4 rounded-xl text-xs font-semibold">
              ⚠️ {err}
            </div>
          )}

          {!done && (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy/80 block">Parent / Student Name *</label>
                  <input required value={form.name} onChange={e => set('name', e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy/80 block">Mobile Number *</label>
                  <input required value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 9876543210" maxLength={10}
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy/80 block">Email Address</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="you@email.com"
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-navy/80 block">Preferred Batch / Course</label>
                  <select value={form.category} onChange={e => set('category', e.target.value)}
                    className="w-full bg-brand-bg/50 border border-brand-border rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-brand-maroon text-brand-navy font-semibold">
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-navy/80 block">Specific Inquiry / Notes</label>
                <textarea rows={4} value={form.message} onChange={e => set('message', e.target.value)}
                  placeholder="Tell us about the course you're interested in..."
                  className="w-full bg-brand-bg/50 border border-brand-border rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-brand-maroon resize-none transition-colors" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-brand-maroon hover:bg-brand-accent text-white font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-wider transition-all shadow disabled:opacity-60 flex items-center justify-center gap-2">
                {loading ? <><Loader size={13} className="animate-spin" /> Submitting…</> : 'Request Guidance Call'}
              </button>
            </form>
          )}
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-brand-white border border-brand-border p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-extrabold text-sm border-b border-brand-border pb-3 uppercase tracking-wider">
              Academy Contact Details
            </h3>
            <div className="space-y-4 text-xs leading-relaxed font-light">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-navy block">Learning Centre</span>
                  <p className="text-brand-navy/70 mt-0.5">{HODU.address}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-navy block">Counsellor Hotline</span>
                  <a href={`tel:${HODU.phone}`} className="text-brand-navy/70 hover:text-brand-maroon mt-0.5 block">{HODU.phone}</a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-navy block">Email</span>
                  <a href={`mailto:${HODU.email}`} className="text-brand-navy/70 hover:text-brand-maroon mt-0.5 block">{HODU.email}</a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-brand-maroon shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-brand-navy block">Operating Hours</span>
                  <p className="text-brand-navy/70 mt-0.5">Monday to Saturday: 9:00 AM – 7:00 PM IST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-brand-border h-52">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.234!2d75.7445!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzQ0LjYiTiA3NcKwNDQnNDAuMiJF!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>

          <div className="bg-brand-bg border border-brand-border p-5 rounded-2xl text-center space-y-3">
            <ShieldCheck className="h-7 w-7 text-emerald-600 mx-auto" />
            <h4 className="font-extrabold text-xs">Safe Student Privacy Standard</h4>
            <p className="text-[10px] text-brand-navy/60 leading-normal font-light">
              We never sell your contact details to third-party marketing lists. Your information is used solely for course counselling.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
