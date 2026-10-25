const CACHE_NAME = "nexus-sovereign-cache-v1";
const urlsToCache = [
  "./index.html",
  "./core-engine.js",
  "./manifest.json"
];

// इंस्टॉल करते समय फाइलों को लोकल कैश में सेव करना
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// इंटरनेट न होने पर ऑफलाइन मोड से डेटा देना (Offline-First)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});