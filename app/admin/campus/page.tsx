'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import AdminLayout from '@/components/admin/AdminLayout'
import ImageUpload from '@/components/admin/ImageUpload'
import * as XLSX from 'xlsx'
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
  School,
  Target,
  BookOpen,
  Laptop,
  Smartphone,
  Bus,
  Sparkles,
  Award,
  Users,
  Shield,
  Clock,
  Check,
  FileSpreadsheet,
  FileUp,
  FileDown,
  Download,
  Upload,
} from 'lucide-react'
import { parseMediaUrl } from '@/lib/homeCarousel'
import { HODU } from '@/lib/hodu'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'
const CAROUSEL_CATEGORY = 'Jaipur Campus Carousel'
const CAMPUS_INFO_CATEGORY = 'Jaipur Campus Video'
const FACILITIES_CATEGORY = 'Jaipur Campus Facilities'

const DEFAULT_VIDEO_URL = 'https://www.youtube.com/watch?v=Z3Gm-LVcB-E'

export const defaultCampusFacilities = [
  {
    title: 'Smart Classrooms',
    tag: 'Acoustic Treated',
    desc: '85-inch interactive touchscreens, digital visualizers, and ergonomic seating.',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=450&fit=crop&auto=format',
    iconName: 'School',
  },
  {
    title: '1-on-1 Doubt Desks',
    tag: 'Daily 4:00 – 7:30 PM',
    desc: 'Private consultation booths for subject masters to resolve queries line-by-line.',
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=700&h=450&fit=crop&auto=format',
    iconName: 'Target',
  },
  {
    title: 'Silent Library',
    tag: '8 AM – 9 PM',
    desc: 'Air-conditioned study carrels with 15+ years of Cambridge, IB, CBSE & JEE archives.',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&h=450&fit=crop&auto=format',
    iconName: 'BookOpen',
  },
  {
    title: 'CBT Testing Lab',
    tag: 'Simulated Exams',
    desc: 'High-speed desktop terminals replicating real NTA JEE Main, NEET & Cambridge exams.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&h=450&fit=crop&auto=format',
    iconName: 'Laptop',
  },
  {
    title: 'Biometric Attendance',
    tag: 'Instant Alerts',
    desc: 'Automated entry/exit timestamps sent to parents with weekly progress dashboards.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&h=450&fit=crop&auto=format',
    iconName: 'Smartphone',
  },
  {
    title: 'GPS AC Transport',
    tag: 'Doorstep Pickup',
    desc: 'Safe, air-conditioned bus network with live GPS parent tracking across Jaipur.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&h=450&fit=crop&auto=format',
    iconName: 'Bus',
  },
]

const ICON_OPTIONS = [
  { value: 'School', label: '🏫 School / Classroom' },
  { value: 'Target', label: '🎯 Target / Doubt Desk' },
  { value: 'BookOpen', label: '📖 Library / Books' },
  { value: 'Laptop', label: '💻 Computer / CBT Lab' },
  { value: 'Smartphone', label: '📱 Biometric / App Alerts' },
  { value: 'Bus', label: '🚌 Bus / AC Transport' },
  { value: 'Sparkles', label: '✨ Sparkles / Premium' },
  { value: 'Building2', label: '🏛️ Campus / Building' },
  { value: 'Users', label: '👥 Small Batches' },
  { value: 'Award', label: '🏆 Excellence' },
  { value: 'Clock', label: '⏰ Timings / Extended Study' },
  { value: 'Shield', label: '🛡️ Safety / Security' },
]

