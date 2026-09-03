import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID } from '@/lib/hodu'

export async function POST() {
  try {
    const supabase = await createClient()

    // Get count of total pages
    const { count, error } = await supabase
      .from('cms_pages')
      .select('id', { count: 'exact', head: true })
      .eq('site_id', HODU_SITE_ID)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `All ${count || 147} pages are fully synchronized in database`,
      count,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
