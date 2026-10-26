// Inspection detail, phone: the picked inspection's head with a pager through the ones in progress
// (the monitor's sidebar), then its items, each value over its tolerance bar.
import { useT } from '../../../i18n';
import { cn } from '../../../lib/cn';
import { LINES, QUEUE, SLOTS, digits, specOf, verdictOf } from '../data';
import { useTr } from '../tr';
import { Tolerance } from '../Tolerance';
import { Avatar, CARD, COUNT, PILL, Pager, VERDICT } from '../parts';

const STAT = 'flex items-center gap-1.5 text-m-xs font-medium tracking-caption whitespace-nowrap text-m-fg2';

/** `picked` is the inspection showing (an index into QUEUE) */
export function PhoneDetail({ picked, onPick }: { picked: number; onPick: (i: number) => void }) {
  const c = useT().monitor, tr = useTr();
  const l = LINES[QUEUE[picked]];
  const run = l.self.findIndex(s => s[0] === 'run');
  const verdicts = l.items.map((x, i) => verdictOf(l.values[i], x));
  const ng = verdicts.filter(v => v === 'ng').length;
  return (
    <div className="flex h-full flex-col gap-3">
      <section className={cn(CARD, 'flex-none px-4 py-3')}>
        <div className="flex items-center gap-2">
          <h4 className="m-0 flex min-w-0 items-center gap-2 text-m-xl leading-tight font-bold tracking-heading-sm">
            <span className="truncate">{tr(l.product)}</span>
            {run >= 0 && <span className={cn(PILL, 'bg-m-run px-2 tracking-normal text-white tabular-nums')}>{SLOTS[run]}</span>}
          </h4>
          <span className="ml-auto flex-none"><Pager page={picked} pages={QUEUE.length} onPage={onPick} /></span>
        </div>
        <p className="m-0 mt-1 flex items-center gap-2 text-m-xs text-m-fg2">
          <span className="rounded-md bg-m-brand/14 px-1.5 text-m-2xs leading-5 font-semibold text-m-brand">{c.stages[l.stage]}</span>
          {c.line(l.no)}<span className="h-3 w-px bg-m-line" /><Avatar name={tr(l.operator)} /><span className="text-m-fg">{tr(l.operator)}</span>· {c.refreshed(l.ago)}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-m-line pt-2.5">
          <span className={STAT}>{c.visual}
            <b className={cn(PILL, 'px-2', l.visual ? VERDICT[l.visual] : 'bg-m-idle text-m-mute')}>{l.visual ? l.visual.toUpperCase() : '—'}</b>
          </span>
          <span className={STAT}>{c.defectItems}
            <b className={cn('text-m-xl leading-none font-semibold tabular-nums', ng ? 'text-m-ng' : 'text-m-fg')}>{ng}</b>
          </span>
          <span className={STAT}>{c.measured}
            <b className="text-m-xl leading-none font-semibold text-m-fg tabular-nums">{l.values.length}<span className="text-m-xs font-normal text-m-mute">/{l.items.length}</span></b>
          </span>
          <span className="h-1.5 min-w-16 flex-1 overflow-hidden rounded-full bg-m-idle"><span className="block h-full rounded-full bg-m-brand transition-[width] duration-500 ease-m-spring" style={{ width: `${100 * l.values.length / l.items.length}%` }} /></span>
        </div>
      </section>
      <section className={cn(CARD, 'flex min-h-0 flex-1 flex-col px-4 pt-3 pb-1')}>
        <h4 className="m-0 flex flex-none items-center gap-2 text-m-lg font-semibold">{c.items}<span className={COUNT}>{l.items.length}</span></h4>
        <ol className="m-0 flex min-h-0 flex-1 list-none flex-col p-0">
          {l.items.map((x, i) => {
            const v = l.values[i], r = verdicts[i], num = typeof v === 'number' ? v : undefined;
            return (
              <li key={i} className="grid max-h-16 flex-1 grid-cols-[1fr_auto] content-center items-center gap-x-3 gap-y-1 border-b border-m-line last:border-0">
                <span className="min-w-0">
                  <b className="mr-2 text-m-base font-semibold">{tr(x.name)}</b>
                  <span className="text-m-2xs font-medium tracking-caption whitespace-nowrap text-m-fg2 tabular-nums">{specOf(x) ?? c.judgeSpec}</span>
                </span>
                <span className="flex items-center gap-2.5">
                  {num != null ? <b className={cn('text-m-lg leading-none font-semibold tracking-heading tabular-nums', r === 'ng' && 'text-m-ng')}>{num.toFixed(digits(x, num))}</b>
                    : <span className="text-m-base text-m-mute">{typeof v === 'string' ? v.toUpperCase() : '—'}</span>}
                  {r ? <b className={cn(PILL, 'min-w-11 justify-center', VERDICT[r])}>{r.toUpperCase()}</b>
                    : <span className={cn(PILL, 'min-w-11 justify-center bg-m-idle font-medium text-m-fg2')}>{c.pending}</span>}
                </span>
                {x.nom != null && <Tolerance className="col-span-2 h-1.5" lo={x.nom - x.lo!} hi={x.nom + x.up!} nom={x.nom} value={num} />}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
