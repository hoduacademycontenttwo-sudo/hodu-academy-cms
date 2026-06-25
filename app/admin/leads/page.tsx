'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import { Phone, MessageCircle } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const STATUSES = ['new', 'contacted', 'enrolled', 'closed']
const statusColors: Record<string, string> = {
  new:       'bg-blue-50 text-blue-700',
  contacted: 'bg-yellow-50 text-yellow-700',
  enrolled:  'bg-green-50 text-green-700',
  closed:    'bg-gray-100 text-gray-500',
}

export default function LeadsPage() {
  const supabase = createClient()
  const [leads, setLeads]   = useState<any[]>([])
  const [filter, setFilter] = useState('all')

  async function load() {
    let q = supabase.from('cms_leads').select('*').eq('site_id', SITE_ID).order('created_at', { ascending: false })
    if (filter !== 'all') q = q.eq('status', filter)
    const { data } = await q
    setLeads(data ?? [])
  }
  useEffect(() => { load() }, [filter])

  async function updateStatus(id: string, status: string) {
    await supabase.from('cms_leads').update({ status }).eq('id', id)
    load()
  }

  const allFilters = ['all', ...STATUSES]
  const counts = leads.reduce((acc, l) => { acc[l.status] = (acc[l.status] ?? 0) + 1; return acc }, {} as Record<string, number>)

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1B2A44]">Leads & Enquiries</h2>
        <p className="text-xs text-[#C9C8CB]">{leads.length} leads shown</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {allFilters.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${filter === s ? 'bg-[#7E0D0D] text-white' : 'bg-[#FDF5F5] text-[#1B2A44] border border-[#F3DCDC]'}`}>
            {s === 'all' ? 'All' : s} {s !== 'all' && counts[s] ? `(${counts[s]})` : ''}
          </button>
        ))}
      </div>

      <div className="bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F3DCDC] bg-[#FDF5F5]">
                {['Name', 'Phone', 'Exam', 'Class', 'City', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#C9C8CB] uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-[#F3DCDC] last:border-0 hover:bg-[#FDF5F5]">
                  <td className="px-4 py-3 font-medium text-[#1B2A44]">{l.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[#1B2A44]">{l.phone}</span>
                      <a href={`tel:${l.phone}`} className="text-[#7E0D0D]"><Phone size={12} /></a>
                      {l.phone && <a href={`https://wa.me/${l.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-green-600"><MessageCircle size={12} /></a>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#1B2A44]">{l.target_exam ?? '—'}</td>
                  <td className="px-4 py-3 text-[#1B2A44]">{l.class_level ?? '—'}</td>
                  <td className="px-4 py-3 text-[#1B2A44]">{l.city ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[l.status]}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#C9C8CB]">
                    {new Date(l.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                      className="text-xs border border-[#F3DCDC] rounded-lg px-2 py-1 focus:outline-none focus:border-[#7E0D0D] text-[#1B2A44]"
                    >
                      {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && <p className="text-center text-[#C9C8CB] py-12 text-sm">No leads yet.</p>}
        </div>
      </div>
    </AdminLayout>
  )
}
