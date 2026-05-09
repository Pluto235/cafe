import { Hono } from 'hono';

export const wishes = new Hono();

wishes.get('/', async (c) => {
  const limit = Math.min(Math.max(Number(c.req.query('limit')) || 12, 1), 50);
  const { results } = await c.env.DB
    .prepare('SELECT id, text, created_at AS createdAt FROM wishes ORDER BY created_at DESC LIMIT ?')
    .bind(limit)
    .all();
  return c.json(results);
});

wishes.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { text } = body;
  if (typeof text !== 'string' || !text.trim())
    return c.json({ error: '不能为空' }, 400);
  if (text.trim().length > 140)
    return c.json({ error: '一句话最多 140 字' }, 400);
  const result = await c.env.DB
    .prepare('INSERT INTO wishes (text, created_at) VALUES (?, ?)')
    .bind(text.trim(), Date.now())
    .run();
  return c.json({ id: result.meta.last_row_id, text: text.trim(), createdAt: Date.now() });
});
