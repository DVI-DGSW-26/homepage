// The pieces every screen of the monitor is built from, so each screen reads as the same app: one
// card (title, count, actions on the right), one strip of figures, one badge in a handful of tones,
// one control height, and the icons (lucide) that stand for each state.
//
// Type comes in six sizes (text-m-caption … text-m-figure, src/styles/tokens.css), each with one job:
//   caption  timestamps, tolerance limits, counts      label  secondary lines, column heads, badges
//   body     names in a list                           title  card and window titles
//   value    a value in a row, the clock               figure KPI figures, the inspection's name
import { useState, type ReactNode } from 'react';
import {
  Ban, Check, CheckCheck, ChevronLeft, ChevronRight, CircleAlert, Clock as ClockIcon, Pause, PenLine, Play, Ruler,
  ScanEye, SquareCheckBig, type LucideIcon
} from 'lucide-react';
import { useT } from '../../i18n';
import { pad2 } from '../../lib/env';
import { useInterval } from '../../lib/useInterval';
import { cn } from '../../lib/cn';
import type { Action, DefectKind, Patrol, Self } from './data';

/** a grouped card's surface */
export const CARD = 'rounded-m-card bg-m-card shadow-m-card';
/** a toolbar-style button: it answers on the press, as a Mac control does; all are h-8 */
export const TOOL = 'flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-m-ctl px-3 text-m-label font-medium text-m-fg2 transition-[background-color,color,scale] duration-150 hover:bg-m-idle hover:text-m-fg active:scale-94';
/** a toolbar button switched on: the brand tint */
export const TOOL_ON = 'bg-m-brand/14 text-m-brand hover:bg-m-brand/20 hover:text-m-brand';
/** a row's secondary line */
export const SUB = 'text-m-label text-m-fg2';
/** a column head */
export const HEAD = 'text-m-label font-medium text-m-fg2';

/** a filled glyph (play, pause) rather than a stroked one */
export const FILLED = 'fill-current';

/** each state's icon: a self slot, a patrol slot, a defect kind */
export const SELF_ICON: Partial<Record<Self, LucideIcon>> = { done: Check, ok: CheckCheck, run: Play, miss: CircleAlert, skip: Ban };
export const PATROL_ICON: Partial<Record<Patrol, LucideIcon>> = { done: Check, run: PenLine, queue: ClockIcon, reject: Ban };
export const KIND_ICON: Record<DefectKind, LucideIcon> = { spec: Ruler, visual: ScanEye, judge: SquareCheckBig };

/** A self slot as a cell. Normal states stay quiet (a tint); what needs a hand is solid: the slot
 * in progress, and one left incomplete. Not started is an empty outline; past its time, a ring. */
export const SELF_TILE: Record<Self, string> = {
  done: 'border-transparent bg-m-ok/12 text-m-ok', ok: 'border-transparent bg-m-ok/12 text-m-ok',
  run: 'border-transparent bg-m-run text-white', miss: 'border-transparent bg-m-miss-fill text-white',
  skip: 'border-transparent bg-m-fg/8 text-m-fg2', idle: 'border-dashed border-m-line text-m-mute'
};
export const LATE_RING = 'ring-2 ring-inset ring-m-late';
/** a patrol slot as a line of text under its self slot */
export const PATROL_TONE: Record<Patrol, string> = { done: 'text-m-fg2', run: 'text-m-brand', queue: 'text-m-rov', reject: 'font-semibold text-m-ng', none: 'text-m-mute' };

const TONE = {
  neutral: 'bg-m-idle text-m-fg2', brand: 'bg-m-brand/14 text-m-brand', ok: 'bg-m-ok/14 text-m-ok', ng: 'bg-m-ng/14 text-m-ng',
  miss: 'bg-m-miss/14 text-m-miss', info: 'bg-m-rov/14 text-m-rov',
  // solid, for what has to be seen across the floor
  run: 'bg-m-run text-white', alert: 'bg-m-ng-fill text-white', warn: 'bg-m-warn text-m-on-warn'
};
export type Tone = keyof typeof TONE;
/** where an action stands, as a colour */
export const STATE_TONE: Record<Action['state'], string> = { report: 'text-m-ng', wait: 'text-m-miss', ok: 'text-m-ok' };
/** a verdict's badge tone */
export const VERDICT: Record<'ok' | 'ng', Tone> = { ok: 'ok', ng: 'alert' };

/** a capsule: a state, a verdict, a time; `icon` before the text */
export function Badge({ tone = 'neutral', icon: Icon, className, children }: { tone?: Tone; icon?: LucideIcon; className?: string; children: ReactNode }) {
  return (
    <span className={cn('inline-flex h-6 flex-none items-center gap-1 rounded-full px-2.5 text-m-label font-semibold whitespace-nowrap tabular-nums', TONE[tone], className)}>
      {Icon && <Icon className={cn('size-3.5 flex-none', Icon === Play && FILLED)} strokeWidth={2.25} />}{children}
    </span>
  );
}

/** a count beside a title */
export function Count({ n }: { n: number }) {
  return <span className="rounded-full bg-m-idle px-2 text-m-caption leading-5 font-semibold text-m-fg2 tabular-nums">{n}</span>;
}

/** The card every block sits in: a title with its count, actions on the right, then the body.
 * `flush` leaves the body's sides to the content (a list whose rows carry their own padding);
 * `compact` is the phone's tighter card. */
