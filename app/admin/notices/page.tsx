'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const EMPTY = { title: '', description: '', publish_date: new Date().toISOString().slice(0, 10), is_active: true }

export default function NoticesPage() {
  const supabase = createClient()
  const [notices, setNotices] = useState<any[]>([])
  const [modal, setModal]     = useState<'add' | 'edit' | null>(null)
  const [form, setForm]       = useState<any>(EMPTY)
  const [saving, setSaving]   = useState(false)

  async function load() {
    const { data } = await supabase.from('cms_notices').select('*').eq('site_id', SITE_ID).order('publish_date', { ascending: false })
    setNotices(data ?? [])
  }
  useEffect(() => { load() }, [])

  function open(n?: any) { setForm(n ? { ...n } : EMPTY); setModal(n ? 'edit' : 'add') }
  function set(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    const payload = { ...form, site_id: SITE_ID }
    if (modal === 'edit') await supabase.from('cms_notices').update(payload).eq('id', form.id)
    else await supabase.from('cms_notices').insert(payload)
    setSaving(false); setModal(null); load()
  }

  async function del(id: string) {
    if (!confirm('Delete this notice?')) return
    await supabase.from('cms_notices').delete().eq('id', id); load()
  }

  async function toggleActive(n: any) {
    await supabase.from('cms_notices').update({ is_active: !n.is_active }).eq('id', n.id); load()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Notices & Announcements</h2>
          <p className="text-xs text-[#C9C8CB]">{notices.length} notices</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl">
          <Plus size={16} /> Add Notice
        </button>
      </div>

      <div className="space-y-3">
        {notices.map((n) => (
          <div key={n.id} className={`bg-white border rounded-2xl p-5 flex items-start justify-between gap-4 ${n.is_active ? 'border-[#F3DCDC]' : 'border-gray-200 opacity-60'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-[#1B2A44] text-sm">{n.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${n.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {n.is_active ? 'Active' : 'Hidden'}
                </span>
              </div>
              {n.description && <p className="text-xs text-[#1B2A44] opacity-70">{n.description}</p>}
              <p className="text-xs text-[#C9C8CB] mt-1">{new Date(n.publish_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => toggleActive(n)} title={n.is_active ? 'Hide' : 'Show'} className="p-2 rounded-lg border border-[#F3DCDC] hover:bg-[#FDF5F5]">
                {n.is_active ? <XCircle size={14} className="text-gray-400" /> : <CheckCircle size={14} className="text-green-500" />}
              </button>
              <button onClick={() => open(n)} className="p-2 rounded-lg border border-[#F3DCDC] hover:bg-[#FDF5F5]"><Pencil size={14} className="text-[#1B2A44]" /></button>
              <button onClick={() => del(n.id)} className="p-2 rounded-lg border border-red-100 hover:bg-red-50"><Trash2 size={14} className="text-red-500" /></button>
            </div>
          </div>
        ))}
        {notices.length === 0 && <p className="text-center text-[#C9C8CB] py-12 text-sm">No notices yet.</p>}
      </div>

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Notice' : 'Add Notice'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Title *</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Publish Date</label>
              <input type="date" value={form.publish_date} onChange={(e) => set('publish_date', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} className="accent-[#7E0D0D] w-4 h-4" />
              <span className="text-sm text-[#1B2A44]">Active (show on website)</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-[#F3DCDC] text-[#1B2A44] py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-[#7E0D0D] text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Notice'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}
