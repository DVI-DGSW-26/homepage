import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
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
  // copy changes length with the language: keep the reader's place
  const shownLang = useRef(lang);
  useLayoutEffect(() => {
    if (shownLang.current === lang) return;
    shownLang.current = lang;
    releasePosition();
  }, [lang]);

  // Runs after every section of the page has mounted (parents' effects follow their children's), and
  // again on each page switch, after the old page's reveals are torn down.
  const shown = useRef<Page | null>(null);
  useLayoutEffect(() => {
    // a switch starts the new page at its top (or its #anchor, below); the first load keeps the browser's place
    if (shown.current && shown.current !== page) scroll.scrollTo(0, { immediate: true });
    shown.current = page;
    const teardown = setupReveals();
    landOnHash();
    return teardown;
  }, [page]);

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
