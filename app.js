// 每日晨读 - 主应用逻辑

// AI建议库
const TIPS = [
  { text: "考虑在闲鱼或转转上出售不再使用的电子设备，如旧手机、平板电脑或相机，很多人对二手摄影器材有兴趣", category: "副业" },
  { text: "尝试利用AI工具（如DALL-E 3、GPT-4o）为他人提供定制化服务，如设计Logo、撰写文案或制作短视频", category: "副业" },
  { text: "学习Python自动化办公，可以帮助同事或小企业主处理重复性工作，收取服务费", category: "技能" },
  { text: "关注免费教育资源，如B站、慕课等，学习新技能如数据分析、UI设计或视频剪辑", category: "成长" },
  { text: "尝试在知识付费平台（如知乎Live、得到）分享专业知识，建立个人品牌", category: "副业" },
  { text: "利用周末时间做兼职外卖骑手或代驾，灵活安排时间赚取额外收入", category: "副业" },
  { text: "关注股票市场的细分领域机会，如AI Agent概念股、机器人板块，但务必做好风险控制", category: "投资" },
  { text: "考虑做小红书或抖音的垂直领域博主，选择自己感兴趣的领域持续输出内容", category: "副业" },
  { text: "学习投资理财知识，从基金定投开始培养投资习惯", category: "投资" },
  { text: "尝试在电商平台（如淘宝、拼多多）开设小店，销售自己擅长或能找到低价货源的商品", category: "副业" },
  { text: "考虑做自由职业设计师或开发者，在平台（如猪八戒、Fiverr）接单", category: "副业" },
  { text: "利用AI工具提升现有工作效率，把节省的时间用于学习新技能或副业", category: "效率" },
  { text: "关注跨境电商机会，如亚马逊FBA或Shopify独立站，寻找细分品类切入", category: "副业" },
  { text: "尝试写付费专栏或电子书，分享自己的专业经验或兴趣爱好", category: "副业" },
  { text: "考虑做小红书的素人博主，为本地商家拍摄探店内容赚取推广费", category: "副业" },
  { text: "学习视频剪辑技能，为自媒体博主或企业客户提供视频制作服务", category: "技能" },
  { text: "关注订阅制服务模式，如会员制课程、AI工具订阅等被动收入来源", category: "投资" },
  { text: "尝试在B站或YouTube制作教程类视频，长期积累播放量收益", category: "副业" },
  { text: "考虑做企业AI咨询顾问，帮助企业落地AI Agent解决方案", category: "副业" },
  { text: "学习数据分析技能，这在各行各业都有需求，可以接项目或求职", category: "技能" },
  { text: "尝试在豆瓣小组或贴吧做中介服务，如租房介绍、二手交易撮合", category: "副业" },
  { text: "关注AI Agent和智能体协作领域的创业机会，这是当前最热门的风口", category: "创业" },
  { text: "考虑做AI教育助教或答疑老师，很多在线课程平台需要兼职人员", category: "副业" },
  { text: "学习基础理财知识，了解复利的力量，早日开始投资", category: "投资" },
  { text: "尝试做小程序或Chrome插件，解决某个小痛点并尝试变现", category: "副业" },
  { text: "关注数字游民生活方式，学习远程工作技能，挣脱地域限制", category: "成长" },
  { text: "考虑做本地生活服务，如代遛狗、收纳整理、陪诊等个性化服务", category: "副业" },
  { text: "学习AI提示词工程，这是高薪兼职方向，市场需求持续增长", category: "技能" },
  { text: "尝试在Podcast或喜马拉雅做音频内容，积累粉丝后变现", category: "副业" },
  { text: "关注AI Agent和智能合约结合的合规机会，但要谨慎评估风险", category: "投资" },
  { text: "考虑做简历优化或AI面试辅导服务，帮助求职者提升成功率", category: "副业" },
  { text: "学习SEO技能，结合AI工具为企业提供网站优化服务", category: "技能" },
  { text: "尝试做垂直领域的微信群或知识星球，付费社群模式", category: "副业" },
  { text: "关注银发经济机会，老龄化社会带来养老服务、健康产品的需求", category: "创业" },
  { text: "考虑做AI辅助翻译或本地化服务，特别是专业文档的翻译校对工作", category: "副业" },
  { text: "关注AI硬件创业机会，如AI眼镜、智能手表等可穿戴设备", category: "创业" },
  { text: "学习AI Agent开发技能，使用LangChain或LlamaIndex构建智能应用", category: "技能" }
];

