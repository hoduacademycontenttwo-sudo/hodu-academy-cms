'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import ImageUpload from '@/components/admin/ImageUpload'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const EMPTY = { name: '', subject: '', experience: '', photo_url: '', bio: '', sort_order: 0 }

export default function FacultyPage() {
  const supabase = createClient()
  const [faculty, setFaculty] = useState<any[]>([])
  const [modal, setModal]     = useState<'add' | 'edit' | null>(null)
  const [form, setForm]       = useState<any>(EMPTY)
  const [saving, setSaving]   = useState(false)

  async function load() {
    const { data } = await supabase.from('cms_faculty').select('*').eq('site_id', SITE_ID).order('sort_order')
    setFaculty(data ?? [])
  }
  useEffect(() => { load() }, [])

  function open(f?: any) { setForm(f ? { ...f } : EMPTY); setModal(f ? 'edit' : 'add') }
  function set(k: string, v: any) { setForm((prev: any) => ({ ...prev, [k]: v })) }

  async function save() {
    setSaving(true)
    const payload = { ...form, site_id: SITE_ID }
    if (modal === 'edit') await supabase.from('cms_faculty').update(payload).eq('id', form.id)
    else await supabase.from('cms_faculty').insert(payload)
    setSaving(false); setModal(null); load()
  }

  async function del(id: string) {
    if (!confirm('Delete this faculty member?')) return
    await supabase.from('cms_faculty').delete().eq('id', id); load()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Faculty</h2>
          <p className="text-xs text-[#C9C8CB]">{faculty.length} members</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl">
          <Plus size={16} /> Add Faculty
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculty.map((f) => (
          <div key={f.id} className="bg-white border border-[#F3DCDC] rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-3">
              {f.photo_url ? (
                <img src={f.photo_url} alt={f.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#F3DCDC]" />
              ) : (
                <div className="w-14 h-14 bg-[#FDF5F5] rounded-full flex items-center justify-center text-[#7E0D0D] font-bold text-lg">{f.name[0]}</div>
              )}
              <div>
                <p className="font-semibold text-[#1B2A44]">{f.name}</p>
                <p className="text-xs text-[#7E0D0D]">{f.subject}</p>
                <p className="text-xs text-[#C9C8CB]">{f.experience}</p>
              </div>
            </div>
            {f.bio && <p className="text-xs text-[#1B2A44] opacity-70 mb-4 line-clamp-2">{f.bio}</p>}
            <div className="flex gap-2">
              <button onClick={() => open(f)} className="flex-1 text-xs border border-[#F3DCDC] text-[#1B2A44] hover:bg-[#FDF5F5] py-1.5 rounded-lg flex items-center justify-center gap-1"><Pencil size={12} />Edit</button>
              <button onClick={() => del(f.id)} className="flex-1 text-xs border border-red-100 text-red-500 hover:bg-red-50 py-1.5 rounded-lg flex items-center justify-center gap-1"><Trash2 size={12} />Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Faculty' : 'Add Faculty'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Subject *</label>
                <input value={form.subject} onChange={(e) => set('subject', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="e.g. Physics" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Experience</label>
                <input value={form.experience} onChange={(e) => set('experience', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="e.g. 12 Years" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Bio</label>
              <textarea value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={3} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', parseInt(e.target.value))} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <ImageUpload value={form.photo_url} onChange={(url) => set('photo_url', url)} folder="faculty" label="Photo" />
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
