const APP_SHELL_CACHE = "rm-app-shell-v1";
const DATA_CACHE = "rm-data-v1";

const APP_SHELL_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/assets/index-CMs2n_GL.js",
  "/assets/index-DPRU6SAp.css"
];

self.addEventListener("install", (event) => {
  console.log("[SW] install");
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then(async (cache) => {
      try {
        await cache.addAll(APP_SHELL_URLS);
        console.log("[SW] App shell cached");
      } catch (err) {
        console.warn("[SW] Some resources failed to cache during install:", err);
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] activate");
  const keep = [APP_SHELL_CACHE, DATA_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (!keep.includes(k)) {
            console.log("[SW] Deleting cache:", k);
            return caches.delete(k);
          }
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DATA_CACHE);
    cache.put(request, response.clone()).catch(() => {});
    return response;
  } catch (err) {
    const cache = await caches.open(DATA_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: "offline", message: "Resource unavailable and not cached." }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }
}

async function cacheFirstWithNetworkFallback(request) {
  const cache = await caches.open(APP_SHELL_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (request.method === "GET") {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch (err) {
    const fallback = await cache.match("/index.html");
    return fallback || new Response("Offline", { status: 503 });
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.hostname.includes("rickandmortyapi.com")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((resp) => resp)
        .catch(async () => {
          const cache = await caches.open(APP_SHELL_CACHE);
          const cachedIndex = await cache.match("/index.html");
          return cachedIndex || new Response("Offline", { status: 503 });
        })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirstWithNetworkFallback(request));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((resp) => resp)
      .catch(async () => {
        const cached = await caches.match(request);
        return cached || new Response("Offline", { status: 503 });
      })
  );
});
