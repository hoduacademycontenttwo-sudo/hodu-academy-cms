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
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Meta Title <span className="text-[#C9C8CB] font-normal">({(form.meta_title ?? '').length}/60)</span></label>
            <input value={form.meta_title ?? ''} onChange={(e) => set('meta_title', e.target.value)} maxLength={70} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Meta Description <span className="text-[#C9C8CB] font-normal">({(form.meta_description ?? '').length}/160)</span></label>
            <textarea value={form.meta_description ?? ''} onChange={(e) => set('meta_description', e.target.value)} maxLength={180} rows={3} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" />
          </div>
          {/* Google preview */}
          <div className="border border-[#F3DCDC] rounded-xl p-4 bg-[#FDF5F5]">
            <p className="text-[10px] text-[#C9C8CB] uppercase tracking-wider mb-2">Google Preview</p>
            <p className="text-[#1a0dab] text-base leading-snug">{form.meta_title || form.name || 'Page title'}</p>
            <p className="text-green-700 text-xs mt-0.5">hoduacademy.com</p>
            <p className="text-gray-600 text-xs mt-1 line-clamp-2">{form.meta_description || 'Meta description appears here…'}</p>
          </div>
        </div>

        {/* Social links */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-[#1B2A44]">Social Links</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Facebook</label>
              <input value={form.facebook ?? ''} onChange={(e) => set('facebook', e.target.value)} placeholder="https://facebook.com/…" className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Instagram</label>
              <input value={form.instagram ?? ''} onChange={(e) => set('instagram', e.target.value)} placeholder="https://instagram.com/…" className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">YouTube</label>
              <input value={form.youtube ?? ''} onChange={(e) => set('youtube', e.target.value)} placeholder="https://youtube.com/@…" className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">LinkedIn</label>
              <input value={form.linkedin ?? ''} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/company/…" className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
          </div>
        </div>

        {/* Announcement bar */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1B2A44]">Announcement Bar</h3>
            <label className="flex items-center gap-2 text-sm text-[#1B2A44] cursor-pointer">
              <input type="checkbox" checked={form.announcement_active ?? false} onChange={(e) => set('announcement_active', e.target.checked)} className="accent-[#7E0D0D]" />
              Active
            </label>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Announcement Text</label>
            <input value={form.announcement ?? ''} onChange={(e) => set('announcement', e.target.value)} placeholder="e.g. Admissions open for 2026–27 — limited seats!" className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
          </div>
          {form.announcement_active && form.announcement && (
            <div className="bg-[#1B2A44] text-white text-xs py-2 px-4 rounded-lg text-center">{form.announcement}</div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
