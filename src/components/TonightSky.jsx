import { palette as p } from '../theme.js';
import { tonight } from '../data/tonight.js';

export default function TonightSky() {
  const cells = [
    ['日落 SUNSET', tonight.sunset],
    ['月相 MOON', tonight.moon],
    ['亮点 EVENT', tonight.highlight],
    ['天气 SEEING', tonight.seeing],
  ];
  return (
    <section className="ehc-tonight" style={{ background: p.ink2, borderTop: `1px solid ${p.dim}` }}>
      <div className="ehc-tonight-inner">
        <div>
          <div className="ehc-eyebrow" style={{ color: p.accent }}>✦ TONIGHT'S SKY</div>
          <h2 className="ehc-tonight-title" style={{ color: p.text }}>今夜</h2>
        </div>
        <div className="ehc-tonight-grid">
          {cells.map(([l, v], i) => (
            <div
              key={l}
              className="ehc-tonight-cell"
              style={{ borderLeft: i ? `1px solid ${p.dim}` : 'none' }}
            >
              <div className="ehc-tonight-label" style={{ color: p.dim }}>{l}</div>
              <div className="ehc-tonight-value" style={{ color: p.text }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
