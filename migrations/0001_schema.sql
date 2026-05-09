-- Event Horizon Café · D1 初始化
-- 执行：npx wrangler d1 migrations apply ehc-db [--local]

CREATE TABLE IF NOT EXISTS orders (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  nickname    TEXT    NOT NULL,
  phone       TEXT,
  department  TEXT    NOT NULL,
  items       TEXT    NOT NULL,
  total       INTEGER NOT NULL,
  pickup_time TEXT    NOT NULL,
  notes       TEXT,
  status      TEXT    NOT NULL DEFAULT 'pending',
  created_at  INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

CREATE TABLE IF NOT EXISTS wishes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  text       TEXT    NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_wishes_created ON wishes(created_at DESC);

-- seed 心愿（id 固定，重跑 migration 不重复插入）
INSERT OR IGNORE INTO wishes (id, text, created_at) VALUES
(1, '希望明天的论文 deadline 是个白矮星，慢慢冷却就好。',       1746000000000),
(2, '和喜欢的人在这儿喝完了一杯仙女座，45 亿年后再见。',         1745870000000),
(3, 'My thesis defense is in 3 days. Send photons.',           1745740000000),
(4, '点了黑洞派对，做完傅里叶变换的脑子终于安静了。',             1745560000000),
(5, '在窗边看了一小时云，店员说今晚有英仙座，会留一杯给我。',      1745980000000),
(6, '愿所有迷路的光子，都被我们的视杆细胞接住。',               1744420000000);
