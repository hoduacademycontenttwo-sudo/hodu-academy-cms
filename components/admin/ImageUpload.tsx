'use client'

import { useRef, useState } from 'react'
import { Upload, X, Loader, Image as ImageIcon } from 'lucide-react'

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

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side size check
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Max size: 5MB')
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

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1B2A44]">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="preview"
            className="h-28 w-auto max-w-full rounded-xl border border-[#F3DCDC] object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
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
          : <><Upload size={16} /> {value ? 'Change Image' : 'Upload Image'}</>
        }
      </button>
      <p className="text-xs text-[#C9C8CB]">JPG, PNG, WebP · Max 5MB · Stored on Supabase</p>

      {/* Manual URL fallback */}
      <div>
        <label className="block text-xs text-[#C9C8CB] mb-1">Or paste image URL</label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full border border-[#F3DCDC] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#7E0D0D] text-[#111111]"
        />
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
