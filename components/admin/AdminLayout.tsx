'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard, BookOpen, Users, Trophy, Image, MessageSquare,
  Bell, FileText, Phone, Settings, LogOut, Menu, X, ChevronRight, Home, Newspaper,
  Search, ExternalLink,
} from 'lucide-react'

const navGroups: { title: string; items: { label: string; href: string; icon: any; keywords?: string }[] }[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, keywords: 'analytics stats overview home' },
    ],
  },
  {
    title: 'Website Content',
    items: [
      { label: 'Home Content', href: '/admin/home',    icon: Home,     keywords: 'hero stats banner cta' },
      { label: 'Courses',      href: '/admin/courses', icon: BookOpen, keywords: 'batch program class' },
      { label: 'Faculty',      href: '/admin/faculty', icon: Users,    keywords: 'teacher staff educator' },
      { label: 'Results',      href: '/admin/results', icon: Trophy,   keywords: 'topper rank achiever' },
      { label: 'Gallery',      href: '/admin/gallery', icon: Image,    keywords: 'photo carousel image slide' },
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare, keywords: 'review feedback student voice' },
      { label: 'Notices',      href: '/admin/notices', icon: Bell,     keywords: 'announcement ticker alert' },
    ],
  },
  {
    title: 'Publishing',
    items: [
      { label: 'Blog',      href: '/admin/blog',      icon: Newspaper, keywords: 'article post write editor' },
      { label: 'Resources', href: '/admin/resources', icon: FileText,  keywords: 'pdf notes pyq sample paper download' },
    ],
  },
  {
    title: 'CRM',
    items: [
      { label: 'Leads', href: '/admin/leads', icon: Phone, keywords: 'enquiry pipeline follow up contact student' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings, keywords: 'seo branding logo social contact' },
    ],
  },
]

const allNavItems = navGroups.flatMap(g => g.items)

export default function AdminLayout({ children, siteName }: { children: React.ReactNode; siteName?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen]   = useState(false)
  const [query, setQuery]             = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const router   = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  // Ctrl+K / Cmd+K opens search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50)
    else setQuery('')
  }, [searchOpen])

  const matches = query.trim()
    ? allNavItems.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        (i.keywords ?? '').toLowerCase().includes(query.toLowerCase()))
    : allNavItems

  const currentLabel = allNavItems.find((n) => n.href === pathname)?.label ?? 'Dashboard'

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-60 bg-[#1B2A44] flex flex-col transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7E0D0D] flex items-center justify-center text-white font-black text-sm shrink-0">H</div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Hodu CMS</p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Control Centre</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {navGroups.map(group => (
            <div key={group.title}>
              <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">{group.title}</p>
              <div className="space-y-0.5">
                {group.items.map(({ label, href, icon: Icon }) => {
                  const active = pathname === href
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                        active ? 'bg-[#7E0D0D] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                      {active && <ChevronRight size={13} className="ml-auto" />}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-white/10 space-y-0.5">
          <a href="/" target="_blank" rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors">
            <ExternalLink size={15} /> View Website
          </a>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-[#F3DCDC] px-4 sm:px-6 py-3.5 flex items-center gap-4">
          <button className="lg:hidden p-2 text-[#1B2A44] hover:bg-[#FDF5F5] rounded-lg" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-[#1B2A44]">{currentLabel}</h1>
            <p className="text-xs text-[#C9C8CB] truncate">{siteName ?? 'Hodu Academy'} · Admin</p>
          </div>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 border border-[#F3DCDC] rounded-xl px-3 py-2 text-xs text-[#C9C8CB] hover:border-[#7E0D0D] hover:text-[#7E0D0D] transition-colors"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search…</span>
            <kbd className="hidden sm:inline text-[10px] border border-[#F3DCDC] rounded px-1.5 py-0.5 bg-[#FDF5F5]">Ctrl K</kbd>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>

      {/* Global search palette */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4" onClick={() => setSearchOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#F3DCDC]">
              <Search size={16} className="text-[#C9C8CB] shrink-0" />
              <input
                ref={searchRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && matches.length > 0) {
                    router.push(matches[0].href)
                    setSearchOpen(false)
                  }
                }}
                placeholder="Jump to a section…"
                className="flex-1 text-sm focus:outline-none text-[#1B2A44] placeholder:text-[#C9C8CB]"
              />
              <kbd className="text-[10px] border border-[#F3DCDC] rounded px-1.5 py-0.5 bg-[#FDF5F5] text-[#C9C8CB]">Esc</kbd>
            </div>
            <div className="max-h-72 overflow-y-auto py-2">
              {matches.length === 0 ? (
                <p className="text-center text-[#C9C8CB] text-sm py-6">No matches</p>
              ) : (
                matches.map(({ label, href, icon: Icon }) => (
                  <button
                    key={href}
                    onClick={() => { router.push(href); setSearchOpen(false) }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#1B2A44] hover:bg-[#FDF5F5] transition-colors"
                  >
                    <Icon size={15} className="text-[#7E0D0D]" />
                    {label}
                    <ChevronRight size={13} className="ml-auto text-[#C9C8CB]" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
