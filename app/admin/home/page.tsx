'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import ImageUpload from '@/components/admin/ImageUpload'
import InlineRichTextEditor from '@/components/admin/InlineRichTextEditor'
import AcademicDecksManager from '@/components/admin/AcademicDecksManager'
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
  Trophy,
  BarChart3,
  Tv,
  Check,
  CheckCircle2,
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
    grades: 'All Curriculums · Vaishali Extension',
    desc: 'Study at our modern air-conditioned learning center in Jaipur with smart digital boards, silent reference library, and daily 1-on-1 doubt desks.',
    features: ['Acoustic Smart Classrooms', 'Dedicated 1-on-1 Faculty Doubt Desks', 'Silent Library (8 AM – 9 PM)', 'Doorstep AC GPS Transport'],
    href: '/offline',
    img: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=320&fit=crop&auto=format'
  }
]

const defaultYtChannels = [
  {
    title: 'Hodu Academy | IGCSE & IBDP',
    url: 'https://www.youtube.com/@hoduacademy',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop&auto=format',
    subscribers: 'Cambridge & IB Lectures',
  },
  {
    title: 'Hodu Academy - JEE | NEET | Boards',
    url: 'https://www.youtube.com/@hoduacademy',
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=450&fit=crop&auto=format',
    subscribers: 'Physics, Chemistry & Math Problem Sets',
  },
  {
    title: 'Hodu Academy | Class 9 & 10',
    url: 'https://www.youtube.com/@hoduacademy',
    image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=450&fit=crop&auto=format',
    subscribers: 'Foundation & Board Concepts',
  },
]

function unwrapParagraph(html: string) {
  const m = html.trim().match(/^<p>([\s\S]*)<\/p>$/)
  return m ? m[1] : html
}

const SECTION_TABS = [
  { id: 'all', label: '🌟 All Sections' },
  { id: 'slides', label: '🖼️ Banner Slides' },
  { id: 'results', label: '🏆 Result Decks & Toppers' },
  { id: 'batches', label: '📚 Batches & Tracks' },
  { id: 'youtube', label: '🎥 YouTube Channels' },
  { id: 'stats', label: '⚙️ Hero & Stats' },
]