// 新闻缓存（最近7天）
let newsHistory = [];

// DOM 元素
const loadingOverlay = document.getElementById('loading');
const mainContent = document.getElementById('main-content');
const errorToast = document.getElementById('error-toast');
const errorMessage = document.getElementById('error-message');
const currentDate = document.getElementById('current-date');
const weekday = document.getElementById('weekday');
const updateTime = document.getElementById('update-time');
const weatherIcon = document.getElementById('weather-icon');
const weatherTemp = document.getElementById('weather-temp');
const weatherCondition = document.getElementById('weather-condition');
const weatherSuggestion = document.getElementById('weather-suggestion');
const tipCategory = document.getElementById('tip-category');
const tipText = document.getElementById('tip-text');
const newsList = document.getElementById('news-list');
const installPrompt = document.getElementById('install-prompt');
const dismissInstall = document.getElementById('dismiss-install');

// 初始化
document.addEventListener('DOMContentLoaded', init);

// 主初始化函数
async function init() {
  // 注册 Service Worker
  registerServiceWorker();

  // 显示当前日期
  displayDate();

  // 检查是否需要更新数据
  if (shouldUpdate()) {
    await fetchAllData();
  } else {
    loadCachedData();
    hideLoading();
  }

  // 卡片动画
  animateCards();

  // 检查安装提示
  checkInstallPrompt();
}

// 显示日期
function displayDate() {
  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const weekOptions = { weekday: 'long' };

  currentDate.textContent = now.toLocaleDateString('zh-CN', options);
  weekday.textContent = now.toLocaleDateString('zh-CN', weekOptions);
}

// 检查是否需要更新数据
function shouldUpdate() {
  const cached = localStorage.getItem('dailyData');
  if (!cached) return true;

  try {
    const data = JSON.parse(cached);
    const cachedDate = new Date(data.lastUpdate).toDateString();
    const today = new Date().toDateString();
    return cachedDate !== today;
  } catch {
    return true;
  }
}

