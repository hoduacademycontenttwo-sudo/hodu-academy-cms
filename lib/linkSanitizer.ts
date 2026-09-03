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

  // Convert Course links to relative local links
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/course\/view\.php\?id=\d+[^"'\s<>]*/gi, '/courses')
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/course\/?/gi, '/courses')

  // Convert Auth / User / Contact / Home links
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/login\/[^"'\s<>]*/gi, '/contact')
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/user\/[^"'\s<>]*/gi, '/')
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/contact[^"'\s<>]*/gi, '/contact')
  clean = clean.replace(/https?:\/\/(?:www\.)?hoduacademy\.com\/?(?=["'\s>])/gi, '/')

  // Remove any remaining direct hrefs pointing to old domain
  clean = clean.replace(/href=["']https?:\/\/(?:www\.)?hoduacademy\.com([^"']*)["']/gi, (match, path) => {
    return `href="${path || '/'}"`
  })

  return clean
}
