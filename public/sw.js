const CACHE_NAME = 'rivanzee-planner-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/dashboard',
  '/harian',
  '/mingguan',
  '/bulanan',
  '/tahunan',
  '/habit'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Bypass API routes (Next Auth, dll) & development routes
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/webpack-hmr')) {
    return;
  }

  // Network-first policy, failing back to cache for offline availability
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(async () => {
        const cachedRes = await caches.match(event.request);
        if (cachedRes) return cachedRes;
        // Return fallback if fully offline and not cached
        return new Response('Tidak ada koneksi', { status: 503, statusText: 'Offline' });
      })
  );
});
