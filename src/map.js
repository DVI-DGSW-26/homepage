// Pacific-centred graticule map: Daegu HQ to the North American bases, drawn on canvas.
import { gsap } from 'gsap';

export function initMap(c, sites, { reduced = false } = {}) {
  const ctx = c.getContext('2d'); const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, p = 0, on = false, raf = 0, played = false;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const wrapLon = lon => ((lon - 180) % 360 + 540) % 360 - 180;
  const LON0 = -68, LON1 = 108, LAT0 = 4, LAT1 = 60;
  const X = lon => ((wrapLon(lon) - LON0) / (LON1 - LON0)) * w;
  const Y = lat => ((LAT1 - lat) / (LAT1 - LAT0)) * h;
  const HQ = sites.find(s => s.hq), nodes = sites.filter(s => !s.hq);
  const root = document.documentElement; let tok = null;
  const readTok = () => { const cs = getComputedStyle(root); tok = { fg: cs.getPropertyValue('--fg').trim() || '#D5DAE1', mute: cs.getPropertyValue('--mute').trim() || '#6F7A88', acc: cs.getPropertyValue('--acc').trim() || '#8A5BC2', acc2: cs.getPropertyValue('--acc-2').trim() || '#B79BE3' }; return tok; };
  new MutationObserver(() => { tok = null; }).observe(root, { attributes: true, attributeFilter: ['data-mode'] });
  const size = () => { const r = c.getBoundingClientRect(); w = r.width; h = r.width / 2; c.width = w * dpr; c.height = h * dpr; c.style.height = h + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const arc = (a, b) => { const x0 = X(a.lon), y0 = Y(a.lat), x1 = X(b.lon), y1 = Y(b.lat); return { x0, y0, x1, y1, cx: (x0 + x1) / 2, cy: Math.min(y0, y1) - Math.abs(x1 - x0) * 0.32 }; };
  const qp = (A, t) => { const u = 1 - t; return { x: u * u * A.x0 + 2 * u * t * A.cx + t * t * A.x1, y: u * u * A.y0 + 2 * u * t * A.cy + t * t * A.y1 }; };
  const draw = (now) => {
    ctx.clearRect(0, 0, w, h);
    const { fg, mute, acc: heat, acc2: heat2 } = tok || readTok();
    const small = w < 640;
    ctx.font = `500 ${small ? 9 : 10.5}px 'IBM Plex Mono', monospace`; ctx.textBaseline = 'middle'; ctx.lineWidth = 1;
    for (let lon = -60; lon <= 105; lon += 15) {
      const x = ((lon - LON0) / (LON1 - LON0)) * w;
      ctx.globalAlpha = lon === 0 ? .25 : .1; ctx.strokeStyle = fg; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); ctx.globalAlpha = 1;
      const real = ((lon + 180 + 540) % 360) - 180; const lbl = Math.abs(real) === 180 ? '180°' : real > 0 ? real + '°E' : (-real) + '°W';
      ctx.fillStyle = mute; ctx.fillText(lbl, x + 5, h - 12);
    }
    for (let lat = 15; lat <= 45; lat += 15) { const y = Y(lat); ctx.globalAlpha = .1; ctx.strokeStyle = fg; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = mute; ctx.fillText(lat + '°N', 6, y - 9); }
    ctx.setLineDash([2, 6]); ctx.globalAlpha = .35; ctx.strokeStyle = heat; ctx.beginPath(); ctx.moveTo(0, Y(23.44)); ctx.lineTo(w, Y(23.44)); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    ctx.fillStyle = heat2; ctx.globalAlpha = .8; ctx.fillText('TROPIC OF CANCER 23.4°N', w - (small ? 150 : 175), Y(23.44) - 9); ctx.globalAlpha = 1;
    nodes.forEach((n, i) => {
      const A = arc(HQ, n); const local = clamp((p - i * 0.08) / 0.7, 0, 1); if (local <= 0) return;
      ctx.beginPath(); ctx.strokeStyle = fg; ctx.globalAlpha = .55; const steps = 60;
      for (let s = 0; s <= steps * local; s++) { const pt = qp(A, s / steps); s === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y); }
      ctx.stroke(); ctx.globalAlpha = 1;
      if (local >= 1 && on && !reduced) {
        const tt = ((now / 1000) * 0.14 + i * 0.19) % 1; const pt = qp(A, tt), tail = qp(A, Math.max(0, tt - 0.05));
        ctx.beginPath(); ctx.fillStyle = heat2; ctx.arc(pt.x, pt.y, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.strokeStyle = heat; ctx.lineWidth = 1.5; ctx.moveTo(tail.x, tail.y); ctx.lineTo(pt.x, pt.y); ctx.stroke(); ctx.lineWidth = 1;
      }
    });
    const dot = (x, y, hq, label, dy) => {
      if (hq) { ctx.beginPath(); ctx.fillStyle = heat; ctx.globalAlpha = .18; ctx.arc(x, y, 14 + Math.sin(now / 400) * 2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
      ctx.beginPath(); ctx.fillStyle = hq ? heat : fg; ctx.arc(x, y, hq ? 4.5 : 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.strokeStyle = hq ? heat : fg; ctx.globalAlpha = .5; ctx.arc(x, y, hq ? 9 : 7, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = hq ? heat2 : fg; ctx.textAlign = hq ? 'right' : 'left'; ctx.fillText(label, hq ? x - 14 : x + 12, y + (dy || 0)); ctx.textAlign = 'left';
    };
    ctx.globalAlpha = clamp(p / 0.25, 0, 1); dot(X(HQ.lon), Y(HQ.lat), true, HQ.map, 0); ctx.globalAlpha = 1;
    nodes.forEach((n, i) => { if (clamp((p - i * 0.08) / 0.7, 0, 1) < 1) return; ctx.globalAlpha = clamp((p - i * 0.08 - 0.7) / 0.15, 0, 1); dot(X(n.lon), Y(n.lat), false, n.map, n.dy); ctx.globalAlpha = 1; });
    ctx.fillStyle = mute; ctx.font = `700 ${small ? 11 : 13}px 'Big Shoulders Display', sans-serif`; ctx.fillText('P A C I F I C   O C E A N', X(180) - (small ? 55 : 68), Y(38));
    if (on && !reduced) raf = requestAnimationFrame(draw);
  };
  const io = new IntersectionObserver(([e]) => {
    on = e.isIntersecting;
    if (on) {
      size();
      if (!played) { played = true; if (reduced) p = 1; else gsap.to({ v: 0 }, { v: 1, duration: 2.6, ease: 'power2.inOut', onUpdate() { p = this.targets()[0].v; } }); }
      cancelAnimationFrame(raf); raf = requestAnimationFrame(draw);
    } else cancelAnimationFrame(raf);
  }, { threshold: 0.15 });
  io.observe(c);
  addEventListener('resize', () => { size(); if (!on) draw(performance.now()); });
  size(); draw(performance.now());
  return { redraw: () => draw(performance.now()) };
}
