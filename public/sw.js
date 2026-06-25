const CACHE_NAME = "mollik-builders-v1";

// Cache assets on install
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/pwa_icon.svg"
];

// Install Event - caching the minimal app shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching critical application shell...");
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - cleaning up obsolete caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[Service Worker] Evicting outdated cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate Strategy (Allows ultra-fast loading for cached resources + fallback to offline cache)
self.addEventListener("fetch", (event) => {
  // Only target GET requests (e.g. static pages, JS assets, styles, local images)
  if (event.request.method !== "GET") return;

  // Skip browser-sync or dev-server internal websockets, extensions, or api endpoints that shouldn't be cached offline
  const url = new URL(event.request.url);
  if (
    url.pathname.startsWith("/api/") || 
    url.pathname.includes(".php") ||
    url.hostname.includes("localhost:3000/vite") ||
    url.pathname.includes("@vite") ||
    url.pathname.includes("hot-update") ||
    event.request.url.includes("ws://") ||
    event.request.url.includes("wss://")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update to keep cache fresh ("Stale-While-Revalidate")
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch((err) => console.log("[Service Worker] Offline background-sync skipped for:", url.pathname));

        return cachedResponse;
      }

      // If not cached, fetch from network and dynamically cache the asset
      return fetch(event.request)
        .then((networkResponse) => {
          // Verify valid response before putting in caches
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // If network fails completely and request is for navigation (HTML page), serve cached root index.html
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
    })
  );
});
