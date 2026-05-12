const CACHE = 'activity-tracker-v2';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.add(self.registration.scope)));
});

// Delete ALL old caches on activate so stale HTML is wiped immediately
self.addEventListener('activate', e => e.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const isHTML = e.request.mode === 'navigate' ||
    e.request.headers.get('accept')?.includes('text/html');

  if (isHTML) {
    // Network-first: always fetch latest HTML, fall back to cache only if offline
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first for assets
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        const clone = res.clone();
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }))
    );
  }
});
