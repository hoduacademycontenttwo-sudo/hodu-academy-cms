import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: sites } = await supabase.from('cms_sites').select('slug')
  const { data: courses } = await supabase.from('cms_courses').select('slug, site_id, updated_at')

  const siteMap: MetadataRoute.Sitemap = []

  for (const site of sites ?? []) {
    const base = `https://${site.slug}.acadpro.in`
    siteMap.push(
      { url: base, changeFrequency: 'weekly', priority: 1 },
      { url: `${base}/courses`, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${base}/results`, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${base}/resources`, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
      { url: `${base}/contact`, changeFrequency: 'yearly', priority: 0.6 },
    )
    const siteCourses = (courses ?? []).filter((c: any) => c.site_id === site.slug)
    for (const c of siteCourses) {
      siteMap.push({ url: `${base}/courses/${c.slug}`, changeFrequency: 'monthly', priority: 0.8 })
    }
  }

  return siteMap
}
