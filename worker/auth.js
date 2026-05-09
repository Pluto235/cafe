const REALM = 'EHC Admin';

export async function adminAuth(c, next) {
  const expected = c.env.ADMIN_PASSWORD;
  if (!expected) {
    return c.json({ error: 'ADMIN_PASSWORD not configured' }, 500);
  }
  const header = c.req.header('Authorization') || '';
  if (!header.startsWith('Basic ')) {
    c.header('WWW-Authenticate', `Basic realm="${REALM}"`);
    return c.body(null, 401);
  }
  const decoded = atob(header.slice(6));
  const idx = decoded.indexOf(':');
  const user = idx >= 0 ? decoded.slice(0, idx) : decoded;
  const pass = idx >= 0 ? decoded.slice(idx + 1) : '';
  if (user !== 'staff' || pass !== expected) {
    c.header('WWW-Authenticate', `Basic realm="${REALM}"`);
    return c.body(null, 401);
  }
  return next();
}
