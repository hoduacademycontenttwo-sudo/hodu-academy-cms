'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import ImageUpload from '@/components/admin/ImageUpload'
import { Save } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'

export default function HomeContentPage() {
  const supabase = createClient()
  const [form, setForm]     = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    supabase.from('cms_home_sections').select('*').eq('site_id', SITE_ID).single()
      .then(({ data }) => {
        const defaults = {
          site_id: SITE_ID, hero_title: '', hero_subtitle: '', hero_image_url: '',
          cta_text: 'Book Free Demo Class', cta_link: '/demo/contact',
          stats_json: { 'Students Enrolled': '50,000+', 'Top Rankers': '1,200+', 'Years of Excellence': '15+' }
        }
        const row = data ?? defaults
        // Normalize stats_json to Record<string, string> regardless of how it was stored
        let statsJson = row.stats_json
        if (Array.isArray(statsJson)) {
          const obj: Record<string, string> = {}
          for (const item of statsJson) {
            if (item && typeof item === 'object') obj[String(item.label ?? '')] = String(item.value ?? '')
            else if (typeof item === 'string') obj[item] = ''
          }
          statsJson = obj
        } else if (statsJson && typeof statsJson === 'object') {
          const obj: Record<string, string> = {}
          for (const [k, v] of Object.entries(statsJson)) {
            obj[k] = v && typeof v === 'object' ? String((v as any).value ?? '') : String(v ?? '')
          }
          statsJson = obj
        }
        setForm({ ...row, stats_json: statsJson ?? defaults.stats_json })
      })
  }, [])

  function set(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })) }

  function setStatKey(oldKey: string, newKey: string, val: string) {
    const stats = { ...(form.stats_json ?? {}) }
    if (oldKey !== newKey) { delete stats[oldKey] }
    stats[newKey] = val
    set('stats_json', stats)
  }

  function addStat() {
    const stats = { ...(form.stats_json ?? {}), 'New Stat': '0' }
    set('stats_json', stats)
  }

  function removeStat(key: string) {
    const stats = { ...(form.stats_json ?? {}) }
    delete stats[key]
    set('stats_json', stats)
  }

  async function save() {
    setSaving(true)
    const { id, ...payload } = form
    if (id) {
      await supabase.from('cms_home_sections').update(payload).eq('id', id)
    } else {
      await supabase.from('cms_home_sections').insert(payload)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!form) return <AdminLayout><p className="text-[#C9C8CB] text-sm">Loading…</p></AdminLayout>

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Home Page Content</h2>
          <p className="text-xs text-[#C9C8CB]">Edit hero section and stats</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-60">
          <Save size={15} /> {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-[#1B2A44]">Hero Section</h3>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Hero Title *</label>
            <input value={form.hero_title} onChange={(e) => set('hero_title', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" placeholder="Your Dream Rank Starts Here" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Hero Subtitle</label>
            <textarea value={form.hero_subtitle} onChange={(e) => set('hero_subtitle', e.target.value)} rows={3} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">CTA Button Text</label>
              <input value={form.cta_text} onChange={(e) => set('cta_text', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">CTA Link</label>
              <input value={form.cta_link} onChange={(e) => set('cta_link', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>
          </div>
          <ImageUpload value={form.hero_image_url ?? ''} onChange={(url) => set('hero_image_url', url)} folder="hero" label="Hero Image" />
        </div>

        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1B2A44]">Stats</h3>
            <button onClick={addStat} className="text-xs text-[#7E0D0D] hover:underline font-medium">+ Add Stat</button>
          </div>
          {Object.entries(form.stats_json ?? {}).map(([key, value]) => (
            <div key={key} className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="block text-xs text-[#C9C8CB] mb-1">Label</label>
                <input
                  value={key}
                  onChange={(e) => setStatKey(key, e.target.value, value as string)}
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-[#C9C8CB] mb-1">Value</label>
                <input
                  value={value as string}
                  onChange={(e) => setStatKey(key, key, e.target.value)}
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                />
              </div>
              <button onClick={() => removeStat(key)} className="text-red-400 hover:text-red-600 mt-6 text-xs">✕</button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
