'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import ImageUpload from '@/components/admin/ImageUpload'
import InlineRichTextEditor from '@/components/admin/InlineRichTextEditor'
import {
  Save,
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Video,
  Image as ImageIcon,
  ExternalLink,
  HelpCircle,
  GraduationCap,
  Layers,
} from 'lucide-react'
import { parseMediaUrl } from '@/lib/homeCarousel'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'

const defaultBatches = [
  {
    tag: 'CAMBRIDGE IGCSE & A-LEVELS',
    title: 'Cambridge International Program',
    grades: 'Grades 8 to 12 · IGCSE / AS & A Levels',
    desc: 'Targeted coaching for Extended Math, Physics, Chemistry, Biology & Economics with 15-year past paper mastery and command-word marking rubrics.',
    features: ['Past 15 Years Question Bank Decoded', 'Command Word Marking Rubrics', 'Individual Coursework & IA Review', 'Intimate 1:12 Batch Size'],
    href: '/courses?category=IGCSE',
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'INTERNATIONAL BACCALAUREATE',
    title: 'IB Diploma (MYP & DP) Batch',
    grades: 'MYP 4–5 & DP 1–2',
    desc: 'Deep conceptual training across HL & SL subjects with dedicated Internal Assessment (IA), Extended Essay (EE), and TOK guidance by examiner-mentors.',
    features: ['Criterion-Referenced Rubrics Mastery', 'Internal Assessment (IA) Mentorship', 'Extended Essay (EE) & TOK Support', 'Regular Past Exam Simulations'],
    href: '/courses?category=IB',
    img: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'PRE-ENGINEERING & MEDICAL',
    title: 'IIT-JEE & NEET-UG 2-Year Batch',
    grades: 'Classes 11, 12 & Dropper Intensive',
    desc: 'Comprehensive syllabus coverage with Daily Practice Problems (DPPs), error analysis logs, and weekly All-India rank simulation mock exams.',
    features: ['Daily 30-Question DPPs with Review', 'Computer-Based Test (CBT) Labs', 'Level 1–3 Problem Solving Kits', 'Daily 1-on-1 Faculty Doubt Desk'],
    href: '/courses?category=Competitive+Exams',
    img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'NATIONAL CURRICULUM',
    title: 'CBSE Board Masterclass (9th–12th)',
    grades: 'Classes 9, 10, 11 & 12 (Science & Commerce)',
    desc: 'Line-by-line NCERT decoding, exemplar solutions, competency-based questions, and board exam answer presentation workshops for 95%+ targets.',
    features: ['Line-by-Line NCERT Decoding', 'Competency & Case-Based Question Kits', 'Specialized Board Answer Writing Sessions', 'Monthly Mock Board Series'],
    href: '/courses?category=CBSE',
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'FOUNDATION & TALENT',
    title: 'Junior Olympiads & Aptitude Track',
    grades: 'Classes 6, 7 & 8',
    desc: 'Early competitive aptitude building, speed math, non-routine problem solving, and science fundamentals for IMO, NSO, and PRMO exams.',
    features: ['Speed Math & Mental Agility Drills', 'Hands-on Science Demonstrations', 'Olympiad & Talent Search Preparation', 'Strong STEM Foundation'],
    href: '/courses?category=Olympiads',
    img: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=320&fit=crop&auto=format'
  },
  {
    tag: 'JAIPUR OFFLINE CAMPUS',
    title: 'Jaipur Physical Classroom Batches',
    grades: 'All Curriculums · C-Scheme & Vaishali',
    desc: 'Study at our modern air-conditioned learning center in Jaipur with smart digital boards, silent reference library, and daily 1-on-1 doubt desks.',
    features: ['Acoustic Smart Classrooms', 'Dedicated 1-on-1 Faculty Doubt Desks', 'Silent Library (8 AM – 9 PM)', 'Doorstep AC GPS Transport'],
    href: '/offline',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=320&fit=crop&auto=format'
  }
]

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

  const [batches, setBatches] = useState<any[]>([])
  const [batchesLoading, setBatchesLoading] = useState(true)

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
              : { label: '', value: String(item) }
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
    loadBatches()
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
      const mediaInfo = parseMediaUrl(row.image_url ?? '')
      const mediaType = text.mediaType ?? (mediaInfo.type !== 'image' ? 'video' : 'image')
      const videoUrl = text.videoUrl ?? (mediaType === 'video' ? row.image_url : '')
      return {
        ...row,
        mediaType,
        videoUrl,
        headingHtml: text.headingHtml ?? '',
        subtitleHtml: text.subtitleHtml ?? '',
        imageOpacity: text.imageOpacity ?? 100,
      }
    }))
    setSlidesLoading(false)
  }

  async function loadBatches() {
    setBatchesLoading(true)
    const { data } = await supabase
      .from('cms_gallery')
      .select('*')
      .eq('site_id', SITE_ID)
      .eq('category', 'Homepage Batches')
      .order('sort_order')

    if (data && data.length > 0) {
      setBatches(data.map(row => {
        let parsed: any = {}
        try { parsed = JSON.parse(row.caption ?? '{}') } catch {}
        const featuresList = Array.isArray(parsed.features)
          ? parsed.features.join('\n')
          : (parsed.features ?? '')
        return {
          id: row.id,
          image_url: row.image_url ?? '',
          tag: parsed.tag ?? '',
          title: parsed.title ?? '',
          grades: parsed.grades ?? '',
          desc: parsed.desc ?? '',
          features: featuresList,
          href: parsed.href ?? '/courses',
          sort_order: row.sort_order ?? 0,
        }
      }))
    } else {
      setBatches(defaultBatches.map((b, i) => ({
        id: `init-${i}`,
        image_url: b.img,
        tag: b.tag,
        title: b.title,
        grades: b.grades,
        desc: b.desc,
        features: b.features.join('\n'),
        href: b.href,
        sort_order: i,
      })))
    }
    setBatchesLoading(false)
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
    const isVideo = slide.mediaType === 'video'
    const finalUrl = isVideo ? (slide.videoUrl || slide.image_url) : slide.image_url
    const caption = JSON.stringify({
      mediaType: slide.mediaType ?? 'image',
      videoUrl: slide.videoUrl ?? '',
      headingHtml: unwrapParagraph(slide.headingHtml ?? ''),
      subtitleHtml: unwrapParagraph(slide.subtitleHtml ?? ''),
      imageOpacity: slide.imageOpacity ?? 100,
    })
    await supabase.from('cms_gallery').update({ image_url: finalUrl, caption }).eq('id', slide.id)
    alert(`Slide saved successfully!`)
  }

  async function addSlide() {
    const nextOrder = slides.length > 0 ? Math.max(...slides.map(s => s.sort_order ?? 0)) + 1 : 0
    const { data } = await supabase.from('cms_gallery').insert({
      site_id: SITE_ID,
      category: 'Home Carousel',
      image_url: '',
      caption: JSON.stringify({ mediaType: 'image', videoUrl: '', headingHtml: '', subtitleHtml: '', imageOpacity: 100 }),
      sort_order: nextOrder,
    }).select().single()
    if (data) setSlides(prev => [...prev, { ...data, mediaType: 'image', videoUrl: '', headingHtml: '', subtitleHtml: '', imageOpacity: 100 }])
  }

  async function deleteSlide(id: string) {
    if (!confirm('Delete this banner slide?')) return
    await supabase.from('cms_gallery').delete().eq('id', id)
    setSlides(prev => prev.filter(s => s.id !== id))
  }

  async function moveSlide(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= slides.length) return
    const updated = [...slides]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setSlides(updated)

    // Save new sort order in database immediately
    await Promise.all(
      updated.map((s, idx) =>
        supabase.from('cms_gallery').update({ sort_order: idx }).eq('id', s.id)
      )
    )
  }

  // --- Homepage Batches / Academic Pathways Manager ---

  function updateBatchLocal(id: string, patch: any) {
    setBatches(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b))
  }

  async function saveBatch(batch: any) {
    const featuresArray = String(batch.features || '')
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)

    const captionJson = JSON.stringify({
      tag: batch.tag,
      title: batch.title,
      grades: batch.grades,
      desc: batch.desc,
      features: featuresArray,
      href: batch.href,
    })

    if (batch.id && !String(batch.id).startsWith('init-')) {
      await supabase
        .from('cms_gallery')
        .update({
          image_url: batch.image_url,
          caption: captionJson,
          sort_order: batch.sort_order ?? 0,
        })
        .eq('id', batch.id)
    } else {
      const { data } = await supabase
        .from('cms_gallery')
        .insert({
          site_id: SITE_ID,
          category: 'Homepage Batches',
          image_url: batch.image_url,
          caption: captionJson,
          sort_order: batch.sort_order ?? 0,
        })
        .select()
        .single()
      if (data) {
        setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, id: data.id } : b))
      }
    }
    alert(`Batch card saved successfully!`)
  }

  async function addBatch() {
    const nextOrder = batches.length > 0 ? Math.max(...batches.map(b => b.sort_order ?? 0)) + 1 : 0
    const newCard = {
      tag: 'NEW PROGRAM',
      title: 'New Academic Batch',
      grades: 'Classes 9 to 12',
      desc: 'Add curriculum highlights and course descriptions here.',
      features: 'Feature 1\nFeature 2\nFeature 3',
      href: '/courses',
      image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=320&fit=crop&auto=format',
      sort_order: nextOrder,
    }

    const { data } = await supabase
      .from('cms_gallery')
      .insert({
        site_id: SITE_ID,
        category: 'Homepage Batches',
        image_url: newCard.image_url,
        caption: JSON.stringify({
          tag: newCard.tag,
          title: newCard.title,
          grades: newCard.grades,
          desc: newCard.desc,
          features: newCard.features.split('\n'),
          href: newCard.href,
        }),
        sort_order: nextOrder,
      })
      .select()
      .single()

    if (data) {
      setBatches(prev => [...prev, { ...newCard, id: data.id }])
    } else {
      setBatches(prev => [...prev, { ...newCard, id: `temp-${Date.now()}` }])
    }
  }

  async function deleteBatch(id: string) {
    if (!confirm('Delete this academic batch card?')) return
    if (!String(id).startsWith('init-')) {
      await supabase.from('cms_gallery').delete().eq('id', id)
    }
    setBatches(prev => prev.filter(b => b.id !== id))
  }

  async function moveBatch(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= batches.length) return
    const updated = [...batches]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setBatches(updated)

    // Save order
    await Promise.all(
      updated.map((b, idx) => {
        if (!String(b.id).startsWith('init-')) {
          return supabase.from('cms_gallery').update({ sort_order: idx }).eq('id', b.id)
        }
        return Promise.resolve()
      })
    )
  }

  if (!form) return <AdminLayout><p className="text-[#C9C8CB] text-sm">Loading…</p></AdminLayout>

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1B2A44]">Home Page Content</h2>
          <p className="text-xs text-[#C9C8CB]">Edit hero fallback, banner slides, academic batches, and stats</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 border border-[#F3DCDC] bg-white hover:bg-neutral-50 text-[#1B2A44] text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-2xs"
          >
            <ExternalLink size={13} />
            <span>View Website</span>
          </a>
          <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-60 shadow-xs">
            <Save size={15} /> {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Fallback Hero */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4 shadow-2xs">
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
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#1B2A44]">Homepage Banner Slides</h3>
              <p className="text-xs text-[#C9C8CB] mt-0.5">{slides.length} slide{slides.length === 1 ? '' : 's'} · Supports Images & Google Drive Videos</p>
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
            <div className="space-y-6">
              {slides.map((slide, i) => {
                const isVideo = slide.mediaType === 'video'
                const mediaPreview = parseMediaUrl(slide.videoUrl || slide.image_url || '')

                return (
                  <div key={slide.id} className="border border-[#F3DCDC] rounded-xl p-4 space-y-4 bg-white shadow-2xs">
                    {/* Header bar with Re-arrange controls */}
                    <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-lg border border-neutral-200/80">
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-neutral-400" />
                        <span className="text-xs font-bold text-[#1B2A44] uppercase tracking-wider">
                          Slide {i + 1}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isVideo ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900 border border-blue-300'
                        }`}>
                          {isVideo ? <Video size={11} /> : <ImageIcon size={11} />}
                          <span>{isVideo ? 'Video / Drive' : 'Image'}</span>
                        </span>
                        {slides.length > 1 && (
                          <span className="text-[10px] text-neutral-500 font-medium hidden sm:inline">
                            ({i + 1} of {slides.length})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveSlide(i, i - 1)}
                          disabled={i === 0}
                          title="Move Slide Up"
                          className="p-1.5 rounded-md border border-[#F3DCDC] bg-white text-neutral-700 hover:bg-[#7E0D0D] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 text-[11px] font-semibold"
                        >
                          <ArrowUp size={13} />
                          <span className="hidden sm:inline">Up</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => moveSlide(i, i + 1)}
                          disabled={i === slides.length - 1}
                          title="Move Slide Down"
                          className="p-1.5 rounded-md border border-[#F3DCDC] bg-white text-neutral-700 hover:bg-[#7E0D0D] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 text-[11px] font-semibold"
                        >
                          <ArrowDown size={13} />
                          <span className="hidden sm:inline">Down</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteSlide(slide.id)}
                          title="Delete Slide"
                          className="p-1.5 rounded-md border border-red-200 bg-white text-red-500 hover:bg-red-600 hover:text-white transition-all ml-1.5"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Media Type Toggle: Image vs Video */}
                    <div>
                      <label className="block text-xs font-semibold text-[#1B2A44] mb-1.5">Media Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => updateSlideLocal(slide.id, { mediaType: 'image' })}
                          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                            !isVideo
                              ? 'bg-[#7E0D0D] text-white border-[#7E0D0D] shadow-xs'
                              : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          <ImageIcon size={14} />
                          <span>Image Slide</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateSlideLocal(slide.id, { mediaType: 'video' })}
                          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                            isVideo
                              ? 'bg-[#7E0D0D] text-white border-[#7E0D0D] shadow-xs'
                              : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                          }`}
                        >
                          <Video size={14} />
                          <span>Google Drive / Video Link</span>
                        </button>
                      </div>
                    </div>

                    {/* Conditional Input based on Media Type */}
                    {isVideo ? (
                      <div className="space-y-3 bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
                        <div>
                          <label className="block text-xs font-bold text-[#1B2A44] mb-1">
                            Google Drive / Video Link *
                          </label>
                          <input
                            type="text"
                            value={slide.videoUrl ?? slide.image_url ?? ''}
                            onChange={e => updateSlideLocal(slide.id, { videoUrl: e.target.value, image_url: e.target.value })}
                            placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7E0D0D] bg-white"
                          />
                        </div>

                        <div className="flex items-start gap-2 bg-white border border-amber-200 rounded-lg p-2.5 text-[11px] text-amber-900 leading-relaxed">
                          <HelpCircle size={14} className="text-amber-700 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Google Drive Sharing Instructions:</span>
                            <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-neutral-700">
                              <li>Paste your Google Drive video link directly.</li>
                              <li>Ensure file access is set to: <strong className="text-[#7E0D0D]">"Anyone with the link can view"</strong> on Drive.</li>
                              <li>YouTube embed links or direct MP4 links are also supported.</li>
                            </ul>
                          </div>
                        </div>

                        {(slide.videoUrl || slide.image_url) && (
                          <div>
                            <span className="block text-[11px] font-bold text-neutral-700 mb-1">Live Embed Preview:</span>
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-neutral-300 bg-black">
                              {mediaPreview.type === 'google_drive' ? (
                                <iframe
                                  src={mediaPreview.embedUrl}
                                  title="Google Drive Preview"
                                  className="w-full h-full border-0"
                                  allow="autoplay; encrypted-media; fullscreen"
                                  allowFullScreen
                                />
                              ) : mediaPreview.type === 'youtube' ? (
                                <iframe
                                  src={mediaPreview.embedUrl}
                                  title="YouTube Preview"
                                  className="w-full h-full border-0"
                                  allowFullScreen
                                />
                              ) : (
                                <video
                                  src={slide.videoUrl || slide.image_url}
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
                        value={slide.image_url ?? ''}
                        onChange={url => updateSlideLocal(slide.id, { image_url: url })}
                        folder="home-carousel"
                        label="Slide Image"
                      />
                    )}

                    <div className="pt-1">
                      <button
                        onClick={() => saveSlide(slide)}
                        className="bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
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

        {/* 🌟 NEW: Explore Our Batches / Academic Pathways Cards Manager */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#F3DCDC] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="text-[#7E0D0D] h-5 w-5" />
                <h3 className="font-bold text-[#1B2A44] text-base">Explore Our Batches (Hover Cards)</h3>
              </div>
              <p className="text-xs text-[#C9C8CB] mt-0.5">
                {batches.length} Batch Card{batches.length === 1 ? '' : 's'} · Manage card images, titles, descriptions, feature bullets, and course links
              </p>
            </div>
            <button
              onClick={addBatch}
              className="flex items-center gap-1.5 text-xs bg-[#7E0D0D] hover:bg-[#922222] text-white font-semibold px-3 py-1.5 rounded-lg transition-all shrink-0 shadow-xs"
            >
              <Plus size={13} /> Add Batch Card
            </button>
          </div>

          {batchesLoading ? (
            <p className="text-xs text-[#C9C8CB]">Loading batch cards…</p>
          ) : (
            <div className="space-y-6">
              {batches.map((batch, i) => (
                <div key={batch.id || i} className="border border-[#F3DCDC] rounded-xl p-5 space-y-4 bg-white shadow-2xs">
                  {/* Top Bar with Reorder Controls */}
                  <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-lg border border-neutral-200/80">
                    <div className="flex items-center gap-2">
                      <GripVertical size={14} className="text-neutral-400" />
                      <span className="text-xs font-bold text-[#1B2A44] uppercase tracking-wider">
                        Batch Card {i + 1}: {batch.title || 'Untitled'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveBatch(i, i - 1)}
                        disabled={i === 0}
                        title="Move Up"
                        className="p-1.5 rounded-md border border-[#F3DCDC] bg-white text-neutral-700 hover:bg-[#7E0D0D] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 text-[11px] font-semibold"
                      >
                        <ArrowUp size={13} />
                        <span className="hidden sm:inline">Up</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => moveBatch(i, i + 1)}
                        disabled={i === batches.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-md border border-[#F3DCDC] bg-white text-neutral-700 hover:bg-[#7E0D0D] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1 text-[11px] font-semibold"
                      >
                        <ArrowDown size={13} />
                        <span className="hidden sm:inline">Down</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteBatch(batch.id)}
                        title="Delete Card"
                        className="p-1.5 rounded-md border border-red-200 bg-white text-red-500 hover:bg-red-600 hover:text-white transition-all ml-1.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Card Image */}
                  <ImageUpload
                    value={batch.image_url ?? ''}
                    onChange={url => updateBatchLocal(batch.id, { image_url: url })}
                    folder="batches"
                    label="Batch Card Cover Image"
                  />

                  {/* Tag & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1B2A44] mb-1">Badge Tag *</label>
                      <input
                        type="text"
                        value={batch.tag ?? ''}
                        onChange={e => updateBatchLocal(batch.id, { tag: e.target.value })}
                        placeholder="e.g. CAMBRIDGE IGCSE & A-LEVELS"
                        className="w-full border border-[#F3DCDC] rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#7E0D0D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1B2A44] mb-1">Program Title *</label>
                      <input
                        type="text"
                        value={batch.title ?? ''}
                        onChange={e => updateBatchLocal(batch.id, { title: e.target.value })}
                        placeholder="e.g. Cambridge International Program"
                        className="w-full border border-[#F3DCDC] rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#7E0D0D]"
                      />
                    </div>
                  </div>

                  {/* Grades & Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1B2A44] mb-1">Grades / Target Class *</label>
                      <input
                        type="text"
                        value={batch.grades ?? ''}
                        onChange={e => updateBatchLocal(batch.id, { grades: e.target.value })}
                        placeholder="e.g. Grades 8 to 12 · IGCSE / AS & A Levels"
                        className="w-full border border-[#F3DCDC] rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#7E0D0D]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1B2A44] mb-1">Explore Program Link *</label>
                      <input
                        type="text"
                        value={batch.href ?? ''}
                        onChange={e => updateBatchLocal(batch.id, { href: e.target.value })}
                        placeholder="e.g. /courses?category=IGCSE or /offline"
                        className="w-full border border-[#F3DCDC] rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#7E0D0D]"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-[#1B2A44] mb-1">Curriculum Summary Description *</label>
                    <textarea
                      rows={2}
                      value={batch.desc ?? ''}
                      onChange={e => updateBatchLocal(batch.id, { desc: e.target.value })}
                      placeholder="Targeted coaching for Extended Math, Physics, Chemistry..."
                      className="w-full border border-[#F3DCDC] rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#7E0D0D] resize-none"
                    />
                  </div>

                  {/* Features / Bullets */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-[#1B2A44]">Feature Bullets (1 per line)</label>
                      <span className="text-[11px] text-[#C9C8CB]">Shown on hover</span>
                    </div>
                    <textarea
                      rows={3}
                      value={batch.features ?? ''}
                      onChange={e => updateBatchLocal(batch.id, { features: e.target.value })}
                      placeholder="Past 15 Years Question Bank Decoded&#10;Command Word Marking Rubrics&#10;Individual Coursework & IA Review"
                      className="w-full border border-[#F3DCDC] rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#7E0D0D] font-mono leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={() => saveBatch(batch)}
                    className="bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Save size={13} />
                    <span>Save Batch Card {i + 1}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1B2A44]">Stats</h3>
            <button onClick={addStat} className="text-xs text-[#7E0D0D] hover:underline font-medium">+ Add Stat</button>
          </div>
          <div className="space-y-3">
            {(form.stats_json ?? []).map((stat: any, i: number) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  value={stat.label ?? ''}
                  onChange={(e) => setStat(i, 'label', e.target.value)}
                  placeholder="Label (e.g. Students)"
                  className="flex-1 border border-[#F3DCDC] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                />
                <input
                  value={stat.value ?? ''}
                  onChange={(e) => setStat(i, 'value', e.target.value)}
                  placeholder="Value (e.g. 50,000+)"
                  className="w-36 border border-[#F3DCDC] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#7E0D0D]"
                />
                <button onClick={() => removeStat(i)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
