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
  '/serviceWorker.js',
];

// ✅ Install - cache semua aset statis
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Langsung aktifkan versi baru
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// ✅ Fetch - gunakan cache dulu, lalu fallback ke jaringan
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Cache jika resource adalah gambar/icon/media/static
          const shouldCache =
            url.pathname.startsWith('/static/') ||
            url.pathname.startsWith('/icons/') ||
            url.pathname.startsWith('/media/') ||
            /\.(png|jpe?g|svg|gif|webp|mp3|mp4|ogg|wav|pdf)$/i.test(url.pathname);

          if (shouldCache) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }

          return response;
        })
        .catch(() => {
          // Fallback ke offline halaman jika navigasi gagal
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
    })
  );
});

// ✅ Activate - bersihkan cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});
