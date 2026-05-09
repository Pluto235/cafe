import { useEffect, useState } from 'react';
import { palette as p } from '../theme.js';
import Starfield from './Starfield.jsx';
import { api } from '../api.js';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} 天前`;
  return new Date(ts).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' });
}

export default function WishWall() {
  const [text, setText] = useState('');
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listWishes(12)
      .then((rows) => setWishes(rows))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const send = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const newWish = await api.postWish(text.trim());
      setWishes((w) => [newWish, ...w]);
      setText('');
    } catch (e) {
      setError(e.message || '发送失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="w" className="ehc-wishes">
      <div className="ehc-wishes-bg">
        <Starfield density={0.5} shooting={0.3} />
      </div>
      <div className="ehc-wishes-inner">
        <div className="ehc-eyebrow" style={{ color: p.accent }}>§04 · WALL OF WISHES</div>
        <h2 className="ehc-wishes-title" style={{ color: p.text }}>
          星愿 / <span style={{ color: p.accent, fontStyle: 'italic', fontFamily: 'var(--ehc-italic)' }}>photons into the dark</span>
        </h2>
        <div className="ehc-wishes-grid">
          <div className="ehc-wishes-form">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="// 写下你想发给宇宙的一句话…"
              rows={6}
              maxLength={140}
              style={{ background: p.ink2, borderColor: p.dim, color: p.text }}
            />
            <div className="ehc-wishes-meta" style={{ color: p.dim }}>{text.length}/140</div>
            {error && <div className="ehc-form-error">{error}</div>}
            <button
              type="button"
              onClick={send}
              disabled={!text.trim() || submitting}
              className="ehc-photon-btn"
              style={{
                borderColor: p.accent,
                color: p.accent,
                opacity: !text.trim() || submitting ? 0.4 : 1,
              }}
            >
              {submitting ? 'SENDING…' : 'SEND PHOTON →'}
            </button>
          </div>
          <div className="ehc-wishes-list">
            {loading ? (
              <div style={{ color: p.dim }}>// loading…</div>
            ) : (
              wishes.slice(0, 8).map((w) => (
                <div key={w.id} className="ehc-wish-card" style={{ borderColor: p.accent }}>
                  <p style={{ color: p.text }}>「{w.text}」</p>
                  <div className="ehc-wish-meta" style={{ color: p.dim }}>
                    — 匿名 · {timeAgo(w.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
