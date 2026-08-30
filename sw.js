// ═══════════════════════════════════════════════════
// 🔔 Wallet3 Service Worker — Background Notifications
// ═══════════════════════════════════════════════════

let scheduledTimes = [];
let checkInterval = null;
let lastCheckedMinute = '';

// Listen for messages from main app
self.addEventListener('message', (event) => {
    const data = event.data;

    if (data.type === 'SET_NOTIFICATION_TIMES') {
        scheduledTimes = data.times || [];
        console.log('[SW] Updated notification times:', scheduledTimes);
        startChecking();
    }

    if (data.type === 'TEST_NOTIFICATION') {
        self.registration.showNotification(data.title || 'Wallet3', {
            body: data.body || 'Test notification!',
            icon: data.icon || 'https://img.magnific.com/premium-photo/tree-with-lot-money-falling-from-it_783884-278071.jpg',
            badge: data.badge || 'https://img.magnific.com/premium-photo/tree-with-lot-money-falling-from-it_783884-278071.jpg',
            tag: 'wallet3-test',
            requireInteraction: false,
            silent: false,
            vibrate: [200, 100, 200]
        });
    }

    if (data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Periodic check — fires even when tab is closed
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'wallet3-notif-check') {
        event.waitUntil(checkAndNotify());
    }
});

// Fallback: check on install and activate
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('[SW] Activated!');
    event.waitUntil(
        self.registration.periodicSync?.register('wallet3-notif-check', {
            minInterval: 60 * 1000 // 1 minute
        }).catch(() => {
            console.log('[SW] PeriodicSync not supported, using interval fallback');
        })
    );
    startChecking();
});

// Start the interval checker
function startChecking() {
    if (checkInterval) clearInterval(checkInterval);
    checkInterval = setInterval(checkAndNotify, 15000); // Every 15 seconds
    console.log('[SW] Checker started with', scheduledTimes.length, 'times');
}

// Check if it's time to notify
async function checkAndNotify() {
    if (!scheduledTimes || scheduledTimes.length === 0) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentMinute = hh + ':' + mm;

    // Only fire once per minute
    if (currentMinute === lastCheckedMinute) return;
    lastCheckedMinute = currentMinute;

    if (scheduledTimes.includes(currentMinute)) {
        console.log('[SW] Triggering notification for', currentMinute);

        // Get wallet total from storage if possible
        let body = 'ถึงเวลาตรวจสอบกระเป๋าเงินแล้ว! 💰';

        try {
            // Try to read from IndexedDB or cache
            const cache = await caches.open('wallet3-data');
            const response = await cache.match('wallet-data');
            if (response) {
                const walletData = await response.json();
                if (walletData && walletData.total !== undefined) {
                    body = `💰 ยอดเงินรวม: ฿${Number(walletData.total).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
                }
            }
        } catch (e) {
            // ignore
        }

        try {
            await self.registration.showNotification('💰 Wallet3 แจ้งเตือน', {
                body: body,
                icon: 'https://img.magnific.com/premium-photo/tree-with-lot-money-falling-from-it_783884-278071.jpg',
                badge: 'https://img.magnific.com/premium-photo/tree-with-lot-money-falling-from-it_783884-278071.jpg',
                tag: 'wallet3-scheduled-' + currentMinute,
                requireInteraction: true,
                silent: false,
                vibrate: [200, 100, 200, 100, 200],
                actions: [
                    { action: 'open', title: 'เปิดดูกระเป๋าเงิน' }
                ]
            });
        } catch (e) {
            console.error('[SW] Notification failed:', e);
        }
    }
}

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Focus existing window if available
            for (const client of clientList) {
                if (client.url.includes('wallet3') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open new window
            if (self.clients.openWindow) {
                return self.clients.openWindow('/');
            }
        })
    );
});

// Listen for fetch to keep service worker alive and store wallet data
self.addEventListener('fetch', (event) => {
    // This keeps the SW alive in some browsers
});

// Initial check on load
startChecking();
