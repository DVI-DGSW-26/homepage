// Q.A.C-Flow, the smartphone quality inspection system built on DVISION's own line.
// Hero with the figures up front, then problem, how it works, workflow, live monitor, traceability,
// and report → data → roadmap. Magenta (qf-*) is this section's accent only.
//
// The screens come from the in-house deployment. Customer and personal names are masked in the
// image files themselves (public/assets/img/qacflow/), and the phone captures have the status and
// navigation bars cropped off so they sit in the CSS phone frame.
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { lines, useT } from '../i18n';
import { ArrowIcon, Eyebrow, H2, Lead, SEC, Section, btn, cn } from './ui';
import { Img } from './Img';

const IMG = 'assets/img/qacflow/';
const MONITOR = ['measurement-detail', 'status-board', 'defect-actions'] as const;

// line icons, 24×24, drawn with the current colour
const BEFORE_ICONS = ['M4 7h16v10H4z M8 11h8', 'M6 3h9l3 3v15H6z M9 10h6M9 14h6M9 18h3', 'M3 5h18v14H3z M3 10h18M9 5v14M15 5v14'];
const AFTER_ICONS = ['M4 8h3l2-3h6l2 3h3v11H4z M12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z', 'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4 M8 12h8', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12l3 3 5-6', 'M6 3h9l3 3v15H6z M9 13l2 2 4-4'];
const WORKFLOW_ICONS = ['M6 3h9l3 3v15H6z M9 9h6M9 13h6M9 17h4', 'M7 2h10v20H7z M11 18h2 M10 7h4v5h-4z', 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3 M18 3v4h-4M6 21v-4h4', 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z M9 12l2 2 4-4', 'M6 3h9l3 3v15H6z M12 9v7m0 0l-3-3m3 3l3-3'];

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn('fill-none stroke-current stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]', className)}>
      <path d={d} />
    </svg>
  );
}

/** each block opens with the visitor's question, then answers it: a one-line answer, then the detail */
function Head({ kicker, q, title, lead }: { kicker: string; q: string; title: string; lead?: string }) {
  return (
    <div className="mb-stack-sm max-w-208">
      <span className="mono text-qf-ink">{kicker}</span>
      <h3 className="rv m-0 mt-3.5 text-h2 leading-h2 font-semibold tracking-tight text-balance">{q}</h3>
      <p className="rv m-0 mt-5 border-l-2 border-qf pl-4 text-title-lg leading-title font-semibold text-balance">{title}</p>
      {lead && <Lead className="rv mt-3.5 max-w-160 pl-4.5">{lines(lead)}</Lead>}
    </div>
  );
}

/** a phone in a CSS frame; the capture inside is 664×1284 */
function Phone({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <figure className={cn(
      'relative m-0 rounded-[30px] border border-ink-line-2 bg-ink p-1.75 shadow-[0_30px_60px_-30px_rgb(0_0_0/.7)]',
      'before:absolute before:top-3.25 before:left-1/2 before:z-1 before:h-2.25 before:w-[22%] before:-translate-x-1/2 before:rounded-full before:bg-ink',
      className
    )}>
      <Img src={IMG + src} alt={alt} sizes="(max-width: 859px) 60vw, 260px" className="aspect-664/1284 h-auto w-full rounded-[23px] bg-plate" />
    </figure>
  );
}

/** two phones, the front one lower-left over the back one */
function PhonePair({ back, front, className }: { back: [string, string]; front: [string, string]; className?: string }) {
  return (
    <div className={cn('relative mx-auto grid w-full max-w-115 grid-cols-12 items-start', className)}>
      <Phone src={back[0]} alt={back[1]} className="col-[6/13] row-start-1 opacity-92" />
      <Phone src={front[0]} alt={front[1]} className="z-1 col-[1/8] row-start-1 mt-[16%]" />
    </div>
  );
}

/** a browser window around a web screen; no address bar, so no internal URL */
function Browser({ src, alt, sizes, caption, className }: { src: string; alt: string; sizes: string; caption?: ReactNode; className?: string }) {
  return (
    <figure className={cn('m-0 overflow-hidden rounded-[10px] border border-line-2 bg-card', className)}>
      <div aria-hidden="true" className="flex gap-1.5 border-b border-line px-3 py-2.5">{[0, 1, 2].map(i => <i key={i} className="size-2 rounded-full bg-line-2" />)}</div>
      <Img src={IMG + src} alt={alt} sizes={sizes} className="h-auto w-full bg-plate" />
      {caption && <figcaption className="mono border-t border-line px-3.5 py-2.5 text-mute">{caption}</figcaption>}
    </figure>
  );
}

