// Quality · defects: the day's figures, today's defects (filtered by type, a page at a time) and the
// actions taken on them.
import { useState } from 'react';
import { X } from 'lucide-react';
import { useT } from '../../../i18n';
import { useInterval } from '../../../lib/useInterval';
import { cn } from '../../../lib/cn';
import { ACTIONS, BY_KIND, DEFECTS, KINDS, LINES, STOPPED, TODAY, type DefectKind } from '../data';
import { useTr } from '../tr';
import { Tolerance } from '../Tolerance';
import { Badge, Card, KIND_ICON, Meter, Pager, STATE_TONE, Stats, SUB } from '../parts';

/** the defect list's page, on the monitor and on the taller iPad */
const PER_PAGE = { monitor: 8, tablet: 10 }, ACTIONS_PER_PAGE = 3;
/** the columns, on the monitor and on the narrower iPad: the list beside the side column, and a
 * defect's product, slot, kind, item, value, time */
const COLS = {
  monitor: { main: 'grid-cols-[1fr_440px]', row: 'grid-cols-[190px_64px_120px_100px_1fr_72px]' },
  tablet: { main: 'grid-cols-[1fr_360px]', row: 'grid-cols-[170px_56px_112px_84px_1fr_64px]' }
};
const ACTION_PAGES = Math.ceil(ACTIONS.length / ACTIONS_PER_PAGE);

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
  return (
    <div className="flex h-full flex-col gap-3">
      <Stats items={[
        { label: c.today, value: TODAY.run, unit: c.unit },
        { label: c.done, value: TODAY.done, unit: c.unit, tone: 'text-m-ok', sub: `${TODAY.donePct}%` },
        { label: c.cases, value: TODAY.ng, unit: c.unit, tone: 'text-m-ng', sub: c.risk(TODAY.ngRate), alert: true },
        { label: c.stopped, value: STOPPED, unit: c.unit, tone: 'text-m-miss', sub: c.stopSub }
      ]} />
      <div className={cn('grid min-h-0 flex-1 gap-3', cols.main)}>
        <Card title={c.defectList} count={list.length}
          actions={<>
            {kind && <button type="button" onClick={() => filter(null)} className="cursor-pointer transition-[scale] active:scale-95"><Badge tone="ng" icon={KIND_ICON[kind]}>{c.kinds[kind]}<X className="ml-0.5 size-3.5 opacity-70" /></Badge></button>}
            <Pager page={page} pages={pages} onPage={setPage} auto={auto} onAuto={() => setAuto(v => !v)} />
            <Badge className="ml-1 font-normal">{c.includes}</Badge>
          </>}>
          <ol key={`${kind}-${page}`} className="m-in m-0 flex min-h-0 flex-1 list-none flex-col border-t border-m-line p-0">
            {list.slice(page * perPage, (page + 1) * perPage).map((d, i) => {
              const l = LINES[d.line];
              return (
                <li key={i} className={cn('grid max-h-19.5 min-h-0 flex-1 items-center gap-2 border-b border-m-line last:border-0', cols.row)}>
                  <span className="min-w-0 leading-snug"><b className="block truncate text-m-body font-semibold">{tr(l.product)}</b><span className={SUB}>{c.line(l.no)}-1 · {tr(l.operator)}</span></span>
                  <Badge className="justify-self-start rounded-m-ctl font-medium">{stage(d.slot)}</Badge>
                  <Badge tone="ng" icon={KIND_ICON[d.kind]} className="justify-self-start">{c.kinds[d.kind]}</Badge>
                  <b className="text-m-label font-semibold">{d.item ? tr(d.item) : '–'}</b>
                  {d.value ? (
                    <span className="grid grid-cols-[auto_1fr] items-center gap-4">
                      <span className={cn(SUB, 'text-right leading-snug tabular-nums')}>{c.valueLabel} <b className="text-m-title font-semibold tracking-heading text-m-ng">{d.value[0]}</b><br />{c.specLabel} {d.value[1]} ~ {d.value[2]}</span>
                      <Tolerance className="h-2" lo={d.value[1]} hi={d.value[2]} value={d.value[0]} />
                    </span>
                  ) : <span className={SUB}>{d.kind === 'visual' ? c.visualNg : c.judgeNg}</span>}
                  <span className="text-right text-m-label leading-snug tabular-nums">{d.at}<small className="block text-m-caption font-medium text-m-mute">{c.ago(d.ago)}</small></span>
                </li>
              );
            })}
          </ol>
        </Card>
        <div className="flex min-h-0 flex-col gap-3">
          <Card title={c.types} className="flex-none">
            <div className="grid grid-cols-3 gap-3">
              {KINDS.map(k => {
                const Icon = KIND_ICON[k];
                return (
                  <button key={k} type="button" aria-pressed={kind === k} onClick={() => filter(kind === k ? null : k)}
                    className={cn('-m-2 grid cursor-pointer gap-2 rounded-m-ctl p-2 text-left transition-[background-color,opacity,scale] duration-200 hover:bg-m-ng/8 active:scale-97', kind === k && 'bg-m-ng/12 hover:bg-m-ng/12', kind && kind !== k && 'opacity-40')}>
                    <span className="flex items-center gap-2 text-m-label font-medium whitespace-nowrap"><span className="grid size-6.5 place-items-center rounded-m-ctl bg-m-ng/14 text-m-ng"><Icon className="size-4" /></span>{c.kinds[k]}</span>
                    <b className="text-m-figure leading-none font-semibold tracking-heading text-m-ng tabular-nums">{BY_KIND[k]}</b>
                    <Meter pct={100 * BY_KIND[k] / DEFECTS.length} tone="bg-m-ng" />
                  </button>
                );
              })}
            </div>
          </Card>
          <Card title={c.actions} count={ACTIONS.length} className="flex-1"
            actions={<Pager page={aPage} pages={ACTION_PAGES} onPage={setAPage} auto={aAuto} onAuto={() => setAAuto(v => !v)} />}>
            <ol key={aPage} className="m-in m-0 flex min-h-0 flex-1 list-none flex-col border-t border-m-line p-0">
              {ACTIONS.slice(aPage * ACTIONS_PER_PAGE, (aPage + 1) * ACTIONS_PER_PAGE).map((a, i) => {
                const l = LINES[a.line];
                return (
                  <li key={i} className="grid max-h-28 flex-1 content-center gap-1.5 border-b border-m-line py-2 last:border-0">
                    <span className="flex items-center gap-2.5">
                      <Badge tone={a.kind === 'stop' ? 'ng' : 'miss'}>{c.actionKinds[a.kind]}</Badge>
                      <b className="truncate text-m-body font-semibold">{tr(l.product)}</b><span className={cn(SUB, 'whitespace-nowrap')}>{c.line(l.no)}</span>
                      <span className="ml-auto text-m-caption font-medium whitespace-nowrap text-m-mute">{c.hoursAgo(a.hours)}</span>
                    </span>
                    <span className="text-m-body">{tr(a.why)}</span>
                    <span className="text-m-label"><span className="mr-2 text-m-fg2">{tr(l.operator)}</span><b className={cn('font-semibold', STATE_TONE[a.state])}>{c.states[a.state]}</b></span>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
