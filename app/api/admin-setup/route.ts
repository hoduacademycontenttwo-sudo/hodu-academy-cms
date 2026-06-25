import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// One-time setup route — creates the admin user via GoTrue (not raw SQL)
// DELETE this route after first use in production
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== 'setup-2025') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Use service role to bypass RLS and create user via GoTrue admin API
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Check if already exists
  const { data: existing } = await supabase.auth.admin.listUsers()
  const alreadyExists = existing?.users?.find((u) => u.email === 'admin@acadpro.in')

  let userId: string

  if (alreadyExists) {
    // Update password
    const { data, error } = await supabase.auth.admin.updateUserById(alreadyExists.id, {
      password: 'Admin@1234',
      email_confirm: true,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    userId = alreadyExists.id
  } else {
    // Create fresh via GoTrue
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@acadpro.in',
      password: 'Admin@1234',
      email_confirm: true,
      user_metadata: { name: 'AcadPro Admin' },
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    userId = data.user.id

    // Link to cms_users
    await supabase.from('cms_users').upsert({
      auth_id: userId,
      site_id: 'a1b2c3d4-0000-0000-0000-000000000001',
      email: 'admin@acadpro.in',
      role: 'owner',
      name: 'AcadPro Admin',
    }, { onConflict: 'auth_id' })
  }

  return NextResponse.json({
    success: true,
    message: 'Admin user ready. Login with admin@acadpro.in / Admin@1234',
    user_id: userId,
  })
}
