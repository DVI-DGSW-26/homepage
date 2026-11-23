// The site's pages and their addresses in each language. Korean is at the root, English under /en:
//   QAC FLOW   /          /en
//   Data       /data      /en/data
//   Privacy    /privacy   /en/privacy
// Plain functions, so the server (metadata, sitemap, proxy) and the browser compute the same addresses.
// The old addresses (/qac-flow, ?lang=en from the CES QR code, /en/anything-else) are redirected in
// src/proxy.ts.

export const LANGS = ['ko', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const isLang = (v: unknown): v is Lang => LANGS.includes(v as Lang);

/** a page, by the name the dictionaries' meta and nav use */
export const PAGES = ['/qac-flow', '/data', '/privacy'] as const;
export type Page = (typeof PAGES)[number];

/** where a page lives in a language: pathOf('/qac-flow', 'en') → '/en', pathOf('/data', 'ko') → '/data' */
export function pathOf(page: Page, lang: Lang): string {
  const p = page === '/qac-flow' ? '' : page;
  return lang === 'en' ? `/en${p}` : p || '/';
}
