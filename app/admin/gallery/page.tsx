'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import ImageUpload from '@/components/admin/ImageUpload'
import { Plus, Trash2, Pencil } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const EMPTY = { image_url: '', caption: '', category: 'Campus', sort_order: 0 }
const CATS = ['Campus', 'Classroom', 'Events', 'Results', 'Faculty', 'Other']

export default function GalleryPage() {
  const supabase = createClient()
  const [images, setImages] = useState<any[]>([])
  const [modal, setModal]   = useState<'add' | 'edit' | null>(null)
  const [form, setForm]     = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('cms_gallery').select('*').eq('site_id', SITE_ID).order('sort_order')
    setImages(data ?? [])
  }
  useEffect(() => { load() }, [])

  function open(img?: any) { setForm(img ? { ...img } : EMPTY); setModal(img ? 'edit' : 'add') }
  function set(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })) }

  async function save() {
    if (!form.image_url) return alert('Please add an image URL')
    setSaving(true)
    const payload = { ...form, site_id: SITE_ID }
    if (modal === 'edit') await supabase.from('cms_gallery').update(payload).eq('id', form.id)
    else await supabase.from('cms_gallery').insert(payload)
    setSaving(false); setModal(null); load()
  }

  async function del(id: string) {
    if (!confirm('Remove image?')) return
    await supabase.from('cms_gallery').delete().eq('id', id); load()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Gallery</h2>
          <p className="text-xs text-[#C9C8CB]">{images.length} images</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl">
          <Plus size={16} /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden">
            <img src={img.image_url} alt={img.caption ?? ''} className="w-full h-40 object-cover" />
            <div className="p-3">
              <p className="text-xs font-medium text-[#1B2A44] truncate">{img.caption || 'No caption'}</p>
              <p className="text-xs text-[#C9C8CB]">{img.category}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => open(img)} className="bg-white/90 backdrop-blur p-1.5 rounded-lg shadow"><Pencil size={13} className="text-[#1B2A44]" /></button>
              <button onClick={() => del(img.id)} className="bg-white/90 backdrop-blur p-1.5 rounded-lg shadow"><Trash2 size={13} className="text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="text-center text-[#C9C8CB] py-12 text-sm">No images yet.</p>}

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Image' : 'Add Image'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <ImageUpload value={form.image_url} onChange={(url) => set('image_url', url)} folder="gallery" label="Image *" />
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Caption</label>
              <input value={form.caption} onChange={(e) => set('caption', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]">
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
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
