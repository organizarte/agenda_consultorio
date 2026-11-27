// Guarda la app en el dispositivo para que abra rápido y sin señal.
// Los datos NO se guardan acá: viven en la planilla de Google.
const CACHE = 'agenda-v18';
const ARCHIVOS = ['./', 'index.html', 'app.css', 'app.js', 'config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'turno.html', 't.html'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const c = r.clone(); caches.open(CACHE).then(k => k.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
