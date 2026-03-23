const CACHE_NAME = 'makerlab-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Default fetch strategy
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
