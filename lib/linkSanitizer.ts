export function sanitizeContentLinks(html: string): string {
  if (!html) return ''
  let clean = html

  // Fix typo domains like hoduacademy.coam
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.coam/gi, 'https://hoduacademy.com')

  // Convert Moodle page links to relative local links
  clean = clean.replace(
    /https?:\/\/(?:www\.)?hoduacademy\.com\/mod\/page\/view\.php\?id=(\d+)(?:&amp;[a-zA-Z0-9_=-]+|&[a-zA-Z0-9_=-]+)*/gi,
    '/mod/page/view.php?id=$1'
  )

  // Convert Blog links to relative local links
  clean = clean.replace(
    /https?:\/\/(?:www\.)?hoduacademy\.com\/blog\/index\.php\?entryid=(\d+)(?:&amp;[a-zA-Z0-9_=-]+|&[a-zA-Z0-9_=-]+)*/gi,
    '/blog/index.php?entryid=$1'
  )
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/blog\/?/gi, '/blog')

  // Fix "? Prepare Smarter" or "? Master" icon encoding artifacts
  clean = clean.replace(/\?\s*Prepare Smarter with Hodu Academy/gi, '🚀 Prepare Smarter with Hodu Academy')
  clean = clean.replace(/\?\s*Master/gi, '💡 Master')

  // Convert Test / Quiz / Mock Test links to Student Portal Login
  clean = clean.replace(/https?:\/\/(?:courses\.)?hoduacademy\.com\/tests\/[^\s"'>]+/gi, 'https://portal.hoduacademy.com/')
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/mod\/quiz\/[^\s"'>]+/gi, 'https://portal.hoduacademy.com/')

  // Convert Course links to relative local links
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/course\/view\.php\?id=\d+[^"'\s<>]*/gi, '/courses')
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/course\/?/gi, '/courses')

  // Convert Auth / User / Contact / Home links
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/login\/[^"'\s<>]*/gi, 'https://portal.hoduacademy.com/')
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/user\/[^"'\s<>]*/gi, 'https://portal.hoduacademy.com/')
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/contact[^"'\s<>]*/gi, '/contact')
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/?(?=["'\s>])/gi, '/')

  // Remove any remaining direct hrefs pointing to old domain
  clean = clean.replace(/href=["']https?:\/\/(?:www\.)?hoduacademy\.com([^"']*)["']/gi, (match, path) => {
    return `href="${path || '/'}"`
  })

  return clean
}
