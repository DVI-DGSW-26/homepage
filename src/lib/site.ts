// Facts about the company and its sites that don't change with the language (the copy that does is in
// src/i18n/locales). The SEO head and sitemap (src/site/seo.ts) read ORIGIN too.
import type { Lang } from './paths';

/** this site, as search engines and link previews should name it (no trailing slash) */
export const ORIGIN = 'https://solution.dvi-ind.com';

/** where inquiries go; src/server/inquiry.ts sends to the same address unless INQUIRY_MAIL_TO says otherwise */
export const SALES_EMAIL = 'sales@dvi-ind.com';
export const TEL = '+82-53-710-1022';
export const TEL_HREF = 'tel:+82537101022';

/** the CES 2027 booth the contact block names */
export const BOOTH = '62401';
/** the show closes on Jan 9 in Las Vegas (PST): from then on the hero's CES banner offers the online demo instead */
export const CES_END = Date.parse('2027-01-10T00:00:00-08:00');
/** until the show closes the demo buttons say "CES 데모 신청" (read when a page renders) */
export const duringCes = () => Date.now() < CES_END;
/** the header keeps its CES 2027 item until the end of January (request doc p.10) */
export const CES_MENU_END = Date.parse('2027-02-01T00:00:00+09:00');

/** DVISION's other sites, in the language being read: the gateway (dvi-ind.com, "제조 / 솔루션") and the
 * manufacturing site, both of which keep the language in the path (/en, /en/home) */
export const SITES = {
  gateway: (lang: Lang) => (lang === 'en' ? 'https://dvi-ind.com/en' : 'https://dvi-ind.com'),
  manufacturing: (lang: Lang) => (lang === 'en' ? 'https://www.dvi-ind.com/en/home' : 'https://www.dvi-ind.com/home')
};
