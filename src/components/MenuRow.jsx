import { useState } from 'react';
import { palette as p } from '../theme.js';

export default function MenuRow({ item, idx, onAdd }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="ehc-row"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? `${p.accent}10` : 'transparent',
        paddingLeft: hover ? 16 : 0,
      }}
    >
      <div className="ehc-row-idx" style={{ color: p.dim }}>
        {String(idx + 1).padStart(2, '0')} /
      </div>
      <div className="ehc-row-name">
        <div className="ehc-row-cn" style={{ color: p.text }}>{item.cn}</div>
        <div className="ehc-row-en" style={{ color: p.accent }}>{item.en}</div>
      </div>
      <div className="ehc-row-sub" style={{ color: p.dim }}>{item.sub}</div>
      <div
        className="ehc-row-spectrum"
        style={{ opacity: hover ? 1 : 0.35 }}
      >
        {Object.entries(item.spectrum).map(([k, v]) => (
          <div
            key={k}
            title={k}
            style={{ flex: 1, height: `${v * 100}%`, background: p.accent, opacity: 0.6 + v * 0.4 }}
          />
        ))}
      </div>
      <div className="ehc-row-cta">
        <span className="ehc-price" style={{ color: p.accent }}>¥{item.price}</span>
        <button
          className="ehc-add-btn"
          onClick={() => onAdd(item)}
          style={{ borderColor: p.accent, color: p.accent }}
        >
          + ADD
        </button>
      </div>
    </div>
  );
}
