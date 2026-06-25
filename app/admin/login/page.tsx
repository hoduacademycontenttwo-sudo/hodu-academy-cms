'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      // Safely extract error message — Supabase AuthError always has .message string
      const msg = error?.message
      setErrorMsg(
        msg && typeof msg === 'string' && msg.trim() !== ''
          ? msg
          : 'Invalid email or password. Please try again.'
      )
      setLoading(false)
      return
    }

    if (data?.session) {
      router.push('/admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#FDF5F5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#7E0D0D] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B2A44]">Admin Login</h1>
          <p className="text-sm text-[#C9C8CB] mt-1">Sign in to manage your coaching website</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white border border-[#F3DCDC] rounded-2xl p-8 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1B2A44] mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@yourcoaching.in"
              className="w-full border border-[#F3DCDC] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7E0D0D] text-[#111111]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1B2A44] mb-1">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-[#F3DCDC] rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-[#7E0D0D] text-[#111111]"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C9C8CB] hover:text-[#1B2A44]"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#7E0D0D] hover:bg-[#922222] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-[#C9C8CB] mt-4">
          Trouble logging in? Contact your system administrator.
        </p>
      </div>
    </div>
  )
}
