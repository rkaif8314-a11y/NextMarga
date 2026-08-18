const CACHE_NAME = 'nextmarga-static-v3';
const APP_SHELL = ['/', '/site.webmanifest', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache API/auth/private application data.
  if (url.pathname.startsWith('/api/') || url.pathname.includes('auth') || url.pathname.includes('supabase')) return;

  const destination = request.destination;
  const assetType = destination === 'script' || destination === 'style' || destination === 'font' || destination === 'image';

  event.respondWith(
    fetch(request).then((response) => {
      if (!response.ok) return response;

      const contentType = response.headers.get('content-type') || '';
      const validAsset =
        (destination === 'style' && contentType.includes('text/css')) ||
        (destination === 'script' && (contentType.includes('javascript') || contentType.includes('ecmascript'))) ||
        (destination === 'font' && (contentType.includes('font/') || contentType.includes('application/font'))) ||
        (destination === 'image' && contentType.startsWith('image/'));

      // Only cache assets when the server returned the correct asset type.
      // This prevents an SPA index.html fallback from poisoning the asset cache.
      if (assetType && validAsset) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }

      return response;
    }).catch(() => {
      // Never substitute index.html for a missing CSS/JS/font asset.
      if (assetType) return Response.error();
      return caches.match(request).then((cached) => cached || caches.match('/'));
    })
  );
});
