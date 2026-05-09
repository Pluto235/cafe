// 主菜单：奶昔（来自 PDF 设计 + zip shared/data.js）+ 咖啡占位
export const shakes = [
  {
    id: 'perseus',
    cn: '英仙座',
    en: 'Perseus',
    sub: '焦糖海盐 · 流星雨季限定',
    blurb: '英仙座流星雨在 8 月划过夜空时酿成的味道：焦糖在杯壁拉出尾迹，海盐落在最后一口。',
    spectrum: { 焦糖: 0.92, 海盐: 0.74, 奶香: 0.68, 烟熏: 0.40, 苦韵: 0.22 },
    price: 28,
    accent: '#e9b86a',
  },
  {
    id: 'blackhole',
    cn: '黑洞派对',
    en: 'Black Hole Party',
    sub: '黑芝麻 · 黑可可 · 漆夜',
    blurb: '一切都被吸进去：黑芝麻、黑可可、竹炭。逃逸速度为零，只有最深的甜还能反射出来。',
    spectrum: { 焙香: 0.88, 苦巧: 0.82, 坚果: 0.70, 奶香: 0.55, 甜度: 0.40 },
    price: 30,
    accent: '#9c7bd6',
  },
  {
    id: 'whitedwarf',
    cn: '白矮星',
    en: 'White Dwarf',
    sub: '椰奶 · 白桃 · 残光',
    blurb: '燃烧殆尽后留下的核心，密度极高、温度尚存。椰奶为壳，白桃做核，余光是一缕香草。',
    spectrum: { 果香: 0.85, 椰奶: 0.78, 香草: 0.62, 清甜: 0.72, 酸度: 0.30 },
    price: 26,
    accent: '#f3e7c7',
  },
  {
    id: 'andromeda',
    cn: '仙女座',
    en: 'Andromeda',
    sub: '紫薯 · 蓝莓 · 螺旋慕斯',
    blurb: '与我们的星系正在靠近，预计 45 亿年后碰撞。紫薯与蓝莓在杯中先交错、再融合。',
    spectrum: { 莓果: 0.90, 薯香: 0.74, 奶盖: 0.65, 酸度: 0.55, 甜度: 0.60 },
    price: 28,
    accent: '#b59bd9',
  },
  {
    id: 'cygnus',
    cn: '天鹅座 X-1',
    en: 'Cygnus X-1',
    sub: '抹茶 · 蜂蜜 · 强 X 射线',
    blurb: '人类首次确认的黑洞候选体。抹茶的苦底蓄势，蜂蜜从顶端俯冲，发出微弱辐射。',
    spectrum: { 茶香: 0.92, 草本: 0.70, 蜜甜: 0.66, 苦韵: 0.58, 奶香: 0.50 },
    price: 30,
    accent: '#a7c89a',
  },
  {
    id: 'pleiades',
    cn: '昴星团',
    en: 'Pleiades',
    sub: '七姐妹 · 草莓 · 棉花糖星云',
    blurb: '七颗最亮的星挤在一片淡蓝星云里。七颗草莓、一团烤棉花糖，浮在杯口像微型星团。',
    spectrum: { 莓果: 0.88, 奶香: 0.78, 焦糖: 0.55, 清甜: 0.82, 酸度: 0.42 },
    price: 26,
    accent: '#f1a3b6',
  },
];

// 咖啡占位 —— 后期由你完善口味描述与定价
export const coffees = [
  {
    id: 'solar-wind',
    cn: '太阳风',
    en: 'Solar Wind',
    sub: '美式 · 单一产地豆',
    blurb: '从恒星表面以 400 km/s 吹出的等离子流。明亮的酸、干净的尾韵。',
    spectrum: { 酸度: 0.78, 焙香: 0.62, 醇厚: 0.42, 甜感: 0.40, 苦韵: 0.55 },
    price: 18,
    accent: '#e6a44b',
  },
  {
    id: 'moonlight',
    cn: '月光',
    en: 'Moonlight Latte',
    sub: '拿铁 · 厚奶泡 · 14% 月相',
    blurb: '34 万公里之外的反射光。厚奶泡像蛾眉月一样停在杯口。',
    spectrum: { 奶香: 0.92, 醇厚: 0.74, 甜感: 0.62, 焙香: 0.45, 酸度: 0.20 },
    price: 22,
    accent: '#f3e7c7',
  },
  {
    id: 'dark-matter',
    cn: '暗物质',
    en: 'Dark Matter',
    sub: '双份浓缩 · 不透光',
    blurb: '占宇宙总质能 27%，看不见但是真实存在。两份 ristretto，比夜更深一点。',
    spectrum: { 焙香: 0.95, 醇厚: 0.88, 苦韵: 0.78, 甜感: 0.30, 酸度: 0.36 },
    price: 20,
    accent: '#8b5cf6',
  },
  {
    id: 'red-giant',
    cn: '红巨星',
    en: 'Red Giant',
    sub: '手冲 · 日晒处理',
    blurb: '太阳耗尽核心氢之后膨胀成的样子。果香饱满、温度先上后下。',
    spectrum: { 果香: 0.86, 酸度: 0.72, 甜感: 0.78, 醇厚: 0.55, 焙香: 0.40 },
    price: 25,
    accent: '#ef6f4e',
  },
];

export const departments = [
  { value: 'astro', label: '天文分部' },
  { value: 'particle', label: '粒子分部' },
  { value: 'condensed', label: '凝聚态分部' },
];

export const pickupSlots = [
  '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00',
];
