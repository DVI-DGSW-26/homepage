import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { createScroll } from './scroll.js';
import { createHero } from './hero.js';
import { createExtrusion, metricsFor } from './extrusion.js';
import { initMap } from './map.js';
import { initTelemetry } from './telemetry.js';
import { PRODUCTS, PROCESSES, PROCESS_IMG, CERTS, HISTORY, SITES, TEST_EQUIPMENT, ABOUT_YEARS, ORG } from './data.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const pad2 = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------------- smooth scroll (Lenis + wheel normalisation + directional snap) ---------------- */
const SCROLL = createScroll({ reduced: REDUCED });
const lenis = SCROLL.lenis;
const scrollTo = (target, opts) => SCROLL.scrollTo(target, opts);
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]'); if (!a) return;
  const id = a.getAttribute('href'); if (id.length > 1 && $(id)) { e.preventDefault(); scrollTo(id); }
});

/* ---------------- generated content ---------------- */
const roll = (text) => {
  const chars = (cls) => `<span class="${cls}">${[...text].map((c, i) => `<span class="ch" style="--i:${i}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('')}</span>`;
  return `<span class="roll">${chars('a')}${chars('b')}</span>`;
};
const TAGS = { automotive: ['압출', 'CNC', 'T6'], industrial: ['압출', '절단', '가공'], architecture: ['압출', '절단', '마감'], aerospace: ['벤딩', '절단', '디버링'] };
const rowsEl = $('#rows'), galleryEl = $('#gallery'), indexTitle = $('#indexTitle'), indexCount = $('#indexCount');
let currentRows = [];
function buildIndex(catId, animate = true) {
  const cat = PRODUCTS.find(c => c.id === catId); if (!cat) return;
  const map = new Map();
  cat.groups.forEach(g => g.parts.forEach(p => { if (!map.has(p.name)) map.set(p.name, { name: p.name, sys: g.ko, sysEn: g.en, imgs: [] }); map.get(p.name).imgs.push('assets/img/products/' + p.img); }));
  currentRows = [...map.values()];
  indexTitle.textContent = cat.ko;
  indexCount.textContent = `${currentRows.length} parts / ${cat.groups.reduce((n, g) => n + g.parts.length, 0)} photos`;
  rowsEl.innerHTML = currentRows.map((r, i) => `<li class="row" data-i="${i}" data-hover><span class="name">${roll(r.name)}</span><span class="sys">${esc(r.sys)} <span class="mono" style="color:var(--mute);margin-left:6px">${esc(r.sysEn)}</span></span><span class="tags">${TAGS[catId].map(t => `<span>${t}</span>`).join('')}</span><span class="cnt num">${pad2(r.imgs.length)} photo${r.imgs.length > 1 ? 's' : ''}</span></li>`).join('');
  galleryEl.innerHTML = cat.groups.flatMap(g => g.parts.map(p => `<figure data-name="${esc(p.name)}"><div class="photo"><img loading="lazy" decoding="async" src="assets/img/products/${p.img}" alt="${esc(p.name)}" width="335" height="300"></div><figcaption><b>${esc(p.name)}</b><span>${esc(g.ko)}</span></figcaption></figure>`)).join('');
  if (animate && !REDUCED) {
    gsap.from($$('.row', rowsEl), { y: 24, opacity: 0, duration: .7, ease: 'power3.out', stagger: .05, clearProps: 'all' });
    gsap.from($$('.photo', galleryEl), { clipPath: 'inset(0 100% 0 0)', duration: .9, ease: 'power4.out', stagger: .04, clearProps: 'clipPath' });
  }
  bindRows();
  ScrollTrigger.refresh();
}
const cursor = $('#cur');
function bindRows() {
  $$('.row', rowsEl).forEach(row => {
    const r = currentRows[+row.dataset.i];
    row.addEventListener('pointerenter', () => { $$('figure', galleryEl).forEach(f => f.classList.toggle('is-on', f.dataset.name === r.name)); });
    row.addEventListener('pointerleave', () => { $$('figure', galleryEl).forEach(f => f.classList.remove('is-on')); });
    row.addEventListener('click', () => { const f = $(`figure[data-name="${CSS.escape(r.name)}"]`, galleryEl); f?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }); });
  });
}
$$('#cats .cat').forEach(btn => btn.addEventListener('click', () => {
  $$('#cats .cat').forEach(b => b.classList.toggle('is-on', b === btn));
  buildIndex(btn.dataset.cat);
}));
buildIndex('automotive', false);

