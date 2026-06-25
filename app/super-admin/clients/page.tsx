import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SuperAdminLayout from '@/components/super-admin/SuperAdminLayout'
import ClientsManager from './ClientsManager'

export default async function SuperAdminClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/super-admin/login')

  const { data: sa } = await supabase
    .from('cms_super_admins')
    .select('id')
    .eq('auth_id', user.id)
    .single()
  if (!sa) redirect('/super-admin/login')

  const { data: sites } = await supabase
    .from('cms_sites')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <SuperAdminLayout>
      <ClientsManager initialSites={sites ?? []} />
    </SuperAdminLayout>
  )
}
