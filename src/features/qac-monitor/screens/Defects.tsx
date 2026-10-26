// Quality · defects: the day's figures, today's defects (filtered by type, a page at a time) and the
// actions taken on them.
import { useState } from 'react';
import { useT } from '../../../i18n';
import { useInterval } from '../../../lib/useInterval';
import { cn } from '../../../lib/cn';
import { ACTIONS, BY_KIND, DEFECTS, KINDS, LINES, STOPPED, TODAY, type DefectKind } from '../data';
import { useTr } from '../tr';
import { Glyph } from '../Glyph';
import { Tolerance } from '../Tolerance';
import { CARD, COUNT, PILL, Pager, STATE_TONE } from '../parts';

/** the defect list's page, on the monitor and on the taller iPad */
const PER_PAGE = { monitor: 8, tablet: 10 }, ACTIONS_PER_PAGE = 3;
/** the columns, on the monitor and on the narrower iPad: the list beside the side column, and a
 * defect's product, slot, kind, item, value, time */
const COLS = {
  monitor: { main: 'grid-cols-[1fr_500px]', row: 'grid-cols-[250px_70px_130px_150px_1fr_80px]' },
  tablet: { main: 'grid-cols-[1fr_440px]', row: 'grid-cols-[190px_60px_120px_100px_1fr_72px]' }
};
const ACTION_PAGES = Math.ceil(ACTIONS.length / ACTIONS_PER_PAGE);
const CAPTION = 'text-m-xs font-medium tracking-caption text-m-fg2';
const HEADING = 'm-0 flex items-center gap-2 text-m-base font-semibold';

