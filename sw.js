// ═══════════════════════════════════════════════════
// 🔔 Wallet3 Service Worker — Mobile Notifications
// ═══════════════════════════════════════════════════

const ICON = 'https://img.magnific.com/premium-photo/tree-with-lot-money-falling-from-it_783884-278071.jpg';

// Listen for messages from main app
self.addEventListener('message', (event) => {
    const data = event.data;

    if (data.type === 'TEST_NOTIFICATION') {
        self.registration.showNotification(data.title || 'Wallet3 💰', {
            body: data.body || 'Test notification works!',
            icon: ICON,
            badge: ICON,
            tag: 'wallet3-test',
            requireInteraction: false,
            silent: false,
            vibrate: [200, 100, 200]
        });
    }
});

// Handle install
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Handle activate
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Handle notification click — open/focus the app
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) return client.focus();
            }
            return clients.openWindow('/');
        })
    );
});
