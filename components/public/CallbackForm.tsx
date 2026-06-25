'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

interface CallbackFormProps {
  siteSlug: string
  siteId: string
}

export default function CallbackForm({ siteSlug, siteId }: CallbackFormProps) {
  const [form, setForm] = useState({ name: '', phone: '', class_level: '', target_exam: '', city: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch(`/api/${siteSlug}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, site_id: siteId }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', phone: '', class_level: '', target_exam: '', city: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-16 bg-[#FDF5F5]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[#7E0D0D] text-xs font-bold uppercase tracking-widest">Get Started</span>
          <h2 className="text-3xl font-bold text-[#1B2A44] mt-2">Request a Free Callback</h2>
          <p className="text-[#1B2A44] opacity-70 mt-2">Our counsellors will reach out within 24 hours.</p>
        </div>

        {status === 'success' ? (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-2xl p-6 text-center">
            <p className="font-semibold text-lg">Thank you! We'll call you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-[#F3DCDC] rounded-2xl p-6 sm:p-8 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1B2A44] mb-1">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D] text-[#111111]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B2A44] mb-1">Phone Number *</label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D] text-[#111111]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B2A44] mb-1">Class / Standard</label>
              <select
                value={form.class_level}
                onChange={(e) => setForm({ ...form, class_level: e.target.value })}
                className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D] text-[#111111]"
              >
                <option value="">Select class</option>
                {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Dropper'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B2A44] mb-1">Target Exam</label>
              <select
                value={form.target_exam}
                onChange={(e) => setForm({ ...form, target_exam: e.target.value })}
                className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D] text-[#111111]"
              >
                <option value="">Select exam</option>
                {['NEET', 'JEE Main', 'JEE Advanced', 'Foundation', 'Other'].map((e) => (
                  <option key={e}>{e}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#1B2A44] mb-1">City</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Your city"
                className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D] text-[#111111]"
              />
            </div>
            {status === 'error' && (
              <p className="sm:col-span-2 text-red-600 text-sm text-center">Something went wrong. Please try again.</p>
            )}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#7E0D0D] hover:bg-[#922222] text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {status === 'loading' ? 'Submitting...' : (<><Send size={16} /> Request Callback</>)}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
