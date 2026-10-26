import { useLang } from '../../i18n';

/** a name in both languages, as the sample data carries it */
export type Tr = readonly [ko: string, en: string];

/** Picks the half of a [ko, en] pair the page is read in; re-renders the caller on a switch. */
export function useTr() {
  const en = useLang() === 'en';
  return (p: Tr) => p[en ? 1 : 0];
}
