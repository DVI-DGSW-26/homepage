'use client';
// The adoption inquiry block at the end of the page (#contact): what to expect, the sales email and phone,
// the PDFs to take away (DOWNLOADS, once there are any), and the form beside them. The inquiry buttons
// higher up open the same form in a dialog (InquiryDialog).
import { Download, Mail, Phone } from 'lucide-react';
import { useLang, useT } from '../../i18n';
import { DOWNLOADS } from '../../lib/media';
import { SALES_EMAIL, TEL, TEL_HREF } from '../../lib/site';
import { Band } from '../ui';
import { InquiryForm } from './InquiryForm';

export function Contact() {
  const t = useT(), c = t.contact, lang = useLang();
  const files = DOWNLOADS.filter(d => !d.lang || d.lang === lang);
  const line = 'inline-flex items-center gap-2.5 text-body font-semibold text-fg transition-colors duration-300 hover:text-qf-ink';
  return (
    <Band id="contact">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="grid content-start">
          <h2 className="rv m-0 text-[clamp(1.9rem,3vw,2.6rem)] leading-tight font-bold tracking-tight">{c.title}</h2>
          <p className="rv m-0 mt-4 text-title leading-relaxed text-fg-2 text-pretty">{c.lead}</p>
          <ul className="rv m-0 mt-10 grid list-none gap-4 border-t border-line p-0 pt-8">
            <li><a href={`mailto:${SALES_EMAIL}`} className={line}><Mail aria-hidden="true" className="size-5 text-qf-ink" strokeWidth={1.8} />{SALES_EMAIL}</a></li>
            <li><a href={TEL_HREF} className={line}><Phone aria-hidden="true" className="size-5 text-qf-ink" strokeWidth={1.8} />{TEL}</a></li>
          </ul>
          {files.length > 0 && (
            <ul className="rv m-0 mt-8 flex list-none flex-wrap gap-3 p-0">
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
          )}
        </div>
        <InquiryForm source="page" className="rv rounded-card border border-line bg-card p-panel-pad" />
      </div>
    </Band>
  );
}
