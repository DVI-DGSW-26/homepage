// Quality · defects, phone: the day's four figures, the defect types (each a filter), today's defects
// a page at a time, and the latest action taken.
import { useState } from 'react';
import { useT } from '../../../i18n';
import { cn } from '../../../lib/cn';
import { ACTIONS, BY_KIND, DEFECTS, KINDS, LINES, STOPPED, TODAY, type DefectKind } from '../data';
import { useTr } from '../tr';
import { Glyph } from '../Glyph';
import { CARD, COUNT, PILL, Pager, STATE_TONE } from '../parts';

const PER_PAGE = 5;
const HEADING = 'm-0 flex items-center gap-2 text-m-lg font-semibold';

export function PhoneDefects() {
  const c = useT().monitor, tr = useTr();
  const [kind, setKind] = useState<DefectKind | null>(null);
  const [page, setPage] = useState(0), [aPage, setAPage] = useState(0);
  const list = kind ? DEFECTS.filter(d => d.kind === kind) : DEFECTS;
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const filter = (k: DefectKind | null) => { setKind(k); setPage(0); };
  /** label, figure, its colour, and the note under it */
  const figures = [[c.today, TODAY.run, '', ''], [c.done, TODAY.done, 'text-m-ok', `${TODAY.donePct}%`], [c.cases, TODAY.ng, 'text-m-ng', `${TODAY.ngRate}%`], [c.stopped, STOPPED, 'text-m-miss', '']] as const;
  const a = ACTIONS[aPage], al = LINES[a.line];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid flex-none grid-cols-4 gap-2">
        {figures.map(([label, v, tone, sub], i) => (
          <div key={label} className={cn(CARD, 'grid content-start gap-0.5 px-3 py-2.5', i === 2 && 'bg-m-ng/10 shadow-m-alert')}>
            <span className={cn('text-m-xs leading-tight text-m-fg2', i === 2 && 'font-semibold text-m-ng')}>{label}</span>
            <span className={cn('flex items-baseline gap-0.5', tone)}><b className="text-m-3xl leading-tight font-semibold tracking-heading tabular-nums">{v}</b><span className="text-m-sm font-semibold">{c.unit}</span></span>
            {sub && <span className="truncate text-m-2xs text-m-fg2">{sub}</span>}
          </div>
        ))}
      </div>
      <div className="grid flex-none grid-cols-3 gap-2">
        {KINDS.map(k => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => filter(kind === k ? null : k)}
            className={cn(CARD, 'cursor-pointer px-3 py-2.5 text-left transition-[background-color,opacity,scale] duration-200 active:scale-97', kind === k && 'bg-m-ng/12', kind && kind !== k && 'opacity-40')}>
            <span className="flex items-center gap-1.5 text-m-sm font-medium"><span className="grid size-5.5 place-items-center rounded-md bg-m-ng-fill text-white"><Glyph n={k} className="size-3" /></span>{c.kinds[k]}</span>
            <span className="mt-1 flex items-center gap-2">
              <b className="text-m-2xl leading-tight font-semibold text-m-ng tabular-nums">{BY_KIND[k]}</b>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-m-idle"><span className="block h-full rounded-full bg-m-ng" style={{ width: `${100 * BY_KIND[k] / DEFECTS.length}%` }} /></span>
            </span>
          </button>
        ))}
      </div>
      <section className={cn(CARD, 'flex min-h-0 flex-1 flex-col px-4 pt-3 pb-1')}>
        <div className="flex flex-none items-center gap-2">
          <h4 className={HEADING}>{c.defectList}<span className={COUNT}>{list.length}</span></h4>
          {kind && <button type="button" onClick={() => filter(null)} className={cn(PILL, 'cursor-pointer bg-m-ng/14 px-2 text-m-2xs text-m-ng')}>{c.kinds[kind]}<Glyph n="judge" className="size-2" /></button>}
          <span className="ml-auto"><Pager page={page} pages={pages} onPage={setPage} /></span>
        </div>
        <ol key={`${kind}-${page}`} className="m-in m-0 flex min-h-0 flex-1 list-none flex-col p-0">
          {list.slice(page * PER_PAGE, (page + 1) * PER_PAGE).map((d, i) => {
            const l = LINES[d.line];
            return (
              <li key={i} className="grid max-h-17 min-h-0 flex-1 grid-cols-[1fr_auto] content-center gap-x-3 gap-y-0.5 border-b border-m-line last:border-0">
                <b className="truncate text-m-base font-semibold">{tr(l.product)}</b>
                <span className="text-right text-m-sm tabular-nums">{d.at}</span>
                <span className="flex min-w-0 items-center gap-1.5 text-m-xs text-m-fg2">
                  <span className={cn(PILL, 'bg-m-ng/14 px-2 text-m-2xs text-m-ng')}><Glyph n={d.kind} className="size-2.5" />{c.kinds[d.kind]}</span>
                  <span className="truncate">{d.item ? tr(d.item) : c.visualNg}</span>
                </span>
                <span className="text-right text-m-xs tabular-nums">
                  {d.value ? <><b className="font-semibold text-m-ng">{d.value[0]}</b><span className="text-m-fg2"> / {d.value[1]}~{d.value[2]}</span></> : <span className="text-m-mute">{c.ago(d.ago)}</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </section>
      <section className={cn(CARD, 'flex-none px-4 py-3')}>
        <div className="flex items-center gap-2">
          <h4 className={HEADING}>{c.actions}<span className={COUNT}>{ACTIONS.length}</span></h4>
          <span className="ml-auto"><Pager page={aPage} pages={ACTIONS.length} onPage={setAPage} /></span>
        </div>
        <div key={aPage} className="m-in mt-1.5 grid gap-1">
          <span className="flex items-center gap-2">
            <b className={cn(PILL, a.kind === 'stop' ? 'bg-m-ng/14 text-m-ng' : 'bg-m-miss/14 text-m-miss')}>{c.actionKinds[a.kind]}</b>
            <b className="truncate text-m-base font-semibold">{tr(al.product)}</b>
            <span className="ml-auto flex-none text-m-2xs font-medium tracking-caption text-m-mute">{c.hoursAgo(a.hours)}</span>
          </span>
          <span className="truncate text-m-sm">{tr(a.why)}</span>
          <span className="text-m-xs"><span className="mr-2 text-m-fg2">{tr(al.operator)}</span><b className={cn('font-semibold', STATE_TONE[a.state])}>{c.states[a.state]}</b></span>
        </div>
      </section>
    </div>
  );
}
