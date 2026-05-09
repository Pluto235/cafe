import { Router } from 'express';
import { db } from '../db.js';
import { basicAuth } from '../auth.js';
import { rateLimit } from '../rateLimit.js';

export const orders = Router();

const VALID_DEPARTMENTS = new Set(['astro', 'particle', 'condensed']);
const VALID_PICKUP = new Set([
  '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00',
]);

const orderLimiter = rateLimit({
  windowMs: 60_000,
  max: 3,
  message: '点单太频繁了，请稍等一分钟再试 ✦',
});

orders.post('/', orderLimiter, (req, res) => {
  const { nickname, phone, department, items, pickupTime, notes } = req.body || {};

  if (typeof nickname !== 'string' || !nickname.trim()) {
    return res.status(400).json({ error: '请填写昵称' });
  }
  if (nickname.trim().length > 32) {
    return res.status(400).json({ error: '昵称太长了，请控制在 32 字以内' });
  }
  if (!VALID_DEPARTMENTS.has(department)) {
    return res.status(400).json({ error: '请选择部门' });
  }
  if (!VALID_PICKUP.has(pickupTime)) {
    return res.status(400).json({ error: '请选择取餐时间' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: '购物车是空的' });
  }
  if (items.length > 20) {
    return res.status(400).json({ error: '一次最多 20 项' });
  }

  let total = 0;
  const cleanItems = [];
  for (const it of items) {
    const id = String(it?.id || '');
    const cn = String(it?.cn || '');
    const qty = Number(it?.qty);
    const price = Number(it?.price);
    if (!id || !cn || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      return res.status(400).json({ error: '订单项格式不正确' });
    }
    if (!Number.isFinite(price) || price < 0 || price > 999) {
      return res.status(400).json({ error: '价格异常' });
    }
    total += qty * price;
    cleanItems.push({ id, cn, qty, price });
  }

  const phoneClean = typeof phone === 'string' ? phone.trim().slice(0, 20) : '';
  const notesClean = typeof notes === 'string' ? notes.trim().slice(0, 200) : '';

  const stmt = db.prepare(`
    INSERT INTO orders (nickname, phone, department, items, total, pickup_time, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    nickname.trim().slice(0, 32),
    phoneClean || null,
    department,
    JSON.stringify(cleanItems),
    total,
    pickupTime,
    notesClean || null,
    Date.now(),
  );

  res.json({
    id: result.lastInsertRowid,
    code: String(result.lastInsertRowid).padStart(4, '0'),
    pickupTime,
    total,
  });
});

orders.get('/admin', basicAuth, (req, res) => {
  const since = Number(req.query.since) || (Date.now() - 1000 * 60 * 60 * 36);
  const rows = db.prepare(`
    SELECT id, nickname, phone, department, items, total, pickup_time AS pickupTime,
           notes, status, created_at AS createdAt
    FROM orders
    WHERE created_at >= ?
    ORDER BY pickup_time ASC, created_at ASC
  `).all(since);
  res.json(rows.map(r => ({ ...r, items: JSON.parse(r.items) })));
});

orders.patch('/admin/:id', basicAuth, (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body || {};
  if (!['pending', 'fulfilled', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'invalid status' });
  }
  const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  if (result.changes === 0) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
});