export default function HomeContentPage() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('all')

  const [form, setForm]     = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  const [slides, setSlides]   = useState<any[]>([])
  const [slidesLoading, setSlidesLoading] = useState(true)

  const [batches, setBatches] = useState<any[]>([])
  const [batchesLoading, setBatchesLoading] = useState(true)

  const [ytChannels, setYtChannels] = useState<any[]>([])
  const [ytChannelsLoading, setYtChannelsLoading] = useState(true)

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
    loadYtChannels()
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

  // Banner Slides
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

    await Promise.all(
      updated.map((s, idx) =>
        supabase.from('cms_gallery').update({ sort_order: idx }).eq('id', s.id)
      )
    )
  }

  // Batches
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

    await Promise.all(
      updated.map((b, idx) => {
        if (!String(b.id).startsWith('init-')) {
          return supabase.from('cms_gallery').update({ sort_order: idx }).eq('id', b.id)
        }
        return Promise.resolve()
      })
    )
  }

  // YouTube Channels
  async function loadYtChannels() {
    setYtChannelsLoading(true)
    const { data } = await supabase
      .from('cms_gallery')
      .select('*')
      .eq('site_id', SITE_ID)
      .eq('category', 'YouTube Channel')
      .order('sort_order')

    if (data && data.length > 0) {
      setYtChannels(data.map(row => {
        let parsed: any = {}
        try { parsed = JSON.parse(row.caption ?? '{}') } catch { parsed = { title: row.caption } }
        return {
          id: row.id,
          title: parsed.title || row.caption || 'Hodu Academy YouTube Channel',
          url: parsed.url || 'https://www.youtube.com/@hoduacademy',
          subscribers: parsed.subscribers || 'Subscribe & Watch Free',
          image_url: row.image_url || '',
          sort_order: row.sort_order ?? 0,
        }
      }))
    } else {
      setYtChannels(defaultYtChannels.map((c, i) => ({ ...c, id: `default-${i}`, sort_order: i })))
    }
    setYtChannelsLoading(false)
  }

  function updateYtChannelLocal(id: string, patch: any) {
    setYtChannels(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))
  }

  async function saveYtChannel(channel: any) {
    const caption = JSON.stringify({
      title: channel.title,
      url: channel.url,
      subscribers: channel.subscribers,
    })

    if (String(channel.id).startsWith('default-')) {
      const { data, error } = await supabase.from('cms_gallery').insert({
        site_id: SITE_ID,
        category: 'YouTube Channel',
        image_url: channel.image_url,
        caption,
        sort_order: channel.sort_order,
      }).select().single()
      if (!error && data) {
        setYtChannels(prev => prev.map(c => c.id === channel.id ? { ...c, id: data.id } : c))
        alert('YouTube channel card saved successfully!')
      }
    } else {
      await supabase.from('cms_gallery').update({
        image_url: channel.image_url,
        caption,
        sort_order: channel.sort_order,
      }).eq('id', channel.id)
      alert('YouTube channel card saved successfully!')
    }
  }

  async function addYtChannel() {
    const nextOrder = ytChannels.length > 0 ? Math.max(...ytChannels.map(c => c.sort_order ?? 0)) + 1 : 0
    const { data } = await supabase.from('cms_gallery').insert({
      site_id: SITE_ID,
      category: 'YouTube Channel',
      image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop&auto=format',
      caption: JSON.stringify({
        title: 'Hodu Academy New Channel',
        url: 'https://www.youtube.com/@hoduacademy',
        subscribers: 'Subscribe & Watch Free',
      }),
      sort_order: nextOrder,
    }).select().single()

    if (data) {
      setYtChannels(prev => [...prev, {
        id: data.id,
        title: 'Hodu Academy New Channel',
        url: 'https://www.youtube.com/@hoduacademy',
        subscribers: 'Subscribe & Watch Free',
        image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop&auto=format',
        sort_order: nextOrder,
      }])
    }
  }

  async function deleteYtChannel(id: string) {
    if (!confirm('Delete this YouTube channel card?')) return
    if (!String(id).startsWith('default-')) {
      await supabase.from('cms_gallery').delete().eq('id', id)
    }
    setYtChannels(prev => prev.filter(c => c.id !== id))
  }

  async function moveYtChannel(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= ytChannels.length) return
    const updated = [...ytChannels]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setYtChannels(updated)

    await Promise.all(
      updated.map((c, idx) => {
        if (!String(c.id).startsWith('default-')) {
          return supabase.from('cms_gallery').update({ sort_order: idx }).eq('id', c.id)
        }
        return Promise.resolve()
      })
    )
  }

  if (!form) return <AdminLayout><p className="text-[#C9C8CB] text-sm">Loading…</p></AdminLayout>

  return (
    <AdminLayout>
      {/* ─── Top Sticky Bar ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-brand-border">
        <div>
          <h2 className="text-xl font-bold text-[#1B2A44]">Homepage CMS Hub</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage banner slides, results & topper templates, batch tracks, and community sections in compact grids.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 border border-[#F3DCDC] bg-white hover:bg-neutral-50 text-[#1B2A44] text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-2xs"
          >
            <ExternalLink size={13} />
            <span>View Website</span>
          </a>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs font-bold px-4 py-2.5 rounded-xl disabled:opacity-60 shadow-xs cursor-pointer transition-all"
          >
            <Save size={15} /> {saving ? 'Saving…' : saved ? 'Saved Successfully!' : 'Save Page Changes'}
          </button>
        </div>
      </div>

      {/* ─── Section Navigation Filter Pills ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none no-scrollbar">
        {SECTION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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
        
        {/* ─── 1. BANNER SLIDES (GRID LAYOUT) ─── */}
        {(activeTab === 'all' || activeTab === 'slides') && (
          <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="text-[#7E0D0D] h-5 w-5" />
                  <h3 className="font-bold text-[#1B2A44] text-base">Homepage Banner Slides (Carousel)</h3>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {slides.length} Slide{slides.length === 1 ? '' : 's'} · Supports Images & Google Drive Videos in a responsive grid
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
              <p className="text-xs text-neutral-500">Loading slides…</p>
            ) : slides.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-neutral-300 rounded-2xl space-y-2">
                <p className="text-xs text-neutral-500">No custom banner slides yet. The fallback hero will be shown.</p>
                <button onClick={addSlide} className="text-xs font-bold text-[#7E0D0D] hover:underline">+ Add First Slide</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {slides.map((slide, i) => {
                  const isVideo = slide.mediaType === 'video'
                  const mediaPreview = parseMediaUrl(slide.videoUrl || slide.image_url || '')

                  return (
                    <div
                      key={slide.id}
                      className="border border-[#F3DCDC] rounded-2xl p-4 space-y-3 bg-neutral-50/50 hover:bg-white transition-all shadow-2xs flex flex-col justify-between"
                    >
                      {/* Top bar with reorder & delete */}
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#1B2A44] uppercase">
                            Slide {i + 1}
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
                            className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSlide(i, i + 1)}
                            disabled={i === slides.length - 1}
                            className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSlide(slide.id)}
                            className="p-1 rounded-md border border-red-200 text-red-500 hover:bg-red-50"
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
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all ${
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
                          className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all ${
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
                            placeholder="Paste Google Drive video link..."
                            className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white"
                          />
                        </div>
                      ) : (
                        <ImageUpload
                          value={slide.image_url ?? ''}
                          onChange={url => updateSlideLocal(slide.id, { image_url: url })}
                          folder="home-carousel"
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

        {/* ─── 2. ACADEMIC EXCELLENCE RESULTS DECKS (TOPPERS & MARKS TEMPLATES) ─── */}
        {(activeTab === 'all' || activeTab === 'results') && (
          <AcademicDecksManager />
        )}

        {/* ─── 3. BATCHES & CURRICULUM PATHWAYS (GRID LAYOUT) ─── */}
        {(activeTab === 'all' || activeTab === 'batches') && (
          <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="text-[#7E0D0D] h-5 w-5" />
                  <h3 className="font-bold text-[#1B2A44] text-base">Explore Our Batches (Hover Cards)</h3>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {batches.length} Batch Card{batches.length === 1 ? '' : 's'} · Manage curriculum cards in a clean 2-column grid
                </p>
              </div>
              <button
                onClick={addBatch}
                className="flex items-center gap-1.5 text-xs bg-[#7E0D0D] hover:bg-[#922222] text-white font-bold px-3.5 py-2 rounded-xl transition-all shrink-0 shadow-xs cursor-pointer"
              >
                <Plus size={14} /> Add Batch Card
              </button>
            </div>

            {batchesLoading ? (
              <p className="text-xs text-neutral-500">Loading batch cards…</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {batches.map((batch, i) => (
                  <div
                    key={batch.id || i}
                    className="border border-[#F3DCDC] rounded-2xl p-4 space-y-3 bg-neutral-50/50 hover:bg-white transition-all shadow-2xs flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200">
                      <span className="text-xs font-black text-[#1B2A44] truncate max-w-[200px]">
                        {i + 1}. {batch.title || 'Untitled Batch'}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveBatch(i, i - 1)}
                          disabled={i === 0}
                          className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30"
                          title="Move Up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveBatch(i, i + 1)}
                          disabled={i === batches.length - 1}
                          className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30"
                          title="Move Down"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBatch(batch.id)}
                          className="p-1 rounded-md border border-red-200 text-red-500 hover:bg-red-50"
                          title="Delete Card"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Image */}
                    <ImageUpload
                      value={batch.image_url ?? ''}
                      onChange={url => updateBatchLocal(batch.id, { image_url: url })}
                      folder="batches"
                      label="Batch Cover Image"
                    />

                    {/* Tag & Title */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={batch.tag ?? ''}
                        onChange={e => updateBatchLocal(batch.id, { tag: e.target.value })}
                        placeholder="Badge Tag"
                        className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                      />
                      <input
                        type="text"
                        value={batch.title ?? ''}
                        onChange={e => updateBatchLocal(batch.id, { title: e.target.value })}
                        placeholder="Program Title"
                        className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white"
                      />
                    </div>

                    {/* Grades & Link */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={batch.grades ?? ''}
                        onChange={e => updateBatchLocal(batch.id, { grades: e.target.value })}
                        placeholder="Classes / Grades"
                        className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                      />
                      <input
                        type="text"
                        value={batch.href ?? ''}
                        onChange={e => updateBatchLocal(batch.id, { href: e.target.value })}
                        placeholder="Page Link (e.g. /courses)"
                        className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                      />
                    </div>

                    {/* Desc */}
                    <textarea
                      rows={2}
                      value={batch.desc ?? ''}
                      onChange={e => updateBatchLocal(batch.id, { desc: e.target.value })}
                      placeholder="Brief description..."
                      className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs bg-white resize-none"
                    />

                    {/* Features */}
                    <textarea
                      rows={2}
                      value={batch.features ?? ''}
                      onChange={e => updateBatchLocal(batch.id, { features: e.target.value })}
                      placeholder="Bullet points (1 per line)..."
                      className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-mono"
                    />

                    <button
                      onClick={() => saveBatch(batch)}
                      className="w-full bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Save size={13} />
                      <span>Save Batch Card</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── 4. YOUTUBE CHANNELS (GRID LAYOUT) ─── */}
        {(activeTab === 'all' || activeTab === 'youtube') && (
          <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Tv className="text-red-600 h-5 w-5" />
                  <h3 className="font-bold text-[#1B2A44] text-base">YouTube Channels & Video Hub</h3>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {ytChannels.length} Channel Card{ytChannels.length === 1 ? '' : 's'} · Manage YouTube hubs in a 3-column grid
                </p>
              </div>
              <button
                onClick={addYtChannel}
                className="flex items-center gap-1.5 text-xs bg-[#7E0D0D] hover:bg-[#922222] text-white font-bold px-3.5 py-2 rounded-xl transition-all shrink-0 shadow-xs cursor-pointer"
              >
                <Plus size={14} /> Add Channel
              </button>
            </div>

            {ytChannelsLoading ? (
              <p className="text-xs text-neutral-500">Loading YouTube channels…</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ytChannels.map((ch, i) => (
                  <div
                    key={ch.id || i}
                    className="border border-[#F3DCDC] rounded-2xl p-4 space-y-3 bg-neutral-50/50 hover:bg-white transition-all shadow-2xs flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200">
                      <span className="text-xs font-black text-[#1B2A44] truncate max-w-[150px]">
                        {ch.title || 'Channel'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveYtChannel(i, i - 1)}
                          disabled={i === 0}
                          className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveYtChannel(i, i + 1)}
                          disabled={i === ytChannels.length - 1}
                          className="p-1 rounded-md border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteYtChannel(ch.id)}
                          className="p-1 rounded-md border border-red-200 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <ImageUpload
                      value={ch.image_url ?? ''}
                      onChange={url => updateYtChannelLocal(ch.id, { image_url: url })}
                      folder="youtube-channels"
                      label="Channel Cover Banner"
                    />

                    <input
                      type="text"
                      value={ch.title ?? ''}
                      onChange={e => updateYtChannelLocal(ch.id, { title: e.target.value })}
                      placeholder="Channel Title"
                      className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-white"
                    />

                    <input
                      type="text"
                      value={ch.subscribers ?? ''}
                      onChange={e => updateYtChannelLocal(ch.id, { subscribers: e.target.value })}
                      placeholder="Subtitle / Focus"
                      className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                    />

                    <input
                      type="url"
                      value={ch.url ?? ''}
                      onChange={e => updateYtChannelLocal(ch.id, { url: e.target.value })}
                      placeholder="YouTube URL"
                      className="w-full border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                    />

                    <button
                      onClick={() => saveYtChannel(ch)}
                      className="w-full bg-[#7E0D0D] hover:bg-[#922222] text-white text-xs font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Save size={13} />
                      <span>Save Channel</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── 5. HERO TEXT & STATS (GRID LAYOUT) ─── */}
        {(activeTab === 'all' || activeTab === 'stats') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Fallback Hero Card */}
            <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4 shadow-2xs">
              <div>
                <h3 className="font-bold text-[#1B2A44] text-base">Fallback Hero Text</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Shown when there are no active banner slides.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B2A44] mb-1">Hero Title</label>
                <InlineRichTextEditor value={form.hero_title} onChange={v => set('hero_title', v)} placeholder="Your Dream Rank Starts Here" />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B2A44] mb-1">Hero Subtitle</label>
                <InlineRichTextEditor value={form.hero_subtitle} onChange={v => set('hero_subtitle', v)} placeholder="A short supporting line…" multiline />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1B2A44] mb-1">CTA Button Text</label>
                  <input
                    value={form.cta_text}
                    onChange={(e) => set('cta_text', e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1B2A44] mb-1">CTA Link</label>
                  <input
                    value={form.cta_link}
                    onChange={(e) => set('cta_link', e.target.value)}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <ImageUpload value={form.hero_image_url ?? ''} onChange={(url) => set('hero_image_url', url)} folder="hero" label="Hero Image" />
            </div>

            {/* Stats Card */}
            <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#1B2A44] text-base">Key Metrics & Stats</h3>
                  <p className="text-xs text-neutral-500 mt-0.5">Numerical milestones displayed on the homepage.</p>
                </div>
                <button onClick={addStat} className="text-xs text-[#7E0D0D] font-bold hover:underline">+ Add Stat</button>
              </div>

              <div className="space-y-3">
                {(form.stats_json ?? []).map((stat: any, i: number) => (
                  <div key={i} className="flex gap-2 items-center bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                    <input
                      value={stat.label ?? ''}
                      onChange={(e) => setStat(i, 'label', e.target.value)}
                      placeholder="Label (e.g. Students)"
                      className="flex-1 border border-neutral-300 rounded-lg px-3 py-1.5 text-xs bg-white"
                    />
                    <input
                      value={stat.value ?? ''}
                      onChange={(e) => setStat(i, 'value', e.target.value)}
                      placeholder="Value (e.g. 50,000+)"
                      className="w-28 border border-neutral-300 rounded-lg px-3 py-1.5 text-xs font-bold text-brand-maroon bg-white"
                    />
                    <button onClick={() => removeStat(i)} className="text-neutral-400 hover:text-red-600 p-1">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  )
}
