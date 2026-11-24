import { useT } from '../../../i18n';
import { Band } from '../../../components/ui';
import { Annotated, Head, type Pin } from '../parts';
import { Showcase } from '../Showcase';

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

/** how wide each screen sits in the frame: the wide ones fill it, the tall detail is narrower */
const WIDTH = ['w-full', 'w-full', 'w-full', 'w-[62%] max-lg:w-full'];
const SRC = ['spc-charts.webp', 'spc-capability.webp', 'equip-issues.webp', 'equip-issue-detail.webp'];

/** SPC: what the approved records add up to, shown the way a product page shows a tool: four views in one
 * frame (Showcase), each with its screen from the app (CES final, Korean and English) and the labels set
 * on it: the indicators and X̄-R charts, capability, and the equipment issues and one issue's handling
 * from the Machine Issues menu. The request doc (p.11) keeps defect prediction and Ask AI off the homepage,
 * so the SPC capture is cropped without them, and the copy has no prediction or AI wording. */
export function Spc() {
  const m = useT().qf, s = m.spc;
  return (
    <Band id="qf-spc">
      <Head kicker={s.kicker} q={s.q} title={s.title} />
      <Showcase id="spc" label={s.kicker} items={s.views.map((v, i) => ({
        ...v,
        view: <Annotated className={WIDTH[i]} src={SRC[i]} alt={s.alts[i]} sizes="(max-width: 1023px) 100vw, 860px" pins={PINS[i]} labels={s.marks[i]} />
      }))} />
      <p className="m-0 mt-8 text-caption text-mute">{s.note}</p>
    </Band>
  );
}
