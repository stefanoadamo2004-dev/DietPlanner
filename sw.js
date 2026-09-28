// Service worker del Pianificatore Dietetico.
// Cambia CACHE_NAME (es. v2, v3...) ogni volta che pubblichi un aggiornamento importante:
// forza tutti i telefoni a scaricare la nuova versione invece di usare quella salvata.
const CACHE_NAME = "dietplanner-cache-v1";

const URLS_TO_CACHE = ["/", "/index.html", "/manifest.json", "/icon-192.png", "/icon-512.png"];

// All'installazione, salva in cache i file base dell'app
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting(); // attiva subito la nuova versione, senza aspettare che l'utente chiuda tutte le schede
});

// All'attivazione, elimina le cache vecchie (versioni precedenti dell'app)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Strategia "network first, poi cache": prova sempre a scaricare la versione più recente;
// se non c'è connessione, usa quella salvata (così l'app si apre comunque offline)
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