// process tracks
const tracksEl = $('#tracks');
tracksEl.innerHTML = PROCESSES.map(pr => `<div class="track${pr.id === 'ext' ? ' is-on' : ''}" data-proc="${pr.id}">` + pr.steps.map((s, i) => `
  <article class="step"${s.heat ? ` data-heat="${s.heat}"` : ''}>
    <div class="pics">${s.imgs.map((im, k) => `<img src="${PROCESS_IMG + im}" alt="${esc(s.ko)} ${k + 1}" loading="lazy" decoding="async" width="505" height="350">`).join('')}${s.imgs.length > 1 ? '<span class="sw">Hover: photo</span>' : ''}</div>
    <div class="body"><div class="tag mono"><span>Step ${pad2(i + 1)}</span><em>${esc(s.en)}</em></div><h3>${esc(s.ko)}</h3><div class="idx num">${pad2(i + 1)}</div><p>${esc(s.d)}</p></div>
  </article>`).join('') + '</div>').join('');

// certificates marquee (doubled for the loop)
const certHTML = CERTS.map(c => `<figure class="cert"><div class="photo"><img src="${c.src}" alt="${esc(c.t)}" loading="lazy" decoding="async" width="248" height="354"></div><b>${esc(c.t)}</b><span class="${c.k === '수상' ? 'aw' : ''}">${esc(c.k)}</span></figure>`).join('');
$('#certTrack').innerHTML = `<div class="cert-g">${certHTML}</div><div class="cert-g">${certHTML}</div>`;

// sites
$('#sites').innerHTML = SITES.map(s => `<li class="rv${s.hq ? ' hq' : ''}" data-hover><div class="photo"><img src="${s.img}" alt="${esc(s.ko)}" loading="lazy" decoding="async" width="250" height="230"></div><div class="in"><span class="mono">${esc(s.k)} / ${Math.abs(s.lat).toFixed(1)}°${s.lat >= 0 ? 'N' : 'S'} ${Math.abs(s.lon).toFixed(1)}°${s.lon >= 0 ? 'E' : 'W'}</span><b>${esc(s.ko)}</b><span>${esc(s.where)}</span></div></li>`).join('');

// history
$('#tl').insertAdjacentHTML('beforeend', HISTORY.map(y => `<article class="rv"><div class="year num">${y.y}</div><div class="body">${y.ev.map(e => `<div class="ev"><span class="m">${e.m}</span><ul>${e.l.map((l, i) => `<li${e.h && i === 0 ? ' class="h"' : ''}>${esc(l)}</li>`).join('')}</ul></div>`).join('')}</div></article>`).join(''));

// test equipment
$('#testBody').innerHTML = TEST_EQUIPMENT.map(t => `<tr><td>${esc(t.name)}</td><td class="dim">${esc(t.brand || '—')}</td><td class="dim">${esc(t.spec)}</td><td class="q num">${t.q}</td></tr>`).join('');

/* ---------------- WebGL scenes ---------------- */
const HERO = createHero($('#gl'), { reduced: REDUCED, fine: FINE });
const EXT = createExtrusion($('#glx'), { reduced: REDUCED, fine: FINE });

