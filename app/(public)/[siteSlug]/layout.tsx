import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export async function generateMetadata({ params }: { params: Promise<{ siteSlug: string }> }): Promise<Metadata> {
  const { siteSlug } = await params
  const supabase = await createClient()
  const { data: site } = await supabase.from('cms_sites').select('name,meta_title,meta_description,logo_url').eq('slug', siteSlug).single()

  if (!site) return { title: 'Coaching Institute' }
  return {
    title: { default: site.meta_title ?? site.name, template: `%s | ${site.name}` },
    description: site.meta_description ?? `Premium coaching institute – ${site.name}`,
    openGraph: {
      siteName: site.name,
      images: site.logo_url ? [site.logo_url] : [],
    },
  }
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
