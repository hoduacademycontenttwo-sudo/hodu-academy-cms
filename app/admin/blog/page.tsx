'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import ImageUpload from '@/components/admin/ImageUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Plus, Pencil, Trash2, ExternalLink, Eye, EyeOff, Search, RefreshCw } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const CATEGORIES = ['All', 'JEE', 'NEET', 'IGCSE', 'IB', 'CBSE', 'Olympiad', 'General']
const EMPTY = {
  title: '',
  slug: '',
  secondary_link: '',
  excerpt: '',
  content: '',
  category: 'General',
  cover_image: '',
  read_time: '5 min read',
  author: 'Abhishek Agarwal',
  published: true,
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function BlogAdminPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<any[]>([])
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [catFilter, setCatFilter] = useState('All')

  async function load() {
    const { data } = await supabase
      .from('cms_blogs')
      .select('*')
      .eq('site_id', SITE_ID)
      .order('created_at', { ascending: false })
    setPosts(data ?? [])
  }

  useEffect(() => {
    load()
  }, [])

  function open(p?: any) {
    setForm(p ? { ...p } : EMPTY)
    setModal(p ? 'edit' : 'add')
  }

  function set(k: string, v: any) {
    setForm((f: any) => ({ ...f, [k]: v }))
  }

  async function save() {
    if (!form.title.trim()) return alert('Title is required')
    setSaving(true)
    const payload = {
      ...form,
      site_id: SITE_ID,
      slug: form.slug || slugify(form.title),
    }
    if (modal === 'edit') {
      await supabase.from('cms_blogs').update(payload).eq('id', form.id)
    } else {
      await supabase.from('cms_blogs').insert(payload)
    }
    setSaving(false)
    setModal(null)
    load()
  }

  async function del(id: string) {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    await supabase.from('cms_blogs').delete().eq('id', id)
    load()
  }

  async function togglePublished(post: any) {
    await supabase.from('cms_blogs').update({ published: !post.published }).eq('id', post.id)
    load()
  }

  async function handleSyncWithLive() {
    if (!confirm('Sync default 10 blog entries from hoduacademy.com into database?')) return
    setSyncing(true)
    try {
      const res = await fetch('/api/admin/sync-blogs', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        alert('Successfully synchronized blog entries!')
        load()
      } else {
        alert('Sync error: ' + (data.error || 'Unknown error'))
      }
    } catch (e: any) {
      alert('Sync failed: ' + e.message)
    } finally {
      setSyncing(false)
    }
  }

  const displayedPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCat = catFilter === 'All' || p.category === catFilter
      const matchesSearch =
        !searchFilter.trim() ||
        p.title?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchFilter.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [posts, catFilter, searchFilter])

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1B2A44]">Blog Management</h2>
          <p className="text-xs text-[#7A7A7A]">
            {posts.length} blog entries &middot; Synced with public Site Blog
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSyncWithLive}
            disabled={syncing}
            className="flex items-center gap-1.5 border border-[#7E0D0D] text-[#7E0D0D] hover:bg-[#FDF5F5] text-xs font-semibold px-3 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync Live Blogs'}
          </button>

          <button
            onClick={() => open()}
            className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs"
          >
            <Plus size={14} /> Write New Entry
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#F3DCDC] rounded-xl p-3 mb-6 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by title, slug, or category..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-200 rounded-lg outline-none focus:border-[#7E0D0D]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-neutral-500 shrink-0 font-medium">Category:</span>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-700 outline-none focus:border-[#7E0D0D]"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Blog Table */}
      <div className="bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F3DCDC] bg-[#FDF5F5]">
                {['Cover', 'Title', 'Category', 'Date', 'Status', 'Link', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold text-[#8B7C7C] uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedPosts.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#F3DCDC] last:border-0 hover:bg-[#FDF5F5]/60 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="w-14 h-9 rounded bg-black overflow-hidden border border-neutral-200 shrink-0">
                      {p.cover_image ? (
                        <img
                          src={p.cover_image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#1B2A44] max-w-xs sm:max-w-md">
                    <p className="truncate text-xs sm:text-sm">{p.title}</p>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span className="text-[10px] text-neutral-500 font-mono">/blog/{p.slug}</span>
                      {p.secondary_link && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-mono" title="Legacy redirect URL">
                          Legacy: {p.secondary_link}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-[#FDF5F5] text-[#7E0D0D] border border-[#F3DCDC] text-[11px] px-2.5 py-0.5 rounded-full font-semibold">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500 whitespace-nowrap">
                    {new Date(p.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => togglePublished(p)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        p.published ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {p.published ? <Eye size={11} /> : <EyeOff size={11} />}
                      {p.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#7E0D0D] hover:underline text-xs flex items-center gap-1 font-medium"
                    >
                      <ExternalLink size={12} />
                      <span>View</span>
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => open(p)}
                        className="text-xs px-2.5 py-1 border border-[#F3DCDC] rounded-lg text-[#1B2A44] hover:bg-[#FDF5F5] flex items-center gap-1"
                      >
                        <Pencil size={11} /> Edit
                      </button>
                      <button
                        onClick={() => del(p.id)}
                        className="text-xs px-2.5 py-1 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-1"
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

        {displayedPosts.length === 0 && (
          <div className="text-center py-12 text-sm text-neutral-400">
            No blog posts found.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <Modal
          title={modal === 'edit' ? 'Edit Blog Entry' : 'Write New Blog Entry'}
          onClose={() => setModal(null)}
          wide
        >
          <div className="space-y-4 max-h-[78vh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                Title *
              </label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. VITEEE 2026 Application Form Updates"
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                Slug <span className="text-neutral-400 font-normal">(URL path)</span>
              </label>
              <input
                value={form.slug}
                onChange={(e) => set('slug', slugify(e.target.value))}
                placeholder={form.title ? slugify(form.title) : 'viteee-2026-updates'}
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm font-mono text-xs focus:outline-none focus:border-[#7E0D0D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                Secondary Link / Legacy URL <span className="text-neutral-400 font-normal">(e.g. /blog/index.php?entryid=14)</span>
              </label>
              <input
                value={form.secondary_link || ''}
                onChange={(e) => set('secondary_link', e.target.value)}
                placeholder="/blog/index.php?entryid=14"
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm font-mono text-xs focus:outline-none focus:border-[#7E0D0D]"
              />
              <p className="text-[11px] text-neutral-400 mt-1">
                Preserves existing bookmarks and links by automatically redirecting visitors to this post.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                  Author
                </label>
                <input
                  value={form.author}
                  onChange={(e) => set('author', e.target.value)}
                  placeholder="Abhishek Agarwal"
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                  Read Time
                </label>
                <input
                  value={form.read_time}
                  onChange={(e) => set('read_time', e.target.value)}
                  placeholder="5 min read"
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                Cover Image URL
              </label>
              <input
                value={form.cover_image}
                onChange={(e) => set('cover_image', e.target.value)}
                placeholder="https://... or upload below"
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] mb-2"
              />
              <ImageUpload
                value={form.cover_image}
                onChange={(url) => set('cover_image', url)}
                folder="blog"
                label="Or Upload Image File"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2A44] mb-1">
                Excerpt <span className="text-neutral-400 font-normal">(short summary for listings)</span>
              </label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                rows={2}
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1B2A44] mb-2">
                Article HTML / Rich Content
              </label>
              <RichTextEditor
                value={form.content}
                onChange={(html) => set('content', html)}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-[#1B2A44] cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set('published', e.target.checked)}
                className="accent-[#7E0D0D]"
              />
              <span className="font-medium">Published (visible on website)</span>
            </label>

            <div className="flex gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border border-[#F3DCDC] text-[#1B2A44] py-2.5 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 bg-[#7E0D0D] hover:bg-[#921E1F] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 shadow-xs"
              >
                {saving ? 'Saving…' : 'Save Post'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}
