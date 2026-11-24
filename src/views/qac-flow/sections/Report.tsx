import { useT } from '../../../i18n';
import { Img } from '../../../components/Img';
import { Zoomable } from '../../../components/Zoom';
import { Band } from '../../../components/ui';
import { Head, useCapture } from '../parts';
import { Showcase } from '../Showcase';

/** the report's three A4 pages, captured from the app (CES final, Korean and English) */
const PAGES = ['report-1.webp', 'report-2.webp', 'report-3.webp'];

/** The inspection report: its three pages in one frame (Showcase), the page chosen on the left shown on
 * the right as a sheet of paper, then the report's details as a plain two-column table (when it is
 * issued, its format, what the QR code and the ESG line are for). */
export function Report() {
  const m = useT().qf, r = m.report, capture = useCapture();
  const rows = [...r.specs, { label: r.qr.title, body: r.qr.body }, { label: r.esg.title, body: r.esg.body }];
  return (
    <Band id="qf-report">
      <Head kicker={r.kicker} q={r.q} title={r.title} />
      <Showcase id="report" label={r.kicker} items={r.pages.map((p, i) => ({
        title: p.title, body: p.body, tag: `${r.pageLabel(i + 1)} · ${p.reader}`,
        view: (
          <figure className="m-0 mt-2 w-[54%] overflow-hidden rounded-[4px] bg-white shadow-device max-lg:mt-0 max-lg:w-full">
            <Zoomable src={capture(PAGES[i])} alt={m.alt.reports[i]}>
              <Img src={capture(PAGES[i])} alt={m.alt.reports[i]} sizes="(max-width: 1023px) 92vw, 480px" className="app-screen block h-auto w-full" />
            </Zoomable>
          </figure>
        )
      }))} />

      {/* the details, as a spec sheet: label on the left, what it means on the right */}
      <div className="rv mt-16 max-w-200">
        <h3 className="m-0 text-title-xs font-semibold">{r.specsTitle}</h3>
        <table className="mt-4 w-full border-collapse text-left">
          <thead className="sr-only"><tr><th scope="col">{r.specHead[0]}</th><th scope="col">{r.specHead[1]}</th></tr></thead>
          <tbody>
            {rows.map(x => (
              <tr key={x.label} className="border-t border-line last:border-b">
                <th scope="row" className="w-[34%] py-4 pr-6 align-top text-body-sm font-semibold max-sm:w-[38%]">{x.label}</th>
                <td className="py-4 align-top text-body-sm leading-copy text-fg-2">{x.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="m-0 mt-8 text-caption text-mute">{r.note}</p>
    </Band>
  );
}
