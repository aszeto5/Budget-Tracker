const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_02";
const CACHE_NAME = APP_PREFIX + VERSION;

// cache items
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./js/idb.js",
  "./js/index.js",
  "./css/style.css",
  "./icons/icon-512x512.png",
  "./icons/icon-384x384.png",
  "./icons/icon-192x192.png",
  "./icons/icon-152x152.png",
  "./icons/icon-144x144.png",
  "./icons/icon-128x128.png",
  "./icons/icon-96x96.png",
  "./icons/icon-72x72.png",
];
self.addEventListener("install", function (e) {
  //  tells browser to wait before termination of service worker
  e.waitUntil(
    // find specific cache
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);

      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    // returns an array of all cache names
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });

      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

// retrive information from cache

self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log("responding with cache : " + e.request.url);
        return request;
      } else {
        console.log("file is not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }
    })
  );
});