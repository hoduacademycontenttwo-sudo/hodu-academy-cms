'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import ImageUpload from '@/components/admin/ImageUpload'
import InlineRichTextEditor from '@/components/admin/InlineRichTextEditor'
import { Save, Video, Image as ImageIcon, Building2, HelpCircle, ExternalLink } from 'lucide-react'
import { parseMediaUrl } from '@/lib/homeCarousel'
import { HODU } from '@/lib/hodu'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const CATEGORY = 'Jaipur Campus Video'

const DEFAULT_VIDEO_URL = 'https://drive.google.com/file/d/1_9DnITQYv8vS97GrxYzsRf3q7uBiAETq/view?usp=sharing'

export default function JaipurCampusAdminPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [recordId, setRecordId] = useState<string | null>(null)

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
    async function loadData() {
      setLoading(true)
      const { data } = await supabase
        .from('cms_gallery')
        .select('*')
        .eq('site_id', SITE_ID)
        .eq('category', CATEGORY)
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
    loadData()
  }, [])

  function set(k: string, v: any) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function save() {
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
          category: CATEGORY,
          image_url: finalMediaUrl,
          caption: captionJson,
          sort_order: 0,
        })
        .select()
        .single()

      if (data) setRecordId(data.id)
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const mediaPreview = parseMediaUrl(form.videoUrl || '')

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-[#C9C8CB] text-sm">Loading Jaipur Campus settings…</p>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="text-[#7E0D0D] h-5 w-5" />
            <h2 className="text-lg font-bold text-[#1B2A44]">Jaipur Campus (Offline Page)</h2>
          </div>
          <p className="text-xs text-[#C9C8CB] mt-0.5">Manage Google Drive video tour, hero text, and campus features</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/offline"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 border border-[#F3DCDC] bg-white hover:bg-neutral-50 text-[#1B2A44] text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-2xs"
          >
            <ExternalLink size={13} />
            <span>View Jaipur Page</span>
          </a>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-60 shadow-xs"
          >
            <Save size={15} /> {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Hero Video / Banner Media Card */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#F3DCDC] pb-3">
            <div>
              <h3 className="font-bold text-[#1B2A44] text-base">Campus Video Tour & Banner</h3>
              <p className="text-xs text-[#C9C8CB] mt-0.5">This video or image is featured prominently in the Jaipur Campus hero section</p>
            </div>
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
              form.mediaType === 'video' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
            }`}>
              {form.mediaType === 'video' ? <Video size={13} /> : <ImageIcon size={13} />}
              <span>{form.mediaType === 'video' ? 'Video Active' : 'Image Active'}</span>
            </span>
          </div>

          {/* Media Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-[#1B2A44] mb-2">Select Media Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => set('mediaType', 'video')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                  form.mediaType === 'video'
                    ? 'bg-[#7E0D0D] text-white border-[#7E0D0D] shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <Video size={16} />
                <span>Google Drive / YouTube Video</span>
              </button>

              <button
                type="button"
                onClick={() => set('mediaType', 'image')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
                  form.mediaType === 'image'
                    ? 'bg-[#7E0D0D] text-white border-[#7E0D0D] shadow-xs'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                <ImageIcon size={16} />
                <span>Static Image Banner</span>
              </button>
            </div>
          </div>

          {form.mediaType === 'video' ? (
            <div className="space-y-4 bg-neutral-50 border border-neutral-200 rounded-xl p-4">
              <div>
                <label className="block text-xs font-bold text-[#1B2A44] mb-1.5">
                  Google Drive / Video URL *
                </label>
                <input
                  type="text"
                  value={form.videoUrl}
                  onChange={e => set('videoUrl', e.target.value)}
                  placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#7E0D0D] bg-white text-[#1B2A44]"
                />
              </div>

              <div className="flex items-start gap-2.5 bg-white border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed shadow-2xs">
                <HelpCircle size={15} className="text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-950">How to get your Google Drive video link:</span>
                  <ol className="list-decimal list-inside mt-1 space-y-0.5 text-neutral-700">
                    <li>Upload your campus video to Google Drive.</li>
                    <li>Right-click the video &rarr; Click <strong>Share</strong> &rarr; Set General Access to <strong className="text-[#7E0D0D]">"Anyone with the link can view"</strong>.</li>
                    <li>Click <strong>Copy link</strong> and paste it into the box above.</li>
                  </ol>
                </div>
              </div>

              {/* Live Preview */}
              {form.videoUrl && (
                <div className="pt-1">
                  <span className="block text-xs font-bold text-neutral-700 mb-1.5">Live Embed Preview:</span>
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-300 bg-black shadow-md">
                    {mediaPreview.type === 'google_drive' ? (
                      <iframe
                        src={mediaPreview.embedUrl}
                        title="Jaipur Campus Video Preview"
                        className="w-full h-full border-0 absolute inset-0"
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                      />
                    ) : mediaPreview.type === 'youtube' ? (
                      <iframe
                        src={mediaPreview.embedUrl}
                        title="Jaipur Campus YouTube Preview"
                        className="w-full h-full border-0 absolute inset-0"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={form.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ImageUpload
              value={form.imageUrl}
              onChange={url => set('imageUrl', url)}
              folder="campus"
              label="Campus Hero Image Banner"
            />
          )}
        </div>

        {/* Hero Headlines & Copy */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4 shadow-2xs">
          <h3 className="font-bold text-[#1B2A44] text-base">Campus Hero Text & Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Badge Tag</label>
              <input
                value={form.heroBadge}
                onChange={e => set('heroBadge', e.target.value)}
                placeholder="JAIPUR CAMPUS"
                className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#1B2A44] mb-1">Contact Phone</label>
              <input
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+91 92578 79555"
                className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Hero Title</label>
            <input
              value={form.heroTitle}
              onChange={e => set('heroTitle', e.target.value)}
              placeholder="An Offline Campus Built for Deep Academic Focus"
              className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Hero Subtitle</label>
            <textarea
              rows={3}
              value={form.heroSubtitle}
              onChange={e => set('heroSubtitle', e.target.value)}
              placeholder="Air-conditioned smart classrooms, dedicated 1-on-1 faculty doubt cells..."
              className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D] resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#1B2A44] mb-1">Campus Address</label>
            <input
              value={form.address}
              onChange={e => set('address', e.target.value)}
              placeholder="Plot No. 4, Near Gandhi Nagar Railway Station, Bajaj Nagar, Jaipur, Rajasthan"
              className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7E0D0D]"
            />
          </div>
        </div>

        {/* Trust Pillars */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4 shadow-2xs">
          <h3 className="font-bold text-[#1B2A44] text-base">Key Campus Pillars</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3.5 bg-neutral-50 border border-[#F3DCDC] rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-[#7E0D0D] uppercase tracking-wider block">Pillar 1</span>
              <input
                value={form.pillar1Value}
                onChange={e => set('pillar1Value', e.target.value)}
                placeholder="1 : 12"
                className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-bold"
              />
              <input
                value={form.pillar1Label}
                onChange={e => set('pillar1Label', e.target.value)}
                placeholder="Cohort Limit"
                className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-600"
              />
            </div>

            <div className="p-3.5 bg-neutral-50 border border-[#F3DCDC] rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-[#7E0D0D] uppercase tracking-wider block">Pillar 2</span>
              <input
                value={form.pillar2Value}
                onChange={e => set('pillar2Value', e.target.value)}
                placeholder="8 AM – 9 PM"
                className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-bold"
              />
              <input
                value={form.pillar2Label}
                onChange={e => set('pillar2Label', e.target.value)}
                placeholder="Library & Doubts"
                className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-600"
              />
            </div>

            <div className="p-3.5 bg-neutral-50 border border-[#F3DCDC] rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-[#7E0D0D] uppercase tracking-wider block">Pillar 3</span>
              <input
                value={form.pillar3Value}
                onChange={e => set('pillar3Value', e.target.value)}
                placeholder="100% AC"
                className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-bold"
              />
              <input
                value={form.pillar3Label}
                onChange={e => set('pillar3Label', e.target.value)}
                placeholder="GPS Transport"
                className="w-full border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-600"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
