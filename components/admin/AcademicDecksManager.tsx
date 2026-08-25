'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
import * as XLSX from 'xlsx'
import {
  Trophy,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  Star,
  Layers,
  Palette,
  Users,
  X,
  Upload,
  Loader2,
  FileSpreadsheet,
  Download,
  FileUp,
  Zap,
  ArrowUpDown,
  FileDown,
  HelpCircle,
} from 'lucide-react'
import { ResultCategoryDeck, defaultResultsDecks } from '@/components/hodu/AcademicExcellenceResults'
import { normalizeImageUrl } from '@/lib/imageUtils'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'

const COLOR_PRESETS = [
  { label: 'Royal Blue', hex: '#1A6ECB', pillBg: 'bg-[#1A6ECB]', bgFrom: '#FFFDF0', bgVia: '#FFF8E1', bgTo: '#FFF3CD' },
  { label: 'Crimson Maroon', hex: '#7E0D0D', pillBg: 'bg-[#7E0D0D]', bgFrom: '#FFFDF5', bgVia: '#FFF1F1', bgTo: '#FFE4E4' },
  { label: 'Emerald Green', hex: '#059669', pillBg: 'bg-[#059669]', bgFrom: '#F0FDF4', bgVia: '#DCFCE7', bgTo: '#BBF7D0' },
  { label: 'Royal Purple', hex: '#8B5CF6', pillBg: 'bg-[#8B5CF6]', bgFrom: '#FAF5FF', bgVia: '#F3E8FF', bgTo: '#E9D5FF' },
  { label: 'Sunset Orange', hex: '#EA580C', pillBg: 'bg-[#EA580C]', bgFrom: '#FFF7ED', bgVia: '#FFEDD5', bgTo: '#FED7AA' },
  { label: 'Golden Amber', hex: '#D97706', pillBg: 'bg-[#D97706]', bgFrom: '#FFFBEB', bgVia: '#FEF3C7', bgTo: '#FDE68A' },
]

/**
 * Robust score parsing and numeric conversion for rank evaluation.
 * Supports:
 * - Percentages: 99.6%, 98.4
 * - Marks Ratio: 710/720, 44/45, 98/100
 * - AIR / Rank: AIR 1, Rank 3, #1
 * - Letter Grades: 8x A*, 7 A*
 * - Percentiles: 99.85 %ile
 */
