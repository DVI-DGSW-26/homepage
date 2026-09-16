import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { createScroll } from './scroll.js';
import { createHero } from './hero.js';
import { createExtrusion, metricsFor } from './extrusion.js';
import { initMap } from './map.js';
import { initTelemetry } from './telemetry.js';
import { PRODUCTS, PROCESSES, PROCESS_IMG, CERTS, CERT_KINDS, HISTORY, SITES, TEST_EQUIPMENT, ABOUT_YEARS, ORG, EVENTS, EVENT_IMG } from './data.js';
import { EN, t, applyStatic } from './i18n.js';

// English copy has to land before SplitText measures a headline or any list is built.
applyStatic();

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
const TAGS = EN
  ? { automotive: ['Extrusion', 'CNC', 'T6'], industrial: ['Extrusion', 'Cutting', 'Machining'], architecture: ['Extrusion', 'Cutting', 'Finishing'], aerospace: ['Bending', 'Cutting', 'Deburring'] }
  : { automotive: ['압출', 'CNC', 'T6'], industrial: ['압출', '절단', '가공'], architecture: ['압출', '절단', '마감'], aerospace: ['벤딩', '절단', '디버링'] };
const rowsEl = $('#rows'), galleryEl = $('#gallery'), indexTitle = $('#indexTitle'), indexCount = $('#indexCount');
let currentRows = [];
function buildIndex(catId, animate = true) {
  const cat = PRODUCTS.find(c => c.id === catId); if (!cat) return;
  const map = new Map();
  cat.groups.forEach(g => g.parts.forEach(p => { if (!map.has(p.name)) map.set(p.name, { name: p.name, sys: g.ko, sysEn: g.en, imgs: [] }); map.get(p.name).imgs.push('assets/img/products/' + p.img); }));
  currentRows = [...map.values()];
  indexTitle.textContent = t(cat.ko, cat.en);
  indexCount.textContent = `${currentRows.length} parts / ${cat.groups.reduce((n, g) => n + g.parts.length, 0)} photos`;
  rowsEl.innerHTML = currentRows.map((r, i) => `<li class="row" data-i="${i}" data-hover><span class="name">${roll(r.name)}</span><span class="sys">${EN ? esc(r.sysEn) : `${esc(r.sys)} <span class="mono" style="color:var(--mute);margin-left:6px">${esc(r.sysEn)}</span>`}</span><span class="tags">${TAGS[catId].map(t => `<span>${t}</span>`).join('')}</span><span class="cnt num">${pad2(r.imgs.length)} photo${r.imgs.length > 1 ? 's' : ''}</span></li>`).join('');
  galleryEl.innerHTML = cat.groups.flatMap(g => g.parts.map(p => `<figure data-name="${esc(p.name)}"><div class="photo"><img loading="lazy" decoding="async" src="assets/img/products/${p.img}" alt="${esc(p.name)}" width="335" height="300"></div><figcaption><b>${esc(p.name)}</b><span>${esc(t(g.ko, g.en))}</span></figcaption></figure>`)).join('');
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
    <div class="pics">${s.imgs.map((im, k) => `<img src="${PROCESS_IMG + im}" alt="${esc(t(s.ko, s.koEn))} ${k + 1}" loading="lazy" decoding="async" width="505" height="350">`).join('')}${s.imgs.length > 1 ? '<span class="sw">Hover: photo</span>' : ''}</div>
    <div class="body"><div class="tag mono"><span>Step ${pad2(i + 1)}</span><em>${esc(s.en)}</em></div><h3>${esc(t(s.ko, s.koEn))}</h3><div class="idx num">${pad2(i + 1)}</div><p>${esc(t(s.d, s.dEn))}</p></div>
  </article>`).join('') + '</div>').join('');

// certificates marquee (doubled for the loop)
const certHTML = CERTS.map(c => `<figure class="cert"><div class="photo"><img src="${c.src}" alt="${esc(t(c.t, c.tEn))}" loading="lazy" decoding="async" width="248" height="354"></div><b>${esc(t(c.t, c.tEn))}</b><span class="${c.k === '수상' ? 'aw' : ''}">${esc(t(c.k, CERT_KINDS[c.k]))}</span></figure>`).join('');
$('#certTrack').innerHTML = `<div class="cert-g">${certHTML}</div><div class="cert-g">${certHTML}</div>`;

// sites
$('#sites').innerHTML = SITES.map(s => `<li class="rv${s.hq ? ' hq' : ''}" data-hover><div class="photo"><img src="${s.img}" alt="${esc(t(s.ko, s.en))}" loading="lazy" decoding="async" width="250" height="230"></div><div class="in"><span class="mono">${esc(s.k)} / ${Math.abs(s.lat).toFixed(1)}°${s.lat >= 0 ? 'N' : 'S'} ${Math.abs(s.lon).toFixed(1)}°${s.lon >= 0 ? 'E' : 'W'}</span><b>${esc(t(s.ko, s.en))}</b><span>${esc(t(s.where, s.whereEn))}</span></div></li>`).join('');

// history
$('#tl').insertAdjacentHTML('beforeend', HISTORY.map(y => `<article class="rv"><div class="year num">${y.y}</div><div class="body">${y.ev.map(e => `<div class="ev"><span class="m">${e.m}</span><ul>${(EN && e.lEn ? e.lEn : e.l).map((l, i) => `<li${e.h && i === 0 ? ' class="h"' : ''}>${esc(l)}</li>`).join('')}</ul></div>`).join('')}</div></article>`).join(''));

// test equipment
$('#testBody').innerHTML = TEST_EQUIPMENT.map(t => `<tr><td>${esc(t.name)}</td><td class="dim">${esc(t.brand || '—')}</td><td class="dim">${esc(t.spec)}</td><td class="q num">${t.q}</td></tr>`).join('');

// events: a filterable list on the left, the selected event's photos and coverage on the right
const evList = $('#evList'), evDetail = $('#evDetail'), evFilters = $('#evFilters'), evCount = $('#evCount');
if (evList) {
  const KIND = { out: t('사외', 'External'), in: t('사내', 'In-house') };
  const L = {
    all: t('전체', 'All'), host: t('주최', 'Host'), place: t('장소', 'Venue'),
    press: t('기사', 'Press'), video: t('영상', 'Video'), coverage: t('보도', 'Coverage'), award: t('수상', 'Award'),
    none: t('등록된 링크가 없습니다.', 'No links on file.'),
    count: n => t(`${n}건의 행사`, `${n} event${n === 1 ? '' : 's'}`)
  };
  const name = e => t(e.ko, e.en);
  // A ribboned medal pinned to the photo corner, instead of shouting the prize in text.
  // Korean splits by character, Latin by word, and the face type shrinks to fit the disc.
  const medalLines = (s) => {
    const txt = String(s).trim();
    if (/[가-힣]/.test(txt)) {
      const k = txt.replace(/\s+/g, '');
      return k.length <= 3 ? [k] : [k.slice(0, Math.ceil(k.length / 2)), k.slice(Math.ceil(k.length / 2))];
    }
    const w = txt.split(/\s+/);
    if (w.length < 2) return w;
    const mid = Math.ceil(w.length / 2);
    return [w.slice(0, mid).join(' '), w.slice(mid).join(' ')];
  };
  const medal = (e, compact = false) => {
    const face = t(e.medal, e.medalEn) || t(e.award, e.awardEn);
    if (!face) return '';
    const lines = compact ? [] : medalLines(face);
    const wide = lines.some(l => /[가-힣]/.test(l)) ? 1 : 0.58;
    const fs = lines.length ? Math.max(11, Math.min(30, 56 / (Math.max(...lines.map(l => l.length)) * wide))) : 0;
    const y0 = 96 - (lines.length - 1) * fs * 0.56;
    const beads = Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2;
      return `<circle cx="${(60 + Math.cos(a) * 43).toFixed(1)}" cy="${(96 + Math.sin(a) * 43).toFixed(1)}" r="2.6"/>`;
    }).join('');
    return `<svg class="ev-medal${compact ? ' is-compact' : ''}" viewBox="0 0 120 150" role="img" aria-label="${esc(t(e.award, e.awardEn))}">
      <defs>
        <linearGradient id="mdG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E6B6"/><stop offset=".45" stop-color="#D9AF4E"/><stop offset="1" stop-color="#A8792A"/></linearGradient>
        <linearGradient id="mdF" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FBF1CF"/><stop offset=".5" stop-color="#E4C065"/><stop offset="1" stop-color="#C39A3C"/></linearGradient>
        <linearGradient id="mdR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E1D28"/><stop offset="1" stop-color="#5E1019"/></linearGradient>
        <linearGradient id="mdR2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B42B36"/><stop offset="1" stop-color="#7C1520"/></linearGradient>
      </defs>
      <path d="M34 2 L56 2 L68 60 L44 64 Z" fill="url(#mdR)"/>
      <path d="M64 2 L86 2 L76 64 L52 60 Z" fill="url(#mdR2)"/>
      <g fill="url(#mdG)">${beads}</g>
      <circle cx="60" cy="96" r="42" fill="url(#mdG)"/>
      <circle cx="60" cy="96" r="34" fill="url(#mdF)" stroke="#9C7227" stroke-width="1.2"/>
      <circle cx="60" cy="96" r="29" fill="none" stroke="#A8792A" stroke-width="1" opacity=".55"/>
      ${lines.map((l, i) => `<text x="60" y="${(y0 + i * fs * 1.12).toFixed(1)}" font-size="${fs.toFixed(1)}" text-anchor="middle" dominant-baseline="central">${esc(l)}</text>`).join('')}
    </svg>`;
  };
  const date = d => d.replace(/-/g, '.');
  const photosOf = e => Array.from({ length: e.photos }, (_, i) => `${EVENT_IMG}${e.id}-${pad2(i + 1)}.jpg`);
  const years = [...new Set(EVENTS.map(e => e.date.slice(0, 4)))].sort().reverse();
  // open on the event flagged as featured, otherwise the most recent external one
  let year = 'all', currentId = (EVENTS.find(e => e.featured) || EVENTS.find(e => e.kind === 'out') || EVENTS[0]).id;

  evFilters.innerHTML = [['all', L.all], ...years.map(y => [y, y])]
    .map(([v, l]) => `<button type="button" class="ev-chip${v === 'all' ? ' is-on' : ''}" data-y="${v}" data-hover>${esc(l)}</button>`).join('');

  // awarded events lead the list, the flagship one at the very top, then the rest newest first
  const order = (a, b) => (!!b.award - !!a.award) || (!!b.featured - !!a.featured) || b.date.localeCompare(a.date);
  const shown = () => EVENTS.filter(e => year === 'all' || e.date.startsWith(year)).sort(order);

  function renderDetail() {
    const e = EVENTS.find(x => x.id === currentId); if (!e) return;
    const photos = photosOf(e);
    const links = [...e.press.map(x => ({ ...x, k: L.press })), ...e.video.map(x => ({ ...x, k: L.video }))];
    evDetail.innerHTML = `
      <div class="ev-stage">
        <img id="evStage" src="${photos[0]}" alt="${esc(name(e))}" loading="lazy" decoding="async">
        ${t(e.award, e.awardEn) ? medal(e) : ''}
      </div>
      ${photos.length > 1 ? `<div class="ev-thumbs">${photos.map((p, i) => `<button type="button" class="ev-th${i ? '' : ' is-on'}" data-src="${p}" aria-label="${i + 1}" data-hover><img src="${p.replace(/\.jpg$/, '-t.jpg')}" alt="" loading="lazy" decoding="async"></button>`).join('')}</div>` : ''}
      <div class="ev-meta">
        <span class="mono">${date(e.date)} · ${esc(KIND[e.kind])}${t(e.award, e.awardEn) ? ` · <em class="ev-won">${esc(t(e.award, e.awardEn))}</em>` : ''}</span>
        <h3>${esc(name(e))}</h3>
        ${t(e.note, e.noteEn) ? `<p>${esc(t(e.note, e.noteEn))}</p>` : ''}
        ${t(e.org, e.orgEn) ? `<div class="ev-row"><span class="mono">${esc(L.host)}</span><b>${esc(t(e.org, e.orgEn))}</b></div>` : ''}
      </div>
      <div class="ev-links">
        <div class="index-head"><h4>${esc(L.coverage)}</h4><span class="mono">${links.length}</span></div>
        ${links.length ? `<ul>${links.map(x => `<li><span class="mono tag">${esc(x.k)}</span><a href="${x.u}" target="_blank" rel="noopener" data-hover>${esc(t(x.n, x.nEn))}<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 13L13 3M5 3h8v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a></li>`).join('')}</ul>` : `<p class="ev-empty">${esc(L.none)}</p>`}
      </div>`;
    const stage = $('#evStage', evDetail);
    $$('.ev-th', evDetail).forEach(b => b.addEventListener('click', () => {
      $$('.ev-th', evDetail).forEach(o => o.classList.toggle('is-on', o === b));
      stage.src = b.dataset.src;
      if (!REDUCED) gsap.fromTo(stage, { opacity: 0 }, { opacity: 1, duration: .45, ease: 'power2.out' });
    }));
    if (!REDUCED) gsap.fromTo(evDetail, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' });
  }

  function renderList(animate = true) {
    const rows = shown();
    // filtered the current pick away: fall back the same way the section opens, external first
    if (!rows.some(e => e.id === currentId)) currentId = (rows.find(e => e.kind === 'out') || rows[0])?.id;
    evCount.textContent = L.count(rows.length);
    evList.innerHTML = rows.map(e => `
      <li><button type="button" class="ev-item${e.id === currentId ? ' is-on' : ''}${t(e.award, e.awardEn) ? ' has-award' : ''}" data-id="${e.id}" data-hover>
        <span class="ev-thumb"><img src="${EVENT_IMG}${e.id}-01-t.jpg" alt="" loading="lazy" decoding="async">${t(e.award, e.awardEn) ? medal(e, true) : ''}</span>
        <span class="ev-body">
          <span class="mono ev-top"><em>${date(e.date)}</em><i class="ev-kind ev-${e.kind}">${esc(KIND[e.kind])}</i>${t(e.award, e.awardEn) ? `<i class="ev-won">${esc(t(e.award, e.awardEn))}</i>` : ''}</span>
          <b>${esc(name(e))}</b>
          <span class="ev-sub">${esc(t(e.org, e.orgEn) || t(e.note, e.noteEn) || '')}</span>
        </span>
        <span class="mono ev-n">${e.press.length + e.video.length ? `${e.press.length + e.video.length} ${esc(L.coverage)}` : ''}</span>
      </button></li>`).join('');
    $$('.ev-item', evList).forEach(btn => btn.addEventListener('click', () => {
      currentId = btn.dataset.id;
      $$('.ev-item', evList).forEach(o => o.classList.toggle('is-on', o === btn));
      renderDetail();
    }));
    if (animate && !REDUCED) gsap.from($$('.ev-item', evList), { y: 18, opacity: 0, duration: .55, ease: 'power3.out', stagger: .05, clearProps: 'all' });
    renderDetail();
  }

  $$('.ev-chip', evFilters).forEach(chip => chip.addEventListener('click', () => {
    year = chip.dataset.y;
    $$('.ev-chip', evFilters).forEach(o => o.classList.toggle('is-on', o === chip));
    renderList();
    ScrollTrigger.refresh();
  }));
  renderList(false);
}


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
  const meta = HERO.parts[i]; if (meta) { hudPart.textContent = meta.en; hudCat.textContent = t(meta.ko, meta.koEn); hudProc.textContent = t(meta.proc, meta.procEn); }
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
const linkFor = { about: 'about', statement: 'about', product: 'product', config: 'config', process: 'config', equip: 'config', rnd: 'rnd', global: 'about', history: 'about', events: 'events', community: 'community', contact: 'community' };
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
// `overwrite: 'auto'`, never `true`: `true` kills every other tween on the same target, so
// these fades used to destroy the clip-path wipe below mid-animation and leave the photo
// frozen at a partial inset. 'auto' only resolves conflicts on the properties it animates.
$$('[data-batch]').forEach(group => {
  const items = $$('.rv', group), cards = items.filter(el => el.matches('.esg article, .ctile, .cat, .sites li')), plain = items.filter(el => !cards.includes(el));
  if (plain.length) { gsap.set(plain, { y: 40, opacity: 0 }); ScrollTrigger.batch(plain, { start: 'top 90%', onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: .7, ease: 'power3.out', stagger: .06, overwrite: 'auto' }), onLeaveBack: b => gsap.to(b, { y: 40, opacity: 0, duration: .5, ease: 'power2.in', overwrite: 'auto' }) }); }
  if (cards.length) { gsap.set(cards, { rotateX: 16, y: 54, opacity: 0, transformOrigin: 'top center' }); ScrollTrigger.batch(cards, { start: 'top 90%', onEnter: b => gsap.to(b, { rotateX: 0, y: 0, opacity: 1, duration: .85, ease: 'power4.out', stagger: .07, overwrite: 'auto' }), onLeaveBack: b => gsap.to(b, { rotateX: 16, y: 54, opacity: 0, duration: .5, ease: 'power2.in', overwrite: 'auto' }) }); }
});
// Photos wipe open from the bottom as they arrive.
// Each photo owns one paused tween that the batch plays or reverses, instead of the batch
// spawning a fresh tween per enter/leave. Around the trigger point the directional snap
// nudges the page back and forth, and those throwaway tweens cancelled each other mid-wipe
// and left a photo parked at a partial inset — a permanently sliced photo. A playhead can
// only ever come to rest at one end. Dropping `overwrite: true` matters too: it used to
// kill #rndHero's own fade-in and strand that photo at opacity 0.09.
const wipes = $$('.facs .photo, .sites .photo, .cert .photo, .step .pics, .ctile .photo, #rndHero, .catalog .photo');
if (!REDUCED && wipes.length) {
  const wipeOf = new Map(wipes.map(el => {
    const peers = wipes.filter(w => w.parentElement === el.parentElement);
    return [el, gsap.fromTo(el,
      { clipPath: 'inset(100% 0 0 0)' },
      { clipPath: 'inset(0% 0 0 0)', duration: .8, ease: 'power4.out', paused: true,
        delay: Math.min(peers.indexOf(el), 7) * .04 })];
  }));
  ScrollTrigger.batch(wipes, {
    start: 'top 94%',
    onEnter: b => b.forEach(el => wipeOf.get(el).play()),
    onLeaveBack: b => b.forEach(el => wipeOf.get(el).reverse())
  });
}
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
const showLen = () => { cfgLen.textContent = EXT.length.toFixed(1) + ' m'; };
showLen();   // the bar already measures its resting length before the section is scrolled
ScrollTrigger.create({ trigger: '#config', start: 'top bottom', end: 'bottom top', onToggle: s => EXT.setActive(s.isActive) });
const mm = gsap.matchMedia();
mm.add('(min-width: 901px)', () => { const st = ScrollTrigger.create({ trigger: '#config', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: s => { EXT.setProgress(s.progress); showLen(); } }); return () => st.kill(); });
mm.add('(max-width: 900px)', () => { const st = ScrollTrigger.create({ trigger: '#config', start: 'top 70%', end: 'bottom 30%', scrub: true, onUpdate: s => { EXT.setProgress(s.progress); showLen(); } }); return () => st.kill(); });

/* ---------------- process: tabs + horizontal scroll ---------------- */
const procSec = $('#process'), procBar = $('#procBar'), procTitle = $('#procTitle'), procFoot = $$('#procFoot span');
let procTween = null, procDesktop = false, procStepTweens = [];
const TITLES = Object.fromEntries(PROCESSES.map(p => [p.id, t(p.title, p.titleEn)]));
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
  years.insertAdjacentHTML('beforeend', ABOUT_YEARS.map(y => `<div class="y${y.h ? ' h' : ''}"><div class="mask"><div class="yr num">${y.y}</div></div><p>${esc(t(y.t, y.tEn))}</p></div>`).join(''));
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
if (ot) ot.innerHTML = `<div class="o-root">${esc(t(ORG.root, ORG.rootEn))}<i class="o-stem"></i></div><div class="o-staff"><i class="o-branch"></i>${esc(t(ORG.staff, ORG.staffEn))}</div><i class="o-bus"></i>` + ORG.teams.map((team, i) => `<article class="o-team"><i class="o-stem"></i><span class="mono">${pad2(i + 1)}</span><h4>${esc(t(team.n, team.nEn))}</h4><ul>${(EN && team.sEn ? team.sEn : team.s).map(x => `<li>${esc(x)}</li>`).join('')}</ul></article>`).join('');
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
const playVideo = () => { if (video.querySelector('iframe')) return; const f = document.createElement('iframe'); f.src = `https://www.youtube.com/embed/${video.dataset.yt}?autoplay=1&rel=0`; f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true; f.title = t('DVISION 홍보영상', 'DVISION PR video'); video.appendChild(f); };
video.addEventListener('click', playVideo); video.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playVideo(); } });
$('#form').addEventListener('submit', e => {
  e.preventDefault(); const f = e.target;
  if (!f.reportValidity()) return;
  const d = Object.fromEntries(new FormData(f).entries());
  const L = EN
    ? { company: 'Company', name: 'Contact', tel: 'Phone', email: 'Email', msg: 'Message', subject: '[Website inquiry] ', sent: 'Your mail app is open. We reply within two business days of receiving it.' }
    : { company: '회사명', name: '담당자명', tel: '연락처', email: '이메일', msg: '문의 내용', subject: '[홈페이지 문의] ', sent: '메일 앱이 열렸습니다. 전송 후 영업일 기준 2일 내 회신드립니다.' };
  const body = `${L.company}: ${d.company}\n${L.name}: ${d.name}\n${L.tel}: ${d.tel}\n${L.email}: ${d.email}\n\n${L.msg}:\n${d.message}`;
  location.href = `mailto:info@dvi-ind.com?subject=${encodeURIComponent(L.subject + d.company)}&body=${encodeURIComponent(body)}`;
  $('#formNote').textContent = L.sent;
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
