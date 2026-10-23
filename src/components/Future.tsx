// The data industry page, following the homepage plan: the vision (inspection data in, a data business
// out), why us (the six kinds of data Q.A.C-Flow gathers every day), the value chain in five steps, the
// 2026–2029 roadmap with where we are lit, what the data is worth, and the partnership the page ends on.
// Q.A.C-Flow, the system whose inspection data all of it is built on, leads here: its last block's steps
// end in a step that links to this page (src/components/QacFlow.tsx), and Why us links back.
import type { ReactNode } from 'react';
import { lines, rich, useT } from '../i18n';
import { pad2 } from '../lib/env';
import { Band, H2, Lead, LineIcon, cn } from './ui';

// the story: data in, verified data, data out
const STORY = [
  'M4 8h3l2-3h6l2 3h3v11H4z M12 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',                              // camera: Q.A.C-Flow
  'M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z M8.5 12l2.5 2.5 4.5-5',                      // shield: verified data
  'M4 4v16h16 M7 15l4-4 3 3 5-6'                                                                   // chart: data industry
];
// the six kinds of data, in the order of the copy
const DATA = [
  'M3 17L17 3l4 4L7 21z M7 13l2 2M10 10l2 2M13 7l2 2',                                             // ruler: measurements
  'M4 8h3l2-3h6l2 3h3v11H4z M12 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',                              // camera: photos
  'M12 3l9 5-9 5-9-5z M3 13l9 5 9-5',                                                              // layers: context
  'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12l3 3 5-6',                                          // check: verdicts
  'M3 12a9 9 0 1 0 3-6.7 M3 4v5h5 M12 7v5l3 2',                                                    // history: actions
  'M6 3h9l4 4v14H6z M14 3v5h5 M9 14l2 2 4-4'                                                       // signed sheet: approvals
];
// the value chain's five steps (the roadmap's four stages are the last four)
const CHAIN = [
  'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3', // data
  'M9 3h6 M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3 M7.5 15h9',         // flask: internal PoC
  'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20a6.5 6.5 0 0 1 13 0 M16 4.3a3.5 3.5 0 0 1 0 6.4 M18 14.2a6.5 6.5 0 0 1 3.5 5.8', // people: external PoC
  'M7 18h10.5a4 4 0 0 0 .6-8A6 6 0 0 0 6.6 9.2 4.5 4.5 0 0 0 7 18z',                              // cloud: SaaS
  'M4 4v16h16 M7 15l4-4 3 3 5-6'                                                                   // chart: data business
];
// what the data is worth
const ASSET = [
  'M13 2L4 14h7l-1 8 9-12h-7z',                                                                    // bolt: defect prediction
  'M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1 M15 4v4M9 10v4M17 16v4',                           // sliders: process tuning
  'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M14.8 9.4c-.5-.9-1.5-1.4-2.8-1.4-1.6 0-2.8.8-2.8 2s1.2 1.6 2.8 2 2.8.8 2.8 2-1.2 2-2.8 2c-1.3 0-2.3-.5-2.8-1.4 M12 6.5V8M12 16v1.5', // coin: data credits
  'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20a6.5 6.5 0 0 1 13 0 M16 4.3a3.5 3.5 0 0 1 0 6.4 M18 14.2a6.5 6.5 0 0 1 3.5 5.8' // people: closing the gap
];
const ARROW = 'M5 12h14m-5-5l5 5-5 5';
const CHECK = 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M8 12l3 3 5-6';

/** emphasis inside the copy: the accent */
const em = (chunk: string) => <span className="text-acc-ink">{chunk}</span>;

/** a chapter's kicker ("02 / Why us", a green tick before it) and its headline */
function Head({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-sec-head">
      <p className="rv mono m-0 mb-5.5 flex items-center gap-3 text-qf-ink before:h-0.5 before:w-6 before:rounded-full before:bg-qf">{kicker}</p>
      <H2 className="rv">{title}</H2>
      {children}
    </div>
  );
}

