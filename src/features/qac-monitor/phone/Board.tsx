// Status board, phone: the day's six figures in a row, then every line as a row of its five
// self-inspection slots, each with its patrol slot as a strip beneath.
import { useT } from '../../../i18n';
import { cn } from '../../../lib/cn';
import { LATE, LINES, QUEUED, SELF_COUNTS, SLOTS, type Patrol } from '../data';
import { useTr } from '../tr';
import { Glyph } from '../Glyph';
import { CARD, KPI_TONE, PILL, SELF_CELL, SELF_GLYPH } from '../parts';

/** a patrol slot as a strip of colour, by state */
const PATROL_STRIP: Record<Patrol, string> = { done: 'bg-m-done', run: 'bg-m-run', queue: 'bg-m-rov/50', reject: 'bg-m-ng', none: 'bg-m-idle' };

/** `onOpen` opens a line's inspection (its index into LINES) */
export function PhoneBoard({ onOpen }: { onOpen: (line: number) => void }) {
  const c = useT().monitor, tr = useTr();
  /** label, figure, its colour */
  const figures = [...SELF_COUNTS.map((v, i) => [c.kpi[i], v, KPI_TONE[i]] as const), [c.kpi[4], LATE, 'text-m-miss'] as const, [c.queue, QUEUED[0] + QUEUED[1] + QUEUED[2], 'text-m-rov'] as const];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className={cn(CARD, 'grid flex-none grid-cols-6 divide-x divide-m-line py-2.5')}>
        {figures.map(([label, v, tone]) => (
          <span key={label} className="grid content-between justify-items-center px-1">
            <span className="text-center text-m-2xs leading-tight text-m-fg2">{label}</span>
            <b className={cn('text-m-2xl leading-tight font-semibold tracking-heading tabular-nums', tone)}>{v}</b>
          </span>
        ))}
      </div>
      <section className={cn(CARD, 'flex min-h-0 flex-1 flex-col px-4 pt-3 pb-1')}>
        <h4 className="m-0 flex flex-none items-center gap-2 text-m-lg font-semibold">
          {c.progress}
          <span className="ml-auto text-m-2xs font-medium tracking-caption text-m-fg2">{c.self} · <span className="text-m-rov">{c.patrol}</span></span>
        </h4>
        <ol className="m-0 flex min-h-0 flex-1 list-none flex-col p-0">
          {LINES.map((l, i) => (
            <li key={l.no} className="flex flex-1 border-b border-m-line last:border-0">
              <button type="button" onClick={() => onOpen(i)} className="-mx-2 grid w-full cursor-pointer content-center gap-1 rounded-lg px-2 text-left active:bg-m-idle">
                <span className="flex items-center gap-2 text-m-sm">
                  <b className="font-semibold">{c.line(l.no)}</b>
                  <span className="min-w-0 truncate text-m-fg2">{tr(l.product)}</span>
                  <span className="ml-auto" />
                  {l.late ? <span className={cn(PILL, 'bg-m-warn px-2 text-m-2xs text-m-on-warn')}><Glyph n="warn" className="size-2.5" />{c.late(l.late)}</span>
                    : l.due && <span className={cn(PILL, 'bg-m-idle px-2 text-m-2xs font-medium text-m-fg2')}>{c.due(...l.due)}</span>}
                </span>
                <span className="grid grid-cols-5 gap-1">
                  {l.self.map(([s, late], k) => {
                    const glyph = SELF_GLYPH[s];
                    return (
                      <span key={k} className="grid gap-0.5">
                        <span className={cn('flex h-5.5 items-center justify-center gap-1 rounded-md text-m-2xs leading-none font-semibold tabular-nums', SELF_CELL[s], late && 'ring-2 ring-inset ring-m-late')}>
                          {glyph && <Glyph n={glyph} className="size-2.5" />}{SLOTS[k]}
                        </span>
                        <i className={cn('h-0.75 rounded-full', PATROL_STRIP[l.patrol[k]?.[0] ?? 'none'])} />
                      </span>
                    );
                  })}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
