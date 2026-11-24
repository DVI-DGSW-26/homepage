'use client';
// QAC FLOW's service homepage: what the web app is, not how to use it. Five parts: the first screen (the
// name, one sentence, the app itself), 서비스 소개 (why, what, who), 주요 기능 (five cards with real
// screens), 도입 효과 (three figures), 서비스 미리보기 (the main screens in one frame), and the adoption inquiry above the footer.
import { useT } from '../../i18n';
import { Intro } from './sections/Intro';
import { About } from './sections/About';
import { Features } from './sections/Features';
import { Results } from './sections/Results';
import { Preview } from './sections/Preview';

export function QacFlowPage() {
  const m = useT().qf;
  return (
    <div id="qac-flow" role="region" aria-label={m.label}>
      <Intro />
      <About />
      <Features />
      <Results />
      <Preview />
    </div>
  );
}
