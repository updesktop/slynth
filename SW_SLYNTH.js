const cacheName = 'SAGB-010';
const staticAssets = [
  './',
  './index.html',
  './main_styles.css', './mobile.css', 

  './js/axios.min.js','./js/coke.js','./js/je_msg.js',
  './js/leaflet.js','./js/leaflet.css','js/leaflet.markercluster-src.js',
  './js/MarkerCluster.Default.css','./js/MarkerCluster.css',

  './jbe_admin.js','./jbe_db.js','./jbe_jbe.js','./jbe_map.js','./jbe_pages.js','./jbelib.js',

  './main_app.js','./main_db.js','./main_lib.js',

  './gfx/proc_logo.gif',
  
  './gfx/jRedMarker.png',
  './gfx/jblueMarker.png',
  './gfx/jgreenMarker.png',

  
  './gfx/avatar.png',   './gfx/group.png',    './gfx/home.png',     './gfx/jadd.png',     './gfx/jadmin.png',
  './gfx/jback.png',    './gfx/jcall.png',    './gfx/jcam.png',     './gfx/jcancel.png',  './gfx/jchat.png',
  './gfx/jdele.png',    './gfx/jedit.png',    './gfx/jham.png',     './gfx/jimage.png',   './gfx/jlive.png',    
  './gfx/jsave.png',    './gfx/jsearch.png',  './gfx/jsend.png',    './gfx/jsms.png',     './gfx/landmark.png',
  './gfx/logo.png',     './gfx/logoBW.png',  './gfx/members.png',  './gfx/structure.png',
    
  './manifest.webmanifest'
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});


self.addEventListener('fetch', event => {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method != 'GET') return;

  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function() {
    // Try to get the response from a cache.
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
      // If we found a match in the cache, return it, but also
      // update the entry in the cache in the background.
      event.waitUntil(cache.add(event.request));
      return cachedResponse;
    }

    // If we didn't find a match in the cache, use the network.
    return fetch(event.request);
  }());
});
