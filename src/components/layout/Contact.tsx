'use client';
// The closing block at the end of the page (#contact): a last line, large, on a dark plate with a soft mint
// light, and one button that opens the adoption inquiry form in its dialog (InquiryDialog), with the sales
// email and phone under it and the PDFs to take away (DOWNLOADS, once there are any).
import { Download, Mail, Phone } from 'lucide-react';
import { lines, useLang, useT } from '../../i18n';
import { openInquiry } from '../../lib/inquiry';
import { DOWNLOADS } from '../../lib/media';
import { SALES_EMAIL, TEL, TEL_HREF } from '../../lib/site';
import { Band } from '../ui';

export function Contact() {
  const t = useT(), c = t.contact, lang = useLang();
  const files = DOWNLOADS.filter(d => !d.lang || d.lang === lang);
  const line = 'inline-flex items-center gap-2 text-body-sm text-white/75 transition-colors duration-300 hover:text-white';
  return (
    <Band id="contact">
      <div className="rv relative isolate overflow-hidden rounded-[32px] bg-ink px-8 py-24 text-center text-white max-sm:rounded-[24px] max-sm:px-6 max-sm:py-16">
        <div aria-hidden="true" className="absolute inset-x-[10%] -bottom-40 -z-1 h-96 rounded-full bg-radial/srgb from-[#3ccb9a]/45 to-transparent to-70% blur-3xl" />
        <h2 className="m-0 text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1.2] font-bold tracking-tight text-balance">{lines(c.closing.title)}</h2>
        <p className="mx-auto m-0 mt-5 max-w-150 text-title leading-relaxed text-white/70 text-pretty max-sm:text-body-lg">{c.lead}</p>
        <a href="#contact" aria-haspopup="dialog" onClick={openInquiry('cta')}
          className="mt-10 inline-flex min-h-14 items-center justify-center rounded-full bg-qf px-9 text-title-xs font-bold text-on-acc transition-[filter,translate] duration-300 hover:-translate-y-0.5 hover:brightness-110 max-sm:w-full">{c.closing.cta}</a>
        <ul className="m-0 mt-10 flex list-none flex-wrap justify-center gap-x-8 gap-y-3 p-0">
          <li><a href={`mailto:${SALES_EMAIL}`} className={line}><Mail aria-hidden="true" className="size-4" strokeWidth={1.8} />{SALES_EMAIL}</a></li>
          <li><a href={TEL_HREF} className={line}><Phone aria-hidden="true" className="size-4" strokeWidth={1.8} />{TEL}</a></li>
        </ul>
        {files.length > 0 && (
          <ul className="m-0 mt-6 flex list-none flex-wrap justify-center gap-3 p-0">
            {files.map(d => (
              <li key={d.href}>
                <a href={d.href} download className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/25 px-4.5 py-2 text-body-sm font-semibold transition-colors duration-300 hover:border-white">
                  <Download className="size-4" strokeWidth={1.8} aria-hidden="true" />
                  {t.media.kinds[d.kind]}
                  <span className="font-normal text-white/60">{t.media.file(d.mb)}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Band>
  );
}
