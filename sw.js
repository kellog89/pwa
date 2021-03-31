// version1 17.41
var version= "17.41"
console.log("version: " + version);
self.addEventListener('install', evt=>{
  caches.open('PWA-CHAT2').then(
    (cache)=>{
      cache.addAll([
        'index.php',
        'sw.js'
      ])
    })
});
self.addEventListener('activate', (evt) => {
  console.log(evt);
// video 19.03.2021 01h59'26
})
self.addEventListener( 'fetch' , evt=>{
  if (!navigator.onLine){
    evt.respondWith( new Response( 'Pas de connexion internet' ));
    }
    console .log(evt.request.url);
if (!(evt.request.url.indexOf('http') === 0)) return;
  evt.respondWith(
    caches.match(evt.request).then(rep=>{
      if(rep) {
        console.log ("rep existe");
        return rep;
      }  // si la pge existe on la retourne
    
    // si elle n'existe pas on utilise la meth. network fallback pour ouvrir l'instance de cache
      return fetch(evt.request).then(
        newResponse=>{
          caches.open('PWA-CHAT2').then(
            cache=>cache.put(evt.request, newResponse)
         );
        // puisqu'une reponse ne peut etre utiliséee 2 fois, pour l'utiliser on doit la cloner
        return newResponse.clone();
        })
      })
  )})