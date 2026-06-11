# 每日晨读 - 技术架构文档

## 1. 架构设计

### 1.1 整体架构

```
┌─────────────────────────────────────────┐
│           PWA 应用层                    │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │  天气   │ │  AI建议 │ │ AI新闻  │  │
│  │  模块   │ │   模块   │ │   模块   │  │
│  └────┬────┘ └────┬────┘ └────┬────┘  │
│       └─────────┬─┴─────────┬─┘        │
│            数据缓存层 (localStorage)   │
└─────────────────┼───────────┼─────────┘
                  │           │
      ┌───────────┘           └───────────┐
      ▼                                   ▼
┌─────────────┐               ┌─────────────────┐
│ wttr.in API │               │ SerpAPI/其他搜索│
│ (天气数据)   │               │     API        │
└─────────────┘               └─────────────────┘
```

### 1.2 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 前端框架 | 原生 HTML5 + CSS3 + JavaScript | 轻量，无构建工具依赖 |
| PWA支持 | Service Worker + Web App Manifest | 离线缓存 + 可安装 |
| 样式方案 | CSS Variables + Flexbox + Grid | 现代CSS，无需预处理器 |
| 字体 | Google Fonts CDN | Noto Serif SC + Noto Sans SC |
| 图标 | 内联 SVG | 无外部图标库依赖 |

## 2. 外部API集成

### 2.1 天气API

**服务**：wttr.in
- 免费、无需API Key
- 访问地址：`https://wttr.in/Tianjin?format=j1`
- 数据格式：JSON
- 调用示例：
  ```javascript
  fetch('https://wttr.in/Tianjin?format=j1')
  ```

### 2.2 AI建议生成

**方案**：本地预设 + 随机轮换
- 预置 30+ 条赚钱建议模板
- 每日从种子生成伪随机索引
- 确保同一建议不会在短期内重复

### 2.3 AI新闻获取

**方案**：使用 SerpAPI 或 DuckDuckGo RSS
- 主要方案：SerpAPI (Google Search) - 有免费额度
- 备选方案：NewsAPI.org
- 备选方案：RSS 订阅源解析

**注意**：由于是个人使用且免费方案有限，建议：
- 使用 NewsAPI (newsapi.org) 免费版
- 或使用 DuckDuckGo 的免费搜索API

## 3. 数据结构

### 3.1 本地缓存结构 (localStorage)

```javascript
{
  "dailyData": {
    "date": "2024-01-15",
    "weather": {
      "temp": "12°C",
      "condition": "晴",
      "icon": "☀️",
      "suggestion": "适合户外活动"
    },
    "aiTip": {
      "text": "考虑在闲鱼上出售二手电子产品...",
      "category": "副业"
    },
    "news": {
      "title": "GPT-5 预计下月发布",
      "source": "TechCrunch",
      "time": "2小时前",
      "summary": "OpenAI..."
    },
    "lastUpdate": 1705312800000
  }
}
```

## 4. 文件结构

```
/
├── index.html          # 主页面
├── manifest.json        # PWA配置文件
├── sw.js              # Service Worker
├── styles.css         # 样式文件
├── app.js             # 主逻辑
└── icons/             # PWA图标
    ├── icon-192.png
    └── icon-512.png
```

## 5. PWA 配置

### 5.1 manifest.json 关键配置

```json
{
  "name": "每日晨读",
  "short_name": "晨读",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#FAF8F5",
  "theme_color": "#E67E22",
  "icons": [...]
}
```

### 5.2 Service Worker 策略

- **缓存策略**：Cache-First（优先缓存）
- **缓存内容**：
  - HTML、CSS、JS 静态文件
  - 字体文件
  - 上次获取的天气/新闻数据
- **更新机制**：后台检查更新，提示用户刷新

## 6. 关键实现细节

### 6.1 每日数据更新逻辑

```javascript
// 检查是否需要更新
function shouldUpdate() {
  const cached = localStorage.getItem('dailyData');
  if (!cached) return true;

  const today = new Date().toDateString();
  const cachedDate = new Date(JSON.parse(cached).lastUpdate).toDateString();

  return today !== cachedDate;
}
```

### 6.2 AI建议生成算法

```javascript
// 基于日期种子的确定性随机
function getDailyTip(date) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const index = seed % TIPS.length;
  return TIPS[index];
}
```

### 6.3 防重复新闻策略

- 记录最近 7 天的新闻标题哈希
- 新新闻与历史对比，标题相似度 > 80% 则跳过
- 确保每日新闻多样性

## 7. 部署方案

### 7.1 免费部署选项

| 平台 | 域名 | 免费额度 |
|------|------|----------|
| GitHub Pages | username.github.io | 无限 |
| Netlify | netlify.app | 100GB带宽/月 |
| Vercel | vercel.app | 100GB带宽/月 |

### 7.2 本地访问方案

- 直接打开 index.html 文件
- 通过手机浏览器访问本地服务器（需要局域网）
- 使用 ngrok 穿透内网

## 8. 维护计划

- **天气API**：wttr.in 稳定，基本无需维护
- **AI新闻**：可能需要根据 API 可用性调整数据源
- **功能迭代**：基于个人使用反馈优化
