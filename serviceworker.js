// Grab reference to ServiceWorkerGlobalScope:
const SWGS = self;
const CACHE_NAME = 'App Name';

const APP_SHELL_FILELIST = [];
const APP_IMAGE_FILELIST = [];

// Import data:
SWGS.importScripts('???.js');


// EVENTS

// Worker Installation
SWGS.addEventListener('install', function (event) { // ExtendableEvent
    console.log(`[Service Worker] Install`);
    try {
        event.waitUntil(cacheData());
    } catch (error) {
        console.error(`[Service Worker] ERROR: Could not cache app data!`);
        console.error(error);
    }
});

// Resource Fetching
SWGS.addEventListener('fetch', function (event) { // ExtendableEvent
    console.log(`[Service Worker] Fetch`);
    try {
        event.respondWith(fetchData(event.request));
    } catch (error) {
        console.error(`[Service Worker] ERROR: Could not fetch request!`);
        console.error(error);
    }
});

// New Worker Activated
SWGS.addEventListener('activate', function (event) { // ExtendableEvent
    console.log(`[Service Worker] Activate`);
    try {
        event.waitUntil(pruneData());
    } catch (error) {
        console.error(`[Service Worker] ERROR: Could not prune outdated caches!`);
        console.error(error);
    }
});


// FUNCTIONS

async function cacheData() {
    console.log(`[Service Worker] Caching app shell and data`);
    const cache = await SWGS.caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL_FILELIST.concat(APP_IMAGE_FILELIST));
}

async function fetchData(request) {
    const cache = await SWGS.caches.open(CACHE_NAME);
    console.log(`[Service Worker] Search cache for request`);
    {
        const response = await cache.match(request);
        if (response) return response;
    }
    console.log(`[Service Worker] Fetch and cache request`);
    {
        const response = await SWGS.fetch(request);
        if (response) {
            await cache.put(request, response.clone());
            return response;
        }
    }
}

async function pruneData() {
    const cache_list = await SWGS.caches.keys();
    return Promise.all(
        cache_list
            .filter(key => CACHE_NAME !== key)
            .map(key => {
                console.log(`[Service Worker] Pruning cache '${key}'`);
                return SWGS.caches.delete(key);
            }));
}