/** `form` is the screen it is drawn for */
export function Defects({ form }: { form: 'monitor' | 'tablet' }) {
  const c = useT().monitor, tr = useTr();
  const perPage = PER_PAGE[form], cols = COLS[form];
  const [kind, setKind] = useState<DefectKind | null>(null);
  const [page, setPage] = useState(0), [aPage, setAPage] = useState(0);
  const [auto, setAuto] = useState(false), [aAuto, setAAuto] = useState(false);
  const list = kind ? DEFECTS.filter(d => d.kind === kind) : DEFECTS;
  const pages = Math.max(1, Math.ceil(list.length / perPage));
  useInterval(auto, () => setPage(p => (p + 1) % pages), 6000);
  useInterval(aAuto, () => setAPage(p => (p + 1) % ACTION_PAGES), 6000);
  const filter = (k: DefectKind | null) => { setKind(k); setPage(0); };
  const stage = (s: string | number) => typeof s === 'number' ? c.stages[s] : s;
  /** label, figure, its colour, and the note beside it */
  const figures = [[c.today, TODAY.run, '', ''], [c.done, TODAY.done, 'text-m-ok', `${TODAY.donePct}%`], [c.cases, TODAY.ng, 'text-m-ng', c.risk(TODAY.ngRate)], [c.stopped, STOPPED, 'text-m-miss', c.stopSub]] as const;
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="grid flex-none grid-cols-[1fr_1fr_1.3fr_1fr] gap-3">
        {figures.map(([label, v, color, sub], i) => (
          <div key={label} className={cn(CARD, 'px-5 py-3.5', i === 2 && 'bg-m-ng/10 shadow-m-alert')}>
            <span className={cn('text-m-sm text-m-fg2', i === 2 && 'font-semibold text-m-ng')}>{label}</span>
            <span className={cn('flex items-baseline gap-1.5', color)}>
              <b className="text-m-6xl leading-tight font-semibold tracking-heading tabular-nums">{v}</b><span className="text-m-lg font-semibold">{c.unit}</span>
              <span className="ml-2 text-m-sm text-m-fg2">{sub}</span>
            </span>
          </div>
        ))}
      </div>
      <div className={cn('grid min-h-0 flex-1 gap-3', cols.main)}>
        <section className={cn(CARD, 'flex min-h-0 flex-col px-5 py-3')}>
          <div className="flex flex-none items-center gap-3 border-b border-m-line pb-2.5">
            <h3 className={HEADING}>{c.defectList}<span className={COUNT}>{list.length}</span></h3>
            {kind && <button type="button" onClick={() => filter(null)} className={cn(PILL, 'cursor-pointer bg-m-ng/14 text-m-ng transition-[scale] active:scale-95')}><Glyph n={kind} className="size-3" />{c.kinds[kind]}<Glyph n="judge" className="ml-0.5 size-2.5 opacity-70" /></button>}
            <Pager page={page} pages={pages} onPage={setPage} auto={auto} onAuto={() => setAuto(v => !v)} />
            <span className={cn(PILL, 'ml-auto bg-m-idle font-normal text-m-fg2')}>{c.includes}</span>
          </div>
          <ol key={`${kind}-${page}`} className="m-in m-0 flex min-h-0 flex-1 list-none flex-col p-0">
            {list.slice(page * perPage, (page + 1) * perPage).map((d, i) => {
              const l = LINES[d.line];
              return (
                <li key={i} className={cn('grid max-h-19.5 flex-1 items-center gap-2 border-b border-m-line last:border-0', cols.row)}>
                  <span><b className="block text-m-md font-semibold">{tr(l.product)}</b><span className={CAPTION}>{c.line(l.no)}-1 · {tr(l.operator)}</span></span>
                  <span className={cn(PILL, 'justify-self-start rounded-md bg-m-idle font-medium text-m-fg2 tabular-nums')}>{stage(d.slot)}</span>
                  <span className={cn(PILL, 'justify-self-start bg-m-ng/14 text-m-ng')}><Glyph n={d.kind} className="size-3" />{c.kinds[d.kind]}</span>
                  <b className="text-m-sm font-semibold">{d.item ? tr(d.item) : '–'}</b>
                  {d.value ? (
                    <span className="grid grid-cols-[auto_1fr] items-center gap-4">
                      <span className={cn(CAPTION, 'text-right tabular-nums')}>{c.valueLabel} <b className="text-m-xl font-semibold tracking-heading text-m-ng">{d.value[0]}</b><br />{c.specLabel} {d.value[1]} ~ {d.value[2]}</span>
                      <Tolerance className="h-2" lo={d.value[1]} hi={d.value[2]} value={d.value[0]} />
                    </span>
                  ) : <span className="text-m-sm text-m-fg2">{d.kind === 'visual' ? c.visualNg : c.judgeNg}</span>}
                  <span className="text-right text-m-sm tabular-nums">{d.at}<small className="block text-m-2xs font-medium tracking-caption text-m-mute">{c.ago(d.ago)}</small></span>
                </li>
              );
            })}
          </ol>
        </section>
        <div className="flex min-h-0 flex-col gap-3">
          <section className={cn(CARD, 'flex-none px-5 py-3.5')}>
            <h3 className="m-0 text-m-base font-semibold">{c.types}</h3>
            <div className="mt-2.5 grid grid-cols-3 gap-3">
              {KINDS.map(k => (
                <button key={k} type="button" aria-pressed={kind === k} onClick={() => filter(kind === k ? null : k)}
                  className={cn('-m-1.5 cursor-pointer rounded-lg p-1.5 text-left transition-[background-color,opacity,scale] duration-200 hover:bg-m-ng/8 active:scale-97', kind === k && 'bg-m-ng/12 hover:bg-m-ng/12', kind && kind !== k && 'opacity-40')}>
                  <span className="flex items-center gap-2 text-m-base font-medium whitespace-nowrap"><span className="grid size-6.5 place-items-center rounded-md bg-m-ng-fill text-white"><Glyph n={k} className="size-3.5" /></span>{c.kinds[k]}</span>
                  <b className="mt-1 block text-m-6xl leading-tight font-semibold tracking-heading text-m-ng tabular-nums">{BY_KIND[k]}</b>
                  <span className="block h-1.5 overflow-hidden rounded-full bg-m-idle"><span className="block h-full rounded-full bg-m-ng" style={{ width: `${100 * BY_KIND[k] / DEFECTS.length}%` }} /></span>
                </button>
              ))}
            </div>
          </section>
          <section className={cn(CARD, 'flex min-h-0 flex-1 flex-col px-5 py-3')}>
            <div className="flex flex-none items-center gap-2">
              <h3 className={HEADING}>{c.actions}<span className={COUNT}>{ACTIONS.length}</span></h3>
              <Pager page={aPage} pages={ACTION_PAGES} onPage={setAPage} auto={aAuto} onAuto={() => setAAuto(v => !v)} />
            </div>
            <ol key={aPage} className="m-in m-0 mt-1 flex min-h-0 flex-1 list-none flex-col p-0">
              {ACTIONS.slice(aPage * ACTIONS_PER_PAGE, (aPage + 1) * ACTIONS_PER_PAGE).map((a, i) => {
                const l = LINES[a.line];
                return (
                  <li key={i} className="grid content-center gap-1 border-b border-m-line py-2.5 last:border-0">
                    <span className="flex items-center gap-2.5">
                      <b className={cn(PILL, a.kind === 'stop' ? 'bg-m-ng/14 text-m-ng' : 'bg-m-miss/14 text-m-miss')}>{c.actionKinds[a.kind]}</b>
                      <b className="truncate text-m-xl font-semibold tracking-heading-sm">{tr(l.product)}</b><span className="text-m-sm whitespace-nowrap text-m-fg2">{c.line(l.no)}</span>
                      <span className="ml-auto text-m-xs font-medium tracking-caption whitespace-nowrap text-m-mute">{c.hoursAgo(a.hours)}</span>
                    </span>
                    <span className="text-m-md">{tr(a.why)}</span>
                    <span className="text-m-sm"><span className="mr-2 text-m-fg2">{tr(l.operator)}</span><b className={cn('font-semibold', STATE_TONE[a.state])}>{c.states[a.state]}</b></span>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
