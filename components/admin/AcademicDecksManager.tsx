'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/admin/ImageUpload'
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

export default function AcademicDecksManager() {
  const supabase = createClient()
  const [decks, setDecks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingDeck, setEditingDeck] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedNotice, setSavedNotice] = useState<string | null>(null)
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)

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
      setSavedNotice('Default templates seeded successfully!')
      setTimeout(() => setSavedNotice(null), 3000)
    } catch (e) {
      console.error(e)
    }
    setSaving(false)
  }

  function openCreateModal() {
    setEditingDeck({
      id: null,
      tabLabel: 'New Exam Result',
      cardTitle: 'EXAM RESULT 2026',
      themeColor: '#1A6ECB',
      pillBg: 'bg-[#1A6ECB]',
      bgFrom: '#FFFDF0',
      bgVia: '#FFF8E1',
      bgTo: '#FFF3CD',
      is_featured_on_home: true,
      topRanker: {
        name: 'Student Name',
        score: '99.6%',
        photo: '',
        initials: 'SN',
        designation: 'Batch Topper',
      },
      performers: [
        { name: 'Student 1', score: '98.6%', photo: '', initials: 'S1' },
        { name: 'Student 2', score: '98.4%', photo: '', initials: 'S2' },
        { name: 'Student 3', score: '98.2%', photo: '', initials: 'S3' },
        { name: 'Student 4', score: '98.0%', photo: '', initials: 'S4' },
        { name: 'Student 5', score: '97.8%', photo: '', initials: 'S5' },
      ],
    })
    setIsModalOpen(true)
  }

  function openEditModal(deck: any) {
    setEditingDeck(JSON.parse(JSON.stringify(deck)))
    setIsModalOpen(true)
  }

  async function toggleFeaturedHome(deck: any) {
    const updatedStatus = !deck.is_featured_on_home
    const caption = JSON.stringify({
      tabLabel: deck.tabLabel,
      cardTitle: deck.cardTitle,
      themeColor: deck.themeColor,
      pillBg: deck.pillBg,
      bgFrom: deck.bgFrom,
      bgVia: deck.bgVia,
      bgTo: deck.bgTo,
      is_featured_on_home: updatedStatus,
      topRanker: deck.topRanker,
      performers: deck.performers,
    })

    await supabase
      .from('cms_gallery')
      .update({ caption })
      .eq('id', deck.id)

    setDecks(prev => prev.map(d => d.id === deck.id ? { ...d, is_featured_on_home: updatedStatus } : d))
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

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-brand-border shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="font-serif-editorial text-lg font-bold text-[#1B2A44]">
              Academic Excellence Result Decks (Topper Templates)
            </h3>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Create and customize full visual result cards with custom colors, top rankers, and 10-student performer grids.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {decks.length === 0 && (
            <button
              onClick={seedDefaultDecks}
              disabled={saving}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-3 py-2 rounded-xl border border-amber-200 transition-colors"
            >
              Seed Default Decks
            </button>
          )}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 bg-[#7E0D0D] hover:bg-[#5C0A0C] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all"
          >
            <Plus size={16} />
            <span>Add New Result Deck</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="bg-emerald-50 text-emerald-800 text-xs font-bold p-3 rounded-xl border border-emerald-200 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Grid of Existing Decks */}
      {loading ? (
        <div className="p-8 text-center text-xs text-neutral-500">Loading result decks...</div>
      ) : decks.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-dashed border-neutral-300 text-center space-y-3">
          <Trophy className="h-10 w-10 text-neutral-300 mx-auto" />
          <h4 className="font-bold text-neutral-800 text-sm">No Custom Result Decks Created Yet</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Click &quot;Seed Default Decks&quot; to initialize with existing high-performing templates or click &quot;Add New Result Deck&quot; to build a custom card.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={seedDefaultDecks}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs px-4 py-2 rounded-xl transition-all"
            >
              Seed Default Decks
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {decks.map((deck, idx) => (
            <div
              key={deck.id}
              className="bg-white rounded-2xl border border-brand-border p-5 shadow-xs space-y-4 relative flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {/* Card Header & Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                      Tab: {deck.tabLabel}
                    </span>
                    <span
                      className="text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: deck.themeColor }}
                    >
                      Theme Color
                    </span>
                  </div>

                  {/* Move Up/Down & Delete */}
                  <div className="flex items-center gap-1 text-neutral-400">
                    <button
                      onClick={() => moveDeck(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 hover:text-neutral-900 disabled:opacity-30"
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => moveDeck(idx, 1)}
                      disabled={idx === decks.length - 1}
                      className="p-1 hover:text-neutral-900 disabled:opacity-30"
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      onClick={() => deleteDeck(deck.id)}
                      className="p-1 hover:text-red-600"
                      title="Delete deck"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Card Title */}
                <h4
                  className="font-serif-editorial text-base font-extrabold tracking-tight truncate"
                  style={{ color: deck.themeColor }}
                >
                  {deck.cardTitle}
                </h4>

                {/* Topper Spotlight Preview */}
                <div className="mt-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-sky-100 border border-sky-300 shrink-0">
                      {deck.topRanker?.photo ? (
                        <img
                          src={normalizeImageUrl(deck.topRanker.photo)}
                          alt={deck.topRanker.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-xs text-neutral-600">
                          {deck.topRanker?.name?.slice(0, 2).toUpperCase() || 'TP'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{deck.topRanker?.name}</div>
                      <div className="text-[10px] text-neutral-500">
                        Score:{' '}
                        <strong className="text-brand-maroon">{deck.topRanker?.score}</strong>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-neutral-600 bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                    {deck.performers?.length || 0} Achievers
                  </span>
                </div>
              </div>

              {/* Bottom Feature On Home Toggle & Edit Button */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={deck.is_featured_on_home}
                    onChange={() => toggleFeaturedHome(deck)}
                    className="w-4 h-4 text-brand-maroon rounded focus:ring-brand-maroon"
                  />
                  <span className="text-xs font-semibold text-neutral-700">
                    Feature on Homepage
                  </span>
                </label>

                <button
                  onClick={() => openEditModal(deck)}
                  className="flex items-center gap-1 text-xs font-bold text-brand-maroon hover:text-white hover:bg-brand-maroon px-3 py-1.5 rounded-lg border border-brand-maroon/30 transition-colors"
                >
                  <Pencil size={13} />
                  <span>Edit Template</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Builder Modal ─── */}
      {isModalOpen && editingDeck && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200 p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-blush text-brand-maroon flex items-center justify-center">
                  <Trophy size={18} />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-lg font-bold text-neutral-900">
                    {editingDeck.id ? 'Edit Result Deck Template' : 'Create New Result Deck Template'}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Customize titles, brand color palette, topper profile, and student marks grid.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              
              {/* Row 1: Tab Name & Card Title */}
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
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
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

              {/* Section 1: Top Ranker (Topper) */}
              <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-600" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900">
                    Top Ranker (Spotlight Topper)
                  </h4>
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

              {/* Section 2: Achievers / Performers Grid (10 Students) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-brand-maroon" />
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
                      Achievers Grid ({editingDeck.performers?.length || 0} Students)
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={addPerformer}
                    className="flex items-center gap-1 text-xs font-bold text-brand-maroon hover:bg-brand-blush px-3 py-1.5 rounded-xl border border-brand-maroon/30 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Student</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                  {editingDeck.performers?.map((student: any, sIdx: number) => (
                    <div
                      key={sIdx}
                      className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 relative flex items-start gap-3 hover:border-brand-maroon/40 transition-colors"
                    >
                      {/* Photo Upload / Avatar */}
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
                              <span className="text-[9px] font-bold mt-0.5">#{sIdx + 1}</span>
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

                      {/* Name & Score Inputs */}
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) => setPerformer(sIdx, 'name', e.target.value)}
                          placeholder="Student Name"
                          className="w-full text-xs font-bold border border-neutral-300 rounded-lg px-2 py-1 bg-white"
                        />
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
                        className="text-neutral-400 hover:text-red-600 p-1"
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
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-bold px-5 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveDeck}
                disabled={saving}
                className="bg-brand-maroon hover:bg-[#5C0A0C] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Check size={16} />
                <span>{saving ? 'Saving...' : 'Save Result Deck'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
