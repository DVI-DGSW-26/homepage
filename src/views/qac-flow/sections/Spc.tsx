import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Head, Pending } from '../parts';

/** SPC: what the approved records add up to. The request doc (p.11) has the place and the copy go up first
 * and the screens (control chart, capability, equipment history) once they pass review on 12. 2.; no
 * defect prediction or AI wording, and no claim that new values show live until that is verified. */
export function Spc() {
  const s = useT().qf.spc;
  return (
    <Band id="qf-spc" mark="06">
      <Head kicker={s.kicker} q={s.q} title={s.title} lead={s.lead} />
      <ul data-batch className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
        {s.features.map((f, i) => (
          <li key={f.title} className="rv grid content-start gap-2 rounded-card border border-line bg-card/60 p-panel-pad">
            <span className="mono text-micro text-qf-ink">{String(i + 1).padStart(2, '0')}</span>
            <b className="text-title-xs font-semibold">{f.title}</b>
            <span className="text-body-sm leading-copy text-fg-2">{f.body}</span>
          </li>
        ))}
      </ul>
      <div className="rv mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="mono text-micro text-mute">{s.metricsLabel}</span>
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {s.metrics.map(x => <li key={x} className="rounded-full border border-qf-line px-3 py-1 text-caption font-semibold text-qf-ink">{x}</li>)}
        </ul>
      </div>
      <div className="mt-8 grid gap-4 empty:hidden md:grid-cols-3">
        {['관리도', '공정능력', '설비 이력'].map(x => <Pending key={x} label={`SPC 화면 자리 · ${x} (12. 2. 검수 후 캡처)`} className="aspect-video" />)}
      </div>
    </Band>
  );
}
