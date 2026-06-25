'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import ImageUpload from '@/components/admin/ImageUpload'
import { Save } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'

export default function SettingsPage() {
  const supabase = createClient()
  const [form, setForm]     = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    supabase.from('cms_sites').select('*').eq('id', SITE_ID).single()
      .then(({ data }) => setForm(data))
  }, [])

  function set(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    const { id, created_at, slug, ...payload } = form
    await supabase.from('cms_sites').update(payload).eq('id', SITE_ID)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!form) return <AdminLayout><p className="text-[#C9C8CB] text-sm">Loading…</p></AdminLayout>

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Site Settings</h2>
          <p className="text-xs text-[#C9C8CB]">Slug: /{form.slug} · changes apply immediately</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-60">
          <Save size={15} /> {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Branding */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-[#1B2A44]">Branding</h3>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Institute Name *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
          </div>
          <ImageUpload value={form.logo_url ?? ''} onChange={(url) => set('logo_url', url)} folder="logos" label="Logo" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Primary Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.primary_color ?? '#7E0D0D'} onChange={(e) => set('primary_color', e.target.value)} className="w-10 h-10 rounded-lg border border-[#F3DCDC] p-0.5 cursor-pointer" />
                <input value={form.primary_color ?? '#7E0D0D'} onChange={(e) => set('primary_color', e.target.value)} className="flex-1 border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Secondary Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.secondary_color ?? '#1B2A44'} onChange={(e) => set('secondary_color', e.target.value)} className="w-10 h-10 rounded-lg border border-[#F3DCDC] p-0.5 cursor-pointer" />
                <input value={form.secondary_color ?? '#1B2A44'} onChange={(e) => set('secondary_color', e.target.value)} className="flex-1 border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-[#1B2A44]">Contact Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Phone</label>
              <input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">WhatsApp Number</label>
              <input value={form.whatsapp ?? ''} onChange={(e) => set('whatsapp', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="919876543210" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Email</label>
            <input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">City</label>
            <input value={form.city ?? ''} onChange={(e) => set('city', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Address</label>
            <textarea value={form.address ?? ''} onChange={(e) => set('address', e.target.value)} rows={2} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" />
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-[#1B2A44]">SEO</h3>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Meta Title</label>
            <input value={form.meta_title ?? ''} onChange={(e) => set('meta_title', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Meta Description</label>
            <textarea value={form.meta_description ?? ''} onChange={(e) => set('meta_description', e.target.value)} rows={3} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
