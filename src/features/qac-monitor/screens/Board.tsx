// Status board: every line's self- and patrol-inspection slots, with the day's totals above.
import { useT } from '../../../i18n';
import { cn } from '../../../lib/cn';
import { LATE, LINES, PATROL, QUEUED, SELF_COUNTS, SLOTS, type Line } from '../data';
import { useTr } from '../tr';
import { Glyph } from '../Glyph';
import { Avatar, CARD, KPI_TONE, Kind, PATROL_CELL, PATROL_GLYPH, PILL, SELF_CELL, SELF_GLYPH } from '../parts';

/** the legend's swatches, in the order of the copy's legendSelf / legendPatrol */
const LEGEND_SELF = ['bg-m-done', 'bg-m-run', 'bg-m-fg/12', 'bg-m-miss-fill', 'bg-m-done/20', 'bg-m-idle', 'ring-2 ring-inset ring-m-late'];
const LEGEND_PATROL = ['bg-m-done', 'bg-m-run', 'bg-m-rov/14', 'ring-2 ring-inset ring-m-ng'];
const SWATCH = 'size-2.5 rounded-sm shadow-m-swatch';
const LEGEND = 'flex items-center gap-1.5 text-m-2xs font-medium tracking-caption text-m-fg2';
const FIGURE = 'mt-1 block text-m-5xl leading-tight font-semibold tracking-heading tabular-nums';
const KPI_LABEL = 'flex items-center gap-2 text-m-sm text-m-fg2';

/** `onOpen` opens a line's inspection (its index into LINES) */
export function Board({ onOpen }: { onOpen: (line: number) => void }) {
  const c = useT().monitor;
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid flex-none grid-cols-6 gap-3">
        {SELF_COUNTS.map((v, i) => (
          <div key={i} className={cn(CARD, 'px-4 py-3')}>
            <span className={KPI_LABEL}><Kind />{c.kpi[i]}</span>
            <b className={cn(FIGURE, KPI_TONE[i])}>{v}</b>
          </div>
        ))}
        <div className={cn(CARD, 'px-4 py-3')}>
          <span className={KPI_LABEL}><Kind />{c.kpi[4]}</span>
          <span className="flex items-baseline gap-1.5 text-m-lg font-semibold text-m-miss"><b className={FIGURE}>{LATE}</b>{c.over[0]}<span className="ml-1 font-medium">{c.over[1]}</span></span>
        </div>
        <div className={cn(CARD, 'px-4 py-3')}>
          <span className={KPI_LABEL}><Kind patrol />{c.queue}</span>
          {/* the breakdown goes under the figure where the card is too narrow for it (the iPad, in English),
              and breaks between its parts if still too wide; each part's rule is clipped where it starts a line */}
          <span className="flex flex-wrap items-baseline gap-x-3">
            <b className={cn(FIGURE, 'text-m-rov')}>{QUEUED[0] + QUEUED[1] + QUEUED[2]}</b>
            <span className="overflow-hidden text-m-2xs font-medium tracking-caption text-m-fg2">
              <span className="-ml-4.25 flex flex-wrap">
                {c.queueSub.map((t, i) => <span key={t} className={cn('ml-2 border-l border-m-line pl-2 whitespace-nowrap', i === 2 && 'text-m-ng')}>{t} {QUEUED[i]}</span>)}
              </span>
            </span>
          </span>
        </div>
      </div>
      <section className={cn(CARD, 'flex min-h-0 flex-1 flex-col overflow-hidden px-5 pt-3.5')}>
        <div className="flex flex-none items-center gap-3">
          <h3 className="m-0 mr-auto text-m-xl font-semibold tracking-heading-sm">{c.progress}</h3>
          <Kind />
          {c.legendSelf.map((t, i) => <span key={t} className={LEGEND}><i className={cn(SWATCH, LEGEND_SELF[i])} />{t}</span>)}
          <span className="ml-2" /><Kind patrol />
          {c.legendPatrol.map((t, i) => <span key={t} className={LEGEND}><i className={cn(SWATCH, LEGEND_PATROL[i])} />{t}</span>)}
        </div>
        <div className="mt-2 grid min-h-0 flex-1 grid-cols-2 grid-rows-5 gap-x-6">
          {LINES.map((l, i) => <LineRow key={l.no} l={l} onOpen={() => onOpen(i)} />)}
        </div>
        <div className="-mx-5 flex flex-none items-center gap-4 border-t border-m-line bg-m-idle/50 px-5 py-2.5 text-m-sm">
          <span className="text-m-fg2">{c.dueToday}</span>
          <span className="flex items-center gap-2 rounded-full bg-m-card px-3 py-1 shadow-m-card">
            <i className="size-1.5 rounded-full bg-m-ok" /><b className="font-semibold">{c.dueName}</b><span className="text-m-fg2">{c.dueLine}</span>
            <span className="border-l border-m-line pl-2">{c.self} 5</span><span className="text-m-rov">{c.patrol} 5</span>
          </span>
        </div>
      </section>
    </div>
  );
}

