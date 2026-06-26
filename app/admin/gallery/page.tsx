'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import Modal from '@/components/admin/Modal'
import ImageUpload from '@/components/admin/ImageUpload'
import { Plus, Trash2, Pencil } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const EMPTY = { image_url: '', caption: '', category: 'Campus', sort_order: 0 }
const CATS = ['Carousel', 'Campus', 'Classroom', 'Events', 'Results', 'Faculty', 'Other']

// Carousel slides store text as JSON in caption field
function parseCaption(category: string, caption: string) {
  if (category !== 'Carousel') return null
  try { return JSON.parse(caption) } catch { return { heading: caption, highlight: '', subtitle: '', headingSize: 'large', headingWeight: 'black' } }
}

function encodeCaption(data: any) {
  return JSON.stringify(data)
}

const SIZE_OPTS = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Extra Large', value: 'xlarge' },
]
const WEIGHT_OPTS = [
  { label: 'Light', value: 'light' },
  { label: 'Normal', value: 'normal' },
  { label: 'Semibold', value: 'semibold' },
  { label: 'Bold', value: 'bold' },
  { label: 'Black', value: 'black' },
]

export default function GalleryPage() {
  const supabase = createClient()
  const [images, setImages] = useState<any[]>([])
  const [modal, setModal]   = useState<'add' | 'edit' | null>(null)
  const [form, setForm]     = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)

  // Carousel text state
  const [carouselText, setCarouselText] = useState({
    heading: '', highlight: '', subtitle: '',
    headingSize: 'large', headingWeight: 'black',
    subtitleSize: 'small', subtitleWeight: 'light',
  })

  async function load() {
    const { data } = await supabase.from('cms_gallery').select('*').eq('site_id', SITE_ID).order('sort_order')
    setImages(data ?? [])
  }
  useEffect(() => { load() }, [])

  function open(img?: any) {
    if (img) {
      setForm({ ...img })
      const parsed = parseCaption(img.category, img.caption ?? '')
      if (parsed) setCarouselText({ heading: parsed.heading ?? '', highlight: parsed.highlight ?? '', subtitle: parsed.subtitle ?? '', headingSize: parsed.headingSize ?? 'large', headingWeight: parsed.headingWeight ?? 'black', subtitleSize: parsed.subtitleSize ?? 'small', subtitleWeight: parsed.subtitleWeight ?? 'light' })
      else setCarouselText({ heading: img.caption ?? '', highlight: '', subtitle: '', headingSize: 'large', headingWeight: 'black', subtitleSize: 'small', subtitleWeight: 'light' })
      setModal('edit')
    } else {
      setForm(EMPTY)
      setCarouselText({ heading: '', highlight: '', subtitle: '', headingSize: 'large', headingWeight: 'black', subtitleSize: 'small', subtitleWeight: 'light' })
      setModal('add')
    }
  }

  function set(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })) }
  function setCT(k: string, v: string) { setCarouselText(c => ({ ...c, [k]: v })) }

  async function save() {
    if (!form.image_url) return alert('Please add an image')
    setSaving(true)
    const caption = form.category === 'Carousel' ? encodeCaption(carouselText) : form.caption
    const payload = { ...form, caption, site_id: SITE_ID }
    if (modal === 'edit') await supabase.from('cms_gallery').update(payload).eq('id', form.id)
    else await supabase.from('cms_gallery').insert(payload)
    setSaving(false); setModal(null); load()
  }

  async function del(id: string) {
    if (!confirm('Remove image?')) return
    await supabase.from('cms_gallery').delete().eq('id', id); load()
  }

  const isCarousel = form.category === 'Carousel'

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Gallery</h2>
          <p className="text-xs text-[#C9C8CB]">{images.length} images</p>
        </div>
        <button onClick={() => open()} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl">
          <Plus size={16} /> Add Image
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden">
            <img src={img.image_url} alt={img.caption ?? ''} className="w-full h-40 object-cover" />
            <div className="p-3">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mb-1 inline-block ${img.category === 'Carousel' ? 'bg-brand-maroon/10 text-brand-maroon' : 'bg-[#FDF5F5] text-[#C9C8CB]'}`}>{img.category}</span>
              <p className="text-xs font-medium text-[#1B2A44] truncate">
                {img.category === 'Carousel'
                  ? (() => { try { return JSON.parse(img.caption)?.heading || 'Carousel Slide' } catch { return img.caption || 'Carousel Slide' } })()
                  : (img.caption || 'No caption')}
              </p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => open(img)} className="bg-white/90 backdrop-blur p-1.5 rounded-lg shadow"><Pencil size={13} className="text-[#1B2A44]" /></button>
              <button onClick={() => del(img.id)} className="bg-white/90 backdrop-blur p-1.5 rounded-lg shadow"><Trash2 size={13} className="text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && <p className="text-center text-[#C9C8CB] py-12 text-sm">No images yet.</p>}

      {modal && (
        <Modal title={modal === 'edit' ? 'Edit Image' : 'Add Image'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <ImageUpload value={form.image_url} onChange={(url) => set('image_url', url)} folder="gallery" label="Image *" />

            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]">
                {CATS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Carousel-specific text controls */}
            {isCarousel ? (
              <div className="space-y-4 bg-[#FDF5F5] border border-[#F3DCDC] rounded-xl p-4">
                <p className="text-xs font-bold text-[#7E0D0D] uppercase tracking-wider">Carousel Slide Text</p>

                <div>
                  <label className="block text-xs font-medium text-[#1B2A44] mb-1">Main Heading</label>
                  <input value={carouselText.heading} onChange={e => setCT('heading', e.target.value)}
                    placeholder="e.g. Where Excellence Meets"
                    className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="block text-[10px] text-[#C9C8CB] mb-1">Font Size</label>
                      <select value={carouselText.headingSize} onChange={e => setCT('headingSize', e.target.value)} className="w-full border border-[#F3DCDC] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#7E0D0D]">
                        {SIZE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#C9C8CB] mb-1">Font Weight</label>
                      <select value={carouselText.headingWeight} onChange={e => setCT('headingWeight', e.target.value)} className="w-full border border-[#F3DCDC] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#7E0D0D]">
                        {WEIGHT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1B2A44] mb-1">Highlighted Text <span className="text-[#C9C8CB] font-normal">(shown in pink/accent color)</span></label>
                  <input value={carouselText.highlight} onChange={e => setCT('highlight', e.target.value)}
                    placeholder="e.g. Personal Attention"
                    className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1B2A44] mb-1">Subtitle <span className="text-[#C9C8CB] font-normal">(smaller text below heading)</span></label>
                  <textarea value={carouselText.subtitle} onChange={e => setCT('subtitle', e.target.value)}
                    placeholder="e.g. Experience classroom learning at its best..."
                    rows={2}
                    className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none" />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="block text-[10px] text-[#C9C8CB] mb-1">Font Size</label>
                      <select value={carouselText.subtitleSize} onChange={e => setCT('subtitleSize', e.target.value)} className="w-full border border-[#F3DCDC] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#7E0D0D]">
                        {SIZE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#C9C8CB] mb-1">Font Weight</label>
                      <select value={carouselText.subtitleWeight} onChange={e => setCT('subtitleWeight', e.target.value)} className="w-full border border-[#F3DCDC] rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#7E0D0D]">
                        {WEIGHT_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Live preview */}
                <div className="bg-[#1B2A44] rounded-xl p-4 mt-2">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Preview</p>
                  <p className={`text-white leading-tight ${
                    carouselText.headingSize === 'small' ? 'text-base' :
                    carouselText.headingSize === 'medium' ? 'text-xl' :
                    carouselText.headingSize === 'large' ? 'text-2xl' : 'text-3xl'
                  } font-${carouselText.headingWeight}`}>
                    {carouselText.heading || 'Main Heading'}{' '}
                    <span className="text-[#F3DCDC]">{carouselText.highlight}</span>
                  </p>
                  {carouselText.subtitle && (
                    <p className={`text-white/70 mt-2 ${
                      carouselText.subtitleSize === 'small' ? 'text-xs' :
                      carouselText.subtitleSize === 'medium' ? 'text-sm' :
                      carouselText.subtitleSize === 'large' ? 'text-base' : 'text-lg'
                    } font-${carouselText.subtitleWeight}`}>
                      {carouselText.subtitle}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-[#1B2A44] mb-1">Caption</label>
                <input value={form.caption} onChange={(e) => set('caption', e.target.value)} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Sort Order {isCarousel && <span className="text-[#C9C8CB] font-normal">(controls slide sequence)</span>}</label>
              <input type="number" value={form.sort_order} onChange={(e) => set('sort_order', Number(e.target.value))} className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]" />
            </div>

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
