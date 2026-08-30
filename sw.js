// ═══════════════════════════════════════════════════
// 🔔 Wallet3 Service Worker — Background Notifications
// ═══════════════════════════════════════════════════

const ICON = 'https://img.magnific.com/premium-photo/tree-with-lot-money-falling-from-it_783884-278071.jpg';

// ─── In-memory state (persists while SW is alive) ───
let notificationTimes = [];
let lastBalance = 0;
let firedToday = {};
let lastCheckedMinute = '';
let checkInterval = null;

// ─── Today key helper ───
function getTodayKey() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function isFiredToday(time) {
    const key = getTodayKey();
    return firedToday[key] && firedToday[key].includes(time);
}

function markFired(time) {
    const key = getTodayKey();
    if (!firedToday[key]) firedToday[key] = [];
    if (!firedToday[key].includes(time)) {
        firedToday[key].push(time);
    }
    // Clean up old days (keep only today)
    for (const k of Object.keys(firedToday)) {
        if (k !== key) delete firedToday[k];
    }
}

// ─── Start periodic check ───
function startChecking() {
    if (checkInterval) return;
    checkScheduledNotifications();
    checkInterval = setInterval(checkScheduledNotifications, 30000);
}

function checkScheduledNotifications() {
    if (!notificationTimes || notificationTimes.length === 0) return;

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentMinute = hh + ':' + mm;

    if (currentMinute === lastCheckedMinute) return;
    lastCheckedMinute = currentMinute;

    if (notificationTimes.includes(currentMinute) && !isFiredToday(currentMinute)) {
        fireNotification(currentMinute);
    }
}

// ─── Fire notification via SW registration ───
function fireNotification(time) {
    if (isFiredToday(time)) return;

    const total = typeof lastBalance === 'number' ? lastBalance : 0;
    const body = '💰 ยอดเงินรวม: ฿' + total.toLocaleString('th-TH', { minimumFractionDigits: 2 });
    const title = '🔔 Wallet3 — ' + time;
    const opts = {
        body,
        icon: ICON,
        badge: ICON,
        tag: 'wallet3-' + time,
        vibrate: [200, 100, 200],
        requireInteraction: false,
        silent: false
    };

    self.registration.showNotification(title, opts).then(() => {
        markFired(time);
    }).catch(() => {});
}

// ─── Message handler from main app ───
self.addEventListener('message', (event) => {
    const data = event.data;

    if (data.type === 'SET_NOTIFICATION_TIMES') {
        notificationTimes = data.times || [];
        startChecking();
    }

    if (data.type === 'SET_BALANCE') {
        lastBalance = data.total || 0;
    }

    if (data.type === 'TEST_NOTIFICATION') {
        const title = data.title || 'Wallet3 💰';
        const body = data.body || 'Test notification works!';
        self.registration.showNotification(title, {
            body,
            icon: ICON,
            badge: ICON,
            tag: 'wallet3-test',
            requireInteraction: false,
            silent: false,
            vibrate: [200, 100, 200]
        });
    }
});

// ─── Install ───
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// ─── Activate ───
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
    // Start checking immediately when SW activates
    startChecking();
});

// ─── Notification click — open/focus the app ───
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) return client.focus();
            }
            return clients.openWindow('./');
        })
    );
});
