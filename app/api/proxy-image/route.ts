import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function extractDriveId(urlOrId: string): string | null {
  if (!urlOrId) return null
  if (/^[a-zA-Z0-9_-]{20,}$/.test(urlOrId.trim())) {
    return urlOrId.trim()
  }
  const match1 = urlOrId.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (match1) return match1[1]
  const match2 = urlOrId.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (match2) return match2[1]
  const match3 = urlOrId.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/)
  if (match3) return match3[1]
  return null
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const idParam = searchParams.get('id')
  const urlParam = searchParams.get('url')

  const driveId = extractDriveId(idParam || urlParam || '')
  if (!driveId) {
    if (urlParam && urlParam.startsWith('http')) {
      try {
        const res = await fetch(urlParam, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        })
        if (res.ok) {
          const contentType = res.headers.get('content-type') || 'image/jpeg'
          const buffer = await res.arrayBuffer()
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable',
            },
          })
        }
      } catch {}
    }
    return NextResponse.json({ error: 'Missing or invalid image identifier' }, { status: 400 })
  }

  // List of high-speed Google Drive CDN endpoints to try in sequence
  const targetUrls = [
    `https://lh3.googleusercontent.com/d/${driveId}`,
    `https://drive.google.com/thumbnail?id=${driveId}&sz=w1920`,
    `https://drive.google.com/uc?export=view&id=${driveId}`,
  ]

  for (const target of targetUrls) {
    try {
      const response = await fetch(target, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        },
        redirect: 'follow',
      })

      if (response.ok) {
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        // Make sure it's an image and not an HTML login page
        if (contentType.startsWith('image/')) {
          const buffer = await response.arrayBuffer()
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, stale-while-revalidate=86400, immutable',
            },
          })
        }
      }
    } catch {}
  }

  // Fallback 302 redirect to direct link if server fetch fails
  return NextResponse.redirect(`https://lh3.googleusercontent.com/d/${driveId}`, 302)
}
