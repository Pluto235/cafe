// 极简的内存 IP rate limit。够防同学手贱连点，不防分布式攻击。
// 假设上游已 app.set('trust proxy', true) 让 req.ip 拿到真客户端 IP。

export function rateLimit({ windowMs, max, message = '太快了，稍等一下再试' }) {
  const hits = new Map();

  return function (req, res, next) {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const cutoff = now - windowMs;

    const arr = hits.get(ip) || [];
    while (arr.length && arr[0] < cutoff) arr.shift();

    if (arr.length >= max) {
      return res.status(429).json({ error: message });
    }

    arr.push(now);
    if (arr.length === 0) hits.delete(ip);
    else hits.set(ip, arr);

    next();
  };
}
