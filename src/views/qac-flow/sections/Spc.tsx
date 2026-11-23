import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Browser, Head } from '../parts';

/** SPC: what the approved records add up to, with the SPC screen of the app (CES final, Korean and
 * English) cut into three: the filters, indicators and X̄-R charts; capability; the trend by machine.
 * The request doc (p.11) keeps defect prediction and Ask AI off the homepage, so the capture is cropped
 * without the forecast block and the title row that holds the AI button, and the copy has no prediction
 * or AI wording, nor a claim that new values show live until that is verified. */
export function Spc() {
  const m = useT().qf, s = m.spc;
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
      <div className="mt-10 grid gap-4">
        <Browser className="rv" src="spc-charts.webp" alt={s.alts[0]} caption={s.captions[0]} sizes="(max-width: 1440px) 100vw, 1280px" />
        <div className="grid items-start gap-4 md:grid-cols-2">
          <Browser className="rv" src="spc-capability.webp" alt={s.alts[1]} caption={s.captions[1]} sizes="(max-width: 767px) 100vw, 640px" />
          <Browser className="rv" src="spc-trend.webp" alt={s.alts[2]} caption={s.captions[2]} sizes="(max-width: 767px) 100vw, 640px" />
        </div>
      </div>
      <p className="mono m-0 mt-6 text-micro text-mute">{s.note}</p>
    </Band>
  );
}
