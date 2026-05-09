import { useState } from 'react';
import { palette as p } from '../theme.js';
import { departments, pickupSlots } from '../data/menu.js';
import { api } from '../api.js';

export default function OrderForm({ cart, setCart }) {
  const [pickup, setPickup] = useState('20:00');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('astro');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const canSubmit = cart.length > 0 && nickname.trim().length > 0 && !submitting && !result;

  const setQty = (id, qty) => {
    if (qty <= 0) setCart(cart.filter((c) => c.id !== id));
    else setCart(cart.map((c) => (c.id === id ? { ...c, qty } : c)));
  };

  const submit = async () => {
    setError('');
    if (!nickname.trim()) {
      setError('请填写昵称');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.createOrder({
        nickname: nickname.trim(),
        phone: phone.trim(),
        department,
        items: cart.map((c) => ({ id: c.id, cn: c.cn, qty: c.qty, price: c.price })),
        pickupTime: pickup,
        notes: notes.trim(),
      });
      setResult(res);
      setCart([]);
    } catch (e) {
      setError(e.message || '提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="o" className="ehc-order" style={{ background: p.ink2 }}>
      <div className="ehc-order-grid">
        <div>
          <div className="ehc-eyebrow" style={{ color: p.accent }}>§03 · RESERVE</div>
          <h2 className="ehc-order-title">
            留一杯<br />
            <span style={{ color: p.accent }}>in advance.</span>
          </h2>
          <p className="ehc-order-desc" style={{ color: p.dim }}>
            选好奶昔/咖啡与取餐时间，到店报订单号取餐即可。无需付定金。
            如当晚遇到特殊天象（流星雨、月掩星、行星合月），我们会在备注里附上观测建议。
          </p>

          <div className="ehc-pickup">
            <div className="ehc-pickup-label" style={{ color: p.dim }}>PICKUP_TIME =</div>
            <div className="ehc-pickup-grid" style={{ borderColor: p.dim }}>
              {pickupSlots.map((tm) => (
                <button
                  key={tm}
                  type="button"
                  onClick={() => setPickup(tm)}
                  className={`ehc-pickup-btn${pickup === tm ? ' is-on' : ''}`}
                  style={{
                    background: pickup === tm ? p.accent : 'transparent',
                    color: pickup === tm ? p.ink : p.text,
                    borderColor: p.dim,
                  }}
                >
                  {tm}
                </button>
              ))}
            </div>
          </div>

          <div className="ehc-form">
            <label className="ehc-field">
              <span style={{ color: p.dim }}>昵称 NICKNAME *</span>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="到店报这个名字"
                maxLength={32}
                style={{ background: p.ink, borderColor: p.dim, color: p.text }}
              />
            </label>
            <label className="ehc-field">
              <span style={{ color: p.dim }}>手机号 PHONE</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="选填，方便我们联系你"
                maxLength={20}
                inputMode="tel"
                style={{ background: p.ink, borderColor: p.dim, color: p.text }}
              />
            </label>
            <div className="ehc-field">
              <span style={{ color: p.dim }}>部门 DEPARTMENT *</span>
              <div className="ehc-dept">
                {departments.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDepartment(d.value)}
                    className={`ehc-dept-btn${department === d.value ? ' is-on' : ''}`}
                    style={{
                      background: department === d.value ? p.accent + '22' : 'transparent',
                      borderColor: department === d.value ? p.accent : p.dim,
                      color: department === d.value ? p.accent : p.text,
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="ehc-field">
              <span style={{ color: p.dim }}>备注 NOTES</span>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="例：少糖 / 不要冰 / 加奶盖"
                maxLength={200}
                style={{ background: p.ink, borderColor: p.dim, color: p.text }}
              />
            </label>
          </div>
        </div>

        <div>
          <div className="ehc-cart" style={{ borderColor: p.dim, background: p.ink + 'cc' }}>
            <div className="ehc-cart-head" style={{ borderColor: p.dim }}>
              <span>// CART</span>
              <span style={{ color: p.accent }}>{cart.length} ITEM(S)</span>
            </div>
            {cart.length === 0 ? (
              <div className="ehc-cart-empty" style={{ color: p.dim }}>
                empty horizon — add a shake above.
              </div>
            ) : (
              cart.map((c) => (
                <div key={c.id} className="ehc-cart-row" style={{ borderColor: p.dim }}>
                  <div>
                    <div style={{ color: p.text }}>{c.cn}</div>
                    <div className="ehc-cart-en" style={{ color: p.dim }}>{c.en.toUpperCase()}</div>
                  </div>
                  <div className="ehc-cart-qty">
                    <button onClick={() => setQty(c.id, c.qty - 1)} aria-label="减少" style={{ borderColor: p.dim, color: p.text }}>−</button>
                    <span style={{ color: p.accent }}>×{c.qty}</span>
                    <button onClick={() => setQty(c.id, c.qty + 1)} aria-label="增加" style={{ borderColor: p.dim, color: p.text }}>+</button>
                  </div>
                  <div className="ehc-cart-sub" style={{ color: p.accent }}>¥{c.price * c.qty}</div>
                </div>
              ))
            )}
            <div className="ehc-cart-total">
              <span style={{ color: p.dim }}>TOTAL =</span>
              <span style={{ color: p.accent }}>¥{total}</span>
            </div>

            {error && <div className="ehc-form-error">{error}</div>}

            {result ? (
              <div className="ehc-result">
                <div className="ehc-result-title" style={{ color: p.accent }}>RESERVED · {result.pickupTime} ✦</div>
                <div className="ehc-result-code" style={{ color: p.text }}>
                  订单号 / Code <strong style={{ color: p.accent }}>#{result.code}</strong>
                </div>
                <div className="ehc-pay" style={{ borderColor: p.accent, color: p.text }}>
                  <div style={{ color: p.dim, fontSize: 12, letterSpacing: '0.08em' }}>
                    PAY ¥{result.total} · 备注订单号 #{result.code}
                  </div>
                  <img
                    src="/pay-qr.png"
                    alt="收款码"
                    className="ehc-pay-qr"
                    onError={(e) => {
                      const img = e.currentTarget;
                      if (img.dataset.fallback) {
                        img.style.display = 'none';
                      } else {
                        img.dataset.fallback = '1';
                        img.src = '/pay-qr.placeholder.svg';
                      }
                    }}
                  />
                  <div style={{ color: p.dim, fontSize: 13, marginTop: 8 }}>
                    扫上方收款码支付，到吧台凭订单号取餐。
                  </div>
                </div>
                <p style={{ color: p.dim }}>
                  如需修改订单，请加微信 ehc_observatory。
                </p>
                <button
                  type="button"
                  onClick={() => { setResult(null); setNickname(''); setPhone(''); setNotes(''); }}
                  className="ehc-confirm-btn"
                  style={{ background: 'transparent', color: p.accent, border: `1px solid ${p.accent}` }}
                >
                  RESERVE ANOTHER
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit}
                className="ehc-confirm-btn"
                style={{
                  background: canSubmit ? p.accent : p.accent + '30',
                  color: canSubmit ? p.ink : p.dim,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                }}
              >
                {submitting ? 'CONFIRMING…' : `CONFIRM @ ${pickup}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
