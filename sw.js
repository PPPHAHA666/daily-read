// 每日晨读 - Service Worker
const CACHE_NAME = 'daily-read-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@600;700&display=swap'
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

// 请求拦截 - Cache First 策略
self.addEventListener('fetch', (event) => {
  // 只处理同源请求
  if (!event.request.url.startsWith(self.location.origin) &&
      !event.request.url.startsWith('https://fonts.googleapis.com') &&
      !event.request.url.startsWith('https://fonts.gstatic.com')) {
    return;
  }

  // 跳过非GET请求
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // 返回缓存，同时更新缓存（后台更新）
          event.waitUntil(updateCache(event.request));
          return cachedResponse;
        }

        // 网络请求
        return fetch(event.request)
          .then((response) => {
            // 检查是否为有效响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              // 对于跨域请求，直接返回
              if (response && response.type === 'opaque') {
                // 缓存跨域资源（如字体）
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseClone);
                  });
              }
              return response;
            }

            // 缓存新资源
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });

            return response;
          })
          .catch(() => {
            // 网络请求失败，返回离线页面（如果有）
            return caches.match('/index.html');
          });
      })
  );
});

// 后台更新缓存
async function updateCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response);
    }
  } catch (error) {
    // 忽略更新失败
  }
}

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
