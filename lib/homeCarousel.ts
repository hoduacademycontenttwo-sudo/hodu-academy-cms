export const HEADING_COLOR = '#1B2A44'

export function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Legacy slides (plain heading/highlight/color fields) get converted to HTML on the fly
export function toHtml(text: string, color?: string) {
  if (!text) return ''
  return color ? `<span style="color:${color}">${escapeHtml(text)}</span>` : escapeHtml(text)
}

export type CarouselSlide = {
  image: string
  headingHtml: string
  subtitleHtml: string
  headingSize: string
  headingWeight: string
  subtitleSize: string
  subtitleWeight: string
  imageOpacity: number
}

export const defaultFallbackSlide: CarouselSlide = {
  image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=800&fit=crop&auto=format',
  headingHtml: `${toHtml('Everything You Need To ')}<span style="color:#7E0D0D">Ace Your Exam In Place</span>`,
  subtitleHtml: toHtml('Top faculty · Live & recorded classes · Test series · Personal mentoring — all in one place.', '#475569'),
  headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light',
  imageOpacity: 100,
}

// Shared by the server page (initial render — no flash) and the client component
// (kept as a fallback path in case slides are ever fetched client-side again).
export function parseCarouselRows(rows: { image_url: string; caption: string | null }[]): CarouselSlide[] {
  return rows
    .filter(d => d.image_url)
    .map(d => {
      try {
        const t = JSON.parse(d.caption ?? '{}')
        const headingHtml = t.headingHtml ?? (t.heading ? `${toHtml(t.heading + ' ', t.headingColor ?? HEADING_COLOR)}${t.highlight ? toHtml(t.highlight, t.highlightColor ?? '#7E0D0D') : ''}` : '')
        const subtitleHtml = t.subtitleHtml ?? toHtml(t.subtitle ?? '', t.subtitleColor ?? '#475569')
        return {
          image: d.image_url, headingHtml, subtitleHtml,
          headingSize: t.headingSize ?? 'large', headingWeight: t.headingWeight ?? 'black',
          subtitleSize: t.subtitleSize ?? 'medium', subtitleWeight: t.subtitleWeight ?? 'light',
          imageOpacity: t.imageOpacity ?? 100,
        }
      } catch {
        return {
          image: d.image_url, headingHtml: toHtml(d.caption ?? ''), subtitleHtml: '',
          headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light',
          imageOpacity: 100,
        }
      }
    })
}
