// 每日晨读 - Service Worker
const CACHE_NAME = 'daily-read-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        // 立即激活新版本
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Cache failed:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // 立即控制所有页面
        return self.clients.claim();
      })
  );
});

// 处理SKIP_WAITING消息，立即激活新版本
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 请求拦截 - Network First 策略（优先网络，确保用户看到最新内容）
self.addEventListener('fetch', (event) => {
  // 只处理同源请求和字体请求
  if (!event.request.url.startsWith(self.location.origin) &&
      !event.request.url.startsWith('https://fonts.googleapis.com') &&
      !event.request.url.startsWith('https://fonts.gstatic.com') &&
      !event.request.url.startsWith('https://wttr.in') &&
      !event.request.url.startsWith('https://hn.algolia.com')) {
    return;
  }

  // 跳过非GET请求
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 网络请求成功，缓存并返回
        if (response && (response.status === 200 || response.type === 'opaque')) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // 网络请求失败，从缓存读取
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // 如果请求的是页面，返回缓存的首页
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('离线不可用', { status: 503 });
          });
      })
  );
});

// 处理推送通知（预留）
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || '您有新的每日晨读内容',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification(data.title || '每日晨读', options)
    );
  }
});

// 处理通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 如果已有窗口，则聚焦
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        // 否则打开新窗口
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// 后台同步（预留）
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[SW] Background sync triggered');
    // 可以在此处执行后台数据同步
  }
});
