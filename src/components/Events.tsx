import { useId, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { REDUCED, pad2 } from '../lib/env';
import { pick as pickLang, useT } from '../i18n';
import { EVENTS, type DvEvent } from '../data';
import { ArrowIcon, IndexHead, SEC, SecHead, Section, cn } from './ui';
import { Img } from './Img';

const EVENT_IMG = 'assets/img/events/';
const name = (e: DvEvent) => pickLang(e.ko, e.en);
const award = (e: DvEvent) => pickLang(e.award, e.awardEn);
const date = (d: string) => d.replace(/-/g, '.');
const photosOf = (e: DvEvent) => Array.from({ length: e.photos }, (_, i) => `${EVENT_IMG}${e.id}-${pad2(i + 1)}.jpg`);
const YEARS = [...new Set(EVENTS.map(e => e.date.slice(0, 4)))].sort().reverse();
// awarded events lead the list, the flagship one at the very top, then the rest newest first
const order = (a: DvEvent, b: DvEvent) => (+!!b.award - +!!a.award) || (+!!b.featured - +!!a.featured) || b.date.localeCompare(a.date);
const shown = (year: string) => EVENTS.filter(e => year === 'all' || e.date.startsWith(year)).sort(order);
// the section opens on the featured event; a filter that hides the pick falls back to the first external one
const pick = (rows: DvEvent[]) => (rows.find(e => e.featured) || rows.find(e => e.kind === 'out') || rows[0])?.id;

// A ribboned medal pinned to the photo corner, instead of shouting the prize in text.
// Korean splits by character, Latin by word, and the face type shrinks to fit the disc.
const medalLines = (s: string) => {
  const txt = s.trim();
  if (/[가-힣]/.test(txt)) {
    const k = txt.replace(/\s+/g, '');
    return k.length <= 3 ? [k] : [k.slice(0, Math.ceil(k.length / 2)), k.slice(Math.ceil(k.length / 2))];
  }
  const w = txt.split(/\s+/);
  if (w.length < 2) return w;
  const mid = Math.ceil(w.length / 2);
  return [w.slice(0, mid).join(' '), w.slice(mid).join(' ')];
};
const BEADS = Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return [(60 + Math.cos(a) * 43).toFixed(1), (96 + Math.sin(a) * 43).toFixed(1)]; });

function Medal({ e, compact = false }: { e: DvEvent; compact?: boolean }) {
  const uid = useId().replace(/[^w-]/g, '');
  const face = pickLang(e.medal, e.medalEn) || award(e);
  if (!face) return null;
  const lines = compact ? [] : medalLines(face);
  const wide = lines.some(l => /[가-힣]/.test(l)) ? 1 : 0.58;
  const fs = lines.length ? Math.max(11, Math.min(30, 56 / (Math.max(...lines.map(l => l.length)) * wide))) : 0;
  const y0 = 96 - (lines.length - 1) * fs * 0.56;
  const id = (k: string) => `${k}-${uid}`;
  return (
    <svg viewBox="0 0 120 150" role="img" aria-label={award(e)} className={cn(
      'pointer-events-none absolute -top-0.5 h-auto fill-(--medal-ink) font-sans font-bold',
      compact ? 'left-1 w-6.5 drop-shadow-medal-sm' : 'left-[3.5%] w-medal drop-shadow-medal'
    )}>
      <defs>
        <linearGradient id={id('g')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--medal-gold-hi)" /><stop offset=".45" stopColor="var(--medal-gold-mid)" /><stop offset="1" stopColor="var(--medal-gold-lo)" /></linearGradient>
        <linearGradient id={id('f')} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--medal-face-hi)" /><stop offset=".5" stopColor="var(--medal-face-mid)" /><stop offset="1" stopColor="var(--medal-face-lo)" /></linearGradient>
        <linearGradient id={id('r')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--medal-ribbon-l-top)" /><stop offset="1" stopColor="var(--medal-ribbon-l-bot)" /></linearGradient>
        <linearGradient id={id('r2')} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--medal-ribbon-r-top)" /><stop offset="1" stopColor="var(--medal-ribbon-r-bot)" /></linearGradient>
      </defs>
      <path d="M34 2 L56 2 L68 60 L44 64 Z" fill={`url(#${id('r')})`} />
      <path d="M64 2 L86 2 L76 64 L52 60 Z" fill={`url(#${id('r2')})`} />
      <g fill={`url(#${id('g')})`}>{BEADS.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r="2.6" />)}</g>
      <circle cx="60" cy="96" r="42" fill={`url(#${id('g')})`} />
      <circle cx="60" cy="96" r="34" fill={`url(#${id('f')})`} stroke="var(--medal-rim)" strokeWidth="1.2" />
      <circle cx="60" cy="96" r="29" fill="none" stroke="var(--medal-gold-lo)" strokeWidth="1" opacity=".55" />
      {lines.map((l, i) => <text key={i} x="60" y={(y0 + i * fs * 1.12).toFixed(1)} fontSize={fs.toFixed(1)} textAnchor="middle" dominantBaseline="central">{l}</text>)}
    </svg>
  );
}

