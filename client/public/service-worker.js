const CACHE_NAME = "votechain-cache-v1";
const urlsToCache = [
  "/", // The root path
  "/manifest.json", // The PWA manifest file
  "/icons/icon-192x192.png", // App icons
  "/icons/icon-512x512.png",
  "/style/Home.module.css" // Your modular CSS file
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});