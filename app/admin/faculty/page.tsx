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
  Sparkles,
  RefreshCw,
  Eye,
  Check,
  X
} from 'lucide-react'
import * as XLSX from 'xlsx'
import { normalizeImageUrl } from '@/lib/imageUtils'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'

const EMPTY = {
  name: '',
  role: 'Faculty',
  subject: '',
  qualification: '',
  experience: '',
  photo_url: '',
  bio: '',
  is_founder: false,
  featured_offline: true,
  sort_order: 0,
}

export default function FacultyPage() {
  const supabase = createClient()
  const [faculty, setFaculty] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'All' | 'Founders' | 'Faculty' | 'OfflineFeatured'>('All')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)

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
      setForm({
        ...f,
        is_founder: Boolean(f.is_founder || f.role?.toLowerCase().includes('founder') || f.role === 'Director'),
        featured_offline: Boolean(f.featured_offline),
      })
      setModal('edit')
    } else {
      setForm({
        ...EMPTY,
        is_founder: activeTab === 'Founders',
        role: activeTab === 'Founders' ? 'Co-Founder & Director' : 'Senior Faculty',
        featured_offline: true,
        sort_order: faculty.length + 1,
      })
      setModal('add')
    }
  }

  function set(k: string, v: any) {
    setForm((prev: any) => ({ ...prev, [k]: v }))
  }

  async function toggleFeaturedOffline(id: string, currentVal: boolean) {
    const newVal = !currentVal
    // Optimistic update
    setFaculty(prev => prev.map(item => item.id === id ? { ...item, featured_offline: newVal } : item))
    await supabase
      .from('cms_faculty')
      .update({ featured_offline: newVal })
      .eq('id', id)
  }

  async function save() {
    if (!form.name.trim()) return alert('Please enter the name')
    if (!form.subject.trim()) return alert('Please enter the subject / specialization')

    setSaving(true)
    const payload = {
      name: form.name.trim(),
      role: form.role || (form.is_founder ? 'Co-Founder & Director' : 'Faculty'),
      subject: form.subject.trim(),
      qualification: form.qualification || '',
      experience: form.experience || '',
      photo_url: form.photo_url || '',
      bio: form.bio || '',
      is_founder: Boolean(form.is_founder),
      featured_offline: Boolean(form.featured_offline),
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
    if (!confirm('Delete this member?')) return
    await supabase.from('cms_faculty').delete().eq('id', id)
    load()
  }

  // Live Re-sync from hoduacademy.com (page id=10)
  async function handleSyncFromSource() {
    if (!confirm('Sync and update Founders & Faculty from hoduacademy.com/mod/page/view.php?id=10?')) return
    setSyncing(true)
    setSyncMsg(null)

    try {
      const res = await fetch('/api/admin/sync-faculty', { method: 'POST' })
      const json = await res.json()
      if (json.success) {
        setSyncMsg(`Successfully synced ${json.count} members from source!`)
        load()
      } else {
        setSyncMsg(json.error || 'Failed to sync')
      }
    } catch (e: any) {
      setSyncMsg(e.message || 'Sync error')
    }
    setSyncing(false)
  }

  // Filtered list
  const filtered = faculty.filter(f => {
    if (activeTab === 'Founders') return f.is_founder || f.role?.toLowerCase().includes('founder') || f.role === 'Director'
    if (activeTab === 'Faculty') return !f.is_founder && !f.role?.toLowerCase().includes('founder') && f.role !== 'Director'
    if (activeTab === 'OfflineFeatured') return Boolean(f.featured_offline)
    return true
  })

  const foundersCount = faculty.filter(f => f.is_founder || f.role?.toLowerCase().includes('founder') || f.role === 'Director').length
  const facultyCount = faculty.filter(f => !f.is_founder && !f.role?.toLowerCase().includes('founder') && f.role !== 'Director').length
  const offlineCount = faculty.filter(f => Boolean(f.featured_offline)).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header Controls & Sync */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-maroon" />
              Academic Leadership & Teaching Faculty
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Manage founders and teachers. Choose which faculty are featured on the Jaipur Offline Campus page.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => open()}
              className="bg-brand-maroon hover:bg-brand-crimson text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        {syncMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{syncMsg}</span>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto">
          {[
            { id: 'All', label: 'All Members', count: faculty.length },
            { id: 'Founders', label: 'Founders & Directors', count: foundersCount },
            { id: 'Faculty', label: 'Top Faculty & Mentors', count: facultyCount },
            { id: 'OfflineFeatured', label: 'Featured on Offline Page', count: offlineCount },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-brand-maroon text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Faculty Grid & Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const isFounder = item.is_founder || item.role?.toLowerCase().includes('founder') || item.role === 'Director'
            const isOffline = Boolean(item.featured_offline)

            return (
              <div
                key={item.id}
                className="bg-white border-2 border-neutral-100 hover:border-brand-maroon/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                      isFounder ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                    }`}>
                      {isFounder ? 'Founder / Leadership' : (item.role || 'Faculty')}
                    </span>

                    {/* Offline Page Feature Toggle */}
                    <button
                      onClick={() => toggleFeaturedOffline(item.id, isOffline)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                        isOffline
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-neutral-50 text-neutral-400 border-neutral-200 hover:bg-neutral-100 hover:text-neutral-700'
                      }`}
                      title="Click to toggle whether this teacher appears on the Offline Jaipur Campus page"
                    >
                      {isOffline ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3 text-neutral-400" />}
                      <span>{isOffline ? 'On Offline Page' : 'Offline Hidden'}</span>
                    </button>
                  </div>

                  {/* Profile Info */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-brand-maroon/20 bg-neutral-50 shadow-2xs">
                      {item.photo_url ? (
                        <img
                          src={normalizeImageUrl(item.photo_url)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-brand-maroon bg-brand-blush">
                          {item.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-neutral-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-brand-maroon truncate">
                        {item.subject}
                      </p>
                      {item.qualification && (
                        <p className="text-[11px] text-neutral-500 font-medium truncate mt-0.5">
                          🎓 {item.qualification}
                        </p>
                      )}
                      {item.experience && (
                        <p className="text-[11px] text-neutral-500 font-medium truncate">
                          ⏳ {item.experience}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  {item.bio && (
                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed bg-neutral-50 p-2.5 rounded-xl mb-4 border border-neutral-100">
                      {item.bio}
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 mt-2">
                  <span className="text-[10px] font-bold text-neutral-400">
                    Order: #{item.sort_order}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => open(item)}
                      className="p-1.5 text-neutral-600 hover:text-brand-maroon hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit details"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => del(item.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-500">
            <Users className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
            <p className="text-sm font-semibold">No members found in this tab.</p>
          </div>
        )}

        {/* Add/Edit Modal */}
        {modal !== null && (
          <Modal
            onClose={() => setModal(null)}
            title={modal === 'add' ? 'Add Founder / Faculty Member' : 'Edit Member Details'}
            wide
          >
            <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="e.g. Mr. V.P. Singh"
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-maroon outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">Role / Designation *</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) => set('role', e.target.value)}
                    placeholder="e.g. Co-Founder & Director or Senior Physics Educator"
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-maroon outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">Subject / Department *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => set('subject', e.target.value)}
                    placeholder="e.g. Physics, Chemistry, Mathematics, English"
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-maroon outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">Qualification / College</label>
                  <input
                    type="text"
                    value={form.qualification}
                    onChange={(e) => set('qualification', e.target.value)}
                    placeholder="e.g. MNIT Jaipur, IIIT Hyderabad, Master's"
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-maroon outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">Experience / Pedigree</label>
                  <input
                    type="text"
                    value={form.experience}
                    onChange={(e) => set('experience', e.target.value)}
                    placeholder="e.g. 25+ Years Experience (10,000+ Students)"
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-maroon outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => set('sort_order', e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-maroon outline-none"
                  />
                </div>
              </div>

              {/* Checkbox Flags */}
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(form.is_founder)}
                    onChange={(e) => set('is_founder', e.target.checked)}
                    className="rounded text-brand-maroon focus:ring-brand-maroon h-4 w-4"
                  />
                  <span>Is Founder / Director (Renders in Leadership section)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(form.featured_offline)}
                    onChange={(e) => set('featured_offline', e.target.checked)}
                    className="rounded text-brand-maroon focus:ring-brand-maroon h-4 w-4"
                  />
                  <span>Feature on Offline Jaipur Campus Page</span>
                </label>
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 block">Profile Photo</label>
                <ImageUpload
                  value={form.photo_url}
                  onChange={(url) => set('photo_url', url)}
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-700 block">Biography / Teaching Philosophy</label>
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => set('bio', e.target.value)}
                  placeholder="Detailed bio, achievements, curricula taught..."
                  className="w-full border border-neutral-300 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:border-brand-maroon outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="px-4 py-2 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="px-5 py-2 bg-brand-maroon hover:bg-brand-crimson text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-60"
                >
                  {saving ? 'Saving...' : (modal === 'add' ? 'Add Member' : 'Save Changes')}
                </button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </AdminLayout>
  )
}
