// Quality · defects, phone: the day's four figures, the defect types (each a filter), today's defects
// a page at a time, and the latest action taken.
import { useState } from 'react';
import { X } from 'lucide-react';
import { useT } from '../../../i18n';
import { cn } from '../../../lib/cn';
import { ACTIONS, BY_KIND, DEFECTS, KINDS, LINES, STOPPED, TODAY, type DefectKind } from '../data';
import { useTr } from '../tr';
import { Badge, CARD, Card, KIND_ICON, Meter, Pager, STATE_TONE, Stats } from '../parts';

const PER_PAGE = 5;

export function PhoneDefects() {
  const c = useT().monitor, tr = useTr();
  const [kind, setKind] = useState<DefectKind | null>(null);
  const [page, setPage] = useState(0), [aPage, setAPage] = useState(0);
  const list = kind ? DEFECTS.filter(d => d.kind === kind) : DEFECTS;
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const filter = (k: DefectKind | null) => { setKind(k); setPage(0); };
  const a = ACTIONS[aPage], al = LINES[a.line];
  return (
    <div className="flex h-full flex-col gap-3">
      <Stats compact items={[
        { label: c.today, value: TODAY.run },
        { label: c.done, value: TODAY.done, tone: 'text-m-ok' },
        { label: c.cases, value: TODAY.ng, tone: 'text-m-ng', alert: true },
        { label: c.stopped, value: STOPPED, tone: 'text-m-miss' }
      ]} />
      <div className="grid flex-none grid-cols-3 gap-2">
        {KINDS.map(k => {
          const Icon = KIND_ICON[k];
          return (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => filter(kind === k ? null : k)}
              className={cn(CARD, 'grid cursor-pointer gap-1.5 px-3 py-2.5 text-left transition-[background-color,opacity,scale] duration-200 active:scale-97', kind === k && 'bg-m-ng/12', kind && kind !== k && 'opacity-40')}>
              <span className="flex items-center gap-1.5 text-m-label font-medium whitespace-nowrap"><span className="grid size-5.5 place-items-center rounded-md bg-m-ng/14 text-m-ng"><Icon className="size-3.5" /></span>{c.kinds[k]}</span>
              <span className="flex items-center gap-2">
                <b className="text-m-value leading-none font-semibold text-m-ng tabular-nums">{BY_KIND[k]}</b>
                <Meter pct={100 * BY_KIND[k] / DEFECTS.length} tone="bg-m-ng" className="flex-1" />
              </span>
            </button>
          );
        })}
      </div>
      <Card title={c.defectList} count={list.length} compact className="flex-1" bodyClassName="pb-1"
        actions={<>
          {kind && <button type="button" onClick={() => filter(null)} className="cursor-pointer"><Badge tone="ng" className="h-5 px-2 text-m-caption">{c.kinds[kind]}<X className="size-3" /></Badge></button>}
          <Pager page={page} pages={pages} onPage={setPage} />
        </>}>
        <ol key={`${kind}-${page}`} className="m-in m-0 flex min-h-0 flex-1 list-none flex-col p-0">
          {list.slice(page * PER_PAGE, (page + 1) * PER_PAGE).map((d, i) => {
            const l = LINES[d.line];
            return (
              <li key={i} className="grid max-h-17 min-h-0 flex-1 grid-cols-[1fr_auto] content-center gap-x-3 gap-y-1 border-b border-m-line last:border-0">
                <b className="truncate text-m-body font-semibold">{tr(l.product)}</b>
                <span className="text-right text-m-label tabular-nums">{d.at}</span>
                <span className="flex min-w-0 items-center gap-1.5 text-m-label text-m-fg2">
                  <Badge tone="ng" icon={KIND_ICON[d.kind]} className="h-5 px-2 text-m-caption">{c.kinds[d.kind]}</Badge>
                  <span className="truncate">{d.item ? tr(d.item) : c.visualNg}</span>
                </span>
                <span className="text-right text-m-label tabular-nums">
                  {d.value ? <><b className="font-semibold text-m-ng">{d.value[0]}</b><span className="text-m-fg2"> / {d.value[1]}~{d.value[2]}</span></> : <span className="text-m-mute">{c.ago(d.ago)}</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </Card>
      <Card title={c.actions} count={ACTIONS.length} compact className="flex-none" actions={<Pager page={aPage} pages={ACTIONS.length} onPage={setAPage} />}>
        <div key={aPage} className="m-in grid gap-1">
          <span className="flex items-center gap-2">
            <Badge tone={a.kind === 'stop' ? 'ng' : 'miss'}>{c.actionKinds[a.kind]}</Badge>
            <b className="truncate text-m-body font-semibold">{tr(al.product)}</b>
            <span className="ml-auto flex-none text-m-caption font-medium text-m-mute">{c.hoursAgo(a.hours)}</span>
          </span>
          <span className="truncate text-m-label">{tr(a.why)}</span>
          <span className="text-m-label"><span className="mr-2 text-m-fg2">{tr(al.operator)}</span><b className={cn('font-semibold', STATE_TONE[a.state])}>{c.states[a.state]}</b></span>
        </div>
      </Card>
    </div>
  );
}
