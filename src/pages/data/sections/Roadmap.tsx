import { rich, useT } from '../../../i18n';
import { pad2 } from '../../../lib/env';
import { ICON } from '../../../components/icons';
import { Band, LineIcon } from '../../../components/ui';
import { cn } from '../../../lib/cn';
import { Head } from '../parts';
import { CHAIN } from './Chain';

/** 04 the roadmap: four stages, the current one lit, and the proof that it is under way */
export function Roadmap() {
  const r = useT().future.roadmap;
  return (
    <Band id="future-roadmap" alt mark="04">
      <Head kicker={r.kicker} title={r.title} />
      <ol data-batch className="m-0 grid list-none grid-cols-4 gap-4.5 p-0 max-lg:grid-cols-2 max-sm:grid-cols-1 spanned:gap-x-hinge">
        {r.stages.map((s, i) => {
          const now = i === 0;
          return (
            <li key={s.year} className={cn(
              'rv relative grid content-start gap-4.5 rounded-card border border-t-2 border-line bg-card p-panel-pad',
              now ? 'border-t-acc bg-linear-to-b/srgb from-acc-glow to-transparent to-45%' : 'border-t-line-2'
            )}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <b className={cn('num font-display text-milestone leading-none font-extrabold', now ? 'text-acc-ink' : 'text-fg-2')}>{s.year}</b>
                {now && <span className="mono rounded-full bg-acc px-3 py-1.5 text-tag text-on-acc">{r.here}</span>}
              </div>
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3">
                <LineIcon d={CHAIN[1 + i]} className={cn('size-10 rounded-full border p-2.25', now ? 'border-acc/50 text-acc-ink' : 'border-line-2 text-fg-2')} />
                <h3 className="m-0 text-title leading-tight font-semibold">{s.title}</h3>
              </div>
              <ul className="m-0 grid list-none gap-2 border-t border-line p-0 pt-4 text-body-sm text-fg-2">
                {s.items.map((x, k) => (
                  <li key={x} className="grid grid-cols-[auto_1fr] items-baseline gap-2.5"><span className="mono text-tag text-mute">{pad2(k + 1)}</span>{x}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
      <p className="rv m-0 mt-6 flex items-center gap-3.5 rounded-card border border-qf-line bg-qf-soft px-6 py-4.5 text-body-sm leading-copy text-fg-2">
        <LineIcon d={ICON.checkCircle} className="size-6 flex-none text-qf-ink" />
        <span>{rich(r.proof, { k: chunk => <b className="font-semibold text-fg">{chunk}</b> })}</span>
      </p>
    </Band>
  );
}
