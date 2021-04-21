const cacheName = 'v1';

// install
self.addEventListener('install', e  => {
  console.log('SW: installed');
})
// activate and clean other (non v1) caches
self.addEventListener("activate", (evt) => {
	console.log("SW: activated");

	// delete any unexpected caches
	evt.waitUntil(
		caches
			.keys()
			.then((keys) => keys.filter((key) => key !== CACHE_NAME))
			.then((keys) => {
				Promise.all(
					keys.map((key) => {
						console.log(`Deleting cache ${key}`);
						return caches.delete(key);
					})
				)
        }
			)
	);
});

self.addEventListener('fetch', e =>{
  console.log('SW: fetching');
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // clone response
        const resClone = res.clone();
        // open cache
        caches
        .open(cacheName)
        .then(cache =>{
          // add response to cache
          cache.put(e.request, resClone);
        });
        return res;
        // no connection, get from cache
      }).catch(err => caches.match(e.request)
                      .then(res => res))
  )
})