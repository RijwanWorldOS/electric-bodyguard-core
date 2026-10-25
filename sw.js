const CACHE_NAME = 'electric-bodyguard-nexus-v3';

// शुरुआत में लोड होने वाली जरूरी फाइलें
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. इंस्टॉल करते समय बेसिक फाइलें सेव करना
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Sovereign Base Cache Initialized');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 2. पुराना कैशे हटाकर नया वर्शन एक्टिवेट करना
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old obsolete cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clientsClaim();
});

// 3. डाइनामिक फेच और ऑटो-कैश (सारी 32 फाइलों के लिए बुलेट-प्रूफ तरीका)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // अगर फाइल कैश में मिल जाए, तो वहीं से दे दो
      if (cachedResponse) {
        return cachedResponse;
      }
      // अगर कैश में न हो, तो इंटरनेट से लाओ और साथ ही कैश में सेव भी करते जाओ
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // अगर इंटरनेट और कैश दोनों न हों (ऑफलाइन मोड)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
