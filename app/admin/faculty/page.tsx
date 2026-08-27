'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import ImageUpload from '@/components/admin/ImageUpload'
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Users,
  Award,
  Crown,
  BookOpen,
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { normalizeImageUrl } from '@/lib/imageUtils'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'

const EMPTY = {
  name: '',
  role: 'Faculty',
  subject: '',
  experience: '',
  photo_url: '',
  bio: '',
  sort_order: 0,
}

export default function FacultyPage() {
  const supabase = createClient()
  const [faculty, setFaculty] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'All' | 'Director' | 'Faculty'>('All')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)

  // Bulk Upload State
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkRows, setBulkRows] = useState<any[]>([])
  const [bulkStatus, setBulkStatus] = useState<string | null>(null)
  const [bulkUploading, setBulkUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase
      .from('cms_faculty')
      .select('*')
      .eq('site_id', SITE_ID)
      .order('sort_order', { ascending: true })
    setFaculty(data ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  function open(f?: any) {
    if (f) {
      setForm({ ...f, role: f.role || (f.subject?.toLowerCase().includes('director') ? 'Director' : 'Faculty') })
      setModal('edit')
    } else {
      setForm({
        ...EMPTY,
        role: activeTab === 'Director' ? 'Director' : 'Faculty',
        sort_order: faculty.length + 1,
      })
      setModal('add')
    }
  }

  function set(k: string, v: any) {
    setForm((prev: any) => ({ ...prev, [k]: v }))
  }

  async function save() {
    if (!form.name.trim()) return alert('Please enter the name')
    if (!form.subject.trim()) return alert('Please enter the subject / designation')

    setSaving(true)
    const payload = {
      name: form.name.trim(),
      role: form.role || 'Faculty',
      subject: form.subject.trim(),
      experience: form.experience || '',
      photo_url: form.photo_url || '',
      bio: form.bio || '',
      sort_order: Number(form.sort_order) || 0,
      site_id: SITE_ID,
    }

    if (modal === 'edit') {
      await supabase.from('cms_faculty').update(payload).eq('id', form.id)
    } else {
      await supabase.from('cms_faculty').insert(payload)
    }

    setSaving(false)
    setModal(null)
    load()
  }

  async function del(id: string) {
    if (!confirm('Delete this faculty member?')) return
    await supabase.from('cms_faculty').delete().eq('id', id)
    load()
  }

  // --- CSV / Excel Bulk Upload Handlers ---
  function downloadTemplate(type: 'xlsx' | 'csv' = 'xlsx') {
    const sampleData = [
      {
        'Photo URL': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        Name: 'Dr. Alok Verma',
        Role: 'Director',
        'Designation / Subject': 'Director & Academic Head',
        Experience: '20+ years',
        'Description / Bio': 'Ex-Senior Faculty & IIT Mentor with 20+ years mentoring international and JEE toppers.',
        'Sort Order': 1,
      },
      {
        'Photo URL': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        Name: 'Mr. Rajesh Mittal',
        Role: 'Director',
        'Designation / Subject': 'Managing Director & Co-Founder',
        Experience: '18+ years',
        'Description / Bio': 'Visionary educator focusing on personalized student pedagogy and global curriculums.',
        'Sort Order': 2,
      },
      {
        'Photo URL': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        Name: 'Dr. Sunita Sen',
        Role: 'Director',
        'Designation / Subject': 'Director & Mentorship Lead',
        Experience: '16+ years',
        'Description / Bio': 'Expert in student psychology, doubt cells, and Cambridge/IB assessments.',
        'Sort Order': 3,
      },
      {
        'Photo URL': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        Name: 'Mr. V.P. Singh',
        Role: 'Faculty',
        'Designation / Subject': 'Physics',
        Experience: '25+ years',
        'Description / Bio': 'Civil Engineering graduate from MNIT Jaipur with over 25 years teaching experience.',
        'Sort Order': 4,
      },
      {
        'Photo URL': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop',
        Name: 'Mr. Rohit Jain',
        Role: 'Faculty',
        'Designation / Subject': 'Physics',
        Experience: '15+ years',
        'Description / Bio': 'B.Tech from MNIT Jaipur mentoring JEE, NEET, and IGCSE students.',
        'Sort Order': 5,
      },
    ]

    const ws = XLSX.utils.json_to_sheet(sampleData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Faculty_Directors')

    if (type === 'csv') {
      XLSX.writeFile(wb, 'Hodu_Faculty_Directors_Template.csv', { bookType: 'csv' })
    } else {
      XLSX.writeFile(wb, 'Hodu_Faculty_Directors_Template.xlsx', { bookType: 'xlsx' })
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsName = wb.SheetNames[0]
        const ws = wb.Sheets[wsName]
        const data: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' })

        if (data.length === 0) {
          alert('Uploaded file is empty. Please check the template.')
          return
        }

        const parsedRows = data.map((row: any, idx: number) => {
          const name = row['Name'] || row['name'] || row['Faculty Name'] || row['Teacher Name'] || ''
          const roleRaw = (row['Role'] || row['role'] || row['Type'] || '').trim().toLowerCase()
          const isDirector = roleRaw.includes('director') || (row['Designation / Subject'] || row['Subject'] || '').toLowerCase().includes('director')
          const role = isDirector ? 'Director' : 'Faculty'
          const subject = row['Designation / Subject'] || row['Subject'] || row['Designation'] || row['subject'] || 'Subject Faculty'
          const experience = row['Experience'] || row['experience'] || row['Years of Experience'] || ''
          const bio = row['Description / Bio'] || row['Description'] || row['Bio'] || row['bio'] || ''
          const photo_url = row['Photo URL'] || row['Photo'] || row['Image URL'] || row['photo_url'] || ''
          const sort_order = Number(row['Sort Order'] || row['sort_order']) || idx + 1

          return {
            name,
            role,
            subject,
            experience,
            bio,
            photo_url,
            sort_order,
          }
        }).filter(r => r.name.trim().length > 0)

        if (parsedRows.length === 0) {
          alert('Could not find valid teacher names in the file. Please check column headers.')
          return
        }

        setBulkRows(parsedRows)
        setShowBulkModal(true)
        if (fileInputRef.current) fileInputRef.current.value = ''
      } catch (err: any) {
        console.error('Error reading Excel/CSV file:', err)
        alert('Failed to parse file: ' + (err?.message || 'Invalid format'))
      }
    }
    reader.readAsBinaryString(file)
  }

  async function executeBulkUpload() {
    if (bulkRows.length === 0) return
    setBulkUploading(true)
    setBulkStatus(`Uploading ${bulkRows.length} members...`)

    try {
      const recordsToInsert = bulkRows.map(r => ({
        ...r,
        site_id: SITE_ID,
      }))

      const { error } = await supabase.from('cms_faculty').insert(recordsToInsert)

      if (error) throw error

      setBulkStatus(`Successfully uploaded ${bulkRows.length} members!`)
      setTimeout(() => {
        setShowBulkModal(false)
        setBulkRows([])
        setBulkStatus(null)
        setBulkUploading(false)
        load()
      }, 1000)
    } catch (err: any) {
      console.error('Error in bulk upload:', err)
      setBulkStatus('Error uploading: ' + (err?.message || 'Check database connection'))
      setBulkUploading(false)
    }
  }

  const directors = faculty.filter(
    (f) => f.role === 'Director' || f.subject?.toLowerCase().includes('director')
  )
  const facultyMembers = faculty.filter(
    (f) => f.role !== 'Director' && !f.subject?.toLowerCase().includes('director')
  )

  const filteredFaculty =
    activeTab === 'Director'
      ? directors
      : activeTab === 'Faculty'
      ? facultyMembers
      : faculty

  return (
    <AdminLayout>
      {/* ─── Header & Action Buttons ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1B2A44] flex items-center gap-2">
            <Users className="text-brand-maroon h-6 w-6" />
            Leadership & Faculty Mentors
          </h2>
          <p className="text-xs text-[#C9C8CB] mt-0.5">
            {faculty.length} total members · {directors.length} Directors · {facultyMembers.length} Faculty
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Hidden File Input for CSV/Excel */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            className="hidden"
          />

          {/* Bulk Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-white border border-[#F3DCDC] hover:bg-[#FDF5F5] text-[#1B2A44] text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <Upload size={14} className="text-brand-maroon" />
            <span>Upload CSV / Excel</span>
          </button>

          {/* Download Template Dropdown */}
          <button
            onClick={() => downloadTemplate('xlsx')}
            title="Download Excel Template"
            className="flex items-center gap-1.5 bg-white border border-[#F3DCDC] hover:bg-[#FDF5F5] text-[#1B2A44] text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-2xs cursor-pointer"
          >
            <Download size={14} className="text-emerald-700" />
            <span>Template</span>
          </button>

          {/* Add Single Member */}
          <button
            onClick={() => open()}
            className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus size={16} /> Add Member
          </button>
        </div>
      </div>

      {/* ─── Filter Tabs ─── */}
      <div className="flex items-center gap-2 pb-3 mb-5 border-b border-[#F3DCDC]">
        <button
          onClick={() => setActiveTab('All')}
          className={`text-xs font-bold px-4 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'All'
              ? 'bg-[#7E0D0D] text-white shadow-xs'
              : 'bg-white text-[#1B2A44] hover:bg-[#FDF5F5] border border-[#F3DCDC]'
          }`}
        >
          All Members ({faculty.length})
        </button>

        <button
          onClick={() => setActiveTab('Director')}
          className={`text-xs font-bold px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'Director'
              ? 'bg-[#7E0D0D] text-white shadow-xs'
              : 'bg-white text-[#1B2A44] hover:bg-[#FDF5F5] border border-[#F3DCDC]'
          }`}
        >
          <Crown size={13} className={activeTab === 'Director' ? 'text-amber-300' : 'text-amber-600'} />
          Directors ({directors.length})
        </button>

        <button
          onClick={() => setActiveTab('Faculty')}
          className={`text-xs font-bold px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'Faculty'
              ? 'bg-[#7E0D0D] text-white shadow-xs'
              : 'bg-white text-[#1B2A44] hover:bg-[#FDF5F5] border border-[#F3DCDC]'
          }`}
        >
          <BookOpen size={13} className={activeTab === 'Faculty' ? 'text-white' : 'text-brand-maroon'} />
          Faculty Mentors ({facultyMembers.length})
        </button>
      </div>

      {/* ─── Faculty Grid ─── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFaculty.map((f) => {
          const isDirector = f.role === 'Director' || f.subject?.toLowerCase().includes('director')

          return (
            <div
              key={f.id}
              className={`bg-white border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-xs hover:shadow-md ${
                isDirector ? 'border-amber-300 ring-1 ring-amber-200/60 bg-amber-50/20' : 'border-[#F3DCDC]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="relative">
                    {f.photo_url ? (
                      <img
                        src={normalizeImageUrl(f.photo_url)}
                        alt={f.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-brand-border"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-[#FDF5F5] rounded-full flex items-center justify-center text-[#7E0D0D] font-bold text-lg border border-brand-border">
                        {f.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    {isDirector && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 text-white p-1 rounded-full shadow-xs">
                        <Crown size={10} />
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      isDirector
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-brand-maroon/10 text-brand-maroon'
                    }`}
                  >
                    {isDirector ? 'Director' : 'Faculty'}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-sm text-[#1B2A44] leading-snug">{f.name}</p>
                  <p className="text-xs font-semibold text-[#7E0D0D] mt-0.5">{f.subject}</p>
                  {f.experience && (
                    <p className="text-[11px] font-medium text-[#C9C8CB] mt-0.5">{f.experience} Experience</p>
                  )}
                </div>

                {f.bio && (
                  <p className="text-xs text-[#1B2A44] opacity-75 mt-2 line-clamp-2 leading-relaxed border-t border-[#F3DCDC]/60 pt-2">
                    {f.bio}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-[#F3DCDC]/60">
                <button
                  onClick={() => open(f)}
                  className="flex-1 text-xs border border-[#F3DCDC] text-[#1B2A44] hover:bg-[#FDF5F5] py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer font-medium"
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => del(f.id)}
                  className="flex-1 text-xs border border-red-100 text-red-500 hover:bg-red-50 py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer font-medium"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredFaculty.length === 0 && (
        <div className="text-center bg-white border border-[#F3DCDC] rounded-2xl py-12 px-4 space-y-3">
          <Users size={32} className="mx-auto text-[#C9C8CB]" />
          <p className="text-sm font-semibold text-[#1B2A44]">No members found in {activeTab}.</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Click "Add Member" or "Upload CSV / Excel" to add your directors and faculty mentors.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => open()}
              className="text-xs font-bold text-white bg-brand-maroon px-4 py-2 rounded-xl hover:bg-brand-crimson transition-colors cursor-pointer"
            >
              + Add Member
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold text-[#1B2A44] bg-[#FDF5F5] border border-[#F3DCDC] px-4 py-2 rounded-xl hover:bg-white transition-colors cursor-pointer"
            >
              Upload CSV
            </button>
          </div>
        </div>
      )}

      {/* ─── Add/Edit Single Faculty Modal ─── */}
      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Member' : 'Add Leadership / Faculty Member'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Role / Category *</label>
              <select
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
              >
                <option value="Director">👑 Director (Leadership & Core Board)</option>
                <option value="Faculty">👨‍🏫 Faculty Mentor (Subject Specialist)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Name *</label>
              <input
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                placeholder="e.g. Dr. Alok Verma / Mr. V.P. Singh"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Designation / Subject *</label>
                <input
                  value={form.subject}
                  onChange={(e) => set('subject', e.target.value)}
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                  placeholder="e.g. Physics / Academic Director"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Experience</label>
                <input
                  value={form.experience}
                  onChange={(e) => set('experience', e.target.value)}
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                  placeholder="e.g. 15+ years / 20+ years in STEM"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Description / Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => set('bio', e.target.value)}
                rows={3}
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none"
                placeholder="Brief bio or teaching background..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => set('sort_order', parseInt(e.target.value) || 0)}
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
              />
            </div>

            <ImageUpload
              value={form.photo_url}
              onChange={(url) => set('photo_url', url)}
              folder="faculty"
              label="Photo (or paste Google Drive link)"
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-[#F3DCDC] text-[#1B2A44] py-2.5 rounded-xl text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 bg-[#7E0D0D] text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 cursor-pointer"
              >
                {saving ? 'Saving…' : 'Save Member'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── Bulk Upload Preview Modal ─── */}
      {showBulkModal && (
        <Modal title={`Review & Import ${bulkRows.length} Members`} onClose={() => setShowBulkModal(false)}>
          <div className="space-y-4">
            <div className="bg-[#FDF5F5] border border-[#F3DCDC] p-3 rounded-xl flex items-center gap-2 text-xs text-[#7E0D0D]">
              <FileSpreadsheet size={16} className="shrink-0" />
              <span>
                Found <strong>{bulkRows.length}</strong> valid rows. Review below before importing into database.
              </span>
            </div>

            <div className="max-h-64 overflow-y-auto border border-[#F3DCDC] rounded-xl divide-y divide-[#F3DCDC]">
              {bulkRows.map((r, i) => (
                <div key={i} className="p-3 text-xs flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3">
                    {r.photo_url ? (
                      <img src={normalizeImageUrl(r.photo_url)} alt="" className="w-8 h-8 rounded-full object-cover border" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-blush text-brand-maroon flex items-center justify-center font-bold text-[10px]">
                        {r.name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-[#1B2A44]">{r.name}</p>
                      <p className="text-[11px] text-neutral-500">
                        {r.subject} {r.experience ? `· ${r.experience}` : ''}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      r.role === 'Director'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-brand-maroon/10 text-brand-maroon'
                    }`}
                  >
                    {r.role}
                  </span>
                </div>
              ))}
            </div>

            {bulkStatus && (
              <p className="text-xs font-semibold text-center text-brand-maroon">{bulkStatus}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowBulkModal(false)}
                disabled={bulkUploading}
                className="flex-1 border border-[#F3DCDC] text-[#1B2A44] py-2.5 rounded-xl text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkUpload}
                disabled={bulkUploading}
                className="flex-1 bg-[#7E0D0D] hover:bg-[#922222] text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Upload size={14} />
                <span>{bulkUploading ? 'Importing…' : `Import ${bulkRows.length} Members`}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}
