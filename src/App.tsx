import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from './lib/gsap';
import { landOnHash, releasePosition, scroll, smoothAnchors } from './lib/scroll';
import { setupReveals } from './lib/reveals';
import { useLang } from './i18n';
import { Nav } from './components/Nav';
import { Hero, Marquee } from './components/Hero';
import { About } from './components/About';
import { Product, Statement } from './components/Product';
import { Config } from './components/Config';
import { Process } from './components/Process';
import { Equipment } from './components/Equipment';
import { Rnd } from './components/Rnd';
import { Global, History } from './components/Global';
import { QacFlow } from './components/QacFlow';
import { Events } from './components/Events';
import { Community, Contact } from './components/Contact';

export default function App() {
  // the whole tree re-renders on a language switch, so every t() answers in the new language
  const lang = useLang();
  useEffect(smoothAnchors, []);
  // copy changes length with the language: keep the reader's place, then re-measure every trigger
  const shownLang = useRef(lang);
  useLayoutEffect(() => {
    if (shownLang.current === lang) return;
    shownLang.current = lang;
    releasePosition();
    ScrollTrigger.refresh();
  }, [lang]);

  // Runs after every section has mounted (parents' effects follow their children's).
  useGSAP(() => {
    setupReveals();
    // Triggers created before the process section set its pinned height measured a shorter page;
    // one refresh now puts them right. (ScrollTrigger refreshes again by itself on window load.)
    ScrollTrigger.refresh();
    landOnHash();
    // debug handle (harmless in production)
    Object.assign(window, { __dv: { gsap, ScrollTrigger, scroll } });
  });

  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <Product />
        <Statement />
        <Config />
        <Process />
        <Equipment />
        <Rnd />
        <Global />
        <History />
        <QacFlow />
        <Events />
        <Community />
        <Contact />
      </main>
    </>
  );
}
