// Hodu Academy - Instant-Load High-Performance Offline & PWA Service Worker Engine
const CACHE_VERSION = 'hodu-v2.0'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const IMAGE_CACHE = `${CACHE_VERSION}-images`
const PAGE_CACHE = `${CACHE_VERSION}-pages`
const DATA_CACHE = `${CACHE_VERSION}-data`

const ALL_CACHES = [STATIC_CACHE, IMAGE_CACHE, PAGE_CACHE, DATA_CACHE]

const CRITICAL_PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/favicon.ico',
  '/about',
  '/courses',
  '/offline',
  '/results',
  '/contact',
  '/faq',
  '/terms',
  '/privacy-policy',
  '/admin',
  '/admin/login',
  '/admin/dashboard',
  '/admin/home',
  '/admin/results',
  '/admin/campus',
  '/images/jaipur_center_bg.png',
  '/images/ptm_section_bg.png',
  '/images/competitive_exam_banner.png',
]

const OFFLINE_FALLBACK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline Mode — Hodu Academy</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background-color: #FDFBF7; color: #1B2A44; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; text-align: center; }
    .card { background: #FFFFFF; max-width: 480px; width: 100%; border: 1px solid #F3DCDC; border-radius: 24px; padding: 36px 24px; box-shadow: 0 10px 25px rgba(126, 13, 13, 0.06); }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: #7E0D0D; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; rounded: 9999px; border-radius: 20px; margin-bottom: 20px; }
    h1 { color: #7E0D0D; font-size: 24px; font-weight: 900; margin-bottom: 12px; font-family: Georgia, serif; }
    p { color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
    .btn-group { display: flex; flex-direction: column; gap: 10px; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 20px; border-radius: 12px; transition: all 0.2s; cursor: pointer; }
    .btn-primary { background: #7E0D0D; color: #FFFFFF; border: none; }
    .btn-primary:hover { background: #922222; }
    .btn-outline { background: #FFFFFF; color: #7E0D0D; border: 1.5px solid #7E0D0D; }
    .btn-outline:hover { background: #FDF5F5; }
    .contact-box { margin-top: 24px; padding-top: 20px; border-top: 1px solid #F3DCDC; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Offline mode is active</div>
    <h1>Hodu Academy</h1>
    <p>You are currently viewing cached content or working offline. Reconnect to the internet for live sync, or explore saved pages.</p>
    <div class="btn-group">
      <a href="/" class="btn btn-primary">Go to Home Page</a>
      <a href="/results" class="btn btn-outline">View Achievers & Results</a>
      <a href="/offline" class="btn btn-outline">Jaipur Campus Details</a>
      <button onclick="window.location.reload()" class="btn btn-outline" style="border-color:#ccc;color:#555;">Retry Connection</button>
    </div>
    <div class="contact-box">
      <strong>Jaipur Campus:</strong> C-28, Vaishali Estate, Gandhi Path West, Jaipur<br>
      <strong>Direct Phone:</strong> +91 9257879555
    </div>
  </div>
  <script>
    window.addEventListener('online', () => { window.location.reload(); });
  </script>
</body>
</html>`

// 1. Install: Pre-cache critical application routes and assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async (cache) => {
      // Precache the offline fallback page
      await cache.put(
        new Request('/offline-fallback'),
        new Response(OFFLINE_FALLBACK_HTML, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      )

      // Fetch critical routes with fault tolerance
      return Promise.allSettled(
        CRITICAL_PRECACHE_URLS.map(async (url) => {
          try {
            const res = await fetch(url, { cache: 'no-cache' })
            if (res && (res.ok || res.type === 'opaque')) {
              await cache.put(url, res.clone())
            }
          } catch (e) {
            // Ignore single fetch failure during install
          }
        })
      )
    }).then(() => self.skipWaiting())
  )
})

// 2. Activate: Delete outdated caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!ALL_CACHES.includes(key)) {
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// 3. Network Fetch Routing
self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)

  if (req.method !== 'GET' || !url.protocol.startsWith('http')) return

  // A. Navigation Requests (HTML Pages) -> Cache First with Fast Network Fallback & Safe Catch
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      (async () => {
        // 1. Try cache first for instant 0ms offline renders
        const cachedPage = await caches.match(req)
        if (cachedPage) {
          // If we have internet in background, revalidate cache
          fetch(req).then(async (freshRes) => {
            if (freshRes && freshRes.ok) {
              const cache = await caches.open(PAGE_CACHE)
              cache.put(req, freshRes.clone())
            }
          }).catch(() => {})
          return cachedPage
        }

        // 2. Try network with short timeout
        try {
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3000)
          const netRes = await fetch(req, { signal: controller.signal })
          clearTimeout(timeoutId)

          if (netRes && (netRes.ok || netRes.type === 'opaque')) {
            const cache = await caches.open(PAGE_CACHE)
            cache.put(req, netRes.clone())
            return netRes
          }
        } catch (e) {
          // Network failed or timed out
        }

        // 3. Fallbacks: Check Home page or Offline page from cache
        const homeFallback = (await caches.match('/')) || (await caches.match('/offline')) || (await caches.match('/offline-fallback'))
        if (homeFallback) return homeFallback

        // 4. Return Embedded Standalone Offline HTML
        return new Response(OFFLINE_FALLBACK_HTML, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      })()
    )
    return
  }

  // B. Images -> Cache First with Image Cache
  if (
    req.destination === 'image' ||
    url.pathname.startsWith('/api/proxy-image') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/i) ||
    (url.hostname.includes('supabase.co') && url.pathname.includes('/storage/')) ||
    url.hostname.includes('googleusercontent.com') ||
    url.hostname.includes('images.unsplash.com')
  ) {
    event.respondWith(
      (async () => {
        const cachedImg = await caches.match(req)
        if (cachedImg) return cachedImg

        try {
          const netImg = await fetch(req)
          if (netImg && (netImg.ok || netImg.type === 'opaque')) {
            const cache = await caches.open(IMAGE_CACHE)
            cache.put(req, netImg.clone())
            return netImg
          }
        } catch (e) {}

        const fallbackIcon = await caches.match('/favicon.png')
        return fallbackIcon || new Response('', { status: 404 })
      })()
    )
    return
  }

  // C. Supabase REST API -> Stale While Revalidate
  if (url.hostname.includes('supabase.co') && url.pathname.includes('/rest/v1/')) {
    event.respondWith(
      (async () => {
        const cachedData = await caches.match(req)
        const fetchPromise = fetch(req)
          .then(async (freshRes) => {
            if (freshRes && freshRes.ok) {
              const cache = await caches.open(DATA_CACHE)
              cache.put(req, freshRes.clone())
            }
            return freshRes
          })
          .catch(() => null)

        if (cachedData) return cachedData
        const netRes = await fetchPromise
        return netRes || new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } })
      })()
    )
    return
  }

  // D. Static Assets, Scripts & Styles -> Stale While Revalidate
  event.respondWith(
    (async () => {
      const cachedAsset = await caches.match(req)
      if (cachedAsset) {
        fetch(req).then(async (freshRes) => {
          if (freshRes && freshRes.ok) {
            const cache = await caches.open(STATIC_CACHE)
            cache.put(req, freshRes.clone())
          }
        }).catch(() => {})
        return cachedAsset
      }

      try {
        const netAsset = await fetch(req)
        if (netAsset && (netAsset.ok || netAsset.type === 'opaque')) {
          const cache = await caches.open(STATIC_CACHE)
          cache.put(req, netAsset.clone())
          return netAsset
        }
      } catch (e) {}

      return new Response('', { status: 408, statusText: 'Offline Asset Unavailable' })
    })()
  )
})
