'use client'

import { useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import { Phone, MessageCircle, Download, Search, NotebookPen, CalendarClock } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'

const STATUSES = ['new', 'contacted', 'follow-up', 'enrolled', 'lost'] as const
const statusColors: Record<string, string> = {
  new:         'bg-blue-50 text-blue-700 border-blue-200',
  contacted:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  'follow-up': 'bg-purple-50 text-purple-700 border-purple-200',
  enrolled:    'bg-green-50 text-green-700 border-green-200',
  lost:        'bg-gray-100 text-gray-500 border-gray-200',
  closed:      'bg-gray-100 text-gray-500 border-gray-200',
}

function csvEscape(v: unknown) {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function LeadsPage() {
  const supabase = createClient()
  const [leads, setLeads]     = useState<any[]>([])
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [detail, setDetail]   = useState<any | null>(null)
  const [notes, setNotes]     = useState('')
  const [followUp, setFollowUp] = useState('')
  const [savingDetail, setSavingDetail] = useState(false)

  async function load() {
    const { data } = await supabase.from('cms_leads').select('*').eq('site_id', SITE_ID).order('created_at', { ascending: false })
    setLeads(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function updateStatus(id: string, status: string) {
    await supabase.from('cms_leads').update({ status }).eq('id', id)
    load()
  }

  function openDetail(lead: any) {
    setDetail(lead)
    setNotes(lead.notes ?? '')
    setFollowUp(lead.follow_up_date ?? '')
  }

  async function saveDetail() {
    if (!detail) return
    setSavingDetail(true)
    await supabase.from('cms_leads').update({
      notes,
      follow_up_date: followUp || null,
    }).eq('id', detail.id)
    setSavingDetail(false)
    setDetail(null)
    load()
  }

  const counts = useMemo(() => leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1
    return acc
  }, {} as Record<string, number>), [leads])

  const visible = useMemo(() => {
    let list = filter === 'all' ? leads : leads.filter(l => l.status === filter)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(l =>
        (l.name ?? '').toLowerCase().includes(q) ||
        (l.phone ?? '').toLowerCase().includes(q) ||
        (l.city ?? '').toLowerCase().includes(q) ||
        (l.target_exam ?? '').toLowerCase().includes(q))
    }
    return list
  }, [leads, filter, search])

  function exportCsv() {
    const headers = ['Name', 'Phone', 'Target Exam', 'Class', 'City', 'Status', 'Follow-up Date', 'Notes', 'Message', 'Created At']
    const rows = visible.map(l => [
      l.name, l.phone, l.target_exam, l.class_level, l.city, l.status,
      l.follow_up_date, l.notes, l.message, l.created_at,
    ].map(csvEscape).join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hodu-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const today = new Date().toISOString().slice(0, 10)
  const conversionRate = leads.length > 0
    ? Math.round(((counts['enrolled'] ?? 0) / leads.length) * 100)
    : 0

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Leads Pipeline</h2>
          <p className="text-xs text-[#C9C8CB]">{leads.length} total · {conversionRate}% enrolled conversion</p>
        </div>
        <button onClick={exportCsv} className="flex items-center gap-2 border border-[#F3DCDC] hover:border-[#7E0D0D] hover:text-[#7E0D0D] text-[#1B2A44] text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* Pipeline summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(filter === s ? 'all' : s)}
            className={`text-left border rounded-2xl p-3.5 transition-all ${filter === s ? 'border-[#7E0D0D] shadow-sm bg-white' : 'border-[#F3DCDC] bg-white hover:border-[#7E0D0D]/40'}`}>
            <p className="text-xl font-black text-[#1B2A44]">{counts[s] ?? 0}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${statusColors[s]}`}>{s}</span>
          </button>
        ))}
      </div>

      {/* Search + reset filter */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2 flex-1 min-w-[220px] border border-[#F3DCDC] rounded-xl px-3 py-2 bg-white focus-within:border-[#7E0D0D]">
          <Search size={14} className="text-[#C9C8CB] shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, city, exam…"
            className="flex-1 text-sm focus:outline-none text-[#1B2A44] placeholder:text-[#C9C8CB]"
          />
        </div>
        {filter !== 'all' && (
          <button onClick={() => setFilter('all')} className="text-xs text-[#7E0D0D] font-semibold hover:underline">
            Clear filter ({filter})
          </button>
        )}
      </div>

      <div className="bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F3DCDC] bg-[#FDF5F5]">
                {['Name', 'Phone', 'Exam', 'City', 'Status', 'Follow-up', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#C9C8CB] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((l) => {
                const overdue = l.status === 'follow-up' && l.follow_up_date && l.follow_up_date < today
                return (
                  <tr key={l.id} className="border-b border-[#F3DCDC] last:border-0 hover:bg-[#FDF5F5]">
                    <td className="px-4 py-3">
                      <button onClick={() => openDetail(l)} className="font-medium text-[#1B2A44] hover:text-[#7E0D0D] text-left">
                        {l.name}
                        {l.notes && <NotebookPen size={11} className="inline ml-1.5 text-[#C9C8CB]" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#1B2A44]">{l.phone}</span>
                        <a href={`tel:${l.phone}`} className="text-[#7E0D0D]"><Phone size={12} /></a>
                        {l.phone && <a href={`https://wa.me/${l.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-600"><MessageCircle size={12} /></a>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#1B2A44]">{l.target_exam ?? '—'}</td>
                    <td className="px-4 py-3 text-[#1B2A44]">{l.city ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${statusColors[l.status] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>{l.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {l.follow_up_date ? (
                        <span className={`text-xs font-semibold ${overdue ? 'text-red-600' : 'text-[#1B2A44]'}`}>
                          {new Date(l.follow_up_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          {overdue && ' ⚠'}
                        </span>
                      ) : <span className="text-xs text-[#C9C8CB]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-[#C9C8CB]">
                      {new Date(l.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <select
                          value={l.status}
                          onChange={(e) => updateStatus(l.id, e.target.value)}
                          className="text-xs border border-[#F3DCDC] rounded-lg px-2 py-1 focus:outline-none focus:border-[#7E0D0D] text-[#1B2A44] capitalize"
                        >
                          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          {!STATUSES.includes(l.status) && <option value={l.status}>{l.status}</option>}
                        </select>
                        <button onClick={() => openDetail(l)} className="text-xs px-2.5 py-1 border border-[#F3DCDC] rounded-lg text-[#1B2A44] hover:bg-[#FDF5F5]">
                          Open
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {visible.length === 0 && <p className="text-center text-[#C9C8CB] py-12 text-sm">No leads match.</p>}
        </div>
      </div>

      {/* Lead detail modal */}
      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-[#C9C8CB]">Phone</p><p className="font-medium text-[#1B2A44]">{detail.phone}</p></div>
              <div><p className="text-xs text-[#C9C8CB]">City</p><p className="font-medium text-[#1B2A44]">{detail.city ?? '—'}</p></div>
              <div><p className="text-xs text-[#C9C8CB]">Target Exam</p><p className="font-medium text-[#1B2A44]">{detail.target_exam ?? '—'}</p></div>
              <div><p className="text-xs text-[#C9C8CB]">Class</p><p className="font-medium text-[#1B2A44]">{detail.class_level ?? '—'}</p></div>
            </div>

            {detail.message && (
              <div className="bg-[#FDF5F5] border border-[#F3DCDC] rounded-xl p-3">
                <p className="text-xs text-[#C9C8CB] mb-1">Enquiry Message</p>
                <p className="text-sm text-[#1B2A44]">{detail.message}</p>
              </div>
            )}

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#1B2A44] mb-1">
                <CalendarClock size={13} className="text-[#7E0D0D]" /> Follow-up Date
              </label>
              <input
                type="date"
                value={followUp}
                onChange={e => setFollowUp(e.target.value)}
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] text-[#1B2A44]"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-[#1B2A44] mb-1">
                <NotebookPen size={13} className="text-[#7E0D0D]" /> Notes
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={4}
                placeholder="Call summary, parent name, batch discussed, fee quoted…"
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none"
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={() => setDetail(null)} className="flex-1 border border-[#F3DCDC] text-[#1B2A44] py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={saveDetail} disabled={savingDetail} className="flex-1 bg-[#7E0D0D] text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                {savingDetail ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}
