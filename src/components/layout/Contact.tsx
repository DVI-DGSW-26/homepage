// The demo request block at the end of QAC FLOW and Data Industry (#contact): who to ask, the CES booth
// and the PDFs to take away (DOWNLOADS, once there are any) beside the form. The demo buttons higher up
// open the same form in a dialog (InquiryDialog).
import { Download } from 'lucide-react';
import { lines, useLang, useT } from '../../i18n';
import { DOWNLOADS } from '../../lib/media';
import { BOOTH } from '../../lib/site';
import { Band, H2, Kicker, Lead } from '../ui';
import { InquiryForm } from './InquiryForm';

export function Contact() {
  const t = useT(), c = t.contact, lang = useLang();
  const files = DOWNLOADS.filter(d => !d.lang || d.lang === lang);
  return (
    <Band id="contact" alt>
      <div className="grid gap-stack-sm lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-split-gap">
        <div>
          <Kicker className="rv">{c.kicker}</Kicker>
          <H2 className="rv mt-3.5">{c.title}</H2>
          <Lead className="rv mt-5">{c.lead}</Lead>
          <p className="rv m-0 mt-8 grid gap-1 border-l-2 border-qf pl-4">
            <b className="mono text-qf-ink">{lines(c.booth(BOOTH))}</b>
            <span className="text-body-sm text-fg-2">{lines(c.show)}</span>
          </p>
          {files.length > 0 && (
            <div className="rv mt-8">
              <p className="mono m-0 text-fg-2">{t.media.downloads}</p>
              <ul className="m-0 mt-3 flex list-none flex-wrap gap-3 p-0">
                {files.map(d => (
                  <li key={d.href}>
                    <a href={d.href} download className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-line-2 px-4.5 py-2 text-body-sm font-semibold transition-colors duration-300 hover:border-qf hover:text-qf-ink">
                      <Download className="size-4" strokeWidth={1.8} aria-hidden="true" />
                      {t.media.kinds[d.kind]}
                      <span className="font-normal text-mute">{t.media.file(d.mb)}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <InquiryForm source="page" className="rv rounded-card border border-line bg-card p-panel-pad" />
      </div>
    </Band>
  );
}
