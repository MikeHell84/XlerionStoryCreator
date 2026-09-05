const CACHE_NAME = 'xlerion-story-creator-v6';
// Archivos locales esenciales (app shell). data.json se maneja con
// estrategia network-first más abajo para no servir datos obsoletos.
const urlsToCache = [
  'index.html',
  'Xlerion-Total-Darkness.html',
  'app.js',
  'historia.js',
  'config-panel.js',
  'enhancements.js',
  'manifest.json',
  'favicon.ico',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32x32.png',
  './'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache).catch(err => {
        console.warn('Service Worker: algunos archivos no se pudieron precargar:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }
  const url = new URL(request.url);

  // data.json y theme.json: network-first (datos frescos), con fallback a caché.
  if (url.pathname.endsWith('/data.json') || url.pathname.endsWith('data.json') ||
      url.pathname.endsWith('/theme.json') || url.pathname.endsWith('theme.json')) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Resto: cache-first con actualización en segundo plano.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        return cached;
      }
      return fetch(request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }
        // Solo cachear recursos same-origin o con CORS válido.
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          try {
            cache.put(request, responseToCache);
          } catch (e) {
            // p. ej. opaque responses o esquemas no soportados: ignorar.
          }
        });
        return networkResponse;
      }).catch(() => {
        // Fallback offline para navegaciones.
        if (request.mode === 'navigate') {
          return caches.match('index.html');
        }
        return undefined;
      });
    })
  );
});
