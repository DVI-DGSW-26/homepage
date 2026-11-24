'use client';
// The thin notice above the header, on every page: CES 2027's dates and booth until the show closes
// (CES_END), then a way to the online demo instead. Read when the page renders, so a page left open across
// the close changes on its next visit. It used to sit on the QAC FLOW first screen; up here it informs
// without turning the product's home page into an event page.
import type { MouseEvent } from 'react';
import { useT } from '../../i18n';
import { openInquiry } from '../../lib/inquiry';
import { BOOTH, CES_END } from '../../lib/site';

export function CesBar() {
  const t = useT(), c = t.qf.ces;
  // down to the form at the end of the page, or, on a page without one, the same form in its dialog
  const demo = (e: MouseEvent<HTMLAnchorElement>) => { if (!document.getElementById('contact')) openInquiry('header')(e); };
  const link = 'font-semibold underline decoration-on-acc/40 underline-offset-3 transition-colors duration-300 hover:decoration-on-acc';
  return (
    <div className="bg-qf text-on-acc">
      <p className="wrap m-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 py-2 text-center text-caption leading-snug">
        <b className="font-bold">{c.label}</b>
        {Date.now() >= CES_END
          ? <a href="#contact" onClick={demo} className={link}>{c.after}</a>
          : <>
            <span>{c.when}</span>
            <span title={c.hall}>{c.where(BOOTH)}</span>
            <span className="max-md:hidden">{c.try}</span>
            <a href="#contact" onClick={demo} className={link}>{t.qf.cta.demo}</a>
          </>}
      </p>
    </div>
  );
}
