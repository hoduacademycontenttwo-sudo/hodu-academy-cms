import HoduNavbar from '@/components/hodu/HoduNavbar'
import HoduFooter from '@/components/hodu/HoduFooter'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'

function darken(hex: string, amount: number) {
  const h = hex.replace('#', '')
  if (h.length !== 6) return hex
  const r = Math.max(0, Math.round(parseInt(h.slice(0, 2), 16) * (1 - amount)))
  const g = Math.max(0, Math.round(parseInt(h.slice(2, 4), 16) * (1 - amount)))
  const b = Math.max(0, Math.round(parseInt(h.slice(4, 6), 16) * (1 - amount)))
  return `#${[r, g, b].map(n => n.toString(16).padStart(2, '0')).join('')}`
}

export default async function HoduLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: site } = await supabase.from('cms_sites').select('*').eq('id', HODU_SITE_ID).single()

  const primary = site?.primary_color || '#7E0D0D'
  const secondary = site?.secondary_color || '#1B2A44'
  const accent = darken(primary, 0.15)

  const siteName = site?.name || HODU.name
  const logoUrl = site?.logo_url || ''

  return (
    <>
      <style>{`
        :root {
          --color-brand-maroon: ${primary};
          --color-brand-accent: ${accent};
          --color-brand-navy: ${secondary};
        }
      `}</style>
      <HoduNavbar siteName={siteName} logoUrl={logoUrl} />
      <main>{children}</main>
      <HoduFooter siteName={siteName} logoUrl={logoUrl} site={site} />
    </>
  )
}
