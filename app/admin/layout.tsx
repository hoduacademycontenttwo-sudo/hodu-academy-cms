import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
