'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, BookOpen, Users, Trophy, Image, MessageSquare,
  Bell, FileText, Phone, Settings, LogOut, Menu, X, ChevronRight, Home
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',    href: '/admin/dashboard',    icon: LayoutDashboard },
  { label: 'Home Content', href: '/admin/home',         icon: Home },
  { label: 'Courses',      href: '/admin/courses',      icon: BookOpen },
  { label: 'Faculty',      href: '/admin/faculty',      icon: Users },
  { label: 'Results',      href: '/admin/results',      icon: Trophy },
  { label: 'Gallery',      href: '/admin/gallery',      icon: Image },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { label: 'Notices',      href: '/admin/notices',      icon: Bell },
  { label: 'Resources',    href: '/admin/resources',    icon: FileText },
  { label: 'Leads',        href: '/admin/leads',        icon: Phone },
  { label: 'Settings',     href: '/admin/settings',     icon: Settings },
]

export default function AdminLayout({ children, siteName }: { children: React.ReactNode; siteName?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const currentLabel = navItems.find((n) => n.href === pathname)?.label ?? 'Dashboard'

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-60 bg-[#1B2A44] flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <p className="text-white font-bold text-base leading-tight">Admin Panel</p>
            {siteName && <p className="text-white/50 text-xs mt-0.5">{siteName}</p>}
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'bg-[#7E0D0D] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-[#F3DCDC] px-4 sm:px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-2 text-[#1B2A44] hover:bg-[#FDF5F5] rounded-lg" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-[#1B2A44]">{currentLabel}</h1>
            <p className="text-xs text-[#C9C8CB]">{siteName ?? 'Coaching CMS'} · Admin</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
