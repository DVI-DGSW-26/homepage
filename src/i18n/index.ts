// KOR / ENG. Components import from here:
//   useT()        the UI copy (locales/ko.ts, locales/en.ts)
//   pick(ko, en)  a Korean/English pair from a data record (src/data.ts)
//   rich()        dictionary copy with <tag>…</tag> markup
//   lines()       dictionary copy with \n where a line had better break
//   useLang() / setLang() to follow / switch the language
export { getLang, pick, setLang, useLang, useT, type Lang } from './store';
export type { Messages } from './locales/ko';
export { lines, rich } from './rich';
export { syncMeta } from './meta';
