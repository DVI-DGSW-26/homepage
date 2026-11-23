'use client';
// Language and page, as the address says them.
//
// UI copy lives in the dictionaries under ./locales (ko.ts is the source, en.ts mirrors its shape);
// components read it with useT(). The language is the address's (/ Korean, /en English): each page
// (src/app/…/page.tsx) hands its language and page to <Shell>, which provides them here, so the server
// renders every page fully in its language and the browser hydrates the same. Switching language is a
// link to the other language's address (KOR / ENG in the header).
import { createContext, useContext } from 'react';
import type { Lang, Page } from '../lib/paths';
import { ko, type Messages } from './locales/ko';
import { en } from './locales/en';

export type { Lang } from '../lib/paths';

const DICTS: Record<Lang, Messages> = { ko, en };

export const LangContext = createContext<Lang>('ko');
export const PageContext = createContext<Page>('/qac-flow');

/** The current language. */
export const useLang = () => useContext(LangContext);
/** The page being shown. */
export const usePage = () => useContext(PageContext);
/** The UI copy for the current language. */
export const useT = (): Messages => DICTS[useLang()];
