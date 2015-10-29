var CACHE_NAME = 'calcio-cache-v1';

// The files we want to cache
var urlsToCache = [
  '/',
  '/style/main.css',
  '/script/default.js'
];

// Set the callback for the install step
this.addEventListener('install', function(e) {

    var allUrlsCached = caches.open(CACHE_NAME).then(function(cache){
        return cache.addAll(urlsToCache);
    }).then(function(){
        console.log('INSTALLED');
    });

    e.waitUntil(allUrlsCached);

});
