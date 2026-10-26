import { useT } from '../../../i18n';
import { ICON } from '../../../components/icons';
import { Band, LineIcon } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { Head } from '../parts';

/** the paper way, then Q.A.C-Flow's, step by step in the order of the copy */
const BEFORE = [ICON.gauge, ICON.paper, ICON.spreadsheet];
const AFTER = [ICON.camera, ICON.scan, ICON.checkCircle, ICON.docCheck];

/** a chain of steps joined by a line: dashed and quiet for the paper way, green for Q.A.C-Flow */
function Flow({ labels, icons, after }: { labels: readonly string[]; icons: string[]; after?: boolean }) {
  return (
    <ol className="m-0 grid list-none gap-3 p-0">
      {labels.map((label, i) => (
        <li key={label} className={cn(
          'relative flex items-center gap-3.5',
          'not-first:before:absolute not-first:before:-top-3 not-first:before:left-4.75 not-first:before:h-3 not-first:before:border-l',
          after ? 'font-semibold text-fg not-first:before:border-qf-line' : 'text-fg-2 not-first:before:border-dashed not-first:before:border-line-2'
        )}>
          <LineIcon d={icons[i]} className={cn('size-10 flex-none rounded-full border p-2.25', after ? 'border-qf-line text-qf-ink' : 'border-line-2')} />
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}

/** why paper fails: the same reading written twice, beside the way Q.A.C-Flow takes it once */
export function Problem() {
  const p = useT().qf.problem;
  return (
    <Band id="qf-problem" alt mark="01">
      <Head kicker={p.kicker} q={p.q} title={p.title} />
      <div data-batch className="grid gap-4 md:grid-cols-2 md:gap-6">
        <article className="rv grid content-start gap-6.5 rounded-card border border-dashed border-line-2 p-panel-pad text-fg-2">
          <span className="mono justify-self-start rounded-full border border-line-2 px-3 py-1.5 text-micro">{p.before}</span>
          <Flow labels={p.beforeSteps} icons={BEFORE} />
          <ul className="m-0 grid list-none gap-2 border-t border-line p-0 pt-5 text-body-sm">
            {p.pains.map(x => <li key={x} className="relative pl-5.5 before:absolute before:top-[.82em] before:left-0 before:h-px before:w-2.5 before:bg-fg-2">{x}</li>)}
          </ul>
        </article>
        <article className="rv grid content-start gap-6.5 rounded-card border border-qf-line bg-linear-160 from-qf-soft to-transparent to-70% p-panel-pad">
          <span className="mono justify-self-start rounded-full border border-qf bg-qf px-3 py-1.5 text-micro text-on-acc">{p.after}</span>
          <Flow labels={p.afterSteps} icons={AFTER} after />
        </article>
      </div>
    </Band>
  );
}
