const CACHE_NAME = 'app-cache-v6'; 
const URLS_TO_CACHE = [
    './',
    './index.html',
    './CSS/style.css',
    './js/app.js',
    '/IMG/fondos.jpg',  
];
self.addEventListener('install', event => {
    console.log('Instalando Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(URLS_TO_CACHE).catch(error => {
                console.error('Error cacheando archivos:', error);
            });
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Service Worker activado.');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    console.log('Fetch solicitado para:', event.request.url);

    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                console.log('Sirviendo desde caché:', event.request.url);
                return response;
            }
            
            return fetch(event.request).then(fetchResponse => {
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                    return fetchResponse;
                }

                return caches.open(CACHE_NAME).then(cache => {
                    // Guardar en caché solo si es una imagen
                    if (event.request.url.match(/\.(png|jpg|jpeg|svg|webp)$/)) {
                        cache.put(event.request, fetchResponse.clone());
                        console.log('Imagen cacheada:', event.request.url);
                    }
                    return fetchResponse;
                });
            });
        }).catch(() => {
            return caches.match('/index.html'); 
        })
    );
});

self.addEventListener('push', event => {
    const options = {
        body: '¡Nueva actualización del clima!',
        icon: '/icons/Nublado.png',
        badge: '/icons/Nublado.png'
    };
    event.waitUntil(
        self.registration.showNotification('Notificación del Clima', options)
    );
});