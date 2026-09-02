import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID } from '@/lib/hodu'

const legacyMap: Record<string, string> = {
  '14': 'viteee-2026-application-form-updates',
  '13': 'jee-main-registration-2026-live',
  '12': 'india-ranks-7th-at-imo-2025',
  '11': 'iit-kanpur-releases-jee-advanced-2025-scorecard',
  '10': 'ib-students-worldwide-receive-their-results-may-2025',
  '9': 'neet-ug-counselling-schedule-state-quota-seats-released',
  '8': 'the-10-hardest-subjects-in-igcse',
  '7': 'the-role-of-parental-involvement-in-academic-achievement',
  '6': 'what-to-do-just-before-exams',
  '5': 'is-homework-a-hassle-unpacking-the-debate',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const entryId = searchParams.get('entryid')?.trim()

  if (!entryId) {
    // Legacy blog index -> redirect to modern /blog
    return NextResponse.redirect(new URL('/blog', request.url), 301)
  }

  // Check static legacy map first for instantaneous response
  if (legacyMap[entryId]) {
    return NextResponse.redirect(new URL(`/blog/${legacyMap[entryId]}`, request.url), 301)
  }

  // Dynamic database check for secondary_link
  try {
    const supabase = await createClient()
    const { data: blog } = await supabase
      .from('cms_blogs')
      .select('slug')
      .eq('site_id', HODU_SITE_ID)
      .ilike('secondary_link', `%entryid=${entryId}%`)
      .maybeSingle()

    if (blog?.slug) {
      return NextResponse.redirect(new URL(`/blog/${blog.slug}`, request.url), 301)
    }
  } catch {}

  // Fallback if not found -> redirect to /blog
  return NextResponse.redirect(new URL('/blog', request.url), 302)
}
