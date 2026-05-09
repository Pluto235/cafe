import { Hono } from 'hono';
import { orders } from './routes/orders.js';
import { wishes } from './routes/wishes.js';

const app = new Hono();

app.route('/api/orders', orders);
app.route('/api/wishes', wishes);

app.get('/api/health', (c) => c.json({ ok: true }));

// SPA fallthrough：先尝试静态资源，找不到才返回 index.html
app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw));

export default app;
