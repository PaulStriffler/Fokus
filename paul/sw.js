/* Fokus Service Worker — network-first für die App, Offline-Fallback über Cache */
const CACHE = 'fokus-v2';
const CORE = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.pathname.startsWith('/mtime')) return;

  const isAppShell = url.origin === location.origin &&
    (req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html'));

  // App-Shell: NETWORK-FIRST — immer die neueste Version, Cache nur als Offline-Fallback
  if (isAppShell) {
    e.respondWith(
      fetch(req).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put('./index.html', clone));
        return resp;
      }).catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Übrige gleich-origin Assets: stale-while-revalidate
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then(cached => {
        const fetchPromise = fetch(req).then(resp => {
          if (resp && resp.status === 200) { const clone = resp.clone(); caches.open(CACHE).then(c => c.put(req, clone)); }
          return resp;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Externe (RSS-Proxys, TradingView, Forex): network-first, Fallback Cache
  e.respondWith(
    fetch(req).then(resp => {
      if (resp && resp.status === 200) { const clone = resp.clone(); caches.open(CACHE).then(c => c.put(req, clone)); }
      return resp;
    }).catch(() => caches.match(req))
  );
});
