const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/Game assignment/index.html', // Main page
  '/Game assignment/about-us.html',
   '/Game assignment/upcoming-games.html',
   '/Game assignment/consoles.html', 
   '/Game assignment/peripherals.html',
   '/Game assignment/gamepg.html',
   '/Game assignment/faq.html',
  '/Game assignment/gamepg.css', // Your CSS file
   '/Game assignment/index.css',
  
  '/Game assignment/favicons/favicon.ico', // Favicon
  '/Game assignment/favicons/android-icon-192x192.png', // Example icon
  '/Game assignment/favicons/android-icon-96x96.png'    // Another example icon
];

// Install the service worker
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching files');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate the service worker
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch files from the cache
self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
