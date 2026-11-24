'use client';
// The thin notice above the header, on every page: CES 2027's dates and booth while the show is on. This
// site takes adoption inquiries only; on-site (booth) inquiries belong to the CES landing page, which the
// notice links to once CES_LANDING_URL is set. After the show closes (CES_END) the notice is gone.
// The × closes it for good on this browser: localStorage remembers, and the script in RootLayout hides it
// before the first paint on the next page (html[data-ces-bar="closed"], index.css), so it never flashes.

import { X } from 'lucide-react';
import { useT } from '../../i18n';
import { BOOTH, CES_END, CES_LANDING_URL } from '../../lib/site';

/** remember the bar as closed, and hide it now */
function close() {
  try { localStorage.setItem('dv-ces-bar', 'closed'); } catch { /* private mode: closed for this page only */ }
  document.documentElement.dataset.cesBar = 'closed';
}

export function CesBar() {
  const t = useT(), c = t.qf.ces;
  const link = 'font-semibold underline decoration-on-acc/40 underline-offset-3 transition-colors duration-300 hover:decoration-on-acc';
  if (Date.now() >= CES_END) return null;
  return (
    <div id="ces-bar" className="relative bg-qf text-on-acc">
      <p className="wrap m-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 py-2 max-sm:pr-8 text-center text-caption leading-snug">
        <b className="font-bold">{c.label}</b>
        <span>{c.when}</span>
        <span title={c.hall}>{c.where(BOOTH)}</span>
        {CES_LANDING_URL && <a href={CES_LANDING_URL} target="_blank" rel="noopener" className={link}>{c.more}</a>}
      </p>
      <button type="button" onClick={close} aria-label={c.close}
        className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full transition-colors duration-300 hover:bg-on-acc/10 max-sm:right-1.5">
        <X aria-hidden="true" className="size-4" strokeWidth={2} />
      </button>
    </div>
  );
}
