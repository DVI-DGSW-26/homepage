// Status board, phone: the day's six figures in a strip, then every line as a row under the five
// slot times (given once, at the top), each self-inspection a cell drawn as the monitor's are, with
// its patrol slot as a strip beneath.
import { TriangleAlert } from 'lucide-react';
import { useT } from '../../../i18n';
import { cn } from '../../../lib/cn';
import { LATE, LINES, QUEUED, SELF_COUNTS, SLOTS, type Patrol } from '../data';
import { useTr } from '../tr';
import { Badge, Card, FILLED, LATE_RING, SELF_ICON, SELF_TILE, Stats } from '../parts';

/** a patrol slot as a strip of colour, by state */
const PATROL_STRIP: Record<Patrol, string> = { done: 'bg-m-ok/60', run: 'bg-m-run', queue: 'bg-m-rov/60', reject: 'bg-m-ng', none: 'bg-m-idle' };
const TONES = ['text-m-ok', 'text-m-brand', 'text-m-fg2', ''];
const GRID = 'grid grid-cols-5 gap-1';

/** `onOpen` opens a line's inspection (its index into LINES) */
export function PhoneBoard({ onOpen }: { onOpen: (line: number) => void }) {
  const c = useT().monitor, tr = useTr();
  return (
    <div className="flex h-full flex-col gap-3">
      <Stats compact items={[
        ...SELF_COUNTS.map((v, i) => ({ label: c.kpi[i], value: v, tone: TONES[i] })),
        { label: c.kpi[4], value: LATE, tone: 'text-m-miss' },
        { label: c.queue, value: QUEUED[0] + QUEUED[1] + QUEUED[2], tone: 'text-m-rov' }
      ]} />
      <Card title={c.progress} compact className="flex-1" bodyClassName="pb-1"
        actions={<span className="text-m-caption font-medium text-m-fg2">{c.self} · <span className="text-m-rov">{c.patrol}</span></span>}>
        <div aria-hidden="true" className={cn(GRID, 'flex-none border-b border-m-line pb-1.5 text-center text-m-caption font-medium text-m-fg2 tabular-nums')}>
          {SLOTS.map(t => <span key={t}>{t}</span>)}
        </div>
        <ol className="m-0 flex min-h-0 flex-1 list-none flex-col p-0">
          {LINES.map((l, i) => (
            <li key={l.no} className="flex min-h-0 flex-1 border-b border-m-line last:border-0">
              <button type="button" onClick={() => onOpen(i)} className="-mx-2 grid w-full cursor-pointer content-center gap-1 rounded-m-ctl px-2 text-left active:bg-m-idle">
                <span className="flex min-w-0 items-center gap-2 text-m-label">
                  <b className="flex-none font-semibold">{c.line(l.no)}</b>
                  <span className="min-w-0 truncate text-m-fg2">{tr(l.product)}</span>
                  <span className="ml-auto" />
                  {l.late ? <Badge tone="warn" icon={TriangleAlert} className="h-5 px-2 text-m-caption">{c.late(l.late)}</Badge>
                    : l.due && <Badge className="h-5 px-2 text-m-caption font-medium">{c.due(...l.due)}</Badge>}
                </span>
                <span className={GRID}>
                  {l.self.map(([s, late], k) => {
                    const Icon = SELF_ICON[s];
                    return (
                      <span key={k} className="grid gap-0.5">
                        <span className={cn('grid h-5.5 place-items-center rounded-md border', SELF_TILE[s], late && LATE_RING)}>
                          {Icon && <Icon className={cn('size-3', s === 'run' && FILLED)} strokeWidth={2.75} />}
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
      </Card>
    </div>
  );
}
