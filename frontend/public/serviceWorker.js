const CACHE_NAME = "hawkeye-version-1";

// Files that will be cached in the PWA
const assets = [
    "./",
    "./index.html",
    "./images/logos/logo192.png",
    "./images/logos/logo-transparent.png",
    "./offline.html"
];

const self = this;

// Install service worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("Opened cache");
                return cache.addAll(assets);
        })
    )
});

// Listen for requests
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request) 
                    .catch(() => caches.match("./offline.html"))
            })
    )
});

// Activate the SW
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
            
    )
});