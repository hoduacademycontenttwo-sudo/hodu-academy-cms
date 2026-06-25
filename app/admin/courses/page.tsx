'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import ImageUpload from '@/components/admin/ImageUpload'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const EMPTY = {
  title: '', slug: '', category: 'IGCSE', class_level: '', description: '',
  duration: '', fee: '', phase_start: '', mode: 'Classroom',
  image_url: '', features_json: '', is_featured: false,
}

export default function CoursesPage() {
  const supabase = createClient()
  const [courses, setCourses]   = useState<any[]>([])
  const [modal, setModal]       = useState<'add' | 'edit' | null>(null)
  const [form, setForm]         = useState<any>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [saveError, setSaveError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase.from('cms_courses').select('*').eq('site_id', SITE_ID).order('sort_order')
    setCourses(data ?? [])
  }
  useEffect(() => { load() }, [])

  function open(course?: any) {
    if (course) {
      setForm({ ...course, features_json: Array.isArray(course.features_json) ? course.features_json.join('\n') : '' })
      setModal('edit')
    } else {
      setForm(EMPTY)
      setModal('add')
    }
  }

  function set(key: string, val: any) { setForm((f: any) => ({ ...f, [key]: val })) }

  async function save() {
    if (!form.title.trim()) { setSaveError('Title is required.'); return }
    setSaving(true)
    setSaveError('')
    const payload = {
      ...form,
      site_id: SITE_ID,
      slug: form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      features_json: form.features_json ? form.features_json.split('\n').filter(Boolean) : [],
    }
    let error
    if (modal === 'edit') {
      ;({ error } = await supabase.from('cms_courses').update(payload).eq('id', form.id))
    } else {
      ;({ error } = await supabase.from('cms_courses').insert(payload))
    }
    setSaving(false)
    if (error) {
      setSaveError(`Save failed: ${error.message}`)
      return
    }
    setModal(null)
    setSaveError('')
    load()
  }

  async function del(id: string) {
    if (!confirm('Delete this course?')) return
    setDeleting(id)
    await supabase.from('cms_courses').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  const categories = ['IGCSE', 'Cambridge O Level', 'IB', 'CBSE', 'Competitive Exams', 'Olympiads']
  const modes      = ['Classroom', 'Online', 'Hybrid', 'Distance Learning']

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Courses</h2>
          <p className="text-xs text-[#C9C8CB]">{courses.length} courses</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <Plus size={16} /> Add Course
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((c) => (
          <div key={c.id} className="bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden">
            {c.image_url ? (
              <img src={c.image_url} alt={c.title} className="w-full h-36 object-cover" />
            ) : (
              <div className="w-full h-36 bg-[#FDF5F5] flex items-center justify-center text-[#C9C8CB] text-xs">No image</div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-[#1B2A44] text-sm leading-snug">{c.title}</h3>
                {c.is_featured && <Star size={14} className="text-[#7E0D0D] shrink-0 mt-0.5" fill="currentColor" />}
              </div>
              <p className="text-xs text-[#C9C8CB] mb-3">{c.category} · {c.mode} · {c.class_level}</p>
              <div className="flex gap-2">
                <button onClick={() => open(c)} className="flex-1 text-xs border border-[#F3DCDC] text-[#1B2A44] hover:bg-[#FDF5F5] py-1.5 rounded-lg flex items-center justify-center gap-1">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => del(c.id)} disabled={deleting === c.id} className="flex-1 text-xs border border-red-100 text-red-500 hover:bg-red-50 py-1.5 rounded-lg flex items-center justify-center gap-1">
                  <Trash2 size={12} /> {deleting === c.id ? '…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Course' : 'Add Course'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Title *</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Slug (auto-generated if blank)</label>
              <input value={form.slug} onChange={(e) => set('slug', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="e.g. neet-2-year" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Category</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]">
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Mode</label>
                <select value={form.mode} onChange={(e) => set('mode', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]">
                  {modes.map((m) => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Class / Level</label>
              <input value={form.class_level} onChange={(e) => set('class_level', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="e.g. Class 11–12" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Duration</label>
                <input value={form.duration} onChange={(e) => set('duration', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="e.g. 2 Years" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Fee (₹)</label>
                <input value={form.fee} onChange={(e) => set('fee', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="e.g. 85,000" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Phase Start Date</label>
              <input value={form.phase_start} onChange={(e) => set('phase_start', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="e.g. April 2025" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Features (one per line)</label>
              <textarea value={form.features_json} onChange={(e) => set('features_json', e.target.value)} rows={4} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" placeholder="600+ Hours of Teaching&#10;Weekly Tests&#10;Doubt Support" />
            </div>
            <ImageUpload value={form.image_url} onChange={(url) => set('image_url', url)} folder="courses" label="Course Image" />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} className="accent-[#7E0D0D] w-4 h-4" />
              <span className="text-sm text-[#1B2A44]">Featured on homepage</span>
            </label>
            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3 py-2 rounded-lg">
                ⚠️ {saveError}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-[#F3DCDC] text-[#1B2A44] py-2.5 rounded-xl text-sm hover:bg-[#FDF5F5]">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-[#7E0D0D] hover:bg-[#922222] text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Course'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}
