// 每日晨读 - Service Worker
const CACHE_NAME = 'daily-read-v7';
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
      .catch((error) => {
        console.error('[SW] Cache failed, will retry on next install:', error);
        // 缓存失败不阻止SW安装，下次访问时自动重试
      })
  );
  // 注意：不在install中调用skipWaiting()，让app.js通过消息机制控制更新时机
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

// 请求拦截
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 只处理同源请求和字体请求
  if (!url.startsWith(self.location.origin) &&
      !url.startsWith('https://fonts.googleapis.com') &&
      !url.startsWith('https://fonts.gstatic.com') &&
      !url.startsWith('https://wttr.in') &&
      !url.startsWith('https://hn.algolia.com') &&
      !url.startsWith('https://api.rss2json.com')) {
    return;
  }

  // 跳过非GET请求
  if (event.request.method !== 'GET') {
    return;
  }

  // API数据源：Network Only（不缓存，保证数据时效性）
  if (url.startsWith('https://wttr.in') ||
      url.startsWith('https://hn.algolia.com') ||
      url.startsWith('https://api.rss2json.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 静态资源：Cache First（已缓存则用缓存，后台更新）
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // 后台更新缓存
        event.waitUntil(
          fetch(event.request).then((res) => {
            if (res && res.status === 200) {
              const resClone = res.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
            }
          }).catch(() => {})
        );
        return cached;
      }
      // 未缓存，从网络获取
      return fetch(event.request).then((res) => {
        if (res && res.status === 200) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return res;
      });
    }).catch(() => {
      // 离线：HTML请求返回缓存首页，其他资源返回空响应
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
      return new Response('', { status: 503 });
    })
  );
});

// 处理通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // 复用已有窗口（匹配根路径或index.html）
        for (const client of clientList) {
          const url = client.url;
          if ((url.endsWith('/') || url.includes('/index.html')) && 'focus' in client) {
            return client.focus();
          }
        }
        // 否则打开新窗口
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
})

// 后台同步（预留）
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    console.log('[SW] Background sync triggered');
  }
});