/* ---------------- hero beats ---------------- */
const beats = $$('.beat').map(el => ({ el, h1: $('h1', el), p: $('p', el), chars: null }));
const bgs = $$('.hero-bg img');
const hudBeat = $('#hudBeat'), hudPart = $('#hudPart'), hudCat = $('#hudCat'), hudProc = $('#hudProc'), ticks = $$('#ticks i');
let cur = 0;
function showBeat(i) {
  if (i === cur) return;
  const dir = i > cur ? 1 : -1, from = beats[cur], to = beats[i]; cur = i;
  hudBeat.textContent = `${pad2(i + 1)} / 04`;
  const meta = HERO.parts[i]; if (meta) { hudPart.textContent = meta.en; hudCat.textContent = meta.ko; hudProc.textContent = meta.proc; }
  ticks.forEach((t, k) => t.classList.toggle('is-on', k <= i));
  bgs.forEach((b, k) => { gsap.to(b, { opacity: k === i ? .34 : 0, scale: k === i ? 1 : 1.08, duration: 1.4, ease: 'power2.out', overwrite: true }); });
  HERO.setBeat(i);
  gsap.killTweensOf([from.chars, to.chars, from.p, to.p]);
  to.el.classList.add('is-active'); to.el.style.zIndex = 2; from.el.style.zIndex = 1;
  gsap.to(from.chars, { yPercent: -70 * dir, opacity: 0, filter: 'blur(6px)', duration: .26, ease: 'power3.in', stagger: { each: .006, from: dir > 0 ? 'start' : 'end' }, onComplete: () => { if (cur !== beats.indexOf(from)) from.el.classList.remove('is-active'); } });
  gsap.to(from.p, { opacity: 0, y: -12 * dir, duration: .22, ease: 'power2.in' });
  gsap.fromTo(to.chars, { yPercent: 70 * dir, opacity: 0, filter: 'blur(8px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: .55, ease: 'power3.out', delay: .1, stagger: { each: .008, from: dir > 0 ? 'start' : 'end' } });
  gsap.fromTo(to.p, { opacity: 0, y: 14 * dir }, { opacity: 1, y: 0, duration: .45, ease: 'power3.out', delay: .28 });
}
gsap.set(bgs[0], { scale: 1 });

/* ---------------- preloader + intro ---------------- */
const pre = $('#pre'), preNum = $('#preNum'), preLbl = $('#preLbl'), preBar = $('#pre .bar i');
const heroIntro = () => {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  const o = { v: 0 };
  tl.to(o, { v: 1, duration: 1.3, ease: 'expo.out', onUpdate: () => HERO.setIntro(o.v) }, 0)
    .from(beats[0].chars, { yPercent: 110, opacity: 0, filter: 'blur(10px)', duration: 1.1, stagger: .018 }, .1)
    .from(beats[0].p, { opacity: 0, y: 18, duration: .9 }, .7)
    .from('#hud .hud-row, #ticks, .hud-hint', { opacity: 0, x: 24, duration: .8, stagger: .08 }, .6)
    .from('.scroll-cue', { opacity: 0, duration: .8 }, 1.2)
    .from('#nav', { y: -24, opacity: 0, duration: .9 }, .4);
};
const boot = () => {
  beats.forEach(b => { const s = new SplitText(b.h1, { type: 'words,chars', charsClass: 'char', wordsClass: 'word' }); b.chars = s.chars; });
  if (REDUCED) { pre.remove(); HERO.setIntro(1); return; }
  const counter = { v: 0 }, labels = ['Loading press', 'Heating billet', 'Die at temperature', 'Ready to extrude'];
  gsap.timeline()
    .to(counter, { v: 100, duration: 1.25, ease: 'power2.inOut', onUpdate: () => { const v = Math.round(counter.v); preNum.textContent = String(v).padStart(3, '0'); preLbl.textContent = labels[Math.min(3, Math.floor(v / 26))]; } }, 0)
    .to(preBar, { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0)
    .to(pre, { yPercent: -100, duration: .95, ease: 'power4.inOut', onComplete: () => pre.remove() }, '+=0.12')
    .add(heroIntro, '-=0.55');
};
Promise.race([
  Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true }))]),
  new Promise(r => setTimeout(r, 4000))
]).then(boot);

/* ---------------- hero scroll ---------------- */
ScrollTrigger.create({
  trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: true,
  onUpdate: self => { HERO.setProgress(self.progress); showBeat(Math.min(3, Math.floor(self.progress * 4.02))); }
});
ScrollTrigger.create({ trigger: '#hero', start: 'top bottom', end: 'bottom top', onToggle: s => HERO.setActive(s.isActive) });

/* ---------------- section themes ---------------- */
// Compositor-only switch: html[data-bg] crossfades two fixed background layers (CSS opacity transition),
// html[data-mode] flips the colour tokens once at the crossfade midpoint. No per-frame style recalculation.
let curTheme = 'dark', themeTimer = 0;
const applyTheme = (name) => {
  if (name === curTheme || (name !== 'dark' && name !== 'light')) return; curTheme = name;
  const root = document.documentElement;
  root.dataset.bg = name;
  clearTimeout(themeTimer);
  if (REDUCED) { root.dataset.mode = name; return; }
  themeTimer = setTimeout(() => { root.dataset.mode = name; }, 229);
};
$$('section[data-theme]').forEach(sec => ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%', onEnter: () => applyTheme(sec.dataset.theme), onEnterBack: () => applyTheme(sec.dataset.theme) }));

/* ---------------- nav ---------------- */
const nav = $('#nav');
ScrollTrigger.create({ start: 0, end: 'max', onUpdate: self => { const y = self.scroll(); nav.classList.toggle('is-hidden', self.direction === 1 && y > 240); nav.classList.toggle('is-solid', y > 80); } });
const links = $$('.nav-links a');
const linkFor = { about: 'about', statement: 'about', product: 'product', config: 'config', process: 'config', equip: 'config', rnd: 'rnd', global: 'about', history: 'about', community: 'community', contact: 'community' };
Object.keys(linkFor).forEach(id => { const el = document.getElementById(id); if (!el) return; ScrollTrigger.create({ trigger: el, start: 'top 45%', end: 'bottom 45%', onToggle: s => { if (s.isActive) links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + linkFor[id])); } }); });

