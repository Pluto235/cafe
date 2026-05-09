import { useState } from 'react';
import { palette as p } from '../theme.js';
import { shakes, coffees } from '../data/menu.js';
import { tonight } from '../data/tonight.js';
import HeroBlackHole from '../components/HeroBlackHole.jsx';
import Starfield from '../components/Starfield.jsx';
import MenuRow from '../components/MenuRow.jsx';
import TonightSky from '../components/TonightSky.jsx';
import OrderForm from '../components/OrderForm.jsx';
import WishWall from '../components/WishWall.jsx';

export default function Home() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((x) => x.id === item.id);
      if (found) return prev.map((x) => (x.id === item.id ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { id: item.id, cn: item.cn, en: item.en, price: item.price, qty: 1 }];
    });
  };

  return (
    <div className="ehc-app" style={{ background: p.ink, color: p.text }}>
      {/* HERO */}
      <section className="ehc-hero">
        <div className="ehc-stars">
          <Starfield density={1} shooting={1} />
        </div>

        <nav className="ehc-nav">
          <div className="ehc-nav-brand" style={{ color: p.text }}>
            EHC<span style={{ color: p.accent, margin: '0 6px' }}>·</span>事件视界
          </div>
          <div className="ehc-nav-links" style={{ color: p.dim }}>
            {[['MENU', '#m'], ['ORDER', '#o'], ['WISHES', '#w'], ['ABOUT', '#a']].map(([n, h]) => (
              <a key={n} href={h}>[ {n} ]</a>
            ))}
          </div>
          <div className="ehc-nav-date" style={{ color: p.dim }}>{tonight.dateEn.toUpperCase()}</div>
        </nav>

        <div className="ehc-hero-grid">
          <div className="ehc-hero-text">
            <div className="ehc-eyebrow" style={{ color: p.accent }}>
              ▸ EST. 2026 / DEPT. OF ASTRONOMY / Bldg-A 1F
            </div>
            <h1 className="ehc-hero-h1">
              一切味道<br />
              被引向<br />
              <span className="ehc-hero-accent" style={{ color: p.accent }}>视界。</span>
            </h1>
            <p className="ehc-hero-quote" style={{ color: p.dim, borderColor: p.accent }}>
              <span className="ehc-hero-quote-en">
                "Beyond the event horizon, even light cannot escape — only sweetness."
              </span><br /><br />
              一家由天文系几位学生开起来的小奶昔铺。
              我们把光谱、轨道根数、吸积盘的颜色，
              都研磨进了每一杯里。
            </p>
            <div className="ehc-hero-cta">
              <a href="#m" className="ehc-cta-btn" style={{ background: p.accent, color: p.ink }}>
                VIEW MENU →
              </a>
              <div className="ehc-hero-hours" style={{ color: p.dim }}>
                <div>OPEN TONIGHT</div>
                <div style={{ color: p.text }}>{tonight.hours}</div>
              </div>
            </div>
          </div>
          <div className="ehc-hero-art">
            <HeroBlackHole />
          </div>
        </div>
        <div className="ehc-hero-foot" style={{ color: p.dim, borderColor: p.dim }}>
          <span>FIG. 01 / SAGITTARIUS A* — INSPIRATION OF THE HOUSE</span>
          <span className="ehc-hero-foot-mid">SCROLL ↓</span>
          <span>SOLD: 4,176 SHAKES SINCE 2026.02</span>
        </div>
      </section>

      <TonightSky />

      {/* MENU */}
      <section id="m" className="ehc-menu">
        <div className="ehc-menu-head">
          <div>
            <div className="ehc-eyebrow" style={{ color: p.accent }}>
              CATALOG · §02 · MAY 2026
            </div>
            <h2 className="ehc-menu-title">
              本月 / <span style={{ color: p.accent }}>The Catalog</span>
            </h2>
          </div>
          <div className="ehc-menu-hint" style={{ color: p.dim }}>
            HOVER A ROW TO READ ITS SPECTRUM<br />悬停查看光谱
          </div>
        </div>

        <div className="ehc-section-divider" style={{ borderColor: p.dim }} />
        <div className="ehc-section-label" style={{ color: p.dim }}>
          §02a · 奶昔 / SHAKES
        </div>
        <div className="ehc-rows">
          {shakes.map((it, i) => (
            <MenuRow key={it.id} item={it} idx={i} onAdd={addToCart} />
          ))}
        </div>

        <div className="ehc-section-label" style={{ color: p.dim, marginTop: 60 }}>
          §02b · 咖啡 / COFFEE
        </div>
        <div className="ehc-rows">
          {coffees.map((it, i) => (
            <MenuRow key={it.id} item={it} idx={shakes.length + i} onAdd={addToCart} />
          ))}
        </div>
      </section>

      <OrderForm cart={cart} setCart={setCart} />

      <WishWall />

      <footer id="a" className="ehc-footer" style={{ background: p.ink, borderColor: p.dim }}>
        <div className="ehc-footer-grid" style={{ color: p.dim }}>
          <div>
            <div style={{ color: p.accent }} className="ehc-footer-brand">EVENT_HORIZON_CAFÉ</div>
            <div className="ehc-footer-body">
              EST. 2026 / RUN BY ASTRONOMY UNDERGRADS<br />
              OPEN TUE–SUN UNTIL PITCH NIGHT
            </div>
          </div>
          <div>
            <div style={{ color: p.text }}>// ADDRESS</div>
            <div className="ehc-footer-body">
              ASTRONOMY BLDG, 1F WEST<br />
              WECHAT: ehc_observatory
            </div>
          </div>
          <div>
            <div style={{ color: p.text }}>// CREDITS</div>
            <div className="ehc-footer-body">
              BUILT WITH PHOTONS &<br />
              0.5g OF STARLIGHT · 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
