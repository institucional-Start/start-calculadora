// Versão do cache — mude este número sempre que quiser forçar
// todos os dispositivos a buscarem a versão mais nova dos arquivos.
const CACHE = 'start-calc-v2';
const ASSETS = ['./', './index.html', './manifest.json', './logo.png', './favicon-32.png', './favicon-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first: sempre tenta buscar a versão mais recente na internet.
// Só usa o cache (versão salva) se o dispositivo estiver sem internet.
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
