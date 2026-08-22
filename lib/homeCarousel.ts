import { normalizeImageUrl } from './imageUtils'

export const HEADING_COLOR = '#1B2A44'

export function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Legacy slides (plain heading/highlight/color fields) get converted to HTML on the fly
export function toHtml(text: string, color?: string) {
  if (!text) return ''
  return color ? `<span style="color:${color}">${escapeHtml(text)}</span>` : escapeHtml(text)
}

export type MediaType = 'image' | 'video'

export type CarouselSlide = {
  image: string
  mediaType?: MediaType
  videoUrl?: string
  headingHtml: string
  subtitleHtml: string
  headingSize: string
  headingWeight: string
  subtitleSize: string
  subtitleWeight: string
  imageOpacity: number
}

export function parseMediaUrl(url: string): { type: 'google_drive' | 'youtube' | 'video' | 'image'; embedUrl: string } {
  if (!url) return { type: 'image', embedUrl: '' }
  const trimmed = url.trim()

  // Google Drive match
  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  const driveIdMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/)
  const driveId = driveFileMatch?.[1] || driveIdMatch?.[1]
  if (driveId) {
    return {
      type: 'google_drive',
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
    }
  }

  // YouTube match
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (ytMatch?.[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=1&rel=0`,
    }
  }

  // Direct video file (.mp4, .webm, .ogg, .mov)
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)) {
    return {
      type: 'video',
      embedUrl: trimmed,
    }
  }

  return {
    type: 'image',
    embedUrl: trimmed,
  }
}

export const defaultFallbackSlide: CarouselSlide = {
  image: 'https://drive.google.com/file/d/1_9DnITQYv8vS97GrxYzsRf3q7uBiAETq/view?usp=sharing',
  mediaType: 'video',
  videoUrl: 'https://drive.google.com/file/d/1_9DnITQYv8vS97GrxYzsRf3q7uBiAETq/view?usp=sharing',
  headingHtml: `${toHtml('Everything You Need To ')}<span style="color:#921E1F">Ace Your Exam In Place</span>`,
  subtitleHtml: toHtml('Top faculty · Live & recorded classes · Test series · Personal mentoring — all in one place.', '#475569'),
  headingSize: 'large', headingWeight: 'black', subtitleSize: 'medium', subtitleWeight: 'light',
  imageOpacity: 100,
}

// Shared by the server page (initial render — no flash) and the client component
export function parseCarouselRows(rows: { image_url: string; caption: string | null }[]): CarouselSlide[] {
  return rows
    .filter(d => d.image_url)
    .map(d => {
      const normalizedImg = normalizeImageUrl(d.image_url)
      try {
        const t = JSON.parse(d.caption ?? '{}')
        const headingHtml = t.headingHtml ?? (t.heading ? `${toHtml(t.heading + ' ', t.headingColor ?? HEADING_COLOR)}${t.highlight ? toHtml(t.highlight, t.highlightColor ?? '#921E1F') : ''}` : '')
        const subtitleHtml = t.subtitleHtml ?? toHtml(t.subtitle ?? '', t.subtitleColor ?? '#475569')
        const mediaType: MediaType = t.mediaType ?? (parseMediaUrl(normalizedImg).type !== 'image' ? 'video' : 'image')
        const videoUrl = t.videoUrl ?? (mediaType === 'video' ? normalizedImg : '')
        return {
          image: normalizedImg,
          mediaType,
          videoUrl,
          headingHtml,
          subtitleHtml,
          headingSize: t.headingSize ?? 'large',
          headingWeight: t.headingWeight ?? 'black',
          subtitleSize: t.subtitleSize ?? 'medium',
          subtitleWeight: t.subtitleWeight ?? 'light',
          imageOpacity: t.imageOpacity ?? 100,
        }
      } catch {
        const mediaInfo = parseMediaUrl(normalizedImg)
        return {
          image: normalizedImg,
          mediaType: mediaInfo.type !== 'image' ? 'video' : 'image',
          videoUrl: mediaInfo.type !== 'image' ? normalizedImg : '',
          headingHtml: toHtml(d.caption ?? ''),
          subtitleHtml: '',
          headingSize: 'large',
          headingWeight: 'black',
          subtitleSize: 'medium',
          subtitleWeight: 'light',
          imageOpacity: 100,
        }
      }
    })
}
