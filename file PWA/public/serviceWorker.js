const CACHE_NAME = 'rover2-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/favicon.ico',
  '/manifest.json',
  '/automation.html',
  '/data.html',
  '/monitoring.html',
  '/robots.txt',
  '/service-worker.js'
];

// ✅ Logging ringan untuk debugging
self.addEventListener('install', () => console.log('[SW] Installed'));
self.addEventListener('activate', () => console.log('[SW] Activated'));
self.addEventListener('fetch', (event) => console.log('[SW] Fetch:', event.request.url));

// ✅ Install: cache semua static files
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ✅ Activate: bersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ✅ Fetch: strategi cache-first dengan fallback offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          // Cache file statis (gambar, media, dll.)
          const isStaticAsset =
            ['/static/', '/icons/', '/media/', '/assets/'].some((path) =>
              url.pathname.includes(path)
            ) ||
            /\.(png|jpe?g|svg|gif|webp|mp3|mp4|ogg|wav|pdf)$/i.test(url.pathname);

          if (isStaticAsset) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          } else {
            return new Response('Offline', {
              status: 503,
              statusText: 'Offline',
              headers: { 'Content-Type': 'text/plain' },
            });
          }
        });
    })
  );
});
