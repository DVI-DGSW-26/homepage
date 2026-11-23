'use client';
// What every page puts around its sections: the header, the footer, the dialogs (demo request, zoomed
// capture, video), and the page-wide behaviour that only runs in the browser — in-page anchors gliding,
// the scroll reveals, a deep link landing on its section, the header waiting for the webfonts. Each page
// (src/site/routes.tsx) renders it with its language and page, which it hands down through context.
import { useEffect, useLayoutEffect, type ReactNode } from 'react';
import { LangContext, PageContext } from '../../i18n/store';
import type { Lang, Page } from '../../lib/paths';
import { landOnHash, restoreLangPosition, smoothAnchors } from '../../lib/scroll';
import { setupReveals } from '../../lib/reveals';
import { bootReady } from '../../lib/boot';
import { fullFaceOnInput } from '../../lib/fonts';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { InquiryDialog } from './InquiryDialog';
import { VideoDialog } from './VideoDialog';
import { ZoomDialog } from '../Zoom';

/** The site used to be one long page, so links into it are #anchors on "/" (the CES QR code opens
 * /?lang=en#qac-flow). Such an anchor for a section that now lives on another page goes there. */
const MOVED: Record<string, Page> = { future: '/data' };

export function Shell({ lang, page, children }: { lang: Lang; page: Page; children: ReactNode }) {
  return (
    <LangContext value={lang}>
      <PageContext value={page}>
        <Nav page={page} />
        <main id="top">{children}</main>
        <Footer />
        <InquiryDialog />
        <ZoomDialog />
        <VideoDialog />
        <Behaviour lang={lang} page={page} />
      </PageContext>
    </LangContext>
  );
}

function Behaviour({ lang, page }: { lang: Lang; page: Page }) {
  useEffect(smoothAnchors, []);
  useEffect(fullFaceOnInput, []);
  // what is marked booting: (the header) stays hidden until the fonts are in, so it never reflows in view
  useEffect(() => { bootReady().then(() => document.documentElement.toggleAttribute('data-ready', true)); }, []);
  // Runs once every section of the page has mounted (this comes after them), and again on each page switch.
  useLayoutEffect(() => {
    const moved = page === '/qac-flow' ? MOVED[decodeURIComponent(location.hash.slice(1))] : undefined;
    if (moved) { location.replace((lang === 'en' ? '/en' : '') + moved + location.hash); return; }
    restoreLangPosition(page);
    const teardown = setupReveals();
    landOnHash();
    return teardown;
  }, [lang, page]);
  return null;
}
