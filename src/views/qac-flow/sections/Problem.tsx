import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { Head } from '../parts';

/**
 * One inspection round of a part with five measuring points, in seconds, before and after QAC FLOW, in the
 * order of the copy's beforeParts / afterParts. Measured in our own plant (콱플로우_소모시간_비교.xlsx): the
 * three rounds (initial, mid, final) take three times this, and a ten-point part twice that again — the
 * totals the copy states. The share saved is the same for both: 1 − 300 / 750 = 60%.
 */
const BEFORE = [120, 120, 180, 30, 300];
const AFTER = [120, 180];
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const BEFORE_TOTAL = sum(BEFORE), AFTER_TOTAL = sum(AFTER);
const SAVED = Math.round((1 - AFTER_TOTAL / BEFORE_TOTAL) * 100);

/** One round as a bar on the scale of the paper way's, in segments joined by a 2px gap, each numbered;
 * the steps are spelled out under it (the bar itself is decorative: the list carries the numbers). */
function Round({ label, parts, seconds, total, after }: { label: string; parts: readonly string[]; seconds: number[]; total: string; after?: boolean }) {
  const t = useT().qf.problem;
  return (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <span className={cn('mono text-micro', after ? 'text-qf-ink' : 'text-fg-2')}>{label}</span>
        <b className={cn('num font-display text-title-lg leading-none font-extrabold', after ? 'text-qf-ink' : 'text-fg')}>{total}</b>
      </div>
      <div aria-hidden="true" className="flex gap-0.5" style={{ width: `${(sum(seconds) / BEFORE_TOTAL) * 100}%` }}>
        {seconds.map((s, i) => (
          <span key={i} title={`${parts[i]} · ${t.time(s)}`} style={{ flexGrow: s }}
            className={cn('grid h-11 min-w-5 basis-0 place-items-center rounded-[4px] text-caption font-semibold',
              after ? 'bg-qf text-on-acc' : 'bg-line-2 text-fg')}>{i + 1}</span>
        ))}
      </div>
      <ol className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-caption text-fg-2">
        {parts.map((p, i) => (
          <li key={p} className="inline-flex items-baseline gap-1.5">
            <span className={cn('num grid size-4.5 flex-none place-items-center self-center rounded-full text-[.7rem] font-bold', after ? 'bg-qf text-on-acc' : 'bg-line-2 text-fg')}>{i + 1}</span>
            {p} <span className="num text-mute">{t.time(seconds[i])}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** why paper costs time: the share of an inspection QAC FLOW saves, the totals per part, and one round
 * before and after as two bars on one scale */
export function Problem() {
  const p = useT().qf.problem;
  return (
    <Band id="qf-problem">
      <Head kicker={p.kicker} q={p.q} title={p.title} lead={p.lead} />
      {/* who it is for, and what the paper way costs them: the third is what the time chart below can't show */}
      <p className="rv m-0 mb-5 inline-flex rounded-full border border-qf-line bg-qf-soft/50 px-4 py-2 text-body-sm font-semibold text-qf-ink">{p.audience}</p>
      <ol data-batch className="m-0 mb-10 grid list-none gap-x-6 gap-y-5 p-0 md:grid-cols-3">
        {p.pains.map((x, i) => (
          <li key={x.title} className="rv grid content-start gap-1.5 border-t border-line pt-4">
            <span className="mono text-micro text-mute">{String(i + 1).padStart(2, '0')}</span>
            <b className="text-title-xs font-semibold">{x.title}</b>
            <span className="text-body-sm leading-copy text-fg-2">{x.body}</span>
          </li>
        ))}
      </ol>
      <div data-batch className="grid gap-4 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-6">
        {/* the headline figure, and what it comes to per part */}
        <article className="rv grid content-start gap-6 rounded-card border border-qf-line bg-linear-160 from-qf-soft to-transparent to-70% p-panel-pad">
          <div>
            <b className="num block font-display text-[clamp(4.5rem,11vw,8.5rem)] leading-[.9] font-extrabold text-qf-ink">{SAVED}%</b>
            <span className="mt-2 block text-title leading-snug font-bold text-fg">{p.cut}</span>
          </div>
          <div className="grid gap-3 border-t border-qf-line pt-5">
            <span className="mono text-micro text-fg-2">{p.totalsLabel}</span>
            <dl className="m-0 grid gap-3">
              {p.totals.map(x => (
                <div key={x.item} className="grid gap-1">
                  <dt className="text-caption text-fg-2">{x.item}</dt>
                  <dd className="m-0 flex flex-wrap items-baseline gap-x-2.5 text-body">
                    <s className="text-mute decoration-1">{x.from}</s>
                    <span aria-hidden="true" className="text-mute">→</span>
                    <b className="text-title leading-none font-bold text-fg">{x.to}</b>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </article>

        {/* one round, the paper way and QAC FLOW's, on the same scale */}
        <article className="rv grid content-start gap-8 rounded-card border border-line bg-card/60 p-panel-pad">
          <h4 className="m-0 text-title-xs font-semibold">{p.chart}</h4>
          <Round label={p.before} parts={p.beforeParts} seconds={BEFORE} total={p.time(BEFORE_TOTAL)} />
          <Round label={p.after} parts={p.afterParts} seconds={AFTER} total={p.time(AFTER_TOTAL)} after />
          <p className="mono m-0 border-t border-line pt-4 text-micro text-mute">{p.note}</p>
        </article>
      </div>
    </Band>
  );
}
