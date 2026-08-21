import HoduNavbar from '@/components/hodu/HoduNavbar'
import HoduFooter from '@/components/hodu/HoduFooter'
import FloatingActions from '@/components/hodu/FloatingActions'
import { createClient } from '@/lib/supabase/server'
import { HODU_SITE_ID, HODU } from '@/lib/hodu'

function hexToHsl(hex: string) {
  const h = hex.replace('#', '')
  if (h.length !== 6) return { hue: 0, sat: 0, light: 0.5 }
  const r = parseInt(h.slice(0, 2), 16) / 255
  const g = parseInt(h.slice(2, 4), 16) / 255
  const b = parseInt(h.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const light = (max + min) / 2
  if (max === min) return { hue: 0, sat: 0, light }
  const d = max - min
  const sat = light > 0.5 ? d / (2 - max - min) : d / (max + min)
  let hue = 0
  if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) hue = ((b - r) / d + 2) / 6
  else hue = ((r - g) / d + 4) / 6
  return { hue, sat, light }
}

export default async function HoduLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const [{ data: site }, { data: courseLinks }, { data: studyLinks }] = await Promise.all([
    supabase.from('cms_sites').select('*').eq('id', HODU_SITE_ID).single(),
    supabase.from('cms_nav_links').select('label, href, icon').eq('site_id', HODU_SITE_ID).eq('group_name', 'courses').order('sort_order'),
    supabase.from('cms_nav_links').select('label, href, icon').eq('site_id', HODU_SITE_ID).eq('group_name', 'study_materials').order('sort_order'),
  ])

  const primaryRaw = site?.primary_color || '#921E1F'
  const secondaryRaw = site?.secondary_color || '#651416'

  // If user configured secondary as the maroon color and primary as white/light, or primary as maroon
  const pLight = hexToHsl(primaryRaw).light
  const sLight = hexToHsl(secondaryRaw).light

  // Pick the prominent brand color:
  let brandMaroon = '#921E1F'
  let brandDarkMaroon = '#651416'

  if (pLight < 0.8 && pLight > 0.05) {
    brandMaroon = primaryRaw
  } else if (sLight < 0.8 && sLight > 0.05) {
    brandMaroon = secondaryRaw
  }

  const siteName = site?.name || HODU.name
  const logoUrl = site?.logo_url || ''

  return (
    <>
      <style>{`
        :root {
          --color-brand-maroon: ${brandMaroon};
          --color-brand-primary: ${brandMaroon};
          --color-brand-accent: ${brandMaroon};
          --color-brand-crimson: ${brandDarkMaroon};
          --color-brand-wine: #3E0D0E;
          --color-brand-rose: #EED6D6;
          --color-brand-blush: #F8EEEE;
          --color-brand-bg: #FCF8F7;
          --color-brand-text: #1E1E1E;
          --color-brand-muted: #6B6060;
          --color-brand-border: #E8DADA;
        }
      `}</style>
      <HoduNavbar
        siteName={siteName}
        logoUrl={logoUrl}
        initialCourses={courseLinks ?? undefined}
        initialStudyMaterials={studyLinks ?? undefined}
      />
      <main>{children}</main>
      <HoduFooter siteName={siteName} logoUrl={logoUrl} site={site} academicOfferings={courseLinks ?? undefined} />
      <FloatingActions />
    </>
  )
}
