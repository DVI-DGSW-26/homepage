// The three pages, each rendered on the server in the language of its address: the sections inside the
// shared shell (header, footer, dialogs), and the page's structured data. src/app/(ko) and src/app/(en)/en
// render these; their head is pageMetadata (./seo).
import type { ReactNode } from 'react';
import { Shell } from '../components/layout/Shell';
import { Contact } from '../components/layout/Contact';
import { QacFlowPage } from '../views/qac-flow/QacFlowPage';
import { DataPage } from '../views/data/DataPage';
import { PrivacyPage } from '../views/privacy/PrivacyPage';
import type { Lang, Page } from '../lib/paths';
import { JsonLd } from './RootLayout';
import { structuredData } from './seo';

/** the sections of each page: the two product pages end in the demo request form */
const VIEWS = {
  '/qac-flow': () => <><QacFlowPage /><Contact /></>,
  '/data': () => <><DataPage /><Contact /></>,
  '/privacy': () => <PrivacyPage />
} satisfies Record<Page, () => ReactNode>;

export function SitePage({ page, lang }: { page: Page; lang: Lang }) {
  const View = VIEWS[page];
  return (
    <Shell lang={lang} page={page}>
      <View />
      <JsonLd data={structuredData(page, lang)} />
    </Shell>
  );
}
