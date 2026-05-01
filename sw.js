// SK Alpha — Trading Intelligence
// Service Worker for push notifications on Android Chrome
// Place this file in the same folder as index.html on GitHub Pages

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Handle push events (for future server-sent push support)
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || '📈 SK Alpha Alert', {
      body: data.body || 'New trading alert',
      icon: data.icon || '',
      badge: data.badge || '',
      tag: data.tag || 'sk-alpha',
      requireInteraction: false,
      vibrate: [200, 100, 200],
    })
  );
});

// Handle notification click — open or focus the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      // Focus existing tab if open
      for (const client of list) {
        if (client.url.includes('index.html') || client.url.endsWith('/')) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      return clients.openWindow('./');
    })
  );
});
