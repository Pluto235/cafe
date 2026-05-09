import { useEffect, useState } from 'react';
import { palette as p } from '../theme.js';
import { departments } from '../data/menu.js';
import { api } from '../api.js';

const deptLabel = (v) => departments.find((d) => d.value === v)?.label || v;

function fmtTime(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function Admin() {
  const [auth, setAuth] = useState(() => sessionStorage.getItem('ehc-admin-auth') || '');
  const [user, setUser] = useState('staff');
  const [pass, setPass] = useState('');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async (a) => {
    setError('');
    setLoading(true);
    try {
      const data = await api.listOrders(a);
      setOrders(data);
    } catch (e) {
      setError(e.message);
      if (/401/.test(e.message) || /unauthorized/i.test(e.message)) {
        setAuth('');
        sessionStorage.removeItem('ehc-admin-auth');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) load(auth);
  }, [auth]);

  const login = (e) => {
    e.preventDefault();
    const a = 'Basic ' + btoa(`${user}:${pass}`);
    sessionStorage.setItem('ehc-admin-auth', a);
    setAuth(a);
  };

  const setStatus = async (id, status) => {
    try {
      await api.updateOrder(id, status, auth);
      setOrders((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (e) {
      alert(e.message);
    }
  };

  if (!auth) {
    return (
      <div className="ehc-admin-login" style={{ background: p.ink, color: p.text }}>
        <form onSubmit={login} className="ehc-admin-login-card" style={{ borderColor: p.dim, background: p.ink2 }}>
          <div className="ehc-eyebrow" style={{ color: p.accent }}>EHC · STAFF LOGIN</div>
          <h1 style={{ color: p.text, fontWeight: 300 }}>店员登录</h1>
          <label className="ehc-field">
            <span style={{ color: p.dim }}>USER</span>
            <input value={user} onChange={(e) => setUser(e.target.value)} style={{ background: p.ink, borderColor: p.dim, color: p.text }} />
          </label>
          <label className="ehc-field">
            <span style={{ color: p.dim }}>PASSWORD</span>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={{ background: p.ink, borderColor: p.dim, color: p.text }} />
          </label>
          {error && <div className="ehc-form-error">{error}</div>}
          <button type="submit" className="ehc-confirm-btn" style={{ background: p.accent, color: p.ink, marginTop: 16 }}>
            LOG IN →
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="ehc-admin" style={{ background: p.ink, color: p.text }}>
      <header className="ehc-admin-head">
        <div>
          <div className="ehc-eyebrow" style={{ color: p.accent }}>// ORDERS · LAST 36H</div>
          <h1 style={{ color: p.text, fontWeight: 300 }}>店员后台</h1>
        </div>
        <div className="ehc-admin-actions">
          <button onClick={() => load(auth)} disabled={loading} className="ehc-photon-btn" style={{ borderColor: p.accent, color: p.accent }}>
            {loading ? '加载中…' : '刷新 ⟲'}
          </button>
          <button
            onClick={() => { sessionStorage.removeItem('ehc-admin-auth'); setAuth(''); }}
            className="ehc-photon-btn"
            style={{ borderColor: p.dim, color: p.dim }}
          >
            登出
          </button>
        </div>
      </header>

      {error && <div className="ehc-form-error">{error}</div>}

      <div className="ehc-admin-table-wrap">
        <table className="ehc-admin-table" style={{ color: p.text }}>
          <thead style={{ color: p.dim }}>
            <tr>
              <th>#</th>
              <th>取餐时间</th>
              <th>昵称</th>
              <th>部门</th>
              <th>商品</th>
              <th>合计</th>
              <th>手机</th>
              <th>备注</th>
              <th>下单</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: p.dim }}>// 暂无订单</td></tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className={`ehc-admin-row status-${o.status}`} style={{ borderColor: p.dim + '40' }}>
                <td><strong style={{ color: p.accent }}>#{String(o.id).padStart(4, '0')}</strong></td>
                <td style={{ color: p.accent }}>{o.pickupTime}</td>
                <td>{o.nickname}</td>
                <td>{deptLabel(o.department)}</td>
                <td>
                  {o.items.map((it) => (
                    <div key={it.id} className="ehc-admin-item">
                      {it.cn} <span style={{ color: p.dim }}>×{it.qty}</span>
                    </div>
                  ))}
                </td>
                <td style={{ color: p.accent }}>¥{o.total}</td>
                <td style={{ color: p.dim, fontFamily: 'var(--ehc-mono)' }}>{o.phone || '—'}</td>
                <td style={{ color: p.dim, maxWidth: 220 }}>{o.notes || '—'}</td>
                <td style={{ color: p.dim, fontFamily: 'var(--ehc-mono)' }}>{fmtTime(o.createdAt)}</td>
                <td>
                  {o.status === 'pending' && (
                    <div className="ehc-admin-actions-cell">
                      <button onClick={() => setStatus(o.id, 'fulfilled')} className="ehc-admin-btn ok" style={{ borderColor: p.accent, color: p.accent }}>✓ 完成</button>
                      <button onClick={() => setStatus(o.id, 'cancelled')} className="ehc-admin-btn" style={{ borderColor: p.dim, color: p.dim }}>✕ 取消</button>
                    </div>
                  )}
                  {o.status === 'fulfilled' && <span style={{ color: p.accent }}>✓ 已完成</span>}
                  {o.status === 'cancelled' && <span style={{ color: p.dim }}>已取消</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
