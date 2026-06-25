'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import ImageUpload from '@/components/admin/ImageUpload'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const EMPTY = { name: '', role: '', message: '', photo_url: '', rating: 5 }

export default function TestimonialsPage() {
  const supabase = createClient()
  const [items, setItems]   = useState<any[]>([])
  const [modal, setModal]   = useState<'add' | 'edit' | null>(null)
  const [form, setForm]     = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('cms_testimonials').select('*').eq('site_id', SITE_ID).order('created_at')
    setItems(data ?? [])
  }
  useEffect(() => { load() }, [])

  function open(t?: any) { setForm(t ? { ...t } : EMPTY); setModal(t ? 'edit' : 'add') }
  function set(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    const payload = { ...form, site_id: SITE_ID, rating: Number(form.rating) }
    if (modal === 'edit') await supabase.from('cms_testimonials').update(payload).eq('id', form.id)
    else await supabase.from('cms_testimonials').insert(payload)
    setSaving(false); setModal(null); load()
  }

  async function del(id: string) {
    if (!confirm('Delete?')) return
    await supabase.from('cms_testimonials').delete().eq('id', id); load()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Testimonials</h2>
          <p className="text-xs text-[#C9C8CB]">{items.length} reviews</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t) => (
          <div key={t.id} className="bg-white border border-[#F3DCDC] rounded-2xl p-5">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`text-sm ${i < t.rating ? 'text-[#7E0D0D]' : 'text-[#F3DCDC]'}`}>★</span>
              ))}
            </div>
            <p className="text-xs text-[#1B2A44] opacity-80 mb-4 line-clamp-3">"{t.message}"</p>
            <div className="flex items-center gap-3 mb-4">
              {t.photo_url ? (
                <img src={t.photo_url} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 bg-[#F3DCDC] rounded-full flex items-center justify-center text-[#7E0D0D] text-xs font-bold">{t.name[0]}</div>
              )}
              <div>
                <p className="font-semibold text-[#1B2A44] text-xs">{t.name}</p>
                <p className="text-[#C9C8CB] text-xs">{t.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => open(t)} className="flex-1 text-xs border border-[#F3DCDC] text-[#1B2A44] hover:bg-[#FDF5F5] py-1.5 rounded-lg flex items-center justify-center gap-1"><Pencil size={12} />Edit</button>
              <button onClick={() => del(t.id)} className="flex-1 text-xs border border-red-100 text-red-500 hover:bg-red-50 py-1.5 rounded-lg flex items-center justify-center gap-1"><Trash2 size={12} />Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Testimonial' : 'Add Testimonial'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Role / Achievement</label>
              <input value={form.role} onChange={(e) => set('role', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="e.g. NEET 2024 – AIR 156" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Message *</label>
              <textarea value={form.message} onChange={(e) => set('message', e.target.value)} rows={4} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Rating</label>
              <select value={form.rating} onChange={(e) => set('rating', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]">
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <ImageUpload value={form.photo_url} onChange={(url) => set('photo_url', url)} folder="testimonials" label="Photo (optional)" />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-[#F3DCDC] text-[#1B2A44] py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-[#7E0D0D] text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}
