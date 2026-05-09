import { useEffect, useRef } from 'react';
import { palette as p } from '../theme.js';

export default function Starfield({ density = 1, shooting = 1 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    let raf, w, h;
    let stars = [];
    let shoots = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.floor((w * h) / 2200 * density);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.2,
        a: Math.random() * 0.7 + 0.3,
        tw: Math.random() * 0.02 + 0.005,
        ph: Math.random() * Math.PI * 2,
      }));
    }
    function tick(t) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = s.a * (0.6 + 0.4 * Math.sin(t * s.tw + s.ph));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.text}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }
      if (Math.random() < 0.003 * shooting) {
        shoots.push({
          x: Math.random() * w * 0.7 + w * 0.1,
          y: Math.random() * h * 0.4,
          vx: 4 + Math.random() * 3,
          vy: 1.2 + Math.random() * 1,
          life: 0,
          max: 60 + Math.random() * 30,
        });
      }
      shoots = shoots.filter((sh) => {
        sh.life++;
        const head = sh.life / sh.max;
        if (head >= 1) return false;
        const len = 80;
        const tx = sh.x + sh.vx * sh.life;
        const ty = sh.y + sh.vy * sh.life;
        const grd = ctx.createLinearGradient(tx, ty, tx - len, ty - (len * sh.vy) / sh.vx);
        grd.addColorStop(0, `${p.text}${Math.round(0.9 * (1 - head) * 255).toString(16).padStart(2, '0')}`);
        grd.addColorStop(1, p.text + '00');
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx - len, ty - (len * sh.vy) / sh.vx);
        ctx.stroke();
        return true;
      });
      raf = requestAnimationFrame(tick);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [density, shooting]);
  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
