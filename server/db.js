import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH
  ? resolve(process.env.DB_PATH)
  : resolve(__dirname, 'data', 'ehc.db');
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    phone TEXT,
    department TEXT NOT NULL,
    items TEXT NOT NULL,
    total INTEGER NOT NULL,
    pickup_time TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

  CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_wishes_created ON wishes(created_at DESC);
`);

const seedWishes = [
  { text: '希望明天的论文 deadline 是个白矮星，慢慢冷却就好。', offsetMs: 1000 * 60 * 60 * 9 },
  { text: '和喜欢的人在这儿喝完了一杯仙女座，45 亿年后再见。', offsetMs: 1000 * 60 * 60 * 36 },
  { text: 'My thesis defense is in 3 days. Send photons.', offsetMs: 1000 * 60 * 60 * 72 },
  { text: '点了黑洞派对，做完傅里叶变换的脑子终于安静了。', offsetMs: 1000 * 60 * 60 * 24 * 5 },
  { text: '在窗边看了一小时云，店员说今晚有英仙座，会留一杯给我。', offsetMs: 1000 * 60 * 60 * 4 },
  { text: '愿所有迷路的光子，都被我们的视杆细胞接住。', offsetMs: 1000 * 60 * 60 * 24 * 18 },
];

const wishCount = db.prepare('SELECT COUNT(*) AS n FROM wishes').get();
if (wishCount.n === 0) {
  const insert = db.prepare('INSERT INTO wishes (text, created_at) VALUES (?, ?)');
  const now = Date.now();
  const tx = db.transaction(() => {
    for (const w of seedWishes) insert.run(w.text, now - w.offsetMs);
  });
  tx();
}
