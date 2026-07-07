'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import { Save, Plus, Trash2, GripVertical } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'

type NavLink = { id: string; label: string; href: string; icon: string | null; sort_order: number }

function LinkListEditor({
  title, hint, links, onAdd, onUpdate, onDelete, onSave, withIcon,
}: {
  title: string
  hint: string
  links: NavLink[]
  onAdd: () => void
  onUpdate: (id: string, patch: Partial<NavLink>) => void
  onDelete: (id: string) => void
  onSave: (link: NavLink) => void
  withIcon?: boolean
}) {
  return (
    <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-[#1B2A44]">{title}</h3>
          <p className="text-xs text-[#C9C8CB] mt-0.5">{hint}</p>
        </div>
        <button onClick={onAdd} className="flex items-center gap-1.5 text-xs text-[#7E0D0D] hover:underline font-medium shrink-0">
          <Plus size={13} /> Add
        </button>
      </div>

      {links.length === 0 ? (
        <p className="text-xs text-[#C9C8CB] py-4 text-center border border-dashed border-[#F3DCDC] rounded-xl">No items yet.</p>
      ) : (
        <div className="space-y-2">
          {links.map(link => (
            <div key={link.id} className="flex items-center gap-2 border border-[#F3DCDC] rounded-xl p-2.5">
              <GripVertical size={14} className="text-[#C9C8CB] shrink-0" />
              {withIcon && (
                <input
                  value={link.icon ?? ''}
                  onChange={e => onUpdate(link.id, { icon: e.target.value })}
                  placeholder="🎓"
                  className="w-12 border border-[#F3DCDC] rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:border-[#7E0D0D]"
                />
              )}
              <input
                value={link.label}
                onChange={e => onUpdate(link.id, { label: e.target.value })}
                placeholder="Label"
                className="flex-1 min-w-0 border border-[#F3DCDC] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#7E0D0D]"
              />
              <input
                value={link.href}
                onChange={e => onUpdate(link.id, { href: e.target.value })}
                placeholder="/courses?category=..."
                className="flex-1 min-w-0 border border-[#F3DCDC] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#7E0D0D]"
              />
              <button onClick={() => onSave(link)} className="text-xs bg-[#7E0D0D] hover:bg-[#922222] text-white px-3 py-1.5 rounded-lg font-semibold shrink-0">
                Save
              </button>
              <button onClick={() => onDelete(link.id)} className="text-red-400 hover:text-red-600 shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function NavigationPage() {
  const supabase = createClient()
  const [courses, setCourses] = useState<NavLink[]>([])
  const [studyMaterials, setStudyMaterials] = useState<NavLink[]>([])
  const [loading, setLoading] = useState(true)

  const [siteForm, setSiteForm] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function load() {
    setLoading(true)
    const [{ data: courseLinks }, { data: studyLinks }, { data: site }] = await Promise.all([
      supabase.from('cms_nav_links').select('*').eq('site_id', SITE_ID).eq('group_name', 'courses').order('sort_order'),
      supabase.from('cms_nav_links').select('*').eq('site_id', SITE_ID).eq('group_name', 'study_materials').order('sort_order'),
      supabase.from('cms_sites').select('footer_description, footer_cta_text, footer_cta_link').eq('id', SITE_ID).single(),
    ])
    setCourses(courseLinks ?? [])
    setStudyMaterials(studyLinks ?? [])
    setSiteForm(site ?? { footer_description: '', footer_cta_text: '', footer_cta_link: '' })
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  function updateLocal(group: 'courses' | 'study_materials', id: string, patch: Partial<NavLink>) {
    const setter = group === 'courses' ? setCourses : setStudyMaterials
    setter(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))
  }

  async function addLink(group: 'courses' | 'study_materials') {
    const list = group === 'courses' ? courses : studyMaterials
    const nextOrder = list.length > 0 ? Math.max(...list.map(l => l.sort_order)) + 1 : 0
    const { data } = await supabase.from('cms_nav_links').insert({
      site_id: SITE_ID, group_name: group, label: 'New Item', href: '/', icon: group === 'courses' ? '📌' : null, sort_order: nextOrder,
    }).select().single()
    if (data) {
      const setter = group === 'courses' ? setCourses : setStudyMaterials
      setter(prev => [...prev, data])
    }
  }

  async function saveLink(link: NavLink) {
    await supabase.from('cms_nav_links').update({ label: link.label, href: link.href, icon: link.icon }).eq('id', link.id)
  }

  async function deleteLink(group: 'courses' | 'study_materials', id: string) {
    if (!confirm('Delete this item?')) return
    await supabase.from('cms_nav_links').delete().eq('id', id)
    const setter = group === 'courses' ? setCourses : setStudyMaterials
    setter(prev => prev.filter(l => l.id !== id))
  }

  async function saveSiteForm() {
    setSaving(true)
    await supabase.from('cms_sites').update(siteForm).eq('id', SITE_ID)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading || !siteForm) return <AdminLayout><p className="text-[#C9C8CB] text-sm">Loading…</p></AdminLayout>

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#1B2A44]">Navigation & Footer</h2>
        <p className="text-xs text-[#C9C8CB]">Manage the Courses and Study Materials menus (shown in the Navbar dropdowns and Footer), plus footer content</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <LinkListEditor
          title="Academic Offerings (Courses menu)"
          hint="Shown in the Navbar 'Courses' dropdown and the Footer 'Academic Offerings' list"
          links={courses}
          withIcon
          onAdd={() => addLink('courses')}
          onUpdate={(id, patch) => updateLocal('courses', id, patch)}
          onDelete={id => deleteLink('courses', id)}
          onSave={saveLink}
        />

        <LinkListEditor
          title="Study Materials menu"
          hint="Shown in the Navbar 'Study Materials' dropdown"
          links={studyMaterials}
          onAdd={() => addLink('study_materials')}
          onUpdate={(id, patch) => updateLocal('study_materials', id, patch)}
          onDelete={id => deleteLink('study_materials', id)}
          onSave={saveLink}
        />

        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1B2A44]">Footer Content</h3>
            <button onClick={saveSiteForm} disabled={saving} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs font-semibold px-3.5 py-2 rounded-xl disabled:opacity-60">
              <Save size={13} /> {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
            </button>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Footer Description</label>
            <textarea
              value={siteForm.footer_description ?? ''}
              onChange={e => setSiteForm((f: any) => ({ ...f, footer_description: e.target.value }))}
              rows={3}
              className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none"
              placeholder="Short paragraph shown under the logo in the footer…"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Footer Button Text</label>
              <input
                value={siteForm.footer_cta_text ?? ''}
                onChange={e => setSiteForm((f: any) => ({ ...f, footer_cta_text: e.target.value }))}
                className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]"
                placeholder="Request Free Callback"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Footer Button Link</label>
              <input
                value={siteForm.footer_cta_link ?? ''}
                onChange={e => setSiteForm((f: any) => ({ ...f, footer_cta_link: e.target.value }))}
                className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]"
                placeholder="/contact"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
