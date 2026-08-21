/**
 * Normalizes image URLs from Google Drive, Dropbox, and other cloud providers
 * into direct, embeddable image CDN links that work in standard <img> tags.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return ''
  let trimmed = url.trim()

  // Handle broken/partial protocols (e.g. '://drive.google.com' or 'drive.google.com')
  if (trimmed.startsWith('://')) {
    trimmed = 'https' + trimmed
  } else if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/') && !trimmed.startsWith('data:')) {
    trimmed = 'https://' + trimmed
  }

  // Google Drive sharing links:
  // - https://drive.google.com/file/d/16m1MWwEQFz7K6ovfn1__dSlz6kYjdTex/view?usp=sharing
  // - https://drive.google.com/open?id=16m1MWwEQFz7K6ovfn1__dSlz6kYjdTex
  // - https://drive.google.com/uc?id=16m1MWwEQFz7K6ovfn1__dSlz6kYjdTex
  const gDriveMatch = trimmed.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=view&)?id=)|docs\.google\.com\/(?:file\/d\/|open\?id=))([a-zA-Z0-9_-]{20,})/
  )
  if (gDriveMatch && gDriveMatch[1]) {
    const fileId = gDriveMatch[1]
    return `https://lh3.googleusercontent.com/d/${fileId}`
  }

  // Dropbox links: convert ?dl=0 to direct content link
  if (trimmed.includes('dropbox.com')) {
    return trimmed
      .replace(/[?&]dl=0/, '')
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
  }

  return trimmed
}
