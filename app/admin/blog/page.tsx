'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import ImageUpload from '@/components/admin/ImageUpload'
import RichTextEditor from '@/components/admin/RichTextEditor'
import { Plus, Pencil, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const CATEGORIES = ['JEE', 'NEET', 'IGCSE', 'IB', 'CBSE', 'Olympiad', 'General']
const EMPTY = {
  title: '', slug: '', excerpt: '', content: '', category: 'General',
  cover_image: '', read_time: '5 min read', author: 'Hodu Academic Team', published: true,
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function BlogAdminPage() {
  const supabase = createClient()
  const [posts, setPosts]   = useState<any[]>([])
  const [modal, setModal]   = useState<'add' | 'edit' | null>(null)
  const [form, setForm]     = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('cms_blogs').select('*').eq('site_id', SITE_ID).order('created_at', { ascending: false })
    setPosts(data ?? [])
  }
  useEffect(() => { load() }, [])

  function open(p?: any) {
    setForm(p ? { ...p } : EMPTY)
    setModal(p ? 'edit' : 'add')
  }

  function set(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })) }

  async function save() {
    if (!form.title.trim()) return alert('Title is required')
    setSaving(true)
    const payload = {
      ...form,
      site_id: SITE_ID,
      slug: form.slug || slugify(form.title),
    }
    if (modal === 'edit') await supabase.from('cms_blogs').update(payload).eq('id', form.id)
    else await supabase.from('cms_blogs').insert(payload)
    setSaving(false); setModal(null); load()
  }

  async function del(id: string) {
    if (!confirm('Delete this post?')) return
    await supabase.from('cms_blogs').delete().eq('id', id); load()
  }

  async function togglePublished(post: any) {
    await supabase.from('cms_blogs').update({ published: !post.published }).eq('id', post.id)
    load()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Blog</h2>
          <p className="text-xs text-[#C9C8CB]">{posts.length} posts</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl">
          <Plus size={16} /> Write New Post
        </button>
      </div>

      <div className="bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F3DCDC] bg-[#FDF5F5]">
              {['Title', 'Category', 'Status', 'Link', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#C9C8CB] uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-b border-[#F3DCDC] last:border-0 hover:bg-[#FDF5F5]">
                <td className="px-4 py-3 font-medium text-[#1B2A44] max-w-xs truncate">{p.title}</td>
                <td className="px-4 py-3"><span className="bg-[#FDF5F5] text-[#7E0D0D] text-xs px-2 py-0.5 rounded-full font-medium">{p.category}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => togglePublished(p)} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${p.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.published ? <Eye size={11} /> : <EyeOff size={11} />}
                    {p.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" className="text-[#7E0D0D] hover:underline text-xs flex items-center gap-1"><ExternalLink size={11} />View</a>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => open(p)} className="text-xs px-3 py-1 border border-[#F3DCDC] rounded-lg text-[#1B2A44] hover:bg-[#FDF5F5] flex items-center gap-1"><Pencil size={11} />Edit</button>
                    <button onClick={() => del(p.id)} className="text-xs px-3 py-1 border border-red-100 rounded-lg text-red-500 hover:bg-red-50 flex items-center gap-1"><Trash2 size={11} />Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <p className="text-center text-[#C9C8CB] py-12 text-sm">No blog posts yet. Click "Write New Post" to get started.</p>}
      </div>

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Post' : 'Write New Post'} onClose={() => setModal(null)} wide>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Title *</label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Slug <span className="text-[#C9C8CB] font-normal">(auto-generated if blank)</span></label>
              <input
                value={form.slug}
                onChange={(e) => set('slug', slugify(e.target.value))}
                placeholder={form.title ? slugify(form.title) : 'my-blog-post'}
                className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Category</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Read Time</label>
                <input value={form.read_time} onChange={(e) => set('read_time', e.target.value)} placeholder="5 min read" className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
              </div>
            </div>

            <ImageUpload value={form.cover_image} onChange={(url) => set('cover_image', url)} folder="blog" label="Cover Image" />

            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Excerpt <span className="text-[#C9C8CB] font-normal">(shown in blog listing)</span></label>
              <textarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={2} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-2">Content</label>
              <RichTextEditor value={form.content} onChange={(html) => set('content', html)} />
            </div>

            <label className="flex items-center gap-2 text-sm text-[#1B2A44]">
              <input type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} className="accent-[#7E0D0D]" />
              Published (visible on website)
            </label>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-[#F3DCDC] text-[#1B2A44] py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-[#7E0D0D] text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  )
}
