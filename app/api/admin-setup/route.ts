import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'

// One-time setup route — creates the admin users via GoTrue admin API
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== 'setup-2025') {
    return NextResponse.json({ error: 'Forbidden. Invalid or missing secret parameter.' }, { status: 403 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey || supabaseUrl.includes('placeholder')) {
    return NextResponse.json({
      error: 'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.',
    }, { status: 500 })
  }

  // Use service role to bypass RLS and create user via GoTrue admin API
  const supabase = createClient(
    supabaseUrl,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Ensure Hodu Academy site exists in cms_sites
  await supabase.from('cms_sites').upsert({
    id: HODU_SITE_ID,
    name: HODU.name,
    slug: 'hodu',
    plan: 'pro',
    is_active: true,
    owner_email: 'admin@hoduacademy.com',
  }, { onConflict: 'id' })

  const emailsToSetup = ['admin@hoduacademy.com', 'admin@acadpro.in', 'superadmin@acadpro.in']
  const customEmail = req.nextUrl.searchParams.get('email')
  if (customEmail && !emailsToSetup.includes(customEmail)) {
    emailsToSetup.push(customEmail)
  }

  const { data: existingList } = await supabase.auth.admin.listUsers()
  const results = []

  for (const email of emailsToSetup) {
    const existing = existingList?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    let userId: string

    if (existing) {
      const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
        password: 'Admin@1234',
        email_confirm: true,
      })
      if (error) {
        results.push({ email, status: 'error', error: error.message })
        continue
      }
      userId = existing.id
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password: 'Admin@1234',
        email_confirm: true,
        user_metadata: { name: email.includes('super') ? 'Super Admin' : 'Hodu Admin' },
      })
      if (error) {
        results.push({ email, status: 'error', error: error.message })
        continue
      }
      userId = data.user.id
    }

    // Link in cms_users for Hodu Academy
    await supabase.from('cms_users').upsert({
      auth_id: userId,
      site_id: HODU_SITE_ID,
      email,
      role: 'owner',
      name: email.includes('super') ? 'Super Admin' : 'Hodu Admin',
    }, { onConflict: 'auth_id' })

    // Link in cms_super_admins
    await supabase.from('cms_super_admins').upsert({
      auth_id: userId,
      email,
    }, { onConflict: 'auth_id' })

    results.push({ email, status: 'ready', userId })
  }

  return NextResponse.json({
    success: true,
    message: 'Admin accounts configured successfully!',
    credentials: {
      email: 'admin@hoduacademy.com',
      password: 'Admin@1234',
    },
    results,
  })
}
