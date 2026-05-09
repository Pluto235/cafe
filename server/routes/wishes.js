import { Router } from 'express';
import { db } from '../db.js';
import { rateLimit } from '../rateLimit.js';

export const wishes = Router();

const wishLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  message: '心愿写得太快啦，让其他人也写一会儿吧',
});

wishes.get('/', (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
  const rows = db.prepare(`
    SELECT id, text, created_at AS createdAt
    FROM wishes
    ORDER BY created_at DESC
    LIMIT ?
  `).all(limit);
  res.json(rows);
});

wishes.post('/', wishLimiter, (req, res) => {
  const { text } = req.body || {};
  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: '不能为空' });
  }
  if (text.trim().length > 140) {
    return res.status(400).json({ error: '一句话最多 140 字' });
  }
  const result = db.prepare('INSERT INTO wishes (text, created_at) VALUES (?, ?)')
    .run(text.trim(), Date.now());
  res.json({ id: result.lastInsertRowid, text: text.trim(), createdAt: Date.now() });
});
