import type { ReactNode } from 'react';
import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Annotated, Head, type Pin } from '../parts';

/** Each screen's labels, in % of the image, in the order of the copy's marks (the same in Korean and
 * English: the two captures share their layout). Areas get a box with the label on its edge, single
 * spots a label on a stem; near an edge a label runs inward. */
const PINS: Pin[][] = [
  // the near-limit warning, the six indicators, the X̄ chart, the R chart
  [
    { x: 95, y: 13, side: 'end' },
    { box: [2, 18.1, 96, 14.6] },
    { box: [2, 34.2, 96, 34.9] },
    { box: [2, 70.7, 96, 28.4] }
  ],
  // the distribution, the spec limits, the indices
  [{ x: 41, y: 42.5 }, { x: 72.3, y: 50 }, { x: 87, y: 21, side: 'end' }],
  // the status filter, downtime and cost, the action status
  [{ x: 15, y: 5.4, side: 'start' }, { x: 18.5, y: 47.5, side: 'start' }, { x: 94.5, y: 37.2, side: 'end' }],
  // the timeline, the action taken, the totals
  [{ x: 21.5, y: 34.2, side: 'start' }, { x: 61, y: 49 }, { x: 75, y: 61.9 }]
];

/** one step: its number, title and sentence beside (on a phone, above) its screen(s) */
function Step({ n, title, body, children }: { n: number; title: string; body: string; children: ReactNode }) {
  return (
    <li className="grid gap-5 lg:grid-cols-[minmax(0,.3fr)_minmax(0,1fr)] lg:gap-8">
      <div className="rv grid content-start gap-2 lg:sticky lg:top-28 lg:self-start">
        <span className="mono text-micro text-qf-ink">{String(n).padStart(2, '0')}</span>
        <h4 className="m-0 text-title leading-snug font-bold">{title}</h4>
        <p className="m-0 text-body-sm leading-copy text-fg-2">{body}</p>
      </div>
      <div className="min-w-0">{children}</div>
    </li>
  );
}

/** SPC: what the approved records add up to, in three steps each told beside its own screens from the app
 * (CES final, Korean and English): the filters, indicators and X̄-R charts; capability; and the equipment
 * issue history from the Machine Issues menu (the list, and one issue from report to close). The request
 * doc (p.11) keeps defect prediction and Ask AI off the homepage, so the SPC capture is cropped without
 * the forecast block and the AI button, and the copy has no prediction or AI wording, nor a claim that
 * new values show live until that is verified. */
export function Spc() {
  const m = useT().qf, s = m.spc;
  return (
    <Band id="qf-spc">
      <Head kicker={s.kicker} q={s.q} title={s.title} lead={s.lead} />
      <ol className="m-0 grid list-none gap-16 p-0 max-lg:gap-12">
        <Step n={1} {...s.steps[0]}>
          <Annotated className="rv" src="spc-charts.webp" alt={s.alts[0]} sizes="(max-width: 1023px) 100vw, 900px" pins={PINS[0]} labels={s.marks[0]} />
        </Step>
        <Step n={2} {...s.steps[1]}>
          <Annotated className="rv" src="spc-capability.webp" alt={s.alts[1]} sizes="(max-width: 1023px) 100vw, 900px" pins={PINS[1]} labels={s.marks[1]} />
        </Step>
        <Step n={3} {...s.steps[2]}>
          <div className="grid items-start gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)]">
            <Annotated className="rv" src="equip-issues.webp" alt={s.alts[2]} caption={s.captions[0]} sizes="(max-width: 767px) 100vw, 560px" pins={PINS[2]} labels={s.marks[2]} />
            <Annotated className="rv" src="equip-issue-detail.webp" alt={s.alts[3]} caption={s.captions[1]} sizes="(max-width: 767px) 100vw, 340px" pins={PINS[3]} labels={s.marks[3]} />
          </div>
        </Step>
      </ol>
      <p className="mono m-0 mt-10 text-micro text-mute">{s.note}</p>
    </Band>
  );
}
