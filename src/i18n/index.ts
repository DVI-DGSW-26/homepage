// KOR / ENG for the components (client side). Components import from here:
//   useT()        the UI copy (locales/ko.ts, locales/en.ts)
//   rich()        dictionary copy with <tag>…</tag> markup
//   lines()       dictionary copy with \n where a line had better break
//   useLang()     the language of the address being read; usePage() the page
// Server code (metadata, sitemap) imports the dictionaries directly (src/site/seo.ts).
export { useLang, usePage, useT, type Lang } from './store';
export type { Messages } from './locales/ko';
export { lines, rich } from './rich';
