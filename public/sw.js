const CACHE_NAME = 'nurayn-pwa-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/surah',
  '/para',
  '/hadith',
  '/tasbeeh',
  '/qibla',
  '/library',
  '/settings',
  '/about',
  '/globe.svg',
  '/next.svg',
  '/vercel.svg',
  '/window.svg'
];

// Install Event - Pre-cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline shell assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Serve cached assets when offline, intercept static requests
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip POST requests and external APIs that shouldn't be cached by Cache API (we handle them separately)
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle Google Fonts (Amiri, Noto Naskh Arabic, Poppins, Inter) and local public assets
  if (
    requestUrl.hostname === 'fonts.googleapis.com' ||
    requestUrl.hostname === 'fonts.gstatic.com' ||
    requestUrl.pathname.includes('/_next/static/') ||
    requestUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js|woff2|woff|ttf)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        }).catch(() => {
          // Silent catch for network errors
        });
      })
    );
    return;
  }

  // Network-First with Cache-Fallback for Page Routes & API fetches (excluding direct Quran text api which uses IndexedDB)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful responses for next offline visit
        if (networkResponse && networkResponse.status === 200 && !requestUrl.pathname.includes('/api/')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Offline: attempt to load from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If it's a page route, only return cached response or homepage shell for /
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match(event.request).then((res) => {
              if (res) return res;
              if (requestUrl.pathname === '/' || requestUrl.pathname === '') {
                return caches.match('/');
              }
              // Let the network fetch error propagate so dynamic page components can render IndexedDB offline data
              throw new Error("Page not in cache");
            });
          }

          // Return an offline response for JSON requests
          return new Response(
            JSON.stringify({ error: "Offline mode active. No cached data available for this request." }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        });
      })
  );
});
