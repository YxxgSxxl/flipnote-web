// Nom du cache pour stocker les ressources
const CACHE_NAME = 'flipnote-cache-v2'; // J'ai incrémenté le numéro de version

// Liste des ressources à mettre en cache
const RESOURCES_TO_CACHE = [
    '/',
    '/index.html',
    '/src/main.ts',
    '/src/style.css',
    '/lib/gif.js',
    '/lib/gif.worker.js',
    '/img/icons/addframe_32x32.png',
    '/img/icons/arrow-left_32x32.png',
    '/img/icons/arrow-right_32x32.png',
    '/img/icons/broom_32x32.png',
    '/img/icons/brush_big_32x32.png',
    '/img/icons/brush_medium_32x32.png',
    '/img/icons/brush_small_32x32.png',
    '/img/icons/eraser_big_32x32.png',
    '/img/icons/eraser_medium_32x32.png',
    '/img/icons/eraser_small_32x32.png',
    '/img/icons/export_32x32.png',
    '/img/icons/fullarrow-left_32x32.png',
    '/img/icons/fullarrow-right_32x32.png',
    '/img/icons/onion_32x32.png',
    '/img/icons/pencil_big_32x32.png',
    '/img/icons/pencil_medium_32x32.png',
    '/img/icons/pencil_small_32x32.png',
    '/img/icons/playbtn_32x32.png',
    '/img/icons/stopbtn_32x32.png',
    '/img/icons/trash_32x32.png',
    '/img/cursors/brush.png',
    '/img/cursors/eraser.png',
    '/img/cursors/idle.png',
    '/img/cursors/pencil.png',
    '/img/cursors/pointer.png',
    '/img/icons/icon-192x192.png',
    '/img/icons/icon-512x512.png',
    '/img/icon.svg'
];

// Installation du service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Mise en cache des ressources');

                // D'abord, mettre en cache les ressources critiques
                const criticalResources = [
                    '/lib/gif.js',
                    '/lib/gif.worker.js',
                    // Assurez-vous que ce chemin est correct
                    '/node_modules/paper/dist/paper-full.js'
                ];

                return Promise.all(
                    criticalResources.map(url =>
                        cache.add(url).catch(error => {
                            console.error(`Échec de mise en cache de ${url}:`, error);
                        })
                    )
                ).then(() => {
                    // Ensuite, mettre en cache les autres ressources
                    return cache.addAll(RESOURCES_TO_CACHE.filter(url => !criticalResources.includes(url)));
                });
            })
            .then(() => {
                // Forcer l'activation du service worker sans attendre la fermeture des onglets
                return self.skipWaiting();
            })
    );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        // Nettoyer les anciens caches
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return cacheName !== CACHE_NAME;
                }).map((cacheName) => {
                    console.log(`Suppression de l'ancien cache: ${cacheName}`);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            // Prendre le contrôle immédiatement de toutes les pages
            return self.clients.claim();
        })
    );
});

// Stratégie de cache et réseau
self.addEventListener('fetch', (event) => {
    // N'intercepte pas les requêtes non GET
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Pour TOUS les fichiers JavaScript, TOUJOURS utiliser "Network First"
    // C'est la modification principale
    if (url.pathname.endsWith('.js') ||
        url.pathname.includes('.js') ||
        url.pathname.includes('paper') ||
        event.request.mode === 'navigate' ||
        (event.request.headers.get('accept') || '').includes('text/html')) {

        event.respondWith(
            fetch(event.request, { cache: 'no-cache' }) // Force bypass du cache
                .then(response => {
                    // Ne pas mettre en cache les réponses non réussies
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    // Mettre en cache la nouvelle version
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                })
                .catch(() => {
                    // Si le réseau échoue, essayer de servir depuis le cache
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Gestion spéciale pour les fichiers GIF.js
    if (url.pathname.includes('/lib/gif.js') || url.pathname.includes('/lib/gif.worker.js')) {
        event.respondWith(
            fetch(event.request, { cache: 'no-cache' }) // Force bypass du cache
                .then(response => {
                    // Ne pas mettre en cache les réponses non réussies
                    if (!response || response.status !== 200) {
                        return response;
                    }

                    // Mettre en cache la nouvelle version
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Gestion spéciale pour les icônes importantes
    if (url.pathname.includes('/img/icons/')) {
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(event.request)
                        .then((networkResponse) => {
                            // Ne pas mettre en cache les réponses non réussies
                            if (!networkResponse || networkResponse.status !== 200) {
                                return networkResponse;
                            }

                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });
                            return networkResponse;
                        });
                })
        );
        return;
    }

    // Pour les autres ressources, stratégie "Cache First, puis Network"
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((networkResponse) => {
                        // Ne pas mettre en cache les réponses avec erreur
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Mettre en cache la nouvelle ressource
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('Fetch échoué:', error);
                        // Retourner une réponse d'erreur si aucune ressource en cache n'est disponible
                        return new Response('Ressource non disponible hors ligne', {
                            status: 503,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});