import { Fragment } from 'react';
import { ChevronRight, Lock, TriangleAlert } from 'lucide-react';
import { useT } from '../../../i18n';
import { ICON } from '../../../components/icons';
import { Band, LineIcon } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { Head, StepText } from '../parts';

/** order, self-inspection, patrol, approval, report */
const ICONS = [ICON.order, ICON.phone, ICON.patrol, ICON.approve, ICON.report];

/** one inspection's five steps: a column joined by a line, a row of five from 1200px; then the rounds
 * underneath them, first-off locking the rest until it is done, and what a fail or rejection does */
export function Workflow() {
  const w = useT().qf.workflow;
  return (
    <Band id="qf-workflow">
      <Head kicker={w.kicker} q={w.q} title={w.title} />
      <ol data-batch className="m-0 grid list-none p-0 lg:grid-cols-5 lg:gap-step-gap">
        {w.steps.map((s, i) => (
          <li key={s.title} className={cn(
            'rv relative grid grid-cols-[52px_1fr] gap-x-4.5 pb-7 last:pb-0',
            'before:absolute before:top-13 before:bottom-0 before:left-6.25 before:border-l before:border-qf-line last:before:hidden',
            // in a row, the line runs from each icon across the gap to the next
            'lg:grid-cols-1 lg:content-start lg:pb-0 lg:before:top-6.5 lg:before:-right-step-gap lg:before:bottom-auto lg:before:left-16 lg:before:border-t lg:before:border-l-0'
          )}>
            <span className={cn('row-span-3 grid size-13 place-items-center rounded-full border border-qf-line bg-bg text-qf-ink lg:row-span-1 lg:mb-5', i === w.steps.length - 1 && 'border-qf bg-qf text-on-acc')}>
              <LineIcon d={ICONS[i]} className="size-6" />
            </span>
            <b className="mono pt-1 text-micro text-mute">{w.step(i + 1)}</b>
            <StepText title={s.title} body={s.body} className="mt-0.5" />
          </li>
        ))}
      </ol>

      <div className="rv mt-stack-sm grid gap-4 rounded-card border border-line bg-card/60 p-panel-pad">
        <h4 className="m-0 text-title-xs font-semibold">{w.rules.title}</h4>
        {/* the rounds in order; between first-off and in-process, the interlock */}
        <ol className="m-0 flex list-none flex-wrap items-stretch gap-2 p-0 max-md:flex-col">
          {w.rules.rounds.map((r, i) => (
            <Fragment key={r.title}>
              {i > 0 && (i === 1
                ? <li aria-label={w.rules.lock} className="flex flex-none items-center justify-center gap-1.5 px-1 text-caption font-semibold text-err max-md:py-1"><Lock aria-hidden="true" className="size-4" />{w.rules.lock}</li>
                : <li aria-hidden="true" className="grid flex-none place-items-center text-mute max-md:rotate-90"><ChevronRight className="size-4" /></li>)}
              <li className={cn('grid min-w-0 flex-1 content-center gap-0.5 rounded-[10px] border px-4 py-3 text-center',
                i === w.rules.rounds.length - 1 ? 'border-qf bg-qf text-on-acc' : i === 3 ? 'border-fg bg-fg text-bg' : 'border-line bg-bg')}>
                <b className="text-body font-semibold">{r.title}</b>
                <span className="text-caption opacity-80">{r.body}</span>
              </li>
            </Fragment>
          ))}
        </ol>
        <p className="m-0 flex items-start gap-2.5 rounded-[10px] bg-err/10 px-4 py-3 text-body-sm leading-copy">
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 flex-none text-err" />
          <span><b className="font-semibold">{w.rules.reject.title}</b> · {w.rules.reject.body}</span>
        </p>
      </div>
    </Band>
  );
}
