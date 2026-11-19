import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { ScrollTrigger, useGSAP } from './lib/gsap';
import { landOnHash, releasePosition, scroll, smoothAnchors } from './lib/scroll';
import { setupReveals } from './lib/reveals';
import { followLinks, usePage, type Page } from './lib/router';
import { useLang } from './i18n';
import { Nav } from './components/layout/Nav';
import { Contact } from './components/layout/Contact';
import { Footer } from './components/layout/Footer';
import { InquiryDialog } from './components/layout/InquiryDialog';
import { VideoDialog } from './components/layout/VideoDialog';
import { ZoomDialog } from './components/Zoom';
import { QacFlowPage } from './pages/qac-flow/QacFlowPage';
import { DataPage } from './pages/data/DataPage';
import { PrivacyPage } from './pages/privacy/PrivacyPage';

/** the sections of each page: the two product pages end in the demo request form; every page has the footer */
const VIEWS: Record<Page, () => ReactNode> = {
  '/qac-flow': () => <><QacFlowPage /><Contact /></>,
  '/data': () => <><DataPage /><Contact /></>,
  '/privacy': () => <PrivacyPage />
};

export default function App() {
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
      </main>
      <Footer />
      <InquiryDialog />
      <ZoomDialog />
      <VideoDialog />
    </>
  );
}
