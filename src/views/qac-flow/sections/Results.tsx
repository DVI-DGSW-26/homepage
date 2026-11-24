import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { Head } from '../parts';

/**
 * One inspection round of a part with five measuring points, in seconds, before and after QAC FLOW, in the
 * order of the copy's beforeParts / afterParts. Measured in our own plant (콱플로우_소모시간_비교.xlsx):
 * 1 − 300 / 750 = 60% saved.
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
        <span className={cn('text-body-sm font-semibold', after ? 'text-qf-ink' : 'text-fg-2')}>{label}</span>
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
            {p} <span className="num whitespace-nowrap text-mute">{t.time(seconds[i])}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** 도입 효과: the share of an inspection's time saved, large, beside one round before and after as two bars
 * on one scale, and where it was measured */
export function Results() {
  const p = useT().qf.problem;
  return (
    <Band id="qf-results">
      <Head kicker={p.kicker} title={p.title} />
      <div data-batch className="grid gap-5 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)]">
        <div className="rv grid content-center gap-3 rounded-[24px] bg-bg-2 p-8 max-lg:content-start max-sm:p-6">
          <b className="num font-display text-[clamp(4.5rem,9vw,7.5rem)] leading-[.9] font-extrabold tracking-tight text-qf-ink">{SAVED}%</b>
          <span className="text-title font-bold">{p.cut}</span>
        </div>
        <div className="rv grid content-start gap-8 rounded-[24px] bg-bg-2 p-8 max-sm:p-6">
          <h3 className="m-0 text-title-xs font-semibold">{p.chart}</h3>
          <Round label={p.before} parts={p.beforeParts} seconds={BEFORE} total={p.time(BEFORE_TOTAL)} />
          <Round label={p.after} parts={p.afterParts} seconds={AFTER} total={p.time(AFTER_TOTAL)} after />
        </div>
      </div>
      <p className="m-0 mt-6 text-caption text-mute">{p.note}</p>
    </Band>
  );
}