/* ---------------- marquee skew ---------------- */
$$('.marquee-in').forEach(m => {
  const skew = gsap.quickTo(m, 'skewX', { duration: .5, ease: 'power3.out' }); let t;
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => { skew(clamp(s.getVelocity() / -260, -9, 9)); clearTimeout(t); t = setTimeout(() => skew(0), 120); } });
});

/* ---------------- reveals ---------------- */
const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
fontsReady.then(() => {
  $$('.rv-lines').forEach(el => {
    if (el.matches('h2')) { // headings: masked characters rising with a slight tilt
      const s = new SplitText(el, { type: 'words,chars', mask: 'chars', charsClass: 'c' });
      gsap.from(s.chars, { yPercent: 115, rotate: 7, duration: .7, ease: 'power4.out', stagger: { each: .012 }, scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play reverse play reverse' } });
      return;
    }
    const s = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'ln' });
    gsap.from(s.lines, { yPercent: 105, duration: .8, ease: 'power4.out', stagger: .07, scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play reverse play reverse' } });
  });
  ScrollTrigger.refresh();
});
$$('.rv').filter(el => !el.closest('[data-batch]')).forEach(el => gsap.from(el, { y: 36, opacity: 0, duration: .75, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play reverse play reverse' } }));
$$('[data-batch]').forEach(group => {
  const items = $$('.rv', group), cards = items.filter(el => el.matches('.esg article, .ctile, .cat, .sites li')), plain = items.filter(el => !cards.includes(el));
  if (plain.length) { gsap.set(plain, { y: 40, opacity: 0 }); ScrollTrigger.batch(plain, { start: 'top 90%', onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: .06, overwrite: true }), onLeaveBack: b => gsap.to(b, { y: 40, opacity: 0, duration: .5, ease: 'power2.in', overwrite: true }) }); }
  if (cards.length) { gsap.set(cards, { rotateX: 16, y: 54, opacity: 0, transformOrigin: 'top center' }); ScrollTrigger.batch(cards, { start: 'top 90%', onEnter: b => gsap.to(b, { rotateX: 0, y: 0, opacity: 1, duration: .85, ease: 'power4.out', stagger: .07, overwrite: true }), onLeaveBack: b => gsap.to(b, { rotateX: 16, y: 54, opacity: 0, duration: .5, ease: 'power2.in', overwrite: true }) }); }
});
// photos wipe open from the bottom as they arrive
const wipes = $$('.facs .photo, .sites .photo, .cert .photo, .step .pics, .ctile .photo, #rndHero, .catalog .photo');
if (!REDUCED && wipes.length) { gsap.set(wipes, { clipPath: 'inset(100% 0 0 0)' }); ScrollTrigger.batch(wipes, { start: 'top 94%', onEnter: b => gsap.to(b, { clipPath: 'inset(0% 0 0 0)', duration: .8, ease: 'power4.out', stagger: .04, overwrite: true }), onLeaveBack: b => gsap.to(b, { clipPath: 'inset(100% 0 0 0)', duration: .5, ease: 'power2.in', overwrite: true }) }); }
$$('[data-count]').forEach(el => { const target = +el.dataset.count, o = { v: 0 }; const show = () => { el.textContent = Math.round(o.v).toLocaleString('en-US'); }; ScrollTrigger.create({ trigger: el, start: 'top 90%', onEnter: () => gsap.to(o, { v: target, duration: 1.8, ease: 'power3.out', overwrite: true, onUpdate: show }), onLeaveBack: () => gsap.to(o, { v: 0, duration: .5, overwrite: true, onUpdate: show }) }); });

// R&D header photo parallax
if (!REDUCED) gsap.fromTo('#rndHero img', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '#rndHero', start: 'top bottom', end: 'bottom top', scrub: true } });
// statement kinetic lines
const lines = $$('#statement .line');
if (lines.length) {
  const st = { trigger: '#statement', start: 'top bottom', end: 'bottom top', scrub: true };
  gsap.fromTo(lines[0], { xPercent: -14 }, { xPercent: 6, ease: 'none', scrollTrigger: st });
  gsap.fromTo(lines[1], { xPercent: 12 }, { xPercent: -8, ease: 'none', scrollTrigger: st });
  gsap.fromTo(lines[2], { xPercent: -6 }, { xPercent: 10, ease: 'none', scrollTrigger: st });
  gsap.fromTo('#statement .photo img', { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: st });
}

/* ---------------- configurator ---------------- */
const cfg = { w: $('#cfgW'), h: $('#cfgH'), cells: $('#cfgCells'), wall: $('#cfgWall') };
const out = { w: $('#oW'), h: $('#oH'), cells: $('#oCells'), wall: $('#oWall'), area: $('#mArea'), kg: $('#mKg'), ccd: $('#mCcd'), press: $('#mPress') };
const fmt = (n, d = 1) => n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
function updateCfg() {
  const p = { w: +cfg.w.value, h: +cfg.h.value, cells: +cfg.cells.value, wall: +cfg.wall.value };
  const maxWall = Math.min((p.w - 8 * p.cells) / (p.cells + 1), (p.h - 6) / 2);
  if (p.wall > maxWall) { p.wall = Math.max(1.5, Math.floor(maxWall * 2) / 2); cfg.wall.value = p.wall; }
  out.w.textContent = `${p.w} mm`; out.h.textContent = `${p.h} mm`; out.cells.textContent = p.cells; out.wall.textContent = `${fmt(p.wall)} mm`;
  const m = metricsFor(p);
  out.area.innerHTML = `${fmt(m.area / 100, 1)}<small>cm²</small>`;
  out.kg.innerHTML = `${fmt(m.kgPerM, 2)}<small>kg/m</small>`;
  out.ccd.innerHTML = `${fmt(m.ccd, 0)}<small>mm</small>`;
  out.press.innerHTML = `${m.press.ton.toLocaleString('en-US')}<small>t / ${m.press.inch}"</small>`;
  EXT.setParams(p);
}
Object.values(cfg).forEach(i => i.addEventListener('input', updateCfg));
updateCfg();
if (!REDUCED) gsap.from('.config-copy > *', { x: -30, opacity: 0, duration: .9, stagger: .07, ease: 'power3.out', scrollTrigger: { trigger: '#config', start: 'top 70%', toggleActions: 'play reverse play reverse' } });
const cfgLen = $('#cfgLen');
ScrollTrigger.create({ trigger: '#config', start: 'top bottom', end: 'bottom top', onToggle: s => EXT.setActive(s.isActive) });
const mm = gsap.matchMedia();
mm.add('(min-width: 901px)', () => { const st = ScrollTrigger.create({ trigger: '#config', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => { EXT.setProgress(s.progress); cfgLen.textContent = EXT.length.toFixed(1) + ' m'; } }); return () => st.kill(); });
mm.add('(max-width: 900px)', () => { const st = ScrollTrigger.create({ trigger: '#config', start: 'top 70%', end: 'bottom 30%', scrub: true, onUpdate: s => { EXT.setProgress(s.progress); cfgLen.textContent = EXT.length.toFixed(1) + ' m'; } }); return () => st.kill(); });

/* ---------------- process: tabs + horizontal scroll ---------------- */
const procSec = $('#process'), procBar = $('#procBar'), procTitle = $('#procTitle'), procFoot = $$('#procFoot span');
let procTween = null, procDesktop = false, procStepTweens = [];
const TITLES = { ext: '빌렛 하나가 부품이 되기까지, 11단계', mach: '압출재를 정밀 부품으로, 7단계', steel: '스틸 원소재를 부품으로, 8단계' };
function setupProc() {
  if (procTween) { procTween.scrollTrigger?.kill(); procTween.kill(); procTween = null; }
  procStepTweens.forEach(t => { t.scrollTrigger?.kill(); t.kill(); }); procStepTweens = [];
  const track = $('.track.is-on'); if (!track) return;
  gsap.set($$('.step', track), { clearProps: 'transform,opacity' });
  gsap.set($$('.track'), { x: 0 });
  if (!procDesktop) { procSec.style.height = ''; return; }
  // measured from the last card so the track's trailing padding counts (scrollWidth drops it)
  const dist = () => { const cards = $$('.step', track), lastEl = cards[cards.length - 1]; if (!lastEl) return 0; const pr = parseFloat(getComputedStyle(track).paddingRight) || 0; return Math.max(0, lastEl.offsetLeft + lastEl.offsetWidth + pr - innerWidth); };
  const setH = () => { procSec.style.height = (dist() + innerHeight) + 'px'; };
  setH();
  procTween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: procSec, start: 'top top', end: 'bottom bottom', scrub: true, invalidateOnRefresh: true, onRefreshInit: setH, onUpdate: s => { procBar.style.transform = `scaleX(${s.progress})`; } } });
  if (!REDUCED) $$('.step', track).forEach((st, i) => { if (i < 2) return; procStepTweens.push(gsap.fromTo(st, { scale: .88, opacity: .3, rotateY: 14, x: 60 }, { scale: 1, opacity: 1, rotateY: 0, x: 0, ease: 'none', scrollTrigger: { trigger: st, containerAnimation: procTween, start: 'left 105%', end: 'left 82%', scrub: true } })); });
}
mm.add({ desktop: '(min-width: 901px)', mobile: '(max-width: 900px)' }, (ctx) => { procDesktop = !!ctx.conditions.desktop; setupProc(); return () => { if (procTween) { procTween.scrollTrigger?.kill(); procTween.kill(); procTween = null; } procSec.style.height = ''; }; });
$$('#tabs .tab').forEach(tab => tab.addEventListener('click', () => {
  const id = tab.dataset.proc;
  $$('#tabs .tab').forEach(t => t.classList.toggle('is-on', t === tab));
  $$('.track').forEach(t => t.classList.toggle('is-on', t.dataset.proc === id));
  procTitle.textContent = TITLES[id];
  const pr = PROCESSES.find(p => p.id === id); procFoot[0].textContent = pr.foot[0]; procFoot[2].textContent = pr.foot[1];
  setupProc();
  if (procDesktop) { const y = procSec.getBoundingClientRect().top + scrollY; SCROLL.scrollTo(y, { immediate: true }); }
  ScrollTrigger.refresh();
  gsap.from($$('.track.is-on .step'), { y: 30, opacity: 0, duration: .7, stagger: .05, ease: 'power3.out', clearProps: 'all' });
}));

