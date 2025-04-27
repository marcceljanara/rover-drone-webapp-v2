const CACHE_NAME = 'rover-drone-cache-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/automation.html',
  '/data.html',
  '/favicon.ico',
  '/monitoring.html',
  '/robots.txt',
  '/serviceWorker.js',
  '/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestURL = new URL(event.request.url);
  const pathname = requestURL.pathname;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((response) => {
          const isCacheable =
            pathname.startsWith('/static/') ||
            pathname.startsWith('/icons/') ||
            pathname.startsWith('/media/') ||
            pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|mp3|mp4|ogg|wav|pdf)$/i);

          if (isCacheable) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }

          return response;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
});
