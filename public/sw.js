// Hodu Academy - Advanced Offline Service Worker Cache Engine
const STATIC_CACHE = 'hodu-static-v1.2'
const IMAGE_CACHE = 'hodu-images-v1.2'
const PAGE_CACHE = 'hodu-pages-v1.2'
const DATA_CACHE = 'hodu-data-v1.2'

const CRITICAL_PRECACHE = [
  '/',
  '/manifest.json',
  '/favicon.png',
  '/favicon.ico',
  '/about',
  '/courses',
  '/offline',
  '/ptm',
  '/ptm-gallery',
  '/results',
  '/contact',
  '/admin',
  '/admin/login',
  '/admin/dashboard',
  '/admin/home',
  '/admin/gallery',
  '/admin/results',
  '/admin/campus',
  '/admin/courses',
  '/admin/testimonials',
  '/admin/notices',
  '/admin/leads',
  '/admin/settings',
  '/images/jaipur_center_bg.png',
  '/images/ptm_section_bg.png',
  '/images/features/structured-courses.png',
  '/images/features/video-lectures.png',
  '/images/features/smart-notes.png',
  '/images/features/tests-quizzes.png',
  '/images/competitive_exam_banner.png',
  '/images/counsellor_image_offline.png',
  '/images/join_our_team_2.png',
]

// 1. Install: Pre-cache critical viewer pages, admin routes, and all visual graphics
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Use Promise.allSettled so individual missing paths don't fail the entire precache
      return Promise.allSettled(
        CRITICAL_PRECACHE.map((url) =>
          fetch(url, { cache: 'no-cache' })
            .then((response) => {
              if (response.ok) return cache.put(url, response)
            })
            .catch(() => {})
        )
      )
    }).then(() => self.skipWaiting())
  )
})

// 2. Activate: Purge old cache versions and claim immediate control
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE, IMAGE_CACHE, PAGE_CACHE, DATA_CACHE]
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!currentCaches.includes(key)) {
            return caches.delete(key)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// 3. Fetch Routing Strategy
self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)

  // Skip non-GET and chrome-extension schemes
  if (req.method !== 'GET' || !url.protocol.startsWith('http')) return

  // A. Images (Local, Supabase Storage, and Unsplash) -> Cache First with background refresh
  if (
    req.destination === 'image' ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/i) ||
    url.hostname.includes('supabase.co') && url.pathname.includes('/storage/') ||
    url.hostname.includes('images.unsplash.com')
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached
        return fetch(req)
          .then((networkRes) => {
            if (networkRes.status === 200 || networkRes.type === 'opaque') {
              const resClone = networkRes.clone()
              caches.open(IMAGE_CACHE).then((cache) => cache.put(req, resClone))
            }
            return networkRes
          })
          .catch(() => {
            // Fallback for missing offline image
            return caches.match('/favicon.png')
          })
      })
    )
    return
  }

  // B. Supabase REST API & Data Fetching -> Network First with Data Cache fallback
  if (url.hostname.includes('supabase.co') && url.pathname.includes('/rest/v1/')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes.ok) {
            const resClone = networkRes.clone()
            caches.open(DATA_CACHE).then((cache) => cache.put(req, resClone))
          }
          return networkRes
        })
        .catch(() => {
          return caches.match(req).then((cached) => {
            if (cached) return cached
            return new Response(JSON.stringify({ data: [], error: 'Offline cached data unavailable' }), {
              headers: { 'Content-Type': 'application/json' },
            })
          })
        })
    )
    return
  }

  // C. HTML Navigation Requests (Viewer Portal & Admin Portal Pages) -> Network First with Page Cache fallback
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes.ok) {
            const resClone = networkRes.clone()
            caches.open(PAGE_CACHE).then((cache) => cache.put(req, resClone))
          }
          return networkRes
        })
        .catch(() => {
          return caches.match(req).then((cached) => {
            if (cached) return cached
            // Fallback to static root page if specific route was not cached
            return caches.match('/')
          })
        })
    )
    return
  }

  // D. Static Next.js JS Bundles, CSS, and Fonts -> Stale While Revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((networkRes) => {
          if (networkRes.ok) {
            const resClone = networkRes.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(req, resClone))
          }
          return networkRes
        })
        .catch(() => null)

      return cached || fetchPromise
    })
  )
})
