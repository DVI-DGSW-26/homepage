import { useT } from '../../../i18n';
import { ICON } from '../../../components/icons';
import { Band, LineIcon, cn } from '../../../components/ui';
import { Head, StepText } from '../parts';

/** order, self-inspection, patrol, approval, report */
const ICONS = [ICON.order, ICON.phone, ICON.patrol, ICON.approve, ICON.report];

/** one inspection's five steps: a column joined by a line, a row of five from 1200px */
export function Workflow() {
  const w = useT().qf.workflow;
  return (
    <Band id="qf-workflow" alt mark="03">
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
    </Band>
  );
}
