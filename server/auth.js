const realm = 'EHC Admin';

export function basicAuth(req, res, next) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD not set on server' });
  }
  const header = req.headers.authorization || '';
  if (!header.startsWith('Basic ')) {
    res.set('WWW-Authenticate', `Basic realm="${realm}"`);
    return res.status(401).end();
  }
  const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
  const idx = decoded.indexOf(':');
  const user = idx >= 0 ? decoded.slice(0, idx) : decoded;
  const pass = idx >= 0 ? decoded.slice(idx + 1) : '';
  if (user !== 'staff' || pass !== expected) {
    res.set('WWW-Authenticate', `Basic realm="${realm}"`);
    return res.status(401).end();
  }
  next();
}
