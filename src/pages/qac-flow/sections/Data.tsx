import { lines, useT } from '../../../i18n';
import { pad2 } from '../../../lib/env';
import { ICON } from '../../../components/icons';
import { Band, LineIcon } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { Browser, Head, StepText } from '../parts';

const STEP = 'rv relative grid grid-cols-[44px_1fr] gap-x-4';
const DOT = 'row-span-2 grid size-11 place-items-center rounded-full border';

/** report → data, whose last step leads on to the data-industry page */
export function Data() {
  const t = useT(), m = t.qf, d = m.data, f = t.future;
  return (
    <Band id="qf-data" mark="06">
      <Head kicker={d.kicker} q={d.q} title={d.title} />
      <div className="grid items-center gap-split-gap lg:grid-cols-[minmax(0,1.45fr)_minmax(0,.55fr)] lg:items-end">
        <Browser className="rv" src="report-summary.jpg" alt={m.alt.report} sizes="(max-width: 1000px) 100vw, 1000px" caption={d.caption} />
        <ol data-batch className="m-0 grid list-none p-0">
          {d.steps.map((s, i) => {
            const last = i === d.steps.length - 1;
            return (
              <li key={s.title} className={cn(STEP, 'pb-6.5 before:absolute before:top-11 before:bottom-0 before:left-5.25 before:border-l before:border-qf-line',
                // out of the last step the line runs on, as a gradient, into the link to the data page
                last && 'before:w-px before:border-l-0 before:bg-linear-to-b/srgb before:from-qf-line before:to-acc')}>
                <b className={cn(DOT, 'border-qf-line font-mono text-label text-qf-ink', last && 'border-qf bg-qf text-on-acc')}>{pad2(i + 1)}</b>
                <StepText title={s.title} body={s.body} className="mt-2.5" />
              </li>
            );
          })}
          {/* and the answer runs on: the next step is the data industry, on its own page */}
          <li className={STEP}>
            <span className={cn(DOT, 'border-acc bg-acc text-on-acc')}><LineIcon d={ICON.arrow} className="size-5" /></span>
            <StepText className="mt-2.5" title={<a href="/data" className="text-acc-ink transition-colors duration-300 hover:text-fg">{f.label} →</a>} body={lines(f.bridge)} />
          </li>
        </ol>
      </div>
    </Band>
  );
}
