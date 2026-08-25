'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import ImageUpload from '@/components/admin/ImageUpload'
import AcademicDecksManager from '@/components/admin/AcademicDecksManager'
import { Plus, Pencil, Trash2, Trophy, Users, Layers } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const EMPTY = { student_name: '', exam: 'NEET', year: new Date().getFullYear().toString(), rank_or_marks: '', photo_url: '', course_name: '' }

export default function ResultsPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'decks' | 'individual'>('decks')
  const [results, setResults] = useState<any[]>([])
  const [modal, setModal]     = useState<'add' | 'edit' | null>(null)
  const [form, setForm]       = useState<any>(EMPTY)
  const [saving, setSaving]   = useState(false)

  async function load() {
    const { data } = await supabase.from('cms_results').select('*').eq('site_id', SITE_ID).order('year', { ascending: false })
    setResults(data ?? [])
  }
  useEffect(() => { load() }, [])

  function open(r?: any) { setForm(r ? { ...r } : EMPTY); setModal(r ? 'edit' : 'add') }
  function set(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    const payload = { ...form, site_id: SITE_ID }
    if (modal === 'edit') await supabase.from('cms_results').update(payload).eq('id', form.id)
    else await supabase.from('cms_results').insert(payload)
    setSaving(false); setModal(null); load()
  }

  async function del(id: string) {
    if (!confirm('Delete this result?')) return
    await supabase.from('cms_results').delete().eq('id', id); load()
  }

  const exams = ['NEET', 'JEE Main', 'JEE Advanced', 'Class 10', 'Class 12', 'Foundation', 'Cambridge IGCSE', 'IB Diploma', 'Other']

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-border">
        <div>
          <h2 className="text-xl font-bold text-[#1B2A44]">Results & Academic Excellence</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage visual banner decks with toppers, 10-student grids, and individual rankers database.
          </p>
        </div>

        {activeTab === 'individual' && (
          <button
            onClick={() => open()}
            className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus size={16} /> Add Single Ranker
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('decks')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'decks'
              ? 'bg-[#7E0D0D] text-white shadow-md'
              : 'bg-white text-neutral-600 hover:text-[#7E0D0D] border border-neutral-200 shadow-2xs'
          }`}
        >
          <Trophy size={14} />
          <span>Academic Excellence Decks (Banner Templates)</span>
        </button>

        <button
          onClick={() => setActiveTab('individual')}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'individual'
              ? 'bg-[#7E0D0D] text-white shadow-md'
              : 'bg-white text-neutral-600 hover:text-[#7E0D0D] border border-neutral-200 shadow-2xs'
          }`}
        >
          <Users size={14} />
          <span>Individual Rankers Database ({results.length})</span>
        </button>
      </div>

      {activeTab === 'decks' ? (
        <AcademicDecksManager />
      ) : (
        <div className="bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F3DCDC] bg-[#FDF5F5]">
                {['Photo', 'Student', 'Exam', 'Rank / Marks', 'Year', 'Course', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#1B2A44] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-b border-[#F3DCDC] last:border-0 hover:bg-[#FDF5F5] transition-colors">
                  <td className="px-4 py-3">
                    {r.photo_url ? (
                      <img src={r.photo_url} alt={r.student_name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 bg-[#F3DCDC] rounded-full flex items-center justify-center text-[#7E0D0D] text-xs font-bold">{r.student_name?.[0] || 'S'}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1B2A44]">{r.student_name}</td>
                  <td className="px-4 py-3 text-[#1B2A44]">{r.exam}</td>
                  <td className="px-4 py-3 font-bold text-[#7E0D0D]">{r.rank_or_marks}</td>
                  <td className="px-4 py-3 text-[#1B2A44]">{r.year}</td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{r.course_name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => open(r)} className="text-xs px-3 py-1 border border-[#F3DCDC] rounded-lg text-[#1B2A44] hover:bg-[#FDF5F5] flex items-center gap-1 cursor-pointer"><Pencil size={11} />Edit</button>
                      <button onClick={() => del(r.id)} className="text-xs px-3 py-1 border border-red-100 rounded-lg text-red-500 hover:bg-red-50 flex items-center gap-1 cursor-pointer"><Trash2 size={11} />Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {results.length === 0 && <p className="text-center text-neutral-400 py-12 text-sm">No individual rankers added yet.</p>}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Result' : 'Add Result'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Student Name *</label>
              <input value={form.student_name} onChange={(e) => set('student_name', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Exam</label>
                <select value={form.exam} onChange={(e) => set('exam', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]">
                  {exams.map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Year</label>
                <input value={form.year} onChange={(e) => set('year', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Rank / Marks *</label>
              <input value={form.rank_or_marks} onChange={(e) => set('rank_or_marks', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="e.g. AIR 42 or 99.8 %ile" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Course Name</label>
              <input value={form.course_name} onChange={(e) => set('course_name', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="e.g. NEET 2-Year" />
            </div>
            <ImageUpload value={form.photo_url} onChange={(url) => set('photo_url', url)} folder="results" label="Student Photo" />
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-[#F3DCDC] text-[#1B2A44] py-2.5 rounded-xl text-sm cursor-pointer">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-[#7E0D0D] text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 cursor-pointer">
                {saving ? 'Saving…' : 'Save Result'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}
