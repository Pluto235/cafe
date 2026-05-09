import { Hono } from 'hono';
import { adminAuth } from '../auth.js';

export const orders = new Hono();

const VALID_DEPARTMENTS = new Set(['astro', 'particle', 'condensed']);
const VALID_PICKUP = new Set([
  '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00',
]);

orders.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { nickname, phone, department, items, pickupTime, notes } = body;

  if (typeof nickname !== 'string' || !nickname.trim())
    return c.json({ error: '请填写昵称' }, 400);
  if (nickname.trim().length > 32)
    return c.json({ error: '昵称太长了，请控制在 32 字以内' }, 400);
  if (!VALID_DEPARTMENTS.has(department))
    return c.json({ error: '请选择部门' }, 400);
  if (!VALID_PICKUP.has(pickupTime))
    return c.json({ error: '请选择取餐时间' }, 400);
  if (!Array.isArray(items) || items.length === 0)
    return c.json({ error: '购物车是空的' }, 400);
  if (items.length > 20)
    return c.json({ error: '一次最多 20 项' }, 400);

  let total = 0;
  const cleanItems = [];
  for (const it of items) {
    const id    = String(it?.id || '');
    const cn    = String(it?.cn || '');
    const qty   = Number(it?.qty);
    const price = Number(it?.price);
    if (!id || !cn || !Number.isInteger(qty) || qty < 1 || qty > 20)
      return c.json({ error: '订单项格式不正确' }, 400);
    if (!Number.isFinite(price) || price < 0 || price > 999)
      return c.json({ error: '价格异常' }, 400);
    total += qty * price;
    cleanItems.push({ id, cn, qty, price });
  }

  const phoneClean = typeof phone === 'string' ? phone.trim().slice(0, 20) : '';
  const notesClean = typeof notes === 'string' ? notes.trim().slice(0, 200) : '';

  const result = await c.env.DB
    .prepare(`INSERT INTO orders
      (nickname, phone, department, items, total, pickup_time, notes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(
      nickname.trim().slice(0, 32),
      phoneClean || null,
      department,
      JSON.stringify(cleanItems),
      total,
      pickupTime,
      notesClean || null,
      Date.now(),
    )
    .run();

  const id = result.meta.last_row_id;
  return c.json({
    id,
    code: String(id).padStart(4, '0'),
    pickupTime,
    total,
  });
});

orders.get('/admin', adminAuth, async (c) => {
  const since = Number(c.req.query('since')) || (Date.now() - 1000 * 60 * 60 * 36);
  const { results } = await c.env.DB
    .prepare(`SELECT id, nickname, phone, department, items, total,
                     pickup_time AS pickupTime, notes, status, created_at AS createdAt
              FROM orders
              WHERE created_at >= ?
              ORDER BY pickup_time ASC, created_at ASC`)
    .bind(since)
    .all();
  return c.json(results.map(r => ({ ...r, items: JSON.parse(r.items) })));
});

orders.patch('/admin/:id', adminAuth, async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json().catch(() => ({}));
  const { status } = body;
  if (!['pending', 'fulfilled', 'cancelled'].includes(status))
    return c.json({ error: 'invalid status' }, 400);
  const result = await c.env.DB
    .prepare('UPDATE orders SET status = ? WHERE id = ?')
    .bind(status, id)
    .run();
  if (result.meta.changes === 0) return c.json({ error: 'not found' }, 404);
  return c.json({ ok: true });
});
