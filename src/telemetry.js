// Demo telemetry trace for the R&D block (illustrative signal, not measured data).
export function initTelemetry(c, { reduced = false } = {}) {
  const ctx = c.getContext('2d'); let w = 0, h = 0, t0 = performance.now(), on = false, raf = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const root = document.documentElement; let tok = null;
  const readTok = () => { const cs = getComputedStyle(root); tok = { fg: cs.getPropertyValue('--fg').trim() || '#D5DAE1', mute: cs.getPropertyValue('--mute').trim() || '#6F7A88', acc: cs.getPropertyValue('--acc').trim() || '#8A5BC2', acc2: cs.getPropertyValue('--acc-2').trim() || '#B79BE3' }; return tok; };
  new MutationObserver(() => { tok = null; }).observe(root, { attributes: true, attributeFilter: ['data-mode'] });
  const size = () => { const r = c.getBoundingClientRect(); w = r.width; h = r.height; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const draw = (now) => {
    if (!on) return;
    const t = (now - t0) / 1000; const { fg, mute, acc: heat, acc2: heat2 } = tok || readTok();
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = fg; ctx.globalAlpha = .1; ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) { const y = (h / 5) * i; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    for (let i = 1; i < 8; i++) { const x = (w / 8) * i; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    ctx.globalAlpha = 1; ctx.font = "500 10px 'IBM Plex Mono', monospace"; ctx.fillStyle = mute; ctx.textBaseline = 'top';
    ['520', '500', '480', '460', '440'].forEach((v, i) => ctx.fillText(v + '°C', 6, (h / 5) * i + 4));
    const line = (fn, color, width) => { ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = width; for (let x = 0; x <= w; x += 3) { const y = fn(x / w, t); x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); };
    const temp = (u, tt) => h * (0.42 + 0.12 * Math.sin(u * 9 - tt * 1.6) + 0.05 * Math.sin(u * 23 + tt * 0.7) + 0.03 * Math.sin(u * 61 - tt * 3));
    const ram = (u, tt) => { const c1 = Math.tanh(4 * Math.sin(u * 6 - tt * 1.6)); return h * (0.74 - 0.1 * c1 - 0.02 * Math.sin(u * 40 + tt * 5)); };
    ctx.save(); ctx.globalAlpha = .25; line(temp, heat, 6); ctx.restore(); line(temp, heat, 1.6);
    line(ram, fg, 1.2);
    const px = w * ((t * 0.09) % 1);
    ctx.fillStyle = heat2; ctx.fillRect(px, 0, 1, h);
    ctx.fillStyle = fg; ctx.fillText('T = ' + Math.round(temp(px / w, t) / h * -250 + 585) + '°C', Math.min(w - 70, px + 6), h - 16);
    if (!reduced) raf = requestAnimationFrame(draw);
  };
  const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) { size(); raf = requestAnimationFrame(draw); } else cancelAnimationFrame(raf); }, { threshold: 0.05 });
  io.observe(c); addEventListener('resize', () => { if (on) size(); });
}
