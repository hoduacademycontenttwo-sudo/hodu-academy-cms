'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import ImageUpload from '@/components/admin/ImageUpload'
import InlineRichTextEditor from '@/components/admin/InlineRichTextEditor'
import { Save, Plus, Trash2, GripVertical } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'

// Strip a single wrapping <p>...</p> so heading/subtitle HTML stays inline-friendly
function unwrapParagraph(html: string) {
  const m = html.trim().match(/^<p>([\s\S]*)<\/p>$/)
  return m ? m[1] : html
}

export default function HomeContentPage() {
  const supabase = createClient()
  const [form, setForm]     = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  const [slides, setSlides]   = useState<any[]>([])
  const [slidesLoading, setSlidesLoading] = useState(true)

  useEffect(() => {
    supabase.from('cms_home_sections').select('*').eq('site_id', SITE_ID).single()
      .then(({ data }) => {
        const defaultStats = [
          { label: 'Students Enrolled', value: '50,000+' },
          { label: 'Top Rankers', value: '1,200+' },
          { label: 'Years of Excellence', value: '15+' },
        ]
        const defaults = {
          site_id: SITE_ID, hero_title: '', hero_subtitle: '', hero_image_url: '',
          cta_text: 'Book Free Demo Class', cta_link: '/demo/contact',
          stats_json: defaultStats,
        }
        const row = data ?? defaults
        let statsJson = row.stats_json
        if (Array.isArray(statsJson)) {
          statsJson = statsJson.map((item: any) =>
            item && typeof item === 'object'
              ? { label: String(item.label ?? ''), value: String(item.value ?? '') }
              : { label: '', value: String(item ?? '') }
          )
        } else if (statsJson && typeof statsJson === 'object') {
          statsJson = Object.entries(statsJson).map(([k, v]) => ({
            label: k,
            value: v && typeof v === 'object' ? String((v as any).value ?? '') : String(v ?? ''),
          }))
        } else {
          statsJson = defaultStats
        }
        setForm({ ...row, stats_json: statsJson })
      })
    loadSlides()
  }, [])

  async function loadSlides() {
    setSlidesLoading(true)
    const { data } = await supabase
      .from('cms_gallery')
      .select('*')
      .eq('site_id', SITE_ID)
      .eq('category', 'Home Carousel')
      .order('sort_order')
    setSlides((data ?? []).map(row => {
      let text: any = {}
      try { text = JSON.parse(row.caption ?? '{}') } catch {}
      return { ...row, headingHtml: text.headingHtml ?? '', subtitleHtml: text.subtitleHtml ?? '' }
    }))
    setSlidesLoading(false)
  }

  function set(k: string, v: any) { setForm((f: any) => ({ ...f, [k]: v })) }

  function setStat(index: number, field: 'label' | 'value', val: string) {
    const stats = [...(form.stats_json ?? [])]
    stats[index] = { ...stats[index], [field]: val }
    set('stats_json', stats)
  }

  function addStat() {
    const stats = [...(form.stats_json ?? []), { label: 'New Stat', value: '0' }]
    set('stats_json', stats)
  }

  function removeStat(index: number) {
    const stats = [...(form.stats_json ?? [])]
    stats.splice(index, 1)
    set('stats_json', stats)
  }

  async function save() {
    setSaving(true)
    const { id, hero_title, hero_subtitle, ...rest } = form
    const payload = {
      ...rest,
      hero_title: unwrapParagraph(hero_title ?? ''),
      hero_subtitle: unwrapParagraph(hero_subtitle ?? ''),
    }
    if (id) {
      await supabase.from('cms_home_sections').update(payload).eq('id', id)
    } else {
      await supabase.from('cms_home_sections').insert(payload)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // --- Banner slides (cms_gallery, category = Home Carousel) ---

  function updateSlideLocal(id: string, patch: any) {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  async function saveSlide(slide: any) {
    const caption = JSON.stringify({
      headingHtml: unwrapParagraph(slide.headingHtml ?? ''),
      subtitleHtml: unwrapParagraph(slide.subtitleHtml ?? ''),
    })
    await supabase.from('cms_gallery').update({ image_url: slide.image_url, caption }).eq('id', slide.id)
  }

  async function addSlide() {
    const nextOrder = slides.length > 0 ? Math.max(...slides.map(s => s.sort_order ?? 0)) + 1 : 0
    const { data } = await supabase.from('cms_gallery').insert({
      site_id: SITE_ID,
      category: 'Home Carousel',
      image_url: '',
      caption: JSON.stringify({ headingHtml: '', subtitleHtml: '' }),
      sort_order: nextOrder,
    }).select().single()
    if (data) setSlides(prev => [...prev, { ...data, headingHtml: '', subtitleHtml: '' }])
  }

  async function deleteSlide(id: string) {
    if (!confirm('Delete this banner slide?')) return
    await supabase.from('cms_gallery').delete().eq('id', id)
    setSlides(prev => prev.filter(s => s.id !== id))
  }

  if (!form) return <AdminLayout><p className="text-[#C9C8CB] text-sm">Loading…</p></AdminLayout>

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Home Page Content</h2>
          <p className="text-xs text-[#C9C8CB]">Edit hero fallback, banner slides and stats</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-60">
          <Save size={15} /> {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-[#1B2A44]">Fallback Hero</h3>
            <p className="text-xs text-[#C9C8CB] mt-0.5">Shown only when there are no Banner Slides below. Select any text and use the toolbar for bold, italic or color.</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Hero Title *</label>
            <InlineRichTextEditor value={form.hero_title} onChange={v => set('hero_title', v)} placeholder="Your Dream Rank Starts Here" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Hero Subtitle</label>
            <InlineRichTextEditor value={form.hero_subtitle} onChange={v => set('hero_subtitle', v)} placeholder="A short supporting line…" multiline />
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

        {/* Banner Slides manager */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#1B2A44]">Homepage Banner Slides</h3>
              <p className="text-xs text-[#C9C8CB] mt-0.5">{slides.length} slide{slides.length === 1 ? '' : 's'} · these replace the Fallback Hero above when at least one exists</p>
            </div>
            <button onClick={addSlide} className="flex items-center gap-1.5 text-xs text-[#7E0D0D] hover:underline font-medium shrink-0">
              <Plus size={13} /> Add Slide
            </button>
          </div>

          {slidesLoading ? (
            <p className="text-xs text-[#C9C8CB]">Loading slides…</p>
          ) : slides.length === 0 ? (
            <p className="text-xs text-[#C9C8CB] py-4 text-center border border-dashed border-[#F3DCDC] rounded-xl">No banner slides yet — the Fallback Hero above is shown on the homepage.</p>
          ) : (
            <div className="space-y-5">
              {slides.map((slide, i) => (
                <div key={slide.id} className="border border-[#F3DCDC] rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#C9C8CB] uppercase tracking-wider">
                      <GripVertical size={13} /> Slide {i + 1}
                    </span>
                    <button onClick={() => deleteSlide(slide.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <ImageUpload value={slide.image_url ?? ''} onChange={url => updateSlideLocal(slide.id, { image_url: url })} folder="home-carousel" label="Slide Image" />

                  <div>
                    <label className="block text-xs font-medium text-[#1B2A44] mb-1">Heading</label>
                    <InlineRichTextEditor value={slide.headingHtml} onChange={v => updateSlideLocal(slide.id, { headingHtml: v })} placeholder="e.g. Everything You Need To Ace Your Exam" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#1B2A44] mb-1">Subtitle</label>
                    <InlineRichTextEditor value={slide.subtitleHtml} onChange={v => updateSlideLocal(slide.id, { subtitleHtml: v })} placeholder="Short supporting line…" multiline />
                  </div>

                  <button onClick={() => saveSlide(slide)} className="bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs font-semibold px-4 py-2 rounded-lg">
                    Save Slide {i + 1}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1B2A44]">Stats</h3>
            <button onClick={addStat} className="text-xs text-[#7E0D0D] hover:underline font-medium">+ Add Stat</button>
          </div>
          {(form.stats_json ?? []).map((stat: { label: string; value: string }, index: number) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="block text-xs text-[#C9C8CB] mb-1">Label</label>
                <input
                  value={stat.label}
                  onChange={(e) => setStat(index, 'label', e.target.value)}
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-[#C9C8CB] mb-1">Value</label>
                <input
                  value={stat.value}
                  onChange={(e) => setStat(index, 'value', e.target.value)}
                  className="w-full border border-[#F3DCDC] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                />
              </div>
              <button onClick={() => removeStat(index)} className="text-red-400 hover:text-red-600 mt-6 text-xs">✕</button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
