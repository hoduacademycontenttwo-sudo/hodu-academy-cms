'use client'

import { useState } from 'react'
import { Plus, Pencil, Power, ExternalLink, X, Loader } from 'lucide-react'

interface Site {
  id: string
  name: string
  slug: string
  plan: string
  is_active: boolean
  owner_email: string | null
  tagline: string | null
  created_at: string
}

interface NewClientForm {
  instituteName: string
  slug: string
  ownerEmail: string
  adminPassword: string
  plan: 'trial' | 'basic' | 'pro'
  tagline: string
}

const EMPTY_FORM: NewClientForm = {
  instituteName: '',
  slug: '',
  ownerEmail: '',
  adminPassword: '',
  plan: 'trial',
  tagline: '',
}

export default function ClientsManager({ initialSites }: { initialSites: Site[] }) {
  const [sites, setSites]         = useState<Site[]>(initialSites)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState<NewClientForm>(EMPTY_FORM)
  const [loading, setLoading]     = useState(false)
  const [msg, setMsg]             = useState('')
  const [err, setErr]             = useState('')

  function set(k: keyof NewClientForm, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    // Auto-generate slug from institute name
    if (k === 'instituteName') {
      setForm(f => ({
        ...f,
        instituteName: v,
        slug: v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      }))
    }
  }

  async function createClient() {
    setLoading(true)
    setErr('')
    setMsg('')

    const res = await fetch('/api/super-admin/create-client', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) {
      setErr(data.error ?? 'Something went wrong.')
    } else {
      setMsg(`Client "${form.instituteName}" created! Admin login: ${form.ownerEmail} / ${form.adminPassword}`)
      setSites(prev => [data.site, ...prev])
      setForm(EMPTY_FORM)
    }
    setLoading(false)
  }

  async function toggleActive(site: Site) {
    const res = await fetch('/api/super-admin/toggle-site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId: site.id, isActive: !site.is_active }),
    })
    if (res.ok) {
      setSites(prev => prev.map(s => s.id === site.id ? { ...s, is_active: !s.is_active } : s))
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-slate-400 text-sm mt-0.5">{sites.length} coaching institutes on the platform</p>
        </div>
        <button onClick={() => { setShowModal(true); setMsg(''); setErr('') }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">
          <Plus size={16} /> Add New Client
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1E293B] border border-slate-700 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50">
            <tr className="text-slate-400">
              <th className="text-left px-5 py-3 font-medium">Institute</th>
              <th className="text-left px-5 py-3 font-medium">URL</th>
              <th className="text-left px-5 py-3 font-medium">Admin Email</th>
              <th className="text-left px-5 py-3 font-medium">Plan</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Created</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sites.map(site => (
              <tr key={site.id} className="hover:bg-slate-800/30">
                <td className="px-5 py-4">
                  <p className="text-white font-medium">{site.name}</p>
                  <p className="text-slate-500 text-xs">{site.tagline}</p>
                </td>
                <td className="px-5 py-4">
                  <a href={`/${site.slug}`} target="_blank" rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                    /{site.slug} <ExternalLink size={12} />
                  </a>
                </td>
                <td className="px-5 py-4 text-slate-300">{site.owner_email ?? '—'}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                    site.plan === 'pro'   ? 'bg-indigo-900 text-indigo-300' :
                    site.plan === 'basic' ? 'bg-blue-900 text-blue-300' :
                                            'bg-slate-700 text-slate-300'
                  }`}>{site.plan}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    site.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>{site.is_active ? 'Active' : 'Inactive'}</span>
                </td>
                <td className="px-5 py-4 text-slate-400">
                  {new Date(site.created_at).toLocaleDateString('en-IN')}
                </td>
                <td className="px-5 py-4">
                  <button onClick={() => toggleActive(site)} title={site.is_active ? 'Deactivate' : 'Activate'}
                    className={`p-2 rounded-lg transition-colors ${
                      site.is_active
                        ? 'text-red-400 hover:bg-red-900/30'
                        : 'text-green-400 hover:bg-green-900/30'
                    }`}>
                    <Power size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {sites.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                  No clients yet. Add your first coaching institute.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Add New Client</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Institute Name *</label>
                <input value={form.instituteName} onChange={e => set('instituteName', e.target.value)}
                  placeholder="e.g. Samayak Classes"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Site Slug * (URL path)</label>
                <div className="flex items-center">
                  <span className="bg-slate-800 border border-r-0 border-slate-700 rounded-l-xl px-3 py-2.5 text-sm text-slate-400">acadpro.in/</span>
                  <input value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="samayak"
                    className="flex-1 bg-[#0F172A] border border-slate-700 rounded-r-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tagline</label>
                <input value={form.tagline} onChange={e => set('tagline', e.target.value)}
                  placeholder="e.g. Shaping Tomorrow's Leaders"
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Admin Email *</label>
                  <input type="email" value={form.ownerEmail} onChange={e => set('ownerEmail', e.target.value)}
                    placeholder="admin@samayak.in"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Admin Password *</label>
                  <input type="text" value={form.adminPassword} onChange={e => set('adminPassword', e.target.value)}
                    placeholder="Min 8 chars"
                    className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Plan</label>
                <select value={form.plan} onChange={e => set('plan', e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500">
                  <option value="trial">Trial (Free)</option>
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                </select>
              </div>

              {err && <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-xl px-4 py-2">{err}</p>}
              {msg && <p className="text-green-400 text-sm bg-green-950 border border-green-800 rounded-xl px-4 py-2">{msg}</p>}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-700 text-slate-300 hover:text-white py-2.5 rounded-xl text-sm transition-colors">
                Cancel
              </button>
              <button onClick={createClient} disabled={loading || !form.instituteName || !form.slug || !form.ownerEmail || !form.adminPassword}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader size={14} className="animate-spin" /> Creating…</> : 'Create Client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
