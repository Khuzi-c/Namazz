const CACHE_NAME = 'namaz-tracker-v1'
const FILES_TO_CACHE = [
    '/',
    '/icon.png',
    '/manifest.json'
    // We rely on Next.js standard caching mostly, but this ensures the shell loads
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests, POST/PUT etc, and Next.js internals (hot reload, static chunks)
    const url = new URL(event.request.url)

    if (event.request.method !== 'GET' ||
        url.pathname.startsWith('/_next/') ||
        url.pathname.startsWith('/api/') ||
        !url.protocol.startsWith('http')) {
        return
    }

    // Network-First Strategy for better dev experience + accurate data
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Optional: Clone and cache here if we wanted valid dynamic caching
                return response
            })
            .catch(() => {
                // Fallback to cache if network fails (offline)
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse

                    // Fallback for document requests to home
                    if (event.request.destination === 'document') {
                        return caches.match('/')
                    }

                    return Response.error()
                })
            })
    )
})

self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json()
        const options = {
            body: data.body,
            icon: '/icon.png',
            badge: '/icon.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2'
            }
        }
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        )
    }
})

self.addEventListener('notificationclick', function (event) {
    event.notification.close()
    event.waitUntil(
        clients.openWindow('/')
    )
})