/** one line on the status board: what it makes and who, then its self and patrol slots; opens its inspection */
function LineRow({ l, onOpen }: { l: Line; onOpen: () => void }) {
  const c = useT().monitor, tr = useTr();
  const done = l.self.filter(s => s[0] === 'done' || s[0] === 'ok').length;
  const patrol = l.patrol.filter(s => s[0] !== 'none');
  return (
    <button type="button" onClick={onOpen}
      className="group -mx-2 grid cursor-pointer grid-cols-[60px_1fr] content-center gap-x-2 gap-y-1 rounded-lg border-b border-m-line px-2 text-left transition-[background-color] duration-150 last:border-0 hover:bg-m-idle/70 active:bg-m-idle">
      <span className="col-span-2 mb-0.5 flex items-center gap-2.5 text-m-base">
        <b className="font-semibold">{c.line(l.no)}</b>
        <span className="text-m-fg2 transition-colors group-hover:text-m-brand">{tr(l.product)}</span>
        <Avatar name={tr(l.operator)} /><span className="text-m-fg2">{tr(l.operator)}</span>
        <span className="ml-auto" />
        {l.late ? <span className={cn(PILL, 'bg-m-warn text-m-on-warn')}><Glyph n="warn" className="size-3" />{c.late(l.late)}</span>
          : l.due && <span className={cn(PILL, 'bg-m-idle font-medium text-m-fg2')}>{c.due(...l.due)}</span>}
        <span className="text-m-xs text-m-fg2">{c.self} <b className="text-m-fg">{done}</b> / 5</span>
        <span className="text-m-xs text-m-rov">{c.patrol} {patrol.length ? <><b>{patrol.filter(s => s[0] === 'done').length}</b> / {patrol.length}</> : '–'}</span>
      </span>
      <span className="self-center text-m-xs text-m-fg2">{c.self}</span>
      <span className="grid grid-cols-5 gap-0.75">
        {l.self.map(([s, late, note], i) => {
          const glyph = SELF_GLYPH[s];
          return (
            <span key={i} className={cn('relative flex h-7 flex-col items-center justify-center rounded-md text-m-sm leading-none font-semibold tabular-nums', SELF_CELL[s], late && 'ring-2 ring-inset ring-m-late')}>
              <span className="flex items-center gap-1.5">{glyph && <Glyph n={glyph} className="size-3" />}{SLOTS[i]}</span>
              {note && <small className="mt-0.5 max-w-full truncate px-1 text-m-2xs font-normal tracking-caption">{tr(note)}</small>}
              {late && <i className="absolute top-0 right-0 size-2.5 rounded-tr-md bg-m-late [clip-path:polygon(0_0,100%_0,100%_100%)]" />}
            </span>
          );
        })}
      </span>
      <span className="self-center text-m-xs text-m-rov">{c.patrol}</span>
      <span className="grid grid-cols-5 gap-0.75">
        {SLOTS.map((_, i) => {
          const [s, by] = l.patrol[i] ?? ['none'], glyph = PATROL_GLYPH[s];
          return (
            <span key={i} className={cn('flex h-5.5 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-m-xs leading-none font-semibold tracking-caption', PATROL_CELL[s])}>
              {s === 'queue' ? <Glyph n="clock" className="size-3" /> : by != null ? <>{glyph && <Glyph n={glyph} className="size-2.5 flex-none" />}<span className="truncate">{tr(PATROL[by])}</span></> : '–'}
            </span>
          );
        })}
      </span>
    </button>
  );
}
