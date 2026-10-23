// Our future: from manufacturing into the data industry. The value chain from the press to a data
// business, the four stages it takes year by year (2026, where we are, is lit), and the aim in one line.
// Q.A.C-Flow, the system whose inspection data the first stages are built on, leads here: its last
// block's steps end in a step that links to this page (src/components/QacFlow.tsx).
import { Fragment } from 'react';
import { rich, useT } from '../i18n';
import { pad2 } from '../lib/env';
import { Band, Eyebrow, H2, IndexHead, LineIcon, cn } from './ui';

// one per link of the chain; the four stages reuse the last four
const ICONS = [
  'M3 20V9l5 3V9l5 3V9l5 3V4h3v16z M7 16h2M12 16h2',                                              // factory
  'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6 M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3', // data
  'M9 3h6 M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3 M7.5 15h9',         // flask: internal PoC
  'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M2.5 20a6.5 6.5 0 0 1 13 0 M16 4.3a3.5 3.5 0 0 1 0 6.4 M18 14.2a6.5 6.5 0 0 1 3.5 5.8', // people: external PoC
  'M7 18h10.5a4 4 0 0 0 .6-8A6 6 0 0 0 6.6 9.2 4.5 4.5 0 0 0 7 18z',                              // cloud: SaaS
  'M4 4v16h16 M7 15l4-4 3 3 5-6'                                                                   // chart: data business
];
const ARROW = 'M5 12h14m-5-5l5 5-5 5';
/** the chain's link that Q.A.C-Flow feeds: real-time data capture */
const FROM_QF = 1;
/** the stages begin at the chain's third link */
const STAGE_AT = 2;

/** emphasis inside the copy: the accent, and on the closing line an underline as well */
const em = (chunk: string) => <span className="text-acc-ink">{chunk}</span>;
const underline = (chunk: string) => <span className="text-acc-ink underline decoration-1 underline-offset-[.28em]">{chunk}</span>;

export function Future() {
  const m = useT().future;
  return (
    // the chain, the roadmap and the closing line each get a band of their own
    <div id="future" role="region" aria-label={m.label}>
      <Band id="future-chain" className="grid min-h-svh content-center">
        <div className="mb-sec-head">
          <Eyebrow className="rv mb-5.5">{m.eyebrow}</Eyebrow>
          <H2 className="rv">{m.title.split('\n').map((line, i) => <span key={i} className="block">{rich(line, { k: em })}</span>)}</H2>
        </div>

        {/* the chain: one row with arrows from 1200px, three a row below that, two on a phone */}
        <ol data-batch aria-label={m.chainLabel}
          className="m-0 grid list-none grid-cols-6 gap-x-8 gap-y-6 rounded-card border border-line bg-card p-panel-pad max-lg:grid-cols-3 max-lg:gap-x-5 max-sm:grid-cols-2 spanned:gap-x-hinge">
          {m.chain.map((c, i) => (
            <li key={c.title} className="rv relative grid grid-cols-[auto_minmax(0,1fr)] content-center items-center gap-x-3 gap-y-0.5">
              <LineIcon d={ICONS[i]} className={cn('row-span-2 size-10 flex-none rounded-full border p-2.25',
                i === FROM_QF ? 'border-qf-line text-qf-ink' : i < STAGE_AT ? 'border-line-2 text-fg-2' : 'border-acc/50 text-acc-ink')} />
              <b className="text-body leading-tight font-semibold">{c.title}</b>
              <span className="text-caption leading-caption text-mute">
                {c.sub}
                {/* data capture is where Q.A.C-Flow comes in: its magenta, and its name, in line after the sub-line
                    (on its own line where the column is too narrow) so it never sits on the title */}
                {i === FROM_QF && <> <span className="mono inline-block rounded-full border border-qf-line px-1.5 py-px align-[.1em] text-tag leading-normal text-qf-ink">Q.A.C-Flow</span></>}
              </span>
              {i < m.chain.length - 1 && <LineIcon d={ARROW} className="absolute top-1/2 -right-7 size-4 -translate-y-1/2 text-mute max-lg:hidden" />}
            </li>
          ))}
        </ol>
      </Band>

      <Band id="future-roadmap" alt>
        <div>
          <IndexHead title={m.roadmap} aside={`${m.stages[0].year} — ${m.stages[m.stages.length - 1].year}`} className="mb-6" />
          {/* four stages, the current one lit; the cards share a top rule like the year rail in About */}
          <ol data-batch className="m-0 grid list-none grid-cols-4 gap-4.5 p-0 max-lg:grid-cols-2 max-sm:grid-cols-1 spanned:gap-x-hinge">
            {m.stages.map((s, i) => { const now = i === 0; return (
              <li key={s.year} className={cn(
                'rv relative grid content-start gap-4.5 rounded-card border border-t-2 bg-card p-panel-pad',
                now ? 'border-line border-t-acc bg-linear-to-b/srgb from-acc-glow to-transparent to-45%' : 'border-line border-t-line-2'
              )}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <b className={cn('num font-display text-milestone leading-none font-extrabold', now ? 'text-acc-ink' : 'text-fg-2')}>{s.year}</b>
                  {now && <span className="mono rounded-full bg-acc px-3 py-1.5 text-tag text-on-acc">{m.here}</span>}
                </div>
                <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-0.5">
                  <LineIcon d={ICONS[STAGE_AT + i]} className={cn('row-span-2 size-10 rounded-full border p-2.25', now ? 'border-acc/50 text-acc-ink' : 'border-line-2 text-fg-2')} />
                  <h3 className="m-0 text-title leading-tight font-semibold">{s.title}</h3>
                  <span className="text-small text-mute">{s.sub}</span>
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
        </div>
      </Band>

      <Band id="future-closing">
        <p className="rv m-0 mx-auto max-w-240 text-center text-h2 leading-h2 font-semibold tracking-tight text-balance">
          <Fragment>“{rich(m.closing, { k: underline })}”</Fragment>
        </p>
      </Band>
    </div>
  );
}
