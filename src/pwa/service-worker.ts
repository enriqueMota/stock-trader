/// <reference lib="webworker" />

import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";

declare const self: ServiceWorkerGlobalScope;

clientsClaim();

// We’ll assume the plugin injects the manifest
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const { title, ...options } = data;

  event.waitUntil(
    self.registration.showNotification(title || "Stock Alert", {
      body: options.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: options,
    })
  );
});
