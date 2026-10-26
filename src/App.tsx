import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { ScrollTrigger, useGSAP } from './lib/gsap';
import { landOnHash, releasePosition, scroll, smoothAnchors } from './lib/scroll';
import { setupReveals } from './lib/reveals';
import { bootReady } from './lib/boot';
import { followLinks, usePage, type Page } from './lib/router';
import { useLang } from './i18n';
import { Nav } from './components/Nav';
import { Launch, QacFlow } from './components/QacFlow';
import { Future } from './components/Future';

/** the sections of each page; every page ends in the launch date */
const VIEWS: Record<Page, () => ReactNode> = {
  '/qac-flow': () => <QacFlow />,
  '/data': () => <Future />
};

export default function App() {
  // the whole tree re-renders on a language switch, so every t() answers in the new language
  const lang = useLang(), page = usePage();
  useEffect(smoothAnchors, []);
  useEffect(followLinks, []);
  // copy changes length with the language: keep the reader's place, then re-measure every trigger
  const shownLang = useRef(lang);
  useLayoutEffect(() => {
    if (shownLang.current === lang) return;
    shownLang.current = lang;
    releasePosition();
    ScrollTrigger.refresh();
  }, [lang]);

  // Runs after every section of the page has mounted (parents' effects follow their children's), and
  // again on each page switch, after the old page's triggers are gone with it.
  const arrived = useRef(false);
  useGSAP(() => {
    // a switch starts the new page at its top (or its #anchor, below); the first load keeps the browser's place
    if (arrived.current) scroll.scrollTo(0, { immediate: true });
    arrived.current = true;
    // the hero lifts the boot veil when its entrance starts; a page without it just waits for the fonts
    if (!document.getElementById('hero')) bootReady.then(() => document.documentElement.toggleAttribute('data-ready', true));
    setupReveals();
    // Triggers created before the process section set its pinned height measured a shorter page;
    // one refresh now puts them right. (ScrollTrigger refreshes again by itself on window load.)
    ScrollTrigger.refresh();
    landOnHash();
  }, { dependencies: [page], revertOnUpdate: true });

  const View = VIEWS[page];
  return (
    <>
      <Nav page={page} />
      <main id="top" key={page}>
        <View />
        <Launch />
      </main>
    </>
  );
}
