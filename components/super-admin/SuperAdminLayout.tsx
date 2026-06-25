'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Shield, LayoutDashboard, Users, LogOut, Building2 } from 'lucide-react'
import Link from 'next/link'

const nav = [
  { href: '/super-admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/super-admin/clients',   label: 'Clients',    icon: Building2 },
]

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/super-admin/login')
  }

  return (
    <div className="flex min-h-screen bg-[#0F172A]">
      {/* Sidebar */}
      <aside className="w-60 bg-[#1E293B] border-r border-slate-700 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">AcadPro</p>
            <p className="text-xs text-slate-400">Super Admin</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}>
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-slate-700">
          <button onClick={signOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
