import { useRef } from 'react';
import { useGSAP } from '../lib/gsap';
import { REDUCED } from '../lib/env';
import { lines, pick, useT, type Messages } from '../i18n';
import { initTelemetry } from '../canvas/telemetry';
import { CERTS, CERT_KINDS, PROJECTS } from '../data';
import { Photo, SEC, SecHead, Section, cn } from './ui';
import { Img } from './Img';

// The figures and photos of the three ESG cards; their copy is in the dictionary under rnd.esg.
// A kpi with `count` counts up from 0; one with `v` is a fixed mark.
type Kpi = { count: number; unit: string } | { v: string };
const ESG: { id: keyof Messages['rnd']['esg']; img: string; letter: string; kpi: Kpi[] }[] = [
  { id: 'e', img: 'esg-01', letter: 'E', kpi: [{ count: 30, unit: '%' }, { count: 20, unit: '%' }] },
  { id: 's', img: 'esg-02', letter: 'S', kpi: [{ v: 'AI' }] },
  { id: 'g', img: 'esg-03', letter: 'G', kpi: [{ v: 'ISO' }] }
];
const KPI_B = 'flex items-baseline gap-1 font-display text-kpi-tight leading-display font-extrabold tracking-heading-sm max-lg:text-kpi-narrow';

export function Rnd() {
  const m = useT().rnd;
  const root = useRef<HTMLElement>(null), sig = useRef<HTMLCanvasElement>(null);
  useGSAP(() => {
    const tel = initTelemetry(sig.current!, { reduced: REDUCED });
    return () => tel.destroy();
  }, { scope: root });

  return (
    <Section ref={root} id="rnd" className={SEC}>
      <div className="wrap">
        {/* like Frame 01, a backdrop rather than a picture to take: presses go through it, so it can't be dragged out */}
        <Photo data-wipe src="assets/img/banners/rnd-bg.jpg" sizes="(max-width: 1480px) 100vw, 1480px" className="rv mb-stack-sm aspect-16/5 min-h-55 w-full" imgClassName="pointer-events-none select-none">
          <div className="mono absolute bottom-4.5 left-5.5 text-on-photo">{m.heroTag}</div>
        </Photo>
        <SecHead eyebrow={m.eyebrow} title={m.title} lead={lines(m.lead)} />
        <div className="grid grid-cols-2 items-stretch gap-col-gap max-lg:grid-cols-1">
          <div className="rv grid min-h-90 grid-rows-[auto_1fr_auto] gap-3.5 rounded-card border border-line bg-card p-5.5">
            <div className="mono flex justify-between text-mute"><span>{m.signal.title}</span><span>{m.signal.badge}</span></div>
            <canvas ref={sig} aria-label={m.signal.aria} className="size-full min-h-50" />
            <div className="mono flex flex-wrap justify-between gap-4.5 text-fg-2">
              <span><i className="mr-2 inline-block h-0.5 w-4.5 bg-acc align-middle" />{m.signal.temp}</span>
              <span><i className="mr-2 inline-block h-0.5 w-4.5 bg-fg align-middle" />{m.signal.ram}</span>
              <span className="text-mute">{m.signal.note}</span>
            </div>
          </div>
          <div>
            <div className="mt-8.5 grid">
              {m.research.map(r => (
                <article key={r.tag} className="rv grid grid-cols-[auto_1fr] gap-5.5 border-t border-line py-6.5 last:border-b">
                  <span className="mono min-w-[5ch] pt-1.5 text-mute">{r.tag}</span>
                  <div>
                    <h3 className="m-0 mb-2 text-title-sm font-semibold">{r.title}</h3>
                    <p className="m-0 text-body text-fg-2">{r.body}</p>
                    {r.items.length > 0 && <ul className="mt-2 mb-0 list-disc pl-4.5 text-body-sm text-fg-2">{r.items.map(x => <li key={x}>{x}</li>)}</ul>}
                    {r.projects && (
                      <ul className="mt-3 mb-0 grid list-none gap-3 p-0">
                        {PROJECTS.filter(p => p.rnd).map(p => (
                          <li key={p.program} className="grid gap-1 border-l-2 border-acc pl-3.5">
                            <b className="text-body-sm font-semibold text-fg">{pick(p.program, p.programEn)}</b>
                            <span className="text-body-sm text-fg-2">{pick(p.title, p.titleEn)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div data-batch className="mt-stack-md grid grid-cols-3 gap-4.5 max-lg:grid-cols-1 sm:max-lg:grid-cols-2">
          {ESG.map(({ id, ...e }) => { const c = m.esg[id]; return (
            <article key={id} className="group rv relative isolate grid min-h-105 sm:max-lg:last:col-span-2 content-end gap-4.5 overflow-hidden rounded-card border border-line p-7 text-on-photo max-lg:min-h-75">
              <Img src={`assets/img/esg/${e.img}.jpg`} sizes="(max-width: 900px) 100vw, 33vw" className="absolute inset-0 -z-2 size-full object-cover transition-transform duration-1200 ease-out group-hover:scale-106" />
              <div className="absolute inset-0 -z-1 bg-(image:--scrim-card-deep)" />
              <span aria-hidden="true" className="pointer-events-none absolute top-3.5 right-3.5 font-display text-letter leading-letter font-black text-transparent [-webkit-text-stroke:1px_var(--stroke-on-photo)]">{e.letter}</span>
              <h3 className="m-0 grid gap-1 text-title-xs font-semibold"><small className="font-mono text-micro font-medium tracking-label text-on-photo/70">{c.eyebrow}</small>{c.title}</h3>
              <p className="m-0 max-w-measure text-body-sm text-on-photo/80">{lines(c.body)}</p>
              <div className="flex gap-kpi-gap">
                {e.kpi.map((k, i) => (
                  <div key={i}>
                    {'count' in k
                      ? <b className={cn('num', KPI_B)}><span data-count={k.count}>0</span><small className="text-unit font-bold text-on-photo/72">{k.unit}</small></b>
                      : <b className={KPI_B}>{k.v}</b>}
                    <span className="mt-1.5 block text-mono text-on-photo/70">{c.kpis[i]}</span>
                  </div>
                ))}
              </div>
            </article>
          ); })}
        </div>

        <div className="rv mt-stack-md">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-x-5 gap-y-2"><h3 className="m-0 text-index font-semibold">{m.certs.title}</h3><span className="mono text-mute">{m.certs.count(CERTS.length)}</span></div>
          <div className="marquee-host overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
            <div className="flex w-max">
              {[0, 1].map(copy => (
                <div key={copy} aria-hidden={copy > 0 || undefined} className="marquee flex gap-3.5 pr-3.5 [--marquee-duration:var(--duration-marquee-certs)]">
                  {CERTS.map(c => (
                    // my-[1em] mx-10: the spacing these figures always had from the UA's default figure margins
                    <figure key={c.f} className="group mx-10 my-[1em] grid w-42.5 flex-none gap-2 max-xs:mx-4">
                      <Photo data-wipe src={c.src} sizes="170px" alt={pick(c.t, c.tEn)} className="aspect-248/354 border border-line bg-plate" imgClassName="transition-transform duration-800 ease-out group-hover:scale-104" />
                      <b className="block text-caption leading-caption font-medium">{pick(c.t, c.tEn)}</b>
                      <span className={cn('font-sans text-mono font-medium text-mute', c.k === '수상' && 'text-acc-ink')}>{pick(c.k, CERT_KINDS[c.k])}</span>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
