import { palette as p } from '../theme.js';

export default function HeroBlackHole({ size = 460 }) {
  return (
    <div className="ehc-hero-wrap" style={{ position: 'relative', width: size, height: size }}>
      <svg viewBox="0 0 460 460" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="bh-hole" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000" />
            <stop offset="60%" stopColor="#000" />
            <stop offset="80%" stopColor={p.accent + '66'} />
            <stop offset="100%" stopColor={p.accent + '00'} />
          </radialGradient>
          <linearGradient id="bh-ring" x1="0" x2="1">
            <stop offset="0%" stopColor={p.text} />
            <stop offset="35%" stopColor={p.accent} />
            <stop offset="65%" stopColor={p.accent} stopOpacity="0.5" />
            <stop offset="100%" stopColor={p.text} />
          </linearGradient>
          <radialGradient id="bh-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={p.accent} stopOpacity="0.6" />
            <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="230" cy="230" r="220" fill="url(#bh-glow)" opacity="0.5" />
        <g style={{ transformOrigin: '230px 230px', animation: 'bh-spin 30s linear infinite' }}>
          <ellipse cx="230" cy="230" rx="200" ry="44" fill="none" stroke="url(#bh-ring)" strokeWidth="3" />
        </g>
        <g style={{ transformOrigin: '230px 230px', animation: 'bh-spin-rev 50s linear infinite' }}>
          <ellipse cx="230" cy="230" rx="180" ry="36" fill="none" stroke="url(#bh-ring)" strokeWidth="2" opacity="0.6" />
        </g>
        <g style={{ transformOrigin: '230px 230px', animation: 'bh-spin 80s linear infinite' }}>
          <ellipse cx="230" cy="230" rx="160" ry="28" fill="none" stroke={p.text + '66'} strokeWidth="1" />
        </g>
        <circle cx="230" cy="230" r="100" fill="url(#bh-hole)" />
        <circle cx="230" cy="230" r="76" fill="#000" />
        <path d="M 100 230 Q 230 130 360 230" fill="none" stroke={p.text + '99'} strokeWidth="1.5" />
      </svg>
      <div className="ehc-hero-formula" style={{ color: p.dim }}>
        <div>r_s ≈ 2GM/c²</div>
        <div>L ≃ 10³⁹ erg/s</div>
      </div>
      <div className="ehc-hero-disk-label" style={{ color: p.dim }}>
        ⟶ accretion disk
      </div>
    </div>
  );
}
