import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  // 1. Verify caller is a super admin
  const userSupabase = await createServerClient()
  const { data: { user } } = await userSupabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: sa } = await userSupabase
    .from('cms_super_admins')
    .select('id')
    .eq('auth_id', user.id)
    .single()
  if (!sa) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // 2. Parse body
  const { instituteName, slug, ownerEmail, adminPassword, plan, tagline } = await req.json()
  if (!instituteName || !slug || !ownerEmail || !adminPassword) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (adminPassword.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  // 3. Use service role for admin operations
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // 4. Create the site row
  const siteId = crypto.randomUUID()
  const { data: site, error: siteErr } = await admin
    .from('cms_sites')
    .insert({
      id:          siteId,
      name:        instituteName,
      slug:        slug,
      tagline:     tagline || `Welcome to ${instituteName}`,
      plan:        plan ?? 'trial',
      is_active:   true,
      owner_email: ownerEmail,
    })
    .select()
    .single()

  if (siteErr) return NextResponse.json({ error: siteErr.message }, { status: 500 })

  // 5. Create default home section for this site
  await admin.from('cms_home_sections').insert({
    site_id:      siteId,
    hero_title:   `Welcome to ${instituteName}`,
    hero_subtitle: tagline || 'Excellence in Education',
    hero_cta:     'Explore Courses',
  })

  // 6. Create Supabase auth user for this site's admin
  const { data: authData, error: authErr } = await admin.auth.admin.createUser({
    email:         ownerEmail,
    password:      adminPassword,
    email_confirm: true,
    user_metadata: { name: `${instituteName} Admin` },
  })

  if (authErr) {
    // Rollback site if user creation fails
    await admin.from('cms_sites').delete().eq('id', siteId)
    return NextResponse.json({ error: authErr.message }, { status: 500 })
  }

  // 7. Link user to cms_users with correct site_id
  await admin.from('cms_users').insert({
    auth_id: authData.user.id,
    site_id: siteId,
    email:   ownerEmail,
    role:    'owner',
    name:    `${instituteName} Admin`,
  })

  return NextResponse.json({ site })
}
