import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Annotated, Head, type Pin } from '../parts';

/** Where each screen's labels point, in % of the image, in the order of the copy's marks (the same in
 * Korean and English: the two captures share their layout); near an edge a label runs inward. */
const PINS: Pin[][] = [
  // filters, the near-limit warning, Cpk and Ppk, the out-of-control point
  [{ x: 12, y: 4.4, side: 'start' }, { x: 74, y: 12.2 }, { x: 9.5, y: 26.2, side: 'start' }, { x: 84.6, y: 49.4, side: 'end' }],
  // the distribution, the spec limits, the indices
  [{ x: 41, y: 42.5 }, { x: 72.3, y: 50 }, { x: 87, y: 21, side: 'end' }],
  // the status filter, downtime and cost, the action status
  [{ x: 15, y: 5.4, side: 'start' }, { x: 18.5, y: 47.5, side: 'start' }, { x: 94.5, y: 37.2, side: 'end' }],
  // the timeline, the action taken, the totals
  [{ x: 21.5, y: 34.2, side: 'start' }, { x: 61, y: 49 }, { x: 75, y: 61.9 }]
];

/** SPC: what the approved records add up to, with the SPC screen of the app (CES final, Korean and
 * English) cut in two (the filters, indicators and X̄-R charts; capability) and the equipment issue
 * history from the app's Machine Issues menu (the list, and one issue from report to close).
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
        <Annotated className="rv" src="spc-charts.webp" alt={s.alts[0]} caption={s.captions[0]} sizes="(max-width: 1440px) 100vw, 1280px" pins={PINS[0]} labels={s.marks[0]} />
        {/* capability and the equipment issue list stacked, beside one issue followed through to its close */}
        <div className="grid items-start gap-4 md:grid-cols-2">
          <div className="grid gap-4">
            <Annotated className="rv" src="spc-capability.webp" alt={s.alts[1]} caption={s.captions[1]} sizes="(max-width: 767px) 100vw, 640px" pins={PINS[1]} labels={s.marks[1]} />
            <Annotated className="rv" src="equip-issues.webp" alt={s.alts[2]} caption={s.captions[2]} sizes="(max-width: 767px) 100vw, 640px" pins={PINS[2]} labels={s.marks[2]} />
          </div>
          <Annotated className="rv" src="equip-issue-detail.webp" alt={s.alts[3]} caption={s.captions[3]} sizes="(max-width: 767px) 100vw, 640px" pins={PINS[3]} labels={s.marks[3]} />
        </div>
      </div>
      <p className="mono m-0 mt-6 text-micro text-mute">{s.note}</p>
    </Band>
  );
}