// 获取所有数据
async function fetchAllData() {
  try {
    // 并行获取天气和建议
    await Promise.all([
      fetchWeather(),
      generateTip()
    ]);

    // 获取新闻
    const newsData = await fetchNews();

    // 统一保存所有数据
    saveData(newsData);

    // 更新显示时间
    updateTime.textContent = `更新于 ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;

    hideLoading();
  } catch (error) {
    console.error('获取数据失败:', error);
    showError('获取数据失败，请检查网络连接');

    // 尝试加载缓存
    loadCachedData();
    hideLoading();
  }
}

// 获取天气
async function fetchWeather() {
  try {
    const response = await fetch('https://wttr.in/Tianjin?format=j1', {
      signal: AbortSignal.timeout(5000)
    });

    if (!response.ok) throw new Error('天气API响应失败');

    const data = await response.json();
    const current = data.current_condition[0];

    // 提取数据
    const temp = current.temp_C + '°C';
    const condition = getWeatherDescription(current.weatherCode);
    const icon = getWeatherIcon(current.weatherCode);
    const suggestion = getWeatherSuggestion(current.temp_C, current.weatherCode);

    // 更新UI
    weatherIcon.textContent = icon;
    weatherTemp.textContent = temp;
    weatherCondition.textContent = condition;
    weatherSuggestion.textContent = suggestion;

  } catch (error) {
    console.warn('天气获取失败:', error);
    // 使用默认天气数据
    weatherIcon.textContent = '🌤️';
    weatherTemp.textContent = '--°C';
    weatherCondition.textContent = '天气数据获取失败';
    weatherSuggestion.textContent = '请检查网络连接';
  }
}

// 天气代码转描述
function getWeatherDescription(code) {
  const codes = {
    '113': '晴',
    '116': '多云',
    '119': '阴',
    '122': '阴',
    '143': '雾',
    '176': '阵雨',
    '200': '雷阵雨',
    '227': '雪',
    '230': '大雪'
  };
  return codes[code] || '未知';
}

// 天气代码转图标
function getWeatherIcon(code) {
  const icons = {
    '113': '☀️',
    '116': '⛅',
    '119': '☁️',
    '122': '☁️',
    '143': '🌫️',
    '176': '🌧️',
    '200': '⛈️',
    '227': '❄️',
    '230': '❄️'
  };
  return icons[code] || '🌤️';
}

// 获取穿衣建议
function getWeatherSuggestion(temp, code) {
  const tempNum = parseInt(temp);

  if (tempNum < 5) return '🥶 天气寒冷，注意保暖';
  if (tempNum < 15) return '🧥 早晚温差大，建议穿外套';
  if (tempNum < 25) return '👕 温度适宜，轻便着装';
  if (code === '176' || code === '200') return '🌂 有雨记得带伞';
  return '☀️ 阳光明媚，注意防晒';
}

// 生成AI建议
function generateTip() {
  const now = new Date();
  const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  const index = seed % TIPS.length;
  const tip = TIPS[index];

  tipCategory.textContent = tip.category;
  tipText.textContent = tip.text;

  return Promise.resolve();
}

// 获取AI新闻
async function fetchNews() {
  // 直接使用本地新闻库
  return useBackupNews();
}

// 格式化日期为 MM/DD
function formatDate(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${m}月${d}日`;
}

// 备用新闻方案 - 每周3条，带日期
async function useBackupNews() {
  const today = new Date();

  // 生成最近一周的3条新闻，基于当天日期种子选取
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  // 完整新闻库（21条，每周轮换选3条）
  const allNews = [
    {
      title: 'OpenAI 发布 GPT-5 技术预览版，推理能力实现重大突破',
      source: '机器之心',
      summary: 'OpenAI 正式发布 GPT-5 技术预览版，新模型在逻辑推理、多步规划和长文本理解方面实现重大突破，基准测试成绩全面超越前代。'
    },
    {
      title: 'AI Agent 智能体协作平台成为企业数字化转型新引擎',
      source: '36氪',
      summary: '各大厂商纷纷推出智能体协作平台，支持多智能体协同完成复杂业务流程，企业级AI Agent应用进入爆发期。'
    },
    {
      title: '国产 AI 芯片取得突破，端侧推理性能大幅提升',
      source: '财经网',
      summary: '华为昇腾、寒武纪、海光等厂商的新一代芯片在端侧推理性能上实现大幅提升，部分场景已可替代进口产品。'
    },
    {
      title: '开源大模型性能持续提升，Llama 4、Qwen 2 等新模型发布',
      source: 'InfoQ',
      summary: 'Meta 发布 Llama 4，阿里发布 Qwen 2，性能进一步逼近闭源产品，部署成本保持显著优势。'
    },
    {
      title: 'AI 编程助手进入新阶段，Context Window 突破百万 tokens',
      source: 'TechCrunch',
      summary: 'AI 辅助编程工具持续进化，最新模型的上下文窗口已突破百万 tokens，可处理完整的大型代码库。'
    },
    {
      title: 'AI 监管框架逐步完善，多国出台生成式 AI 管理细则',
      source: '路透社',
      summary: '各国政府纷纷出台生成式 AI 监管细则，平衡创新与安全。欧盟 AI 法案正式生效，为全球监管提供参考框架。'
    },
    {
      title: 'AI 本地化部署成主流，企业级私有化方案需求激增',
      source: 'MIT Technology Review',
      summary: '出于数据隐私和安全性考虑，越来越多企业选择本地化部署 AI 模型，轻量级开源模型使这成为可能。'
    },
    {
      title: 'AI 在医疗领域应用深化，智能诊断覆盖更多病种',
      source: '动脉网',
      summary: 'AI 辅助诊断技术持续深化，多款产品获药监局批准，在罕见病诊断、精准医疗等领域应用不断拓展。'
    },
    {
      title: 'AI 硬件新品密集发布，AI PC 成为消费电子新热点',
      source: '爱范儿',
      summary: 'AI PC 成为消费电子市场新热点，各大厂商密集发布搭载 NPU 的新一代电脑，AI硬件从云端走向终端。'
    },
    {
      title: '国内 AI 大模型备案数量突破 500 个，行业百花齐放',
      source: '澎湃新闻',
      summary: '最新数据显示已有超过500个大模型完成备案，涵盖语言、视觉、多模态等多个领域，行业竞争日趋激烈。'
    },
    {
      title: 'AI Agent 应用场景爆发，智能体商店成为新入口',
      source: '量子位',
      summary: 'AI Agent 应用从企业级向消费级渗透，各大平台推出智能体商店，用户可自由组合使用垂直领域智能体。'
    },
    {
      title: 'Google DeepMind 发布新一代多模态模型 Gemini Ultra 2',
      source: 'The Verge',
      summary: 'Google DeepMind 发布 Gemini Ultra 2，在视频理解、代码生成和科学推理方面表现突出，多项基准刷新纪录。'
    },
    {
      title: 'Anthropic Claude 4 发布，安全对齐能力行业领先',
      source: 'VentureBeat',
      summary: 'Anthropic 发布 Claude 4，在安全对齐和可控性方面保持行业领先，企业级应用场景进一步拓展。'
    },
    {
      title: 'AI 教育应用加速落地，个性化学习方案成为主流',
      source: '多鲸资本',
      summary: 'AI 在教育领域应用加速落地，智能辅导、作业批改、学习路径规划等场景的 AI 渗透率持续提升。'
    },
    {
      title: '具身智能机器人取得新进展，多款产品进入工厂试运行',
      source: '机器人产业网',
      summary: '具身智能机器人领域迎来新突破，多家企业的人形机器人产品进入汽车工厂和物流仓库试运行阶段。'
    },
    {
      title: 'AI 视频生成技术成熟，Sora 竞品纷纷涌现',
      source: '新榜',
      summary: 'AI 视频生成技术日趋成熟，Runway、Pika、可灵等竞品纷纷推出新版本，生成质量和时长大幅提升。'
    },
    {
      title: 'AI 搜索引擎大战升级，Perplexity 推出企业版搜索',
      source: 'Wired',
      summary: 'AI 搜索引擎市场竞争白热化，Perplexity 推出企业版，Google 和 Bing 也在加速整合 AI 搜索功能。'
    },
    {
      title: 'AI 科学发现加速，新模型助力蛋白质设计和药物研发',
      source: 'Nature',
      summary: 'AI 在科学发现领域加速突破，新一代蛋白质设计模型和药物研发 AI 工具大幅缩短了新药发现周期。'
    },
    {
      title: 'AI 语音助手全面升级，实时对话能力接近人类水平',
      source: '极客公园',
      summary: 'AI 语音助手迎来全面升级，OpenAI、Google 等推出的实时语音对话能力已接近人类水平，应用场景大幅拓展。'
    },
    {
      title: 'AI 自动驾驶进入新阶段，L4 级别商用落地加速',
      source: '车云',
      summary: 'AI 自动驾驶技术进入新阶段，多家企业的 L4 级别自动驾驶方案在限定区域实现商用落地。'
    },
    {
      title: 'AI 安全与对齐研究获重大进展，新框架降低幻觉率',
      source: 'ArXiv',
      summary: 'AI 安全与对齐研究取得重大进展，多个研究团队提出的新框架有效降低了模型幻觉率，提升了输出可靠性。'
    }
  ];

  // 基于日期种子选取3条新闻（确保每周不同）
  const startIdx = (seed * 7) % allNews.length;
  const selectedNews = [];
  for (let i = 0; i < 3; i++) {
    const idx = (startIdx + i * 5) % allNews.length;
    selectedNews.push(allNews[idx]);
  }

  // 为每条新闻分配日期（最近3天内）
  const newsWithDates = selectedNews.map((news, i) => {
    const newsDate = new Date(today);
    newsDate.setDate(today.getDate() - (2 - i));
    return {
      ...news,
      date: formatDate(newsDate)
    };
  });

  // 渲染新闻列表
  renderNewsList(newsWithDates);

  // 返回新闻数据，由 saveData 统一保存
  return newsWithDates;
}

// 渲染新闻列表
function renderNewsList(newsItems) {
  newsList.innerHTML = '';

  newsItems.forEach((news) => {
    const item = document.createElement('div');
    item.className = 'news-item';
    item.innerHTML = `
      <h3 class="news-item-title">${news.title}</h3>
      <div class="news-item-meta">
        <span class="news-item-source">${news.source}</span>
        <span class="news-item-date">${news.date}</span>
      </div>
      <p class="news-item-summary">${news.summary}</p>
    `;
    newsList.appendChild(item);
  });
}

// 新闻历史记录
function addToNewsHistory(title) {
  const hash = simpleHash(title);
  newsHistory.push(hash);

  // 只保留最近7天
  if (newsHistory.length > 7) {
    newsHistory.shift();
  }

  localStorage.setItem('newsHistory', JSON.stringify(newsHistory));
}

// 简单哈希
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash;
}

