import { SitePage } from '../../../site/routes';
import { pageMetadata } from '../../../site/seo';

export const metadata = pageMetadata('/qac-flow', 'en');

export default function Page() {
  return <SitePage page="/qac-flow" lang="en" />;
}
