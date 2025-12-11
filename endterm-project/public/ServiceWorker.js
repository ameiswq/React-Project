const APP_SHELL_CACHE = "rm-app-shell-v1";
const DATA_CACHE = "rm-data-v1";

const APP_SHELL_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/index-CMs2n_GL.js",
  "/assets/index-DPRU6SAp.css"
];

self.addEventListener("install", (event) => {
  console.log("[SW] Install");
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL_URLS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activate");
  const keep = [APP_SHELL_CACHE, DATA_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => (!keep.includes(k) ? caches.delete(k) : null))
      )
    )
  );
  self.clients.claim();
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DATA_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    if (request.mode === "navigate") {
      const appShell = await caches.match("/index.html");
      return appShell || new Response("Offline", { status: 503 });
    }
    return new Response("Offline", { status: 503 });
  }
}

self.addEventListener("fetch", (event) => {
  event.respondWith(networkFirst(event.request));
});