export function QacFlow() {
  const m = useT().qf;
  return (
    <Section id="qac-flow" aria-label={m.label} className={SEC}>
      <div className="wrap">
        <Hero />
        <Problem />
        <How />
        <Workflow />
        <Live />
        <Trace />
        <Data />
      </div>
    </Section>
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
        <div className="rv mt-8 flex flex-wrap gap-3">
          <a href="#contact" className={cn(btn(), 'border-qf bg-qf text-on-acc max-md:flex-[1_1_220px] max-md:justify-center')}><span>{m.demo}</span><ArrowIcon /></a>
          <a href="#contact" className={cn(btn(), 'max-md:flex-[1_1_220px] max-md:justify-center')}><span>{m.poc}</span><ArrowIcon /></a>
        </div>
        <ul className="rv m-0 mt-8 grid list-none grid-cols-3 border-t border-line p-0 md:mt-12">
          {[
            <><small className="text-[.5em] text-fg-2">~</small><span data-count="98">0</span><small className="text-[.5em] text-fg-2">%</small></>,
            <span data-count="0">0</span>,
            <>2026.04<small className="text-[.5em] text-fg-2">~</small></>
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
        <PhonePair back={['ocr-input.jpg', m.alt.ocr]} front={['capture.jpg', m.alt.capture]} />
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
    <div className="mt-stack">
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
  const h = m.how;
  return (
    <div className="mt-stack">
      <Head kicker={h.kicker} q={h.q} title={h.title} lead={h.lead} />
      <Img src={IMG + 'trio.png'} alt={m.alt.trio} sizes="(max-width: 1200px) 100vw, 1200px" className="rv mx-auto h-auto w-full max-w-300" />
      <ol data-batch className="m-0 mx-auto mt-8 grid max-w-300 list-none gap-5.5 p-0 sm:grid-cols-3 sm:gap-[clamp(20px,4vw,64px)]">
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
    <div className="mt-stack">
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
  const l = m.live;
  const [tab, setTab] = useState(0);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const next = e.key === 'ArrowRight' ? (tab + 1) % 3 : e.key === 'ArrowLeft' ? (tab + 2) % 3 : e.key === 'Home' ? 0 : e.key === 'End' ? 2 : -1;
    if (next < 0) return;
    e.preventDefault(); setTab(next);
    document.getElementById(`qf-tab-${next}`)?.focus();
  };
  return (
    <div className="mt-stack">
      <Head kicker={l.kicker} q={l.q} title={l.title} lead={l.lead} />
      <div role="tablist" aria-label={l.tabsAria} className="mono mb-4.5 flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
        {l.tabs.map((label, i) => (
          <button key={label} id={`qf-tab-${i}`} type="button" role="tab" aria-selected={tab === i} aria-controls={`qf-panel-${i}`} tabIndex={tab === i ? 0 : -1}
            onClick={() => setTab(i)} onKeyDown={onKey}
            className={cn('flex-none cursor-pointer rounded-full border px-4 py-2.5 text-label transition-colors duration-300',
              tab === i ? 'border-qf bg-qf text-on-acc' : 'border-line text-fg-2 hover:border-line-2 hover:text-fg')}>{label}</button>
        ))}
      </div>
      {/* the monitor: a CSS bezel, neck and foot; hidden panels don't fetch their screen until opened */}
      <div className={cn(
        'rv relative mb-[calc(clamp(22px,3vw,40px)+14px)] rounded-[clamp(8px,1.2vw,16px)] border border-ink-line-2 bg-ink p-[clamp(6px,1vw,14px)]',
        'before:absolute before:top-full before:left-1/2 before:h-[clamp(22px,3vw,40px)] before:w-[12%] before:-translate-x-1/2 before:bg-ink before:light:bg-ink-mute',
        'after:absolute after:top-[calc(100%+clamp(22px,3vw,40px))] after:left-1/2 after:h-1.5 after:w-[28%] after:-translate-x-1/2 after:rounded-full after:bg-ink-line-2 after:light:bg-ink-mute'
      )}>
        <div className="aspect-1600/876 overflow-hidden rounded-[4px] bg-plate">
          {MONITOR.map((src, i) => (
            <div key={src} role="tabpanel" id={`qf-panel-${i}`} aria-labelledby={`qf-tab-${i}`} hidden={tab !== i} className="size-full">
              <Img src={`${IMG}${src}.jpg`} alt={m.alt.monitor[i]} sizes="(max-width: 1480px) 100vw, 1480px" className="size-full object-cover object-top-left" />
            </div>
          ))}
        </div>
      </div>
      <p className="mono m-0 text-micro text-mute">{l.note}</p>
    </div>
  );
}

function Trace() {
  const m = useT().qf;
  const t = m.trace;
  return (
    <div className="mt-stack">
      <Head kicker={t.kicker} q={t.q} title={t.title} lead={t.lead} />
      <div className="grid items-center gap-stack-sm md:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
        <PhonePair className="rv max-w-105" back={['mobile-compare.jpg', m.alt.compare]} front={['mobile-photo-compare.jpg', m.alt.photos]} />
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
  const m = useT().qf;
  const d = m.data;
  return (
    <div className="mt-stack">
      <Head kicker={d.kicker} q={d.q} title={d.title} />
      <div className="grid items-center gap-[clamp(32px,4vw,56px)] lg:grid-cols-[minmax(0,1.45fr)_minmax(0,.55fr)]">
        <Browser className="rv" src="report-summary.jpg" alt={m.alt.report} sizes="(max-width: 1000px) 100vw, 1000px" caption={d.caption} />
        <ol data-batch className="m-0 grid list-none p-0">
          {d.steps.map((s, i) => { const last = i === d.steps.length - 1; return (
            <li key={s.title} className="rv relative grid grid-cols-[44px_1fr] gap-x-4 pb-6.5 last:pb-0 before:absolute before:top-11 before:bottom-0 before:left-5.25 before:border-l before:border-qf-line last:before:hidden">
              <b className={cn('row-span-2 grid size-11 place-items-center rounded-full border border-qf-line font-mono text-label text-qf-ink', last && 'border-qf bg-qf text-on-acc')}>{String(i + 1).padStart(2, '0')}</b>
              <h4 className="m-0 mt-2.5 text-title-xs font-semibold">{s.title}</h4>
              <p className="m-0 mt-1.5 text-body-sm leading-copy text-fg-2">{s.body}</p>
            </li>
          ); })}
        </ol>
      </div>

      <div className="rv mt-stack-md mb-8 flex flex-wrap items-end justify-between gap-x-5 gap-y-1 border-b border-line-2 pb-3.5 text-mute">
        <h4 className="m-0 text-index font-semibold text-fg">{d.roadmap}</h4>
        <span className="mono">2026 — 2029</span>
      </div>
      <ol data-batch className="m-0 grid list-none p-0 md:grid-cols-4 md:gap-6">
        {d.milestones.map((x, i) => { const now = i === 0; return (
          <li key={x.year} className={cn(
            'rv relative pb-7.5 pl-8.5 last:pb-0 md:pt-7.5 md:pb-0 md:pl-0',
            'before:absolute before:top-3 before:-bottom-3 before:left-1.25 before:border-l before:border-line-2 last:before:hidden',
            'md:before:top-1.25 md:before:-right-6 md:before:bottom-auto md:before:left-3 md:before:border-t md:before:border-l-0 md:last:before:block md:last:before:right-0',
            'after:absolute after:top-1.5 after:left-0 after:size-2.75 after:rounded-full after:border after:border-line-2 after:bg-bg md:after:top-0',
            now && 'after:border-qf after:bg-qf after:shadow-[0_0_0_6px_var(--qf-soft)]'
          )}>
            <b className={cn('block font-display text-milestone leading-none font-extrabold text-fg-2', now && 'text-qf-ink')}>{x.year}</b>
            <h4 className="m-0 mt-2.5 text-title-xs font-semibold">{x.title}</h4>
            <p className="m-0 mt-1 text-small text-fg-2">{x.body}</p>
            {now && <span className="mono mt-3 inline-block rounded-full bg-qf px-3 py-1.5 text-tag text-on-acc">{d.here}</span>}
          </li>
        ); })}
      </ol>
    </div>
  );
}
