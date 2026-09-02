'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Search, Pencil, Trash2, ExternalLink, Eye, EyeOff,
  Copy, Check, FileText, Globe, ArrowLeft
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { HODU_SITE_ID } from '@/lib/hodu'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const EMPTY_PAGE = {
  title: '',
  slug: '',
  secondary_link: '',
  excerpt: '',
  content: '',
  meta_title: '',
  meta_description: '',
  published: true,
}

export default function AdminPagesManager() {
  const supabase = createClient()
  const [pages, setPages] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [form, setForm] = useState<any>(EMPTY_PAGE)
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function loadPages() {
    setLoading(true)
    const { data } = await supabase
      .from('cms_pages')
      .select('*')
      .eq('site_id', HODU_SITE_ID)
      .order('created_at', { ascending: false })

    setPages(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadPages()
  }, [])

  function openModal(item?: any) {
    if (item) {
      setForm({ ...item })
      setModalMode('edit')
    } else {
      setForm({ ...EMPTY_PAGE })
      setModalMode('add')
    }
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setForm({ ...EMPTY_PAGE })
  }

  function setField(k: string, v: any) {
    setForm((prev: any) => {
      const next = { ...prev, [k]: v }
      if (k === 'title' && modalMode === 'add' && !prev.slug) {
        next.slug = slugify(v)
      }
      return next
    })
  }

  async function handleSave() {
    if (!form.title.trim()) {
      alert('Page title is required')
      return
    }

    setSaving(true)
    const payload = {
      site_id: HODU_SITE_ID,
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      secondary_link: form.secondary_link?.trim() || null,
      excerpt: form.excerpt?.trim() || null,
      content: form.content || '',
      meta_title: form.meta_title?.trim() || null,
      meta_description: form.meta_description?.trim() || null,
      published: Boolean(form.published),
      updated_at: new Date().toISOString(),
    }

    if (modalMode === 'edit') {
      const { error } = await supabase
        .from('cms_pages')
        .update(payload)
        .eq('id', form.id)
      if (error) alert(error.message)
    } else {
      const { error } = await supabase
        .from('cms_pages')
        .insert(payload)
      if (error) alert(error.message)
    }

    setSaving(false)
    closeModal()
    loadPages()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this page?')) return
    await supabase.from('cms_pages').delete().eq('id', id)
    loadPages()
  }

  async function togglePublish(page: any) {
    await supabase
      .from('cms_pages')
      .update({ published: !page.published })
      .eq('id', page.id)
    loadPages()
  }

  function copyText(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredPages = pages.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.title?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q) ||
      p.secondary_link?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1B2A44] flex items-center gap-2">
            <Globe className="text-[#7E0D0D]" size={24} />
            Pages & Legacy Moodle Links
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Create custom content pages and preserve existing URLs like <code className="bg-neutral-100 text-neutral-800 px-1 py-0.5 rounded text-xs">/mod/page/view.php?id=886</code> so old links never break.
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="bg-[#7E0D0D] hover:bg-[#921E1F] text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
        >
          <Plus size={15} /> Add New Page
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#F3DCDC] rounded-xl p-3 mb-6 flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title, slug, or legacy id (e.g. 886)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg outline-none focus:border-[#7E0D0D]"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F3DCDC] bg-[#FDF5F5]">
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#8B7C7C] uppercase tracking-wider">
                  Page Title & URLs
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#8B7C7C] uppercase tracking-wider">
                  Legacy / Secondary Link
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#8B7C7C] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-[#8B7C7C] uppercase tracking-wider">
                  View Links
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold text-[#8B7C7C] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#F3DCDC] last:border-0 hover:bg-[#FDF5F5]/60 transition-colors"
                >
                  <td className="px-4 py-3 max-w-sm">
                    <p className="font-semibold text-[#1B2A44] text-xs sm:text-sm line-clamp-1">{p.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-neutral-400 font-mono">/p/{p.slug}</span>
                      <button
                        onClick={() => copyText(`/p/${p.slug}`, `slug-${p.id}`)}
                        className="text-neutral-400 hover:text-neutral-600"
                        title="Copy modern slug link"
                      >
                        {copiedId === `slug-${p.id}` ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {p.secondary_link ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                          {p.secondary_link}
                        </span>
                        <button
                          onClick={() => copyText(p.secondary_link, `sec-${p.id}`)}
                          className="text-neutral-400 hover:text-neutral-600"
                          title="Copy legacy link"
                        >
                          {copiedId === `sec-${p.id}` ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
                        </button>
                      </div>
                    ) : (
                      <span className="text-neutral-400 text-xs italic">None</span>
                    )}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => togglePublish(p)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        p.published ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {p.published ? <Eye size={11} /> : <EyeOff size={11} />}
                      {p.published ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      {p.secondary_link && (
                        <a
                          href={p.secondary_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#7E0D0D] hover:underline text-xs flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink size={11} /> Legacy View
                        </a>
                      )}
                      <a
                        href={`/p/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-neutral-600 hover:underline text-xs flex items-center gap-1"
                      >
                        <ExternalLink size={11} /> Clean View
                      </a>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openModal(p)}
                        className="text-xs px-2.5 py-1 border border-[#F3DCDC] rounded-lg text-[#1B2A44] hover:bg-[#FDF5F5] flex items-center gap-1 font-medium"
                      >
                        <Pencil size={11} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-xs px-2.5 py-1 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-1 font-medium"
                      >
                        <Trash2 size={11} /> Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredPages.length === 0 && (
          <div className="text-center py-12 text-sm text-neutral-400">
            No pages found. Click &quot;Add New Page&quot; to create one.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-[#F3DCDC]">
            <div className="flex items-center justify-between pb-4 border-b border-[#F3DCDC] mb-5">
              <h2 className="text-base sm:text-lg font-bold text-[#1B2A44]">
                {modalMode === 'add' ? 'Create New Page' : 'Edit Page'}
              </h2>
              <button onClick={closeModal} className="text-neutral-400 hover:text-neutral-600">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                  Page Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  placeholder="e.g. NTA NEET Abhyas 70 Test Paper with Solution"
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                    Clean URL Slug <span className="text-neutral-400 font-normal">(/p/[slug])</span>
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) => setField('slug', e.target.value)}
                    placeholder="e.g. nta-neet-abhyas-70-test-paper"
                    className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm font-mono text-xs focus:outline-none focus:border-[#7E0D0D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                    Secondary Link / Legacy URL <span className="text-amber-700 font-normal">(e.g. /mod/page/view.php?id=886)</span>
                  </label>
                  <input
                    value={form.secondary_link || ''}
                    onChange={(e) => setField('secondary_link', e.target.value)}
                    placeholder="/mod/page/view.php?id=886"
                    className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm font-mono text-xs focus:outline-none focus:border-[#7E0D0D]"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Visitors opening this exact Moodle URL will see this page without broken links!
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                  Excerpt / Brief Description
                </label>
                <textarea
                  rows={2}
                  value={form.excerpt || ''}
                  onChange={(e) => setField('excerpt', e.target.value)}
                  placeholder="Short summary for SEO and previews..."
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#1B2A44]">
                    Page Content (HTML / Rich Text)
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    Supports pasted HTML tables, images, headings &amp; links directly from old site
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={form.content || ''}
                  onChange={(e) => setField('content', e.target.value)}
                  placeholder="Paste HTML or write content here..."
                  className="w-full border border-[#F3DCDC] rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-[#7E0D0D] bg-neutral-50 leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published}
                  onChange={(e) => setField('published', e.target.checked)}
                  className="rounded text-[#7E0D0D] focus:ring-[#7E0D0D]"
                />
                <label htmlFor="published" className="text-xs font-semibold text-[#1B2A44]">
                  Publish immediately (accessible to public)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#F3DCDC] mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-neutral-200 rounded-xl text-xs text-neutral-600 hover:bg-neutral-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-[#7E0D0D] hover:bg-[#921E1F] text-white rounded-xl text-xs font-bold disabled:opacity-50 shadow-xs"
              >
                {saving ? 'Saving...' : modalMode === 'add' ? 'Create Page' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