/* ---------------- equipment, rail, footer ---------------- */
gsap.to('.erow .bar', { scaleX: 1, duration: 1.4, ease: 'power4.out', stagger: .08, scrollTrigger: { trigger: '#equip', start: 'top 70%', toggleActions: 'play reverse play reverse' } });
gsap.to('.press-row .pb i', { scaleX: 1, duration: 1.6, ease: 'power4.out', stagger: .15, delay: .2, scrollTrigger: { trigger: '#equip', start: 'top 70%', toggleActions: 'play reverse play reverse' } });
gsap.to('#rail', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#tl', start: 'top 70%', end: 'bottom 60%', scrub: true } });
gsap.from('#bigLogo img', { yPercent: 40, opacity: 0, scale: .96, duration: 1.4, ease: 'power4.out', scrollTrigger: { trigger: '#bigLogo', start: 'top 95%', toggleActions: 'play reverse play reverse' } });

/* ---------------- about ---------------- */
// manifesto: words light up as the paragraph scrolls through the middle of the screen
const mf = $('#manifesto');
if (mf && !REDUCED) {
  const ks = $$('.k', mf);
  fontsReady.then(() => {
    const split = new SplitText(mf, { type: 'words', wordsClass: 'w' });
    gsap.fromTo(split.words, { opacity: .16 }, { opacity: 1, ease: 'none', stagger: 1, duration: 4, scrollTrigger: { trigger: mf, start: 'top 78%', end: 'bottom 42%', scrub: true,
      onUpdate: () => ks.forEach(k => { const w = $('.w', k) || k; k.classList.toggle('is-on', +gsap.getProperty(w, 'opacity') > .85); }) } });
  });
} else if (mf) $$('.k', mf).forEach(k => k.classList.add('is-on'));

// ledger numbers count up the first time the frame goes full bleed
let ledgerPlayed = false;
const ledgerTweens = [];
const playLedger = () => {
  ledgerPlayed = true; ledgerTweens.forEach(t => t.kill()); ledgerTweens.length = 0;
  $$('#cineFrame .ledger b').forEach(b => { const m = (b.dataset.v || b.textContent).match(/^([\d,]+)(.*)$/); if (!m) return; const target = +m[1].replace(/,/g, ''), suffix = m[2], o = { v: 0 }; ledgerTweens.push(gsap.to(o, { v: target, duration: 1.6, ease: 'power3.out', onUpdate: () => { b.textContent = Math.round(o.v).toLocaleString('en-US') + suffix; } })); });
};
const resetLedger = () => { ledgerPlayed = false; ledgerTweens.forEach(t => t.kill()); ledgerTweens.length = 0; $$('#cineFrame .ledger b').forEach(b => { const m = (b.dataset.v || '').match(/^([\d,]+)(.*)$/); if (m) b.textContent = '0' + m[2]; }); };
// cinematic frame: uniform-scale FLIP from a small frame in the lower right to full bleed
mm.add('(min-width: 901px)', () => {
  const cine = $('#cine'), frame = $('#cineFrame'), fimg = frame && $('img', frame), side = $('#cineSide');
  if (!cine || !frame || REDUCED) return;
  let s0 = .42; const st = { p: 0 }; const ease = gsap.parseEase('power2.inOut');
  const measure = () => { s0 = Math.min(680, innerWidth * .44) / innerWidth; };
  const apply = () => {
    const e = ease(clamp((st.p - .15) / .6, 0, 1));
    gsap.set(frame, { scale: s0 + (1 - s0) * e, y: -innerHeight * .04 * (1 - clamp(st.p / .15, 0, 1)) });
    gsap.set(fimg, { scale: 1.18 - .18 * e });
    if (side) gsap.set(side, { opacity: 1 - Math.min(1, e * 1.6), x: -40 * e });
    frame.classList.toggle('is-mid', st.p > .3); frame.classList.toggle('is-full', st.p > .78);
    if (st.p > .78 && !ledgerPlayed) playLedger(); else if (st.p <= .78 && ledgerPlayed) resetLedger();
  };
  frame.classList.remove('is-full'); measure(); apply();
  const trig = ScrollTrigger.create({ trigger: cine, start: 'top top', end: 'bottom bottom', invalidateOnRefresh: true, onRefreshInit: measure, onUpdate: self => { st.p = self.progress; apply(); } });
  return () => { trig.kill(); gsap.set([frame, fimg], { clearProps: 'transform' }); if (side) gsap.set(side, { clearProps: 'all' }); frame.classList.add('is-full'); frame.classList.remove('is-mid'); };
});

// six years on one rail
const years = $('#years');
if (years) {
  years.insertAdjacentHTML('beforeend', ABOUT_YEARS.map(y => `<div class="y${y.h ? ' h' : ''}"><div class="mask"><div class="yr num">${y.y}</div></div><p>${esc(y.t)}</p></div>`).join(''));
  const ycols = $$('.y', years);
  if (REDUCED) { gsap.set('#yrail', { scaleX: 1 }); ycols.forEach(c => c.classList.add('is-on')); }
  else {
    const trig = { trigger: years, start: 'top 80%', end: 'bottom 55%', scrub: true };
    gsap.to('#yrail', { scaleX: 1, ease: 'none', scrollTrigger: { ...trig, onUpdate: s => { const on = Math.round(s.progress * ycols.length); ycols.forEach((c, i) => c.classList.toggle('is-on', i < on)); } } });
    gsap.to('#ydot', { x: () => years.clientWidth, ease: 'none', scrollTrigger: { ...trig, invalidateOnRefresh: true } });
  }
}

// partner logo marquee (markup holds the logos once, the loop copy is made here)
const pmq = $('#pmq'); if (pmq) { const inner = pmq.innerHTML; pmq.innerHTML = `<div class="pmq-g">${inner}</div><div class="pmq-g">${inner}</div>`; }

// organisation chart
const ot = $('#orgTree');
if (ot) ot.innerHTML = `<div class="o-root">${esc(ORG.root)}<i class="o-stem"></i></div><div class="o-staff"><i class="o-branch"></i>${esc(ORG.staff)}</div><i class="o-bus"></i>` + ORG.teams.map((t, i) => `<article class="o-team"><i class="o-stem"></i><span class="mono">${pad2(i + 1)}</span><h4>${esc(t.n)}</h4><ul>${t.s.map(x => `<li>${esc(x)}</li>`).join('')}</ul></article>`).join('');
const org = $('#org'); let orgTl = null;
const orgTimeline = () => {
  const teams = $$('#orgTree .o-team');
  return gsap.timeline({ paused: true })
    .fromTo('#orgTree .o-root', { clipPath: 'inset(50% 0 50% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: .6, ease: 'power4.out' })
    .to('#orgTree .o-root .o-stem', { scaleY: 1, duration: .35 }, .25)
    .to('#orgTree .o-bus', { scaleX: 1, duration: .7, ease: 'power3.out' }, .45)
    .to('#orgTree .o-branch', { scaleX: 1, duration: .4 }, .45).from('#orgTree .o-staff', { opacity: 0, y: 12, duration: .5 }, .55)
    .from(teams, { y: 24, opacity: 0, duration: .8, ease: 'power3.out', stagger: { each: .07, from: 'center' } }, .75)
    .to(teams.map(t => $('.o-stem', t)), { scaleY: 1, duration: .3, stagger: { each: .07, from: 'center' } }, .75)
    .from('#orgTree .o-team li', { opacity: 0, duration: .4, stagger: .02 }, 1.05);
};
if (org) {
  if (REDUCED) gsap.set('#orgTree .o-stem, #orgTree .o-bus, #orgTree .o-branch', { scale: 1 });
  else { orgTl = orgTimeline(); ScrollTrigger.create({ trigger: '#orgTree', start: 'top 85%', onEnter: () => { if (org.open) orgTl.play(); }, onLeaveBack: () => orgTl.reverse() }); }
  org.addEventListener('toggle', () => { ScrollTrigger.refresh(); if (orgTl && org.open) orgTl.play(); });
}

/* ---------------- canvases ---------------- */
initTelemetry($('#sig'), { reduced: REDUCED });
initMap($('#map'), SITES, { reduced: REDUCED });

/* ---------------- video, form ---------------- */
const video = $('#video');
const playVideo = () => { if (video.querySelector('iframe')) return; const f = document.createElement('iframe'); f.src = `https://www.youtube.com/embed/${video.dataset.yt}?autoplay=1&rel=0`; f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true; f.title = 'DVISION 홍보영상'; video.appendChild(f); };
video.addEventListener('click', playVideo); video.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playVideo(); } });
$('#form').addEventListener('submit', e => {
  e.preventDefault(); const f = e.target;
  if (!f.reportValidity()) return;
  const d = Object.fromEntries(new FormData(f).entries());
  const body = `회사명: ${d.company}\n담당자명: ${d.name}\n연락처: ${d.tel}\n이메일: ${d.email}\n\n문의 내용:\n${d.message}`;
  location.href = `mailto:info@dvi-ind.com?subject=${encodeURIComponent('[홈페이지 문의] ' + d.company)}&body=${encodeURIComponent(body)}`;
  $('#formNote').textContent = '메일 앱이 열렸습니다. 전송 후 영업일 기준 2일 내 회신드립니다.';
});

