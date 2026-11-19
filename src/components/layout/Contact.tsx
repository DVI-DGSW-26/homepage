// The demo request block at the end of QAC FLOW and Data Industry (#contact): who to ask and the CES booth
// beside the form. The demo buttons higher up open the same form in a dialog (InquiryDialog).
import { useT } from '../../i18n';
import { BOOTH } from '../../lib/site';
import { Band, H2, Kicker, Lead } from '../ui';
import { InquiryForm } from './InquiryForm';

export function Contact() {
  const c = useT().contact;
  return (
    <Band id="contact" alt>
      <div className="grid gap-stack-sm lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-split-gap">
        <div>
          <Kicker className="rv">{c.kicker}</Kicker>
          <H2 className="rv mt-3.5">{c.title}</H2>
          <Lead className="rv mt-5">{c.lead}</Lead>
          <p className="rv m-0 mt-8 grid gap-1 border-l-2 border-qf pl-4">
            <b className="mono text-qf-ink">{c.booth(BOOTH)}</b>
            <span className="text-body-sm text-fg-2">{c.show}</span>
          </p>
        </div>
        <InquiryForm source="page" className="rv rounded-card border border-line bg-card p-panel-pad" />
      </div>
    </Band>
  );
}