export function parseScoreToNumeric(scoreRaw: any): number {
  if (scoreRaw === undefined || scoreRaw === null) return 0
  const str = String(scoreRaw).trim()
  if (!str) return 0

  // 1. AIR or Rank check: "AIR 1", "AIR 42", "Rank 3", "#1"
  const airMatch = str.match(/(?:AIR|Rank|#)\s*(\d+)/i)
  if (airMatch) {
    const rankNum = parseFloat(airMatch[1])
    return 10000 - rankNum // Lower rank number = higher score (Rank 1 -> 9999, Rank 2 -> 9998)
  }

  // 2. Ratio check: "710/720", "44/45", "98/100"
  const ratioMatch = str.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/)
  if (ratioMatch) {
    const num = parseFloat(ratioMatch[1])
    const den = parseFloat(ratioMatch[2])
    if (den > 0) return (num / den) * 100
  }

  // 3. A* grade count: "8x A*", "9 A*"
  const gradeMatch = str.match(/(\d+)\s*x?\s*A\*/i)
  if (gradeMatch) {
    return 90 + parseFloat(gradeMatch[1])
  }

  // 4. Percentage or Percentile: "99.6%", "99.85 %ile", "98.4"
  const cleanNum = str.replace(/[%ilePercentile]/gi, '').trim()
  const numVal = parseFloat(cleanNum)
  return isNaN(numVal) ? 0 : numVal
}

/**
 * Automatically sorts students in descending rank order and assigns the #1 student as Spotlight Topper
 */
export function autoEvaluateAndSortStudents(allStudents: any[]): { topRanker: any; performers: any[] } {
  if (!allStudents || allStudents.length === 0) {
    return {
      topRanker: { name: 'Top Student', score: '99.6%', photo: '', initials: 'TS', designation: 'Batch Topper' },
      performers: [],
    }
  }

  // Sort descending by calculated score
  const sorted = [...allStudents].sort((a, b) => {
    const scoreA = parseScoreToNumeric(a.score || a.rank_or_marks || a.marks)
    const scoreB = parseScoreToNumeric(b.score || b.rank_or_marks || b.marks)
    return scoreB - scoreA
  })

  const top = sorted[0]
  const rest = sorted.slice(1)

  return {
    topRanker: {
      name: top.name || 'Top Ranker',
      score: top.score || top.rank_or_marks || top.marks || '99.6%',
      photo: top.photo || top.photo_url || '',
      initials: (top.name || 'TR').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
      designation: top.designation || 'Batch Topper (Rank 1)',
    },
    performers: rest.map((s, idx) => ({
      name: s.name || `Student ${idx + 2}`,
      score: s.score || s.rank_or_marks || s.marks || '95%+',
      photo: s.photo || s.photo_url || '',
      initials: (s.name || `S${idx + 2}`).split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
      designation: s.designation || `Rank ${idx + 2}`,
    })),
  }
}

export default function AcademicDecksManager() {
  const supabase = createClient()
  const [decks, setDecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDeck, setEditingDeck] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedNotice, setSavedNotice] = useState<string | null>(null)
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)
  const [bulkNotice, setBulkNotice] = useState<string | null>(null)
  const excelInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadDecks()
  }, [])

  async function loadDecks() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('cms_gallery')
        .select('*')
        .eq('site_id', SITE_ID)
        .eq('category', 'Academic Excellence Decks')
        .order('sort_order')

      if (data && data.length > 0) {
        setDecks(
          data.map(row => {
            let parsed: any = {}
            try {
              parsed = typeof row.caption === 'string' ? JSON.parse(row.caption) : (row.caption || {})
            } catch {}

            return {
              id: row.id,
              sort_order: row.sort_order ?? 0,
              tabLabel: parsed.tabLabel || 'Result Deck',
              cardTitle: parsed.cardTitle || 'EXCELLENCE RESULTS 2026',
              themeColor: parsed.themeColor || '#1A6ECB',
              pillBg: parsed.pillBg || 'bg-[#1A6ECB]',
              bgFrom: parsed.bgFrom || '#FFFDF0',
              bgVia: parsed.bgVia || '#FFF8E1',
              bgTo: parsed.bgTo || '#FFF3CD',
              is_featured_on_home: parsed.is_featured_on_home !== false,
              topRanker: parsed.topRanker || {
                name: 'Student Name',
                score: '99.6%',
                photo: row.image_url || '',
                initials: 'SN',
                designation: 'Batch Topper',
              },
              performers: Array.isArray(parsed.performers) ? parsed.performers : [],
            }
          })
        )
      } else {
        setDecks([])
      }
    } catch (err) {
      console.error('Error loading academic decks:', err)
    }
    setLoading(false)
  }

  async function seedDefaultDecks() {
    if (!confirm('Populate the initial default result decks from Hodu Academy?')) return
    setSaving(true)
    try {
      for (let i = 0; i < defaultResultsDecks.length; i++) {
        const d = defaultResultsDecks[i]
        const caption = JSON.stringify({
          tabLabel: d.tabLabel,
          cardTitle: d.cardTitle,
          themeColor: d.themeColor || '#1A6ECB',
          pillBg: d.pillBg || 'bg-[#1A6ECB]',
          bgFrom: '#FFFDF0',
          bgVia: '#FFF8E1',
          bgTo: '#FFF3CD',
          is_featured_on_home: true,
          topRanker: d.topRanker,
          performers: d.performers,
        })

        await supabase.from('cms_gallery').insert({
          site_id: SITE_ID,
          category: 'Academic Excellence Decks',
          image_url: d.topRanker.photo || '',
          caption,
          sort_order: i,
        })
      }
      await loadDecks()
      setSavedNotice('Default decks seeded successfully!')
      setTimeout(() => setSavedNotice(null), 3000)
    } catch (err) {
      console.error('Error seeding default decks:', err)
    }
    setSaving(false)
  }

  function createNewDeck() {
    setEditingDeck({
      id: null,
      tabLabel: 'Class 12 CBSE',
      cardTitle: 'CBSE CLASS 12TH RESULT 2026',
      themeColor: '#1A6ECB',
      pillBg: 'bg-[#1A6ECB]',
      bgFrom: '#FFFDF0',
      bgVia: '#FFF8E1',
      bgTo: '#FFF3CD',
      is_featured_on_home: true,
      topRanker: {
        name: 'Sonakshi Goyal',
        score: '99.6%',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&auto=format',
        initials: 'SG',
        designation: 'Batch Topper',
      },
      performers: [
        { name: 'Divya Gupta', score: '99.4%', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&auto=format', initials: 'DG' },
        { name: 'Aarav Sharma', score: '710/720', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format', initials: 'AS' },
        { name: 'Advait Vyas', score: '99.0%', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format', initials: 'AV' },
        { name: 'Rhea Biyani', score: '98.8%', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&auto=format', initials: 'RB' },
        { name: 'Samarth Jain', score: '98.6%', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&auto=format', initials: 'SJ' },
      ],
    })
    setIsModalOpen(true)
  }

  function openEditDeck(deck: any) {
    setEditingDeck({
      ...deck,
      topRanker: deck.topRanker ? { ...deck.topRanker } : { name: '', score: '', photo: '', initials: 'TR', designation: 'Batch Topper' },
      performers: Array.isArray(deck.performers) ? deck.performers.map((p: any) => ({ ...p })) : [],
    })
    setIsModalOpen(true)
  }

  async function saveDeck() {
    if (!editingDeck) return
    setSaving(true)

    const caption = JSON.stringify({
      tabLabel: editingDeck.tabLabel,
      cardTitle: editingDeck.cardTitle,
      themeColor: editingDeck.themeColor,
      pillBg: editingDeck.pillBg,
      bgFrom: editingDeck.bgFrom,
      bgVia: editingDeck.bgVia,
      bgTo: editingDeck.bgTo,
      is_featured_on_home: editingDeck.is_featured_on_home,
      topRanker: editingDeck.topRanker,
      performers: editingDeck.performers,
    })

    if (editingDeck.id) {
      await supabase
        .from('cms_gallery')
        .update({
          image_url: editingDeck.topRanker?.photo || '',
          caption,
        })
        .eq('id', editingDeck.id)
    } else {
      const nextOrder = decks.length > 0 ? Math.max(...decks.map(d => d.sort_order ?? 0)) + 1 : 0
      await supabase.from('cms_gallery').insert({
        site_id: SITE_ID,
        category: 'Academic Excellence Decks',
        image_url: editingDeck.topRanker?.photo || '',
        caption,
        sort_order: nextOrder,
      })
    }

    await loadDecks()
    setSaving(false)
    setIsModalOpen(false)
    setSavedNotice('Deck saved successfully!')
    setTimeout(() => setSavedNotice(null), 3000)
  }

  async function deleteDeck(id: string) {
    if (!confirm('Are you sure you want to delete this result deck?')) return
    await supabase.from('cms_gallery').delete().eq('id', id)
    setDecks(prev => prev.filter(d => d.id !== id))
  }

  async function moveDeck(idx: number, dir: -1 | 1) {
    const targetIdx = idx + dir
    if (targetIdx < 0 || targetIdx >= decks.length) return
    const reordered = [...decks]
    const temp = reordered[idx]
    reordered[idx] = reordered[targetIdx]
    reordered[targetIdx] = temp

    setDecks(reordered)
    for (let i = 0; i < reordered.length; i++) {
      await supabase.from('cms_gallery').update({ sort_order: i }).eq('id', reordered[i].id)
    }
  }

  // Edit Helper
  function setTopRanker(field: string, val: string) {
    setEditingDeck((prev: any) => ({
      ...prev,
      topRanker: { ...prev.topRanker, [field]: val },
    }))
  }

  function setPerformer(index: number, field: string, val: string) {
    setEditingDeck((prev: any) => {
      const updated = [...prev.performers]
      updated[index] = { ...updated[index], [field]: val }
      return { ...prev, performers: updated }
    })
  }

  function addPerformer() {
    setEditingDeck((prev: any) => ({
      ...prev,
      performers: [
        ...prev.performers,
        { name: `Student ${prev.performers.length + 1}`, score: '95%+', photo: '', initials: 'ST' },
      ],
    }))
  }

  function removePerformer(index: number) {
    setEditingDeck((prev: any) => {
      const updated = [...prev.performers]
      updated.splice(index, 1)
      return { ...prev, performers: updated }
    })
  }

  async function handleStudentPhotoFile(sIdx: number, file: File) {
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      alert('File too large. Max size: 10MB')
      return
    }

    setUploadingIdx(sIdx)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'results')

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setPerformer(sIdx, 'photo', data.url)
      } else {
        alert(data.error ?? 'Upload failed.')
      }
    } catch {
      alert('Upload failed. Check your connection.')
    }
    setUploadingIdx(null)
  }

  /**
   * Evaluates all currently entered students rank-wise and reorders them
   */
  function handleAutoSortCurrentDeck() {
    if (!editingDeck) return
    const all = [
      ...(editingDeck.topRanker?.name ? [editingDeck.topRanker] : []),
      ...(editingDeck.performers || []),
    ]

    if (all.length === 0) {
      alert('No students entered yet to sort.')
      return
    }

    const evaluated = autoEvaluateAndSortStudents(all)
    setEditingDeck((prev: any) => ({
      ...prev,
      topRanker: evaluated.topRanker,
      performers: evaluated.performers,
    }))

    setBulkNotice(`⚡ Evaluated & Sorted ${all.length} students rank-wise! (Top: ${evaluated.topRanker.name} - ${evaluated.topRanker.score})`)
    setTimeout(() => setBulkNotice(null), 5000)
  }

  /**
   * Downloads a pre-formatted sample Excel template for bulk upload
   */
  function downloadSampleExcelTemplate() {
    const sampleData = [
      {
        'Student Name': 'Sonakshi Goyal',
        'Marks / Score': '99.6%',
        'Photo URL (Optional)': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        'Designation / Note (Optional)': 'Batch Topper (Rank 1)',
      },
      {
        'Student Name': 'Divya Gupta',
        'Marks / Score': '99.4%',
        'Photo URL (Optional)': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
        'Designation / Note (Optional)': 'State Rank 1',
      },
      {
        'Student Name': 'Aarav Sharma',
        'Marks / Score': '710/720',
        'Photo URL (Optional)': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'Designation / Note (Optional)': 'AIR 14',
      },
      {
        'Student Name': 'Advait Vyas',
        'Marks / Score': '99.0%',
        'Photo URL (Optional)': '',
        'Designation / Note (Optional)': 'District Topper',
      },
      {
        'Student Name': 'Rhea Biyani',
        'Marks / Score': '98.8%',
        'Photo URL (Optional)': '',
        'Designation / Note (Optional)': '',
      },
      {
        'Student Name': 'Samarth Jain',
        'Marks / Score': '98.6%',
        'Photo URL (Optional)': '',
        'Designation / Note (Optional)': '',
      },
      {
        'Student Name': 'Isha Kothari',
        'Marks / Score': '98.4%',
        'Photo URL (Optional)': '',
        'Designation / Note (Optional)': '',
      },
      {
        'Student Name': 'Ritik Mittal',
        'Marks / Score': '98.2%',
        'Photo URL (Optional)': '',
        'Designation / Note (Optional)': '',
      },
      {
        'Student Name': 'Tanisha Roy',
        'Marks / Score': '98.0%',
        'Photo URL (Optional)': '',
        'Designation / Note (Optional)': '',
      },
      {
        'Student Name': 'Kunal Saini',
        'Marks / Score': '97.8%',
        'Photo URL (Optional)': '',
        'Designation / Note (Optional)': '',
      },
      {
        'Student Name': 'Bhoomika Suri',
        'Marks / Score': '97.6%',
        'Photo URL (Optional)': '',
        'Designation / Note (Optional)': '',
      },
    ]

    const ws = XLSX.utils.json_to_sheet(sampleData)
    // Auto-fit column widths
    ws['!cols'] = [
      { wch: 22 },
      { wch: 16 },
      { wch: 45 },
      { wch: 28 },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Results Template')
    XLSX.writeFile(wb, 'Hodu_Result_Deck_Bulk_Template.xlsx')
  }

  /**
   * Exports the current deck's toppers and performers as an Excel spreadsheet
   */
  function exportCurrentDeckToExcel() {
    if (!editingDeck) return
    const allStudents = [
      {
        'Rank': 'Top Ranker (1)',
        'Student Name': editingDeck.topRanker?.name || '',
        'Marks / Score': editingDeck.topRanker?.score || '',
        'Designation': editingDeck.topRanker?.designation || 'Batch Topper',
        'Photo URL': editingDeck.topRanker?.photo || '',
      },
      ...(editingDeck.performers || []).map((p: any, idx: number) => ({
        'Rank': idx + 2,
        'Student Name': p.name || '',
        'Marks / Score': p.score || '',
        'Designation': p.designation || `Rank ${idx + 2}`,
        'Photo URL': p.photo || '',
      }))
    ]

    const ws = XLSX.utils.json_to_sheet(allStudents)
    ws['!cols'] = [
      { wch: 14 },
      { wch: 22 },
      { wch: 16 },
      { wch: 25 },
      { wch: 45 },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Achievers')
    const fileName = `${(editingDeck.tabLabel || 'Result_Deck').replace(/[^a-zA-Z0-9_-]/g, '_')}_Achievers.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  /**
   * Bulk Uploads Excel (.xlsx, .xls, .csv), automatically parses, evaluates scores, and sorts rank-wise
   */
  function handleExcelUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
          alert('Uploaded file is empty or has no valid rows.')
          return
        }

        // Map column names flexibly
        const parsedStudents = rawJson.map((row: any, rIdx: number) => {
          const name = row['Student Name'] || row['Name'] || row['student_name'] || row['student'] || row['Student'] || Object.values(row)[0] || `Student ${rIdx + 1}`
          const score = row['Marks / Score'] || row['Marks'] || row['Score'] || row['Rank'] || row['Percentage'] || row['marks'] || row['score'] || row['rank'] || '95%'
          const photo = row['Photo URL (Optional)'] || row['Photo URL'] || row['Photo'] || row['Image URL'] || row['Image'] || row['photo'] || row['photo_url'] || ''
          const designation = row['Designation / Note (Optional)'] || row['Designation'] || row['Title'] || row['designation'] || ''

          return {
            name: String(name).trim(),
            score: String(score).trim(),
            photo: String(photo).trim(),
            designation: String(designation).trim(),
          }
        }).filter(s => s.name)

        if (parsedStudents.length === 0) {
          alert('Could not find any student records. Please check the Excel column format.')
          return
        }

        // Auto-evaluate and sort rank-wise!
        const evaluated = autoEvaluateAndSortStudents(parsedStudents)

        setEditingDeck((prev: any) => ({
          ...prev,
          topRanker: evaluated.topRanker,
          performers: evaluated.performers,
        }))

        setBulkNotice(`✅ Successfully evaluated ${parsedStudents.length} students from Excel!\n• Top Ranker: ${evaluated.topRanker.name} (${evaluated.topRanker.score})\n• Achievers: ${evaluated.performers.length} students automatically sorted in rank order.`)
        setTimeout(() => setBulkNotice(null), 6000)
      } catch (err) {
        console.error('Error parsing Excel:', err)
        alert('Failed to parse the Excel file. Please ensure it is a valid .xlsx or .csv file.')
      }
    }
    reader.readAsBinaryString(file)
    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-brand-maroon" />
            <h3 className="font-serif-editorial text-lg font-bold text-neutral-900">
              Academic Excellence Result Decks & Templates
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Build custom banner cards with category tabs, theme color palettes, top spotlight rankers, and 10+ student performer grids.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {decks.length === 0 && (
            <button
              onClick={seedDefaultDecks}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 px-4 py-2.5 rounded-xl border border-amber-300 transition-all cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-600" />
              <span>Seed Default Decks</span>
            </button>
          )}

          <button
            onClick={createNewDeck}
            className="flex items-center gap-2 text-xs font-bold bg-brand-maroon hover:bg-[#922222] text-white px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus size={16} />
            <span>Create New Result Deck</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-4 py-3 rounded-xl animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Decks Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-neutral-400">Loading result decks…</div>
      ) : decks.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center space-y-3">
          <Trophy className="h-10 w-10 text-neutral-300 mx-auto" />
          <h4 className="text-sm font-bold text-neutral-700">No Custom Result Decks Yet</h4>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Click "Seed Default Decks" to populate Hodu Academy's standard CBSE, NEET, JEE, and Cambridge result templates, or create a brand new custom deck.
          </p>
          <button
            onClick={seedDefaultDecks}
            className="text-xs font-bold text-brand-maroon underline"
          >
            Seed Default Decks
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {decks.map((deck, idx) => (
            <div
              key={deck.id || idx}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Card Header with Custom Theme Color Banner */}
              <div
                className="p-4 text-white relative overflow-hidden"
                style={{
                  backgroundColor: deck.themeColor || '#1A6ECB',
                }}
              >
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-black/25 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    {deck.tabLabel}
                  </span>

                  <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                    <Star size={10} className="text-amber-300" />
                    <span>{deck.is_featured_on_home ? 'Featured on Home' : 'Results Page Only'}</span>
                  </div>
                </div>

                <h4 className="font-serif-editorial text-base font-black tracking-tight mt-2 text-white line-clamp-1">
                  {deck.cardTitle}
                </h4>
              </div>

              {/* Topper Spotlight Preview */}
              <div className="p-4 bg-neutral-50/70 border-b border-neutral-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-amber-300 shrink-0 shadow-2xs">
                  {deck.topRanker?.photo ? (
                    <img
                      src={normalizeImageUrl(deck.topRanker.photo)}
                      alt={deck.topRanker.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs text-brand-maroon bg-brand-blush">
                      {deck.topRanker?.initials || 'TR'}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded uppercase">
                      Top Spotlight
                    </span>
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: deck.themeColor || '#1A6ECB' }}
                    >
                      {deck.topRanker?.score || '99.6%'}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-neutral-900 truncate mt-0.5">
                    {deck.topRanker?.name || 'Student Name'}
                  </h5>
                  <p className="text-[10px] text-neutral-500 truncate">
                    {deck.topRanker?.designation || 'Batch Topper'}
                  </p>
                </div>
              </div>

              {/* Performers Preview & Count */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 font-medium">Performers Grid:</span>
                  <span className="font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded-md">
                    {deck.performers?.length || 0} Students
                  </span>
                </div>

                {deck.performers && deck.performers.length > 0 && (
                  <div className="flex items-center gap-1 overflow-hidden pt-1">
                    {deck.performers.slice(0, 6).map((p: any, pIdx: number) => (
                      <div
                        key={pIdx}
                        className="w-7 h-7 rounded-full overflow-hidden bg-neutral-200 border border-white shrink-0 shadow-2xs"
                        title={`${p.name} (${p.score})`}
                      >
                        {p.photo ? (
                          <img
                            src={normalizeImageUrl(p.photo)}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-neutral-600 bg-neutral-100">
                            {p.initials || 'S'}
                          </div>
                        )}
                      </div>
                    ))}
                    {deck.performers.length > 6 && (
                      <span className="text-[10px] font-bold text-neutral-500 pl-1">
                        +{deck.performers.length - 6} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveDeck(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-neutral-200 hover:bg-white disabled:opacity-30 cursor-pointer"
                    title="Move Left/Up"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => moveDeck(idx, 1)}
                    disabled={idx === decks.length - 1}
                    className="p-1.5 rounded-lg border border-neutral-200 hover:bg-white disabled:opacity-30 cursor-pointer"
                    title="Move Right/Down"
                  >
                    <ArrowDown size={12} />
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditDeck(deck)}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-white border border-neutral-300 hover:border-brand-maroon text-brand-maroon shadow-2xs transition-colors cursor-pointer"
                  >
                    <Pencil size={12} />
                    <span>Customize</span>
                  </button>
                  <button
                    onClick={() => deleteDeck(deck.id)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                    title="Delete Deck"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── CUSTOMIZE DECK MODAL WITH BULK EXCEL UPLOAD ─── */}
      {isModalOpen && editingDeck && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200 animate-scale-up">
            
            {/* Modal Header */}
            <div
              className="p-5 text-white flex items-center justify-between transition-colors"
              style={{ backgroundColor: editingDeck.themeColor || '#1A6ECB' }}
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-black/25 px-2.5 py-0.5 rounded-full">
                  Result Deck Template Builder
                </span>
                <h3 className="font-serif-editorial text-lg font-bold mt-1">
                  Customize {editingDeck.tabLabel || 'Result Deck'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-black/20 text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
              
              {/* Row 1: Tab Label & Card Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Tab Label (e.g. Class 12 CBSE / NEET UG 2026)
                  </label>
                  <input
                    type="text"
                    value={editingDeck.tabLabel}
                    onChange={(e) => setEditingDeck({ ...editingDeck, tabLabel: e.target.value })}
                    placeholder="Tab Label"
                    className="w-full text-xs font-medium border border-neutral-300 rounded-xl px-3 py-2 outline-none focus:border-brand-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Card Title (e.g. CBSE CLASS 12TH RESULT 2026)
                  </label>
                  <input
                    type="text"
                    value={editingDeck.cardTitle}
                    onChange={(e) => setEditingDeck({ ...editingDeck, cardTitle: e.target.value })}
                    placeholder="Banner Headline Title"
                    className="w-full text-xs font-bold border border-neutral-300 rounded-xl px-3 py-2 outline-none focus:border-brand-maroon"
                  />
                </div>
              </div>

              {/* Row 2: Theme Color Palette & Feature Checkbox */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800">
                      Card Theme Color & Badge Accent
                    </label>
                    <p className="text-[11px] text-neutral-500">
                      Choose a curated preset or enter a custom hex color code.
                    </p>
                  </div>

                  <label className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-neutral-200 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingDeck.is_featured_on_home}
                      onChange={(e) => setEditingDeck({ ...editingDeck, is_featured_on_home: e.target.checked })}
                      className="w-4 h-4 text-brand-maroon rounded focus:ring-brand-maroon"
                    />
                    <span className="text-xs font-bold text-brand-maroon">
                      Feature on Homepage
                    </span>
                  </label>
                </div>

                {/* Color Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setEditingDeck({
                        ...editingDeck,
                        themeColor: preset.hex,
                        pillBg: preset.pillBg,
                        bgFrom: preset.bgFrom,
                        bgVia: preset.bgVia,
                        bgTo: preset.bgTo,
                      })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        editingDeck.themeColor === preset.hex
                          ? 'border-neutral-900 bg-white shadow-xs'
                          : 'border-transparent bg-white/70 hover:bg-white'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.hex }} />
                      <span>{preset.label}</span>
                    </button>
                  ))}

                  {/* Custom Hex */}
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-neutral-300">
                    <span className="text-[10px] font-bold text-neutral-500">HEX:</span>
                    <input
                      type="text"
                      value={editingDeck.themeColor}
                      onChange={(e) => setEditingDeck({ ...editingDeck, themeColor: e.target.value })}
                      className="w-20 text-xs font-mono font-bold outline-none uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* ─── BULK EXCEL UPLOAD & AUTO-EVALUATION TOOLBAR ─── */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
                      <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                        Excel Bulk Upload & Auto Rank Evaluation
                      </h4>
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      Upload an Excel spreadsheet with student marks/scores. The system will <strong>automatically evaluate scores, pick the #1 Top Ranker</strong>, and sort the Achievers Grid rank-wise!
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Hidden Excel input */}
                    <input
                      ref={excelInputRef}
                      type="file"
                      accept=".xlsx, .xls, .csv"
                      className="hidden"
                      onChange={handleExcelUpload}
                    />

                    <button
                      type="button"
                      onClick={() => excelInputRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      <FileUp size={14} />
                      <span>Upload Excel / CSV</span>
                    </button>

                    <button
                      type="button"
                      onClick={downloadSampleExcelTemplate}
                      className="flex items-center gap-1 text-[11px] font-bold bg-white text-emerald-900 hover:bg-emerald-100/70 px-3 py-2 rounded-xl border border-emerald-300 transition-all cursor-pointer"
                      title="Download sample spreadsheet template"
                    >
                      <Download size={13} />
                      <span>Sample Template</span>
                    </button>

                    <button
                      type="button"
                      onClick={exportCurrentDeckToExcel}
                      className="flex items-center gap-1 text-[11px] font-bold bg-white text-neutral-700 hover:bg-neutral-100 px-3 py-2 rounded-xl border border-neutral-300 transition-all cursor-pointer"
                      title="Export current deck students to Excel"
                    >
                      <FileDown size={13} />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                {bulkNotice && (
                  <div className="p-3 bg-white/90 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 whitespace-pre-line animate-fade-in shadow-2xs">
                    {bulkNotice}
                  </div>
                )}
              </div>

              {/* Section 1: Top Ranker (Spotlight Topper) */}
              <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-600" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                      Top Ranker (Spotlight Topper)
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded">
                    Auto-Selected Highest Score
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  <div className="sm:col-span-4">
                    <ImageUpload
                      value={editingDeck.topRanker?.photo || ''}
                      onChange={(url) => setTopRanker('photo', url)}
                      label="Topper Photo (Upload or Paste Link)"
                    />
                  </div>

                  <div className="sm:col-span-8 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Student Full Name
                        </label>
                        <input
                          type="text"
                          value={editingDeck.topRanker?.name || ''}
                          onChange={(e) => setTopRanker('name', e.target.value)}
                          placeholder="e.g. Sonakshi Goyal"
                          className="w-full text-xs font-bold border border-neutral-300 rounded-xl px-3 py-2 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                          Score / Percentage / Rank (e.g. 99.6% / AIR 142)
                        </label>
                        <input
                          type="text"
                          value={editingDeck.topRanker?.score || ''}
                          onChange={(e) => setTopRanker('score', e.target.value)}
                          placeholder="e.g. 99.6%"
                          className="w-full text-xs font-black border border-neutral-300 rounded-xl px-3 py-2 bg-white text-brand-maroon"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                        Badge Subtitle / Designation
                      </label>
                      <input
                        type="text"
                        value={editingDeck.topRanker?.designation || 'Batch Topper'}
                        onChange={(e) => setTopRanker('designation', e.target.value)}
                        placeholder="e.g. Batch Topper / All India Rank 1"
                        className="w-full text-xs border border-neutral-300 rounded-xl px-3 py-2 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Achievers / Performers Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-maroon" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
                      Achievers Grid ({editingDeck.performers?.length || 0} Students)
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAutoSortCurrentDeck}
                      className="flex items-center gap-1 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-300 transition-colors cursor-pointer"
                      title="Sort all students by score from highest to lowest"
                    >
                      <Zap size={13} className="text-amber-600" />
                      <span>⚡ Auto-Sort Rank-Wise</span>
                    </button>

                    <button
                      type="button"
                      onClick={addPerformer}
                      className="flex items-center gap-1 text-xs font-bold text-brand-maroon hover:bg-brand-blush px-3 py-1.5 rounded-xl border border-brand-maroon/30 transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Student</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
                  {editingDeck.performers?.map((student: any, sIdx: number) => (
                    <div
                      key={sIdx}
                      className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 relative flex items-start gap-3 hover:border-brand-maroon/40 transition-colors"
                    >
                      {/* Photo Upload / Avatar with local file button */}
                      <div className="w-16 shrink-0 flex flex-col items-center gap-1.5">
                        <label
                          htmlFor={`student-file-input-${sIdx}`}
                          className="relative w-14 h-14 rounded-full overflow-hidden bg-white border-2 border-dashed border-neutral-300 hover:border-brand-maroon cursor-pointer group shadow-2xs transition-all flex items-center justify-center"
                          title="Click to upload student photo from computer"
                        >
                          {uploadingIdx === sIdx ? (
                            <div className="w-full h-full bg-brand-maroon/10 flex items-center justify-center">
                              <Loader2 className="w-5 h-5 text-brand-maroon animate-spin" />
                            </div>
                          ) : student.photo ? (
                            <>
                              <img
                                src={normalizeImageUrl(student.photo)}
                                alt={student.name}
                                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <Upload size={14} />
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 group-hover:text-brand-maroon transition-colors">
                              <Upload size={14} />
                              <span className="text-[9px] font-bold mt-0.5">#{sIdx + 2}</span>
                            </div>
                          )}
                        </label>

                        {/* Hidden file input */}
                        <input
                          id={`student-file-input-${sIdx}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleStudentPhotoFile(sIdx, file)
                            e.target.value = ''
                          }}
                        />

                        <label
                          htmlFor={`student-file-input-${sIdx}`}
                          className="text-[10px] font-bold text-brand-maroon hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <Upload size={10} />
                          <span>{student.photo ? 'Change' : 'Upload'}</span>
                        </label>
                      </div>

                      {/* Name, Score & Photo Link Inputs */}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-black text-neutral-400">#{sIdx + 2}</span>
                          <input
                            type="text"
                            value={student.name}
                            onChange={(e) => setPerformer(sIdx, 'name', e.target.value)}
                            placeholder="Student Name"
                            className="w-full text-xs font-bold border border-neutral-300 rounded-lg px-2 py-1 bg-white text-neutral-900"
                          />
                        </div>

                        <input
                          type="text"
                          value={student.score}
                          onChange={(e) => setPerformer(sIdx, 'score', e.target.value)}
                          placeholder="Score (e.g. 98.4%)"
                          className="w-full text-xs font-black text-brand-maroon border border-neutral-300 rounded-lg px-2 py-1 bg-white"
                        />

                        <input
                          type="text"
                          value={student.photo || ''}
                          onChange={(e) => setPerformer(sIdx, 'photo', e.target.value)}
                          placeholder="Photo link or Drive URL"
                          className="w-full text-[10px] text-neutral-500 border border-neutral-200 rounded-lg px-2 py-0.5 bg-white truncate"
                        />
                      </div>

                      {/* Remove Student */}
                      <button
                        type="button"
                        onClick={() => removePerformer(sIdx)}
                        className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                        title="Remove student"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-neutral-200 bg-neutral-50">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 cursor-pointer transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveDeck}
                disabled={saving}
                className="flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl bg-brand-maroon hover:bg-[#922222] text-white disabled:opacity-50 shadow-xs cursor-pointer transition-all"
              >
                <Check size={16} />
                <span>{saving ? 'Saving Deck…' : 'Save Result Deck'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
