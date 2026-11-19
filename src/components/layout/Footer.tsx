import { useLang, useT } from '../../i18n';
import { SALES_EMAIL, SITES } from '../../lib/site';

const LINK = 'text-fg-2 transition-colors duration-300 hover:text-fg';

/** the foot of every page: the company, where to write, DVISION's three sites, the privacy policy */
export function Footer() {
  const t = useT(), f = t.footer, lang = useLang();
  const sites = [
    { href: SITES.gateway(lang), label: f.links.gateway },
    { href: SITES.manufacturing(lang), label: f.links.manufacturing },
    { href: '/qac-flow', label: f.links.solution }
  ];
  return (
    <footer id="footer" className="relative isolate overflow-hidden border-t border-line bg-bg-2 py-block-gap">
      <div aria-hidden="true" className="absolute inset-0 -z-1 deco-dots mask-l-from-0%" />
      <div className="wrap grid gap-8">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <address className="grid gap-1.5 text-body-sm not-italic text-fg-2">
            <b className="text-body font-semibold text-fg">{f.company}</b>
            <span>{f.address}</span>
            <span>{f.email} <a href={`mailto:${SALES_EMAIL}`} className="text-qf-ink underline-offset-4 hover:underline">{SALES_EMAIL}</a></span>
          </address>
          <nav aria-label={f.sites}>
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-body-sm">
              {sites.map(s => <li key={s.label}><a href={s.href} className={LINK}>{s.label}</a></li>)}
            </ul>
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 text-caption text-mute">
          <span>{f.copyright}</span>
          <a href="/privacy" className="font-semibold text-fg-2 transition-colors duration-300 hover:text-fg">{f.privacy}</a>
        </div>
      </div>
    </footer>
  );
}
