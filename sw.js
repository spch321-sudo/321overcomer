/* 得勝者 · 五重之地 — Service Worker（離線快取）
   國度321空中團契
   更新內容時，把下面的版本號 +1（例如 v1 -> v2），使用者下次開啟就會自動更新。 */
var CACHE = 'overcomer321-v3';
var ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'hero.jpg',
  'icon-192.png',
  'icon-512.png',
  'icon-180.png',
  'apple-touch-icon.png',
  'icon-192-maskable.png',
  'icon-512-maskable.png',
  'medal-idea.png',
  'medal-life.png',
  'medal-live.png',
  'medal-rel.png',
  'medal-king.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // 逐一快取，個別檔案失敗不影響其他
      return Promise.all(ASSETS.map(function (a) {
        return c.add(a).catch(function () {});
      }));
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) {
          c.put(e.request, copy).catch(function () {});
        });
        return resp;
      }).catch(function () {
        // 離線且未快取時，導頁請求回退到首頁
        if (e.request.mode === 'navigate') return caches.match('index.html');
      });
    })
  );
});
