// <html lang>, <title>, the meta description and the canonical link follow the language and the page
// (copy in locales/*.ts → meta). The head each page is served with (scripts/seo.ts) says the same, for
// crawlers and link previews that don't run scripts.
import { currentPage } from '../lib/router';
import { ORIGIN } from '../lib/site';
import { lang, messages } from './store';

const apply = () => {
  const page = currentPage.get(), l = lang.get();
  const { title, description } = messages().meta[page];
  document.documentElement.lang = l;
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  const path = page === '/qac-flow' ? '/' : page;
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', ORIGIN + path + (l === 'en' ? '?lang=en' : ''));
};

/** Applies the document metadata now and on every language or page switch. Call once at start-up. */
export function syncMeta() {
  apply();
  const offLang = lang.subscribe(apply), offPage = currentPage.subscribe(apply);
  return () => { offLang(); offPage(); };
}
