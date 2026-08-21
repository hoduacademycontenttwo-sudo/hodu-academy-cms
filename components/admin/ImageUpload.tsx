'use client'

import { useRef, useState, useEffect } from 'react'
import { Upload, X, Loader, Info } from 'lucide-react'
import { normalizeImageUrl } from '@/lib/imageUtils'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
}

export default function ImageUpload({ value, onChange, folder = 'general', label = 'Image' }: ImageUploadProps) {
  const inputRef              = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [imgSrc, setImgSrc]   = useState(normalizeImageUrl(value))
  const [isDrive, setIsDrive] = useState(false)

  useEffect(() => {
    const normalized = normalizeImageUrl(value)
    setImgSrc(normalized)
    setIsDrive(value.includes('drive.google.com') || value.includes('googleusercontent.com'))
  }, [value])

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side size check
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Max size: 10MB')
      return
    }

    setLoading(true)
    setError('')

    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', folder)

    try {
      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()

      if (data.url) {
        onChange(data.url)
      } else {
        setError(data.error ?? 'Upload failed. Please try again.')
      }
    } catch {
      setError('Upload failed. Check your connection.')
    }

    setLoading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleUrlInput(raw: string) {
    const normalized = normalizeImageUrl(raw)
    onChange(normalized || raw)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1B2A44]">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative inline-block group">
          <img
            src={imgSrc || normalizeImageUrl(value)}
            alt="preview"
            onError={() => {
              // If lh3 format failed, try uc?export=view format
              const gMatch = value.match(/([a-zA-Z0-9_-]{25,})/)
              if (gMatch && gMatch[1] && !imgSrc.includes('export=view')) {
                setImgSrc(`https://drive.google.com/uc?export=view&id=${gMatch[1]}`)
              }
            }}
            className="h-28 w-auto max-w-full rounded-xl border border-[#F3DCDC] object-cover bg-neutral-50 shadow-xs"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Remove image"
            className="absolute -top-2 -right-2 bg-white border border-[#F3DCDC] rounded-full p-1 shadow hover:bg-red-50 transition-colors"
          >
            <X size={12} className="text-red-500" />
          </button>
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-2 border-2 border-dashed border-[#F3DCDC] rounded-xl px-5 py-3 text-sm text-[#C9C8CB] hover:border-[#7E0D0D] hover:text-[#7E0D0D] transition-colors disabled:opacity-50 w-full justify-center"
      >
        {loading
          ? <><Loader size={16} className="animate-spin" /> Uploading…</>
          : <><Upload size={16} /> {value ? 'Change Image (Upload from Computer)' : 'Upload Image (Direct from Computer)'}</>
        }
      </button>
      <p className="text-xs text-[#C9C8CB]">JPG, PNG, WebP · Max 10MB · Stored on Supabase</p>

      {/* Manual URL / Google Drive link input */}
      <div>
        <label className="block text-xs text-neutral-600 font-medium mb-1">
          Or paste Image URL / Google Drive link
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => handleUrlInput(e.target.value)}
          placeholder="Paste direct URL or Google Drive share link..."
          className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#7E0D0D] text-[#111111] bg-white font-mono"
        />
        {isDrive && (
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
            <Info size={12} /> Google Drive link detected & converted to direct image CDN. (Make sure Drive file sharing is set to "Anyone with the link")
          </p>
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
