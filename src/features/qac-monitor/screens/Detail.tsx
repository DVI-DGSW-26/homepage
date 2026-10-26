// Inspection detail: the in-progress inspections in a sidebar, and the picked one's measured items,
// each value against its tolerance band.
import { useState } from 'react';
import { useT } from '../../../i18n';
import { useInterval } from '../../../lib/useInterval';
import { cn } from '../../../lib/cn';
import { LINES, QUEUE, SLOTS, digits, specOf, verdictOf } from '../data';
import { useTr } from '../tr';
import { Glyph } from '../Glyph';
import { Tolerance } from '../Tolerance';
import { Avatar, CARD, COUNT, PILL, Pager, VERDICT } from '../parts';
/** the item table's columns: no., item, spec, value, tolerance bar, verdict */
const COLS = 'grid-cols-[52px_250px_160px_140px_1fr_84px]';
const STAT = 'grid text-m-xs font-medium tracking-caption text-m-fg2';
const BIG = 'text-m-4xl leading-none font-semibold';

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
    <div className="grid h-full grid-cols-[300px_1fr] gap-4">
      {/* the sidebar: the in-progress inspections, the picked one highlighted as a Mac sidebar does */}
      <aside className={cn(CARD, 'flex min-h-0 flex-col p-2.5')}>
        <h3 className="m-0 flex items-center gap-2 px-2.5 pt-1.5 pb-2.5 text-m-base font-semibold">{c.inProgress}<span className={COUNT}>{QUEUE.length}</span></h3>
        <ol className="m-0 flex min-h-0 flex-1 list-none flex-col gap-0.5 p-0">
          {QUEUE.map((li, i) => {
            const x = LINES[li], slot = x.self.findIndex(s => s[0] === 'run'), on = picked === i;
            return (
              <li key={li}>
                <button type="button" aria-current={on || undefined} onClick={() => onPick(i)}
                  className={cn('grid w-full cursor-pointer grid-cols-[40px_1fr] items-center gap-2.5 rounded-lg px-2 py-1.75 text-left transition-[background-color] duration-150 hover:bg-m-idle active:bg-m-fg/10', on && 'bg-m-brand/14 hover:bg-m-brand/14')}>
                  <span className={cn('grid size-9 place-items-center rounded-full text-m-2xs font-semibold tracking-caption transition-colors', on ? 'bg-m-brand text-white' : 'bg-m-brand/14 text-m-brand')}>{c.stages[x.stage]}</span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-m-base font-semibold"><span className="truncate">{tr(x.product)}</span>{slot >= 0 && <span className="flex-none text-m-xs font-medium tracking-caption text-m-fg2 tabular-nums">{SLOTS[slot]}</span>}</span>
                    <span className="block truncate text-m-xs font-medium tracking-caption text-m-fg2">{c.line(x.no)} · {tr(x.operator)} · {c.ago(x.ago)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
        <div className="flex flex-none justify-center border-t border-m-line pt-2">
          <Pager page={picked} pages={QUEUE.length} onPage={onPick} auto={auto} onAuto={() => setAuto(v => !v)} />
        </div>
      </aside>
      <section className={cn(CARD, 'flex min-h-0 flex-col')}>
        <div className="flex flex-none items-end gap-7 border-b border-m-line px-6 pt-4 pb-3.5">
          <div className="mr-auto">
            <h3 className="m-0 flex items-center gap-3 text-m-4xl leading-tight font-bold tracking-heading">{tr(l.product)}
              {run >= 0 && <span className={cn(PILL, 'bg-m-run text-m-sm tracking-normal text-white tabular-nums')}>{SLOTS[run]}</span>}
              <span className={cn(PILL, 'bg-m-brand/14 text-m-sm tracking-normal text-m-brand')}><Glyph n="play" className="size-2.5" />{c.running}</span>
            </h3>
            <p className="m-0 mt-1 flex items-center gap-2.5 text-m-md text-m-fg2">{c.line(l.no)}<span className="h-3.5 w-px bg-m-line" /><Avatar name={tr(l.operator)} /><span className="text-m-fg">{tr(l.operator)}</span>· {c.refreshed(l.ago)}</p>
          </div>
          <span className={cn(STAT, 'justify-items-center gap-1.5')}>{c.visual}
            <b className={cn(PILL, 'text-m-base', l.visual === 'ng' ? 'bg-m-ng-fill text-white' : l.visual ? 'bg-m-ok/14 text-m-ok' : 'bg-m-idle text-m-mute')}>{l.visual ? l.visual.toUpperCase() : '—'}</b>
          </span>
          <span className={cn(STAT, 'justify-items-center gap-0.5')}>{c.defectItems}
            <b className={cn(BIG, 'tabular-nums', ng ? 'text-m-ng' : 'text-m-fg')}>{ng}</b>
          </span>
          <span className={cn(STAT, 'w-38 gap-1')}>{c.measured}
            <span className={cn(BIG, 'tracking-heading text-m-fg tabular-nums')}>{l.values.length}<span className="text-m-lg font-normal text-m-mute"> / {l.items.length}</span></span>
            <span className="mt-1 h-1.5 overflow-hidden rounded-full bg-m-idle"><span className="block h-full rounded-full bg-m-brand transition-[width] duration-500 ease-m-spring" style={{ width: `${100 * l.values.length / l.items.length}%` }} /></span>
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-6 pt-3 pb-3">
          <h4 className="m-0 flex items-center gap-2 text-m-base font-semibold">{c.items}<span className={COUNT}>{l.items.length}</span></h4>
          <div className={cn('mt-2 grid flex-none border-b border-m-line pb-1.5 text-m-xs font-medium tracking-caption text-m-fg2', COLS)}>
            {c.cols.map((t, i) => <span key={t} className={cn(i === 5 && 'text-right')}>{t}</span>)}
          </div>
          <ol className="m-0 flex min-h-0 flex-1 list-none flex-col p-0">
            {l.items.map((x, i) => {
              const v = l.values[i], r = verdicts[i], num = typeof v === 'number' ? v : undefined;
              return (
                <li key={i} className={cn('relative grid max-h-15.5 flex-1 items-center border-b border-m-line last:border-0', COLS, r === 'ng' && 'before:absolute before:inset-y-1.5 before:-left-3 before:w-0.75 before:rounded-full before:bg-m-ng')}>
                  <span className="grid size-6.5 place-items-center rounded-full bg-m-idle text-m-2xs font-medium tracking-caption text-m-fg2 tabular-nums">{i + 1}</span>
                  <b className="text-m-lg font-semibold">{tr(x.name)}</b>
                  <span className="text-m-sm text-m-fg2 tabular-nums">{specOf(x) ?? c.judgeSpec}</span>
                  <span className="leading-none tabular-nums">
                    {num != null ? <>
                      <b className={cn('block text-m-3xl font-semibold tracking-heading', r === 'ng' && 'text-m-ng')}>{num.toFixed(digits(x, num))}</b>
                      <small className={cn('text-m-2xs font-medium tracking-caption', r === 'ng' ? 'text-m-ng' : 'text-m-fg2')}>{num >= x.nom! ? '+' : ''}{(num - x.nom!).toFixed(digits(x, num))}</small>
                    </> : <span className="text-m-mute">{typeof v === 'string' ? v.toUpperCase() : '—'}</span>}
                  </span>
                  {x.nom == null ? <span className="text-m-sm text-m-fg2">{c.judgeHint}</span>
                    : <Tolerance className="mr-6 mb-5 h-3" lo={x.nom - x.lo!} hi={x.nom + x.up!} nom={x.nom} value={num} labels />}
                  <span className="justify-self-end">
                    {r ? <b className={cn(PILL, 'text-m-sm', VERDICT[r])}>{r.toUpperCase()}</b>
                      : <span className={cn(PILL, 'bg-m-idle font-medium text-m-fg2')}>{c.pending}</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}
