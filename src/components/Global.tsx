import { useRef } from 'react';
import { useGSAP } from '../lib/gsap';
import { REDUCED } from '../lib/env';
import { lines, pick, useT } from '../i18n';
import { initMap } from '../canvas/map';
import { HISTORY, SITES } from '../data';
import { Photo, SEC, SecHead, Section, cn } from './ui';

const coord = (lat: number, lon: number) => `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`;

export function Global() {
  const m = useT().global;
  const map = useRef<HTMLCanvasElement>(null);
  useGSAP(() => {
    const m = initMap(map.current!, SITES, { reduced: REDUCED });
    return () => m.destroy();
  });
  return (
    <Section id="global" className={SEC}>
      <div className="wrap">
        <SecHead eyebrow={m.eyebrow} title={m.title} lead={lines(m.lead)} />
        <div className="rv relative overflow-hidden rounded-t-card border border-line bg-card">
          <canvas ref={map} aria-label={m.mapAria} className="block aspect-2/1 h-auto w-full" />
        </div>
        {/* six across from 1200px, three below it, two on a phone; spanned, two too, one per screen */}
        <ul data-batch className="m-0 grid list-none grid-cols-6 overflow-hidden rounded-b-card border border-t-0 border-line bg-card p-0 max-lg:grid-cols-3 max-sm:grid-cols-2 spanned:grid-cols-2">
          {SITES.map(s => (
            <li key={s.k} className={cn(
              'group rv grid grid-rows-[auto_1fr] border-r border-line last:border-r-0',
              'max-lg:nth-[3n]:border-r-0 max-lg:nth-[-n+3]:border-b',
              'max-sm:border-r! max-sm:border-b max-sm:even:border-r-0! spanned:border-r! spanned:border-b spanned:even:border-r-0!'
            )}>
              <Photo data-wipe src={s.img} sizes="(max-width: 599px) 50vw, (max-width: 1199px) 33vw, 17vw" alt={pick(s.ko, s.en)} className="aspect-25/18 rounded-none" imgClassName="transition-transform duration-1000 ease-out group-hover:scale-106" />
              <div className="grid content-start gap-1.5 px-4.5 pt-4 pb-5">
                <span className="mono text-caption text-mute">{s.k} / {coord(s.lat, s.lon)}</span>
                <b className={cn('text-body font-semibold', s.hq && 'text-acc-2')}>{pick(s.ko, s.en)}</b>
                <span className="text-caption text-fg-2">{pick(s.where, s.whereEn)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

// newest first: the latest year at the top, and within each year the latest month first
const CHRONO = [...HISTORY].sort((a, b) => b.y - a.y).map(y => ({ ...y, ev: [...y.ev].sort((a, b) => +b.m - +a.m) }));

export function History() {
  const m = useT().history;
  return (
    <Section id="history" className={SEC}>
      <div className="wrap">
        <SecHead eyebrow={m.eyebrow} title={m.title} lead={lines(m.lead)} />
        {/* --tl: the year column, the line runs down its right edge. Spanned, the line sits just left of the
            hinge, so the years are on one screen and what happened on the other (a length, not a percentage:
            the year's dot reads it too. The wrap column starts a gutter in, as it does on any screen that size) */}
        <div data-tl className="relative mt-5 grid [--tl:clamp(72px,10vw,150px)] before:absolute before:inset-y-0 before:left-(--tl) before:w-px before:bg-line spanned:[--tl:calc(env(viewport-segment-right_0_0)-var(--spacing-gutter)-4px)]">
          <i className="absolute inset-y-0 left-(--tl) w-px bg-linear-to-b/srgb from-fg to-acc" />
          {CHRONO.map(y => (
            <article key={y.y} className="rv grid grid-cols-[var(--tl)_1fr] border-b border-line py-8.5">
              <div className="num relative font-display text-year-sm leading-display font-extrabold after:absolute after:top-[.45em] after:left-[calc(var(--tl)-5px)] after:size-2.25 after:rounded-full after:border after:border-fg-2 after:bg-bg">{y.y}</div>
              <div className="grid content-start gap-3.5 pl-timeline spanned:pl-[calc(var(--spacing-hinge)+24px)]">
                {y.ev.map(e => (
                  <div key={e.m} className="grid grid-cols-[3ch_1fr] items-start gap-3.5">
                    <span className="pt-[.35em] font-mono text-label tracking-widest text-mute">{e.m}</span>
                    <ul className="m-0 grid list-none gap-1 p-0">
                      {pick(e.l, e.lEn).map((l, i) => (
                        <li key={l} className={cn('text-body text-fg-2', e.h && i === 0 && "font-semibold text-fg before:mr-2.5 before:inline-block before:size-1.75 before:rounded-full before:bg-acc before:align-middle")}>{l}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}
