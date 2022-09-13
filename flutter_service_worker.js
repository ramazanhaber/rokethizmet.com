'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "aaindex.html": "cda74d96bd7c87b366f98dbbe5ef85db",
"assets/AssetManifest.json": "6590eea5288ec13d202094ff09150d50",
"assets/assets/icons/personicon.png": "320ca25ae70670866813d55df6ac9fc3",
"assets/assets/icons/Sun.svg": "ad8df0ed0918bc07e9ff5bd83e432be9",
"assets/assets/images/facebook.png": "89e074c9fe96ebb896201fa8f923b84d",
"assets/assets/images/girisblack.png": "ce961599689dee0e2393aff9b2a71566",
"assets/assets/images/giriswhite.png": "1817ddd99e8c4a5aedb5a8b4c1b234a4",
"assets/assets/images/google.png": "1e01fe36388e7453ab926c23b190827c",
"assets/assets/images/land_tree_dark.png": "7512ddd21b18cf144efe2880a6b283bc",
"assets/assets/images/land_tree_light.png": "1aa4d13b42e5b5599a8f350080ad490d",
"assets/assets/images/rokethizmetlogo.png": "6bbbbe8726da688c57706f4151d0700c",
"assets/assets/images/Sun.png": "60c25b46a59c082257e1fddd3a487b6f",
"assets/assets/images/tree%2520and%2520area.png": "ab6504f29806b76629a15aa12e60a88a",
"assets/assets/images/tree_land_night@2x.png": "7512ddd21b18cf144efe2880a6b283bc",
"assets/assets/images/twitter.png": "f9a1bcf94a3bd1b96b141b5b8ac76da9",
"assets/assets/jsons/ililceler.json": "a9aa1ff4f0b23d3dd4cf4c35e3c44c76",
"assets/assets/languages/de-DE.json": "4c9de5e46eba77a3997c096c126ae5fa",
"assets/assets/languages/en-US.json": "a9ededc593d177302c6e90e480620e15",
"assets/assets/languages/ru-RU.json": "57f0b9601ac3083d59aa620c103a67b2",
"assets/assets/languages/tr-TR.json": "d9688b5e1c6e49ca2a5392680698a85c",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/NOTICES": "59f01f6544c307152eeeeba0a35b40b0",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/easy_localization/i18n/ar-DZ.json": "acc0a8eebb2fcee312764600f7cc41ec",
"assets/packages/easy_localization/i18n/ar.json": "acc0a8eebb2fcee312764600f7cc41ec",
"assets/packages/easy_localization/i18n/en-US.json": "5f5fda8715e8bf5116f77f469c5cf493",
"assets/packages/easy_localization/i18n/en.json": "5f5fda8715e8bf5116f77f469c5cf493",
"favicon.png": "54afe279bc18eca131b6ca4bed87a0fe",
"icons/Icon-192.png": "54afe279bc18eca131b6ca4bed87a0fe",
"icons/Icon-512.png": "a8ed2ec6339a3185f462ca1c37bca2b7",
"icons/Icon-maskable-192.png": "54afe279bc18eca131b6ca4bed87a0fe",
"icons/Icon-maskable-512.png": "a8ed2ec6339a3185f462ca1c37bca2b7",
"index.html": "34205ee523b2b7528b75dadc4b57dce4",
"/": "34205ee523b2b7528b75dadc4b57dce4",
"main.dart.js": "2ac333ed7365f2ed900a6bd59aa48b79",
"manifest.json": "e4b9cb947b113d8565a2b7de89c0c0cd",
"version.json": "4d0e4f0ffaa7f4c8f1d12edbc7a51e7d"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
