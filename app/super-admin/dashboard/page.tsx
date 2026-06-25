import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout'
import { Building2, Users, TrendingUp, Clock } from 'lucide-react'

export default async function SuperAdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/super-admin/login')

  const { data: sa } = await supabase
    .from('cms_super_admins')
    .select('id')
    .eq('auth_id', user.id)
    .single()
  if (!sa) redirect('/super-admin/login')

  // Stats
  const [{ count: totalSites }, { count: activeSites }, { count: totalLeads }] = await Promise.all([
    supabase.from('cms_sites').select('*', { count: 'exact', head: true }),
    supabase.from('cms_sites').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('cms_leads').select('*', { count: 'exact', head: true }),
  ])

  // Recent sites
  const { data: recentSites } = await supabase
    .from('cms_sites')
    .select('id, name, slug, plan, is_active, owner_email, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Total Clients',   value: totalSites  ?? 0, icon: Building2,   color: 'bg-indigo-600' },
    { label: 'Active Sites',    value: activeSites ?? 0, icon: TrendingUp,   color: 'bg-green-600'  },
    { label: 'Total Leads',     value: totalLeads  ?? 0, icon: Users,        color: 'bg-blue-600'   },
  ]

  return (
    <SuperAdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-1">Platform Overview</h1>
        <p className="text-slate-400 text-sm mb-8">All coaching institutes on AcadPro</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#1E293B] border border-slate-700 rounded-2xl p-5 flex items-center gap-4">
              <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <Icon size={22} className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-slate-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Clients */}
        <div className="bg-[#1E293B] border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Clients</h2>
            <a href="/super-admin/clients" className="text-sm text-indigo-400 hover:text-indigo-300">View all →</a>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-slate-700">
                <th className="text-left pb-3 font-medium">Institute</th>
                <th className="text-left pb-3 font-medium">Slug</th>
                <th className="text-left pb-3 font-medium">Owner</th>
                <th className="text-left pb-3 font-medium">Plan</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-left pb-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentSites?.map((site) => (
                <tr key={site.id}>
                  <td className="py-3 text-white font-medium">{site.name}</td>
                  <td className="py-3 text-slate-400">/{site.slug}</td>
                  <td className="py-3 text-slate-400">{site.owner_email ?? '—'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      site.plan === 'pro'   ? 'bg-indigo-900 text-indigo-300' :
                      site.plan === 'basic' ? 'bg-blue-900 text-blue-300' :
                                              'bg-slate-700 text-slate-300'
                    }`}>{site.plan}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      site.is_active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>{site.is_active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="py-3 text-slate-400">
                    {new Date(site.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SuperAdminLayout>
  )
}
