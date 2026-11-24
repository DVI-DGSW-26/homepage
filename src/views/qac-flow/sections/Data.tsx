import Link from 'next/link';
import { lines, useLang, useT } from '../../../i18n';
import { pathOf } from '../../../lib/paths';
import { pad2 } from '../../../lib/env';
import { ICON } from '../../../components/icons';
import { Band, LineIcon, PlanTag } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { Head, StepText } from '../parts';

const STEP = 'rv relative grid grid-cols-[44px_1fr] gap-x-4';
const DOT = 'row-span-2 grid size-11 place-items-center rounded-full border';

/** reports → data, whose last step leads on to the data-industry page */
export function Data() {
  const t = useT(), d = t.qf.data, f = t.future, lang = useLang();
  return (
    <Band id="qf-data">
      <Head kicker={d.kicker} q={d.q} title={d.title} />
      {/* the report itself is the block before (Report.tsx); here only where the reports lead */}
      <div className="max-w-160">
        <ol data-batch className="m-0 grid list-none p-0">
          {d.steps.map((s, i) => {
            const last = i === d.steps.length - 1;
            return (
              <li key={s.title} className={cn(STEP, 'pb-6.5 before:absolute before:top-11 before:bottom-0 before:left-5.25 before:border-l before:border-qf-line',
                // out of the last step the line runs on, as a gradient, into the link to the data page
                last && 'before:w-px before:border-l-0 before:bg-linear-to-b/srgb before:from-qf-line before:to-acc')}>
                <b className={cn(DOT, 'border-qf-line font-mono text-label text-qf-ink', last && 'border-qf bg-qf text-on-acc')}>{pad2(i + 1)}</b>
                <StepText title={<>{s.title}{s.plan && <PlanTag>{t.planned}</PlanTag>}</>} body={s.body} className="mt-2.5" />
              </li>
            );
          })}
          {/* and the answer runs on: the next step is the data industry, on its own page */}
          <li className={STEP}>
            <span className={cn(DOT, 'border-acc bg-acc text-on-acc')}><LineIcon d={ICON.arrow} className="size-5" /></span>
            <StepText className="mt-2.5" title={<Link href={pathOf('/data', lang)} className="text-acc-ink transition-colors duration-300 hover:text-fg">{f.label} →</Link>} body={lines(f.bridge)} />
          </li>
        </ol>
      </div>
    </Band>
  );
}
