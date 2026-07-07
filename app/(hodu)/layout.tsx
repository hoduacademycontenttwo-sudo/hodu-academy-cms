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

function hslToHex(hue: number, sat: number, light: number) {
  if (sat === 0) {
    const v = Math.round(light * 255)
    return `#${[v, v, v].map(n => n.toString(16).padStart(2, '0')).join('')}`
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat
  const p = 2 * light - q
  const r = hue2rgb(p, q, hue + 1 / 3)
  const g = hue2rgb(p, q, hue)
  const b = hue2rgb(p, q, hue - 1 / 3)
  return `#${[r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('')}`
}

// Keeps a chosen color usable as body/heading text (and as a dark section background
// with light text on top) no matter how light or dark the admin actually picks it.
function clampForReadability(hex: string, maxLight = 0.32) {
  const { hue, sat, light } = hexToHsl(hex)
  if (light <= maxLight) return hex
  return hslToHex(hue, Math.max(sat, 0.15), maxLight)
}

export default async function HoduLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const [{ data: site }, { data: academicOfferings }] = await Promise.all([
    supabase.from('cms_sites').select('*').eq('id', HODU_SITE_ID).single(),
    supabase.from('cms_nav_links').select('label, href').eq('site_id', HODU_SITE_ID).eq('group_name', 'courses').order('sort_order'),
  ])

  const primaryRaw = site?.primary_color || '#7E0D0D'
  const secondaryRaw = site?.secondary_color || '#1B2A44'

  // brand-maroon doubles as button backgrounds (white text on top) — keep it dark enough for that.
  const primary = clampForReadability(primaryRaw, 0.38)
  // brand-navy doubles as the site's default heading/body text color AND as dark section
  // backgrounds (with white text on top) — always clamp it dark so neither case goes invisible.
  const secondary = clampForReadability(secondaryRaw, 0.28)
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
