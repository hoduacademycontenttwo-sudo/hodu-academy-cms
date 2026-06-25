import { createClient } from '@/lib/supabase/server'
import AdminLayout from '@/components/admin/AdminLayout'
import { Users, BookOpen, Phone, Bell, Image, Trophy } from 'lucide-react'

const SITE_ID = 'a1b2c3d4-1111-1111-1111-000000000002'

const statusColors: Record<string, string> = {
  new:       'bg-blue-50 text-blue-700',
  contacted: 'bg-yellow-50 text-yellow-700',
  enrolled:  'bg-green-50 text-green-700',
  closed:    'bg-gray-100 text-gray-500',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const [leadsRes, coursesRes, resultsRes, galleryRes, noticesRes, facultyRes] = await Promise.all([
    supabase.from('cms_leads').select('*', { count: 'exact' }).eq('site_id', SITE_ID).order('created_at', { ascending: false }).limit(5),
    supabase.from('cms_courses').select('*', { count: 'exact' }).eq('site_id', SITE_ID),
    supabase.from('cms_results').select('*', { count: 'exact' }).eq('site_id', SITE_ID),
    supabase.from('cms_gallery').select('*', { count: 'exact' }).eq('site_id', SITE_ID),
    supabase.from('cms_notices').select('*', { count: 'exact' }).eq('site_id', SITE_ID).eq('is_active', true),
    supabase.from('cms_faculty').select('*', { count: 'exact' }).eq('site_id', SITE_ID),
  ])

  const stats = [
    { label: 'Total Leads',     value: String(leadsRes.count ?? 0),   icon: Phone,   color: '#7E0D0D' },
    { label: 'Active Courses',  value: String(coursesRes.count ?? 0),  icon: BookOpen, color: '#1B2A44' },
    { label: 'Results Added',   value: String(resultsRes.count ?? 0),  icon: Trophy,  color: '#922222' },
    { label: 'Gallery Images',  value: String(galleryRes.count ?? 0),  icon: Image,   color: '#1B2A44' },
    { label: 'Active Notices',  value: String(noticesRes.count ?? 0),  icon: Bell,    color: '#7E0D0D' },
    { label: 'Faculty Members', value: String(facultyRes.count ?? 0),  icon: Users,   color: '#1B2A44' },
  ]

  const recentLeads = leadsRes.data ?? []

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-[#F3DCDC] rounded-2xl p-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <p className="text-2xl font-bold text-[#1B2A44]">{value}</p>
              <p className="text-xs text-[#C9C8CB] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent Leads */}
        <div className="bg-white border border-[#F3DCDC] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F3DCDC] flex items-center justify-between">
            <h2 className="font-semibold text-[#1B2A44]">Recent Leads</h2>
            <a href="/admin/leads" className="text-xs text-[#7E0D0D] font-medium hover:underline">View all</a>
          </div>
          {recentLeads.length === 0 ? (
            <p className="text-center text-[#C9C8CB] py-10 text-sm">No leads yet. Leads from callback forms appear here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F3DCDC]">
                    {['Name', 'Phone', 'Target Exam', 'Class', 'City', 'Status', 'Date'].map((h) => (
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
                      <td className="px-5 py-3 text-[#1B2A44]">{lead.class_level ?? '—'}</td>
                      <td className="px-5 py-3 text-[#1B2A44]">{lead.city ?? '—'}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[lead.status] ?? ''}`}>
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
      </div>
    </AdminLayout>
  )
}