/* ---------------- cursor + magnetic ---------------- */
if (FINE && !REDUCED) {
  document.body.classList.add('is-fine');
  const cx = gsap.quickTo(cursor, 'x', { duration: .35, ease: 'power3.out' }), cy = gsap.quickTo(cursor, 'y', { duration: .35, ease: 'power3.out' });
  addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); cursor.style.opacity = 1; }, { passive: true });
  document.addEventListener('pointerleave', () => cursor.style.opacity = 0);
  document.addEventListener('pointerover', e => { if (e.target.closest('a, button, [data-hover], .step, .sites li, .gallery figure, .cert')) cursor.classList.add('is-hover'); });
  document.addEventListener('pointerout', e => { if (e.target.closest('a, button, [data-hover], .step, .sites li, .gallery figure, .cert')) cursor.classList.remove('is-hover'); });
  $$('.mag').forEach(btn => {
    const mx = gsap.quickTo(btn, 'x', { duration: .5, ease: 'power3.out' }), my = gsap.quickTo(btn, 'y', { duration: .5, ease: 'power3.out' });
    btn.addEventListener('pointermove', e => { const r = btn.getBoundingClientRect(); mx((e.clientX - (r.left + r.width / 2)) * .28); my((e.clientY - (r.top + r.height / 2)) * .28); });
    btn.addEventListener('pointerleave', () => { mx(0); my(0); });
  });
}
addEventListener('load', () => ScrollTrigger.refresh());

// debug handle (harmless in production)
window.__dv = { gsap, ScrollTrigger, HERO, EXT, SCROLL };
