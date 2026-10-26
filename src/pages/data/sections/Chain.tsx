import { useT } from '../../../i18n';
import { ICON } from '../../../components/icons';
import { Band, LineIcon } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { Head } from '../parts';

/** the value chain's five steps; the roadmap's four stages are the last four */
export const CHAIN = [ICON.database, ICON.flask, ICON.people, ICON.cloud, ICON.chart];

/** 03 the value chain: one row with arrows from 1200px, then fewer a row */
export function Chain() {
  const c = useT().future.chain;
  return (
    <Band id="future-chain" mark="03">
      <Head kicker={c.kicker} title={c.title} />
      <ol data-batch className="m-0 grid list-none grid-cols-5 gap-x-8 gap-y-6 rounded-card border border-line bg-card p-panel-pad max-lg:grid-cols-3 max-lg:gap-x-5 max-sm:grid-cols-2 spanned:gap-x-hinge">
        {c.steps.map((s, i) => (
          <li key={s.title} className="rv relative grid grid-cols-[auto_minmax(0,1fr)] content-center items-center gap-x-3 gap-y-0.5">
            <LineIcon d={CHAIN[i]} className={cn('row-span-2 size-10 flex-none rounded-full border p-2.25', i === 0 ? 'border-qf bg-qf text-on-acc' : 'border-qf-line text-qf-ink')} />
            <b className="text-body leading-tight font-semibold">{s.title}</b>
            <span className="text-caption leading-caption text-mute">
              {s.sub}
              {/* data capture is Q.A.C-Flow's: its name after the sub-line */}
              {i === 0 && <> <span className="mono inline-block rounded-full border border-qf-line px-1.5 py-px align-[.1em] text-tag leading-normal text-qf-ink">Q.A.C-Flow</span></>}
            </span>
            {i < c.steps.length - 1 && <LineIcon d={ICON.arrow} className="absolute top-1/2 -right-7 size-4 -translate-y-1/2 text-mute max-lg:hidden" />}
          </li>
        ))}
      </ol>
    </Band>
  );
}
