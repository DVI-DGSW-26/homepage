// Status board: the day's figures in a strip, then every line in one table, its five time slots as
// columns, so a slot reads straight down across the lines. A slot's cell is its self-inspection,
// with the patrol-inspection as a line of text beneath. What is going to plan stays quiet (a green
// tint, a check); what needs a hand is solid or ringed (in progress, incomplete, past its time).
import { TriangleAlert } from 'lucide-react';
import { useT } from '../../../i18n';
import { cn } from '../../../lib/cn';
import { LATE, LINES, PATROL, QUEUED, SELF_COUNTS, SLOTS, type Line, type Patrol, type Self } from '../data';
import { useTr } from '../tr';
import { Avatar, Badge, Card, FILLED, HEAD, LATE_RING, Meter, PATROL_ICON, PATROL_TONE, SELF_ICON, SELF_TILE, Stats, SUB } from '../parts';

/** the order of the copy's legendSelf / legendPatrol (legendSelf's last is "late") */
const SELF_ORDER: Self[] = ['done', 'run', 'skip', 'miss', 'ok', 'idle'];
const PATROL_ORDER: Patrol[] = ['done', 'run', 'queue', 'reject'];
/** the table's columns: line, status, the five slots, progress */
const COLS = 'grid-cols-[236px_164px_repeat(5,minmax(0,1fr))_128px] gap-x-2';
const PATROL_DONE = (l: Line) => l.patrol.filter(s => s[0] === 'done').length;

/** `onOpen` opens a line's inspection (its index into LINES) */
export function Board({ onOpen }: { onOpen: (line: number) => void }) {
  const c = useT().monitor;
  const tones = ['text-m-ok', 'text-m-brand', 'text-m-fg2', ''];
  return (
    <div className="flex h-full flex-col gap-3">
      <Stats items={[
        ...SELF_COUNTS.map((v, i) => ({ label: c.kpi[i], value: v, tone: tones[i] })),
        { label: c.kpi[4], value: LATE, unit: c.over[0], tone: 'text-m-miss' },
        { label: c.queue, value: QUEUED[0] + QUEUED[1] + QUEUED[2], tone: 'text-m-rov', sub: <span className="text-m-caption">{c.queueSub.map((t, i) => `${t} ${QUEUED[i]}`).join(' · ')}</span> }
      ]} />
      <Card title={c.progress} flush className="flex-1"
        actions={<span className={cn(SUB, 'flex items-center gap-2')}>{c.dueToday}<Badge><i className="size-1.5 rounded-full bg-m-ok" />{c.dueName} <span className="font-normal">{c.dueLine}</span></Badge></span>}>
        <div aria-hidden="true" className={cn('grid flex-none border-y border-m-line bg-m-idle/40 px-5 py-1.5', HEAD, COLS)}>
          <span>{c.boardCols[0]}</span><span>{c.boardCols[1]}</span>
          {SLOTS.map(t => <span key={t} className="text-center tabular-nums">{t}</span>)}
          <span>{c.boardCols[2]}</span>
        </div>
        <ol className="m-0 flex min-h-0 flex-1 list-none flex-col p-0">
          {LINES.map((l, i) => <Row key={l.no} l={l} onOpen={() => onOpen(i)} />)}
        </ol>
        <Legend />
      </Card>
    </div>
  );
}

