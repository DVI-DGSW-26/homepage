// Language state.
//
// UI copy lives in the dictionaries under ./locales (ko.ts is the source, en.ts mirrors its shape);
// components read it with useT(). Site content with Korean/English fields side by side in
// src/data.ts is chosen with pick(ko, en).
//
// Switching is instant: setLang() updates this store, <App> re-renders the whole tree, and both
// useT() and pick() answer in the new language. The URL never changes. The choice is remembered in
// localStorage, and a shared `?lang=en` link is still honoured on arrival (then dropped from the
// address on the next switch).
import { useSyncExternalStore } from 'react';
import { ko, type Messages } from './locales/ko';
import { en } from './locales/en';

const STORE = 'dv-lang';
const ALLOWED = ['ko', 'en'] as const;
export type Lang = (typeof ALLOWED)[number];
const isLang = (v: unknown): v is Lang => ALLOWED.includes(v as Lang);

const stored = () => { try { return localStorage.getItem(STORE); } catch { return null; } };
const fromUrl = () => { try { return new URL(location.href).searchParams.get('lang'); } catch { return null; } };
const remember = (l: Lang) => { try { localStorage.setItem(STORE, l); } catch { /* private mode: the choice just won't stick */ } };

const requested = fromUrl();
let lang: Lang = isLang(requested) ? requested : (stored() === 'en' ? 'en' : 'ko');
if (isLang(requested)) remember(requested);

const listeners = new Set<() => void>();
export const subscribe = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; };

export const getLang = () => lang;
export const isEn = () => lang === 'en';
/** The current language; re-renders the caller when it changes. */
export const useLang = () => useSyncExternalStore(subscribe, getLang);

const DICTS: Record<Lang, Messages> = { ko, en };
/** The UI copy for the current language. */
export const messages = (): Messages => DICTS[lang];
/** The UI copy for the current language; re-renders the caller when it changes. */
export const useT = (): Messages => DICTS[useLang()];

/** For data records: the English field when it exists, otherwise the Korean one. */
export function pick(ko: string, en?: string | null): string;
export function pick(ko: string | undefined, en?: string | null): string | undefined;
export function pick(ko: readonly string[], en?: readonly string[] | null): readonly string[];
export function pick(ko: string | readonly string[] | undefined, en?: string | readonly string[] | null) {
  return lang === 'en' && en != null && en !== '' ? en : ko;
}

export function setLang(next: Lang) {
  if (!isLang(next) || next === lang) return;
  lang = next;
  remember(next);
  // a ?lang= left in the address would contradict the page (and win on the next visit)
  try { const url = new URL(location.href); if (url.searchParams.has('lang')) { url.searchParams.delete('lang'); history.replaceState(history.state, '', url); } } catch { /* ignore */ }
  listeners.forEach(fn => fn());
}
