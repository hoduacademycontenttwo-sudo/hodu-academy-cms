import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, class_level, target_exam, city, site_id } = body

    if (!name?.trim() || !phone?.trim() || !site_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from('cms_leads').insert({
      name: name.trim(),
      phone: phone.trim(),
      class_level: class_level || null,
      target_exam: target_exam || null,
      city: city?.trim() || null,
      site_id,
      status: 'new',
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Lead insert error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