/** one line: what it makes and who, where it stands, its slots, how far along; opens its inspection */
function Row({ l, onOpen }: { l: Line; onOpen: () => void }) {
  const c = useT().monitor, tr = useTr();
  const done = l.self.filter(s => s[0] === 'done' || s[0] === 'ok').length;
  const patrol = l.patrol.filter(s => s[0] !== 'none').length;
  return (
    <li className="flex min-h-0 flex-1 border-b border-m-line last:border-0">
      <button type="button" onClick={onOpen}
        className={cn('group grid w-full cursor-pointer items-center px-5 text-left transition-[background-color] duration-150 hover:bg-m-idle/60 active:bg-m-idle', COLS)}>
        <span className="flex min-w-0 items-center gap-2.5">
          <Avatar name={tr(l.operator)} />
          <span className="min-w-0 leading-snug">
            <span className="flex gap-2 text-m-body"><b className="flex-none font-semibold">{c.line(l.no)}</b><span className="truncate transition-colors group-hover:text-m-brand">{tr(l.product)}</span></span>
            <span className={cn(SUB, 'block truncate')}>{tr(l.operator)}</span>
          </span>
        </span>
        <span>
          {l.late ? <Badge tone="warn" icon={TriangleAlert}>{c.late(l.late)}</Badge>
            : l.due && <Badge className="font-medium">{c.due(...l.due)}</Badge>}
        </span>
        {SLOTS.map((_, k) => <Slot key={k} l={l} k={k} />)}
        <span className="grid gap-1">
          <span className="flex items-center gap-2.5"><Meter pct={done * 20} tone="bg-m-ok" className="flex-1" /><b className="text-m-body leading-none font-semibold tabular-nums">{done}<span className="text-m-label font-normal text-m-mute"> / 5</span></b></span>
          <span className="text-m-caption leading-none text-m-rov">{c.patrol} <span className="tabular-nums">{patrol ? `${PATROL_DONE(l)} / ${patrol}` : '–'}</span></span>
        </span>
      </button>
    </li>
  );
}

/** a slot: its self-inspection as a cell (an icon, and a word where it isn't just done), its patrol beneath */
function Slot({ l, k }: { l: Line; k: number }) {
  const c = useT().monitor, tr = useTr();
  const [s, late, note] = l.self[k];
  const [p, by] = l.patrol[k] ?? ['none'];
  const Icon = SELF_ICON[s], PIcon = PATROL_ICON[p];
  const word = note ? tr(note) : s === 'done' || s === 'ok' ? null : s === 'idle' ? (late ? c.legendSelf[6] : null) : c.legendSelf[SELF_ORDER.indexOf(s)];
  return (
    <span className="grid min-w-0 gap-0.5">
      <span title={note ? tr(note) : undefined} className={cn('flex h-6.5 min-w-0 items-center justify-center gap-1.5 rounded-m-ctl border px-2 text-m-label font-semibold', SELF_TILE[s], late && LATE_RING, late && s === 'idle' && 'text-m-late')}>
        {Icon && <Icon className={cn('size-3.5 flex-none', s === 'run' && FILLED)} strokeWidth={2.5} />}
        {word && <span className="truncate">{word}</span>}
      </span>
      <span className={cn('flex h-3.5 min-w-0 items-center justify-center gap-1 text-m-caption leading-none font-medium', PATROL_TONE[p])}>
        {PIcon && <PIcon className="size-3 flex-none" strokeWidth={2.5} />}
        <span className="truncate">{p === 'none' ? '' : p === 'queue' ? c.legendPatrol[2] : by != null ? tr(PATROL[by]) : ''}</span>
      </span>
    </span>
  );
}

/** what each cell means: the self cells as they are drawn, then the patrol lines */
function Legend() {
  const c = useT().monitor;
  return (
    <div className="flex flex-none flex-wrap items-center gap-x-4 gap-y-1 border-t border-m-line px-5 py-2 text-m-caption font-medium text-m-fg2">
      <b className="font-semibold text-m-fg">{c.self}</b>
      {SELF_ORDER.map((s, i) => {
        const Icon = SELF_ICON[s];
        return <span key={s} className="flex items-center gap-1.5"><i className={cn('grid size-4 place-items-center rounded border', SELF_TILE[s])}>{Icon && <Icon className={cn('size-2.5', s === 'run' && FILLED)} strokeWidth={3} />}</i>{c.legendSelf[i]}</span>;
      })}
      <span className="flex items-center gap-1.5"><i className={cn('size-4 rounded border border-transparent', LATE_RING)} />{c.legendSelf[6]}</span>
      <b className="ml-3 font-semibold text-m-fg">{c.patrol}</b>
      {PATROL_ORDER.map((p, i) => {
        const Icon = PATROL_ICON[p]!;
        return <span key={p} className={cn('flex items-center gap-1', PATROL_TONE[p])}><Icon className="size-3" strokeWidth={2.5} />{c.legendPatrol[i]}</span>;
      })}
    </div>
  );
}
