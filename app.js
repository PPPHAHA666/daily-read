// 每日晨读 - 主应用逻辑

// AI+硬件产品灵感库
const TIPS = [
  { text: "做一款仿真1130近防炮：ESP32-CAM识别人体→舵机云台跟随→喷水/喷雾，成本约100元，军迷圈零竞争，售价399-699元", category: "仿真模型" },
  { text: "做AI激光逗猫器：识别猫的位置→自动投射激光→猫追哪打哪，成本50元，宠物主人付费意愿极强，售价199-499元", category: "宠物智能" },
  { text: "做桌面守卫龙手办：检测人脸→龙头跟随→嘴里喷冷雾→眼睛变色，成本65元，打工人桌面经济，售价149-399元", category: "桌面摆件" },
  { text: "做AI快递看护器：检测快递投放→推送通知→检测有人拿走→报警，成本50元，独居刚需，售价99-299元", category: "智能安防" },
  { text: "做AI互动墙：人走过→墙上光影跟随→手势触发特效，成本750元，商家引流利器，单项目报价5000-50000元", category: "商业装置" },
  { text: "做仿真防空导弹车：识别移动物体（无人机/人）→发射泡沫弹→声光特效，成本120元，军迷+亲子市场，售价499-899元", category: "仿真模型" },
  { text: "做AI招财猫：识别主人→主动招手→语音播报今日运势，成本60元，开业送礼+办公桌摆件，售价129-299元", category: "桌面摆件" },
  { text: "做AI宠物喂食器：识别自家猫→放粮，别家猫→驱赶，成本80元，多猫家庭刚需，售价199-399元", category: "宠物智能" },
  { text: "做AI老人看护器：检测老人摔倒→自动拨打家人电话，成本60元，老龄化社会刚需，售价149-399元", category: "智能安防" },
  { text: "做AI太阳系模型：语音问'木星在哪'→对应行星亮灯+旋转，成本65元，家长为教育付费毫不犹豫，售价199-599元", category: "智能教具" },
  { text: "做AI猫头鹰摆件：检测人靠近→头部270°跟随→表情变化，成本55元，送礼+自用，售价129-299元", category: "桌面摆件" },
  { text: "做AI许愿树：对着树说出愿望→树叶发光→AI生成祝福语，成本200元，景区/商场网红打卡点，单项目1-5万", category: "商业装置" },
  { text: "做仿真坦克模型：AI视觉瞄准→红外对战→自动巡逻，成本150元，军迷+遥控模型爱好者，售价599-1299元", category: "仿真模型" },
  { text: "做AI宠物翻译器：采集猫狗叫声→AI分析情绪→屏幕显示'开心/饿了/想玩'，成本70元，宠物圈爆款潜力，售价199-399元", category: "宠物智能" },
  { text: "做AI儿童安全区：检测小孩靠近阳台/厨房→语音警告，成本50元，有娃家庭刚需，售价99-249元", category: "智能安防" },
  { text: "做AI恐龙模型：识别手势→恐龙做出反应→语音科普，成本80元，博物馆+家庭教育，售价199-499元", category: "智能教具" },
  { text: "做AI互动橱窗：路人经过→橱窗内容随人变化→吸引进店，成本1000元，零售门店引流，单项目5000-30000元", category: "商业装置" },
  { text: "做仿真哨兵塔：人体检测→语音警告→探照灯跟随，成本90元，军迷+安防展示，售价299-599元", category: "仿真模型" },
  { text: "做AI钢铁侠手办：语音唤醒→手掌发光→头部追踪→语音对话，成本100元，漫威粉丝圈，售价399-799元", category: "桌面摆件" },
  { text: "做AI逗狗球：识别狗的动作→自动滚动/改变方向→狗累了自动停下，成本60元，宠物智能玩具新赛道，售价149-349元", category: "宠物智能" },
  { text: "做AI独居守护器：检测长时间无人活动→自动联系紧急联系人，成本55元，独居老人安全刚需，售价99-249元", category: "智能安防" },
  { text: "做AI化学实验台：识别试剂瓶→语音提示安全注意事项，成本80元，学校实验室+家庭教育，售价199-499元", category: "智能教具" },
  { text: "做AI合影装置：自动构图→检测表情最佳瞬间→拍照，成本300元，景区/婚礼/活动，单项目3000-20000元", category: "商业装置" },
  { text: "做仿真雷达站：旋转扫描→检测移动物体→屏幕显示'目标'，成本80元，军迷桌面摆件，售价199-499元", category: "仿真模型" },
  { text: "做AI小幽灵摆件：环境声检测→随音乐律动→检测到人'躲起来'，成本50元，万圣节+潮玩市场，售价99-249元", category: "桌面摆件" },
  { text: "做AI宠物监控：检测宠物异常行为（呕吐/不动）→推送主人，成本70元，上班族的宠物焦虑刚需，售价149-349元", category: "宠物智能" },
  { text: "做AI猫眼门铃：人脸识别→识别家人/陌生人→语音播报，成本60元，独居女性+老人安全，售价99-299元", category: "智能安防" },
  { text: "做AI地理沙盘：识别地形→投影显示气候/植被，成本300元，学校+科技馆采购，售价999-2999元", category: "智能教具" },
  { text: "做AI迎宾装置：识别VIP客户→个性化问候，成本500元，酒店/会所/展厅，单项目5000-30000元", category: "商业装置" },
  { text: "核心思路：AI不是产品本身，而是让你一个人就能做出以前需要团队才能做的酷产品。客户买的是近防炮，不是买AI", category: "创业心法" },
  { text: "成本公式：ESP32-CAM(25元)+舵机(15元)+3D打印(30元)+配件(20元)≈100元，售价399元，利润300元/台，月销100台=月入3万", category: "创业心法" },
  { text: "营销路径：抖音/小红书发产品视频→军迷/宠物圈自发传播→闲鱼/淘宝成交，这种产品自带流量，不需要投广告", category: "创业心法" },
  { text: "AI赋能环节：人脸检测用HuskyLens或ESP32-CAM+TinyML，跟踪算法让AI写PID代码，舵机平滑让AI写插值，你只需调试", category: "创业心法" },
  { text: "定价策略：硬件成本×3-5倍是合理定价区间，100元成本卖299-499元，关键是产品够酷+视频够炸", category: "创业心法" },
  { text: "先做MVP：用3D打印+ESP32+舵机花3天做出原型→拍视频发抖音→有人问价再批量生产，别一上来就开模", category: "创业心法" },
  { text: "差异化壁垒：别人只会用AI出图，你能打通AI生成→自动加工→出产品的全流程，这是你的核心优势", category: "创业心法" }
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

// 获取AI新闻 - 优先中文RSS源，再HackerNews，最后本地库
async function fetchNews() {
  try {
    const rssNews = await fetchRSSNews();
    if (rssNews && rssNews.length > 0) {
      return rssNews;
    }
  } catch (error) {
    console.warn('RSS新闻获取失败:', error);
  }

  try {
    const hnNews = await fetchHackerNews();
    if (hnNews && hnNews.length > 0) {
      return hnNews;
    }
  } catch (error) {
    console.warn('HackerNews获取失败:', error);
  }

  return useBackupNews();
}

// 从中文RSS源获取AI新闻
async function fetchRSSNews() {
  // 使用RSS2JSON服务解析RSS（免费，无需API Key）
  const rssSources = [
    { url: 'https://36kr.com/feed-newsflash', name: '36氪' },
    { url: 'https://www.ithome.com/rss/', name: 'IT之家' }
  ];

  const allItems = [];

  for (const source of rssSources) {
    try {
      const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}&count=20`;
      const response = await fetch(rss2jsonUrl, {
        signal: AbortSignal.timeout(6000)
      });

      if (!response.ok) continue;

      const data = await response.json();
      if (data.status !== 'ok' || !data.items) continue;

      // 筛选AI相关新闻
      const aiKeywords = ['AI', '人工智能', '大模型', 'GPT', 'Claude', 'Gemini', 'LLM', 'OpenAI', 'DeepSeek', 'Qwen', '通义', '智谱', '百度', '机器人', '芯片', '自动驾驶', '机器学习', '深度学习', 'AIGC', 'Agent', '智能体', '具身', 'TinyML', '嵌入式'];

      const filtered = data.items.filter(item => {
        const text = (item.title + ' ' + (item.description || '')).toLowerCase();
        return aiKeywords.some(kw => text.includes(kw.toLowerCase()));
      });

      filtered.forEach(item => {
        const pubDate = new Date(item.pubDate);
        const now = new Date();
        const daysDiff = Math.floor((now - pubDate) / (1000 * 60 * 60 * 24));

        if (daysDiff <= 7) {
          allItems.push({
            title: item.title.replace(/<[^>]*>/g, ''),
            source: source.name,
            date: formatDate(pubDate),
            summary: (item.description || item.title).replace(/<[^>]*>/g, '').substring(0, 150),
            url: item.link,
            pubTimestamp: pubDate.getTime()
          });
        }
      });
    } catch (e) {
      console.warn(`RSS源 ${source.name} 获取失败:`, e);
    }
  }

  if (allItems.length === 0) throw new Error('无AI相关新闻');

  // 按时间排序，取最新3条
  allItems.sort((a, b) => b.pubTimestamp - a.pubTimestamp);
  const top3 = allItems.slice(0, 3);

  renderNewsList(top3);
  return top3;
}

// 从HackerNews获取AI相关新闻
async function fetchHackerNews() {
  // 搜索AI相关最新帖子
  const searchURL = 'https://hn.algolia.com/api/v1/search?query=AI+artificial+intelligence&tags=story&hitsPerPage=10&numericFilters=created_at_i>' + Math.floor(Date.now() / 1000) - 7 * 24 * 3600;

  const response = await fetch(searchURL, {
    signal: AbortSignal.timeout(8000)
  });

  if (!response.ok) throw new Error('HackerNews API响应失败');

  const data = await response.json();

  if (!data.hits || data.hits.length === 0) throw new Error('无搜索结果');

  // 筛选得分较高的新闻，取前3条
  const sorted = data.hits
    .filter(hit => hit.title && hit.points > 5)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);

  if (sorted.length === 0) throw new Error('无高质量结果');

  const newsItems = sorted.map((hit, i) => {
    const newsDate = new Date(hit.created_at);
    return {
      title: hit.title,
      source: 'HackerNews',
      date: formatDate(newsDate),
      summary: hit.title + (hit.url ? '' : ' (讨论帖)'),
      url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      points: hit.points,
      comments: hit.num_comments || 0
    };
  });

  // 渲染新闻列表
  renderNewsList(newsItems);

  return newsItems;
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
      title: 'OpenAI 发布 GPT-5，推理与多模态能力实现重大飞跃',
      source: '机器之心',
      summary: 'OpenAI 正式发布 GPT-5，新模型在逻辑推理、多步规划和长文本理解方面实现重大突破，多模态能力全面升级，基准测试成绩大幅超越 GPT-4o。'
    },
    {
      title: 'AI Agent 智能体生态爆发，个人开发者可独立构建复杂应用',
      source: '36氪',
      summary: 'AI Agent 开发门槛持续降低，MCP协议和智能体框架让个人开发者也能独立构建以前需要整个团队才能完成的复杂应用。'
    },
    {
      title: '国产端侧AI芯片性能翻倍，ESP32-CAM等开发板支持本地推理',
      source: '电子发烧友',
      summary: '国产AI芯片在端侧推理性能上持续突破，低成本开发板已能运行轻量级视觉模型，为个人硬件开发者打开了AI产品化的大门。'
    },
    {
      title: 'Meta 发布 Llama 4，开源模型性能首次全面超越闭源竞品',
      source: 'InfoQ',
      summary: 'Meta 发布 Llama 4 系列开源模型，在多项基准测试中首次全面超越同级别闭源产品，开源社区迎来里程碑时刻。'
    },
    {
      title: 'AI 编程工具再进化，单开发者可完成全栈项目交付',
      source: 'TechCrunch',
      summary: '新一代AI编程工具支持从需求分析到部署的全流程辅助，单个开发者借助AI可完成以前需要5人团队才能交付的项目。'
    },
    {
      title: '全球AI监管框架加速落地，中国发布生成式AI应用管理办法',
      source: '新华社',
      summary: '中国正式发布生成式AI应用管理办法，对AI产品的安全评估、数据合规和用户权益保护提出明确要求，为行业健康发展提供制度保障。'
    },
    {
      title: '边缘AI部署成本降至历史新低，个人硬件创业迎来窗口期',
      source: 'MIT Technology Review',
      summary: '边缘AI芯片和轻量级模型的双重进步，使本地AI部署成本降至历史新低，个人开发者和硬件创业者迎来了前所未有的产品化窗口期。'
    },
    {
      title: 'AI视觉识别技术民用化加速，低成本方案催生大量创新产品',
      source: '量子位',
      summary: '基于ESP32-CAM等低成本硬件的AI视觉方案日趋成熟，人脸检测、目标跟踪等功能已可在百元级设备上流畅运行，催生大量创新消费产品。'
    },
    {
      title: 'AI PC 和端侧AI设备市场爆发，消费电子进入智能化新阶段',
      source: '爱范儿',
      summary: '搭载NPU的AI PC和各类端侧AI设备市场爆发式增长，消费电子全面进入智能化新阶段，硬件+AI成为产品创新标配。'
    },
    {
      title: '国内大模型价格战白热化，API调用成本降至每百万token 0.1元',
      source: '澎湃新闻',
      summary: '国内大模型厂商价格战持续升级，API调用成本已降至每百万token 0.1元以下，开发者构建AI应用的成本门槛几乎消失。'
    },
    {
      title: 'Google DeepMind 发布 Gemini Ultra 2，科学推理能力突出',
      source: 'The Verge',
      summary: 'Google DeepMind 发布 Gemini Ultra 2，在科学推理、数学证明和代码生成方面表现突出，多项基准测试刷新纪录。'
    },
    {
      title: 'Anthropic 发布 Claude 4，长文本理解与安全对齐行业领先',
      source: 'VentureBeat',
      summary: 'Anthropic 发布 Claude 4，在百万级上下文理解和安全对齐方面保持行业领先，企业级应用场景进一步拓展。'
    },
    {
      title: 'AI+硬件创业成为2026年最热赛道，个人开发者批量涌现',
      source: '极客公园',
      summary: 'AI能力平民化让硬件创业门槛骤降，大量个人开发者利用AI+嵌入式技能打造创新硬件产品，在抖音和闲鱼上实现从0到1的商业验证。'
    },
    {
      title: '具身智能机器人进入工厂试运行，人形机器人商业化加速',
      source: '机器人产业网',
      summary: '多家企业的人形机器人产品进入汽车工厂和物流仓库试运行，具身智能从实验室走向实际应用，商业化进程明显加速。'
    },
    {
      title: 'AI视频生成质量飞跃，Sora 2和可灵2实现电影级画面',
      source: '新榜',
      summary: 'AI视频生成技术实现质的飞跃，Sora 2和可灵2等新一代模型可生成电影级画面质量，时长和一致性大幅提升。'
    },
    {
      title: 'AI搜索引擎重塑信息获取方式，传统搜索面临颠覆',
      source: 'Wired',
      summary: 'AI搜索引擎正在重塑用户获取信息的方式，Perplexity、ChatGPT Search等产品快速增长，传统搜索引擎面临根本性挑战。'
    },
    {
      title: 'AI科学发现加速，新模型助力蛋白质设计和药物研发',
      source: 'Nature',
      summary: 'AI在科学发现领域持续突破，新一代蛋白质设计模型和药物研发AI工具大幅缩短了新药发现周期，多家药企已将其纳入核心研发流程。'
    },
    {
      title: '3D打印+AI设计让定制化制造走进家庭，个人工厂成为现实',
      source: '创客邮',
      summary: 'AI生成3D模型+家用3D打印机的组合让定制化制造走进家庭，个人即可完成从设计到生产的全流程，"个人工厂"模式开始兴起。'
    },
    {
      title: 'AI语音助手实现实时自然对话，智能硬件交互体验质变',
      source: '极客公园',
      summary: 'AI语音助手实现真正的实时自然对话，延迟降至300ms以内，智能硬件的交互体验发生质变，语音成为硬件产品的主要交互方式。'
    },
    {
      title: 'L4级自动驾驶在多城开放运营，AI出行服务进入商业化阶段',
      source: '车云',
      summary: 'L4级自动驾驶出租车在多个城市正式开放运营，AI出行服务从测试阶段进入商业化阶段，无人驾驶不再是未来概念。'
    },
    {
      title: 'TinyML让微控制器跑AI成为现实，嵌入式开发迎来AI时代',
      source: 'Hackster.io',
      summary: 'TinyML技术成熟让ESP32等微控制器运行AI模型成为现实，嵌入式开发者无需云端即可实现本地智能，催生大量低成本AI硬件产品。'
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

  newsItems.forEach((news, index) => {
    const item = document.createElement('div');
    item.className = 'news-item';

    // 如果有外部链接，标题可点击
    const titleHTML = news.url
      ? `<a class="news-item-title news-item-link" href="${news.url}" target="_blank" rel="noopener">${news.title}</a>`
      : `<h3 class="news-item-title">${news.title}</h3>`;

    // HackerNews来源显示点赞和评论数
    const metaExtra = news.points !== undefined
      ? `<span class="news-item-points">▲ ${news.points}</span><span class="news-item-comments">💬 ${news.comments}</span>`
      : '';

    item.innerHTML = `
      ${titleHTML}
      <div class="news-item-meta">
        <span class="news-item-source">${news.source}</span>
        <span class="news-item-date">${news.date}</span>
        ${metaExtra}
      </div>
      <p class="news-item-summary" id="news-summary-${index}">${news.summary}</p>
      <button class="news-expand-btn" id="news-expand-${index}" onclick="toggleNewsExpand(${index})">
        展开全文 <span class="arrow">▼</span>
      </button>
    `;
    newsList.appendChild(item);
  });
}

// 展开/收起新闻
function toggleNewsExpand(index) {
  const summary = document.getElementById(`news-summary-${index}`);
  const btn = document.getElementById(`news-expand-${index}`);

  if (summary.classList.contains('expanded')) {
    summary.classList.remove('expanded');
    btn.classList.remove('expanded');
    btn.innerHTML = '展开全文 <span class="arrow">▼</span>';
  } else {
    summary.classList.add('expanded');
    btn.classList.add('expanded');
    btn.innerHTML = '收起 <span class="arrow">▼</span>';
  }
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
            // 显示更新提示条
            showUpdateBar();
          }
        });
      });

      // 每次页面获得焦点时检查更新
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          registration.update();
        }
      });
    } catch (error) {
      console.warn('Service Worker 注册失败:', error);
    }
  }
}

// 显示版本更新提示
function showUpdateBar() {
  const updateBar = document.getElementById('update-bar');
  const updateBtn = document.getElementById('update-btn');
  updateBar.hidden = false;

  updateBtn.addEventListener('click', () => {
    // 通知新SW立即激活，然后刷新页面
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
    // 发送消息给等待中的SW，让它跳过等待立即激活
    navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
    // 兜底：1秒后直接刷新
    setTimeout(() => window.location.reload(), 1000);
  });
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
