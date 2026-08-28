var CACHE = 'myc-envoltorio-v1';
var ARCHIVOS = [
  './', './index.html', './manifest.json',
  './icon-192.png', './icon-512.png', './icon-maskable.png', './apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (claves) {
      return Promise.all(claves.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.hostname.indexOf('google.com') !== -1 ||
      url.hostname.indexOf('googleusercontent.com') !== -1) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function (resp) {
      return resp || fetch(e.request);
    })
  );
});
