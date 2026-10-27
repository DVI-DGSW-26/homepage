// Inspection detail: the in-progress inspections in a sidebar, and the picked one's measured items,
// each value against its tolerance band.
import { useState } from 'react';
import { Play } from 'lucide-react';
import { useT } from '../../../i18n';
import { useInterval } from '../../../lib/useInterval';
import { cn } from '../../../lib/cn';
import { LINES, QUEUE, SLOTS, digits, specOf, verdictOf } from '../data';
import { useTr } from '../tr';
import { Tolerance } from '../Tolerance';
import { Avatar, Badge, Card, Count, HEAD, Meter, Pager, SUB, VERDICT } from '../parts';

/** the item table's columns: no., item, spec, value, tolerance bar, verdict */
const COLS = 'grid-cols-[44px_220px_150px_130px_1fr_84px]';
/** a figure in the inspection's head: its label above, the figure or badge below */
const STAT = 'grid content-start gap-1.5 text-m-label font-medium text-m-fg2';

/** `picked` is the inspection showing (an index into QUEUE) */
export function Detail({ picked, onPick }: { picked: number; onPick: (i: number) => void }) {
  const c = useT().monitor, tr = useTr();
  const [auto, setAuto] = useState(false);
  useInterval(auto, () => onPick((picked + 1) % QUEUE.length), 6000);
  const l = LINES[QUEUE[picked]];
  const run = l.self.findIndex(s => s[0] === 'run');
  const verdicts = l.items.map((x, i) => verdictOf(l.values[i], x));
  const ng = verdicts.filter(v => v === 'ng').length;
  return (
    <div className="grid h-full grid-cols-[300px_1fr] gap-3">
      {/* the sidebar: the in-progress inspections, the picked one highlighted as a Mac sidebar does */}
      <Card title={c.inProgress} count={QUEUE.length} flush>
        <ol className="m-0 flex min-h-0 flex-1 list-none flex-col gap-0.5 px-2.5 pb-1">
          {QUEUE.map((li, i) => {
            const x = LINES[li], slot = x.self.findIndex(s => s[0] === 'run'), on = picked === i;
            return (
              <li key={li}>
                <button type="button" aria-current={on || undefined} onClick={() => onPick(i)}
                  className={cn('grid w-full cursor-pointer grid-cols-[36px_1fr] items-center gap-2.5 rounded-m-ctl px-2.5 py-1.5 text-left transition-[background-color] duration-150 hover:bg-m-idle active:bg-m-fg/10', on && 'bg-m-brand/14 hover:bg-m-brand/14')}>
                  <span className={cn('grid size-9 place-items-center rounded-full text-m-caption font-semibold transition-colors', on ? 'bg-m-brand text-m-card' : 'bg-m-brand/14 text-m-brand')}>{c.stages[x.stage]}</span>
                  <span className="min-w-0 leading-snug">
                    <span className="flex items-center gap-2 text-m-body font-semibold"><span className="truncate">{tr(x.product)}</span>{slot >= 0 && <span className="flex-none text-m-caption font-medium text-m-fg2 tabular-nums">{SLOTS[slot]}</span>}</span>
                    <span className={cn(SUB, 'block truncate')}>{c.line(x.no)} · {tr(x.operator)} · {c.ago(x.ago)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-none justify-center border-t border-m-line py-1.5">
          <Pager page={picked} pages={QUEUE.length} onPage={onPick} auto={auto} onAuto={() => setAuto(v => !v)} />
        </div>
      </Card>
      <Card flush>
        {/* the inspection's head: what, where and who, then its three figures */}
        <div className="flex flex-none items-center gap-8 border-b border-m-line px-6 py-4">
          <div className="mr-auto grid gap-2">
            <h3 className="m-0 flex items-center gap-3 text-m-figure leading-none font-semibold tracking-heading">{tr(l.product)}
              {run >= 0 && <Badge tone="run">{SLOTS[run]}</Badge>}
              <Badge tone="brand" icon={Play}>{c.running}</Badge>
            </h3>
            <p className="m-0 flex items-center gap-2.5 text-m-body text-m-fg2">{c.line(l.no)}<span className="h-3.5 w-px bg-m-line" /><Avatar name={tr(l.operator)} /><span className="text-m-fg">{tr(l.operator)}</span>· {c.refreshed(l.ago)}</p>
          </div>
          <span className={cn(STAT, 'justify-items-center')}>{c.visual}
            <Badge tone={l.visual ? VERDICT[l.visual] : 'neutral'} className="h-8 px-3.5 text-m-body">{l.visual ? l.visual.toUpperCase() : '—'}</Badge>
          </span>
          <span className={cn(STAT, 'justify-items-center')}>{c.defectItems}
            <b className={cn('text-m-figure leading-8 font-semibold tabular-nums', ng ? 'text-m-ng' : 'text-m-fg')}>{ng}</b>
          </span>
          <span className={cn(STAT, 'w-40')}>{c.measured}
            <span className="flex items-center gap-3">
              <b className="text-m-figure leading-8 font-semibold tracking-heading text-m-fg tabular-nums">{l.values.length}<span className="text-m-body font-normal text-m-mute"> / {l.items.length}</span></b>
              <Meter pct={100 * l.values.length / l.items.length} className="flex-1" />
            </span>
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-6 pt-3 pb-2">
          <h4 className="m-0 flex flex-none items-center gap-2 text-m-title font-semibold tracking-heading-sm">{c.items}<Count n={l.items.length} /></h4>
          <div className={cn('mt-2 grid flex-none border-b border-m-line pb-2', HEAD, COLS)}>
            {c.cols.map((t, i) => <span key={t} className={cn(i === 5 && 'text-right')}>{t}</span>)}
          </div>
          <ol className="m-0 flex min-h-0 flex-1 list-none flex-col p-0">
            {l.items.map((x, i) => {
              const v = l.values[i], r = verdicts[i], num = typeof v === 'number' ? v : undefined;
              return (
                <li key={i} className={cn('relative grid max-h-15.5 min-h-0 flex-1 items-center border-b border-m-line last:border-0', COLS, r === 'ng' && 'before:absolute before:inset-y-1.5 before:-left-3 before:w-0.75 before:rounded-full before:bg-m-ng')}>
                  <span className="grid size-6.5 place-items-center rounded-full bg-m-idle text-m-caption font-medium text-m-fg2 tabular-nums">{i + 1}</span>
                  <b className="text-m-body font-semibold">{tr(x.name)}</b>
                  <span className="text-m-label text-m-fg2 tabular-nums">{specOf(x) ?? c.judgeSpec}</span>
                  <span className="flex items-baseline gap-1.5 leading-none tabular-nums">
                    {num != null ? <>
                      <b className={cn('text-m-value font-semibold tracking-heading', r === 'ng' && 'text-m-ng')}>{num.toFixed(digits(x, num))}</b>
                      <small className={cn('text-m-caption font-medium', r === 'ng' ? 'text-m-ng' : 'text-m-fg2')}>{num >= x.nom! ? '+' : ''}{(num - x.nom!).toFixed(digits(x, num))}</small>
                    </> : <span className="text-m-body text-m-mute">{typeof v === 'string' ? v.toUpperCase() : '—'}</span>}
                  </span>
                  {x.nom == null ? <span className="text-m-label text-m-fg2">{c.judgeHint}</span>
                    : <Tolerance className="mr-6 mb-5 h-3" lo={x.nom - x.lo!} hi={x.nom + x.up!} nom={x.nom} value={num} labels />}
                  <span className="justify-self-end">
                    {r ? <Badge tone={VERDICT[r]}>{r.toUpperCase()}</Badge> : <Badge className="font-medium">{c.pending}</Badge>}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </Card>
    </div>
  );
}
