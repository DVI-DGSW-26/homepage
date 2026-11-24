'use client';
// The thin notice above the header, on every page: CES 2027's dates and booth while the show is on. This
// site takes adoption inquiries only; on-site (booth) inquiries belong to the CES landing page, which the
// notice links to once CES_LANDING_URL is set. After the show closes (CES_END) the notice is gone.
import { useT } from '../../i18n';
import { BOOTH, CES_END, CES_LANDING_URL } from '../../lib/site';

export function CesBar() {
  const t = useT(), c = t.qf.ces;
  const link = 'font-semibold underline decoration-on-acc/40 underline-offset-3 transition-colors duration-300 hover:decoration-on-acc';
  if (Date.now() >= CES_END) return null;
  return (
    <div className="bg-qf text-on-acc">
      <p className="wrap m-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 py-2 text-center text-caption leading-snug">
        <b className="font-bold">{c.label}</b>
        <span>{c.when}</span>
        <span title={c.hall}>{c.where(BOOTH)}</span>
        {CES_LANDING_URL && <a href={CES_LANDING_URL} target="_blank" rel="noopener" className={link}>{c.more}</a>}
      </p>
    </div>
  );
}
