// Q.A.C-Flow, the smartphone quality inspection system built on DVISION's own line.
// Hero with the figures up front, then problem, how it works, workflow, live monitor, traceability,
// and report → data (whose last step links on to the data-industry page, src/components/Future.tsx).
// Magenta (qf-*) is this section's accent only.
//
// The screens come from the in-house deployment. Customer and personal names are masked in the
// image files themselves (public/assets/img/qacflow/), and the phone captures have the status and
// navigation bars cropped off so they sit in the CSS iPhone (src/components/Device.tsx). Most are
// captured again in English (qacflow/en/, see EN below) and shown when the page is read in English.
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { lines, useLang, useT } from '../i18n';
import { Band, Eyebrow, H2, Lead, LineIcon as Icon, cn } from './ui';
import { Img } from './Img';
import { Monitor, Phone } from './Device';

const IMG = 'assets/img/qacflow/';
/** the screens captured again in English, under en/ as WebP; any other shows its Korean capture in English too */
const EN = new Set(['capture', 'ocr-input', 'crop', 'mobile-compare', 'mobile-photo-compare', 'measurement-detail', 'status-board', 'defect-actions', 'web-approval', 'report-summary']);
/** a screen's path in the language being read */
function useScreen() {
  const en = useLang() === 'en';
  return (src: string) => {
    const name = src.replace(/\.\w+$/, '');
    return IMG + (en && EN.has(name) ? `en/${name}.webp` : src);
  };
}
const MONITOR = ['measurement-detail.webp', 'status-board.webp', 'defect-actions.webp'] as const;