/** a filterable list on the left, the selected event's photos and coverage on the right */
export function Events() {
  const L = useT().events, KIND = L.kind;
  const root = useRef<HTMLDivElement>(null), stage = useRef<HTMLImageElement>(null);
  const [year, setYear] = useState('all');
  const [currentId, setCurrentId] = useState(() => pick(shown('all')));
  const [photo, setPhoto] = useState(0);
  const rows = shown(year);
  const e = EVENTS.find(x => x.id === currentId);

  const chooseYear = (y: string) => {
    if (y === year) return;
    const next = shown(y);
    setYear(y);
    if (!next.some(x => x.id === currentId)) { setCurrentId((next.find(x => x.kind === 'out') || next[0])?.id); setPhoto(0); }
  };
  const chooseEvent = (id: string) => { setCurrentId(id); setPhoto(0); };

  // the list deals in again whenever the filter changes (not on first render)
  const listed = useRef(year);
  useGSAP(() => {
    if (listed.current === year) return;
    listed.current = year;
    if (!REDUCED) gsap.from('[data-ev-item]', { y: 18, opacity: 0, duration: .55, ease: 'power3.out', stagger: .05, clearProps: 'all' });
    ScrollTrigger.refresh();
  }, { scope: root, dependencies: [year] });
  // the detail panel fades up every time it is drawn: first render, a new pick, a new filter
  useGSAP(() => {
    if (!REDUCED) gsap.fromTo('[data-ev-detail]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' });
  }, { scope: root, dependencies: [currentId, year] });
  const shownPhoto = useRef(photo);
  useGSAP(() => {
    if (shownPhoto.current === photo) return;
    shownPhoto.current = photo;
    if (!REDUCED) gsap.fromTo(stage.current, { opacity: 0 }, { opacity: 1, duration: .45, ease: 'power2.out' });
  }, { dependencies: [photo] });

  const photos = e ? photosOf(e) : [];
  const links = e ? [...e.press.map(x => ({ ...x, k: L.press })), ...e.video.map(x => ({ ...x, k: L.video }))] : [];
  return (
    <Section id="events" className={SEC}>
      <div ref={root} className="wrap">
        <SecHead eyebrow={L.eyebrow} title={L.title} />
        <div className="mb-5.5 flex flex-wrap items-baseline justify-between gap-5">
          <div className="mono flex flex-wrap gap-2" role="group" aria-label={L.filters}>
            {[['all', L.all], ...YEARS.map(y => [y, y])].map(([v, label]) => (
              <button key={v} type="button" onClick={() => chooseYear(v)} aria-pressed={v === year}
                className={cn('cursor-pointer rounded-full border px-4.5 py-2 transition-[color,border-color,background-color] duration-300',
                  v === year ? 'border-acc bg-acc-glow text-fg' : 'border-line text-fg-2 hover:border-line-2 hover:text-fg')}>{label}</button>
            ))}
          </div>
          <span className="mono text-mute">{L.count(rows.length)}</span>
        </div>
        <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] items-start gap-events-gap max-3xl:grid-cols-1">
          <ul className="m-0 grid list-none gap-2.5 p-0">
            {rows.map(ev => {
              const on = ev.id === currentId, won = award(ev), n = ev.press.length + ev.video.length;
              return (
                <li key={ev.id}>
                  <button type="button" data-ev-item onClick={() => chooseEvent(ev.id)} className={cn(
                    'grid w-full cursor-pointer grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-4 rounded-card border py-3 pr-4 pl-3 text-left',
                    '[transition:border-color_.35s,background_.35s,translate_.45s_var(--ease-out)] hover:translate-x-0.75 max-3xl:grid-cols-[76px_minmax(0,1fr)] max-3xl:gap-y-2',
                    won
                      ? (on ? 'border-gold bg-linear-to-r/srgb from-gold/16 to-transparent to-62%' : 'border-gold/34 bg-card')
                      : (on ? 'border-acc bg-linear-to-r/srgb from-acc-glow to-transparent to-62%' : 'border-line bg-card hover:border-line-2')
                  )}>
                    <span className="relative block aspect-4/3 w-24 rounded-[5px] bg-bg-2 max-3xl:w-[76px]">
                      <Img src={`${EVENT_IMG}${ev.id}-01-t.jpg`} sizes="64px" alt="" className="size-full rounded-[5px] object-cover" />
                      {won && <Medal e={ev} compact />}
                    </span>
                    <span className="grid min-w-0 gap-1.25">
                      <span className="mono flex flex-wrap items-center gap-x-2.5 gap-y-1 text-mute">
                        <em className="not-italic">{date(ev.date)}</em>
                        <i className={cn('rounded-tag border border-line-2 px-1.5 py-px text-tag tracking-tag not-italic', ev.kind === 'in' && 'border-acc text-acc-ink')}>{KIND[ev.kind]}</i>
                        {won && <i className="tracking-mono-sm text-gold not-italic">{won}</i>}
                      </span>
                      <b className="text-body leading-caption font-semibold wrap-anywhere">{name(ev)}</b>
                      <span className="text-small leading-note text-fg-2 wrap-anywhere">{pickLang(ev.org, ev.orgEn) || pickLang(ev.note, ev.noteEn) || ''}</span>
                    </span>
                    <span className="mono self-center whitespace-nowrap text-mute max-3xl:col-start-2 max-3xl:justify-self-start">{n ? L.coverageCount(n) : ''}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <aside data-ev-detail aria-live="polite" className="sticky top-nav-clear grid gap-3.5 rounded-card border border-line bg-card p-panel-pad max-3xl:static max-3xl:-order-1">
            {e && <>
              {/* full width (one column, up to 1100px) the photo goes wide so it does not tower over the list */}
              <div className="relative aspect-3/2 rounded-md bg-bg-2 max-3xl:aspect-video">
                <Img ref={stage} src={photos[photo]} sizes="(max-width: 1100px) 100vw, 50vw" alt={name(e)} className="size-full rounded-md object-cover" />
                {award(e) && <Medal e={e} />}
              </div>
              {photos.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {photos.map((p, i) => (
                    <button key={p} type="button" aria-label={L.photo(i + 1)} onClick={() => setPhoto(i)}
                      className={cn('aspect-4/3 w-16 cursor-pointer overflow-hidden rounded-sm border transition-[opacity,border-color] duration-300', i === photo ? 'border-acc opacity-100' : 'border-transparent opacity-55 hover:opacity-85')}>
                      <Img src={p.replace(/\.jpg$/, '-t.jpg')} sizes="96px" alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <div className="grid gap-2">
                <span className="mono text-mute">{date(e.date)} · {KIND[e.kind]}{award(e) && <> · <em className="text-gold not-italic">{award(e)}</em></>}</span>
                <h3 className="m-0 text-title leading-title font-semibold">{name(e)}</h3>
                {pickLang(e.note, e.noteEn) && <p className="m-0 text-body-sm text-fg-2">{pickLang(e.note, e.noteEn)}</p>}
                {pickLang(e.org, e.orgEn) && <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-3 border-t border-line pt-2.5"><span className="mono text-mute">{L.host}</span><b className="text-body-sm font-medium text-fg-2">{pickLang(e.org, e.orgEn)}</b></div>}
              </div>
              <div>
                <IndexHead as="h4" title={L.coverage} aside={links.length} className="mb-1.5" titleClassName="text-body" />
                {links.length
                  ? <ul className="m-0 grid list-none p-0">{links.map(x => (
                      <li key={x.u} className="grid grid-cols-[3.6rem_minmax(0,1fr)] items-center gap-3 border-t border-line">
                        <span className="mono text-mute">{x.k}</span>
                        <a href={x.u} target="_blank" rel="noopener" className="flex items-center justify-between gap-2.5 py-3 text-body-sm text-fg-2 transition-colors duration-300 hover:text-acc-2">{pickLang(x.n, x.nEn)}<ArrowIcon className="size-3.25 flex-none opacity-60" /></a>
                      </li>
                    ))}</ul>
                  : <p className="m-0 border-t border-line pt-3 text-small text-mute">{L.none}</p>}
              </div>
            </>}
          </aside>
        </div>
      </div>
    </Section>
  );
}
