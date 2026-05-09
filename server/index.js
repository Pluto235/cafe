import express from 'express';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { orders } from './routes/orders.js';
import { wishes } from './routes/wishes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');
const port = Number(process.env.PORT) || 8787;

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);
app.use(express.json({ limit: '32kb' }));

app.use('/api/orders', orders);
app.use('/api/wishes', wishes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

if (existsSync(distDir)) {
  app.use(express.static(distDir, { maxAge: '1h', index: false }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(resolve(distDir, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => {
    res.status(503).type('text/plain').send(
      'EHC: dist/ 不存在。请先 `npm run build`，再启动 server。\n' +
      '开发期可以分别跑 `npm run dev:api` (8787) 与 `npm run dev:web` (5173)。'
    );
  });
}

app.listen(port, () => {
  console.log(`✦ EHC listening on :${port}  (admin password ${process.env.ADMIN_PASSWORD ? 'set' : 'NOT SET'})`);
});
