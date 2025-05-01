const CACHE_NAME = 'nascimento-cache-v1';
const urlsToCache = [
    '/',
    '/nascimento.html',
    'https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap',
    'https://fonts.gstatic.com/s/dancingscript/v24/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Rep8JskwWnxbCR.ttf' // Fonte específica
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});