// PAWdiCURE Background Service Worker for Native OS Push Notifications

self.addEventListener('push', (event) => {
  try {
    let payload = { title: 'PAWdiCURE', body: 'You have a care reminder for Milo.' };
    if (event.data) {
      try {
        payload = event.data.json();
      } catch (e) {
        payload = { title: 'PAWdiCURE', body: event.data.text() };
      }
    }

    const options = {
      body: payload.body || payload.message || '',
      icon: payload.icon || '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        route: payload.route || '/home',
        actionRoute: payload.actionRoute || payload.route || '/home'
      },
      actions: payload.actions || [
        { action: 'open', title: 'Open PAWdiCURE' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(payload.title || '🐾 PAWdiCURE Care Alert', options)
    );
  } catch (err) {
    console.error('Service Worker Error displaying notification:', err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Determine deep-link route
  const targetRoute = event.notification.data?.route || event.notification.data?.actionRoute || '/home';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it and navigate
      for (const client of windowClients) {
        if (client.url.startsWith(self.location.origin) && 'focus' in client) {
          client.postMessage({ type: 'NAVIGATE_TO_ROUTE', route: targetRoute });
          return client.focus();
        }
      }
      // Otherwise, open a new tab with the deep-link hash route
      if (clients.openWindow) {
        return clients.openWindow('/#' + targetRoute);
      }
    })
  );
});
