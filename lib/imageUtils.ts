/**
 * Normalizes image URLs from Google Drive, Dropbox, and other cloud providers
 * into fast, direct, embeddable image CDN links or high-speed proxy endpoints.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return ''
  let trimmed = url.trim()

  // Handle broken/partial protocols
  if (trimmed.startsWith('://')) {
    trimmed = 'https' + trimmed
  } else if (
    !trimmed.startsWith('http://') &&
    !trimmed.startsWith('https://') &&
    !trimmed.startsWith('/') &&
    !trimmed.startsWith('data:')
  ) {
    trimmed = 'https://' + trimmed
  }

  // Google Drive sharing links & googleusercontent links
  const gDriveMatch = trimmed.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=view&)?id=)|docs\.google\.com\/(?:file\/d\/|open\?id=)|googleusercontent\.com\/d\/)([a-zA-Z0-9_-]{20,})/
  )
  if (gDriveMatch && gDriveMatch[1]) {
    const fileId = gDriveMatch[1]
    return `/api/proxy-image?id=${fileId}`
  }

  // Dropbox links: convert ?dl=0 to direct content link
  if (trimmed.includes('dropbox.com')) {
    return trimmed
      .replace(/[?&]dl=0/, '')
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
  }

  return trimmed
}
