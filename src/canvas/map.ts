// Pacific-centred map: Daegu HQ to the North American bases, drawn on canvas.
// A Mercator (the projection people know from web maps), 112°E to 72°W and the equator up, at the
// canvas's 2:1. The coastlines are Natural Earth's, cut to this window ahead of time (scripts/coast.mjs).
import { modeTokens, token } from '../lib/tokens';
import { gsap } from 'gsap';

export interface MapSite { lat: number; lon: number; hq?: boolean; map: string; dy?: number }
interface Arc { x0: number; y0: number; x1: number; y1: number; cx: number; cy: number }


export function initMap(c: HTMLCanvasElement, sites: MapSite[], { reduced = false }: { reduced?: boolean } = {}): { redraw(): void; destroy(): void } {
  const MONO = token('--font-mono'), DISPLAY = token('--font-display'); // the site's faces, for the labels
  const ctx = c.getContext('2d')!; const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0, p = 0, on = false, raf = 0, played = false, disposed = false;
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  const wrapLon = (lon: number) => ((lon - 180) % 360 + 540) % 360 - 180;
  // keep in step with scripts/coast.mjs
  const LON0 = -68, LON1 = 108, LAT0 = 0;
  const SPAN = (LON1 - LON0) * Math.PI / 180;
  const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
  const M0 = merc(LAT0), M1 = M0 + SPAN / 2;   // the window is half as tall as it is wide
  const X = (lon: number) => ((wrapLon(lon) - LON0) / (LON1 - LON0)) * w;
  const Y = (lat: number) => ((M1 - merc(lat)) / (M1 - M0)) * h;
  // the land, as one path in width units (x 0–1, y 0–0.5), loaded with the map
  let coast: Path2D | null = null;
  import('./coast.json').then(({ default: d }) => {
    if (disposed) return;
    const p = new Path2D();
    for (const r of d.rings) { p.moveTo(r[0] / 1e4, r[1] / 1e4); for (let i = 2; i < r.length; i += 2) p.lineTo(r[i] / 1e4, r[i + 1] / 1e4); p.closePath(); }
    coast = p; draw(performance.now());
  });
  const HQ = sites.find(s => s.hq)!, nodes = sites.filter(s => !s.hq);
  // drawn in the page's mode colours, re-read after a mode switch
  const tok = modeTokens({ fg: '--fg', mute: '--mute', acc: '--acc', acc2: '--acc-2' });
  const size = () => { const r = c.getBoundingClientRect(); w = r.width; h = r.width / 2; c.width = w * dpr; c.height = h * dpr; c.style.height = h + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const arc = (a: MapSite, b: MapSite): Arc => { const x0 = X(a.lon), y0 = Y(a.lat), x1 = X(b.lon), y1 = Y(b.lat); return { x0, y0, x1, y1, cx: (x0 + x1) / 2, cy: Math.min(y0, y1) - Math.abs(x1 - x0) * 0.32 }; };
  const qp = (A: Arc, t: number) => { const u = 1 - t; return { x: u * u * A.x0 + 2 * u * t * A.cx + t * t * A.x1, y: u * u * A.y0 + 2 * u * t * A.cy + t * t * A.y1 }; };
  const draw = (now: number) => {
    if (disposed) return;
    ctx.clearRect(0, 0, w, h);
    const { fg, mute, acc: heat, acc2: heat2 } = tok.get();
    const small = w < 640;
    // land: a faint fill and a hairline coast
    if (coast) {
      ctx.save(); ctx.scale(w, w);
      ctx.fillStyle = fg; ctx.globalAlpha = .07; ctx.fill(coast);
      ctx.strokeStyle = fg; ctx.globalAlpha = .28; ctx.lineWidth = .8 / w; ctx.lineJoin = 'round'; ctx.stroke(coast);
      ctx.restore(); ctx.globalAlpha = 1;
    }
    ctx.font = `500 ${small ? 9 : 10.5}px ${MONO}`; ctx.textBaseline = 'middle'; ctx.lineWidth = 1;
    for (let lon = -60; lon <= 105; lon += 15) {
      const x = ((lon - LON0) / (LON1 - LON0)) * w;
      ctx.globalAlpha = lon === 0 ? .25 : .1; ctx.strokeStyle = fg; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); ctx.globalAlpha = 1;
      const real = ((lon + 180 + 540) % 360) - 180; const lbl = Math.abs(real) === 180 ? '180°' : real > 0 ? real + '°E' : (-real) + '°W';
      // on a phone every other meridian is labelled, so the labels don't run into each other
      if (!small || (lon / 15) % 2 === 0) { ctx.fillStyle = mute; ctx.fillText(lbl, x + 5, h - 12); }
    }
    for (let lat = 15; lat <= 60; lat += 15) { const y = Y(lat); ctx.globalAlpha = .1; ctx.strokeStyle = fg; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = mute; ctx.fillText(lat + '°N', 6, y - 9); }
    ctx.setLineDash([2, 6]); ctx.globalAlpha = .35; ctx.strokeStyle = heat; ctx.beginPath(); ctx.moveTo(0, Y(23.44)); ctx.lineTo(w, Y(23.44)); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    if (!small) { ctx.fillStyle = heat2; ctx.globalAlpha = .8; ctx.fillText('TROPIC OF CANCER 23.4°N', w - 175, Y(23.44) - 9); ctx.globalAlpha = 1; }
    nodes.forEach((n, i) => {
      const A = arc(HQ, n); const local = clamp((p - i * 0.08) / 0.7, 0, 1); if (local <= 0) return;
      ctx.beginPath(); ctx.strokeStyle = fg; ctx.globalAlpha = .55; const steps = 60;
      for (let s = 0; s <= steps * local; s++) { const pt = qp(A, s / steps); if (s === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); }
      ctx.stroke(); ctx.globalAlpha = 1;
      if (local >= 1 && on && !reduced) {
        const tt = ((now / 1000) * 0.14 + i * 0.19) % 1; const pt = qp(A, tt), tail = qp(A, Math.max(0, tt - 0.05));
        ctx.beginPath(); ctx.fillStyle = heat2; ctx.arc(pt.x, pt.y, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.strokeStyle = heat; ctx.lineWidth = 1.5; ctx.moveTo(tail.x, tail.y); ctx.lineTo(pt.x, pt.y); ctx.stroke(); ctx.lineWidth = 1;
      }
    });
    const dot = (x: number, y: number, hq: boolean, label: string, dy?: number) => {
      if (hq) { ctx.beginPath(); ctx.fillStyle = heat; ctx.globalAlpha = .18; ctx.arc(x, y, 14 + Math.sin(now / 400) * 2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
      ctx.beginPath(); ctx.fillStyle = hq ? heat : fg; ctx.arc(x, y, hq ? 4.5 : 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.strokeStyle = hq ? heat : fg; ctx.globalAlpha = .5; ctx.arc(x, y, hq ? 9 : 7, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      // labels hang right of their dot, except the HQ's and any near the right edge, which hang left so they stay on the canvas
      // (on a narrow canvas the HQ sits too near the left edge for that: it hangs right too)
      const left = (hq && x - 14 - ctx.measureText(label).width >= 4) || (!hq && x > w * .7);
      ctx.fillStyle = hq ? heat2 : fg; ctx.textAlign = left ? 'right' : 'left'; ctx.fillText(label, left ? x - (hq ? 14 : 12) : x + 12, y + (dy || 0)); ctx.textAlign = 'left';
    };
    ctx.globalAlpha = clamp(p / 0.25, 0, 1); dot(X(HQ.lon), Y(HQ.lat), true, HQ.map, 0); ctx.globalAlpha = 1;
    nodes.forEach((n, i) => { if (clamp((p - i * 0.08) / 0.7, 0, 1) < 1) return; ctx.globalAlpha = clamp((p - i * 0.08 - 0.7) / 0.15, 0, 1); dot(X(n.lon), Y(n.lat), false, n.map, n.dy); ctx.globalAlpha = 1; });
    ctx.fillStyle = mute; ctx.font = `700 ${small ? 11 : 13}px ${DISPLAY}`; ctx.fillText('P A C I F I C   O C E A N', X(180) - (small ? 55 : 68), Y(small ? 24 : 38));
    if (on && !reduced) raf = requestAnimationFrame(draw);
  };
  const prog = { v: 0 };
  const io = new IntersectionObserver(([e]) => {
    on = e.isIntersecting;
    if (on) {
      size();
      if (!played) { played = true; if (reduced) p = 1; else gsap.to(prog, { v: 1, duration: 2.6, ease: 'power2.inOut', onUpdate() { p = prog.v; } }); }
      cancelAnimationFrame(raf); raf = requestAnimationFrame(draw);
    } else cancelAnimationFrame(raf);
  }, { threshold: 0.15 });
  io.observe(c);
  const onResize = () => { size(); if (!on) draw(performance.now()); };
  addEventListener('resize', onResize);
  size(); draw(performance.now());
  return {
    redraw: () => draw(performance.now()),
    destroy: () => { disposed = true; on = false; cancelAnimationFrame(raf); io.disconnect(); tok.destroy(); removeEventListener('resize', onResize); gsap.killTweensOf(prog); }
  };
}
