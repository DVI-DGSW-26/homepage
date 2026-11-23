import { Leaf, QrCode } from 'lucide-react';
import { useT } from '../../../i18n';
import { Img } from '../../../components/Img';
import { Zoomable } from '../../../components/Zoom';
import { Band } from '../../../components/ui';
import { Head, useCapture } from '../parts';

/** the report's three A4 pages, captured from the app (CES final, Korean and English) */
const PAGES = ['report-1.webp', 'report-2.webp', 'report-3.webp'];

/** the inspection report: the three pages one approval issues, each for its own reader, then what the
 * QR code and the ESG line on it are for */
export function Report() {
  const m = useT().qf, r = m.report, capture = useCapture();
  const extras = [{ icon: QrCode, ...r.qr }, { icon: Leaf, ...r.esg }];
  return (
    <Band id="qf-report" mark="06">
      <Head kicker={r.kicker} q={r.q} title={r.title} lead={r.lead} />
      <ol data-batch className="m-0 grid list-none gap-x-6 gap-y-10 p-0 md:grid-cols-3">
        {r.pages.map((p, i) => (
          <li key={p.title} className="rv grid content-start gap-4">
            {/* a sheet of paper: the page opens full size on a click */}
            <figure className="m-0 overflow-hidden rounded-[6px] border border-line-2 bg-white shadow-device">
              <Zoomable src={capture(PAGES[i])} alt={m.alt.reports[i]}>
                <Img src={capture(PAGES[i])} alt={m.alt.reports[i]} sizes="(max-width: 767px) 92vw, 420px" className="app-screen block h-auto w-full" />
              </Zoomable>
            </figure>
            <div className="grid gap-1.5">
              <span className="mono text-micro text-qf-ink">{r.pageLabel(i + 1)} · {p.reader}</span>
              <h4 className="m-0 text-title-xs font-semibold">{p.title}</h4>
              <p className="m-0 text-body-sm leading-copy text-fg-2">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <ul data-batch className="m-0 mt-12 grid list-none gap-4 p-0 md:grid-cols-2">
        {extras.map(({ icon: Icon, title, body }) => (
          <li key={title} className="rv grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-1.5 rounded-card border border-qf-line bg-qf-soft/40 p-panel-pad">
            <span className="row-span-2 grid size-11 place-items-center rounded-full bg-qf text-on-acc"><Icon aria-hidden="true" className="size-5" /></span>
            <b className="text-title-xs font-semibold">{title}</b>
            <span className="text-body-sm leading-copy text-fg-2">{body}</span>
          </li>
        ))}
      </ul>
      <p className="mono m-0 mt-6 text-micro text-mute">{r.note}</p>
    </Band>
  );
}
