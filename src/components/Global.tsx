import { useRef, type CSSProperties } from 'react';
import { useGSAP } from '../lib/gsap';
import { REDUCED } from '../lib/env';
import { pick, useT } from '../i18n';
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
        <SecHead eyebrow={m.eyebrow} title={m.title} lead={m.lead} />
        <div className="rv relative overflow-hidden rounded-t-card border border-line bg-card">
          <canvas ref={map} aria-label={m.mapAria} className="block aspect-[2/1] h-auto w-full" />
        </div>
        <ul data-batch className="m-0 grid list-none grid-cols-6 overflow-hidden rounded-b-card border border-t-0 border-line bg-card p-0 max-3xl:grid-cols-3 max-xs:grid-cols-2">
          {SITES.map(s => (
            <li key={s.k} className={cn(
              'group rv grid cursor-pointer grid-rows-[auto_1fr] border-r border-line last:border-r-0',
              'max-3xl:nth-[3n]:border-r-0 max-3xl:nth-[-n+3]:border-b',
              'max-xs:border-r! max-xs:border-b max-xs:even:border-r-0!'
            )}>
              <Photo data-wipe src={s.img} sizes="(max-width: 900px) 50vw, 17vw" alt={pick(s.ko, s.en)} className="aspect-[25/18] rounded-none" imgClassName="transition-transform duration-1000 ease-out group-hover:scale-[1.06]" />
              <div className="grid content-start gap-1.5 px-[18px] pt-4 pb-5">
                <span className="mono text-[.84rem] text-mute">{s.k} / {coord(s.lat, s.lon)}</span>
                <b className={cn('text-[.98rem] font-semibold', s.hq && 'text-acc-2')}>{pick(s.ko, s.en)}</b>
                <span className="text-[.84rem] text-fg-2">{pick(s.where, s.whereEn)}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

const TL_COL = 'clamp(72px,10vw,150px)';

// oldest first: the story reads from the 2020 founding forward, month by month
const CHRONO = [...HISTORY].sort((a, b) => a.y - b.y).map(y => ({ ...y, ev: [...y.ev].sort((a, b) => +a.m - +b.m) }));

export function History() {
  const m = useT().history;
  return (
    <Section id="history" className={SEC}>
      <div className="wrap">
        <SecHead eyebrow={m.eyebrow} title={m.title} lead={m.lead} />
        <div data-tl style={{ '--tl': TL_COL } as CSSProperties} className="relative mt-5 grid before:absolute before:inset-y-0 before:left-(--tl) before:w-px before:bg-line before:content-['']">
          <i className="absolute inset-y-0 left-(--tl) w-px bg-[linear-gradient(180deg,var(--fg),var(--acc))]" />
          {CHRONO.map(y => (
            <article key={y.y} className="rv grid grid-cols-[var(--tl)_1fr] border-b border-line py-[34px]">
              <div className="num relative font-display text-[clamp(2.4rem,4.4vw,4rem)] leading-[.9] font-extrabold after:absolute after:top-[.45em] after:left-[calc(var(--tl)_-_5px)] after:size-[9px] after:rounded-full after:border after:border-fg-2 after:bg-bg after:content-['']">{y.y}</div>
              <div className="grid content-start gap-3.5 pl-[clamp(28px,4vw,64px)]">
                {y.ev.map(e => (
                  <div key={e.m} className="grid grid-cols-[3ch_1fr] items-start gap-3.5">
                    <span className="pt-[.35em] font-mono text-[.74rem] tracking-[.1em] text-mute">{e.m}</span>
                    <ul className="m-0 grid list-none gap-1 p-0">
                      {pick(e.l, e.lEn).map((l, i) => (
                        <li key={l} className={cn('text-[.98rem] text-fg-2', e.h && i === 0 && "font-semibold text-fg before:mr-2.5 before:inline-block before:size-[7px] before:rounded-full before:bg-acc before:align-middle before:content-['']")}>{l}</li>
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
