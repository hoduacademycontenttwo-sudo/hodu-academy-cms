'use client'

import { useState } from 'react'
import { Loader } from 'lucide-react'
import { HODU_SITE_ID } from '@/lib/hodu'
import { createClient } from '@/lib/supabase/client'

export default function EnquiryForm() {
  const [form, setForm]   = useState({ name: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone]   = useState(false)
  const [err, setErr]     = useState('')

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setErr('')
    const supabase = createClient()
    const { error } = await supabase.from('cms_leads').insert({
      site_id: HODU_SITE_ID,
      name:    form.name,
      phone:   form.phone,
      message: form.message,
      status:  'new',
    })
    if (error) setErr('Something went wrong. Please try again.')
    else setDone(true)
    setLoading(false)
  }

  if (done) return (
    <div className="text-center py-6">
      <p className="text-3xl mb-2">✅</p>
      <p className="font-bold text-brand-navy">Thank you! We'll contact you soon.</p>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-brand-navy/80 block">Your Name *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Full name"
            className="w-full bg-brand-bg/50 border border-brand-border rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-brand-navy/80 block">Mobile No. *</label>
          <input required value={form.phone} onChange={e => set('phone', e.target.value)}
            placeholder="+91 98765..."
            className="w-full bg-brand-bg/50 border border-brand-border rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-brand-maroon transition-colors" />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-bold text-brand-navy/80 block">Message (optional)</label>
        <textarea value={form.message} onChange={e => set('message', e.target.value)}
          placeholder="Which course are you interested in?"
          rows={3}
          className="w-full bg-brand-bg/50 border border-brand-border rounded-lg px-3.5 py-2.5 text-xs outline-none focus:border-brand-maroon resize-none transition-colors" />
      </div>
      {err && <p className="text-brand-maroon text-xs font-semibold">{err}</p>}
      <button type="submit" disabled={loading}
        className="w-full bg-brand-maroon hover:bg-brand-accent text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow">
        {loading ? <><Loader size={13} className="animate-spin" /> Submitting…</> : 'Send Enquiry'}
      </button>
    </form>
  )
}
