// Service worker del Pianificatore Dietetico.
// Cambia CACHE_NAME (es. v3, v4...) ogni volta che pubblichi un aggiornamento importante:
// forza tutti i telefoni a scaricare la nuova versione invece di usare quella salvata.
// (v2: elimina anche le vecchie copie in cache delle risposte di Supabase, che contenevano dati personali)
const CACHE_NAME = "dietplanner-cache-v2";

const URLS_TO_CACHE = ["/", "/index.html", "/manifest.json", "/icon-192.png", "/icon-512.png"];

// Oltre ai file dell'app, si mettono in cache solo i font di Google (servono per l'aspetto offline).
// Tutto il resto (in particolare le chiamate a Supabase con i dati dell'utente) NON viene mai salvato in cache.
const CACHEABLE_EXTERNAL_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

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
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isCacheableExternal = CACHEABLE_EXTERNAL_HOSTS.includes(url.hostname);
  if (!isSameOrigin && !isCacheableExternal) return; // es. Supabase: va sempre in rete, mai in cache

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Notifica push in arrivo dal server (anche ad app chiusa).
// Il server manda un JSON: { "title": "...", "body": "...", "url": "/" }.
// Su iPhone ogni push DEVE mostrare una notifica, quindi se ne mostra una anche se il contenuto è vuoto o illeggibile.
self.addEventListener("push", (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data = { body: event.data.text() };
    }
  }
  const title = data.title || "DietPlanner";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: data.tag || "dietplanner-daily", // una nuova notifica sostituisce la precedente, senza accumularle
      data: { url: data.url || "/" },
    })
  );
});

// Tocco sulla notifica: porta in primo piano l'app se è già aperta, altrimenti la apre
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      for (const client of windows) {
        if ("focus" in client) return client.focus();
      }
      return self.clients.openWindow(target);
    })
  );
});