export function Future() {
  const m = useT().future;
  return (
    // every chapter of the plan gets a band of its own
    <div id="future" role="region" aria-label={m.label}>
      {/* 01 the vision, and the story in three cards: data in → verified data → data out */}
      <Band id="future-hero" cover>
        <div className="mb-sec-head">
          <p className="rv mono m-0 mb-5.5 flex items-center gap-3 text-qf-ink before:h-0.5 before:w-6 before:rounded-full before:bg-qf">01 / {m.eyebrow}</p>
          <h1 className="rv m-0 font-display text-h2-lg leading-h2 font-extrabold tracking-tight text-balance">
            {m.title.split('\n').map((line, i) => <span key={i} className="block">{rich(line, { k: em })}</span>)}
          </h1>
          <Lead className="rv mt-6">{m.lead}</Lead>
        </div>
        <ol data-batch aria-label={m.storyLabel} className="m-0 grid list-none grid-cols-3 gap-4.5 p-0 max-md:grid-cols-1 spanned:gap-x-hinge">
          {m.story.map((s, i) => { const out = i === m.story.length - 1; return (
            <li key={s.tag} className={cn('rv relative grid content-start gap-3 rounded-card border p-panel-pad',
              out ? 'border-qf bg-qf text-on-acc' : i === 0 ? 'border-qf-line bg-qf-soft' : 'border-line bg-card')}>
              <div className="flex items-center justify-between">
                <span className={cn('mono text-tag', out ? 'text-on-acc/70' : 'text-mute')}>{s.tag}</span>
                <LineIcon d={STORY[i]} className={cn('size-6', out ? 'text-on-acc' : 'text-qf-ink')} />
              </div>
              <h2 className="m-0 text-title leading-tight font-semibold">{s.title}</h2>
              <p className={cn('m-0 text-body-sm leading-copy', out ? 'text-on-acc/80' : 'text-fg-2')}>{s.body}</p>
              {/* the arrow to the next card, in the gap (below each other on a phone, it points down) */}
              {!out && <span aria-hidden="true" className="absolute top-1/2 -right-3.75 z-1 grid size-6 -translate-y-1/2 place-items-center rounded-full border border-line-2 bg-bg text-mute max-md:top-auto max-md:-bottom-3.75 max-md:left-1/2 max-md:right-auto max-md:translate-y-0 max-md:-translate-x-1/2 max-md:rotate-90">
                <LineIcon d={ARROW} className="size-3.5" />
              </span>}
            </li>
          ); })}
        </ol>
      </Band>

      {/* 02 why us: the six kinds of data Q.A.C-Flow gathers, and what that makes them */}
      <Band id="future-why" alt mark="02">
        <Head kicker={m.why.kicker} title={m.why.title}>
          <a href="/qac-flow" className="rv mt-5 inline-flex items-center gap-2 text-body text-qf-ink transition-colors duration-300 hover:text-fg">
            {m.why.from}<LineIcon d={ARROW} className="size-4" />
          </a>
        </Head>
        <ul data-batch className="m-0 grid list-none grid-cols-3 gap-4.5 p-0 max-lg:grid-cols-2 max-sm:grid-cols-1 spanned:gap-x-hinge">
          {m.why.items.map((d, i) => (
            <li key={d.title} className="rv grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-0.5 rounded-card border border-line bg-card p-5.5">
              <LineIcon d={DATA[i]} className="row-span-2 size-11 rounded-full border border-qf-line p-2.5 text-qf-ink" />
              <b className="text-title-xs leading-tight font-semibold">{d.title}</b>
              <span className="text-small text-mute">{d.sub}</span>
            </li>
          ))}
        </ul>
        <p className="rv m-0 mt-8 flex items-center gap-3 text-body-lg font-medium">
          <LineIcon d={CHECK} className="size-6 flex-none text-qf-ink" />
          <span>{rich(m.why.note, { k: em })}</span>
        </p>
      </Band>

      {/* 03 the value chain: one row with arrows from 1200px, then fewer a row */}
      <Band id="future-chain" mark="03">
        <Head kicker={m.chain.kicker} title={m.chain.title} />
        <ol data-batch className="m-0 grid list-none grid-cols-5 gap-x-8 gap-y-6 rounded-card border border-line bg-card p-panel-pad max-lg:grid-cols-3 max-lg:gap-x-5 max-sm:grid-cols-2 spanned:gap-x-hinge">
          {m.chain.steps.map((c, i) => (
            <li key={c.title} className="rv relative grid grid-cols-[auto_minmax(0,1fr)] content-center items-center gap-x-3 gap-y-0.5">
              <LineIcon d={CHAIN[i]} className={cn('row-span-2 size-10 flex-none rounded-full border p-2.25',
                i === 0 ? 'border-qf bg-qf text-on-acc' : 'border-qf-line text-qf-ink')} />
              <b className="text-body leading-tight font-semibold">{c.title}</b>
              <span className="text-caption leading-caption text-mute">
                {c.sub}
                {/* data capture is Q.A.C-Flow's: its name after the sub-line */}
                {i === 0 && <> <span className="mono inline-block rounded-full border border-qf-line px-1.5 py-px align-[.1em] text-tag leading-normal text-qf-ink">Q.A.C-Flow</span></>}
              </span>
              {i < m.chain.steps.length - 1 && <LineIcon d={ARROW} className="absolute top-1/2 -right-7 size-4 -translate-y-1/2 text-mute max-lg:hidden" />}
            </li>
          ))}
        </ol>
      </Band>

      {/* 04 the roadmap: four stages, the current one lit, and the proof that it is under way */}
      <Band id="future-roadmap" alt mark="04">
        <Head kicker={m.roadmap.kicker} title={m.roadmap.title} />
        <ol data-batch className="m-0 grid list-none grid-cols-4 gap-4.5 p-0 max-lg:grid-cols-2 max-sm:grid-cols-1 spanned:gap-x-hinge">
          {m.roadmap.stages.map((s, i) => { const now = i === 0; return (
            <li key={s.year} className={cn(
              'rv relative grid content-start gap-4.5 rounded-card border border-t-2 bg-card p-panel-pad',
              now ? 'border-line border-t-acc bg-linear-to-b/srgb from-acc-glow to-transparent to-45%' : 'border-line border-t-line-2'
            )}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className={cn('num font-display text-milestone leading-none font-extrabold', now ? 'text-acc-ink' : 'text-fg-2')}>{s.year}</b>
                {now && <span className="mono rounded-full bg-acc px-3 py-1.5 text-tag text-on-acc">{m.roadmap.here}</span>}
              </div>
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3">
                <LineIcon d={CHAIN[1 + i]} className={cn('size-10 rounded-full border p-2.25', now ? 'border-acc/50 text-acc-ink' : 'border-line-2 text-fg-2')} />
                <h3 className="m-0 text-title leading-tight font-semibold">{s.title}</h3>
              </div>
              <ul className="m-0 grid list-none gap-2 border-t border-line p-0 pt-4 text-body-sm text-fg-2">
                {s.items.map((x, k) => (
                  <li key={x} className="grid grid-cols-[auto_1fr] items-baseline gap-2.5">
                    <span className="mono text-tag text-mute">{pad2(k + 1)}</span>{x}
                  </li>
                ))}
              </ul>
            </li>
          ); })}
        </ol>
        <p className="rv m-0 mt-6 flex items-center gap-3.5 rounded-card border border-qf-line bg-qf-soft px-6 py-4.5 text-body-sm leading-copy text-fg-2">
          <LineIcon d={CHECK} className="size-6 flex-none text-qf-ink" />
          <span>{rich(m.roadmap.proof, { k: chunk => <b className="font-semibold text-fg">{chunk}</b> })}</span>
        </p>
      </Band>

      {/* 05 what the data is worth */}
      <Band id="future-asset" mark="05">
        <Head kicker={m.asset.kicker} title={m.asset.title} />
        <ul data-batch className="m-0 grid list-none grid-cols-4 gap-4.5 p-0 max-lg:grid-cols-2 max-sm:grid-cols-1 spanned:gap-x-hinge">
          {m.asset.items.map((a, i) => (
            <li key={a.title} className="rv grid content-start gap-3 rounded-card border border-line bg-card p-panel-pad">
              <LineIcon d={ASSET[i]} className="size-11 rounded-card bg-qf-soft p-2.5 text-qf-ink" />
              <h3 className="m-0 mt-2 text-title-xs leading-tight font-semibold">{a.title}</h3>
              <p className="m-0 text-body-sm leading-copy text-fg-2">{a.body}</p>
            </li>
          ))}
        </ul>
      </Band>

      {/* 06 the partnership, and the page's one line */}
      <Band id="future-partner" alt className="bg-[radial-gradient(ellipse_45%_70%_at_50%_50%,var(--color-qf-soft),transparent_70%)]">
        <div className="grid justify-items-center text-center">
          <p className="rv mono m-0 mb-5.5 flex items-center gap-3 text-qf-ink before:h-0.5 before:w-6 before:rounded-full before:bg-qf after:h-0.5 after:w-6 after:rounded-full after:bg-qf">{m.partner.kicker}</p>
          <H2 className="rv max-w-240">{m.partner.closing.split('\n').map((line, i) => <span key={i} className="block">{rich(line, { k: em })}</span>)}</H2>
          <p className="rv m-0 mt-8 text-title-xs font-semibold text-fg-2">{lines(m.partner.title)}</p>
          <ul className="rv m-0 mt-4 flex list-none flex-wrap justify-center gap-2.5 p-0">
            {m.partner.tags.map(x => <li key={x} className="mono rounded-full border border-qf-line px-4 py-2 text-tag text-qf-ink">{x}</li>)}
          </ul>
        </div>
      </Band>
    </div>
  );
}
