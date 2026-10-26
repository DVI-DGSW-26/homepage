// Small pieces the monitor's screens share, drawn as a Mac app's: grouped cards, tinted capsules,
// toolbar-style buttons that answer on the press.
import { useState } from 'react';
import { useT } from '../../i18n';
import { pad2 } from '../../lib/env';
import { useInterval } from '../../lib/useInterval';
import { cn } from '../../lib/cn';
import { Glyph, type GlyphName } from './Glyph';
import type { Action, Patrol, Self } from './data';

/** a grouped card */
export const CARD = 'rounded-m-card bg-m-card shadow-m-card';
/** a count beside a heading */
export const COUNT = 'rounded-full bg-m-idle px-2 py-px text-m-2xs font-semibold text-m-fg2 tabular-nums';
/** a tinted capsule; colour it with text-m-… and bg-m-…/14 */
export const PILL = 'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-m-xs font-semibold whitespace-nowrap';
/** a toolbar-style icon button: it answers on the press, as a Mac control does */
export const TOOL = 'grid cursor-pointer place-items-center rounded-md text-m-fg2 transition-[background-color,color,scale] duration-150 hover:bg-m-idle hover:text-m-fg active:scale-94';
/** a toolbar button switched on: the brand tint */
export const TOOL_ON = 'bg-m-brand/14 text-m-brand hover:bg-m-brand/20 hover:text-m-brand';

/** the colour of each status-board figure: completed, in progress, skipped, remaining */
export const KPI_TONE = ['text-m-ok', 'text-m-brand', 'text-m-fg2', ''];
/** a self-inspection slot, by state: its cell and its glyph */
export const SELF_CELL: Record<Self, string> = {
  done: 'bg-m-done text-white', ok: 'bg-m-done/20 text-m-ok', run: 'bg-m-run text-white',
  miss: 'bg-m-miss-fill text-white', skip: 'bg-m-fg/12 text-m-fg2', idle: 'bg-m-idle text-m-fg2 font-medium'
};
export const SELF_GLYPH: Partial<Record<Self, GlyphName>> = { done: 'check', ok: 'check', run: 'play', miss: 'bang', skip: 'ban' };
/** a patrol slot, by state: its cell and its glyph */
export const PATROL_CELL: Record<Patrol, string> = {
  done: 'bg-m-done text-white', run: 'bg-m-run text-white', queue: 'bg-m-rov/14 text-m-rov',
  reject: 'text-m-ng ring-2 ring-inset ring-m-ng', none: 'bg-m-idle/60 text-m-mute'
};
export const PATROL_GLYPH: Partial<Record<Patrol, GlyphName>> = { done: 'check', run: 'play', reject: 'ban' };
/** where an action stands, as a colour */
export const STATE_TONE: Record<Action['state'], string> = { report: 'text-m-ng', wait: 'text-m-miss', ok: 'text-m-ok' };
/** a verdict capsule: OK, NG, or still to come */
export const VERDICT = { ok: 'bg-m-ok/14 text-m-ok', ng: 'bg-m-ng-fill text-white' } as const;

/** the moment the sample was taken (10:18:35), in seconds */
const TAKEN = 10 * 3600 + 18 * 60 + 35;

/** the wall clock, running on from the moment the sample was taken; it alone re-renders each second */
export function Clock() {
  const [s, setS] = useState(0);
  useInterval(true, () => setS(v => v + 1), 1000);
  const t = TAKEN + s;
  return <time className="text-m-2xl leading-none font-semibold tracking-heading tabular-nums">{pad2(Math.floor(t / 3600) % 24)}:{pad2(Math.floor(t / 60) % 60)}:{pad2(t % 60)}</time>;
}

/** ‹ page / pages ›, and the auto-advance switch when given `onAuto` */
export function Pager({ page, pages, onPage, auto, onAuto }: { page: number; pages: number; onPage: (p: number) => void; auto?: boolean; onAuto?: () => void }) {
  const c = useT().monitor;
  return (
    <span className="flex items-center gap-0.5 text-m-xs text-m-fg2">
      <button type="button" aria-label={c.prev} className={cn(TOOL, 'size-7')} onClick={() => onPage((page + pages - 1) % pages)}><Glyph n="prev" className="size-3.5" /></button>
      <span className="min-w-10 text-center tabular-nums">{page + 1} / {pages}</span>
      <button type="button" aria-label={c.next} className={cn(TOOL, 'size-7')} onClick={() => onPage((page + 1) % pages)}><Glyph n="next" className="size-3.5" /></button>
      {onAuto && (
        <button type="button" aria-pressed={auto} onClick={onAuto} className={cn(TOOL, 'ml-1 flex h-7 gap-1.5 px-2.5', auto && TOOL_ON)}>
          <Glyph n={auto ? 'pause' : 'play'} className="size-3" />{c.auto}
        </button>
      )}
    </span>
  );
}

/** a person's initial in a brand-tinted disc, with a green "on shift" dot */
export function Avatar({ name }: { name: string }) {
  return <span className="relative grid size-6 flex-none place-items-center rounded-full bg-m-brand/14 text-m-2xs font-semibold text-m-brand">{name[0]}<i className="absolute -right-px -bottom-px size-2 rounded-full bg-m-ok ring-2 ring-m-card" /></span>;
}

/** "self" / "patrol", the two kinds of inspection, as small tinted tags */
export function Kind({ patrol }: { patrol?: boolean }) {
  const c = useT().monitor;
  return <span className={cn('rounded-md px-1.5 text-m-2xs leading-5 font-semibold tracking-caption', patrol ? 'bg-m-rov/14 text-m-rov' : 'bg-m-idle text-m-fg2')}>{patrol ? c.patrol : c.self}</span>;
}
