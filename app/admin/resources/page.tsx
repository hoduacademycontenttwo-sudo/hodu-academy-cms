'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import { Plus, Pencil, Trash2, FileText, ExternalLink, Upload, Loader, X } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const EMPTY = { title: '', slug: '', type: 'Blog', category: '', file_url: '', content: '' }
const TYPES = ['Blog', 'PYQ', 'Sample Paper', 'Notes', 'Syllabus', 'Answer Key', 'Mock Test']
const CATEGORIES = ['NEET', 'JEE Main', 'JEE Advanced', 'CBSE', 'NCERT', 'Olympiad', 'IGCSE', 'IB', 'General']

export default function ResourcesPage() {
  const supabase = createClient()
  const [items, setItems]       = useState<any[]>([])
  const [modal, setModal]       = useState<'add' | 'edit' | null>(null)
  const [form, setForm]         = useState<any>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [filter, setFilter]     = useState('All')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase.from('cms_resources').select('*').eq('site_id', SITE_ID).order('created_at', { ascending: false })
    setItems(data ?? [])
  }
  useEffect(() => { load() }, [])

  function open(r?: any) { setForm(r ? { ...r } : EMPTY); setModal(r ? 'edit' : 'add'); setUploadError('') }
  function set(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })) }

  async function handlePdfUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File too large. Max size: 20MB')
      return
    }

    setUploading(true)
    setUploadError('')

    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'resources')

    try {
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        set('file_url', data.url)
      } else {
        setUploadError(data.error ?? 'Upload failed. Please try again.')
      }
    } catch {
      setUploadError('Upload failed. Check your connection.')
    }

    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function save() {
    setSaving(true)
    const payload = {
      ...form,
      site_id: SITE_ID,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }
    if (modal === 'edit') await supabase.from('cms_resources').update(payload).eq('id', form.id)
    else await supabase.from('cms_resources').insert(payload)
    setSaving(false); setModal(null); load()
  }

  async function del(id: string) {
    if (!confirm('Delete?')) return
    await supabase.from('cms_resources').delete().eq('id', id); load()
  }

  const allTypes = ['All', ...TYPES]
  const filtered = filter === 'All' ? items : items.filter((i) => i.type === filter)

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Resources / Content Library</h2>
          <p className="text-xs text-[#C9C8CB]">{items.length} resources</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl">
          <Plus size={16} /> Add Resource
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {allTypes.map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === t ? 'bg-[#7E0D0D] text-white' : 'bg-[#FDF5F5] text-[#1B2A44] border border-[#F3DCDC] hover:bg-[#F3DCDC]'}`}>{t}</button>
        ))}
      </div>

      <div className="bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3DCDC] bg-[#FDF5F5]">
              {['Title', 'Type', 'Category', 'Link', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#C9C8CB] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-[#F3DCDC] last:border-0 hover:bg-[#FDF5F5]">
                <td className="px-4 py-3 font-medium text-[#1B2A44] flex items-center gap-2"><FileText size={14} className="text-[#7E0D0D]" />{r.title}</td>
                <td className="px-4 py-3"><span className="bg-[#FDF5F5] text-[#7E0D0D] text-xs px-2 py-0.5 rounded-full font-medium">{r.type}</span></td>
                <td className="px-4 py-3 text-[#C9C8CB] text-xs">{r.category || '—'}</td>
                <td className="px-4 py-3">
                  {r.file_url && <a href={r.file_url} target="_blank" rel="noreferrer" className="text-[#7E0D0D] hover:underline text-xs flex items-center gap-1"><ExternalLink size={11} />Open</a>}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => open(r)} className="text-xs px-3 py-1 border border-[#F3DCDC] rounded-lg text-[#1B2A44] hover:bg-[#FDF5F5] flex items-center gap-1"><Pencil size={11} />Edit</button>
                    <button onClick={() => del(r.id)} className="text-xs px-3 py-1 border border-red-100 rounded-lg text-red-500 hover:bg-red-50 flex items-center gap-1"><Trash2 size={11} />Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center text-[#C9C8CB] py-12 text-sm">No resources yet.</p>}
      </div>

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Resource' : 'Add Resource'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Title *</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Type</label>
                <select value={form.type} onChange={(e) => set('type', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]">
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Category</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]">
                  <option value="">— Select Category —</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* File upload section */}
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-2">File / PDF</label>

              {/* Upload button */}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 border-2 border-dashed border-[#F3DCDC] rounded-xl px-4 py-3 text-sm text-[#C9C8CB] hover:border-[#7E0D0D] hover:text-[#7E0D0D] transition-colors disabled:opacity-50 w-full justify-center mb-2"
              >
                {uploading
                  ? <><Loader size={15} className="animate-spin" /> Uploading…</>
                  : <><Upload size={15} /> Upload PDF / File from computer</>
                }
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                className="hidden"
                onChange={handlePdfUpload}
              />
              <p className="text-[11px] text-[#C9C8CB] mb-2">PDF, Word, PPT, Excel, ZIP · Max 20MB</p>

              {uploadError && (
                <p className="text-red-500 text-xs mb-2">{uploadError}</p>
              )}

              {/* Uploaded file preview */}
              {form.file_url && (
                <div className="flex items-center gap-2 bg-[#FDF5F5] border border-[#F3DCDC] rounded-xl px-3 py-2 mb-2">
                  <FileText size={14} className="text-[#7E0D0D] shrink-0" />
                  <span className="text-xs text-[#1B2A44] truncate flex-1">{form.file_url}</span>
                  <button type="button" onClick={() => set('file_url', '')} className="text-[#C9C8CB] hover:text-red-500 transition-colors shrink-0">
                    <X size={13} />
                  </button>
                </div>
              )}

              {/* Manual URL fallback */}
              <div>
                <label className="block text-xs text-[#C9C8CB] mb-1">Or paste external URL</label>
                <input
                  type="url"
                  value={form.file_url}
                  onChange={(e) => set('file_url', e.target.value)}
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Content / Description</label>
              <textarea value={form.content} onChange={(e) => set('content', e.target.value)} rows={3} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" />
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-[#F3DCDC] text-[#1B2A44] py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={save} disabled={saving || uploading} className="flex-1 bg-[#7E0D0D] text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}
