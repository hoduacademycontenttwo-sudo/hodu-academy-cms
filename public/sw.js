// Hodu Academy - Instant-Load Offline & Slow-Network Service Worker Engine
const STATIC_CACHE = 'hodu-static-v1.5'
const IMAGE_CACHE = 'hodu-images-v1.5'
const PAGE_CACHE = 'hodu-pages-v1.5'
const DATA_CACHE = 'hodu-data-v1.5'

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

// 1. Install: Pre-cache critical pages, images, and routes
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
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

// 2. Activate: Delete older cache versions and claim immediate control
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

// 3. Fetch Routing Strategy (Cache-First / Stale-While-Revalidate for Instant 0ms Renders)
self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)

  if (req.method !== 'GET' || !url.protocol.startsWith('http')) return

  // A. Images -> Cache First (Instant load) with background update
  if (
    req.destination === 'image' ||
    url.pathname.startsWith('/api/proxy-image') ||
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/i) ||
    (url.hostname.includes('supabase.co') && url.pathname.includes('/storage/')) ||
    url.hostname.includes('googleusercontent.com') ||
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
          .catch(() => caches.match('/favicon.png'))
      })
    )
    return
  }

  // B. HTML Navigation / Page Routes -> Stale-While-Revalidate / Cache-First (Instant 0ms Page Delivery)
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((networkRes) => {
            if (networkRes.ok) {
              const resClone = networkRes.clone()
              caches.open(PAGE_CACHE).then((cache) => cache.put(req, resClone))
            }
            return networkRes
          })
          .catch(() => null)

        // Return cached page instantly (0ms latency, eliminates 3G / slow net lag)
        return cached || fetchPromise || caches.match('/')
      })
    )
    return
  }

  // C. Supabase REST API -> Stale While Revalidate
  if (url.hostname.includes('supabase.co') && url.pathname.includes('/rest/v1/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((networkRes) => {
            if (networkRes.ok) {
              const resClone = networkRes.clone()
              caches.open(DATA_CACHE).then((cache) => cache.put(req, resClone))
            }
            return networkRes
          })
          .catch(() => null)

        return cached || fetchPromise
      })
    )
    return
  }

  // D. Static Next.js Bundles, CSS, Fonts -> Stale While Revalidate
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
