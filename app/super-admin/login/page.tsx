'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Shield, Eye, EyeOff } from 'lucide-react'

export default function SuperAdminLoginPage() {
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
      setErrorMsg(error.message ?? 'Invalid credentials.')
      setLoading(false)
      return
    }

    if (data?.session) {
      // Verify this user is a super admin
      const { data: sa } = await supabase
        .from('cms_super_admins')
        .select('id')
        .eq('auth_id', data.session.user.id)
        .single()

      if (!sa) {
        await supabase.auth.signOut()
        setErrorMsg('You are not authorised as a Super Admin.')
        setLoading(false)
        return
      }

      router.push('/super-admin/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Super Admin</h1>
          <p className="text-sm text-slate-400 mt-1">AcadPro Platform Control Panel</p>
        </div>

        <form onSubmit={handleLogin} className="bg-[#1E293B] border border-slate-700 rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="superadmin@acadpro.in"
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-4 py-3 pr-11 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <p className="text-red-400 text-sm bg-red-950 border border-red-800 rounded-xl px-4 py-2">
              {errorMsg}
            </p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