// 保存数据到本地存储
function saveData(newsData) {
  const data = {
    date: new Date().toDateString(),
    lastUpdate: Date.now(),
    weather: {
      icon: weatherIcon.textContent,
      temp: weatherTemp.textContent,
      condition: weatherCondition.textContent,
      suggestion: weatherSuggestion.textContent
    },
    tip: {
      category: tipCategory.textContent,
      text: tipText.textContent
    },
    newsList: newsData || []
  };

  localStorage.setItem('dailyData', JSON.stringify(data));
}

// 从缓存加载数据
function loadCachedData() {
  try {
    const cached = localStorage.getItem('dailyData');
    if (!cached) return;

    const data = JSON.parse(cached);

    // 恢复天气
    if (data.weather) {
      weatherIcon.textContent = data.weather.icon;
      weatherTemp.textContent = data.weather.temp;
      weatherCondition.textContent = data.weather.condition;
      weatherSuggestion.textContent = data.weather.suggestion;
    }

    // 恢复建议
    if (data.tip) {
      tipCategory.textContent = data.tip.category;
      tipText.textContent = data.tip.text;
    }

    // 恢复新闻列表
    if (data.newsList && data.newsList.length > 0) {
      renderNewsList(data.newsList);
    }

    // 显示更新时间
    if (data.lastUpdate) {
      const updateDate = new Date(data.lastUpdate);
      updateTime.textContent = `更新于 ${updateDate.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
    }

  } catch (error) {
    console.error('加载缓存失败:', error);
  }
}

// 卡片动画
function animateCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, 200 + index * 150);
  });
}

// 隐藏加载
function hideLoading() {
  loadingOverlay.classList.add('hidden');
}

// 显示错误
function showError(message) {
  errorMessage.textContent = message;
  errorToast.hidden = false;

  setTimeout(() => {
    errorToast.classList.add('hidden');
  }, 3000);
}

// 检查安装提示
function checkInstallPrompt() {
  // 检查是否已显示过
  const dismissed = localStorage.getItem('installDismissed');
  if (dismissed) return;

  // 检查是否为iOS Safari或Android Chrome
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  if (isMobile && !isStandalone) {
    setTimeout(() => {
      installPrompt.hidden = false;
    }, 1500);
  }
}

// 关闭安装提示
dismissInstall.addEventListener('click', () => {
  installPrompt.hidden = true;
  localStorage.setItem('installDismissed', 'true');
});

// 注册 Service Worker
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('sw.js');
      console.log('Service Worker 注册成功:', registration.scope);

      // 检查更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 有新版本可用
            showError('有新版本可用，请刷新页面更新');
          }
        });
      });
    } catch (error) {
      console.warn('Service Worker 注册失败:', error);
    }
  }
}

// 刷新按钮（如果有新版本）
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // 每次打开时检查是否需要更新
    if (shouldUpdate()) {
      fetchAllData();
    }
  }
});
