// Inspection detail, phone: the picked inspection's head with a pager through the ones in progress
// (the monitor's sidebar), then its items, each value over its tolerance bar.
import { useT } from '../../../i18n';
import { cn } from '../../../lib/cn';
import { LINES, QUEUE, SLOTS, digits, specOf, verdictOf } from '../data';
import { useTr } from '../tr';
import { Tolerance } from '../Tolerance';
import { Avatar, Badge, Card, Meter, Pager, VERDICT } from '../parts';

const STAT = 'flex items-center gap-1.5 text-m-caption font-medium whitespace-nowrap text-m-fg2';

/** `picked` is the inspection showing (an index into QUEUE) */
export function PhoneDetail({ picked, onPick }: { picked: number; onPick: (i: number) => void }) {
  const c = useT().monitor, tr = useTr();
  const l = LINES[QUEUE[picked]];
  const run = l.self.findIndex(s => s[0] === 'run');
  const verdicts = l.items.map((x, i) => verdictOf(l.values[i], x));
  const ng = verdicts.filter(v => v === 'ng').length;
  return (
    <div className="flex h-full flex-col gap-3">
      <Card compact className="flex-none">
        <div className="flex items-center gap-2">
          <h4 className="m-0 flex min-w-0 items-center gap-2 text-m-value leading-tight font-semibold tracking-heading-sm">
            <span className="truncate">{tr(l.product)}</span>
            {run >= 0 && <Badge tone="run">{SLOTS[run]}</Badge>}
          </h4>
          <span className="ml-auto flex-none"><Pager page={picked} pages={QUEUE.length} onPage={onPick} /></span>
        </div>
        <p className="m-0 mt-1 flex items-center gap-2 text-m-label text-m-fg2">
          <Badge tone="brand" className="h-5 rounded-md px-1.5 text-m-caption">{c.stages[l.stage]}</Badge>
          {c.line(l.no)}<span className="h-3 w-px bg-m-line" /><Avatar name={tr(l.operator)} /><span className="text-m-fg">{tr(l.operator)}</span>· {c.refreshed(l.ago)}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-m-line pt-2.5">
          <span className={STAT}>{c.visual}<Badge tone={l.visual ? VERDICT[l.visual] : 'neutral'}>{l.visual ? l.visual.toUpperCase() : '—'}</Badge></span>
          <span className={STAT}>{c.defectItems}<b className={cn('text-m-title leading-none font-semibold tabular-nums', ng ? 'text-m-ng' : 'text-m-fg')}>{ng}</b></span>
          <span className={STAT}>{c.measured}<b className="text-m-title leading-none font-semibold text-m-fg tabular-nums">{l.values.length}<span className="text-m-caption font-normal text-m-mute">/{l.items.length}</span></b></span>
          <Meter pct={100 * l.values.length / l.items.length} className="min-w-16 flex-1" />
        </div>
      </Card>
      <Card title={c.items} count={l.items.length} compact className="flex-1" bodyClassName="pb-1">
        <ol className="m-0 flex min-h-0 flex-1 list-none flex-col p-0">
          {l.items.map((x, i) => {
            const v = l.values[i], r = verdicts[i], num = typeof v === 'number' ? v : undefined;
            return (
              <li key={i} className="grid max-h-16 min-h-0 flex-1 grid-cols-[1fr_auto] content-center items-center gap-x-3 gap-y-1 border-b border-m-line last:border-0">
                <span className="min-w-0">
                  <b className="mr-2 text-m-body font-semibold">{tr(x.name)}</b>
                  <span className="text-m-caption font-medium whitespace-nowrap text-m-fg2 tabular-nums">{specOf(x) ?? c.judgeSpec}</span>
                </span>
                <span className="flex items-center gap-2.5">
                  {num != null ? <b className={cn('text-m-title leading-none font-semibold tracking-heading tabular-nums', r === 'ng' && 'text-m-ng')}>{num.toFixed(digits(x, num))}</b>
                    : <span className="text-m-body text-m-mute">{typeof v === 'string' ? v.toUpperCase() : '—'}</span>}
                  {r ? <Badge tone={VERDICT[r]} className="min-w-11 justify-center">{r.toUpperCase()}</Badge>
                    : <Badge className="min-w-11 justify-center font-medium">{c.pending}</Badge>}
                </span>
                {x.nom != null && <Tolerance className="col-span-2 h-1.5" lo={x.nom - x.lo!} hi={x.nom + x.up!} nom={x.nom} value={num} />}
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}