export function Card({ title, count, actions, flush, compact, className, bodyClassName, children }: {
  title?: ReactNode; count?: number; actions?: ReactNode; flush?: boolean; compact?: boolean; className?: string; bodyClassName?: string; children: ReactNode;
}) {
  const x = compact ? 'px-4' : 'px-5';
  return (
    <section className={cn(CARD, 'flex min-h-0 flex-col', className)}>
      {title && (
        <header className={cn('flex h-12 flex-none items-center gap-2', x, compact && 'h-11')}>
          <h3 className="m-0 flex items-center gap-2 text-m-title font-semibold tracking-heading-sm whitespace-nowrap">{title}{count != null && <Count n={count} />}</h3>
          {actions && <div className="ml-auto flex min-w-0 items-center gap-1">{actions}</div>}
        </header>
      )}
      <div className={cn('flex min-h-0 flex-1 flex-col', !flush && x, !flush && (compact ? 'pb-3' : 'pb-4'), !title && !flush && (compact ? 'pt-3' : 'pt-4'), bodyClassName)}>{children}</div>
    </section>
  );
}

export type Stat = { label: ReactNode; value: ReactNode; unit?: string; sub?: ReactNode; tone?: string; alert?: boolean };

/** The day's figures as one strip, a cell each: label, figure (with its unit), and a note beside it.
 * `alert` tints a cell red; `compact` is the phone's: smaller figures, centred, no notes. */
export function Stats({ items, compact, className }: { items: readonly Stat[]; compact?: boolean; className?: string }) {
  return (
    <div className={cn(CARD, 'grid flex-none grid-flow-col auto-cols-fr overflow-hidden', className)}>
      {items.map(({ label, value, unit, sub, tone, alert }, i) => (
        <div key={i} className={cn('relative grid content-start', compact ? 'justify-items-center gap-1 px-1 py-2.5' : 'gap-1.5 px-5 py-3',
          i > 0 && 'before:absolute before:inset-y-3 before:left-0 before:w-px before:bg-m-line', alert && 'bg-m-ng/10 before:hidden')}>
          <span className={cn('flex items-center gap-2 font-medium text-m-fg2', compact ? 'text-center text-m-caption leading-tight' : 'text-m-label', alert && 'text-m-ng')}>{label}</span>
          <span className={cn('flex flex-wrap items-baseline gap-x-1.5', tone)}>
            <b className={cn('leading-none font-semibold tracking-heading tabular-nums', compact ? 'text-m-value' : 'text-m-figure')}>{value}</b>
            {unit && <span className="text-m-body font-semibold">{unit}</span>}
            {sub && !compact && <span className="ml-1 text-m-label text-m-fg2">{sub}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}

/** a thin bar filled to `pct` */
export function Meter({ pct, tone = 'bg-m-brand', className }: { pct: number; tone?: string; className?: string }) {
  return (
    <span className={cn('block h-1.5 overflow-hidden rounded-full bg-m-idle', className)}>
      <span className={cn('block h-full rounded-full transition-[width] duration-500 ease-m-spring', tone)} style={{ width: `${pct}%` }} />
    </span>
  );
}

/** the moment the sample was taken (10:18:35), in seconds */
const TAKEN = 10 * 3600 + 18 * 60 + 35;

/** the wall clock, running on from the moment the sample was taken; it alone re-renders each second */
export function Clock() {
  const [s, setS] = useState(0);
  useInterval(true, () => setS(v => v + 1), 1000);
  const t = TAKEN + s;
  return <time className="text-m-value leading-none font-semibold tracking-heading tabular-nums">{pad2(Math.floor(t / 3600) % 24)}:{pad2(Math.floor(t / 60) % 60)}:{pad2(t % 60)}</time>;
}

/** ‹ page / pages ›, and the auto-advance switch when given `onAuto` */
export function Pager({ page, pages, onPage, auto, onAuto }: { page: number; pages: number; onPage: (p: number) => void; auto?: boolean; onAuto?: () => void }) {
  const c = useT().monitor;
  return (
    <span className="flex items-center text-m-label text-m-fg2">
      <button type="button" aria-label={c.prev} className={cn(TOOL, 'w-8 px-0')} onClick={() => onPage((page + pages - 1) % pages)}><ChevronLeft className="size-4" /></button>
      <span className="min-w-10 text-center tabular-nums">{page + 1} / {pages}</span>
      <button type="button" aria-label={c.next} className={cn(TOOL, 'w-8 px-0')} onClick={() => onPage((page + 1) % pages)}><ChevronRight className="size-4" /></button>
      {onAuto && (
        <button type="button" aria-pressed={auto} onClick={onAuto} className={cn(TOOL, 'ml-1', auto && TOOL_ON)}>
          {auto ? <Pause className={cn('size-3.5', FILLED)} /> : <Play className={cn('size-3.5', FILLED)} />}{c.auto}
        </button>
      )}
    </span>
  );
}

/** a person's initial in a brand-tinted disc, with a green "on shift" dot */
export function Avatar({ name }: { name: string }) {
  return <span className="relative grid size-6 flex-none place-items-center rounded-full bg-m-brand/14 text-m-caption font-semibold text-m-brand">{name[0]}<i className="absolute -right-px -bottom-px size-2 rounded-full bg-m-ok ring-2 ring-m-card" /></span>;
}

/** "self" / "patrol", the two kinds of inspection, as small tags */
export function Kind({ patrol }: { patrol?: boolean }) {
  const c = useT().monitor;
  return <span className={cn('rounded-md px-1.5 text-m-caption leading-5 font-semibold tracking-caption', patrol ? 'bg-m-rov/14 text-m-rov' : 'bg-m-idle text-m-fg2')}>{patrol ? c.patrol : c.self}</span>;
}