// line icons, 24×24, drawn with the current colour
const BEFORE_ICONS = ['M4 7h16v10H4z M8 11h8', 'M6 3h9l3 3v15H6z M9 10h6M9 14h6M9 18h3', 'M3 5h18v14H3z M3 10h18M9 5v14M15 5v14'];
const AFTER_ICONS = ['M4 8h3l2-3h6l2 3h3v11H4z M12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4 M8 12h8', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12l3 3 5-6', 'M6 3h9l3 3v15H6z M9 13l2 2 4-4'];
/** the arrow on the step that leads on to the data-industry page (Data, below) */
const NEXT = 'M5 12h14m-5-5l5 5-5 5';
const WORKFLOW_ICONS = ['M6 3h9l3 3v15H6z M9 9h6M9 13h6M9 17h4', 'M7 2h10v20H7z M11 18h2 M10 7h4v5h-4z', 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3 M18 3v4h-4M6 21v-4h4', 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z M9 12l2 2 4-4', 'M6 3h9l3 3v15H6z M12 9v7m0 0l-3-3m3 3l3-3'];

/** each block opens with the visitor's question, then answers it: a one-line answer, then the detail */
function Head({ kicker, q, title, lead }: { kicker: string; q: string; title: string; lead?: string }) {
  return (
    <div className="mb-stack-sm max-w-208">
      <span className="mono flex items-center gap-3 text-qf-ink before:h-0.5 before:w-6 before:rounded-full before:bg-qf">{kicker}</span>
      <h3 className="rv m-0 mt-3.5 text-h2 leading-h2 font-semibold tracking-tight text-balance">{q}</h3>
      <p className="rv m-0 mt-5 border-l-2 border-qf pl-4 text-title-lg leading-title font-semibold text-balance">{title}</p>
      {lead && <Lead className="rv mt-3.5 max-w-160 pl-4.5">{lines(lead)}</Lead>}
    </div>
  );
}

type Screen = { src: string; alt: string; dark?: boolean };
/** a phone in a pair is drawn at 3/4 of the pair, at most 460px wide */
const PAIR_SIZES = '(max-width: 599px) 70vw, 350px';

/** two phones turned in toward each other, the front one lower-left over the back one */
function PhonePair({ back, front, className }: { back: Screen; front: Screen; className?: string }) {
  const screen = useScreen();
  return (
    <div className={cn('relative mx-auto grid w-full max-w-115 grid-cols-12 items-start', className)}>
      <Phone {...back} src={screen(back.src)} sizes={PAIR_SIZES} view="left" className="col-[4/13] row-start-1" />
      <Phone {...front} src={screen(front.src)} sizes={PAIR_SIZES} view="right" className="z-1 col-[1/10] row-start-1 mt-[14%]" />
    </div>
  );
}

/** a browser window around a web screen; no address bar, so no internal URL */
function Browser({ src, alt, sizes, caption, className }: { src: string; alt: string; sizes: string; caption?: ReactNode; className?: string }) {
  const screen = useScreen();
  return (
    <figure className={cn('m-0 overflow-hidden rounded-[10px] border border-line-2 bg-card', className)}>
      <div aria-hidden="true" className="flex gap-1.5 border-b border-line px-3 py-2.5">{[0, 1, 2].map(i => <i key={i} className="size-2 rounded-full bg-line-2" />)}</div>
      <Img src={screen(src)} alt={alt} sizes={sizes} className="app-screen h-auto w-full bg-plate" />
      {caption && <figcaption className="mono border-t border-line px-3.5 py-2.5 text-mute">{caption}</figcaption>}
    </figure>
  );
}

export function QacFlow() {
  const m = useT().qf;
  // each block is its own band, the surfaces alternating
  return (
    <div id="qac-flow" role="region" aria-label={m.label}>
      <Band id="qf-intro" cover><Hero /></Band>
      <Band id="qf-problem" alt mark="01"><Problem /></Band>
      <Band id="qf-how" mark="02"><How /></Band>
      <Band id="qf-workflow" alt mark="03"><Workflow /></Band>
      <Band id="qf-live" mark="04"><Live /></Band>
      <Band id="qf-trace" alt mark="05"><Trace /></Band>
      <Band id="qf-data" mark="06"><Data /></Band>
    </div>
  );
}

function Hero() {
  const m = useT().qf;
  return (
    <div className="grid items-center gap-stack-sm md:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
      <div>
        <p className="rv m-0 mb-4.5 font-display text-wordmark leading-display font-extrabold tracking-heading-sm">Q.A.C<span className="text-qf-ink">-Flow</span></p>
        <Eyebrow className="rv">{m.expand}</Eyebrow>
        <H2 className="rv mt-5.5">{m.title}</H2>
        <Lead className="rv mt-5.5">{lines(m.lead)}</Lead>
        <ul className="rv m-0 mt-8 grid list-none grid-cols-3 border-t border-line p-0 md:mt-12">
          {[
            <><small className="text-[.5em] text-fg-2">~</small><span data-count="98">0</span><small className="text-[.5em] text-fg-2">%</small></>,
            <span data-count="0">0</span>,
            <><span className="text-[.7em]">2026.06.01</span><small className="text-[.5em] text-fg-2">~</small></>
          ].map((fig, i) => (
            <li key={i} className="grid content-start gap-2 pt-4.5 pr-3 not-first:border-l not-first:border-line not-first:pl-[clamp(12px,2vw,24px)]">
              <b className={cn('num flex items-baseline gap-0.5 whitespace-nowrap font-display text-stat leading-display font-extrabold', i === 0 && 'text-qf-ink')}>{fig}</b>
              <span className="text-caption leading-caption text-fg-2">{m.stats[i]}</span>
            </li>
          ))}
        </ul>
        <p className="rv mono m-0 mt-4 text-mute">{m.statsNote}</p>
      </div>
      <div className="rv relative isolate before:absolute before:inset-[8%_-10%_0] before:-z-1 max-md:before:inset-[8%_0_0] before:bg-[radial-gradient(50%_50%_at_50%_50%,var(--qf-soft),transparent_70%)]">
        <PhonePair back={{ src: 'ocr-input.webp', alt: m.alt.ocr }} front={{ src: 'capture.webp', alt: m.alt.capture, dark: true }} />
      </div>
    </div>
  );
}

function Problem() {
  const m = useT().qf;
  const p = m.problem;
  const flow = (labels: readonly string[], icons: string[], after: boolean) => (
    <ol className="m-0 grid list-none gap-3 p-0">
      {labels.map((label, i) => (
        <li key={label} className={cn(
          'relative flex items-center gap-3.5',
          after ? 'font-semibold text-fg' : 'text-fg-2',
          'not-first:before:absolute not-first:before:-top-3 not-first:before:left-4.75 not-first:before:h-3 not-first:before:border-l',
          after ? 'not-first:before:border-qf-line' : 'not-first:before:border-dashed not-first:before:border-line-2'
        )}>
          <Icon d={icons[i]} className={cn('size-10 flex-none rounded-full border p-2.25', after ? 'border-qf-line text-qf-ink' : 'border-line-2')} />
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
  return (
    <div>
      <Head kicker={p.kicker} q={p.q} title={p.title} />
      <div data-batch className="grid gap-4 md:grid-cols-2 md:gap-6">
        <article className="rv grid content-start gap-6.5 rounded-card border border-dashed border-line-2 p-panel-pad text-fg-2">
          <span className="mono justify-self-start rounded-full border border-line-2 px-3 py-1.5 text-micro">{p.before}</span>
          {flow(p.beforeSteps, BEFORE_ICONS, false)}
          <ul className="m-0 grid list-none gap-2 border-t border-line p-0 pt-5 text-body-sm">
            {p.pains.map(x => <li key={x} className="relative pl-5.5 before:absolute before:top-[.82em] before:left-0 before:h-px before:w-2.5 before:bg-fg-2">{x}</li>)}
          </ul>
        </article>
        <article className="rv grid content-start gap-6.5 rounded-card border border-qf-line bg-linear-160 from-qf-soft to-transparent to-70% p-panel-pad">
          <span className="mono justify-self-start rounded-full border border-qf bg-qf px-3 py-1.5 text-micro text-on-acc">{p.after}</span>
          {flow(p.afterSteps, AFTER_ICONS, true)}
        </article>
      </div>
    </div>
  );
}

function How() {
  const m = useT().qf;
  const screen = useScreen();
  const h = m.how;
  return (
    <div>
      <Head kicker={h.kicker} q={h.q} title={h.title} lead={h.lead} />
      {/* the three screens in step, each over its column of the steps below */}
      <div data-batch className="mx-auto grid max-w-300 grid-cols-3 gap-[clamp(12px,4vw,64px)]">
        {([['capture.webp', m.alt.capture, true], ['crop.webp', m.alt.crop], ['ocr-input.webp', m.alt.ocr]] as const).map(([src, alt, dark]) => (
          <Phone key={src} src={screen(src)} alt={alt} dark={dark} sizes="(max-width: 1200px) 32vw, 390px" className="rv mx-auto w-full max-w-97.5" />
        ))}
      </div>
      <ol data-batch className="m-0 mx-auto mt-10 grid max-w-300 list-none gap-5.5 p-0 sm:grid-cols-3 sm:gap-[clamp(20px,4vw,64px)]">
        {h.steps.map((s, i) => (
          <li key={s.title} className="rv grid grid-cols-[auto_1fr] gap-x-4 border-t border-line pt-4.5">
            <b className="row-span-2 pt-0.75 font-mono text-mono-sm text-qf-ink">{String(i + 1).padStart(2, '0')}</b>
            <h4 className="m-0 text-title-xs font-semibold">{s.title}</h4>
            <p className="m-0 mt-1.5 text-body-sm leading-copy text-fg-2">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Workflow() {
  const m = useT().qf;
  const w = m.workflow;
  return (
    <div>
      <Head kicker={w.kicker} q={w.q} title={w.title} />
      <ol data-batch className="m-0 grid list-none p-0 lg:grid-cols-5 lg:gap-[clamp(16px,2vw,32px)]">
        {w.steps.map((s, i) => (
          <li key={s.title} className={cn(
            'rv relative grid grid-cols-[52px_1fr] gap-x-4.5 pb-7 last:pb-0',
            'before:absolute before:top-13 before:bottom-0 before:left-6.25 before:border-l before:border-qf-line last:before:hidden',
            'lg:grid-cols-1 lg:content-start lg:pb-0 lg:before:top-6.5 lg:before:right-[calc(clamp(16px,2vw,32px)*-1)] lg:before:bottom-auto lg:before:left-16 lg:before:border-t lg:before:border-l-0'
          )}>
            <span className={cn('row-span-3 grid size-13 place-items-center rounded-full border border-qf-line bg-bg text-qf-ink lg:row-span-1 lg:mb-5', i === w.steps.length - 1 && 'border-qf bg-qf text-on-acc')}>
              <Icon d={WORKFLOW_ICONS[i]} className="size-6" />
            </span>
            <b className="mono pt-1 text-micro text-mute">{w.step(i + 1)}</b>
            <h4 className="m-0 mt-0.5 text-title-xs font-semibold">{s.title}</h4>
            <p className="m-0 mt-1.5 text-body-sm leading-copy text-fg-2">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Live() {
  const m = useT().qf;
  const screen = useScreen();
  const l = m.live;
  const [tab, setTab] = useState(0);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = e.key === 'ArrowRight' ? (tab + 1) % 3 : e.key === 'ArrowLeft' ? (tab + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1;
    if (next < 0) return;
    e.preventDefault(); setTab(next);
    document.getElementById(`qf-tab-${next}`)?.focus();
  };
  return (
    <div>
      <Head kicker={l.kicker} q={l.q} title={l.title} lead={l.lead} />
      <div role="tablist" aria-label={l.tabsAria} className="mono mb-4.5 flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
        {l.tabs.map((label, i) => (
          <button key={label} id={`qf-tab-${i}`} type="button" role="tab" aria-selected={tab === i} aria-controls={`qf-panel-${i}`} tabIndex={tab === i ? 0 : -1}
            onClick={() => setTab(i)} onKeyDown={onKey}
            className={cn('flex-none cursor-pointer rounded-full border px-4 py-2.5 text-label transition-colors duration-300',
              tab === i ? 'border-qf bg-qf text-on-acc' : 'border-line text-fg-2 hover:border-line-2 hover:text-fg')}>{label}</button>
        ))}
      </div>
      {/* hidden panels don't fetch their screen until opened */}
      <Monitor className="rv mx-auto mb-8 max-w-300">
        {MONITOR.map((src, i) => (
          <div key={src} role="tabpanel" id={`qf-panel-${i}`} aria-labelledby={`qf-tab-${i}`} hidden={tab !== i} className="size-full">
            <Img src={screen(src)} alt={m.alt.monitor[i]} sizes="(max-width: 1260px) 96vw, 1200px" className="size-full object-cover object-top-left" />
          </div>
        ))}
      </Monitor>
      <p className="mono m-0 text-micro text-mute">{l.note}</p>
    </div>
  );
}

function Trace() {
  const m = useT().qf;
  const t = m.trace;
  return (
    <div>
      <Head kicker={t.kicker} q={t.q} title={t.title} lead={t.lead} />
      <div className="grid items-center gap-stack-sm md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <PhonePair className="rv max-w-105" back={{ src: 'mobile-compare.webp', alt: m.alt.compare }} front={{ src: 'mobile-photo-compare.webp', alt: m.alt.photos }} />
        <div className="grid gap-[clamp(28px,3vw,40px)]">
          <ul data-batch className="m-0 grid list-none gap-4.5 p-0">
            {t.points.map(x => (
              <li key={x.title} className="rv relative grid gap-1.5 border-t border-line pt-4 pl-7.5 before:absolute before:top-4.75 before:left-1 before:h-2.75 before:w-1.5 before:rotate-45 before:border-r-[1.5px] before:border-b-[1.5px] before:border-qf-ink">
                <b className="font-semibold">{x.title}</b>
                <span className="text-body-sm leading-copy text-fg-2">{x.body}</span>
              </li>
            ))}
          </ul>
          <Browser className="rv" src="web-approval.jpg" alt={m.alt.approval} sizes="(max-width: 1000px) 100vw, 860px" />
        </div>
      </div>
    </div>
  );
}

function Data() {
  const t = useT(), m = t.qf, f = t.future;
  const d = m.data;
  return (
    <div>
      <Head kicker={d.kicker} q={d.q} title={d.title} />
      <div className="grid items-center gap-[clamp(32px,4vw,56px)] lg:grid-cols-[minmax(0,1.45fr)_minmax(0,.55fr)] lg:items-end">
        <Browser className="rv" src="report-summary.jpg" alt={m.alt.report} sizes="(max-width: 1000px) 100vw, 1000px" caption={d.caption} />
        <ol data-batch className="m-0 grid list-none p-0">
          {d.steps.map((s, i) => { const last = i === d.steps.length - 1; return (
            <li key={s.title} className={cn(
              'rv relative grid grid-cols-[44px_1fr] gap-x-4 pb-6.5 before:absolute before:top-11 before:bottom-0 before:left-5.25 before:border-l before:border-qf-line',
              // out of the last step the line turns from magenta to the data industry's purple
              last && 'before:w-px before:border-l-0 before:bg-linear-to-b/srgb before:from-qf-line before:to-acc'
            )}>
              <b className={cn('row-span-2 grid size-11 place-items-center rounded-full border border-qf-line font-mono text-label text-qf-ink', last && 'border-qf bg-qf text-on-acc')}>{String(i + 1).padStart(2, '0')}</b>
              <h4 className="m-0 mt-2.5 text-title-xs font-semibold">{s.title}</h4>
              <p className="m-0 mt-1.5 text-body-sm leading-copy text-fg-2">{s.body}</p>
            </li>
          ); })}
          {/* and the answer runs on: the next step is the data industry, on its own page */}
          <li className="rv relative grid grid-cols-[44px_1fr] gap-x-4">
            <span className="row-span-2 grid size-11 place-items-center rounded-full border border-acc bg-acc text-on-acc"><Icon d={NEXT} className="size-5" /></span>
            <h4 className="m-0 mt-2.5 text-title-xs font-semibold"><a href="/data" className="text-acc-ink transition-colors duration-300 hover:text-fg">{f.label} →</a></h4>
            <p className="m-0 mt-1.5 text-body-sm leading-copy text-fg-2">{lines(f.bridge)}</p>
          </li>
        </ol>
      </div>
    </div>
  );
}

/** the foot of every page: just the launch date */
export function Launch() {
  const m = useT().qf;
  return (
    <footer id="launch" className="relative isolate overflow-hidden border-t border-line bg-bg-2 py-section">
      <div aria-hidden="true" className="absolute inset-0 -z-1 bg-[radial-gradient(var(--color-deco)_1.2px,transparent_1.2px)] bg-size-[22px_22px] mask-[linear-gradient(90deg,transparent,#000)]" />
      <div className="wrap flex flex-wrap items-end justify-between gap-6">
        <div className="grid gap-3">
          <span className="mono flex items-center gap-3 text-mute before:h-0.5 before:w-6 before:rounded-full before:bg-qf">{m.launch}</span>
          <time dateTime="2026-06-01" className="num font-display text-stat leading-display font-extrabold text-qf-ink">2026.06.01</time>
        </div>
        <p aria-hidden="true" className="m-0 font-display text-wordmark leading-display font-extrabold text-transparent select-none [-webkit-text-stroke:1.5px_var(--qf-line)] max-sm:hidden">Q.A.C-Flow</p>
      </div>
    </footer>
  );
}
