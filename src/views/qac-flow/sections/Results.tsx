import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Head } from '../parts';

/** One inspection round of a part with five measuring points, before and after QAC FLOW, in seconds, as
 * measured in our own plant (콱플로우_소모시간_비교.xlsx): 12분 30초 and 5분, so 60% saved. */
const BEFORE = 750, AFTER = 300;
const SAVED = Math.round((1 - AFTER / BEFORE) * 100);

/** 도입 효과: three figures in a row, large, each over what it measures, and where they were measured */
export function Results() {
  const p = useT().qf.problem;
  const long = p.totals[1];
  const figures = [
    { value: `${SAVED}%`, label: p.cut },
    { value: `${p.time(BEFORE)} → ${p.time(AFTER)}`, label: p.chart },
    { value: `${long.from} → ${long.to}`, label: `${p.totalsLabel} · ${long.item}` }
  ];
  return (
    <Band id="qf-results">
      <Head kicker={p.kicker} title={p.title} />
      <dl data-batch className="m-0 grid gap-x-12 gap-y-10 md:grid-cols-3">
        {figures.map((x, i) => (
          <div key={x.label} className="rv grid content-start gap-3 border-t border-line pt-7">
            <dt className="text-body leading-snug text-fg-2">{x.label}</dt>
            <dd className={'num order-first m-0 flex min-h-[clamp(3.5rem,6vw,5rem)] items-end ' + (i === 0
              ? 'font-display text-[clamp(3.5rem,6vw,5rem)] leading-none font-extrabold tracking-tight text-qf-ink'
              : 'font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-tight font-bold tracking-tight')}>{x.value}</dd>
          </div>
        ))}
      </dl>
      <p className="m-0 mt-8 text-caption text-mute">{p.note}</p>
    </Band>
  );
}
