'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import ImageUpload from '@/components/admin/ImageUpload'
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Video,
  Image as ImageIcon,
  Building2,
  HelpCircle,
  ExternalLink,
  Phone,
  Layers,
  BarChart3,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
import { parseMediaUrl } from '@/lib/homeCarousel'
import { HODU } from '@/lib/hodu'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const CAROUSEL_CATEGORY = 'Jaipur Campus Carousel'
const CAMPUS_INFO_CATEGORY = 'Jaipur Campus Video'

const DEFAULT_VIDEO_URL = 'https://drive.google.com/file/d/1_9DnITQYv8vS97GrxYzsRf3q7uBiAETq/view?usp=sharing'

const defaultCampusSlides = [
  {
    image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=700&fit=crop&auto=format',
    mediaType: 'image',
    videoUrl: '',
    sort_order: 0,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&h=700&fit=crop&auto=format',
    mediaType: 'image',
    videoUrl: '',
    sort_order: 1,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=700&fit=crop&auto=format',
    mediaType: 'image',
    videoUrl: '',
    sort_order: 2,
  },
  {
    image_url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&h=700&fit=crop&auto=format',
    mediaType: 'image',
    videoUrl: '',
    sort_order: 3,
  },
]

export default function JaipurCampusAdminPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'all' | 'slides' | 'overview' | 'pillars' | 'contact'>('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [recordId, setRecordId] = useState<string | null>(null)

  // Slides State
  const [slides, setSlides] = useState<any[]>([])
  const [slidesLoading, setSlidesLoading] = useState(true)

  // Campus Info Form
  const [form, setForm] = useState({
    mediaType: 'video' as 'video' | 'image',
    videoUrl: DEFAULT_VIDEO_URL,
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=600&fit=crop&auto=format',
    heroBadge: 'JAIPUR CAMPUS',
    heroTitle: 'An Offline Campus Built for Deep Academic Focus',
    heroSubtitle: 'Air-conditioned smart classrooms, dedicated 1-on-1 faculty doubt cells, silent study library, and intimate cohorts capped at 12 students.',
    address: HODU.address,
    phone: HODU.phone,
    pillar1Value: '1 : 12',
    pillar1Label: 'Cohort Limit',
    pillar2Value: '8 AM – 9 PM',
    pillar2Label: 'Library & Doubts',
    pillar3Value: '100% AC',
    pillar3Label: 'GPS Transport',
  })

  useEffect(() => {
    loadCampusInfo()
    loadSlides()
  }, [])

  async function loadCampusInfo() {
    setLoading(true)
    const { data } = await supabase
      .from('cms_gallery')
      .select('*')
      .eq('site_id', SITE_ID)
      .eq('category', CAMPUS_INFO_CATEGORY)
      .limit(1)
      .maybeSingle()

    if (data) {
      setRecordId(data.id)
      try {
        const parsed = JSON.parse(data.caption ?? '{}')
        const media = parseMediaUrl(data.image_url ?? '')
        setForm(prev => ({
          ...prev,
          mediaType: parsed.mediaType ?? (media.type !== 'image' ? 'video' : 'image'),
          videoUrl: parsed.videoUrl ?? (media.type !== 'video' && media.type !== 'google_drive' && media.type !== 'youtube' ? DEFAULT_VIDEO_URL : data.image_url),
          imageUrl: parsed.imageUrl ?? data.image_url ?? prev.imageUrl,
          heroBadge: parsed.heroBadge ?? prev.heroBadge,
          heroTitle: parsed.heroTitle ?? prev.heroTitle,
          heroSubtitle: parsed.heroSubtitle ?? prev.heroSubtitle,
          address: parsed.address ?? prev.address,
          phone: parsed.phone ?? prev.phone,
          pillar1Value: parsed.pillar1Value ?? prev.pillar1Value,
          pillar1Label: parsed.pillar1Label ?? prev.pillar1Label,
          pillar2Value: parsed.pillar2Value ?? prev.pillar2Value,
          pillar2Label: parsed.pillar2Label ?? prev.pillar2Label,
          pillar3Value: parsed.pillar3Value ?? prev.pillar3Value,
          pillar3Label: parsed.pillar3Label ?? prev.pillar3Label,
        }))
      } catch {
        if (data.image_url) {
          setForm(prev => ({ ...prev, videoUrl: data.image_url }))
        }
      }
    }
    setLoading(false)
  }

  async function loadSlides() {
    setSlidesLoading(true)
    const { data } = await supabase
      .from('cms_gallery')
      .select('*')
      .eq('site_id', SITE_ID)
      .eq('category', CAROUSEL_CATEGORY)
      .order('sort_order')

    if (data && data.length > 0) {
      setSlides(data.map(row => {
        let parsed: any = {}
        try { parsed = JSON.parse(row.caption ?? '{}') } catch {}
        const mediaInfo = parseMediaUrl(row.image_url ?? '')
        const mediaType = parsed.mediaType ?? (mediaInfo.type !== 'image' ? 'video' : 'image')
        const videoUrl = parsed.videoUrl ?? (mediaType === 'video' ? row.image_url : '')
        return {
          ...row,
          mediaType,
          videoUrl,
          headingHtml: parsed.headingHtml ?? '',
          subtitleHtml: parsed.subtitleHtml ?? '',
          imageOpacity: parsed.imageOpacity ?? 100,
        }
      }))
    } else {
      // Initialize with default slides if empty
      setSlides(defaultCampusSlides.map((s, idx) => ({
        id: `init-${idx}`,
        image_url: s.image_url,
        mediaType: s.mediaType,
        videoUrl: s.videoUrl,
        sort_order: s.sort_order,
      })))
    }
    setSlidesLoading(false)
  }

  function set(k: string, v: any) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  function updateSlideLocal(id: string, patch: any) {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  async function saveSlide(slide: any) {
    const isVideo = slide.mediaType === 'video'
    const finalUrl = isVideo ? (slide.videoUrl || slide.image_url) : slide.image_url
    const caption = JSON.stringify({
      mediaType: slide.mediaType ?? 'image',
      videoUrl: slide.videoUrl ?? '',
      headingHtml: slide.headingHtml ?? '',
      subtitleHtml: slide.subtitleHtml ?? '',
      imageOpacity: slide.imageOpacity ?? 100,
    })

    if (slide.id && !String(slide.id).startsWith('init-')) {
      await supabase
        .from('cms_gallery')
        .update({ image_url: finalUrl, caption, sort_order: slide.sort_order ?? 0 })
        .eq('id', slide.id)
    } else {
      const { data } = await supabase
        .from('cms_gallery')
        .insert({
          site_id: SITE_ID,
          category: CAROUSEL_CATEGORY,
          image_url: finalUrl,
          caption,
          sort_order: slide.sort_order ?? 0,
        })
        .select()
        .single()
      if (data) {
        setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, id: data.id } : s))
      }
    }
    alert(`Jaipur Campus Slide saved successfully!`)
  }

  async function addSlide() {
    const nextOrder = slides.length > 0 ? Math.max(...slides.map(s => s.sort_order ?? 0)) + 1 : 0
    const newSlide = {
      mediaType: 'image',
      image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=700&fit=crop&auto=format',
      videoUrl: '',
      sort_order: nextOrder,
    }

    const { data } = await supabase
      .from('cms_gallery')
      .insert({
        site_id: SITE_ID,
        category: CAROUSEL_CATEGORY,
        image_url: newSlide.image_url,
        caption: JSON.stringify({ mediaType: 'image', videoUrl: '', headingHtml: '', subtitleHtml: '', imageOpacity: 100 }),
        sort_order: nextOrder,
      })
      .select()
      .single()

    if (data) {
      setSlides(prev => [...prev, { ...data, mediaType: 'image', videoUrl: '' }])
    } else {
      setSlides(prev => [...prev, { ...newSlide, id: `temp-${Date.now()}` }])
    }
  }

  async function deleteSlide(id: string) {
    if (!confirm('Delete this Jaipur Campus slide?')) return
    if (!String(id).startsWith('init-')) {
      await supabase.from('cms_gallery').delete().eq('id', id)
    }
    setSlides(prev => prev.filter(s => s.id !== id))
  }

  async function moveSlide(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= slides.length) return
    const updated = [...slides]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setSlides(updated)

    await Promise.all(
      updated.map((s, idx) => {
        if (!String(s.id).startsWith('init-')) {
          return supabase.from('cms_gallery').update({ sort_order: idx }).eq('id', s.id)
        }
        return Promise.resolve()
      })
    )
  }

  async function saveAll() {
    setSaving(true)
    const isVideo = form.mediaType === 'video'
    const finalMediaUrl = isVideo ? form.videoUrl : form.imageUrl

    const captionJson = JSON.stringify({
      mediaType: form.mediaType,
      videoUrl: form.videoUrl,
      imageUrl: form.imageUrl,
      heroBadge: form.heroBadge,
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      address: form.address,
      phone: form.phone,
      pillar1Value: form.pillar1Value,
      pillar1Label: form.pillar1Label,
      pillar2Value: form.pillar2Value,
      pillar2Label: form.pillar2Label,
      pillar3Value: form.pillar3Value,
      pillar3Label: form.pillar3Label,
    })

    if (recordId) {
      await supabase
        .from('cms_gallery')
        .update({
          image_url: finalMediaUrl,
          caption: captionJson,
        })
        .eq('id', recordId)
    } else {
      const { data } = await supabase
        .from('cms_gallery')
        .insert({
          site_id: SITE_ID,
          category: CAMPUS_INFO_CATEGORY,
          image_url: finalMediaUrl,
          caption: captionJson,
          sort_order: 0,
        })
        .select()
        .single()

      if (data) setRecordId(data.id)
    }

    // Save any pending slides
    await Promise.all(
      slides.map(async (slide, idx) => {
        const isVid = slide.mediaType === 'video'
        const fUrl = isVid ? (slide.videoUrl || slide.image_url) : slide.image_url
        const cap = JSON.stringify({
          mediaType: slide.mediaType ?? 'image',
          videoUrl: slide.videoUrl ?? '',
          headingHtml: slide.headingHtml ?? '',
          subtitleHtml: slide.subtitleHtml ?? '',
          imageOpacity: slide.imageOpacity ?? 100,
        })

        if (String(slide.id).startsWith('init-')) {
          await supabase.from('cms_gallery').insert({
            site_id: SITE_ID,
            category: CAROUSEL_CATEGORY,
            image_url: fUrl,
            caption: cap,
            sort_order: idx,
          })
        }
      })
    )

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    loadSlides()
  }

  const mediaPreview = parseMediaUrl(form.videoUrl || '')

  return (
    <AdminLayout>
      {/* ─── Top Sticky Header ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="text-[#7E0D0D] h-5 w-5" />
            <h2 className="text-xl font-bold text-[#1B2A44]">Jaipur Campus Management Hub</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage Jaipur Campus banner slides carousel, Google Drive video tours, trust metrics, and offline details.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/offline"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 border border-[#F3DCDC] bg-white hover:bg-neutral-50 text-[#1B2A44] text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-2xs"
          >
            <ExternalLink size={13} />
            <span>View Jaipur Campus Page</span>
          </a>
          <button
            onClick={saveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs font-bold px-4 py-2.5 rounded-xl disabled:opacity-60 shadow-xs cursor-pointer transition-all"
          >
            <Save size={15} /> {saving ? 'Saving…' : saved ? 'Saved Successfully!' : 'Save Campus Changes'}
          </button>
        </div>
      </div>

      {/* ─── Filter Pills ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none no-scrollbar">
        {[
          { id: 'all', label: '🌟 All Sections' },
          { id: 'slides', label: '🖼️ Campus Banner Slides (Carousel)' },
          { id: 'overview', label: '🏛️ Overview & Video Tour' },
          { id: 'pillars', label: '📊 Trust Pillars & Stats' },
          { id: 'contact', label: '📍 Address & Contact' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? 'bg-[#7E0D0D] text-white shadow-md'
                : 'bg-white text-neutral-600 hover:text-[#7E0D0D] hover:bg-brand-blush border border-neutral-200 shadow-2xs'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        
        {/* ─── 1. JAIPUR CAMPUS BANNER SLIDES (CAROUSEL GRID) ─── */}
        {(activeTab === 'all' || activeTab === 'slides') && (
          <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="text-[#7E0D0D] h-5 w-5" />
                  <h3 className="font-bold text-[#1B2A44] text-base">Jaipur Campus Banner Slides (Carousel)</h3>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {slides.length} Slide{slides.length === 1 ? '' : 's'} · Supports Images & Google Drive Videos in a responsive 2-column grid
                </p>
              </div>
              <button
                onClick={addSlide}
                className="flex items-center gap-1.5 text-xs bg-[#7E0D0D] hover:bg-[#922222] text-white font-bold px-3.5 py-2 rounded-xl transition-all shrink-0 shadow-xs cursor-pointer"
              >
                <Plus size={14} /> Add Slide
              </button>
            </div>

            {slidesLoading ? (
              <p className="text-xs text-neutral-500">Loading campus slides…</p>
            ) : slides.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-neutral-300 rounded-2xl space-y-2">
                <p className="text-xs text-neutral-500">No custom banner slides yet for Jaipur Campus.</p>
                <button onClick={addSlide} className="text-xs font-bold text-[#7E0D0D] hover:underline">+ Add First Slide</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {slides.map((slide, i) => {
                  const isVideo = slide.mediaType === 'video'
                  const mediaPreview = parseMediaUrl(slide.videoUrl || slide.image_url || '')

                  return (
                    <div
                      key={slide.id || i}
                      className="border border-[#F3DCDC] rounded-2xl p-4 space-y-3 bg-neutral-50/50 hover:bg-white transition-all shadow-2xs flex flex-col justify-between"
                    >
                      {/* Top bar with reorder & delete */}
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#1B2A44] uppercase">
                            SLIDE {i + 1}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                              isVideo
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-300'
                            }`}
                          >
                            {isVideo ? <Video size={10} /> : <ImageIcon size={10} />}
                            <span>{isVideo ? 'Video' : 'Image'}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveSlide(i, i - 1)}
                            disabled={i === 0}
                            className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSlide(i, i + 1)}
                            disabled={i === slides.length - 1}
                            className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSlide(slide.id)}
                            className="p-1 rounded-md border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer"
                            title="Delete Slide"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      {/* Media Toggle */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateSlideLocal(slide.id, { mediaType: 'image' })}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            !isVideo
                              ? 'bg-[#7E0D0D] text-white border-[#7E0D0D]'
                              : 'bg-white text-neutral-600 border-neutral-200'
                          }`}
                        >
                          Image Slide
                        </button>
                        <button
                          type="button"
                          onClick={() => updateSlideLocal(slide.id, { mediaType: 'video' })}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                            isVideo
                              ? 'bg-[#7E0D0D] text-white border-[#7E0D0D]'
                              : 'bg-white text-neutral-600 border-neutral-200'
                          }`}
                        >
                          Video / Drive
                        </button>
                      </div>

                      {/* Media Input */}
                      {isVideo ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={slide.videoUrl ?? slide.image_url ?? ''}
                            onChange={e => updateSlideLocal(slide.id, { videoUrl: e.target.value, image_url: e.target.value })}
                            placeholder="Paste Google Drive video link (or YouTube / MP4)..."
                            className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white text-[#1B2A44]"
                          />
                          {slide.videoUrl && (
                            <p className="text-[11px] text-neutral-500 font-mono break-all line-clamp-1">
                              Preview: {slide.videoUrl}
                            </p>
                          )}
                        </div>
                      ) : (
                        <ImageUpload
                          value={slide.image_url ?? ''}
                          onChange={url => updateSlideLocal(slide.id, { image_url: url })}
                          folder="campus-carousel"
                          label="Slide Cover Image"
                        />
                      )}

                      {/* Save Button */}
                      <div className="pt-2">
                        <button
                          onClick={() => saveSlide(slide)}
                          className="w-full bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Save size={13} />
                          <span>Save Slide {i + 1}</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── 2. CAMPUS OVERVIEW & VIDEO TOUR ─── */}
        {(activeTab === 'all' || activeTab === 'overview') && (
          <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-[#1B2A44] text-base">Campus Overview & Feature Video</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Hero headlines and 1-on-1 campus video preview</p>
              </div>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                form.mediaType === 'video' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
              }`}>
                {form.mediaType === 'video' ? <Video size={13} /> : <ImageIcon size={13} />}
                <span>{form.mediaType === 'video' ? 'Video Active' : 'Image Active'}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1B2A44] mb-1">Hero Pill Badge</label>
                <input
                  type="text"
                  value={form.heroBadge}
                  onChange={e => set('heroBadge', e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white text-[#1B2A44]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B2A44] mb-1">Campus Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white text-[#1B2A44]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#1B2A44] mb-1">Hero Headline</label>
                <input
                  type="text"
                  value={form.heroTitle}
                  onChange={e => set('heroTitle', e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs font-bold bg-white text-[#1B2A44]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-[#1B2A44] mb-1">Hero Subtitle</label>
                <textarea
                  rows={2}
                  value={form.heroSubtitle}
                  onChange={e => set('heroSubtitle', e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white text-[#1B2A44]"
                />
              </div>
            </div>

            {/* Video Tour Link */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="block text-xs font-bold text-[#1B2A44]">
                Campus Feature Video (Google Drive / YouTube)
              </label>
              <input
                type="text"
                value={form.videoUrl}
                onChange={e => set('videoUrl', e.target.value)}
                placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white text-[#1B2A44]"
              />
            </div>
          </div>
        )}

        {/* ─── 3. TRUST PILLARS & STATS ─── */}
        {(activeTab === 'all' || activeTab === 'pillars') && (
          <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-[#1B2A44] text-base">Campus Trust Pillars (3 Key Metrics)</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Displayed prominently below the campus hero</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-2">
                <label className="block text-xs font-bold text-[#1B2A44]">Pillar 1</label>
                <input
                  type="text"
                  value={form.pillar1Value}
                  onChange={e => set('pillar1Value', e.target.value)}
                  placeholder="e.g. 1 : 12"
                  className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white"
                />
                <input
                  type="text"
                  value={form.pillar1Label}
                  onChange={e => set('pillar1Label', e.target.value)}
                  placeholder="e.g. Cohort Limit"
                  className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                />
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-2">
                <label className="block text-xs font-bold text-[#1B2A44]">Pillar 2</label>
                <input
                  type="text"
                  value={form.pillar2Value}
                  onChange={e => set('pillar2Value', e.target.value)}
                  placeholder="e.g. 8 AM – 9 PM"
                  className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white"
                />
                <input
                  type="text"
                  value={form.pillar2Label}
                  onChange={e => set('pillar2Label', e.target.value)}
                  placeholder="e.g. Library & Doubts"
                  className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                />
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-2">
                <label className="block text-xs font-bold text-[#1B2A44]">Pillar 3</label>
                <input
                  type="text"
                  value={form.pillar3Value}
                  onChange={e => set('pillar3Value', e.target.value)}
                  placeholder="e.g. 100% AC"
                  className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white"
                />
                <input
                  type="text"
                  value={form.pillar3Label}
                  onChange={e => set('pillar3Label', e.target.value)}
                  placeholder="e.g. GPS Transport"
                  className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── 4. ADDRESS & LOCATION ─── */}
        {(activeTab === 'all' || activeTab === 'contact') && (
          <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-[#1B2A44] text-base">Campus Physical Address</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Shown across the Jaipur Campus page and visit booking section</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B2A44] mb-1">Campus Full Address</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={e => set('address', e.target.value)}
                className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white text-[#1B2A44]"
              />
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}
