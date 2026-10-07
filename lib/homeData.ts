import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { createSafeFetch } from '@/lib/supabase/fetch'
import { HODU_SITE_ID } from '@/lib/hodu'
import { normalizeImageUrl } from '@/lib/imageUtils'

/**
 * Everything the home page needs, fetched in two queries and cached for a minute.
 *
 * The home page is public content, so it uses a cookie-less client: that keeps the
 * result cacheable across visitors instead of re-querying Supabase on every request.
 */

export type ResultPerson = { name: string; achievement: string; photo: string; note: string }
export type ResultDeck = { id: string; label: string; people: ResultPerson[] }
export type Programme = { tag: string; title: string; grades: string; desc: string; features: string[]; href: string }
export type Facility = { title: string; tag: string; desc: string; icon: string }
export type Banner = { image: string; href: string }
export type Channel = { title: string; url: string }
export type Founder = { name: string; role: string; experience: string; qualification: string }

export type HomeData = {
  decks: ResultDeck[]
  programmes: Programme[]
  facilities: Facility[]
  banners: Banner[]
  channels: Channel[]
  ptmPhotos: string[]
  founders: Founder[]
  notices: string[]
}

const CATEGORIES = [
  'Academic Excellence Decks',
  'Homepage Batches',
  'Jaipur Campus Facilities',
  'Home Carousel',
  'YouTube Channel',
  'PTM Gallery',
]

function parse(caption: unknown): any {
  if (caption && typeof caption === 'object') return caption
  try {
    return JSON.parse(String(caption ?? '{}'))
  } catch {
    return {}
  }
}

const clean = (s: unknown) => String(s ?? '').replace(/\s+/g, ' ').trim()

function toDeck(row: { id: string; caption: unknown }): ResultDeck {
  const p = parse(row.caption)
  const raw: any[] = []
  const spotlight = p.has_spotlight_topper ?? !!clean(p.topRanker?.name)
  if (spotlight && p.topRanker) raw.push(p.topRanker)
  if (Array.isArray(p.performers)) raw.push(...p.performers)
  const people = raw
    .filter((x) => clean(x?.name))
    .map((x) => ({
      name: clean(x.name),
      achievement: clean(x.score),
      photo: normalizeImageUrl(x.photo),
      note: clean(x.designation),
    }))
  return { id: row.id, label: clean(p.tabLabel || p.cardTitle) || 'Results', people }
}

async function fetchHomeData(): Promise<HomeData> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase is not configured')

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: createSafeFetch(url) },
  })

  const [gallery, notices, faculty] = await Promise.all([
    supabase
      .from('cms_gallery')
      .select('id, category, image_url, caption, sort_order')
      .eq('site_id', HODU_SITE_ID)
      .in('category', CATEGORIES)
      .order('sort_order'),
    supabase.from('cms_notices').select('title').eq('site_id', HODU_SITE_ID).eq('is_active', true).limit(3),
    supabase
      .from('cms_faculty')
      .select('name, role, experience, qualification, sort_order')
      .eq('site_id', HODU_SITE_ID)
      .eq('is_founder', true)
      .order('sort_order'),
  ])

  const rows = gallery.data ?? []
  // The safe fetch turns network failures into empty results. Never cache that:
  // throwing here skips the cache and lets the page fall back for this request only.
  if (gallery.error || rows.length === 0) throw new Error('Home content unavailable')

  const by = (c: string) => rows.filter((r) => r.category === c)

  const decks = by('Academic Excellence Decks')
    .filter((r) => parse(r.caption).is_featured_on_home !== false)
    .map(toDeck)
    .filter((d) => d.people.length > 0)

  const programmes = by('Homepage Batches').map((r) => {
    const p = parse(r.caption)
    const features = Array.isArray(p.features)
      ? p.features
      : String(p.features ?? '')
          .split(',')
          .map((s) => s.trim())
    return {
      tag: clean(p.tag),
      title: clean(p.title),
      grades: clean(p.grades),
      desc: clean(p.desc),
      features: features.map(clean).filter(Boolean),
      href: clean(p.href) || '/courses',
    }
  })

  const facilities = by('Jaipur Campus Facilities').map((r) => {
    const p = parse(r.caption)
    return { title: clean(p.title), tag: clean(p.tag), desc: clean(p.desc), icon: clean(p.iconName) }
  })

  const banners = by('Home Carousel')
    .map((r) => {
      const p = parse(r.caption)
      const isVideo = p.mediaType === 'video'
      return isVideo ? null : { image: normalizeImageUrl(r.image_url), href: clean(p.linkUrl || p.link || p.href) }
    })
    .filter((b): b is Banner => !!b?.image)

  const channels = by('YouTube Channel')
    .map((r) => {
      const p = parse(r.caption)
      return { title: clean(p.title || r.caption), url: clean(p.url) }
    })
    .filter((c) => c.url)

  const ptmPhotos = by('PTM Gallery')
    .map((r) => normalizeImageUrl(r.image_url))
    .filter(Boolean)
    .slice(0, 3)

  const founders = (faculty.data ?? []).map((f) => ({
    name: clean(f.name),
    role: clean(f.role),
    experience: clean(f.experience),
    qualification: clean(f.qualification),
  }))

  return {
    decks,
    programmes,
    facilities,
    banners,
    channels,
    ptmPhotos,
    founders,
    notices: (notices.data ?? []).map((n) => clean(n.title)).filter(Boolean),
  }
}

/** Admin edits show up on the home page within a minute. */
export const getHomeData = unstable_cache(fetchHomeData, ['home-data-v1'], { revalidate: 60, tags: ['home'] })
