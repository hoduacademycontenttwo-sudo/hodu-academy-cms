import { createClient } from '@/lib/supabase/server'
import AdminLayout from '@/components/admin/AdminLayout'
import LeadTrendChart from '@/components/admin/LeadTrendChart'
import Link from 'next/link'
import {
  Users, BookOpen, Phone, Bell, Image, Trophy, Newspaper, FileText,
  TrendingUp, CalendarClock, ArrowUpRight, Plus,
} from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'

const statusColors: Record<string, string> = {
  new:         'bg-blue-50 text-blue-700',
  contacted:   'bg-yellow-50 text-yellow-700',
  'follow-up': 'bg-purple-50 text-purple-700',
  enrolled:    'bg-green-50 text-green-700',
  lost:        'bg-gray-100 text-gray-500',
  closed:      'bg-gray-100 text-gray-500',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - 13)
  since.setHours(0, 0, 0, 0)

  const today = new Date().toISOString().slice(0, 10)

  const [leadsRes, coursesRes, resultsRes, galleryRes, noticesRes, facultyRes, blogsRes, resourcesRes, trendRes, followUpRes] = await Promise.all([
    supabase.from('cms_leads').select('*', { count: 'exact' }).eq('site_id', SITE_ID).order('created_at', { ascending: false }).limit(6),
    supabase.from('cms_courses').select('id', { count: 'exact', head: true }).eq('site_id', SITE_ID),
    supabase.from('cms_results').select('id', { count: 'exact', head: true }).eq('site_id', SITE_ID),
    supabase.from('cms_gallery').select('id', { count: 'exact', head: true }).eq('site_id', SITE_ID),
    supabase.from('cms_notices').select('id', { count: 'exact', head: true }).eq('site_id', SITE_ID).eq('is_active', true),
    supabase.from('cms_faculty').select('id', { count: 'exact', head: true }).eq('site_id', SITE_ID),
    supabase.from('cms_blogs').select('id', { count: 'exact', head: true }).eq('site_id', SITE_ID),
    supabase.from('cms_resources').select('id', { count: 'exact', head: true }).eq('site_id', SITE_ID),
    supabase.from('cms_leads').select('created_at, status').eq('site_id', SITE_ID).gte('created_at', since.toISOString()),
    supabase.from('cms_leads').select('*').eq('site_id', SITE_ID).eq('status', 'follow-up').order('follow_up_date', { ascending: true }).limit(5),
  ])

  // Build 14-day trend buckets
  const trendLeads = trendRes.data ?? []
  const days: { day: string; count: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({
      day: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      count: trendLeads.filter(l => l.created_at.slice(0, 10) === key).length,
    })
  }
  const leadsThisWeek = days.slice(7).reduce((a, d) => a + d.count, 0)
  const leadsLastWeek = days.slice(0, 7).reduce((a, d) => a + d.count, 0)
  const weekDelta = leadsLastWeek === 0 ? null : Math.round(((leadsThisWeek - leadsLastWeek) / leadsLastWeek) * 100)

  const newLeadCount = trendLeads.filter(l => l.status === 'new').length

  const stats = [
    { label: 'Total Leads',   value: String(leadsRes.count ?? 0),     icon: Phone,     color: '#7E0D0D', href: '/admin/leads' },
    { label: 'Courses',       value: String(coursesRes.count ?? 0),   icon: BookOpen,  color: '#1B2A44', href: '/admin/courses' },
    { label: 'Blog Posts',    value: String(blogsRes.count ?? 0),     icon: Newspaper, color: '#922222', href: '/admin/blog' },
    { label: 'Resources',     value: String(resourcesRes.count ?? 0), icon: FileText,  color: '#1B2A44', href: '/admin/resources' },
    { label: 'Results',       value: String(resultsRes.count ?? 0),   icon: Trophy,    color: '#7E0D0D', href: '/admin/results' },
    { label: 'Gallery',       value: String(galleryRes.count ?? 0),   icon: Image,     color: '#1B2A44', href: '/admin/gallery' },
    { label: 'Notices',       value: String(noticesRes.count ?? 0),   icon: Bell,      color: '#922222', href: '/admin/notices' },
    { label: 'Faculty',       value: String(facultyRes.count ?? 0),   icon: Users,     color: '#1B2A44', href: '/admin/faculty' },
  ]

  const recentLeads = leadsRes.data ?? []
  const followUps = followUpRes.data ?? []

  const quickActions = [
    { label: 'Write Blog Post',  href: '/admin/blog',      icon: Newspaper },
    { label: 'Add Course',       href: '/admin/courses',   icon: BookOpen },
    { label: 'Upload Result',    href: '/admin/results',   icon: Trophy },
    { label: 'Post Notice',      href: '/admin/notices',   icon: Bell },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Headline row */}
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border border-[#F3DCDC] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="font-semibold text-[#1B2A44] flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#7E0D0D]" /> Lead Trend
                </h2>
                <p className="text-xs text-[#C9C8CB]">Last 14 days</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#1B2A44]">{leadsThisWeek}</p>
                <p className="text-xs text-[#C9C8CB]">
                  this week
                  {weekDelta !== null && (
                    <span className={`ml-1.5 font-bold ${weekDelta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {weekDelta >= 0 ? '▲' : '▼'} {Math.abs(weekDelta)}%
                    </span>
                  )}
                </p>
              </div>
            </div>
            <LeadTrendChart data={days} />
          </div>

          <div className="space-y-4">
            {/* New leads callout */}
            <div className="bg-gradient-to-br from-[#7E0D0D] to-[#922222] text-white rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">Needs Attention</p>
              <p className="text-3xl font-black">{newLeadCount}</p>
              <p className="text-sm text-white/80 mb-3">new leads in last 14 days</p>
              <Link href="/admin/leads" className="inline-flex items-center gap-1.5 bg-white text-[#7E0D0D] text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-pink-50 transition-colors">
                Open Pipeline <ArrowUpRight size={13} />
              </Link>
            </div>

            {/* Quick actions */}
            <div className="bg-white border border-[#F3DCDC] rounded-2xl p-5">
              <h3 className="font-semibold text-[#1B2A44] text-sm mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map(({ label, href, icon: Icon }) => (
                  <Link key={label} href={href}
                    className="flex items-center gap-2 border border-[#F3DCDC] rounded-xl px-3 py-2.5 text-xs font-medium text-[#1B2A44] hover:border-[#7E0D0D] hover:text-[#7E0D0D] transition-colors">
                    <Plus size={12} className="text-[#7E0D0D] shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content counts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {stats.map(({ label, value, icon: Icon, color, href }) => (
            <Link key={label} href={href} className="bg-white border border-[#F3DCDC] rounded-2xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5" style={{ background: `${color}12` }}>
                <Icon size={15} style={{ color }} />
              </div>
              <p className="text-xl font-bold text-[#1B2A44]">{value}</p>
              <p className="text-[11px] text-[#C9C8CB] mt-0.5">{label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Recent Leads */}
          <div className="lg:col-span-2 bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F3DCDC] flex items-center justify-between">
              <h2 className="font-semibold text-[#1B2A44]">Recent Leads</h2>
              <Link href="/admin/leads" className="text-xs text-[#7E0D0D] font-medium hover:underline">View all</Link>
            </div>
            {recentLeads.length === 0 ? (
              <p className="text-center text-[#C9C8CB] py-10 text-sm">No leads yet. Leads from callback forms appear here.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#F3DCDC]">
                      {['Name', 'Phone', 'Exam', 'Status', 'Date'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#C9C8CB] uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead: any) => (
                      <tr key={lead.id} className="border-b border-[#F3DCDC] last:border-0 hover:bg-[#FDF5F5] transition-colors">
                        <td className="px-5 py-3 font-medium text-[#1B2A44]">{lead.name}</td>
                        <td className="px-5 py-3 text-[#1B2A44]">{lead.phone}</td>
                        <td className="px-5 py-3 text-[#1B2A44]">{lead.target_exam ?? '—'}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[lead.status] ?? 'bg-gray-100 text-gray-500'}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-[#C9C8CB] text-xs">
                          {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Upcoming follow-ups */}
          <div className="bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F3DCDC] flex items-center gap-2">
              <CalendarClock size={15} className="text-[#7E0D0D]" />
              <h2 className="font-semibold text-[#1B2A44]">Upcoming Follow-ups</h2>
            </div>
            {followUps.length === 0 ? (
              <p className="text-center text-[#C9C8CB] py-10 text-sm px-4">No follow-ups scheduled. Set follow-up dates from the Leads pipeline.</p>
            ) : (
              <div className="divide-y divide-[#F3DCDC]">
                {followUps.map((l: any) => {
                  const overdue = l.follow_up_date && l.follow_up_date < today
                  return (
                    <div key={l.id} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1B2A44] truncate">{l.name}</p>
                        <p className="text-xs text-[#C9C8CB] truncate">{l.phone}{l.target_exam ? ` · ${l.target_exam}` : ''}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg shrink-0 ${overdue ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-700'}`}>
                        {l.follow_up_date
                          ? new Date(l.follow_up_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                          : 'No date'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
