const CACHE_NAME = 'xlerion-story-creator-v1';
// Lista de archivos locales esenciales para que la aplicación funcione sin conexión.
const urlsToCache = [
  './',
  './index.html',
  './historia.html',
  './app.js',
  './historia.js',
  './data.js',
  './favicon.ico',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
  // Los recursos externos (CDN) se cachearán dinámicamente para mayor robustez.
];

// Evento de instalación: se abre el caché y se añaden los archivos principales.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache abierto y listo para precargar archivos.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de activación: se limpia el caché antiguo para mantener la app actualizada.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento fetch: intercepta las peticiones de red.
// Estrategia: Cache First (primero busca en caché, si no, va a la red).
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 1. Si el recurso está en el caché, lo devolvemos directamente.
        if (response) {
          return response;
        }

        // 2. Si no está en caché, hacemos la petición a la red.
        return fetch(event.request).then(
          networkResponse => {
            // 3. Si la petición a la red falla o devuelve un error, simplemente devolvemos la respuesta de error.
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // 4. Si la petición es exitosa, clonamos la respuesta.
            // Una respuesta solo se puede consumir una vez. Necesitamos una copia para el caché y otra para el navegador.
            const responseToCache = networkResponse.clone();

            // 5. Abrimos el caché y guardamos la nueva respuesta para futuras peticiones.
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            // 6. Devolvemos la respuesta original al navegador.
            return networkResponse;
          }
        );
      })
  );
});