export const ICON_MAP: Record<string, any> = {
  School,
  Target,
  BookOpen,
  Laptop,
  Smartphone,
  Bus,
  Sparkles,
  Building2,
  Users,
  Award,
  Clock,
  Shield,
  MapPin,
  CheckCircle2,
}

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
  const [activeTab, setActiveTab] = useState<'all' | 'slides' | 'facilities' | 'overview' | 'pillars' | 'contact'>('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [recordId, setRecordId] = useState<string | null>(null)

  // Slides State
  const [slides, setSlides] = useState<any[]>([])
  const [slidesLoading, setSlidesLoading] = useState(true)

  // Facilities Cards State
  const [facilities, setFacilities] = useState<any[]>([])
  const [facilitiesLoading, setFacilitiesLoading] = useState(true)
  const [facilitiesBulkNotice, setFacilitiesBulkNotice] = useState<string | null>(null)
  const facilitiesCsvInputRef = useRef<HTMLInputElement>(null)

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
    loadFacilities()
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

  async function loadFacilities() {
    setFacilitiesLoading(true)
    const { data } = await supabase
      .from('cms_gallery')
      .select('*')
      .eq('site_id', SITE_ID)
      .eq('category', FACILITIES_CATEGORY)
      .order('sort_order')

    if (data && data.length > 0) {
      setFacilities(data.map(row => {
        let parsed: any = {}
        try { parsed = JSON.parse(row.caption ?? '{}') } catch {}
        return {
          id: row.id,
          title: parsed.title || row.title || 'Campus Facility',
          tag: parsed.tag || 'FACILITY',
          desc: parsed.desc || '',
          image: row.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=450&fit=crop&auto=format',
          iconName: parsed.iconName || 'School',
          sort_order: row.sort_order ?? 0,
        }
      }))
    } else {
      setFacilities(defaultCampusFacilities.map((f, idx) => ({
        id: `init-fac-${idx}`,
        title: f.title,
        tag: f.tag,
        desc: f.desc,
        image: f.image,
        iconName: f.iconName,
        sort_order: idx,
      })))
    }
    setFacilitiesLoading(false)
  }

  function set(k: string, v: any) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  // Slide Helpers
  function updateSlideLocal(id: string, patch: any) {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  function addSlide() {
    const nextOrder = slides.length
    const newSlide = {
      id: `new-${Date.now()}`,
      image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&h=700&fit=crop&auto=format',
      mediaType: 'image',
      videoUrl: '',
      sort_order: nextOrder,
      headingHtml: '',
      subtitleHtml: '',
      imageOpacity: 100,
    }
    setSlides(prev => [...prev, newSlide])
  }

  async function deleteSlide(id: string) {
    if (!confirm('Are you sure you want to delete this slide?')) return
    if (!String(id).startsWith('init-') && !String(id).startsWith('new-')) {
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
  }

  // Facility Card Helpers
  function updateFacilityLocal(id: string, patch: any) {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f))
  }

  function addFacility() {
    const nextOrder = facilities.length
    const newFac = {
      id: `new-fac-${Date.now()}`,
      title: 'New Campus Facility',
      tag: 'FACILITIES',
      desc: 'High-tech facility with expert staff and modern learning tools.',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=450&fit=crop&auto=format',
      iconName: 'School',
      sort_order: nextOrder,
    }
    setFacilities(prev => [...prev, newFac])
  }

  async function deleteFacility(id: string) {
    if (!confirm('Are you sure you want to delete this facility card?')) return
    if (!String(id).startsWith('init-') && !String(id).startsWith('new-')) {
      await supabase.from('cms_gallery').delete().eq('id', id)
    }
    setFacilities(prev => prev.filter(f => f.id !== id))
  }

  function moveFacility(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= facilities.length) return
    const updated = [...facilities]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setFacilities(updated)
  }

  async function seedDefaultFacilities() {
    if (!confirm('Reset/populate default 6 campus facilities?')) return
    setSaving(true)
    try {
      // Clear old
      await supabase.from('cms_gallery').delete().eq('site_id', SITE_ID).eq('category', FACILITIES_CATEGORY)

      for (let i = 0; i < defaultCampusFacilities.length; i++) {
        const f = defaultCampusFacilities[i]
        const caption = JSON.stringify({
          title: f.title,
          tag: f.tag,
          desc: f.desc,
          iconName: f.iconName,
        })
        await supabase.from('cms_gallery').insert({
          site_id: SITE_ID,
          category: FACILITIES_CATEGORY,
          image_url: f.image,
          caption,
          sort_order: i,
        })
      }
      await loadFacilities()
      alert('Default campus infrastructure cards loaded successfully!')
    } catch (err) {
      console.error('Error seeding facilities:', err)
    }
    setSaving(false)
  }

  /**
   * Downloads a sample CSV / Excel template for Facilities Cards bulk upload
   */
  function downloadSampleFacilitiesTemplate() {
    const sampleData = [
      {
        'Card Title': 'Smart Classrooms',
        'Badge / Tag': 'Acoustic Treated',
        'Facility Description': '85-inch interactive touchscreens, digital visualizers, and ergonomic seating.',
        'Image URL': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=450&fit=crop&auto=format',
        'Icon Symbol (Optional)': 'School',
      },
      {
        'Card Title': '1-on-1 Doubt Desks',
        'Badge / Tag': 'Daily 4:00 – 7:30 PM',
        'Facility Description': 'Private consultation booths for subject masters to resolve queries line-by-line.',
        'Image URL': 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=700&h=450&fit=crop&auto=format',
        'Icon Symbol (Optional)': 'Target',
      },
      {
        'Card Title': 'Silent Library',
        'Badge / Tag': '8 AM – 9 PM',
        'Facility Description': 'Air-conditioned study carrels with 15+ years of Cambridge, IB, CBSE & JEE archives.',
        'Image URL': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&h=450&fit=crop&auto=format',
        'Icon Symbol (Optional)': 'BookOpen',
      },
      {
        'Card Title': 'CBT Testing Lab',
        'Badge / Tag': 'Simulated Exams',
        'Facility Description': 'High-speed desktop terminals replicating real NTA JEE Main, NEET & Cambridge exams.',
        'Image URL': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&h=450&fit=crop&auto=format',
        'Icon Symbol (Optional)': 'Laptop',
      },
      {
        'Card Title': 'Biometric Attendance',
        'Badge / Tag': 'Instant Alerts',
        'Facility Description': 'Automated entry/exit timestamps sent to parents with weekly progress dashboards.',
        'Image URL': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&h=450&fit=crop&auto=format',
        'Icon Symbol (Optional)': 'Smartphone',
      },
      {
        'Card Title': 'GPS AC Transport',
        'Badge / Tag': 'Doorstep Pickup',
        'Facility Description': 'Safe, air-conditioned bus network with live GPS parent tracking across Jaipur.',
        'Image URL': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&h=450&fit=crop&auto=format',
        'Icon Symbol (Optional)': 'Bus',
      },
    ]

    const ws = XLSX.utils.json_to_sheet(sampleData)
    ws['!cols'] = [
      { wch: 24 },
      { wch: 20 },
      { wch: 48 },
      { wch: 45 },
      { wch: 22 },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Facilities Template')
    XLSX.writeFile(wb, 'Hodu_Campus_Facilities_Template.xlsx')
  }

  /**
   * Exports all current facilities to an Excel spreadsheet
   */
  function exportFacilitiesToExcel() {
    const data = facilities.map((f, idx) => ({
      'Card #': idx + 1,
      'Card Title': f.title || '',
      'Badge / Tag': f.tag || '',
      'Facility Description': f.desc || '',
      'Image URL': f.image || '',
      'Icon Symbol': f.iconName || 'School',
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    ws['!cols'] = [
      { wch: 8 },
      { wch: 24 },
      { wch: 20 },
      { wch: 48 },
      { wch: 45 },
      { wch: 18 },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Facilities')
    XLSX.writeFile(wb, 'Hodu_Campus_Facilities_Export.xlsx')
  }

  /**
   * Bulk Uploads CSV / Excel file to populate or add facility cards
   */
  function handleFacilitiesCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsName = wb.SheetNames[0]
        const ws = wb.Sheets[wsName]
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' })

        if (!rawJson || rawJson.length === 0) {
          alert('Uploaded CSV/Excel file is empty or contains no valid rows.')
          return
        }

        const parsedFacilities = rawJson.map((row: any, rIdx: number) => {
          const title = row['Card Title'] || row['Title'] || row['Facility Name'] || row['Facility'] || row['Name'] || Object.values(row)[0] || `Facility ${rIdx + 1}`
          const tag = row['Badge / Tag'] || row['Badge'] || row['Tag'] || row['Subtitle'] || 'FACILITIES'
          const desc = row['Facility Description'] || row['Description'] || row['Desc'] || row['Details'] || ''
          const image = row['Image URL'] || row['Photo URL'] || row['Photo'] || row['Image'] || row['image'] || row['photo'] || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700&h=450&fit=crop&auto=format'
          let iconName = row['Icon Symbol (Optional)'] || row['Icon Symbol'] || row['Icon'] || row['icon'] || 'School'

          // Normalize icon name
          if (!ICON_MAP[iconName]) {
            const match = ICON_OPTIONS.find(o => o.label.toLowerCase().includes(String(iconName).toLowerCase()) || o.value.toLowerCase() === String(iconName).toLowerCase())
            iconName = match ? match.value : 'School'
          }

          return {
            id: `csv-fac-${Date.now()}-${rIdx}`,
            title: String(title).trim(),
            tag: String(tag).trim(),
            desc: String(desc).trim(),
            image: String(image).trim(),
            iconName: String(iconName).trim(),
            sort_order: rIdx,
          }
        }).filter(f => f.title)

        if (parsedFacilities.length === 0) {
          alert('Could not find any valid facility records. Please check the CSV/Excel column headings.')
          return
        }

        setFacilities(parsedFacilities)
        setFacilitiesBulkNotice(`✅ Successfully imported ${parsedFacilities.length} facility cards from CSV/Excel!\nClick "Save Campus Changes" on top right to persist your changes.`)
        setTimeout(() => setFacilitiesBulkNotice(null), 7000)
      } catch (err) {
        console.error('Error parsing Facilities CSV/Excel:', err)
        alert('Failed to parse file. Please upload a valid .csv, .xlsx, or .xls file.')
      }
    }
    reader.readAsBinaryString(file)
    e.target.value = ''
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

    // Save slides
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

        if (String(slide.id).startsWith('init-') || String(slide.id).startsWith('new-')) {
          await supabase.from('cms_gallery').insert({
            site_id: SITE_ID,
            category: CAROUSEL_CATEGORY,
            image_url: fUrl,
            caption: cap,
            sort_order: idx,
          })
        } else {
          await supabase.from('cms_gallery').update({
            image_url: fUrl,
            caption: cap,
            sort_order: idx,
          }).eq('id', slide.id)
        }
      })
    )

    // Save facility cards
    await Promise.all(
      facilities.map(async (fac, idx) => {
        const cap = JSON.stringify({
          title: fac.title,
          tag: fac.tag,
          desc: fac.desc,
          iconName: fac.iconName || 'School',
        })

        if (String(fac.id).startsWith('init-') || String(fac.id).startsWith('new-') || String(fac.id).startsWith('csv-')) {
          await supabase.from('cms_gallery').insert({
            site_id: SITE_ID,
            category: FACILITIES_CATEGORY,
            image_url: fac.image,
            caption: cap,
            sort_order: idx,
          })
        } else {
          await supabase.from('cms_gallery').update({
            image_url: fac.image,
            caption: cap,
            sort_order: idx,
          }).eq('id', fac.id)
        }
      })
    )

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    loadSlides()
    loadFacilities()
  }

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
            Manage Jaipur Campus banner slides, infrastructure cards, CSV bulk uploads, YouTube tour video, and address.
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
          { id: 'facilities', label: '🏛️ Campus Infrastructure Cards (CSV Bulk Upload)' },
          { id: 'overview', label: '🎥 YouTube Virtual Tour Video' },
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
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 flex-wrap gap-3">
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
                            Slide {i + 1}
                          </span>
                          <div className="flex items-center bg-neutral-100 rounded-lg p-0.5 text-[10px] font-bold">
                            <button
                              type="button"
                              onClick={() => updateSlideLocal(slide.id, { mediaType: 'image' })}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                !isVideo ? 'bg-[#7E0D0D] text-white shadow-2xs' : 'text-neutral-600 hover:text-[#7E0D0D]'
                              }`}
                            >
                              Image
                            </button>
                            <button
                              type="button"
                              onClick={() => updateSlideLocal(slide.id, { mediaType: 'video' })}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                isVideo ? 'bg-[#7E0D0D] text-white shadow-2xs' : 'text-neutral-600 hover:text-[#7E0D0D]'
                              }`}
                            >
                              Drive Video
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveSlide(i, i - 1)}
                            disabled={i === 0}
                            className="p-1 rounded text-neutral-400 hover:text-[#1B2A44] hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                            title="Move Left"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSlide(i, i + 1)}
                            disabled={i === slides.length - 1}
                            className="p-1 rounded text-neutral-400 hover:text-[#1B2A44] hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                            title="Move Right"
                          >
                            <ArrowDown size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteSlide(slide.id)}
                            className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer ml-1"
                            title="Delete Slide"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Media selector & Upload */}
                      {!isVideo ? (
                        <div className="space-y-2">
                          <ImageUpload
                            value={slide.image_url || ''}
                            onChange={url => updateSlideLocal(slide.id, { image_url: url })}
                            label={`Slide ${i + 1} Image (1920x700 recommended)`}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="block text-[11px] font-bold text-[#1B2A44]">
                            Google Drive Video URL
                          </label>
                          <input
                            type="text"
                            value={slide.videoUrl || ''}
                            onChange={e => updateSlideLocal(slide.id, { videoUrl: e.target.value })}
                            placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                            className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white"
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── 2. CAMPUS INFRASTRUCTURE & FACILITIES CARDS (WITH BULK CSV UPLOAD) ─── */}
        {(activeTab === 'all' || activeTab === 'facilities') && (
          <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <School className="text-[#7E0D0D] h-5 w-5" />
                  <h3 className="font-bold text-[#1B2A44] text-base">Campus Infrastructure & Facilities Cards</h3>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Manage facility cards displayed under "Why Choose Hodu Academy" on the Jaipur Campus page ({facilities.length} Cards).
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={seedDefaultFacilities}
                  className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-2 rounded-xl transition-all cursor-pointer"
                  title="Reset to default 6 campus facilities"
                >
                  <Sparkles size={13} className="text-amber-600" />
                  <span>Reset Default 6 Cards</span>
                </button>

                <button
                  type="button"
                  onClick={addFacility}
                  className="flex items-center gap-1.5 text-xs bg-[#7E0D0D] hover:bg-[#922222] text-white font-bold px-3.5 py-2 rounded-xl transition-all shrink-0 shadow-xs cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Facility Card</span>
                </button>
              </div>
            </div>

            {/* ─── BULK CSV / EXCEL UPLOAD TOOLBAR ─── */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
                    <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                      CSV / Excel Bulk Upload For Campus Cards
                    </h4>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Upload a spreadsheet with Card Title, Badge, Description, Image URL, and Icon to populate all facility cards instantly.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Hidden CSV input */}
                  <input
                    ref={facilitiesCsvInputRef}
                    type="file"
                    accept=".csv, .xlsx, .xls"
                    className="hidden"
                    onChange={handleFacilitiesCsvUpload}
                  />

                  <button
                    type="button"
                    onClick={() => facilitiesCsvInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                  >
                    <FileUp size={14} />
                    <span>Upload CSV / Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={downloadSampleFacilitiesTemplate}
                    className="flex items-center gap-1 text-[11px] font-bold bg-white text-emerald-900 hover:bg-emerald-100/70 px-3 py-2 rounded-xl border border-emerald-300 transition-all cursor-pointer"
                    title="Download pre-formatted sample spreadsheet"
                  >
                    <Download size={13} />
                    <span>Sample Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={exportFacilitiesToExcel}
                    className="flex items-center gap-1 text-[11px] font-bold bg-white text-neutral-700 hover:bg-neutral-100 px-3 py-2 rounded-xl border border-neutral-300 transition-all cursor-pointer"
                    title="Export current facility cards to Excel"
                  >
                    <FileDown size={13} />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {facilitiesBulkNotice && (
                <div className="p-3 bg-white/95 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 whitespace-pre-line animate-fade-in shadow-2xs">
                  {facilitiesBulkNotice}
                </div>
              )}
            </div>

            {facilitiesLoading ? (
              <p className="text-xs text-neutral-500">Loading infrastructure cards…</p>
            ) : facilities.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-neutral-300 rounded-2xl space-y-2">
                <p className="text-xs text-neutral-500">No facility cards added yet.</p>
                <button onClick={addFacility} className="text-xs font-bold text-[#7E0D0D] hover:underline">+ Add First Card</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {facilities.map((fac, idx) => {
                  const CurrentIcon = ICON_MAP[fac.iconName] || School

                  return (
                    <div
                      key={fac.id || idx}
                      className="border border-[#F3DCDC] rounded-2xl p-4 bg-neutral-50/50 hover:bg-white transition-all shadow-2xs flex flex-col justify-between space-y-4"
                    >
                      {/* Top Action Bar */}
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-neutral-200">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-brand-blush text-brand-maroon flex items-center justify-center">
                            <CurrentIcon size={14} />
                          </div>
                          <span className="text-xs font-black text-[#1B2A44] uppercase">
                            Card #{idx + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveFacility(idx, idx - 1)}
                            disabled={idx === 0}
                            className="p-1 rounded text-neutral-400 hover:text-[#1B2A44] hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveFacility(idx, idx + 1)}
                            disabled={idx === facilities.length - 1}
                            className="p-1 rounded text-neutral-400 hover:text-[#1B2A44] hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteFacility(fac.id)}
                            className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer ml-1"
                            title="Delete Card"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <ImageUpload
                          value={fac.image || ''}
                          onChange={url => updateFacilityLocal(fac.id, { image: url })}
                          label="Facility Image (Upload or Paste Link)"
                        />
                      </div>

                      {/* Title & Tag */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-700 mb-1">
                            Card Title
                          </label>
                          <input
                            type="text"
                            value={fac.title}
                            onChange={e => updateFacilityLocal(fac.id, { title: e.target.value })}
                            placeholder="e.g. Smart Classrooms"
                            className="w-full border border-neutral-300 rounded-xl px-2.5 py-1.5 text-xs font-bold bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-neutral-700 mb-1">
                            Badge / Tag
                          </label>
                          <input
                            type="text"
                            value={fac.tag}
                            onChange={e => updateFacilityLocal(fac.id, { tag: e.target.value })}
                            placeholder="e.g. Acoustic Treated"
                            className="w-full border border-neutral-300 rounded-xl px-2.5 py-1.5 text-xs font-bold text-brand-maroon bg-white"
                          />
                        </div>
                      </div>

                      {/* Icon Selector */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 mb-1">
                          Icon Symbol
                        </label>
                        <select
                          value={fac.iconName || 'School'}
                          onChange={e => updateFacilityLocal(fac.id, { iconName: e.target.value })}
                          className="w-full border border-neutral-300 rounded-xl px-2.5 py-1.5 text-xs bg-white font-medium"
                        >
                          {ICON_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-700 mb-1">
                          Facility Description
                        </label>
                        <textarea
                          rows={2}
                          value={fac.desc}
                          onChange={e => updateFacilityLocal(fac.id, { desc: e.target.value })}
                          placeholder="Short description of this facility..."
                          className="w-full border border-neutral-300 rounded-xl px-2.5 py-1.5 text-xs bg-white leading-relaxed"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── 3. OVERVIEW & YOUTUBE VIRTUAL TOUR VIDEO ─── */}
        {(activeTab === 'all' || activeTab === 'overview') && (
          <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-[#1B2A44] text-base">Jaipur Campus Virtual Tour & Overview</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Embed the YouTube video or Google Drive walkthrough</p>
            </div>

            {/* Video Tour Link */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1B2A44]">
                Campus Walkthrough Video URL (YouTube / Google Drive)
              </label>
              <input
                type="text"
                value={form.videoUrl}
                onChange={e => set('videoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=Z3Gm-LVcB-E"
                className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs bg-white text-[#1B2A44] font-medium"
              />
              <p className="text-[11px] text-neutral-400">
                Supports YouTube URLs (e.g. https://www.youtube.com/watch?v=Z3Gm-LVcB-E) or Google Drive sharing links.
              </p>
            </div>
          </div>
        )}

        {/* ─── 4. TRUST PILLARS & STATS ─── */}
        {(activeTab === 'all' || activeTab === 'pillars') && (
          <div className="bg-white border border-[#F3DCDC] rounded-2xl p-6 space-y-5 shadow-2xs">
            <div className="border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-[#1B2A44] text-base">Campus Trust Pillars (3 Key Metrics)</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Displayed prominently across Jaipur Campus highlights</p>
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

        {/* ─── 5. ADDRESS & LOCATION ─── */}
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
